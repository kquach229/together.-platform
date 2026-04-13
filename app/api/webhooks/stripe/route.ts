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

  // Idempotency — ignore events already processed
  const exists = await prisma.stripeEvent.findUnique({
    where: { id: event.id },
  });
  if (exists) {
    console.log(`🔁 Duplicate event ignored: ${event.id}`);
    return NextResponse.json({ received: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode !== "payment") {
          console.log("⏭ Skipping non-payment session");
          break;
        }

        console.log("💳 Processing checkout session:", session.id);

        const customerId = session.customer as string | null;
        const paymentIntentId = session.payment_intent as string;
        const email = session.customer_details?.email;

        // Resolve the price ID from line items
        const lineItems = await stripe.checkout.sessions.listLineItems(
          session.id,
          { limit: 1 },
        );
        const priceId = lineItems.data?.[0]?.price?.id;

        if (!priceId) {
          console.error("❌ Missing priceId from line items");
          break;
        }

        const pack = await prisma.cardPackPrice.findUnique({
          where: { stripePriceId: priceId },
        });

        if (!pack) {
          console.error("❌ No pack found for priceId:", priceId);
          break;
        }

        // Try stripeCustomerId first (fast path for returning customers),
        // then fall back to email for first-time buyers.
        // findUnique requires separate queries since OR isn't supported.
        let user = customerId
          ? await prisma.user.findUnique({
              where: { stripeCustomerId: customerId },
            })
          : null;

        if (!user && email) {
          user = await prisma.user.findUnique({ where: { email } });
        }

        if (!user) {
          console.error("❌ User not found", { customerId, email });
          break;
        }

        console.log("👤 User found:", user.id);

        await prisma.$transaction(async (tx) => {
          // Record the purchase
          const purchase = await tx.cardPurchase.create({
            data: {
              userId: user.id,
              packSize: pack.packSize,
              cardsAdded: pack.cardsIncluded,
              amountCents: pack.amountCents,
              stripePaymentIntentId: paymentIntentId,
              stripeSessionId: session.id,
            },
          });

          // Increment balance and backfill stripeCustomerId if missing
          await tx.user.update({
            where: { id: user.id },
            data: {
              cardsRemaining: { increment: pack.cardsIncluded },
              ...(customerId && !user.stripeCustomerId
                ? { stripeCustomerId: customerId }
                : {}),
            },
          });
        });

        console.log(`✅ Added ${pack.cardsIncluded} cards to user ${user.id}`);
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event: ${event.type}`);
        break;
    }

    await prisma.stripeEvent.create({
      data: { id: event.id, type: event.type },
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook crash:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 200 });
  }
}
