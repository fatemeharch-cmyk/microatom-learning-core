import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Sparkles, LogIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { ROLES } from "@/lib/roles";
import { lastLoginDebug, type LoginDebugInfo } from "@/lib/api/auth";

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

function LoginPage() {
  const { login, user, isHydrated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [debug, setDebug] = useState<LoginDebugInfo | null>(null);

  // If already signed in, jump straight to the right workspace.
  useEffect(() => {
    if (isHydrated && user) {
      navigate({ to: ROLES[user.role].landing, replace: true });
    }
  }, [isHydrated, user, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    setPending(true);
    const result = await login(username, password);
    setDebug(lastLoginDebug);
    setPending(false);
    if (result.ok) {
      navigate({ to: ROLES[result.user.role].landing, replace: true });
    } else {
      setMessage(result.message);
    }
  }

  function quickFill(u: string) {
    setUsername(u);
    setPassword("atomia");
    setMessage(null);
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

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={pending}
            >
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
