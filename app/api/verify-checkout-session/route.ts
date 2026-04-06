// app/api/verify-checkout-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json();

  if (!sessionId) return NextResponse.json({ success: false }, { status: 400 });

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["customer", "subscription"],
  });

  if (session.payment_status === "paid") {
    const user = await prisma.user.update({
      where: { email: session.customer_email! },
      data: { subscriptionActive: true },
    });

    return NextResponse.json({ success: true, user });
  }

  return NextResponse.json({ success: false });
}
