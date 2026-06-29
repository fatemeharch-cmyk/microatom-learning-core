import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  HeartPulse,
  Stethoscope,
  AlertTriangle,
  ScrollText,
  Target,
  Clock,
  CalendarDays,
  Activity,
  Sparkles,
  TrendingUp,
  Phone,
  Users,
  Lightbulb,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import {
  getStudentProfile,
  getMonitoringExtras,
  STATUS_META,
  RISK_META,
  type StudentProfile,
  type RiskLevel,
} from "@/lib/mock/grade-students";
import {
  CHAPTER as BIO_CHAPTER,
  MICRO_ATOMS as BIO_MICROS,
  ensureSeed as bioEnsureSeed,
  summarizeStudent as bioSummarize,
  useBioCh1Tick,
} from "@/lib/mock/biology-ch1";
import { Leaf } from "lucide-react";

export const Route = createFileRoute("/grade-supervisor/students/$id")({
  loader: ({ params }) => {
    const profile = getStudentProfile(params.id);
    if (!profile) throw notFound();
    const extras = getMonitoringExtras(params.id);
    return { profile, extras };
  },
  component: StudentProfilePage,
  notFoundComponent: () => (
    <div dir="rtl" className="font-vazir bg-white rounded-3xl p-10 text-center text-slate-500">
      دانش‌آموز یافت نشد.
    </div>
  ),
});

