// app/sign/[signingToken]/page.tsx
// Public page — no auth required.

import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import SignView from "./SignView";

interface Props {
  params: Promise<{ signingToken: string }>;
}

export default async function SignPage({ params }: Props) {
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
      creatorPhotoUrl: true,
      creator: {
        select: { name: true },
      },
      signatures: {
        where: { isHidden: false },
        orderBy: { createdAt: "desc" },
        select: { id: true, signerName: true, createdAt: true },
      },
    },
  });

  // Not found
  if (!card) notFound();

  // Card is no longer collecting — show a closed page
  if (card.status !== "collecting") {
    return (
      <div className="font-dm-sans min-h-screen bg-[#FDF8F2] flex items-center justify-center px-12">
        <div className="text-center max-w-[400px]">
          <div className="text-5xl mb-5">🔒</div>
          <h1 className="font-playfair text-[28px] tracking-tight mb-3">
            This card is closed
          </h1>
          <p className="text-sm text-[#8C7B6B] font-light leading-[1.75]">
            {card.status === "delivered"
              ? `This card has already been delivered to ${card.recipientName}.`
              : "This card is no longer accepting signatures."}
          </p>
          <a
            href="/"
            className="inline-block mt-6 bg-[#D4845A] text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-[#C4734A] transition-colors no-underline"
          >
            Create your own card →
          </a>
        </div>
      </div>
    );
  }

  // Deadline passed
  if (card.signingDeadline && new Date() > new Date(card.signingDeadline)) {
    return (
      <div className="font-dm-sans min-h-screen bg-[#FDF8F2] flex items-center justify-center px-12">
        <div className="text-center max-w-100">
          <div className="text-5xl mb-5">⏰</div>
          <h1 className="font-playfair text-[28px] tracking-tight mb-3">
            Signing has closed
          </h1>
          <p className="text-sm text-[#8C7B6B] font-light leading-[1.75]">
            The deadline for signing this card has passed.
          </p>
          <a
            href="/"
            className="inline-block mt-6 bg-[#D4845A] text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-[#C4734A] transition-colors no-underline"
          >
            Create your own card →
          </a>
        </div>
      </div>
    );
  }

  return <SignView card={card} signingToken={signingToken} />;
}
