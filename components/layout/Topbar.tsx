"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import SidebarNav from "./SidebarNav";

export default function Topbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="md:hidden flex items-center justify-between px-4 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="bg-primary rounded-xl flex items-center justify-center size-8 shrink-0">
            <svg width="12" height="16" viewBox="0 0 16 20" fill="none">
              <path d="M9 0L0 11.5H7L5 20L16 8.5H9L11 0H9Z" fill="white" />
            </svg>
          </div>
          <span className="text-slate-900 font-bold leading-tight">EnergySync</span>
        </div>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile Navigation overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Drawer */}
          <div className="relative flex flex-col w-[256px] h-full bg-white shadow-xl pt-6 overflow-y-auto">
            <div className="flex items-center gap-3 px-6 pb-6 mb-2 border-b border-slate-100">
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
            
            <div onClick={() => setIsOpen(false)} className="flex-1 flex flex-col">
              <SidebarNav />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
