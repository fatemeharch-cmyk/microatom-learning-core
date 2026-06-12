import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Sparkles,
  Plus,
  Trash2,
  Wand2,
  RefreshCw,
  Gauge,
  ListChecks,
  Atom,
  Lightbulb,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/teacher/analyzer")({
  component: ExamAnalyzerPage,
});

type Q = {
  id: string;
  text: string;
  microAtom: string;
  correctPct: number; // 0-100 share of students who answered correctly
  avgTimeSec: number; // average time spent
  expectedTimeSec: number; // teacher's estimate
  attempts: number; // average attempts (1-3)
};

const seedFA: Q[] = [
  { id: "q1", text: "حل معادله درجه دوم با Δ منفی", microAtom: "معادله درجه دوم", correctPct: 38, avgTimeSec: 220, expectedTimeSec: 120, attempts: 2.2 },
  { id: "q2", text: "ضرب چندجمله‌ای ساده", microAtom: "ضرب چندجمله‌ای", correctPct: 82, avgTimeSec: 90, expectedTimeSec: 90, attempts: 1.1 },
  { id: "q3", text: "محاسبه شیب خط از دو نقطه", microAtom: "شیب خط", correctPct: 64, avgTimeSec: 140, expectedTimeSec: 120, attempts: 1.4 },
  { id: "q4", text: "حل سیستم دو معادله دو مجهول", microAtom: "سیستم معادلات", correctPct: 52, avgTimeSec: 180, expectedTimeSec: 150, attempts: 1.7 },
  { id: "q5", text: "تحلیل نمودار تابع درجه دوم", microAtom: "معادله درجه دوم", correctPct: 44, avgTimeSec: 200, expectedTimeSec: 140, attempts: 2.0 },
];
const seedEN: Q[] = [
  { id: "q1", text: "Quadratic with negative discriminant", microAtom: "Quadratic equations", correctPct: 38, avgTimeSec: 220, expectedTimeSec: 120, attempts: 2.2 },
  { id: "q2", text: "Simple polynomial multiplication", microAtom: "Polynomial multiplication", correctPct: 82, avgTimeSec: 90, expectedTimeSec: 90, attempts: 1.1 },
  { id: "q3", text: "Slope of a line from two points", microAtom: "Line slope", correctPct: 64, avgTimeSec: 140, expectedTimeSec: 120, attempts: 1.4 },
  { id: "q4", text: "Solve 2-variable linear system", microAtom: "Linear systems", correctPct: 52, avgTimeSec: 180, expectedTimeSec: 150, attempts: 1.7 },
  { id: "q5", text: "Analyze a quadratic graph", microAtom: "Quadratic equations", correctPct: 44, avgTimeSec: 200, expectedTimeSec: 140, attempts: 2.0 },
];

function toFa(n: number | string) {
  const map = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(n).replace(/\d/g, (d) => map[Number(d)]);
}

