import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ClipboardList, CheckCircle2, Clock, BookOpen } from "lucide-react";
import { classRegistration, teacherActivity } from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/registration")({
  component: AdminRegistration,
});

const statusMeta: Record<string, { label: string; tone: string; icon: React.ReactNode }> = {
  held: { label: "برگزار شده", tone: "bg-info/10 text-info", icon: <BookOpen className="h-3.5 w-3.5" /> },
  logged: { label: "ثبت کامل", tone: "bg-success/15 text-success", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  open: { label: "آماده ثبت", tone: "bg-primary/10 text-primary", icon: <Clock className="h-3.5 w-3.5" /> },
};

function AdminRegistration() {
  const totals = {
    held: classRegistration.filter((c) => c.status === "held").length,
    logged: classRegistration.filter((c) => c.status === "logged").length,
    open: classRegistration.filter((c) => c.status === "open").length,
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-primary" /> وضعیت ثبت کلاس‌ها
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          نمای زنده از کلاس‌های امروز و وضعیت ثبت گزارش‌ها.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="کلاس‌های برگزار شده" value={totals.held} tone="text-info" />
        <StatCard label="گزارش‌های ثبت‌شده" value={totals.logged} tone="text-success" />
        <StatCard label="آماده ثبت" value={totals.open} tone="text-primary" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">کلاس‌های امروز</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {classRegistration.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/40 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Badge variant="secondary" className="rounded-lg shrink-0">{c.time}</Badge>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{c.classroom}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {c.subject} • {c.teacher}
                  </p>
                </div>
              </div>
              <Badge className={`rounded-lg gap-1 ${statusMeta[c.status].tone}`} variant="secondary">
                {statusMeta[c.status].icon}
                {statusMeta[c.status].label}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">میزان ثبت گزارش توسط دبیران</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {teacherActivity.map((t) => {
            const pct = Math.round((t.logsCompleted / t.logsExpected) * 100);
            return (
              <div key={t.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{t.name}</span>
                  <span className="text-muted-foreground">
                    {t.logsCompleted.toLocaleString("fa-IR")} از {t.logsExpected.toLocaleString("fa-IR")} • {pct}%
                  </span>
                </div>
                <Progress value={pct} />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-2xl font-bold mt-2 ${tone}`}>{value.toLocaleString("fa-IR")}</p>
      </CardContent>
    </Card>
  );
}
