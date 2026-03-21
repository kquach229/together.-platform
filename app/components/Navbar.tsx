import { getOrCreateUser } from "@/lib/helpers/getOrCreateUser";
import LogoComponent from "./LogoComponent";
import { Separator } from "@/components/ui/separator";
import { SignUpButton, UserAvatar } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { get } from "http";
import Link from "next/link";

const Navbar = async () => {
  const navItems = [
    "How it works",
    "Create",
    "Sign",
    "Recipient",
    "Dashboard",
    "Pricing",
  ];

  const user = await getOrCreateUser();

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
          {!user?.id ? <SignUpButton /> : <UserAvatar />}
        </ul>
      </div>
      <Separator />
    </nav>
  );
};

export default Navbar;
