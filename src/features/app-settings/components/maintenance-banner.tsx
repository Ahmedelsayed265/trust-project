'use client';

import { AlertTriangle } from 'lucide-react';
import { useAppSettings } from '@/shared/providers/app-settings-provider';

export function MaintenanceBanner() {
  const settings = useAppSettings();

  if (!settings.maintenance_mode) return null;

  return (
    <div className="border-border shrink-0 border-b bg-amber-50 px-4 py-2.5 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
      <div className="mx-auto flex max-w-350 items-start gap-2">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
        <p>
          {settings.maintenance_message ||
            `${settings.app_name} is under maintenance. Some features may be unavailable.`}
        </p>
      </div>
    </div>
  );
}
