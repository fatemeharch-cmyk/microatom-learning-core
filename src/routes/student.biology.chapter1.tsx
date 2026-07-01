/**
 * MVP vertical slice — Grade 11 Experimental Biology, Chapter 1: تنظیم عصبی.
 *
 * Sections: دوز مطالعه، چکاب فصل اول، تحلیل ساده.
 * Wires against Xano endpoints:
 *  - POST /biology/chapter1/dose/create
 *  - POST /biology/chapter1/checkup/start
 *  - POST /biology/chapter1/checkup/submit
 * Falls back to demo data when the backend is not ready so the flow keeps
 * rendering.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Brain,
  ChevronLeft,
  Loader2,
  Stethoscope,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { apiClient, ApiError } from "@/lib/api/client";

export const Route = createFileRoute("/student/biology/chapter1")({
  component: Chapter1Page,
});

// -------- demo taxonomy (used if backend not ready) --------
interface MicroAtom {
  id: string;
  title: string;
  goftar: string;
  atom: string;
}

const DEMO_MICRO_ATOMS: MicroAtom[] = [
  { id: "ma-neu-101", goftar: "گفتار ۱: یاخته‌های عصبی", atom: "اتم: ساختار نورون", title: "میکرواتم: دندریت و آکسون" },
  { id: "ma-neu-102", goftar: "گفتار ۱: یاخته‌های عصبی", atom: "اتم: ساختار نورون", title: "میکرواتم: غلاف میلین" },
  { id: "ma-neu-201", goftar: "گفتار ۲: ساختار دستگاه عصبی", atom: "اتم: نخاع", title: "میکرواتم: شاخ‌های خاکستری نخاع" },
  { id: "ma-neu-202", goftar: "گفتار ۲: ساختار دستگاه عصبی", atom: "اتم: مغز", title: "میکرواتم: بخش‌های مخ" },
  { id: "ma-neu-301", goftar: "گفتار ۳: پیام عصبی", atom: "اتم: پتانسیل عمل", title: "میکرواتم: مراحل پتانسیل عمل" },
  { id: "ma-neu-302", goftar: "گفتار ۳: پیام عصبی", atom: "اتم: سیناپس", title: "میکرواتم: انتقال‌دهنده‌های عصبی" },
];

const DEMO_QUESTIONS = [
  { id: "q1", text: "کدام بخش نورون وظیفه‌ی انتقال پیام عصبی به یاخته‌ی بعدی را دارد؟", correct: "آکسون" },
  { id: "q2", text: "غلاف میلین توسط کدام یاخته در دستگاه عصبی محیطی ساخته می‌شود؟", correct: "یاخته‌ی شوان" },
  { id: "q3", text: "در مرحله‌ی دپلاریزاسیون کدام یون به درون آکسون وارد می‌شود؟", correct: "سدیم" },
  { id: "q4", text: "شاخ‌های خاکستری جلویی نخاع محل قرارگیری کدام نورون‌ها هستند؟", correct: "نورون‌های حرکتی" },
  { id: "q5", text: "کوچک‌ترین واحد ساختاری دستگاه عصبی چه نام دارد؟", correct: "نورون" },
];

// -------- helpers --------
function readUserId(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem("atomia_user_id") ?? "";
  } catch {
    return "";
  }
}

function toast(msg: string) {
  // Non-blocking, tiny feedback — avoids adding a full toast lib for MVP
  if (typeof window !== "undefined") window.setTimeout(() => alert(msg), 0);
}

// -------- component --------
type CheckupQuestion = { id: string; text: string; correct?: string };
type SubmitAnswerResult = {
  question_id: string;
  is_correct: boolean;
  correct_answer?: string;
  user_answer?: string;
  concept?: string;
};
type CheckupSubmitResponse = {
  score?: number;
  correct?: number;
  total?: number;
  answers?: SubmitAnswerResult[];
  weak_concepts?: string[];
  recommendations?: (string | { title?: string; description?: string })[];
};

function Chapter1Page() {
  // ----- Dose state -----
  const [selectedGoftar, setSelectedGoftar] = useState<string>("");
  const [selectedAtom, setSelectedAtom] = useState<string>("");
  const [selectedMicro, setSelectedMicro] = useState<string>("");
  const [doseCount, setDoseCount] = useState<number>(1);
  const [note, setNote] = useState<string>("");
  const [doseBusy, setDoseBusy] = useState(false);
  const [doseLog, setDoseLog] = useState<
    { title: string; count: number; at: string }[]
  >([]);

  const goftarList = useMemo(
    () => Array.from(new Set(DEMO_MICRO_ATOMS.map((m) => m.goftar))),
    [],
  );
  const atomList = useMemo(
    () =>
      Array.from(
        new Set(
          DEMO_MICRO_ATOMS.filter((m) => m.goftar === selectedGoftar).map(
            (m) => m.atom,
          ),
        ),
      ),
    [selectedGoftar],
  );
  const microList = useMemo(
    () =>
      DEMO_MICRO_ATOMS.filter(
        (m) => m.goftar === selectedGoftar && m.atom === selectedAtom,
      ),
    [selectedGoftar, selectedAtom],
  );

  async function submitDose() {
    if (!selectedMicro) {
      toast("لطفاً یک میکرواتم انتخاب کن.");
      return;
    }
    setDoseBusy(true);
    try {
      const body = {
        user_id: readUserId(),
        micro_atom_id: selectedMicro,
        dose_count: doseCount,
        note,
      };
      try {
        await apiClient.post("/biology/chapter1/dose/create", body);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("[chapter1][dose] backend not ready, logged locally", err);
      }
      const micro = DEMO_MICRO_ATOMS.find((m) => m.id === selectedMicro);
      setDoseLog((l) => [
        {
          title: micro?.title ?? selectedMicro,
          count: doseCount,
          at: new Date().toLocaleTimeString("fa-IR"),
        },
        ...l,
      ]);
      setNote("");
      setDoseCount(1);
      toast("دوز مطالعه ثبت شد.");
    } finally {
      setDoseBusy(false);
    }
  }

  // ----- Checkup state -----
  type Phase = "idle" | "answering" | "result";
  const [phase, setPhase] = useState<Phase>("idle");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<CheckupQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<CheckupSubmitResponse | null>(null);
  const [checkupBusy, setCheckupBusy] = useState(false);
  const [checkupError, setCheckupError] = useState<string | null>(null);

  async function startCheckup() {
    setCheckupBusy(true);
    setCheckupError(null);
    try {
      let sid = `demo-${Date.now()}`;
      let qs: CheckupQuestion[] = DEMO_QUESTIONS.map((q) => ({
        id: q.id,
        text: q.text,
      }));
      try {
        const res = await apiClient.post<{
          session_id: string | number;
          questions: CheckupQuestion[];
        }>("/biology/chapter1/checkup/start", {
          user_id: readUserId(),
          count: 5,
        });
        if (res.data?.session_id) sid = String(res.data.session_id);
        if (Array.isArray(res.data?.questions) && res.data.questions.length) {
          qs = res.data.questions.map((q) => ({
            id: String(q.id),
            text: q.text ?? "—",
          }));
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("[chapter1][checkup/start] backend not ready", err);
      }
      setSessionId(sid);
      setQuestions(qs);
      setAnswers({});
      setResult(null);
      setPhase("answering");
    } catch (err) {
      setCheckupError(err instanceof ApiError ? err.message : "خطا در شروع چکاب.");
    } finally {
      setCheckupBusy(false);
    }
  }

  async function submitCheckup() {
    if (!sessionId) return;
    setCheckupBusy(true);
    setCheckupError(null);
    try {
      const body = {
        session_id: sessionId,
        answers: questions.map((q) => ({
          question_id: q.id,
          user_answer: (answers[q.id] ?? "").trim(),
        })),
      };
      let res: CheckupSubmitResponse | null = null;
      try {
        const r = await apiClient.post<CheckupSubmitResponse>(
          "/biology/chapter1/checkup/submit",
          body,
        );
        res = r.data ?? null;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("[chapter1][checkup/submit] backend not ready", err);
      }
      if (!res) {
        // demo grader
        const scored: SubmitAnswerResult[] = questions.map((q) => {
          const demo = DEMO_QUESTIONS.find((d) => d.id === q.id);
          const user = (answers[q.id] ?? "").trim();
          const isCorrect =
            !!demo &&
            user.length > 0 &&
            user.replace(/\s+/g, "") === demo.correct.replace(/\s+/g, "");
          return {
            question_id: q.id,
            user_answer: user,
            is_correct: isCorrect,
            correct_answer: demo?.correct,
          };
        });
        const correct = scored.filter((s) => s.is_correct).length;
        const weak = scored
          .filter((s) => !s.is_correct)
          .map((s) => {
            const q = questions.find((qq) => qq.id === s.question_id);
            return q?.text.slice(0, 40) ?? s.question_id;
          });
        res = {
          score: Math.round((correct / questions.length) * 100),
          correct,
          total: questions.length,
          answers: scored,
          weak_concepts: weak,
          recommendations: weak.length
            ? [
                {
                  title: "دوز مرور پیشنهادی",
                  description:
                    "برای مفاهیمی که ضعف داشتی، یک دوز کوتاه (۱۵ دقیقه) مطالعه‌ی هدفمند ثبت کن و دوباره چکاب بگیر.",
                },
              ]
            : [
                {
                  title: "ادامه‌ی مسیر",
                  description: "عالی بود! به سراغ گفتار بعدی برو.",
                },
              ],
        };
      }
      setResult(res);
      setPhase("result");
    } catch (err) {
      setCheckupError(
        err instanceof ApiError ? err.message : "خطا در ثبت پاسخ‌ها.",
      );
    } finally {
      setCheckupBusy(false);
    }
  }

  function restartCheckup() {
    setPhase("idle");
    setSessionId(null);
    setQuestions([]);
    setAnswers({});
    setResult(null);
    setCheckupError(null);
  }

  const pct = result?.score ?? 0;
  const correctCount =
    result?.correct ??
    (result?.answers?.filter((a) => a.is_correct).length ?? 0);
  const totalCount = result?.total ?? questions.length;

  return (
    <div dir="rtl" className="font-vazir space-y-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 flex items-center gap-1">
        <Link to="/student" className="hover:text-emerald-600">کلینیک من</Link>
        <span>/</span>
        <Link to="/student/biology" className="hover:text-emerald-600">زیست‌شناسی</Link>
        <span>/</span>
        <span className="text-slate-700 font-semibold">فصل اول: تنظیم عصبی</span>
      </nav>

      {/* Header */}
      <header className="flex items-center gap-3">
        <span className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-100 to-pink-100 text-violet-600 grid place-items-center">
          <Brain className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            فصل اول زیست: تنظیم عصبی
          </h1>
          <p className="text-sm text-slate-500">
            دوز مطالعه ثبت کن، چکاب بگیر و تحلیل ساده‌ی پیشرفتت را ببین.
          </p>
        </div>
      </header>

      {/* 1) Dose section */}
      <Card className="border-0 rounded-3xl shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-slate-800">
            <BookOpen className="h-5 w-5 text-emerald-600" />
            دوز مطالعه
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-600">گفتار</Label>
              <select
                dir="rtl"
                value={selectedGoftar}
                onChange={(e) => {
                  setSelectedGoftar(e.target.value);
                  setSelectedAtom("");
                  setSelectedMicro("");
                }}
                className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="">انتخاب گفتار…</option>
                {goftarList.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-600">اتم</Label>
              <select
                dir="rtl"
                value={selectedAtom}
                onChange={(e) => {
                  setSelectedAtom(e.target.value);
                  setSelectedMicro("");
                }}
                disabled={!selectedGoftar}
                className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">انتخاب اتم…</option>
                {atomList.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-600">میکرواتم</Label>
              <select
                dir="rtl"
                value={selectedMicro}
                onChange={(e) => setSelectedMicro(e.target.value)}
                disabled={!selectedAtom}
                className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">انتخاب میکرواتم…</option>
                {microList.map((m) => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-600">تعداد دوز</Label>
              <Input
                type="number"
                min={1}
                max={20}
                value={doseCount}
                onChange={(e) =>
                  setDoseCount(Math.max(1, Number(e.target.value) || 1))
                }
                className="rounded-xl"
              />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-xs text-slate-600">یادداشت (اختیاری)</Label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="مثلاً: قبل چکاب یک مرور سریع لازم دارم."
                rows={2}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              دوزها در پرونده‌ی رشد و پایش مسئول پایه نمایش داده می‌شوند.
            </p>
            <Button
              onClick={submitDose}
              disabled={doseBusy || !selectedMicro}
              className="rounded-full bg-emerald-600 hover:bg-emerald-700"
            >
              {doseBusy ? (
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
              ) : null}
              ثبت دوز مطالعه
            </Button>
          </div>

          {doseLog.length > 0 && (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3 space-y-1.5">
              <p className="text-xs font-semibold text-emerald-700">
                دوزهای این نشست
              </p>
              {doseLog.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs text-slate-700"
                >
                  <span>{d.title}</span>
                  <span className="text-slate-500">
                    {d.count} دوز • {d.at}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2) Checkup section */}
      <Card className="border-0 rounded-3xl shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-slate-800">
            <Stethoscope className="h-5 w-5 text-violet-600" />
            چکاب فصل اول
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {phase === "idle" && (
            <>
              <p className="text-sm text-slate-600 leading-7">
                یک چکاب کوتاه با ۵ سؤال از فصل تنظیم عصبی. پس از پایان، تحلیل
                ساده و پیشنهاد مطالعه دریافت می‌کنی.
              </p>
              {checkupError && (
                <p className="text-sm text-rose-600">{checkupError}</p>
              )}
              <Button
                onClick={startCheckup}
                disabled={checkupBusy}
                className="rounded-full bg-violet-600 hover:bg-violet-700"
              >
                {checkupBusy ? (
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                ) : null}
                شروع چکاب فصل اول
              </Button>
            </>
          )}

          {phase === "answering" && (
            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50/40 p-4 space-y-2"
                >
                  <div className="flex items-start gap-2">
                    <Badge className="bg-violet-100 text-violet-700 border-0 shrink-0">
                      سؤال {idx + 1}
                    </Badge>
                    <p className="text-sm text-slate-800 font-medium leading-7">
                      {q.text}
                    </p>
                  </div>
                  <Input
                    dir="rtl"
                    value={answers[q.id] ?? ""}
                    onChange={(e) =>
                      setAnswers((a) => ({ ...a, [q.id]: e.target.value }))
                    }
                    placeholder="پاسخ کوتاه…"
                    className="rounded-xl bg-white"
                  />
                </div>
              ))}
              {checkupError && (
                <p className="text-sm text-rose-600">{checkupError}</p>
              )}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={restartCheckup}
                  className="rounded-full"
                >
                  انصراف
                </Button>
                <Button
                  onClick={submitCheckup}
                  disabled={checkupBusy}
                  className="rounded-full bg-violet-600 hover:bg-violet-700"
                >
                  {checkupBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  ) : null}
                  ثبت پاسخ‌ها
                </Button>
              </div>
            </div>
          )}

          {phase === "result" && result && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-slate-50">
                  <p className="text-xs text-slate-500">تعداد سؤال</p>
                  <p className="text-xl font-extrabold text-slate-800">
                    {totalCount}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50">
                  <p className="text-xs text-slate-500">پاسخ درست</p>
                  <p className="text-xl font-extrabold text-emerald-600">
                    {correctCount}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-violet-50">
                  <p className="text-xs text-slate-500">درصد</p>
                  <p className="text-xl font-extrabold text-violet-600">
                    {pct}٪
                  </p>
                </div>
              </div>
              <Progress value={pct} className="h-2" />

              <Button
                variant="outline"
                onClick={restartCheckup}
                className="rounded-full"
              >
                چکاب جدید
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3) Analysis / result section */}
      {phase === "result" && result && (
        <Card className="border-0 rounded-3xl shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-slate-800">
              <ClipboardList className="h-5 w-5 text-rose-500" />
              تحلیل ساده
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* per-question review */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-700">
                بازبینی پاسخ‌ها
              </h3>
              {(result.answers ?? []).map((a, idx) => {
                const q = questions.find((qq) => qq.id === a.question_id);
                return (
                  <div
                    key={a.question_id}
                    className="rounded-2xl border border-slate-100 p-3 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-slate-800 leading-7">
                        {idx + 1}. {q?.text ?? a.question_id}
                      </p>
                      {a.is_correct ? (
                        <Badge className="bg-emerald-100 text-emerald-700 border-0 shrink-0">
                          <CheckCircle2 className="h-3 w-3 ml-1" /> درست
                        </Badge>
                      ) : (
                        <Badge className="bg-rose-100 text-rose-700 border-0 shrink-0">
                          <AlertTriangle className="h-3 w-3 ml-1" /> نیاز به مرور
                        </Badge>
                      )}
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2 text-xs">
                      <span className="text-slate-500">پاسخ تو: </span>
                      <span className="text-slate-800">
                        {a.user_answer?.trim() || "—"}
                      </span>
                    </div>
                    {a.correct_answer && (
                      <div
                        className={`rounded-xl p-2 text-xs ${
                          a.is_correct ? "bg-emerald-50" : "bg-amber-50"
                        }`}
                      >
                        <span className="text-slate-500">پاسخ درست: </span>
                        <span className="text-slate-800 font-semibold">
                          {a.correct_answer}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* weak concepts */}
            {result.weak_concepts && result.weak_concepts.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  ضعف‌های شناسایی شده
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.weak_concepts.map((w, i) => (
                    <Badge
                      key={i}
                      className="bg-amber-100 text-amber-700 border-0"
                    >
                      {w}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* recommendations */}
            {result.recommendations && result.recommendations.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-500" />
                  نسخه‌ی پیشنهادی مطالعه
                </h3>
                <div className="space-y-2">
                  {result.recommendations.map((r, i) => (
                    <div
                      key={i}
                      className="rounded-2xl bg-violet-50/60 border border-violet-100 p-3 text-sm text-slate-700"
                    >
                      {typeof r === "string" ? (
                        r
                      ) : (
                        <>
                          {r.title && (
                            <p className="font-semibold text-slate-800">
                              {r.title}
                            </p>
                          )}
                          {r.description && (
                            <p className="mt-1 text-slate-600 leading-7">
                              {r.description}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Link
                to="/student/homework"
                className="inline-flex items-center gap-1 text-xs font-semibold text-violet-700 hover:text-violet-900"
              >
                رفتن به ماموریت‌ها
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
