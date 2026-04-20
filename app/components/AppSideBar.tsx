"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import {
  CreditCardIcon,
  InfoIcon,
  LayoutDashboardIcon,
  WorkflowIcon,
} from "lucide-react";

interface Props {
  user: {
    cardsRemaining: number;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  } | null;
}

const navItems = [
  {
    icon: <LayoutDashboardIcon className="w-4 h-4" />,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <InfoIcon className="w-4 h-4" />,
    label: "About",
    path: "/about",
  },
  {
    icon: <WorkflowIcon className="w-4 h-4" />,
    label: "How it works",
    path: "/how-it-works",
  },
  {
    icon: <CreditCardIcon className="w-4 h-4" />,
    label: "Pricing",
    path: "/pricing",
  },
];

const AppSideBar = ({ user }: Props) => {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar className="bg-red-500">
      <aside className="fixed top-0 left-0 bottom-0 w-60 bg-[#1A1208] flex flex-col z-40 px-5 py-6">
        <SidebarHeader>
          <div className="font-playfair text-[20px] tracking-tight text-[#FDF8F2] mb-10">
            togather<span className="text-terracotta">.</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <nav className="flex flex-col gap-1 flex-1">
              {navItems.map((item) => {
                const isActive =
                  item.path === "/dashboard"
                    ? pathname === "/dashboard" ||
                      pathname.startsWith("/dashboard/")
                    : pathname === item.path;

                return (
                  <Link
                    key={item.label}
                    href={item.path}
                    onClick={() => setOpenMobile(false)}
                    className={`flex items-center gap-5 px-3 py-2.5 rounded-xl text-sm transition-all text-left font-dm-sans w-full ${
                      isActive
                        ? "bg-terracotta text-white font-medium"
                        : "text-[#8A7F74] hover:bg-[#2E2820] hover:text-[#FDF8F2]"
                    }`}
                  >
                    <span className="text-sm w-4 text-center leading-none">
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </SidebarGroup>
        </SidebarContent>

        <SidebarGroup>
          <div className="border border-[#2E2820] rounded-xl p-3 mb-5">
            <div className="text-xs text-[#8A7F74] mb-0.5">Cards Remaining</div>
            <div className="text-sm font-medium text-[#FDF8F2]">
              {user?.cardsRemaining ?? 0}
            </div>
            <Link
              href={"/pricing"}
              onClick={() => setOpenMobile(false)}
              className="mt-1.5 text-xs text-terracotta hover:underline font-medium bg-transparent border-none cursor-pointer p-0"
            >
              Purchase Cards
            </Link>
          </div>
        </SidebarGroup>

        <SidebarFooter>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F5EAD8] flex items-center justify-center text-xs font-medium text-[#C4734A] shrink-0 overflow-hidden">
              <UserButton />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-[#FDF8F2] truncate">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-[10px] text-[#8A7F74] truncate">
                {user?.email}
              </div>
            </div>
          </div>
        </SidebarFooter>
      </aside>
    </Sidebar>
  );
};

export default AppSideBar;
