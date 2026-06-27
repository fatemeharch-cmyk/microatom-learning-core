import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  HeartPulse,
  AlertOctagon,
  Activity,
  ShieldCheck,
  Stethoscope,
  ScrollText,
  Target,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import {
  MONITORING,
  MONITORING_SUMMARY,
  GROUP_META,
  RISK_META,
  CLASSES,
  type MonitoringGroup,
  type MonitoringStudent,
} from "@/lib/mock/grade-students";

export const Route = createFileRoute("/grade-supervisor/students/")({
  component: MonitoringCenter,
});

function toFa(n: number | string) {
  return Number(n).toLocaleString("fa-IR");
}

type StatusFilter = "all" | MonitoringGroup;

function MonitoringCenter() {
  const [query, setQuery] = useState("");
  const [cls, setCls] = useState<string>("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    return MONITORING.filter((s) => {
      if (cls !== "all" && s.className !== cls) return false;
      if (status !== "all" && s.group !== status) return false;
      if (query && !s.name.includes(query)) return false;
      return true;
    });
  }, [query, cls, status]);

  const groups: MonitoringGroup[] = ["urgent", "follow", "stable"];

  return (
    <div dir="rtl" className="font-vazir space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">مرکز پایش دانش‌آموزان</h1>
        <p className="text-sm text-slate-500 mt-1">
          دانش‌آموزان را بر اساس ریسک، نبض یادگیری، چکاب‌ها و ماموریت‌ها پایش کن.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard
          icon={<AlertOctagon className="h-4 w-4" />}
          tone="from-rose-100 to-pink-100 text-rose-600"
          label="نیازمند اقدام فوری"
          value={MONITORING_SUMMARY.urgent}
        />
        <SummaryCard
          icon={<Activity className="h-4 w-4" />}
          tone="from-amber-100 to-yellow-100 text-amber-600"
          label="نیازمند پیگیری"
          value={MONITORING_SUMMARY.follow}
        />
        <SummaryCard
          icon={<ShieldCheck className="h-4 w-4" />}
          tone="from-emerald-100 to-teal-100 text-emerald-600"
          label="وضعیت پایدار"
          value={MONITORING_SUMMARY.stable}
        />
        <SummaryCard
          icon={<HeartPulse className="h-4 w-4" />}
          tone="from-violet-100 to-pink-100 text-violet-600"
          label="میانگین نبض یادگیری"
          value={MONITORING_SUMMARY.avgPulse}
          suffix="٪"
        />
      </div>

      {/* Controls */}
      <div className="bg-white rounded-3xl shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] border border-slate-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <Search className="h-4 w-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              dir="rtl"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی دانش‌آموز"
              className="w-full h-11 pr-10 pl-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-violet-200 focus:bg-white transition"
            />
          </div>
          <select
            value={cls}
            onChange={(e) => setCls(e.target.value)}
            className="md:col-span-4 h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-700 focus:outline-none focus:border-violet-200 focus:bg-white transition"
          >
            <option value="all">همه کلاس‌ها</option>
            {CLASSES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="md:col-span-3 h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-700 focus:outline-none focus:border-violet-200 focus:bg-white transition"
          >
            <option value="all">همه</option>
            <option value="urgent">نیازمند اقدام فوری</option>
            <option value="follow">نیازمند پیگیری</option>
            <option value="stable">وضعیت پایدار</option>
          </select>
        </div>
      </div>

      {/* Grouped student cards */}
      <div className="space-y-8">
        {groups.map((g) => {
          const items = filtered.filter((s) => s.group === g);
          if (items.length === 0) return null;
          const meta = GROUP_META[g];
          return (
            <section key={g} className="space-y-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
                  <h2 className="text-base font-extrabold text-slate-800">{meta.title}</h2>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full border ${meta.chip}`}>
                    {toFa(items.length)} دانش‌آموز
                  </span>
                </div>
                <p className="text-xs text-slate-500">{meta.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {items.map((s) => (
                  <StudentMonitoringCard key={s.id} s={s} />
                ))}
              </div>
            </section>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-100 p-10 text-center text-sm text-slate-400">
            دانش‌آموزی با این فیلتر یافت نشد.
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  tone,
  label,
  value,
  suffix,
}: {
  icon: React.ReactNode;
  tone: string;
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] border border-slate-100 p-4">
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${tone} grid place-items-center`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] text-slate-500">{label}</p>
          <p className="text-xl font-extrabold text-slate-800 mt-0.5">
            {toFa(value)}
            {suffix && <span className="text-sm font-bold mr-0.5">{suffix}</span>}
          </p>
        </div>
      </div>
    </div>
  );
}

function StudentMonitoringCard({ s }: { s: MonitoringStudent }) {
  const g = GROUP_META[s.group];
  const r = RISK_META[s.risk];

  return (
    <div className={`bg-white rounded-3xl border ${g.ring} shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] overflow-hidden`}>
      <div className={`bg-gradient-to-l ${g.soft} px-5 py-4 flex items-center gap-3`}>
        <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${s.avatarColor} grid place-items-center text-lg font-extrabold text-slate-700`}>
          {s.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-extrabold text-slate-800">{s.name}</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${r.pill} inline-flex items-center gap-1`}>
              <span className={`h-1.5 w-1.5 rounded-full ${r.dot}`} />
              {r.label}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">کلاس: {s.className}</p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Metric
            icon={<HeartPulse className="h-3.5 w-3.5" />}
            tone="bg-violet-50 text-violet-600"
            label="نبض یادگیری"
            value={`${toFa(s.learningPulse)}٪`}
          />
          <Metric
            icon={<Stethoscope className="h-3.5 w-3.5" />}
            tone="bg-teal-50 text-teal-600"
            label="آخرین چکاب"
            value={`${toFa(s.lastCheckup)}٪`}
          />
          <Metric
            icon={<Target className="h-3.5 w-3.5" />}
            tone="bg-amber-50 text-amber-600"
            label="ماموریت‌ها"
            value={`${toFa(s.missionsDone)} از ${toFa(s.missionsTotal)}`}
          />
          <Metric
            icon={<ScrollText className="h-3.5 w-3.5" />}
            tone="bg-pink-50 text-pink-600"
            label="وضعیت نسخه"
            value={s.prescriptionStatus}
          />
        </div>

        <div className="bg-slate-50/70 rounded-2xl p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-slate-500" />
            <p className="text-[11px] font-bold text-slate-600">هشدارهای هوشمند</p>
          </div>
          <ul className="space-y-1.5">
            {s.alerts.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-[12px] text-slate-700">
                <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${g.dot}`} />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>

        <Link
          to="/grade-supervisor/students/$id"
          params={{ id: s.id }}
          className="w-full inline-flex items-center justify-center gap-1.5 h-10 rounded-2xl bg-violet-600 text-white text-xs font-semibold shadow-sm hover:bg-violet-700 transition"
        >
          مشاهده پرونده
          <ChevronLeft className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function Metric({
  icon,
  tone,
  label,
  value,
}: {
  icon: React.ReactNode;
  tone: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 p-3">
      <div className="flex items-center gap-2">
        <span className={`h-6 w-6 rounded-lg grid place-items-center ${tone}`}>{icon}</span>
        <p className="text-[10px] text-slate-500">{label}</p>
      </div>
      <p className="text-sm font-extrabold text-slate-800 mt-1.5">{value}</p>
    </div>
  );
}
