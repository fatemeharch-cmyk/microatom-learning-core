import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle, CalendarDays, NotebookPen, GraduationCap, Sparkles, HeartHandshake, Target } from "lucide-react";
import { sampleStudentProfile as p } from "@/lib/supervisor-mock";

export const Route = createFileRoute("/supervisor/student")({
  component: StudentProfilePage,
});

function StudentProfilePage() {
  const homeworkPct = Math.round((p.homework.completed / p.homework.total) * 100);
  const attendancePct = Math.round((p.attendance.present / p.attendance.total) * 100);

  return (
    <div className="space-y-6" dir="rtl">
      <Card className="overflow-hidden border-0 bg-[image:var(--gradient-primary)] text-primary-foreground">
        <CardContent className="p-6 flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-white/20 text-white text-lg">
              {p.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{p.name}</h1>
            <p className="opacity-90 text-sm">{p.class}</p>
          </div>
          <Badge className="bg-white/20 text-white border-0">پروفایل آموزشی</Badge>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">تکمیل تکالیف</p>
            <p className="text-2xl font-bold mt-1">{homeworkPct}٪</p>
            <Progress value={homeworkPct} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">حضور در کلاس</p>
            <p className="text-2xl font-bold mt-1">{attendancePct}٪</p>
            <Progress value={attendancePct} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">میانگین آزمون‌ها</p>
            <p className="text-2xl font-bold mt-1">
              {Math.round(p.recentExams.reduce((s, e) => s + e.score, 0) / p.recentExams.length)}٪
            </p>
            <p className="text-xs text-success mt-2">روند رو به رشد</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">مباحث در حال تمرکز</p>
            <p className="text-2xl font-bold mt-1">{p.focusTopics.length}</p>
            <p className="text-xs text-muted-foreground mt-2">واحد یادگیری فعال</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> مسیر یادگیری
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative pr-6">
              <div className="absolute right-2 top-2 bottom-2 w-px bg-border" />
              <ul className="space-y-4">
                {p.journey.map((j, i) => (
                  <li key={i} className="relative">
                    <div className="absolute right-[-22px] top-1.5 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                    <p className="text-xs text-muted-foreground">{j.date}</p>
                    <p className="text-sm font-medium">{j.title}</p>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-success" /> اهداف هفتگی
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {p.weeklyGoals.map((g, i) => (
                <li key={i} className="p-2.5 rounded-lg bg-muted/40 text-sm">{g}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-info" /> آزمون‌های اخیر
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {p.recentExams.map((e, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{e.title}</p>
                  <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" /> {e.date}
                  </p>
                </div>
                <Badge variant="secondary">{e.score}٪</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <HeartHandshake className="h-4 w-4 text-primary" /> تاریخچه همراهی
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {p.mentoringHistory.map((m, i) => (
              <div key={i} className="p-3 rounded-xl bg-muted/40">
                <p className="text-xs text-muted-foreground">{m.date}</p>
                <p className="text-sm">{m.summary}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <NotebookPen className="h-4 w-4 text-primary" /> مباحث در حال تمرکز
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {p.focusTopics.map((t) => (
            <Badge key={t} variant="outline" className="text-sm py-1.5 px-3">{t}</Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
