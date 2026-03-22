import LogoComponent from "./LogoComponent";
import { Separator } from "@/components/ui/separator";
import { UserAvatar, UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { get } from "http";
import Link from "next/link";
import SignUpButton from "./SignUpButton";

const Navbar = async () => {
  const navItems = [
    "Dashboard",
    "How it works",
    "Create",
    "Sign",
    "Recipient",
    "Pricing",
  ];
  const user = await currentUser();

  const filteredNavItems = !user?.id
    ? navItems.filter((item) => item !== "How it works")
    : navItems;
  return (
    <nav className="bg-background font-dm-sans">
      <div className="flex items-center justify-between h-20 px-5">
        <Link href="/" className="cursor-pointer">
          <LogoComponent />
        </Link>
        <ul className="flex gap-5 items-center text-sm font-normal text-muted-taupe">
          {filteredNavItems.map((item) => (
            <li
              key={item}
              className="text-muted-taupe hover:text-terracotta transition-colors  cursor-pointer"
            >
              <Link href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}>
                {item}
              </Link>
            </li>
          ))}
          {!user?.id ? <SignUpButton /> : <UserButton />}
        </ul>
      </div>
      <Separator />
    </nav>
  );
};

export default Navbar;
