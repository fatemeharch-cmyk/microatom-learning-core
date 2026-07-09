import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
  listAtomsByGoftar,
  listMicroAtomsByAtom,
  listQuestionsByMicroAtom,
  type ContentQuestion,
} from "@/lib/services/content-service";

export const Route = createFileRoute("/student/exam")({
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

type Phase = "setup" | "taking" | "done";

function ExamPage() {
  const [subjectId, setSubjectId] = useState<string>("");
  const [chapterId, setChapterId] = useState<string>("");
  const [goftarId, setGoftarId] = useState<string>("");
  const [atomId, setAtomId] = useState<string>("");
  const [microId, setMicroId] = useState<string>("");

  const [phase, setPhase] = useState<Phase>("setup");
  const [questions, setQuestions] = useState<ContentQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionsError, setQuestionsError] = useState<string | null>(null);

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
  const atomsQ = useQuery({
    queryKey: ["content", "atoms", goftarId],
    queryFn: () => listAtomsByGoftar(goftarId),
    enabled: !!goftarId,
    staleTime: 5 * 60_000,
  });
  const microsQ = useQuery({
    queryKey: ["content", "micros", atomId],
    queryFn: () => listMicroAtomsByAtom(atomId),
    enabled: !!atomId,
    staleTime: 5 * 60_000,
  });

  async function startExam() {
    if (!microId) return;
    setLoadingQuestions(true);
    setQuestionsError(null);
    try {
      const qs = await listQuestionsByMicroAtom(microId);
      setQuestions(qs);
      setCurrent(0);
      setAnswers({});
      setPhase("taking");
    } catch {
      setQuestionsError("دریافت سؤالات با خطا روبه‌رو شد.");
    } finally {
      setLoadingQuestions(false);
    }
  }

  function resetToSetup() {
    setPhase("setup");
    setQuestions([]);
    setCurrent(0);
    setAnswers({});
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
            درس، فصل و میکرواتم را انتخاب کن و آزمون را شروع کن.
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
                setAtomId("");
                setMicroId("");
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
                setAtomId("");
                setMicroId("");
              }}
              disabled={!subjectId}
              loading={chaptersQ.isLoading}
              options={(chaptersQ.data ?? []).map((c) => ({ id: c.id, title: c.title }))}
              placeholder="یک فصل انتخاب کن"
            />
            <PickerRow
              label="گفتار"
              value={goftarId}
              onChange={(v) => {
                setGoftarId(v);
                setAtomId("");
                setMicroId("");
              }}
              disabled={!chapterId}
              loading={goftarsQ.isLoading}
              options={(goftarsQ.data ?? []).map((g) => ({ id: g.id, title: g.title }))}
              placeholder="یک گفتار انتخاب کن"
            />
            <PickerRow
              label="اتم"
              value={atomId}
              onChange={(v) => {
                setAtomId(v);
                setMicroId("");
              }}
              disabled={!goftarId}
              loading={atomsQ.isLoading}
              options={(atomsQ.data ?? []).map((a) => ({ id: a.id, title: a.title }))}
              placeholder="یک اتم انتخاب کن"
            />
            <PickerRow
              label="میکرواتم"
              value={microId}
              onChange={setMicroId}
              disabled={!atomId}
              loading={microsQ.isLoading}
              options={(microsQ.data ?? []).map((m) => ({ id: m.id, title: m.title }))}
              placeholder="یک میکرواتم انتخاب کن"
            />

            {questionsError && (
              <div className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl p-3">
                {questionsError}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button
                onClick={startExam}
                disabled={!microId || loadingQuestions}
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

      {phase === "taking" && (
        <TakingView
          questions={questions}
          current={current}
          setCurrent={setCurrent}
          answers={answers}
          setAnswers={setAnswers}
          onFinish={() => setPhase("done")}
          onExit={resetToSetup}
        />
      )}

      {phase === "done" && (
        <Card className="border-0 rounded-3xl shadow-sm bg-white">
          <CardContent className="py-10 text-center space-y-4">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-emerald-100 text-emerald-600 grid place-items-center">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <p className="text-lg font-bold text-slate-800">آزمون تمام شد</p>
            <p className="text-sm text-slate-500">
              پاسخ‌های شما ثبت شده. تحلیل و امتیازدهی در گام بعدی اضافه می‌شود.
            </p>
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
            emptyMessage="هنوز سؤالی برای این میکرواتم ثبت نشده است."
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

  function pick(idx: number) {
    setAnswers({ ...answers, [q.id]: idx });
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
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-base leading-8 font-medium text-slate-800 whitespace-pre-wrap">
          {q.questionText || "—"}
        </p>

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
