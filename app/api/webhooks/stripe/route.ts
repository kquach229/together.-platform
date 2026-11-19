// app/api/webhooks/stripe/route.ts

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";

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
    console.error("❌ Stripe signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Events we don't handle are acknowledged but NOT recorded.
  if (event.type !== "checkout.session.completed") {
    console.log(`ℹ️ Unhandled event: ${event.type}`);
    return NextResponse.json({ received: true });
  }

  try {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.mode !== "payment") {
      console.log("⏭ Skipping non-payment session");
      return NextResponse.json({ received: true });
    }

    console.log("💳 Processing checkout session:", session.id);

    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : (session.customer?.id ?? null);

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

    if (!paymentIntentId) {
      throw new Error(`Session ${session.id} has no payment_intent`);
    }

    const email = session.customer_details?.email ?? session.customer_email;

    // Resolve price and quantity from line items
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 10,
    });
    const item = lineItems.data?.[0];
    const priceId = item?.price?.id;

    // Every failure below THROWS so we return 500, Stripe retries, and the
    // event is never marked as processed.
    if (!priceId) {
      throw new Error(`Missing priceId for session ${session.id}`);
    }

    if (lineItems.data.length > 1) {
      console.warn(
        `⚠️ Session ${session.id} has ${lineItems.data.length} line items, only the first is credited`,
      );
    }

    const pack = await prisma.cardPackPrice.findUnique({
      where: { stripePriceId: priceId },
    });
    if (!pack) {
      throw new Error(
        `No CardPackPrice row for priceId ${priceId} (live vs test price ID mismatch?)`,
      );
    }

    const quantity = item.quantity ?? 1;
    const cardsToAdd = pack.cardsIncluded * quantity;
    const expectedSubtotal = pack.amountCents * quantity;

    // amount_subtotal excludes tax and discounts, so it should equal list
    // price x quantity. Log a mismatch but still credit: the customer paid.
    if (session.amount_subtotal !== expectedSubtotal) {
      console.warn(
        `⚠️ Price mismatch for ${session.id}: Stripe subtotal ${session.amount_subtotal}, DB expects ${expectedSubtotal}`,
      );
    }

    // User lookup, most reliable first:
    // 1. our own user id, passed as client_reference_id / metadata at checkout
    // 2. stripeCustomerId
    // 3. email (case-insensitive)
    const userRef = session.client_reference_id ?? session.metadata?.userId;

    let user = userRef
      ? await prisma.user.findUnique({ where: { id: userRef } })
      : null;

    if (!user && customerId) {
      user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId },
      });
    }

    if (!user && email) {
      user = await prisma.user.findFirst({
        where: { email: { equals: email, mode: "insensitive" } },
      });
    }

    if (!user) {
      throw new Error(
        `User not found for session ${session.id} (ref=${userRef}, customer=${customerId}, email=${email})`,
      );
    }

    const buyer = user;
    console.log("👤 User found:", buyer.id);

    // Idempotency record, purchase, and credit all commit together or not at
    // all. The event id is the primary key, so a duplicate delivery fails with
    // P2002 and is acknowledged below.
    await prisma.$transaction(async (tx) => {
      await tx.stripeEvent.create({
        data: { id: event.id, type: event.type },
      });

      await tx.cardPurchase.create({
        data: {
          userId: buyer.id,
          packSize: pack.packSize,
          cardsAdded: cardsToAdd,
          // What Stripe actually charged (includes tax / discounts)
          amountCents: session.amount_total ?? expectedSubtotal,
          stripePaymentIntentId: paymentIntentId,
          stripeSessionId: session.id,
        },
      });

      await tx.user.update({
        where: { id: buyer.id },
        data: {
          cardsRemaining: { increment: cardsToAdd },
          ...(customerId && !buyer.stripeCustomerId
            ? { stripeCustomerId: customerId }
            : {}),
        },
      });
    });

    console.log(`✅ Added ${cardsToAdd} cards to user ${buyer.id}`);
    return NextResponse.json({ received: true });
  } catch (err) {
    // Unique violation => this event (or payment) was already processed.
    if ((err as { code?: string })?.code === "P2002") {
      console.log(`🔁 Duplicate event ignored: ${event.id}`);
      return NextResponse.json({ received: true });
    }

    console.error("❌ Webhook crash:", err);
    // 500 so Stripe retries (it was 200 before, which told Stripe "all good").
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
