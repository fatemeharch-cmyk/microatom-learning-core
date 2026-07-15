import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Timer,
  Users,
  TrendingUp,
  Loader2,
  RefreshCw,
  ChevronLeft,
} from "lucide-react";
import { GRADE_SUPERVISOR_BASE_URL } from "@/lib/api/config";
import { getAuthToken } from "@/lib/api/client";

export const Route = createFileRoute("/grade-supervisor/study-tracking")({
  component: GradeStudyTracking,
});

type GradeSummary = {
  total_minutes?: number;
  total_logs?: number;
  active_student_count?: number;
  average_minutes_per_student?: number;
};

type BySubject = {
  subject_id: string | number;
  subject_name: string;
  total_minutes: number;
};

type ByPeriod = {
  period: string;
  total_minutes: number;
  active_student_count?: number;
};

type StudentRow = {
  student_id: string | number;
  student_name: string;
  total_minutes: number;
  log_count: number;
  last_study_date?: string;
};

type GradeStudyResponse = {
  success?: boolean;
  range?: { from_date?: string; to_date?: string };
  grade_summary?: GradeSummary;
  by_subject?: BySubject[];
  by_period?: ByPeriod[];
  students?: StudentRow[];
};

function toFa(n: number | string) {
  return Number(n).toLocaleString("fa-IR");
}

function faDate(iso?: string) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  } catch {
    return iso;
  }
}

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

