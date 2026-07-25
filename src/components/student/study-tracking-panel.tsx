import { useEffect, useMemo, useState } from "react";
import {
  Clock,
  Loader2,
  Play,
  Plus,
  RefreshCw,
  Square,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { STUDENT_BASE_URL } from "@/lib/api/config";
import { getAuthToken } from "@/lib/api/client";
import { listSubjects, listChaptersBySubject } from "@/lib/services/content-service";
import type { ContentSubject, ContentChapter } from "@/lib/services/content-service";

// ---------- Types ----------
type ActivityType =
  | "pre_study"
  | "same_day_study"
  | "homework"
  | "exam_prep"
  | "review"
  | "test_practice"
  | "troubleshooting"
  | "summary_mindmap"
  | "catch_up";

type StudyLog = {
  id: string | number;
  subject_id: string | number;
  subject_name?: string;
  chapter_id?: string | number | null;
  chapter_name?: string | null;
  goftar_id?: string | number | null;
  atom_id?: string | number | null;
  micro_atom_id?: string | number | null;
  study_date: string;
  duration_minutes: number;
  activity_type: string;
  notes?: string | null;
  goal_completion_percent?: number | null;
  learning_rating?: number | null;
  focus_rating?: number | null;
  needs_review?: boolean | null;
  question_count?: number | null;
  correct_count?: number | null;
  incorrect_count?: number | null;
  unanswered_count?: number | null;
  response_time_minutes?: number | null;
  error_reason?: string | null;
};

type StudyLogsResponse = {
  success?: boolean;
  summary?: {
    today_minutes?: number;
    week_minutes?: number;
    month_minutes?: number;
  };
  by_subject?: Array<{
    subject_id: string | number;
    subject_name: string;
    total_minutes: number;
  }>;
  logs?: StudyLog[];
};

// ---------- Helpers ----------
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function toJalaliShort(iso: string): string {
  if (!iso) return "";
  try {
    const d = new DateObject({
      date: new Date(iso),
      calendar: persian,
      locale: persian_fa,
    });
    return d.format("D MMMM") ?? iso.slice(5);
  } catch {
    return iso;
  }
}

function formatMMSS(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

async function xanoStudent<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const res = await fetch(`${STUDENT_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
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
  return data as T;
}

const ACTIVITY_TYPES_FA: Array<{ value: ActivityType; label: string }> = [
  { value: "pre_study", label: "پیش‌مطالعه" },
  { value: "same_day_study", label: "مطالعه درس همان روز" },
  { value: "homework", label: "تکلیف مدرسه" },
  { value: "exam_prep", label: "آمادگی آزمون" },
  { value: "review", label: "مرور" },
  { value: "test_practice", label: "تست‌زنی" },
  { value: "troubleshooting", label: "رفع اشکال" },
  { value: "summary_mindmap", label: "خلاصه‌نویسی یا مایندمپ" },
  { value: "catch_up", label: "جبران عقب‌ماندگی" },
];
const ACTIVITY_TYPES_EN: Array<{ value: ActivityType; label: string }> = [
  { value: "pre_study", label: "Pre-study" },
  { value: "same_day_study", label: "Same-day study" },
  { value: "homework", label: "Homework" },
  { value: "exam_prep", label: "Exam prep" },
  { value: "review", label: "Review" },
  { value: "test_practice", label: "Test practice" },
  { value: "troubleshooting", label: "Troubleshooting" },
  { value: "summary_mindmap", label: "Summary / mind map" },
  { value: "catch_up", label: "Catch-up" },
];

function activityLabel(fa: boolean, value: string): string {
  const list = fa ? ACTIVITY_TYPES_FA : ACTIVITY_TYPES_EN;
  return list.find((a) => a.value === value)?.label ?? value;
}

export function StudyTrackingPanel() {
  const { lang, dir } = useI18n();
  const { t: themeT } = useTheme();
  void themeT;
  const fa = lang === "fa";
  const ACTIVITIES = fa ? ACTIVITY_TYPES_FA : ACTIVITY_TYPES_EN;

  const [subjects, setSubjects] = useState<ContentSubject[]>([]);
  const [subjectId, setSubjectId] = useState<string>("");

  const [chapters, setChapters] = useState<ContentChapter[]>([]);
  const [chapterId, setChapterId] = useState<string>("");
  const [chaptersLoading, setChaptersLoading] = useState(false);

  const [duration, setDuration] = useState<number>(30);
  const [activityType, setActivityType] = useState<ActivityType>("same_day_study");
  const [date, setDate] = useState<string>(todayISO());
  const [note, setNote] = useState<string>("");
  const [dateObj, setDateObj] = useState<DateObject | null>(
    new DateObject({
      date: new Date(todayISO()),
      calendar: persian,
      locale: persian_fa,
    }),
  );

  // Timer state
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Feedback state
  const [completionPct, setCompletionPct] = useState(100);
  const [learningRating, setLearningRating] = useState<number | null>(null);
  const [focusRating, setFocusRating] = useState<number | null>(null);
  const [needsReview, setNeedsReview] = useState<boolean | null>(null);
  const [questionCount, setQuestionCount] = useState<string>("");
  const [correctCount, setCorrectCount] = useState<string>("");

  const [summary, setSummary] = useState<StudyLogsResponse["summary"]>({});
  const [bySubject, setBySubject] = useState<
    NonNullable<StudyLogsResponse["by_subject"]>
  >([]);
  const [logs, setLogs] = useState<StudyLog[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setDateObj(
      new DateObject({ date: new Date(date), calendar: persian, locale: persian_fa }),
    );
  }, [date]);

  // Timer tick
  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => {
      setTimerSeconds((s) => {
        const next = s + 1;
        setDuration(Math.max(1, Math.round(next / 60)));
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  const isTestActivity =
    activityType === "test_practice" || activityType === "exam_prep";

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const [subs, res] = await Promise.all([
        listSubjects().catch(() => [] as ContentSubject[]),
        xanoStudent<StudyLogsResponse>("/study-logs"),
      ]);
      setSubjects(subs);
      if (subs.length > 0 && !subjectId) setSubjectId(String(subs[0].id));
      setSummary(res?.summary ?? {});
      setBySubject(Array.isArray(res?.by_subject) ? res.by_subject : []);
      setLogs(Array.isArray(res?.logs) ? res.logs : []);
    } catch (err) {
      const msg = err instanceof Error && err.message ? err.message : "";
      setError(
        fa
          ? msg
            ? `دریافت اطلاعات مطالعه با خطا مواجه شد: ${msg}`
            : "دریافت اطلاعات مطالعه با خطا مواجه شد."
          : msg
            ? `Failed to load study data: ${msg}`
            : "Failed to load study data.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    setChapterId("");
    setChapters([]);
    if (!subjectId) return;

    setChaptersLoading(true);
    listChaptersBySubject(subjectId)
      .then((list) => {
        if (cancelled) return;
        const sorted = [...list].sort(
          (a, b) => (a.number ?? 0) - (b.number ?? 0),
        );
        setChapters(sorted);
      })
      .catch(() => {
        if (!cancelled) setChapters([]);
      })
      .finally(() => {
        if (!cancelled) setChaptersLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [subjectId]);

  async function addSession() {
    if (!subjectId || duration <= 0) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await xanoStudent("/study-logs", {
        method: "POST",
        body: JSON.stringify({
          subject_id: isNaN(Number(subjectId)) ? subjectId : Number(subjectId),
          chapter_id: chapterId
            ? isNaN(Number(chapterId))
              ? chapterId
              : Number(chapterId)
            : undefined,
          study_date: date,
          duration_minutes: duration,
          activity_type: activityType,
          notes: note.trim() || undefined,
          goal_completion_percent: completionPct,
          learning_rating: learningRating ?? undefined,
          focus_rating: focusRating ?? undefined,
          needs_review: needsReview ?? undefined,
          question_count:
            isTestActivity && questionCount ? Number(questionCount) : undefined,
          correct_count:
            isTestActivity && correctCount ? Number(correctCount) : undefined,
        }),
      });
      setNote("");
      setCompletionPct(100);
      setLearningRating(null);
      setFocusRating(null);
      setNeedsReview(null);
      setQuestionCount("");
      setCorrectCount("");
      setTimerRunning(false);
      setTimerSeconds(0);
      await loadAll();
    } catch (err) {
      const msg = err instanceof Error && err.message ? err.message : "";
      setSubmitError(
        fa
          ? msg
            ? `ثبت جلسه با خطا مواجه شد: ${msg}`
            : "ثبت جلسه با خطا مواجه شد."
          : msg
            ? `Failed to log session: ${msg}`
            : "Failed to log session.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const totals = useMemo(
    () => ({
      today: Number(summary?.today_minutes ?? 0),
      week: Number(summary?.week_minutes ?? 0),
      month: Number(summary?.month_minutes ?? 0),
    }),
    [summary],
  );

  const minLabel = fa ? "دوز" : "min";

  if (loading) {
    return (
      <div
        dir="rtl"
        className="min-h-[300px] grid place-items-center text-muted-foreground"
      >
        <div className="flex items-center gap-2 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          {fa ? "در حال دریافت اطلاعات..." : "Loading..."}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div dir="rtl" className="max-w-lg mx-auto">
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-sm text-rose-600">{error}</p>
            <Button onClick={loadAll} variant="secondary" className="gap-1.5">
              <RefreshCw className="h-4 w-4" />
              {fa ? "تلاش دوباره" : "Retry"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const ratingButton = (
    n: number,
    selected: number | null,
    onPick: (v: number | null) => void,
  ) => (
    <button
      key={n}
      type="button"
      onClick={() => onPick(selected === n ? null : n)}
      className={`h-9 w-9 rounded-md text-sm font-semibold border transition ${
        selected === n
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-muted text-foreground border-transparent hover:bg-muted/70"
      }`}
    >
      {n}
    </button>
  );

  return (
    <div dir="rtl" className="space-y-6 w-full text-right">
      <div className="grid sm:grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              {fa ? "امروز" : "Today"}
            </div>
            <p className="text-3xl font-extrabold mt-2">
              {totals.today}
              <span className="text-base font-medium text-muted-foreground">
                {" "}
                {minLabel}
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-success" />
              {fa ? "این هفته" : "This week"}
            </div>
            <p className="text-3xl font-extrabold mt-2">
              {totals.week}
              <span className="text-base font-medium text-muted-foreground">
                {" "}
                {minLabel}
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-warning" />
              {fa ? "این ماه" : "This month"}
            </div>
            <p className="text-3xl font-extrabold mt-2">
              {totals.month}
              <span className="text-base font-medium text-muted-foreground">
                {" "}
                {minLabel}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {bySubject.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {fa ? "به تفکیک درس" : "By subject"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {bySubject.map((b) => (
                <div
                  key={String(b.subject_id)}
                  className="flex items-center justify-between p-3 rounded-xl border bg-card"
                >
                  <span className="text-sm font-semibold">{b.subject_name}</span>
                  <span className="text-sm text-muted-foreground">
                    {b.total_minutes} {minLabel}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {fa ? "ثبت جلسهٔ مطالعه" : "Log a study session"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <div className="space-y-1.5 text-right">
              <Label>{fa ? "تاریخ" : "Date"}</Label>
              <DatePicker
                value={dateObj}
                onChange={(d: DateObject | null) => {
                  if (!d) return;
                  setDateObj(d);
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
            </div>
            <div className="space-y-1.5 text-right">
              <Label>{fa ? "درس" : "Subject"}</Label>
              <select
                dir="rtl"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm text-right"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
              >
                {subjects.length === 0 && (
                  <option value="">
                    {fa ? "درسی یافت نشد" : "No subjects"}
                  </option>
                )}
                {subjects.map((s) => (
                  <option key={s.id} value={String(s.id)}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 text-right">
              <Label>{fa ? "فصل (اختیاری)" : "Chapter (optional)"}</Label>
              <select
                dir="rtl"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm text-right disabled:opacity-50"
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
                disabled={!subjectId || chaptersLoading}
              >
                <option value="">
                  {chaptersLoading
                    ? fa
                      ? "در حال بارگذاری..."
                      : "Loading..."
                    : fa
                      ? "مرور کلی / بدون فصل"
                      : "General / no chapter"}
                </option>
                {chapters.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.number ? `${c.number}. ` : ""}
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 text-right">
              <Label>{fa ? "نوع فعالیت" : "Activity"}</Label>
              <select
                dir="rtl"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm text-right"
                value={activityType}
                onChange={(e) => setActivityType(e.target.value as ActivityType)}
              >
                {ACTIVITIES.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 text-right sm:col-span-2">
              <Label>{fa ? "مدت (دقیقه)" : "Duration (min)"}</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value) || 0)}
                  className="h-9 text-right"
                  dir="ltr"
                  disabled={timerRunning}
                />
                {!timerRunning && timerSeconds === 0 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="gap-1.5 shrink-0"
                    onClick={() => setTimerRunning(true)}
                  >
                    <Play className="h-4 w-4" />
                    {fa ? "شروع تایمر" : "Start timer"}
                  </Button>
                )}
                {timerRunning && (
                  <>
                    <span
                      dir="ltr"
                      className="text-sm font-mono tabular-nums px-2 py-1 rounded-md bg-primary/10 text-primary"
                    >
                      {formatMMSS(timerSeconds)}
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="gap-1.5 shrink-0"
                      onClick={() => {
                        setTimerRunning(false);
                        setDuration(Math.max(1, Math.round(timerSeconds / 60)));
                      }}
                    >
                      <Square className="h-4 w-4" />
                      {fa ? "پایان مطالعه" : "End session"}
                    </Button>
                  </>
                )}
                {!timerRunning && timerSeconds > 0 && (
                  <button
                    type="button"
                    onClick={() => setTimerSeconds(0)}
                    className="text-xs text-muted-foreground underline shrink-0"
                  >
                    {fa ? "ریست تایمر" : "Reset timer"}
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-1.5 text-right sm:col-span-2 lg:col-span-6">
              <Label>{fa ? "یادداشت (اختیاری)" : "Note (optional)"}</Label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={fa ? "مثلاً: تمرین‌های آخر فصل" : "e.g. End-of-chapter exercises"}
                className="h-9 text-right"
              />
            </div>
          </div>

          {/* Feedback sub-panel */}
          <div className="mt-5 rounded-xl border border-dashed p-4 space-y-4 bg-muted/20">
            <h4 className="text-sm font-semibold">
              {fa ? "بازخورد جلسه (اختیاری)" : "Session feedback (optional)"}
            </h4>

            <div className="space-y-1.5">
              <Label className="flex items-center justify-between">
                <span>{fa ? "درصد تکمیل هدف" : "Goal completion"}</span>
                <span className="text-sm font-semibold text-primary">
                  {completionPct}
                  {fa ? "٪" : "%"}
                </span>
              </Label>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={completionPct}
                onChange={(e) => setCompletionPct(Number(e.target.value))}
                className="w-full accent-primary"
                dir="ltr"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>{fa ? "میزان یادگیری" : "Learning"} (1-5)</Label>
                <div className="flex gap-1.5" dir="ltr">
                  {[1, 2, 3, 4, 5].map((n) =>
                    ratingButton(n, learningRating, setLearningRating),
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>{fa ? "میزان تمرکز" : "Focus"} (1-5)</Label>
                <div className="flex gap-1.5" dir="ltr">
                  {[1, 2, 3, 4, 5].map((n) =>
                    ratingButton(n, focusRating, setFocusRating),
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>{fa ? "نیاز به مرور دارد؟" : "Needs review?"}</Label>
              <div className="flex gap-2">
                {[
                  { v: true, label: fa ? "بله" : "Yes" },
                  { v: false, label: fa ? "خیر" : "No" },
                ].map((opt) => (
                  <button
                    key={String(opt.v)}
                    type="button"
                    onClick={() =>
                      setNeedsReview(needsReview === opt.v ? null : opt.v)
                    }
                    className={`h-9 px-4 rounded-md text-sm font-semibold border transition ${
                      needsReview === opt.v
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-foreground border-transparent hover:bg-muted/70"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {isTestActivity && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>{fa ? "تعداد سؤال" : "Question count"}</Label>
                  <Input
                    type="number"
                    min={0}
                    value={questionCount}
                    onChange={(e) => setQuestionCount(e.target.value)}
                    className="h-9 text-right"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{fa ? "تعداد پاسخ صحیح" : "Correct answers"}</Label>
                  <Input
                    type="number"
                    min={0}
                    value={correctCount}
                    onChange={(e) => setCorrectCount(e.target.value)}
                    className="h-9 text-right"
                    dir="ltr"
                  />
                </div>
              </div>
            )}
          </div>

          {submitError && (
            <p className="text-xs text-rose-600 mt-3">{submitError}</p>
          )}
          <div className="mt-4 flex justify-start">
            <Button
              onClick={addSession}
              disabled={submitting || !subjectId}
              className="rounded-full gap-1.5"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {fa ? "ثبت جلسه" : "Add session"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {fa ? "جلسات اخیر" : "Recent sessions"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {fa ? "هنوز جلسه‌ای ثبت نشده." : "No sessions logged yet."}
            </p>
          ) : (
            <div className="space-y-2">
              {logs.slice(0, 20).map((s) => {
                const feedbackParts: string[] = [];
                if (
                  s.goal_completion_percent !== null &&
                  s.goal_completion_percent !== undefined
                ) {
                  feedbackParts.push(
                    `${fa ? "تکمیل" : "Goal"}: ${s.goal_completion_percent}${fa ? "٪" : "%"}`,
                  );
                }
                if (s.learning_rating != null) {
                  feedbackParts.push(
                    `${fa ? "یادگیری" : "Learning"}: ${s.learning_rating}/5`,
                  );
                }
                if (s.focus_rating != null) {
                  feedbackParts.push(
                    `${fa ? "تمرکز" : "Focus"}: ${s.focus_rating}/5`,
                  );
                }
                return (
                  <div
                    key={String(s.id)}
                    className="flex items-center gap-3 p-3 rounded-xl border bg-card"
                  >
                    <div className="flex flex-col items-center w-24 shrink-0">
                      <span className="text-[10px] text-muted-foreground" dir="rtl">
                        {toJalaliShort(s.study_date)}
                      </span>
                      <span className="text-xs font-semibold">
                        {s.subject_name ?? ""}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">
                          {s.duration_minutes} {minLabel}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {s.needs_review === true && (
                            <Badge
                              variant="secondary"
                              className="border-0 bg-amber-500/15 text-amber-700"
                            >
                              {fa ? "نیاز به مرور" : "Needs review"}
                            </Badge>
                          )}
                          <Badge
                            variant="secondary"
                            className="border-0 bg-primary/10 text-primary"
                          >
                            {activityLabel(fa, s.activity_type)}
                          </Badge>
                        </div>
                      </div>
                      {s.chapter_name && (
                        <p className="text-[11px] text-muted-foreground">
                          {fa ? "فصل: " : "Chapter: "}
                          {s.chapter_name}
                        </p>
                      )}
                      {s.notes && (
                        <p className="text-[11px] text-muted-foreground truncate">
                          {s.notes}
                        </p>
                      )}
                      {feedbackParts.length > 0 && (
                        <p className="text-[11px] text-muted-foreground">
                          {feedbackParts.join(" · ")}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <p className="sr-only" dir={dir}>
        study tracking
      </p>
    </div>
  );
}
