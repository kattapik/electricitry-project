import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

import { defaultLocale, locales } from './settings';

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'never',
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
