/**
 * Auth API — talks to the Xano Authentication endpoints.
 *
 *   POST /auth/login  → { authToken, user_id, role }
 *   GET  /auth/me     → current user (requires Bearer token)
 *
 * The mock implementation has been removed. UI continues to consume
 * src/lib/auth-context.tsx, which now delegates to this module.
 */

import { apiClient, setAuthToken } from "./client";
import { endpoints } from "./endpoints";
import type { RoleId } from "@/lib/roles";

export interface LoginResponse {
  authToken: string;
  user_id: string | number;
  role: string;
}

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: RoleId;
  email?: string;
  avatarUrl?: string;
}

/**
 * Map raw Xano role strings to the internal RoleId.
 * Xano may return "grade_supervisor" for the supervisor role.
 */
export function normalizeRole(raw: string): RoleId | null {
  const r = (raw ?? "").toString().trim().toLowerCase();
  if (r === "student") return "student";
  if (r === "teacher") return "teacher";
  if (r === "parent") return "parent";
  if (r === "admin") return "admin";
  if (r === "supervisor" || r === "grade_supervisor") return "supervisor";
  return null;
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

export async function login(
  username: string,
  password: string,
): Promise<{ user: AuthUser; token: string }> {
  const res = await apiClient.post<LoginResponse>(
    endpoints.auth.login,
    { username, password },
    { skipAuth: true },
  );

  const { authToken, user_id, role } = res.data;
  const normalized = normalizeRole(role);
  if (!authToken || !normalized) {
    throw new Error("Invalid login response");
  }

  // Persist token immediately so the follow-up /auth/me call is authorized.
  setAuthToken(authToken);

  // Fetch full profile. If /auth/me fails, fall back to the login payload.
  let profile: Record<string, unknown> = {};
  try {
    const me = await apiClient.get<Record<string, unknown>>(endpoints.auth.me);
    profile = me.data ?? {};
  } catch {
    profile = {};
  }

  const user: AuthUser = {
    id: String(profile.id ?? profile.user_id ?? user_id),
    username: pickUsername({ ...profile, username }),
    name: pickName(profile),
    role: normalized,
    email: (profile.email as string) ?? undefined,
    avatarUrl: (profile.avatar_url as string) ?? undefined,
  };

  return { user, token: authToken };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
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
  } catch {
    return null;
  }
}

export async function logout(): Promise<{ ok: true }> {
  setAuthToken(null);
  return { ok: true };
}

export const auth = {
  login,
  logout,
  getCurrentUser,
  normalizeRole,
};
