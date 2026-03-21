import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { getUser } from "@/lib/helpers/getUser";

import { UserButton } from "@clerk/nextjs";

const AppSideBar = async () => {
  const user = await getUser({
    subscription: true,
    cards: true,
    notifications: true,
  });
  console.log(user);
  return (
    <Sidebar className="bg-red-500">
      {/* ── SIDEBAR ── */}
      <aside className="fixed top-0 left-0 bottom-0 w-60  bg-[#1A1208] flex flex-col z-40 px-5 py-6">
        <SidebarHeader>
          <div className="font-playfair text-[20px] tracking-tight text-[#FDF8F2] mb-10">
            together<span className="text-terracotta">.</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <nav className="flex flex-col gap-1 flex-1">
              {[
                { icon: "▦", label: "Dashboard", active: true },
                { icon: "＋", label: "New card", active: false },
                { icon: "◷", label: "Collecting", active: false },
                { icon: "✓", label: "Delivered", active: false },
                { icon: "◈", label: "Drafts", active: false },
              ].map((item) => (
                <button
                  key={item.label}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left font-dm-sans w-full border-none ${
                    item.active
                      ? "bg-terracotta text-white font-medium"
                      : "text-[#8A7F74] hover:bg-[#2E2820] hover:text-[#FDF8F2] bg-transparent"
                  }`}
                >
                  <span className="text-sm w-4 text-center leading-none">
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}
            </nav>
          </SidebarGroup>

          <SidebarGroup>
            {/* Plan badge */}
            <div className="border border-[#2E2820] rounded-xl p-3 mb-5">
              <div className="text-xs text-[#8A7F74] mb-0.5">Current plan</div>
              <div className="text-sm font-medium text-[#FDF8F2]">
                {user?.plan}
              </div>
              <button className="mt-1.5 text-xs text-terracotta hover:underline font-medium bg-transparent border-none cursor-pointer p-0">
                Upgrade to Plus →
              </button>
            </div>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          {/* User */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F5EAD8] flex items-center justify-center text-xs font-medium text-[#C4734A] shrink-0">
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
