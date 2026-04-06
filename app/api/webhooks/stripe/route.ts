// app/api/webhooks/stripe/route.ts
// Single source of truth for all subscription state changes.
// Never trust the client to report payment status — always use webhooks.

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";

// ─── Helpers ─────────────────────────────────────────────────

// Looks up the internal User by every available identifier, in priority order:
//   1. Stripe customer ID (most reliable after first payment)
//   2. clerkId from subscription metadata (set during checkout)
//   3. Email from the Stripe customer object (fallback)
async function findUser(
  customerId: string,
  metadata?: Stripe.Metadata | null,
  customerEmail?: string | null,
) {
  // 1. Stripe customer ID
  const byCustomerId = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });
  if (byCustomerId) return byCustomerId;

  // 2. clerkId stored in subscription metadata during checkout
  if (metadata?.clerkId) {
    const byClerkId = await prisma.user.findUnique({
      where: { clerkId: metadata.clerkId },
    });
    if (byClerkId) return byClerkId;
  }

  // 3. Email — least reliable but catches edge cases
  if (customerEmail) {
    const byEmail = await prisma.user.findFirst({
      where: { email: customerEmail },
    });
    if (byEmail) return byEmail;
  }

  return null;
}

// Resolves a Plan enum value from a Stripe price ID by querying
// our own Price table — never rely on Stripe metadata or nicknames.
async function resolvePlan(stripePriceId: string) {
  const price = await prisma.price.findUnique({
    where: { stripePriceId },
  });
  return price ?? null;
}

// Maps Stripe's subscription status string to our SubscriptionStatus enum.
function mapStatus(stripeStatus: Stripe.Subscription.Status) {
  const map: Record<Stripe.Subscription.Status, string> = {
    active: "active",
    trialing: "trialing",
    past_due: "past_due",
    canceled: "canceled",
    incomplete: "incomplete",
    incomplete_expired: "incomplete_expired",
    unpaid: "unpaid",
    paused: "paused",
  };
  return (map[stripeStatus] ?? "incomplete") as any;
}

// Returns true if the subscription should grant access.
function isActiveStatus(status: Stripe.Subscription.Status) {
  return status === "active" || status === "trialing";
}

