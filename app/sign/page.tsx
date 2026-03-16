"use client";

import { useState, useRef } from "react";

const existingSigners = [
  {
    initials: "JM",
    name: "James M.",
    preview: "So glad to have you on the team...",
    time: "2h ago",
    avatarBg: "#F5EAD8",
    avatarColor: "#C4734A",
  },
  {
    initials: "PR",
    name: "Priya R.",
    preview: "Happy birthday! Here's to another...",
    time: "5h ago",
    avatarBg: "#EEF3EE",
    avatarColor: "#5A7D66",
  },
  {
    initials: "TK",
    name: "Tom K.",
    preview: "You make every day brighter...",
    time: "1d ago",
    avatarBg: "#F0EBF8",
    avatarColor: "#6B5A9E",
  },
  {
    initials: "AL",
    name: "Amy L.",
    preview: "Wishing you all the best things...",
    time: "1d ago",
    avatarBg: "#E6F1FB",
    avatarColor: "#185FA5",
  },
  {
    initials: "RN",
    name: "Ravi N.",
    preview: "Cheers to you! Hope today is...",
    time: "2d ago",
    avatarBg: "#FAE8DE",
    avatarColor: "#993C1D",
  },
];

const quickEmojis = ["🎂", "🎉", "❤️", "🥂", "🌟", "🎁", "✨", "🙌", "🎈", "🔥", "👏", "💐"];

type Step = "form" | "success";

