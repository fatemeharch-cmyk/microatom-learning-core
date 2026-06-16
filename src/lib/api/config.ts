/**
 * Centralized API configuration for future Xano integration.
 * Values here are placeholders — no real backend is connected yet.
 */

export type ApiEnvironment = "development" | "staging" | "production";

export interface ApiConfig {
  baseUrl: string;
  apiVersion: string;
  environment: ApiEnvironment;
  timeoutMs: number;
  withCredentials: boolean;
}

const ENV: ApiEnvironment =
  (import.meta.env?.MODE as ApiEnvironment) ?? "development";

const ENV_CONFIG: Record<ApiEnvironment, ApiConfig> = {
  development: {
    baseUrl: "https://x8ki-letl-twmt.n7.xano.io/api", // placeholder
    apiVersion: "v1",
    environment: "development",
    timeoutMs: 15000,
    withCredentials: false,
  },
  staging: {
    baseUrl: "https://staging.placeholder.xano.io/api",
    apiVersion: "v1",
    environment: "staging",
    timeoutMs: 15000,
    withCredentials: false,
  },
  production: {
    baseUrl: "https://api.placeholder.xano.io/api",
    apiVersion: "v1",
    environment: "production",
    timeoutMs: 20000,
    withCredentials: false,
  },
};

export const apiConfig: ApiConfig = ENV_CONFIG[ENV] ?? ENV_CONFIG.development;

export function buildApiUrl(path: string): string {
  const base = apiConfig.baseUrl.replace(/\/+$/, "");
  const version = apiConfig.apiVersion.replace(/^\/+|\/+$/g, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}/${version}${suffix}`;
}
