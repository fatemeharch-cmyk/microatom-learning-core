import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sun,
  Clock,
  GraduationCap,
  HeartHandshake,
  TrendingUp,
  Megaphone,
  ChevronLeft,
} from "lucide-react";
import {
  childName,
  dailySummary,
  upcomingExams,
  mentoringMeetings,
  weeklyPulse,
  announcements,
} from "@/lib/parent-mock";

export const Route = createFileRoute("/parent/")({
  component: ParentDashboard,
});

function ParentDashboard() {
  const upcomingMeetings = mentoringMeetings.filter((m) => m.status === "upcoming");

  return (
    <div className="space-y-6" dir="rtl">
      <Card className="overflow-hidden border-0 bg-[image:var(--gradient-primary)] text-primary-foreground">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-white/15 grid place-items-center">
            <Sun className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">سلام، خوش آمدید 👋</h1>
            <p className="text-sm md:text-base opacity-90 mt-1">
              {dailySummary.highlight}
            </p>
          </div>
          <Button asChild variant="secondary" size="lg" className="rounded-full">
            <Link to="/parent/growth">
              مسیر رشد {childName} <ChevronLeft className="h-4 w-4 mr-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">زمان یادگیری امروز</p>
              <p className="text-xl font-bold">{dailySummary.studiedMinutes} دقیقه</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-success/10 text-success grid place-items-center">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">فعالیت‌های امروز</p>
              <p className="text-xl font-bold">{dailySummary.completedActivities}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-info/10 text-info grid place-items-center">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">آزمون‌های پیش رو</p>
              <p className="text-xl font-bold">{upcomingExams.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent text-accent-foreground grid place-items-center">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">جلسات پیش رو</p>
              <p className="text-xl font-bold">{upcomingMeetings.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" /> نبض یادگیری این هفته
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {weeklyPulse.map((p) => (
              <div key={p.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{p.label}</span>
                  <span className="text-muted-foreground">{p.value}٪</span>
                </div>
                <Progress value={p.value} className="h-2" />
              </div>
            ))}
            <p className="text-xs text-muted-foreground pt-1">
              این شاخص‌ها بر مسیر شخصی {childName} متمرکزند و با هیچ دانش‌آموز دیگری مقایسه نمی‌شوند.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-info" /> آزمون‌های پیش رو
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcomingExams.map((e, i) => (
                <div key={i} className="p-3 rounded-xl bg-muted/40">
                  <p className="text-sm font-medium">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{e.subject} • {e.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-accent/30 border-accent">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-primary" /> یادآور جلسه همراهی
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcomingMeetings.slice(0, 2).map((m) => (
                <div key={m.id} className="p-3 rounded-xl bg-card">
                  <p className="text-sm font-medium">
                    {m.type === "parent" ? "ملاقات والدین" : "جلسه دانش‌آموز"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {m.date} • {m.time} • با {m.with}
                  </p>
                </div>
              ))}
              <Button asChild variant="ghost" size="sm" className="w-full">
                <Link to="/parent/meetings">مشاهده جلسات</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
          <CardTitle className="text-base flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-primary" /> اطلاعیه‌های مدرسه
          </CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/parent/announcements">همه اطلاعیه‌ها</Link>
          </Button>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-3">
          {announcements.slice(0, 4).map((a) => (
            <div key={a.id} className="p-3 rounded-xl bg-muted/40">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium truncate">{a.title}</p>
                <Badge variant="outline" className="text-[10px] shrink-0">{a.date}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.body}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
