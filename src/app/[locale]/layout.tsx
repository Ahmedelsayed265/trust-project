import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import { AppProviders } from '@/shared/providers/app-providers';
import { isRtlLocale, routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const arabicSans = localFont({
  src: '../../../public/ar_font.otf',
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TrustAI — AI Trading Platform',
  description: 'AI-powered trading dashboard for crypto, stocks, and metals',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const rtl = isRtlLocale(locale);
  const dir = rtl ? 'rtl' : 'ltr';
  const sansFont = rtl ? arabicSans : geistSans;

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={cn(
        sansFont.variable,
        geistMono.variable,
        'h-full antialiased',
      )}
    >
      <body
        className="h-full overflow-hidden font-sans"
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