// ─── Main handler ─────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature" },
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
    console.error("[Stripe webhook] Signature verification failed:", err);
    return NextResponse.json(
      { error: `Webhook signature error: ${(err as Error).message}` },
      { status: 400 },
    );
  }

  // ── Idempotency check ──────────────────────────────────────
  // The StripeEvent table prevents double-processing if Stripe
  // retries an event (which it will on any non-200 response).
  const alreadyProcessed = await prisma.stripeEvent.findUnique({
    where: { id: event.id },
  });
  if (alreadyProcessed) {
    console.log(
      `[Stripe webhook] Already processed event ${event.id}, skipping`,
    );
    return NextResponse.json({ received: true });
  }

  console.log(`[Stripe webhook] Processing: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      // ── First successful payment ───────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription" || !session.subscription) break;

        const customerId = session.customer as string;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id;

        // Fetch full subscription details
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = sub.items.data[0]?.price.id;
        if (!priceId) break;

        const price = await resolvePlan(priceId);
        if (!price) {
          console.error(`[Stripe webhook] No Price row found for ${priceId}`);
          break;
        }

        // Resolve user — try customer ID, then clerkId metadata, then email
        const customerEmail = session.customer_details?.email;
        const user = await findUser(customerId, sub.metadata, customerEmail);
        if (!user) {
          console.error(
            `[Stripe webhook] No user found for customer ${customerId}`,
          );
          break;
        }

        const periodStart =
          sub.items.data[0]?.current_period_start ?? sub.billing_cycle_anchor;
        const periodEnd =
          sub.items.data[0]?.current_period_end ?? sub.billing_cycle_anchor;

        await prisma.$transaction([
          // 1. Activate the plan and store the Stripe customer ID
          prisma.user.update({
            where: { id: user.id },
            data: {
              plan: price.plan,
              stripeCustomerId: customerId,
            },
          }),
          // 2. Upsert the subscription record
          prisma.userSubscription.upsert({
            where: { userId: user.id },
            create: {
              userId: user.id,
              stripeSubscriptionId: sub.id,
              stripePriceId: priceId,
              plan: price.plan,
              billingInterval: price.billingInterval,
              status: mapStatus(sub.status),
              currentPeriodStart: new Date(periodStart * 1000),
              currentPeriodEnd: new Date(periodEnd * 1000),
              cancelAtPeriodEnd: sub.cancel_at_period_end,
              metadata: sub.metadata ?? {},
            },
            update: {
              stripeSubscriptionId: sub.id,
              stripePriceId: priceId,
              plan: price.plan,
              billingInterval: price.billingInterval,
              status: mapStatus(sub.status),
              currentPeriodStart: new Date(periodStart * 1000),
              currentPeriodEnd: new Date(periodEnd * 1000),
              cancelAtPeriodEnd: sub.cancel_at_period_end,
              cancelledAt: null,
              metadata: sub.metadata ?? {},
            },
          }),
        ]);

        console.log(
          `[Stripe webhook] Activated ${price.plan} for user ${user.id}`,
        );
        break;
      }

      // ── Renewal, upgrade, downgrade, or status change ──────
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const priceId = sub.items.data[0]?.price.id;
        if (!priceId) break;

        const price = await resolvePlan(priceId);
        const user = await findUser(customerId, sub.metadata);
        if (!user) break;

        const periodStart =
          sub.items.data[0]?.current_period_start ?? sub.billing_cycle_anchor;
        const periodEnd =
          sub.items.data[0]?.current_period_end ?? sub.billing_cycle_anchor;

        // If the subscription is no longer active, downgrade to free
        const newUserPlan =
          isActiveStatus(sub.status) && price ? price.plan : "free";

        await prisma.$transaction([
          prisma.user.update({
            where: { id: user.id },
            data: { plan: newUserPlan },
          }),
          prisma.userSubscription.update({
            where: { userId: user.id },
            data: {
              stripePriceId: priceId,
              plan: price?.plan ?? "free",
              billingInterval: price?.billingInterval ?? "monthly",
              status: mapStatus(sub.status),
              currentPeriodStart: new Date(periodStart * 1000),
              currentPeriodEnd: new Date(periodEnd * 1000),
              cancelAtPeriodEnd: sub.cancel_at_period_end,
              cancelledAt: sub.canceled_at
                ? new Date(sub.canceled_at * 1000)
                : null,
              metadata: sub.metadata ?? {},
            },
          }),
        ]);

        console.log(
          `[Stripe webhook] Updated subscription for user ${user.id} → ${newUserPlan}`,
        );
        break;
      }

      // ── Subscription fully cancelled ───────────────────────
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;

        const user = await findUser(customerId, sub.metadata);
        if (!user) break;

        await prisma.$transaction([
          prisma.user.update({
            where: { id: user.id },
            data: { plan: "free" },
          }),
          prisma.userSubscription.update({
            where: { userId: user.id },
            data: {
              status: "canceled",
              cancelledAt: new Date(),
            },
          }),
        ]);

        console.log(
          `[Stripe webhook] Cancelled subscription for user ${user.id} → free`,
        );
        break;
      }

      // ── Payment failed ─────────────────────────────────────
      // Don't downgrade immediately — Stripe will retry.
      // Downgrade only happens via customer.subscription.deleted
      // if all retries fail.
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription?.id;
        if (!subId) break;

        const existing = await prisma.userSubscription.findUnique({
          where: { stripeSubscriptionId: subId },
        });
        if (!existing) break;

        await prisma.userSubscription.update({
          where: { id: existing.id },
          data: { status: "past_due" },
        });

        // TODO: trigger a "payment failed" email to the user
        console.log(
          `[Stripe webhook] Payment failed for subscription ${subId}`,
        );
        break;
      }

      default:
        // Safe to ignore unhandled events
        break;
    }

    // Mark event as processed — prevents double-processing on retry
    await prisma.stripeEvent.create({
      data: { id: event.id, type: event.type },
    });
  } catch (err) {
    console.error(`[Stripe webhook] Error processing ${event.type}:`, err);
    // Return 200 even on error — if you return 4xx/5xx Stripe retries,
    // which can cause double-processing. Log and investigate instead.
    return NextResponse.json(
      { error: "Handler error — logged for investigation" },
      { status: 200 },
    );
  }

  return NextResponse.json({ received: true });
}
