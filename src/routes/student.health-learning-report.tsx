import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Sparkles,
  Trophy,
  TrendingUp,
  ShieldAlert,
  ClipboardList,
  Bot,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Stethoscope,
  Target,
  NotebookPen,
  HeartPulse,
} from "lucide-react";

export const Route = createFileRoute("/student/health-learning-report")({
  head: () => ({
    meta: [
      { title: "پرونده سلامت یادگیری — آتومیا" },
      {
        name: "description",
        content: "تحلیل جامع روند رشد و وضعیت یادگیری دانش‌آموز.",
      },
    ],
  }),
  component: HealthLearningReportPage,
});

function toFa(n: number | string): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const HEALTH_SCORE = 76;

const TREND_DATA = {
  weekly: [
    { label: "شنبه", value: 62 },
    { label: "یکشنبه", value: 65 },
    { label: "دوشنبه", value: 70 },
    { label: "سه‌شنبه", value: 68 },
    { label: "چهارشنبه", value: 74 },
    { label: "پنجشنبه", value: 78 },
    { label: "جمعه", value: 76 },
  ],
  monthly: [
    { label: "هفته ۱", value: 58 },
    { label: "هفته ۲", value: 64 },
    { label: "هفته ۳", value: 70 },
    { label: "هفته ۴", value: 76 },
  ],
  quarterly: [
    { label: "فروردین", value: 52 },
    { label: "اردیبهشت", value: 60 },
    { label: "خرداد", value: 68 },
    { label: "تیر", value: 76 },
  ],
};

const SUBJECTS = [
  { name: "زیست", value: 82, color: "bg-emerald-500", track: "bg-emerald-100" },
  { name: "شیمی", value: 74, color: "bg-sky-500", track: "bg-sky-100" },
  { name: "ریاضی", value: 65, color: "bg-violet-500", track: "bg-violet-100" },
  { name: "فیزیک", value: 61, color: "bg-amber-500", track: "bg-amber-100" },
  { name: "ادبیات", value: 88, color: "bg-pink-500", track: "bg-pink-100" },
];

type LessonStatus = "ok" | "warn" | "bad";
const LESSON_ICON: Record<LessonStatus, JSX.Element> = {
  ok: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  warn: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  bad: <XCircle className="h-4 w-4 text-rose-500" />,
};

const CHAPTERS = [
  {
    subject: "زیست‌شناسی",
    items: [
      {
        chapter: "فصل ۱ — یاخته و بافت",
        lessons: [
          { title: "گفتار ۱", status: "ok" as LessonStatus },
          { title: "گفتار ۲", status: "warn" as LessonStatus },
          { title: "گفتار ۳", status: "bad" as LessonStatus },
        ],
      },
      {
        chapter: "فصل ۲ — دستگاه گوارش",
        lessons: [
          { title: "گفتار ۱", status: "ok" as LessonStatus },
          { title: "گفتار ۲", status: "ok" as LessonStatus },
          { title: "گفتار ۳", status: "warn" as LessonStatus },
        ],
      },
    ],
  },
  {
    subject: "شیمی",
    items: [
      {
        chapter: "فصل ۱ — استوکیومتری",
        lessons: [
          { title: "گفتار ۱", status: "ok" as LessonStatus },
          { title: "گفتار ۲", status: "warn" as LessonStatus },
        ],
      },
    ],
  },
];

const STRENGTHS = ["ژنتیک", "سلول", "تنفس سلولی", "قوانین نیوتون"];
const WEAKNESSES = ["انتقال عصبی", "بافت عصبی", "دستگاه عصبی", "معادلات درجه دو"];

const LAST_REPORT = {
  name: "کاوش زیست‌شناسی — گفتار ۲",
  percent: 86,
  correct: 18,
  wrong: 5,
  blank: 2,
  time: "۱۴ دقیقه",
};

