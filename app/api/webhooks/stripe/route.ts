// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil", // Use the version matching your installed stripe package
});

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "No stripe signature found" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook Error: ${(err as Error).message}` },
      { status: 400 },
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      if (!session.customer_email || !session.subscription) {
        break;
      }

      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription.id;

      const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);

      const statusMap: Record<Stripe.Subscription.Status, string> = {
        active: "active",
        incomplete: "incomplete",
        incomplete_expired: "incomplete",
        past_due: "past_due",
        canceled: "canceled",
        unpaid: "unpaid",
        paused: "paused",
        trialing: "trialing",
      };

      const user = await prisma.user.findUnique({
        where: { email: session.customer_email },
      });

      if (!user) break;

      const price = stripeSub.items.data[0]?.price;
      if (!price) break;

      // In Stripe SDK v14+, period info moved to the subscription item
      const periodStart =
        stripeSub.items.data[0]?.current_period_start ??
        stripeSub.billing_cycle_anchor;
      const periodEnd =
        stripeSub.items.data[0]?.current_period_end ??
        stripeSub.billing_cycle_anchor;

      await prisma.userSubscription.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          stripeSubscriptionId: stripeSub.id,
          stripePriceId: price.id,
          plan: price.nickname ?? "default",
          billingInterval: price.recurring?.interval ?? "month",
          status: statusMap[stripeSub.status],
          currentPeriodStart: new Date(periodStart * 1000),
          currentPeriodEnd: new Date(periodEnd * 1000),
          cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
          metadata: (stripeSub.metadata as Record<string, string>) ?? {},
        },
        update: {
          stripeSubscriptionId: stripeSub.id,
          stripePriceId: price.id,
          plan: price.nickname ?? "default",
          billingInterval: price.recurring?.interval ?? "month",
          status: statusMap[stripeSub.status],
          currentPeriodStart: new Date(periodStart * 1000),
          currentPeriodEnd: new Date(periodEnd * 1000),
          cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
          metadata: (stripeSub.metadata as Record<string, string>) ?? {},
        },
      });
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;

      if (invoice.subscription && typeof invoice.subscription === "string") {
        const sub = await prisma.userSubscription.findUnique({
          where: { stripeSubscriptionId: invoice.subscription },
        });

        if (sub) {
          await prisma.userSubscription.update({
            where: { id: sub.id },
            data: { status: "past_due" },
          });
        }
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
