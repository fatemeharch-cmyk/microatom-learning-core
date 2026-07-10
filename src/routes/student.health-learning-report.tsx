import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode, ComponentType } from "react";
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
import { apiClient } from "@/lib/api/client";

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
// API types
// ---------------------------------------------------------------------------

type LessonStatus = "ok" | "warn" | "bad";

interface LhrStudent {
  name?: string;
  grade?: string;
  avatar_url?: string;
}
interface LhrLearningHealth {
  score?: number;
  status?: string;
}
interface LhrSummary {
  total_exams?: number;
  average?: number;
  class_average?: number;
  highest_score?: number;
  rank?: number | null;
  rank_total?: number | null;
  growth?: number;
}
interface LhrSubject {
  name: string;
  value: number;
  color?: string;
}
interface LhrChapterLesson {
  title: string;
  status: LessonStatus;
}
interface LhrChapter {
  chapter: string;
  lessons: LhrChapterLesson[];
}
interface LhrChapterGroup {
  subject: string;
  items: LhrChapter[];
}
interface LhrExam {
  name?: string;
  percent?: number;
  correct?: number;
  wrong?: number;
  blank?: number;
  time?: string;
  date_label?: string;
}
interface LhrTrendPoint {
  label: string;
  value: number;
}
interface LhrTrend {
  weekly?: LhrTrendPoint[];
  monthly?: LhrTrendPoint[];
  quarterly?: LhrTrendPoint[];
}
interface LhrTimelineEvent {
  title?: string;
  icon?: string;
  tone?: string;
}
interface LhrTimelineGroup {
  period: string;
  events: LhrTimelineEvent[];
}
interface LhrRecommendation {
  title?: string;
  intro?: string;
  items?: string[];
  cta_label?: string;
}
interface LearningHealthRecord {
  student?: LhrStudent;
  learning_health?: LhrLearningHealth;
  summary?: LhrSummary;
  subject_performance?: LhrSubject[];
  chapters?: LhrChapterGroup[];
  recent_exams?: LhrExam[];
  strengths?: string[];
  needs_attention?: string[];
  health_trend?: LhrTrend;
  timeline?: LhrTimelineGroup[];
  recommendation?: LhrRecommendation;
}

const SUBJECT_COLORS: Array<{ color: string; track: string }> = [
  { color: "bg-emerald-500", track: "bg-emerald-100" },
  { color: "bg-sky-500", track: "bg-sky-100" },
  { color: "bg-violet-500", track: "bg-violet-100" },
  { color: "bg-amber-500", track: "bg-amber-100" },
  { color: "bg-pink-500", track: "bg-pink-100" },
  { color: "bg-rose-500", track: "bg-rose-100" },
];

const LESSON_ICON: Record<LessonStatus, ReactNode> = {
  ok: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  warn: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  bad: <XCircle className="h-4 w-4 text-rose-500" />,
};

const TONE_MAP: Record<string, string> = {
  violet: "bg-violet-100 text-violet-600",
  emerald: "bg-emerald-100 text-emerald-600",
  sky: "bg-sky-100 text-sky-600",
  amber: "bg-amber-100 text-amber-600",
  pink: "bg-pink-100 text-pink-600",
  rose: "bg-rose-100 text-rose-600",
  slate: "bg-slate-100 text-slate-600",
};

const TIMELINE_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  stethoscope: Stethoscope,
  heart: HeartPulse,
  heartpulse: HeartPulse,
  notebook: NotebookPen,
  target: Target,
  sparkles: Sparkles,
  trending: TrendingUp,
  trophy: Trophy,
};

