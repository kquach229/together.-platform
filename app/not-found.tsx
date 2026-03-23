// app/not-found.tsx
// Shown automatically by Next.js when notFound() is called
// or when a route doesn't exist.

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="font-dm-sans min-h-screen bg-[#FDF8F2] text-[#1A1208] flex flex-col">
      {/* NAV */}
      <nav className="flex items-center justify-between px-12 h-16 border-b border-[#E8DDD0]">
        <Link
          href="/"
          className="font-playfair text-[22px] tracking-tight no-underline text-[#1A1208]"
        >
          together<span className="text-terracotta">.</span>
        </Link>
      </nav>

      {/* BODY */}
      <div className="flex-1 flex flex-col items-center justify-center px-12 text-center">
        {/* Large decorative number */}
        <div
          className="font-playfair font-bold leading-none select-none mb-8"
          style={{ fontSize: "clamp(120px,20vw,200px)", color: "#F5EAD8" }}
        >
          404
        </div>

        <h1 className="font-playfair text-[clamp(28px,4vw,44px)] tracking-tight mb-4 -mt-6 relative z-10">
          This page doesn't exist.
        </h1>

        <p className="text-[16px] text-[#8C7B6B] font-light leading-[1.75] max-w-[400px] mb-10">
          The card, link, or page you're looking for has either been removed,
          delivered, or never existed.
        </p>

        {/* Common reasons */}
        <div className="bg-white border border-[#E8DDD0] rounded-2xl p-6 max-w-[420px] w-full text-left mb-10">
          <div className="text-[11px] font-medium tracking-[1.5px] uppercase text-[#8C7B6B] mb-4">
            Common reasons
          </div>
          <div className="flex flex-col gap-3">
            {[
              {
                icon: "🔒",
                text: "The card hasn't been delivered yet — only the recipient can open it once it's sent.",
              },
              {
                icon: "⏰",
                text: "The signing link has expired or the card was archived.",
              },
              {
                icon: "🔗",
                text: "The link may have been copied incorrectly — check for missing characters.",
              },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3">
                <span className="text-base mt-0.5 shrink-0">{item.icon}</span>
                <p className="text-sm text-[#8C7B6B] font-light leading-[1.7]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap justify-center">
          <Link
            href="/"
            className="bg-terracotta text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-[#C4734A] transition-colors no-underline"
          >
            Go home
          </Link>
          <Link
            href="/create"
            className="bg-transparent text-[#1A1208] px-8 py-3 rounded-full text-sm border border-[#E8DDD0] hover:border-terracotta hover:text-terracotta transition-all no-underline"
          >
            Create a card →
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <div className="px-12 py-6 border-t border-[#E8DDD0] flex items-center justify-between">
        <p className="text-xs text-[#C5B8AD]">
          © {new Date().getFullYear()} Together. All rights reserved.
        </p>
        <div className="flex gap-5">
          {["Help centre", "Privacy policy"].map((l) => (
            <Link
              key={l}
              href="#"
              className="text-xs text-[#C5B8AD] hover:text-[#8C7B6B] transition-colors no-underline"
            >
              {l}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
