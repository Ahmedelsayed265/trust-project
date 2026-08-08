'use client';

import { useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

function subscribe() {
  return () => {};
}

export function ThemeToggle({
  collapsed = false,
  className,
}: {
  collapsed?: boolean;
  className?: string;
}) {
  const t = useTranslations('Theme');
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <div
        className={cn(
          'bg-muted h-9 rounded-full',
          collapsed ? 'w-9' : 'w-full',
          className,
        )}
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  if (collapsed) {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn('rounded-full', className)}
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        aria-label={isDark ? t('switchToLight') : t('switchToDark')}
      >
        {isDark ? <Sun /> : <Moon />}
      </Button>
    );
  }

  return (
    <div
      className={cn(
        'bg-muted flex w-full items-center rounded-full p-1',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={cn(
          'flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
          !isDark
            ? 'bg-card text-foreground'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        <Sun className="size-3.5" />
        {t('light')}
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={cn(
          'flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
          isDark
            ? 'bg-card text-foreground'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        <Moon className="size-3.5" />
        {t('dark')}
      </button>
    </div>
  );
}
