import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sun,
  HeartHandshake,
  Users,
  ListChecks,
  Sparkles,
  ClipboardEdit,
  ChevronLeft,
} from "lucide-react";
import {
  todaySessions,
  upcomingParentMeetings,
  followUps,
  weeklyAISummary,
  pendingClassLogs,
} from "@/lib/supervisor-mock";

export const Route = createFileRoute("/supervisor/")({
  component: SupervisorDashboard,
});

function SupervisorDashboard() {
  const activeFollowUps = followUps.filter((f) => f.status !== "completed").slice(0, 3);

  return (
    <div className="space-y-6" dir="rtl">
      <Card className="overflow-hidden border-0 bg-[image:var(--gradient-primary)] text-primary-foreground">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-white/15 grid place-items-center">
            <Sun className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">سلام استاد نوری 👋</h1>
            <p className="text-sm md:text-base opacity-90 mt-1">
              امروز ۲ جلسه همراهی پیش رو داری. روز خوبی برای حمایت از مسیر رشد بچه‌هاست.
            </p>
          </div>
          <Button asChild variant="secondary" size="lg" className="rounded-full">
            <Link to="/supervisor/sessions">
              جلسات همراهی <ChevronLeft className="h-4 w-4 mr-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <HeartHandshake className="h-4 w-4 text-primary" /> جلسات همراهی امروز
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {todaySessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/40 gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Badge variant="secondary" className="rounded-lg shrink-0">{s.time}</Badge>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{s.studentName}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.studentClass}</p>
                  </div>
                </div>
                <Button asChild size="sm" variant="ghost">
                  <Link to="/supervisor/student">نمای پروفایل</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-accent/30 border-accent">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> خلاصه هفتگی توربو
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {weeklyAISummary.map((w, i) => (
                <li key={i} className="flex gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
            <Button asChild variant="ghost" size="sm" className="w-full mt-3">
              <Link to="/supervisor/turbo">مشاهده کامل</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-info" /> ملاقات‌های والدین
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingParentMeetings.map((p) => (
              <div key={p.id} className="p-3 rounded-xl bg-muted/40">
                <p className="text-sm font-medium">{p.studentName}</p>
                <p className="text-xs text-muted-foreground">{p.date} • {p.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-success" /> پیگیری‌های فعال
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeFollowUps.map((f) => (
              <div key={f.id} className="p-3 rounded-xl bg-muted/40">
                <p className="text-sm font-medium truncate">{f.goal}</p>
                <p className="text-xs text-muted-foreground">{f.studentName} • {f.nextDate}</p>
              </div>
            ))}
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link to="/supervisor/followups">مشاهده همه</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardEdit className="h-4 w-4 text-primary" /> در انتظار ثبت کلاس
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingClassLogs.map((p, i) => (
              <div key={i} className="p-3 rounded-xl bg-muted/40">
                <p className="text-sm font-medium">{p.class}</p>
                <p className="text-xs text-muted-foreground">
                  {p.teacher} • {p.subject} • {p.date}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
