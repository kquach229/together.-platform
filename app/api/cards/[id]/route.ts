import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

// ─── Validation schema ───────────────────────────────────────
const updateCardSchema = z.object({
  occasion: z.string().min(1).optional(),
  recipientName: z.string().min(1).optional(),
  recipientEmail: z.string().email().optional().or(z.literal("")),
  openingMessage: z.string().max(500).optional(),
  theme: z.string().optional(),
  signingDeadline: z.string().datetime().optional().nullable(),
  scheduledDeliveryAt: z.string().datetime().optional().nullable(),
  status: z.enum(["draft", "collecting", "delivered", "archived"]).optional(),
});

// ─── Helper: get authed user + verify card ownership ─────────
async function getAuthedUserAndCard(clerkId: string, cardId: string) {
  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return { error: "User not found", status: 404 };

  const card = await prisma.card.findUnique({ where: { id: cardId } });
  if (!card) return { error: "Card not found", status: 404 };
  if (card.creatorId !== user.id) return { error: "Forbidden", status: 403 };

  return { user, card };
}

// ─── GET /api/cards/[id] ─────────────────────────────────────
// Returns a single card with its signatures (creator only)
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const result = await getAuthedUserAndCard(clerkId, params.id);
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    // Return full card with signatures for creator dashboard
    const card = await prisma.card.findUnique({
      where: { id: params.id },
      include: {
        signatures: {
          where: { isHidden: false },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            signerName: true,
            signerEmail: true,
            message: true,
            photoUrl: true,
            isHidden: true,
            createdAt: true,
          },
        },
        _count: {
          select: { views: true },
        },
      },
    });

    return NextResponse.json({ card });
  } catch (error) {
    console.error("[GET /api/cards/:id]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// ─── PATCH /api/cards/[id] ───────────────────────────────────
// Updates a card — only allowed while status is 'draft' or 'collecting'
// Special case: status can be set to 'collecting' to publish the card,
// or 'delivered' to deliver it to the recipient
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const result = await getAuthedUserAndCard(clerkId, params.id);
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    const { card } = result;

    // Can't edit a delivered or archived card
    if (card.status === "delivered" || card.status === "archived") {
      return NextResponse.json(
        {
          error:
            "Cannot edit a card that has already been delivered or archived",
        },
        { status: 409 },
      );
    }

    const body = await req.json();
    const parsed = updateCardSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 },
      );
    }

    const {
      occasion,
      recipientName,
      recipientEmail,
      openingMessage,
      theme,
      signingDeadline,
      scheduledDeliveryAt,
      status,
    } = parsed.data;

    // If delivering, set deliveredAt timestamp
    const deliveredAt = status === "delivered" ? new Date() : undefined;

    const updated = await prisma.card.update({
      where: { id: params.id },
      data: {
        ...(occasion && { occasion }),
        ...(recipientName && { recipientName }),
        ...(recipientEmail !== undefined && {
          recipientEmail: recipientEmail || null,
        }),
        ...(openingMessage !== undefined && { openingMessage }),
        ...(theme && { theme }),
        ...(signingDeadline !== undefined && {
          signingDeadline: signingDeadline ? new Date(signingDeadline) : null,
        }),
        ...(scheduledDeliveryAt !== undefined && {
          scheduledDeliveryAt: scheduledDeliveryAt
            ? new Date(scheduledDeliveryAt)
            : null,
        }),
        ...(status && { status }),
        ...(deliveredAt && { deliveredAt }),
      },
      select: {
        id: true,
        occasion: true,
        recipientName: true,
        recipientEmail: true,
        openingMessage: true,
        theme: true,
        status: true,
        signingToken: true,
        deliveryToken: true,
        signerCount: true,
        signingDeadline: true,
        scheduledDeliveryAt: true,
        deliveredAt: true,
        updatedAt: true,
      },
    });

    // If card was just set to 'collecting', create a notification
    // so the creator knows it's live
    if (status === "collecting") {
      await prisma.notification.create({
        data: {
          userId: result.user.id,
          cardId: card.id,
          type: "card_delivered",
          payload: {
            cardTitle: `${card.occasion} card for ${card.recipientName}`,
            signingLink: `/sign/${updated.signingToken}`,
          },
        },
      });
    }

    return NextResponse.json({ card: updated });
  } catch (error) {
    console.error("[PATCH /api/cards/:id]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// ─── DELETE /api/cards/[id] ──────────────────────────────────
// Deletes a card — only allowed while status is 'draft'
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const result = await getAuthedUserAndCard(clerkId, params.id);
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    const { card } = result;

    // Only allow deleting drafts
    if (card.status !== "draft") {
      return NextResponse.json(
        {
          error: "Only draft cards can be deleted",
          message: "To remove a live card, archive it instead.",
        },
        { status: 409 },
      );
    }

    await prisma.card.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/cards/:id]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
