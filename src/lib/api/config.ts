/**
 * Centralized API configuration for Xano backend integration.
 *
 * Xano splits endpoints into separate API groups, each with its own base
 * URL. Register every group here so callers can build URLs against the
 * correct group instead of assuming a single shared base URL.
 */

export type ApiEnvironment = "development" | "staging" | "production";
export type ApiGroup =
  | "auth"
  | "content"
  | "supervisor"
  | "grade-supervisor"
  | "student"
  | "question-bank";

export interface ApiConfig {
  baseUrl: string;
  apiVersion: string;
  environment: ApiEnvironment;
  timeoutMs: number;
  withCredentials: boolean;
}

const ENV: ApiEnvironment =
  (import.meta.env?.MODE as ApiEnvironment) ?? "development";

export const AUTH_BASE_URL = "https://x8ki-letl-twmt.n7.xano.io/api:8hSBzNoS";
export const CONTENT_BASE_URL = "https://x8ki-letl-twmt.n7.xano.io/api:8PSYz4xO";
export const SUPERVISOR_BASE_URL =
  (import.meta.env?.VITE_XANO_SUPERVISOR_BASE as string | undefined) ??
  "https://x8ki-letl-twmt.n7.xano.io/api:supervisor";
export const GRADE_SUPERVISOR_BASE_URL =
  (import.meta.env?.VITE_XANO_GRADE_SUPERVISOR_BASE as string | undefined) ??
  "https://x8ki-letl-twmt.n7.xano.io/api:grade-supervisor";
// Student-facing Xano group (study logs, etc.). Override via env if needed.
export const STUDENT_BASE_URL =
  (import.meta.env?.VITE_XANO_STUDENT_BASE as string | undefined) ??
  "https://x8ki-letl-twmt.n7.xano.io/api:student";

const XANO_BASE_URL = AUTH_BASE_URL;

export const API_GROUP_BASE_URLS: Record<ApiGroup, string> = {
  auth: AUTH_BASE_URL,
  content: CONTENT_BASE_URL,
  supervisor: SUPERVISOR_BASE_URL,
  "grade-supervisor": GRADE_SUPERVISOR_BASE_URL,
  student: STUDENT_BASE_URL,
  "question-bank": "https://x8ki-letl-twmt.n7.xano.io/api:question-bank",
};

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

/** Build a URL against the default (auth) API group. */
export function buildApiUrl(path: string): string {
  return buildApiUrlFor("auth", path);
}

/** Build a URL against a specific named API group. */
export function buildApiUrlFor(group: ApiGroup, path: string): string {
  // Allow absolute URLs to pass through
  if (/^https?:\/\//i.test(path)) return path;
  const base = (API_GROUP_BASE_URLS[group] ?? apiConfig.baseUrl).replace(
    /\/+$/,
    "",
  );
  const version = apiConfig.apiVersion.replace(/^\/+|\/+$/g, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  if (!version) return `${base}${suffix}`;
  return `${base}/${version}${suffix}`;
}
