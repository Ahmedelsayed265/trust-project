'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function LocaleSwitcher({
  className,
  onChanged,
}: {
  className?: string;
  onChanged?: (locale: AppLocale) => void;
}) {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const items = routing.locales.map((value) => ({
    value,
    label: t(value),
  }));

  return (
    <Select
      value={locale}
      onValueChange={(value) => {
        if (!value || !routing.locales.includes(value as AppLocale)) return;
        const next = value as AppLocale;
        router.replace(pathname, { locale: next });
        onChanged?.(next);
      }}
      items={items}
    >
      <SelectTrigger
        className={className ?? 'bg-card h-10 min-w-36 rounded-[12px]!'}
        aria-label={t('label')}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="rounded-xl">
        {routing.locales.map((value) => (
          <SelectItem key={value} value={value} className="rounded-lg">
            {t(value)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
