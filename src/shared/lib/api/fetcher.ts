import { getApiBaseUrl } from "@/shared/lib/api/env";
import {
  ApiError,
  type ApiErrorBody,
  type FetcherOptions,
} from "@/shared/lib/api/types";

type RequestOptions = Omit<FetcherOptions, "path" | "method" | "body">;

async function request<T>({
  path,
  method = "GET",
  body,
  query,
  headers,
  token,
  signal,
  cache,
  next,
}: FetcherOptions): Promise<T> {
  const base = getApiBaseUrl();
  const url = new URL(`${base}${path.startsWith("/") ? path : `/${path}`}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value != null) url.searchParams.set(key, String(value));
    }
  }

  const finalHeaders = new Headers(headers);
  if (!finalHeaders.has("Accept")) {
    finalHeaders.set("Accept", "application/json");
  }
  if (body !== undefined && !(body instanceof FormData)) {
    if (!finalHeaders.has("Content-Type")) {
      finalHeaders.set("Content-Type", "application/json");
    }
  }
  if (token) {
    finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body:
      body === undefined || body instanceof FormData
        ? body
        : JSON.stringify(body),
    signal,
    cache,
    next,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const parsed =
    response.status === 204
      ? null
      : contentType.includes("application/json")
        ? await response.json().catch(() => null)
        : (await response.text()) || null;

  if (!response.ok) {
    const errBody =
      parsed && typeof parsed === "object" ? (parsed as ApiErrorBody) : null;
    const message =
      (typeof errBody?.message === "string" && errBody.message) ||
      (typeof errBody?.error === "string" && errBody.error) ||
      `Request failed (${response.status} ${response.statusText})`;

    throw new ApiError(message, response.status, errBody);
  }

  return parsed as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>({ ...options, path, method: "GET" }),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>({ ...options, path, method: "POST", body }),

  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>({ ...options, path, method: "PUT", body }),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>({ ...options, path, method: "PATCH", body }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>({ ...options, path, method: "DELETE" }),
};
