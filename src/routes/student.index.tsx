import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  CheckCircle2,
  Circle,
  Loader2,
  Sparkles,
} from "lucide-react";


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

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function toFa(n: number | string): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

function faDate(iso: string): string {
  try {
    const d = new Date(iso);
    return toFa(
      new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(d),
    );
  } catch {
    return toFa(iso);
  }
}

type CheckinDraft = {
  sleepHours: string;
  mood: string;
  focus: number;
  stress: number;
  energy: number;
  note: string;
};

type LastExam = {
  title: string;
  percent: number;
  date: string;
} | null;

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

  // Last exam: read from localStorage if the exam page has saved one.
  // No backend endpoint exists yet — safe optional enhancement.
  const [lastExam, setLastExam] = useState<LastExam>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("atomia_last_exam");
      if (raw) setLastExam(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

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
  const remaining = 3 - doneCount;
  const percent = Math.round((doneCount / 3) * 100);
  const healthScore = [20, 45, 70, 95][doneCount] ?? 20;
  const trendLabel = doneCount >= 2 ? "روند مثبت" : doneCount === 1 ? "در حال بهبود" : "شروع کن";

  const goftarId = mission?.goftarId ?? "";
  const startCheckup = useCallback(() => {
    const params: Record<string, string> = { count: "5", autostart: "1" };
    if (goftarId) params.goftarId = goftarId;
    const qs = new URLSearchParams(params).toString();
    void navigate({ to: `/student/exam?${qs}` as string });
  }, [goftarId, navigate]);

  const continueToday = useCallback(() => {
    if (!checkinDone) setCheckinOpen(true);
    else if (!examDone) startCheckup();
    else if (!missionDone) setMissionOpen(true);
  }, [checkinDone, examDone, missionDone, startCheckup]);

  const allDone = doneCount === 3;

  return (
    <div dir="rtl" className="space-y-5 max-w-5xl mx-auto pb-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[28px] p-6 md:p-8 text-white shadow-lg bg-gradient-to-br from-violet-600 via-violet-500 to-fuchsia-500">
        {/* soft glow blobs */}
        <div className="pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-fuchsia-300/20 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="text-right">
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">
              سلام {displayName} 🌱
            </h1>
            <p className="text-sm md:text-base text-white/85 mt-2">
              امروز مسیر رشدت منتظر توست.
            </p>
            <div className="mt-5">
              <Button
                onClick={continueToday}
                disabled={loading || allDone}
                className="rounded-full bg-white text-violet-700 hover:bg-white/90 font-bold px-6 h-11 shadow-md"
              >
                {allDone ? "امروز کامل شد 🎉" : "ادامه نسخه امروز"}
                {!allDone && <ArrowLeft className="mr-2 h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-5 justify-center md:justify-end">
            <RingProgress percent={percent} />
            <div className="text-right">
              <p className="text-xs text-white/75">نسخه امروز</p>
              <p className="text-3xl font-extrabold mt-1">{toFa(percent)}٪</p>
              <p className="text-xs text-white/85 mt-1">
                {allDone
                  ? "همه فعالیت‌ها انجام شد"
                  : `${toFa(remaining)} فعالیت باقی مانده`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 text-right">
          مشکل در دریافت داده‌های امروز: {error}
        </div>
      )}

      {/* Four cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 – Today's prescription */}
        <ClinicCard emoji="📋" title="نسخه امروز" accent="from-violet-500 to-fuchsia-500">
          <ul className="space-y-1.5 text-sm">
            <PrescriptionRow done={checkinDone} label="شرح حال" />
            <PrescriptionRow done={examDone} label="چکاپ" />
            <PrescriptionRow done={missionDone} label="ماموریت" />
          </ul>
          <CardCta
            onClick={continueToday}
            disabled={loading || allDone}
            label={allDone ? "کامل شد" : "ادامه"}
          />
        </ClinicCard>

        {/* Card 2 – Learning pulse */}
        <ClinicCard emoji="❤️" title="نبض یادگیری" accent="from-rose-500 to-pink-500">
          <div className="text-right">
            <p className="text-[11px] text-slate-500">شاخص سلامت یادگیری</p>
            <div className="flex items-baseline gap-2 justify-end mt-1">
              <span className="text-3xl font-extrabold text-slate-800">
                {toFa(healthScore)}
              </span>
              <span className="text-xs text-emerald-600 font-semibold">
                {trendLabel}
              </span>
            </div>
          </div>
          <CardCta
            onClick={() => void navigate({ to: "/student/health-report" })}
            label="مشاهده جزئیات"
            variant="outline"
          />
        </ClinicCard>

        {/* Card 3 – Last exam */}
        <ClinicCard emoji="🔬" title="آخرین کاوش" accent="from-sky-500 to-violet-500">
          {lastExam ? (
            <div className="text-right space-y-1">
              <p className="text-sm font-bold text-slate-800 line-clamp-1">
                {lastExam.title}
              </p>
              <p className="text-2xl font-extrabold text-sky-600">
                {toFa(lastExam.percent)}٪
              </p>
              <p className="text-[11px] text-slate-500">{faDate(lastExam.date)}</p>
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-right leading-6">
              هنوز کاوشی انجام نشده است.
            </p>
          )}
          <CardCta
            onClick={() => void navigate({ to: "/student/exam" })}
            label={lastExam ? "تحلیل آزمون" : "شروع کاوش"}
            variant="outline"
          />
        </ClinicCard>

        {/* Card 4 – Today's mission */}
        <ClinicCard emoji="🎯" title="ماموریت امروز" accent="from-emerald-500 to-teal-500">
          {mission ? (
            <div className="text-right space-y-1">
              <p className="text-sm font-bold text-slate-800 line-clamp-2">
                {mission.title}
              </p>
              <p className="text-[11px] text-slate-500">
                زمان تخمینی: {toFa(mission.targetMinutes)} دقیقه
              </p>
              <p className="text-[11px] text-emerald-600">
                {toFa(mission.minutesDone)} از {toFa(mission.targetMinutes)} دقیقه انجام شده
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-right">
              {loading ? "در حال بارگذاری…" : "ماموریتی برای امروز نداری."}
            </p>
          )}
          <CardCta
            onClick={() => setMissionOpen(true)}
            disabled={!mission || missionDone}
            label={missionDone ? "انجام شد" : "شروع"}
          />
        </ClinicCard>
      </section>

      {/* Atomia suggestion */}
      <Card className="border-0 rounded-[22px] shadow-sm bg-gradient-to-l from-violet-50 to-fuchsia-50">
        <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-right flex items-start gap-3">
            <span className="h-10 w-10 shrink-0 rounded-2xl grid place-items-center bg-white/70 text-violet-600">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold text-violet-700">پیشنهاد آتومیا</p>
              <p className="text-sm text-slate-700 mt-1 leading-6">
                {checkinDone
                  ? "برای شروع مطالعه، یک چکاپ ۵ سوالی کوتاه انجام بده تا نقاط ضعف امروزت مشخص شود."
                  : "پیشنهاد می‌کنیم قبل از شروع مطالعه، یک چکاپ ۵ سوالی انجام دهید."}
              </p>
            </div>
          </div>
          <Button
            onClick={startCheckup}
            className="rounded-full bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 self-end sm:self-auto"
          >
            شروع چکاپ
          </Button>
        </CardContent>
      </Card>

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
    </div>
  );
}

