import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AVAILABLE_ROLES,
  ROLES,
  hasPermission as _hasPermission,
  type Permission,
  type RoleId,
} from "./roles";

/**
 * RoleProvider — centralizes the "active role" of the (mock) signed-in user.
 *
 * The active role is persisted in localStorage so refreshes keep the same
 * dashboard, and it is also derived from the URL so deep-linking just works.
 *
 * When auth is added later, `availableRoles` and `userName` will come from
 * the Xano session payload instead of the mock constants.
 */

type RoleContextValue = {
  /** Roles the (mock) user is allowed to switch into */
  availableRoles: RoleId[];
  /** Currently active role — may be null on the public landing page */
  activeRole: RoleId | null;
  setActiveRole: (role: RoleId) => void;
  hasPermission: (permission: Permission) => boolean;
  /** Mock user identity, replaced by real session later */
  userName: string;
  userInitialsFa: string;
  userInitialsEn: string;
};

const RoleContext = createContext<RoleContextValue | null>(null);

const STORAGE_KEY = "atomia.activeRole";

export function RoleProvider({ children }: { children: ReactNode }) {
  const [activeRole, setActiveRoleState] = useState<RoleId | null>(null);

  // Hydrate from URL first, then localStorage.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const segments = window.location.pathname.split("/").filter(Boolean);
    const fromPath = segments[0] as RoleId | undefined;
    if (fromPath && MOCK_AVAILABLE_ROLES.includes(fromPath)) {
      setActiveRoleState(fromPath);
      window.localStorage.setItem(STORAGE_KEY, fromPath);
      return;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY) as RoleId | null;
    if (stored && MOCK_AVAILABLE_ROLES.includes(stored)) {
      setActiveRoleState(stored);
    }
  }, []);

  const setActiveRole = useCallback((role: RoleId) => {
    setActiveRoleState(role);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, role);
      window.location.assign(ROLES[role].landing);
    }
  }, []);

  const hasPermission = useCallback(
    (permission: Permission) =>
      activeRole ? _hasPermission(activeRole, permission) : false,
    [activeRole],
  );

  const value = useMemo<RoleContextValue>(
    () => ({
      availableRoles: MOCK_AVAILABLE_ROLES,
      activeRole,
      setActiveRole,
      hasPermission,
      userName: "کاربر آتومیا",
      userInitialsFa: "آ",
      userInitialsEn: "A",
    }),
    [activeRole, setActiveRole, hasPermission],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) {
    throw new Error("useRole must be used within <RoleProvider>");
  }
  return ctx;
}
