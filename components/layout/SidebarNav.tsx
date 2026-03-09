"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, ChevronRight, Box, PlugZap } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    description: "Overview & insights",
    icon: LayoutDashboard,
  },
  {
    href: "/monthly",
    label: "Monthly Records",
    description: "Historical breakdown",
    icon: Calendar,
  },
  {
    href: "/appliances",
    label: "Appliances",
    description: "Manage appliance reference",
    icon: PlugZap,
  },

  {
    href: "/rooms",
    label: "Rooms",
    description: "Manage locations",
    icon: Box, // Will use Box or something similar, need to import it
  },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 px-3 flex-1 w-full">
      {/* Section label */}
      <div className="px-3 pt-2 pb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-base-content/25">
          Menu
        </span>
      </div>

      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm relative",
              isActive
                ? "bg-primary text-primary-content shadow-md shadow-primary/25"
                : "text-base-content/60 hover:text-base-content hover:bg-base-200/70"
            )}
          >
            {/* Icon with background */}
            <div
              className={cn(
                "flex items-center justify-center size-8 rounded-lg shrink-0",
                isActive
                  ? "bg-white/20"
                  : "bg-base-200/80 group-hover:bg-primary/10 group-hover:text-primary"
              )}
            >
              <Icon size={16} />
            </div>

            {/* Text block */}
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[13px] font-bold leading-tight truncate">{item.label}</span>
              <span
                className={cn(
                  "text-[10px] leading-tight mt-0.5 truncate",
                  isActive ? "text-white/60" : "text-base-content/30 group-hover:text-base-content/40"
                )}
              >
                {item.description}
              </span>
            </div>

            {/* Right indicator */}
            {isActive ? (
              <ChevronRight size={14} className="opacity-60 shrink-0" />
            ) : (
              <div className="size-1.5 rounded-full bg-base-content/0 group-hover:bg-primary/40 shrink-0" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
