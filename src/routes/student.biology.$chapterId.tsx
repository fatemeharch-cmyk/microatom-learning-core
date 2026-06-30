import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import {
  STUDENT_ID,
  addDose,
  addCheckup,
  getCheckups,
  getDoses,
  refreshDosesFor,
  questionsByMicro,
  useBioCh1Tick,
} from "@/lib/mock/biology-ch1";
import {
  listGoftarsByChapter,
  listAtomsByGoftar,
  listMicroAtomsByAtom,
  findBiologySubject,
  listChaptersBySubject,
  type ContentGoftar,
  type ContentAtom,
  type ContentMicroAtom,
} from "@/lib/services/content-service";

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
  Loader2,
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
  component: ChapterPage,
  notFoundComponent: () => (
    <div dir="rtl" className="bg-white rounded-3xl p-10 text-center text-slate-500">
      این فصل هنوز فعال نیست.
    </div>
  ),
});

function useChapterTitle(chapterId: string) {
  // Resolve chapter title by listing chapters of the Biology subject.
  const subjectQ = useQuery({
    queryKey: ["content", "biology-subject"],
    queryFn: () => findBiologySubject(),
    staleTime: 5 * 60_000,
  });
  const chaptersQ = useQuery({
    queryKey: ["content", "chapters", subjectQ.data?.id],
    queryFn: () => listChaptersBySubject(subjectQ.data!.id),
    enabled: !!subjectQ.data?.id,
    staleTime: 5 * 60_000,
  });
  const chapter = (chaptersQ.data ?? []).find((c) => c.id === chapterId);
  return {
    title: chapter?.title ?? "فصل",
    subjectTitle: subjectQ.data?.title ?? "زیست‌شناسی",
  };
}

