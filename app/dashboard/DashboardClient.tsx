"use client";

import { useState } from "react";
import CardGridItem from "../components/CardGridItem";
import { getUser } from "@/lib/helpers/getUser";
import { useUser } from "@clerk/nextjs";

type CardStatus = "collecting" | "delivered" | "draft";

interface Card {
  id: string;
  occasion: string;
  emoji: string;
  recipient: string;
  status: CardStatus;
  signers: number;
  deadline: string | null;
  deliveredOn: string | null;
  theme: { from: string; to: string };
  createdAt: string;
}

const cards: Card[] = [
  {
    id: "1",
    occasion: "Birthday",
    emoji: "🎂",
    recipient: "Sarah Chen",
    status: "collecting",
    signers: 8,
    deadline: "Mar 20, 2026",
    deliveredOn: null,
    theme: { from: "#FEF3ED", to: "#F5EAD8" },
    createdAt: "Mar 14, 2026",
  },
  {
    id: "2",
    occasion: "Farewell",
    emoji: "👋",
    recipient: "James Morley",
    status: "collecting",
    signers: 5,
    deadline: "Mar 22, 2026",
    deliveredOn: null,
    theme: { from: "#EEF3EE", to: "#D4E8D4" },
    createdAt: "Mar 13, 2026",
  },
  {
    id: "3",
    occasion: "Congratulations",
    emoji: "🎊",
    recipient: "Priya Rajan",
    status: "delivered",
    signers: 14,
    deadline: null,
    deliveredOn: "Mar 10, 2026",
    theme: { from: "#F0EBF8", to: "#E2D4F0" },
    createdAt: "Mar 5, 2026",
  },
  {
    id: "4",
    occasion: "Work Anniversary",
    emoji: "💼",
    recipient: "Tom Keller",
    status: "delivered",
    signers: 22,
    deadline: null,
    deliveredOn: "Feb 28, 2026",
    theme: { from: "#E6F1FB", to: "#C8DFF5" },
    createdAt: "Feb 22, 2026",
  },
  {
    id: "5",
    occasion: "Birthday",
    emoji: "🎂",
    recipient: "Leila Bashir",
    status: "draft",
    signers: 0,
    deadline: null,
    deliveredOn: null,
    theme: { from: "#FDF8F2", to: "#EDE0CE" },
    createdAt: "Mar 15, 2026",
  },
  {
    id: "6",
    occasion: "Get Well Soon",
    emoji: "🏥",
    recipient: "Ravi Nair",
    status: "delivered",
    signers: 9,
    deadline: null,
    deliveredOn: "Feb 14, 2026",
    theme: { from: "#EEF3EE", to: "#D4E8D4" },
    createdAt: "Feb 10, 2026",
  },
];

const statusConfig: Record<
  CardStatus,
  { label: string; dot: string; bg: string; text: string }
> = {
  collecting: {
    label: "Collecting",
    dot: "bg-[#D4845A]",
    bg: "bg-[#FEF3ED]",
    text: "text-[#D4845A]",
  },
  delivered: {
    label: "Delivered",
    dot: "bg-[#7B9E87]",
    bg: "bg-[#EEF3EE]",
    text: "text-[#5A7D66]",
  },
  draft: {
    label: "Draft",
    dot: "bg-[#C5B8AD]",
    bg: "bg-[#F5F4F2]",
    text: "text-[#8C7B6B]",
  },
};

const tabs = ["All", "Collecting", "Delivered", "Drafts"];

const activity = [
  {
    icon: "🖊",
    text: "Amy L. signed Sarah Chen's Birthday card",
    time: "2 hours ago",
    color: "#E6F1FB",
  },
  {
    icon: "🔗",
    text: "You shared the signing link for James Morley's Farewell card",
    time: "5 hours ago",
    color: "#EEF3EE",
  },
  {
    icon: "🎉",
    text: "Priya Rajan's Congratulations card was delivered",
    time: "4 days ago",
    color: "#F0EBF8",
  },
  {
    icon: "🖊",
    text: "Marcus W. signed Sarah Chen's Birthday card",
    time: "4 days ago",
    color: "#F5EAD8",
  },
  {
    icon: "＋",
    text: "You created a Birthday card for Sarah Chen",
    time: "5 days ago",
    color: "#FEF3ED",
  },
];

