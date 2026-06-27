import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  UserCircle2,
  Send,
  PhoneCall,
  HeartHandshake,
  FileText,
  MessageCircle,
} from "lucide-react";

export const Route = createFileRoute("/supervisor/parents")({
  component: ParentsPage,
});

const summary = [
  { label: "اولیای فعال", value: "۹۴", icon: UserCircle2, tint: "bg-sky-50 text-sky-600" },
  { label: "گزارش‌های ارسال‌شده", value: "۴۸", icon: Send, tint: "bg-violet-50 text-violet-600" },
  { label: "نیازمند تماس", value: "۷", icon: PhoneCall, tint: "bg-amber-50 text-amber-600" },
  { label: "همراهی خانوادگی", value: "۷۳٪", icon: HeartHandshake, tint: "bg-emerald-50 text-emerald-600" },
];

type Status = "نیازمند تماس" | "پیگیری سبک" | "هشدار" | "مثبت";

const statusCls: Record<Status, string> = {
  "نیازمند تماس": "bg-amber-50 text-amber-700 border-amber-200",
  "پیگیری سبک": "bg-sky-50 text-sky-700 border-sky-200",
  "هشدار": "bg-rose-50 text-rose-700 border-rose-200",
  "مثبت": "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const parents: Array<{
  name: string;
  topic: string;
  status: Status;
  suggestion: string;
}> = [
  { name: "ولی آرمان محمدی", topic: "افت در زیست", status: "نیازمند تماس", suggestion: "ارسال گزارش هفتگی" },
  { name: "ولی نیکا رضایی", topic: "کاهش دوز مطالعه", status: "پیگیری سبک", suggestion: "پیام انگیزشی" },
  { name: "ولی پارسا کریمی", topic: "غیبت در چکاب", status: "هشدار", suggestion: "تماس مسئول پایه" },
  { name: "ولی سارا احمدی", topic: "پیشرفت خوب", status: "مثبت", suggestion: "ارسال بازخورد تشویقی" },
];

function ParentsPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UserCircle2 className="h-6 w-6 text-primary" /> اولیا
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          وضعیت ارتباط با خانواده‌ها و گزارش‌های هفتگی
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
        {parents.map((p) => (
          <Card key={p.name} className="rounded-2xl border-0 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">{p.name}</CardTitle>
                <Badge variant="outline" className={`rounded-full ${statusCls[p.status]}`}>
                  {p.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <span className="text-muted-foreground">موضوع: </span>
                <span className="font-medium">{p.topic}</span>
              </div>
              <div className="text-sm rounded-xl bg-violet-50/60 text-violet-800 p-3">
                <span className="text-xs text-violet-700">پیشنهاد توربو همراه: </span>
                {p.suggestion}
              </div>
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline" className="rounded-full gap-1">
                  <FileText className="h-4 w-4" /> مشاهده پرونده
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
