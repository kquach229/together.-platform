import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cardPackPrices = await prisma.cardPackPrice.findMany({
      where: {
        active: true,
      },
      orderBy: {
        amountCents: "asc",
      },
    });

    return NextResponse.json(cardPackPrices);
  } catch (error) {
    console.error("Error fetching card packs:", error);
    return new Response("Failed to fetch card packs", { status: 500 });
  }
}
