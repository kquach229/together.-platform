"use client";

// components/EditCardPanel.tsx
// Slide-in edit panel for the card creator.
// Allows editing occasion, recipient name/email, opening message,
// theme, signing deadline, and scheduled delivery.

import { useState } from "react";
import { useRouter } from "next/navigation";

const themes = [
  { id: "warm", label: "Warm", from: "#FEF3ED", to: "#F5EAD8" },
  { id: "sage", label: "Sage", from: "#EEF3EE", to: "#D4E8D4" },
  { id: "lavender", label: "Lavender", from: "#F0EBF8", to: "#E2D4F0" },
  { id: "sky", label: "Sky", from: "#E6F1FB", to: "#C8DFF5" },
  { id: "parchment", label: "Parchment", from: "#FDF8F2", to: "#EDE0CE" },
  { id: "midnight", label: "Midnight", from: "#1A1208", to: "#2E2820" },
];

const occasions = [
  "Birthday",
  "Farewell",
  "Congratulations",
  "Wedding",
  "New Baby",
  "Get Well Soon",
  "Graduation",
  "Thank You",
  "Holiday",
  "Work Anniversary",
  "Just Because",
  "Sympathy",
];

interface EditCardPanelProps {
  cardId: string;
  initial: {
    occasion: string;
    recipientName: string;
    recipientEmail: string | null;
    openingMessage: string | null;
    theme: string;
    signingDeadline: Date | null;
    scheduledDeliveryAt: Date | null;
  };
  onClose: () => void;
}

function toDateInputValue(date: Date | null): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

