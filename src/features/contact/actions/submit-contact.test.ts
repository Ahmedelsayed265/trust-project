import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/shared/lib/api/types';

const apiPost = vi.fn();
const getAuthToken = vi.fn();

vi.mock('@/shared/lib/api', async () => {
  const actual =
    await vi.importActual<typeof import('@/shared/lib/api')>(
      '@/shared/lib/api',
    );
  return {
    ...actual,
    api: {
      get: vi.fn(),
      post: (...args: unknown[]) => apiPost(...args),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    },
  };
});

vi.mock('@/features/auth/session', () => ({
  getAuthToken: (...args: unknown[]) => getAuthToken(...args),
}));

import { submitContactAction } from '@/features/contact/actions/submit-contact';

const input = {
  name: ' Ammar ',
  email: ' demo@trustai.app ',
  category: 'trading' as const,
  subject: ' Help please ',
  message: ' I need help with my order placement flow. ',
};

describe('submitContactAction', () => {
  beforeEach(() => {
    apiPost.mockReset();
    getAuthToken.mockReset();
  });

  it('trims fields and posts with optional auth token', async () => {
    getAuthToken.mockResolvedValue('token-1');
    apiPost.mockResolvedValue({ message: 'Received', data: null });

    const result = await submitContactAction(input);
    expect(result).toEqual({ ok: true, data: { message: 'Received' } });
    expect(apiPost).toHaveBeenCalledWith(
      '/contact-us',
      {
        name: 'Ammar',
        email: 'demo@trustai.app',
        category: 'trading',
        subject: 'Help please',
        message: 'I need help with my order placement flow.',
      },
      { token: 'token-1' },
    );
  });

  it('uses a default success message when API message is empty', async () => {
    getAuthToken.mockResolvedValue(null);
    apiPost.mockResolvedValue({ message: '', data: null });

    const result = await submitContactAction(input);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.message).toMatch(/message was received/i);
    }
  });

  it('maps failures', async () => {
    getAuthToken.mockResolvedValue(null);
    apiPost.mockRejectedValue(new ApiError('Spam', 429));
    await expect(submitContactAction(input)).resolves.toMatchObject({
      ok: false,
      message: 'Spam',
    });
  });
});