async function fetchGradeStudy(
  from: string,
  to: string,
): Promise<GradeStudyResponse> {
  const token = getAuthToken();
  const qs = new URLSearchParams({
    grade_level: "یازدهم",
    major: "تجربی",
    from_date: from,
    to_date: to,
    group_by: "day",
  }).toString();
  const res = await fetch(
    `${GRADE_SUPERVISOR_BASE_URL}/study-logs?${qs}`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );
  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : null;
  if (!res.ok) {
    const msg =
      data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message ?? "")
        : "";
    throw new Error(msg || `status ${res.status}`);
  }
  return (data ?? {}) as GradeStudyResponse;
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-3xl shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] border border-slate-100 ${className}`}
    >
      {children}
    </div>
  );
}

const RANGE_OPTIONS = [
  { key: "7", label: "۷ روز اخیر", days: 6 },
  { key: "30", label: "۳۰ روز اخیر", days: 29 },
];

function GradeStudyTracking() {
  const [rangeKey, setRangeKey] = useState<string>("7");
  const [data, setData] = useState<GradeStudyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const range = useMemo(() => {
    const opt = RANGE_OPTIONS.find((r) => r.key === rangeKey) ?? RANGE_OPTIONS[0];
    return { from: daysAgoIso(opt.days), to: daysAgoIso(0) };
  }, [rangeKey]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchGradeStudy(range.from, range.to);
      setData(res);
    } catch (err) {
      const msg = err instanceof Error && err.message ? err.message : "";
      setError(
        msg
          ? `دریافت اطلاعات پیگیری مطالعه با خطا مواجه شد: ${msg}`
          : "دریافت اطلاعات پیگیری مطالعه با خطا مواجه شد.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeKey]);

  const summary = data?.grade_summary ?? {};
  const students = data?.students ?? [];
  const bySubject = data?.by_subject ?? [];
  const isEmpty =
    (summary.total_minutes ?? 0) === 0 &&
    students.every((s) => (s.total_minutes ?? 0) === 0);

  return (
    <div dir="rtl" className="font-vazir space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Timer className="h-3.5 w-3.5" />
            پیگیری مطالعهٔ پایه یازدهم تجربی
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 mt-1">
            پیگیری مطالعه
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            خلاصهٔ زمان مطالعهٔ ثبت‌شده توسط دانش‌آموزان در بازهٔ انتخابی
          </p>
        </div>
        <div className="flex items-center gap-2">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setRangeKey(opt.key)}
              className={`h-9 px-3 rounded-2xl text-xs font-semibold transition ${
                rangeKey === opt.key
                  ? "bg-violet-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-violet-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
          <button
            onClick={load}
            className="h-9 px-3 rounded-2xl text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:border-violet-200 inline-flex items-center gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            به‌روزرسانی
          </button>
        </div>
      </div>

      {loading ? (
        <Card className="p-10 grid place-items-center text-slate-500">
          <div className="flex items-center gap-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            در حال دریافت اطلاعات...
          </div>
        </Card>
      ) : error ? (
        <Card className="p-8 text-center space-y-4">
          <p className="text-sm text-rose-600">{error}</p>
          <button
            onClick={load}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-2xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            تلاش دوباره
          </button>
        </Card>
      ) : isEmpty ? (
        <Card className="p-10 text-center text-sm text-slate-500">
          هنوز داده‌ای برای این بازه ثبت نشده است.
        </Card>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-5">
              <div className="flex items-start justify-between">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 grid place-items-center text-violet-600">
                  <Timer className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-800 mt-4">
                {toFa(summary.total_minutes ?? 0)}
              </p>
              <p className="text-xs text-slate-500 mt-1">مجموع دقایق مطالعه</p>
            </Card>
            <Card className="p-5">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 grid place-items-center text-emerald-600">
                <Users className="h-5 w-5" />
              </div>
              <p className="text-2xl font-extrabold text-slate-800 mt-4">
                {toFa(summary.active_student_count ?? 0)}
              </p>
              <p className="text-xs text-slate-500 mt-1">دانش‌آموز فعال</p>
            </Card>
            <Card className="p-5">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 grid place-items-center text-amber-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <p className="text-2xl font-extrabold text-slate-800 mt-4">
                {toFa(Math.round(summary.average_minutes_per_student ?? 0))}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                میانگین دقیقه به ازای دانش‌آموز
              </p>
            </Card>
            <Card className="p-5">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 grid place-items-center text-sky-600">
                <Timer className="h-5 w-5" />
              </div>
              <p className="text-2xl font-extrabold text-slate-800 mt-4">
                {toFa(summary.total_logs ?? 0)}
              </p>
              <p className="text-xs text-slate-500 mt-1">تعداد جلسات ثبت‌شده</p>
            </Card>
          </div>

          {/* By subject */}
          {bySubject.length > 0 && (
            <Card className="p-5">
              <h2 className="text-sm font-bold text-slate-800 mb-4">
                به تفکیک درس
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {bySubject.map((b) => (
                  <div
                    key={String(b.subject_id)}
                    className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-white"
                  >
                    <span className="text-sm font-semibold text-slate-800">
                      {b.subject_name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {toFa(b.total_minutes)} دقیقه
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Students table */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800">
                فهرست دانش‌آموزان
              </h2>
              <span className="text-[11px] text-slate-400">
                {toFa(students.length)} نفر
              </span>
            </div>
            {students.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-500">
                دانش‌آموزی در این بازه فعال نبوده است.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-500 text-xs">
                      <th className="text-right py-2 font-semibold">
                        دانش‌آموز
                      </th>
                      <th className="text-right py-2 font-semibold">
                        مجموع دقایق
                      </th>
                      <th className="text-right py-2 font-semibold">
                        تعداد جلسات
                      </th>
                      <th className="text-right py-2 font-semibold">
                        آخرین مطالعه
                      </th>
                      <th className="text-right py-2 font-semibold"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((s) => (
                      <tr key={String(s.student_id)} className="hover:bg-slate-50/50">
                        <td className="py-3 font-semibold text-slate-800">
                          {s.student_name || "بدون نام"}
                        </td>
                        <td className="py-3 text-slate-700">
                          {toFa(s.total_minutes ?? 0)}
                        </td>
                        <td className="py-3 text-slate-700">
                          {toFa(s.log_count ?? 0)}
                        </td>
                        <td className="py-3 text-slate-500 text-xs">
                          {faDate(s.last_study_date)}
                        </td>
                        <td className="py-3">
                          <Link
                            to="/grade-supervisor/students/$id"
                            params={{ id: String(s.student_id) }}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 hover:underline"
                          >
                            پرونده
                            <ChevronLeft className="h-3.5 w-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
