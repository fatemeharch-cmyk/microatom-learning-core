import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Clock, Plus, Sparkles, Target, Timer, Trash2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/lib/i18n";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export const Route = createFileRoute("/student/tracking")({
  component: StudyTracking,
});

type Session = {
  id: string;
  date: string; // yyyy-mm-dd
  subject: string;
  planned: number; // minutes
  actual: number; // minutes
  note?: string;
};

const STORAGE_KEY = "ma_study_sessions";
const SUBJECTS_FA = ["ریاضی", "فیزیک", "شیمی", "زبان انگلیسی", "ادبیات", "زیست"];
const SUBJECTS_EN = ["Math", "Physics", "Chemistry", "English", "Literature", "Biology"];

function load(): Session[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session[]) : [];
  } catch {
    return [];
  }
}

function save(sessions: Session[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function StudyTracking() {
  const { t, lang, dir } = useI18n();
  const fa = lang === "fa";
  const SUBJECTS = fa ? SUBJECTS_FA : SUBJECTS_EN;

  const [sessions, setSessions] = useState<Session[]>([]);
  const [subject, setSubject] = useState<string>(SUBJECTS[0]);
  const [planned, setPlanned] = useState<number>(30);
  const [actual, setActual] = useState<number>(0);
  const [date, setDate] = useState<string>(todayISO());
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    setSessions(load());
  }, []);

  useEffect(() => {
    setSubject(SUBJECTS[0]);
  }, [lang]);

  const addSession = () => {
    if (!subject || planned <= 0) return;
    const s: Session = {
      id: crypto.randomUUID(),
      date,
      subject,
      planned,
      actual: Math.max(0, actual),
      note: note.trim() || undefined,
    };
    const next = [s, ...sessions];
    setSessions(next);
    save(next);
    setActual(0);
    setNote("");
  };

  const removeSession = (id: string) => {
    const next = sessions.filter((s) => s.id !== id);
    setSessions(next);
    save(next);
  };

  const totals = useMemo(() => {
    const today = todayISO();
    const todayList = sessions.filter((s) => s.date === today);
    const week = new Date();
    week.setDate(week.getDate() - 6);
    const weekIso = week.toISOString().slice(0, 10);
    const weekList = sessions.filter((s) => s.date >= weekIso);
    const sum = (arr: Session[], k: "planned" | "actual") =>
      arr.reduce((acc, s) => acc + s[k], 0);
    const tp = sum(todayList, "planned");
    const ta = sum(todayList, "actual");
    const wp = sum(weekList, "planned");
    const wa = sum(weekList, "actual");
    const adherence = wp > 0 ? Math.min(100, Math.round((wa / wp) * 100)) : 0;
    return { tp, ta, wp, wa, adherence };
  }, [sessions]);

  // Turbo recommendation based on adherence and per-subject gaps
  const recommendation = useMemo(() => {
    if (sessions.length === 0) {
      return fa
        ? "اولین جلسه‌ات رو ثبت کن تا توربو برنامه‌ت رو شخصی‌سازی کنه."
        : "Log your first session so Turbo can personalize your plan.";
    }
    // find the clearest consistency opportunity in the last 7 days
    const week = new Date();
    week.setDate(week.getDate() - 6);
    const weekIso = week.toISOString().slice(0, 10);
    const map = new Map<string, { p: number; a: number }>();
    sessions
      .filter((s) => s.date >= weekIso)
      .forEach((s) => {
        const cur = map.get(s.subject) ?? { p: 0, a: 0 };
        cur.p += s.planned;
        cur.a += s.actual;
        map.set(s.subject, cur);
      });
    let worst: { name: string; gap: number } | null = null;
    map.forEach((v, name) => {
      const gap = v.p - v.a;
      if (!worst || gap > worst.gap) worst = { name, gap };
    });
    const w = worst as { name: string; gap: number } | null;
    if (totals.adherence >= 90) {
      return fa
        ? `عالیه! پایبندی ${totals.adherence}٪. توربو شدت برنامه رو کمی بالا می‌بره.`
        : `Great! ${totals.adherence}% adherence. Turbo will slightly increase intensity.`;
    }
    if (w && w.gap > 15) {
      return fa
        ? `«${w.name}» فرصت خوبی برای تداوم بیشتر است. توربو یک بازه کوتاه و قابل‌انجام برای فردا اضافه می‌کند.`
        : `"${w.name}" is a good opportunity to build consistency. Turbo will add one manageable block tomorrow.`;
    }
    return fa
      ? `پایبندی ${totals.adherence}٪. توربو زمان جلسات رو کمی کوتاه‌تر می‌کنه تا تمرکزت بهتر بشه.`
      : `Adherence ${totals.adherence}%. Turbo will shorten sessions slightly to boost focus.`;
  }, [sessions, totals, fa]);

  const todayPct = totals.tp > 0 ? Math.min(100, Math.round((totals.ta / totals.tp) * 100)) : 0;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <Badge variant="secondary" className="mb-2">
          <Timer className="h-3 w-3 mx-1" />
          {fa ? "ردیابی مطالعه" : "Study Tracking"}
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight">
          {fa ? "دوز مطالعه‌ی تو" : "Your study time"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {fa
            ? "زمان برنامه‌ریزی‌شده و واقعی هر جلسه رو ثبت کن تا توربو برنامه‌ت رو دقیق‌تر کنه."
            : "Log planned vs actual time per session so Turbo can refine your plan."}
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              {fa ? "امروز" : "Today"}
            </div>
            <p className="text-3xl font-extrabold mt-2">
              {totals.ta}
              <span className="text-base font-medium text-muted-foreground">
                {" "}/ {totals.tp} {fa ? "دوز" : "min"}
              </span>
            </p>
            <Progress value={todayPct} className="mt-3" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-success" />
              {fa ? "این هفته" : "This week"}
            </div>
            <p className="text-3xl font-extrabold mt-2">
              {totals.wa}
              <span className="text-base font-medium text-muted-foreground">
                {" "}/ {totals.wp} {fa ? "دوز" : "min"}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {fa ? "مجموع جلسات هفت روز اخیر" : "Sum of sessions in last 7 days"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Target className="h-4 w-4 text-warning" />
              {fa ? "پایبندی به برنامه" : "Plan adherence"}
            </div>
            <p className="text-3xl font-extrabold mt-2">{totals.adherence}٪</p>
            <Progress value={totals.adherence} className="mt-3" />
          </CardContent>
        </Card>
      </div>

      {/* Turbo recommendation */}
      <Card className="border-primary/40 bg-primary/5">
        <CardContent className="p-5 flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground grid place-items-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">
               {fa ? "پیشنهاد توربو" : "Turbo Recommendation"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{recommendation}</p>
          </div>
        </CardContent>
      </Card>

      {/* Log session */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {fa ? "ثبت جلسه‌ی مطالعه" : "Log a study session"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="space-y-1.5">
              <Label>{fa ? "تاریخ" : "Date"}</Label>
              {fa ? (
                <DatePicker
                  value={new Date(date)}
                  onChange={(d: DateObject | null) => {
                    if (!d) return;
                    const js = d.toDate();
                    setDate(
                      `${js.getFullYear()}-${String(js.getMonth() + 1).padStart(2, "0")}-${String(js.getDate()).padStart(2, "0")}`,
                    );
                  }}
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  inputClass="flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 text-sm shadow-sm text-right"
                  containerClassName="w-full"
                  format="D MMMM YYYY"
                />
              ) : (
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  dir="ltr"
                />
              )}
            </div>
            <div className="space-y-1.5">
              <Label>{fa ? "درس" : "Subject"}</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>{fa ? "برنامه‌ریزی (دوز)" : "Planned (min)"}</Label>
              <Input
                type="number"
                min={1}
                value={planned}
                onChange={(e) => setPlanned(Number(e.target.value) || 0)}
                dir="ltr"
              />
            </div>
            <div className="space-y-1.5">
              <Label>{fa ? "واقعی (دوز)" : "Actual (min)"}</Label>
              <Input
                type="number"
                min={0}
                value={actual}
                onChange={(e) => setActual(Number(e.target.value) || 0)}
                dir="ltr"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
              <Label>{fa ? "یادداشت (اختیاری)" : "Note (optional)"}</Label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={fa ? "مثلاً: فصل ۲ تمرین‌ها" : "e.g. Ch.2 exercises"}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={addSession} className="rounded-full gap-1.5">
              <Plus className="h-4 w-4" />
              {fa ? "ثبت جلسه" : "Add session"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {fa ? "جلسات اخیر" : "Recent sessions"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {fa ? "هنوز جلسه‌ای ثبت نشده." : "No sessions logged yet."}
            </p>
          ) : (
            <div className="space-y-2">
              {sessions.slice(0, 12).map((s) => {
                const pct =
                  s.planned > 0 ? Math.min(100, Math.round((s.actual / s.planned) * 100)) : 0;
                const status =
                  pct >= 100
                    ? { label: fa ? "تکمیل" : "Complete", cls: "bg-success/15 text-success" }
                    : pct >= 60
                      ? { label: fa ? "نسبی" : "Partial", cls: "bg-warning/15 text-warning" }
                      : { label: fa ? "شروع خوب" : "Good start", cls: "bg-primary/15 text-primary" };
                return (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 p-3 rounded-xl border bg-card"
                  >
                    <div className="flex flex-col items-center w-14 shrink-0">
                      <span className="text-[10px] text-muted-foreground" dir="ltr">
                        {s.date.slice(5)}
                      </span>
                      <span className="text-xs font-semibold">{s.subject}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">
                          {s.actual} / {s.planned} {fa ? "دوز" : "min"} ({pct}٪)
                        </span>
                        <Badge variant="secondary" className={`border-0 ${status.cls}`}>
                          {status.label}
                        </Badge>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                      {s.note && (
                        <p className="text-[11px] text-muted-foreground mt-1 truncate">
                          {s.note}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSession(s.id)}
                      aria-label="delete"
                      className="rounded-full"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-[11px] text-muted-foreground" dir={dir}>
        {fa
          ? "داده‌ها به‌صورت محلی روی این دستگاه ذخیره می‌شود."
          : "Data is stored locally on this device."}
      </p>
    </div>
  );
}
