import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Sparkles, CheckCircle2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExamTakingView } from "@/components/student/exam-taking-view";
import {
  getSmartReview,
  submitSmartReview,
  type ContentQuestion,
  type ExamSubmitResult,
} from "@/lib/services/content-service";

export const Route = createFileRoute("/student/smart-review")({
  component: SmartReviewPage,
});

type Phase = "loading" | "unavailable" | "taking" | "submitting" | "done" | "error";

function SmartReviewPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("loading");
  const [questions, setQuestions] = useState<ContentQuestion[]>([]);
  const [message, setMessage] = useState<string>("");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [submitResult, setSubmitResult] = useState<ExamSubmitResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const cached =
          typeof window !== "undefined"
            ? window.sessionStorage.getItem("atomia_smart_review")
            : null;
        if (cached) {
          window.sessionStorage.removeItem("atomia_smart_review");
          const parsed = JSON.parse(cached) as {
            available: boolean;
            message?: string;
            questions: ContentQuestion[];
          };
          if (!alive) return;
          if (parsed.available && parsed.questions.length > 0) {
            setQuestions(parsed.questions);
            setPhase("taking");
          } else {
            setMessage(parsed.message || "نسخه هوشمندی در دسترس نیست.");
            setPhase("unavailable");
          }
          return;
        }
        const res = await getSmartReview();
        if (!alive) return;
        if (res.available && res.questions.length > 0) {
          setQuestions(res.questions);
          setPhase("taking");
        } else {
          setMessage(res.message || "نسخه هوشمندی در دسترس نیست.");
          setPhase("unavailable");
        }
      } catch {
        if (!alive) return;
        setPhase("error");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function finish() {
    setPhase("submitting");
    setSubmitError(null);
    const payloadAnswers = questions.map((q) => ({
      questionId: q.id,
      answer: answers[q.id] ?? "",
    }));
    try {
      const result = await submitSmartReview(payloadAnswers);
      setSubmitResult(result);
    } catch {
      setSubmitError("ثبت پاسخ‌ها با خطا روبه‌رو شد.");
    } finally {
      setPhase("done");
    }
  }


  return (
    <div dir="rtl" className="font-vazir space-y-5">
      <header className="flex items-center gap-3">
        <span className="h-12 w-12 rounded-2xl bg-violet-100 text-violet-600 grid place-items-center">
          <Sparkles className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">نسخه هوشمند</h1>
          <p className="text-sm text-slate-500">
            سؤالات اختصاصی بر اساس اشتباهات اخیر شما
          </p>
        </div>
      </header>

      {phase === "loading" && (
        <Card className="border-0 rounded-3xl shadow-sm bg-white">
          <CardContent className="py-10 text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-violet-600 mx-auto" />
            <p className="text-sm text-slate-600">در حال دریافت نسخه هوشمند…</p>
          </CardContent>
        </Card>
      )}

      {phase === "unavailable" && (
        <Card className="border-0 rounded-3xl shadow-sm bg-white">
          <CardContent className="py-8 text-center space-y-4">
            <p className="text-sm text-slate-700 leading-7">{message}</p>
            <div className="flex justify-center">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => navigate({ to: "/student" })}
              >
                بازگشت به داشبورد
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === "error" && (
        <Card className="border-0 rounded-3xl shadow-sm bg-white">
          <CardContent className="py-8 text-center space-y-4">
            <p className="text-sm text-rose-600">
              دریافت نسخه هوشمند با خطا روبه‌رو شد.
            </p>
            <div className="flex justify-center">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => navigate({ to: "/student" })}
              >
                بازگشت به داشبورد
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === "taking" && (
        <ExamTakingView
          questions={questions}
          current={current}
          setCurrent={setCurrent}
          answers={answers}
          setAnswers={setAnswers}
          onFinish={finish}
          onExit={() => navigate({ to: "/student" })}
          finishLabel="پایان مرور"
          showMeta
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
            <p className="text-lg font-bold text-slate-800">نسخه هوشمند تمام شد</p>

            {submitResult ? (
              <>
                {submitResult.learningHealthIncreased && (
                  <div className="mx-auto max-w-lg rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-center">
                    <p className="text-base font-extrabold text-emerald-700">
                      🎉 تبریک!
                    </p>
                    <p className="text-sm text-emerald-700 mt-1 leading-7">
                      شاخص سلامت یادگیری شما افزایش پیدا کرد.
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto pt-2">
                  <ResultCell label="درصد" value={`${submitResult.percentage}٪`} />
                  <ResultCell
                    label="تعداد صحیح"
                    value={String(submitResult.correctCount)}
                    tone="ok"
                  />
                  <ResultCell
                    label="تعداد غلط"
                    value={String(submitResult.wrongCount)}
                    tone="bad"
                  />
                  {submitResult.learningHealth !== undefined && (
                    <ResultCell
                      label="شاخص سلامت یادگیری"
                      value={String(submitResult.learningHealth)}
                    />
                  )}
                </div>
              </>
            ) : null}

            {submitError && (
              <div className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl p-3 max-w-lg mx-auto">
                {submitError}
              </div>
            )}

            <div className="flex justify-center gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => navigate({ to: "/student" })}
                className="rounded-full"
              >
                بازگشت به داشبورد
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
