/**
 * Auth API — talks to the Xano Authentication endpoints.
 *
 *   POST /auth/login  → { authToken, user_id, role }
 *   GET  /auth/me     → current user (requires Bearer token)
 *
 * Login succeeds as soon as Xano returns an authToken + role. The /auth/me
 * call is only used as an optional enrichment (or as a fallback when role
 * is missing from the login response).
 */

import { apiClient, setAuthToken } from "./client";
import { buildApiUrl } from "./config";
import { endpoints } from "./endpoints";
import { resetStudentDataCache } from "./student-data";
import type { RoleId } from "@/lib/roles";

export interface LoginResponse {
  authToken: string;
  user_id: string | number;
  role?: string;
}

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: RoleId;
  email?: string;
  avatarUrl?: string;
}

const ROLE_STORAGE_KEY = "atomia.auth.role";
const USER_ID_STORAGE_KEY = "atomia.auth.user_id";


export interface LoginDebugInfo {
  url: string;
  status: number;
  responseKeys: string[];
  authTokenExists: boolean;
  role: RoleId | null;
}

export let lastLoginDebug: LoginDebugInfo | null = null;

/**
 * Map raw Xano role strings to the internal RoleId.
 * Xano may return "grade_supervisor" for the supervisor role.
 */
export function normalizeRole(raw: string): RoleId | null {
  const r = (raw ?? "").toString().trim().toLowerCase();
  if (r === "student") return "student";
  if (r === "teacher") return "teacher";
  if (r === "parent") return "parent";
  if (r === "admin" || r === "principal" || r === "school_admin") return "admin";
  if (r === "supervisor" || r === "grade_supervisor") return "supervisor";
  return null;
}

/**
 * Fetch the active roles for a user from Xano.
 *   POST /auth/user/roles  { user_id }  →  { roles: string[] }
 *
 * Returns normalized RoleIds. Unknown roles are silently dropped.
 */
export async function fetchUserRoles(
  userId: string | number,
): Promise<RoleId[]> {
  const numeric = Number(userId);
  const body = { user_id: Number.isFinite(numeric) ? numeric : userId };
  const res = await apiClient.post<{ roles?: string[] }>(
    endpoints.auth.userRoles,
    body,
  );
  const list = Array.isArray(res.data?.roles) ? res.data!.roles! : [];
  const normalized = list
    .map((r) => normalizeRole(r))
    .filter((r): r is RoleId => !!r);
  // De-duplicate while preserving order.
  return Array.from(new Set(normalized));
}

function pickName(payload: Record<string, unknown>): string {
  return (
    (payload.name as string) ||
    (payload.full_name as string) ||
    (payload.display_name as string) ||
    (payload.username as string) ||
    (payload.email as string) ||
    "کاربر آتمیا"
  );
}

function pickUsername(payload: Record<string, unknown>): string {
  return (
    (payload.username as string) ||
    (payload.email as string) ||
    String(payload.id ?? payload.user_id ?? "")
  );
}

function persistRole(role: RoleId) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ROLE_STORAGE_KEY, role);
  } catch {
    /* ignore */
  }
}

function persistUserId(userId: string | number) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(USER_ID_STORAGE_KEY, String(userId));
  } catch {
    /* ignore */
  }
}

