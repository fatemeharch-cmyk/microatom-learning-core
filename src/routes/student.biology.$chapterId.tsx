import { createFileRoute, Link, notFound, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import {
  SUBJECT,
  CHAPTER,
  GOFTARS,
  ATOMS,
  MICRO_ATOMS,
  STUDENT_ID,
  addDose,
  addCheckup,
  ensureSeed,
  getCheckups,
  getDoses,
  refreshDosesFor,
  goftarById,
  atomById,
  microAtomById,
  atomsByGoftar,
  microAtomsByAtom,
  questionsByMicro,
  useBioCh1Tick,
} from "@/lib/mock/biology-ch1";

import {
  Leaf,
  ChevronLeft,
  ListChecks,
  Atom as AtomIcon,
  Timer,
  Stethoscope,
  CheckCircle2,
  NotebookPen,
  ScrollText,
  Target,
} from "lucide-react";

type Search = {
  goftar?: string;
  atom?: string;
  micro?: string;
};

export const Route = createFileRoute("/student/biology/$chapterId")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    goftar: typeof s.goftar === "string" ? s.goftar : undefined,
    atom: typeof s.atom === "string" ? s.atom : undefined,
    micro: typeof s.micro === "string" ? s.micro : undefined,
  }),
  loader: ({ params }) => {
    if (params.chapterId !== CHAPTER.id) throw notFound();
    return { chapter: CHAPTER };
  },
  component: ChapterPage,
  notFoundComponent: () => (
    <div dir="rtl" className="bg-white rounded-3xl p-10 text-center text-slate-500">
      این فصل هنوز فعال نیست.
    </div>
  ),
});

function Crumbs() {
  const { goftar, atom, micro } = useSearch({ from: "/student/biology/$chapterId" });
  const g = goftar ? goftarById(goftar) : null;
  const a = atom ? atomById(atom) : null;
  const m = micro ? microAtomById(micro) : null;
  return (
    <nav className="text-xs text-slate-500 flex items-center gap-1 flex-wrap">
      <Link to="/student" className="hover:text-emerald-600">کلینیک من</Link>
      <span>/</span>
      <Link to="/student/biology" className="hover:text-emerald-600">{SUBJECT.title}</Link>
      <span>/</span>
      <Link
        to="/student/biology/$chapterId"
        params={{ chapterId: CHAPTER.id }}
        className="hover:text-emerald-600"
      >
        {CHAPTER.title}
      </Link>
      {g && (
        <>
          <span>/</span>
          <Link
            to="/student/biology/$chapterId"
            params={{ chapterId: CHAPTER.id }}
            search={{ goftar: g.id }}
            className="hover:text-emerald-600"
          >
            {g.title}
          </Link>
        </>
      )}
      {a && (
        <>
          <span>/</span>
          <Link
            to="/student/biology/$chapterId"
            params={{ chapterId: CHAPTER.id }}
            search={{ goftar: g?.id, atom: a.id }}
            className="hover:text-emerald-600"
          >
            {a.title}
          </Link>
        </>
      )}
      {m && (
        <>
          <span>/</span>
          <span className="text-slate-700 font-semibold">{m.title}</span>
        </>
      )}
    </nav>
  );
}

