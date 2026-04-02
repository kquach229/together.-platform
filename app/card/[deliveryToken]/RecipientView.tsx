"use client";

import { useState } from "react";

const themes: Record<string, { from: string; to: string }> = {
  warm: { from: "#FEF3ED", to: "#F5EAD8" },
  sage: { from: "#EEF3EE", to: "#D4E8D4" },
  lavender: { from: "#F0EBF8", to: "#E2D4F0" },
  sky: { from: "#E6F1FB", to: "#C8DFF5" },
  parchment: { from: "#FDF8F2", to: "#EDE0CE" },
  midnight: { from: "#1A1208", to: "#2E2820" },
};

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

function getOccasionHeading(occasion: string, recipientName: string) {
  const headings: Record<string, string> = {
    Birthday: `Happy Birthday, ${recipientName}!`,
    Farewell: `Farewell, ${recipientName}!`,
    Congratulations: `Congratulations, ${recipientName}!`,
    Wedding: `Happy Wedding Day, ${recipientName}!`,
    "New Baby": `Welcome to the world! For ${recipientName}`,
    "Get Well Soon": `Get Well Soon, ${recipientName}!`,
    Graduation: `Congratulations on your graduation, ${recipientName}!`,
    "Thank You": `Thank you, ${recipientName}!`,
    Holiday: `Happy Holidays, ${recipientName}!`,
    "Work Anniversary": `Happy Work Anniversary, ${recipientName}!`,
    "Just Because": `This one's for you, ${recipientName}!`,
    Sympathy: `Thinking of you, ${recipientName}.`,
  };
  return headings[occasion] ?? `${occasion}, ${recipientName}!`;
}