const TIMELINE = [
  {
    period: "امروز",
    events: [
      { title: "شرح حال ثبت شد", icon: Stethoscope, tone: "violet" },
      { title: "چکاپ روزانه انجام شد", icon: HeartPulse, tone: "emerald" },
    ],
  },
  {
    period: "دیروز",
    events: [
      { title: "کاوش زیست‌شناسی گفتار ۲", icon: NotebookPen, tone: "sky" },
      { title: "ماموریت روزانه کامل شد", icon: Target, tone: "amber" },
    ],
  },
  {
    period: "این هفته",
    events: [
      { title: "۵ روز پیاپی مطالعه", icon: Sparkles, tone: "pink" },
      { title: "بهبود ۶٪ در روند سلامت", icon: TrendingUp, tone: "emerald" },
    ],
  },
  {
    period: "این ماه",
    events: [
      { title: "۳ کاوش تکمیل شد", icon: NotebookPen, tone: "violet" },
      { title: "پیشرفت در شیمی و زیست", icon: Trophy, tone: "amber" },
    ],
  },
];

const TONE_MAP: Record<string, string> = {
  violet: "bg-violet-100 text-violet-600",
  emerald: "bg-emerald-100 text-emerald-600",
  sky: "bg-sky-100 text-sky-600",
  amber: "bg-amber-100 text-amber-600",
  pink: "bg-pink-100 text-pink-600",
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function HealthLearningReportPage() {
  const [range, setRange] = useState<"weekly" | "monthly" | "quarterly">(
    "weekly",
  );
  const chartData = TREND_DATA[range];

  return (
    <div className="pb-10 space-y-6 animate-fade-in" dir="rtl">
      {/* SECTION 1 — Hero */}
      <HeroSection score={HEALTH_SCORE} />

      {/* SECTION 2 — Trend */}
      <Card className="rounded-3xl border-slate-100 shadow-sm">
        <CardContent className="p-5 md:p-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="h-9 w-9 rounded-2xl bg-violet-100 text-violet-600 grid place-items-center">
                <TrendingUp className="h-4 w-4" />
              </span>
              <h2 className="text-base md:text-lg font-extrabold text-slate-800">
                روند سلامت یادگیری
              </h2>
            </div>
            <Tabs value={range} onValueChange={(v) => setRange(v as typeof range)}>
              <TabsList className="rounded-full bg-slate-100">
                <TabsTrigger value="weekly" className="rounded-full text-xs">هفتگی</TabsTrigger>
                <TabsTrigger value="monthly" className="rounded-full text-xs">ماهانه</TabsTrigger>
                <TabsTrigger value="quarterly" className="rounded-full text-xs">سه ماه اخیر</TabsTrigger>
              </TabsList>
              <TabsContent value={range} />
            </Tabs>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 16, bottom: 8, left: 0 }}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2ff" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [`${toFa(v)}٪`, "شاخص"]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="url(#lineGrad)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 0 }}
                  activeDot={{ r: 6, stroke: "#8b5cf6", strokeWidth: 2, fill: "#fff" }}
                  animationDuration={900}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3 — Subjects */}
      <Card className="rounded-3xl border-slate-100 shadow-sm">
        <CardContent className="p-5 md:p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="h-9 w-9 rounded-2xl bg-pink-100 text-pink-600 grid place-items-center">
              <ClipboardList className="h-4 w-4" />
            </span>
            <h2 className="text-base md:text-lg font-extrabold text-slate-800">
              عملکرد دروس
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SUBJECTS.map((s, i) => (
              <div
                key={s.name}
                className="rounded-2xl bg-slate-50 border border-slate-100 p-4 animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-slate-800">{s.name}</span>
                  <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                    {toFa(s.value)}٪
                  </span>
                </div>
                <div className={`h-2 rounded-full ${s.track} overflow-hidden`}>
                  <div
                    className={`h-full ${s.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${s.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SECTION 4 — Chapters */}
      <Card className="rounded-3xl border-slate-100 shadow-sm">
        <CardContent className="p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-9 w-9 rounded-2xl bg-violet-100 text-violet-600 grid place-items-center">
              <NotebookPen className="h-4 w-4" />
            </span>
            <h2 className="text-base md:text-lg font-extrabold text-slate-800">
              وضعیت فصل‌ها
            </h2>
          </div>
          <div className="space-y-5">
            {CHAPTERS.map((group) => (
              <div key={group.subject}>
                <h3 className="text-sm font-bold text-slate-700 mb-2">
                  {group.subject}
                </h3>
                <Accordion type="multiple" className="space-y-2">
                  {group.items.map((ch, idx) => (
                    <AccordionItem
                      key={ch.chapter}
                      value={`${group.subject}-${idx}`}
                      className="border border-slate-100 rounded-2xl px-4 bg-slate-50/50"
                    >
                      <AccordionTrigger className="text-sm font-semibold text-slate-800 hover:no-underline">
                        {ch.chapter}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pt-1">
                          {ch.lessons.map((l) => (
                            <li
                              key={l.title}
                              className="flex items-center gap-2 text-sm text-slate-700"
                            >
                              {LESSON_ICON[l.status]}
                              <span>{l.title}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SECTION 5 + 6 — Strengths & Weaknesses */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-3xl border-emerald-100 bg-emerald-50/60 shadow-sm animate-fade-in">
          <CardContent className="p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-9 w-9 rounded-2xl bg-emerald-100 text-emerald-600 grid place-items-center">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <h2 className="text-base font-extrabold text-emerald-800">نقاط قوت</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {STRENGTHS.map((t) => (
                <Badge
                  key={t}
                  className="rounded-full bg-white text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-semibold hover:bg-white"
                >
                  ✔ {t}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-amber-100 bg-amber-50/60 shadow-sm animate-fade-in">
          <CardContent className="p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-9 w-9 rounded-2xl bg-amber-100 text-amber-600 grid place-items-center">
                <ShieldAlert className="h-4 w-4" />
              </span>
              <h2 className="text-base font-extrabold text-amber-800">نیازمند تقویت</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {WEAKNESSES.map((t) => (
                <Badge
                  key={t}
                  className="rounded-full bg-white text-amber-700 border border-amber-200 px-3 py-1 text-xs font-semibold hover:bg-white"
                >
                  ⚠ {t}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 7 — Last diagnostic */}
      <Card className="rounded-3xl border-slate-100 shadow-sm">
        <CardContent className="p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-9 w-9 rounded-2xl bg-sky-100 text-sky-600 grid place-items-center">
              <Stethoscope className="h-4 w-4" />
            </span>
            <h2 className="text-base md:text-lg font-extrabold text-slate-800">
              آخرین گزارش تشخیصی
            </h2>
          </div>
          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
            <p className="text-sm font-bold text-slate-800 mb-3">{LAST_REPORT.name}</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <ReportStat label="درصد" value={`${toFa(LAST_REPORT.percent)}٪`} tone="violet" />
              <ReportStat label="درست" value={toFa(LAST_REPORT.correct)} tone="emerald" />
              <ReportStat label="غلط" value={toFa(LAST_REPORT.wrong)} tone="rose" />
              <ReportStat label="نزده" value={toFa(LAST_REPORT.blank)} tone="slate" />
              <ReportStat label="زمان" value={LAST_REPORT.time} tone="sky" />
            </div>
            <div className="mt-4 flex justify-end">
              <Button className="rounded-full bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 h-9">
                مشاهده تحلیل کامل
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 8 — AI prescription */}
      <Card className="rounded-3xl border-0 shadow-lg bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-500 text-white overflow-hidden animate-fade-in">
        <CardContent className="p-5 md:p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-9 w-9 rounded-2xl bg-white/20 grid place-items-center">
              <Bot className="h-4 w-4" />
            </span>
            <h2 className="text-base md:text-lg font-extrabold">
              نسخه پیشنهادی آتومیا
            </h2>
            <Sparkles className="h-4 w-4 text-amber-200" />
          </div>
          <p className="text-sm leading-7 text-white/95 mb-3">
            بر اساس عملکرد شما پیشنهاد می‌شود:
          </p>
          <ul className="space-y-2 text-sm text-white/95 mb-4">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
              یک کاوش از گفتار ۲
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
              یک چکاپ روزانه
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
              مرور دستگاه عصبی
            </li>
          </ul>
          <Button className="rounded-full bg-white text-violet-700 hover:bg-white/90 font-bold px-5 h-10">
            🧠 دریافت نسخه هوشمند
          </Button>
        </CardContent>
      </Card>

      {/* SECTION 9 — Timeline */}
      <Card className="rounded-3xl border-slate-100 shadow-sm">
        <CardContent className="p-5 md:p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="h-9 w-9 rounded-2xl bg-violet-100 text-violet-600 grid place-items-center">
              <Sparkles className="h-4 w-4" />
            </span>
            <h2 className="text-base md:text-lg font-extrabold text-slate-800">
              تاریخچه رشد
            </h2>
          </div>
          <div className="relative pr-4">
            <div className="absolute right-1.5 top-1 bottom-1 w-px bg-gradient-to-b from-violet-200 via-pink-200 to-transparent" />
            <div className="space-y-6">
              {TIMELINE.map((group) => (
                <div key={group.period} className="relative">
                  <div className="absolute -right-[13px] top-1 h-3 w-3 rounded-full bg-violet-500 ring-4 ring-violet-100" />
                  <p className="text-xs font-bold text-violet-600 mb-2">
                    {group.period}
                  </p>
                  <div className="space-y-2">
                    {group.events.map((e, i) => {
                      const Icon = e.icon;
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-100 p-3"
                        >
                          <span
                            className={`h-8 w-8 rounded-xl grid place-items-center ${TONE_MAP[e.tone]}`}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="text-sm text-slate-700">{e.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function HeroSection({ score }: { score: number }) {
  const size = 180;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-500 text-white p-6 md:p-8 shadow-lg overflow-hidden relative animate-fade-in">
      <div className="absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

      <div className="relative flex flex-col-reverse md:flex-row items-center gap-6 md:gap-8">
        <div className="flex-1 text-center md:text-right">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 mb-3 text-[11px] font-semibold">
            <HeartPulse className="h-3.5 w-3.5" />
            پرونده جامع دانش‌آموز
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            پرونده سلامت یادگیری
          </h1>
          <p className="mt-2 text-sm md:text-base text-white/90 leading-7">
            تحلیل جامع روند رشد و وضعیت یادگیری شما
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-400/20 border border-emerald-200/40 px-3 py-1.5 text-xs font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
            در حال رشد 🌱
          </div>
        </div>

        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={stroke}
              fill="none"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke="white"
              strokeWidth={stroke}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="text-[10px] text-white/80 font-semibold">
                شاخص سلامت یادگیری
              </p>
              <p className="text-4xl font-black tabular-nums leading-none mt-1">
                {toFa(score)}
              </p>
              <p className="text-xs text-white/80 mt-1">از {toFa(100)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "violet" | "emerald" | "rose" | "slate" | "sky";
}) {
  const toneMap: Record<string, string> = {
    violet: "text-violet-600",
    emerald: "text-emerald-600",
    rose: "text-rose-600",
    slate: "text-slate-600",
    sky: "text-sky-600",
  };
  return (
    <div className="rounded-xl bg-white border border-slate-100 p-3">
      <p className="text-[11px] text-slate-500 mb-1">{label}</p>
      <p className={`text-base font-extrabold tabular-nums ${toneMap[tone]}`}>
        {value}
      </p>
    </div>
  );
}

// Ensure JSX namespace for icon typing
declare global {
  namespace JSX {
    interface Element {}
  }
}
