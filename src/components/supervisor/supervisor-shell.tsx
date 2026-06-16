import { Link, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Bell, Layers, Languages } from "lucide-react";
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

export type NavItem = { titleKey?: TKey; title?: string; url: string; icon: LucideIcon };

export function SupervisorShell({
  items,
  children,
}: {
  items: NavItem[];
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t, dir, lang, toggle } = useI18n();

  return (
    <div dir={dir} className={dir === "rtl" ? "font-vazir" : ""}>
      <SidebarProvider>
        <div className="min-h-dvh flex w-full bg-background">
          <Sidebar collapsible="icon" side={dir === "rtl" ? "right" : "left"}>
            <SidebarHeader>
              <div className="px-2 py-3 flex items-center gap-2">
                <div className="h-9 w-9 shrink-0 rounded-lg bg-[image:var(--gradient-primary)] grid place-items-center text-primary-foreground">
                  <Layers className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{t("brand")}</p>
                  <p className="text-sm font-semibold text-sidebar-foreground truncate">
                    {t("role_supervisor")}
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
                        (item.url !== "/supervisor" && pathname.startsWith(item.url));
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
                      <ArrowLeft className={`h-4 w-4 shrink-0 ${dir === "rtl" ? "rotate-180" : ""}`} />
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
                  {lang === "fa" ? "ن" : "S"}
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
