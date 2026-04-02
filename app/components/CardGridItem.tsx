"use client";

import { useState } from "react";
import DeleteCardDialog from "./DeleteCardDialog";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface CardGridItemProps {
  card: any;
  menuOpen: string | null;
  setMenuOpen: (id: string | null) => void;
  status: any;
}

function formatDate(dateStr: string | undefined | null) {
  if (!dateStr) return "";
  try {
    const parsed = new Date(dateStr); // works for ISO strings
    return format(parsed, "MMM d, yyyy");
  } catch {
    return dateStr;
  }
}

const CardGridItem = ({
  card,
  menuOpen,
  setMenuOpen,
  status,
}: CardGridItemProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();

  const actions = {
    view: () => router.push(`/cards/${card.id}`),
    delete: () => setOpenDialog(true),
    copy: () =>
      navigator.clipboard.writeText(
        `http://localhost:3000/sign/${card.signingToken}`,
      ),
  } as const;

  return (
    <div
      key={card.id}
      className="bg-white border border-[#E8DDD0] rounded-2xl overflow-hidden hover:shadow-[0_4px_24px_rgba(26,18,8,0.08)] transition-all"
    >
      {/* Colour band */}
      <div
        className="h-20 relative"
        style={{
          background: `linear-gradient(135deg,${card.theme.from},${card.theme.to})`,
        }}
      >
        <div className="absolute top-3 left-4 text-[10px] font-medium tracking-[1.5px] uppercase text-[#C4734A]">
          {card.emoji} {card.occasion}
        </div>
        <div
          className={`absolute bottom-3 left-4 font-playfair text-[18px] tracking-tight ${
            card.theme === "midnight" ? "text-white" : "text-[#1A1208]"
          }`}
        >
          {card.recipient}
        </div>
        {/* Menu */}
        <div className="absolute top-2 right-3">
          <button
            onClick={() => setMenuOpen(menuOpen === card.id ? null : card.id)}
            className="w-7 h-7 rounded-full bg-white/60 hover:bg-white flex items-center justify-center text-muted-taupe text-xs transition-colors border-none cursor-pointer"
          >
            •••
          </button>
          {menuOpen === card.id && (
            <div className="absolute right-0 top-8 bg-white border border-[#E8DDD0] rounded-xl shadow-lg z-20 min-w-[140px] py-1 overflow-hidden">
              {[
                { key: "view" as const, label: "View card" },
                { key: "copy" as const, label: "Copy link" },
                { key: "delete" as const, label: "Delete" },
              ].map((action) => (
                <button
                  key={action.key}
                  onClick={actions[action.key]}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-[#FDF8F2] transition-colors font-dm-sans border-none cursor-pointer bg-transparent ${
                    action.key === "delete" ? "text-red-500" : "text-[#1A1208]"
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${status.bg} ${status.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </div>
          <div className="text-xs text-muted-taupe">
            {formatDate(card.createdAt)}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center gap-1.5 text-muted-taupe">
            <span>🖊</span>
            <span>
              <span className="font-medium text-[#1A1208]">{card.signers}</span>{" "}
              {card.signers === 1 ? "signer" : "signers"}
            </span>
          </div>
          {console.log(Boolean(card.signingDeadline))}
          {card.signingDeadline && (
            <div className="flex items-center gap-1 text-muted-taupe text-xs">
              <span>⏰</span>
              <span>Due {formatDate(card.signingDeadline)}</span>
            </div>
          )}
          {console.log("DELIVERED ON:", card.signingDeadline)}
          {card.deliveredOn && (
            <div className="flex items-center gap-1 text-[#7B9E87] text-xs">
              <span>✓</span>
              <span>Sent {formatDate(card.deliveredOn)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {card.status === "collecting" && (
            <>
              <button className="flex-1 py-2 rounded-full text-xs font-medium bg-terracotta text-white hover:bg-[#C4734A] transition-colors font-dm-sans border-none cursor-pointer">
                Deliver card
              </button>
              <button className="py-2 px-3 rounded-full text-xs font-medium border border-[#E8DDD0] text-muted-taupe hover:border-terracotta hover:text-terracotta transition-all font-dm-sans cursor-pointer bg-white">
                Copy link
              </button>
            </>
          )}
          {card.status === "delivered" && (
            <button
              onClick={() => router.push(`/cards/${card.id}`)}
              className="flex-1 py-2 rounded-full text-xs font-medium border border-[#E8DDD0] text-[#1A1208] hover:border-terracotta hover:text-terracotta transition-all font-dm-sans cursor-pointer bg-white"
            >
              View card
            </button>
          )}
        </div>
      </div>
      <DeleteCardDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        cardId={card.id}
      />
    </div>
  );
};

export default CardGridItem;
