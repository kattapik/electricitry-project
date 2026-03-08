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
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const listboxRef = React.useRef<HTMLUListElement>(null);
  
  const generatedId = React.useId();
  const listboxId = `dropdown-listbox-${generatedId}`;
  const buttonId = `dropdown-button-${generatedId}`;

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

  // Reset focus when opened
  React.useEffect(() => {
    if (isOpen) {
      const selectedIdx = options.findIndex(opt => opt.value === value);
      setFocusedIndex(selectedIdx >= 0 ? selectedIdx : 0);
    } else {
      setFocusedIndex(-1);
    }
  }, [isOpen, value, options]);

  // Scroll focused item into view
  React.useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listboxRef.current) {
       const focusedElement = listboxRef.current.children[focusedIndex] as HTMLElement;
       if (focusedElement) {
         focusedElement.scrollIntoView({ block: "nearest" });
       }
    }
  }, [focusedIndex, isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex(prev => (prev < options.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          handleSelect(options[focusedIndex].value);
        }
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div 
      className={cn("relative flex flex-col gap-1.5", fullWidth ? "w-full" : "w-auto", className)} 
      ref={containerRef}
    >
      {label && <label id={`label-${buttonId}`} className="text-sm font-semibold text-base-content/70 ml-0.5">{label}</label>}
      
      <Button
        ref={buttonRef}
        id={buttonId}
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={label ? `label-${buttonId} ${buttonId}` : undefined}
        aria-controls={isOpen ? listboxId : undefined}
        className={cn(
          "justify-between bg-base-200/50 border-base-200 font-medium text-base-content group",
          isOpen && "ring-2 ring-primary/20 border-primary/40",
          fullWidth && "w-full"
        )}
        rightIcon={
          <ChevronDown 
            size={14} 
            className={cn("text-base-content/40 transition-transform duration-200", isOpen && "rotate-180 text-primary")} 
          />
        }
      >
        <div className="flex items-center gap-2.5 truncate">
          {selectedOption ? (
            <>
              {selectedOption.icon && <span className="text-base-content/50 group-hover:text-primary transition-colors">{selectedOption.icon}</span>}
              <span className={selectedOption.color}>{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-base-content/50 font-normal">{placeholder}</span>
          )}
        </div>
      </Button>

      {isOpen && (
        <ul
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={focusedIndex >= 0 ? `option-${options[focusedIndex].value}` : undefined}
          className="menu dropdown-content bg-base-100 rounded-box z-[100] w-full p-2 shadow mt-1 absolute top-full left-0 right-0 max-h-[240px] flex-nowrap overflow-y-auto"
        >
          {options.map((option, index) => {
            const isActive = option.value === value;
            const isFocused = index === focusedIndex;
            
            return (
              <li
                key={option.value}
                id={`option-${option.value}`}
                role="option"
                aria-selected={isActive}
                onClick={() => handleSelect(option.value)}
              >
                <a className={cn(isActive && "active", isFocused && !isActive && "focus")}>
                  <div className="flex items-center gap-2.5 truncate w-full">
                    {option.icon && <span className={cn("shrink-0", isActive ? "text-primary-content" : "text-base-content/50")}>{option.icon}</span>}
                    <span className={cn("truncate flex-1", option.color)}>{option.label}</span>
                    {isActive && <Check size={14} className="shrink-0" />}
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
