/**
 * Reusable API client wrapper for future Xano integration.
 *
 * Currently a placeholder: no real HTTP calls are made. All methods throw a
 * "Not connected to backend yet" error so services can keep using mock
 * providers until the real Xano client is wired in.
 */

import { apiConfig, buildApiUrl } from "./config";

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
  timeoutMs?: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  ok: boolean;
}

export class ApiNotConnectedError extends Error {
  constructor(method: string, path: string) {
    super(
      `[Atomia API] Not connected to backend yet. Tried ${method} ${path}. ` +
        `Use mock providers via src/lib/services/* until Xano is wired in.`,
    );
    this.name = "ApiNotConnectedError";
  }
}

function notConnected<T>(method: string, path: string): Promise<ApiResponse<T>> {
  // Intentionally rejects — services should not call the client yet.
  return Promise.reject(new ApiNotConnectedError(method, buildApiUrl(path)));
}

export const apiClient = {
  config: apiConfig,

  get<T = unknown>(path: string, _options?: ApiRequestOptions) {
    return notConnected<T>("GET", path);
  },
  post<T = unknown>(path: string, _body?: unknown, _options?: ApiRequestOptions) {
    return notConnected<T>("POST", path);
  },
  put<T = unknown>(path: string, _body?: unknown, _options?: ApiRequestOptions) {
    return notConnected<T>("PUT", path);
  },
  patch<T = unknown>(path: string, _body?: unknown, _options?: ApiRequestOptions) {
    return notConnected<T>("PATCH", path);
  },
  delete<T = unknown>(path: string, _options?: ApiRequestOptions) {
    return notConnected<T>("DELETE", path);
  },
};

export type ApiClient = typeof apiClient;
