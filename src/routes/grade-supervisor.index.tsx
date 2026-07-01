import { createFileRoute, Link } from "@tanstack/react-router";
import {
  HeartPulse,
  Users,
  TriangleAlert,
  Stethoscope,
  CalendarDays,
  ChevronLeft,
  Activity,
  Clock,
} from "lucide-react";
import { STUDENTS, STATUS_META } from "@/lib/mock/grade-students";

export const Route = createFileRoute("/grade-supervisor/")({
  component: GradeDashboard,
});

const summary = [
  { key: "health", label: "سلامت آموزشی پایه", value: "۷۸٪", sub: "روند هفتگی +۴٪", icon: HeartPulse, color: "from-rose-100 to-pink-100", text: "text-rose-600" },
  { key: "count", label: "تعداد دانش‌آموزان", value: "۱۲۸", sub: "۴ کلاس فعال", icon: Users, color: "from-violet-100 to-indigo-100", text: "text-violet-600" },
  { key: "alerts", label: "هشدارهای ریسک", value: "۶", sub: "نیازمند پیگیری امروز", icon: TriangleAlert, color: "from-amber-100 to-orange-100", text: "text-amber-600" },
  { key: "checkups", label: "چکاب‌های اخیر", value: "۲۴", sub: "هفت روز گذشته", icon: Stethoscope, color: "from-teal-100 to-emerald-100", text: "text-teal-600" },
];

const checkups = [
  { name: "آوا یوسفی", subject: "زیست — ژنتیک", score: 92, date: "۳۰ مهر" },
  { name: "ملینا حسینی", subject: "شیمی — استوکیومتری", score: 88, date: "۲۸ مهر" },
  { name: "پارسا کریمی", subject: "فیزیک — حرکت‌شناسی", score: 74, date: "۲۷ مهر" },
  { name: "نیکا رضایی", subject: "زیست — تنفس سلولی", score: 67, date: "۲۶ مهر" },
];

const appointments = [
  { time: "۰۹:۰۰", with: "آرمان محمدی", topic: "بررسی روند مطالعه زیست" },
  { time: "۱۰:۳۰", with: "اولیای نیکا رضایی", topic: "گزارش پیشرفت ماهانه" },
  { time: "۱۲:۰۰", with: "دبیر شیمی", topic: "هماهنگی نسخه تقویتی" },
  { time: "۱۴:۳۰", with: "هلیا مرادی", topic: "ویزیت هفتگی" },
];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-3xl shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] border border-slate-100 ${className}`}>
      {children}
    </div>
  );
}

function GradeDashboard() {
  const followups = STUDENTS.filter((s) => s.status === "risk" || s.status === "warning").slice(0, 5);

  return (
    <div dir="rtl" className="font-vazir space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">داشبورد پایه یازدهم تجربی</h1>
          <p className="text-sm text-slate-500 mt-1">نمای کلی سلامت آموزشی، چکاب‌ها و قرارهای امروز</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/grade-supervisor/chapter1-monitoring"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-2xl bg-white border border-violet-200 text-violet-700 text-xs font-semibold shadow-sm hover:bg-violet-50 transition"
          >
            پایش فصل اول زیست
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <Link
            to="/grade-supervisor/students"
            className="hidden md:inline-flex items-center gap-1.5 h-10 px-4 rounded-2xl bg-violet-600 text-white text-xs font-semibold shadow-sm hover:bg-violet-700 transition"
          >
            مدیریت دانش‌آموزان
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.map((s) => (
          <Card key={s.key} className="p-5">
            <div className="flex items-start justify-between">
              <div className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${s.color} grid place-items-center ${s.text}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] text-slate-400">{s.sub}</span>
            </div>
            <p className="text-2xl font-extrabold text-slate-800 mt-4">{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent checkups */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-teal-600" />
              <h2 className="text-sm font-bold text-slate-800">چکاب‌های اخیر</h2>
            </div>
            <span className="text-[11px] text-slate-400">هفت روز گذشته</span>
          </div>
          <div className="divide-y divide-slate-100">
            {checkups.map((c) => (
              <div key={c.name} className="flex items-center gap-3 py-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-teal-100 to-emerald-100 grid place-items-center text-teal-600">
                  <Activity className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{c.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{c.subject}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm font-extrabold text-slate-800">{toFa(c.score)}</p>
                  <p className="text-[10px] text-slate-400">{c.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Today appointments */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-violet-600" />
              <h2 className="text-sm font-bold text-slate-800">قرارهای امروز</h2>
            </div>
            <span className="text-[11px] text-slate-400">۴ مورد</span>
          </div>
          <div className="space-y-3">
            {appointments.map((a) => (
              <div key={a.time} className="flex items-start gap-3 p-3 rounded-2xl bg-violet-50/60">
                <div className="h-8 px-2 rounded-lg bg-white text-violet-700 grid place-items-center text-[11px] font-bold border border-violet-100 shrink-0">
                  <Clock className="h-3 w-3 inline-block ml-1" />
                  {a.time}
                </div>
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-xs font-semibold text-slate-800 truncate">{a.with}</p>
                  <p className="text-[11px] text-slate-500 truncate">{a.topic}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Followups */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TriangleAlert className="h-4 w-4 text-rose-600" />
            <h2 className="text-sm font-bold text-slate-800">دانش‌آموزان نیازمند پیگیری</h2>
          </div>
          <Link to="/grade-supervisor/students" className="text-[11px] text-violet-600 font-semibold hover:underline">
            مشاهده همه
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {followups.map((s) => {
            const meta = STATUS_META[s.status];
            return (
              <Link
                key={s.id}
                to="/grade-supervisor/students/$id"
                params={{ id: s.id }}
                className="group flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:border-violet-200 hover:shadow-sm transition bg-white"
              >
                <div className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${s.avatarColor} grid place-items-center text-slate-700 font-bold text-sm`}>
                  {s.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{s.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{s.className}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${meta.pill}`}>{meta.label}</span>
                  <span className="text-[10px] text-slate-400">سلامت {toFa(s.healthScore)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function toFa(n: number) {
  return n.toLocaleString("fa-IR");
}
