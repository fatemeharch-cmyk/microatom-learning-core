import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  HeartPulse,
  Stethoscope,
  ClipboardList,
  CalendarCheck2,
  ScrollText,
  Bell,
  Activity,
  Pill,
  Microscope,
  Sparkles,
  ChevronLeft,
  Syringe,
} from "lucide-react";

export const Route = createFileRoute("/student/")({
  component: TodayPage,
});

const upcomingCheckups = [
  { title: "چکاپ زیست — فصل ۲", date: "شنبه ۱۰:۰۰", tag: "زیست‌شناسی", tone: "from-rose-400/20 to-pink-400/10 text-rose-600" },
  { title: "چکاپ شیمی — استوکیومتری", date: "دوشنبه ۸:۳۰", tag: "شیمی", tone: "from-violet-400/20 to-fuchsia-400/10 text-violet-600" },
  { title: "چکاپ ریاضی — حد و پیوستگی", date: "چهارشنبه ۱۱:۰۰", tag: "ریاضی", tone: "from-sky-400/20 to-cyan-400/10 text-sky-600" },
];

const completedPrescriptions = [
  { title: "نسخه مرور تنفس سلولی", subject: "زیست", done: "دیروز" },
  { title: "نسخه تمرین مولاریته", subject: "شیمی", done: "۲ روز پیش" },
  { title: "نسخه ویدیو حرکت پرتابی", subject: "فیزیک", done: "۳ روز پیش" },
];

const medicalNews = [
  { title: "بروزرسانی پروتکل مطالعه زیست فصل ۲", tone: "info" },
  { title: "هشدار آموزشی: تمرین‌های شیمی فردا تحویل دارند", tone: "warning" },
  { title: "کلینیک یادگیری: تحلیل اشتباهات هفته آماده شد", tone: "primary" },
];

