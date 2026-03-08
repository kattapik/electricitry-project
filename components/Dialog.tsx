"use client";

import { useEffect, ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/Button";

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export default function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  // Prevent scrolling on the body when the dialog is open
  useEffect(() => {
    if (isOpen) {
      // Calculate scrollbar width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      
      {/* Dialog wrapper */}
      <div 
        className="relative flex flex-col w-full max-w-[448px] bg-white rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
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
