import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search, UserPlus, Users as UsersIcon } from "lucide-react";
import { managedUsers, roleLabelsFa, type RoleKey } from "@/lib/admin-mock";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

const tabs: { key: RoleKey | "all"; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "student", label: "دانش‌آموزان" },
  { key: "parent", label: "والدین" },
  { key: "teacher", label: "دبیران" },
  { key: "supervisor", label: "مسئولان پایه" },
  { key: "admin", label: "مدیران" },
];

function AdminUsers() {
  const [tab, setTab] = useState<RoleKey | "all">("all");
  const [q, setQ] = useState("");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: managedUsers.length };
    for (const u of managedUsers) c[u.role] = (c[u.role] ?? 0) + 1;
    return c;
  }, []);

  const filtered = useMemo(() => {
    return managedUsers.filter((u) => {
      const matchRole = tab === "all" || u.role === tab;
      const matchQ = !q || u.name.includes(q) || u.reference.includes(q);
      return matchRole && matchQ;
    });
  }, [tab, q]);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UsersIcon className="h-6 w-6 text-primary" /> مدیریت کاربران
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            مدیریت دسترسی و نقش کاربران مدرسه با حفظ حریم خصوصی.
          </p>
        </div>
        <Button className="rounded-full gap-2" onClick={() => toast.success("افزودن کاربر جدید (نسخه دمو)")}>
          <UserPlus className="h-4 w-4" /> افزودن کاربر
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <div className="flex-1 relative">
            <Search className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="جستجو بر اساس نام یا کلاس..."
              className="pr-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <Button
                key={t.key}
                size="sm"
                variant={tab === t.key ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setTab(t.key)}
              >
                {t.label}
                <Badge variant="secondary" className="ms-2 rounded-md">
                  {(counts[t.key] ?? 0).toLocaleString("fa-IR")}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((u) => (
          <Card key={u.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <CardTitle className="text-base truncate">{u.name}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{u.reference}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => toast.info(`نمایش پروفایل ${u.name}`)}>
                      نمایش پروفایل
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info("ویرایش نقش کاربر (نسخه دمو)")}>
                      ویرایش نقش
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        toast.success(
                          u.status === "active"
                            ? `حساب ${u.name} در حالت استراحت قرار گرفت`
                            : `حساب ${u.name} فعال شد`,
                        )
                      }
                    >
                      {u.status === "active" ? "موقتاً غیرفعال" : "فعال‌سازی"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex items-center justify-between">
              <Badge variant="secondary" className="rounded-lg">
                {roleLabelsFa[u.role]}
              </Badge>
              <Badge
                variant="secondary"
                className={`rounded-lg ${u.status === "active" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}
              >
                {u.status === "active" ? "فعال" : "در استراحت"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-12">
          نتیجه‌ای برای نمایش یافت نشد.
        </p>
      ) : null}
    </div>
  );
}
