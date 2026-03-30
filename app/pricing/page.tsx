"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface Feature {
  text: string;
  included: boolean;
}
interface Plan {
  name: "Free" | "Plus" | "Team";
  monthlyPrice: number;

  annualPrice: number;
  desc: string;
  cta: string;
  ctaStyle: "ghost" | "primary" | "dark";
  featured: boolean;
  badge?: string;
  features: Feature[];
}

interface DbPrice {
  id: string;
  plan: "free" | "plus" | "plus_annual" | "team" | "team_annual";
  billingInterval: "monthly" | "annual";
  stripePriceId: string;
  amountCents: number;
  currency: string;
  active: boolean;
  createdAt: string;
}

const faqs = [
  {
    q: "Do signers need an account?",
    a: "No — anyone with a signing link can add their message without creating an account. Only the card creator needs one.",
  },
  {
    q: "Can the recipient see messages before I send?",
    a: "Never. All messages stay private until you choose to deliver the card. You control the timing completely.",
  },
  {
    q: "What happens to my cards if I downgrade?",
    a: "All your sent cards remain accessible. You'll just lose access to premium features on future cards.",
  },
  {
    q: "Is there a limit on how long a card stays live?",
    a: "Free cards are kept for 24 hours. Plus and Team cards are stored for the duration of your active plan.",
  },
  {
    q: "Can I use Together for my whole company?",
    a: "Absolutely. The Team plan includes a shared dashboard so multiple people can create and manage cards together. For larger orgs with 50+ members, contact us for Enterprise pricing with SSO, advanced analytics, and dedicated support.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes — if you're not happy within 14 days of upgrading, we'll issue a full refund, no questions asked.",
  },
];

const logos = ["STRIPE", "NOTION", "FIGMA", "VERCEL", "LINEAR", "LOOM"];

