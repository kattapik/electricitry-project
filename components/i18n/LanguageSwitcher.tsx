'use client';

import { Languages } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { routing, usePathname, useRouter } from '@/app/i18n/routing';

type LocaleOption = {
  code: (typeof routing.locales)[number];
  label: string;
};

export default function LanguageSwitcher() {
  const t = useTranslations();
  const locale = useLocale() as LocaleOption['code'];
  const pathname = usePathname();
  const router = useRouter();

  const options: LocaleOption[] = [
    { code: 'th', label: t('language.th') },
    { code: 'en', label: t('language.en') },
  ];

  return (
    <label className="flex items-center gap-2 text-xs text-base-content/70">
      <Languages size={14} className="text-base-content/50" />
      <span className="sr-only">{t('language.switcherLabel')}</span>
      <select
        className="select select-sm select-bordered h-8 min-h-8 rounded-lg bg-base-200/50"
        value={locale}
        onChange={(event) => {
          const nextLocale = event.target.value as LocaleOption['code'];
          router.replace(pathname, { locale: nextLocale });
        }}
        aria-label={t('language.switcherLabel')}
      >
        {options.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
