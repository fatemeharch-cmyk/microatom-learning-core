import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import {
  CHAPTER,
  MICRO_ATOMS,
  QUESTIONS,
  addDose,
  addCheckup,
  getDoses,
  getCheckups,
  useBioCh1Tick,
  ensureSeed,
  type MicroAtom,
} from "@/lib/mock/biology-ch1";
import { Beaker, Stethoscope, Timer, CheckCircle2, ListChecks } from "lucide-react";

export const Route = createFileRoute("/student/biology-ch1")({
  component: BiologyCh1Page,
});

const STUDENT_ID = "stu-arman";

type Phase = "idle" | "taking" | "review";

function BiologyCh1Page() {
  ensureSeed();
  useBioCh1Tick();

  const [selected, setSelected] = useState<MicroAtom | null>(null);
  const [doseMinutes, setDoseMinutes] = useState<string>("20");
  const [phase, setPhase] = useState<Phase>("idle");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [lastResult, setLastResult] = useState<{ correct: number; total: number; score: number } | null>(null);

  const questions = useMemo(
    () => (selected ? QUESTIONS.filter((q) => q.microAtomId === selected.id) : []),
    [selected],
  );

  const myDoses = getDoses().filter((d) => d.studentId === STUDENT_ID);
  const myCheckups = getCheckups().filter((c) => c.studentId === STUDENT_ID);

  function handleRegisterDose() {
    if (!selected) return;
    const m = parseInt(doseMinutes, 10);
    if (!m || m <= 0) return;
    addDose({ studentId: STUDENT_ID, microAtomId: selected.id, minutes: m });
    setDoseMinutes("20");
  }

  function handleStartCheckup() {
    if (!selected || questions.length === 0) return;
    setAnswers({});
    setLastResult(null);
    setPhase("taking");
  }

  function handleSubmit() {
    if (!selected) return;
    const total = questions.length;
    const correct = questions.reduce(
      (acc, q) => acc + (answers[q.id] === q.correctIndex ? 1 : 0),
      0,
    );
    const score = total === 0 ? 0 : Math.round((correct / total) * 100);
    addCheckup({ studentId: STUDENT_ID, microAtomId: selected.id, score, total, correct });
    setLastResult({ correct, total, score });
    setPhase("review");
  }

  return (
    <div dir="rtl" className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Beaker className="h-6 w-6 text-emerald-600" />
          {CHAPTER.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          یک میکرواتم را انتخاب کن، دوز مطالعه را ثبت کن و چکاب کوتاه بده.
        </p>
      </header>

      {/* Step 1: select micro_atom */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-primary" />
            ۱) انتخاب میکرواتم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {MICRO_ATOMS.map((m) => {
              const active = selected?.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelected(m);
                    setPhase("idle");
                    setLastResult(null);
                  }}
                  className={`text-right rounded-xl border p-4 transition ${
                    active
                      ? "border-emerald-500 bg-emerald-50 shadow-sm"
                      : "border-border bg-card hover:border-emerald-300"
                  }`}
                >
                  <div className="text-xs text-muted-foreground">{m.section}</div>
                  <div className="font-medium mt-1">{m.title}</div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selected && (
        <>
          {/* Step 2: dose */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Timer className="h-5 w-5 text-sky-600" />
                ۲) ثبت دوز مطالعه — {selected.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                <div className="flex-1">
                  <Label htmlFor="dose">مدت (دقیقه)</Label>
                  <Input
                    id="dose"
                    type="number"
                    min={1}
                    value={doseMinutes}
                    onChange={(e) => setDoseMinutes(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleRegisterDose} className="rounded-full">
                  ثبت دوز
                </Button>
              </div>
              {myDoses.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  دوزهای ثبت‌شده روی این فصل: {myDoses.length} مورد، مجموع{" "}
                  {myDoses.reduce((s, d) => s + d.minutes, 0)} دقیقه.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 3: checkup */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-rose-600" />
                ۳) چکاب — {selected.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {phase === "idle" && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {questions.length} سؤال کوتاه برای سنجش این میکرواتم.
                  </div>
                  <Button
                    onClick={handleStartCheckup}
                    disabled={questions.length === 0}
                    className="rounded-full"
                  >
                    شروع چکاب
                  </Button>
                </div>
              )}

              {phase === "taking" && (
                <div className="space-y-5">
                  {questions.map((q, idx) => (
                    <div key={q.id} className="rounded-xl border p-4 bg-card">
                      <div className="font-medium mb-3">
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
                            className="flex items-center gap-2 rounded-lg border p-2 cursor-pointer hover:bg-muted/50"
                          >
                            <RadioGroupItem value={i.toString()} id={`${q.id}-${i}`} />
                            <span className="text-sm">{opt}</span>
                          </label>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <Button onClick={handleSubmit} className="rounded-full">
                      ثبت پاسخ‌ها
                    </Button>
                  </div>
                </div>
              )}

              {phase === "review" && lastResult && (
                <div className="space-y-4">
                  <div className="rounded-xl border bg-emerald-50 p-4 flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    <div>
                      <div className="font-semibold">نتیجه چکاب</div>
                      <div className="text-sm text-muted-foreground">
                        {lastResult.correct} از {lastResult.total} پاسخ درست — نمره{" "}
                        {lastResult.score}٪
                      </div>
                    </div>
                  </div>
                  <Progress value={lastResult.score} />
                  <div className="space-y-3">
                    {questions.map((q, idx) => {
                      const picked = answers[q.id];
                      const correct = picked === q.correctIndex;
                      return (
                        <div key={q.id} className="rounded-xl border p-3 bg-card">
                          <div className="text-sm font-medium mb-1">
                            {idx + 1}. {q.prompt}
                          </div>
                          <div className="text-xs">
                            <span className={correct ? "text-emerald-600" : "text-rose-600"}>
                              پاسخ شما: {picked != null ? q.options[picked] : "—"}
                            </span>
                            {!correct && (
                              <span className="text-muted-foreground mr-3">
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
                    <Button onClick={handleStartCheckup} className="rounded-full">
                      چکاب دوباره
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 4: simple analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">۴) تحلیل کوتاه</CardTitle>
            </CardHeader>
            <CardContent>
              {myCheckups.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  هنوز چکابی ثبت نشده است.
                </div>
              ) : (
                <AnalysisBlock studentCheckups={myCheckups} />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function AnalysisBlock({
  studentCheckups,
}: {
  studentCheckups: ReturnType<typeof getCheckups>;
}) {
  const byMicro = new Map<string, { sum: number; n: number }>();
  studentCheckups.forEach((c) => {
    const cur = byMicro.get(c.microAtomId) ?? { sum: 0, n: 0 };
    cur.sum += c.score;
    cur.n += 1;
    byMicro.set(c.microAtomId, cur);
  });
  const rows = MICRO_ATOMS.map((m) => {
    const v = byMicro.get(m.id);
    const avg = v ? Math.round(v.sum / v.n) : null;
    return { m, avg };
  });
  const weak = rows.filter((r) => r.avg != null && (r.avg as number) < 60);
  const avgAll = Math.round(
    studentCheckups.reduce((s, c) => s + c.score, 0) / studentCheckups.length,
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Badge variant="outline">میانگین نمره: {avgAll}٪</Badge>
        <Badge variant="outline">تعداد چکاب: {studentCheckups.length}</Badge>
      </div>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.m.id} className="flex items-center justify-between text-sm">
            <span>{r.m.title}</span>
            <span className={r.avg == null ? "text-muted-foreground" : r.avg < 60 ? "text-rose-600" : "text-emerald-600"}>
              {r.avg == null ? "—" : `${r.avg}٪`}
            </span>
          </div>
        ))}
      </div>
      {weak.length > 0 && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm">
          مفاهیم نیازمند مرور: {weak.map((w) => w.m.title).join("، ")}
        </div>
      )}
    </div>
  );
}
