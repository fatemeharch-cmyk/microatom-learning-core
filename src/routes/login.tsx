import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Sparkles, LogIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { ROLES, type RoleId } from "@/lib/roles";
import {
  lastLoginDebug,
  fetchUserRoles,
  type LoginDebugInfo,
} from "@/lib/api/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "ورود به آتومیا" },
      {
        name: "description",
        content:
          "ورود به فضای کاری شخصی‌سازی‌شده آتومیا برای دانش‌آموزان، دبیران، والدین، مسئولان پایه و مدیران مدرسه.",
      },
    ],
  }),
  component: LoginPage,
});

const DEMO_ACCOUNTS: Array<{ user: string; labelFa: string }> = [
  { user: "student", labelFa: "دانش‌آموز" },
  { user: "teacher", labelFa: "دبیر" },
  { user: "supervisor", labelFa: "مسئول پایه" },
  { user: "parent", labelFa: "والدین" },
  { user: "admin", labelFa: "مدیر مدرسه" },
];

const THEME_ENDPOINT = "https://x8ki-letl-twmt.n7.xano.io/api:theme/current";

/** Persist the user's chosen role + cached theme, then route to the right workspace. */
async function applyRoleAndRoute(
  userId: string,
  role: RoleId,
  setUserRole: (r: RoleId) => void,
  go: (to: string) => void,
) {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("atomia_selected_role", role);
      window.localStorage.setItem("atomia_user_id", String(userId));
    }
  } catch {
    /* ignore */
  }

  // Best-effort theme fetch — never block routing on it.
  try {
    const numeric = Number(userId);
    const res = await fetch(THEME_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        user_id: Number.isFinite(numeric) ? numeric : userId,
        role,
      }),
    });
    if (res.ok) {
      const json = await res.json();
      try {
        window.localStorage.setItem("atomia_theme", JSON.stringify(json));
      } catch {
        /* ignore */
      }
    }
  } catch {
    /* ignore */
  }

  setUserRole(role);
  go(ROLES[role].landing);
}

function LoginPage() {
  const { login, user, isHydrated, setUserRole } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [debug, setDebug] = useState<LoginDebugInfo | null>(null);
  const [roleChoices, setRoleChoices] = useState<RoleId[] | null>(null);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [applyingRole, setApplyingRole] = useState<RoleId | null>(null);

  // If already signed in (and no pending role choice), jump to the workspace.
  useEffect(() => {
    if (isHydrated && user && !roleChoices) {
      navigate({ to: ROLES[user.role].landing, replace: true });
    }
  }, [isHydrated, user, navigate, roleChoices]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    setPending(true);
    const result = await login(username, password);
    setDebug(lastLoginDebug);
    setPending(false);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    const userId = result.user.id;
    let roles: RoleId[] = [];
    try {
      roles = await fetchUserRoles(userId);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[auth] fetchUserRoles failed, falling back to login role:", err);
    }

    // Fallback: if the roles endpoint failed or returned nothing, use the role
    // that came back on the login response.
    if (roles.length === 0) roles = [result.user.role];

    if (roles.length === 1) {
      await applyRoleAndRoute(userId, roles[0], setUserRole, (to) =>
        navigate({ to, replace: true }),
      );
      return;
    }

    // Multi-role: show the selector.
    setPendingUserId(userId);
    setRoleChoices(roles);
  }

  async function handleRoleSelect(role: RoleId) {
    if (!pendingUserId) return;
    setApplyingRole(role);
    await applyRoleAndRoute(pendingUserId, role, setUserRole, (to) =>
      navigate({ to, replace: true }),
    );
  }

  function quickFill(u: string) {
    setUsername(u);
    setPassword("atomia");
    setMessage(null);
  }

  if (roleChoices) {
    return (
      <RoleSelector
        roles={roleChoices}
        applying={applyingRole}
        onSelect={handleRoleSelect}
      />
    );
  }

  return (
    <div
      dir="rtl"
      className="font-vazir min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>آتومیا</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-4">
            خوش آمدید
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            لطفاً اطلاعات ورود خود را وارد کنید.
          </p>
        </div>

        <div className="rounded-2xl border bg-card shadow-sm p-6 sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-sm">
                نام کاربری
              </Label>
              <Input
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="مثلاً student"
                className="text-right"
                dir="ltr"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm">
                رمز عبور
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
              />
            </div>

            {message ? (
              <div
                role="status"
                className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-foreground/80"
              >
                {message}
              </div>
            ) : null}

            <Button type="submit" className="w-full gap-2" disabled={pending}>
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              <span>ورود به آتومیا</span>
            </Button>
          </form>

          <div className="mt-6">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground text-center mb-2">
              ورود سریع برای دمو
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((a) => (
                <button
                  key={a.user}
                  type="button"
                  onClick={() => quickFill(a.user)}
                  className="rounded-lg border bg-background hover:bg-accent transition-colors px-2 py-2 text-xs font-medium"
                >
                  {a.labelFa}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground text-center mt-3">
              در حالت دمو، رمز دلخواه پذیرفته می‌شود.
            </p>
          </div>

          {debug ? (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-900 font-mono space-y-1 break-all">
              <div className="font-bold text-amber-700 mb-1">Debug</div>
              <div>URL: {debug.url}</div>
              <div>Status: {debug.status}</div>
              <div>Keys: {debug.responseKeys.join(", ") || "—"}</div>
              <div>Token: {debug.authTokenExists ? "true" : "false"}</div>
              <div>Role: {debug.role ?? "—"}</div>
              <div>
                Redirect: {debug.role ? ROLES[debug.role].landing : "—"}
              </div>
              <div>Error: {message ?? "—"}</div>
            </div>
          ) : null}
        </div>

        <div className="text-center mt-5">
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────── Role Selector ───────────────────────────── */

function RoleSelector({
  roles,
  applying,
  onSelect,
}: {
  roles: RoleId[];
  applying: RoleId | null;
  onSelect: (role: RoleId) => void;
}) {
  return (
    <div
      dir="rtl"
      className="font-vazir min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>آتومیا</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-4">
            با کدام نقش وارد می‌شوی؟
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            برای ورود به فضای کاری مناسب، یکی از نقش‌های فعال خود را انتخاب کنید.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((id) => {
            const r = ROLES[id];
            const Icon = r.icon;
            const isApplying = applying === id;
            const disabled = applying !== null;
            return (
              <button
                key={id}
                onClick={() => onSelect(id)}
                disabled={disabled}
                className="group text-start rounded-2xl border bg-card shadow-sm p-5 transition hover:border-primary hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div
                  className={`h-10 w-10 rounded-xl grid place-items-center text-white bg-gradient-to-br ${r.accent}`}
                >
                  {isApplying ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <h2 className="mt-3 font-semibold">{r.labelFa}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {r.descriptionFa}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
