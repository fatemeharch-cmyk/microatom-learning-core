import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  FileCheck2,
  Plus,
  Timer,
  Trash2,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/teacher/exams")({
  component: ExamBuilder,
});

type Q = { id: string; text: string; type: "mcq" | "short" | "long"; points: number };

const subjectsFA = ["ریاضی", "فیزیک", "شیمی", "زبان انگلیسی", "ادبیات"];
const subjectsEN = ["Math", "Physics", "Chemistry", "English", "Literature"];

const existingFA = [
  { title: "آزمون میان‌ترم ریاضی", date: "۲۸ خرداد", duration: 90, questions: 25, target: "پایه ۱۰", status: "scheduled" },
  { title: "کوییز فیزیک فصل ۳", date: "۲۰ خرداد", duration: 30, questions: 10, target: "پایه ۱۰", status: "active" },
  { title: "آزمون پایان فصل شیمی", date: "۱۲ خرداد", duration: 60, questions: 20, target: "پایه ۱۱", status: "graded" },
];
const existingEN = [
  { title: "Math midterm", date: "Jun 28", duration: 90, questions: 25, target: "Grade 10", status: "scheduled" },
  { title: "Physics Ch.3 quiz", date: "Jun 20", duration: 30, questions: 10, target: "Grade 10", status: "active" },
  { title: "Chemistry end-of-chapter", date: "Jun 12", duration: 60, questions: 20, target: "Grade 11", status: "graded" },
];

function ExamBuilder() {
  const { lang } = useI18n();
  const fa = lang === "fa";
  const subjects = fa ? subjectsFA : subjectsEN;
  const existing = fa ? existingFA : existingEN;

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(subjects[0]);
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState(60);
  const [questions, setQuestions] = useState<Q[]>([
    { id: "q1", text: fa ? "تعریف تابع را بنویسید." : "Define a function.", type: "short", points: 2 },
  ]);
  const [newQ, setNewQ] = useState("");
  const [newType, setNewType] = useState<Q["type"]>("mcq");
  const [newPts, setNewPts] = useState(1);

  const addQ = () => {
    if (!newQ.trim()) return;
    setQuestions([
      ...questions,
      { id: crypto.randomUUID(), text: newQ.trim(), type: newType, points: newPts },
    ]);
    setNewQ("");
    setNewPts(1);
  };
  const removeQ = (id: string) => setQuestions(questions.filter((q) => q.id !== id));

  const totalPoints = useMemo(() => questions.reduce((a, q) => a + q.points, 0), [questions]);

  const typeLabel = (t: Q["type"]) =>
    t === "mcq"
      ? fa ? "چندگزینه‌ای" : "MCQ"
      : t === "short"
        ? fa ? "پاسخ کوتاه" : "Short"
        : fa ? "تشریحی" : "Long";

  const statusBadge = (s: string) => {
    if (s === "active") return { cls: "bg-primary/15 text-primary", label: fa ? "فعال" : "Active" };
    if (s === "scheduled")
      return { cls: "bg-warning/15 text-warning", label: fa ? "زمان‌بندی شده" : "Scheduled" };
    return { cls: "bg-success/15 text-success", label: fa ? "تصحیح شده" : "Graded" };
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <Badge variant="secondary" className="mb-2">
          <FileCheck2 className="h-3 w-3 mx-1" />
          {fa ? "ساخت آزمون" : "Create exam"}
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight">
          {fa ? "مرکز ساخت آزمون" : "Exam builder"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {fa
            ? "آزمون جدید با سؤالات سفارشی بساز یا آزمون‌های قبلی رو مدیریت کن."
            : "Compose a new exam with custom questions or manage previous ones."}
        </p>
      </div>

      <Tabs defaultValue="create">
        <TabsList>
          <TabsTrigger value="create">
            <Plus className="h-4 w-4 mx-1" />
            {fa ? "آزمون جدید" : "New"}
          </TabsTrigger>
          <TabsTrigger value="existing">
            <CheckCircle2 className="h-4 w-4 mx-1" />
            {fa ? "آزمون‌های موجود" : "Existing"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{fa ? "اطلاعات آزمون" : "Exam info"}</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1.5 sm:col-span-2">
                <Label>{fa ? "عنوان" : "Title"}</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>{fa ? "درس" : "Subject"}</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  {subjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>{fa ? "تاریخ" : "Date"}</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  dir="ltr"
                />
              </div>
              <div className="space-y-1.5">
                <Label>{fa ? "مدت (دقیقه)" : "Duration (min)"}</Label>
                <Input
                  type="number"
                  min={5}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value) || 0)}
                  dir="ltr"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>{fa ? "سؤالات" : "Questions"}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {questions.length} {fa ? "سؤال" : "questions"} • {totalPoints}{" "}
                  {fa ? "نمره" : "points"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {questions.map((q, i) => (
                <div key={q.id} className="flex items-start gap-3 p-3 rounded-xl border">
                  <span className="text-sm font-bold text-primary w-6 text-center">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{q.text}</p>
                    <div className="flex gap-2 mt-1.5">
                      <Badge variant="secondary" className="text-[10px]">
                        {typeLabel(q.type)}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] bg-xp/15 text-xp border-0">
                        {q.points} {fa ? "نمره" : "pts"}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeQ(q.id)}
                    aria-label="delete"
                    className="rounded-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <div className="border-t pt-3 grid sm:grid-cols-[1fr_auto_auto_auto] gap-2">
                <Input
                  value={newQ}
                  onChange={(e) => setNewQ(e.target.value)}
                  placeholder={fa ? "متن سؤال جدید..." : "New question text..."}
                />
                <select
                  className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as Q["type"])}
                >
                  <option value="mcq">{fa ? "چندگزینه‌ای" : "MCQ"}</option>
                  <option value="short">{fa ? "پاسخ کوتاه" : "Short"}</option>
                  <option value="long">{fa ? "تشریحی" : "Long"}</option>
                </select>
                <Input
                  type="number"
                  min={1}
                  value={newPts}
                  onChange={(e) => setNewPts(Number(e.target.value) || 1)}
                  className="w-20"
                  dir="ltr"
                />
                <Button onClick={addQ} className="rounded-full">
                  <Plus className="h-4 w-4" />
                  {fa ? "افزودن" : "Add"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" className="rounded-full">
              {fa ? "پیش‌نویس" : "Save draft"}
            </Button>
            <Button className="rounded-full">{fa ? "زمان‌بندی آزمون" : "Schedule exam"}</Button>
          </div>
        </TabsContent>

        <TabsContent value="existing" className="space-y-3 mt-4">
          {existing.map((e, i) => {
            const b = statusBadge(e.status);
            return (
              <Card key={i}>
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold truncate">{e.title}</h3>
                      <Badge variant="secondary" className={`${b.cls} border-0`}>
                        {b.label}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-1">
                      <span className="flex items-center gap-1">
                        <CalendarClock className="h-3 w-3" />
                        {e.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Timer className="h-3 w-3" />
                        {e.duration} {fa ? "دقیقه" : "min"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {e.target}
                      </span>
                      <span>
                        {e.questions} {fa ? "سؤال" : "questions"}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-full">
                    {fa ? "مدیریت" : "Manage"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
