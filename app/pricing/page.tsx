"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

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

export default function Pricing() {
  const router = useRouter();
  const { isLoaded, user } = useUser();

  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [prices, setPrices] = useState<DbPrice[]>([]);
  const [loadingCheckout, setLoadingCheckout] = useState<string | null>(null);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [userSubscription, setUserSubscription] = useState(null);

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

  useEffect(() => {
    const fetchUserSubscription = async () => {
      try {
        const response = await fetch("/api/user_subscription", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();
        setUserSubscription(data);
      } catch (error) {
        console.error("Error fetching user subscription:", error);
      }
    };

    fetchUserSubscription();
  }, [user, isLoaded]);

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

  const calculateSavings = (monthlyPrice: number, annualPrice: number) => {
    const yearlyTotal = monthlyPrice * 12;
    const savings = yearlyTotal - annualPrice;
    const percentage = yearlyTotal > 0 ? (savings / yearlyTotal) * 100 : 0;
    return { savings, percentage: Math.round(percentage) };
  };

  const formatPrice = (amount: number) => {
    return Number.isInteger(amount) ? amount.toString() : amount.toFixed(2);
  };

  const handlePlanClick = async (planName: Plan["name"]) => {
    if (!user && isLoaded) {
      router.push("/dashboard");
      return;
    }
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
          mode: "subscription",
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

  const handleCreateCard = () => {
    router.push("/create");
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
      monthlyPrice: priceMap.plus.monthly
        ? priceMap.plus.monthly.amountCents / 100
        : 6,
      annualPrice: priceMap.plus.annual
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
      monthlyPrice: priceMap.team.monthly
        ? priceMap.team.monthly.amountCents / 100
        : 18,
      annualPrice: priceMap.team.annual
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

  console.log("User subscription:", userSubscription);

  return (
    <div className="font-dm-sans bg-[#FDF8F2] text-[#1A1208] overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-16 sm:pt-20 pb-14 sm:pb-16 px-4 sm:px-6 md:px-12 text-center">
        <div className="absolute w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,#F5EAD8_0%,transparent_70%)] -top-24 -left-32 opacity-60 pointer-events-none" />
        <div className="absolute w-[380px] h-[380px] rounded-full bg-[radial-gradient(circle,#EEF3EE_0%,transparent_70%)] -bottom-16 -right-16 opacity-50 pointer-events-none" />
        <div className="relative z-10 max-w-[640px] mx-auto">
          <h1 className="font-playfair text-[clamp(34px,8vw,64px)] leading-[1.05] tracking-[-2px] mb-4">
            Start free.
            <br />
            <em className="text-[#D4845A]">Upgrade</em> when it feels right.
          </h1>
          <p className="text-[15px] sm:text-[17px] text-[#8B7A6B] font-light leading-[1.75] mb-8 sm:mb-10 px-2">
            No hidden fees. No surprise charges. Cancel any time.
          </p>

          <div className="inline-flex flex-wrap justify-center bg-[#F5EAD8] rounded-full p-1 gap-1 max-w-full">
            {(["monthly", "annual"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-all font-dm-sans whitespace-nowrap ${
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
      <section className="max-w-[1160px] mx-auto px-4 sm:px-6 md:px-12 pb-16 sm:pb-20 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {plans.map((plan) => {
            const savings =
              plan.monthlyPrice > 0
                ? calculateSavings(plan.monthlyPrice, plan.annualPrice)
                : null;

            const displayPrice =
              plan.monthlyPrice === 0
                ? "$0"
                : billing === "monthly"
                  ? `$${formatPrice(plan.monthlyPrice)}`
                  : `$${formatPrice(plan.annualPrice)}`;

            const isLoading = loadingCheckout === plan.name;

            const getBasePlan = (plan?: string | null) => {
              if (!plan) return null;

              if (plan.includes("plus")) return "plus";
              if (plan.includes("team")) return "team";
              return "free";
            };

            const currentPlan = getBasePlan(userSubscription?.plan);

            const isCurrentPlan = (planName: Plan["name"]) => {
              if (!currentPlan) return false;

              return currentPlan === planName.toLowerCase();
            };

            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 sm:p-8 flex flex-col ${
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
                  <div className="flex items-end sm:items-baseline gap-1 mb-3 flex-wrap">
                    <span className="font-playfair text-[40px] sm:text-[48px] tracking-[-2px] leading-none break-words">
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
                    <div className="text-xs text-[#7B9E87] font-medium mb-2 leading-relaxed">
                      Billed annually · saves ${formatPrice(savings.savings)}/yr
                      ({savings.percentage}% off)
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
                        className={`leading-relaxed ${
                          f.included ? "text-[#1A1208]" : "text-[#8B7A6B]"
                        }`}
                      >
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanClick(plan.name)}
                  disabled={
                    isLoading || loadingPrices || isCurrentPlan(plan.name)
                  }
                  type="button"
                  className={`w-full py-3 rounded-full text-sm font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                    plan.ctaStyle === "primary"
                      ? "bg-[#D4845A] text-white"
                      : plan.ctaStyle === "dark"
                        ? "bg-[#1A1208] text-[#FDF8F2]"
                        : "border border-[#E8DDD0]"
                  }`}
                >
                  {isCurrentPlan(plan.name)
                    ? "Current plan"
                    : isLoading
                      ? "Redirecting..."
                      : plan.cta}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── COMPARE TABLE ── */}
      <section className="max-w-[1160px] mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-20 md:py-24">
        <p className="text-center text-[11px] font-medium tracking-[2px] uppercase text-[#D4845A] mb-3">
          Full breakdown
        </p>
        <h2 className="font-playfair text-[clamp(28px,3vw,42px)] tracking-tight text-center mb-10 sm:mb-12">
          Compare plans
        </h2>
        <div className="border border-[#E8DDD0] rounded-2xl overflow-hidden bg-white overflow-x-auto -mx-1 sm:mx-0">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-[#E8DDD0]">
                <th className="text-left p-4 sm:p-5 text-[#8B7A6B] font-medium text-[11px] tracking-[1.5px] uppercase w-1/2">
                  Feature
                </th>
                {plans.map((p) => (
                  <th
                    key={p.name}
                    className={`p-4 sm:p-5 text-center font-medium ${
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
                  <td className="p-4 sm:p-5 text-[#1A1208] font-medium whitespace-nowrap">
                    {feature}
                  </td>
                  {[free, plus, team].map((val, j) => (
                    <td
                      key={j}
                      className={`p-4 sm:p-5 text-center whitespace-nowrap ${
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

        <div className="text-center mt-8 px-2">
          <p className="text-sm text-[#8B7A6B] leading-relaxed">
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

      {/* ── FAQ ── */}
      <div className="bg-[#F5EAD8] py-16 sm:py-20 px-4 sm:px-6 md:px-12">
        <div className="max-w-160 mx-auto">
          <p className="text-center text-[11px] font-medium tracking-[2px] uppercase text-[#D4845A] mb-3">
            Got questions?
          </p>
          <h2 className="font-playfair text-[clamp(28px,3vw,42px)] tracking-tight text-center mb-8 sm:mb-10">
            Common questions
          </h2>
          <div className="flex flex-col">
            {faqs.map((faq, i) => (
              <div key={i} className="border-t border-[#D8CEBE] last:border-b">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center py-5 text-left font-dm-sans cursor-pointer bg-transparent border-none gap-4"
                >
                  <span className="text-[15px] font-medium text-[#1A1208] pr-2 sm:pr-6 leading-relaxed">
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
                  <p className="text-sm text-[#8B7A6B] leading-[1.75] font-light pb-5 pr-6">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="bg-[#D4845A] relative overflow-hidden py-18 sm:py-24 px-4 sm:px-6 md:px-12 text-center">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-white/10 -top-28 -left-24 pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-white/10 -bottom-16 -right-14 pointer-events-none" />
        <h2 className="font-playfair text-[clamp(30px,7vw,52px)] text-white tracking-[-2px] mb-4 relative z-10">
          Someone deserves to feel
          <br />
          celebrated today.
        </h2>
        <p className="text-[15px] sm:text-[17px] text-white/75 mb-8 sm:mb-9 font-light relative z-10 px-2">
          Start a card in 60 seconds — it's free.
        </p>
        <button
          onClick={handleCreateCard}
          className="bg-[#FDF8F2] text-[#D4845A] px-8 sm:px-10 py-4 rounded-full text-[15px] font-medium shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:opacity-90 transition-opacity relative z-10"
        >
          Create your first card →
        </button>
        <p className="text-xs text-white/50 mt-4 relative z-10 px-2">
          No account needed to sign. No credit card to start.
        </p>
      </div>
    </div>
  );
}
