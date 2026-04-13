import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function SuccessPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: {
      name: true,
      cardsRemaining: true,
      lifetimeCardsCreated: true,
    },
  });

  if (!user) redirect("/sign-in");

  return (
    <div className="font-dm-sans min-h-screen bg-[#FDF8F2] text-[#1A1208] flex flex-col">
      {/* NAV */}
      <nav className="flex items-center px-12 h-16 border-b border-[#E8DDD0]">
        <Link
          href="/"
          className="font-playfair text-[22px] tracking-tight no-underline text-[#1A1208]"
        >
          together<span className="text-terracotta">.</span>
        </Link>
      </nav>

      {/* MAIN */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="w-20 h-20 rounded-full bg-[#EEF3EE] flex items-center justify-center text-4xl mx-auto mb-6">
          🎉
        </div>

        <h1 className="font-playfair text-[40px] tracking-tight mb-3">
          Payment successful!
        </h1>

        <p className="text-[16px] text-[#8C7B6B] font-light leading-[1.75] max-w-[420px] mb-6">
          Your cards have been added to your account. You’re all set to start
          creating.
        </p>

        {/* BALANCE */}
        <div className="bg-white border border-[#E8DDD0] rounded-2xl px-6 py-4 mb-8">
          <p className="text-sm text-[#8C7B6B] mb-1">Cards available</p>
          <p className="text-2xl font-playfair">{user.cardsRemaining}</p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Link
            href="/create"
            className="bg-terracotta text-white px-10 py-4 rounded-full text-sm font-medium hover:bg-[#C4734A] transition-colors no-underline"
          >
            Create a card →
          </Link>

          <Link
            href="/dashboard"
            className="text-sm text-[#8C7B6B] hover:text-terracotta transition-colors no-underline"
          >
            Go to dashboard
          </Link>
        </div>

        <p className="text-xs text-[#8C7B6B] mt-10 font-light max-w-[420px]">
          If your balance doesn’t update immediately, refresh the page in a few
          seconds.
        </p>
      </div>
    </div>
  );
}
