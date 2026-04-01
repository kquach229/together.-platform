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
});

// ─── POST /api/cards ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate and look up user
    const user = await getUser();
    console.log("user: ", user);
    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    // 2. Parse and validate body
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
    } = parsed.data;

    // 3. Check plan limits — free users get 3 cards/month
    if (user.plan === "free") {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const [cardCount, limit] = await Promise.all([
        prisma.card.count({
          where: {
            creatorId: user.id,
            createdAt: { gte: startOfMonth },
          },
        }),
        prisma.planLimit.findUnique({
          where: { plan: "free" },
        }),
      ]);

      if (limit?.cardsPerMonth && cardCount >= limit.cardsPerMonth) {
        return NextResponse.json(
          {
            error: "Monthly card limit reached",
            message: `Free plan allows ${limit.cardsPerMonth} cards per month. Upgrade to Plus for unlimited cards.`,
          },
          { status: 403 },
        );
      }
    }

    // 4. Create the card — runs for all plans
    const card = await prisma.card.create({
      data: {
        creatorId: user.id,
        occasion,
        recipientName,
        recipientEmail: recipientEmail || null,
        openingMessage: openingMessage || null,
        theme,
        status: "collecting",
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

    await prisma.notification.create({
      data: {
        userId: user.id,
        cardId: card.id,
        type: "create_card",
        payload: {
          title: `You created ${card.occasion} for ${card.recipientName}`,
        },
      },
    });

    return NextResponse.json({ card }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/cards]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// ─── GET /api/cards ──────────────────────────────────────────
// Returns all cards for the authenticated user
// Supports ?status=draft|collecting|delivered|archived
// Supports ?page=1&limit=20
export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    // Parse query params
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") ?? undefined;
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);
    const skip = (page - 1) * limit;

    // Validate status if provided
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
        select: {
          id: true,
          occasion: true,
          recipientName: true,
          recipientEmail: true,
          theme: true,
          status: true,
          signingToken: true,
          signerCount: true,
          signingDeadline: true,
          scheduledDeliveryAt: true,
          deliveredAt: true,
          createdAt: true,
          updatedAt: true,
        },
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
