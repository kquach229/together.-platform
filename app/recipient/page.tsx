"use client";

import { useState } from "react";

const messages = [
  {
    initials: "JM",
    name: "James M.",
    role: "Team Lead",
    time: "2 days ago",
    text: "So glad to have you on the team, Sarah. Wishing you the most wonderful year ahead — you deserve every bit of it!",
    avatarBg: "#F5EAD8",
    avatarColor: "#C4734A",
    cardBg: "#FEF3ED",
    photo: null,
  },
  {
    initials: "PR",
    name: "Priya R.",
    role: "",
    time: "2 days ago",
    text: "Happy birthday! Here's to another amazing year of adventures 🥂 Can't wait to celebrate with you in person soon.",
    avatarBg: "#EEF3EE",
    avatarColor: "#5A7D66",
    cardBg: "#EEF3EE",
    photo: null,
  },
  {
    initials: "TK",
    name: "Tom K.",
    role: "",
    time: "1 day ago",
    text: "You make every day brighter just by being in the room. So thankful to call you a colleague and a friend — enjoy every second of your special day!",
    avatarBg: "#F0EBF8",
    avatarColor: "#6B5A9E",
    cardBg: "#F0EBF8",
    photo: "photo",
  },
  {
    initials: "AL",
    name: "Amy L.",
    role: "Designer",
    time: "1 day ago",
    text: "Wishing you all the best things life has to offer. Happy birthday, Sarah — you're one of a kind! 🌟",
    avatarBg: "#E6F1FB",
    avatarColor: "#185FA5",
    cardBg: "#E6F1FB",
    photo: null,
  },
  {
    initials: "RN",
    name: "Ravi N.",
    role: "",
    time: "3 days ago",
    text: "Cheers to you! 🔥 Hope today is as wonderful as you are.",
    avatarBg: "#FAE8DE",
    avatarColor: "#993C1D",
    cardBg: "#FAE8DE",
    photo: null,
  },
  {
    initials: "SK",
    name: "Sophie K.",
    role: "HR",
    time: "3 days ago",
    text: "From all of us — have the most brilliant birthday! We're so lucky to have you on the team. 🎂",
    avatarBg: "#EEF3EE",
    avatarColor: "#3B6D11",
    cardBg: "#fff",
    photo: null,
  },
  {
    initials: "MW",
    name: "Marcus W.",
    role: "Organiser",
    time: "4 days ago",
    text: "Sarah — this card was put together by everyone who thinks the world of you. You bring so much warmth to everything you do. Happy birthday! 🎉",
    avatarBg: "#F5EAD8",
    avatarColor: "#C4734A",
    cardBg: "#FDF8F2",
    photo: null,
  },
  {
    initials: "LB",
    name: "Leila B.",
    role: "",
    time: "4 days ago",
    text: "Happy happy birthday! Sending you all the love today 💐",
    avatarBg: "#F0EBF8",
    avatarColor: "#6B5A9E",
    cardBg: "#F0EBF8",
    photo: "photo",
  },
];

