import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ClipboardList, ChevronRight, ChevronLeft as ChevronLeftIcon, CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  listSubjects,
  listChaptersBySubject,
  listGoftarsByChapter,
  searchQuestionBank,
  submitExam,
  type ContentQuestion,
  type ExamSubmitResult,
} from "@/lib/services/content-service";

interface ExamSearch {
  autostart?: string;
  count?: string;
  goftarId?: string;
}

export const Route = createFileRoute("/student/exam")({
  validateSearch: (search: Record<string, unknown>): ExamSearch => ({
    autostart: typeof search.autostart === "string" ? search.autostart : undefined,
    count: typeof search.count === "string" ? search.count : undefined,
    goftarId: typeof search.goftarId === "string" ? search.goftarId : undefined,
  }),
  component: ExamPage,
});

function StateBlock({
  loading,
  error,
  empty,
  emptyMessage,
}: {
  loading: boolean;
  error: boolean;
  empty: boolean;
  emptyMessage: string;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center text-slate-400 py-10">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="mr-2 text-sm">در حال دریافت…</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl p-4">
        دریافت با خطا روبه‌رو شد.
      </div>
    );
  }
  if (empty) {
    return (
      <div className="text-sm text-slate-500 bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center">
        {emptyMessage}
      </div>
    );
  }
  return null;
}

type Phase = "setup" | "taking" | "submitting" | "done";

const DIFFICULTY_OPTIONS = [
  { value: "mixed", label: "مخلوط" },
  { value: "easy", label: "آسان" },
  { value: "medium", label: "متوسط" },
  { value: "hard", label: "سخت" },
];

const COUNT_OPTIONS = [5, 10, 15, 20];

function ExamPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [subjectId, setSubjectId] = useState<string>("");

  const [chapterId, setChapterId] = useState<string>("");
  const [goftarId, setGoftarId] = useState<string>("");
  const [selectedCount, setSelectedCount] = useState<number>(10);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("mixed");

  const [phase, setPhase] = useState<Phase>("setup");
  const [questions, setQuestions] = useState<ContentQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<ExamSubmitResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const subjectsQ = useQuery({
    queryKey: ["content", "subjects"],
    queryFn: () => listSubjects(),
    staleTime: 5 * 60_000,
  });
  const chaptersQ = useQuery({
    queryKey: ["content", "chapters", subjectId],
    queryFn: () => listChaptersBySubject(subjectId),
    enabled: !!subjectId,
    staleTime: 5 * 60_000,
  });
  const goftarsQ = useQuery({
    queryKey: ["content", "goftars", chapterId],
    queryFn: () => listGoftarsByChapter(chapterId),
    enabled: !!chapterId,
    staleTime: 5 * 60_000,
  });

  const autostartedRef = useRef(false);
  useEffect(() => {
    if (autostartedRef.current) return;
    if (search.autostart !== "1") return;
    autostartedRef.current = true;
    const count = search.count ? Number(search.count) : 5;
    const safeCount = Number.isFinite(count) && count > 0 ? count : 5;
    setLoadingQuestions(true);
    setPhase("taking");
    searchQuestionBank({
      goftar_id: search.goftarId || undefined,
      count: safeCount,
    })
      .then((qs) => {
        setQuestions(qs);
        setCurrent(0);
        setAnswers({});
        setSubmitResult(null);
        setSubmitError(null);
      })
      .catch(() => {
        setQuestionsError("دریافت سؤالات با خطا روبه‌رو شد.");
        setPhase("setup");
      })
      .finally(() => setLoadingQuestions(false));
  }, [search.autostart, search.count, search.goftarId]);


  async function startExam() {
    if (!goftarId) return;
    setLoadingQuestions(true);
    setQuestionsError(null);
    try {
      const qs = await searchQuestionBank({
        subject_id: subjectId || undefined,
        chapter_id: chapterId || undefined,
        goftar_id: goftarId,
        count: selectedCount,
        difficulty:
          selectedDifficulty !== "mixed" ? selectedDifficulty : undefined,
      });
      setQuestions(qs);
      setCurrent(0);
      setAnswers({});
      setSubmitResult(null);
      setSubmitError(null);
      setPhase("taking");
    } catch {
      setQuestionsError("دریافت سؤالات با خطا روبه‌رو شد.");
    } finally {
      setLoadingQuestions(false);
    }
  }

  async function finishExam() {
    setPhase("submitting");
    setSubmitError(null);
    const studentId =
      (typeof window !== "undefined" &&
        window.localStorage.getItem("atomia_user_id")) ||
      "1";
    const payloadAnswers = questions.map((q) => ({
      questionId: q.id,
      answer: answers[q.id] ?? "",
    }));
    try {
      const result = await submitExam({
        studentId,
        answers: payloadAnswers,
      });
      setSubmitResult(result);
    } catch {
      setSubmitError("ثبت آزمون با خطا روبه‌رو شد.");
    } finally {
      setPhase("done");
    }
  }


  function resetToSetup() {
    setPhase("setup");
    setQuestions([]);
    setCurrent(0);
    setAnswers({});
    setSubmitResult(null);
    setSubmitError(null);
  }

  return (
    <div dir="rtl" className="font-vazir space-y-5">
      <header className="flex items-center gap-3">
        <span className="h-12 w-12 rounded-2xl bg-violet-100 text-violet-600 grid place-items-center">
          <ClipboardList className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">آزمون</h1>
          <p className="text-sm text-slate-500">
            درس، فصل و گفتار را انتخاب کن و آزمون را شروع کن.
          </p>
        </div>
      </header>

      {phase === "setup" && (
        <Card className="border-0 rounded-3xl shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-base text-slate-800">انتخاب محتوا</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <PickerRow
              label="درس"
              value={subjectId}
              onChange={(v) => {
                setSubjectId(v);
                setChapterId("");
                setGoftarId("");
              }}
              disabled={false}
              loading={subjectsQ.isLoading}
              options={(subjectsQ.data ?? []).map((s) => ({ id: s.id, title: s.title }))}
              placeholder="یک درس انتخاب کن"
            />
            <PickerRow
              label="فصل"
              value={chapterId}
              onChange={(v) => {
                setChapterId(v);
                setGoftarId("");
              }}
              disabled={!subjectId}
              loading={chaptersQ.isLoading}
              options={(chaptersQ.data ?? []).map((c) => ({ id: c.id, title: c.title }))}
              placeholder="یک فصل انتخاب کن"
            />
            <PickerRow
              label="گفتار"
              value={goftarId}
              onChange={setGoftarId}
              disabled={!chapterId}
              loading={goftarsQ.isLoading}
              options={(goftarsQ.data ?? []).map((g) => ({ id: g.id, title: g.title }))}
              placeholder="یک گفتار انتخاب کن"
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm text-slate-700">تعداد سؤال</Label>
                <Select
                  value={String(selectedCount)}
                  onValueChange={(v) => setSelectedCount(Number(v))}
                  dir="rtl"
                >
                  <SelectTrigger className="rounded-xl bg-white border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNT_OPTIONS.map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-slate-700">سطح سختی</Label>
                <Select
                  value={selectedDifficulty}
                  onValueChange={setSelectedDifficulty}
                  dir="rtl"
                >
                  <SelectTrigger className="rounded-xl bg-white border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTY_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {questionsError && (
              <div className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl p-3">
                {questionsError}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button
                onClick={startExam}
                disabled={!goftarId || loadingQuestions}
                className="rounded-full bg-violet-600 hover:bg-violet-700 text-white px-6"
              >
                {loadingQuestions ? (
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                ) : null}
                شروع آزمون
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === "taking" && loadingQuestions && (
        <Card className="border-0 rounded-3xl shadow-sm bg-white">
          <CardContent className="py-10 text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-violet-600 mx-auto" />
            <p className="text-sm text-slate-600">در حال آماده‌سازی سؤالات…</p>
          </CardContent>
        </Card>
      )}

      {phase === "taking" && !loadingQuestions && (
        <TakingView
          questions={questions}
          current={current}
          setCurrent={setCurrent}
          answers={answers}
          setAnswers={setAnswers}
          onFinish={finishExam}
          onExit={resetToSetup}
        />
      )}

      {phase === "submitting" && (
        <Card className="border-0 rounded-3xl shadow-sm bg-white">
          <CardContent className="py-10 text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-violet-600 mx-auto" />
            <p className="text-sm text-slate-600">در حال ثبت پاسخ‌ها…</p>
          </CardContent>
        </Card>
      )}

      {phase === "done" && (
        <Card className="border-0 rounded-3xl shadow-sm bg-white">
          <CardContent className="py-8 text-center space-y-4">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-emerald-100 text-emerald-600 grid place-items-center">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <p className="text-lg font-bold text-slate-800">آزمون تمام شد</p>

            {submitResult ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto pt-2">
                <ResultCell label="نمره" value={`${submitResult.score} از ${questions.length}`} />
                <ResultCell label="درصد" value={`${submitResult.percentage}٪`} />
                <ResultCell label="پاسخ درست" value={String(submitResult.correctCount)} tone="ok" />
                <ResultCell label="پاسخ غلط" value={String(submitResult.wrongCount)} tone="bad" />
                <ResultCell label="بدون پاسخ" value={String(submitResult.blankCount)} tone="muted" />
              </div>
            ) : null}

            {submitError && (
              <div className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl p-3 max-w-lg mx-auto">
                {submitError}
              </div>
            )}

            <div className="flex justify-center gap-2 pt-2">
              <Button
                variant="outline"
                onClick={resetToSetup}
                className="rounded-full"
              >
                آزمون جدید
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ResultCell({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "ok" | "bad" | "muted";
}) {
  const toneClass =
    tone === "ok"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "bad"
        ? "bg-rose-50 text-rose-700"
        : tone === "muted"
          ? "bg-slate-50 text-slate-600"
          : "bg-violet-50 text-violet-700";
  return (
    <div className={`rounded-2xl p-3 ${toneClass}`}>
      <p className="text-xs opacity-80">{label}</p>
      <p className="text-lg font-bold mt-1">{value}</p>
    </div>
  );
}

function PickerRow({
  label,
  value,
  onChange,
  disabled,
  loading,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  loading: boolean;
  options: { id: string; title: string }[];
  placeholder: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm text-slate-700">{label}</Label>
      <Select
        value={value || undefined}
        onValueChange={onChange}
        disabled={disabled || loading}
        dir="rtl"
      >
        <SelectTrigger className="rounded-xl bg-white border-slate-200">
          <SelectValue placeholder={loading ? "در حال بارگذاری…" : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.id} value={o.id}>
              {o.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function TakingView({
  questions,
  current,
  setCurrent,
  answers,
  setAnswers,
  onFinish,
  onExit,
}: {
  questions: ContentQuestion[];
  current: number;
  setCurrent: (n: number) => void;
  answers: Record<string, number | string>;
  setAnswers: (a: Record<string, number | string>) => void;
  onFinish: () => void;
  onExit: () => void;
}) {
  const total = questions.length;

  if (total === 0) {
    return (
      <Card className="border-0 rounded-3xl shadow-sm bg-white">
        <CardContent className="py-6 space-y-4">
          <StateBlock
            loading={false}
            error={false}
            empty
            emptyMessage="سؤالی برای این انتخاب پیدا نشد."
          />
          <div className="flex justify-end">
            <Button variant="outline" onClick={onExit} className="rounded-full">
              بازگشت
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const q = questions[current];
  const opts = useMemo(
    () =>
      [q.option1, q.option2, q.option3, q.option4]
        .map((text, idx) => ({ idx: idx + 1, text }))
        .filter((o) => o.text && o.text.trim().length > 0),
    [q],
  );
  const selected = answers[q.id];
  const isLast = current === total - 1;
  const isDescriptive =
    !!q.questionType && q.questionType.toLowerCase() !== "multiple_choice";
  const progress = Math.round(((current + 1) / total) * 100);

  function pick(idx: number) {
    setAnswers({ ...answers, [q.id]: idx });
  }

  function writeText(text: string) {
    setAnswers({ ...answers, [q.id]: text });
  }

  return (
    <Card className="border-0 rounded-3xl shadow-sm bg-white">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base text-slate-800">
            سؤال {current + 1} از {total}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onExit}
            className="text-slate-500 rounded-full"
          >
            خروج
          </Button>
        </div>
        <div className="pt-3">
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-base leading-8 font-medium text-slate-800 whitespace-pre-wrap">
          {q.questionText || "—"}
        </p>

        {isDescriptive ? (
          <Textarea
            dir="rtl"
            value={typeof selected === "string" ? selected : ""}
            onChange={(e) => writeText(e.target.value)}
            placeholder="پاسخ خود را اینجا بنویسید…"
            className="min-h-[140px] rounded-2xl border-slate-200 bg-white text-right leading-8"
          />
        ) : (
          <div className="grid gap-2">
            {opts.map((o) => {
              const isSel = selected === o.idx;
              return (
                <button
                  key={o.idx}
                  onClick={() => pick(o.idx)}
                  className={`text-right rounded-2xl border p-3 transition ${
                    isSel
                      ? "border-violet-400 bg-violet-50 text-violet-800"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-xs text-slate-400 ml-2">گزینه {o.idx}</span>
                  {o.text}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            className="rounded-full"
            disabled={current === 0}
            onClick={() => setCurrent(current - 1)}
          >
            <ChevronRight className="h-4 w-4 ml-1" />
            قبلی
          </Button>
          {isLast ? (
            <Button
              onClick={onFinish}
              className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              پایان آزمون
              <CheckCircle2 className="h-4 w-4 mr-1" />
            </Button>
          ) : (
            <Button
              onClick={() => setCurrent(current + 1)}
              className="rounded-full bg-violet-600 hover:bg-violet-700 text-white"
            >
              بعدی
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
