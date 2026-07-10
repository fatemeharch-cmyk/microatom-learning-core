import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Sparkles, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { fetchUserRoles } from "@/lib/api/auth";
import type { RoleId } from "@/lib/roles";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "ثبت‌نام در آتومیا" },
      {
        name: "description",
        content:
          "ساخت حساب کاربری در آتومیا و ورود به فضای یادگیری شخصی‌سازی‌شده.",
      },
    ],
  }),
  component: SignupPage,
});

const THEME_ENDPOINT = "https://x8ki-letl-twmt.n7.xano.io/api:theme/current";

function toCanonicalRole(role: RoleId): string {
  if (role === "supervisor") return "grade_supervisor";
  if (role === "admin") return "principal";
  return role;
}

function routeForRole(role: string): string {
  switch (role) {
    case "student":
      return "/student";
    case "parent":
      return "/parent";
    case "teacher":
      return "/teacher";
    case "grade_supervisor":
      return "/grade-supervisor";
    case "principal":
      return "/principal";
    default:
      return "/";
  }
}

async function applyRoleAndRoute(
  userId: string,
  role: RoleId,
  setUserRole: (r: RoleId) => void,
  go: (to: string) => void,
) {
  const selectedRole = toCanonicalRole(role);
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("atomia_selected_role", selectedRole);
      window.localStorage.setItem("atomia_user_id", String(userId));
    }
  } catch {
    /* ignore */
  }

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
        role: selectedRole,
      }),
    });
    if (res.ok) {
      const json = await res.json();
      const theme = json?.theme ?? json;
      if (theme && typeof window !== "undefined") {
        window.localStorage.setItem("atomia_theme", JSON.stringify(theme));
      }
    }
  } catch {
    /* ignore */
  }

  setUserRole(role);
  go(routeForRole(selectedRole));
}

function SignupPage() {
  const { signup, setUserRole } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!username.trim() || !password) {
      setMessage("نام کاربری و رمز عبور الزامی است.");
      return;
    }

    setPending(true);
    const result = await signup({
      name: name.trim() || username.trim(),
      username: username.trim(),
      password,
      phone: phone.trim() || null,
      email: email.trim() || null,
    });

    if (!result.ok) {
      setPending(false);
      setMessage(result.message);
      return;
    }

    const userId = result.user.id;
    let roles: RoleId[] = [];
    try {
      roles = await fetchUserRoles(userId);
    } catch {
      /* ignore */
    }
    if (roles.length === 0) roles = [result.user.role];

    await applyRoleAndRoute(userId, roles[0], setUserRole, (to) =>
      navigate({ to, replace: true }),
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
            ساخت حساب جدید
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            اطلاعات زیر را برای ثبت‌نام تکمیل کنید.
          </p>
        </div>

        <div className="rounded-2xl border bg-card shadow-sm p-6 sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm">
                نام و نام خانوادگی
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثلاً علی رضایی"
                className="text-right"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-sm">
                نام کاربری <span className="text-destructive">*</span>
              </Label>
              <Input
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="student_test_001"
                dir="ltr"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm">
                  شماره تلفن
                </Label>
                <Input
                  id="phone"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09120000001"
                  dir="ltr"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm">
                  ایمیل
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm">
                رمز عبور <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
              />
            </div>

            {message ? (
              <div
                role="status"
                className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive"
              >
                {message}
              </div>
            ) : null}

            <Button type="submit" className="w-full gap-2" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>در حال ثبت‌نام...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>ثبت‌نام و ورود</span>
                </>
              )}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            حساب دارید؟{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              وارد شوید
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
