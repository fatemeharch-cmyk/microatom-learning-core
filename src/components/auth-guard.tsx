import { useEffect, type ReactNode } from "react";
import { useRouterState, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { ROLES, ROLE_ORDER, type RoleId } from "@/lib/roles";

/**
 * Public routes that never require authentication.
 * Any other top-level segment that matches a role (e.g. "/student/...") is
 * treated as protected and must match the signed-in user's role.
 */
const PUBLIC_ROUTES = new Set<string>(["/", "/login"]);

function getRoleSegment(pathname: string): RoleId | null {
  const seg = pathname.split("/").filter(Boolean)[0];
  return seg && (ROLE_ORDER as string[]).includes(seg) ? (seg as RoleId) : null;
}

/**
 * Wraps the app and enforces:
 *   - protected role areas require a signed-in user → /login otherwise
 *   - role mismatch (e.g. parent visiting /admin) → user's own landing page
 *
 * Implemented as an effect so we don't need to modify any existing route file.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, isHydrated } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!isHydrated) return;

    if (PUBLIC_ROUTES.has(pathname)) {
      // Already signed in? Send them to their workspace instead of /login.
      if (pathname === "/login" && user) {
        navigate({ to: ROLES[user.role].landing, replace: true });
      }
      return;
    }

    const roleSegment = getRoleSegment(pathname);
    if (!roleSegment) return; // unknown / non-role route — leave alone

    if (!user) {
      navigate({ to: "/login", replace: true });
      return;
    }

    if (user.role !== roleSegment) {
      navigate({ to: ROLES[user.role].landing, replace: true });
    }
  }, [isHydrated, user, pathname, navigate]);

  return <>{children}</>;
}
