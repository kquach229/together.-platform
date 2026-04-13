// app/api/stripe/verify-checkout-session/route.ts
// Called by the /success page to confirm the webhook has processed
// the payment and cardsRemaining has been updated.
// This route never writes to the DB — that's the webhook's job.

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    // Retrieve the session from Stripe to confirm it was paid
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        {
          error: "Payment not completed",
          paymentStatus: session.payment_status,
        },
        { status: 402 },
      );
    }

    if (session.mode !== "payment") {
      return NextResponse.json(
        { error: "Not a one-time payment session" },
        { status: 400 },
      );
    }

    // Find the user — try customer ID first, fall back to email
    const customerId = session.customer as string | null;

    const user = await prisma.user.findUnique({
      where: {
        clerkId: clerkId!!,
      },
      select: {
        id: true,
        cardsRemaining: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check whether the webhook has already processed this session
    // by looking for the matching CardPurchase row
    const purchase = await prisma.cardPurchase.findUnique({
      where: { stripeSessionId: sessionId },
      select: {
        id: true,
        cardsAdded: true,
        packSize: true,
        amountCents: true,
      },
    });

    return NextResponse.json({
      processed: !!purchase, // true = webhook has run
      cardsRemaining: user.cardsRemaining,
      purchase: purchase ?? null, // null = webhook hasn't fired yet
    });
  } catch (err) {
    console.error("[POST /api/stripe/verify-checkout-session]", err);
    return NextResponse.json(
      { error: "Failed to verify checkout session" },
      { status: 500 },
    );
  }
}