function iconFor(name?: string): ComponentType<{ className?: string }> {
  if (!name) return Sparkles;
  return TIMELINE_ICONS[name.toLowerCase()] ?? Sparkles;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function HealthLearningReportPage() {
  const [range, setRange] = useState<"weekly" | "monthly" | "quarterly">(
    "weekly",
  );
  const [data, setData] = useState<LearningHealthRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get<LearningHealthRecord>(
          "/student/learning-health-record",
        );
        if (!cancelled) setData((res.data ?? {}) as LearningHealthRecord);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const chartData: LhrTrendPoint[] = useMemo(
    () => data?.health_trend?.[range] ?? [],
    [data, range],
  );

  const subjects = data?.subject_performance ?? [];
  const chapters = data?.chapters ?? [];
  const strengths = data?.strengths ?? [];
  const weaknesses = data?.needs_attention ?? [];
  const recentExams = data?.recent_exams ?? [];
  const timeline = data?.timeline ?? [];
  const recommendation = data?.recommendation;
  const summary = data?.summary;

  return (
    <div className="pb-10 space-y-6 animate-fade-in" dir="rtl">
      {/* SECTION 1 — Hero */}
      <HeroSection
        score={data?.learning_health?.score}
        status={data?.learning_health?.status}
        studentName={data?.student?.name}
        studentGrade={data?.student?.grade}
        loading={loading && !data}
      />

      {error && !data && (
        <Card className="rounded-2xl border-rose-200 bg-rose-50">
          <CardContent className="p-4 text-sm text-rose-700 text-right">
            بارگذاری پرونده سلامت یادگیری با خطا مواجه شد. لطفاً دوباره تلاش کنید.
          </CardContent>
        </Card>
      )}

      {/* SECTION — Summary metrics */}
      <Card className="rounded-3xl border-slate-100 shadow-sm">
        <CardContent className="p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-9 w-9 rounded-2xl bg-violet-100 text-violet-600 grid place-items-center">
              <ClipboardList className="h-4 w-4" />
            </span>
            <h2 className="text-base md:text-lg font-extrabold text-slate-800">
              خلاصه عملکرد
            </h2>
          </div>
          {loading && !data ? (
            <SkeletonGrid rows={2} cols={3} />
          ) : summary ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <SummaryStat
                label="کل آزمون‌ها"
                value={summary.total_exams != null ? toFa(summary.total_exams) : "—"}
              />
              <SummaryStat
                label="میانگین شما"
                value={summary.average != null ? `${toFa(summary.average)}٪` : "—"}
              />
              <SummaryStat
                label="میانگین کلاس"
                value={
                  summary.class_average != null
                    ? `${toFa(summary.class_average)}٪`
                    : "—"
                }
              />
              <SummaryStat
                label="بالاترین نمره"
                value={
                  summary.highest_score != null
                    ? `${toFa(summary.highest_score)}٪`
                    : "—"
                }
              />
              <SummaryStat
                label="رتبه"
                value={
                  summary.rank != null
                    ? summary.rank_total != null
                      ? `${toFa(summary.rank)} از ${toFa(summary.rank_total)}`
                      : toFa(summary.rank)
                    : "—"
                }
              />
              <SummaryStat
                label="رشد"
                value={
                  summary.growth != null
                    ? `${summary.growth > 0 ? "+" : ""}${toFa(summary.growth)}٪`
                    : "—"
                }
              />
            </div>
          ) : (
            <EmptyState text="هنوز خلاصه‌ای برای نمایش وجود ندارد." />
          )}
        </CardContent>
      </Card>

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
            {loading && !data ? (
              <div className="h-full w-full rounded-2xl bg-slate-100 animate-pulse" />
            ) : chartData.length === 0 ? (
              <EmptyState text="هنوز داده کافی برای رسم روند سلامت یادگیری وجود ندارد." />
            ) : (
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
            )}
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
          {loading && !data ? (
            <SkeletonGrid rows={1} cols={3} />
          ) : subjects.length === 0 ? (
            <EmptyState text="هنوز عملکرد درسی برای نمایش ثبت نشده است." />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((s, i) => {
                const palette = SUBJECT_COLORS[i % SUBJECT_COLORS.length];
                const v = Math.max(0, Math.min(100, Number(s.value ?? 0)));
                return (
                  <div
                    key={`${s.name}-${i}`}
                    className="rounded-2xl bg-slate-50 border border-slate-100 p-4 animate-fade-in"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-slate-800">
                        {s.name}
                      </span>
                      <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                        {toFa(v)}٪
                      </span>
                    </div>
                    <div className={`h-2 rounded-full ${palette.track} overflow-hidden`}>
                      <div
                        className={`h-full ${palette.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${v}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
          {loading && !data ? (
            <SkeletonGrid rows={2} cols={1} />
          ) : chapters.length === 0 ? (
            <EmptyState text="پس از ثبت فعالیت‌های درسی، وضعیت فصل‌ها اینجا نمایش داده می‌شود." />
          ) : (
            <div className="space-y-5">
              {chapters.map((group) => (
                <div key={group.subject}>
                  <h3 className="text-sm font-bold text-slate-700 mb-2">
                    {group.subject}
                  </h3>
                  <Accordion type="multiple" className="space-y-2">
                    {group.items.map((ch, idx) => (
                      <AccordionItem
                        key={`${group.subject}-${ch.chapter}-${idx}`}
                        value={`${group.subject}-${idx}`}
                        className="border border-slate-100 rounded-2xl px-4 bg-slate-50/50"
                      >
                        <AccordionTrigger className="text-sm font-semibold text-slate-800 hover:no-underline">
                          {ch.chapter}
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 pt-1">
                            {ch.lessons.map((l, li) => (
                              <li
                                key={`${l.title}-${li}`}
                                className="flex items-center gap-2 text-sm text-slate-700"
                              >
                                {LESSON_ICON[l.status] ?? LESSON_ICON.ok}
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
          )}
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
            {loading && !data ? (
              <SkeletonChips />
            ) : strengths.length === 0 ? (
              <EmptyState text="با ادامه تمرین، نقاط قوت شما اینجا نمایش داده می‌شود." />
            ) : (
              <div className="flex flex-wrap gap-2">
                {strengths.map((t, i) => (
                  <Badge
                    key={`${t}-${i}`}
                    className="rounded-full bg-white text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-semibold hover:bg-white"
                  >
                    ✔ {t}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-amber-100 bg-amber-50/60 shadow-sm animate-fade-in">
          <CardContent className="p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-9 w-9 rounded-2xl bg-amber-100 text-amber-600 grid place-items-center">
                <ShieldAlert className="h-4 w-4" />
              </span>
              <h2 className="text-base font-extrabold text-amber-800">نیازمند مراقبت</h2>
            </div>
            {loading && !data ? (
              <SkeletonChips />
            ) : weaknesses.length === 0 ? (
              <EmptyState text="در حال حاضر موردی نیازمند مراقبت شناسایی نشده است." />
            ) : (
              <div className="flex flex-wrap gap-2">
                {weaknesses.map((t, i) => (
                  <Badge
                    key={`${t}-${i}`}
                    className="rounded-full bg-white text-amber-700 border border-amber-200 px-3 py-1 text-xs font-semibold hover:bg-white"
                  >
                    ⚠ {t}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* SECTION 7 — Recent exams */}
      <Card className="rounded-3xl border-slate-100 shadow-sm">
        <CardContent className="p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-9 w-9 rounded-2xl bg-sky-100 text-sky-600 grid place-items-center">
              <Stethoscope className="h-4 w-4" />
            </span>
            <h2 className="text-base md:text-lg font-extrabold text-slate-800">
              آخرین گزارش‌های تشخیصی
            </h2>
          </div>
          {loading && !data ? (
            <SkeletonGrid rows={1} cols={1} />
          ) : recentExams.length === 0 ? (
            <EmptyState text="هنوز گزارش تشخیصی برای نمایش ثبت نشده است." />
          ) : (
            <div className="space-y-3">
              {recentExams.map((ex, i) => (
                <div
                  key={`${ex.name}-${i}`}
                  className="rounded-2xl bg-slate-50 border border-slate-100 p-4"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                    <p className="text-sm font-bold text-slate-800">
                      {ex.name ?? "—"}
                    </p>
                    {ex.date_label && (
                      <span className="text-[11px] text-slate-500">
                        {ex.date_label}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                    <ReportStat
                      label="درصد"
                      value={ex.percent != null ? `${toFa(ex.percent)}٪` : "—"}
                      tone="violet"
                    />
                    <ReportStat
                      label="درست"
                      value={ex.correct != null ? toFa(ex.correct) : "—"}
                      tone="emerald"
                    />
                    <ReportStat
                      label="غلط"
                      value={ex.wrong != null ? toFa(ex.wrong) : "—"}
                      tone="rose"
                    />
                    <ReportStat
                      label="نزده"
                      value={ex.blank != null ? toFa(ex.blank) : "—"}
                      tone="slate"
                    />
                    <ReportStat label="زمان" value={ex.time ?? "—"} tone="sky" />
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <Button className="rounded-full bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 h-9">
                  مشاهده تحلیل کامل
                </Button>
              </div>
            </div>
          )}
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
              {recommendation?.title || "نسخه پیشنهادی آتومیا"}
            </h2>
            <Sparkles className="h-4 w-4 text-amber-200" />
          </div>
          {loading && !data ? (
            <div className="space-y-2">
              <div className="h-3 w-2/3 rounded bg-white/25 animate-pulse" />
              <div className="h-3 w-1/2 rounded bg-white/25 animate-pulse" />
              <div className="h-3 w-3/4 rounded bg-white/25 animate-pulse" />
            </div>
          ) : recommendation && (recommendation.items?.length || recommendation.intro) ? (
            <>
              {recommendation.intro && (
                <p className="text-sm leading-7 text-white/95 mb-3">
                  {recommendation.intro}
                </p>
              )}
              {recommendation.items && recommendation.items.length > 0 && (
                <ul className="space-y-2 text-sm text-white/95 mb-4">
                  {recommendation.items.map((it, i) => (
                    <li key={`${it}-${i}`} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                      {it}
                    </li>
                  ))}
                </ul>
              )}
              <Button className="rounded-full bg-white text-violet-700 hover:bg-white/90 font-bold px-5 h-10">
                🧠 {recommendation.cta_label || "دریافت نسخه هوشمند"}
              </Button>
            </>
          ) : (
            <p className="text-sm leading-7 text-white/90">
              پس از ثبت فعالیت‌های بیشتر، نسخه اختصاصی آتومیا اینجا نمایش داده می‌شود.
            </p>
          )}
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
          {loading && !data ? (
            <SkeletonGrid rows={2} cols={1} />
          ) : timeline.length === 0 ? (
            <EmptyState text="با ثبت فعالیت‌های یادگیری، تاریخچه رشد شما اینجا نمایش داده می‌شود." />
          ) : (
            <div className="relative pr-4">
              <div className="absolute right-1.5 top-1 bottom-1 w-px bg-gradient-to-b from-violet-200 via-pink-200 to-transparent" />
              <div className="space-y-6">
                {timeline.map((group, gi) => (
                  <div key={`${group.period}-${gi}`} className="relative">
                    <div className="absolute -right-[13px] top-1 h-3 w-3 rounded-full bg-violet-500 ring-4 ring-violet-100" />
                    <p className="text-xs font-bold text-violet-600 mb-2">
                      {group.period}
                    </p>
                    <div className="space-y-2">
                      {group.events.map((e, i) => {
                        const Icon = iconFor(e.icon);
                        const tone = TONE_MAP[e.tone ?? "violet"] ?? TONE_MAP.violet;
                        return (
                          <div
                            key={i}
                            className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-100 p-3"
                          >
                            <span
                              className={`h-8 w-8 rounded-xl grid place-items-center ${tone}`}
                            >
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="text-sm text-slate-700">
                              {e.title ?? "—"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function HeroSection({
  score,
  status,
  studentName,
  studentGrade,
  loading,
}: {
  score?: number;
  status?: string;
  studentName?: string;
  studentGrade?: string;
  loading: boolean;
}) {
  const size = 180;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, Math.round(Number(score ?? 0))));
  const offset = c - (clamped / 100) * c;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-500 text-white p-6 md:p-8 shadow-lg overflow-hidden relative animate-fade-in">
      <div className="absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

      <div className="relative flex flex-col-reverse md:flex-row items-center gap-6 md:gap-8">
        <div className="flex-1 text-center md:text-right">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 mb-3 text-[11px] font-semibold">
            <HeartPulse className="h-3.5 w-3.5" />
            {loading ? "در حال بارگذاری…" : studentName ? `${studentName}${studentGrade ? ` · ${studentGrade}` : ""}` : "پرونده جامع دانش‌آموز"}
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            پرونده سلامت یادگیری
          </h1>
          <p className="mt-2 text-sm md:text-base text-white/90 leading-7">
            تحلیل جامع روند رشد و وضعیت یادگیری شما
          </p>
          {!loading && status && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-400/20 border border-emerald-200/40 px-3 py-1.5 text-xs font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
              {status}
            </div>
          )}
        </div>

        <div className="relative shrink-0" style={{ width: size, height: size }}>
          {loading ? (
            <div
              className="rounded-full bg-white/15 animate-pulse"
              style={{ width: size, height: size }}
            />
          ) : (
            <>
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
                    {score != null ? toFa(clamped) : "—"}
                  </p>
                  <p className="text-xs text-white/80 mt-1">از {toFa(100)}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3 text-right">
      <p className="text-[11px] text-slate-500 mb-1">{label}</p>
      <p className="text-base font-extrabold text-slate-800 tabular-nums">
        {value}
      </p>
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

function SkeletonGrid({ rows, cols }: { rows: number; cols: number }) {
  const cells = Array.from({ length: rows * cols });
  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {cells.map((_, i) => (
        <div
          key={i}
          className="h-16 rounded-2xl bg-slate-100 animate-pulse"
        />
      ))}
    </div>
  );
}

function SkeletonChips() {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-6 w-20 rounded-full bg-white/70 border border-white animate-pulse"
        />
      ))}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-dashed border-slate-200 p-4 text-sm text-slate-600 text-center">
      {text}
    </div>
  );
}
