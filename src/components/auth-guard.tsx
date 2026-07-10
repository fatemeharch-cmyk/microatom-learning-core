import { useEffect, type ReactNode } from "react";
import { useRouterState, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import type { RoleId } from "@/lib/roles";

/** Routes that never require authentication. */
const PUBLIC_ROUTES = new Set<string>(["/", "/login", "/signup"]);

/** URL prefix → the internal RoleId allowed to access it. */
const ROUTE_TO_ROLE: Array<{ prefix: string; role: RoleId }> = (
  [
    { prefix: "/grade-supervisor", role: "supervisor" as RoleId },
    { prefix: "/principal", role: "admin" as RoleId },
    { prefix: "/admin", role: "admin" as RoleId },
    { prefix: "/student", role: "student" as RoleId },
    { prefix: "/teacher", role: "teacher" as RoleId },
    { prefix: "/parent", role: "parent" as RoleId },
  ] as Array<{ prefix: string; role: RoleId }>
).sort((a, b) => b.prefix.length - a.prefix.length);

/** Internal RoleId → its dashboard route. */
const ROLE_TO_ROUTE: Record<RoleId, string> = {
  student: "/student",
  teacher: "/teacher",
  parent: "/parent",
  supervisor: "/grade-supervisor",
  admin: "/principal",
};

function matchProtected(pathname: string): { prefix: string; role: RoleId } | null {
  for (const entry of ROUTE_TO_ROLE) {
    if (pathname === entry.prefix || pathname.startsWith(entry.prefix + "/")) {
      return entry;
    }
  }
  return null;
}

function LoadingScreen() {
  return (
    <div
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-background text-foreground"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">در حال بررسی نشست…</p>
      </div>
    </div>
  );
}

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, isHydrated } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isPublic = PUBLIC_ROUTES.has(pathname);
  const match = matchProtected(pathname);

  useEffect(() => {
    if (isPublic) return;
    if (!match) return; // non-role route (e.g. /about) — leave alone
    if (!isHydrated) return;

    // Not authenticated → send to /login, preserving intended route.
    if (!user) {
      try {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(
            "atomia.auth.redirect",
            pathname + window.location.search,
          );
        }
      } catch {
        /* ignore */
      }
      navigate({ to: "/login", replace: true });
      return;
    }

    // Authenticated but wrong role → send to their own dashboard.
    if (user.role !== match.role) {
      const target = ROLE_TO_ROUTE[user.role] ?? "/login";
      navigate({ to: target, replace: true });
    }
  }, [isPublic, match, isHydrated, user, pathname, navigate]);

  // Public routes always render.
  if (isPublic) return <>{children}</>;
  // Non-protected routes render as-is.
  if (!match) return <>{children}</>;

  // Protected: block rendering until we know the answer.
  if (!isHydrated) return <LoadingScreen />;
  if (!user) return <LoadingScreen />;
  if (user.role !== match.role) return <LoadingScreen />;

  return <>{children}</>;
}