function getOccasionEmoji(occasion: string) {
  const emojis: Record<string, string> = {
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
  return emojis[occasion] ?? "🎉";
}

export default function RecipientView({ card }: Props) {
  const [copied, setCopied] = useState(false);

  const theme = themes[card.theme] ?? themes.warm;
  const isMidnight = card.theme === "midnight";
  const heading = getOccasionHeading(card.occasion, card.recipientName);
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
      <nav className="sticky top-0 z-50 flex items-center justify-between px-12 h-16 bg-[rgba(253,248,242,0.92)] backdrop-blur-md border-b border-[#E8DDD0]">
        <a
          href="/"
          className="font-playfair text-[22px] tracking-tight no-underline text-[#1A1208]"
        >
          together<span className="text-terracotta">.</span>
        </a>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className={`text-sm border px-4 py-2 rounded-full transition-all font-dm-sans ${
              copied
                ? "border-[#7B9E87] text-[#7B9E87] bg-[#EEF3EE]"
                : "border-[#E8DDD0] text-muted-taupe hover:border-terracotta hover:text-terracotta"
            }`}
          >
            {copied ? "✓ Link copied!" : "Share card"}
          </button>
          <a
            href="/"
            className="text-sm font-medium bg-terracotta text-white px-5 py-2 rounded-full hover:bg-[#C4734A] transition-colors no-underline"
          >
            Create your own →
          </a>
        </div>
      </nav>

      {/* HERO BANNER */}
      <div
        className="relative overflow-hidden px-12 py-20 text-center"
        style={{
          background: `linear-gradient(160deg, ${theme.from} 0%, ${theme.to} 60%, ${theme.from} 100%)`,
        }}
      >
        {/* Decorative orbs */}
        <div className="absolute w-64 h-64 rounded-full bg-white/30 -top-12 -left-12 pointer-events-none" />
        <div className="absolute w-48 h-48 rounded-full bg-white/20 -bottom-8 -right-8 pointer-events-none" />

        <div className="relative z-10 max-w-[680px] mx-auto">
          {/* Confetti row */}
          <div className="text-3xl tracking-[6px] mb-6 select-none">
            🎊 {emoji} 🎉 🎈 🎁
          </div>

          {/* From badge */}
          <div
            className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[2px] uppercase border rounded-full px-4 py-2 mb-5"
            style={{
              color: isMidnight ? "#D4845A" : "#D4845A",
              borderColor: isMidnight ? "#3A2F27" : "#EDD5C5",
              background: isMidnight
                ? "rgba(255,255,255,0.05)"
                : "rgba(255,255,255,0.6)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
            {card.occasion} · From {card.creator.name}
          </div>

          {/* Main heading */}
          <h1
            className="font-playfair text-[clamp(36px,5vw,64px)] leading-[1.05] tracking-[-2px] mb-4"
            style={{ color: isMidnight ? "#FDF8F2" : "#1A1208" }}
          >
            {heading}
          </h1>

          {/* Opening message from card creator */}
          {card.openingMessage && (
            <p
              className="text-[16px] font-light leading-[1.8] max-w-[520px] mx-auto mb-6 italic"
              style={{
                color: isMidnight ? "rgba(253,248,242,0.8)" : "#3A2F27",
              }}
            >
              "{card.openingMessage}"
              <span
                className="block not-italic text-sm mt-1 font-medium"
                style={{
                  color: isMidnight ? "rgba(253,248,242,0.6)" : "#8C7B6B",
                }}
              >
                — {card.creator.name}
              </span>
            </p>
          )}

          {/* Meta pills */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
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
                className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium border"
                style={{
                  background: isMidnight
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.7)",
                  borderColor: isMidnight ? "#3A2F27" : "#E8DDD0",
                  color: isMidnight ? "#FDF8F2" : "#1A1208",
                }}
              >
                <span>{m.icon}</span>
                {m.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        {/* Cover photo preview */}
        {card.creatorPhotoUrl && (
          <div className="w-full h-50 overflow-hidden">
            <img
              src={`https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${card.creatorPhotoUrl}`}
              alt="Cover"
              className="w-full h-50 object-cover rounded-b-md"
            />
          </div>
        )}
      </div>

      {/* MESSAGES */}
      <section className="max-w-[1060px] mx-auto px-12 py-16">
        {card.signatures.length === 0 ? (
          <div className="text-center py-20 text-muted-taupe">
            <div className="text-4xl mb-3">🖊</div>
            <p className="text-sm font-light">No messages yet.</p>
          </div>
        ) : (
          <>
            {/* Masonry grid — 3 columns */}
            <div className="columns-3 gap-5">
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
                          src={`https://together-uploads-bucket.s3.us-east-1.amazonaws.com/${sig.photoUrl}`}
                          alt={`Photo from ${sig.signerName}`}
                          className="w-full h-auto object-cover max-h-[420px]"
                        />
                      </div>
                    )}

                    <div className="p-5">
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
                          <div className="text-sm font-medium leading-tight">
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
                      <p className="text-[13px] leading-[1.75] text-[#3A2F27]">
                        {sig.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Signed by strip */}
            <div className="mt-6 bg-white border border-[#E8DDD0] rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {/* Avatar stack */}
                <div className="flex">
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
                <div>
                  <div className="text-sm font-medium">
                    {card.signatures.length}{" "}
                    {card.signatures.length === 1 ? "person" : "people"} signed
                    this card
                  </div>
                  <div className="text-xs text-muted-taupe font-light mt-0.5">
                    Organised by {card.creator.name}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all font-dm-sans ${
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
      <div className="bg-terracotta relative overflow-hidden py-20 px-12 text-center">
        <div className="absolute w-[360px] h-[360px] rounded-full bg-white/10 -top-24 -left-20 pointer-events-none" />
        <div className="absolute w-[280px] h-[280px] rounded-full bg-white/10 -bottom-14 -right-12 pointer-events-none" />
        <div className="relative z-10 max-w-[520px] mx-auto">
          <h2 className="font-playfair text-[clamp(28px,3.5vw,46px)] text-white tracking-[-1.5px] mb-3">
            Want to make someone
            <br />
            feel this special?
          </h2>
          <p className="text-[16px] text-white/75 mb-8 font-light">
            Create a group card in 60 seconds. Your first one is free.
          </p>
          <a
            href="/"
            className="inline-block bg-[#FDF8F2] text-terracotta px-10 py-4 rounded-full text-[15px] font-medium shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:opacity-90 transition-opacity no-underline"
          >
            Create your own card →
          </a>
          <p className="text-xs text-white/50 mt-4">
            No credit card required for your first card.
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#1A1208] px-12 pt-12 pb-8">
        <div className="max-w-[1060px] mx-auto flex items-center justify-between flex-wrap gap-6">
          <div className="font-playfair text-xl text-[#FDF8F2]">
            together<span className="text-terracotta">.</span>
          </div>
          <p className="text-xs text-[#6A635D]">
            © {new Date().getFullYear()} Together. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Privacy policy", "Terms of service", "Help centre"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-xs text-[#6A635D] hover:text-[#FDF8F2] transition-colors no-underline"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
