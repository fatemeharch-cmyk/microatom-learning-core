import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Loader2, RefreshCw, ShieldAlert, UserRound, Phone, IdCard, GraduationCap, Inbox } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getAuthToken } from "@/lib/api/client";

const GRADE_SUPERVISOR_BASE_URL =
  "https://x8ki-letl-twmt.n7.xano.io/api:grade-supervisor";

export const Route = createFileRoute("/grade-supervisor/students/$id")({
  component: StudentProfilePage,
});

type StudentProfile = Record<string, unknown> & {
  id?: number | string;
  first_name?: string;
  last_name?: string;
  national_code?: string;
  grade_level?: string;
  major?: string;
  class_name?: string;
  student_mobile?: string;
  father_mobile?: string;
  mother_mobile?: string;
  academic_year?: string;
  study?: unknown;
  exams?: unknown;
  learning_health?: unknown;
};

type LoadState =
  | { status: "loading" }
  | { status: "ok"; data: StudentProfile }
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

function EmptyBlock({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8 gap-2 text-slate-500">
      <Inbox className="h-6 w-6" />
      <p className="text-xs">{title}</p>
    </div>
  );
}

function isEmpty(v: unknown): boolean {
  if (v === null || v === undefined) return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === "object") return Object.keys(v as object).length === 0;
  if (typeof v === "string") return v.trim() === "";
  return false;
}

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  const shown = value === undefined || value === null || value === "" ? "—" : String(value);
  return (
    <div className="flex items-center justify-between text-xs px-3 py-2 rounded-xl border border-slate-100">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-800 font-medium">{typeof value === "number" ? toFa(shown) : shown}</span>
    </div>
  );
}

function StudentProfilePage() {
  const { id } = Route.useParams();
  const [state, setState] = useState<LoadState>({ status: "loading" });

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const token = getAuthToken();
      const res = await fetch(`${GRADE_SUPERVISOR_BASE_URL}/students/${encodeURIComponent(id)}`, {
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.status === 401 || res.status === 403) {
        setState({ status: "forbidden" });
        return;
      }
      if (!res.ok) {
        setState({ status: "error", message: `خطا در دریافت اطلاعات (${res.status})` });
        return;
      }
      const json = (await res.json()) as StudentProfile | { student?: StudentProfile } | { data?: StudentProfile };
      const data: StudentProfile =
        (json && typeof json === "object" && "student" in json && (json as { student?: StudentProfile }).student) ||
        (json && typeof json === "object" && "data" in json && (json as { data?: StudentProfile }).data) ||
        (json as StudentProfile);
      setState({ status: "ok", data: data ?? {} });
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

      {state.status === "ok" && (
        <ProfileBody data={state.data} />
      )}
    </div>
  );
}

function ProfileBody({ data }: { data: StudentProfile }) {
  const fullName = [data.first_name, data.last_name].filter(Boolean).join(" ").trim();

  return (
    <>
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
              {[data.grade_level, data.major, data.class_name].filter(Boolean).join(" • ") || "—"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-5">
          <InfoRow label="کد ملی" value={data.national_code} />
          <InfoRow label="سال تحصیلی" value={data.academic_year} />
          <InfoRow label="پایه" value={data.grade_level} />
          <InfoRow label="رشته" value={data.major} />
          <InfoRow label="کلاس" value={data.class_name} />
          <InfoRow label="موبایل دانش‌آموز" value={data.student_mobile} />
          <InfoRow label="موبایل پدر" value={data.father_mobile} />
          <InfoRow label="موبایل مادر" value={data.mother_mobile} />
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 grid place-items-center">
            <IdCard className="h-4 w-4" />
          </span>
          <h3 className="text-sm font-bold text-slate-800">وضعیت مطالعه</h3>
        </div>
        {isEmpty(data.study) ? (
          <EmptyBlock title="هنوز اطلاعات مطالعه‌ای برای این دانش‌آموز ثبت نشده است." />
        ) : (
          <pre dir="ltr" className="text-[11px] bg-slate-50 rounded-xl p-3 overflow-auto max-h-64 text-slate-700">
{JSON.stringify(data.study, null, 2)}
          </pre>
        )}
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center">
            <GraduationCap className="h-4 w-4" />
          </span>
          <h3 className="text-sm font-bold text-slate-800">نتایج آزمون‌ها</h3>
        </div>
        {isEmpty(data.exams) ? (
          <EmptyBlock title="هنوز نتیجه‌ی آزمونی برای این دانش‌آموز ثبت نشده است." />
        ) : (
          <pre dir="ltr" className="text-[11px] bg-slate-50 rounded-xl p-3 overflow-auto max-h-64 text-slate-700">
{JSON.stringify(data.exams, null, 2)}
          </pre>
        )}
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 grid place-items-center">
            <Phone className="h-4 w-4" />
          </span>
          <h3 className="text-sm font-bold text-slate-800">پرونده سلامت یادگیری</h3>
        </div>
        {isEmpty(data.learning_health) ? (
          <EmptyBlock title="هنوز اطلاعات سلامت یادگیری برای این دانش‌آموز ثبت نشده است." />
        ) : (
          <pre dir="ltr" className="text-[11px] bg-slate-50 rounded-xl p-3 overflow-auto max-h-64 text-slate-700">
{JSON.stringify(data.learning_health, null, 2)}
          </pre>
        )}
      </Card>
    </>
  );
}
