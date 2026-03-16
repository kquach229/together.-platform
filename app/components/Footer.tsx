import { ArrowRight, Mail, Instagram, Twitter, Facebook } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  Product: ["How it Works", "Occasions", "Pricing", "Examples"],
  Company: ["About", "Blog", "Careers", "Press"],
  Support: ["Help Center", "Contact Us", "Privacy Policy", "Terms of Service"],
};

export default function Footer() {
  return (
    <footer className="bg-warm-sand border-t border-warm-border font-dm-sans">

      {/* Main footer content */}
      <div className="max-w-5xl mx-auto px-10 py-16 grid grid-cols-4 gap-10">

        {/* Brand col */}
        <div className="flex flex-col gap-4">
          <h3 className="text-foreground font-playfair">Together</h3>
          <p className="text-muted-taupe text-sm leading-relaxed">
            Group greeting cards that bring people <b className="italic">together</b>, no matter the distance.
          </p>
          <div className="flex gap-3 mt-2">
            <Instagram className="w-4 h-4 text-muted-taupe hover:text-terracotta cursor-pointer transition-colors" />
            <Twitter className="w-4 h-4 text-muted-taupe hover:text-terracotta cursor-pointer transition-colors" />
            <Facebook className="w-4 h-4 text-muted-taupe hover:text-terracotta cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Link cols */}
        {Object.entries(footerLinks).map(([category, links]) => (
          <div key={category} className="flex flex-col gap-3">
            <h6 className="text-foreground font-semibold text-sm uppercase tracking-wider">
              {category}
            </h6>
            <ul className="flex flex-col gap-2">
              {links.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-muted-taupe text-sm hover:text-terracotta transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

      </div>



      {/* Bottom bar */}
      <div className="border-t border-warm-border">
        <div className="max-w-5xl mx-auto px-10 py-5 flex items-center justify-between">
          <p className="text-muted-taupe text-xs">© 2026 Together. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="#" className="text-muted-taupe text-xs hover:text-terracotta transition-colors">Privacy</Link>
            <Link href="#" className="text-muted-taupe text-xs hover:text-terracotta transition-colors">Terms</Link>
            <Link href="#" className="text-muted-taupe text-xs hover:text-terracotta transition-colors">Cookies</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}