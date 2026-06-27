import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  FileText,
  Download,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/supervisor/analytics")({
  component: ReportsPage,
});

const summary = [
  { label: "گزارش‌های این هفته", value: "۱۴", icon: FileText, tint: "bg-sky-50 text-sky-600" },
  { label: "کلاس‌های بررسی‌شده", value: "۴", icon: GraduationCap, tint: "bg-violet-50 text-violet-600" },
  { label: "میانگین رشد پایه", value: "۷۸٪", icon: TrendingUp, tint: "bg-emerald-50 text-emerald-600" },
  { label: "هشدارهای مهم", value: "۶", icon: AlertTriangle, tint: "bg-rose-50 text-rose-600" },
];

type ReportStatus = "آماده" | "نیازمند بررسی" | "در حال تکمیل" | "مهم";

const statusCls: Record<ReportStatus, string> = {
  "آماده": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "نیازمند بررسی": "bg-amber-50 text-amber-700 border-amber-200",
  "در حال تکمیل": "bg-sky-50 text-sky-700 border-sky-200",
  "مهم": "bg-rose-50 text-rose-700 border-rose-200",
};

const reports: Array<{ title: string; type: string; status: ReportStatus }> = [
  { title: "گزارش رشد پایه یازدهم تجربی", type: "هفتگی", status: "آماده" },
  { title: "تحلیل چکاب زیست", type: "آموزشی", status: "نیازمند بررسی" },
  { title: "گزارش همراهی دبیران", type: "مدیریتی", status: "آماده" },
  { title: "گزارش ارتباط با اولیا", type: "خانواده", status: "در حال تکمیل" },
  { title: "تحلیل ضعف مشترک کلاس‌ها", type: "تشخیصی", status: "مهم" },
];

function ReportsPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" /> گزارش‌ها
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          گزارش‌های پایه، کلاس‌ها، چکاب‌ها و روند رشد
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summary.map((s) => (
          <Card key={s.label} className="rounded-2xl border-0 shadow-sm bg-white">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${s.tint}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className="text-xl font-bold">{s.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl border-0 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-base">فهرست گزارش‌ها</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {reports.map((r) => (
            <div
              key={r.title}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium truncate">{r.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">نوع: {r.type}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`rounded-full ${statusCls[r.status]}`}>
                  {r.status}
                </Badge>
                <Button size="sm" variant="outline" className="rounded-full gap-1">
                  <FileText className="h-4 w-4" /> مشاهده گزارش
                </Button>
                <Button size="sm" className="rounded-full gap-1">
                  <Download className="h-4 w-4" /> دانلود PDF
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
