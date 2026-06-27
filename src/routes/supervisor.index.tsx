import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HeartPulse,
  Stethoscope,
  ScrollText,
  CalendarDays,
  TriangleAlert,
  Activity,
  Sparkles,
  ChevronLeft,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export const Route = createFileRoute("/supervisor/")({
  component: SupervisorDashboard,
});

const subjectHealth = [
  { name: "زیست", value: 91 },
  { name: "شیمی", value: 88 },
  { name: "زمین", value: 85 },
  { name: "فیزیک", value: 74 },
  { name: "ریاضی", value: 70 },
];

const statusDist = [
  { name: "عالی", value: 38, color: "#8b5cf6" },
  { name: "خوب", value: 42, color: "#a78bfa" },
  { name: "متوسط", value: 18, color: "#f0abfc" },
  { name: "نیازمند توجه", value: 12, color: "#fb7185" },
];

const followUps = [
  {
    name: "سارا احمدی",
    reason: "افت نبض دانش در فیزیک طی دو هفته اخیر",
    priority: "بحرانی",
    tone: "bg-rose-50 text-rose-700 border-rose-100",
  },
  {
    name: "آرمان رضایی",
    reason: "عدم اجرای دو نسخه پیاپی در درس ریاضی",
    priority: "مهم",
    tone: "bg-amber-50 text-amber-700 border-amber-100",
  },
  {
    name: "نرگس محمدی",
    reason: "غیبت در آخرین چکاب زیست‌شناسی",
    priority: "متوسط",
    tone: "bg-sky-50 text-sky-700 border-sky-100",
  },
];

const studentsTable = [
  { name: "سارا احمدی", cls: "۱۱ تجربی ۱", pulse: 68, checkup: "۲ روز پیش", rx: "تقویت فیزیک", missions: "۳ فعال", status: "نیازمند توجه", color: "text-rose-600 bg-rose-50" },
  { name: "آرمان رضایی", cls: "۱۱ تجربی ۲", pulse: 74, checkup: "۱ روز پیش", rx: "مرور ریاضی", missions: "۲ فعال", status: "متوسط", color: "text-amber-600 bg-amber-50" },
  { name: "نرگس محمدی", cls: "۱۱ تجربی ۱", pulse: 82, checkup: "امروز", rx: "تمرکز روی زیست", missions: "۴ فعال", status: "خوب", color: "text-violet-600 bg-violet-50" },
  { name: "محمد کریمی", cls: "۱۱ تجربی ۳", pulse: 93, checkup: "امروز", rx: "حفظ روند", missions: "۲ فعال", status: "عالی", color: "text-emerald-600 bg-emerald-50" },
  { name: "زهرا موسوی", cls: "۱۱ تجربی ۲", pulse: 88, checkup: "دیروز", rx: "شیمی مرحله ۲", missions: "۳ فعال", status: "خوب", color: "text-violet-600 bg-violet-50" },
];

const appointments = [
  { time: "۰۹:۳۰", title: "جلسه با والد سارا احمدی" },
  { time: "۱۱:۰۰", title: "ویزیت آرمان رضایی" },
  { time: "۱۳:۰۰", title: "هماهنگی با دبیر فیزیک" },
  { time: "۱۵:۳۰", title: "جلسه گروهی نسخه‌های ریاضی" },
];