export async function login(
  username: string,
  password: string,
): Promise<{ user: AuthUser; token: string }> {
  const body = { username, password };
  const loginUrl = buildApiUrl(endpoints.auth.login);
  lastLoginDebug = null;

  try {
    const res = await apiClient.post<LoginResponse>(
      endpoints.auth.login,
      body,
      { skipAuth: true },
    );

    const { authToken, user_id, role } = res.data ?? ({} as LoginResponse);



    if (!authToken) {
      lastLoginDebug = {
        url: loginUrl,
        status: res.status,
        responseKeys: Object.keys(res.data ?? {}),
        authTokenExists: false,
        role: null,
      };
      throw new Error("Invalid login response: missing authToken");
    }

    // Persist token immediately so any follow-up call is authorized.
    setAuthToken(authToken);
    if (user_id !== undefined && user_id !== null) persistUserId(user_id);

    // Resolve role: prefer login response, otherwise fall back to /auth/me.
    let normalized = role ? normalizeRole(role) : null;
    let profile: Record<string, unknown> = {};

    if (!normalized) {
      try {
        const me = await apiClient.get<Record<string, unknown>>(
          endpoints.auth.me,
        );
        profile = me.data ?? {};
        normalized = normalizeRole((profile.role as string) ?? "");
      } catch {
        /* ignore — we'll surface the error below */
      }
      if (!normalized) {
        lastLoginDebug = {
          url: loginUrl,
          status: res.status,
          responseKeys: Object.keys(res.data ?? {}),
          authTokenExists: true,
          role: null,
        };
        throw new Error("Invalid login response: missing role");
      }
    } else {
      // Best-effort profile enrichment; never block login on this.
      try {
        const me = await apiClient.get<Record<string, unknown>>(
          endpoints.auth.me,
        );
        profile = me.data ?? {};
      } catch {
        profile = {};
      }
    }

    persistRole(normalized);



    const user: AuthUser = {
      id: String(profile.id ?? profile.user_id ?? user_id ?? ""),
      username: pickUsername({ ...profile, username }),
      name: pickName(profile),
      role: normalized,
      email: (profile.email as string) ?? undefined,
      avatarUrl: (profile.avatar_url as string) ?? undefined,
    };

    lastLoginDebug = {
      url: loginUrl,
      status: res.status,
      responseKeys: Object.keys(res.data ?? {}),
      authTokenExists: true,
      role: normalized,
    };

    return { user, token: authToken };
  } catch (err) {
    if (!lastLoginDebug) {
      const status =
        err && typeof err === "object" && "status" in err
          ? (err as any).status
          : 0;
      const payload =
        err && typeof err === "object" && "payload" in err
          ? (err as any).payload
          : null;
      lastLoginDebug = {
        url: loginUrl,
        status,
        responseKeys:
          payload && typeof payload === "object" ? Object.keys(payload) : [],
        authTokenExists: false,
        role: null,
      };
    }
    throw err;
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const res = await apiClient.get<Record<string, unknown>>(endpoints.auth.me);
  const payload = res.data ?? {};
  const normalized = normalizeRole((payload.role as string) ?? "");
  if (!normalized) return null;
  return {
    id: String(payload.id ?? payload.user_id ?? ""),
    username: pickUsername(payload),
    name: pickName(payload),
    role: normalized,
    email: (payload.email as string) ?? undefined,
    avatarUrl: (payload.avatar_url as string) ?? undefined,
  };
}

export interface SignupInput {
  name: string;
  username: string;
  password: string;
  phone?: string | null;
  email?: string | null;
}

/**
 * POST /auth/signup — creates a user and returns { authToken, user_id }.
 * Empty phone/email values are coerced to null (never sent as "").
 */
export async function signup(
  input: SignupInput,
): Promise<{ user: AuthUser; token: string }> {
  const cleanPhone =
    typeof input.phone === "string" && input.phone.trim() !== ""
      ? input.phone.trim()
      : null;
  const cleanEmail =
    typeof input.email === "string" && input.email.trim() !== ""
      ? input.email.trim()
      : null;

  const body = {
    name: input.name.trim(),
    username: input.username.trim(),
    phone: cleanPhone,
    email: cleanEmail,
    password: input.password,
  };

  const res = await apiClient.post<LoginResponse>(endpoints.auth.signup, body, {
    skipAuth: true,
  });
  const { authToken, user_id, role } = res.data ?? ({} as LoginResponse);
  if (!authToken) {
    throw new Error("پاسخ نامعتبر از سرور: توکن دریافت نشد");
  }

  setAuthToken(authToken);
  if (user_id !== undefined && user_id !== null) persistUserId(user_id);

  let normalized = role ? normalizeRole(role) : null;
  let profile: Record<string, unknown> = {};
  try {
    const me = await apiClient.get<Record<string, unknown>>(endpoints.auth.me);
    profile = me.data ?? {};
    if (!normalized) normalized = normalizeRole((profile.role as string) ?? "");
  } catch {
    /* ignore */
  }
  if (!normalized) normalized = "student"; // safe default so we can still route
  persistRole(normalized);

  const user: AuthUser = {
    id: String(profile.id ?? profile.user_id ?? user_id ?? ""),
    username: pickUsername({ ...profile, username: body.username }),
    name: pickName({ ...profile, name: body.name }),
    role: normalized,
    email: (profile.email as string) ?? cleanEmail ?? undefined,
    avatarUrl: (profile.avatar_url as string) ?? undefined,
  };
  return { user, token: authToken };
}

export async function logout(): Promise<{ ok: true }> {
  setAuthToken(null);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(ROLE_STORAGE_KEY);
      window.localStorage.removeItem(USER_ID_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
  return { ok: true };
}

export const auth = {
  login,
  signup,
  logout,
  getCurrentUser,
  normalizeRole,
};
