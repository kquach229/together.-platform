// app/card/[deliveryToken]/page.tsx
// Public page — no auth required. The deliveryToken IS the access key.

import prisma from "@/lib/prisma";
import RecipientView from "./RecipientView";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ deliveryToken: string }>; // ← now a Promise in Next.js 15+
}
export default async function CardPage({ params }: Props) {
  const { deliveryToken } = await params;

  // Fetch the card by its delivery token
  const card = await prisma.card.findUnique({
    where: { deliveryToken },
    select: {
      id: true,
      occasion: true,
      recipientName: true,
      openingMessage: true,
      theme: true,
      status: true,
      deliveredAt: true,
      signerCount: true,
      creatorPhotoUrl: true,
      creator: {
        select: { name: true },
      },
      signatures: {
        where: { isHidden: false },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          signerName: true,
          message: true,
          photoUrl: true,
          createdAt: true,
        },
      },
    },
  });

  if (!card) {
    return notFound();
  }

  // Log the view (fire and forget — don't block rendering)
  prisma.cardView.create({ data: { cardId: card.id } }).catch(() => {});
  console.log(`creator photo url from page.tsx: ${card.creatorPhotoUrl}`);
  return <RecipientView card={card} />;
}
