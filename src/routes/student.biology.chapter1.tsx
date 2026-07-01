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
import { Component, type ReactNode, useMemo, useState } from "react";
import {
  Brain,
  ChevronLeft,
  Loader2,
  Stethoscope,
  ClipboardList,
  
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
  errorComponent: ({ error, reset }) => (
    <div dir="rtl" className="p-6 space-y-3 font-vazir">
      <h2 className="text-lg font-bold text-rose-600">
        خطای غیرمنتظره در نمایش صفحه
      </h2>
      <p className="text-sm text-slate-600 whitespace-pre-wrap">
        {error instanceof Error ? error.message : String(error)}
      </p>
      <button
        onClick={() => reset()}
        className="rounded-full bg-violet-600 text-white px-4 py-2 text-sm"
      >
        تلاش دوباره
      </button>
    </div>
  ),
  notFoundComponent: () => (
    <div dir="rtl" className="p-6 font-vazir text-slate-600">
      صفحه یافت نشد.
    </div>
  ),
});

// -------- demo taxonomy (used if backend not ready) --------
interface MicroAtom {
  id: number;
  title: string;
  goftar: string;
  atom: string;
}

const DEMO_MICRO_ATOMS: MicroAtom[] = [
  { id: 101, goftar: "گفتار ۱: یاخته‌های عصبی", atom: "اتم: ساختار نورون", title: "میکرواتم: دندریت و آکسون" },
  { id: 102, goftar: "گفتار ۱: یاخته‌های عصبی", atom: "اتم: ساختار نورون", title: "میکرواتم: غلاف میلین" },
  { id: 201, goftar: "گفتار ۲: ساختار دستگاه عصبی", atom: "اتم: نخاع", title: "میکرواتم: شاخ‌های خاکستری نخاع" },
  { id: 202, goftar: "گفتار ۲: ساختار دستگاه عصبی", atom: "اتم: مغز", title: "میکرواتم: بخش‌های مخ" },
  { id: 301, goftar: "گفتار ۳: پیام عصبی", atom: "اتم: پتانسیل عمل", title: "میکرواتم: مراحل پتانسیل عمل" },
  { id: 302, goftar: "گفتار ۳: پیام عصبی", atom: "اتم: سیناپس", title: "میکرواتم: انتقال‌دهنده‌های عصبی" },
];

const DEMO_QUESTIONS = [
  { id: "q1", text: "کدام بخش نورون وظیفه‌ی انتقال پیام عصبی به یاخته‌ی بعدی را دارد؟", correct: "آکسون" },
  { id: "q2", text: "غلاف میلین توسط کدام یاخته در دستگاه عصبی محیطی ساخته می‌شود؟", correct: "یاخته‌ی شوان" },
  { id: "q3", text: "در مرحله‌ی دپلاریزاسیون کدام یون به درون آکسون وارد می‌شود؟", correct: "سدیم" },
  { id: "q4", text: "شاخ‌های خاکستری جلویی نخاع محل قرارگیری کدام نورون‌ها هستند؟", correct: "نورون‌های حرکتی" },
  { id: "q5", text: "کوچک‌ترین واحد ساختاری دستگاه عصبی چه نام دارد؟", correct: "نورون" },
];

// -------- helpers --------
const BIO_BASE = "https://x8ki-letl-twmt.n7.xano.io/api:biology";
const DOSE_CREATE_URL = `${BIO_BASE}/chapter1/dose/create`;
const USER_ID = 4;

function toast(msg: string) {
  if (typeof window !== "undefined") window.setTimeout(() => alert(msg), 0);
}

