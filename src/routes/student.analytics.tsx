import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, TrendingUp, BookOpen, Clock, FileCheck, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LineChartCard } from "@/components/analytics/line-chart-card";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/student/analytics")({
  component: PersonalAnalyticsPage,
});

/* ------------------------------------------------------------------ */
// Placeholder data — will be replaced by real analytics logic later

const dailyLabels = ["۰۶:۰۰", "۰۸:۰۰", "۱۰:۰۰", "۱۲:۰۰", "۱۴:۰۰", "۱۶:۰۰", "۱۸:۰۰", "۲۰:۰۰", "۲۲:۰۰"];
const weeklyLabels = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];
const enDailyLabels = ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
const enWeeklyLabels = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

function makeData(labels: string[], values: number[]) {
  return labels.map((label, i) => ({ label, value: values[i] ?? 0 }));
}

function makeDualData(labels: string[], v1: number[], v2: number[]) {
  return labels.map((label, i) => ({ label, completed: v1[i] ?? 0, total: v2[i] ?? 0 }));
}

const dailyExam = makeData(dailyLabels, [0, 12, 45, 60, 30, 0, 0, 20, 0]);
const weeklyExam = makeData(weeklyLabels, [65, 72, 58, 80, 45, 90, 0]);

const dailyHw = makeDualData(dailyLabels, [2, 1, 3, 0, 2, 1, 0, 1, 0], [3, 2, 3, 1, 2, 2, 1, 1, 0]);
const weeklyHw = makeDualData(weeklyLabels, [5, 4, 6, 3, 5, 4, 0], [6, 5, 6, 4, 5, 5, 1]);

const dailyStudy = makeData(dailyLabels, [0, 45, 60, 30, 90, 45, 0, 20, 0]);
const weeklyStudy = makeData(weeklyLabels, [120, 180, 150, 200, 90, 60, 0]);

const dailyMastery = makeData(dailyLabels, [12, 14, 18, 22, 25, 28, 30, 32, 35]);
const weeklyMastery = makeData(weeklyLabels, [30, 35, 42, 48, 55, 60, 62]);

const enDailyExam = makeData(enDailyLabels, [0, 12, 45, 60, 30, 0, 0, 20, 0]);
const enWeeklyExam = makeData(enWeeklyLabels, [65, 72, 58, 80, 45, 90, 0]);

const enDailyHw = makeDualData(enDailyLabels, [2, 1, 3, 0, 2, 1, 0, 1, 0], [3, 2, 3, 1, 2, 2, 1, 1, 0]);
const enWeeklyHw = makeDualData(enWeeklyLabels, [5, 4, 6, 3, 5, 4, 0], [6, 5, 6, 4, 5, 5, 1]);

const enDailyStudy = makeData(enDailyLabels, [0, 45, 60, 30, 90, 45, 0, 20, 0]);
const enWeeklyStudy = makeData(enWeeklyLabels, [120, 180, 150, 200, 90, 60, 0]);

const enDailyMastery = makeData(enDailyLabels, [12, 14, 18, 22, 25, 28, 30, 32, 35]);
const enWeeklyMastery = makeData(enWeeklyLabels, [30, 35, 42, 48, 55, 60, 62]);

/* ------------------------------------------------------------------ */

function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  colorClass,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  delta: string;
  colorClass: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon className={`h-4 w-4 ${colorClass}`} />
          {label}
        </div>
        <p className="text-3xl font-extrabold mt-2">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{delta}</p>
      </CardContent>
    </Card>
  );
}

