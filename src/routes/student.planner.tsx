import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Sparkles,
  Plus,
  Trash2,
  Calendar,
  CalendarRange,
  Lightbulb,
  GraduationCap,
  NotebookPen,
  Clock,
  Target,
  Wand2,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/student/planner")({
  component: PlannerPage,
});

type Exam = { id: string; subject: string; topic: string; daysAway: number };
type Homework = { id: string; subject: string; title: string; minutes: number; daysAway: number };
type Mastery = { subject: string; pct: number };

const seedExamsFA: Exam[] = [
  { id: "e1", subject: "ریاضی", topic: "معادله درجه دوم", daysAway: 3 },
  { id: "e2", subject: "فیزیک", topic: "قوانین نیوتن", daysAway: 6 },
];
const seedExamsEN: Exam[] = [
  { id: "e1", subject: "Math", topic: "Quadratic equations", daysAway: 3 },
  { id: "e2", subject: "Physics", topic: "Newton's laws", daysAway: 6 },
];
const seedHwFA: Homework[] = [
  { id: "h1", subject: "شیمی", title: "موازنه واکنش‌ها", minutes: 30, daysAway: 1 },
  { id: "h2", subject: "ادبیات", title: "خلاصه فصل ۳", minutes: 25, daysAway: 2 },
];
const seedHwEN: Homework[] = [
  { id: "h1", subject: "Chemistry", title: "Balancing reactions", minutes: 30, daysAway: 1 },
  { id: "h2", subject: "Literature", title: "Chapter 3 summary", minutes: 25, daysAway: 2 },
];
const seedMasteryFA: Mastery[] = [
  { subject: "ریاضی", pct: 58 },
  { subject: "فیزیک", pct: 62 },
  { subject: "شیمی", pct: 48 },
  { subject: "ادبیات", pct: 70 },
  { subject: "زبان انگلیسی", pct: 82 },
];
const seedMasteryEN: Mastery[] = [
  { subject: "Math", pct: 58 },
  { subject: "Physics", pct: 62 },
  { subject: "Chemistry", pct: 48 },
  { subject: "Literature", pct: 70 },
  { subject: "English", pct: 82 },
];

