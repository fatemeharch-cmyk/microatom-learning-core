import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  FileUp,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Loader2,
  Eye,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/teacher/pdf-exams")({
  component: PdfExamsPage,
});

type Status = "uploading" | "analyzing" | "ready" | "failed";

type Item = {
  id: string;
  name: string;
  size: number;
  subject: string;
  grade: string;
  uploadedAt: string;
  status: Status;
  progress: number;
  pages?: number;
  questions?: number;
  topics?: { name: string; weight: number }[];
  difficulty?: "easy" | "medium" | "hard";
};

const subjectsFA = ["ریاضی", "فیزیک", "شیمی", "زبان انگلیسی", "ادبیات"];
const subjectsEN = ["Math", "Physics", "Chemistry", "English", "Literature"];
const gradesFA = ["پایه ۹", "پایه ۱۰", "پایه ۱۱", "پایه ۱۲"];
const gradesEN = ["Grade 9", "Grade 10", "Grade 11", "Grade 12"];

const seedFA: Item[] = [
  {
    id: "s1",
    name: "midterm-math-1402.pdf",
    size: 842_000,
    subject: "ریاضی",
    grade: "پایه ۱۰",
    uploadedAt: "۲ روز پیش",
    status: "ready",
    progress: 100,
    pages: 6,
    questions: 22,
    difficulty: "medium",
    topics: [
      { name: "معادله درجه دوم", weight: 32 },
      { name: "تابع", weight: 28 },
      { name: "هندسه", weight: 22 },
      { name: "احتمال", weight: 18 },
    ],
  },
  {
    id: "s2",
    name: "physics-final-2024.pdf",
    size: 1_240_000,
    subject: "فیزیک",
    grade: "پایه ۱۱",
    uploadedAt: "هفته پیش",
    status: "ready",
    progress: 100,
    pages: 8,
    questions: 18,
    difficulty: "hard",
    topics: [
      { name: "حرکت", weight: 40 },
      { name: "نیرو", weight: 35 },
      { name: "انرژی", weight: 25 },
    ],
  },
];

const seedEN: Item[] = [
  {
    id: "s1",
    name: "midterm-math-2024.pdf",
    size: 842_000,
    subject: "Math",
    grade: "Grade 10",
    uploadedAt: "2 days ago",
    status: "ready",
    progress: 100,
    pages: 6,
    questions: 22,
    difficulty: "medium",
    topics: [
      { name: "Quadratic equations", weight: 32 },
      { name: "Functions", weight: 28 },
      { name: "Geometry", weight: 22 },
      { name: "Probability", weight: 18 },
    ],
  },
  {
    id: "s2",
    name: "physics-final-2024.pdf",
    size: 1_240_000,
    subject: "Physics",
    grade: "Grade 11",
    uploadedAt: "1 week ago",
    status: "ready",
    progress: 100,
    pages: 8,
    questions: 18,
    difficulty: "hard",
    topics: [
      { name: "Motion", weight: 40 },
      { name: "Forces", weight: 35 },
      { name: "Energy", weight: 25 },
    ],
  },
];

function formatSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

