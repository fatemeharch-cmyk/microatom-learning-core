import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sun,
  Users,
  GraduationCap,
  CalendarRange,
  TrendingUp,
  Sparkles,
  BookOpen,
  ChevronLeft,
} from "lucide-react";
import {
  schoolPulse,
  todayRegistrations,
  weeklyEvents,
  teacherActivity,
  gradeSummaries,
  feedbackSummary,
} from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const eventTone: Record<string, string> = {
  exam: "bg-primary/10 text-primary",
  meeting: "bg-info/10 text-info",
  event: "bg-success/10 text-success",
  holiday: "bg-warning/15 text-warning",
};

export function AdminDashboard() {
  return (
    <div className="space-y-6" dir="rtl">
      <Card className="overflow-hidden border-0 bg-[image:var(--gradient-primary)] text-primary-foreground">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-white/15 grid place-items-center">
            <Sun className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">سلام مدیر گرامی 👋</h1>
            <p className="text-sm md:text-base opacity-90 mt-1">
              نبض یادگیری مدرسه امروز مثبت و رو به رشد است. خلاصه‌ای از وضعیت کلی را مشاهده کنید.
            </p>
          </div>
          <Button asChild variant="secondary" size="lg" className="rounded-full">
            <Link to="/admin/registration">
              وضعیت کلاس‌ها <ChevronLeft className="h-4 w-4 mr-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <PulseStat icon={<Users className="h-4 w-4" />} label="دانش‌آموزان فعال" value={schoolPulse.activeStudents.toLocaleString("fa-IR")} />
        <PulseStat icon={<GraduationCap className="h-4 w-4" />} label="دبیران فعال" value={schoolPulse.activeTeachers.toLocaleString("fa-IR")} />
        <PulseStat icon={<BookOpen className="h-4 w-4" />} label="کلاس‌های امروز" value={schoolPulse.classesToday.toLocaleString("fa-IR")} />
        <PulseStat
          icon={<TrendingUp className="h-4 w-4" />}
          label="نرخ ثبت کلاس"
          value={`${schoolPulse.registrationRate}%`}
          accent="success"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" /> وضعیت ثبت کلاس‌های امروز
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayRegistrations.map((r) => {
              const pct = Math.round((r.registered / r.scheduled) * 100);
              return (
                <div key={r.grade} className="p-3 rounded-xl bg-muted/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{r.grade}</p>
                    <Badge variant="secondary" className="rounded-lg">{pct}%</Badge>
                  </div>
                  <Progress value={pct} />
                  <p className="text-xs text-muted-foreground">
                    {r.registered.toLocaleString("fa-IR")} از {r.scheduled.toLocaleString("fa-IR")} کلاس ثبت شده • {r.open.toLocaleString("fa-IR")} کلاس آماده ثبت
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="bg-accent/30 border-accent">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> نبض هفتگی توربو
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-bold text-primary">+{schoolPulse.weeklyGrowth}%</div>
            <p className="text-sm text-muted-foreground">
              رشد مثبت شاخص فعالیت یادگیری نسبت به هفته گذشته
            </p>
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link to="/admin/feedback">مشاهده بازخوردها</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarRange className="h-4 w-4 text-info" /> رویدادهای هفته
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {weeklyEvents.map((e) => (
              <div key={e.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/40 gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{e.day} • {e.audience}</p>
                </div>
                <Badge className={`rounded-lg ${eventTone[e.type]}`} variant="secondary">
                  {labelForType(e.type)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-success" /> فعالیت دبیران
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {teacherActivity.map((t) => {
              const pct = Math.round((t.logsCompleted / t.logsExpected) * 100);
              return (
                <div key={t.id} className="p-3 rounded-xl bg-muted/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{t.name}</p>
                    <span className="text-xs text-muted-foreground">{t.subject}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={pct} className="flex-1" />
                    <span className="text-xs font-semibold w-10 text-end">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">خلاصه پایه‌ها</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {gradeSummaries.map((g) => (
              <div key={g.grade} className="p-3 rounded-xl bg-muted/40">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{g.grade}</p>
                  <Badge variant="secondary" className="rounded-lg">شاخص رشد {g.growthIndex}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {g.students.toLocaleString("fa-IR")} دانش‌آموز • {g.classes} کلاس • همراه: {g.supervisor}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">خلاصه بازخوردها</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {feedbackSummary.map((f) => (
              <div key={f.source} className="p-3 rounded-xl bg-muted/40 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{f.label}</p>
                  <Badge variant="secondary" className="rounded-lg">{f.satisfaction}%</Badge>
                </div>
                <Progress value={f.satisfaction} />
                <p className="text-xs text-muted-foreground">
                  {f.responses.toLocaleString("fa-IR")} پاسخ • روند {f.trend === "up" ? "رو به رشد" : "پایدار"}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PulseStat({
  icon,
  label,
  value,
  accent = "primary",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: "primary" | "success";
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <span className={accent === "success" ? "text-success" : "text-primary"}>{icon}</span>
          <span>{label}</span>
        </div>
        <p className="text-2xl font-bold mt-2">{value}</p>
      </CardContent>
    </Card>
  );
}

function labelForType(t: string) {
  switch (t) {
    case "exam": return "آزمون";
    case "meeting": return "جلسه";
    case "event": return "رویداد";
    case "holiday": return "تعطیلی";
    default: return t;
  }
}
