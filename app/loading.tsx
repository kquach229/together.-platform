// app/loading.tsx
// Root loading state — shown by Next.js during any top-level
// route transition or server component data fetch.

import React from "react";

export default function Loading() {
  return (
    <div className="font-dm-sans min-h-screen bg-[#FDF8F2] flex flex-col items-center justify-center gap-6">
      {/* Logo */}
      <div className="font-playfair text-[28px] tracking-tight text-[#1A1208] select-none">
        togather<span className="text-terracotta">.</span>
      </div>

      {/* Orbiting card squares */}
      <div className="relative w-16 h-16">
        {[
          {
            color: "#D4845A",
            delay: "0s",
            top: "0",
            left: "50%",
            transform: "translateX(-50%)",
          },
          {
            color: "#F5EAD8",
            delay: "0.2s",
            top: "25%",
            right: "0",
            transform: "",
          },
          {
            color: "#EEF3EE",
            delay: "0.4s",
            bottom: "0",
            right: "25%",
            transform: "",
          },
          {
            color: "#F0EBF8",
            delay: "0.6s",
            bottom: "0",
            left: "25%",
            transform: "",
          },
          {
            color: "#E6F1FB",
            delay: "0.8s",
            top: "25%",
            left: "0",
            transform: "",
          },
        ].map((dot, i) => (
          <span
            key={i}
            className="absolute w-3.5 h-3.5 rounded-[3px] animate-orbit"
            style={{
              background: dot.color,
              animationDelay: dot.delay,
              top: (dot as any).top ?? undefined,
              left: (dot as any).left ?? undefined,
              right: (dot as any).right ?? undefined,
              bottom: (dot as any).bottom ?? undefined,
              transform: dot.transform || undefined,
            }}
          />
        ))}
      </div>

      <p className="text-sm text-[#8C7B6B] font-light tracking-wide">
        Loading…
      </p>
    </div>
  );
}