export default function RecipientView() {
  const [downloaded, setDownloaded] = useState(false);
  const [shared, setShared] = useState(false);

  function handleDownload() {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setShared(true);
    setTimeout(() => setShared(false), 2500);
  }

  return (
    <div className="font-dm-sans bg-[#FDF8F2] text-[#1A1208] min-h-screen overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-12 h-16 bg-[rgba(253,248,242,0.92)] backdrop-blur-md border-b border-[#E8DDD0]">
        <span className="font-playfair text-[22px] tracking-tight">
          together<span className="text-terracotta">.</span>
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className={`text-sm border px-4 py-2 rounded-full transition-all font-dm-sans ${
              downloaded
                ? "border-[#7B9E87] text-[#7B9E87] bg-[#EEF3EE]"
                : "border-[#E8DDD0] text-muted-taupe hover:border-terracotta hover:text-terracotta"
            }`}
          >
            {downloaded ? "✓ Saved!" : "Save as PDF"}
          </button>
          <button
            onClick={handleShare}
            className={`text-sm font-medium px-5 py-2 rounded-full transition-all font-dm-sans ${
              shared
                ? "bg-[#7B9E87] text-white"
                : "bg-[#1A1208] text-[#FDF8F2] hover:opacity-85"
            }`}
          >
            {shared ? "✓ Link copied!" : "Share card"}
          </button>
        </div>
      </nav>

      {/* ── HERO HEADER ── */}
      <div
        className="relative overflow-hidden px-12 py-20 text-center"
        style={{ background: "linear-gradient(160deg, #FEF3ED 0%, #F5EAD8 50%, #EEF3EE 100%)" }}
      >
        {/* Decorative orbs */}
        <div className="absolute w-72 h-72 rounded-full bg-white/40 -top-16 -left-16 pointer-events-none" />
        <div className="absolute w-56 h-56 rounded-full bg-white/30 -bottom-10 -right-10 pointer-events-none" />

        <div className="relative z-10 max-w-[640px] mx-auto">
          {/* Confetti row */}
          <div className="text-3xl tracking-[6px] mb-6 select-none">🎊 🎂 🎉 🎈 🎁</div>

          {/* From label */}
          <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[2px] uppercase text-terracotta border border-[#EDD5C5] bg-white/60 rounded-full px-4 py-2 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
            Birthday Card · From Marcus & the team
          </div>

          <h1 className="font-playfair text-[clamp(40px,6vw,72px)] leading-[1.03] tracking-[-2.5px] mb-4">
            Happy Birthday,<br />
            <em className="text-terracotta">Sarah!</em>
          </h1>
          <p className="text-[16px] text-muted-taupe font-light leading-[1.75] mb-6">
            Everyone who signed this card wanted you to know how much you mean to them.
          </p>

          {/* Meta pills */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {[
              { icon: "🖊", label: `${messages.length} signatures` },
              { icon: "📷", label: "2 photos" },
              { icon: "📬", label: "Delivered today" },
            ].map((m) => (
              <div key={m.label} className="flex items-center gap-1.5 bg-white/70 border border-[#E8DDD0] rounded-full px-4 py-1.5 text-xs font-medium text-[#1A1208]">
                <span>{m.icon}</span>
                {m.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MESSAGES ── */}
      <section className="max-w-[1060px] mx-auto px-12 py-16">

        {/* Masonry grid — 3 columns */}
        <div className="columns-3 gap-5">
          {messages.map((m, i) => (
            <div
              key={i}
              className="break-inside-avoid mb-5 rounded-2xl border border-[#E8DDD0] overflow-hidden"
              style={{ background: m.cardBg }}
            >
              {/* Photo placeholder for cards with photo */}
              {m.photo && (
                <div className="w-full h-36 bg-gradient-to-br from-[#F5EAD8] to-[#EDD5C5] flex items-center justify-center text-muted-taupe">
                  <div className="text-center">
                    <div className="text-3xl mb-1">📷</div>
                    <div className="text-xs font-light">Photo from {m.name.split(" ")[0]}</div>
                  </div>
                </div>
              )}

              <div className="p-5">
                {/* Avatar + name */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
                    style={{ background: m.avatarBg, color: m.avatarColor }}
                  >
                    {m.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium leading-tight">{m.name}</div>
                    {m.role && <div className="text-[10px] text-muted-taupe">{m.role}</div>}
                  </div>
                  <div className="text-[10px] text-muted-taupe shrink-0">{m.time}</div>
                </div>

                {/* Message text */}
                <p className="text-[13px] leading-[1.75] text-[#3A2F27]">{m.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Signed by summary */}
        <div className="mt-6 bg-white border border-[#E8DDD0] rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex">
              {messages.slice(0, 6).map((m, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-medium"
                  style={{ background: m.avatarBg, color: m.avatarColor, marginLeft: i === 0 ? 0 : -8 }}
                >
                  {m.initials}
                </div>
              ))}
              {messages.length > 6 && (
                <div className="w-9 h-9 rounded-full border-2 border-white bg-[#F5EAD8] flex items-center justify-center text-[10px] font-medium text-muted-taupe" style={{ marginLeft: -8 }}>
                  +{messages.length - 6}
                </div>
              )}
            </div>
            <div>
              <div className="text-sm font-medium">{messages.length} people signed this card</div>
              <div className="text-xs text-muted-taupe font-light mt-0.5">Organised by Marcus W.</div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all font-dm-sans ${
                downloaded ? "border-[#7B9E87] text-[#7B9E87] bg-[#EEF3EE]" : "border-[#E8DDD0] text-[#1A1208] hover:border-terracotta hover:text-terracotta"
              }`}
            >
              {downloaded ? "✓ Saved!" : "Download PDF"}
            </button>
            <button
              onClick={handleShare}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all font-dm-sans ${
                shared ? "bg-[#7B9E87] text-white" : "bg-[#1A1208] text-[#FDF8F2] hover:opacity-85"
              }`}
            >
              {shared ? "✓ Copied!" : "Share card ↗"}
            </button>
          </div>
        </div>
      </section>

      {/* ── CREATE YOUR OWN CTA ── */}
      <div className="bg-terracotta relative overflow-hidden py-20 px-12 text-center">
        <div className="absolute w-[360px] h-[360px] rounded-full bg-white/10 -top-24 -left-20 pointer-events-none" />
        <div className="absolute w-[280px] h-[280px] rounded-full bg-white/10 -bottom-14 -right-12 pointer-events-none" />
        <div className="relative z-10 max-w-[520px] mx-auto">
          <h2 className="font-playfair text-[clamp(28px,3.5vw,46px)] text-white tracking-[-1.5px] mb-3">
            Want to make someone<br />feel this special?
          </h2>
          <p className="text-[16px] text-white/75 mb-8 font-light">
            Create a group card in 60 seconds — it's free.
          </p>
          <button className="bg-[#FDF8F2] text-terracotta px-10 py-4 rounded-full text-[15px] font-medium shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:opacity-90 transition-opacity font-dm-sans">
            Create your own card →
          </button>
          <p className="text-xs text-white/50 mt-4">No account needed to sign. No credit card to start.</p>
        </div>
      </div>

     

    </div>
  );
}
