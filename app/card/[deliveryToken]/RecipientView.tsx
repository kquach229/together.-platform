"use client";

import { getGreeting, getOccasionEmoji } from "@/lib/helpers/greeting";
import { imageUrl } from "@/lib/helpers/imageUrl";
import { getTheme } from "@/lib/theme";
import { useState } from "react";

// Bubble background colours — cycle through these for variety
const bubbleColors = [
  { bg: "#FEF3ED", avatar: "#F5EAD8", avatarText: "#C4734A" },
  { bg: "#EEF3EE", avatar: "#D4E8D4", avatarText: "#5A7D66" },
  { bg: "#F0EBF8", avatar: "#E2D4F0", avatarText: "#6B5A9E" },
  { bg: "#E6F1FB", avatar: "#C8DFF5", avatarText: "#185FA5" },
  { bg: "#FAE8DE", avatar: "#F5D5C0", avatarText: "#993C1D" },
  { bg: "#FFFFFF", avatar: "#F5EAD8", avatarText: "#C4734A" },
];

interface Signature {
  id: string;
  signerName: string;
  message: string;
  photoUrl: string | null;
  createdAt: Date;
}

interface Card {
  id: string;
  occasion: string;
  recipientName: string;
  openingMessage: string | null;
  theme: string;
  status: string;
  deliveredAt: Date | null;
  signerCount: number;
  creator: { name: string };
  signatures: Signature[];
  creatorPhotoUrl?: string | null;
}

interface Props {
  card: Card;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function RecipientView({ card }: Props) {
  const [copied, setCopied] = useState(false);

  const theme = getTheme(card.theme);
  const heading = getGreeting(card.occasion, card.recipientName);
  const emoji = getOccasionEmoji(card.occasion);
  const photoCount = card.signatures.filter((s) => s.photoUrl).length;

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="font-dm-sans bg-[#FDF8F2] text-[#1A1208] min-h-screen overflow-x-hidden">
      {/* NAV */}
      <nav className="sticky top-0 z-50 flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-12 h-16 bg-[rgba(253,248,242,0.92)] backdrop-blur-md border-b border-[#E8DDD0]">
        <a
          href="/"
          className="font-playfair text-[20px] sm:text-[22px] tracking-tight no-underline text-[#1A1208] shrink-0"
        >
          Togather<span className="text-terracotta">.</span>
        </a>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleCopy}
            className={`text-xs sm:text-sm border px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all font-dm-sans whitespace-nowrap ${
              copied
                ? "border-[#7B9E87] text-[#7B9E87] bg-[#EEF3EE]"
                : "border-[#E8DDD0] text-muted-taupe hover:border-terracotta hover:text-terracotta"
            }`}
          >
            {copied ? "✓ Copied!" : "Share card"}
          </button>
          <a
            href="/"
            className="text-xs sm:text-sm font-medium bg-terracotta text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-full hover:bg-[#C4734A] transition-colors no-underline whitespace-nowrap"
          >
            <span className="sm:hidden">Create yours →</span>
            <span className="hidden sm:inline">Create your own →</span>
          </a>
        </div>
      </nav>

      {/* HERO BANNER */}
      <div
        className="relative overflow-hidden px-4 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-20 text-center"
        style={{
          background: `linear-gradient(160deg, ${theme.from} 0%, ${theme.to} 60%, ${theme.from} 100%)`,
        }}
      >
        {/* Decorative orbs */}
        <div
          className={`absolute w-40 h-40 sm:w-64 sm:h-64 rounded-full -top-12 -left-12 pointer-events-none ${
            theme.dark ? "bg-white/10" : "bg-white/30"
          }`}
        />
        <div
          className={`absolute w-32 h-32 sm:w-48 sm:h-48 rounded-full -bottom-8 -right-8 pointer-events-none ${
            theme.dark ? "bg-white/5" : "bg-white/20"
          }`}
        />

