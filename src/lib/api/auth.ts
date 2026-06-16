/**
 * Placeholder auth module for future Xano integration.
 * Returns mock data only — no real authentication happens yet.
 */

import type { RoleId } from "@/lib/roles";

export interface AuthSession {
  token: string;
  refreshToken: string;
  expiresAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  role: RoleId;
  email: string;
  avatarUrl?: string;
}

const MOCK_USER: AuthUser = {
  id: "mock-user-1",
  name: "کاربر آتمیا",
  role: "student",
  email: "user@atomia.local",
};

const MOCK_SESSION: AuthSession = {
  token: "mock-token",
  refreshToken: "mock-refresh-token",
  expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
};

export async function login(_email: string, _password: string): Promise<{
  user: AuthUser;
  session: AuthSession;
}> {
  return { user: MOCK_USER, session: MOCK_SESSION };
}

export async function logout(): Promise<{ ok: true }> {
  return { ok: true };
}

export async function refreshSession(): Promise<AuthSession> {
  return MOCK_SESSION;
}

export async function getCurrentUser(): Promise<AuthUser> {
  return MOCK_USER;
}

export async function getCurrentRole(): Promise<RoleId> {
  return MOCK_USER.role;
}

export const auth = {
  login,
  logout,
  refreshSession,
  getCurrentUser,
  getCurrentRole,
};
