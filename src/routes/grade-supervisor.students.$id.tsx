import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Loader2,
  RefreshCw,
  ShieldAlert,
  UserRound,
  IdCard,
  GraduationCap,
  HeartPulse,
  Inbox,
  BookOpen,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getAuthToken } from "@/lib/api/client";

const GRADE_SUPERVISOR_BASE_URL =
  "https://x8ki-letl-twmt.n7.xano.io/api:grade-supervisor";

export const Route = createFileRoute("/grade-supervisor/students/$id")({
  component: StudentProfilePage,
});

type Student = {
  id?: number | string;
  user_id?: number | string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  national_code?: string;
  student_mobile?: string;
  father_mobile?: string;
  mother_mobile?: string;
  grade_level?: string;
  major?: string;
  class_name?: string;
  academic_year?: string;
  is_active?: boolean;
};

type StudySummary = {
  today_minutes?: number;
  week_minutes?: number;
  month_minutes?: number;
  subjects?: Array<Record<string, unknown>>;
};

type ExamSummary = {
  exam_count?: number;
  average_percentage?: number;
  latest_exams?: Array<Record<string, unknown>>;
};

type LearningHealth = {
  score?: number;
  status?: string;
  strengths?: Array<unknown>;
  needs_attention?: Array<unknown>;
};

type ProfileResponse = {
  success?: boolean;
  student?: Student;
  study_summary?: StudySummary;
  exam_summary?: ExamSummary;
  learning_health?: LearningHealth;
  recent_activity?: Array<Record<string, unknown>>;
};

type LoadState =
  | { status: "loading" }
  | { status: "ok"; data: ProfileResponse }
  | { status: "forbidden" }
  | { status: "error"; message: string };