// ---------------------------------------------------------------------------
// Presentational bits
// ---------------------------------------------------------------------------

function RingProgress({ percent }: { percent: number }) {
  const size = 96;
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
        <span className="text-lg font-extrabold">{toFa(percent)}٪</span>
      </div>
    </div>
  );
}

function ClinicCard({
  emoji,
  title,
  accent,
  children,
}: {
  emoji: string;
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-0 rounded-[22px] shadow-sm bg-white hover:shadow-md transition h-full">
      <CardContent className="p-4 flex flex-col gap-3 h-full">
        <div className="flex items-center justify-between">
          <span
            className={`h-9 w-9 rounded-xl grid place-items-center text-white bg-gradient-to-br ${accent} text-base`}
          >
            {emoji}
          </span>
          <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        </div>
        <div className="flex-1">{children}</div>
      </CardContent>
    </Card>
  );
}

function PrescriptionRow({ done, label }: { done: boolean; label: string }) {
  return (
    <li className="flex items-center justify-between">
      <span
        className={
          done
            ? "text-emerald-700 line-through decoration-emerald-400/60"
            : "text-slate-700"
        }
      >
        {label}
      </span>
      {done ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      ) : (
        <Circle className="h-4 w-4 text-slate-300" />
      )}
    </li>
  );
}

function CardCta({
  onClick,
  label,
  disabled,
  variant = "solid",
}: {
  onClick: () => void;
  label: string;
  disabled?: boolean;
  variant?: "solid" | "outline";
}) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={
        variant === "solid"
          ? "w-full rounded-full bg-violet-600 hover:bg-violet-700 text-white font-semibold h-9 mt-2"
          : "w-full rounded-full bg-white hover:bg-violet-50 text-violet-700 border border-violet-200 font-semibold h-9 mt-2"
      }
    >
      {label}
    </Button>
  );
}

// ---------------------------------------------------------------------------
// Check-in Dialog (unchanged behavior)
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

          {err && (
            <p className="text-xs text-rose-600 text-right">خطا: {err}</p>
          )}
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
// Mission Dialog (unchanged behavior)
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
