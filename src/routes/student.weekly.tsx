import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, CalendarRange, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/student/weekly")({
  component: WeeklyPlan,
});

const days = [
  { day: "شنبه", date: "۱۹", focus: "ریاضی + فیزیک", count: 5, done: 5, xp: 220 },
  { day: "یکشنبه", date: "۲۰", focus: "ریاضی + شیمی + زبان", count: 5, done: 2, xp: 100, today: true },
  { day: "دوشنبه", date: "۲۱", focus: "فیزیک + زیست", count: 4, done: 0, xp: 0 },
  { day: "سه‌شنبه", date: "۲۲", focus: "ریاضی + شیمی", count: 5, done: 0, xp: 0 },
  { day: "چهارشنبه", date: "۲۳", focus: "زبان + ادبیات", count: 4, done: 0, xp: 0 },
  { day: "پنج‌شنبه", date: "۲۴", focus: "آزمون جمع‌بندی", count: 3, done: 0, xp: 0, exam: true },
  { day: "جمعه", date: "۲۵", focus: "مرور آزاد", count: 6, done: 0, xp: 0 },
];

const goals = [
  { title: "تسلط بر فصل ۲ ریاضی", value: 65 },
  { title: "اتمام فصل ۳ فیزیک", value: 40 },
  { title: "۵۰ لغت جدید زبان", value: 30 },
];

function WeeklyPlan() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <Badge variant="secondary" className="mb-2">
          <Sparkles className="h-3 w-3 ml-1" /> طراحی شده توسط توربو
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight">برنامه هفتگی شما</h1>
        <p className="text-sm text-muted-foreground mt-1">
          هفته ۲۵ خرداد • ۳۲ میکرواتم • ۱ آزمون جمع‌بندی
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" /> اهداف این هفته
          </CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-4">
          {goals.map((g) => (
            <div key={g.title} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{g.title}</span>
                <span className="text-muted-foreground">{g.value}٪</span>
              </div>
              <Progress value={g.value} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarRange className="h-4 w-4 text-primary" /> نقشه هفته
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {days.map((d) => {
              const pct = d.count ? Math.round((d.done / d.count) * 100) : 0;
              return (
                <div
                  key={d.day}
                  className={`rounded-xl border p-3 space-y-2 ${
                    d.today ? "border-primary bg-primary/5" : "bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{d.day}</p>
                      <p className="text-lg font-bold">{d.date}</p>
                    </div>
                    {d.today && <Badge>امروز</Badge>}
                    {d.exam && (
                      <Badge variant="secondary" className="bg-warning/15 text-warning border-0">
                        آزمون
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">
                    {d.focus}
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>
                        {d.done}/{d.count}
                      </span>
                      <span className="text-xp">+{d.xp} XP</span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
