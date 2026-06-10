import { Link, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Bell, Flame, Sparkles, Trophy } from "lucide-react";
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

export type NavItem = {
  title: string;
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

  return (
    <div dir="rtl" className="font-vazir">
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <Sidebar collapsible="icon" side="right">
            <SidebarHeader>
              <div className="px-2 py-3 flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-[image:var(--gradient-primary)] grid place-items-center text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">میکرواتم هوشمند</p>
                  <p className="text-sm font-semibold text-sidebar-foreground">پنل دانش‌آموز</p>
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>منو اصلی</SidebarGroupLabel>
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
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
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
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                      <span>تغییر نقش</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>

          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-16 border-b flex items-center gap-3 px-4 md:px-6 bg-card/50 backdrop-blur">
              <SidebarTrigger />
              <div className="flex-1" />
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[image:var(--gradient-xp)] text-white text-xs font-semibold shadow">
                <Trophy className="h-3.5 w-3.5" />
                <span>۲٬۴۸۰ XP</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/15 text-warning text-xs font-semibold">
                <Flame className="h-3.5 w-3.5" />
                <span>۱۲ روز پیاپی</span>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-4 w-4" />
              </Button>
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">آر</AvatarFallback>
              </Avatar>
            </header>
            <main className="flex-1 p-4 md:p-6">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