export default function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const stats = [
    { label: "Cards created", value: user.cards.length, sub: "All time" },
    {
      label: "Total signatures",
      value: user.signatures.length,
      sub: "Across all cards",
    },
    { label: "Cards delivered", value: "3", sub: "This month" },
    { label: "Avg. signers", value: "12", sub: "Per card" },
  ];

  const filtered = cards.filter((c) => {
    const matchTab =
      activeTab === "All" ||
      (activeTab === "Collecting" && c.status === "collecting") ||
      (activeTab === "Delivered" && c.status === "delivered") ||
      (activeTab === "Drafts" && c.status === "draft");
    const matchSearch =
      c.recipient.toLowerCase().includes(search.toLowerCase()) ||
      c.occasion.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="font-dm-sans bg-[#F5F0E8] text-[#1A1208] min-h-screen flex">
      {/* ── MAIN ── */}
      <div className="flex-1 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-8 h-16 bg-[rgba(245,240,232,0.95)] backdrop-blur-md border-b border-[#E8DDD0]">
          <h1 className="font-playfair text-[22px] tracking-tight">
            Hi, {user?.name}
          </h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-taupe text-sm pointer-events-none">
                🔍
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cards…"
                className="pl-9 pr-4 py-2 border border-[#E8DDD0] rounded-full text-sm bg-white outline-none focus:border-terracotta transition-colors font-dm-sans placeholder:text-[#C5B8AD] w-52"
              />
            </div>
            <button className="flex items-center gap-2 bg-terracotta text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#C4734A] transition-colors shadow-[0_4px_12px_rgba(212,132,90,0.25)] font-dm-sans border-none cursor-pointer">
              <span>＋</span> New card
            </button>
          </div>
        </div>

        <div className="px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white border border-[#E8DDD0] rounded-2xl p-5"
              >
                <div className="text-xs text-muted-taupe font-medium mb-1">
                  {s.label}
                </div>
                <div className="font-playfair text-[36px] tracking-[-1px] leading-tight">
                  {s.value}
                </div>
                <div className="text-[11px] text-muted-taupe font-light mt-1">
                  {s.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Tabs + count */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex gap-1 bg-white border border-[#E8DDD0] rounded-full p-1">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all font-dm-sans border-none cursor-pointer ${
                    activeTab === t
                      ? "bg-[#1A1208] text-[#FDF8F2]"
                      : "text-muted-taupe hover:text-[#1A1208] bg-transparent"
                  }`}
                >
                  {t}
                  {t !== "All" && (
                    <span className="ml-1.5 text-[10px] opacity-60">
                      {t === "Collecting"
                        ? cards.filter((c) => c.status === "collecting").length
                        : t === "Delivered"
                          ? cards.filter((c) => c.status === "delivered").length
                          : cards.filter((c) => c.status === "draft").length}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="text-xs text-muted-taupe">
              {filtered.length} card{filtered.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Cards grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-muted-taupe">
              <div className="text-4xl mb-3">🔍</div>
              <div className="text-sm font-light">
                No cards match your search.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-5">
              {filtered.map((card) => {
                const s = statusConfig[card.status];
                return (
                  <div key={card.id}>
                    <CardGridItem
                      menuOpen={menuOpen}
                      setMenuOpen={setMenuOpen}
                      card={card}
                      s={s}
                    />
                  </div>
                );
              })}

              {/* New card tile */}
              <button className="border-2 border-dashed border-[#E8DDD0] rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-terracotta hover:bg-[#FEF3ED]/30 transition-all group cursor-pointer bg-transparent min-h-[200px]">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#E8DDD0] group-hover:border-terracotta flex items-center justify-center text-xl text-muted-taupe group-hover:text-terracotta transition-all">
                  ＋
                </div>
                <span className="text-sm font-medium text-muted-taupe group-hover:text-terracotta transition-colors">
                  New card
                </span>
              </button>
            </div>
          )}

          {/* Recent activity */}
          <div className="mt-10">
            <h2 className="font-playfair text-[20px] tracking-tight mb-4">
              Recent activity
            </h2>
            <div className="bg-white border border-[#E8DDD0] rounded-2xl overflow-hidden">
              {activity.map((a, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 px-5 py-3.5 ${i < activity.length - 1 ? "border-b border-[#E8DDD0]" : ""}`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                    style={{ background: a.color }}
                  >
                    {a.icon}
                  </div>
                  <div className="flex-1 text-sm">{a.text}</div>
                  <div className="text-xs text-muted-taupe shrink-0">
                    {a.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
