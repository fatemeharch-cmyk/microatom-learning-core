import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Users,
  TriangleAlert,
  Stethoscope,
  ChevronLeft,
  Activity,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { SUPERVISOR_BASE_URL } from "@/lib/api/config";
import { getAuthToken } from "@/lib/api/client";

export const Route = createFileRoute("/grade-supervisor/")({
  component: GradeDashboard,
});

const GRADE_SUPERVISOR_BASE_URL =
  "https://x8ki-letl-twmt.n7.xano.io/api:grade-supervisor";

type ApiStudent = {
  id?: string | number;
  first_name?: string;
  last_name?: string;
  class_name?: string;
  className?: string;
};

type RosterStudent = { id: string; name: string; className: string };

type ReportType =
  | "student"
  | "followup"
  | "meeting"
  | "parent"
  | "checkup"
  | "dose";

type Report = {
  id?: string | number;
  student_id?: string | number;
  student_name?: string;
  report_type?: ReportType | string;
  date?: string;
  notes?: string;
};

function toFa(n: number) {
  return n.toLocaleString("fa-IR");
}

function faDate(iso?: string) {
  if (!iso) return "";
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

async function fetchRoster(): Promise<RosterStudent[]> {
  const token = getAuthToken();
  const qs = new URLSearchParams({
    grade_level: "یازدهم",
    major: "تجربی",
  }).toString();
  const res = await fetch(`${GRADE_SUPERVISOR_BASE_URL}/students?${qs}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : null;
  if (!res.ok) {
    const msg =
      data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message ?? "")
        : "";
    throw new Error(msg || `status ${res.status}`);
  }
  let list: ApiStudent[] = [];
  if (Array.isArray(data)) {
    list = data as ApiStudent[];
  } else if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const raw = obj.students ?? obj.data ?? obj.items ?? obj.result;
    if (Array.isArray(raw)) list = raw as ApiStudent[];
  }
  return list
    .map((s) => ({
      id: String(s.id ?? ""),
      name:
        `${s.first_name ?? ""} ${s.last_name ?? ""}`.trim() || "بدون نام",
      className: s.class_name ?? s.className ?? "",
    }))
    .filter((s) => s.id);
}

async function xanoSupervisor<T>(path: string): Promise<T> {
  const token = getAuthToken();
  const res = await fetch(`${SUPERVISOR_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`status ${res.status}`);
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

function GradeDashboard() {
  const [roster, setRoster] = useState<RosterStudent[]>([]);
  const [followUps, setFollowUps] = useState<Report[]>([]);
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const [r, f, a] = await Promise.all([
        fetchRoster(),
        xanoSupervisor<Report[]>("/supervisor/reports/follow-ups").catch(
          () => [] as Report[],
        ),
        xanoSupervisor<Report[]>("/supervisor/reports/all").catch(
          () => [] as Report[],
        ),
      ]);
      setRoster(r);
      setFollowUps(Array.isArray(f) ? f : []);
      setAllReports(Array.isArray(a) ? a : []);
    } catch (err) {
      const msg = err instanceof Error && err.message ? err.message : "";
      setError(
        msg
          ? `دریافت اطلاعات داشبورد با خطا مواجه شد: ${msg}`
          : "دریافت اطلاعات داشبورد با خطا مواجه شد.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  const rosterIds = useMemo(
    () => new Set(roster.map((s) => s.id)),
    [roster],
  );

  const checkupReports = useMemo(
    () =>
      allReports
        .filter((r) => r.report_type === "checkup")
        .slice()
        .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
        .slice(0, 5),
    [allReports],
  );

  const summary = [
    {
      key: "count",
      label: "تعداد دانش‌آموزان",
      value: toFa(roster.length),
      sub: "پایه یازدهم — تجربی",
      icon: Users,
      color: "from-violet-100 to-indigo-100",
      text: "text-violet-600",
    },
    {
      key: "alerts",
      label: "نیازمند پیگیری",
      value: toFa(followUps.length),
      sub: "گزارش‌های باز",
      icon: TriangleAlert,
      color: "from-amber-100 to-orange-100",
      text: "text-amber-600",
    },
    {
      key: "checkups",
      label: "چکاب‌های ثبت‌شده",
      value: toFa(checkupReports.length),
      sub: "بر اساس گزارش‌های واقعی",
      icon: Stethoscope,
      color: "from-teal-100 to-emerald-100",
      text: "text-teal-600",
    },
  ];

  if (loading) {
    return (
      <div
        dir="rtl"
        className="font-vazir min-h-[300px] grid place-items-center text-slate-500"
      >
        <div className="flex items-center gap-2 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          در حال دریافت اطلاعات...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div dir="rtl" className="font-vazir">
        <Card className="p-8 text-center">
          <p className="text-sm text-rose-600">{error}</p>
          <button
            onClick={loadAll}
            className="mt-4 inline-flex items-center gap-1.5 h-9 px-4 rounded-2xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            تلاش دوباره
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div dir="rtl" className="font-vazir space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            داشبورد پایه یازدهم تجربی
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            نمای کلی دانش‌آموزان، پیگیری‌ها و چکاب‌های ثبت‌شده
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summary.map((s) => (
          <Card key={s.key} className="p-5">
            <div className="flex items-start justify-between">
              <div
                className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${s.color} grid place-items-center ${s.text}`}
              >
                <s.icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] text-slate-400">{s.sub}</span>
            </div>
            <p className="text-2xl font-extrabold text-slate-800 mt-4">
              {s.value}
            </p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Recent checkups */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-800">
              چکاب‌های اخیر
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">
            {checkupReports.length > 0
              ? `${toFa(checkupReports.length)} مورد`
              : ""}
          </span>
        </div>
        {checkupReports.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500">
            چکابی ثبت نشده است.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {checkupReports.map((c, i) => {
              const sid = c.student_id ? String(c.student_id) : "";
              const linkable = sid && rosterIds.has(sid);
              const body = (
                <div className="flex items-center gap-3 py-3">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-teal-100 to-emerald-100 grid place-items-center text-teal-600 shrink-0">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {c.student_name || "بدون نام"}
                    </p>
                    {c.notes && (
                      <p className="text-[11px] text-slate-500 truncate">
                        {c.notes}
                      </p>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 shrink-0">
                    {faDate(c.date)}
                  </p>
                </div>
              );
              return linkable ? (
                <Link
                  key={c.id ?? i}
                  to="/grade-supervisor/students/$id"
                  params={{ id: sid }}
                  className="block hover:bg-slate-50/60 rounded-xl px-2 -mx-2 transition"
                >
                  {body}
                </Link>
              ) : (
                <div key={c.id ?? i}>{body}</div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Followups */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TriangleAlert className="h-4 w-4 text-rose-600" />
            <h2 className="text-sm font-bold text-slate-800">
              دانش‌آموزان نیازمند پیگیری
            </h2>
          </div>
          <Link
            to="/grade-supervisor/notebook"
            className="text-[11px] text-violet-600 font-semibold hover:underline"
          >
            مشاهده در دفتر
          </Link>
        </div>
        {followUps.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500">
            پیگیری بازی وجود ندارد.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {followUps.slice(0, 9).map((r, i) => {
              const sid = r.student_id ? String(r.student_id) : "";
              const linkable = sid && rosterIds.has(sid);
              const name = r.student_name || "بدون نام";
              const inner = (
                <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-white">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 grid place-items-center text-slate-700 font-bold text-sm shrink-0">
                    {name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {r.report_type ? String(r.report_type) : ""}
                      {r.date ? ` — ${faDate(r.date)}` : ""}
                    </p>
                  </div>
                </div>
              );
              return linkable ? (
                <Link
                  key={r.id ?? i}
                  to="/grade-supervisor/students/$id"
                  params={{ id: sid }}
                  className="hover:shadow-sm hover:border-violet-200 transition rounded-2xl"
                >
                  {inner}
                </Link>
              ) : (
                <div key={r.id ?? i}>{inner}</div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
