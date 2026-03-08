import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "neutral";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  default: "badge-ghost",
  primary: "badge-primary text-primary-content",
  success: "badge-success text-success-content",
  warning: "badge-warning text-warning-content",
  danger: "badge-error text-error-content",
  neutral: "badge-neutral text-neutral-content border-base-200",
};

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "badge px-2 py-0.5 rounded text-xs font-bold font-sans",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
