import { useEffect, type ReactNode } from "react";
import { useRouterState, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";

/**
 * Public routes that never require authentication.
 */
const PUBLIC_ROUTES = new Set<string>(["/", "/login"]);

/**
 * Canonical roles (matching backend) → their dashboard route prefix.
 * This is the SINGLE source of truth for refresh / deep-link routing.
 */
const CANONICAL_ROLE_TO_ROUTE: Record<string, string> = {
  student: "/student",
  parent: "/parent",
  teacher: "/teacher",
  grade_supervisor: "/grade-supervisor",
  principal: "/principal",
};

/** All known dashboard route prefixes, ordered longest-first for matching. */
const ALL_ROLE_ROUTES = Object.values(CANONICAL_ROLE_TO_ROUTE).sort(
  (a, b) => b.length - a.length,
);

function routeBelongsToRole(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(route + "/");
}

function pathOwningRole(pathname: string): string | null {
  for (const r of ALL_ROLE_ROUTES) {
    if (routeBelongsToRole(pathname, r)) return r;
  }
  return null;
}

function readSelectedRole(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem("atomia_selected_role");
    return v && CANONICAL_ROLE_TO_ROUTE[v] ? v : null;
  } catch {
    return null;
  }
}

/**
 * Refresh-safe route protection:
 *   - Unauthenticated user on a protected role route → /login
 *   - Authenticated user with a selected role visiting another role's
 *     route → redirect to their own role's route.
 *   - Otherwise: stay where you are (including child routes).
 *
 * `atomia_selected_role` (set by the login role selector) wins over
 * whatever role /auth/me happens to return, so refreshing on
 * /grade-supervisor never bounces to /student.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, isHydrated } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!isHydrated) return;

    // The login page owns its own post-login routing.
    if (PUBLIC_ROUTES.has(pathname)) return;

    const owningRoute = pathOwningRole(pathname);
    if (!owningRoute) return; // not a role-scoped route — leave alone

    if (!user) {
      navigate({ to: "/login", replace: true });
      return;
    }

    const selected = readSelectedRole();
    if (!selected) {
      // No persisted selection yet — don't force-redirect anywhere.
      return;
    }

    const selectedRoute = CANONICAL_ROLE_TO_ROUTE[selected];
    // Current path is under the selected role (or a child) → stay.
    if (routeBelongsToRole(pathname, selectedRoute)) return;

    // Otherwise the user is on a different role's area → send them home.
    navigate({ to: selectedRoute, replace: true });
  }, [isHydrated, user, pathname, navigate]);

  return <>{children}</>;
}
