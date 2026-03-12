"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Activity,
  CreditCard,
  Database,
  LayoutDashboard,
  Settings,
} from "lucide-react";

export type NavItem = {
  name: string;
  href: string;
  iconName: "overview" | "stack" | "infrastructure" | "activity" | "settings";
};

const icons = {
  overview: LayoutDashboard,
  stack: CreditCard,
  infrastructure: Database,
  activity: Activity,
  settings: Settings,
} as const;

export default function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-2">
      {items.map((item) => {
        const active =
          pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
        const Icon = icons[item.iconName];

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest",
              active
                ? "bg-[#162C25] text-[#C8F064]"
                : "text-[#162C25]/40 hover:bg-[#162C25]/5 hover:text-[#162C25]"
            )}
          >
            <Icon size={18} />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}

