import { useRef, useState } from "react";
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
  FileDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

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

const growthData = [
  { label: "هفته ۱", value: 64 },
  { label: "هفته ۲", value: 68 },
  { label: "هفته ۳", value: 71 },
  { label: "هفته ۴", value: 76 },
  { label: "هفته ۵", value: 78 },
  { label: "هفته ۶", value: 81 },
];

const classData = [
  { label: "یازدهم تجربی ۱", value: 82 },
  { label: "یازدهم تجربی ۲", value: 74 },
  { label: "یازدهم تجربی ۳", value: 80 },
  { label: "یازدهم تجربی ۴", value: 69 },
];

const weaknessData = [
  { label: "زیست", value: 35 },
  { label: "شیمی", value: 25 },
  { label: "فیزیک", value: 20 },
  { label: "ریاضی", value: 20 },
];

const checkupData = [
  { label: "انجام‌شده", value: 72 },
  { label: "ناتمام", value: 18 },
  { label: "انجام‌نشده", value: 10 },
];

const alertsData = [
  { label: "مهم", value: 6 },
  { label: "متوسط", value: 12 },
  { label: "سبک", value: 18 },
];

const PASTEL = ["#7dd3fc", "#c4b5fd", "#86efac", "#fda4af", "#fcd34d", "#a5b4fc"];
const CHECKUP_COLORS = ["#86efac", "#fcd34d", "#fda4af"];
const ALERT_COLORS = ["#fda4af", "#fcd34d", "#86efac"];

function getJalaliToday(): string {
  try {
    const fmt = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return fmt.format(new Date());
  } catch {
    return "";
  }
}

function ReportsPage() {
  const exportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const today = getJalaliToday();

  const handleExport = async () => {
    if (!exportRef.current) return;
    setExporting(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save("atomia-grade-report.pdf");
    } catch (e) {
      console.error("PDF export failed", e);
      window.print();
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" /> گزارش‌ها
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            گزارش‌های پایه، کلاس‌ها، چکاب‌ها و روند رشد
          </p>
          {today && (
            <p className="text-xs text-muted-foreground mt-1">تاریخ گزارش: {today}</p>
          )}
        </div>
        <Button onClick={handleExport} disabled={exporting} className="rounded-full gap-2">
          <FileDown className="h-4 w-4" />
          {exporting ? "در حال آماده‌سازی..." : "دانلود گزارش PDF"}
        </Button>
      </div>

      <div ref={exportRef} className="space-y-6 bg-white p-2">
        <div className="px-2 pt-2">
          <h2 className="text-xl font-bold">گزارش تحلیلی پایه یازدهم تجربی</h2>
          {today && <p className="text-xs text-muted-foreground mt-1">{today}</p>}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="rounded-2xl border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-base">روند رشد پایه در ۶ هفته اخیر</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#64748b" }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#64748b" }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="رشد"
                      stroke="#7dd3fc"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#0ea5e9" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-base">مقایسه رشد کلاس‌ها</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#64748b" }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
                    />
                    <Bar dataKey="value" name="رشد" radius={[8, 8, 0, 0]}>
                      {classData.map((_, i) => (
                        <Cell key={i} fill={PASTEL[i % PASTEL.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-base">توزیع ضعف‌های پرتکرار</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Pie
                      data={weaknessData}
                      dataKey="value"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {weaknessData.map((_, i) => (
                        <Cell key={i} fill={PASTEL[i % PASTEL.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-base">میزان انجام چکاب‌ها</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Pie
                      data={checkupData}
                      dataKey="value"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      label={(entry) => `${entry.value}٪`}
                    >
                      {checkupData.map((_, i) => (
                        <Cell key={i} fill={CHECKUP_COLORS[i]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-sm bg-white lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">هشدارها بر اساس اولویت</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={alertsData}
                    layout="vertical"
                    margin={{ top: 8, right: 24, left: 24, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" tick={{ fontSize: 12, fill: "#64748b" }} />
                    <YAxis
                      type="category"
                      dataKey="label"
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      width={70}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
                    />
                    <Bar dataKey="value" name="تعداد" radius={[0, 8, 8, 0]}>
                      {alertsData.map((_, i) => (
                        <Cell key={i} fill={ALERT_COLORS[i]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
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
    </div>
  );
}
