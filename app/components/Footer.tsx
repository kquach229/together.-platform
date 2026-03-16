import { ArrowRight, Mail, Instagram, Twitter, Facebook } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  Product: ["How it Works", "Occasions", "Pricing", "Examples"],
  Company: ["About", "Blog", "Careers", "Press"],
  Support: ["Help Center", "Contact Us", "Privacy Policy", "Terms of Service"],
};

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
                Group greeting cards that actually feel personal. For every occasion, every team, every moment.
              </p>
            </div>
            {Object.entries({
              Product: ["How it works", "Occasions", "Pricing", "For Teams", "Examples"],
              Company: ["About", "Blog", "Careers", "Press"],
              Support: ["Help centre", "Contact us", "Privacy policy", "Terms of service"],
            }).map(([heading, links]) => (
              <div key={heading}>
                <h5 className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#8A7F74] mb-4">{heading}</h5>
                {links.map((l) => (
                  <a key={l} className="block text-sm text-[#6A635D] mb-2.5 cursor-pointer hover:text-terracotta transition-colors no-underline">
                    {l}
                  </a>
                ))}
              </div>
            ))}
          </div>
          <div className="border-t border-[#2E2820] pt-6 flex justify-between items-center">
            <p className="text-xs text-[#6A635D]">© 2026 Together. All rights reserved.</p>
            <div className="flex gap-5">
              {["Twitter", "Instagram", "LinkedIn"].map((s) => (
                <a key={s} className="text-xs text-[#6A635D] cursor-pointer hover:text-terracotta transition-colors no-underline">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
  );
}