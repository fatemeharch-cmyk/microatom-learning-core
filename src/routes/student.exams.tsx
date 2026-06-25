import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Sparkles, CalendarDays, TrendingUp } from "lucide-react";
import { ExamRunner } from "@/components/student/exam-runner";

export const Route = createFileRoute("/student/exams")({
  component: ExamsPage,
});

const exams = [
  {
    title: "آزمون جامع فیزیک",
    subject: "فیزیک",
    date: "شنبه، ۲۶ خرداد",
    score: null as number | null,
    suggestion: "مرور فصل حرکت پرتابی برای آمادگی بیشتر",
  },
  {
    title: "آزمون شیمی فصل ۱",
    subject: "شیمی",
    date: "۱۸ خرداد",
    score: 78,
    suggestion: "تمرکز روی محاسبات استوکیومتری برای رشد بیشتر",
  },
  {
    title: "آزمون زیست‌شناسی",
    subject: "زیست‌شناسی",
    date: "۱۱ خرداد",
    score: 85,
    suggestion: "ادامه همین مسیر — تسلط در حال شکل‌گیری است",
  },
  {
    title: "آزمون ریاضی فصل ۲",
    subject: "ریاضی",
    date: "۴ خرداد",
    score: 64,
    suggestion: "تمرین بیشتر روی معادلات درجه دوم فرصت رشد خوبی است",
  },
];

function ExamsPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" /> آزمون‌های من
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          نگاهی به مسیر آزمون‌ها و پیشنهادهای یادگیری توربو
        </p>
      </div>

      <Card className="bg-[image:var(--gradient-primary)] text-primary-foreground border-0">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-white/15 grid place-items-center">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm opacity-90">میانگین رشد در ۴ آزمون اخیر</p>
            <p className="text-2xl font-bold">۷۵٪</p>
          </div>
          <Badge className="bg-white/20 text-white border-0">روند مثبت</Badge>
        </CardContent>
      </Card>

      <ExamRunner />

      <div className="grid md:grid-cols-2 gap-4">

        {exams.map((e, i) => (
          <Card key={i} className="hover:shadow-md transition">
            <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
              <div>
                <CardTitle className="text-base">{e.title}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" /> {e.date} • {e.subject}
                </p>
              </div>
              {e.score !== null ? (
                <Badge variant="secondary" className="text-base font-bold">
                  {e.score}٪
                </Badge>
              ) : (
                <Badge className="bg-info/15 text-info border-info/30">پیش رو</Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {e.score !== null && <Progress value={e.score} className="h-2" />}
              <div className="p-3 rounded-xl bg-accent/30 flex gap-2">
                <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm flex-1">{e.suggestion}</p>
              </div>
              <Button size="sm" variant="outline" className="rounded-full">
                مشاهده جزئیات
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