// -------- component --------
type CheckupQuestion = { id: string | number; question: string };
type CheckupAnswerReview = {
  question_id?: string | number;
  question?: string;
  user_answer?: string;
  correct_answer?: string;
  is_correct?: boolean;
};
type CheckupSubmitResponse = {
  session_id?: string | number;
  total?: number;
  correct?: number;
  score?: number;
  answers?: CheckupAnswerReview[];
};
type CheckupResultResponse = {
  score?: number;
  correct?: number;
  total?: number;
  weak_concepts?: Array<
    | string
    | {
        concept?: unknown;
        wrong_count?: unknown;
      }
  >;
  recommendation?:
    | string
    | { action?: unknown; title?: unknown; description?: unknown };
  answers?: CheckupAnswerReview[];
};

function renderSafeText(value: unknown, fallback = "—") {
  if (typeof value === "string" && value.trim().length > 0) return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
}

function getWeakConceptLabel(item: unknown) {
  if (typeof item === "string") return item;
  if (item && typeof item === "object" && "concept" in item) {
    return renderSafeText(item.concept, "مفهوم نامشخص");
  }
  return "مفهوم نامشخص";
}

function getWeakConceptWrongCount(item: unknown) {
  if (!item || typeof item !== "object" || !("wrong_count" in item)) return 0;
  const count = Number(item.wrong_count);
  return Number.isFinite(count) ? count : 0;
}

function getRecommendationText(recommendation: CheckupResultResponse["recommendation"]) {
  if (typeof recommendation === "string") return recommendation;
  if (recommendation && typeof recommendation === "object") {
    const action = renderSafeText(recommendation.action, "");
    if (action) return action;
    return JSON.stringify(recommendation);
  }
  return "";
}

class InlineResultErrorBoundary extends Component<
  { children: ReactNode; resetKey: string },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("CHECKUP RESULT RENDER FAILED", error);
  }

  componentDidUpdate(prevProps: { resetKey: string }) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-3 text-sm text-rose-700">
          نمایش نتیجه با خطا مواجه شد، اما پاسخ‌ها ثبت شده‌اند.
        </div>
      );
    }

    return this.props.children;
  }
}




