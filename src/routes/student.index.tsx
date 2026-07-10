import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Bot,
  CheckCircle2,
  Loader2,
  Sparkles,
  Trophy,
} from "lucide-react";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import { useAuth } from "@/lib/auth-context";
import {
  getTodayCheckin,
  submitCheckin,
  getTodayMission,
  updateMissionProgress,
  type DailyMission,
} from "@/lib/services/content-service";

export const Route = createFileRoute("/student/")({
  component: TodayPage,
});

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function toFa(n: number | string): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

type CheckinDraft = {
  sleepHours: string;
  mood: string;
  focus: number;
  stress: number;
  energy: number;
  note: string;
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function TodayPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const studentId = user?.id ?? "";
  const displayName = user?.name?.trim() || "دانش‌آموز";
  const date = useMemo(() => todayISO(), []);

  const [checkinDone, setCheckinDone] = useState(false);
  const [mission, setMission] = useState<DailyMission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [checkinOpen, setCheckinOpen] = useState(false);
  const [missionOpen, setMissionOpen] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);

  // lightweight inline toast (no global Toaster mounted in this project)
  const [toast, setToast] = useState<string | null>(null);
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }, []);
  const comingSoon = useCallback(() => showToast("به‌زودی ✨"), [showToast]);


  const refresh = useCallback(async () => {
    if (!studentId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [ci, m] = await Promise.all([
        getTodayCheckin(studentId, date).catch(() => ({ exists: false, checkin: null })),
        getTodayMission(studentId, date).catch(() => null),
      ]);
      setCheckinDone(Boolean(ci?.exists));
      setMission(m);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [studentId, date]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const examDone = false;
  const missionDone = Boolean(mission?.isComplete);
  const doneCount = (checkinDone ? 1 : 0) + (examDone ? 1 : 0) + (missionDone ? 1 : 0);
  const healthScore = [20, 45, 70, 95][doneCount] ?? 20;

  const goftarId = mission?.goftarId ?? "";
  const startCheckup = useCallback(() => {
    void navigate({
      to: "/student/exam",
      search: {
        autostart: "1",
        count: "5",
        goftarId: goftarId || undefined,
      },
    });
  }, [goftarId, navigate]);

  const startSuggestion = useCallback(() => {
    if (suggestionLoading) return;
    setSuggestionLoading(true);
    window.setTimeout(() => {
      void navigate({
        to: "/student/exam",
        search: { autostart: "1", count: "5" },
      });
    }, 1700);
  }, [navigate, suggestionLoading]);


  const trophyMessage =
    healthScore >= 70
      ? "وضعیت شما عالی است! در مسیر درستی قرار داری، ادامه بده."
      : healthScore >= 40
        ? "روند خوبی داری، همینطور ادامه بده."
        : "بیا امروز رو با یه قدم کوچیک شروع کنیم.";

  return (
    <div dir="rtl" className="space-y-5 max-w-6xl mx-auto pb-10">
      {/* ------------------------------- HERO ------------------------------- */}
      <section className="relative overflow-hidden rounded-[28px] p-4 md:p-5 text-white shadow-lg bg-gradient-to-br from-violet-600 via-violet-500 to-fuchsia-500">
        {/* decorative shapes */}
        <div className="pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <Sparkles className="pointer-events-none absolute top-4 left-6 h-4 w-4 text-white/70" />
        <Sparkles className="pointer-events-none absolute top-12 left-20 h-3 w-3 text-white/50" />
        <Sparkles className="pointer-events-none absolute bottom-8 left-14 h-3 w-3 text-white/60" />

        <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-center">
          {/* Right: greeting + ring + stats + button */}
          <div className="order-2 lg:order-1 text-right">
            <h1 className="text-xl md:text-2xl font-extrabold leading-tight">
              سلام {displayName} 🌱
            </h1>
            <p className="text-sm text-white mt-1.5 font-medium">
              امروز هوش آتومیا برایت یک نسخه جدید آماده کرده است.
            </p>

            {/* Ring + stat pills */}
            <div className="mt-3 flex flex-col sm:flex-row-reverse sm:items-center gap-4">
              <div className="flex items-center gap-3 justify-end">
                <RingProgress percent={healthScore} size={104} />
                <div className="text-right">
                  <p className="text-xs text-white/85">شاخص سلامت یادگیری</p>
                  <p className="text-xl font-extrabold mt-1">
                    {toFa(healthScore)}٪ از ۱۰۰
                  </p>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-end gap-2 mb-1.5">
                  <SampleBadge tone="light" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-right">
                  <StatPill label="🟢 روزهای پیاپی مطالعه" value="۷ روز" />
                  <StatPill label="🎯 آخرین کاوش" value="۸۶٪" />
                  <StatPill label="📈 روند سلامت یادگیری" value="+۵٪" />
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 justify-end">
              <Button
                onClick={comingSoon}
                className="rounded-full bg-white text-violet-700 hover:bg-white/90 font-semibold px-4 h-9"
              >
                📂 مشاهده پرونده سلامت یادگیری
              </Button>
            </div>
          </div>

          {/* Left/Top: trophy card */}
          <div className="order-1 lg:order-2 lg:w-64">
            <div className="rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 p-3 text-right">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-xs text-white/85">وضعیت امروز</span>
                <span className="h-8 w-8 rounded-xl bg-amber-300/90 text-amber-900 grid place-items-center">
                  <Trophy className="h-4 w-4" />
                </span>
              </div>
              <p className="text-xs leading-6 text-white mt-2">{trophyMessage}</p>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 text-right">
          مشکل در دریافت داده‌های امروز: {error}
        </div>
      )}

      {/* --------------------------- SUGGESTION --------------------------- */}
      <Card className="border-0 rounded-[22px] shadow-sm bg-gradient-to-l from-violet-50 to-fuchsia-50">
        <CardContent className="p-5">
          {suggestionLoading ? (
            <div className="flex flex-col items-center justify-center py-4 text-center gap-2">
              <Loader2 className="h-7 w-7 animate-spin text-violet-600" />
              <p className="text-base font-bold text-violet-700 mt-1">نسخه هوشمند</p>
              <p className="text-xs text-slate-600">
                ۵ سؤال اختصاصی — بر اساس اشتباهات شما
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-right flex items-start gap-3">
                <span className="h-11 w-11 shrink-0 rounded-2xl grid place-items-center bg-white text-violet-600 shadow-sm">
                  <Bot className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-violet-700">
                    ✨ پیشنهاد آتومیا
                  </p>
                  <p className="text-sm text-slate-700 mt-1 leading-6">
                    برای مرور بیشتر و تثبیت یادگیری، هوش آتومیا بر اساس آخرین عملکرد شما یک نسخه اختصاصی آماده کرده است.
                  </p>
                </div>
              </div>
              <Button
                onClick={startSuggestion}
                className="rounded-full bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 self-end sm:self-auto"
              >
                🧠 دریافت نسخه هوشمند
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ------------------------------ ROW A ------------------------------ */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ActionCard
          emoji="❤️"
          accent="from-rose-500 to-pink-500"
          title="شرح حال امروز"
          status={checkinDone ? "ثبت شده ✅" : "هنوز ثبت نشده"}
          buttonLabel={checkinDone ? "مشاهده و ویرایش" : "شروع"}
          onClick={() => setCheckinOpen(true)}
        />
        <ActionCard
          emoji="🩺"
          accent="from-sky-500 to-violet-500"
          title="چکاپ امروز"
          status={
            <div className="space-y-0.5">
              <p className="text-[11px] text-slate-500">چکاپ روزانه</p>
              <p className="text-[11px] text-slate-500">بر اساس مأموریت</p>
              <p className="text-sm font-semibold text-slate-700">
                ۵ سؤال · ۳ دقیقه
              </p>
            </div>
          }
          buttonLabel="شروع چکاپ"
          onClick={startCheckup}
        />
        <ActionCard
          emoji="🎯"
          accent="from-emerald-500 to-teal-500"
          title="مأموریت امروز"
          tone={missionDone ? "green" : undefined}
          status={
            mission
              ? `${mission.title} — ${toFa(mission.minutesDone)}/${toFa(mission.targetMinutes)} دقیقه`
              : loading
                ? "در حال بارگذاری…"
                : "ماموریتی برای امروز نداری"
          }
          buttonLabel={missionDone ? "انجام شد ✅" : "شروع"}
          onClick={() => setMissionOpen(true)}
          disabled={!mission || missionDone}
        />
        <ActionCard
          emoji="📋"
          accent="from-indigo-500 to-violet-500"
          title="آزمون‌های مدرسه"
          status="بعدی: ریاضی - فصل ۳"
          buttonLabel="مشاهده همه"
          onClick={comingSoon}
          sample
        />
      </section>

      {/* ------------------------------ ROW B ------------------------------ */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ActionCard
          emoji="🔬"
          accent="from-fuchsia-500 to-violet-500"
          title="آخرین گزارش تشخیصی"
          status={
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-700">
                زیست‌شناسی - گفتار ۲
              </p>
              <p className="text-xs text-slate-600">
                درست: ۱۸ · غلط: ۷
              </p>
              <p className="text-xs text-amber-700">
                نیاز به مرور: گفتار ۲
              </p>
            </div>
          }
          buttonLabel="تحلیل آزمون"
          onClick={comingSoon}
          sample
        />
        <TrendCard onClick={comingSoon} />
        <ActionCard
          emoji="⏱️"
          accent="from-amber-500 to-orange-500"
          title="زمان مطالعه این هفته"
          status="۷ ساعت و ۴۵ دقیقه · +۲ ساعت نسبت به هفته قبل"
          buttonLabel="جزئیات بیشتر"
          onClick={comingSoon}
          sample
        />
        <ActionCard
          emoji="👥"
          accent="from-cyan-500 to-sky-500"
          title="جایگاه در کلاس"
          status="۳ از ۳۳ نفر · بهتر از ۹۱٪ کلاس"
          buttonLabel="مشاهده رتبه‌ها"
          onClick={comingSoon}
          sample
        />
      </section>


      {/* Dialogs */}
      <CheckinDialog
        open={checkinOpen}
        onOpenChange={setCheckinOpen}
        studentId={studentId}
        date={date}
        onSaved={() => {
          setCheckinOpen(false);
          void refresh();
        }}
      />
      <MissionDialog
        open={missionOpen}
        onOpenChange={setMissionOpen}
        mission={mission}
        onSaved={(m) => {
          setMission(m);
          setMissionOpen(false);
        }}
      />

      {/* Inline toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-slate-900/90 text-white text-sm px-5 py-2 shadow-lg backdrop-blur">
          {toast}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Presentational bits
// ---------------------------------------------------------------------------

function SampleBadge({ tone = "solid" }: { tone?: "solid" | "light" }) {
  return (
    <Badge
      className={
        tone === "light"
          ? "bg-white/25 text-white border-white/30 hover:bg-white/25 rounded-full text-[10px] px-2 py-0.5 font-semibold"
          : "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 rounded-full text-[10px] px-2 py-0.5 font-semibold"
      }
    >
      نمونه
    </Badge>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/15 border border-white/25 backdrop-blur-sm px-3 py-2">
      <p className="text-[10px] text-white/80 leading-tight">{label}</p>
      <p className="text-sm font-extrabold mt-1">{value}</p>
    </div>
  );
}

function RingProgress({ percent, size = 96 }: { percent: number; size?: number }) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.max(0, Math.min(100, percent)) / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="white"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 500ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-white">
        <div className="text-center leading-tight">
          <div className="text-xl font-extrabold">{toFa(percent)}٪</div>
          <div className="text-[10px] text-white/80">از ۱۰۰</div>
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  emoji,
  accent,
  title,
  status,
  buttonLabel,
  onClick,
  disabled,
  sample,
  tone,
}: {
  emoji: string;
  accent: string;
  title: string;
  status: React.ReactNode;
  buttonLabel: string;
  onClick: () => void;
  disabled?: boolean;
  sample?: boolean;
  tone?: "green";
}) {
  const cardTone =
    tone === "green"
      ? "bg-emerald-50 border border-emerald-100"
      : "bg-white border-0";
  const btnTone =
    tone === "green"
      ? "bg-emerald-600 hover:bg-emerald-600 text-white"
      : "bg-violet-600 hover:bg-violet-700 text-white";
  return (
    <Card className={`rounded-[22px] shadow-sm hover:shadow-md transition h-full ${cardTone}`}>
      <CardContent className="p-4 flex flex-col gap-3 h-full">
        <div className="flex items-center justify-between">
          <span
            className={`h-9 w-9 rounded-xl grid place-items-center text-white bg-gradient-to-br ${accent} text-base`}
          >
            {emoji}
          </span>
          <div className="flex items-center gap-2">
            {sample && <SampleBadge />}
            <h3 className="text-sm font-bold text-slate-800">{title}</h3>
          </div>
        </div>
        <div className="text-xs text-slate-600 text-right leading-6 flex-1">
          {status}
        </div>
        <Button
          onClick={onClick}
          disabled={disabled}
          className={`w-full rounded-full font-semibold h-9 ${btnTone}`}
        >
          {buttonLabel}
        </Button>
      </CardContent>
    </Card>
  );
}


const WEEK_DATA = [
  { day: "شنبه", v: 42 },
  { day: "یکشنبه", v: 55 },
  { day: "دوشنبه", v: 48 },
  { day: "سه‌شنبه", v: 68 },
  { day: "چهارشنبه", v: 72 },
  { day: "پنجشنبه", v: 65 },
  { day: "جمعه", v: 80 },
];

function TrendCard({ onClick }: { onClick: () => void }) {
  return (
    <Card className="border-0 rounded-[22px] shadow-sm bg-white hover:shadow-md transition h-full">
      <CardContent className="p-4 flex flex-col gap-2 h-full">
        <div className="flex items-center justify-between">
          <span className="h-9 w-9 rounded-xl grid place-items-center text-white bg-gradient-to-br from-violet-500 to-fuchsia-500">
            📈
          </span>
          <div className="flex items-center gap-2">
            <SampleBadge />
            <h3 className="text-sm font-bold text-slate-800">روند هفتگی</h3>
          </div>
        </div>
        <div className="h-16 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={WEEK_DATA} margin={{ top: 4, right: 6, left: 6, bottom: 0 }}>
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" hide />
              <Tooltip
                cursor={{ stroke: "#c4b5fd", strokeWidth: 1 }}
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #e5e7eb",
                  fontSize: 11,
                  direction: "rtl",
                }}
                labelStyle={{ color: "#6b7280" }}
                formatter={(v: number) => [`${toFa(v)}٪`, "امتیاز"]}
              />
              <Area
                type="monotone"
                dataKey="v"
                stroke="#7c3aed"
                strokeWidth={2}
                fill="url(#trendGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <Button
          onClick={onClick}
          className="w-full rounded-full bg-violet-600 hover:bg-violet-700 text-white font-semibold h-9 mt-auto"
        >
          مشاهده نمودار
        </Button>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Check-in Dialog
// ---------------------------------------------------------------------------

const MOODS = [
  { key: "good", label: "خوب", emoji: "😊" },
  { key: "ok", label: "معمولی", emoji: "😐" },
  { key: "bad", label: "بد", emoji: "😔" },
];

function CheckinDialog({
  open,
  onOpenChange,
  studentId,
  date,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  studentId: string;
  date: string;
  onSaved: () => void;
}) {
  const [draft, setDraft] = useState<CheckinDraft>({
    sleepHours: "",
    mood: "good",
    focus: 3,
    stress: 3,
    energy: 3,
    note: "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    if (!studentId) return;
    setSaving(true);
    setErr(null);
    try {
      await submitCheckin({
        studentId,
        date,
        sleepHours: draft.sleepHours ? Number(draft.sleepHours) : undefined,
        mood: draft.mood,
        focus: draft.focus,
        stress: draft.stress,
        energy: draft.energy,
        note: draft.note || undefined,
      });
      onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-md text-right">
        <DialogHeader>
          <DialogTitle className="text-right">ثبت شرح حال امروز</DialogTitle>
          <DialogDescription className="text-right">
            چند لحظه وقت بگذار و وضعیت امروزت را ثبت کن.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Field label="ساعت خواب دیشب">
            <Input
              type="number"
              inputMode="decimal"
              min={0}
              max={16}
              step={0.5}
              value={draft.sleepHours}
              onChange={(e) => setDraft({ ...draft, sleepHours: e.target.value })}
              placeholder="مثلاً ۷"
              className="text-right"
            />
          </Field>

          <Field label="حال کلی">
            <div className="flex gap-2 justify-end">
              {MOODS.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setDraft({ ...draft, mood: m.key })}
                  className={`px-3 py-2 rounded-xl border text-sm transition ${
                    draft.mood === m.key
                      ? "bg-violet-50 border-violet-300 text-violet-700"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="ml-1">{m.emoji}</span>
                  {m.label}
                </button>
              ))}
            </div>
          </Field>

          <ScaleField
            label="تمرکز"
            value={draft.focus}
            onChange={(v) => setDraft({ ...draft, focus: v })}
          />
          <ScaleField
            label="استرس"
            value={draft.stress}
            onChange={(v) => setDraft({ ...draft, stress: v })}
          />
          <ScaleField
            label="انرژی"
            value={draft.energy}
            onChange={(v) => setDraft({ ...draft, energy: v })}
          />

          <Field label="یادداشت (اختیاری)">
            <Textarea
              value={draft.note}
              onChange={(e) => setDraft({ ...draft, note: e.target.value })}
              placeholder="اگر نکته‌ای هست بنویس…"
              className="text-right"
              rows={2}
            />
          </Field>

          {err && <p className="text-xs text-rose-600 text-right">خطا: {err}</p>}
        </div>
        <DialogFooter className="sm:justify-start">
          <Button
            onClick={submit}
            disabled={saving}
            className="rounded-full bg-violet-600 hover:bg-violet-700 text-white"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "ذخیره"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={saving}
            className="rounded-full"
          >
            انصراف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-600 block text-right">
        {label}
      </label>
      {children}
    </div>
  );
}

function ScaleField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex gap-1.5 justify-end" dir="ltr">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`h-9 w-9 rounded-lg border text-sm font-semibold transition ${
              value === n
                ? "bg-violet-600 border-violet-600 text-white"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {toFa(n)}
          </button>
        ))}
      </div>
    </Field>
  );
}

// ---------------------------------------------------------------------------
// Mission Dialog
// ---------------------------------------------------------------------------

function MissionDialog({
  open,
  onOpenChange,
  mission,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mission: DailyMission | null;
  onSaved: (m: DailyMission) => void;
}) {
  const [minutes, setMinutes] = useState<number>(10);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    if (!mission) return;
    setSaving(true);
    setErr(null);
    try {
      const nextDone = Math.min(
        mission.targetMinutes,
        (mission.minutesDone ?? 0) + minutes,
      );
      const updated = await updateMissionProgress(mission.id, nextDone);
      onSaved(updated);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  const remaining = mission
    ? Math.max(0, mission.targetMinutes - mission.minutesDone)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-md text-right">
        <DialogHeader>
          <DialogTitle className="text-right">
            {mission?.title || "ماموریت امروز"}
          </DialogTitle>
          <DialogDescription className="text-right">
            {mission
              ? `${toFa(mission.minutesDone)} از ${toFa(mission.targetMinutes)} دقیقه انجام شده — ${toFa(remaining)} دقیقه باقی‌مانده`
              : "در حال بارگذاری…"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Field label="چند دقیقه مطالعه اضافه کنیم؟">
            <div className="flex gap-2 justify-end">
              {[5, 10, 15, 30].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setMinutes(n)}
                  className={`px-3 py-2 rounded-xl border text-sm font-semibold transition ${
                    minutes === n
                      ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {toFa(n)} دقیقه
                </button>
              ))}
            </div>
          </Field>
          <Field label="یا مقدار دلخواه">
            <Input
              type="number"
              min={1}
              max={240}
              value={minutes}
              onChange={(e) => setMinutes(Math.max(1, Number(e.target.value) || 0))}
              className="text-right"
            />
          </Field>
          {err && <p className="text-xs text-rose-600 text-right">خطا: {err}</p>}
        </div>
        <DialogFooter className="sm:justify-start">
          <Button
            onClick={submit}
            disabled={saving || !mission}
            className="rounded-full bg-violet-600 hover:bg-violet-700 text-white"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "ثبت پیشرفت"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={saving}
            className="rounded-full"
          >
            بستن
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Prevent unused var lint (CheckCircle2 icon reserved for future done-state visuals).
void CheckCircle2;
