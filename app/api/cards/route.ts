import { dateInputToISO } from "@/lib/helpers/dates";
import { getUser } from "@/lib/helpers/getUser";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

// ─── Validation schema ───────────────────────────────────────
const createCardSchema = z.object({
  occasion: z.string().min(1, "Occasion is required"),
  recipientName: z.string().min(1, "Recipient name is required"),
  recipientEmail: z
    .string()
    .email("Invalid email")
    .optional()
    .or(z.literal("")),
  openingMessage: z.string().max(500).optional(),
  theme: z.string().default("warm"),
  signingDeadline: z.string().datetime().optional(),
  scheduledDeliveryAt: z.string().datetime().optional(),
  creatorPhotoUrl: z.string().optional().nullable(),
});

// ─── POST /api/cards ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const user = await getUser();

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createCardSchema.safeParse(body);

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
      creatorPhotoUrl,
    } = parsed.data;

    const card = await prisma.$transaction(async (tx) => {
      // 1. Ensure user still has credits INSIDE transaction
      const userRow = await tx.user.findUnique({
        where: { id: user.id },
        select: { cardsRemaining: true },
      });

      if (!userRow || userRow.cardsRemaining <= 0) {
        throw new Error("INSUFFICIENT_CREDITS");
      }

      // 2. Create card first
      const createdCard = await tx.card.create({
        data: {
          creatorId: user.id,
          occasion,
          recipientName,
          recipientEmail: recipientEmail || null,
          openingMessage: openingMessage || null,
          theme,
          status: "collecting",
          creatorPhotoUrl: creatorPhotoUrl || null,
          signingDeadline: signingDeadline ? new Date(signingDeadline) : null,
          scheduledDeliveryAt: scheduledDeliveryAt
            ? new Date(scheduledDeliveryAt)
            : null,
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
          signingDeadline: true,
          scheduledDeliveryAt: true,
          signerCount: true,
          createdAt: true,
        },
      });

      // 3. NOW decrement safely
      await tx.user.update({
        where: { id: user.id },
        data: {
          lifetimeCardsCreated: { increment: 1 },
          cardsRemaining: { decrement: 1 },
        },
      });

      // 4. Notification only after success
      await tx.notification.create({
        data: {
          userId: user.id,
          cardId: createdCard.id,
          type: "create_card",
          payload: {
            title: `You created ${createdCard.occasion} for ${createdCard.recipientName}`,
          },
        },
      });

      return createdCard;
    });

    return NextResponse.json({ card }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/cards]", err);

    if (err instanceof Error && err.message === "INSUFFICIENT_CREDITS") {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// ─── GET /api/cards ──────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") ?? undefined;
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);
    const skip = (page - 1) * limit;

    const validStatuses = ["collecting", "delivered", "archived"];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 422 },
      );
    }

    const where = {
      creatorId: user.id,
      ...(status ? { status } : {}),
    };

    const [cards, total] = await Promise.all([
      prisma.card.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.card.count({ where }),
    ]);

    return NextResponse.json({
      cards,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[GET /api/cards]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