function Chapter1Page() {
  // ----- Dose state -----
  const [selectedGoftar, setSelectedGoftar] = useState<string>("");
  const [selectedAtom, setSelectedAtom] = useState<string>("");
  const [selectedMicroAtomId, setSelectedMicroAtomId] = useState<string>("");
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
    const payload = {
      user_id: 4,
      micro_atom_id: Number(selectedMicroAtomId),
      dose_count: Number(doseCount),
      note: note || "",
    };

    console.log("DOSE PAYLOAD", payload);

    if (!Number.isInteger(payload.micro_atom_id)) {
      alert("شناسه میکرواتم نامعتبر است");
      return;
    }

    if (!Number.isInteger(payload.dose_count)) {
      alert("تعداد دوز نامعتبر است");
      return;
    }

    setDoseBusy(true);
    try {
      await apiClient.post(DOSE_CREATE_URL, payload);
      const micro = DEMO_MICRO_ATOMS.find((m) => m.id === payload.micro_atom_id);
      setDoseLog((l) => [
        {
          title: micro?.title ?? String(payload.micro_atom_id),
          count: payload.dose_count,
          at: new Date().toLocaleTimeString("fa-IR"),
        },
        ...l,
      ]);
      setNote("");
      setDoseCount(1);
      toast("دوز مطالعه ثبت شد.");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "";
      toast(`ثبت دوز مطالعه با خطا مواجه شد.${msg ? ` (${msg})` : ""}`);
    } finally {
      setDoseBusy(false);
    }
  }

  // ----- Checkup state -----
  type Phase = "idle" | "answering" | "result";
  const [phase, setPhase] = useState<Phase>("idle");
  const [sessionId, setSessionId] = useState<string | number | null>(null);
  const [questions, setQuestions] = useState<CheckupQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<CheckupResultResponse | null>(null);
  const [submitResult, setSubmitResult] = useState<CheckupSubmitResponse | null>(
    null,
  );
  const [checkupBusy, setCheckupBusy] = useState(false);
  const [checkupError, setCheckupError] = useState<string | null>(null);

  async function startCheckup() {
    setCheckupBusy(true);
    setCheckupError(null);
    try {
      const res = await apiClient.post<{
        session_id: string | number;
        questions: CheckupQuestion[];
      }>(`${BIO_BASE}/chapter1/checkup/start`, {
        user_id: USER_ID,
        count: 5,
      });
      const sid = res.data?.session_id;
      const qs = Array.isArray(res.data?.questions) ? res.data.questions : [];
      if (!sid || qs.length === 0) {
        throw new Error("پاسخ نامعتبر از سرور دریافت شد.");
      }
      setSessionId(sid);
      setQuestions(
        qs.map((q) => ({
          id: q.id,
          question: q.question ?? "—",
        })),
      );
      setAnswers({});
      setResult(null);
      setSubmitResult(null);
      setPhase("answering");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : (err as Error).message;
      setCheckupError(`شروع چکاپ با خطا مواجه شد.${msg ? ` (${msg})` : ""}`);
    } finally {
      setCheckupBusy(false);
    }
  }

  async function submitCheckup() {
    // defensive: session must exist
    if (sessionId === null || sessionId === undefined || sessionId === "") {
      setCheckupError("شناسه‌ی نشست چکاپ موجود نیست. لطفاً دوباره شروع کن.");
      return;
    }
    // defensive: questions must exist
    if (!Array.isArray(questions) || questions.length === 0) {
      setCheckupError("سؤالی برای ارسال وجود ندارد.");
      return;
    }

    setCheckupBusy(true);
    setCheckupError(null);
    try {
      const submitPayload = {
        session_id: sessionId,
        answers: questions.map((q) => ({
          question_id: q.id,
          user_answer: (answers[String(q.id)] ?? "").trim(),
        })),
      };
      console.log("CHECKUP SUBMIT PAYLOAD", submitPayload);

      const submitRes = await apiClient.post<CheckupSubmitResponse>(
        `${BIO_BASE}/chapter1/checkup/submit`,
        submitPayload,
      );
      const submitData = submitRes.data ?? null;
      setSubmitResult(submitData);

      let resultData: CheckupResultResponse | null = null;
      try {
        const r = await apiClient.post<CheckupResultResponse>(
          `${BIO_BASE}/chapter1/checkup/result`,
          { session_id: sessionId },
        );
        resultData = r.data ?? null;
      } catch (resErr) {
        // Result endpoint failed — keep submit response and continue inline.
        console.warn("CHECKUP RESULT FAILED", resErr);
      }
      setResult(resultData);
      setPhase("result");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : (err as Error).message;
      setCheckupError(
        `ثبت پاسخ‌ها با خطا مواجه شد.${msg ? ` (${msg})` : ""}`,
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
    setSubmitResult(null);
    setCheckupError(null);
  }

  const safeAnswers = Array.isArray(submitResult?.answers)
    ? submitResult.answers
    : [];
  const safeResultAnswers = Array.isArray(result?.answers) ? result.answers : [];
  const answerReview: CheckupAnswerReview[] =
    safeAnswers.length > 0 ? safeAnswers : safeResultAnswers;
  const safeWeakConcepts = Array.isArray(result?.weak_concepts)
    ? result.weak_concepts
    : [];
  const safeRecommendationText = getRecommendationText(result?.recommendation);
  const totalCount =
    submitResult?.total ?? result?.total ?? (questions?.length ?? 0);
  const correctCount = submitResult?.correct ?? result?.correct ?? 0;
  const pctRaw = submitResult?.score ?? result?.score ?? 0;
  const pct = typeof pctRaw === "number" && isFinite(pctRaw) ? pctRaw : 0;
  const resultResetKey = `${phase}-${sessionId ?? "none"}-${answerReview.length}-${safeWeakConcepts.length}`;




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
                  setSelectedMicroAtomId("");
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
                  setSelectedMicroAtomId("");
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
                value={selectedMicroAtomId}
                onChange={(e) => setSelectedMicroAtomId(e.target.value)}
                disabled={!selectedAtom}
                className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">انتخاب میکرواتم…</option>
                {microList.map((m) => (
                  <option key={m.id} value={String(m.id)}>{m.title}</option>
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
                disabled={doseBusy || !selectedMicroAtomId}
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
                      سوال {idx + 1}
                    </Badge>
                    <p className="text-sm text-slate-800 font-medium leading-7">
                      {q.question}
                    </p>
                  </div>
                  <Input
                    dir="rtl"
                    value={answers[q.id] ?? ""}
                    onChange={(e) =>
                      setAnswers((a) => ({ ...a, [q.id]: e.target.value }))
                    }
                    placeholder="پاسخ کوتاه..."
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

          {phase === "result" && (
            <InlineResultErrorBoundary resetKey={resultResetKey}>
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
                  <p className="text-xs text-slate-500">درصد چکاب</p>
                  <p className="text-xl font-extrabold text-violet-600">
                    {pct}٪
                  </p>
                </div>
              </div>
              <Progress value={pct} className="h-2" />

              {submitResult && !result && (
                <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-3 text-xs text-amber-800">
                  تحلیل نهایی فعلاً دریافت نشد، اما پاسخ‌ها ثبت شدند.
                </div>
              )}

              {answerReview.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-700">
                    مرور پاسخ‌ها
                  </h3>
                  {answerReview.map((a, i) => {
                    const q = (questions || []).find(
                      (qq) => String(qq?.id) === String(a?.question_id),
                    );
                    const ok = a?.is_correct === true;
                    return (
                      <div
                        key={i}
                        className={`rounded-2xl border p-3 space-y-1 ${
                          ok
                            ? "border-emerald-100 bg-emerald-50/40"
                            : "border-rose-100 bg-rose-50/40"
                        }`}
                      >
                        <p className="text-xs text-slate-500">سوال {i + 1}</p>
                        <p className="text-sm text-slate-800 font-medium leading-7">
                          {q?.question ?? a?.question ?? "—"}
                        </p>
                        <p className="text-xs text-slate-600">
                          <span className="font-semibold">پاسخ دانش‌آموز: </span>
                          {a?.user_answer && a.user_answer.length > 0
                            ? a.user_answer
                            : "—"}
                        </p>
                        {a?.correct_answer && (
                          <p className="text-xs text-emerald-700">
                            <span className="font-semibold">پاسخ درست: </span>
                            {a?.correct_answer}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {checkupError && (
                <p className="text-sm text-rose-600">{checkupError}</p>
              )}

              <Button
                variant="outline"
                onClick={restartCheckup}
                className="rounded-full"
              >
                چکاب جدید
              </Button>
            </div>
            </InlineResultErrorBoundary>
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
            <InlineResultErrorBoundary resetKey={`analysis-${resultResetKey}`}>
            {/* weak concepts */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  ضعف‌های شناسایی شده
                </h3>
                {safeWeakConcepts.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {safeWeakConcepts.map((item, i: number) => (
                      <Badge
                        key={i}
                        className="bg-amber-100 text-amber-700 border-0 gap-1"
                      >
                        <span>{getWeakConceptLabel(item)}</span>
                        <span className="text-amber-600/80">
                          {getWeakConceptWrongCount(item)} پاسخ نادرست
                        </span>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                    ضعف خاصی ثبت نشده است.
                  </p>
                )}
              </div>

            {/* recommendation */}
            {safeRecommendationText && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-500" />
                  پیشنهاد مطالعه
                </h3>
                <div className="rounded-2xl bg-violet-50/60 border border-violet-100 p-3 text-sm text-slate-700">
                  <p className="leading-7">{safeRecommendationText}</p>
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
            </InlineResultErrorBoundary>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
