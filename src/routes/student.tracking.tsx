import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Clock,
  Loader2,
  Plus,
  RefreshCw,
  Timer,
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

export const Route = createFileRoute("/student/tracking")({
  component: StudyTracking,
});

// ---------- Types ----------
type ActivityType = "study" | "review" | "homework" | "test";

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
  { value: "study", label: "مطالعه" },
  { value: "review", label: "مرور" },
  { value: "homework", label: "تکلیف" },
  { value: "test", label: "آزمونک" },
];
const ACTIVITY_TYPES_EN: Array<{ value: ActivityType; label: string }> = [
  { value: "study", label: "Study" },
  { value: "review", label: "Review" },
  { value: "homework", label: "Homework" },
  { value: "test", label: "Quiz" },
];

function activityLabel(fa: boolean, value: string): string {
  const list = fa ? ACTIVITY_TYPES_FA : ACTIVITY_TYPES_EN;
  return list.find((a) => a.value === value)?.label ?? value;
}

function StudyTracking() {
  const { lang, dir } = useI18n();
  const { t: themeT } = useTheme();
  const studyTimeLabel = themeT("study_time", "دوز مطالعه");
  const fa = lang === "fa";
  const ACTIVITIES = fa ? ACTIVITY_TYPES_FA : ACTIVITY_TYPES_EN;

  const [subjects, setSubjects] = useState<ContentSubject[]>([]);
  const [subjectId, setSubjectId] = useState<string>("");

  // ---- NEW: chapter state ----
  const [chapters, setChapters] = useState<ContentChapter[]>([]);
  const [chapterId, setChapterId] = useState<string>("");
  const [chaptersLoading, setChaptersLoading] = useState(false);

  const [duration, setDuration] = useState<number>(30);
  const [activityType, setActivityType] = useState<ActivityType>("study");
  const [date, setDate] = useState<string>(todayISO());
  const [note, setNote] = useState<string>("");
  const [dateObj, setDateObj] = useState<DateObject | null>(
    new DateObject({
      date: new Date(todayISO()),
      calendar: persian,
      locale: persian_fa,
    }),
  );

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

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const [subs, res] = await Promise.all([
        listSubjects().catch(() => [] as ContentSubject[]),
        xanoStudent<StudyLogsResponse>("/student/study-logs"),
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

  // ---- NEW: whenever the selected subject changes, load its chapters ----
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
      await xanoStudent("/student/study-logs", {
        method: "POST",
        body: JSON.stringify({
          subject_id: isNaN(Number(subjectId)) ? subjectId : Number(subjectId),
          // ---- NEW: send chapter_id when one is selected ----
          chapter_id: chapterId
            ? isNaN(Number(chapterId))
              ? chapterId
              : Number(chapterId)
            : undefined,
          study_date: date,
          duration_minutes: duration,
          activity_type: activityType,
          notes: note.trim() || undefined,
        }),
      });
      setNote("");
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

  return (
    <div dir="rtl" className="space-y-6 w-full text-right">
      <div>
        <Badge variant="secondary" className="mb-2">
          <Timer className="h-3 w-3 mx-1" />
          {fa ? "ردیابی مطالعه" : "Study Tracking"}
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight">
          {fa ? `${studyTimeLabel}‌ی تو` : "Your study time"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {fa
            ? "هر جلسهٔ مطالعه‌ت رو به همراه فصلش ثبت کن تا خلاصهٔ روز، هفته و ماه رو ببینی."
            : "Log each study session with its chapter to see today, this week, and this month."}
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

      {/* Per-subject breakdown */}
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

      {/* Log session */}
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

            {/* ---- NEW: chapter selector, dependent on subject ---- */}
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
            <div className="space-y-1.5 text-right">
              <Label>{fa ? "مدت (دقیقه)" : "Duration (min)"}</Label>
              <Input
                type="number"
                min={1}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value) || 0)}
                className="h-9 text-right"
                dir="ltr"
              />
            </div>
            <div className="space-y-1.5 text-right">
              <Label>{fa ? "یادداشت (اختیاری)" : "Note (optional)"}</Label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={fa ? "مثلاً: تمرین‌های آخر فصل" : "e.g. End-of-chapter exercises"}
                className="h-9 text-right"
              />
            </div>
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

      {/* History */}
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
              {logs.slice(0, 20).map((s) => (
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
                      <Badge
                        variant="secondary"
                        className="border-0 bg-primary/10 text-primary"
                      >
                        {activityLabel(fa, s.activity_type)}
                      </Badge>
                    </div>
                    {/* ---- NEW: show chapter name when the backend returns one ---- */}
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
                  </div>
                </div>
              ))}
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
