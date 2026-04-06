// app/api/stripe/verify-checkout-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

enum Plan {
  free = "free",
  plus = "plus",
  plus_annual = "plus_annual",
  team = "team",
  team_annual = "team_annual",
}

enum BillingInterval {
  monthly = "monthly",
  annual = "annual",
}

enum SubscriptionStatus {
  active = "active",
  past_due = "past_due",
  canceled = "canceled",
  trialing = "trialing",
  incomplete = "incomplete",
  unpaid = "unpaid",
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId)
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "customer"],
    });

    if (!session.subscription || !session.customer) {
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }

    const subscription = session.subscription as Stripe.Subscription;
    const customer = session.customer as Stripe.Customer;

    // Find the user by stripeCustomerId if exists
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customer.id },
    });

    // Get the first subscription item's price
    const priceId = subscription.items.data[0]?.price.id;
    if (!priceId) {
      return NextResponse.json(
        { error: "No price found on subscription" },
        { status: 400 },
      );
    }

    const stripePrice = await stripe.prices.retrieve(priceId);
    const plan = (stripePrice.metadata?.plan ?? "free") as Plan;
    const billingInterval =
      stripePrice.recurring?.interval === "year" ? "annual" : "monthly";

    // Map Stripe status to Prisma enum
    const planStatusMap: Record<string, SubscriptionStatus> = {
      active: "active",
      past_due: "past_due",
      canceled: "canceled",
      trialing: "trialing",
      incomplete: "incomplete",
      unpaid: "unpaid",
    };
    const prismaStatus: SubscriptionStatus =
      planStatusMap[subscription.status] ?? "incomplete";

    // Determine period start/end
    const periodStart =
      subscription.current_period_start != null
        ? new Date(subscription.current_period_start * 1000)
        : null;
    const periodEnd =
      subscription.current_period_end != null
        ? new Date(subscription.current_period_end * 1000)
        : null;

    const subscriptionData = {
      stripePriceId: priceId,
      plan,
      billingInterval,
      status: prismaStatus,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    };

    // Upsert the subscription
    const userSubscription = await prisma.userSubscription.upsert({
      where: { stripeSubscriptionId: subscription.id },
      update: subscriptionData,
      create: {
        ...subscriptionData,
        stripeSubscriptionId: subscription.id,
        ...(user ? { userId: user.id } : {}),
      },
    });

    // Update user's plan if user exists
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
