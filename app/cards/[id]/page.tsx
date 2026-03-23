// app/dashboard/cards/[id]/page.tsx
// Protected page — only the card creator can view this.

import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import CardDetailView from "./CardDetailView";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CardDetailPage({ params }: Props) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const { id } = await params;

  // Look up the user
  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });
  if (!user) redirect("/sign-in");

  // Fetch the card with full details — signatures included
  const card = await prisma.card.findUnique({
    where: { id },
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
      createdAt: true,
      creatorId: true,
      creator: { select: { name: true } },
      signatures: {
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

  // Not found
  if (!card) notFound();

  // Only the creator can view this page
  if (card.creatorId !== user.id) notFound();

  return <CardDetailView card={card} />;
}
