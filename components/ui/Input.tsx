import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, leftIcon, className, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-base-content/70">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "input input-bordered w-full bg-base-200/50 px-4 py-3 text-sm text-base-content placeholder:text-base-content/35",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/30",
              error && "input-error focus-visible:ring-error/20",
              leftIcon && "pl-10",
              className
            )}
            {...props}
          />
        </div>
        {hint && !error && <p className="text-xs text-base-content/40">{hint}</p>}
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
