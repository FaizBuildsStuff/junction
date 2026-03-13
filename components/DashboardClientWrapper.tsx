"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { User as UserIcon, Zap } from "lucide-react";
import SidebarNav, { type NavItem } from "@/app/(dashboard)/dashboard/SidebarNav";
import SignOutButton from "@/app/(dashboard)/dashboard/SignOutButton";

const nav: NavItem[] = [
  { name: "Overview", href: "/dashboard", iconName: "overview" },
  { name: "Stack Costs", href: "/dashboard/stack-costs", iconName: "stack" },
  { name: "Infrastructure", href: "/dashboard/infrastructure", iconName: "infrastructure" },
  { name: "Activity", href: "/dashboard/activity", iconName: "activity" },
  { name: "Settings", href: "/dashboard/settings", iconName: "settings" },
];

export default function DashboardClientWrapper({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { username: string; email: string };
}) {
  const pathname = usePathname();
  const isCanvas = pathname?.includes("/dashboard/canvas/");

  if (isCanvas) {
    return (
      <div className="min-h-screen bg-[#F2F9F1] font-satoshi selection:bg-[#C8F064]">
        <main className="w-full h-screen overflow-hidden">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F9F1] flex font-satoshi selection:bg-[#C8F064]">
      <aside className="hidden lg:flex w-72 bg-white border-r border-[#162C25]/5 flex-col p-8 fixed h-full z-50">
        <Link href="/" className="flex items-center gap-3 mb-16">
          <div className="w-10 h-10 bg-[#162C25] rounded-xl flex items-center justify-center">
            <Zap size={20} className="text-[#C8F064] fill-[#C8F064]" />
          </div>
          <span className="text-xl font-black text-[#162C25] uppercase tracking-tighter">
            Junction™
          </span>
        </Link>

        <SidebarNav items={nav} />

        <div className="mt-auto pt-8 border-t border-[#162C25]/5">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-[#C8F064] flex items-center justify-center border-2 border-[#162C25]">
              <UserIcon size={18} className="text-[#162C25]" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-[#162C25] truncate">{user.username}</p>
              <p className="text-[9px] font-bold text-[#162C25]/40 truncate">{user.email}</p>
            </div>
          </div>
          <SignOutButton />
        </div>
      </aside>

      <main className="flex-1 lg:ml-72 p-6 md:p-12 lg:p-16 min-h-screen">{children}</main>
    </div>
  );
}
