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

/**
 * AuthProvider — mock authentication for Atomia.
 *
 * No real backend is connected yet. A successful "login" stores a mock user
 * (id, name, role) in localStorage so refreshes keep the session. Replace the
 * `login()` implementation with a Xano fetch later — the rest of the app
 * already consumes `useAuth()` and won't need changes.
 *
 * UI → AuthContext → src/lib/api/auth.ts (future)
 */

export type AuthUser = {
  id: string;
  username: string;
  name: string;
  role: RoleId;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** True until we've finished reading localStorage on mount */
  isHydrated: boolean;
  login: (
    username: string,
    password: string,
  ) => Promise<{ ok: true; user: AuthUser } | { ok: false; message: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "atomia.auth.user";

/**
 * Mock directory of usernames → (role, display name).
 * Accepts both `supervisor` and `grade_supervisor` for the supervisor role.
 * Password is accepted as long as it is non-empty.
 */
const MOCK_USERS: Record<string, { role: RoleId; name: string }> = {
  student: { role: "student", name: "آرمیتا یادگیر" },
  teacher: { role: "teacher", name: "استاد رضایی" },
  parent: { role: "parent", name: "خانواده محترم" },
  supervisor: { role: "supervisor", name: "مسئول پایه" },
  grade_supervisor: { role: "supervisor", name: "مسئول پایه" },
  admin: { role: "admin", name: "مدیر مدرسه" },
};

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed?.role || !ROLES[parsed.role]) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setUser(readStoredUser());
    setIsHydrated(true);
  }, []);

  const login = useCallback<AuthContextValue["login"]>(
    async (username, password) => {
      const cleanUser = username.trim().toLowerCase();
      if (!cleanUser || !password) {
        return {
          ok: false,
          message: "لطفاً نام کاربری و رمز عبور را وارد کنید.",
        };
      }
      const match = MOCK_USERS[cleanUser];
      if (!match) {
        return {
          ok: false,
          message:
            "نام کاربری در حالت دمو شناسایی نشد. می‌توانید با student، teacher، parent، supervisor یا admin وارد شوید.",
        };
      }
      const next: AuthUser = {
        id: `mock-${match.role}-1`,
        username: cleanUser,
        name: match.name,
        role: match.role,
      };
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      setUser(next);
      return { ok: true, user: next };
    },
    [],
  );

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
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