export default function EditCardPanel({
  cardId,
  initial,
  onClose,
}: EditCardPanelProps) {
  const router = useRouter();

  const [occasion, setOccasion] = useState(initial.occasion);
  const [recipientName, setRecipientName] = useState(initial.recipientName);
  const [recipientEmail, setRecipientEmail] = useState(
    initial.recipientEmail ?? "",
  );
  const [openingMessage, setOpeningMessage] = useState(
    initial.openingMessage ?? "",
  );
  const [theme, setTheme] = useState(initial.theme);
  const [signingDeadline, setSigningDeadline] = useState(
    toDateInputValue(initial.signingDeadline),
  );
  const [scheduledDelivery, setScheduledDelivery] = useState(
    toDateInputValue(initial.scheduledDeliveryAt),
  );

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasChanges =
    occasion !== initial.occasion ||
    recipientName !== initial.recipientName ||
    recipientEmail !== (initial.recipientEmail ?? "") ||
    openingMessage !== (initial.openingMessage ?? "") ||
    theme !== initial.theme ||
    signingDeadline !== toDateInputValue(initial.signingDeadline) ||
    scheduledDelivery !== toDateInputValue(initial.scheduledDeliveryAt);

  async function handleSave() {
    if (!recipientName.trim()) {
      setError("Recipient name is required.");
      return;
    }
    setError(null);
    setIsSaving(true);

    try {
      const res = await fetch(`/api/cards/${cardId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          occasion,
          recipientName: recipientName.trim(),
          recipientEmail: recipientEmail.trim() || "",
          openingMessage: openingMessage.trim() || null,
          theme,
          signingDeadline: signingDeadline
            ? new Date(signingDeadline).toISOString()
            : null,
          scheduledDeliveryAt: scheduledDelivery
            ? new Date(scheduledDelivery).toISOString()
            : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      // Refresh the page to show updated data
      router.refresh();
      onClose();
    } catch (err) {
      console.error("Failed to save card:", err);
      setError("Network error — please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1A1208]/40 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-[480px] bg-[#FDF8F2] z-50 flex flex-col shadow-[0_0_40px_rgba(26,18,8,0.15)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8DDD0]">
          <h2 className="font-playfair text-[22px] tracking-tight">
            Edit card
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#E8DDD0] flex items-center justify-center text-[#8C7B6B] hover:border-terracotta hover:text-terracotta transition-all bg-transparent cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* Scrollable form */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
          {/* Occasion */}
          <div>
            <label className="block text-sm font-medium mb-2">Occasion</label>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full px-4 py-3 border border-[#E8DDD0] rounded-xl text-sm bg-white outline-none focus:border-terracotta transition-colors font-dm-sans"
            >
              {occasions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          {/* Recipient name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Recipient's name <span className="text-terracotta">*</span>
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g. Sarah Chen"
              className="w-full px-4 py-3 border border-[#E8DDD0] rounded-xl text-sm bg-white outline-none focus:border-terracotta transition-colors font-dm-sans placeholder:text-[#C5B8AD]"
            />
          </div>

          {/* Recipient email */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Recipient's email
              <span className="text-terracotta">*</span>
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="sarah@example.com"
              className="w-full px-4 py-3 border border-[#E8DDD0] rounded-xl text-sm bg-white outline-none focus:border-terracotta transition-colors font-dm-sans placeholder:text-[#C5B8AD]"
            />
          </div>

          {/* Opening message */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Opening message
              <span className="text-[#8C7B6B] font-light ml-2">(optional)</span>
            </label>
            <textarea
              value={openingMessage}
              onChange={(e) => setOpeningMessage(e.target.value)}
              placeholder="Write a short note that appears at the top of the card…"
              rows={3}
              maxLength={500}
              className="w-full px-4 py-3 border border-[#E8DDD0] rounded-xl text-sm bg-white outline-none focus:border-terracotta transition-colors resize-none font-dm-sans placeholder:text-[#C5B8AD]"
            />
            <div className="text-right text-xs text-[#8C7B6B] mt-1">
              {openingMessage.length} / 500
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm font-medium mb-3">Theme</label>
            <div className="grid grid-cols-3 gap-2.5">
              {themes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    theme === t.id
                      ? "border-terracotta shadow-[0_2px_12px_rgba(212,132,90,0.2)]"
                      : "border-[#E8DDD0] hover:border-[#C5B8AD]"
                  }`}
                >
                  <div
                    className="h-14 w-full"
                    style={{
                      background: `linear-gradient(135deg, ${t.from}, ${t.to})`,
                    }}
                  />
                  <div
                    className={`px-2 py-1.5 text-xs font-medium text-left ${t.id === "midnight" ? "bg-[#1A1208] text-[#FDF8F2]" : "bg-white text-[#1A1208]"}`}
                  >
                    {t.label}
                  </div>
                  {theme === t.id && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-terracotta flex items-center justify-center text-white text-[8px]">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Signing deadline */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Signing deadline
              <span className="text-[#8C7B6B] font-light ml-2">(optional)</span>
            </label>
            <input
              type="date"
              value={signingDeadline}
              onChange={(e) => setSigningDeadline(e.target.value)}
              className="w-full px-4 py-3 border border-[#E8DDD0] rounded-xl text-sm bg-white outline-none focus:border-terracotta transition-colors font-dm-sans text-[#1A1208]"
            />
            {signingDeadline && (
              <button
                type="button"
                onClick={() => setSigningDeadline("")}
                className="text-xs text-[#8C7B6B] hover:text-terracotta mt-1.5 bg-transparent border-none cursor-pointer p-0 font-dm-sans"
              >
                Remove deadline
              </button>
            )}
          </div>

          {/* Scheduled delivery */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Scheduled delivery
              <span className="text-[#8C7B6B] font-light ml-2">(optional)</span>
            </label>
            <input
              type="date"
              value={scheduledDelivery}
              onChange={(e) => setScheduledDelivery(e.target.value)}
              className="w-full px-4 py-3 border border-[#E8DDD0] rounded-xl text-sm bg-white outline-none focus:border-terracotta transition-colors font-dm-sans text-[#1A1208]"
            />
            <p className="text-xs text-[#8C7B6B] mt-1.5 font-light">
              The card will be automatically delivered on this date.
            </p>
            {scheduledDelivery && (
              <button
                type="button"
                onClick={() => setScheduledDelivery("")}
                className="text-xs text-[#8C7B6B] hover:text-terracotta mt-1 bg-transparent border-none cursor-pointer p-0 font-dm-sans"
              >
                Remove scheduled delivery
              </button>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-[#E8DDD0] flex gap-3 bg-[#FDF8F2]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-full text-sm border border-[#E8DDD0] text-[#8C7B6B] hover:border-terracotta hover:text-terracotta transition-all font-dm-sans bg-transparent cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className={`flex-1 py-3 rounded-full text-sm font-medium transition-all font-dm-sans border-none ${
              isSaving || !hasChanges
                ? "bg-[#E8DDD0] text-[#C5B8AD] cursor-not-allowed"
                : "bg-terracotta text-white hover:bg-[#C4734A] cursor-pointer shadow-[0_4px_16px_rgba(212,132,90,0.25)]"
            }`}
          >
            {isSaving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </>
  );
}
