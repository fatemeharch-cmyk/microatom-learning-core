/**
 * Centralized API configuration for Xano backend integration.
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

const XANO_BASE_URL = "https://x8ki-letl-twmt.n7.xano.io/api:8hSBzNoS";

const ENV_CONFIG: Record<ApiEnvironment, ApiConfig> = {
  development: {
    baseUrl: XANO_BASE_URL,
    apiVersion: "",
    environment: "development",
    timeoutMs: 15000,
    withCredentials: false,
  },
  staging: {
    baseUrl: XANO_BASE_URL,
    apiVersion: "",
    environment: "staging",
    timeoutMs: 15000,
    withCredentials: false,
  },
  production: {
    baseUrl: XANO_BASE_URL,
    apiVersion: "",
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
  if (!version) return `${base}${suffix}`;
  return `${base}/${version}${suffix}`;
}
