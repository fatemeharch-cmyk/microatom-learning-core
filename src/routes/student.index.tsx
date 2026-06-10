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
  ChevronRight,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n, type TKey } from "@/lib/i18n";

export const Route = createFileRoute("/student/")({
  component: StudentDashboard,
});

function StudentDashboard() {
  const { t, lang, dir } = useI18n();
  const Arrow = dir === "rtl" ? ChevronLeft : ChevronRight;
  const n = (fa: string, en: string | number) => (lang === "fa" ? fa : String(en));

  const todayPlan = [
    { id: 1, title: lang === "fa" ? "تعریف تابع و دامنه" : "Functions & domain", subject: lang === "fa" ? "ریاضی • فصل ۲" : "Math • Ch. 2", duration: n("۱۰′", "10m"), status: "done" as const },
    { id: 2, title: lang === "fa" ? "قانون اول نیوتن" : "Newton's first law", subject: lang === "fa" ? "فیزیک • فصل ۳" : "Physics • Ch. 3", duration: n("۱۵′", "15m"), status: "done" as const },
    { id: 3, title: lang === "fa" ? "حل معادله درجه دوم" : "Quadratic equations", subject: lang === "fa" ? "ریاضی • فصل ۲" : "Math • Ch. 2", duration: n("۱۲′", "12m"), status: "active" as const },
    { id: 4, title: lang === "fa" ? "ساختار اتم" : "Atomic structure", subject: lang === "fa" ? "شیمی • فصل ۱" : "Chemistry • Ch. 1", duration: n("۱۰′", "10m"), status: "todo" as const },
    { id: 5, title: lang === "fa" ? "زمان حال کامل" : "Present perfect tense", subject: lang === "fa" ? "زبان • درس ۴" : "English • Unit 4", duration: n("۸′", "8m"), status: "todo" as const },
  ];

  const mastery = [
    { subject: lang === "fa" ? "ریاضی" : "Math", value: 78 },
    { subject: lang === "fa" ? "فیزیک" : "Physics", value: 64 },
    { subject: lang === "fa" ? "شیمی" : "Chemistry", value: 52 },
    { subject: lang === "fa" ? "زبان انگلیسی" : "English", value: 86 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <Card className="border-0 overflow-hidden bg-[image:var(--gradient-primary)] text-primary-foreground">
        <CardContent className="p-6 md:p-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <p className="text-xs/relaxed opacity-80 truncate">{t("hello_user", { name: lang === "fa" ? "آرمین" : "Armin" })}</p>
            <h1 className="text-2xl md:text-3xl font-bold mt-1">{t("hero_title")}</h1>
            <p className="mt-2 text-sm opacity-90">{t("hero_sub")}</p>
          </div>
          <Button size="lg" variant="secondary" className="rounded-full font-semibold shrink-0" asChild>
            <Link to="/student/daily">
              <span className="hidden sm:inline">{t("start_learning")}</span>
              <Arrow className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Trophy} label={t("total_xp")} value={n("۲٬۴۸۰", "2,480")} sub={t("today_delta", { n: n("۱۲۰", 120) })} tone="xp" />
        <StatCard icon={Flame} label={t("streak")} value={n("۱۲", 12)} sub={t("record_n", { n: n("۲۱", 21) })} tone="warning" />
        <StatCard icon={Target} label={t("mastered_microatoms")} value={n("۸۴", 84)} sub={t("out_of", { n: n("۱۲۰", 120) })} tone="success" />
        <StatCard icon={Clock} label={t("study_time_today")} value={n("۴۸′", "48m")} sub={t("goal_min", { n: n("۶۰", 60) })} tone="info" />
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FeatureCard to="/student/daily" icon={CalendarDays} titleKey="feat_daily_title" descKey="feat_daily_desc" metaKey="feat_daily_meta" accent="primary" />
        <FeatureCard to="/student/weekly" icon={CalendarRange} titleKey="feat_weekly_title" descKey="feat_weekly_desc" metaKey="feat_weekly_meta" accent="info" />
        <FeatureCard to="/student/homework" icon={NotebookPen} titleKey="feat_hw_title" descKey="feat_hw_desc" metaKey="feat_hw_meta" accent="warning" badgeKey="badge_new" />
        <FeatureCard to="/student/exams" icon={GraduationCap} titleKey="feat_exam_title" descKey="feat_exam_desc" metaKey="feat_exam_meta" accent="success" />
        <FeatureCard to="/student/progress" icon={TrendingUp} titleKey="feat_progress_title" descKey="feat_progress_desc" metaKey="feat_progress_meta" accent="primary" />
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" />
              {t("ai_suggest_title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{t("ai_suggest_body")}</p>
            <Button size="sm" className="rounded-full">{t("quick_practice")}</Button>
          </CardContent>
        </Card>
      </div>

      {/* Today + mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base flex items-center gap-2 min-w-0">
              <CalendarDays className="h-4 w-4 text-primary shrink-0" />
              <span className="truncate">{t("today_plan")}</span>
            </CardTitle>
            <Button variant="ghost" size="sm" asChild className="shrink-0">
              <Link to="/student/daily">
                {t("view_full")} <Arrow className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {todayPlan.map((tp) => <PlanRow key={tp.id} {...tp} />)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              {t("mastery_subjects")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mastery.map((m) => (
              <div key={m.subject} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{m.subject}</span>
                  <span className="text-muted-foreground">{lang === "fa" ? `${toFa(m.value)}٪` : `${m.value}%`}</span>
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

function toFa(n: number) {
  return n.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

function StatCard({
  icon: Icon, label, value, sub, tone,
}: {
  icon: React.ElementType; label: string; value: string; sub: string;
  tone: "xp" | "warning" | "success" | "info";
}) {
  const toneMap = {
    xp: "bg-xp/15 text-xp",
    warning: "bg-warning/15 text-warning",
    success: "bg-success/15 text-success",
    info: "bg-info/15 text-info",
  } as const;
  return (
    <Card className="hover-scale">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`h-10 w-10 shrink-0 rounded-xl grid place-items-center ${toneMap[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground truncate">{label}</p>
          <p className="text-lg font-bold leading-tight">{value}</p>
          <p className="text-[11px] text-muted-foreground truncate">{sub}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function FeatureCard({
  to, icon: Icon, titleKey, descKey, metaKey, accent, badgeKey,
}: {
  to: string; icon: React.ElementType;
  titleKey: TKey; descKey: TKey; metaKey: TKey;
  accent: "primary" | "info" | "warning" | "success";
  badgeKey?: TKey;
}) {
  const { t, dir } = useI18n();
  const Arrow = dir === "rtl" ? ChevronLeft : ChevronRight;
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
            {badgeKey && <Badge variant="secondary">{t(badgeKey)}</Badge>}
          </div>
          <div>
            <h3 className="font-semibold">{t(titleKey)}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t(descKey)}</p>
          </div>
          <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
            <span className="truncate">{t(metaKey)}</span>
            <Arrow className={`h-4 w-4 shrink-0 transition-transform ${dir === "rtl" ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function PlanRow({
  title, subject, duration, status,
}: {
  id: number; title: string; subject: string; duration: string;
  status: "done" | "active" | "todo";
}) {
  const { t } = useI18n();
  const Icon = status === "done" ? CheckCircle2 : PlayCircle;
  const tone = status === "done" ? "text-success" : status === "active" ? "text-primary" : "text-muted-foreground";
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card/50 hover:bg-accent/40 transition-colors">
      <Icon className={`h-5 w-5 shrink-0 ${tone}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{subject}</p>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">{duration}</span>
      {status === "active" && <Badge className="hidden sm:inline-flex">{t("in_progress")}</Badge>}
      {status === "done" && (
        <Badge variant="secondary" className="bg-success/15 text-success border-0 hidden sm:inline-flex">
          +40 XP
        </Badge>
      )}
    </div>
  );
}
