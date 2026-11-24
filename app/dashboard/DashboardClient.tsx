"use client";

import { useState } from "react";
import CardGridItem from "../components/CardGridItem";
import { useRouter } from "next/navigation";
import { CARD_THEMES } from "@/lib/theme";
import { getTheme } from "@/lib/theme";

type CardStatus = "collecting" | "delivered";

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
};

const tabs = ["All", "Collecting", "Delivered"];

const mapActivity = (type: string, payload: any, createdAt?: string) => {
  switch (type) {
    case "new_signature":
      return {
        icon: "🖊",
        text: `${payload?.signerName ?? "Someone"} signed ${payload?.cardTitle ?? "a card"}`,
        time: formatTimeAgo(createdAt),
        color: "#E6F1FB",
      };

    case "card_edited":
      return {
        icon: "📝",
        text: payload?.title ?? "Card edited",
        time: formatTimeAgo(createdAt),
        color: "#FDECEC",
      };

    case "create_card":
      return {
        icon: "＋",
        text: payload?.title ?? "Card created",
        time: formatTimeAgo(createdAt),
        color: "#FEF3ED",
      };

    case "card_delivered":
      return {
        icon: "🎉",
        text: `${payload?.cardTitle ?? "Card"} was delivered`,
        time: formatTimeAgo(createdAt),
        color: "#F0EBF8",
      };

    default:
      return null;
  }
};

function formatTimeAgo(date?: string) {
  if (!date) return "";

  const diff = Date.now() - new Date(date).getTime();

  if (!Number.isFinite(diff)) return "";

  const mins = Math.floor(diff / 60000);

  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;

  return `${Math.floor(mins / 1440)}d ago`;
}

type User = {
  name?: string;
  notifications?: Array<{
    type: string;
    payload: any;
    createdAt?: string;
  }>;
  cards?: Array<any>;
  signatures?: Array<any>;
  lifetimeCardsCreated?: number;
  plan?: string;
  cardsRemaining?: number;
};

