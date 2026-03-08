"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  color?: string; // Optional custom text color for this option
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  fullWidth?: boolean;
}

export function Dropdown({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select an option", 
  label,
  className,
  fullWidth = false
}: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Close when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative flex flex-col gap-1.5", fullWidth ? "w-full" : "w-auto", className)} ref={containerRef}>
      {label && <label className="text-sm font-semibold text-slate-700 ml-0.5">{label}</label>}
      
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "justify-between bg-slate-50 border-slate-200 font-medium text-slate-900 group",
          isOpen && "ring-2 ring-primary/20 border-primary/40",
          fullWidth && "w-full"
        )}
        rightIcon={
          <ChevronDown 
            size={14} 
            className={cn("text-slate-400 transition-transform duration-200", isOpen && "rotate-180 text-primary")} 
          />
        }
      >
        <div className="flex items-center gap-2.5 truncate">
          {selectedOption ? (
            <>
              {selectedOption.icon && <span className="text-slate-500 group-hover:text-primary transition-colors">{selectedOption.icon}</span>}
              <span className={selectedOption.color}>{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-slate-500 font-normal">{placeholder}</span>
          )}
        </div>
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.08)] z-[100] overflow-hidden transform origin-top animate-in fade-in zoom-in-95 duration-200">
          <div className="py-1.5 max-h-[240px] overflow-y-auto">
            {options.map((option) => {
              const isActive = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "flex items-center justify-between w-full px-4 py-2.5 text-sm transition-colors text-left",
                    isActive 
                      ? "bg-primary/5 text-primary font-bold" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {option.icon && <span className={cn("shrink-0", isActive ? "text-primary" : "text-slate-400")}>{option.icon}</span>}
                    <span className={cn("truncate", option.color)}>{option.label}</span>
                  </div>
                  {isActive && <Check size={14} className="shrink-0 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
