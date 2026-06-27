import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ScrollText,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Users,
  FileText,
  Stethoscope,
  ChevronLeft,
  Pill,
  Activity,
  Zap,
  Clock,
  BookOpen,
  Sparkles,
  HeartPulse,
  Target,
} from "lucide-react";

export const Route = createFileRoute("/supervisor/alerts")({
  component: GrowthRecipes,
});

const summary = [
  {
    label: "نسخه‌های فعال",
    value: "۱۸",
    icon: ScrollText,
    tone: "bg-violet-50 text-violet-600",
  },
  {
    label: "نیازمند پیگیری فوری",
    value: "۵",
    icon: AlertTriangle,
    tone: "bg-rose-50 text-rose-600",
  },
  {
    label: "نسخه‌های تکمیل‌شده",
    value: "۳۲",
    icon: CheckCircle2,
    tone: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "میانگین بهبود",
    value: "۲۴٪",
    icon: TrendingUp,
    tone: "bg-sky-50 text-sky-600",
  },
];

const alertCards = [
  {
    name: "آرمان محمدی",
    class: "یازدهم تجربی ۲",
    issue: "افت در تنفس سلولی",
    status: "نیازمند نسخه توربو",
    statusTone: "bg-violet-50 text-violet-700 border-violet-100",
    recommendation: "۲ دوز مطالعه + ۱ چکاب ساده",
    icon: Zap,
    iconTone: "bg-violet-100 text-violet-600",
    progress: 58,
    subject: "زیست‌شناسی",
    subjectTone: "bg-emerald-50 text-emerald-700",
  },
  {
    name: "نیکا رضایی",
    class: "یازدهم تجربی ۱",
    issue: "ضعف در معادله درجه دوم",
    status: "پیگیری دبیر",
    statusTone: "bg-amber-50 text-amber-700 border-amber-100",
    recommendation: "مرور درسنامه + ۱۰ تمرین هدفمند",
    icon: BookOpen,
    iconTone: "bg-amber-100 text-amber-600",
    progress: 64,
    subject: "ریاضی",
    subjectTone: "bg-sky-50 text-sky-700",
  },
  {
    name: "پارسا کریمی",
    class: "یازدهم تجربی ۳",
    issue: "کاهش دوز مطالعه هفتگی",
    status: "مراقبت سبک",
    statusTone: "bg-emerald-50 text-emerald-700 border-emerald-100",
    recommendation: "ثبت دوز روزانه تا پایان هفته",
    icon: HeartPulse,
    iconTone: "bg-emerald-100 text-emerald-600",
    progress: 71,
    subject: "عمومی",
    subjectTone: "bg-slate-100 text-slate-700",
  },
  {
    name: "سارا احمدی",
    class: "یازدهم تجربی ۴",
    issue: "خطای پرتکرار در الکتریسیته ساکن",
    status: "هشدار آموزشی",
    statusTone: "bg-rose-50 text-rose-700 border-rose-100",
    recommendation: "چکاب ترکیبی + جلسه کلینیک یادگیری",
    icon: AlertTriangle,
    iconTone: "bg-rose-100 text-rose-600",
    progress: 45,
    subject: "فیزیک",
    subjectTone: "bg-indigo-50 text-indigo-700",
  },
  {
    name: "امیرحسین کاظمی",
    class: "یازدهم تجربی ۲",
    issue: "ناپایداری در انجام ماموریت‌ها",
    status: "نیاز به همراهی",
    statusTone: "bg-sky-50 text-sky-700 border-sky-100",
    recommendation: "تقسیم ماموریت‌ها به دوزهای کوچک‌تر",
    icon: Target,
    iconTone: "bg-sky-100 text-sky-600",
    progress: 52,
    subject: "عمومی",
    subjectTone: "bg-slate-100 text-slate-700",
  },
];

function SummaryCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: typeof ScrollText;
  tone: string;
}) {
  return (
    <Card className="rounded-2xl border-slate-100 shadow-sm bg-white">
      <CardContent className="p-4 flex items-center gap-3" dir="rtl">
        <div className={`h-11 w-11 rounded-2xl grid place-items-center ${tone}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 text-right">
          <p className="text-[11px] text-slate-500">{label}</p>
          <p className="text-lg font-extrabold text-slate-800 leading-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function GrowthRecipes() {
  return (
    <div className="space-y-5" dir="rtl">
      {/* Header */}
      <Card className="rounded-3xl border-0 shadow-sm bg-white">
        <CardContent className="p-6 md:p-7 flex flex-col md:flex-row md:items-center gap-4 text-right">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-800">
              نسخه‌های رشد
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              دانش‌آموزانی که نیاز به پیگیری، حمایت آموزشی یا نسخه توربو دارند.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="rounded-full bg-violet-50 text-violet-700 border-0 px-3 py-1">
              <Stethoscope className="h-3 w-3 ml-1" /> ۵ مورد نیازمند پیگیری
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {summary.map((s) => (
          <SummaryCard key={s.label} {...s} />
        ))}
      </div>

      {/* Alert cards */}
      <div className="grid lg:grid-cols-2 gap-4">
        {alertCards.map((card) => (
          <Card
            key={card.name}
            className="rounded-3xl border-slate-100 shadow-sm bg-white"
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div
                  className={`h-12 w-12 rounded-2xl grid place-items-center shrink-0 ${card.iconTone}`}
                >
                  <card.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 justify-end">
                    <Badge className={`rounded-full border ${card.statusTone}`}>
                      {card.status}
                    </Badge>
                    <span className="text-sm font-bold text-slate-800">
                      {card.name}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 justify-end mt-1">
                    <Badge className={`rounded-full border-0 ${card.subjectTone}`}>
                      {card.subject}
                    </Badge>
                    <span className="text-xs text-slate-500">{card.class}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-2xl bg-slate-50/60">
                <div className="flex items-center gap-2 text-right mb-2">
                  <Activity className="h-4 w-4 text-rose-500" />
                  <span className="text-sm font-semibold text-slate-700">
                    نگرانی آموزشی:
                  </span>
                  <span className="text-sm text-slate-600">{card.issue}</span>
                </div>
                <div className="flex items-start gap-2 text-right">
                  <Pill className="h-4 w-4 text-violet-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">نسخه پیشنهادی:</p>
                    <p className="text-sm font-medium text-slate-700">
                      {card.recommendation}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">روند بهبود</span>
                  <span className="font-semibold text-slate-700">{card.progress}٪</span>
                </div>
                <Progress value={card.progress} className="h-2 bg-slate-100" />
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                >
                  <FileText className="h-3.5 w-3.5 ml-1" />
                  مشاهده پرونده
                </Button>
                <Button
                  size="sm"
                  className="flex-1 rounded-full bg-violet-600 hover:bg-violet-700 text-white"
                >
                  <Sparkles className="h-3.5 w-3.5 ml-1" />
                  ساخت نسخه
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick insight */}
      <Card className="rounded-3xl border-success/30 bg-emerald-50/40 shadow-sm">
        <CardContent className="p-5 flex items-start gap-3" dir="rtl">
          <div className="h-10 w-10 rounded-2xl bg-emerald-100 grid place-items-center text-emerald-600 shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div className="flex-1 text-right">
            <p className="text-sm font-bold text-slate-800">توصیه هفتگی نسخه‌ها</p>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              ۵ دانش‌آموز در این هفته نیاز به پیگیری فوری دارند. پیشنهاد می‌شود برای موارد
              با روند بهبود زیر ۶۰٪، نسخه توربو یا جلسه کلینیک یادگیری ثبت شود.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
