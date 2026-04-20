// components/loaders.tsx
// Three loader components for different contexts across the app.
// Usage:
//   <PageLoader label="Loading your card…" />     — full page loading state
//   <DotsLoader label="Signing…" />               — inline button / action loading
//   <SpinnerLoader label="Fetching signatures…" /> — API / data fetching

import React from "react";

// ─── 1. PAGE LOADER ──────────────────────────────────────────
// Used in loading.tsx files and full-page suspense boundaries.
// Shows the togather. logo with an orbiting card animation.

interface PageLoaderProps {
  label?: string;
}

export function PageLoader({ label = "Loading…" }: PageLoaderProps) {
  return (
    <div className="min-h-screen bg-[#FDF8F2] flex flex-col items-center justify-center gap-6">
      <div className="font-playfair text-[28px] tracking-tight text-[#1A1208]">
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
              top: dot.top ?? undefined,
              left: dot.left ?? undefined,
              right: (dot as any).right ?? undefined,
              bottom: (dot as any).bottom ?? undefined,
              transform: dot.transform || undefined,
            }}
          />
        ))}
      </div>

      <p className="text-sm text-[#8C7B6B] font-light tracking-wide">{label}</p>
    </div>
  );
}

// ─── 2. DOTS LOADER ──────────────────────────────────────────
// Used inside buttons and inline action states.
// Three dots that bounce in sequence — terracotta, warm, sage.

interface DotsLoaderProps {
  label?: string;
}

export function DotsLoader({ label }: DotsLoaderProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex gap-1.5 items-center">
        {[
          { color: "#D4845A", delay: "0s" },
          { color: "#C4A882", delay: "0.15s" },
          { color: "#7B9E87", delay: "0.3s" },
        ].map((dot, i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full animate-bounce-dot"
            style={{ background: dot.color, animationDelay: dot.delay }}
          />
        ))}
      </span>
      {label && <span>{label}</span>}
    </span>
  );
}

// ─── 3. SPINNER LOADER ───────────────────────────────────────
// Used for API calls and data fetching states.
// A pen emoji inside a spinning ring — on-brand for Togather.

interface SpinnerLoaderProps {
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function SpinnerLoader({ label, size = "md" }: SpinnerLoaderProps) {
  const sizes = {
    sm: { ring: "w-8 h-8", pen: "text-sm", text: "text-xs" },
    md: { ring: "w-12 h-12", pen: "text-lg", text: "text-sm" },
    lg: { ring: "w-16 h-16", pen: "text-2xl", text: "text-base" },
  };
  const s = sizes[size];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`relative ${s.ring}`}>
        <div
          className={`${s.ring} rounded-full border-[2.5px] border-[#E8DDD0] border-t-terracotta animate-spin`}
        />
        <span
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${s.pen}`}
        >
          🖊
        </span>
      </div>
      {label && (
        <p className={`${s.text} text-[#8C7B6B] font-light`}>{label}</p>
      )}
    </div>
  );
}