function toFa(n: number | string | undefined | null) {
  if (n === null || n === undefined || n === "") return "—";
  return String(n).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-white rounded-3xl shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] border border-slate-100 ${className}`}
    >
      {children}
    </div>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={`rounded-2xl px-3 py-2.5 ${tone}`}>
      <p className="text-[10px] opacity-80">{label}</p>
      <p className="text-sm font-extrabold mt-1 truncate">{value}</p>
    </div>
  );
}

function EmptyBlock({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8 gap-2 text-slate-500">
      <Inbox className="h-6 w-6" />
      <p className="text-xs">{title}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  const isNum = typeof value === "number";
  const shown = value === undefined || value === null || value === "" ? "—" : String(value);
  return (
    <div className="flex items-center justify-between text-xs px-3 py-2 rounded-xl border border-slate-100">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-800 font-medium">{isNum ? toFa(shown) : shown}</span>
    </div>
  );
}

function pickLabel(o: Record<string, unknown>, keys: string[]): string | null {
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string" && v.trim()) return v;
    if (typeof v === "number") return String(v);
  }
  return null;
}

function StudentProfilePage() {
  const { id } = Route.useParams();
  const [state, setState] = useState<LoadState>({ status: "loading" });

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const token = getAuthToken();
      const res = await fetch(
        `${GRADE_SUPERVISOR_BASE_URL}/students/${encodeURIComponent(id)}`,
        {
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );
      if (res.status === 401 || res.status === 403) {
        setState({ status: "forbidden" });
        return;
      }
      if (!res.ok) {
        setState({ status: "error", message: `خطا در دریافت اطلاعات (${res.status})` });
        return;
      }
      const json = (await res.json()) as ProfileResponse;
      setState({ status: "ok", data: json ?? {} });
    } catch {
      setState({ status: "error", message: "ارتباط با سرور برقرار نشد." });
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div dir="rtl" className="font-vazir space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link
          to="/grade-supervisor/students"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-violet-600 transition"
        >
          <ArrowRight className="h-3.5 w-3.5" />
          بازگشت به مرکز پایش
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-800">پرونده دانش‌آموز</h1>
      </div>

      {state.status === "loading" && (
        <Card className="p-10 flex flex-col items-center justify-center gap-3 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
          <p className="text-xs">در حال دریافت اطلاعات دانش‌آموز...</p>
        </Card>
      )}

      {state.status === "forbidden" && (
        <Card className="p-10 text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-rose-50 text-rose-600 grid place-items-center">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="text-base font-bold text-slate-800 mt-4">دسترسی شما به این دانش‌آموز مجاز نیست</h2>
          <p className="text-sm text-slate-500 mt-2 leading-7 max-w-md mx-auto">
            این دانش‌آموز در محدوده مسئولیت شما قرار ندارد.
          </p>
        </Card>
      )}

      {state.status === "error" && (
        <Card className="p-10 text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 grid place-items-center">
            <RefreshCw className="h-6 w-6" />
          </div>
          <h2 className="text-base font-bold text-slate-800 mt-4">دریافت اطلاعات ناموفق بود</h2>
          <p className="text-sm text-slate-500 mt-2 leading-7 max-w-md mx-auto">{state.message}</p>
          <button
            onClick={() => void load()}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            تلاش دوباره
          </button>
        </Card>
      )}

      {state.status === "ok" && <ProfileBody data={state.data} />}
    </div>
  );
}

function ProfileBody({ data }: { data: ProfileResponse }) {
  const student = data.student ?? {};
  const study = data.study_summary ?? {};
  const exams = data.exam_summary ?? {};
  const health = data.learning_health ?? {};
  const activity = data.recent_activity ?? [];

  const fullName =
    student.full_name?.trim() ||
    [student.first_name, student.last_name].filter(Boolean).join(" ").trim();

  return (
    <>
      {/* Identity */}
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <span className="h-12 w-12 rounded-2xl bg-violet-50 text-violet-600 grid place-items-center">
            <UserRound className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold text-slate-800 truncate">
              {fullName || "بدون نام"}
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {[student.grade_level, student.major, student.class_name].filter(Boolean).join(" • ") || "—"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-5">
          <InfoRow label="کد ملی" value={student.national_code} />
          <InfoRow label="سال تحصیلی" value={student.academic_year} />
          <InfoRow label="پایه" value={student.grade_level} />
          <InfoRow label="رشته" value={student.major} />
          <InfoRow label="کلاس" value={student.class_name} />
          <InfoRow label="موبایل دانش‌آموز" value={student.student_mobile} />
          <InfoRow label="موبایل پدر" value={student.father_mobile} />
          <InfoRow label="موبایل مادر" value={student.mother_mobile} />
        </div>
      </Card>

      {/* Study */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 grid place-items-center">
            <IdCard className="h-4 w-4" />
          </span>
          <h3 className="text-sm font-bold text-slate-800">وضعیت مطالعه</h3>
        </div>
        <StudySection study={study} />
      </Card>

      {/* Exams */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center">
            <GraduationCap className="h-4 w-4" />
          </span>
          <h3 className="text-sm font-bold text-slate-800">نتایج آزمون‌ها</h3>
        </div>
        <ExamsSection exams={exams} />
      </Card>

      {/* Learning health */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 grid place-items-center">
            <HeartPulse className="h-4 w-4" />
          </span>
          <h3 className="text-sm font-bold text-slate-800">پرونده سلامت یادگیری</h3>
        </div>
        <HealthSection health={health} />
      </Card>

      {/* Recent activity — only if non-empty */}
      {activity.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-9 w-9 rounded-xl bg-sky-50 text-sky-600 grid place-items-center">
              <Activity className="h-4 w-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-800">فعالیت‌های اخیر</h3>
          </div>
          <div className="space-y-2">
            {activity.map((row, i) => {
              const title =
                pickLabel(row, ["title", "name", "type", "activity", "description"]) ?? "فعالیت";
              const meta = pickLabel(row, ["date", "created_at", "time", "at"]);
              const value = pickLabel(row, ["value", "score", "minutes", "detail"]);
              return (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 text-xs px-3 py-2 rounded-xl border border-slate-100"
                >
                  <span className="text-slate-700 truncate">{title}</span>
                  <span className="flex items-center gap-2 shrink-0 text-slate-500">
                    {value && <span className="text-slate-700 font-medium">{value}</span>}
                    {meta && <span>{meta}</span>}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </>
  );
}

function StudySection({ study }: { study: StudySummary }) {
  const today = Number(study.today_minutes ?? 0);
  const week = Number(study.week_minutes ?? 0);
  const month = Number(study.month_minutes ?? 0);
  const subjects = study.subjects ?? [];
  const empty = today === 0 && week === 0 && month === 0 && subjects.length === 0;

  if (empty) {
    return <EmptyBlock title="هنوز اطلاعات مطالعه‌ای برای این دانش‌آموز ثبت نشده است." />;
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <MiniStat label="امروز" value={`${toFa(today)} دق`} tone="bg-indigo-50 text-indigo-700" />
        <MiniStat label="این هفته" value={`${toFa(week)} دق`} tone="bg-violet-50 text-violet-700" />
        <MiniStat label="این ماه" value={`${toFa(month)} دق`} tone="bg-sky-50 text-sky-700" />
      </div>
      {subjects.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" /> درس‌ها
          </p>
          <div className="flex flex-wrap gap-2">
            {subjects.map((s, i) => {
              const name =
                pickLabel(s as Record<string, unknown>, ["name", "title", "subject", "subject_name"]) ??
                "درس";
              const minutes = pickLabel(s as Record<string, unknown>, ["minutes", "total_minutes", "duration"]);
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-700"
                >
                  <span className="font-medium">{name}</span>
                  {minutes && <span className="text-slate-500">{toFa(minutes)} دق</span>}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

function ExamsSection({ exams }: { exams: ExamSummary }) {
  const count = Number(exams.exam_count ?? 0);
  const avg = exams.average_percentage;
  const latest = exams.latest_exams ?? [];
  const empty = count === 0 && latest.length === 0;

  if (empty) {
    return <EmptyBlock title="هنوز نتیجه‌ی آزمونی برای این دانش‌آموز ثبت نشده است." />;
  }

  const avgText = avg === null || avg === undefined ? "—" : `${toFa(Math.round(Number(avg)))}٪`;

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <MiniStat label="تعداد آزمون" value={toFa(count)} tone="bg-emerald-50 text-emerald-700" />
        <MiniStat label="میانگین" value={avgText} tone="bg-teal-50 text-teal-700" />
      </div>
      {latest.length > 0 && (
        <div className="mt-4 space-y-2">
          {latest.map((ex, i) => {
            const title =
              pickLabel(ex, ["title", "name", "exam_title", "subject", "subject_name"]) ?? "آزمون";
            const date = pickLabel(ex, ["date", "created_at", "taken_at"]);
            const scoreRaw = pickLabel(ex, ["percentage", "score", "average_percentage", "result"]);
            const scoreNum = scoreRaw !== null ? Number(scoreRaw) : NaN;
            return (
              <div
                key={i}
                className="flex items-center justify-between gap-3 text-xs px-3 py-2 rounded-xl border border-slate-100"
              >
                <div className="min-w-0">
                  <p className="text-slate-800 font-medium truncate">{title}</p>
                  {date && <p className="text-[10px] text-slate-500 mt-0.5">{date}</p>}
                </div>
                {scoreRaw !== null && (
                  <span
                    className={
                      "text-xs font-bold shrink-0 " +
                      (Number.isFinite(scoreNum) && scoreNum < 60
                        ? "text-rose-600"
                        : "text-emerald-600")
                    }
                  >
                    {Number.isFinite(scoreNum) ? `${toFa(Math.round(scoreNum))}٪` : scoreRaw}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function HealthSection({ health }: { health: LearningHealth }) {
  const score = health.score;
  const status = health.status;
  const strengths = health.strengths ?? [];
  const needs = health.needs_attention ?? [];
  const scoreNum = score === null || score === undefined ? 0 : Number(score);
  const empty = (!scoreNum || scoreNum === 0) && strengths.length === 0 && needs.length === 0 && !status;

  if (empty) {
    return <EmptyBlock title="هنوز اطلاعات سلامت یادگیری برای این دانش‌آموز ثبت نشده است." />;
  }

  const tone =
    scoreNum >= 75
      ? "bg-emerald-50 text-emerald-700"
      : scoreNum >= 50
      ? "bg-amber-50 text-amber-700"
      : "bg-rose-50 text-rose-700";

  const asText = (v: unknown): string => {
    if (typeof v === "string") return v;
    if (typeof v === "number") return String(v);
    if (v && typeof v === "object") {
      const label = pickLabel(v as Record<string, unknown>, ["title", "name", "label", "text"]);
      if (label) return label;
    }
    return "—";
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <MiniStat label="نمره سلامت" value={score === undefined || score === null ? "—" : toFa(scoreNum)} tone={tone} />
        <div className={`rounded-2xl px-3 py-2.5 ${tone} flex flex-col justify-center`}>
          <p className="text-[10px] opacity-80">وضعیت</p>
          <p className="text-sm font-extrabold mt-1 truncate">{status || "—"}</p>
        </div>
      </div>
      {strengths.length > 0 && (
        <div className="mt-4">
          <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> نقاط قوت
          </p>
          <div className="flex flex-wrap gap-2">
            {strengths.map((s, i) => (
              <span
                key={i}
                className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100"
              >
                {asText(s)}
              </span>
            ))}
          </div>
        </div>
      )}
      {needs.length > 0 && (
        <div className="mt-4">
          <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-2">
            <AlertTriangle className="h-3.5 w-3.5 text-rose-500" /> نیازمند توجه
          </p>
          <div className="flex flex-wrap gap-2">
            {needs.map((s, i) => (
              <span
                key={i}
                className="text-[11px] px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100"
              >
                {asText(s)}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
