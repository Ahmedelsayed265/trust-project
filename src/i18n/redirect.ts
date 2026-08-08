import { redirect as nextRedirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';

/** Locale-aware server redirect (href without locale prefix). */
export async function redirect(href: string): Promise<never> {
  const locale = await getLocale();
  const path = href === '/' ? `/${locale}` : `/${locale}${href}`;
  nextRedirect(path);
}
