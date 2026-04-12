"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { set } from "date-fns";

// ─── Types ───────────────────────────────────────────────────
interface CardPackPrice {
  id: string;
  packSize: "pack_1" | "pack_5" | "pack_10";
  cardsIncluded: number;
  amountCents: number;
  stripePriceId: string;
  active: boolean;
}

// ─── Static content ──────────────────────────────────────────
const faqs = [
  {
    q: "Is the first card really free?",
    a: "Yes — completely. No credit card required. Create a card, share the signing link, collect messages and photos, and deliver it. The full experience, on us.",
  },
  {
    q: "Do cards expire?",
    a: "No. Once you buy a card, it's yours to use whenever you need it. There's no expiry date and no pressure to use them by a certain time.",
  },
  {
    q: "Do I need a subscription?",
    a: "No. There are no subscriptions, no monthly fees, and no recurring charges. You pay once when you buy a pack and that's it.",
  },
  {
    q: "What do signers pay?",
    a: "Nothing, ever. Anyone with the signing link can add their message and a photo for free — no account, no download, no payment required.",
  },
  {
    q: "Can I get a refund for unused cards?",
    a: "Yes — if you haven't used your cards and want a refund, contact us within 30 days of purchase and we'll sort it out.",
  },
  {
    q: "What's included with every card?",
    a: "Unlimited signers, photo uploads, all themes, scheduled delivery, PDF download, and permanent storage. Every card gets everything — there are no feature tiers.",
  },
];

const features = [
  { emoji: "🖊", label: "Unlimited signers" },
  { emoji: "📷", label: "Photo uploads" },
  { emoji: "🎨", label: "All themes" },
  { emoji: "📬", label: "Scheduled delivery" },
  { emoji: "📄", label: "PDF download" },
  { emoji: "🔒", label: "Permanent storage" },
];

