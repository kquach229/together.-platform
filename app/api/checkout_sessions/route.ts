import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // 1. Must be signed in, so the purchase can be tied to a user id
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { priceId } = await request.json();
    if (!priceId || typeof priceId !== "string") {
      return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
    }

    // 2. Only sell prices that exist in our own table. If the price ID is
    //    missing here (e.g. test vs live mismatch), fail BEFORE charging
    //    the customer, not silently after.
    const pack = await prisma.cardPackPrice.findUnique({
      where: { stripePriceId: priceId },
    });
    if (!pack || !pack.active) {
      console.error("❌ Checkout blocked, unknown or inactive price:", priceId);
      return NextResponse.json(
        { error: "This pack is not available" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Reuse or create a Stripe customer so session.customer is set and
    //    the webhook can match on stripeCustomerId instead of a typed email.
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;

    // 4. Create the session. mode is fixed server-side, not client-supplied.
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      client_reference_id: user.id,
      metadata: { userId: user.id, packSize: pack.packSize },
      line_items: [{ price: pack.stripePriceId, quantity: 1 }],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("[POST /api/stripe/create-checkout-session]", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
