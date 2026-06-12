import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Trophy, Flame, Target, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/student/progress")({
  component: ProgressPage,
});

const subjects = [
  { name: "ریاضی", mastered: 24, total: 32, mastery: 78 },
  { name: "فیزیک", mastered: 18, total: 28, mastery: 64 },
  { name: "شیمی", mastered: 12, total: 24, mastery: 52 },
  { name: "زبان انگلیسی", mastered: 22, total: 26, mastery: 86 },
  { name: "ادبیات", mastered: 8, total: 20, mastery: 41 },
];

const weekly = [
  { day: "ش", xp: 180 },
  { day: "ی", xp: 240 },
  { day: "د", xp: 120 },
  { day: "س", xp: 320 },
  { day: "چ", xp: 200 },
  { day: "پ", xp: 280 },
  { day: "ج", xp: 160 },
];

const badges = [
  { icon: "🔥", name: "آتش‌فشان", desc: "۷ روز پیاپی" },
  { icon: "🎯", name: "تیرانداز", desc: "۵۰ پاسخ صحیح" },
  { icon: "⚡", name: "پرتلاش", desc: "یک اتم‌بیت در ۲ دقیقه" },
  { icon: "🧠", name: "رشد پایدار", desc: "۱۰ مفهوم چالشی" },
];

function ProgressPage() {
  const maxXp = Math.max(...weekly.map((w) => w.xp));
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">پیشرفت من</h1>
        <p className="text-sm text-muted-foreground mt-1">روند یادگیری، تسلط و XP شما</p>
      </div>

      {/* XP overview */}
      <div className="grid sm:grid-cols-3 gap-3">
        <Card className="bg-[image:var(--gradient-primary)] text-primary-foreground border-0">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs opacity-80">
              <Trophy className="h-4 w-4" /> سطح فعلی
            </div>
            <p className="text-3xl font-extrabold mt-2">سطح ۸</p>
            <p className="text-xs opacity-90 mt-1">۲٬۴۸۰ / ۳٬۰۰۰ XP تا سطح بعدی</p>
            <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white" style={{ width: "82%" }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Flame className="h-4 w-4 text-warning" /> تداوم یادگیری
            </div>
            <p className="text-3xl font-extrabold mt-2">۱۲ روز</p>
            <p className="text-xs text-muted-foreground mt-1">رکورد شخصی: ۲۱ روز</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Target className="h-4 w-4 text-success" /> میانگین تسلط
            </div>
            <p className="text-3xl font-extrabold mt-2">۷۲٪</p>
            <p className="text-xs text-muted-foreground mt-1">+۴٪ نسبت به هفته قبل</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly XP chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> XP این هفته
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2 h-40">
            {weekly.map((w) => (
              <div key={w.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[11px] text-muted-foreground">{w.xp}</span>
                <div
                  className="w-full rounded-t-md bg-[image:var(--gradient-xp)]"
                  style={{ height: `${(w.xp / maxXp) * 100}%` }}
                />
                <span className="text-xs font-medium">{w.day}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subject mastery */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">تسلط بر دروس</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subjects.map((s) => (
            <div key={s.name} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{s.name}</span>
                <span className="text-muted-foreground">
                   {s.mastered}/{s.total} اتم‌بیت • {s.mastery}٪
                </span>
              </div>
              <Progress value={s.mastery} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> نشان‌های رشد اخیر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {badges.map((b) => (
              <div key={b.name} className="rounded-xl border p-4 text-center">
                <div className="text-3xl">{b.icon}</div>
                <p className="font-semibold mt-2 text-sm">{b.name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{b.desc}</p>
                <Badge variant="secondary" className="mt-2 bg-xp/15 text-xp border-0 text-[10px]">
                  +۵۰ XP
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
