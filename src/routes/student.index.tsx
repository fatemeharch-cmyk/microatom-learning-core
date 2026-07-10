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
  Heart,
  Stethoscope,
  BookOpen,
  Sparkles,
  Loader2,
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

type CheckinDraft = {
  sleepHours: string;
  mood: string;
  focus: number;
  stress: number;
  energy: number;
  note: string;
};

function TodayPage() {
  const { user } = useAuth();
  const studentId = user?.id ?? "";
  const displayName = user?.name?.trim() || "دانش‌آموز";
  const date = useMemo(() => todayISO(), []);

  const [checkinDone, setCheckinDone] = useState(false);
  const [mission, setMission] = useState<DailyMission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [checkinOpen, setCheckinOpen] = useState(false);
  const [missionOpen, setMissionOpen] = useState(false);

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

  const examDone = false; // no per-day exam tracking endpoint yet
  const missionDone = Boolean(mission?.isComplete);
  const doneCount = (checkinDone ? 1 : 0) + (examDone ? 1 : 0) + (missionDone ? 1 : 0);
  const percent = Math.round((doneCount / 3) * 100);
  const healthScore = [20, 45, 70, 95][doneCount] ?? 20;

  return (
    <div dir="rtl" className="space-y-5 max-w-4xl mx-auto pb-10">
      {/* Greeting */}
      <section className="text-right pt-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight">
          سلام {displayName} 🌱
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          امروز فقط این ۳ کار را انجام بده.
        </p>
      </section>

      {/* Prescription checklist */}
      <Card className="border-0 rounded-[22px] shadow-sm bg-white">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 inline-flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              نسخه امروز
            </span>
            <h3 className="font-bold text-slate-800">برنامه امروز</h3>
          </div>
          <ul className="space-y-2">
            <ChecklistItem done={checkinDone} label="شرح حال" />
            <ChecklistItem done={examDone} label="چکاپ" />
            <ChecklistItem done={missionDone} label="مأموریت" />
          </ul>
          <div className="pt-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span>{toFa(percent)}٪</span>
              <span>امروز: {toFa(percent)}٪ تکمیل شد</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-l from-emerald-500 to-violet-500 transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 text-right">
          مشکل در دریافت داده‌های امروز: {error}
        </div>
      )}

      {/* Three big action cards */}
      <section className="grid md:grid-cols-3 gap-4">
        <ActionCard
          emoji="❤️"
          title="ثبت شرح حال"
          subtitle="۲ دقیقه · ثبت وضعیت امروز"
          tone="from-rose-100 to-pink-100 text-rose-600"
          done={checkinDone}
          loading={loading}
          buttonLabel={checkinDone ? "ویرایش" : "شروع"}
          onClick={() => setCheckinOpen(true)}
          Icon={Heart}
        />
        <CheckupCard
          done={examDone}
          loading={loading}
          goftarId={mission?.goftarId ?? ""}
        />
        <MissionCard
          mission={mission}
          loading={loading}
          onOpen={() => setMissionOpen(true)}
        />
      </section>

      {/* Health indicator */}
      <Card className="border-0 rounded-[22px] shadow-sm bg-gradient-to-l from-emerald-50 to-violet-50">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="text-right">
            <p className="text-[11px] text-slate-500">
              شاخص ساده و آزمایشی (بر اساس کارهای امروز)
            </p>
            <p className="text-lg font-bold text-slate-800 mt-1">
              شاخص سلامت یادگیری
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">
              {toFa(healthScore)}
            </span>
            <span className="text-2xl">🌱</span>
          </div>
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

function ChecklistItem({ done, label }: { done: boolean; label: string }) {
  return (
    <li className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/70">
      <span
        className={`text-sm font-medium ${
          done ? "text-emerald-700 line-through decoration-emerald-400/60" : "text-slate-700"
        }`}
      >
        {label}
      </span>
      {done ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      ) : (
        <Circle className="h-5 w-5 text-slate-300" />
      )}
    </li>
  );
}

function ActionCard({
  emoji,
  title,
  subtitle,
  tone,
  done,
  loading,
  buttonLabel,
  onClick,
  Icon,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  tone: string;
  done: boolean;
  loading: boolean;
  buttonLabel: string;
  onClick: () => void;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card
      className={`border-0 rounded-[22px] shadow-sm bg-white transition ${
        done ? "opacity-70" : "hover:shadow-md"
      }`}
    >
      <CardContent className="p-5 space-y-4 text-right">
        <div className="flex items-start justify-between">
          <span
            className={`h-12 w-12 rounded-2xl grid place-items-center bg-gradient-to-br ${tone}`}
          >
            <Icon className="h-6 w-6" />
          </span>
          <div className="text-2xl">{emoji}</div>
        </div>
        <div>
          <div className="flex items-center gap-2 justify-end">
            <h3 className="font-bold text-slate-800">{title}</h3>
            {done && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
          </div>
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        </div>
        <Button
          onClick={onClick}
          disabled={loading}
          className="w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : buttonLabel}
        </Button>
      </CardContent>
    </Card>
  );
}

function CheckupCard({
  done,
  loading,
  goftarId,
}: {
  done: boolean;
  loading: boolean;
  goftarId: string;
}) {
  const navigate = useNavigate();
  // TODO: student.exam.tsx doesn't yet read goftarId/count/autostart search
  // params — passing them here so it can pick them up when supported.
  return (
    <ActionCard
      emoji="🩺"
      title="چکاپ امروز"
      subtitle="۵ سؤال · ۳ دقیقه"
      tone="from-sky-100 to-violet-100 text-sky-600"
      done={done}
      loading={loading}
      buttonLabel="شروع چکاپ"
      Icon={Stethoscope}
      onClick={() => {
        const params: Record<string, string> = { count: "5", autostart: "1" };
        if (goftarId) params.goftarId = goftarId;
        const qs = new URLSearchParams(params).toString();
        void navigate({ to: `/student/exam?${qs}` as string });
      }}
    />
  );
}

function MissionCard({
  mission,
  loading,
  onOpen,
}: {
  mission: DailyMission | null;
  loading: boolean;
  onOpen: () => void;
}) {
  const done = Boolean(mission?.isComplete);
  const subtitle = mission
    ? `${toFa(mission.minutesDone)} از ${toFa(mission.targetMinutes)} دقیقه`
    : "در حال بارگذاری…";
  const title = mission?.title || "مأموریت امروز";
  return (
    <ActionCard
      emoji="📚"
      title={title}
      subtitle={done ? "انجام شد ✅" : subtitle}
      tone="from-emerald-100 to-teal-100 text-emerald-600"
      done={done}
      loading={loading && !mission}
      buttonLabel={done ? "انجام شد" : "شروع"}
      Icon={BookOpen}
      onClick={onOpen}
    />
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

          {err && (
            <p className="text-xs text-rose-600 text-right">خطا: {err}</p>
          )}
        </div>
        <DialogFooter className="sm:justify-start">
          <Button
            onClick={submit}
            disabled={saving}
            className="rounded-full bg-slate-900 hover:bg-slate-800 text-white"
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
            {mission?.title || "مأموریت امروز"}
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
            className="rounded-full bg-slate-900 hover:bg-slate-800 text-white"
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
