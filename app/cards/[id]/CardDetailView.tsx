"use client";

// app/dashboard/cards/[id]/CardDetailView.tsx
// The creator's full view of their card — signatures, stats, actions.

import { useState } from "react";
import { useRouter } from "next/navigation";
import DeleteCardDialog from "@/app/components/DeleteCardDialog";
import EditCardPanel from "./EditCardPanel";
import { UserAvatar } from "@clerk/nextjs";

// ─── Types ───────────────────────────────────────────────────
interface Signature {
  id: string;
  signerName: string;
  signerEmail: string | null;
  message: string;
  photoUrl: string | null;
  isHidden: boolean;
  createdAt: Date;
}

interface Card {
  id: string;
  occasion: string;
  recipientName: string;
  recipientEmail: string | null;
  openingMessage: string | null;
  theme: string;
  status: string;
  signingToken: string;
  deliveryToken: string;
  signerCount: number;
  signingDeadline: Date | null;
  scheduledDeliveryAt: Date | null;
  deliveredAt: Date | null;
  createdAt: Date;
  creator: { name: string };
  creatorPhotoUrl: string | null;
  signatures: Signature[];
  _count: { views: number };
}

interface Props {
  card: Card;
}

// ─── Constants ───────────────────────────────────────────────
const themes: Record<string, { from: string; to: string }> = {
  warm: { from: "#FEF3ED", to: "#F5EAD8" },
  sage: { from: "#EEF3EE", to: "#D4E8D4" },
  lavender: { from: "#F0EBF8", to: "#E2D4F0" },
  sky: { from: "#E6F1FB", to: "#C8DFF5" },
  parchment: { from: "#FDF8F2", to: "#EDE0CE" },
  midnight: { from: "#1A1208", to: "#2E2820" },
};

const avatarColors = [
  { bg: "#F5EAD8", text: "#C4734A" },
  { bg: "#EEF3EE", text: "#5A7D66" },
  { bg: "#F0EBF8", text: "#6B5A9E" },
  { bg: "#E6F1FB", text: "#185FA5" },
  { bg: "#FAE8DE", text: "#993C1D" },
];

const occasionEmojis: Record<string, string> = {
  Birthday: "🎂",
  Farewell: "👋",
  Congratulations: "🎊",
  Wedding: "💍",
  "New Baby": "🍼",
  "Get Well Soon": "🏥",
  Graduation: "🎓",
  "Thank You": "🙏",
  Holiday: "🎄",
  "Work Anniversary": "💼",
  "Just Because": "🌟",
  Sympathy: "💔",
};

const statusConfig: Record<
  string,
  { label: string; dot: string; bg: string; text: string }
> = {
  draft: {
    label: "Draft",
    dot: "bg-[#C5B8AD]",
    bg: "bg-[#F5F4F2]",
    text: "text-[#8C7B6B]",
  },
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
  archived: {
    label: "Archived",
    dot: "bg-[#C5B8AD]",
    bg: "bg-[#F5F4F2]",
    text: "text-[#8C7B6B]",
  },
};

