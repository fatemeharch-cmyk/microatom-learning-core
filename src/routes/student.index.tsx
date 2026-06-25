import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Trophy,
  FlaskConical,
  ClipboardList,
  HeartPulse,
  Activity,
  Bell,
  CalendarCheck2,
  ScrollText,
  ChevronLeft,
  Microscope,
  Sparkles,
  TrendingUp,
  BookOpen,
  Pill,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ExamRunner } from "@/components/student/exam-runner";

export const Route = createFileRoute("/student/")({
  component: TodayPage,
});

const subjects = [
  { name: "زیست شناسی", value: 90, color: "bg-emerald-500", soft: "bg-emerald-100" },
  { name: "شیمی", value: 83, color: "bg-violet-500", soft: "bg-violet-100" },
  { name: "فیزیک", value: 78, color: "bg-sky-500", soft: "bg-sky-100" },
  { name: "ریاضی", value: 80, color: "bg-orange-500", soft: "bg-orange-100" },
  { name: "زمین شناسی", value: 85, color: "bg-teal-500", soft: "bg-teal-100" },
];

const chartData = [
  { w: "هفته ۱", v: 62 },
  { w: "هفته ۲", v: 68 },
  { w: "هفته ۳", v: 72 },
  { w: "هفته ۴", v: 75 },
  { w: "هفته ۵", v: 82 },
  { w: "هفته ۶", v: 88 },
];

const news = [
  { title: "بروزرسانی پروتکل مطالعه زیست فصل ۲", date: "امروز", color: "bg-violet-500" },
  { title: "هشدار آموزشی: تمرین‌های شیمی فردا تحویل دارند", date: "دیروز", color: "bg-orange-500" },
  { title: "کلینیک یادگیری: تحلیل اشتباهات هفته آماده شد", date: "۲ روز پیش", color: "bg-sky-500" },
];

const upcomingCheckups = [
  { subject: "زیست شناسی", date: "شنبه ۱۰:۰۰", color: "text-emerald-600", soft: "bg-emerald-50" },
  { subject: "شیمی", date: "دوشنبه ۸:۳۰", color: "text-violet-600", soft: "bg-violet-50" },
  { subject: "فیزیک", date: "سه‌شنبه ۹:۰۰", color: "text-sky-600", soft: "bg-sky-50" },
  { subject: "ریاضی", date: "چهارشنبه ۱۱:۰۰", color: "text-orange-600", soft: "bg-orange-50" },
];

const completedPrescriptions = [
  { title: "تمرین فصل ۲ زیست", when: "دیروز" },
  { title: "مسئله‌های شیمی آلی ۱", when: "۲ روز پیش" },
  { title: "آزمون آنلاین فیزیک", when: "۳ روز پیش" },
  { title: "تمرین ریاضی دیفرانسیل", when: "هفته پیش" },
];

