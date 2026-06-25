/**
 * Exam runner + review.
 *
 * Flow:
 *  - "idle": show a start button.
 *  - "taking": POST /exam/session/create, walk through questions,
 *    POST /exam/answer/submit per question, keep a local log.
 *  - "review": POST /exam/result + POST /exam/recommendation, render
 *    a full Persian RTL review with score, weak concepts,
 *    recommendations and per-question feedback.
 *
 * The backend already returns `correct_answer` from /exam/answer/submit,
 * so we never invent answers on the client and never reveal them before
 * the student submits.
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { apiClient, ApiError } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import {
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  BookOpen,
  RefreshCw,
} from "lucide-react";

interface ExamQuestion {
  question_id: string | number;
  question?: string;
  text?: string;
  concept?: string;
  micro_atoms_id?: string | number;
  difficulty?: string | number;
}

interface CreateSessionResponse {
  exam_id: string | number;
  questions: ExamQuestion[];
}

interface SubmitAnswerResponse {
  exam_id: string | number;
  question_id: string | number;
  is_correct: boolean;
  score?: number;
  match_type?: string;
  correct_answer?: string;
}

interface ExamResultResponse {
  score?: number;
  weak_concepts?: string[];
  answers?: unknown[];
}

interface RecommendationResponse {
  recommendations?: Array<
    | string
    | { title?: string; description?: string; micro_atoms_id?: string | number }
  >;
}

interface LocalAnswerLog {
  question_id: string | number;
  question_text: string;
  student_answer: string;
  submit_result: SubmitAnswerResponse | null;
  correct_answer?: string;
  is_correct: boolean;
  match_type?: string;
  concept?: string;
  difficulty?: string | number;
}

type Phase = "idle" | "taking" | "review";

function getQuestionText(q: ExamQuestion): string {
  return q.question ?? q.text ?? "—";
}

export function ExamRunner() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [examId, setExamId] = useState<string | number | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [draft, setDraft] = useState("");
  const [log, setLog] = useState<LocalAnswerLog[]>([]);
  const [result, setResult] = useState<ExamResultResponse | null>(null);
  const [recs, setRecs] = useState<RecommendationResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startExam() {
    setBusy(true);
    setError(null);
    try {
      const res = await apiClient.post<CreateSessionResponse>(
        endpoints.exams.sessionCreate,
      );
      setExamId(res.data.exam_id);
      setQuestions(res.data.questions ?? []);
      setCurrentIdx(0);
      setDraft("");
      setLog([]);
      setResult(null);
      setRecs(null);
      setPhase("taking");
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "خطا در شروع چکاب.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  async function submitCurrent() {
    if (!examId) return;
    const q = questions[currentIdx];
    if (!q) return;
    const studentAnswer = draft.trim();
    if (!studentAnswer) {
      setError("لطفاً پاسخ خود را وارد کنید.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await apiClient.post<SubmitAnswerResponse>(
        endpoints.exams.answerSubmit,
        {
          exam_id: examId,
          question_id: q.question_id,
          answer: studentAnswer,
          micro_atoms_id: q.micro_atoms_id,
        },
      );
      const entry: LocalAnswerLog = {
        question_id: q.question_id,
        question_text: getQuestionText(q),
        student_answer: studentAnswer,
        submit_result: res.data,
        correct_answer: res.data.correct_answer,
        is_correct: !!res.data.is_correct,
        match_type: res.data.match_type,
        concept: q.concept,
        difficulty: q.difficulty,
      };
      const nextLog = [...log, entry];
      setLog(nextLog);
      setDraft("");

      if (currentIdx + 1 >= questions.length) {
        await finishExam(nextLog);
      } else {
        setCurrentIdx(currentIdx + 1);
      }
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "خطا در ثبت پاسخ.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  async function finishExam(_finalLog: LocalAnswerLog[]) {
    if (!examId) return;
    setBusy(true);
    try {
      const [resultRes, recRes] = await Promise.allSettled([
        apiClient.post<ExamResultResponse>(endpoints.exams.result, {
          exam_id: examId,
        }),
        apiClient.post<RecommendationResponse>(endpoints.exams.recommendation, {
          exam_id: examId,
        }),
      ]);
      if (resultRes.status === "fulfilled") setResult(resultRes.value.data);
      if (recRes.status === "fulfilled") setRecs(recRes.value.data);
      setPhase("review");
    } finally {
      setBusy(false);
    }
  }

  function restart() {
    setPhase("idle");
    setExamId(null);
    setQuestions([]);
    setLog([]);
    setResult(null);
    setRecs(null);
    setDraft("");
    setError(null);
  }

  // ---------- render ----------

  if (phase === "idle") {
    return (
      <Card dir="rtl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> شروع چکاب تمرینی
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            پس از پایان چکاب، صفحه‌ی بازبینی کامل با پاسخ مرجع کتاب نمایش داده می‌شود.
          </p>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button onClick={startExam} disabled={busy} className="rounded-full">
            {busy ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : null}
            شروع چکاب
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (phase === "taking") {
    const q = questions[currentIdx];
    const total = questions.length;
    const progress = total > 0 ? ((currentIdx) / total) * 100 : 0;
    return (
      <Card dir="rtl">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              سؤال {currentIdx + 1} از {total}
            </CardTitle>
            <Badge variant="secondary">در حال چکاب</Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-base leading-7 font-medium">
            {q ? getQuestionText(q) : "—"}
          </p>
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="پاسخ خود را اینجا بنویسید…"
            rows={5}
            dir="rtl"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Button onClick={submitCurrent} disabled={busy} className="rounded-full">
              {busy ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : null}
              {currentIdx + 1 >= total ? "پایان چکاب" : "ثبت و سؤال بعدی"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // review
  const total = log.length;
  const correctCount = log.filter((l) => l.is_correct).length;
  const pct =
    typeof result?.score === "number"
      ? Math.round(result.score)
      : total > 0
        ? Math.round((correctCount / total) * 100)
        : 0;

  return (
    <div dir="rtl" className="space-y-4">
      {/* A — Score summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">نتیجه چکاب</CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={restart}
            className="rounded-full"
          >
            <RefreshCw className="h-4 w-4 ml-2" /> چکاب جدید
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-muted/40">
              <p className="text-xs text-muted-foreground">تعداد سؤال</p>
              <p className="text-xl font-bold">{total}</p>
            </div>
            <div className="p-3 rounded-xl bg-success/10">
              <p className="text-xs text-muted-foreground">پاسخ درست</p>
              <p className="text-xl font-bold text-success">{correctCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10">
              <p className="text-xs text-muted-foreground">درصد</p>
              <p className="text-xl font-bold text-primary">{pct}٪</p>
            </div>
          </div>
          <Progress value={pct} className="h-2" />
        </CardContent>
      </Card>

      {/* B — Weak concepts */}
      {result?.weak_concepts && result.weak_concepts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" /> مفاهیم نیازمند مرور
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {result.weak_concepts.map((c, i) => (
              <Badge
                key={i}
                className="bg-warning/15 text-warning border-warning/30"
              >
                {c}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {/* C — Recommendations */}
      {recs?.recommendations && recs.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> پیشنهادهای یادگیری
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recs.recommendations.map((r, i) => {
              if (typeof r === "string") {
                return (
                  <div key={i} className="p-3 rounded-xl bg-accent/30 text-sm">
                    {r}
                  </div>
                );
              }
              return (
                <div key={i} className="p-3 rounded-xl bg-accent/30 text-sm">
                  {r.title && <p className="font-medium">{r.title}</p>}
                  {r.description && (
                    <p className="text-muted-foreground mt-1">{r.description}</p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* D — Per-question review */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold">بازبینی پاسخ‌ها</h3>
        {log.map((l, idx) => (
          <Card key={idx} className="border-r-4" >
            <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
              <CardTitle className="text-sm leading-6 flex-1">
                {idx + 1}. {l.question_text}
              </CardTitle>
              {l.is_correct ? (
                <Badge className="bg-success/15 text-success border-success/30 shrink-0">
                  <CheckCircle2 className="h-3 w-3 ml-1" /> درست
                </Badge>
              ) : (
                <Badge className="bg-destructive/15 text-destructive border-destructive/30 shrink-0">
                  <AlertTriangle className="h-3 w-3 ml-1" /> نیاز به مرور
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="p-2 rounded-lg bg-muted/40">
                <p className="text-xs text-muted-foreground mb-1">پاسخ شما</p>
                <p className="whitespace-pre-wrap">{l.student_answer || "—"}</p>
              </div>
              <div
                className={
                  "p-2 rounded-lg " +
                  (l.is_correct ? "bg-success/10" : "bg-warning/10")
                }
              >
                <p className="text-xs text-muted-foreground mb-1">
                  پاسخ مرجع کتاب
                </p>
                {l.correct_answer ? (
                  <p className="whitespace-pre-wrap">{l.correct_answer}</p>
                ) : (
                  <p className="text-muted-foreground">
                    پاسخ مرجع برای این سوال دریافت نشد.
                  </p>
                )}
              </div>
              <p
                className={
                  "text-xs " +
                  (l.is_correct ? "text-success" : "text-destructive")
                }
              >
                {l.is_correct
                  ? "پاسخ شما با پاسخ مرجع کتاب مطابقت دارد."
                  : "پاسخ شما با پاسخ مرجع کتاب مطابقت کامل ندارد. پاسخ درست را مرور کن و نکات کلیدی را مقایسه کن."}
              </p>
              {(l.concept || l.match_type) && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {l.concept && (
                    <Badge variant="outline" className="text-[10px]">
                      مفهوم: {l.concept}
                    </Badge>
                  )}
                  {l.match_type && (
                    <Badge variant="outline" className="text-[10px]">
                      نوع تطبیق: {l.match_type}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