// ─── Helpers ─────────────────────────────────────────────────
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function timeAgoLabel(date: Date) {
  const mins = Math.round((Date.now() - new Date(date).getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
}

// ─── Component ───────────────────────────────────────────────
export default function CardDetailView({ card }: Props) {
  const router = useRouter();

  const [linkCopied, setLinkCopied] = useState(false);
  const [isDelivering, setIsDelivering] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [hidingId, setHidingId] = useState<string | null>(null);
  const [signatures, setSignatures] = useState<Signature[]>(card.signatures);
  const [deliverError, setDeliverError] = useState<string | null>(null);
  const [showDeliver, setShowDeliver] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [recipientLinkCopied, setRecipientLinkCopied] = useState(false);

  const theme = themes[card.theme] ?? themes.warm;
  const isMidnight = card.theme === "midnight";
  const emoji = occasionEmojis[card.occasion] ?? "🎉";
  const status = statusConfig[card.status] ?? statusConfig.draft;
  const signingUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/sign/${card.signingToken}`;
  const visibleSigs = signatures.filter((s) => !s.isHidden);
  const hiddenSigs = signatures.filter((s) => s.isHidden);

  // ── Copy signing link ───────────────────────────────────────
  function handleCopyLink() {
    navigator.clipboard.writeText(signingUrl).catch(() => {});
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  }

  const handleCopyRecipientLink = () => {
    const url = `${window.location.origin}/card/${card.deliveryToken}`;
    navigator.clipboard.writeText(url).catch(() => {});
    setRecipientLinkCopied(true);
    setTimeout(() => {
      setRecipientLinkCopied(false);
    }, 5000);
  };

  // ── Toggle message visibility ───────────────────────────────
  async function handleToggleHide(sigId: string, currentlyHidden: boolean) {
    setHidingId(sigId);
    try {
      const res = await fetch(`/api/cards/${card.id}/signatures/${sigId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden: !currentlyHidden }),
      });
      if (res.ok) {
        setSignatures((prev) =>
          prev.map((s) =>
            s.id === sigId ? { ...s, isHidden: !currentlyHidden } : s,
          ),
        );
      }
    } finally {
      setHidingId(null);
    }
  }

  // ── Deliver card ────────────────────────────────────────────
  async function handleDeliver() {
    setIsDelivering(true);
    setDeliverError(null);
    try {
      const res = await fetch(`/api/cards/${card.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "delivered" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setDeliverError(data.error ?? "Something went wrong.");
        return;
      }
      router.refresh();
    } finally {
      setIsDelivering(false);
      setShowDeliver(false);
    }
  }

  // ── Archive card ────────────────────────────────────────────
  async function handleArchive() {
    setIsArchiving(true);
    try {
      await fetch(`/api/cards/${card.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "archived" }),
      });
      router.push("/dashboard");
    } finally {
      setIsArchiving(false);
    }
  }

  return (
    <>
      {/* Edit panel — renders on top when open */}
      {showEdit && (
        <EditCardPanel
          cardId={card.id}
          initial={{
            occasion: card.occasion,
            recipientName: card.recipientName,
            recipientEmail: card.recipientEmail,
            openingMessage: card.openingMessage,
            theme: card.theme,
            signingDeadline: card.signingDeadline,
            scheduledDeliveryAt: card.scheduledDeliveryAt,
          }}
          onClose={() => setShowEdit(false)}
        />
      )}

      <div className="font-dm-sans bg-[#F5F0E8] text-[#1A1208] min-h-screen">
        {/* NAV */}
        <nav className="sticky top-0  flex items-center justify-between px-8 h-16 bg-[rgba(245,240,232,0.95)] backdrop-blur-md border-b border-[#E8DDD0]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm text-[#8C7B6B] hover:text-[#1A1208] transition-colors flex items-center gap-1.5 bg-transparent border-none cursor-pointer font-dm-sans p-0"
            >
              ← Dashboard
            </button>
            <span className="text-[#E8DDD0]">/</span>
            <span className="text-sm font-medium truncate max-w-[200px]">
              {card.occasion} · {card.recipientName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Status pill */}
            <div
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${status.bg} ${status.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </div>
          </div>

          {card.status === "collecting" && (
            <button
              onClick={() => setShowEdit(true)}
              className="flex items-center gap-1.5 text-sm border border-[#E8DDD0] px-4 py-1.5 rounded-full text-[#8C7B6B] hover:border-terracotta hover:text-terracotta transition-all bg-transparent cursor-pointer font-dm-sans"
            >
              ✎ Edit card
            </button>
          )}
        </nav>

        <div className="max-w-[1060px] mx-auto px-8 py-8">
          <div className="grid grid-cols-[1fr_320px] gap-8 items-start">
            {/* ── LEFT: MAIN CONTENT ── */}
            <div className="flex flex-col gap-6">
              {/* Card preview banner */}
              <div className="rounded-2xl overflow-hidden border border-[#E8DDD0] shadow-[0_4px_24px_rgba(26,18,8,0.06)]">
                <div
                  className="p-8 text-center"
                  style={{
                    background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
                  }}
                >
                  <div className="text-[10px] font-medium tracking-[2px] uppercase text-terracotta mb-2">
                    {emoji} {card.occasion}
                  </div>
                  <h1
                    className="font-playfair text-[32px] tracking-tight mb-2"
                    style={{ color: isMidnight ? "#FDF8F2" : "#1A1208" }}
                  >
                    {card.occasion === "Birthday"
                      ? `Happy Birthday, ${card.recipientName}!`
                      : `${card.occasion}, ${card.recipientName}!`}
                  </h1>
                  {card.openingMessage && (
                    <p
                      className="text-sm font-light leading-[1.75] italic max-w-[480px] mx-auto"
                      style={{
                        color: isMidnight
                          ? "rgba(253,248,242,0.75)"
                          : "#3A2F27",
                      }}
                    >
                      "{card.openingMessage}"
                    </p>
                  )}
                </div>

                {/* Cover photo preview */}
                {card.creatorPhotoUrl && (
                  <div className="w-full max-h-100 flex items-center justify-center bg-[#F5F4F2] overflow-hidden">
                    <img
                      src={`https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${card.creatorPhotoUrl}`}
                      alt="Cover"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                )}

                {/* Card meta strip */}
                <div className="bg-white px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-5">
                    <div className="text-center">
                      <div className="font-playfair text-[28px] tracking-tight text-terracotta leading-none">
                        {card.signerCount}
                      </div>
                      <div className="text-[10px] text-[#8C7B6B] mt-0.5 font-medium uppercase tracking-[1px]">
                        {card.signerCount === 1 ? "signature" : "signatures"}
                      </div>
                    </div>
                    <div className="w-px h-8 bg-[#E8DDD0]" />
                    <div className="text-center">
                      <div className="font-playfair text-[28px] tracking-tight text-[#1A1208] leading-none">
                        {card._count.views}
                      </div>
                      <div className="text-[10px] text-[#8C7B6B] mt-0.5 font-medium uppercase tracking-[1px]">
                        {card._count.views === 1 ? "view" : "views"}
                      </div>
                    </div>
                    {card.signingDeadline && (
                      <>
                        <div className="w-px h-8 bg-[#E8DDD0]" />
                        <div className="text-center">
                          <div className="text-sm font-medium text-[#1A1208]">
                            {new Date(card.signingDeadline).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" },
                            )}
                          </div>
                          <div className="text-[10px] text-[#8C7B6B] mt-0.5 font-medium uppercase tracking-[1px]">
                            Deadline
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-[#8C7B6B] font-light">
                    Created {formatDate(card.createdAt)}
                    {card.deliveredAt &&
                      ` · Delivered ${formatDate(card.deliveredAt)}`}
                  </div>
                </div>
              </div>

              {/* Signing link — only show while collecting */}
              {card.status === "collecting" && (
                <div className="bg-white border border-[#E8DDD0] rounded-2xl p-5">
                  <div className="text-[11px] font-medium tracking-[1.5px] uppercase text-[#8C7B6B] mb-3">
                    Signing link
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="flex-1 px-3 py-2.5 border border-[#E8DDD0] rounded-xl text-sm font-mono text-[#8C7B6B] bg-[#FAFAFA] overflow-hidden text-ellipsis whitespace-nowrap">
                      {signingUrl}
                    </div>
                    <button
                      onClick={handleCopyLink}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all font-dm-sans border-none cursor-pointer shrink-0 ${
                        linkCopied
                          ? "bg-[#7B9E87] text-white"
                          : "bg-terracotta text-white hover:bg-[#C4734A]"
                      }`}
                    >
                      {linkCopied ? "✓ Copied!" : "Copy link"}
                    </button>
                  </div>
                  <p className="text-xs text-[#8C7B6B] mt-2 font-light">
                    Share this link with anyone you'd like to sign the card. No
                    account needed.
                  </p>
                </div>
              )}

              {/* Signatures */}
              <div className="bg-white border border-[#E8DDD0] rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-[#E8DDD0] flex items-center justify-between">
                  <div>
                    <h2 className="font-playfair text-[20px] tracking-tight">
                      Messages
                    </h2>
                    <p className="text-xs text-[#8C7B6B] font-light mt-0.5">
                      {visibleSigs.length} visible
                      {hiddenSigs.length > 0 &&
                        ` · ${hiddenSigs.length} hidden`}
                    </p>
                  </div>
                  {card.status === "collecting" && (
                    <div className="text-xs text-[#8C7B6B] font-light">
                      You can hide messages before delivering
                    </div>
                  )}
                </div>

                {signatures.length === 0 ? (
                  <div className="py-16 text-center text-[#8C7B6B]">
                    <div className="text-4xl mb-3">🖊</div>
                    <p className="text-sm font-light">No messages yet.</p>
                    <p className="text-xs mt-1 font-light">
                      Share the signing link to get started.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#E8DDD0]">
                    {signatures.map((sig, i) => {
                      const c = avatarColors[i % avatarColors.length];
                      return (
                        <div
                          key={sig.id}
                          className={`px-6 py-5 flex gap-4 transition-colors ${
                            sig.isHidden
                              ? "bg-[#FAFAFA] opacity-50"
                              : "bg-white"
                          }`}
                        >
                          {/* Avatar */}
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-0.5"
                            style={{ background: c.bg, color: c.text }}
                          >
                            <UserAvatar />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-3 mb-1.5">
                              <div>
                                <span className="text-sm font-medium">
                                  {sig.signerName}
                                </span>
                                {sig.signerEmail && (
                                  <span className="text-xs text-[#8C7B6B] ml-2">
                                    {sig.signerEmail}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs text-[#8C7B6B]">
                                  {timeAgoLabel(sig.createdAt)}
                                </span>
                                {/* Hide/show toggle — only available before delivery */}
                                {card.status !== "delivered" && (
                                  <button
                                    onClick={() =>
                                      handleToggleHide(sig.id, sig.isHidden)
                                    }
                                    disabled={hidingId === sig.id}
                                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all font-dm-sans cursor-pointer ${
                                      sig.isHidden
                                        ? "border-[#7B9E87] text-[#7B9E87] bg-[#EEF3EE] hover:bg-[#D4E8D4]"
                                        : "border-[#E8DDD0] text-[#8C7B6B] bg-white hover:border-red-300 hover:text-red-400"
                                    }`}
                                  >
                                    {hidingId === sig.id
                                      ? "…"
                                      : sig.isHidden
                                        ? "Show"
                                        : "Hide"}
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-[#3A2F27] leading-[1.7]">
                              {sig.message}
                            </p>
                            {sig.photoUrl && (
                              <div className="mt-3 rounded-xl overflow-hidden border border-[#E8DDD0] max-w-70">
                                <img
                                  src={`https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${sig.photoUrl}`}
                                  alt={`Photo from ${sig.signerName}`}
                                  className="w-full h-auto object-cover max-h-105"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: SIDEBAR ── */}
            <div className="sticky top-24 flex flex-col gap-4">
              {/* Primary action */}
              {card.status === "collecting" && (
                <div className="bg-white border border-[#E8DDD0] rounded-2xl p-5">
                  <h3 className="font-playfair text-[18px] tracking-tight mb-1">
                    Ready to deliver?
                  </h3>
                  <p className="text-xs text-[#8C7B6B] font-light leading-[1.7] mb-4">
                    Once delivered, {card.recipientName} will receive a link to
                    view all {card.signerCount} message
                    {card.signerCount !== 1 ? "s" : ""}. This can't be undone.
                  </p>

                  {!showDeliver ? (
                    <button
                      onClick={() => setShowDeliver(true)}
                      disabled={card.signerCount === 0}
                      className={`w-full py-3 rounded-full text-sm font-medium transition-all font-dm-sans border-none ${
                        card.signerCount === 0
                          ? "bg-[#E8DDD0] text-[#C5B8AD] cursor-not-allowed"
                          : "bg-terracotta text-white hover:bg-[#C4734A] cursor-pointer shadow-[0_4px_16px_rgba(212,132,90,0.25)]"
                      }`}
                    >
                      Deliver card 🎉
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <p className="text-xs text-[#8C7B6B] text-center font-light mb-1">
                        Are you sure? This is permanent.
                      </p>
                      <button
                        onClick={handleDeliver}
                        disabled={isDelivering}
                        className="w-full py-3 rounded-full text-sm font-medium bg-terracotta text-white hover:bg-[#C4734A] transition-colors font-dm-sans border-none cursor-pointer"
                      >
                        {isDelivering ? "Delivering…" : "Yes, deliver now"}
                      </button>
                      <button
                        onClick={() => setShowDeliver(false)}
                        className="w-full py-2.5 rounded-full text-sm border border-[#E8DDD0] text-[#8C7B6B] hover:border-terracotta hover:text-terracotta transition-all font-dm-sans bg-white cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {deliverError && (
                    <p className="text-xs text-red-500 text-center mt-2">
                      {deliverError}
                    </p>
                  )}

                  {card.signerCount === 0 && (
                    <p className="text-xs text-[#8C7B6B] text-center mt-2 font-light">
                      Add at least one signature first
                    </p>
                  )}
                </div>
              )}

              {/* Delivered — show recipient link */}
              {card.status === "delivered" && (
                <div className="bg-[#EEF3EE] border border-[#C5DEC5] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">✓</span>
                    <h3 className="font-playfair text-[18px] tracking-tight text-[#3B6D11]">
                      Card delivered!
                    </h3>
                  </div>
                  <p className="text-xs text-[#5A7D66] font-light leading-[1.7] mb-4">
                    {card.deliveredAt
                      ? `Delivered on ${formatDate(card.deliveredAt)}.`
                      : "Delivered."}{" "}
                    {card.recipientName} can view the card at the link below.
                  </p>
                  <button
                    onClick={handleCopyRecipientLink}
                    className="w-full py-2.5 rounded-full text-xs font-medium bg-[#5A7D66] text-white hover:bg-[#3B6D11] transition-colors font-dm-sans border-none cursor-pointer"
                  >
                    {recipientLinkCopied
                      ? "Recipient link copied!"
                      : " Copy recipient link"}
                  </button>
                </div>
              )}

              {/* Card details */}
              <div className="bg-white border border-[#E8DDD0] rounded-2xl p-5">
                <div className="text-[11px] font-medium tracking-[1.5px] uppercase text-[#8C7B6B] mb-4">
                  Card details
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Recipient", value: card.recipientName },
                    { label: "Email", value: card.recipientEmail ?? "—" },
                    { label: "Occasion", value: card.occasion },
                    {
                      label: "Theme",
                      value:
                        card.theme.charAt(0).toUpperCase() +
                        card.theme.slice(1),
                    },
                    { label: "Created", value: formatDate(card.createdAt) },
                    ...(card.signingDeadline
                      ? [
                          {
                            label: "Deadline",
                            value: formatDate(card.signingDeadline),
                          },
                        ]
                      : []),
                    ...(card.scheduledDeliveryAt
                      ? [
                          {
                            label: "Scheduled",
                            value: formatDate(card.scheduledDeliveryAt),
                          },
                        ]
                      : []),
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex justify-between items-start gap-3"
                    >
                      <span className="text-xs text-[#8C7B6B] shrink-0">
                        {row.label}
                      </span>
                      <span className="text-xs font-medium text-right truncate max-w-[160px]">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danger zone */}

              <div className="bg-white border border-[#E8DDD0] rounded-2xl p-5">
                <div className="text-[11px] font-medium tracking-[1.5px] uppercase text-[#8C7B6B] mb-3">
                  Danger zone
                </div>
                <button
                  onClick={() => setOpenDeleteDialog(true)}
                  disabled={isArchiving}
                  className="w-full py-2.5 rounded-full text-xs font-medium border border-[#E8DDD0] text-[#8C7B6B] hover:border-red-300 hover:text-red-400 transition-all font-dm-sans bg-white cursor-pointer"
                >
                  {isArchiving ? "Deleting…" : "Delete this card"}
                </button>
                <p className="text-[10px] text-[#C5B8AD] text-center mt-2 font-light">
                  Deletes the card. Signers and recipients lose all access.
                </p>
              </div>
            </div>
          </div>
        </div>
        <DeleteCardDialog
          open={openDeleteDialog}
          onOpenChange={setOpenDeleteDialog}
          cardId={card.id}
        />
      </div>
    </>
  );
}
