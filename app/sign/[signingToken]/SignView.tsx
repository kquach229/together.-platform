"use client";

import { getGreeting, getOccasionEmoji } from "@/lib/helpers/greeting";
import { imageUrl } from "@/lib/helpers/imageUrl";
import { uploadPhoto } from "@/lib/helpers/uploadPhoto";
import { getTheme } from "@/lib/theme";
import { useEffect, useRef, useState } from "react";

const bubbleColors = [
  { avatar: "#F5EAD8", avatarText: "#C4734A" },
  { avatar: "#EEF3EE", avatarText: "#5A7D66" },
  { avatar: "#F0EBF8", avatarText: "#6B5A9E" },
  { avatar: "#E6F1FB", avatarText: "#185FA5" },
  { avatar: "#FAE8DE", avatarText: "#993C1D" },
];

const quickEmojis = [
  "🎂",
  "🎉",
  "❤️",
  "🥂",
  "🌟",
  "🎁",
  "✨",
  "🙌",
  "🎈",
  "🔥",
  "👏",
  "💐",
];

function daysUntil(date: Date) {
  const diff = new Date(date).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

interface Signer {
  id: string;
  signerName: string;
  createdAt: Date;
}

interface Card {
  id: string;
  occasion: string;
  recipientName: string;
  theme: string;
  status: string;
  signingDeadline: Date | null;
  signerCount: number;
  creator: { name: string };
  signatures: Signer[];
  creatorPhotoUrl?: string;
}

interface Props {
  card: Card;
  signingToken: string;
}

type Screen = "form" | "success";

export default function SignView({ card, signingToken }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Form state
  const [signerName, setSignerName] = useState("");
  const [message, setMessage] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // UI state
  const [screen, setScreen] = useState<Screen>("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [linkCopied, setLinkCopied] = useState(false);
  const [linkCopyError, setLinkCopyError] = useState("");

  const MAX_CHARS = 300;
  const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
  const MAX_NAME_LENGTH = 100;

  const theme = getTheme(card.theme);
  const emoji = getOccasionEmoji(card.occasion);
  const deadline = card.signingDeadline ? new Date(card.signingDeadline) : null;
  const daysLeft = deadline ? daysUntil(deadline) : null;

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  function handleEmoji(e: string) {
    if (message.length + e.length <= MAX_CHARS) {
      setMessage((m) => m + e);
    }
  }

  function getInitials(name: string) {
    return name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function handlePhoto(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        photo: "Please upload a PNG or JPG image.",
      }));
      ev.target.value = "";
      return;
    }

    if (file.size > MAX_PHOTO_SIZE) {
      setErrors((prev) => ({
        ...prev,
        photo: "Photo must be 5MB or smaller.",
      }));
      ev.target.value = "";
      return;
    }

    setErrors((prev) => ({ ...prev, photo: "" }));
    setPhotoFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };

    reader.onerror = () => {
      setErrors((prev) => ({
        ...prev,
        photo: "Unable to preview this photo. Please try another.",
      }));
      setPhotoFile(null);
      setPhotoPreview(null);
    };

    reader.readAsDataURL(file);
  }

  function removePhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }

    setErrors((prev) => ({ ...prev, photo: "" }));
  }

  function validate() {
    const errs: Record<string, string> = {};

    if (!signerName.trim()) {
      errs.signerName = "Please enter your name.";
    } else if (signerName.trim().length > MAX_NAME_LENGTH) {
      errs.signerName = `Name must be ${MAX_NAME_LENGTH} characters or less.`;
    }

    if (!message.trim()) {
      errs.message = "Please write a message.";
    } else if (message.length > MAX_CHARS) {
      errs.message = `Message must be ${MAX_CHARS} characters or less.`;
    }

    return errs;
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/sign/${signingToken}`,
      );

      setLinkCopied(true);
      setLinkCopyError("");

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = setTimeout(() => {
        setLinkCopied(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to copy link:", error);
      setLinkCopyError("Unable to copy link. Please try again.");
    }
  };

  async function handleSubmit() {
    if (isSubmitting) return;

    const errs = validate();

    if (Object.keys(errs).length > 0) {
      setErrors((prev) => ({ ...prev, ...errs }));
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      let photoUrl: string | undefined;

      if (photoFile) {
        setUploadProgress("Uploading photo…");
        photoUrl = await uploadPhoto(photoFile);
      }

      setUploadProgress("Adding your message…");

      const res = await fetch(`/api/cards/sign/${signingToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signerName: signerName.trim(),
          message: message.trim(),
          photoUrl: photoUrl || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({
          submit: data.message ?? data.error ?? "Something went wrong.",
        });
        return;
      }

      setScreen("success");
    } catch (err) {
      console.error("Failed to sign card", err);
      setErrors({
        submit: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  }

  // SUCCESS SCREEN
  if (screen === "success") {
    return (
      <div className="font-dm-sans bg-[#FDF8F2] text-[#1A1208] min-h-screen">
        <nav className="sticky top-0 z-50 flex items-center justify-between px-12 h-16 bg-[rgba(253,248,242,0.92)] backdrop-blur-md border-b border-[#E8DDD0]">
          <a
            href="/"
            className="font-playfair text-[22px] tracking-tight no-underline text-[#1A1208]"
          >
            Togather<span className="text-terracotta">.</span>
          </a>
        </nav>

        <div className="max-w-[480px] mx-auto px-8 py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-[#EEF3EE] flex items-center justify-center text-4xl mx-auto mb-6">
            🎉
          </div>

          <h2 className="font-playfair text-[36px] tracking-tight mb-3">
            You're on the card!
          </h2>

          <p className="text-[16px] text-[#8C7B6B] font-light leading-[1.75] mb-8">
            Your message has been added. It'll stay private until{" "}
            <span className="text-[#1A1208] font-medium">
              {card.recipientName}
            </span>
            's card is delivered.
          </p>

          <div className="bg-[#F5EAD8] rounded-2xl p-5 text-left mb-8">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#F5EAD8] border border-[#EDD5C5] flex items-center justify-center text-xs font-medium text-[#C4734A]">
                {getInitials(signerName)}
              </div>

              <span className="text-sm font-medium">{signerName}</span>
              <span className="text-xs text-[#8C7B6B] ml-auto">Just now</span>
            </div>

            <p className="text-sm leading-[1.7] text-[#3A2F27]">{message}</p>

            {photoPreview && (
              <img
                src={photoPreview}
                alt="Your uploaded photo"
                className="w-full h-auto object-cover max-h-[420px] mt-5"
              />
            )}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setScreen("form");
                setSignerName("");
                setMessage("");
                setErrors({});
                setLinkCopyError("");
                removePhoto();
              }}
              className="w-full py-3 rounded-full text-sm font-medium bg-terracotta text-white hover:bg-[#C4734A] transition-colors font-dm-sans border-none cursor-pointer"
            >
              Add another message
            </button>

            <a
              href="/"
              className="w-full py-3 rounded-full text-sm font-medium border border-[#E8DDD0] text-[#1A1208] hover:border-terracotta hover:text-terracotta transition-all text-center no-underline block"
            >
              Create your own card →
            </a>
          </div>
        </div>
      </div>
    );
  }

  // SIGNING FORM
  return (
    <div className="font-dm-sans bg-[#FDF8F2] text-[#1A1208] min-h-screen">
      {/* NAV */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-12 h-16 bg-[rgba(253,248,242,0.92)] backdrop-blur-md border-b border-[#E8DDD0]">
        <a
          href="/"
          className="font-playfair text-[22px] tracking-tight no-underline text-[#1A1208]"
        >
          Togather<span className="text-terracotta">.</span>
        </a>

        <div className="text-sm text-[#8C7B6B]">
          Signing a card for{" "}
          <span className="text-[#1A1208] font-medium">
            {card.recipientName}
          </span>
        </div>
      </nav>

      <div className="max-w-250 mx-auto px-12 py-12 grid grid-cols-[1fr_300px] gap-12 items-start">
        {/* LEFT: FORM */}
        <div>
          {/* Card banner */}
          <div
            className="rounded-2xl p-6 mb-8 text-center"
            style={{
              background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
            }}
          >
            <div
              className="text-[10px] font-medium tracking-[2px] uppercase mb-2"
              style={{ color: theme.accent }}
            >
              {emoji} {card.occasion}
            </div>

            <h1
              className="font-playfair text-[26px] tracking-tight mb-1"
              style={{ color: theme.heading }}
            >
              {getGreeting(card.occasion, card.recipientName)}
            </h1>

            <p className="text-sm font-light" style={{ color: theme.muted }}>
              Organised by{" "}
              <span className="font-medium" style={{ color: theme.strong }}>
                {card.creator.name}
              </span>
            </p>

            {card.creatorPhotoUrl && (
              <div className="w-full max-h-100 overflow-hidden mt-5">
                <img
                  src={imageUrl(card.creatorPhotoUrl)}
                  alt="Card cover"
                  className="w-full h-full object-contain rounded-sm"
                />
              </div>
            )}

            {/* Signer count only — names remain private */}
            {card.signatures.length > 0 && (
              <div className="flex items-center justify-center gap-3 mt-4">
                <span className="text-xs" style={{ color: theme.muted }}>
                  <span className="font-medium" style={{ color: theme.strong }}>
                    {card.signatures.length}{" "}
                    {card.signatures.length === 1
                      ? "person has"
                      : "people have"}
                  </span>{" "}
                  already signed
                </span>
              </div>
            )}
          </div>

          {/* Form fields */}
          <div className="flex flex-col gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Your name <span className="text-terracotta">*</span>
              </label>

              <input
                type="text"
                value={signerName}
                maxLength={MAX_NAME_LENGTH}
                onChange={(e) => {
                  setSignerName(e.target.value);
                  setErrors((prev) => ({ ...prev, signerName: "" }));
                }}
                placeholder="e.g. David Kim"
                className={`w-full px-4 py-3 border rounded-xl text-sm bg-white outline-none transition-colors font-dm-sans placeholder:text-[#C5B8AD] ${
                  errors.signerName
                    ? "border-red-400"
                    : "border-[#E8DDD0] focus:border-terracotta"
                }`}
              />

              {errors.signerName && (
                <p className="text-xs text-red-500 mt-1">{errors.signerName}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Your message <span className="text-terracotta">*</span>
              </label>

              <textarea
                value={message}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CHARS) {
                    setMessage(e.target.value);
                    setErrors((prev) => ({ ...prev, message: "" }));
                  }
                }}
                placeholder="Write something heartfelt…"
                rows={5}
                className={`w-full px-4 py-3 border rounded-xl text-sm bg-white outline-none transition-colors resize-none font-dm-sans placeholder:text-[#C5B8AD] ${
                  errors.message
                    ? "border-red-400"
                    : "border-[#E8DDD0] focus:border-terracotta"
                }`}
              />

              <div className="flex justify-between mt-1">
                {errors.message ? (
                  <p className="text-xs text-red-500">{errors.message}</p>
                ) : (
                  <span />
                )}

                <span
                  className={`text-xs ml-auto ${
                    message.length >= MAX_CHARS
                      ? "text-terracotta font-medium"
                      : "text-[#8C7B6B]"
                  }`}
                >
                  {message.length} / {MAX_CHARS}
                </span>
              </div>
            </div>

            {/* Quick emoji */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Quick emoji
              </label>

              <div className="flex flex-wrap gap-2">
                {quickEmojis.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => handleEmoji(e)}
                    className="w-9 h-9 rounded-lg border border-[#E8DDD0] bg-white text-base flex items-center justify-center hover:border-terracotta hover:bg-[#FEF3ED] transition-all cursor-pointer"
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Your email
                <span className="text-[#8C7B6B] font-light ml-2">
                  (optional)
                </span>
              </label>

              <p className="text-xs text-[#8C7B6B] mt-1.5 font-light">
                We'll let you know when the card is delivered.
              </p>
            </div>

            {/* Photo upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Add a photo
                <span className="text-[#8C7B6B] font-light ml-2">
                  (optional)
                </span>
              </label>

              {photoPreview ? (
                <div className="relative rounded-xl overflow-hidden border border-[#E8DDD0]">
                  <img
                    src={photoPreview}
                    alt="Photo preview"
                    className="w-full h-auto object-cover"
                  />

                  <button
                    type="button"
                    onClick={removePhoto}
                    aria-label="Remove photo"
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#1A1208]/60 text-white text-xs flex items-center justify-center hover:bg-[#1A1208] transition-colors cursor-pointer border-none"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full border border-dashed border-[#E8DDD0] rounded-xl p-6 flex flex-col items-center gap-2 hover:border-terracotta hover:bg-[#FEF3ED]/30 transition-all bg-white cursor-pointer"
                >
                  <span className="text-2xl">📷</span>
                  <span className="text-sm text-[#8C7B6B] font-light">
                    Click to upload a photo
                  </span>
                  <span className="text-xs text-[#C5B8AD]">
                    PNG, JPG up to 5MB
                  </span>
                </button>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={handlePhoto}
              />

              {errors.photo && (
                <p className="text-xs text-red-500 mt-1">{errors.photo}</p>
              )}
            </div>

            {/* Privacy note */}
            <div className="flex items-start gap-3 bg-[#F5EAD8] rounded-xl p-4">
              <span className="text-lg">🔒</span>

              <p className="text-xs text-[#8C7B6B] leading-[1.7] font-light">
                Your message stays completely private until the card is
                delivered to{" "}
                <span className="font-medium text-[#1A1208]">
                  {card.recipientName}
                </span>
                .
              </p>
            </div>

            {/* Upload progress */}
            {uploadProgress && (
              <div className="flex items-center gap-3 p-4 bg-[#F5EAD8] rounded-xl">
                <div className="w-4 h-4 border-2 border-[#E8DDD0] border-t-terracotta rounded-full animate-spin shrink-0" />
                <p className="text-sm text-[#8C7B6B] font-light">
                  {uploadProgress}
                </p>
              </div>
            )}

            {/* Error */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {errors.submit}
              </div>
            )}

            {/* Submit button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-4 rounded-full text-sm font-medium transition-all font-dm-sans border-none ${
                isSubmitting
                  ? "bg-[#E8DDD0] text-[#C5B8AD] cursor-not-allowed"
                  : "bg-terracotta text-white hover:bg-[#C4734A] shadow-[0_4px_20px_rgba(212,132,90,0.3)] cursor-pointer"
              }`}
            >
              {uploadProgress ??
                (isSubmitting ? "Signing…" : "Sign the card →")}
            </button>
          </div>
        </div>

        {/* RIGHT: SIDEBAR */}
        <div className="sticky top-24">
          {/* Already signed */}
          {card.signatures.length > 0 && (
            <>
              <div className="text-[11px] font-medium tracking-[1.5px] uppercase text-[#8C7B6B] mb-3">
                Already signed ({card.signatures.length})
              </div>

              <div className="flex flex-col gap-2 mb-4">
                {card.signatures.slice(0, 6).map((s, i) => {
                  const c = bubbleColors[i % bubbleColors.length];

                  const timeAgo = Math.max(
                    0,
                    Math.round(
                      (Date.now() - new Date(s.createdAt).getTime()) / 60000,
                    ),
                  );

                  const timeLabel =
                    timeAgo < 60
                      ? `${timeAgo}m ago`
                      : timeAgo < 1440
                        ? `${Math.round(timeAgo / 60)}h ago`
                        : `${Math.round(timeAgo / 1440)}d ago`;

                  return (
                    <div
                      key={s.id}
                      className="flex items-center gap-3 bg-white border border-[#E8DDD0] rounded-xl p-3"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0"
                        style={{
                          background: c.avatar,
                          color: c.avatarText,
                        }}
                      >
                        {getInitials(s.signerName)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {s.signerName}
                        </div>
                        <div className="text-xs text-[#8C7B6B]">Signed</div>
                      </div>

                      <div className="text-[10px] text-[#8C7B6B] shrink-0">
                        {timeLabel}
                      </div>
                    </div>
                  );
                })}

                {card.signatures.length > 6 && (
                  <p className="text-xs text-[#8C7B6B] text-center font-light pt-1">
                    +{card.signatures.length - 6} more
                  </p>
                )}
              </div>
            </>
          )}

          {/* Deadline */}
          {deadline && daysLeft !== null && (
            <div
              className={`rounded-xl p-4 flex items-start gap-3 mb-4 ${
                daysLeft <= 2
                  ? "bg-[#FEF3ED] border border-[#EDD5C5]"
                  : "bg-white border border-[#E8DDD0]"
              }`}
            >
              <span className="text-lg">⏰</span>

              <div>
                <div
                  className={`text-sm font-medium ${
                    daysLeft <= 2 ? "text-terracotta" : "text-[#1A1208]"
                  }`}
                >
                  Signing closes{" "}
                  {deadline.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>

                <div className="text-xs text-[#8C7B6B] font-light mt-0.5">
                  {daysLeft <= 0
                    ? "Today is the last day"
                    : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} remaining`}
                </div>
              </div>
            </div>
          )}

          {/* Share nudge */}
          <div className="text-xs text-[#8C7B6B] text-center font-light leading-[1.7]">
            <p>Know someone else who'd want to sign?</p>

            <button
              type="button"
              onClick={handleCopyLink}
              className="text-terracotta font-medium hover:underline bg-transparent border-none cursor-pointer p-0"
            >
              {linkCopied ? "Link copied!" : "Share the link →"}
            </button>

            {linkCopyError && (
              <p className="text-red-500 mt-2">{linkCopyError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
