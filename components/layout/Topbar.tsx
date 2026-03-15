"use client";

import { Menu } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import SidebarNav from './SidebarNav';

export default function Topbar() {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Open: mount first, then animate in on next frame
  useEffect(() => {
    if (isOpen) {
      // Force a reflow before setting visible so the transition plays
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    }
  }, [isOpen]);

  // Close: animate out, then unmount after transition ends
  const handleClose = useCallback(() => {
    setIsVisible(false);
    // Wait for the transition to finish before unmounting
    setTimeout(() => {
      setIsOpen(false);
    }, 300);
  }, []);

  return (
    <>
      {/* Top Header Bar */}
      <header className="navbar md:hidden bg-base-100 border-b border-base-200 px-4 min-h-14">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-xl flex items-center justify-center size-8 shrink-0">
              <svg width="12" height="16" viewBox="0 0 16 20" fill="none">
                <path d="M9 0L0 11.5H7L5 20L16 8.5H9L11 0H9Z" fill="white" />
              </svg>
            </div>
            <span className="text-base-content font-bold leading-tight">EnergySync</span>
          </div>
        </div>
        <div className="flex-none">
          <div className="mr-2 inline-flex">
            <LanguageSwitcher />
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="btn btn-ghost btn-sm btn-square"
            aria-label={t('common.openMenu')}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay — always mounted when isOpen, animated via isVisible */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-base-content/20 backdrop-blur-sm transition-opacity duration-300 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleClose}
          />

          {/* Drawer Panel — slide from left */}
          <div
            className={`relative flex flex-col w-[280px] h-full bg-base-100 shadow-2xl overflow-y-auto transition-transform duration-300 ease-out ${
              isVisible ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex items-center gap-3 px-5 pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary rounded-2xl flex items-center justify-center size-10 shrink-0">
                  <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                    <path d="M9 0L0 11.5H7L5 20L16 8.5H9L11 0H9Z" fill="white" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-base-content text-lg font-bold leading-tight">EnergySync</span>
                  <span className="text-base-content/50 text-xs">{t('layout.smartHomeMonitor')}</span>
                </div>
              </div>
            </div>

            <div className="divider my-0 mx-5"></div>

            {/* Navigation */}
            <div onClick={handleClose} className="flex-1 flex flex-col">
              <SidebarNav />
            </div>

          
          </div>
        </div>
      )}
    </>
  );
}
