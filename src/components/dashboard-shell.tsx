import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";
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

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

type Props = {
  role: string;
  roleLabel: string;
  items: NavItem[];
};

export function DashboardShell({ role, roleLabel, items }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <div className="px-2 py-3">
              <p className="text-xs text-muted-foreground">Atomia</p>
              <p className="text-sm font-semibold text-sidebar-foreground">{roleLabel}</p>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => {
                    const active =
                      pathname === item.url ||
                      (item.url !== `/${role}` && pathname.startsWith(item.url));
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
                    <ArrowLeft className="h-4 w-4" />
                    <span>Switch role</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b flex items-center gap-2 px-4">
            <SidebarTrigger />
            <div className="flex-1" />
            <span className="text-sm text-muted-foreground">{roleLabel} Dashboard</span>
          </header>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export function PagePlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      <div className="mt-8 rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
        Skeleton page — features will be built here.
      </div>
    </div>
  );
}
