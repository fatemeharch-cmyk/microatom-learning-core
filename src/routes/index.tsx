import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useRole } from "@/lib/role-context";
import { ROLES, ROLE_ORDER, type RoleId } from "@/lib/roles";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Atomia — Personalized Learning Intelligence" },
      {
        name: "description",
        content:
          "Atomia adapts to every student's unique learning journey with its proprietary Turbo Engine.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { availableRoles, setActiveRole } = useRole();
  const { lang, dir, toggle } = useI18n();
  const fa = lang === "fa";

  const visible = ROLE_ORDER.filter((r) => availableRoles.includes(r));

  return (
    <div
      dir={dir}
      className={`min-h-screen bg-background flex flex-col items-center justify-center p-6 ${
        dir === "rtl" ? "font-vazir" : ""
      }`}
    >
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{fa ? "آتومیا" : "Atomia"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-4">
            {fa ? "فضای کاری خود را انتخاب کنید" : "Choose your workspace"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {fa
              ? "هوش یادگیری شخصی‌سازی‌شده که با هر مسیر یادگیری همراه می‌شود."
              : "Personalized learning intelligence that adapts to every journey."}
          </p>
          <button
            onClick={toggle}
            className="mt-4 text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
          >
            {fa ? "English" : "فارسی"}
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((id: RoleId) => {
            const r = ROLES[id];
            const Icon = r.icon;
            return (
              <button
                key={id}
                onClick={() => setActiveRole(id)}
                className="group text-start rounded-xl border bg-card p-5 transition hover:border-primary hover:shadow-md"
              >
                <div
                  className={`h-10 w-10 rounded-lg grid place-items-center text-white bg-gradient-to-br ${r.accent}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-3 font-semibold">
                  {fa ? r.labelFa : r.labelEn}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {fa ? r.descriptionFa : r.descriptionEn}
                </p>
              </button>
            );
          })}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-8">
          {fa
            ? "در آینده: ورود ایمن و تخصیص نقش از طریق Xano"
            : "Coming soon: secure sign-in & role assignment via Xano"}
        </p>
      </div>
    </div>
  );
}
