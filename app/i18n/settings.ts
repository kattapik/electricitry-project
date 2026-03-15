export const locales = ['th', 'en'] as const;

export const defaultLocale = 'th';

export type AppLocale = (typeof locales)[number];
