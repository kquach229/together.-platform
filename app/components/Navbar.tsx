import LogoComponent from "./LogoComponent";
import { Separator } from "@/components/ui/separator";
import { Show, UserAvatar, UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { get } from "http";
import Link from "next/link";
import SignUpButton from "./SignUpButton";
import AppSideBar from "./AppSideBar";

const Navbar = async () => {
  const navItems = ["Dashboard", "How it works", "Pricing"];
  const user = await currentUser();

  const filteredNavItems = !user?.id
    ? navItems.filter((item) => item !== "Dashboard")
    : navItems;
  return (
    <nav className="bg-background font-dm-sans">
      <div className="">
        <div className="md:flex items-center justify-between hidden h-20 px-5">
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

            <Show fallback={<SignUpButton />} when={"signed-in"}>
              <UserButton />
            </Show>
          </ul>
        </div>
      </div>
      <div className="block md:hidden">
        <AppSideBar />
      </div>
      <Separator />
    </nav>
  );
};

export default Navbar;
