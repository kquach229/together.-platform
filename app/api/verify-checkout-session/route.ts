// app/api/stripe/verify-checkout-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

enum Plan {
  free = "free",
  plus = "plus",
  team = "team",
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

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "customer"],
    });

    if (!session.subscription || !session.customer) {
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }

    const subscription = session.subscription as Stripe.Subscription;
    const customer = session.customer as Stripe.Customer;

    // Find the user by stripeCustomerId
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customer.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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

    const billingInterval: BillingInterval =
      stripePrice.recurring?.interval === "year"
        ? BillingInterval.annual
        : BillingInterval.monthly;

    // Map Stripe status to Prisma enum
    const planStatusMap: Record<string, SubscriptionStatus> = {
      active: SubscriptionStatus.active,
      past_due: SubscriptionStatus.past_due,
      canceled: SubscriptionStatus.canceled,
      trialing: SubscriptionStatus.trialing,
      incomplete: SubscriptionStatus.incomplete,
      unpaid: SubscriptionStatus.unpaid,
    };

    const prismaStatus: SubscriptionStatus =
      planStatusMap[subscription.status] ?? SubscriptionStatus.incomplete;

    // Stripe uses snake_case here
    const periodStart =
      subscription.start_date != null
        ? new Date(subscription.start_date * 1000)
        : null;

    const periodEnd =
      subscription.ended_at != null
        ? new Date(subscription.ended_at * 1000)
        : null;

    const subscriptionData = {
      stripePriceId: priceId,
      plan,
      billingInterval,
      status: prismaStatus,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: subscription.ended_at !== null,
    };

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { plan },
    });

    return NextResponse.json({
      success: true,
      subscription: updatedUser,
    });
  } catch (err) {
    console.error("Stripe checkout verification error:", err);

    return NextResponse.json(
      { error: "Failed to verify checkout session" },
      { status: 500 },
    );
  }
}
