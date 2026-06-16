/**
 * Reusable API client wrapper for Xano integration.
 *
 * Performs real HTTP requests against the base URL defined in ./config.
 * Automatically attaches the stored auth token (if present) as a Bearer
 * header. Services that still rely on mock data should keep using their
 * existing providers — only modules that have been migrated to Xano
 * (currently: auth) should call apiClient directly.
 */

import { apiConfig, buildApiUrl } from "./config";

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
  timeoutMs?: number;
  /** Skip attaching the stored auth token */
  skipAuth?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  ok: boolean;
}

export class ApiError extends Error {
  status: number;
  payload: unknown;
  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

const TOKEN_STORAGE_KEY = "atomia.auth.token";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (token) window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    else window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function buildUrlWithQuery(
  path: string,
  query?: ApiRequestOptions["query"],
): string {
  const url = buildApiUrl(path);
  if (!query) return url;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined) continue;
    params.append(k, String(v));
  }
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const url = buildUrlWithQuery(path, options.query);
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(options.headers ?? {}),
  };

  if (!options.skipAuth) {
    const token = getAuthToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? apiConfig.timeoutMs;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  // Wire external signal through if provided
  if (options.signal) {
    options.signal.addEventListener("abort", () => controller.abort(), {
      once: true,
    });
  }

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      credentials: apiConfig.withCredentials ? "include" : "same-origin",
    });

    const text = await res.text();
    let data: unknown = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!res.ok) {
      const message =
        (data &&
          typeof data === "object" &&
          "message" in (data as Record<string, unknown>) &&
          String((data as Record<string, unknown>).message)) ||
        `Request failed with status ${res.status}`;
      throw new ApiError(message, res.status, data);
    }

    return { data: data as T, status: res.status, ok: res.ok };
  } finally {
    clearTimeout(timeout);
  }
}

export const apiClient = {
  config: apiConfig,
  getAuthToken,
  setAuthToken,

  get<T = unknown>(path: string, options?: ApiRequestOptions) {
    return request<T>("GET", path, undefined, options);
  },
  post<T = unknown>(path: string, body?: unknown, options?: ApiRequestOptions) {
    return request<T>("POST", path, body, options);
  },
  put<T = unknown>(path: string, body?: unknown, options?: ApiRequestOptions) {
    return request<T>("PUT", path, body, options);
  },
  patch<T = unknown>(path: string, body?: unknown, options?: ApiRequestOptions) {
    return request<T>("PATCH", path, body, options);
  },
  delete<T = unknown>(path: string, options?: ApiRequestOptions) {
    return request<T>("DELETE", path, undefined, options);
  },
};

export type ApiClient = typeof apiClient;
