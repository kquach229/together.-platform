// app/api/stripe/verify-checkout-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId)
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "customer"],
    });

    if (!session.subscription || !session.customer) {
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }

    const subscription = session.subscription as Stripe.Subscription;
    const customer = session.customer as Stripe.Customer;

    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customer.id },
    });

    const priceId = subscription.items.data[0]?.price.id;
    if (!priceId) {
      return NextResponse.json(
        { error: "No price found on subscription" },
        { status: 400 },
      );
    }

    const stripePrice = await stripe.prices.retrieve(priceId);
    const plan = stripePrice.metadata?.plan ?? "free";
    const billingInterval =
      stripePrice.recurring?.interval === "year" ? "annual" : "monthly";

    // In SDK v14+, period info moved to the subscription item
    const item = subscription.items.data[0];
    const periodStart =
      item?.current_period_start ?? subscription.billing_cycle_anchor;
    const periodEnd =
      item?.current_period_end ?? subscription.billing_cycle_anchor;

    const subscriptionData = {
      stripePriceId: priceId,
      plan,
      billingInterval,
      status: subscription.status,
      currentPeriodStart: new Date(periodStart * 1000),
      currentPeriodEnd: new Date(periodEnd * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      // Only include userId if user exists — avoids passing undefined to Prisma
      ...(user ? { userId: user.id } : {}),
    };

    const userSubscription = await prisma.userSubscription.upsert({
      where: { stripeSubscriptionId: subscription.id },
      update: subscriptionData,
      create: {
        ...subscriptionData,
        stripeSubscriptionId: subscription.id,
      },
    });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { plan },
      });
    }

    return NextResponse.json({ success: true, subscription: userSubscription });
  } catch (err) {
    console.error("Stripe checkout verification error:", err);
    return NextResponse.json(
      { error: "Failed to verify checkout session" },
      { status: 500 },
    );
  }
}
