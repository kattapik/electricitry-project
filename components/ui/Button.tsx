import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variants = {
  primary: "btn-primary text-white",
  secondary: "btn-secondary",
  outline: "btn-outline",
  ghost: "btn-ghost",
  danger: "btn-error text-white",
};

const sizes = {
  sm: "btn-sm text-xs rounded-lg",
  md: "btn-md rounded-lg",
  lg: "btn-lg rounded-xl",
  icon: "btn-md btn-square rounded-lg p-0",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          "btn border-none shadow-none font-bold tracking-tight",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <span className="loading loading-spinner"></span>}
        {!isLoading && leftIcon && <span className="flex shrink-0">{leftIcon}</span>}
        {!isLoading && children}
        {!isLoading && rightIcon && <span className="flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
