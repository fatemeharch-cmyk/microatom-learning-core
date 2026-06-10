import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  CalendarDays,
  CalendarRange,
  NotebookPen,
  GraduationCap,
  TrendingUp,
  Flame,
  Trophy,
  Target,
  Clock,
  ChevronLeft,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/student/")({
  component: StudentDashboard,
});

function StudentDashboard() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card className="border-0 overflow-hidden bg-[image:var(--gradient-primary)] text-primary-foreground">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-xs/relaxed opacity-80">سلام آرمین عزیز 👋</p>
            <h1 className="text-2xl md:text-3xl font-bold mt-1">آماده‌ای امروز رو بترکونی؟</h1>
            <p className="mt-2 text-sm opacity-90">
              ۵ میکرواتم جدید توی برنامه‌ی هوش مصنوعی امروزت منتظرته.
            </p>
          </div>
          <Button size="lg" variant="secondary" className="rounded-full font-semibold" asChild>
            <Link to="/student/daily">
              شروع یادگیری
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Stat strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Trophy} label="امتیاز کل" value="۲٬۴۸۰" sub="+۱۲۰ امروز" tone="xp" />
        <StatCard icon={Flame} label="روزهای پیاپی" value="۱۲" sub="رکورد: ۲۱" tone="warning" />
        <StatCard icon={Target} label="میکرواتم تسلط‌یافته" value="۸۴" sub="از ۱۲۰" tone="success" />
        <StatCard icon={Clock} label="زمان مطالعه امروز" value="۴۸′" sub="هدف: ۶۰′" tone="info" />
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <FeatureCard
          to="/student/daily"
          icon={CalendarDays}
          title="برنامه روزانه هوشمند"
          desc="برنامه‌ای که AI براساس نقاط ضعف و قوتت برای امروزت ساخته."
          accent="primary"
          meta="۵ میکرواتم • ۶۰ دقیقه"
        />
        <FeatureCard
          to="/student/weekly"
          icon={CalendarRange}
          title="برنامه هفتگی"
          desc="نقشه راه ۷ روزه با اهداف و آزمون‌های جمع‌بندی."
          accent="info"
          meta="۳۲ میکرواتم این هفته"
        />
        <FeatureCard
          to="/student/homework"
          icon={NotebookPen}
          title="مرکز تکالیف"
          desc="تکالیف معلم‌ها در یک جا، با مهلت و وضعیت تحویل."
          accent="warning"
          meta="۳ تکلیف فعال"
          badge="جدید"
        />
        <FeatureCard
          to="/student/exams"
          icon={GraduationCap}
          title="مرکز آزمون"
          desc="آزمون‌های تشخیصی، تمرینی و رسمی به صورت تطبیقی."
          accent="success"
          meta="آزمون بعدی: شنبه"
        />
        <FeatureCard
          to="/student/progress"
          icon={TrendingUp}
          title="ردیابی پیشرفت"
          desc="نمودار تسلط در هر فصل و توصیه‌های شخصی‌سازی شده."
          accent="primary"
          meta="میانگین تسلط ۷۲٪"
        />
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" />
              پیشنهاد هوش مصنوعی
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              توی مبحث «معادله درجه دوم» نیاز به تمرین بیشتری داری. ۱۰ دقیقه وقت بذاریم؟
            </p>
            <Button size="sm" className="rounded-full">
              شروع تمرین سریع
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Today's plan + Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              برنامه امروز
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/student/daily">
                مشاهده کامل <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {todayPlan.map((t) => (
              <PlanRow key={t.id} {...t} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              تسلط بر دروس
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mastery.map((m) => (
              <div key={m.subject} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{m.subject}</span>
                  <span className="text-muted-foreground">{m.value}٪</span>
                </div>
                <Progress value={m.value} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  tone: "xp" | "warning" | "success" | "info";
}) {
  const toneMap = {
    xp: "bg-xp/15 text-xp",
    warning: "bg-warning/15 text-warning",
    success: "bg-success/15 text-success",
    info: "bg-info/15 text-info",
  } as const;
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`h-10 w-10 rounded-xl grid place-items-center ${toneMap[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-bold leading-tight">{value}</p>
          <p className="text-[11px] text-muted-foreground">{sub}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function FeatureCard({
  to,
  icon: Icon,
  title,
  desc,
  meta,
  accent,
  badge,
}: {
  to: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  meta: string;
  accent: "primary" | "info" | "warning" | "success";
  badge?: string;
}) {
  const accentMap = {
    primary: "bg-primary/10 text-primary",
    info: "bg-info/10 text-info",
    warning: "bg-warning/15 text-warning",
    success: "bg-success/15 text-success",
  } as const;
  return (
    <Link to={to} className="group">
      <Card className="h-full transition-all hover:shadow-md hover:-translate-y-0.5">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div className={`h-11 w-11 rounded-xl grid place-items-center ${accentMap[accent]}`}>
              <Icon className="h-5 w-5" />
            </div>
            {badge && <Badge variant="secondary">{badge}</Badge>}
          </div>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{desc}</p>
          </div>
          <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
            <span>{meta}</span>
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function PlanRow({
  title,
  subject,
  duration,
  status,
}: {
  id: number;
  title: string;
  subject: string;
  duration: string;
  status: "done" | "active" | "todo";
}) {
  const Icon = status === "done" ? CheckCircle2 : PlayCircle;
  const tone =
    status === "done"
      ? "text-success"
      : status === "active"
        ? "text-primary"
        : "text-muted-foreground";
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card/50 hover:bg-accent/40 transition-colors">
      <Icon className={`h-5 w-5 ${tone}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{title}</p>
        <p className="text-xs text-muted-foreground">{subject}</p>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">{duration}</span>
      {status === "active" && <Badge>در حال انجام</Badge>}
      {status === "done" && (
        <Badge variant="secondary" className="bg-success/15 text-success border-0">
          +۴۰ XP
        </Badge>
      )}
    </div>
  );
}

const todayPlan = [
  { id: 1, title: "تعریف تابع و دامنه", subject: "ریاضی • فصل ۲", duration: "۱۰′", status: "done" as const },
  { id: 2, title: "قانون اول نیوتن", subject: "فیزیک • فصل ۳", duration: "۱۵′", status: "done" as const },
  { id: 3, title: "حل معادله درجه دوم", subject: "ریاضی • فصل ۲", duration: "۱۲′", status: "active" as const },
  { id: 4, title: "ساختار اتم", subject: "شیمی • فصل ۱", duration: "۱۰′", status: "todo" as const },
  { id: 5, title: "زمان حال کامل", subject: "زبان • درس ۴", duration: "۸′", status: "todo" as const },
];

const mastery = [
  { subject: "ریاضی", value: 78 },
  { subject: "فیزیک", value: 64 },
  { subject: "شیمی", value: 52 },
  { subject: "زبان انگلیسی", value: 86 },
];
