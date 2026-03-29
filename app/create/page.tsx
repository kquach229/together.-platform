"use client";

import { uploadPhoto } from "@/lib/helpers/uploadPhoto";
import { CARD_THEMES } from "@/lib/theme";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

const occasions = [
  { emoji: "🎂", label: "Birthday" },
  { emoji: "👋", label: "Farewell" },
  { emoji: "🎊", label: "Congratulations" },
  { emoji: "💍", label: "Wedding" },
  { emoji: "🍼", label: "New Baby" },
  { emoji: "🏥", label: "Get Well Soon" },
  { emoji: "🎓", label: "Graduation" },
  { emoji: "🙏", label: "Thank You" },
  { emoji: "🎄", label: "Holiday" },
  { emoji: "💼", label: "Work Anniversary" },
  { emoji: "🌟", label: "Just Because" },
  { emoji: "💔", label: "Sympathy" },
];

const steps = [
  { num: 1, label: "Occasion" },
  { num: 2, label: "Details" },
  { num: 3, label: "Theme" },
  { num: 4, label: "Share" },
];

const themes = ["warm", "lavender", "sage", "sky", "neutral", "midnight"];

export default function CreateCard() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [occasion, setOccasion] = useState("Birthday");
  const [occasionEmoji, setOccasionEmoji] = useState("🎂");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [deadline, setDeadline] = useState("");
  const [theme, setTheme] = useState("warm");
  const [coverPhotoPreview, setCoverPhotoPreview] = useState();
  const [photoFile, setPhotoFile] = useState();
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // Set after the card is created via API
  const [signingToken, setSigningToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function handlePhoto(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setCoverPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function removePhoto() {
    setPhotoFile(null);
    setCoverPhotoPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  const shareLink = signingToken
    ? `${window.location.origin}/sign/${signingToken}`
    : "Generating link…";

  function handleCopy() {
    if (!signingToken) return;
    navigator.clipboard.writeText(shareLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function canProceed() {
    if (step === 1) return !!occasion;
    if (step === 2) return recipientName.trim().length > 0;
    if (step === 3) return !!theme;
    return true;
  }

  function buildS3Url(key: string): string {
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }

  // Called when the user clicks Continue on step 3.
  // Flow:
  //   1. POST /api/cards       → create card, get cardId + signingToken
  //   2. POST /api/upload      → get presigned S3 URL (uses real cardId now)
  //   3. PUT file → S3
  //   4. PATCH /api/cards/:id/photo → save URL to card
  //   5. Advance to step 4
  async function handleCreateCard() {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Step 1 — create the card
      setUploadProgress("Creating your card…");
      const createRes = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          occasion,
          recipientName,
          recipientEmail: recipientEmail || undefined,
          openingMessage: message || undefined,
          theme: theme.id,
          signingDeadline: deadline
            ? new Date(deadline).toISOString()
            : undefined,
        }),
      });

      const createData = await createRes.json();
      if (!createRes.ok) {
        setSubmitError(
          createData.message ?? createData.error ?? "Something went wrong.",
        );
        return;
      }

      const { id: cardId, signingToken: token } = createData.card;

      // Step 2 & 3 — upload cover photo if one was chosen
      if (photoFile) {
        setUploadProgress("Uploading cover photo…");

        // Now we have a real cardId — key goes to signatures/{cardId}/...
        const photoUrl = await uploadPhoto(photoFile);

        console.log("photoUrl: ", photoUrl, "photoFile: ", photoFile);

        console.log("THE BUILT UP URL FOR S3::::::::::", photoUrl);

        // Step 4 — save the photo URL to the card
        setUploadProgress("Saving photo…");
        await fetch(`/api/cards/${cardId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ creatorPhotoUrl: photoUrl }),
        });
      }

      setSigningToken(token);
      setStep(4);
    } catch (err) {
      console.error("Failed to create card:", err);
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Network error — please try again.",
      );
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  }

  function handleContinue() {
    if (!canProceed()) return;
    if (step === 3) {
      // Step 3 → 4: create the card via API first
      handleCreateCard();
    } else {
      setStep(step + 1);
    }
  }

  return (
    <div className="font-dm-sans bg-[#FDF8F2] text-[#1A1208] min-h-screen overflow-x-hidden">
      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-12 h-16 bg-[rgba(253,248,242,0.92)] backdrop-blur-md border-b border-[#E8DDD0]">
        <a
          href="/"
          className="font-playfair text-[22px] tracking-tight no-underline text-[#1A1208]"
        >
          together<span className="text-terracotta">.</span>
        </a>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-taupe">Creating a card</span>
          <button className="text-sm text-muted-taupe border border-[#E8DDD0] px-4 py-1.5 rounded-full hover:border-terracotta hover:text-terracotta transition-all">
            Save draft
          </button>
        </div>
      </nav>

      {/* ── PROGRESS ── */}
      <div className="border-b border-[#E8DDD0] bg-white px-12 py-4">
        <div className="max-w-[860px] mx-auto flex items-center gap-0">
          {steps.map((s, i) => (
            <div
              key={s.num}
              className="flex items-center flex-1 last:flex-none"
            >
              <button
                onClick={() => s.num < step && setStep(s.num)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  s.num === step
                    ? "text-terracotta"
                    : s.num < step
                      ? "text-[#7B9E87] cursor-pointer"
                      : "text-[#C5B8AD] cursor-default"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border transition-all ${
                    s.num === step
                      ? "border-terracotta bg-terracotta text-white"
                      : s.num < step
                        ? "border-[#7B9E87] bg-[#EEF3EE] text-[#7B9E87]"
                        : "border-[#E8DDD0] bg-white text-[#C5B8AD]"
                  }`}
                >
                  {s.num < step ? "✓" : s.num}
                </span>
                {s.label}
              </button>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px mx-4 bg-[#E8DDD0]">
                  <div
                    className="h-full bg-terracotta transition-all duration-500"
                    style={{ width: s.num < step ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="max-w-[860px] mx-auto px-12 py-12">
        <div className="grid grid-cols-[1fr_280px] gap-10 items-start">
          {/* ── LEFT: FORM ── */}
          <div>
            {/* STEP 1 — Occasion */}
            {step === 1 && (
              <div>
                <h2 className="font-playfair text-[32px] tracking-tight mb-2">
                  What's the occasion?
                </h2>
                <p className="text-sm text-muted-taupe font-light mb-8">
                  Pick the one that fits best — you can always change it later.
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {occasions.map((o) => (
                    <button
                      key={o.label}
                      onClick={() => {
                        setOccasion(o.label);
                        setOccasionEmoji(o.emoji);
                      }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all font-dm-sans ${
                        occasion === o.label
                          ? "border-terracotta bg-[#FEF3ED] shadow-[0_2px_12px_rgba(212,132,90,0.15)]"
                          : "border-[#E8DDD0] bg-white hover:border-terracotta hover:bg-[#FEF3ED]/40"
                      }`}
                    >
                      <span className="text-2xl">{o.emoji}</span>
                      <span className="text-xs font-medium text-[#1A1208]">
                        {o.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2 — Details */}
            {step === 2 && (
              <div>
                <h2 className="font-playfair text-[32px] tracking-tight mb-2">
                  Tell us about the card
                </h2>
                <p className="text-sm text-muted-taupe font-light mb-8">
                  This is for the recipient — make it personal.
                </p>
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Recipient's name{" "}
                      <span className="text-terracotta">*</span>
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Sarah Chen"
                      className="w-full px-4 py-3 border border-[#E8DDD0] rounded-xl text-sm bg-white outline-none focus:border-terracotta transition-colors font-dm-sans placeholder:text-[#C5B8AD]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your opening message
                      <span className="text-muted-taupe font-light ml-2">
                        (optional)
                      </span>
                    </label>
                    <p className="text-xs text-muted-taupe font-light mb-4">
                      Shown at the top of the card when recipients open it.
                    </p>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write a short note that appears at the top of the card…"
                      rows={4}
                      className="w-full px-4 py-3 border border-[#E8DDD0] rounded-xl text-sm bg-white outline-none focus:border-terracotta transition-colors resize-none font-dm-sans placeholder:text-[#C5B8AD]"
                    />
                    <div className="text-right text-xs text-muted-taupe mt-1">
                      {message.length} / 300
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Signing deadline
                      <span className="text-muted-taupe font-light ml-2">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-4 py-3 border border-[#E8DDD0] rounded-xl text-sm bg-white outline-none focus:border-terracotta transition-colors font-dm-sans text-[#1A1208]"
                    />
                    <p className="text-xs text-muted-taupe mt-1.5 font-light">
                      Signers will see a reminder as the deadline approaches.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Recipient's email
                      <span className="text-muted-taupe font-light ml-2">
                        (optional — for scheduled delivery)
                      </span>
                    </label>
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="sarah@example.com"
                      className="w-full px-4 py-3 border border-[#E8DDD0] rounded-xl text-sm bg-white outline-none focus:border-terracotta transition-colors font-dm-sans placeholder:text-[#C5B8AD]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 — Theme */}
            {step === 3 && (
              <div>
                <h2 className="font-playfair text-[32px] tracking-tight mb-2">
                  Choose a theme
                </h2>
                <p className="text-sm text-muted-taupe font-light mb-8">
                  Sets the mood for everyone who opens the card.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {themes.map((cardTheme) => (
                    <button
                      key={cardTheme}
                      onClick={() => setTheme(cardTheme)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                        cardTheme === theme
                          ? "border-terracotta shadow-[0_2px_16px_rgba(212,132,90,0.2)]"
                          : "border-[#E8DDD0] hover:border-[#C5B8AD]"
                      }`}
                    >
                      <div
                        className="h-24 w-full"
                        style={{
                          background: `linear-gradient(135deg, ${CARD_THEMES[cardTheme].from}, ${CARD_THEMES[cardTheme].to})`,
                        }}
                      />
                      <div
                        className={`px-3 py-2 text-xs font-medium text-left ${
                          cardTheme === "warm"
                            ? "bg-[#1A1208] text-[#FDF8F2]"
                            : "bg-white text-[#1A1208]"
                        }`}
                      >
                        {cardTheme}
                      </div>
                      {cardTheme === theme && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-terracotta flex items-center justify-center text-white text-[9px]">
                          ✓
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Cover photo upload */}
                <div className="border-t border-[#E8DDD0] pt-6">
                  <label className="block text-sm font-medium mb-1">
                    Cover photo
                    <span className="text-muted-taupe font-light ml-2">
                      (optional)
                    </span>
                  </label>
                  <p className="text-xs text-muted-taupe font-light mb-4">
                    Shown at the top of the card when recipients open it.
                  </p>

                  {coverPhotoPreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-[#E8DDD0] mb-2">
                      <img
                        src={coverPhotoPreview}
                        alt="Cover preview"
                        className="w-full max-h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-white/90 text-xs font-medium text-[#1A1208] hover:bg-white transition-colors border-none cursor-pointer font-dm-sans shadow-sm"
                        >
                          Replace
                        </button>
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="w-7 h-7 rounded-lg bg-[#1A1208]/60 text-white text-xs flex items-center justify-center hover:bg-[#1A1208] transition-colors cursor-pointer border-none"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="w-full border border-dashed border-[#E8DDD0] rounded-xl p-6 flex flex-col items-center gap-2 hover:border-terracotta hover:bg-[#FEF3ED]/30 transition-all bg-white cursor-pointer"
                    >
                      <span className="text-2xl">📷</span>
                      <span className="text-sm text-muted-taupe font-light">
                        Add a cover photo
                      </span>
                      <span className="text-xs text-[#C5B8AD]">
                        PNG, JPG up to 5MB
                      </span>
                    </button>
                  )}

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handlePhoto}
                  />
                </div>

                {/* Error message */}
                {submitError && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    {submitError}
                  </div>
                )}

                <div className="mt-6 p-4 border border-[#E8DDD0] rounded-xl bg-white">
                  <div className="text-xs font-medium text-muted-taupe uppercase tracking-[1.5px] mb-2">
                    More themes with Plus
                  </div>
                  <p className="text-sm text-muted-taupe font-light">
                    Unlock 40+ premium designs including seasonal, illustrated,
                    and custom-branded themes.
                  </p>
                  <button className="mt-3 text-sm text-terracotta font-medium hover:underline">
                    Upgrade to Plus →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4 — Share */}
            {step === 4 && (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#EEF3EE] flex items-center justify-center text-xl">
                    🎉
                  </div>
                  <h2 className="font-playfair text-[32px] tracking-tight">
                    Your card is ready!
                  </h2>
                </div>
                <p className="text-sm text-muted-taupe font-light mb-8">
                  Share the signing link with everyone you'd like to contribute.
                </p>

                {/* Link box */}
                <div className="bg-[#F5EAD8] rounded-xl p-5 mb-6">
                  <div className="text-xs font-medium text-muted-taupe uppercase tracking-[1.5px] mb-3">
                    Signing link
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="flex-1 bg-white border border-[#E8DDD0] rounded-lg px-3 py-2.5 text-sm font-mono text-muted-taupe overflow-hidden text-ellipsis whitespace-nowrap">
                      {shareLink}
                    </div>
                    <button
                      onClick={handleCopy}
                      disabled={!signingToken}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all font-dm-sans ${
                        copied
                          ? "bg-[#7B9E87] text-white"
                          : "bg-terracotta text-white hover:bg-[#C4734A]"
                      }`}
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <p className="text-xs text-muted-taupe mt-2.5 font-light">
                    Only people with this link can view and sign the card.
                  </p>
                </div>

                {/* Share options */}
                <div className="text-xs font-medium text-muted-taupe uppercase tracking-[1.5px] mb-3">
                  Share via
                </div>
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { icon: "✉️", label: "Email" },
                    { icon: "💬", label: "Slack" },
                    { icon: "📱", label: "WhatsApp" },
                  ].map((s) => (
                    <button
                      key={s.label}
                      className="flex items-center gap-2.5 px-4 py-3 border border-[#E8DDD0] rounded-xl bg-white text-sm font-medium hover:border-terracotta hover:text-terracotta transition-all"
                    >
                      <span className="text-base">{s.icon}</span>
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* What happens next */}
                <div className="border border-[#E8DDD0] rounded-xl bg-white p-5">
                  <div className="text-xs font-medium text-muted-taupe uppercase tracking-[1.5px] mb-4">
                    What happens next
                  </div>
                  <div className="flex flex-col gap-4">
                    {[
                      {
                        icon: "🖊",
                        title: "People sign",
                        desc: "Anyone with the link can add their message and a photo.",
                      },
                      {
                        icon: "🔔",
                        title: "You get notified",
                        desc: "We'll email you each time someone signs.",
                      },
                      {
                        icon: "📬",
                        title: "You deliver it",
                        desc: "When you're ready, send the card link to the recipient.",
                      },
                    ].map((item) => (
                      <div key={item.title} className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-full bg-[#F5EAD8] flex items-center justify-center text-sm shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {item.title}
                          </div>
                          <div className="text-xs text-muted-taupe font-light mt-0.5">
                            {item.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── NAVIGATION BUTTONS ── */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-[#E8DDD0]">
              {step > 1 && step < 4 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="text-sm text-muted-taupe hover:text-[#1A1208] transition-colors flex items-center gap-1"
                >
                  ← Back
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  onClick={handleContinue}
                  disabled={!canProceed() || isSubmitting}
                  className={`px-8 py-3 rounded-full text-sm font-medium transition-all font-dm-sans ${
                    canProceed() && !isSubmitting
                      ? "bg-terracotta text-white hover:bg-[#C4734A] shadow-[0_4px_16px_rgba(212,132,90,0.25)]"
                      : "bg-[#E8DDD0] text-[#C5B8AD] cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? "Creating…" : "Continue →"}
                </button>
              ) : (
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-8 py-3 rounded-full text-sm font-medium bg-[#1A1208] text-[#FDF8F2] hover:opacity-85 transition-opacity font-dm-sans"
                >
                  Go to dashboard →
                </button>
              )}
            </div>
          </div>

          {/* ── RIGHT: LIVE PREVIEW ── */}
          <div className="sticky top-28">
            <div className="text-[11px] font-medium tracking-[1.5px] uppercase text-muted-taupe mb-3">
              Live preview
            </div>
            <div className="rounded-2xl border border-[#E8DDD0] overflow-hidden shadow-[0_8px_32px_rgba(26,18,8,0.07)]">
              <div
                className="p-5"
                style={{
                  background: `linear-gradient(135deg, ${CARD_THEMES[theme].from}, ${CARD_THEMES[theme].to})`,
                }}
              >
                <div
                  className="text-[10px] font-medium tracking-[1.5px] uppercase mb-1"
                  style={{ color: "#D4845A" }}
                >
                  {occasionEmoji} {occasion}
                </div>
                <div
                  className="font-playfair text-xl tracking-tight"
                  style={{
                    color: theme.id === "midnight" ? "#FDF8F2" : "#1A1208",
                  }}
                >
                  {occasion === "Birthday"
                    ? "Happy Birthday"
                    : occasion === "Get Well Soon"
                      ? "Get Well Soon"
                      : occasion === "Sympathy"
                        ? "Thinking of You"
                        : occasion}
                  {recipientName ? `, ${recipientName}!` : "…"}
                </div>
                {message && (
                  <p
                    className="text-xs mt-2 leading-relaxed opacity-80"
                    style={{
                      color: theme.id === "midnight" ? "#FDF8F2" : "#3A2F27",
                    }}
                  >
                    {message}
                  </p>
                )}
              </div>
              {/* Cover photo preview */}
              {coverPhotoPreview && (
                <div className="w-full h-16 overflow-hidden">
                  <img
                    src={coverPhotoPreview}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="bg-white p-4">
                <div className="border border-dashed border-[#E8DDD0] rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1.5">🖊</div>
                  <div className="text-xs text-muted-taupe font-light">
                    Messages from signers will appear here
                  </div>
                </div>
                {deadline && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-taupe">
                    <span>⏰</span>
                    <span>
                      Signing closes{" "}
                      {new Date(deadline).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
