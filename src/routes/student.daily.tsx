import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Clock, CheckCircle2, PlayCircle, RefreshCw, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/student/daily")({
  component: DailyPlan,
});

const blocks = [
  { id: 1, title: "تعریف تابع و دامنه", subject: "ریاضی", chapter: "فصل ۲ • توابع", duration: 10, xp: 40, status: "done" as const },
  { id: 2, title: "قانون اول نیوتن", subject: "فیزیک", chapter: "فصل ۳ • دینامیک", duration: 15, xp: 60, status: "done" as const },
  { id: 3, title: "حل معادله درجه دوم", subject: "ریاضی", chapter: "فصل ۲ • توابع", duration: 12, xp: 50, status: "active" as const },
  { id: 4, title: "ساختار اتم", subject: "شیمی", chapter: "فصل ۱ • اتم‌ها", duration: 10, xp: 40, status: "todo" as const },
  { id: 5, title: "زمان حال کامل", subject: "زبان", chapter: "درس ۴ • گرامر", duration: 8, xp: 30, status: "todo" as const },
];

function DailyPlan() {
  const total = blocks.length;
  const done = blocks.filter((b) => b.status === "done").length;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Badge variant="secondary" className="mb-2">
            <Sparkles className="h-3 w-3 ml-1" /> قدرت‌گرفته از توربو
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight">برنامه روزانه شما</h1>
          <p className="text-sm text-muted-foreground mt-1">
            یکشنبه، ۲۰ خرداد • {total} میکرواتم • حدود ۶۰ دقیقه
          </p>
        </div>
        <Button variant="outline" className="rounded-full">
          <RefreshCw className="h-4 w-4" /> بازسازی برنامه
        </Button>
      </div>

      <Card>
        <CardContent className="p-5 flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground grid place-items-center">
            <Target className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-medium">پیشرفت امروز</span>
              <span className="text-muted-foreground">
                {done} از {total} ({pct}٪)
              </span>
            </div>
            <Progress value={pct} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">میکرواتم‌های امروز</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {blocks.map((b, i) => (
            <div
              key={b.id}
              className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent/30 transition"
            >
              <div className="flex flex-col items-center">
                <span className="text-xs text-muted-foreground">گام</span>
                <span className="text-lg font-bold text-primary">{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{b.title}</h3>
                  {b.status === "active" && <Badge>اکنون</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {b.subject} • {b.chapter}
                </p>
              </div>
              <div className="hidden sm:flex flex-col items-end text-xs gap-1">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" /> {b.duration} دقیقه
                </span>
                <Badge variant="secondary" className="bg-xp/15 text-xp border-0">
                  +{b.xp} XP
                </Badge>
              </div>
              <Button
                size="sm"
                variant={b.status === "done" ? "secondary" : "default"}
                className="rounded-full"
              >
                {b.status === "done" ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> انجام شد
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4" /> شروع
                  </>
                )}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
