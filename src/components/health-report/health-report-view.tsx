import {
  Activity,
  Award,
  HeartPulse,
  Stethoscope,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldAlert,
  Sparkles,
  Timer,
  Trophy,
  Users,
  ClipboardList,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  demoHealthReport,
  formatMinutes,
  STATUS_LABELS,
  STATUS_STYLES,
  type HealthReport,
} from "@/lib/health-report/health-report-data";

type Audience = "student" | "parent";

interface Props {
  audience: Audience;
  report?: HealthReport;
}

export function HealthReportView({ audience, report = demoHealthReport }: Props) {
  const isParent = audience === "parent";
  const title = isParent
    ? "پرونده سلامت آموزشی فرزند شما"
    : "پرونده سلامت آموزشی من";
  const subtitle = isParent
    ? "خلاصه وضعیت یادگیری، چکاب‌ها، دوز مطالعه و مسیر رشد"
    : "خلاصه چکاب‌ها، نبض یادگیری و نسخه پیشنهادی شما";

  const TrendIcon =
    report.pulse.trend === "up"
      ? TrendingUp
      : report.pulse.trend === "down"
        ? TrendingDown
        : Minus;

  return (
    <div dir="rtl" className="font-vazir space-y-6">
      {/* Header */}
      <div className="rounded-2xl p-6 bg-[image:var(--gradient-primary)] text-primary-foreground shadow-md">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-xl bg-white/15 grid place-items-center shrink-0">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>
            <p className="text-sm text-primary-foreground/85 mt-1">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Top stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          icon={Award}
          label={isParent ? "نمره فرزند شما" : "نمره من"}
          value={`${report.myScore}`}
          hint="از ۱۰۰"
        />
        <StatCard
          icon={Users}
          label="میانگین کلاس"
          value={`${report.classAverage}`}
          hint="از ۱۰۰"
        />
        <StatCard
          icon={Trophy}
          label="بالاترین نمره"
          value={`${report.topScore}`}
          hint="از ۱۰۰"
        />
        <StatCard
          icon={Target}
          label={isParent ? "رتبه فرزند شما" : "رتبه من"}
          value={`${report.myRank}`}
          hint={`از ${report.classSize}`}
        />
        <StatCard
          icon={HeartPulse}
          label="نبض یادگیری"
          value={`${report.pulse.current}`}
          hint={report.pulse.label}
        />
        <StatCard
          icon={Timer}
          label="مجموع دوز مطالعه"
          value={formatMinutes(report.studyDose.weekMinutes)}
          hint="این هفته"
        />
      </div>

      {/* 1. Checkups */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardList className="h-4 w-4 text-primary" />
            نتایج چکاب‌ها
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground border-b">
                  <th className="text-right py-2 px-2 font-medium">درس</th>
                  <th className="text-right py-2 px-2 font-medium">مبحث</th>
                  <th className="text-right py-2 px-2 font-medium">نمره</th>
                  <th className="text-right py-2 px-2 font-medium">میانگین کلاس</th>
                  <th className="text-right py-2 px-2 font-medium">بالاترین</th>
                  <th className="text-right py-2 px-2 font-medium">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {report.checkups.map((c) => (
                  <tr key={c.id} className="border-b last:border-0">
                    <td className="py-3 px-2 font-medium">{c.subject}</td>
                    <td className="py-3 px-2 text-muted-foreground">{c.topic}</td>
                    <td className="py-3 px-2 font-semibold">{c.score}</td>
                    <td className="py-3 px-2 text-muted-foreground">{c.classAverage}</td>
                    <td className="py-3 px-2 text-muted-foreground">{c.topScore}</td>
                    <td className="py-3 px-2">
                      <Badge
                        variant="outline"
                        className={STATUS_STYLES[c.status]}
                      >
                        {STATUS_LABELS[c.status]}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 2. Learning pulse + 3. Study dose */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <HeartPulse className="h-4 w-4 text-primary" />
              نبض یادگیری
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-4xl font-bold text-primary">
                  {report.pulse.current}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  از ۱۰۰ — {report.pulse.label}
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm text-emerald-600">
                <TrendIcon className="h-4 w-4" />
                <span>
                  {report.pulse.weeklyDelta > 0 ? "+" : ""}
                  {report.pulse.weeklyDelta} این هفته
                </span>
              </div>
            </div>
            <Progress value={report.pulse.current} />
            <p className="text-xs text-muted-foreground leading-6">
              {isParent
                ? "نبض یادگیری، شاخصی از میزان درگیری و پیشرفت فرزند شما در روزهای اخیر است."
                : "این شاخص، ترکیبی از تمرین، چکاب و مطالعه فعال شما در روزهای اخیر است."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Timer className="h-4 w-4 text-primary" />
              دوز مطالعه
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DoseRow label="امروز" minutes={report.studyDose.todayMinutes} />
            <DoseRow
              label="این هفته"
              minutes={report.studyDose.weekMinutes}
              goal={report.studyDose.weeklyGoalMinutes}
            />
            <DoseRow label="این ماه" minutes={report.studyDose.monthMinutes} />
          </CardContent>
        </Card>
      </div>

      {/* 4 + 5. Strengths / Needs care */}
      <div className="grid gap-4 md:grid-cols-2">
        <ConceptList
          title="نقاط قوت"
          icon={Sparkles}
          tone="green"
          items={report.strengths}
        />
        <ConceptList
          title="نیاز به مراقبت"
          icon={ShieldAlert}
          tone="amber"
          items={report.needsCare}
        />
      </div>

      {/* 6. Active prescription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-4 w-4 text-primary" />
            نسخه پیشنهادی
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary">صادرکننده: {report.prescription.issuedBy}</Badge>
            <Badge variant="secondary">تاریخ: {report.prescription.issuedAt}</Badge>
          </div>
          <p className="text-sm leading-7">{report.prescription.summary}</p>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">ماموریت‌ها</p>
            <ul className="space-y-2">
              {report.prescription.missions.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between gap-3 rounded-lg border bg-card/50 p-3"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {m.done ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <span
                      className={
                        m.done
                          ? "text-sm text-muted-foreground line-through truncate"
                          : "text-sm truncate"
                      }
                    >
                      {m.title}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">
                    {m.dueLabel}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <Icon className="h-3.5 w-3.5" />
          <span className="truncate">{label}</span>
        </div>
        <div className="mt-2 text-2xl font-bold text-foreground">{value}</div>
        {hint && (
          <p className="text-[11px] text-muted-foreground mt-0.5">{hint}</p>
        )}
      </CardContent>
    </Card>
  );
}

function DoseRow({
  label,
  minutes,
  goal,
}: {
  label: string;
  minutes: number;
  goal?: number;
}) {
  const pct = goal ? Math.min(100, Math.round((minutes / goal) * 100)) : null;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{formatMinutes(minutes)}</span>
      </div>
      {pct !== null && (
        <>
          <Progress value={pct} />
          <p className="text-[11px] text-muted-foreground">
            {pct}% از هدف هفتگی ({formatMinutes(goal!)})
          </p>
        </>
      )}
    </div>
  );
}

function ConceptList({
  title,
  icon: Icon,
  tone,
  items,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: "green" | "amber";
  items: { id: string; title: string; subject: string; masteryPercent: number }[];
}) {
  const badgeClass =
    tone === "green"
      ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
      : "bg-amber-500/15 text-amber-600 border-amber-500/30";
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((it) => (
          <div key={it.id} className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{it.title}</p>
                <p className="text-xs text-muted-foreground truncate">{it.subject}</p>
              </div>
              <Badge variant="outline" className={badgeClass}>
                {it.masteryPercent}%
              </Badge>
            </div>
            <Progress value={it.masteryPercent} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
