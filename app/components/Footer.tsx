import { link } from "fs";
import Link from "next/link";

const footerLinks = [
  {
    heading: "Product",
    links: [
      { label: "How it works", href: "/how-it-works" },

      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Privacy policy", href: "/privacy-policy" },
      { label: "Terms of service", href: "/terms-of-service" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#1A1208] px-12 pt-14 pb-8 font-dm-sans">
      <div className="max-w-[1160px] mx-auto">
        <div className="grid grid-cols-4 gap-12 mb-12">
          <div>
            <div className="font-playfair text-2xl text-[#FDF8F2] mb-3">
              together<span className="text-terracotta">.</span>
            </div>
            <p className="text-sm text-[#8A7F74] leading-[1.7] font-light max-w-[220px]">
              Group greeting cards that actually feel personal. For every
              occasion, every team, every moment.
            </p>
          </div>
          {footerLinks.map((section) => (
            <div key={section.heading}>
              <h5 className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#8A7F74] mb-4">
                {section.heading}
              </h5>

              {section.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-[#8A7F74] hover:text-terracotta transition-colors mb-2 no-underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-[#2E2820] pt-6 flex justify-between items-center">
          <p className="text-xs text-[#6A635D]">
            © 2026 Together. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Twitter", "Instagram", "LinkedIn"].map((s) => (
              <a
                key={s}
                className="text-xs text-[#6A635D] cursor-pointer hover:text-terracotta transition-colors no-underline"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
