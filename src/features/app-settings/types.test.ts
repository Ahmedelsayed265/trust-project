import { describe, expect, it } from 'vitest';
import { DEFAULT_APP_SETTINGS } from '@/features/app-settings/types';

describe('DEFAULT_APP_SETTINGS', () => {
  it('exposes TrustAI defaults used as API fallback', () => {
    expect(DEFAULT_APP_SETTINGS.app_name).toBe('TrustAI');
    expect(DEFAULT_APP_SETTINGS.support_email).toBe('support@trustai.app');
    expect(DEFAULT_APP_SETTINGS.trading_mode).toBe('demo');
    expect(DEFAULT_APP_SETTINGS.locales.map((locale) => locale.value)).toEqual([
      'en',
      'ar',
      'es',
    ]);
    expect(DEFAULT_APP_SETTINGS.currencies).toEqual(['USD', 'EUR', 'SAR']);
  });
});
