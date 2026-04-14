import LogoComponent from "./LogoComponent";
import { Separator } from "@/components/ui/separator";
import { Show, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import SignUpButton from "./SignUpButton";
import AppSideBar from "./AppSideBar";
import prisma from "@/lib/prisma";

const Navbar = async () => {
  const navItems = ["Dashboard", "About", "How it works", "Pricing"];
  const clerkUser = await currentUser();

  // fetch DB user (this is the important part)
  const dbUser = clerkUser
    ? await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
        select: {
          id: true,
          cardsRemaining: true,
          email: true,
        },
      })
    : null;

  const user = clerkUser
    ? {
        id: clerkUser.id,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        email: clerkUser.emailAddresses?.[0]?.emailAddress ?? null,
        cardsRemaining: dbUser?.cardsRemaining ?? 0,
      }
    : null;

  const filteredNavItems = !user?.id
    ? navItems.filter((item) => item !== "Dashboard")
    : navItems;

  return (
    <nav className="bg-background font-dm-sans">
      <div>
        <div className="md:flex items-center justify-between hidden h-20 px-5">
          <Link href="/" className="cursor-pointer">
            <LogoComponent />
          </Link>

          <ul className="flex gap-5 items-center text-sm font-normal text-muted-taupe">
            {filteredNavItems.map((item) => (
              <li
                key={item}
                className="hover:text-terracotta transition-colors cursor-pointer"
              >
                <Link href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}>
                  {item}
                </Link>
              </li>
            ))}

            <Show fallback={<SignUpButton />} when={"signed-in"}>
              {/* 👇 Card balance pill */}
              {dbUser && (
                <li>
                  <div className="px-3 py-1 rounded-full bg-[#F5EAD8] text-[#C4734A] text-xs font-medium">
                    🎴 {dbUser.cardsRemaining} cards
                  </div>
                </li>
              )}

              <UserButton />
            </Show>
          </ul>
        </div>
      </div>

      <div className="block md:hidden">
        <AppSideBar user={user} />
      </div>

      <Separator />
    </nav>
  );
};

export default Navbar;
