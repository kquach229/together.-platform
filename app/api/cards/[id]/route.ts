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
  status: z.enum(["collecting", "delivered", "archived"]).optional(),
  creatorPhotoUrl: z.string().optional(),
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
    const { id: cardId } = await params;
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const result = await getAuthedUserAndCard(clerkId, cardId);
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    // Return full card with signatures for creator dashboard
    const card = await prisma.card.findUnique({
      where: { id: cardId },
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
    const { id: cardId } = await params;
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const result = await getAuthedUserAndCard(clerkId, cardId);
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    const { card, user } = result;

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
      creatorPhotoUrl,
    } = parsed.data;

    // If delivering, set deliveredAt timestamp
    const deliveredAt = status === "delivered" ? new Date() : undefined;

    // Store the original card data before update to detect meaningful changes
    const originalCard = await prisma.card.findUnique({
      where: { id: cardId },
      select: {
        occasion: true,
        recipientName: true,
        openingMessage: true,
        theme: true,
        status: true,
        creatorPhotoUrl: true,
      },
    });

    const updated = await prisma.card.update({
      where: { id: cardId },
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
        ...(creatorPhotoUrl !== undefined && { creatorPhotoUrl }),
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
        creatorPhotoUrl: true,
        deliveredAt: true,
        updatedAt: true,
      },
    });

    // ─── NOTIFICATION LOGIC ───────────────────────────────────
    // Determine if this is a meaningful edit (not just a photo upload)

    // Check if this is a brand new card (created within last minute)
    const isNewCard = card.createdAt.getTime() > Date.now() - 60000; // 1 minute

    // Check if this update only contains creatorPhotoUrl
    const updateKeys = Object.keys(parsed.data);
    const isOnlyPhotoUpdate =
      updateKeys.length === 1 && updateKeys[0] === "creatorPhotoUrl";

    // Check if meaningful fields actually changed
    let hasMeaningfulChanges = false;
    if (originalCard) {
      hasMeaningfulChanges =
        (occasion && occasion !== originalCard.occasion) ||
        (recipientName && recipientName !== originalCard.recipientName) ||
        (openingMessage !== undefined &&
          openingMessage !== originalCard.openingMessage) ||
        (theme && theme !== originalCard.theme) ||
        (status && status !== originalCard.status);
    }

    // Only create "card_edited" notification if:
    // 1. Card is not brand new
    // 2. It's not just a photo upload
    // 3. There are meaningful changes OR we're not sure (fallback)
    const shouldCreateEditNotification =
      !isNewCard &&
      !isOnlyPhotoUpdate &&
      (hasMeaningfulChanges || updateKeys.length > 0);

    if (shouldCreateEditNotification) {
      await prisma.notification.create({
        data: {
          type: "card_edited",
          userId: user.id,
          cardId: card.id,
          payload: {
            title: `You edited ${card.occasion} card for ${card.recipientName}`,
            changes: {
              occasion: occasion !== originalCard?.occasion,
              recipientName: recipientName !== originalCard?.recipientName,
              openingMessage: openingMessage !== originalCard?.openingMessage,
              theme: theme !== originalCard?.theme,
              status: status !== originalCard?.status,
            },
          },
        },
      });
    }

    // If card was just set to 'delivered', create a notification
    if (status === "delivered") {
      await prisma.notification.create({
        data: {
          userId: user.id,
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
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { userId: clerkId } = await auth();
    const { id: cardId } = await params;
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const result = await getAuthedUserAndCard(clerkId, cardId);
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    // Use a transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      // Create audit notification before deletion
      await tx.notification.create({
        data: {
          userId: result.user.id,
          cardId: null, // 👈 Prevents cascade deletion
          type: "card_deleted",
          payload: {
            title: `You deleted ${result.card.occasion} card for ${result.card.recipientName}`,
            cardId: result.card.id,
            occasion: result.card.occasion,
            recipientName: result.card.recipientName,
            deletedAt: new Date().toISOString(),
          },
        },
      });

      // Delete the card (this will cascade delete signatures, views, and notifications)
      await tx.card.delete({ where: { id: cardId } });
    });

    return NextResponse.json(
      {
        success: true,
        message: "Card deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[DELETE /api/cards/:id]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
