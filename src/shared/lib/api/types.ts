export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ApiErrorBody = {
  message?: string;
  error?: string;
  errors?: Record<string, string[] | string>;
  [key: string]: unknown;
};

export class ApiError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody | null;
  readonly errors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    body: ApiErrorBody | null = null,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
    this.errors = normalizeFieldErrors(body?.errors);
  }
}

export type FetcherOptions = {
  path: string;
  method?: HttpMethod;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  headers?: HeadersInit;
  token?: string | null;
  signal?: AbortSignal;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

export type ActionResult<T = unknown> =
  | { ok: true; data: T }
  | {
      ok: false;
      message: string;
      errors?: Record<string, string[]>;
      status?: number;
    };

function normalizeFieldErrors(
  errors: ApiErrorBody['errors'],
): Record<string, string[]> | undefined {
  if (!errors || typeof errors !== 'object') return undefined;

  const out: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(errors)) {
    if (Array.isArray(value)) {
      out[key] = value.map(String);
    } else if (value != null) {
      out[key] = [String(value)];
    }
  }
  return Object.keys(out).length ? out : undefined;
}
