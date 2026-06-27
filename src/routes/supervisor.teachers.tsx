import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  GraduationCap,
  BookOpenCheck,
  Stethoscope,
  AlertTriangle,
  FileText,
  MessageCircle,
} from "lucide-react";

export const Route = createFileRoute("/supervisor/teachers")({
  component: TeachersPage,
});

const summary = [
  { label: "تعداد دبیران", value: "۱۲", icon: GraduationCap, tint: "bg-sky-50 text-sky-600" },
  { label: "پوشش محتوا", value: "۸۱٪", icon: BookOpenCheck, tint: "bg-violet-50 text-violet-600" },
  { label: "چکاب‌های طراحی‌شده", value: "۳۶", icon: Stethoscope, tint: "bg-emerald-50 text-emerald-600" },
  { label: "نیازمند پیگیری", value: "۳", icon: AlertTriangle, tint: "bg-amber-50 text-amber-600" },
];

type Status = "عالی" | "قابل پیگیری" | "پایدار" | "نیازمند حمایت";

const statusCls: Record<Status, string> = {
  "عالی": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "قابل پیگیری": "bg-amber-50 text-amber-700 border-amber-200",
  "پایدار": "bg-sky-50 text-sky-700 border-sky-200",
  "نیازمند حمایت": "bg-rose-50 text-rose-700 border-rose-200",
};

const teachers: Array<{
  name: string;
  subject: string;
  coverage: number;
  growth: number;
  status: Status;
}> = [
  { name: "دکتر رضایی", subject: "زیست‌شناسی", coverage: 88, growth: 79, status: "عالی" },
  { name: "خانم احمدی", subject: "شیمی", coverage: 76, growth: 72, status: "قابل پیگیری" },
  { name: "آقای کریمی", subject: "فیزیک", coverage: 82, growth: 75, status: "پایدار" },
  { name: "خانم موسوی", subject: "ریاضی", coverage: 69, growth: 68, status: "نیازمند حمایت" },
];

function TeachersPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" /> دبیران
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          عملکرد دبیران، پوشش محتوا و وضعیت همراهی آموزشی
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summary.map((s) => (
          <Card key={s.label} className="rounded-2xl border-0 shadow-sm bg-white">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${s.tint}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className="text-xl font-bold">{s.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {teachers.map((t) => (
          <Card key={t.name} className="rounded-2xl border-0 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {t.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{t.name}</CardTitle>
                    <div className="text-xs text-muted-foreground mt-0.5">{t.subject}</div>
                  </div>
                </div>
                <Badge variant="outline" className={`rounded-full ${statusCls[t.status]}`}>
                  {t.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">پوشش محتوا</span>
                  <span className="font-medium">{toFa(t.coverage)}٪</span>
                </div>
                <Progress value={t.coverage} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">رشد کلاس‌ها</span>
                  <span className="font-medium">{toFa(t.growth)}٪</span>
                </div>
                <Progress value={t.growth} className="h-2" />
              </div>
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline" className="rounded-full gap-1">
                  <FileText className="h-4 w-4" /> مشاهده گزارش
                </Button>
                <Button size="sm" className="rounded-full gap-1">
                  <MessageCircle className="h-4 w-4" /> ارسال پیام
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function toFa(n: number) {
  return n.toLocaleString("fa-IR");
}
