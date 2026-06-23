import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ROLES, type RoleId } from "./roles";
import {
  login as apiLogin,
  logout as apiLogout,
  getCurrentUser as apiGetCurrentUser,
} from "./api/auth";
import { getAuthToken, setAuthToken } from "./api/client";

/**
 * AuthProvider — real authentication for Atomia via Xano.
 *
 * Flow:
 *   UI → AuthContext → src/lib/api/auth.ts → src/lib/api/client.ts → Xano
 *
 * The auth token and the current role are persisted in localStorage so that
 * page refreshes keep the session. AuthGuard and the RoleSwitcher consume
 * `useAuth()` exactly as before — no UI changes required.
 */

export type AuthUser = {
  id: string;
  username: string;
  name: string;
  role: RoleId;
  email?: string;
  avatarUrl?: string;
};

type LoginResult =
  | { ok: true; user: AuthUser }
  | { ok: false; message: string };

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** True until we've finished hydrating the session on mount */
  isHydrated: boolean;
  login: (username: string, password: string) => Promise<LoginResult>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_STORAGE_KEY = "atomia.auth.user";
const ROLE_STORAGE_KEY = "atomia.auth.role";

const FRIENDLY_ERROR = "اطلاعات ورود را دوباره بررسی کنید.";

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed?.role || !ROLES[parsed.role]) return null;
    return parsed;
  } catch {
    return null;
  }
}

function persistUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      window.localStorage.setItem(ROLE_STORAGE_KEY, user.role);
    } else {
      window.localStorage.removeItem(USER_STORAGE_KEY);
      window.localStorage.removeItem(ROLE_STORAGE_KEY);
    }
  } catch {
    /* ignore */
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const cached = readStoredUser();
    if (cached) setUser(cached);

    // If we have a token, try to refresh the user from /auth/me in the
    // background so the cached profile stays in sync.
    const token = getAuthToken();
    if (token) {
      apiGetCurrentUser()
        .then((fresh) => {
          if (cancelled) return;
          if (fresh) {
            setUser(fresh);
            persistUser(fresh);
          } else if (!cached) {
            // Token is invalid and we had no cached session → clear it.
            setAuthToken(null);
          }
        })
        .catch(() => {
          /* keep cached user if /me fails (e.g. offline) */
        })
        .finally(() => {
          if (!cancelled) setIsHydrated(true);
        });
    } else {
      setIsHydrated(true);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback<AuthContextValue["login"]>(
    async (username, password) => {
      const cleanUser = username.trim();
      if (!cleanUser || !password) {
        return { ok: false, message: FRIENDLY_ERROR };
      }
      try {
        const { user: nextUser } = await apiLogin(cleanUser, password);
        persistUser(nextUser);
        setUser(nextUser);
        return { ok: true, user: nextUser };
      } catch (err) {
        // Make sure no stale token survives a failed attempt.
        setAuthToken(null);
        const raw = err instanceof Error ? err.message : String(err);
        // TEMP: always surface the raw error (Xano message / network detail)
        // so we can see why login fails in preview, not just dev.
        // eslint-disable-next-line no-console
        console.error("[auth] login failed:", err);
        return {
          ok: false,
          message: raw || FRIENDLY_ERROR,
        };
      }
    },
    [],
  );

  const logout = useCallback(() => {
    void apiLogout();
    persistUser(null);
    if (typeof window !== "undefined") {
      // Also clear the cached active role so the next user starts fresh.
      window.localStorage.removeItem("atomia.activeRole");
    }
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.assign("/login");
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isHydrated,
      login,
      logout,
    }),
    [user, isHydrated, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
