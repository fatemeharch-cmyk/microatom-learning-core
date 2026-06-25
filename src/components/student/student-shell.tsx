/**
 * Student shell — Medical Learning Dashboard layout.
 *
 * Right-fixed white sidebar, soft lavender background, header pills,
 * Persian RTL. Replaces the previous shadcn Sidebar-based shell so the
 * UI matches the reference dashboard.
 */
import { Link, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { Sparkles, Bell, ArrowLeft, Menu } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { RoleSwitcher } from "@/components/role-switcher";
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
    <aside className="h-full w-full bg-white flex flex-col py-6 px-4 gap-4">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 pb-4 border-b border-slate-100">
        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 grid place-items-center text-white shadow-md shadow-violet-200">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-base font-extrabold text-slate-800 leading-tight">مسیر رشد</p>
          <p className="text-[11px] text-slate-400 mt-0.5">پلتفرم یادگیری هوشمند</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
        {items.map((item) => {
          const active =
            pathname === item.url ||
            (item.url !== "/student" && pathname.startsWith(item.url));
          return (
            <Link
              key={item.url}
              to={item.url}
              onClick={onNavigate}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                active
                  ? "bg-violet-100/80 text-violet-700 shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <span
                className={`h-8 w-8 rounded-lg grid place-items-center ${
                  active
                    ? "bg-white text-violet-600 shadow-sm"
                    : "bg-slate-50 text-slate-400 group-hover:text-violet-500"
                }`}
              >
                <item.icon className="h-4 w-4" />
              </span>
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer card */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-200">
        <p className="text-sm font-bold">هدف تو مهمه</p>
        <p className="text-[11px] opacity-90 mt-1 leading-relaxed">
          ما اینجاییم تا هوشمندانه‌تر یاد بگیری
        </p>
        <Button
          asChild
          size="sm"
          className="mt-3 w-full rounded-full bg-white text-violet-600 hover:bg-white/90 font-semibold"
        >
          <Link to="/student/next-step">ادامه مسیر</Link>
        </Button>
      </div>
    </aside>
  );
}

export function StudentShell({
  items,
  children,
}: {
  items: NavItem[];
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const today = "شنبه ۲۵ اردیبهشت ۱۴۰۴";

  return (
    <div
      dir="rtl"
      className="font-vazir min-h-dvh"
      style={{ background: "#f7f8ff" }}
    >
      <div className="flex min-h-dvh">
        {/* Desktop sidebar (right) */}
        <div className="hidden lg:flex order-2 w-[230px] shrink-0 border-l border-slate-100">
          <SidebarBody items={items} pathname={pathname} />
        </div>

        {/* Main */}
        <div className="flex-1 min-w-0 flex flex-col">
          <header className="px-4 md:px-8 pt-6 pb-2 flex items-center gap-3">
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
              <SheetContent
                side="right"
                className="p-0 w-[260px] bg-white"
              >
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
            <RoleSwitcher compact />
            <Link
              to="/"
              className="hidden md:inline-flex items-center gap-1 text-xs text-slate-500 hover:text-violet-600"
            >
              <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
              تغییر نقش
            </Link>
          </header>
          <main className="flex-1 p-4 md:p-8 pt-2">{children}</main>
        </div>
      </div>
    </div>
  );
}
