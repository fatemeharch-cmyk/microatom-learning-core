/**
 * Kaavosh (exam) result page.
 *
 * Fetches real diagnostic data from
 *   GET /student/exams/{exam_id}/analysis
 * and maps it onto the existing Atomia result UI (violet gradient, cards,
 * RTL). No mock values; skeletons on load; graceful empty states; single
 * generic error message on failure.
 */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Loader2,
  Sparkles,
  Trophy,
  Users,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getExamAnalysis, type ExamAnalysis } from "@/lib/services/content-service";

export const Route = createFileRoute("/student/exams/$examId/result")({
  head: () => ({
    meta: [
      { title: "نتیجه کاوش — آتومیا" },
      { name: "description", content: "تحلیل تشخیصی کاوش شما." },
    ],
  }),
  component: KaavoshResultPage,
});

function toFa(n: number | string | undefined | null): string {
  if (n === undefined || n === null) return "—";
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

function pickStr(
  o: Record<string, unknown> | null | undefined,
  ...keys: string[]
): string | undefined {
  if (!o) return undefined;
  for (const k of keys) {
    const v = o[k];
    if (v !== undefined && v !== null && v !== "") return String(v);
  }
  return undefined;
}
function pickNum(
  o: Record<string, unknown> | null | undefined,
  ...keys: string[]
): number | undefined {
  if (!o) return undefined;
  for (const k of keys) {
    const v = o[k];
    if (v === undefined || v === null || v === "") continue;
    const n = typeof v === "number" ? v : Number(v);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

function KaavoshResultPage() {
  const { examId } = Route.useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);
  const [data, setData] = useState<ExamAnalysis | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErrored(false);
    getExamAnalysis(examId)
      .then((d) => {
        if (!alive) return;
        setData(d);
      })
      .catch(() => {
        if (!alive) return;
        setErrored(true);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [examId]);

  if (loading) {
    return (
      <div dir="rtl" className="max-w-4xl mx-auto space-y-5 pb-10">
        <SkeletonHero />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (errored || !data) {
    return (
      <div dir="rtl" className="max-w-4xl mx-auto pb-10">
        <Card className="border-0 rounded-[22px] shadow-sm">
          <CardContent className="p-8 text-center space-y-4">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-amber-100 text-amber-600 grid place-items-center">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <p className="text-sm text-slate-700 leading-7">
              تحلیل این کاوش در دسترس نیست. لطفاً دوباره تلاش کنید.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={() => void navigate({ to: "/student" })}
                variant="outline"
                className="rounded-full"
              >
                بازگشت به کلینیک
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const title = pickStr(data.exam, "title", "name") ?? "نتیجه کاوش";
  const subject = pickStr(data.exam, "subject", "subject_title");
  const date = pickStr(data.exam, "date", "created_at", "submitted_at");
  const duration = pickStr(data.exam, "duration");

  const pct = pickNum(data.result, "percentage") ?? 0;
  const score = pickNum(data.result, "score");
  const correct = pickNum(data.result, "correct") ?? 0;
  const wrong = pickNum(data.result, "wrong") ?? 0;
  const blank = pickNum(data.result, "blank") ?? 0;
  const total =
    pickNum(data.result, "total") ?? correct + wrong + blank;

  const cc = data.class_comparison;
  const rank = cc ? pickNum(cc, "rank") : undefined;
  const rankRaw = cc?.rank;

  const smartAvailable = Boolean(data.recommendation?.smart_review_available);
  const recMessage = pickStr(data.recommendation ?? undefined, "message");

  return (
    <div dir="rtl" className="max-w-4xl mx-auto space-y-5 pb-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[28px] p-6 text-white shadow-lg bg-gradient-to-br from-violet-600 via-violet-500 to-fuchsia-500">
        <div className="flex items-center gap-3">
          <span className="h-11 w-11 rounded-2xl grid place-items-center bg-white/20 backdrop-blur">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="text-right flex-1">
            <h1 className="text-xl md:text-2xl font-extrabold">{title}</h1>
            <p className="text-xs md:text-sm text-white/85 mt-1">
              {[subject, date, duration ? `${toFa(duration)} دقیقه` : null]
                .filter(Boolean)
                .join(" • ") || "تحلیل تشخیصی کاوش"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold">{toFa(Math.round(pct))}٪</p>
            <p className="text-[11px] text-white/85 mt-0.5">درصد کاوش</p>
          </div>
        </div>
      </section>

      {/* Result stats */}
      <Card className="border-0 rounded-[22px] shadow-sm">
        <CardHeader>
          <CardTitle className="text-base text-slate-800 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-violet-600" /> خلاصه نتیجه
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={pct} className="h-2" />
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <Stat label="درصد" value={`${toFa(Math.round(pct))}٪`} tone="violet" />
            {score !== undefined && (
              <Stat label="نمره" value={toFa(score)} tone="violet" />
            )}
            <Stat label="پاسخ درست" value={toFa(correct)} tone="ok" />
            <Stat label="پاسخ نادرست" value={toFa(wrong)} tone="bad" />
            <Stat label="بدون پاسخ" value={toFa(blank)} tone="muted" />
            <Stat label="کل سؤالات" value={toFa(total)} tone="slate" />
          </div>
        </CardContent>
      </Card>

      {/* Class comparison */}
      <Card className="border-0 rounded-[22px] shadow-sm">
        <CardHeader>
          <CardTitle className="text-base text-slate-800 flex items-center gap-2">
            <Users className="h-5 w-5 text-violet-600" /> مقایسه با کلاس
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat
              label="امتیاز شما"
              value={toFa(pickNum(cc ?? undefined, "student_score") ?? "—")}
              tone="violet"
            />
            <Stat
              label="میانگین کلاس"
              value={toFa(pickNum(cc ?? undefined, "class_average") ?? "—")}
              tone="slate"
            />
            <Stat
              label="بیشترین امتیاز"
              value={toFa(pickNum(cc ?? undefined, "highest_score") ?? "—")}
              tone="ok"
            />
            <Stat
              label="جایگاه"
              value={rank !== undefined ? `#${toFa(rank)}` : "—"}
              tone="violet"
            />
          </div>
          {(rank === undefined || rankRaw === null) && (
            <p className="text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-2xl p-3 text-right">
              پس از ثبت نتایج کلاس، جایگاه شما محاسبه می‌شود.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Performance by goftar */}
      {data.performance_by_goftar.length > 0 && (
        <Card className="border-0 rounded-[22px] shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-slate-800 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-violet-600" /> عملکرد بر اساس گفتار
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.performance_by_goftar.map((g, i) => {
              const name = pickStr(g, "title", "goftar_title", "name") ?? "—";
              const p = pickNum(g, "percentage", "score") ?? 0;
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-700 font-medium">{name}</span>
                    <span className="text-slate-500">{toFa(Math.round(p))}٪</span>
                  </div>
                  <Progress value={p} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Detailed weakness — micro atoms */}
      {data.performance_by_micro_atom.length > 0 && (
        <Card className="border-0 rounded-[22px] shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-slate-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" /> جزئیات نقاط ضعف
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.performance_by_micro_atom.map((m, i) => {
              const name = pickStr(m, "title", "name", "micro_atom_title") ?? "—";
              const p = pickNum(m, "percentage", "score") ?? 0;
              return (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-100 p-3 text-sm"
                >
                  <span className="text-slate-700">{name}</span>
                  <Badge
                    className={
                      p >= 70
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                        : p >= 40
                          ? "bg-amber-100 text-amber-700 border-amber-200"
                          : "bg-rose-100 text-rose-700 border-rose-200"
                    }
                  >
                    {toFa(Math.round(p))}٪
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Strengths */}
      {data.strengths.length > 0 && (
        <Card className="border-0 rounded-[22px] shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-slate-800 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-emerald-600" /> نقاط قوت
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {data.strengths.map((s, i) => (
              <Badge
                key={i}
                className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs px-3 py-1.5"
              >
                {pickStr(s, "title", "name", "label") ?? "—"}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Needs attention */}
      <Card className="border-0 rounded-[22px] shadow-sm">
        <CardHeader>
          <CardTitle className="text-base text-slate-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" /> نیازمند تقویت
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.needs_attention.length === 0 ? (
            <p className="text-sm text-slate-500 text-right">
              در این کاوش مورد نیازمند تقویتی ثبت نشد.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.needs_attention.map((n, i) => (
                <Badge
                  key={i}
                  className="bg-amber-50 text-amber-700 border-amber-200 text-xs px-3 py-1.5"
                >
                  {pickStr(n, "title", "name", "label") ?? "—"}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendation */}
      {(smartAvailable || recMessage) && (
        <Card className="border-0 rounded-[22px] shadow-sm bg-gradient-to-br from-violet-50 to-fuchsia-50">
          <CardHeader>
            <CardTitle className="text-base text-slate-800 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-600" /> پیشنهاد آتومیا
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recMessage && (
              <p className="text-sm text-slate-700 leading-7 text-right">
                {recMessage}
              </p>
            )}
            {smartAvailable && (
              <div className="flex justify-end">
                <Button
                  onClick={() =>
                    void navigate({
                      to: "/student/smart-review",
                      search: { exam_id: String(examId) } as never,
                    })
                  }
                  className="rounded-full bg-violet-600 hover:bg-violet-700 text-white"
                >
                  <Sparkles className="h-4 w-4 ml-2" />
                  دریافت نسخه هوشمند
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Answer review toggle */}
      <Card className="border-0 rounded-[22px] shadow-sm">
        <CardContent className="p-4">
          <Button
            variant="outline"
            className="w-full rounded-full justify-between"
            onClick={() => setShowAnswers((v) => !v)}
          >
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              مرور پاسخ‌ها
            </span>
            {showAnswers ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Answer review */}
      {showAnswers && (
        <Card className="border-0 rounded-[22px] shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-slate-800">پاسخنامه کامل</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.answer_review.length === 0 ? (
              <p className="text-sm text-slate-500 text-right">
                پاسخنامه‌ای برای این کاوش ثبت نشد.
              </p>
            ) : (
              data.answer_review.map((a, i) => {
                const q =
                  pickStr(a, "question_text", "question", "text") ?? "—";
                const student = pickStr(
                  a,
                  "student_answer",
                  "answer",
                  "student_answer_text",
                );
                const correctAns = pickStr(
                  a,
                  "correct_answer",
                  "correct_answer_text",
                );
                const isCorrect = Boolean(
                  a.is_correct ?? (a as { correct?: unknown }).correct,
                );
                return (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-100 bg-white p-4 space-y-2 text-right"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-800 leading-7 flex-1">
                        {toFa(i + 1)}. {q}
                      </p>
                      {isCorrect ? (
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 shrink-0">
                          <CheckCircle2 className="h-3 w-3 ml-1" /> درست
                        </Badge>
                      ) : (
                        <Badge className="bg-rose-100 text-rose-700 border-rose-200 shrink-0">
                          <AlertTriangle className="h-3 w-3 ml-1" /> نیاز به مرور
                        </Badge>
                      )}
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2 text-sm">
                      <p className="text-[11px] text-slate-500 mb-1">پاسخ شما</p>
                      <p className="text-slate-800 whitespace-pre-wrap">
                        {student || "—"}
                      </p>
                    </div>
                    {correctAns && (
                      <div className="rounded-xl bg-emerald-50 p-2 text-sm">
                        <p className="text-[11px] text-emerald-700 mb-1">
                          پاسخ درست
                        </p>
                        <p className="text-emerald-900 whitespace-pre-wrap">
                          {correctAns}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center pt-2">
        <Button
          onClick={() => void navigate({ to: "/student" })}
          variant="outline"
          className="rounded-full"
        >
          بازگشت به کلینیک
        </Button>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "violet" | "ok" | "bad" | "muted" | "slate";
}) {
  const cls =
    tone === "ok"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "bad"
        ? "bg-rose-50 text-rose-700"
        : tone === "muted"
          ? "bg-slate-50 text-slate-600"
          : tone === "slate"
            ? "bg-slate-100 text-slate-700"
            : "bg-violet-50 text-violet-700";
  return (
    <div className={`rounded-2xl p-3 text-center ${cls}`}>
      <p className="text-[11px] opacity-80">{label}</p>
      <p className="text-lg font-extrabold mt-1">{value}</p>
    </div>
  );
}

function SkeletonHero() {
  return (
    <div className="rounded-[28px] p-6 bg-gradient-to-br from-violet-600 via-violet-500 to-fuchsia-500 shadow-lg">
      <div className="flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <span className="h-11 w-11 rounded-2xl bg-white/20 grid place-items-center">
            <Loader2 className="h-5 w-5 animate-spin" />
          </span>
          <div className="space-y-2">
            <div className="h-4 w-40 rounded bg-white/30 animate-pulse" />
            <div className="h-3 w-56 rounded bg-white/20 animate-pulse" />
          </div>
        </div>
        <div className="h-10 w-16 rounded bg-white/20 animate-pulse" />
      </div>
    </div>
  );
}
function SkeletonCard() {
  return (
    <Card className="border-0 rounded-[22px] shadow-sm">
      <CardContent className="p-6 space-y-3">
        <div className="h-4 w-32 rounded bg-slate-200 animate-pulse" />
        <div className="h-3 w-full rounded bg-slate-100 animate-pulse" />
        <div className="h-3 w-2/3 rounded bg-slate-100 animate-pulse" />
      </CardContent>
    </Card>
  );
}
