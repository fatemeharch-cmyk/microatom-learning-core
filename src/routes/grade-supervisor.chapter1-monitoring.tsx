/**
 * MVP vertical slice — Grade Supervisor monitoring for Biology Chapter 1
 * (تنظیم عصبی).
 *
 * Calls POST /grade-supervisor/chapter1/monitoring with grade/major body.
 * Falls back to demo data if the backend is not ready.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Activity,
  Brain,
  ChevronLeft,
  Loader2,
  Stethoscope,
  TriangleAlert,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api/client";

export const Route = createFileRoute("/grade-supervisor/chapter1-monitoring")({
  component: Chapter1Monitoring,
});

interface StudentMonitor {
  student_id: string;
  name: string;
  dose_count: number;
  last_checkup_score: number | null;
  last_checkup_at?: string;
  weaknesses: string[];
  needs_followup: boolean;
}

const DEMO: StudentMonitor[] = [
  {
    student_id: "s-001",
    name: "آوا یوسفی",
    dose_count: 9,
    last_checkup_score: 92,
    last_checkup_at: "دیروز",
    weaknesses: [],
    needs_followup: false,
  },
  {
    student_id: "s-002",
    name: "ملینا حسینی",
    dose_count: 6,
    last_checkup_score: 78,
    last_checkup_at: "۲ روز پیش",
    weaknesses: ["مراحل پتانسیل عمل"],
    needs_followup: false,
  },
  {
    student_id: "s-003",
    name: "پارسا کریمی",
    dose_count: 3,
    last_checkup_score: 58,
    last_checkup_at: "۳ روز پیش",
    weaknesses: ["ساختار نورون", "غلاف میلین"],
    needs_followup: true,
  },
  {
    student_id: "s-004",
    name: "نیکا رضایی",
    dose_count: 2,
    last_checkup_score: 44,
    last_checkup_at: "۴ روز پیش",
    weaknesses: ["پتانسیل عمل", "بخش‌های مخ", "نخاع"],
    needs_followup: true,
  },
  {
    student_id: "s-005",
    name: "هلیا مرادی",
    dose_count: 5,
    last_checkup_score: 71,
    last_checkup_at: "امروز",
    weaknesses: ["انتقال‌دهنده‌های عصبی"],
    needs_followup: false,
  },
  {
    student_id: "s-006",
    name: "آرمان محمدی",
    dose_count: 0,
    last_checkup_score: null,
    weaknesses: [],
    needs_followup: true,
  },
];

function Chapter1Monitoring() {
  const [rows, setRows] = useState<StudentMonitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"api" | "demo">("demo");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await apiClient.post<{ students?: StudentMonitor[] }>(
          "/grade-supervisor/chapter1/monitoring",
          { grade_level: 11, major: "experimental" },
        );
        const list =
          Array.isArray(res.data)
            ? (res.data as unknown as StudentMonitor[])
            : res.data?.students ?? [];
        if (!cancelled && list.length) {
          setRows(list);
          setSource("api");
        } else if (!cancelled) {
          setRows(DEMO);
          setSource("demo");
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("[chapter1][monitoring] backend not ready, using demo", err);
        if (!cancelled) {
          setRows(DEMO);
          setSource("demo");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const followupCount = rows.filter((r) => r.needs_followup).length;
  const stableCount = rows.length - followupCount;

  return (
    <div dir="rtl" className="font-vazir space-y-6">
      <nav className="text-xs text-slate-500 flex items-center gap-1">
        <Link to="/grade-supervisor" className="hover:text-violet-600">
          داشبورد پایه
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-semibold">پایش فصل اول زیست</span>
      </nav>

      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-100 to-pink-100 text-violet-600 grid place-items-center">
            <Brain className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">
              پایش فصل اول زیست
            </h1>
            <p className="text-sm text-slate-500">
              وضعیت دوز مطالعه و چکاب دانش‌آموزان پایه یازدهم تجربی در فصل تنظیم
              عصبی.
            </p>
          </div>
        </div>
        {source === "demo" && !loading && (
          <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
            داده‌ی نمایشی
          </Badge>
        )}
      </header>

      {/* summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard
          label="کل دانش‌آموزان"
          value={String(rows.length)}
          icon={<Activity className="h-4 w-4" />}
          tint="from-violet-100 to-indigo-100"
          text="text-violet-600"
        />
        <SummaryCard
          label="نیاز به پیگیری"
          value={String(followupCount)}
          icon={<TriangleAlert className="h-4 w-4" />}
          tint="from-rose-100 to-amber-100"
          text="text-rose-600"
        />
        <SummaryCard
          label="وضعیت پایدار"
          value={String(stableCount)}
          icon={<Stethoscope className="h-4 w-4" />}
          tint="from-emerald-100 to-teal-100"
          text="text-emerald-600"
        />
        <SummaryCard
          label="میانگین چکاب"
          value={
            (() => {
              const scored = rows.filter(
                (r) => typeof r.last_checkup_score === "number",
              );
              if (!scored.length) return "—";
              const avg =
                scored.reduce(
                  (s, r) => s + (r.last_checkup_score as number),
                  0,
                ) / scored.length;
              return `${Math.round(avg)}٪`;
            })()
          }
          icon={<Brain className="h-4 w-4" />}
          tint="from-sky-100 to-cyan-100"
          text="text-sky-600"
        />
      </div>

      {/* list */}
      <Card className="border-0 rounded-3xl shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-base text-slate-800">
            کارت‌های پایش دانش‌آموزان
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="mr-2 text-sm">در حال دریافت داده‌ها…</span>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {rows.map((r) => (
                <div
                  key={r.student_id}
                  className={`rounded-2xl border p-4 space-y-3 transition ${
                    r.needs_followup
                      ? "border-rose-100 bg-rose-50/40"
                      : "border-emerald-100 bg-emerald-50/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-extrabold text-slate-800">
                        {r.name}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        پایه یازدهم تجربی
                      </p>
                    </div>
                    {r.needs_followup ? (
                      <Badge className="bg-rose-100 text-rose-700 border-0">
                        نیاز به پیگیری
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-100 text-emerald-700 border-0">
                        وضعیت پایدار
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl bg-white/80 border border-slate-100 p-2">
                      <p className="text-slate-500">دوز فصل اول</p>
                      <p className="text-base font-bold text-slate-800 mt-0.5">
                        {r.dose_count}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white/80 border border-slate-100 p-2">
                      <p className="text-slate-500">آخرین چکاب</p>
                      <p className="text-base font-bold text-slate-800 mt-0.5">
                        {r.last_checkup_score == null
                          ? "—"
                          : `${r.last_checkup_score}٪`}
                        {r.last_checkup_at && (
                          <span className="text-[10px] text-slate-400 font-normal mr-1">
                            ({r.last_checkup_at})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-500 mb-1">ضعف‌ها</p>
                    {r.weaknesses.length === 0 ? (
                      <span className="text-xs text-emerald-700">
                        ضعف قابل‌توجهی گزارش نشده.
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {r.weaknesses.map((w, i) => (
                          <Badge
                            key={i}
                            className="bg-amber-100 text-amber-700 border-0"
                          >
                            {w}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Link
                      to="/grade-supervisor/students/$id"
                      params={{ id: r.student_id }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-violet-700 hover:text-violet-900"
                    >
                      پرونده‌ی رشد
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  tint,
  text,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tint: string;
  text: string;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] border border-slate-100 p-4">
      <div className="flex items-center justify-between">
        <span className={`h-9 w-9 rounded-2xl bg-gradient-to-br ${tint} ${text} grid place-items-center`}>
          {icon}
        </span>
      </div>
      <p className="text-xs text-slate-500 mt-3">{label}</p>
      <p className="text-2xl font-extrabold text-slate-800 mt-1">{value}</p>
    </div>
  );
}