// Difficulty model: combine correct-rate, time-overrun, attempts.
// Returns 0..100 where higher = harder.
function questionDifficulty(q: Q) {
  const incorrect = 100 - q.correctPct; // 0..100
  const timeRatio = Math.min(2.5, q.avgTimeSec / Math.max(30, q.expectedTimeSec));
  const timePenalty = Math.max(0, (timeRatio - 1) * 40); // up to ~60
  const attemptPenalty = Math.max(0, (q.attempts - 1) * 25); // up to ~50
  const raw = incorrect * 0.55 + timePenalty * 0.3 + attemptPenalty * 0.15;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

function diffBand(score: number, fa: boolean) {
  if (score >= 70) return { label: fa ? "سخت" : "Hard", cls: "bg-destructive/15 text-destructive" };
  if (score >= 45) return { label: fa ? "متوسط" : "Medium", cls: "bg-warning/15 text-warning" };
  return { label: fa ? "آسان" : "Easy", cls: "bg-success/15 text-success" };
}

function ExamAnalyzerPage() {
  const { lang } = useI18n();
  const fa = lang === "fa";
  const num = (n: number | string) => (fa ? toFa(n) : String(n));

  const [questions, setQuestions] = useState<Q[]>(fa ? seedFA : seedEN);
  const [analyzed, setAnalyzed] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [version, setVersion] = useState(0);

  // New-question form
  const [text, setText] = useState("");
  const [ma, setMa] = useState("");
  const [correct, setCorrect] = useState(60);
  const [avgT, setAvgT] = useState(120);
  const [expT, setExpT] = useState(120);
  const [att, setAtt] = useState(1.3);

  const addQ = () => {
    if (!text.trim() || !ma.trim()) return;
    setQuestions([
      ...questions,
      {
        id: crypto.randomUUID(),
        text: text.trim(),
        microAtom: ma.trim(),
        correctPct: correct,
        avgTimeSec: avgT,
        expectedTimeSec: expT,
        attempts: att,
      },
    ]);
    setText("");
    setMa("");
  };

  const analyzed_data = useMemo(() => {
    const qs = questions.map((q) => ({ ...q, difficulty: questionDifficulty(q) }));
    const examScore = qs.length
      ? Math.round(qs.reduce((a, q) => a + q.difficulty, 0) / qs.length)
      : 0;

    // Per-MicroAtom aggregation
    const byMA = new Map<string, { items: typeof qs; total: number }>();
    qs.forEach((q) => {
      const cur = byMA.get(q.microAtom) ?? { items: [], total: 0 };
      cur.items.push(q);
      cur.total += q.difficulty;
      byMA.set(q.microAtom, cur);
    });
    const microAtoms = [...byMA.entries()]
      .map(([name, v]) => ({
        name,
        count: v.items.length,
        difficulty: Math.round(v.total / v.items.length),
        avgCorrect: Math.round(v.items.reduce((a, q) => a + q.correctPct, 0) / v.items.length),
      }))
      .sort((a, b) => b.difficulty - a.difficulty);

    // Recommendations
    const recs: { tone: "warn" | "info" | "good"; text: string }[] = [];
    const hardest = [...qs].sort((a, b) => b.difficulty - a.difficulty)[0];
    const easiest = [...qs].sort((a, b) => a.difficulty - b.difficulty)[0];
    const hardestMA = microAtoms[0];

    if (examScore >= 70) {
      recs.push({
        tone: "warn",
        text: fa
          ? `سطح کلی آزمون خیلی بالاست (${examScore}). یک سؤال متوسط جایگزین سخت‌ترین سؤال کن.`
          : `Overall difficulty is very high (${examScore}). Replace the hardest question with a medium one.`,
      });
    } else if (examScore <= 30) {
      recs.push({
        tone: "warn",
        text: fa
          ? `آزمون بیش از حد آسان است (${examScore}). یک سؤال چالشی اضافه کن تا تمایز ایجاد شود.`
          : `Exam is too easy (${examScore}). Add a challenge item to create discrimination.`,
      });
    } else {
      recs.push({
        tone: "good",
        text: fa
          ? `توزیع دشواری متعادل است (${examScore}). آماده برگزاری.`
          : `Difficulty distribution is balanced (${examScore}). Ready to publish.`,
      });
    }

    if (hardest && hardest.difficulty >= 70) {
      recs.push({
        tone: "warn",
        text: fa
          ? `سؤال «${hardest.text}» سخت‌ترین است (${hardest.difficulty}). متن را شفاف‌تر کن یا یک سرنخ اضافه کن.`
          : `"${hardest.text}" is the hardest (${hardest.difficulty}). Clarify wording or add a hint.`,
      });
    }
    if (easiest && easiest.difficulty <= 20 && qs.length > 3) {
      recs.push({
        tone: "info",
        text: fa
          ? `سؤال «${easiest.text}» خیلی آسان است (${easiest.difficulty}). می‌توانی یک مرحله پیچیده‌تر اضافه کنی.`
          : `"${easiest.text}" is very easy (${easiest.difficulty}). Consider adding one extra step.`,
      });
    }
    if (hardestMA && hardestMA.difficulty >= 65) {
      recs.push({
        tone: "warn",
        text: fa
          ? `میکرواتم «${hardestMA.name}» نیازمند بازآموزی است (دشواری ${hardestMA.difficulty}، تسلط ${hardestMA.avgCorrect}٪).`
          : `MicroAtom "${hardestMA.name}" needs re-teaching (difficulty ${hardestMA.difficulty}, mastery ${hardestMA.avgCorrect}%).`,
      });
    }
    const overTime = qs.filter((q) => q.avgTimeSec > q.expectedTimeSec * 1.4);
    if (overTime.length >= 2) {
      recs.push({
        tone: "info",
        text: fa
          ? `${num(overTime.length)} سؤال زمان بیشتری نسبت به انتظار می‌برند — مدت آزمون را افزایش بده یا سؤال‌ها را ساده‌تر کن.`
          : `${overTime.length} questions take longer than expected — extend the time limit or simplify wording.`,
      });
    }

    return { qs, examScore, microAtoms, recs };
  }, [questions, version, fa, num]);

  const analyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
      setVersion((v) => v + 1);
    }, 600);
  };

  const examBand = diffBand(analyzed_data.examScore, fa);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Hero */}
      <Card className="overflow-hidden border-0 bg-[image:var(--gradient-primary)] text-primary-foreground">
        <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-white/15 grid place-items-center shrink-0">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <Badge variant="secondary" className="bg-white/15 text-primary-foreground border-0 mb-2">
              {fa ? "قدرت‌گرفته از توربو" : "Powered by Turbo"}
            </Badge>
            <h1 className="text-xl sm:text-2xl font-bold">
              {fa ? "تحلیلگر آزمون توربو" : "Turbo Exam Analyzer"}
            </h1>
            <p className="text-sm opacity-90 mt-1">
              {fa
                ? "نتایج سؤالات را وارد کن تا موتور توربوی اتومیا دشواری آزمون، سؤال و اتم‌بیت را تحلیل و پیشنهادهای توربو را آماده کند."
                : "Enter question results so Atomia's proprietary Turbo Engine can analyze exam, question, and AtomBit difficulty and prepare Turbo Recommendations."}
            </p>
          </div>
          <Button
            onClick={analyze}
            disabled={analyzing}
            size="lg"
            className="rounded-full bg-white text-primary hover:bg-white/90"
          >
            {analyzing ? <RefreshCw className="h-4 w-4 mx-1 animate-spin" /> : <Wand2 className="h-4 w-4 mx-1" />}
            {analyzed ? (fa ? "تحلیل مجدد" : "Re-analyze") : (fa ? "تحلیل آزمون" : "Analyze")}
          </Button>
        </CardContent>
      </Card>

      {/* Top summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground">{fa ? "دشواری کلی آزمون" : "Overall exam difficulty"}</p>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold">{num(analyzed_data.examScore)}</p>
              <span className="text-xs text-muted-foreground mb-1">/ {num(100)}</span>
            </div>
            <Progress value={analyzed_data.examScore} className="h-2 mt-2" />
            <Badge variant="secondary" className={`${examBand.cls} border-0 mt-2`}>
              {examBand.label}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ListChecks className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground">{fa ? "تعداد سؤالات" : "Questions"}</p>
            </div>
            <p className="text-3xl font-bold">{num(analyzed_data.qs.length)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {fa
                ? `سخت: ${num(analyzed_data.qs.filter((q) => q.difficulty >= 70).length)} • متوسط: ${num(analyzed_data.qs.filter((q) => q.difficulty >= 45 && q.difficulty < 70).length)} • آسان: ${num(analyzed_data.qs.filter((q) => q.difficulty < 45).length)}`
                : `Hard: ${analyzed_data.qs.filter((q) => q.difficulty >= 70).length} • Medium: ${analyzed_data.qs.filter((q) => q.difficulty >= 45 && q.difficulty < 70).length} • Easy: ${analyzed_data.qs.filter((q) => q.difficulty < 45).length}`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Atom className="h-4 w-4 text-primary" />
               <p className="text-xs text-muted-foreground">{fa ? "اتم‌بیت‌های پوشش‌داده‌شده" : "AtomBits covered"}</p>
            </div>
            <p className="text-3xl font-bold">{num(analyzed_data.microAtoms.length)}</p>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {analyzed_data.microAtoms[0]
                ? fa
                  ? `سخت‌ترین: ${analyzed_data.microAtoms[0].name}`
                  : `Hardest: ${analyzed_data.microAtoms[0].name}`
                : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="questions">
        <TabsList>
          <TabsTrigger value="questions">
            <ListChecks className="h-4 w-4 mx-1" />
            {fa ? "سؤالات" : "Questions"}
          </TabsTrigger>
          <TabsTrigger value="microatoms">
            <Atom className="h-4 w-4 mx-1" />
            {fa ? "میکرواتم‌ها" : "MicroAtoms"}
          </TabsTrigger>
          <TabsTrigger value="recs">
            <Lightbulb className="h-4 w-4 mx-1" />
            {fa ? "توصیه‌ها" : "Recommendations"}
          </TabsTrigger>
          <TabsTrigger value="add">
            <Plus className="h-4 w-4 mx-1" />
            {fa ? "افزودن" : "Add"}
          </TabsTrigger>
        </TabsList>

        {/* QUESTIONS */}
        <TabsContent value="questions" className="mt-4 space-y-3">
          {analyzed_data.qs
            .slice()
            .sort((a, b) => b.difficulty - a.difficulty)
            .map((q, i) => {
              const band = diffBand(q.difficulty, fa);
              const overTime = q.avgTimeSec > q.expectedTimeSec * 1.3;
              return (
                <Card key={q.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`h-9 w-9 rounded-lg grid place-items-center shrink-0 text-xs font-bold ${band.cls}`}>
                        {num(i + 1)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm">{q.text}</p>
                          <Badge variant="secondary" className={`${band.cls} border-0`}>
                            {band.label} • {num(q.difficulty)}
                          </Badge>
                          {overTime && (
                            <Badge variant="secondary" className="bg-warning/15 text-warning border-0 text-[10px]">
                              <AlertTriangle className="h-3 w-3 mx-0.5" />
                              {fa ? "زمان‌بر" : "Slow"}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">{q.microAtom}</p>
                        <div className="grid grid-cols-3 gap-2 mt-3 text-[11px]">
                          <Mini label={fa ? "درست" : "Correct"} value={`${num(q.correctPct)}%`} />
                          <Mini label={fa ? "زمان" : "Time"} value={`${num(q.avgTimeSec)}s / ${num(q.expectedTimeSec)}s`} />
                          <Mini label={fa ? "تلاش" : "Attempts"} value={q.attempts.toFixed(1)} />
                        </div>
                        <Progress value={q.difficulty} className="h-1.5 mt-3" />
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full"
                        onClick={() => setQuestions(questions.filter((x) => x.id !== q.id))}
                        aria-label="delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </TabsContent>

        {/* MICROATOMS */}
        <TabsContent value="microatoms" className="mt-4 space-y-3">
          {analyzed_data.microAtoms.map((m) => {
            const band = diffBand(m.difficulty, fa);
            return (
              <Card key={m.name}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{m.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {num(m.count)} {fa ? "سؤال" : "questions"} • {fa ? "میانگین درست:" : "avg correct:"} {num(m.avgCorrect)}%
                      </p>
                    </div>
                    <Badge variant="secondary" className={`${band.cls} border-0`}>
                      {band.label} • {num(m.difficulty)}
                    </Badge>
                  </div>
                  <Progress value={m.difficulty} className="h-2" />
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* RECOMMENDATIONS */}
        <TabsContent value="recs" className="mt-4 space-y-2">
          {analyzed_data.recs.map((r, i) => {
            const cls =
              r.tone === "warn"
                ? "bg-destructive/10 text-destructive border-destructive/20"
                : r.tone === "good"
                  ? "bg-success/10 text-success border-success/20"
                  : "bg-primary/10 text-primary border-primary/20";
            return (
              <Card key={i} className={`border ${cls}`}>
                <CardContent className="p-4 flex items-start gap-3 text-sm">
                  <Lightbulb className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{r.text}</span>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* ADD QUESTION */}
        <TabsContent value="add" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {fa ? "افزودن نتیجه سؤال" : "Add question result"}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5 sm:col-span-2">
                <Label>{fa ? "متن سؤال" : "Question text"}</Label>
                <Input value={text} onChange={(e) => setText(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>{fa ? "میکرواتم" : "MicroAtom"}</Label>
                <Input value={ma} onChange={(e) => setMa(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>{fa ? "درصد پاسخ صحیح" : "% correct"}</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={correct}
                  onChange={(e) => setCorrect(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                  dir="ltr"
                />
              </div>
              <div className="space-y-1.5">
                <Label>{fa ? "میانگین زمان (ث)" : "Avg time (s)"}</Label>
                <Input type="number" min={10} value={avgT} onChange={(e) => setAvgT(Math.max(10, Number(e.target.value) || 10))} dir="ltr" />
              </div>
              <div className="space-y-1.5">
                <Label>{fa ? "زمان مورد انتظار (ث)" : "Expected time (s)"}</Label>
                <Input type="number" min={10} value={expT} onChange={(e) => setExpT(Math.max(10, Number(e.target.value) || 10))} dir="ltr" />
              </div>
              <div className="space-y-1.5">
                <Label>{fa ? "میانگین تلاش (۱-۳)" : "Avg attempts (1-3)"}</Label>
                <Input
                  type="number"
                  min={1}
                  max={3}
                  step={0.1}
                  value={att}
                  onChange={(e) => setAtt(Math.max(1, Math.min(3, Number(e.target.value) || 1)))}
                  dir="ltr"
                />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <Button onClick={addQ} className="rounded-full">
                  <Plus className="h-4 w-4 mx-1" />
                  {fa ? "افزودن سؤال" : "Add question"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 px-2 py-1.5">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="font-semibold text-xs">{value}</p>
    </div>
  );
}