export default function Dashboard({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const activity = (user.notifications ?? [])
    .sort(
      (a, b) =>
        (b.createdAt ? new Date(b.createdAt).getTime() : 0) -
        (a.createdAt ? new Date(a.createdAt).getTime() : 0),
    )
    .slice(0, 5)
    .map((n) => mapActivity(n.type, n.payload, n.createdAt))
    .filter(Boolean);

  const { cards, signatures } = user;

  type NormalizedCard = {
    id: string;
    occasion: string;
    recipient: string;
    status: CardStatus;
    signers: number;
    cardTheme: string;
    signingDeadline: string | null;
    creatorPhotoUrl?: string | null;
    deliveredOn: string | null;
    createdAt: string;
    theme: {
      from: string;
      to: string;
    };
  };

  const normalizedCards: NormalizedCard[] = (cards ?? []).map((card: any) => {
    const cardTheme = getTheme(card.theme);

    return {
      id: card.id,
      occasion: card.occasion ?? "",
      recipient: card.recipientName ?? "",
      status: card.status as CardStatus,
      signers: card.signerCount ?? 0,
      cardTheme: card.theme ?? "warm",
      signingDeadline: card.signingDeadline ?? null,
      creatorPhotoUrl: card.creatorPhotoUrl ?? null,
      deliveredOn: card.deliveredAt
        ? new Date(card.deliveredAt).toLocaleDateString()
        : null,

      createdAt: card.createdAt,

      theme: {
        from: cardTheme.from,
        to: cardTheme.to,
      },
    };
  });

  const stats = [
    { label: "Current cards", value: cards?.length ?? "0", sub: "" },
    {
      label: "Total signatures",
      value: signatures?.length ?? "0",
      sub: "Across all cards",
    },
    {
      label: "Lifetime Cards Created",
      value: user.lifetimeCardsCreated ?? 0,
      sub: "This account",
    },
    {
      label: "Cards Remaining",
      value: user.cardsRemaining ?? 0,
      sub: "",
    },
  ];

  const filtered = normalizedCards.filter((card) => {
    const matchTab =
      activeTab === "All" ||
      (activeTab === "Collecting" && card.status === "collecting") ||
      (activeTab === "Delivered" && card.status === "delivered");

    const matchSearch =
      card.recipient.toLowerCase().includes(search.toLowerCase()) ||
      card.occasion.toLowerCase().includes(search.toLowerCase());

    return matchTab && matchSearch;
  });

  const router = useRouter();

  const disableCreate = (user.cardsRemaining ?? 0) < 1;

  const handleCreateCard = () => {
    if (disableCreate) return;

    router.push("/create");
  };

  return (
    <div className="font-dm-sans bg-[#F5F0E8] text-[#1A1208] min-h-screen flex">
      {/* MAIN */}
      <div className="flex-1 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4 sm:py-0 sm:h-16 bg-[rgba(245,240,232,0.95)] backdrop-blur-md border-b border-[#E8DDD0]">
          <h1 className="font-playfair text-[20px] sm:text-[22px] tracking-tight">
            Hi, {user?.name?.split(" ")[0]}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-taupe text-sm pointer-events-none">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cards…"
                className="pl-9 pr-4 py-2 border border-[#E8DDD0] rounded-full text-sm bg-white outline-none focus:border-terracotta transition-colors font-dm-sans placeholder:text-[#C5B8AD] w-full sm:w-52"
              />
            </div>

            <button
              disabled={disableCreate}
              onClick={handleCreateCard}
              className={`flex items-center justify-center gap-2 bg-terracotta text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#C4734A] transition-colors shadow-[0_4px_12px_rgba(212,132,90,0.25)] font-dm-sans border-none cursor-pointer whitespace-nowrap ${
                disableCreate &&
                "cursor-not-allowed opacity-50 hover:bg-terracotta"
              }`}
            >
              <span>＋</span> New card
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white border border-[#E8DDD0] rounded-2xl p-5"
              >
                <div className="text-xs text-muted-taupe font-medium mb-1">
                  {s.label}
                </div>

                <div className="font-playfair text-[30px] sm:text-[36px] tracking-[-1px] leading-tight">
                  {s.value}
                </div>

                <div className="text-[11px] text-muted-taupe font-light mt-1">
                  {s.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Tabs + count */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div className="overflow-x-auto">
              <div className="flex gap-1 bg-white border border-[#E8DDD0] rounded-full p-1 w-max min-w-full sm:min-w-0">
                {tabs.map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all font-dm-sans border-none cursor-pointer whitespace-nowrap ${
                      activeTab === t
                        ? "bg-[#1A1208] text-[#FDF8F2]"
                        : "text-muted-taupe hover:text-[#1A1208] bg-transparent"
                    }`}
                  >
                    {t}

                    {t !== "All" && (
                      <span className="ml-1.5 text-[10px] opacity-60">
                        {t === "Collecting"
                          ? cards?.filter(
                              (card: any) => card.status === "collecting",
                            ).length
                          : cards?.filter(
                              (card: any) => card.status === "delivered",
                            ).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-muted-taupe">
              {filtered.length} card{filtered.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Cards grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 sm:py-24 text-muted-taupe">
              <div className="text-4xl mb-3">🔍</div>
              <div className="text-sm font-light">
                No cards match your search.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((card) => {
                const status = statusConfig[card.status as CardStatus];

                return (
                  <CardGridItem
                    key={card.id}
                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen}
                    card={card}
                    status={status}
                  />
                );
              })}

              <button
                onClick={handleCreateCard}
                disabled={disableCreate}
                className={`border-2 border-dashed border-[#E8DDD0] rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-terracotta hover:bg-[#FEF3ED]/30 transition-all group cursor-pointer bg-transparent min-h-[200px] ${
                  disableCreate &&
                  "cursor-not-allowed opacity-50 hover:border-[#E8DDD0] hover:bg-transparent"
                }`}
              >
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
            <h2 className="font-playfair text-[18px] sm:text-[20px] tracking-tight mb-4">
              Recent activity
            </h2>

            <div className="bg-white border border-[#E8DDD0] rounded-2xl overflow-hidden">
              {activity.map((a, i) => (
                <div
                  key={i}
                  className={`flex items-start sm:items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 ${
                    i < activity.length - 1 ? "border-b border-[#E8DDD0]" : ""
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                    style={{ background: a && a.color ? a.color : undefined }}
                  >
                    {a && a.icon}
                  </div>

                  <div className="flex-1 text-sm leading-relaxed min-w-0 break-words">
                    {a && a.text}
                  </div>

                  <div className="text-xs text-muted-taupe shrink-0 whitespace-nowrap self-start sm:self-auto">
                    {a && a.time}
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
