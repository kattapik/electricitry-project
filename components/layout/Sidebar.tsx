import { useTranslations } from 'next-intl';

import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import SidebarNav from './SidebarNav';

export default function Sidebar() {
  const t = useTranslations();

  return (
    <aside className="bg-base-100 border-r border-base-200 hidden md:flex flex-col w-[256px] h-[100dvh] shrink-0 sticky top-0 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
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

      {/* Navigation */}
      <SidebarNav />

      <div className="px-6 pb-5 pt-4 border-t border-base-200 mt-auto">
        <LanguageSwitcher />
      </div>

    </aside>
  );
}
