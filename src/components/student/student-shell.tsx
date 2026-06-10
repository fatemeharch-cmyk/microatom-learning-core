import { Link, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Bell, Flame, Sparkles, Trophy, Languages } from "lucide-react";
import type { ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useI18n, type TKey } from "@/lib/i18n";

export type NavItem = {
  titleKey: TKey;
  url: string;
  icon: LucideIcon;
};

export function StudentShell({
  items,
  children,
}: {
  items: NavItem[];
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t, dir, lang, toggle } = useI18n();
  const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowLeft;

  return (
    <div dir={dir} className={dir === "rtl" ? "font-vazir" : ""}>
      <SidebarProvider>
        <div className="min-h-dvh flex w-full bg-background">
          <Sidebar collapsible="icon" side={dir === "rtl" ? "right" : "left"}>
            <SidebarHeader>
              <div className="px-2 py-3 flex items-center gap-2">
                <div className="h-9 w-9 shrink-0 rounded-lg bg-[image:var(--gradient-primary)] grid place-items-center text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{t("brand")}</p>
                  <p className="text-sm font-semibold text-sidebar-foreground truncate">
                    {t("role_student")}
                  </p>
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>{t("main_menu")}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map((item) => {
                      const active =
                        pathname === item.url ||
                        (item.url !== "/student" && pathname.startsWith(item.url));
                      return (
                        <SidebarMenuItem key={item.url}>
                          <SidebarMenuButton asChild isActive={active}>
                            <Link to={item.url} className="flex items-center gap-2">
                              <item.icon className="h-4 w-4 shrink-0" />
                              <span className="truncate">{t(item.titleKey)}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/" className="flex items-center gap-2">
                      <ArrowIcon className={`h-4 w-4 shrink-0 ${dir === "rtl" ? "rotate-180" : ""}`} />
                      <span className="truncate">{t("switch_role")}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>

          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-16 border-b flex items-center gap-2 sm:gap-3 px-3 sm:px-6 bg-card/60 backdrop-blur sticky top-0 z-30">
              <SidebarTrigger />
              <div className="flex-1 min-w-0" />
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[image:var(--gradient-xp)] text-white text-xs font-semibold shadow-sm">
                <Trophy className="h-3.5 w-3.5" />
                <span>{lang === "fa" ? "۲٬۴۸۰" : "2,480"} {t("xp_short")}</span>
              </div>
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/15 text-warning text-xs font-semibold">
                <Flame className="h-3.5 w-3.5" />
                <span>{t("streak_days", { n: lang === "fa" ? "۱۲" : 12 })}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggle}
                aria-label={t("language")}
                className="rounded-full h-9 px-3 gap-1.5"
              >
                <Languages className="h-4 w-4" />
                <span className="font-semibold text-xs">{lang === "fa" ? "EN" : "فا"}</span>
              </Button>
              <Button variant="ghost" size="icon" aria-label={t("notifications")} className="rounded-full">
                <Bell className="h-4 w-4" />
              </Button>
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {lang === "fa" ? "آر" : "AR"}
                </AvatarFallback>
              </Avatar>
            </header>
            <main className="flex-1 p-4 md:p-6">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
