import { createFileRoute } from "@tanstack/react-router";
import { User, School, Award, HeartPulse, CalendarDays, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/student/profile")({
  component: Profile,
});

function Profile() {
  return (
    <div className="space-y-6 max-w-3xl" dir="rtl">
      <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-br from-violet-50 via-sky-50 to-emerald-50">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="h-20 w-20 ring-4 ring-white shadow">
            <AvatarFallback className="bg-[image:var(--gradient-primary)] text-primary-foreground text-xl">آر</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-right">
            <p className="text-xs text-violet-700/80 mb-1">پروفایل پزشکی دانش‌آموز</p>
            <h1 className="text-xl font-bold">آرمین رضایی</h1>
            <p className="text-sm text-muted-foreground">پایه یازدهم • علوم تجربی</p>
            <div className="flex gap-2 mt-2 justify-center sm:justify-start flex-wrap">
              <Badge className="bg-emerald-100 text-emerald-700 border-0 rounded-full">وضعیت: سالم</Badge>
              <Badge className="bg-violet-100 text-violet-700 border-0 rounded-full">سطح ۸</Badge>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-0 rounded-full">۲٬۴۸۰ XP</Badge>
            </div>
          </div>
          <Button variant="outline" className="rounded-full bg-white/70">
            <Settings className="h-4 w-4" /> ویرایش
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">شرح حال</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Row icon={User} label="نام دانش‌آموز" value="آرمین رضایی" />
          <Row icon={School} label="پایه" value="یازدهم • علوم تجربی" />
          <Row icon={Award} label="سطح فعلی" value="سطح ۸ — برتر" />
          <Row icon={HeartPulse} label="امتیاز سلامتی آموزشی" value="۸۴۶" />
          <Row icon={CalendarDays} label="تاریخ ثبت مطالعه" value="۲۵ اردیبهشت ۱۴۰۴" />
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border bg-card/50">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-muted-foreground w-32 text-xs">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