function TodayPage() {
  return (
    <div className="space-y-6" dir="rtl">
      {/* Greeting / Vitals header */}
      <Card className="overflow-hidden border-0 shadow-lg bg-[image:var(--gradient-primary)] text-primary-foreground">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4">
          <div className="h-14 w-14 shrink-0 rounded-2xl bg-white/15 grid place-items-center backdrop-blur">
            <Stethoscope className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <p className="text-xs opacity-80 mb-1">پرونده پزشکی آموزشی</p>
            <h1 className="text-xl md:text-2xl font-bold">سلام دکترِ آینده، آرمان عزیز 🩺</h1>
            <p className="text-sm md:text-base opacity-90 mt-1">
              امروز علائم حیاتی یادگیری‌ات سالم است. نسخه‌ی روزانه آماده‌ی اجراست.
            </p>
          </div>
          <Button asChild variant="secondary" size="lg" className="rounded-full shadow">
            <Link to="/student/next-step">
              شروع ویزیت امروز <ChevronLeft className="h-4 w-4 mr-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Vitals grid — 4 medical metaphor cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <VitalCard
          icon={HeartPulse}
          title="نبض عملکرد"
          value="۸۲٪"
          hint="ضربان یادگیری هفته"
          gradient="from-rose-100 to-pink-50"
          accent="text-rose-600"
          ring="ring-rose-200/60"
          progress={82}
        />
        <VitalCard
          icon={Microscope}
          title="تشخیص ضعف"
          value="۳ مفهوم"
          hint="نیازمند مراقبت بیشتر"
          gradient="from-violet-100 to-fuchsia-50"
          accent="text-violet-600"
          ring="ring-violet-200/60"
          progress={45}
        />
        <VitalCard
          icon={Pill}
          title="برنامه درمان"
          value="۵ نسخه"
          hint="فعال در این هفته"
          gradient="from-emerald-100 to-teal-50"
          accent="text-emerald-600"
          ring="ring-emerald-200/60"
          progress={60}
        />
        <VitalCard
          icon={CalendarCheck2}
          title="نتایج چکاپ"
          value="۱۷/۲۰"
          hint="آخرین چکاپ زیست"
          gradient="from-amber-100 to-orange-50"
          accent="text-orange-600"
          ring="ring-amber-200/60"
          progress={85}
        />
      </div>

      {/* Today's prescription */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-primary/20 shadow-sm overflow-hidden">
          <div className="h-1.5 bg-[image:var(--gradient-primary)]" />
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Syringe className="h-4 w-4 text-primary" />
              نسخه‌ی یادگیری امروز
            </CardTitle>
            <Badge variant="secondary" className="rounded-full">
              <Sparkles className="h-3 w-3 ml-1" />
              تجویز توربو
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl p-4 bg-gradient-to-br from-violet-50 to-sky-50 border border-violet-100">
              <p className="text-lg font-semibold text-violet-900">زیست‌شناسی — فصل ۲</p>
              <p className="text-sm text-violet-700/80 mt-1">واحد درمانی: تنفس سلولی</p>
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                <Badge className="bg-violet-100 text-violet-700 border-0 rounded-full">دُز: ۹۰–۱۲۰ دقیقه</Badge>
                <Badge className="bg-sky-100 text-sky-700 border-0 rounded-full">نوبت: عصر</Badge>
                <Badge className="bg-emerald-100 text-emerald-700 border-0 rounded-full">پیگیری: کوییز کوتاه</Badge>
              </div>
            </div>
            <Button asChild className="rounded-full">
              <Link to="/student/next-step">اجرای نسخه</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-mint-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-emerald-700">
              <Activity className="h-4 w-4" /> ویزیت منتور
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm font-medium text-emerald-900">امروز ساعت ۱۸:۰۰</p>
            <p className="text-sm text-emerald-700/80">پزشک یادگیری: استاد نوری</p>
            <Badge variant="outline" className="border-emerald-400/50 text-emerald-700 bg-white/60 rounded-full">
              یادآور فعال
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming checkups + Completed prescriptions + News */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Upcoming checkups */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarCheck2 className="h-4 w-4 text-info" /> چکاپ‌های آینده
            </CardTitle>
            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link to="/student/exams">همه نوبت‌ها</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingCheckups.map((c) => (
              <div
                key={c.title}
                className={`flex items-center justify-between p-4 rounded-2xl bg-gradient-to-l ${c.tone} border border-white/40`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/70 grid place-items-center backdrop-blur">
                    <HeartPulse className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{c.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">نوبت: {c.date}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="rounded-full bg-white/70">
                  {c.tag}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Completed prescriptions */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ScrollText className="h-4 w-4 text-success" /> نسخه‌های تکمیل شده
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {completedPrescriptions.map((p) => (
              <div
                key={p.title}
                className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100/60"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm text-emerald-900">{p.title}</p>
                    <p className="text-xs text-emerald-700/70 mt-1">{p.subject}</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 rounded-full text-[10px]">
                    {p.done}
                  </Badge>
                </div>
              </div>
            ))}
            <Button asChild variant="ghost" size="sm" className="w-full rounded-full">
              <Link to="/student/planner">آرشیو نسخه‌ها</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Medical news & alerts */}
      <Card className="shadow-sm border-0 bg-gradient-to-br from-sky-50 via-violet-50 to-rose-50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            اخبار و هشدارهای پزشکی آموزشی
          </CardTitle>
          <Badge variant="secondary" className="rounded-full bg-white/70">
            {medicalNews.length} مورد جدید
          </Badge>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-3">
          {medicalNews.map((n) => (
            <div
              key={n.title}
              className="p-4 rounded-2xl bg-white/70 backdrop-blur border border-white/60 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    n.tone === "warning"
                      ? "bg-warning"
                      : n.tone === "info"
                        ? "bg-info"
                        : "bg-primary"
                  }`}
                />
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  هشدار آموزشی
                </span>
              </div>
              <p className="text-sm font-medium leading-relaxed">{n.title}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function VitalCard({
  icon: Icon,
  title,
  value,
  hint,
  gradient,
  accent,
  ring,
  progress,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  hint: string;
  gradient: string;
  accent: string;
  ring: string;
  progress: number;
}) {
  return (
    <Card
      className={`relative overflow-hidden border-0 shadow-sm bg-gradient-to-br ${gradient} ring-1 ${ring}`}
    >
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className={`h-10 w-10 rounded-xl bg-white/70 grid place-items-center backdrop-blur ${accent}`}>
            <Icon className="h-5 w-5" />
          </div>
          <ClipboardList className={`h-4 w-4 opacity-40 ${accent}`} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{hint}</p>
        </div>
        <Progress value={progress} className="h-1.5 bg-white/60" />
      </CardContent>
    </Card>
  );
}
