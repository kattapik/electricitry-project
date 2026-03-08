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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-white border-r border-slate-200 flex flex-col w-[256px] min-h-screen shrink-0 sticky top-0 h-screen overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="bg-primary rounded-2xl flex items-center justify-center size-10 shrink-0">
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
            <path d="M9 0L0 11.5H7L5 20L16 8.5H9L11 0H9Z" fill="white" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-900 text-lg font-bold leading-tight">EnergySync</span>
          <span className="text-slate-500 text-xs">Smart Home Monitor</span>
        </div>
      </div>

      {/* Navigation */}
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
    </aside>
  );
}