function toFa(n: number | string) {
  return Number(n).toLocaleString("fa-IR");
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-3xl shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] border border-slate-100 ${className}`}>
      {children}
    </div>
  );
}

const SEVERITY: Record<"low" | "mid" | "high", { label: string; pill: string }> = {
  low: { label: "خفیف", pill: "bg-amber-50 text-amber-700 border-amber-100" },
  mid: { label: "متوسط", pill: "bg-orange-50 text-orange-700 border-orange-100" },
  high: { label: "جدی", pill: "bg-rose-50 text-rose-700 border-rose-100" },
};

const TIMELINE_META: Record<string, { color: string; icon: any; label: string }> = {
  checkup: { color: "bg-teal-100 text-teal-600", icon: Stethoscope, label: "چکاب" },
  prescription: { color: "bg-violet-100 text-violet-600", icon: ScrollText, label: "نسخه" },
  mission: { color: "bg-amber-100 text-amber-600", icon: Target, label: "ماموریت" },
  appointment: { color: "bg-indigo-100 text-indigo-600", icon: CalendarDays, label: "قرار" },
  growth: { color: "bg-emerald-100 text-emerald-600", icon: TrendingUp, label: "رشد" },
};

function StudentProfilePage() {
  const { profile: p, extras } = Route.useLoaderData() as {
    profile: StudentProfile;
    extras: ReturnType<typeof getMonitoringExtras>;
  };
  const meta = STATUS_META[p.status];

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
        <h1 className="text-2xl font-extrabold text-slate-800">پرونده رشد دانش‌آموز</h1>
      </div>

      {/* Identity + Health score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-start gap-4 flex-wrap">
            <div className={`h-16 w-16 rounded-3xl bg-gradient-to-br ${p.avatarColor} grid place-items-center text-2xl font-extrabold text-slate-700`}>
              {p.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-extrabold text-slate-800">{p.name}</h2>
                <span className={`text-[10px] px-2.5 py-1 rounded-full border ${meta.pill}`}>{meta.label}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{p.className} • پایه یازدهم — رشته تجربی</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                <MiniStat label="نبض یادگیری" value={`${toFa(p.healthScore)}٪`} tone="bg-violet-50 text-violet-700" />
                <MiniStat label="سلامت آموزشی" value={`${toFa(p.healthScore)}٪`} tone="bg-pink-50 text-pink-700" />
                <MiniStat label="سطح ریسک" value={STATUS_META[p.status].label} tone="bg-rose-50 text-rose-700" />
                <MiniStat label="ارتباط با اولیا" value={extras.guardianRelation} tone="bg-emerald-50 text-emerald-700" />
              </div>
              <div className="flex items-center gap-4 mt-4 text-[11px] text-slate-500 flex-wrap">
                <span className="inline-flex items-center gap-1.5"><Phone className="h-3 w-3" /> {p.guardian} — {p.phone}</span>
                <span className="inline-flex items-center gap-1.5"><Users className="h-3 w-3" /> از {p.joined}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Next action */}
        <Card className="p-6 bg-gradient-to-br from-violet-50/70 to-pink-50/40">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-violet-600" />
            <h2 className="text-sm font-bold text-slate-800">اقدام پیشنهادی امروز</h2>
          </div>
          <p className="text-sm text-slate-700 leading-7">{extras.nextAction}</p>
          <button className="mt-4 w-full inline-flex items-center justify-center gap-1.5 h-10 rounded-2xl bg-violet-600 text-white text-xs font-semibold shadow-sm hover:bg-violet-700 transition">
            <CheckCircle2 className="h-4 w-4" />
            ثبت اقدام
          </button>
        </Card>
      </div>

      {/* Smart Alerts + Risk Prediction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-rose-600" />
            <h2 className="text-sm font-bold text-slate-800">هشدارهای هوشمند</h2>
          </div>
          <ul className="space-y-2">
            {extras.smartAlerts.map((a, i) => (
              <li key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-rose-50/50 border border-rose-100/60">
                <span className="mt-1 h-2 w-2 rounded-full bg-rose-500" />
                <span className="text-sm text-slate-700">{a}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="h-4 w-4 text-amber-600" />
            <h2 className="text-sm font-bold text-slate-800">پیش‌بینی ریسک</h2>
          </div>
          <div className="space-y-3">
            {extras.riskPredictions.map((r) => {
              const rm = RISK_META[r.level as RiskLevel];
              return (
                <div key={r.subject} className="p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800">احتمال افت {r.subject}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${rm.pill}`}>
                      {rm.label}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full ${
                          r.level === "high"
                            ? "bg-gradient-to-l from-rose-500 to-pink-400"
                            : r.level === "mid"
                            ? "bg-gradient-to-l from-amber-500 to-yellow-400"
                            : "bg-gradient-to-l from-emerald-500 to-teal-400"
                        }`}
                        style={{ width: `${r.probability}%` }}
                      />
                    </div>
                    <span className="text-xs font-extrabold text-slate-700">{toFa(r.probability)}٪</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Timeline (moved up — most important visual) */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
          <h2 className="text-sm font-bold text-slate-800">خط رشد</h2>
        </div>
        <div className="relative pr-5">
          <div className="absolute right-[10px] top-1 bottom-1 w-px bg-slate-200" />
          <div className="space-y-5">
            {p.timeline.map((t, i) => {
              const tm = TIMELINE_META[t.kind];
              const Icon = tm.icon;
              return (
                <div key={i} className="relative flex items-start gap-4">
                  <div className={`absolute right-[-13px] h-6 w-6 rounded-full ${tm.color} grid place-items-center border-4 border-white`}>
                    <Icon className="h-3 w-3" />
                  </div>
                  <div className="mr-6 flex-1 flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50/60">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{t.label}</p>
                      <p className="text-[11px] text-slate-500">{tm.label}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-600">{t.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>


      {/* Checkups + Weak concepts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Stethoscope className="h-4 w-4 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-800">چکاب‌های اخیر</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {p.checkups.map((c) => (
              <div key={c.date + c.subject} className="flex items-center gap-3 py-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-teal-100 to-emerald-100 grid place-items-center text-teal-600">
                  <Activity className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{c.subject}</p>
                  <p className="text-[11px] text-slate-500">{c.date}</p>
                </div>
                <p className="text-sm font-extrabold text-slate-800">{toFa(c.score)}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <h2 className="text-sm font-bold text-slate-800">مفاهیم نیازمند توجه</h2>
          </div>
          <div className="space-y-2">
            {p.weakConcepts.map((w) => (
              <div key={w.title} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/60">
                <div className="flex-1 text-right">
                  <p className="text-sm font-semibold text-slate-800">{w.title}</p>
                  <p className="text-[11px] text-slate-500">{w.subject}</p>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-full border ${SEVERITY[w.severity].pill}`}>
                  {SEVERITY[w.severity].label}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Prescriptions + Missions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <ScrollText className="h-4 w-4 text-violet-600" />
            <h2 className="text-sm font-bold text-slate-800">نسخه‌ها</h2>
          </div>
          <div className="space-y-3">
            {p.prescriptions.map((pr, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-2xl border border-slate-100">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-100 to-pink-100 grid place-items-center text-violet-600">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{pr.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{pr.date}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                  pr.status === "active"
                    ? "bg-violet-50 text-violet-700 border-violet-100"
                    : "bg-emerald-50 text-emerald-700 border-emerald-100"
                }`}>
                  {pr.status === "active" ? "در حال انجام" : "تکمیل شده"}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-4 w-4 text-amber-600" />
            <h2 className="text-sm font-bold text-slate-800">ماموریت‌ها</h2>
          </div>
          <div className="space-y-3">
            {p.missions.map((m) => (
              <div key={m.title} className="p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-800">{m.title}</p>
                  <span className="text-[10px] text-slate-400">مهلت: {m.due}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-l from-amber-400 to-orange-400"
                      style={{ width: `${m.progress}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700">{toFa(m.progress)}٪</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Dose history + Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-800">سابقه دوز مطالعه</h2>
          </div>
          <div className="flex items-end gap-2 h-32 px-1">
            {p.doseHistory.map((d) => {
              const max = Math.max(...p.doseHistory.map((x) => x.minutes));
              const h = (d.minutes / max) * 100;
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-slate-50 rounded-t-xl flex-1 flex items-end overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-indigo-400 to-violet-400 rounded-t-xl transition-all"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">{d.date}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="h-4 w-4 text-violet-600" />
            <h2 className="text-sm font-bold text-slate-800">قرار ملاقات‌ها</h2>
          </div>
          <div className="space-y-3">
            {p.appointments.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-violet-50/60">
                <div className="h-9 w-9 rounded-xl bg-white border border-violet-100 grid place-items-center text-violet-600">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{a.with}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{a.topic}</p>
                  <p className="text-[10px] text-violet-700 font-bold mt-1">{a.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

    </div>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={`rounded-2xl px-3 py-2 ${tone}`}>
      <p className="text-[10px] opacity-80">{label}</p>
      <p className="text-xs font-extrabold mt-0.5 truncate">{value}</p>
    </div>
  );
}

