import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sun,
  Clock,
  BookOpen,
  NotebookPen,
  GraduationCap,
  Users,
  ChevronLeft,
} from "lucide-react";

export const Route = createFileRoute("/student/")({
  component: TodayPage,
});

const schedule = [
  { period: "زنگ ۱", subject: "زیست‌شناسی", teacher: "خانم رضایی", time: "۸:۰۰" },
  { period: "زنگ ۲", subject: "ریاضی", teacher: "آقای محمدی", time: "۹:۰۰" },
  { period: "زنگ ۳", subject: "شیمی", teacher: "خانم کریمی", time: "۱۰:۱۵" },
  { period: "زنگ ۴", subject: "فیزیک", teacher: "آقای احمدی", time: "۱۱:۱۵" },
];

function TodayPage() {
  return (
    <div className="space-y-6" dir="rtl">
      {/* Greeting */}
      <Card className="overflow-hidden border-0 bg-[image:var(--gradient-primary)] text-primary-foreground">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-white/15 grid place-items-center">
            <Sun className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">سلام آرمان عزیز 👋</h1>
            <p className="text-sm md:text-base opacity-90 mt-1">
              یک روز تازه برای یک گام تازه. توربو مسیر امروزت را آماده کرده است.
            </p>
          </div>
          <Button asChild variant="secondary" size="lg" className="rounded-full">
            <Link to="/student/next-step">
              شروع گام بعدی <ChevronLeft className="h-4 w-4 mr-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Next step */}
        <Card className="lg:col-span-2 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" /> گام یادگیری بعدی
            </CardTitle>
            <Badge variant="secondary">پیشنهاد توربو</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-lg font-semibold">زیست‌شناسی — فصل ۲</p>
              <p className="text-sm text-muted-foreground">واحد یادگیری: تنفس سلولی</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span>بازه پیشنهادی مطالعه: ۹۰ تا ۱۲۰ دقیقه</span>
            </div>
            <Button asChild className="rounded-full">
              <Link to="/student/next-step">مشاهده مراحل</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Mentoring */}
        <Card className="bg-accent/30 border-accent">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> جلسه منتورینگ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">امروز ساعت ۱۸:۰۰</p>
            <p className="text-sm text-muted-foreground">با منتور: استاد نوری</p>
            <Badge variant="outline" className="border-primary/40 text-primary">
              یادآور فعال
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Today's schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-info" /> برنامه مدرسه امروز
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {schedule.map((s) => (
              <div
                key={s.period}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/40"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="rounded-lg">
                    {s.period}
                  </Badge>
                  <div>
                    <p className="font-medium">{s.subject}</p>
                    <p className="text-xs text-muted-foreground">{s.teacher}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{s.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active homework + upcoming exam */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <NotebookPen className="h-4 w-4 text-success" /> تکالیف فعال
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-3 rounded-xl bg-muted/40">
                <p className="font-medium text-sm">حل تمرین‌های فصل ۲ ریاضی</p>
                <p className="text-xs text-muted-foreground mt-1">مهلت: فردا</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/40">
                <p className="font-medium text-sm">گزارش آزمایش شیمی</p>
                <p className="text-xs text-muted-foreground mt-1">مهلت: ۳ روز دیگر</p>
              </div>
              <Button asChild variant="ghost" size="sm" className="w-full">
                <Link to="/student/homework">مشاهده همه</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-info/30">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-info" /> آزمون پیش رو
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="font-medium">آزمون جامع فیزیک</p>
              <p className="text-sm text-muted-foreground">شنبه، ساعت ۱۰:۰۰</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