function PdfExamsPage() {
  const { lang } = useI18n();
  const fa = lang === "fa";
  const subjects = fa ? subjectsFA : subjectsEN;
  const grades = fa ? gradesFA : gradesEN;

  const [items, setItems] = useState<Item[]>(fa ? seedFA : seedEN);
  const [subject, setSubject] = useState(subjects[0]);
  const [grade, setGrade] = useState(grades[0]);
  const [dragging, setDragging] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = useMemo(
    () => items.find((i) => i.id === selected) ?? items.find((i) => i.status === "ready") ?? items[0],
    [items, selected],
  );

  const simulate = (id: string) => {
    // Upload phase
    const tick = (phase: "uploading" | "analyzing") => {
      setItems((prev) =>
        prev.map((it) => {
          if (it.id !== id) return it;
          const next = Math.min(100, it.progress + (phase === "uploading" ? 18 : 12));
          return { ...it, progress: next, status: phase };
        }),
      );
    };
    let p = 0;
    const up = setInterval(() => {
      p += 18;
      tick("uploading");
      if (p >= 100) {
        clearInterval(up);
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, progress: 0, status: "analyzing" } : it)));
        let a = 0;
        const an = setInterval(() => {
          a += 12;
          tick("analyzing");
          if (a >= 100) {
            clearInterval(an);
            setItems((prev) =>
              prev.map((it) =>
                it.id === id
                  ? {
                      ...it,
                      status: "ready",
                      progress: 100,
                      pages: 5 + Math.floor(Math.random() * 6),
                      questions: 15 + Math.floor(Math.random() * 15),
                      difficulty: (["easy", "medium", "hard"] as const)[Math.floor(Math.random() * 3)],
                      topics: [
                        { name: fa ? "مبحث ۱" : "Topic 1", weight: 40 },
                        { name: fa ? "مبحث ۲" : "Topic 2", weight: 35 },
                        { name: fa ? "مبحث ۳" : "Topic 3", weight: 25 },
                      ],
                    }
                  : it,
              ),
            );
            setSelected(id);
          }
        }, 350);
      }
    }, 250);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((f) => {
      if (!f.name.toLowerCase().endsWith(".pdf")) return;
      const id = crypto.randomUUID();
      const item: Item = {
        id,
        name: f.name,
        size: f.size,
        subject,
        grade,
        uploadedAt: fa ? "همین حالا" : "Just now",
        status: "uploading",
        progress: 0,
      };
      setItems((prev) => [item, ...prev]);
      simulate(id);
    });
  };

  const remove = (id: string) => {
    setItems((p) => p.filter((i) => i.id !== id));
    if (selected === id) setSelected(null);
  };

  const statusMeta = (s: Status) => {
    if (s === "ready")
      return { cls: "bg-success/15 text-success", label: fa ? "آماده" : "Ready", icon: CheckCircle2 };
    if (s === "failed")
      return { cls: "bg-destructive/15 text-destructive", label: fa ? "خطا" : "Failed", icon: AlertTriangle };
    if (s === "analyzing")
      return { cls: "bg-primary/15 text-primary", label: fa ? "در حال تحلیل" : "Analyzing", icon: Sparkles };
    return { cls: "bg-warning/15 text-warning", label: fa ? "بارگذاری" : "Uploading", icon: Loader2 };
  };

  const difficultyLabel = (d?: Item["difficulty"]) =>
    !d ? "" : d === "easy" ? (fa ? "آسان" : "Easy") : d === "medium" ? (fa ? "متوسط" : "Medium") : (fa ? "سخت" : "Hard");

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <Badge variant="secondary" className="mb-2">
          <FileUp className="h-3 w-3 mx-1" />
          {fa ? "بارگذاری PDF" : "PDF Upload"}
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight">
          {fa ? "آپلود و تحلیل آزمون PDF" : "PDF Exam Upload & Analysis"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {fa
            ? "آزمون‌های PDF خود را بارگذاری کنید تا به‌صورت خودکار تحلیل شوند: شناسایی سؤالات، مباحث و سطح دشواری."
            : "Upload PDF exams to auto-analyze: extract questions, topics, and difficulty."}
        </p>
      </div>

      <Tabs defaultValue="upload">
        <TabsList>
          <TabsTrigger value="upload">
            <FileUp className="h-4 w-4 mx-1" />
            {fa ? "بارگذاری" : "Upload"}
          </TabsTrigger>
          <TabsTrigger value="library">
            <FileText className="h-4 w-4 mx-1" />
            {fa ? "کتابخانه" : "Library"}
            <Badge variant="secondary" className="mx-2 text-[10px]">
              {items.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <BarChart3 className="h-4 w-4 mx-1" />
            {fa ? "تحلیل" : "Analysis"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{fa ? "اطلاعات آزمون" : "Exam info"}</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>{fa ? "درس" : "Subject"}</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  {subjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>{fa ? "پایه" : "Grade"}</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                >
                  {grades.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent
              className={`p-6 sm:p-10 rounded-xl border-2 border-dashed transition-colors text-center cursor-pointer ${
                dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                handleFiles(e.dataTransfer.files);
              }}
              onClick={() => inputRef.current?.click()}
            >
              <Input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 grid place-items-center mb-3">
                <FileUp className="h-6 w-6 text-primary" />
              </div>
              <p className="font-semibold">
                {fa ? "فایل PDF را اینجا رها کنید" : "Drop PDF files here"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {fa ? "یا برای انتخاب کلیک کنید • حداکثر ۲۰ مگابایت" : "or click to browse • up to 20MB"}
              </p>
              <Button type="button" className="rounded-full mt-4">
                {fa ? "انتخاب فایل" : "Choose file"}
              </Button>
            </CardContent>
          </Card>

          {items.filter((i) => i.status !== "ready").length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {fa ? "در حال پردازش" : "In progress"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {items
                  .filter((i) => i.status !== "ready")
                  .map((i) => {
                    const m = statusMeta(i.status);
                    const Icon = m.icon;
                    return (
                      <div key={i.id} className="p-3 rounded-xl border space-y-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-sm font-medium truncate flex-1">{i.name}</span>
                          <Badge variant="secondary" className={`${m.cls} border-0 gap-1`}>
                            <Icon className={`h-3 w-3 ${i.status !== "ready" && i.status !== "failed" ? "animate-spin" : ""}`} />
                            {m.label}
                          </Badge>
                        </div>
                        <Progress value={i.progress} className="h-1.5" />
                      </div>
                    );
                  })}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="library" className="space-y-3 mt-4">
          {items.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                {fa ? "هنوز آزمونی بارگذاری نشده است." : "No exams uploaded yet."}
              </CardContent>
            </Card>
          )}
          {items.map((i) => {
            const m = statusMeta(i.status);
            return (
              <Card key={i.id}>
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 grid place-items-center shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold truncate">{i.name}</h3>
                      <Badge variant="secondary" className={`${m.cls} border-0`}>{m.label}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-1">
                      <span>{i.subject}</span>
                      <span>{i.grade}</span>
                      <span>{formatSize(i.size)}</span>
                      <span>{i.uploadedAt}</span>
                      {i.questions !== undefined && (
                        <span>{i.questions} {fa ? "سؤال" : "questions"}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      disabled={i.status !== "ready"}
                      onClick={() => setSelected(i.id)}
                    >
                      <Eye className="h-4 w-4 mx-1" />
                      {fa ? "تحلیل" : "Analyze"}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full"
                      onClick={() => remove(i.id)}
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

        <TabsContent value="analysis" className="space-y-4 mt-4">
          {!current || current.status !== "ready" ? (
            <Card>
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                {fa
                  ? "یک آزمون آماده برای مشاهده تحلیل انتخاب کنید."
                  : "Select a ready exam to view analysis."}
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    {current.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Stat label={fa ? "صفحات" : "Pages"} value={String(current.pages ?? 0)} />
                  <Stat label={fa ? "سؤالات" : "Questions"} value={String(current.questions ?? 0)} />
                  <Stat label={fa ? "سطح دشواری" : "Difficulty"} value={difficultyLabel(current.difficulty)} />
                  <Stat label={fa ? "درس" : "Subject"} value={current.subject} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {fa ? "توزیع مباحث" : "Topic distribution"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(current.topics ?? []).map((t) => (
                    <div key={t.name}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium truncate">{t.name}</span>
                        <span className="text-muted-foreground">{t.weight}%</span>
                      </div>
                      <Progress value={t.weight} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {fa ? "اقدامات پیشنهادی" : "Suggested actions"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-2">
                  <Button variant="outline" className="rounded-full justify-start">
                    {fa ? "تبدیل به آزمون آنلاین" : "Convert to online exam"}
                  </Button>
                  <Button variant="outline" className="rounded-full justify-start">
                    {fa ? "تخصیص به کلاس" : "Assign to a class"}
                  </Button>
                  <Button variant="outline" className="rounded-full justify-start">
                    {fa ? "تولید کلید پاسخ" : "Generate answer key"}
                  </Button>
                  <Button variant="outline" className="rounded-full justify-start">
                    {fa ? "اشتراک با همکاران" : "Share with colleagues"}
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl bg-muted/40 border">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-lg font-bold mt-0.5 truncate">{value}</p>
    </div>
  );
}
