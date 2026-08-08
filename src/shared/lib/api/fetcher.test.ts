import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('api fetcher', () => {
  beforeEach(() => {
    process.env.API_URL = 'https://api.test/api';
    vi.stubGlobal('fetch', vi.fn());
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('performs GET with query params and bearer token', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({ message: '', code: 200, data: { ok: true } }),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        },
      ),
    );

    const { api } = await import('@/shared/lib/api/fetcher');
    const result = await api.get<{ data: { ok: boolean } }>('/help', {
      query: { category: 'trading', search: null },
      token: 'abc',
    });

    expect(result.data.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toBe('https://api.test/api/help?category=trading');
    expect((init?.headers as Headers).get('Authorization')).toBe('Bearer abc');
    expect((init?.headers as Headers).get('Accept')).toBe('application/json');
  });

  it('throws ApiError for non-OK responses', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ message: 'Nope' }), {
        status: 403,
        statusText: 'Forbidden',
        headers: { 'content-type': 'application/json' },
      }),
    );

    const { api } = await import('@/shared/lib/api/fetcher');
    const { ApiError } = await import('@/shared/lib/api/types');

    await expect(api.get('/secure')).rejects.toSatisfy((error: unknown) => {
      expect(error).toBeInstanceOf(ApiError);
      expect(error).toMatchObject({
        name: 'ApiError',
        message: 'Nope',
        status: 403,
      });
      return true;
    });
  });

  it('stringifies JSON bodies on POST', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ data: null }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );

    const { api } = await import('@/shared/lib/api/fetcher');
    await api.post('/user/settings', { language: 'en' });

    const [, init] = fetchMock.mock.calls[0]!;
    expect(init?.method).toBe('POST');
    expect(init?.body).toBe(JSON.stringify({ language: 'en' }));
    expect((init?.headers as Headers).get('Content-Type')).toBe(
      'application/json',
    );
  });
});
