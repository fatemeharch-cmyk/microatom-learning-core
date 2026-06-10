import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BarChart3, TrendingDown, TrendingUp, Users, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/teacher/analytics")({
  component: ClassAnalytics,
});

const classesFA = [
  { id: "10a", name: "پایه ۱۰ - الف", students: 30, mastery: 74, engagement: 88, trend: +5 },
  { id: "10b", name: "پایه ۱۰ - ب", students: 28, mastery: 62, engagement: 71, trend: -3 },
  { id: "11a", name: "پایه ۱۱ - الف", students: 32, mastery: 81, engagement: 92, trend: +2 },
];
const classesEN = [
  { id: "10a", name: "Grade 10-A", students: 30, mastery: 74, engagement: 88, trend: +5 },
  { id: "10b", name: "Grade 10-B", students: 28, mastery: 62, engagement: 71, trend: -3 },
  { id: "11a", name: "Grade 11-A", students: 32, mastery: 81, engagement: 92, trend: +2 },
];

const chaptersFA = [
  { name: "فصل ۱ - مجموعه‌ها", mastery: 86 },
  { name: "فصل ۲ - توابع", mastery: 64 },
  { name: "فصل ۳ - مثلثات", mastery: 52 },
  { name: "فصل ۴ - حد و مشتق", mastery: 41 },
];
const chaptersEN = [
  { name: "Ch.1 - Sets", mastery: 86 },
  { name: "Ch.2 - Functions", mastery: 64 },
  { name: "Ch.3 - Trigonometry", mastery: 52 },
  { name: "Ch.4 - Limits & derivatives", mastery: 41 },
];

const weakFA = [
  { topic: "حل معادله درجه دوم", pct: 34 },
  { topic: "ترکیب توابع", pct: 41 },
  { topic: "نمودار سینوس و کسینوس", pct: 47 },
];
const weakEN = [
  { topic: "Solving quadratics", pct: 34 },
  { topic: "Function composition", pct: 41 },
  { topic: "Sine & cosine graphs", pct: 47 },
];

const weekly = [62, 68, 65, 71, 74, 73, 78];

function ClassAnalytics() {
  const { lang } = useI18n();
  const fa = lang === "fa";
  const classes = fa ? classesFA : classesEN;
  const chapters = fa ? chaptersFA : chaptersEN;
  const weak = fa ? weakFA : weakEN;
  const [selected, setSelected] = useState(classes[0].id);
  const c = classes.find((x) => x.id === selected)!;
  const max = Math.max(...weekly);

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <Badge variant="secondary" className="mb-2">
          <BarChart3 className="h-3 w-3 mx-1" />
          {fa ? "تحلیل کلاس" : "Class analytics"}
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight">
          {fa ? "عملکرد کلاس‌ها" : "Class performance"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {fa
            ? "تسلط، مشارکت و نقاط ضعف هر کلاس را در یک نگاه ببین."
            : "Mastery, engagement and weak spots for each class at a glance."}
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {classes.map((cl) => (
          <button
            key={cl.id}
            onClick={() => setSelected(cl.id)}
            className={`text-start rounded-xl border p-4 transition ${
              selected === cl.id
                ? "border-primary bg-primary/5"
                : "bg-card hover:bg-accent/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold">{cl.name}</p>
              {cl.trend >= 0 ? (
                <span className="text-xs flex items-center gap-1 text-success">
                  <TrendingUp className="h-3 w-3" />+{cl.trend}٪
                </span>
              ) : (
                <span className="text-xs flex items-center gap-1 text-destructive">
                  <TrendingDown className="h-3 w-3" />
                  {cl.trend}٪
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Users className="h-3 w-3" /> {cl.students} {fa ? "دانش‌آموز" : "students"}
            </p>
            <div className="mt-3 space-y-1.5">
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>{fa ? "تسلط" : "Mastery"}</span>
                <span>{cl.mastery}٪</span>
              </div>
              <Progress value={cl.mastery} className="h-1.5" />
            </div>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              {fa ? `روند ۷ هفته - ${c.name}` : `7-week trend - ${c.name}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-40">
              {weekly.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">{v}</span>
                  <div
                    className="w-full rounded-t bg-[image:var(--gradient-primary)]"
                    style={{ height: `${(v / max) * 100}%` }}
                  />
                  <span className="text-[10px]">W{i + 1}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              {fa ? "تسلط بر فصل‌ها" : "Mastery by chapter"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {chapters.map((ch) => (
              <div key={ch.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{ch.name}</span>
                  <span className="text-muted-foreground">{ch.mastery}٪</span>
                </div>
                <Progress value={ch.mastery} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {fa ? "نقاط ضعف کلاس" : "Class weak spots"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {weak.map((w) => (
            <div
              key={w.topic}
              className="flex items-center gap-3 p-3 rounded-xl border bg-card"
            >
              <div className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive grid place-items-center">
                <TrendingDown className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{w.topic}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {fa ? "میانگین پاسخ صحیح:" : "Average correct:"} {w.pct}٪
                </p>
              </div>
              <Progress value={w.pct} className="w-32 h-1.5" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
