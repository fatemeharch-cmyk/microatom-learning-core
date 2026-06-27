/**
 * Supervisor shell — Medical Learning style for Grade 11 Experimental.
 *
 * Right-fixed white sidebar, soft lavender background, header pills,
 * Persian RTL. Mirrors the Student dashboard look.
 */
import { Link, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Bell, Menu, LogOut, HeartPulse } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export type NavItem = {
  title?: string;
  titleKey?: string;
  url: string;
  icon: LucideIcon;
};

function SidebarBody({
  items,
  pathname,
  onNavigate,
}: {
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <aside className="h-full w-full bg-white flex flex-col py-6 px-5 gap-4" dir="rtl">
      {/* Brand */}
      <div dir="rtl" className="flex flex-row items-center gap-3 pb-4 w-full">
        <div className="relative h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-100 to-pink-100 grid place-items-center shrink-0">
          <HeartPulse className="h-5 w-5 text-violet-600" />
        </div>
        <div className="flex-1 text-right">
          <p className="text-base font-extrabold text-slate-800 leading-tight">Atomia</p>
          <p className="text-[10px] text-slate-400 mt-0.5">کلینیک هوشمند یادگیری</p>
        </div>
      </div>

      <div className="rounded-xl bg-violet-50/70 px-3 py-2 text-right">
        <p className="text-[11px] text-violet-700 font-semibold">مسئول پایه یازدهم تجربی</p>
      </div>

      {/* Menu */}
      {(() => null)()}
      <nav className="flex-1 flex flex-col overflow-y-auto gap-2">
        {(() => {
          const isActiveRoute = (currentPath: string, route: string) =>
            currentPath === route || currentPath.startsWith(route + "/");
          const matching = items
            .filter((it) => isActiveRoute(pathname, it.url))
            .sort((a, b) => b.url.length - a.url.length);
          const activeUrl = matching[0]?.url ?? null;
          return items.map((item) => {
          const active = item.url === activeUrl;
          return (
            <Link
              key={item.url}
              to={item.url}
              onClick={onNavigate}
              dir="rtl"
              className={`group flex flex-row items-center gap-3 px-3 py-1.5 rounded-xl text-sm font-medium transition w-full ${
                active
                  ? "bg-violet-50 text-violet-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <span
                className={`h-8 w-8 rounded-xl grid place-items-center shrink-0 transition ${
                  active
                    ? "bg-gradient-to-br from-violet-100 to-pink-100 text-violet-600"
                    : "bg-slate-50 text-slate-400 group-hover:text-violet-500"
                }`}
              >
                <item.icon className="h-4 w-4" />
              </span>
              <span className="flex-1 truncate text-right">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function SupervisorShell({
  items,
  children,
}: {
  items: NavItem[];
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();
  const today = "شنبه ۲۵ اردیبهشت ۱۴۰۴";

  return (
    <div
      dir="rtl"
      className="font-vazir min-h-dvh"
      style={{ background: "#f7f8ff", "--sidebar-width": "240px" } as React.CSSProperties}
    >
      <div className="flex min-h-dvh">
        <div className="hidden lg:flex order-2 w-[var(--sidebar-width)] shrink-0 border-l border-slate-100">
          <SidebarBody items={items} pathname={pathname} />
        </div>

        <div
          className="flex-1 lg:flex-none lg:w-[calc(100%-var(--sidebar-width))] lg:max-w-none min-w-0 flex flex-col px-4 md:px-8 lg:px-8"
          style={{ marginRight: 0, marginLeft: "auto" }}
        >
          <header className="pt-6 pb-2 flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden rounded-full bg-white border-slate-200"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 w-[260px] bg-white">
                <SidebarBody
                  items={items}
                  pathname={pathname}
                  onNavigate={() => setMobileOpen(false)}
                />
              </SheetContent>
            </Sheet>

            <button
              className="h-10 w-10 rounded-2xl bg-white grid place-items-center shadow-sm border border-slate-100 text-slate-500 hover:text-violet-600 transition"
              aria-label="اعلان‌ها"
            >
              <Bell className="h-4 w-4" />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-4 h-10 rounded-full bg-white shadow-sm border border-slate-100 text-xs font-medium text-slate-600">
              {today}
            </div>
            <div className="flex-1" />
            <button
              onClick={() => logout()}
              className="h-10 px-3 sm:px-4 rounded-2xl bg-white inline-flex items-center gap-1.5 shadow-sm border border-slate-100 text-slate-500 hover:text-rose-600 transition text-xs font-medium"
              aria-label="خروج"
            >
              <LogOut className="h-4 w-4" />
              <span>خروج</span>
            </button>
          </header>
          <main className="flex-1 pt-2 pb-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