export default function Pricing() {
  const router = useRouter();

  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [prices, setPrices] = useState<DbPrice[]>([]);
  const [loadingCheckout, setLoadingCheckout] = useState<string | null>(null);
  const [loadingPrices, setLoadingPrices] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch("/api/prices", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch prices");
        }

        const data = await response.json();
        setPrices(data);
      } catch (error) {
        console.error("Error fetching pricing:", error);
      } finally {
        setLoadingPrices(false);
      }
    };

    fetchPrices();
  }, []);

  const priceMap = useMemo(() => {
    return {
      plus: {
        monthly: prices.find(
          (p) => p.plan === "plus" && p.billingInterval === "monthly",
        ),
        annual: prices.find(
          (p) => p.plan === "plus_annual" && p.billingInterval === "annual",
        ),
      },
      team: {
        monthly: prices.find(
          (p) => p.plan === "team" && p.billingInterval === "monthly",
        ),
        annual: prices.find(
          (p) => p.plan === "team_annual" && p.billingInterval === "annual",
        ),
      },
    };
  }, [prices]);

  console.log(prices);

  const calculateSavings = (monthlyPrice: number, annualPrice: number) => {
    const yearlyTotal = monthlyPrice * 12;
    const savings = yearlyTotal - annualPrice;
    const percentage = (savings / yearlyTotal) * 100;
    return { savings, percentage: Math.round(percentage) };
  };

  const handlePlanClick = async (planName: Plan["name"]) => {
    if (planName === "Free") {
      router.push("/create");
      return;
    }

    const selectedPrice =
      planName === "Plus"
        ? billing === "monthly"
          ? priceMap.plus.monthly
          : priceMap.plus.annual
        : billing === "monthly"
          ? priceMap.team.monthly
          : priceMap.team.annual;

    if (!selectedPrice?.stripePriceId) {
      alert("Pricing is not available right now. Please try again.");
      return;
    }

    try {
      setLoadingCheckout(planName);

      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: selectedPrice.stripePriceId,
          plan: planName.toLowerCase(),
          billingInterval: billing,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to create checkout session");
      }

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("No checkout URL returned");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong starting checkout.");
    } finally {
      setLoadingCheckout(null);
    }
  };

  const handleCreateCard = () => {
    router.push("/create");
  };

  const PRICING_OBJECTS = {
    PLUS: "plus",
    TEAM: "team",
    PLUS_ANNUAL: "plus_annual",
    TEAM_ANNUAL: "team_annual",
  };

  const plans: Plan[] = [
    {
      name: "Free",
      monthlyPrice: 0,
      annualPrice: 0,
      desc: "Perfect for occasional personal cards and trying things out.",
      cta: "Start for free",
      ctaStyle: "ghost",
      featured: false,
      features: [
        { text: "First card free", included: true },
        { text: "You are the only signer", included: true },
        { text: "Text messages", included: true },
        { text: "Standard themes", included: true },
        { text: "Card stored for 24 hours", included: true },
        { text: "Photo uploads (1 per card)", included: false },
        { text: "PDF download", included: false },
        { text: "Scheduled delivery", included: false },
        { text: "Team dashboard", included: false },
      ],
    },
    {
      name: "Plus",
      monthlyPrice: priceMap.plus?.monthly
        ? priceMap.plus.monthly.amountCents / 100
        : 0,
      annualPrice: priceMap.plus?.annual
        ? priceMap.plus.annual.amountCents / 100
        : 58,
      desc: "For people who send cards regularly and want the full experience.",
      cta: "Get Plus",
      ctaStyle: "primary",
      featured: true,
      badge: "Most popular",
      features: [
        { text: "Unlimited cards", included: true },
        { text: "Unlimited signers", included: true },
        { text: "Text + photo messages", included: true },
        { text: "Premium themes", included: true },
        { text: "Unlimited photo uploads", included: true },
        { text: "PDF download", included: true },
        { text: "Scheduled delivery", included: true },
        { text: "Cards stored for entirety of plan duration", included: true },
        { text: "Team dashboard", included: false },
      ],
    },
    {
      name: "Team",
      monthlyPrice: priceMap.team?.monthly
        ? priceMap.team.monthly.amountCents / 100
        : 18,
      annualPrice: priceMap.team?.annual
        ? priceMap.team.annual.amountCents / 100
        : 173,
      desc: "For workplaces sending cards together — HR, managers, team leads.",
      cta: "Get Team",
      ctaStyle: "dark",
      featured: false,
      features: [
        { text: "Everything in Plus", included: true },
        { text: "Team dashboard", included: true },
        { text: "Up to 20 team members", included: true },
        { text: "Custom branding", included: true },
        { text: "Slack integration", included: true },
        { text: "Priority support", included: true },
        { text: "Billing receipts", included: true },
        { text: "Analytics dashboard", included: true },
        { text: "Cards stored for entirety of plan duration", included: true },
        { text: "SSO / SAML", included: false },
      ],
    },
  ];

  return (
    <div className="font-dm-sans bg-[#FDF8F2] text-[#1A1208] overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-20 pb-16 px-6 md:px-12 text-center">
        <div className="absolute w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,#F5EAD8_0%,transparent_70%)] -top-24 -left-32 opacity-60 pointer-events-none" />
        <div className="absolute w-[380px] h-[380px] rounded-full bg-[radial-gradient(circle,#EEF3EE_0%,transparent_70%)] -bottom-16 -right-16 opacity-50 pointer-events-none" />
        <div className="relative z-10 max-w-[640px] mx-auto">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[2px] uppercase text-[#D4845A] border border-[#EDD5C5] rounded-full px-4 py-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4845A]" />
            Simple, honest pricing
          </div>
          <h1 className="font-playfair text-[clamp(40px,5vw,64px)] leading-[1.05] tracking-[-2px] mb-4">
            Start free.
            <br />
            <em className="text-[#D4845A]">Upgrade</em> when it feels right.
          </h1>
          <p className="text-[17px] text-[#8B7A6B] font-light leading-[1.75] mb-10">
            No hidden fees. No surprise charges. Cancel any time.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex bg-[#F5EAD8] rounded-full p-1">
            {(["monthly", "annual"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all font-dm-sans ${
                  billing === b
                    ? "bg-white text-[#1A1208] shadow-sm"
                    : "text-[#8B7A6B]"
                }`}
              >
                {b === "monthly" ? (
                  "Monthly"
                ) : (
                  <span className="flex items-center gap-2">
                    Annual
                    <span className="text-[11px] font-medium text-[#7B9E87]">
                      Save 20%
                    </span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANS ── */}
      <section className="max-w-[1160px] mx-auto px-6 md:px-12 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const savings =
              plan.monthlyPrice > 0
                ? calculateSavings(plan.monthlyPrice, plan.annualPrice)
                : null;

            const displayPrice =
              plan.monthlyPrice === 0
                ? "$0"
                : billing === "monthly"
                  ? `$${plan.monthlyPrice}`
                  : `$${plan.annualPrice}`;

            const isLoading = loadingCheckout === plan.name;

            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  plan.featured
                    ? "border-2 border-[#D4845A] bg-white shadow-[0_8px_40px_rgba(212,132,90,0.15)]"
                    : "border border-[#E8DDD0] bg-white"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#D4845A] text-white text-[11px] font-medium px-4 py-1 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <div className="text-sm font-medium text-[#8B7A6B] mb-2">
                    {plan.name}
                  </div>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="font-playfair text-[48px] tracking-[-2px] leading-none">
                      {displayPrice}
                    </span>
                    <span className="text-sm text-[#8B7A6B] font-light">
                      {plan.monthlyPrice === 0
                        ? "forever"
                        : billing === "monthly"
                          ? "/ month"
                          : "/ year"}
                    </span>
                  </div>

                  {plan.monthlyPrice > 0 && billing === "annual" && savings && (
                    <div className="text-xs text-[#7B9E87] font-medium mb-2">
                      Billed annually · saves ${savings.savings}/yr (
                      {savings.percentage}% off)
                    </div>
                  )}

                  <p className="text-sm text-[#8B7A6B] leading-[1.7] font-light">
                    {plan.desc}
                  </p>
                </div>

                <div className="h-px bg-[#E8DDD0] mb-5" />

                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li
                      key={f.text}
                      className="flex items-start gap-2.5 text-sm"
                    >
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] mt-0.5 shrink-0 ${
                          f.included
                            ? "bg-[#EEF3EE] text-[#5A7D66]"
                            : "bg-[#F5F4F2] text-[#C0B8B0]"
                        }`}
                      >
                        {f.included ? "✓" : "–"}
                      </span>
                      <span
                        className={
                          f.included ? "text-[#1A1208]" : "text-[#8B7A6B]"
                        }
                      >
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanClick(plan.name)}
                  disabled={isLoading || loadingPrices}
                  className={`w-full py-3 rounded-full text-sm font-medium font-dm-sans transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                    plan.ctaStyle === "primary"
                      ? "bg-[#D4845A] text-white hover:bg-[#C4734A] shadow-[0_4px_16px_rgba(212,132,90,0.3)]"
                      : plan.ctaStyle === "dark"
                        ? "bg-[#1A1208] text-[#FDF8F2] hover:opacity-85"
                        : "border border-[#E8DDD0] text-[#1A1208] hover:border-[#D4845A] hover:text-[#D4845A] bg-transparent"
                  }`}
                >
                  {isLoading ? "Redirecting..." : plan.cta}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── COMPARE TABLE ── */}
      <section className="max-w-[1160px] mx-auto px-6 md:px-12 py-24">
        <p className="text-center text-[11px] font-medium tracking-[2px] uppercase text-[#D4845A] mb-3">
          Full breakdown
        </p>
        <h2 className="font-playfair text-[clamp(28px,3vw,42px)] tracking-tight text-center mb-12">
          Compare plans
        </h2>
        <div className="border border-[#E8DDD0] rounded-2xl overflow-hidden bg-white overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-[#E8DDD0]">
                <th className="text-left p-5 text-[#8B7A6B] font-medium text-[11px] tracking-[1.5px] uppercase w-1/2">
                  Feature
                </th>
                {plans.map((p) => (
                  <th
                    key={p.name}
                    className={`p-5 text-center font-medium ${
                      p.featured ? "text-[#D4845A]" : "text-[#1A1208]"
                    }`}
                  >
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Cards per month", "1", "Unlimited", "Unlimited"],
                ["Signers per card", "1", "Unlimited", "Unlimited"],
                ["Text messages", "✓", "✓", "✓"],
                ["Photo uploads", "–", "Unlimited", "Unlimited"],
                ["Premium themes", "–", "✓", "✓"],
                ["Scheduled delivery", "–", "✓", "✓"],
                ["PDF download", "–", "✓", "✓"],
                ["Team dashboard", "–", "–", "✓"],
                ["Custom branding", "–", "–", "✓"],
                ["Slack integration", "–", "–", "✓"],
                ["Analytics dashboard", "–", "–", "✓"],
                ["Priority support", "–", "–", "✓"],
              ].map(([feature, free, plus, team], i) => (
                <tr
                  key={feature}
                  className={i % 2 === 0 ? "bg-[#FDF8F2]" : "bg-white"}
                >
                  <td className="p-5 text-[#1A1208] font-medium">{feature}</td>
                  {[free, plus, team].map((val, j) => (
                    <td
                      key={j}
                      className={`p-5 text-center ${
                        val === "✓"
                          ? "text-[#5A7D66] font-medium"
                          : val === "–"
                            ? "text-[#C0B8B0]"
                            : "text-[#1A1208]"
                      }`}
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-[#8B7A6B]">
            Need SSO, advanced analytics, or 50+ team members?{" "}
            <button
              onClick={() => router.push("/contact")}
              className="text-[#D4845A] font-medium hover:underline"
            >
              Contact us for Enterprise →
            </button>
          </p>
        </div>
      </section>

      {/* ── SOCIAL PROOF / LOGOS ── */}
      <section className="max-w-[1160px] mx-auto px-6 md:px-12 py-16 border-t border-[#E8DDD0]">
        <p className="text-center text-xs text-[#8B7A6B] mb-8 tracking-wide">
          TRUSTED BY TEAMS AT
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
          {logos.map((logo) => (
            <span
              key={logo}
              className="text-[#8B7A6B] text-sm font-mono tracking-wider"
            >
              {logo}
            </span>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <div className="bg-[#F5EAD8] py-20 px-6 md:px-12">
        <div className="max-w-[640px] mx-auto">
          <p className="text-center text-[11px] font-medium tracking-[2px] uppercase text-[#D4845A] mb-3">
            Got questions?
          </p>
          <h2 className="font-playfair text-[clamp(28px,3vw,42px)] tracking-tight text-center mb-10">
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
                    className={`text-[#8B7A6B] text-sm transition-transform duration-200 shrink-0 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  >
                    ▾
                  </span>
                </button>
                {openFaq === i && (
                  <p className="text-sm text-[#8B7A6B] leading-[1.75] font-light pb-5">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="bg-[#D4845A] relative overflow-hidden py-24 px-6 md:px-12 text-center">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-white/10 -top-28 -left-24 pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-white/10 -bottom-16 -right-14 pointer-events-none" />
        <h2 className="font-playfair text-[clamp(32px,4vw,52px)] text-white tracking-[-2px] mb-4 relative z-10">
          Someone deserves to feel
          <br />
          celebrated today.
        </h2>
        <p className="text-[17px] text-white/75 mb-9 font-light relative z-10">
          Start a card in 60 seconds — it's free.
        </p>
        <button
          onClick={handleCreateCard}
          className="bg-[#FDF8F2] text-[#D4845A] px-10 py-4 rounded-full text-[15px] font-medium shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:opacity-90 transition-opacity relative z-10"
        >
          Create your first card →
        </button>
        <p className="text-xs text-white/50 mt-4 relative z-10">
          No account needed to sign. No credit card to start.
        </p>
      </div>
    </div>
  );
}