function PersonalAnalyticsPage() {
  const { t, lang } = useI18n();
  const fa = lang === "fa";

  const examData = fa ? { daily: dailyExam, weekly: weeklyExam } : { daily: enDailyExam, weekly: enWeeklyExam };
  const hwData = fa ? { daily: dailyHw, weekly: weeklyHw } : { daily: enDailyHw, weekly: enWeeklyHw };
  const studyData = fa ? { daily: dailyStudy, weekly: weeklyStudy } : { daily: enDailyStudy, weekly: enWeeklyStudy };
  const masteryData = fa
    ? { daily: dailyMastery, weekly: weeklyMastery }
    : { daily: enDailyMastery, weekly: enWeeklyMastery };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <Badge variant="secondary" className="mb-2">
          <BarChart3 className="h-3 w-3 mx-1" />
          {t("analytics_badge")}
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight">{t("analytics_title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("analytics_subtitle")}</p>
      </div>

      {/* Stat overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={TrendingUp}
          label={t("stat_exam_avg")}
          value="۷۲٪"
          delta={fa ? "+۵٪ نسبت به هفته قبل" : "+5% vs last week"}
          colorClass="text-primary"
        />
        <StatCard
          icon={FileCheck}
          label={t("stat_hw_rate")}
          value="۸۵٪"
          delta={fa ? "۱۲ از ۱۴ تکلیف این هفته" : "12 of 14 this week"}
          colorClass="text-success"
        />
        <StatCard
          icon={Clock}
          label={t("stat_study_time")}
          value="۱۴۵ دوز"
          delta={fa ? "میانگین روزانه" : "Daily average"}
          colorClass="text-info"
        />
        <StatCard
          icon={BookOpen}
          label={t("stat_mastery")}
          value="۶۲ اتم‌بیت"
          delta={fa ? "+۸ اتم‌بیت این هفته" : "+8 AtomBits this week"}
          colorClass="text-warning"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full max-w-xs grid-cols-2">
          <TabsTrigger value="daily">{t("tab_daily")}</TabsTrigger>
          <TabsTrigger value="weekly">{t("tab_weekly")}</TabsTrigger>
        </TabsList>

        {/* Daily */}
        <TabsContent value="daily" className="space-y-4 mt-4">
          <div className="grid lg:grid-cols-2 gap-4">
            <LineChartCard
              title={fa ? "روند نمرات آزمون (امروز)" : "Exam Score Trend (Today)"}
              data={examData.daily}
              lines={[{ key: "value", color: "var(--color-primary)", name: fa ? "نمره" : "Score" }]}
              yUnit="%"
            />
            <LineChartCard
              title={fa ? "تکالیف (امروز)" : "Homework (Today)"}
              data={hwData.daily}
              lines={[
                { key: "completed", color: "var(--color-success)", name: fa ? "انجام‌شده" : "Completed" },
                { key: "total", color: "var(--color-muted-foreground)", name: fa ? "کل" : "Total" },
              ]}
            />
            <LineChartCard
              title={fa ? "دوز مطالعه (امروز)" : "Study Time (Today)"}
              data={studyData.daily}
              lines={[{ key: "value", color: "var(--color-info)", name: fa ? "دوز" : "Minutes" }]}
              yUnit="'"
            />
            <LineChartCard
              title={fa ? "رشد اتم‌بیت‌ها (امروز)" : "AtomBit Growth (Today)"}
              data={masteryData.daily}
              lines={[{ key: "value", color: "var(--color-warning)", name: fa ? "اتم‌بیت" : "AtomBits" }]}
            />
          </div>
        </TabsContent>

        {/* Weekly */}
        <TabsContent value="weekly" className="space-y-4 mt-4">
          <div className="grid lg:grid-cols-2 gap-4">
            <LineChartCard
              title={fa ? "روند نمرات آزمون (هفتگی)" : "Exam Score Trend (Weekly)"}
              data={examData.weekly}
              lines={[{ key: "value", color: "var(--color-primary)", name: fa ? "نمره" : "Score" }]}
              yUnit="%"
            />
            <LineChartCard
              title={fa ? "تکالیف (هفتگی)" : "Homework (Weekly)"}
              data={hwData.weekly}
              lines={[
                { key: "completed", color: "var(--color-success)", name: fa ? "انجام‌شده" : "Completed" },
                { key: "total", color: "var(--color-muted-foreground)", name: fa ? "کل" : "Total" },
              ]}
            />
            <LineChartCard
              title={fa ? "دوز مطالعه (هفتگی)" : "Study Time (Weekly)"}
              data={studyData.weekly}
              lines={[{ key: "value", color: "var(--color-info)", name: fa ? "دوز" : "Minutes" }]}
              yUnit="'"
            />
            <LineChartCard
              title={fa ? "رشد اتم‌بیت‌ها (هفتگی)" : "AtomBit Growth (Weekly)"}
              data={masteryData.weekly}
              lines={[{ key: "value", color: "var(--color-warning)", name: fa ? "اتم‌بیت" : "AtomBits" }]}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Recommendations placeholder */}
      <Card className="border-primary/40 bg-primary/5">
        <CardContent className="p-5 flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground grid place-items-center shrink-0">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">{t("ai_recommendations")}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {fa
                ? "توصیه‌های توربو بر اساس داده‌های تحلیلی شما به‌زودی در اینجا نمایش داده می‌شود."
                : "Personalized Turbo Recommendations from the Turbo Engine will appear here soon."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
