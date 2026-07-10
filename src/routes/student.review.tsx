import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Loader2, Sparkles, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import {
  listSubjects,
  searchQuestionBank,
  submitExam,
  type ContentQuestion,
  type QuestionBankFilters,
} from "@/lib/services/content-service";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/student/review")({
  head: () => ({
    meta: [
      { title: "مرور هوشمند — آتومیا" },
      { name: "description", content: "۵ سؤال هوشمند بر اساس نقاط ضعف شما." },
    ],
  }),
  component: ReviewPage,
});

function toFa(n: number | string): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

type LastExam = {
  title?: string;
  percent?: number;
  date?: string;
  subjectId?: string | number;
  chapterId?: string | number;
  goftarId?: string | number;
  wrongQuestionIds?: (string | number)[];
  weakMicroAtomIds?: (string | number)[];
  weakestGoftarId?: string | number;
  difficulty?: string;
} | null;

function readLastExam(): LastExam {
  try {
    const raw = localStorage.getItem("atomia_last_exam");
    if (raw) return JSON.parse(raw) as LastExam;
  } catch {
    // ignore
  }
  return null;
}

async function fetchAdaptiveQuestions(): Promise<ContentQuestion[]> {
  const last = readLastExam();
  const attempts: QuestionBankFilters[] = [];

  // Priority 1 & 2 & 3 — narrow by weak scope from last exam
  if (last?.goftarId || last?.weakestGoftarId) {
    attempts.push({
      goftar_id: last.goftarId ?? last.weakestGoftarId,
      question_count: 5,
      difficulty: last.difficulty ?? "medium",
    });
  }
  if (last?.chapterId) {
    attempts.push({
      chapter_id: last.chapterId,
      question_count: 5,
      difficulty: "medium",
    });
  }
  if (last?.subjectId) {
    attempts.push({
      subject_id: last.subjectId,
      question_count: 5,
      difficulty: "medium",
    });
  }

  // Priority 4 — fallback: first available subject, random
  attempts.push({ question_count: 5 });

  for (const filters of attempts) {
    try {
      const res = await searchQuestionBank(filters);
      if (res.length > 0) return res.slice(0, 5);
    } catch {
      // try next
    }
  }

  // Last-resort fallback: pick first subject and try again
  try {
    const subjects = await listSubjects();
    const first = subjects[0];
    if (first) {
      const res = await searchQuestionBank({
        subject_id: first.id,
        question_count: 5,
      });
      return res.slice(0, 5);
    }
  } catch {
    // ignore
  }
  return [];
}

type Phase = "loading" | "taking" | "submitting" | "done" | "empty";

function ReviewPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const studentId = user?.id ?? "";

  const [phase, setPhase] = useState<Phase>("loading");
  const [questions, setQuestions] = useState<ContentQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    score: number;
    percentage: number;
    correctCount: number;
    wrongCount: number;
    blankCount: number;
  } | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setPhase("loading");
      setError(null);
      try {
        const qs = await fetchAdaptiveQuestions();
        if (!alive) return;
        if (qs.length === 0) {
          setPhase("empty");
        } else {
          setQuestions(qs);
          setPhase("taking");
        }
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : String(e));
        setPhase("empty");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const q = questions[current];
  const total = questions.length;
  const progress = total ? Math.round(((current + 1) / total) * 100) : 0;

  const finish = async () => {
    if (!studentId) {
      setError("برای ثبت پاسخ‌ها ابتدا وارد شوید.");
      return;
    }
    setPhase("submitting");
    setError(null);
    try {
      const payload = {
        studentId,
        answers: questions.map((qq) => ({
          questionId: qq.id,
          answer: answers[qq.id] ?? "",
        })),
      };
      const r = await submitExam(payload);
      setResult({
        score: r.score,
        percentage: r.percentage,
        correctCount: r.correctCount,
        wrongCount: r.wrongCount,
        blankCount: r.blankCount,
      });
      setPhase("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setPhase("taking");
    }
  };

  const options = useMemo(
    () =>
      q
        ? [
            { n: 1, text: q.option1 },
            { n: 2, text: q.option2 },
            { n: 3, text: q.option3 },
            { n: 4, text: q.option4 },
          ].filter((o) => o.text)
        : [],
    [q],
  );

  return (
    <div dir="rtl" className="max-w-3xl mx-auto space-y-5 pb-10">
      {/* Header */}
      <section className="relative overflow-hidden rounded-[28px] p-6 text-white shadow-lg bg-gradient-to-br from-violet-600 via-violet-500 to-fuchsia-500">
        <div className="flex items-center gap-3">
          <span className="h-11 w-11 rounded-2xl grid place-items-center bg-white/20 backdrop-blur">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="text-right">
            <h1 className="text-xl md:text-2xl font-extrabold">مرور هوشمند</h1>
            <p className="text-xs md:text-sm text-white/85 mt-1">
              ۵ سؤال منتخب آتومیا بر اساس نقاط ضعف شما
            </p>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 text-right">
          {error}
        </div>
      )}

      {phase === "loading" && (
        <Card className="border-0 rounded-[22px] shadow-sm">
          <CardContent className="p-10 flex items-center justify-center text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="mr-2 text-sm">در حال آماده‌سازی سؤال‌ها…</span>
          </CardContent>
        </Card>
      )}

      {phase === "empty" && (
        <Card className="border-0 rounded-[22px] shadow-sm">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-sm text-slate-600 leading-7">
              فعلاً سؤالی برای مرور یافت نشد. ابتدا یک چکاپ کوتاه انجام بده تا
              آتومیا نقاط ضعفت را بشناسد.
            </p>
            <Button
              onClick={() => void navigate({ to: "/student/exam" })}
              className="rounded-full bg-violet-600 hover:bg-violet-700 text-white font-semibold"
            >
              رفتن به چکاپ
            </Button>
          </CardContent>
        </Card>
      )}

      {(phase === "taking" || phase === "submitting") && q && (
        <Card className="border-0 rounded-[22px] shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{toFa(progress)}٪</span>
              <span>
                سؤال {toFa(current + 1)} از {toFa(total)}
              </span>
            </div>
            <Progress value={progress} className="h-2" />

            <p className="text-right text-slate-800 font-semibold leading-8 text-[15px]">
              {q.questionText}
            </p>

            {q.questionType === "multiple_choice" || options.length > 0 ? (
              <div className="space-y-2">
                {options.map((o) => {
                  const selected = answers[q.id] === o.n;
                  return (
                    <button
                      key={o.n}
                      type="button"
                      onClick={() =>
                        setAnswers((a) => ({ ...a, [q.id]: o.n }))
                      }
                      className={
                        "w-full text-right rounded-2xl border px-4 py-3 text-sm transition " +
                        (selected
                          ? "bg-violet-50 border-violet-400 text-violet-800 font-semibold"
                          : "bg-white border-slate-200 hover:border-violet-300 text-slate-700")
                      }
                    >
                      {o.text}
                    </button>
                  );
                })}
              </div>
            ) : (
              <Textarea
                dir="rtl"
                rows={4}
                value={String(answers[q.id] ?? "")}
                onChange={(e) =>
                  setAnswers((a) => ({ ...a, [q.id]: e.target.value }))
                }
                placeholder="پاسخ خود را بنویسید…"
              />
            )}

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                disabled={current === 0 || phase === "submitting"}
                className="rounded-full"
              >
                <ChevronRight className="h-4 w-4 ml-1" />
                قبلی
              </Button>
              {current < total - 1 ? (
                <Button
                  onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}
                  disabled={phase === "submitting"}
                  className="rounded-full bg-violet-600 hover:bg-violet-700 text-white"
                >
                  بعدی
                  <ChevronLeft className="h-4 w-4 mr-1" />
                </Button>
              ) : (
                <Button
                  onClick={() => void finish()}
                  disabled={phase === "submitting"}
                  className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {phase === "submitting" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                      در حال ثبت…
                    </>
                  ) : (
                    "پایان و ثبت"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {phase === "done" && result && (
        <Card className="border-0 rounded-[22px] shadow-sm">
          <CardContent className="p-6 space-y-4 text-right">
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
              <p className="font-bold">مرور کامل شد</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Stat label="درصد" value={`${toFa(result.percentage)}٪`} />
              <Stat label="امتیاز" value={toFa(result.score)} />
              <Stat label="پاسخ درست" value={toFa(result.correctCount)} />
              <Stat label="پاسخ نادرست" value={toFa(result.wrongCount)} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => void navigate({ to: "/student" })}
                variant="outline"
                className="rounded-full"
              >
                بازگشت به کلینیک
              </Button>
              <Button
                onClick={() => void navigate({ to: "/student/health-report" })}
                className="rounded-full bg-violet-600 hover:bg-violet-700 text-white"
              >
                مشاهده پرونده سلامت
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3 text-center">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="text-lg font-extrabold text-slate-800 mt-1">{value}</p>
    </div>
  );
}