export default function SignCard() {
  const [yourName, setYourName] = useState("");
  const [message, setMessage] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("form");
  const [errors, setErrors] = useState<{ name?: string; message?: string }>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const MAX_CHARS = 300;

  function handleEmoji(emoji: string) {
    if (message.length < MAX_CHARS) setMessage((m) => m + emoji);
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleRemovePhoto() {
    setPhotoPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function validate() {
    const errs: { name?: string; message?: string } = {};
    if (!yourName.trim()) errs.name = "Please enter your name.";
    if (!message.trim()) errs.message = "Please write a message.";
    return errs;
  }

  function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStep("success");
  }

  // ── SUCCESS ──
  if (step === "success") {
    return (
      <div className="font-dm-sans bg-[#FDF8F2] text-[#1A1208] min-h-screen">
        <nav className="sticky top-0 z-50 flex items-center justify-between px-12 h-16 bg-[rgba(253,248,242,0.92)] backdrop-blur-md border-b border-[#E8DDD0]">
          <span className="font-playfair text-[22px] tracking-tight">
            together<span className="text-terracotta">.</span>
          </span>
        </nav>
        <div className="max-w-[480px] mx-auto px-8 py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-[#EEF3EE] flex items-center justify-center text-4xl mx-auto mb-6">🎉</div>
          <h2 className="font-playfair text-[36px] tracking-tight mb-3">You're on the card!</h2>
          <p className="text-[16px] text-muted-taupe font-light leading-[1.75] mb-8">
            Your message has been added. It'll stay private until{" "}
            <span className="text-[#1A1208] font-medium">Sarah Chen</span>'s card is delivered.
          </p>
          <div className="bg-[#F5EAD8] rounded-2xl p-5 text-left mb-8">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#F5EAD8] border border-[#EDD5C5] flex items-center justify-center text-xs font-medium text-[#C4734A]">
                {yourName.trim().split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <span className="text-sm font-medium">{yourName}</span>
              <span className="text-xs text-muted-taupe ml-auto">Just now</span>
            </div>
            <p className="text-sm leading-[1.7] text-[#3A2F27]">{message}</p>
            {photoPreview && (
              <img src={photoPreview} alt="Your photo" className="mt-3 rounded-xl w-full object-cover max-h-40" />
            )}
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => { setStep("form"); setYourName(""); setMessage(""); handleRemovePhoto(); }}
              className="w-full py-3 rounded-full text-sm font-medium bg-terracotta text-white hover:bg-[#C4734A] transition-colors"
            >
              Add another message
            </button>
            <a href="/" className="w-full py-3 rounded-full text-sm font-medium border border-[#E8DDD0] text-[#1A1208] hover:border-terracotta hover:text-terracotta transition-all text-center no-underline block">
              Create your own card →
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── FORM ──
  return (
    <div className="font-dm-sans bg-[#FDF8F2] text-[#1A1208] min-h-screen">

      {/* NAV */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-12 h-16 bg-[rgba(253,248,242,0.92)] backdrop-blur-md border-b border-[#E8DDD0]">
        <span className="font-playfair text-[22px] tracking-tight">
          together<span className="text-terracotta">.</span>
        </span>
        <div className="text-sm text-muted-taupe">
          Signing a card for <span className="text-[#1A1208] font-medium">Sarah Chen</span>
        </div>
      </nav>

      <div className="max-w-[1000px] mx-auto px-12 py-12 grid grid-cols-[1fr_300px] gap-12 items-start">

        {/* FORM */}
        <div>
          {/* Card banner */}
          <div className="rounded-2xl p-6 mb-8 text-center" style={{ background: "linear-gradient(135deg,#FEF3ED,#F5EAD8)" }}>
            <div className="text-[10px] font-medium tracking-[2px] uppercase text-terracotta mb-2">🎂 Birthday Card</div>
            <h1 className="font-playfair text-[26px] tracking-tight mb-1">Happy Birthday, Sarah Chen!</h1>
            <p className="text-sm text-muted-taupe font-light">
              Organised by Marcus · Deadline <span className="font-medium text-[#1A1208]">Mar 20</span>
            </p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="flex">
                {existingSigners.slice(0, 4).map((s, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-[#FEF3ED] flex items-center justify-center text-[9px] font-medium"
                    style={{ background: s.avatarBg, color: s.avatarColor, marginLeft: i === 0 ? 0 : -6 }}
                  >
                    {s.initials}
                  </div>
                ))}
              </div>
              <span className="text-xs text-muted-taupe">
                <span className="font-medium text-[#1A1208]">{existingSigners.length} people</span> have already signed
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Your name <span className="text-terracotta">*</span></label>
              <input
                type="text"
                value={yourName}
                onChange={(e) => { setYourName(e.target.value); setErrors((x) => ({ ...x, name: undefined })); }}
                placeholder="e.g. David Kim"
                className={`w-full px-4 py-3 border rounded-xl text-sm bg-white outline-none transition-colors font-dm-sans placeholder:text-[#C5B8AD] ${errors.name ? "border-red-400" : "border-[#E8DDD0] focus:border-terracotta"}`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-2">Your message <span className="text-terracotta">*</span></label>
              <textarea
                value={message}
                onChange={(e) => { if (e.target.value.length <= MAX_CHARS) { setMessage(e.target.value); setErrors((x) => ({ ...x, message: undefined })); } }}
                placeholder="Write something heartfelt…"
                rows={5}
                className={`w-full px-4 py-3 border rounded-xl text-sm bg-white outline-none transition-colors resize-none font-dm-sans placeholder:text-[#C5B8AD] ${errors.message ? "border-red-400" : "border-[#E8DDD0] focus:border-terracotta"}`}
              />
              <div className="flex justify-between mt-1">
                {errors.message ? <p className="text-xs text-red-500">{errors.message}</p> : <span />}
                <span className={`text-xs ml-auto ${message.length >= MAX_CHARS ? "text-terracotta font-medium" : "text-muted-taupe"}`}>
                  {message.length} / {MAX_CHARS}
                </span>
              </div>
            </div>

            {/* Emoji */}
            <div>
              <label className="block text-sm font-medium mb-2">Quick emoji</label>
              <div className="flex flex-wrap gap-2">
                {quickEmojis.map((e) => (
                  <button key={e} onClick={() => handleEmoji(e)}
                    className="w-9 h-9 rounded-lg border border-[#E8DDD0] bg-white text-base flex items-center justify-center hover:border-terracotta hover:bg-[#FEF3ED] transition-all">
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Add a photo <span className="text-muted-taupe font-light">(optional)</span>
              </label>
              {photoPreview ? (
                <div className="relative rounded-xl overflow-hidden border border-[#E8DDD0]">
                  <img src={photoPreview} alt="Preview" className="w-full max-h-56 object-cover" />
                  <button onClick={handleRemovePhoto}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#1A1208]/60 text-white text-xs flex items-center justify-center hover:bg-[#1A1208] transition-colors">
                    ✕
                  </button>
                </div>
              ) : (
                <button onClick={() => fileRef.current?.click()}
                  className="w-full border border-dashed border-[#E8DDD0] rounded-xl p-6 flex flex-col items-center gap-2 hover:border-terracotta hover:bg-[#FEF3ED]/30 transition-all bg-white">
                  <span className="text-2xl">📷</span>
                  <span className="text-sm text-muted-taupe font-light">Click to upload a photo</span>
                  <span className="text-xs text-[#C5B8AD]">PNG, JPG up to 5MB</span>
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </div>

            {/* Privacy */}
            <div className="flex items-start gap-3 bg-[#F5EAD8] rounded-xl p-4">
              <span className="text-lg">🔒</span>
              <p className="text-xs text-muted-taupe leading-[1.7] font-light">
                Your message stays private until the card is delivered. Only the card creator can see who has signed.
              </p>
            </div>

            {/* Submit */}
            <button onClick={handleSubmit}
              className="w-full py-4 rounded-full text-sm font-medium bg-terracotta text-white hover:bg-[#C4734A] transition-all shadow-[0_4px_20px_rgba(212,132,90,0.3)] font-dm-sans">
              Sign the card →
            </button>
          </div>
        </div>

        {/* SIGNERS SIDEBAR */}
        <div className="sticky top-24">
          <div className="text-[11px] font-medium tracking-[1.5px] uppercase text-muted-taupe mb-3">
            Already signed ({existingSigners.length})
          </div>
          <div className="flex flex-col gap-2 mb-4">
            {existingSigners.map((s) => (
              <div key={s.name} className="flex items-center gap-3 bg-white border border-[#E8DDD0] rounded-xl p-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0"
                  style={{ background: s.avatarBg, color: s.avatarColor }}>
                  {s.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-xs text-muted-taupe truncate">{s.preview}</div>
                </div>
                <div className="text-[10px] text-muted-taupe shrink-0">{s.time}</div>
              </div>
            ))}
          </div>

          {/* Deadline */}
          <div className="bg-[#FEF3ED] border border-[#EDD5C5] rounded-xl p-4 flex items-start gap-3 mb-4">
            <span className="text-lg">⏰</span>
            <div>
              <div className="text-sm font-medium text-terracotta">Signing closes Mar 20</div>
              <div className="text-xs text-muted-taupe font-light mt-0.5">4 days remaining</div>
            </div>
          </div>

          <p className="text-xs text-muted-taupe text-center font-light leading-[1.7]">
            Know someone else who'd want to sign?{" "}
            <button className="text-terracotta font-medium hover:underline">Share this link</button>
          </p>
        </div>

      </div>
    </div>
  );
}
