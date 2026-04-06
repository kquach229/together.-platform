// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature")!;

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
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      if (!session.customer_email || !session.subscription) break;

      const stripeSub = await stripe.subscriptions.retrieve(
        session.subscription.toString(),
      );

      // Map Stripe status and interval to your enums
      const statusMap: Record<string, string> = {
        active: "active",
        incomplete: "incomplete",
        past_due: "past_due",
        canceled: "canceled",
        unpaid: "unpaid",
      };

      const user = await prisma.user.findUnique({
        where: { email: session.customer_email },
      });
      if (!user) break;

      await prisma.userSubscription.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          stripeSubscriptionId: stripeSub.id,
          stripePriceId: stripeSub.items.data[0].price.id,
          plan: stripeSub.items.data[0].price.nickname as any, // or map to your Plan enum
          billingInterval: stripeSub.items.data[0].price.recurring!
            .interval as any,
          status: statusMap[stripeSub.status] as any,
          currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
          currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
          cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
          metadata: stripeSub.metadata,
        },
        update: {
          stripeSubscriptionId: stripeSub.id,
          stripePriceId: stripeSub.items.data[0].price.id,
          plan: stripeSub.items.data[0].price.nickname as any,
          billingInterval: stripeSub.items.data[0].price.recurring!
            .interval as any,
          status: statusMap[stripeSub.status] as any,
          currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
          currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
          cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
          metadata: stripeSub.metadata,
        },
      });

      break;

    case "invoice.payment_failed":
      const invoice = event.data.object as Stripe.Invoice;
      const sub = await prisma.userSubscription.findUnique({
        where: { stripeSubscriptionId: invoice.subscription as string },
      });
      if (sub) {
        await prisma.userSubscription.update({
          where: { id: sub.id },
          data: { status: "past_due" },
        });
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
