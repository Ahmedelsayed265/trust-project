'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function OAuthButtons() {
  const t = useTranslations('AuthOAuth');

  return (
    <div className="mt-2 grid grid-cols-2 gap-3">
      <Button
        type="button"
        variant="outline"
        className="border-border bg-card hover:bg-muted/60 h-12 cursor-pointer gap-2.5 rounded-xl px-3 text-sm font-semibold shadow-none"
      >
        <Image src="/google.svg" alt={t('google')} width={20} height={20} />
        {t('google')}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="border-border bg-card hover:bg-muted/60 h-12 cursor-pointer gap-2.5 rounded-xl px-3 text-sm font-semibold shadow-none"
      >
        <Image src="/apple.svg" alt={t('apple')} width={20} height={20} />
        {t('apple')}
      </Button>
    </div>
  );
}
