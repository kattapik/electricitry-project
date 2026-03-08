"use client";

import { useEffect, useRef, ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export default function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus trap & Escape listener & Body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    // Body scroll lock
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Focus on the first focusable element (like the close button)
    const focusableElements = dialogRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements?.[0] as HTMLElement;
    const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement;

    // Set initial focus
    if (firstElement) {
       firstElement.focus();
    } else {
        dialogRef.current?.focus(); // Fallback if no focusable children
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }

      // Focus trap logic
      if (e.key === 'Tab') {
        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement || document.activeElement === dialogRef.current) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Dialog wrapper */}
      <div 
        ref={dialogRef}
        tabIndex={-1}
        className="relative flex flex-col w-full max-w-[448px] bg-white rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-200 outline-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h3 id="dialog-title" className="text-xl font-bold text-slate-900">
            {title}
          </h3>
          <Button 
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="size-8 p-0 text-slate-400 hover:text-slate-600 focus:ring-offset-2"
            aria-label="Close dialog"
          >
            <X size={18} />
          </Button>
        </div>
        
        {/* Content */}
        {children}
      </div>
    </div>
  );
}
