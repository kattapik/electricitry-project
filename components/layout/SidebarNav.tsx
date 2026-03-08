"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Home, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/monthly", label: "Monthly Records", icon: Calendar },
  { href: "/appliances", label: "Appliances", icon: Home },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 px-4 flex-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3.5 px-4 h-11 rounded-xl font-bold text-sm transition-colors",
              isActive
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            )}
          >
            <Icon
              size={18}
              className={cn(isActive ? "text-white" : "text-slate-400")}
            />
            <span className="flex-1 text-[14px]">{item.label}</span>
            {isActive && <ChevronRight size={14} className="opacity-70" />}
          </Link>
        );
      })}
    </nav>
  );
}
