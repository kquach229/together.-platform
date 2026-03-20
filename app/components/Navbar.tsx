import LogoComponent from "./LogoComponent";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const Navbar = () => {
  const navItems = [
    "How it works",
    "Create",
    "Sign",
    "Recipient",
    "Dashboard",
    "Pricing",
  ];
  return (
    <nav className="bg-background font-dm-sans">
      <div className="flex items-center justify-between h-20 px-5">
        <Link href="/" className="cursor-pointer">
          <LogoComponent />
        </Link>
        <ul className="flex gap-5 text-sm font-normal text-muted-taupe">
          {navItems.map((item) => (
            <li
              key={item}
              className="text-muted-taupe hover:text-terracotta transition-colors  cursor-pointer"
            >
              <Link href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}>
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Separator />
    </nav>
  );
};

export default Navbar;