function Crumbs({
  chapterId,
  chapterTitle,
  subjectTitle,
  goftar,
  atom,
  micro,
  goftars,
  atoms,
  micros,
}: {
  chapterId: string;
  chapterTitle: string;
  subjectTitle: string;
  goftar?: string;
  atom?: string;
  micro?: string;
  goftars: ContentGoftar[];
  atoms: ContentAtom[];
  micros: ContentMicroAtom[];
}) {
  const g = goftar ? goftars.find((x) => x.id === goftar) : null;
  const a = atom ? atoms.find((x) => x.id === atom) : null;
  const m = micro ? micros.find((x) => x.id === micro) : null;
  return (
    <nav className="text-xs text-slate-500 flex items-center gap-1 flex-wrap">
      <Link to="/student" className="hover:text-emerald-600">
        کلینیک من
      </Link>
      <span>/</span>
      <Link to="/student/biology" className="hover:text-emerald-600">
        {subjectTitle}
      </Link>
      <span>/</span>
      <Link
        to="/student/biology/$chapterId"
        params={{ chapterId }}
        className="hover:text-emerald-600"
      >
        {chapterTitle}
      </Link>
      {g && (
        <>
          <span>/</span>
          <Link
            to="/student/biology/$chapterId"
            params={{ chapterId }}
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
            params={{ chapterId }}
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
  const { chapterId } = Route.useParams();
  useBioCh1Tick();
  useEffect(() => {
    refreshDosesFor(STUDENT_ID, true);
  }, []);
  const { goftar, atom, micro } = useSearch({ from: "/student/biology/$chapterId" });
  const { title: chapterTitle, subjectTitle } = useChapterTitle(chapterId);

  const goftarsQ = useQuery({
    queryKey: ["content", "goftars", chapterId],
    queryFn: () => listGoftarsByChapter(chapterId),
    staleTime: 5 * 60_000,
  });
  const goftars = goftarsQ.data ?? [];

  const atomsQ = useQuery({
    queryKey: ["content", "atoms", goftar],
    queryFn: () => listAtomsByGoftar(goftar!),
    enabled: !!goftar,
    staleTime: 5 * 60_000,
  });
  const atoms = atomsQ.data ?? [];

  const microsQ = useQuery({
    queryKey: ["content", "micros", atom],
    queryFn: () => listMicroAtomsByAtom(atom!),
    enabled: !!atom,
    staleTime: 5 * 60_000,
  });
  const micros = microsQ.data ?? [];

  let view: "goftars" | "atoms" | "micros" | "micro" = "goftars";
  if (micro) view = "micro";
  else if (atom) view = "micros";
  else if (goftar) view = "atoms";

  return (
    <div dir="rtl" className="font-vazir space-y-5">
      <Crumbs
        chapterId={chapterId}
        chapterTitle={chapterTitle}
        subjectTitle={subjectTitle}
        goftar={goftar}
        atom={atom}
        micro={micro}
        goftars={goftars}
        atoms={atoms}
        micros={micros}
      />
      <header className="flex items-center gap-3">
        <span className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 grid place-items-center">
          <Leaf className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">{chapterTitle}</h1>
          <p className="text-sm text-slate-500">
            از گفتار شروع کن، اتم را انتخاب کن و روی میکرواتم تمرکز کن.
          </p>
        </div>
      </header>

      {view === "goftars" && (
        <GoftarList
          chapterId={chapterId}
          goftars={goftars}
          loading={goftarsQ.isLoading}
          error={goftarsQ.isError}
        />
      )}
      {view === "atoms" && goftar && (
        <AtomList
          chapterId={chapterId}
          goftarId={goftar}
          goftarTitle={goftars.find((g) => g.id === goftar)?.title ?? "گفتار"}
          atoms={atoms}
          loading={atomsQ.isLoading}
          error={atomsQ.isError}
        />
      )}
      {view === "micros" && atom && goftar && (
        <MicroList
          chapterId={chapterId}
          goftarId={goftar}
          atomId={atom}
          atomTitle={atoms.find((a) => a.id === atom)?.title ?? "اتم"}
          micros={micros}
          loading={microsQ.isLoading}
          error={microsQ.isError}
        />
      )}
      {view === "micro" && micro && (
        <MicroDrill
          microId={micro}
          microTitle={micros.find((m) => m.id === micro)?.title ?? "میکرواتم"}
        />
      )}
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
        <span className="mr-2 text-sm">در حال دریافت محتوا…</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl p-4">
        دریافت محتوا با خطا روبه‌رو شد.
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

function GoftarList({
  chapterId,
  goftars,
  loading,
  error,
}: {
  chapterId: string;
  goftars: ContentGoftar[];
  loading: boolean;
  error: boolean;
}) {
  return (
    <SectionCard
      title="گفتارها"
      subtitle={`${goftars.length} گفتار در این فصل`}
      icon={<ListChecks className="h-4 w-4" />}
    >
      <StateBlock
        loading={loading}
        error={error}
        empty={!loading && !error && goftars.length === 0}
        emptyMessage="گفتاری برای این فصل ثبت نشده."
      />
      {!loading && !error && goftars.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {goftars.map((g) => (
            <Link
              key={g.id}
              to="/student/biology/$chapterId"
              params={{ chapterId }}
              search={{ goftar: g.id }}
              className="rounded-2xl border border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50 transition p-4 flex items-start justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="font-semibold text-slate-800">{g.title}</div>
                {g.summary && (
                  <div className="text-xs text-slate-500 mt-1">{g.summary}</div>
                )}
              </div>
              <ChevronLeft className="h-5 w-5 text-emerald-600 mt-1 shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function AtomList({
  chapterId,
  goftarId,
  goftarTitle,
  atoms,
  loading,
  error,
}: {
  chapterId: string;
  goftarId: string;
  goftarTitle: string;
  atoms: ContentAtom[];
  loading: boolean;
  error: boolean;
}) {
  return (
    <SectionCard title={`اتم‌های ${goftarTitle}`} icon={<AtomIcon className="h-4 w-4" />}>
      <StateBlock
        loading={loading}
        error={error}
        empty={!loading && !error && atoms.length === 0}
        emptyMessage="اتمی برای این گفتار ثبت نشده."
      />
      {!loading && !error && atoms.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-3">
          {atoms.map((a) => (
            <Link
              key={a.id}
              to="/student/biology/$chapterId"
              params={{ chapterId }}
              search={{ goftar: goftarId, atom: a.id }}
              className="rounded-2xl border border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50 transition p-4 flex items-start justify-between gap-3"
            >
              <div>
                <div className="font-semibold text-slate-800">{a.title}</div>
              </div>
              <ChevronLeft className="h-5 w-5 text-emerald-600 mt-1 shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function MicroList({
  chapterId,
  goftarId,
  atomId,
  atomTitle,
  micros,
  loading,
  error,
}: {
  chapterId: string;
  goftarId: string;
  atomId: string;
  atomTitle: string;
  micros: ContentMicroAtom[];
  loading: boolean;
  error: boolean;
}) {
  const checkups = getCheckups(STUDENT_ID);
  return (
    <SectionCard
      title={`میکرواتم‌های ${atomTitle}`}
      icon={<ListChecks className="h-4 w-4" />}
    >
      <StateBlock
        loading={loading}
        error={error}
        empty={!loading && !error && micros.length === 0}
        emptyMessage="میکرواتمی برای این اتم ثبت نشده."
      />
      {!loading && !error && micros.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-3">
          {micros.map((m) => {
            const last = [...checkups]
              .filter((c) => c.microAtomId === m.id)
              .sort((x, y) => y.at - x.at)[0];
            return (
              <Link
                key={m.id}
                to="/student/biology/$chapterId"
                params={{ chapterId }}
                search={{ goftar: goftarId, atom: atomId, micro: m.id }}
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
      )}
    </SectionCard>
  );
}

type Phase = "idle" | "taking" | "review";

function MicroDrill({
  microId,
  microTitle,
}: {
  microId: string;
  microTitle: string;
}) {
  const questions = useMemo(() => questionsByMicro(microId), [microId]);
  const [doseMinutes, setDoseMinutes] = useState("20");
  const [phase, setPhase] = useState<Phase>("idle");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [lastResult, setLastResult] = useState<{
    correct: number;
    total: number;
    score: number;
  } | null>(null);

  const myDoses = getDoses(STUDENT_ID).filter((d) => d.microAtomId === microId);
  const myCheckups = getCheckups(STUDENT_ID).filter(
    (c) => c.microAtomId === microId,
  );

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
        title={`ثبت دوز مطالعه — ${microTitle}`}
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
          <Button
            onClick={handleDose}
            className="rounded-full bg-emerald-600 hover:bg-emerald-700"
          >
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
        title={`چکاب — ${microTitle}`}
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
              <Button
                onClick={handleSubmit}
                className="rounded-full bg-emerald-600 hover:bg-emerald-700"
              >
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
                  {lastResult.correct} از {lastResult.total} پاسخ درست — نمره{" "}
                  {lastResult.score}٪
                </div>
              </div>
            </div>
            <Progress value={lastResult.score} />
            <div className="space-y-2">
              {questions.map((q, idx) => {
                const picked = answers[q.id];
                const correct = picked === q.correctIndex;
                return (
                  <div
                    key={q.id}
                    className="rounded-xl border border-slate-100 p-3 bg-white"
                  >
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
              <Button
                variant="outline"
                onClick={() => setPhase("idle")}
                className="rounded-full"
              >
                پایان
              </Button>
              <Button
                onClick={handleStart}
                className="rounded-full bg-emerald-600 hover:bg-emerald-700"
              >
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
          <div className="text-sm text-slate-500">
            هنوز چکابی برای این میکرواتم ثبت نشده.
          </div>
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
