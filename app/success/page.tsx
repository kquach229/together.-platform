// app/success/page.tsx
// Shown after a successful Stripe checkout redirect.
// Does NOT update the DB — that's the webhook's job.
// Just reads the current plan from the DB to confirm activation.

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function SuccessPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  // The webhook may not have fired yet by the time the user lands here
  // (Stripe webhooks are asynchronous). Poll briefly by fetching from DB.
  // In production you could use a loading state + client-side poll,
  // but for most cases the webhook fires within 1-2 seconds of payment.
  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { plan: true, name: true },
  });

  const planLabel =
    {
      plus: "Plus",
      plus_annual: "Plus",
      team: "Team",
      team_annual: "Team",
      free: "Free",
    }[user?.plan ?? "free"] ?? "Plus";

  const isUpgraded = user?.plan !== "free";

  return (
    <div className="font-dm-sans min-h-screen bg-[#FDF8F2] text-[#1A1208] flex flex-col">
      <nav className="flex items-center px-12 h-16 border-b border-[#E8DDD0]">
        <Link
          href="/"
          className="font-playfair text-[22px] tracking-tight no-underline text-[#1A1208]"
        >
          together<span className="text-terracotta">.</span>
        </Link>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="w-20 h-20 rounded-full bg-[#EEF3EE] flex items-center justify-center text-4xl mx-auto mb-6">
          🎉
        </div>

        <h1 className="font-playfair text-[40px] tracking-tight mb-3">
          {isUpgraded ? `Welcome to ${planLabel}!` : "Payment received!"}
        </h1>

        <p className="text-[16px] text-[#8C7B6B] font-light leading-[1.75] max-w-[420px] mb-2">
          {isUpgraded
            ? "Your subscription is now active. Create unlimited cards, upload photos, and schedule deliveries."
            : "Your plan is activating — this usually takes a few seconds. Refresh the page if it doesn't update."}
        </p>

        {!isUpgraded && (
          <p className="text-xs text-[#8C7B6B] mb-8 font-light">
            If your plan doesn't activate within a minute,{" "}
            <Link
              href="/contact"
              className="text-terracotta hover:underline no-underline"
            >
              contact support
            </Link>
            .
          </p>
        )}

        <div className="flex flex-col items-center gap-3 mt-6">
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
      </div>
    </div>
  );
}
