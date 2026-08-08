import { describe, expect, it } from 'vitest';
import {
  isNavActive,
  primaryNav,
  secondaryNav,
  systemNav,
} from '@/shared/lib/navigation';

describe('isNavActive', () => {
  it('matches home only on exact path', () => {
    expect(isNavActive('/', '/')).toBe(true);
    expect(isNavActive('/markets', '/')).toBe(false);
  });

  it('matches nested routes by prefix', () => {
    expect(isNavActive('/markets/BTCUSDT', '/markets')).toBe(true);
    expect(isNavActive('/profile/security', '/profile')).toBe(true);
    expect(isNavActive('/settings', '/profile')).toBe(false);
  });

  it('never activates hash hrefs', () => {
    expect(isNavActive('/anything', '#')).toBe(false);
  });
});

describe('nav catalogs', () => {
  it('exposes primary, secondary, and system entries', () => {
    expect(primaryNav.map((item) => item.href)).toContain('/trades');
    expect(secondaryNav.map((item) => item.href)).toContain('/watchlist');
    expect(systemNav.find((item) => item.action === 'logout')?.label).toBe(
      'Log Out',
    );
  });
});
