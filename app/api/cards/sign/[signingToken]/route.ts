// app/api/sign/[signingToken]/route.ts
// Public route — no auth required. The signingToken IS the access key.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { getUser } from "@/lib/helpers/getUser";

// ─── Validation schema ───────────────────────────────────────
const signCardSchema = z.object({
  signerName: z.string().min(1, "Name is required").max(100),
  signerEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  message: z
    .string()
    .min(1, "Message is required")
    .max(300, "Message must be 300 characters or less"),
  photoUrl: z.string().optional().or(z.literal("")),
});

// ─── GET /api/sign/[signingToken] ────────────────────────────
// Returns the card details needed to render the signing page.
// Does NOT return other signers' messages — only names + count.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ signingToken: string }> },
) {
  try {
    const { signingToken } = await params;

    const card = await prisma.card.findUnique({
      where: { signingToken },
      select: {
        id: true,
        occasion: true,
        recipientName: true,
        theme: true,
        status: true,
        signingDeadline: true,
        signerCount: true,
        creator: {
          select: { name: true },
        },
        // Only expose signer names — not their messages (still private)
        signatures: {
          where: { isHidden: false },
          orderBy: { createdAt: "desc" },
          select: { id: true, signerName: true, createdAt: true },
        },
      },
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Card must be in collecting status to accept signatures
    if (card.status !== "collecting") {
      return NextResponse.json(
        {
          error: "This card is no longer accepting signatures",
          status: card.status,
        },
        { status: 403 },
      );
    }

    // Check signing deadline
    if (card.signingDeadline && new Date() > new Date(card.signingDeadline)) {
      return NextResponse.json(
        { error: "The signing deadline for this card has passed" },
        { status: 403 },
      );
    }

    return NextResponse.json({ card });
  } catch (err) {
    console.error("[GET /api/sign/:token]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// ─── POST /api/sign/[signingToken] ───────────────────────────
// Submits a new signature to the card.

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ signingToken: string }> },
) {
  try {
    const { signingToken } = await params;

    // 1. Look up the card
    const card = await prisma.card.findUnique({
      where: { signingToken },
      select: {
        id: true,
        status: true,
        signingDeadline: true,
        recipientName: true,
        creatorId: true,
        occasion: true,
      },
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // 2. Guard — only accept signatures on collecting cards
    if (card.status !== "collecting") {
      return NextResponse.json(
        { error: "This card is no longer accepting signatures" },
        { status: 403 },
      );
    }

    // 3. Guard — check deadline
    if (card.signingDeadline && new Date() > new Date(card.signingDeadline)) {
      return NextResponse.json(
        { error: "The signing deadline for this card has passed" },
        { status: 403 },
      );
    }

    // 4. Validate body
    const body = await req.json();
    const parsed = signCardSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 },
      );
    }

    const { signerName, signerEmail, message, photoUrl } = parsed.data;
    const user = await getUser();

    // 5. Get IP for audit trail
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      null;

    // 6. Create the signature
    // signer_count is auto-incremented by the DB trigger

    if (user?.id) {
      const existing = await prisma.signature.findFirst({
        where: {
          cardId: card.id,
          userId: user.id,
        },
      });
      if (existing) {
        return NextResponse.json(
          { error: "You have already signed this card." },
          { status: 403 },
        );
      }
    }

    const signature = await prisma.signature.create({
      data: {
        cardId: card.id,
        userId: user?.id,
        signerName,
        signerEmail: signerEmail || null,
        message,
        photoUrl: photoUrl || null,
      },
      select: {
        id: true,
        signerName: true,
        message: true,
        photoUrl: true,
        createdAt: true,
        userId: true,
      },
    });

    await prisma.card.update({
      where: {
        id: card.id,
      },
      data: {
        signerCount: { increment: 1 },
      },
    });

    // 7. Queue a notification for the card creator
    await prisma.notification.create({
      data: {
        userId: card.creatorId,
        cardId: card.id,
        type: "new_signature",
        payload: {
          signerName,
          cardTitle: `${card.occasion} card for ${card.recipientName}`,
          signatureId: signature.id,
        },
      },
    });

    return NextResponse.json({ signature }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/sign/:token]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