// ─── Component ───────────────────────────────────────────────
export default function Pricing() {
  const router = useRouter();

  const [packs, setPacks] = useState<CardPackPrice[]>([]);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [loadingPack, setLoadingPack] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loadingCheckout, setLoadingCheckout] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/card-packs", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setPacks(data);
        setLoadingPrices(false);
      })
      .catch((err) => {
        console.error("Error fetching prices:", err);
        setLoadingPrices(false);
      });
  }, []);

  // Static fallback prices while loading (matches your Stripe data)
  const fallback: Omit<CardPackPrice, "id" | "stripePriceId" | "active">[] = [
    { packSize: "pack_1", cardsIncluded: 1, amountCents: 299 },
    { packSize: "pack_5", cardsIncluded: 5, amountCents: 1199 },
    { packSize: "pack_10", cardsIncluded: 10, amountCents: 1999 },
  ];

  const displayPacks = packs.length > 0 ? packs : fallback;

  function formatPrice(cents: number) {
    return `$${(cents / 100).toFixed(2)}`;
  }

  function perCardPrice(total: number, cards: number) {
    return `$${(total / 100 / cards).toFixed(2)}/card`;
  }

  function savings(pack: (typeof fallback)[0]) {
    if (pack.cardsIncluded === 1) return null;
    const fullPrice = 299 * pack.cardsIncluded;
    const saved = fullPrice - pack.amountCents;
    const pct = Math.round((saved / fullPrice) * 100);
    return { saved, pct };
  }

  const handlePlanClick = async (packSize: CardPackPrice) => {
    if (!user && isLoaded) {
      router.push("/dashboard");
      return;
    }

    if (!packSize?.stripePriceId) {
      alert("Pricing is not available right now. Please try again.");
      return;
    }

    try {
      setLoadingCheckout(packSize);

      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: packSize.stripePriceId,
          mode: "payment",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();
      if (data.url) router.push(data.url);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong starting checkout.");
    } finally {
      setLoadingCheckout(null);
    }
  };

  // Card config — badge, featured state, CTA label
  const packMeta: Record<
    string,
    { badge?: string; featured: boolean; cta: string }
  > = {
    pack_1: { featured: false, cta: "Buy 1 card" },
    pack_5: { featured: true, cta: "Buy 5 cards", badge: "Best value" },
    pack_10: { featured: false, cta: "Buy 10 cards" },
  };

  const { isSignedIn, user, isLoaded } = useUser();
  console.log("cardpackprices", packs);
  return (
    <div className="font-dm-sans bg-[#FDF8F2] text-[#1A1208] overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="max-w-[680px] mx-auto px-8 pt-20 pb-16 text-center">
        <h1 className="font-playfair text-[clamp(36px,6vw,60px)] leading-[1.05] tracking-[-2px] mb-5">
          Pay once.
          <br />
          <em className="text-terracotta">Use when you need it.</em>
        </h1>
        <p className="text-[17px] text-[#8C7B6B] font-light leading-[1.75]">
          Buy a card or a bundle — no monthly fees, no commitments. Your cards
          never expire.
        </p>
      </section>

      {/* ── PACKS ── */}
      <section className="max-w-[860px] mx-auto px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {displayPacks.map((pack) => {
            const meta = packMeta[pack.packSize];
            const saved = savings(pack);
            const isLoading = loadingPack === pack.packSize;
            const hasPriceId = "stripePriceId" in pack && !!pack.stripePriceId;

            return (
              <div
                key={pack.packSize}
                className={`relative rounded-2xl p-7 flex flex-col bg-white transition-all ${
                  meta.featured
                    ? "border-2 border-terracotta shadow-[0_8px_40px_rgba(212,132,90,0.12)]"
                    : "border border-[#E8DDD0]"
                }`}
              >
                {/* Badge */}
                {meta.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-terracotta text-white text-[11px] font-medium px-4 py-1 rounded-full whitespace-nowrap">
                    {meta.badge}
                  </div>
                )}

                {/* Pack size label */}
                <div className="text-[11px] font-medium tracking-[1.5px] uppercase text-[#8C7B6B] mb-4">
                  {pack.cardsIncluded === 1
                    ? "Single card"
                    : `${pack.cardsIncluded} card bundle`}
                </div>

                {/* Price */}
                <div className="mb-1">
                  <span className="font-playfair text-[48px] tracking-[-2px] leading-none">
                    {loadingPrices && packs.length === 0
                      ? "—"
                      : formatPrice(pack.amountCents)}
                  </span>
                </div>

                {/* Per-card breakdown */}
                <div className="text-sm text-[#8C7B6B] font-light mb-2">
                  {perCardPrice(pack.amountCents, pack.cardsIncluded)}
                  {saved && (
                    <span className="ml-2 text-[#5A7D66] font-medium">
                      · save {saved.pct}%
                    </span>
                  )}
                </div>

                {/* Cards included pill */}
                <div className="inline-flex items-center gap-1.5 bg-[#F5EAD8] text-[#C4734A] text-xs font-medium px-3 py-1.5 rounded-full w-fit mb-6">
                  <span>🎴</span>
                  {pack.cardsIncluded === 1
                    ? "1 card"
                    : `${pack.cardsIncluded} cards`}
                  {" · never expire"}
                </div>

                <div className="flex-1" />

                {/* CTA */}
                <button
                  onClick={() => handlePlanClick(pack)}
                  disabled={isLoading || (loadingPrices && packs.length === 0)}
                  className={`w-full py-3 rounded-full text-sm font-medium transition-all font-dm-sans border-none ${
                    meta.featured
                      ? "bg-terracotta text-white hover:bg-[#C4734A] shadow-[0_4px_16px_rgba(212,132,90,0.25)] cursor-pointer"
                      : "bg-[#1A1208] text-[#FDF8F2] hover:opacity-85 cursor-pointer"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? "Redirecting…" : meta.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* Volume note */}
        <p className="text-center text-sm text-[#8C7B6B] font-light mt-6">
          Need more than 10 cards?{" "}
          <a
            href="mailto:hello@together.so"
            className="text-terracotta hover:underline no-underline"
          >
            Contact us
          </a>{" "}
          for volume pricing.
        </p>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <section className="bg-[#F5EAD8] py-20 px-8">
        <div className="max-w-[860px] mx-auto">
          <p className="text-[11px] font-medium tracking-[2px] uppercase text-terracotta mb-3 text-center">
            Every card includes
          </p>
          <h2 className="font-playfair text-[clamp(26px,3vw,38px)] tracking-tight text-center mb-12">
            No feature tiers. No add-ons.
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.label}
                className="bg-white border border-[#E8DDD0] rounded-xl px-5 py-4 flex items-center gap-3"
              >
                <span className="text-xl shrink-0">{f.emoji}</span>
                <span className="text-sm font-medium">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-[680px] mx-auto px-8 py-20 text-center">
        <p className="text-[11px] font-medium tracking-[2px] uppercase text-terracotta mb-3">
          Simple by design
        </p>
        <h2 className="font-playfair text-[clamp(26px,3vw,38px)] tracking-tight mb-12">
          How it works
        </h2>
        <div className="flex flex-col gap-0">
          {[
            {
              step: "1",
              title: "Buy a pack",
              body: "Pick 1, 5, or 10 cards. Pay once. Cards go straight to your account — no subscription needed.",
            },
            {
              step: "2",
              title: "Create a card",
              body: "Choose an occasion, add a recipient, pick a theme. Your card is live in under a minute.",
            },
            {
              step: "3",
              title: "Collect messages",
              body: "Share your signing link. Colleagues and friends add their messages and photos — no account required.",
            },
            {
              step: "4",
              title: "Deliver it",
              body: "When everyone's signed, hit deliver. The recipient gets a private link to open their card.",
            },
          ].map((item, i, arr) => (
            <div key={item.step} className="flex gap-6 items-start text-left">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-9 h-9 rounded-full bg-terracotta text-white flex items-center justify-center text-sm font-medium font-dm-sans">
                  {item.step}
                </div>
                {i < arr.length - 1 && (
                  <div className="w-px flex-1 bg-[#E8DDD0] my-2 min-h-[40px]" />
                )}
              </div>
              <div className={`pb-8 ${i === arr.length - 1 ? "" : ""}`}>
                <div className="font-playfair text-[20px] tracking-tight mb-1 pt-1">
                  {item.title}
                </div>
                <p className="text-sm text-[#8C7B6B] font-light leading-[1.75]">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <div className="bg-[#F5EAD8] py-20 px-8">
        <div className="max-w-[640px] mx-auto">
          <p className="text-[11px] font-medium tracking-[2px] uppercase text-terracotta mb-3 text-center">
            Got questions?
          </p>
          <h2 className="font-playfair text-[clamp(26px,3vw,38px)] tracking-tight text-center mb-10">
            Common questions
          </h2>
          <div className="flex flex-col">
            {faqs.map((faq, i) => (
              <div key={i} className="border-t border-[#D8CEBE] last:border-b">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center py-5 text-left font-dm-sans cursor-pointer bg-transparent border-none"
                >
                  <span className="text-[15px] font-medium text-[#1A1208] pr-6">
                    {faq.q}
                  </span>
                  <span
                    className={`text-[#8C7B6B] text-sm transition-transform duration-200 shrink-0 ${openFaq === i ? "rotate-180" : ""}`}
                  >
                    ▾
                  </span>
                </button>
                {openFaq === i && (
                  <p className="text-sm text-[#8C7B6B] leading-[1.75] font-light pb-5">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="bg-[#1A1208] py-24 px-8 text-center relative overflow-hidden">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-white/5 -top-28 -left-24 pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-white/5 -bottom-16 -right-14 pointer-events-none" />
        <h2 className="font-playfair text-[clamp(28px,4vw,48px)] text-[#FDF8F2] tracking-[-2px] mb-4 relative z-10">
          Someone deserves to feel celebrated today.
        </h2>
        <p className="text-[16px] text-[#FDF8F2]/60 mb-9 font-light relative z-10">
          Your first card is free. No credit card required.
        </p>
        <a
          href="/create"
          className="inline-block bg-terracotta text-white px-10 py-4 rounded-full text-[15px] font-medium hover:bg-[#C4734A] transition-colors no-underline relative z-10"
        >
          Create your first card →
        </a>
        <p className="text-xs text-[#FDF8F2]/30 mt-4 relative z-10">
          No account needed to sign. No credit card to start.
        </p>
      </div>
    </div>
  );
}
