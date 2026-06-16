import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HeartHandshake, Clock, FileText, Plus } from "lucide-react";
import { todaySessions, upcomingParentMeetings, type MentoringSession } from "@/lib/supervisor-mock";

export const Route = createFileRoute("/supervisor/sessions")({
  component: Sessions,
});

const past: MentoringSession[] = [
  { id: "h1", studentName: "محمد رضایی", studentClass: "یازدهم ۱", date: "۱۲ خرداد", time: "۱۴:۳۰", type: "student", status: "completed", previousNote: "تنظیم برنامه مطالعه روزانه" },
  { id: "h2", studentName: "ساره موسوی", studentClass: "یازدهم ۱", date: "۱۰ خرداد", time: "۱۶:۰۰", type: "parent", status: "completed", previousNote: "هماهنگی برنامه هفتگی با خانواده" },
  { id: "h3", studentName: "نیلوفر احمدی", studentClass: "یازدهم ۲", date: "۸ خرداد", time: "۱۵:۰۰", type: "student", status: "completed", previousNote: "تقویت تمرکز در جلسات کوتاه" },
];

const statusMap: Record<MentoringSession["status"], { label: string; cls: string }> = {
  scheduled: { label: "زمان‌بندی شده", cls: "bg-primary/15 text-primary border-primary/30" },
  completed: { label: "انجام شد", cls: "bg-success/15 text-success border-success/30" },
  rescheduled: { label: "زمان‌بندی مجدد", cls: "bg-info/15 text-info border-info/30" },
};

function SessionCard({ s }: { s: MentoringSession }) {
  return (
    <Card className="hover:shadow-md transition">
      <CardContent className="p-4 flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary text-sm">
            {s.studentName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="font-medium truncate">{s.studentName}</p>
            <Badge className={`${statusMap[s.status].cls} border`}>
              {statusMap[s.status].label}
            </Badge>
          </div>
          <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
            <span>{s.studentClass}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> {s.date} • {s.time}
            </span>
            <Badge variant="outline" className="text-[10px]">
              {s.type === "student" ? "جلسه دانش‌آموز" : "جلسه والدین"}
            </Badge>
          </div>
          {s.previousNote && (
            <div className="p-2 rounded-lg bg-muted/40 flex gap-2 text-xs">
              <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <span>{s.previousNote}</span>
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <Button size="sm" variant="outline" className="rounded-full">یادداشت‌های قبلی</Button>
            <Button size="sm" variant="ghost" className="rounded-full">جزئیات</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Sessions() {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <HeartHandshake className="h-6 w-6 text-primary" /> جلسات همراهی
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            مدیریت جلسات یک‌به‌یک با دانش‌آموزان و خانواده‌ها
          </p>
        </div>
        <Button className="rounded-full gap-1">
          <Plus className="h-4 w-4" /> جلسه جدید
        </Button>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">جلسات امروز</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {todaySessions.map((s) => <SessionCard key={s.id} s={s} />)}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">ملاقات‌های پیش رو با والدین</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {upcomingParentMeetings.map((s) => <SessionCard key={s.id} s={s} />)}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">جلسات اخیر</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {past.map((s) => <SessionCard key={s.id} s={s} />)}
        </div>
      </section>
    </div>
  );
}
