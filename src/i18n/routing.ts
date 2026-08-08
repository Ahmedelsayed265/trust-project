import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'ar', 'es'] as const;
export type AppLocale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
});

export function isRtlLocale(locale: string) {
  return locale === 'ar';
}