        <div className="relative z-10 max-w-[680px] mx-auto">
          {/* Confetti row */}
          <div className="text-2xl sm:text-3xl tracking-[4px] sm:tracking-[6px] mb-5 sm:mb-6 select-none">
            🎊 {emoji} 🎉 🎈 🎁
          </div>

          {/* From badge */}
          <div
            className="inline-flex max-w-full items-center justify-center gap-2 text-[10px] sm:text-[11px] font-medium tracking-[1.5px] sm:tracking-[2px] uppercase border rounded-3xl sm:rounded-full px-3 sm:px-4 py-2 mb-5 leading-snug"
            style={{
              color: theme.accent,
              borderColor: theme.dark ? "rgba(255,255,255,0.18)" : "#EDD5C5",
              background: theme.dark
                ? "rgba(255,255,255,0.06)"
                : "rgba(255,255,255,0.6)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta shrink-0" />
            <span className="min-w-0 break-words">
              {card.occasion} · From {card.creator.name}
            </span>
          </div>

          {/* Main heading */}
          <h1
            className="font-playfair text-[clamp(32px,7vw,64px)] leading-[1.05] tracking-[-1px] sm:tracking-[-2px] mb-4 break-words"
            style={{ color: theme.heading }}
          >
            {heading}
          </h1>

          {/* Opening message from card creator */}
          {card.openingMessage && (
            <p
              className="text-[15px] sm:text-[16px] font-light leading-[1.8] max-w-[520px] mx-auto mb-6 italic break-words"
              style={{ color: theme.body }}
            >
              "{card.openingMessage}"
              <span
                className="block not-italic text-sm mt-1 font-medium"
                style={{ color: theme.muted }}
              >
                — {card.creator.name}
              </span>
            </p>
          )}

          {/* Meta pills */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            {[
              {
                icon: "🖊",
                label: `${card.signatures.length} signature${card.signatures.length !== 1 ? "s" : ""}`,
              },
              ...(photoCount > 0
                ? [
                    {
                      icon: "📷",
                      label: `${photoCount} photo${photoCount !== 1 ? "s" : ""}`,
                    },
                  ]
                : []),
              {
                icon: "📬",
                label: card.deliveredAt
                  ? `Delivered ${new Date(card.deliveredAt).toLocaleDateString("en-US", { month: "long", day: "numeric" })}`
                  : "Just delivered",
              },
            ].map((m) => (
              <div
                key={m.label}
                className="flex items-center gap-1.5 rounded-full px-3 sm:px-4 py-1.5 text-xs font-medium border"
                style={{
                  background: theme.dark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.7)",
                  borderColor: theme.dark
                    ? "rgba(255,255,255,0.18)"
                    : "#E8DDD0",
                  color: theme.strong,
                }}
              >
                <span>{m.icon}</span>
                {m.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {card.creatorPhotoUrl && (
        <div className="w-full h-[40vh] sm:h-[55vh] lg:h-[70vh] overflow-hidden">
          <img
            src={imageUrl(card.creatorPhotoUrl)}
            alt="Cover"
            className="w-full h-full object-cover object-[center_30%] rounded-br-sm rounded-bl-sm"
          />
        </div>
      )}

      {/* MESSAGES */}
      <section className="max-w-[1060px] mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-12 lg:py-16">
        {card.signatures.length === 0 ? (
          <div className="text-center py-20 text-muted-taupe">
            <div className="text-4xl mb-3">🖊</div>
            <p className="text-sm font-light">No messages yet.</p>
          </div>
        ) : (
          <>
            {/* Masonry grid — 1 column on mobile, 2 on tablet, 3 on desktop */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
              {card.signatures.map((sig, i) => {
                const colors = bubbleColors[i % bubbleColors.length];
                const initials = getInitials(sig.signerName);
                return (
                  <div
                    key={sig.id}
                    className="break-inside-avoid mb-5 rounded-2xl border border-[#E8DDD0] overflow-hidden"
                    style={{ background: colors.bg }}
                  >
                    {/* Photo — shown above the message if present */}
                    {sig.photoUrl && (
                      <div className="w-full overflow-hidden">
                        <img
                          src={imageUrl(sig.photoUrl)}
                          alt={`Photo from ${sig.signerName}`}
                          className="w-full h-auto object-cover max-h-105"
                        />
                      </div>
                    )}

                    <div className="p-4 sm:p-5">
                      {/* Avatar + name + time */}
                      <div className="flex items-center gap-2.5 mb-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
                          style={{
                            background: colors.avatar,
                            color: colors.avatarText,
                          }}
                        >
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium leading-tight truncate">
                            {sig.signerName}
                          </div>
                        </div>
                        <div className="text-[10px] text-muted-taupe shrink-0">
                          {new Date(sig.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>

                      {/* Message */}
                      <p className="text-[13px] leading-[1.75] text-[#3A2F27] break-words">
                        {sig.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 bg-white border border-[#E8DDD0] rounded-2xl p-4 sm:p-6 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4 min-w-0">
                {/* Avatar stack */}
                <div className="flex shrink-0">
                  {card.signatures.slice(0, 6).map((sig, i) => {
                    const colors = bubbleColors[i % bubbleColors.length];
                    return (
                      <div
                        key={sig.id}
                        className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-medium"
                        style={{
                          background: colors.avatar,
                          color: colors.avatarText,
                          marginLeft: i === 0 ? 0 : -8,
                        }}
                      >
                        {getInitials(sig.signerName)}
                      </div>
                    );
                  })}
                  {card.signatures.length > 6 && (
                    <div
                      className="w-9 h-9 rounded-full border-2 border-white bg-[#F5EAD8] flex items-center justify-center text-[10px] font-medium text-muted-taupe"
                      style={{ marginLeft: -8 }}
                    >
                      +{card.signatures.length - 6}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium">
                    {card.signatures.length}{" "}
                    {card.signatures.length === 1 ? "person" : "people"} signed
                    this card
                  </div>
                  <div className="text-xs text-muted-taupe font-light mt-0.5 break-words">
                    Organised by {card.creator.name}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={handleCopy}
                  className={`flex-1 sm:flex-none px-5 py-2.5 rounded-full text-sm font-medium border transition-all font-dm-sans ${
                    copied
                      ? "border-[#7B9E87] text-[#7B9E87] bg-[#EEF3EE]"
                      : "border-[#E8DDD0] text-[#1A1208] hover:border-terracotta hover:text-terracotta"
                  }`}
                >
                  {copied ? "✓ Copied!" : "Share card ↗"}
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* CTA — nudge recipient to create their own */}
      <div className="bg-terracotta relative overflow-hidden py-14 sm:py-20 px-4 sm:px-8 lg:px-12 text-center">
        <div className="absolute w-[360px] h-[360px] rounded-full bg-white/10 -top-24 -left-20 pointer-events-none" />
        <div className="absolute w-[280px] h-[280px] rounded-full bg-white/10 -bottom-14 -right-12 pointer-events-none" />
        <div className="relative z-10 max-w-[520px] mx-auto">
          <h2 className="font-playfair text-[clamp(28px,3.5vw,46px)] text-white tracking-[-1px] sm:tracking-[-1.5px] mb-3">
            Want to make someone
            <br />
            feel this special?
          </h2>
          <p className="text-[15px] sm:text-[16px] text-white/75 mb-8 font-light">
            Create a group card in 60 seconds. Your first one is free.
          </p>
          <a
            href="/"
            className="inline-block bg-[#FDF8F2] text-terracotta px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-[15px] font-medium shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:opacity-90 transition-opacity no-underline"
          >
            Create your own card →
          </a>
          <p className="text-xs text-white/50 mt-4">
            No credit card required for your first card.
          </p>
        </div>
      </div>
    </div>
  );
}
