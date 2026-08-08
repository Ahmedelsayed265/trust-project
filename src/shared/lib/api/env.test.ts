import { afterEach, describe, expect, it } from 'vitest';
import { getApiBaseUrl } from '@/shared/lib/api/env';

const ORIGINAL = {
  API_URL: process.env.API_URL,
  NEXT_API_URL: process.env.NEXT_API_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
};

afterEach(() => {
  process.env.API_URL = ORIGINAL.API_URL;
  process.env.NEXT_API_URL = ORIGINAL.NEXT_API_URL;
  process.env.NEXT_PUBLIC_API_URL = ORIGINAL.NEXT_PUBLIC_API_URL;
});

describe('getApiBaseUrl', () => {
  it('prefers API_URL and strips a trailing slash', () => {
    process.env.API_URL = 'https://admin.trust-ai.cloud/api/';
    process.env.NEXT_API_URL = 'https://other.test/api';
    expect(getApiBaseUrl()).toBe('https://admin.trust-ai.cloud/api');
  });

  it('falls back to NEXT_API_URL then NEXT_PUBLIC_API_URL', () => {
    delete process.env.API_URL;
    process.env.NEXT_API_URL = 'https://next-api.test/api';
    expect(getApiBaseUrl()).toBe('https://next-api.test/api');

    delete process.env.NEXT_API_URL;
    process.env.NEXT_PUBLIC_API_URL = 'https://public.test/api';
    expect(getApiBaseUrl()).toBe('https://public.test/api');
  });

  it('throws when no API base is configured', () => {
    delete process.env.API_URL;
    delete process.env.NEXT_API_URL;
    delete process.env.NEXT_PUBLIC_API_URL;
    expect(() => getApiBaseUrl()).toThrow(/Missing API_URL/);
  });
});