function ChapterPage() {
  ensureSeed();
  useBioCh1Tick();
  const { goftar, atom, micro } = useSearch({ from: "/student/biology/$chapterId" });

  let view: "goftars" | "atoms" | "micros" | "micro" = "goftars";
  if (micro) view = "micro";
  else if (atom) view = "micros";
  else if (goftar) view = "atoms";

  return (
    <div dir="rtl" className="font-vazir space-y-5">
      <Crumbs />
      <header className="flex items-center gap-3">
        <span className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 grid place-items-center">
          <Leaf className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">{CHAPTER.title}</h1>
          <p className="text-sm text-slate-500">
            از گفتار شروع کن، اتم را انتخاب کن و روی میکرواتم تمرکز کن.
          </p>
        </div>
      </header>

      {view === "goftars" && <GoftarList />}
      {view === "atoms" && goftar && <AtomList goftarId={goftar} />}
      {view === "micros" && atom && <MicroList atomId={atom} />}
      {view === "micro" && micro && <MicroDrill microId={micro} />}
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-0 rounded-3xl shadow-sm bg-white">
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center">
            {icon}
          </span>
          <div>
            <CardTitle className="text-base text-slate-800">{title}</CardTitle>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function GoftarList() {
  return (
    <SectionCard title="گفتارها" subtitle={`${GOFTARS.length} گفتار در این فصل`} icon={<ListChecks className="h-4 w-4" />}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {GOFTARS.map((g) => {
          const count = atomsByGoftar(g.id).length;
          return (
            <Link
              key={g.id}
              to="/student/biology/$chapterId"
              params={{ chapterId: CHAPTER.id }}
              search={{ goftar: g.id }}
              className="rounded-2xl border border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50 transition p-4 flex items-start justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="font-semibold text-slate-800">{g.title}</div>
                <div className="text-xs text-slate-500 mt-1">{g.summary}</div>
                <Badge variant="outline" className="mt-2 border-emerald-200 text-emerald-700 bg-white">
                  {count} اتم
                </Badge>
              </div>
              <ChevronLeft className="h-5 w-5 text-emerald-600 mt-1 shrink-0" />
            </Link>
          );
        })}
      </div>
    </SectionCard>
  );
}

function AtomList({ goftarId }: { goftarId: string }) {
  const g = goftarById(goftarId);
  if (!g) return <Empty message="گفتار یافت نشد." />;
  const atoms = atomsByGoftar(goftarId);
  return (
    <SectionCard title={`اتم‌های ${g.title}`} icon={<AtomIcon className="h-4 w-4" />}>
      <div className="grid sm:grid-cols-2 gap-3">
        {atoms.map((a) => {
          const micros = microAtomsByAtom(a.id);
          return (
            <Link
              key={a.id}
              to="/student/biology/$chapterId"
              params={{ chapterId: CHAPTER.id }}
              search={{ goftar: goftarId, atom: a.id }}
              className="rounded-2xl border border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50 transition p-4 flex items-start justify-between gap-3"
            >
              <div>
                <div className="font-semibold text-slate-800">{a.title}</div>
                <Badge variant="outline" className="mt-2 border-emerald-200 text-emerald-700 bg-white">
                  {micros.length} میکرواتم
                </Badge>
              </div>
              <ChevronLeft className="h-5 w-5 text-emerald-600 mt-1 shrink-0" />
            </Link>
          );
        })}
      </div>
    </SectionCard>
  );
}

function MicroList({ atomId }: { atomId: string }) {
  const a = atomById(atomId);
  if (!a) return <Empty message="اتم یافت نشد." />;
  const micros = microAtomsByAtom(atomId);
  const checkups = getCheckups(STUDENT_ID);
  return (
    <SectionCard title={`میکرواتم‌های ${a.title}`} icon={<ListChecks className="h-4 w-4" />}>
      <div className="grid sm:grid-cols-2 gap-3">
        {micros.map((m) => {
          const last = [...checkups]
            .filter((c) => c.microAtomId === m.id)
            .sort((x, y) => y.at - x.at)[0];
          return (
            <Link
              key={m.id}
              to="/student/biology/$chapterId"
              params={{ chapterId: CHAPTER.id }}
              search={{ goftar: a.goftarId, atom: atomId, micro: m.id }}
              className="rounded-2xl border border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50 transition p-4 flex items-start justify-between gap-3"
            >
              <div>
                <div className="font-semibold text-slate-800">{m.title}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {last ? `آخرین چکاب: ${last.score}٪` : "هنوز چکابی ثبت نشده"}
                </div>
              </div>
              <ChevronLeft className="h-5 w-5 text-emerald-600 mt-1 shrink-0" />
            </Link>
          );
        })}
      </div>
    </SectionCard>
  );
}

type Phase = "idle" | "taking" | "review";

function MicroDrill({ microId }: { microId: string }) {
  const m = microAtomById(microId);
  const questions = useMemo(() => questionsByMicro(microId), [microId]);
  const [doseMinutes, setDoseMinutes] = useState("20");
  const [phase, setPhase] = useState<Phase>("idle");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [lastResult, setLastResult] = useState<{ correct: number; total: number; score: number } | null>(null);

  if (!m) return <Empty message="میکرواتم یافت نشد." />;

  const myDoses = getDoses(STUDENT_ID).filter((d) => d.microAtomId === microId);
  const myCheckups = getCheckups(STUDENT_ID).filter((c) => c.microAtomId === microId);

  function handleDose() {
    const n = parseInt(doseMinutes, 10);
    if (!n || n <= 0) return;
    addDose({ studentId: STUDENT_ID, microAtomId: microId, minutes: n });
    setDoseMinutes("20");
  }

  function handleStart() {
    setAnswers({});
    setLastResult(null);
    setPhase("taking");
  }

  function handleSubmit() {
    const total = questions.length;
    const correct = questions.reduce(
      (acc, q) => acc + (answers[q.id] === q.correctIndex ? 1 : 0),
      0,
    );
    const score = total === 0 ? 0 : Math.round((correct / total) * 100);
    addCheckup({ studentId: STUDENT_ID, microAtomId: microId, score, total, correct });
    setLastResult({ correct, total, score });
    setPhase("review");
  }

  const avg =
    myCheckups.length === 0
      ? null
      : Math.round(myCheckups.reduce((s, c) => s + c.score, 0) / myCheckups.length);

  return (
    <div className="space-y-5">
      <SectionCard
        title={`ثبت دوز مطالعه — ${m.title}`}
        subtitle="مدت زمان مطالعه روی این میکرواتم را وارد کن."
        icon={<Timer className="h-4 w-4" />}
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="flex-1">
            <Label htmlFor="dose">دوز (دقیقه)</Label>
            <Input
              id="dose"
              type="number"
              min={1}
              value={doseMinutes}
              onChange={(e) => setDoseMinutes(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button onClick={handleDose} className="rounded-full bg-emerald-600 hover:bg-emerald-700">
            ثبت دوز
          </Button>
        </div>
        {myDoses.length > 0 && (
          <div className="text-xs text-slate-500 mt-3">
            دوزهای ثبت‌شده روی این میکرواتم: {myDoses.length} مورد · مجموع{" "}
            {myDoses.reduce((s, d) => s + d.minutes, 0)} دقیقه.
          </div>
        )}
      </SectionCard>

      <SectionCard
        title={`چکاب — ${m.title}`}
        subtitle={`${questions.length} سؤال کوتاه برای سنجش این میکرواتم`}
        icon={<Stethoscope className="h-4 w-4" />}
      >
        {phase === "idle" && (
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="text-sm text-slate-500">
              آمادگی لازم را داری؟ چکاب کوتاهی برای این میکرواتم در نظر گرفته شده.
            </div>
            <Button
              onClick={handleStart}
              disabled={questions.length === 0}
              className="rounded-full bg-rose-500 hover:bg-rose-600"
            >
              شروع چکاب
            </Button>
          </div>
        )}

        {phase === "taking" && (
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={q.id} className="rounded-2xl border border-slate-100 p-4 bg-white">
                <div className="font-medium mb-3 text-slate-800">
                  {idx + 1}. {q.prompt}
                </div>
                <RadioGroup
                  value={answers[q.id]?.toString() ?? ""}
                  onValueChange={(v) =>
                    setAnswers((s) => ({ ...s, [q.id]: parseInt(v, 10) }))
                  }
                  className="gap-2"
                >
                  {q.options.map((opt, i) => (
                    <label
                      key={i}
                      className="flex items-center gap-2 rounded-xl border border-slate-100 p-2 cursor-pointer hover:bg-slate-50"
                    >
                      <RadioGroupItem value={i.toString()} id={`${q.id}-${i}`} />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            ))}
            <div className="flex justify-end">
              <Button onClick={handleSubmit} className="rounded-full bg-emerald-600 hover:bg-emerald-700">
                ثبت پاسخ‌ها
              </Button>
            </div>
          </div>
        )}

        {phase === "review" && lastResult && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              <div>
                <div className="font-semibold text-slate-800">نتیجه چکاب</div>
                <div className="text-sm text-slate-600">
                  {lastResult.correct} از {lastResult.total} پاسخ درست — نمره {lastResult.score}٪
                </div>
              </div>
            </div>
            <Progress value={lastResult.score} />
            <div className="space-y-2">
              {questions.map((q, idx) => {
                const picked = answers[q.id];
                const correct = picked === q.correctIndex;
                return (
                  <div key={q.id} className="rounded-xl border border-slate-100 p-3 bg-white">
                    <div className="text-sm font-medium mb-1 text-slate-800">
                      {idx + 1}. {q.prompt}
                    </div>
                    <div className="text-xs">
                      <span className={correct ? "text-emerald-600" : "text-rose-600"}>
                        پاسخ شما: {picked != null ? q.options[picked] : "—"}
                      </span>
                      {!correct && (
                        <span className="text-slate-500 mr-3">
                          پاسخ درست: {q.options[q.correctIndex]}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setPhase("idle")} className="rounded-full">
                پایان
              </Button>
              <Button onClick={handleStart} className="rounded-full bg-emerald-600 hover:bg-emerald-700">
                چکاب دوباره
              </Button>
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="تحلیل عملکرد"
        subtitle="میانگین چکاب‌های این میکرواتم"
        icon={<ListChecks className="h-4 w-4" />}
      >
        {myCheckups.length === 0 ? (
          <div className="text-sm text-slate-500">هنوز چکابی برای این میکرواتم ثبت نشده.</div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">میانگین: {avg}٪</Badge>
              <Badge variant="outline">تعداد چکاب: {myCheckups.length}</Badge>
              {avg != null && avg < 60 && (
                <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">
                  نیازمند مرور
                </Badge>
              )}
            </div>
            <Progress value={avg ?? 0} />
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="ادامه مسیر یادگیری"
        subtitle="بر اساس عملکرد این میکرواتم"
        icon={<Target className="h-4 w-4" />}
      >
        <div className="grid sm:grid-cols-3 gap-3">
          <Link
            to="/student/notebook"
            className="rounded-2xl border border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50 transition p-4 flex items-center gap-3"
          >
            <span className="h-10 w-10 rounded-xl bg-white text-emerald-600 grid place-items-center border border-emerald-100">
              <NotebookPen className="h-4 w-4" />
            </span>
            <div>
              <div className="font-semibold text-slate-800 text-sm">کلینیک یادگیری</div>
              <div className="text-[11px] text-slate-500">یادداشت و مرور خطاها</div>
            </div>
          </Link>
          <Link
            to="/student/next-step"
            className="rounded-2xl border border-violet-100 bg-violet-50/40 hover:bg-violet-50 transition p-4 flex items-center gap-3"
          >
            <span className="h-10 w-10 rounded-xl bg-white text-violet-600 grid place-items-center border border-violet-100">
              <ScrollText className="h-4 w-4" />
            </span>
            <div>
              <div className="font-semibold text-slate-800 text-sm">نسخه</div>
              <div className="text-[11px] text-slate-500">گام بعدی پیشنهادی</div>
            </div>
          </Link>
          <Link
            to="/student/homework"
            className="rounded-2xl border border-amber-100 bg-amber-50/40 hover:bg-amber-50 transition p-4 flex items-center gap-3"
          >
            <span className="h-10 w-10 rounded-xl bg-white text-amber-600 grid place-items-center border border-amber-100">
              <Target className="h-4 w-4" />
            </span>
            <div>
              <div className="font-semibold text-slate-800 text-sm">ماموریت</div>
              <div className="text-[11px] text-slate-500">تمرین‌های تثبیت</div>
            </div>
          </Link>
        </div>
      </SectionCard>
    </div>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-3xl p-10 text-center text-slate-500 border border-slate-100">
      {message}
    </div>
  );
}

// Silence unused import warnings for items kept for type-only consumers.
void MICRO_ATOMS;
void ATOMS;