function Metric({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: typeof HeartPulse;
  label: string;
  value: string;
  hint?: string;
  tone: string;
}) {
  return (
    <Card className="rounded-2xl border-slate-100 shadow-sm bg-white">
      <CardContent className="p-4 flex items-center gap-3" dir="rtl">
        <div className={`h-11 w-11 rounded-2xl grid place-items-center ${tone}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 text-right">
          <p className="text-[11px] text-slate-500">{label}</p>
          <p className="text-lg font-extrabold text-slate-800 leading-tight">{value}</p>
          {hint && <p className="text-[10px] text-slate-400 mt-0.5">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function SupervisorDashboard() {
  return (
    <div className="space-y-5" dir="rtl">
      {/* Greeting */}
      <Card className="rounded-3xl border-0 shadow-sm bg-white">
        <CardContent className="p-6 md:p-7 flex flex-col md:flex-row md:items-center gap-4 text-right">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-800">
              سلام خانم افرند 👋
            </h1>
            <p className="text-sm text-slate-500 mt-1">مسئول پایه یازدهم تجربی</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="rounded-full bg-violet-50 text-violet-700 border-0 px-3 py-1">
              <Sparkles className="h-3 w-3 ml-1" /> پایش هوشمند فعال
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Metric row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <Metric icon={HeartPulse} label="سلامت آموزشی پایه" value="۹۱٪" tone="bg-violet-50 text-violet-600" />
        <Metric icon={Activity} label="میانگین نبض دانش" value="۸۷٪" tone="bg-pink-50 text-pink-600" />
        <Metric icon={Stethoscope} label="چکاب‌های امروز" value="۱۸" tone="bg-emerald-50 text-emerald-600" />
        <Metric icon={ScrollText} label="نسخه‌های اجرا نشده" value="۱۲" tone="bg-amber-50 text-amber-600" />
        <Metric icon={CalendarDays} label="قرار ملاقات‌های امروز" value="۴" tone="bg-sky-50 text-sky-600" />
        <Metric icon={TriangleAlert} label="هشدارهای امروز" value="۵" tone="bg-rose-50 text-rose-600" />
      </div>

      {/* Follow-up priorities */}
      <Card className="rounded-3xl border-slate-100 shadow-sm bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-500" />
            اولویت‌های پیگیری با پیشنهاد هوش مصنوعی
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {followUps.map((f) => (
            <div
              key={f.name}
              className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-2xl bg-slate-50/60"
            >
              <div className="flex-1 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Badge className={`rounded-full border ${f.tone}`}>{f.priority}</Badge>
                  <p className="text-sm font-bold text-slate-800">{f.name}</p>
                </div>
                <p className="text-xs text-slate-500 mt-1">{f.reason}</p>
              </div>
              <Button
                size="sm"
                className="rounded-full bg-violet-600 hover:bg-violet-700 text-white"
              >
                باز کردن پرونده
                <ChevronLeft className="h-3 w-3 mr-1" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="rounded-3xl border-slate-100 shadow-sm bg-white lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-800">
              سلامت دروس پایه یازدهم تجربی
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectHealth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip cursor={{ fill: "#f5f3ff" }} contentStyle={{ borderRadius: 12, border: "1px solid #ede9fe" }} />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#a78bfa" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-100 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-800">
              وضعیت کلی دانش‌آموزان
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDist}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {statusDist.map((s) => (
                      <Cell key={s.name} fill={s.color} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: 11, color: "#475569" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students table + appointments */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="rounded-3xl border-slate-100 shadow-sm bg-white lg:col-span-2 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-800">
              آخرین وضعیت دانش‌آموزان
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="text-slate-500">
                  <th className="font-medium py-2 px-2">دانش‌آموز</th>
                  <th className="font-medium py-2 px-2">کلاس</th>
                  <th className="font-medium py-2 px-2">نبض دانش</th>
                  <th className="font-medium py-2 px-2">آخرین چکاب</th>
                  <th className="font-medium py-2 px-2">نسخه فعال</th>
                  <th className="font-medium py-2 px-2">ماموریت‌ها</th>
                  <th className="font-medium py-2 px-2">وضعیت کلی</th>
                  <th className="font-medium py-2 px-2">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {studentsTable.map((s) => (
                  <tr key={s.name} className="border-t border-slate-100">
                    <td className="py-2 px-2 font-semibold text-slate-800">{s.name}</td>
                    <td className="py-2 px-2 text-slate-500">{s.cls}</td>
                    <td className="py-2 px-2 text-slate-700">{s.pulse}٪</td>
                    <td className="py-2 px-2 text-slate-500">{s.checkup}</td>
                    <td className="py-2 px-2 text-slate-500">{s.rx}</td>
                    <td className="py-2 px-2 text-slate-500">{s.missions}</td>
                    <td className="py-2 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.color}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      <Button size="sm" variant="ghost" className="h-7 text-violet-600 hover:bg-violet-50 rounded-full">
                        مشاهده
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-100 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-violet-500" />
              قرار ملاقات‌های امروز
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {appointments.map((a) => (
              <div key={a.time} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/60">
                <div className="h-10 w-10 rounded-2xl bg-violet-50 grid place-items-center text-violet-600 shrink-0">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="flex-1 text-right">
                  <p className="text-sm font-semibold text-slate-800">{a.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">ساعت {a.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