const weekDaysFA = ["شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];
const weekDaysEN = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

function toFa(n: number | string) {
  const map = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(n).replace(/\d/g, (d) => map[Number(d)]);
}

type Block = { subject: string; activity: string; minutes: number; kind: "exam" | "hw" | "review" | "stretch" };

function buildPlan(
  exams: Exam[],
  hw: Homework[],
  mastery: Mastery[],
  dailyMinutes: number,
  fa: boolean,
) {
  // Weight subjects: growth opportunity + close exam = higher priority
  const subjectScores = new Map<string, number>();
  mastery.forEach((m) => {
    const base = Math.max(5, 100 - m.pct); // growth-opportunity weight
    subjectScores.set(m.subject, (subjectScores.get(m.subject) ?? 0) + base);
  });
  exams.forEach((e) => {
    const urgency = Math.max(10, 80 - e.daysAway * 8);
    subjectScores.set(e.subject, (subjectScores.get(e.subject) ?? 0) + urgency);
  });

  // Build a daily plan: homework due first, then top growth opportunity, then review
  const dueToday = hw.filter((h) => h.daysAway <= 1).slice(0, 2);
  const remaining = Math.max(15, dailyMinutes - dueToday.reduce((a, h) => a + h.minutes, 0));

  const ranked = [...subjectScores.entries()].sort((a, b) => b[1] - a[1]);
  const focusSubject = ranked[0]?.[0] ?? (fa ? "مرور عمومی" : "General review");
  const secondSubject = ranked[1]?.[0] ?? focusSubject;
  const examFocus = exams.sort((a, b) => a.daysAway - b.daysAway)[0];

  const focusMin = Math.round(remaining * 0.55);
  const secondMin = Math.round(remaining * 0.3);
  const stretchMin = Math.max(5, remaining - focusMin - secondMin);

  const daily: Block[] = [
    ...dueToday.map<Block>((h) => ({
      subject: h.subject,
      activity: fa ? `تکلیف: ${h.title}` : `Homework: ${h.title}`,
      minutes: h.minutes,
      kind: "hw",
    })),
    {
      subject: focusSubject,
      activity: examFocus && examFocus.subject === focusSubject
        ? (fa ? `تمرین تمرکز روی «${examFocus.topic}»` : `Focused practice on "${examFocus.topic}"`)
        : (fa ? "تمرین اتم‌بیت‌های رشد" : "Practice growth AtomBits"),
      minutes: focusMin,
      kind: examFocus ? "exam" : "review",
    },
    {
      subject: secondSubject,
      activity: fa ? "مرور خلاصه و کوییز سریع" : "Summary review + quick quiz",
      minutes: secondMin,
      kind: "review",
    },
    {
      subject: fa ? "استراحت فعال" : "Active stretch",
      activity: fa ? "۵ دوز راه رفتن و آب نوشیدن" : "5 min walk + hydrate",
      minutes: stretchMin,
      kind: "stretch",
    },
  ];

  // Weekly plan: spread per-day focus, exam-day reviews
  const weekly = (fa ? weekDaysFA : weekDaysEN).map((day, idx) => {
    const examOnDay = exams.find((e) => e.daysAway === idx);
    const subj = ranked[idx % Math.max(1, ranked.length)]?.[0] ?? focusSubject;
    return {
      day,
      isToday: idx === 0,
      isExam: !!examOnDay,
      subject: examOnDay ? examOnDay.subject : subj,
      title: examOnDay
        ? fa
          ? `آزمون ${examOnDay.subject} • ${examOnDay.topic}`
          : `${examOnDay.subject} exam • ${examOnDay.topic}`
        : fa
          ? `تمرکز روی ${subj}`
          : `Focus on ${subj}`,
      minutes: examOnDay ? Math.round(dailyMinutes * 1.2) : dailyMinutes,
    };
  });

  // Recommendations
  const recs: { tone: "warn" | "info" | "good"; text: string }[] = [];
  const growthFocus = [...mastery].sort((a, b) => a.pct - b.pct)[0];
  if (growthFocus && growthFocus.pct < 60) {
    recs.push({
      tone: "warn",
      text: fa
        ? `«${growthFocus.subject}» فرصت رشد بعدی توست — روزی ۲۰ دوز برای پیشرفت در این درس وقت بگذار.`
        : `"${growthFocus.subject}" is your next growth opportunity — spend 20 minutes on it daily.`,
    });
  }
  const nextExam = [...exams].sort((a, b) => a.daysAway - b.daysAway)[0];
  if (nextExam) {
    recs.push({
      tone: "info",
      text: fa
        ? `آزمون «${nextExam.subject}» در ${nextExam.daysAway} روز — هر روز یک ست تمرین کوتاه حل کن.`
        : `${nextExam.subject} exam in ${nextExam.daysAway} days — do one short practice set daily.`,
    });
  }
  if (dailyMinutes < 45) {
    recs.push({
      tone: "warn",
      text: fa
        ? "با رساندن دوز مطالعه به ۶۰ دوز، فرصت رشد بیشتری در برنامه‌ات می‌سازی."
        : "Aim for 60 minutes to create more room for growth in your plan.",
    });
  } else if (dailyMinutes >= 90) {
    recs.push({
      tone: "good",
      text: fa
        ? "تعهد عالی! یادت باشه هر ۵۰ دوز ۱۰ دوز استراحت کنی."
        : "Great commitment! Take a 10-min break every 50 min.",
    });
  }
  const strongest = [...mastery].sort((a, b) => b.pct - a.pct)[0];
  if (strongest && strongest.pct >= 80) {
    recs.push({
      tone: "good",
      text: fa
        ? `در «${strongest.subject}» پیشرفت درخشانی داری — هفته‌ای یک اتم‌بیت چالشی امتحان کن.`
        : `You're making great progress in "${strongest.subject}" — try one challenge AtomBit each week.`,
    });
  }

  return { daily, weekly, recs };
}

function PlannerPage() {
  const { lang } = useI18n();
  const fa = lang === "fa";
  const num = (n: number | string) => (fa ? toFa(n) : String(n));

  const [exams, setExams] = useState<Exam[]>(fa ? seedExamsFA : seedExamsEN);
  const [hw, setHw] = useState<Homework[]>(fa ? seedHwFA : seedHwEN);
  const [mastery, setMastery] = useState<Mastery[]>(fa ? seedMasteryFA : seedMasteryEN);
  const [dailyMin, setDailyMin] = useState(75);
  const [generated, setGenerated] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [version, setVersion] = useState(0);

  const plan = useMemo(
    () => buildPlan(exams, hw, mastery, dailyMin, fa),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exams, hw, mastery, dailyMin, fa, version],
  );

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      setVersion((v) => v + 1);
    }, 600);
  };

  // Exam form
  const [exSubj, setExSubj] = useState("");
  const [exTopic, setExTopic] = useState("");
  const [exDays, setExDays] = useState(3);
  const addExam = () => {
    if (!exSubj.trim() || !exTopic.trim()) return;
    setExams([...exams, { id: crypto.randomUUID(), subject: exSubj.trim(), topic: exTopic.trim(), daysAway: exDays }]);
    setExSubj("");
    setExTopic("");
  };

  // HW form
  const [hwSubj, setHwSubj] = useState("");
  const [hwTitle, setHwTitle] = useState("");
  const [hwMin, setHwMin] = useState(20);
  const [hwDays, setHwDays] = useState(1);
  const addHw = () => {
    if (!hwSubj.trim() || !hwTitle.trim()) return;
    setHw([
      ...hw,
      { id: crypto.randomUUID(), subject: hwSubj.trim(), title: hwTitle.trim(), minutes: hwMin, daysAway: hwDays },
    ]);
    setHwSubj("");
    setHwTitle("");
  };

  const updateMastery = (subj: string, pct: number) =>
    setMastery((m) => m.map((x) => (x.subject === subj ? { ...x, pct } : x)));

  const blockTone = (k: Block["kind"]) =>
    k === "exam"
      ? "bg-primary/15 text-primary"
      : k === "hw"
        ? "bg-warning/15 text-warning"
        : k === "review"
          ? "bg-success/15 text-success"
          : "bg-muted text-muted-foreground";

  const blockLabel = (k: Block["kind"]) =>
    k === "exam"
      ? fa ? "آمادگی آزمون" : "Exam prep"
      : k === "hw"
        ? fa ? "تکلیف" : "Homework"
        : k === "review"
          ? fa ? "مرور" : "Review"
          : fa ? "استراحت" : "Break";

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
              {fa ? "برنامه‌ریز توربو" : "Turbo Planner"}
            </h1>
            <p className="text-sm opacity-90 mt-1">
              {fa
                ? "آزمون‌ها، تکالیف، دوز مطالعه و سطح تسلطت را وارد کن تا موتور توربوی اتومیا یک برنامه کاملاً شخصی برای مسیر رشدت بسازد."
                : "Enter your exams, homework, study time, and mastery so Atomia's proprietary Turbo Engine can build a plan for your unique growth journey."}
            </p>
          </div>
          <Button
            onClick={generate}
            disabled={generating}
            size="lg"
            className="rounded-full bg-white text-primary hover:bg-white/90"
          >
            {generating ? (
              <RefreshCw className="h-4 w-4 mx-1 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4 mx-1" />
            )}
            {generated ? (fa ? "بازسازی برنامه توربو" : "Regenerate Turbo Plan") : (fa ? "ساخت برنامه توربو" : "Create Turbo Plan")}
          </Button>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-4">
        {/* INPUTS */}
        <div className="space-y-4">
          {/* Study time */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                {fa ? "دوز مطالعه روزانه" : "Daily study time"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {fa ? "هدف" : "Goal"}
                </span>
                <span className="text-lg font-bold">
                  {num(dailyMin)} {fa ? "دوز" : "min"}
                </span>
              </div>
              <Slider
                value={[dailyMin]}
                onValueChange={(v) => setDailyMin(v[0])}
                min={20}
                max={180}
                step={5}
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>{num(20)}</span>
                <span>{num(180)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Exams */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                {fa ? "آزمون‌های پیش‌رو" : "Upcoming exams"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {exams.map((e) => (
                <div key={e.id} className="flex items-center gap-2 p-2 rounded-lg border text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{e.topic}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {e.subject} • {fa ? `${num(e.daysAway)} روز دیگر` : `in ${e.daysAway}d`}
                    </p>
                  </div>
                  <Button size="icon" variant="ghost" className="rounded-full h-7 w-7" onClick={() => setExams(exams.filter((x) => x.id !== e.id))}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
              <div className="grid grid-cols-[1fr_1fr_72px_auto] gap-2">
                <Input placeholder={fa ? "درس" : "Subject"} value={exSubj} onChange={(e) => setExSubj(e.target.value)} />
                <Input placeholder={fa ? "مبحث" : "Topic"} value={exTopic} onChange={(e) => setExTopic(e.target.value)} />
                <Input
                  type="number"
                  min={0}
                  value={exDays}
                  onChange={(e) => setExDays(Math.max(0, Number(e.target.value) || 0))}
                  dir="ltr"
                  title={fa ? "روزها" : "days"}
                />
                <Button onClick={addExam} size="icon" className="rounded-full">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Homework */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <NotebookPen className="h-4 w-4 text-primary" />
                {fa ? "تکالیف" : "Homework"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {hw.map((h) => (
                <div key={h.id} className="flex items-center gap-2 p-2 rounded-lg border text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{h.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {h.subject} • {num(h.minutes)} {fa ? "د" : "m"} • {fa ? `${num(h.daysAway)} روز` : `${h.daysAway}d`}
                    </p>
                  </div>
                  <Button size="icon" variant="ghost" className="rounded-full h-7 w-7" onClick={() => setHw(hw.filter((x) => x.id !== h.id))}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder={fa ? "درس" : "Subject"} value={hwSubj} onChange={(e) => setHwSubj(e.target.value)} />
                <Input placeholder={fa ? "عنوان تکلیف" : "Title"} value={hwTitle} onChange={(e) => setHwTitle(e.target.value)} />
              </div>
              <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">{fa ? "دوز" : "Minutes"}</Label>
                  <Input type="number" min={5} value={hwMin} onChange={(e) => setHwMin(Math.max(5, Number(e.target.value) || 5))} dir="ltr" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">{fa ? "مهلت (روز)" : "Due in (days)"}</Label>
                  <Input type="number" min={0} value={hwDays} onChange={(e) => setHwDays(Math.max(0, Number(e.target.value) || 0))} dir="ltr" />
                </div>
                <Button onClick={addHw} size="icon" className="rounded-full self-end">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mastery */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                {fa ? "رشد اتم‌بیت‌ها" : "AtomBit Growth"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mastery.map((m) => (
                <div key={m.subject}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium">{m.subject}</span>
                    <span className="text-muted-foreground text-xs">{num(m.pct)}%</span>
                  </div>
                  <Slider
                    value={[m.pct]}
                    onValueChange={(v) => updateMastery(m.subject, v[0])}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* OUTPUTS */}
        <div className="space-y-4">
          <Tabs defaultValue="daily">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="daily">
                <Calendar className="h-4 w-4 mx-1" />
                {fa ? "روزانه" : "Daily"}
              </TabsTrigger>
              <TabsTrigger value="weekly">
                <CalendarRange className="h-4 w-4 mx-1" />
                {fa ? "هفتگی" : "Weekly"}
              </TabsTrigger>
              <TabsTrigger value="recs">
                <Lightbulb className="h-4 w-4 mx-1" />
                {fa ? "پیشنهادهای توربو" : "Turbo Recommendations"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="mt-4 space-y-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>{fa ? "برنامه توربوی امروز" : "Today's Turbo Plan"}</span>
                    <Badge variant="secondary" className="bg-primary/15 text-primary border-0">
                      {num(plan.daily.reduce((a, b) => a + b.minutes, 0))} {fa ? "دوز" : "min"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {plan.daily.map((b, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl border">
                      <div className={`h-9 w-9 rounded-lg grid place-items-center shrink-0 text-xs font-bold ${blockTone(b.kind)}`}>
                        {num(i + 1)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm truncate">{b.subject}</p>
                          <Badge variant="secondary" className={`${blockTone(b.kind)} border-0 text-[10px]`}>
                            {blockLabel(b.kind)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{b.activity}</p>
                      </div>
                      <span className="text-sm font-semibold shrink-0">
                        {num(b.minutes)} {fa ? "د" : "m"}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="weekly" className="mt-4 space-y-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{fa ? "نقشه هفته" : "Week map"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {plan.weekly.map((d, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-xl border ${
                        d.isToday ? "bg-primary/5 border-primary/30" : ""
                      }`}
                    >
                      <div className="w-20 shrink-0">
                        <p className="text-sm font-bold">{d.day}</p>
                        {d.isToday && (
                          <Badge variant="secondary" className="bg-primary/15 text-primary border-0 text-[10px] mt-0.5">
                            {fa ? "امروز" : "Today"}
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{d.title}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {num(d.minutes)} {fa ? "دوز" : "min"}
                        </p>
                      </div>
                      {d.isExam && (
                        <Badge variant="secondary" className="bg-warning/15 text-warning border-0 shrink-0">
                          {fa ? "آزمون" : "Exam"}
                        </Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recs" className="mt-4 space-y-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    {fa ? "پیشنهادهای شخصی توربو" : "Personalized Turbo Recommendations"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {plan.recs.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      {fa ? "همه چیز عالی پیش می‌ره! 👏" : "Everything looks great! 👏"}
                    </p>
                  )}
                  {plan.recs.map((r, i) => {
                    const cls =
                      r.tone === "warn"
                        ? "bg-destructive/10 text-destructive border-destructive/20"
                        : r.tone === "good"
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-primary/10 text-primary border-primary/20";
                    return (
                      <div key={i} className={`p-3 rounded-xl border text-sm ${cls}`}>
                        {r.text}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{fa ? "تخصیص زمان پیشنهادی" : "Suggested time allocation"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {(() => {
                    const total = plan.daily.reduce((a, b) => a + b.minutes, 0) || 1;
                    const bySubject = new Map<string, number>();
                    plan.daily.forEach((b) => bySubject.set(b.subject, (bySubject.get(b.subject) ?? 0) + b.minutes));
                    return [...bySubject.entries()]
                      .sort((a, b) => b[1] - a[1])
                      .map(([subj, mins]) => {
                        const pct = Math.round((mins / total) * 100);
                        return (
                          <div key={subj}>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="font-medium truncate">{subj}</span>
                              <span className="text-muted-foreground text-xs">
                                {num(mins)} {fa ? "د" : "m"} • {num(pct)}%
                              </span>
                            </div>
                            <Progress value={pct} className="h-1.5" />
                          </div>
                        );
                      });
                  })()}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
