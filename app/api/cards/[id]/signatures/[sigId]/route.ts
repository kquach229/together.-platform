// app/api/cards/[id]/signatures/[sigId]/route.ts
// Allows the card creator to hide or show individual signatures
// before the card is delivered.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/helpers/getUser";
import prisma from "@/lib/prisma";

const patchSchema = z.object({
  isHidden: z.boolean(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; sigId: string }> },
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { id: cardId, sigId } = await params;

    // Verify the card belongs to this user
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      select: { creatorId: true, status: true },
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }
    if (card.creatorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (card.status === "delivered") {
      return NextResponse.json(
        { error: "Cannot hide messages on a delivered card" },
        { status: 409 },
      );
    }

    // Verify the signature belongs to this card
    const signature = await prisma.signature.findUnique({
      where: { id: sigId },
      select: { id: true, cardId: true },
    });

    if (!signature || signature.cardId !== cardId) {
      return NextResponse.json(
        { error: "Signature not found" },
        { status: 404 },
      );
    }

    const body = await req.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 422 });
    }

    const updated = await prisma.signature.update({
      where: { id: sigId },
      data: { isHidden: parsed.data.isHidden },
      select: { id: true, isHidden: true },
    });

    return NextResponse.json({ signature: updated });
  } catch (err) {
    console.error("[PATCH /api/cards/:id/signatures/:sigId]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