function TodayPage() {
  const [examOpen, setExamOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Greeting + Hero */}
      <section className="grid lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 leading-tight">
            سلام <span className="text-violet-600">آرمان</span> عزیز
          </h1>
          <p className="text-slate-500 text-sm md:text-base">
            امروز یک قدم به آینده‌ای که می‌خواهی نزدیک‌تر!
          </p>
          <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            یازدهم تجربی
          </div>
        </div>

        <Card className="border-0 shadow-md shadow-indigo-100/40 rounded-[22px] overflow-hidden bg-gradient-to-br from-violet-100 via-indigo-50 to-sky-100">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="relative h-24 w-24 shrink-0">
              <div className="absolute inset-0 rounded-3xl bg-white/60 backdrop-blur" />
              <div className="relative h-full w-full grid place-items-center">
                <div className="h-16 w-12 rounded-md bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-md absolute right-3 bottom-2 rotate-[-6deg]" />
                <div className="h-14 w-12 rounded-md bg-gradient-to-b from-violet-400 to-violet-600 shadow-md absolute left-3 bottom-3 rotate-[5deg]" />
                <Microscope className="relative h-10 w-10 text-indigo-600 drop-shadow" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-indigo-500 font-medium">امروز یاد بگیر</p>
              <p className="text-base font-bold text-slate-800 leading-snug">
                آزمایشگاه زیست‌شناسی آنلاین
              </p>
              <p className="text-xs text-slate-500 mt-1">
                با نسخه‌ی هوشمند روزانه‌ات شروع کن
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Student profile + Exam start */}
      <section className="grid lg:grid-cols-3 gap-5">
        {/* Profile card */}
        <Card className="lg:col-span-2 border-0 rounded-[22px] shadow-sm bg-white">
          <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-4 ring-violet-100">
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-500 text-white text-xl font-bold">
                  آم
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-1 -left-1 h-6 w-6 rounded-full bg-emerald-500 ring-4 ring-white grid place-items-center">
                <HeartPulse className="h-3 w-3 text-white" />
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-slate-800">آرمان محمدی</h2>
                <Badge className="bg-violet-100 text-violet-700 border-0 rounded-full text-[10px]">
                  یازدهم تجربی
                </Badge>
                <Badge className="bg-gradient-to-l from-slate-200 to-slate-100 text-slate-700 border-0 rounded-full text-[10px]">
                  ★ سطح نقره‌ای
                </Badge>
              </div>
              <div className="mt-3 flex items-end gap-6">
                <div>
                  <p className="text-[11px] text-slate-400">امتیاز سلامت آموزشی</p>
                  <p className="text-2xl font-extrabold text-emerald-600">۸۴۶</p>
                </div>
                <svg viewBox="0 0 120 30" className="h-10 w-44 text-emerald-500">
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="0,20 12,18 18,8 24,22 36,15 48,17 54,4 60,18 72,14 84,16 90,6 96,20 108,12 120,15"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exam start CTA */}
        <Card className="border-0 rounded-[22px] shadow-md shadow-violet-100/60 overflow-hidden bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
          <CardContent className="p-5 flex flex-col h-full justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white/15 grid place-items-center">
                <FlaskConical className="h-6 w-6" />
              </div>
              <div>
                <p className="text-base font-bold">چکاپ زیست شناسی</p>
                <p className="text-xs opacity-90 mt-1 leading-relaxed">
                  یک آزمون کوتاه هوشمند برای سنجش وضعیت یادگیری
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                setExamOpen(true);
                setTimeout(() => {
                  document
                    .getElementById("exam-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }, 60);
              }}
              className="w-full rounded-full bg-white text-violet-700 hover:bg-white/90 font-bold"
            >
              شروع چکاپ
              <ChevronLeft className="h-4 w-4 mr-1" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Metric cards */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <MetricCard
          icon={Trophy}
          tone="amber"
          title="رتبه شما"
          value="۲۱"
          hint="از ۱۳۰ نفر"
        />
        <MetricCard
          icon={Activity}
          tone="violet"
          title="وضعیت کلی"
          value="۸۵٪"
          hint="رشد عالی"
          progress={85}
        />
        <MetricCard
          icon={FlaskConical}
          tone="sky"
          title="ساعات مطالعه"
          value="۳۲"
          hint="ساعت این هفته"
        />
        <MetricCard
          icon={ClipboardList}
          tone="emerald"
          title="چکاپ‌های انجام شده"
          value="۴"
          hint="آزمون"
        />
        <MetricCard
          icon={HeartPulse}
          tone="rose"
          title="سلامت یادگیری"
          value="۹۲٪"
          hint="عالی"
        />
      </section>

      {/* Subjects + Chart */}
      <section className="grid lg:grid-cols-5 gap-5">
        <Card className="lg:col-span-2 border-0 rounded-[22px] shadow-sm bg-white">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-violet-600" />
                وضعیت دروس
              </h3>
              <Badge className="bg-violet-50 text-violet-600 border-0 rounded-full text-[10px]">
                این هفته
              </Badge>
            </div>
            <div className="space-y-4">
              {subjects.map((s) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-slate-700">{s.name}</span>
                    <span className="text-xs font-bold text-slate-500">
                      {toFa(s.value)}٪
                    </span>
                  </div>
                  <div className={`h-2.5 rounded-full ${s.soft} overflow-hidden`}>
                    <div
                      className={`h-full rounded-full ${s.color} transition-all`}
                      style={{ width: `${s.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button
              asChild
              variant="ghost"
              className="w-full rounded-full bg-slate-50 hover:bg-violet-50 text-violet-600 font-semibold"
            >
              <Link to="/student/progress">مشاهده جزئیات دروس</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-0 rounded-[22px] shadow-sm bg-white">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                نمودار پیشرفت
              </h3>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-semibold">
                  <Sparkles className="h-3 w-3" /> رشد پیوسته عالیه!
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-semibold">
                  این ماه ▾
                </span>
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 12, left: 12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#eef0fb" vertical={false} />
                  <XAxis
                    dataKey="w"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    reversed
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={28}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #ede9fe",
                      fontSize: 12,
                    }}
                    formatter={(v: number) => [`${v}٪`, "پیشرفت"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    fill="url(#vGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Bottom three cards */}
      <section className="grid lg:grid-cols-3 gap-5">
        <Card className="border-0 rounded-[22px] shadow-sm bg-white">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Bell className="h-4 w-4 text-violet-600" />
                اخبار و هشدارهای پزشکی آموزشی
              </h3>
            </div>
            <div className="space-y-2">
              {news.map((n) => (
                <div
                  key={n.title}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/70 hover:bg-violet-50/50 transition"
                >
                  <span className={`mt-1.5 h-2 w-2 rounded-full ${n.color} shrink-0`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-700 leading-snug">{n.title}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{n.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 rounded-[22px] shadow-sm bg-white">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <CalendarCheck2 className="h-4 w-4 text-sky-600" />
              چکاپ‌های آینده
            </h3>
            <div className="space-y-2">
              {upcomingCheckups.map((c) => (
                <div
                  key={c.subject}
                  className={`flex items-center justify-between p-3 rounded-2xl ${c.soft}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-8 w-8 rounded-xl bg-white grid place-items-center ${c.color}`}>
                      <HeartPulse className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium text-slate-700">{c.subject}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">{c.date}</span>
                </div>
              ))}
            </div>
            <Button asChild variant="ghost" className="w-full rounded-full bg-slate-50 hover:bg-sky-50 text-sky-600 font-semibold">
              <Link to="/student/exams">مشاهده همه چکاپ‌ها</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 rounded-[22px] shadow-sm bg-white">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <ScrollText className="h-4 w-4 text-emerald-600" />
              نسخه‌های تکمیل شده
            </h3>
            <div className="space-y-2">
              {completedPrescriptions.map((p) => (
                <div
                  key={p.title}
                  className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/60"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-xl bg-white text-emerald-600 grid place-items-center">
                      <Pill className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium text-slate-700">{p.title}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">{p.when}</span>
                </div>
              ))}
            </div>
            <Button asChild variant="ghost" className="w-full rounded-full bg-slate-50 hover:bg-emerald-50 text-emerald-600 font-semibold">
              <Link to="/student/planner">مشاهده همه نسخه‌ها</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Inline exam runner */}
      {examOpen && (
        <section id="exam-section" className="scroll-mt-6">
          <ExamRunner />
        </section>
      )}

      {/* Banner */}
      <section>
        <Card className="border-0 rounded-[22px] overflow-hidden bg-gradient-to-l from-violet-200/70 via-indigo-100 to-emerald-100 shadow-sm">
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="shrink-0 h-24 w-24 md:h-28 md:w-28 rounded-3xl bg-white/70 backdrop-blur grid place-items-center shadow-inner relative">
              <Microscope className="h-12 w-12 text-indigo-600 drop-shadow" />
              <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-emerald-500 text-white grid place-items-center shadow-md">
                <HeartPulse className="h-4 w-4" />
              </span>
            </div>
            <div className="flex-1 text-center md:text-right">
              <p className="text-lg md:text-xl font-extrabold text-slate-800 leading-snug">
                موفقیت مجموعه‌ای از تلاش‌های کوچک تکرارشونده است.
              </p>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                امروز یک قدم کوچک بردار، فردا یک نسخه قوی‌تر برای آینده‌ات بنویس
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

const TONES: Record<
  string,
  { bg: string; icon: string; ring: string; text: string }
> = {
  amber: {
    bg: "bg-amber-50",
    icon: "bg-gradient-to-br from-amber-400 to-orange-500 text-white",
    ring: "ring-amber-100",
    text: "text-amber-700",
  },
  violet: {
    bg: "bg-violet-50",
    icon: "bg-gradient-to-br from-violet-500 to-indigo-500 text-white",
    ring: "ring-violet-100",
    text: "text-violet-700",
  },
  sky: {
    bg: "bg-sky-50",
    icon: "bg-gradient-to-br from-sky-400 to-blue-500 text-white",
    ring: "ring-sky-100",
    text: "text-sky-700",
  },
  emerald: {
    bg: "bg-emerald-50",
    icon: "bg-gradient-to-br from-emerald-400 to-teal-500 text-white",
    ring: "ring-emerald-100",
    text: "text-emerald-700",
  },
  rose: {
    bg: "bg-rose-50",
    icon: "bg-gradient-to-br from-rose-400 to-pink-500 text-white",
    ring: "ring-rose-100",
    text: "text-rose-700",
  },
};

function MetricCard({
  icon: Icon,
  tone,
  title,
  value,
  hint,
  progress,
}: {
  icon: React.ElementType;
  tone: keyof typeof TONES | string;
  title: string;
  value: string;
  hint: string;
  progress?: number;
}) {
  const t = TONES[tone] ?? TONES.violet;
  return (
    <Card className={`border-0 rounded-[22px] shadow-sm ring-1 ${t.ring} bg-white`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className={`h-11 w-11 rounded-2xl grid place-items-center shadow-md ${t.icon}`}>
            <Icon className="h-5 w-5" />
          </div>
          {typeof progress === "number" && (
            <div className="relative h-11 w-11">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#ede9fe" strokeWidth="3.5" />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray={`${(progress / 100) * 94.2} 94.2`}
                />
              </svg>
              <span className="absolute inset-0 grid place-items-center text-[10px] font-bold text-violet-600">
                {toFa(progress)}
              </span>
            </div>
          )}
        </div>
        <div>
          <p className="text-[11px] text-slate-400">{title}</p>
          <p className={`text-xl font-extrabold mt-0.5 ${t.text}`}>{value}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function toFa(n: number | string): string {
  const map: Record<string, string> = {
    "0": "۰", "1": "۱", "2": "۲", "3": "۳", "4": "۴",
    "5": "۵", "6": "۶", "7": "۷", "8": "۸", "9": "۹",
  };
  return String(n).replace(/[0-9]/g, (d) => map[d] ?? d);
}
