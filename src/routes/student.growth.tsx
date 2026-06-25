import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sprout, Flame, CheckCircle2, Repeat, PencilLine } from "lucide-react";

export const Route = createFileRoute("/student/growth")({
  component: GrowthPage,
});

const stats = [
  { icon: CheckCircle2, label: "فعالیت‌های یادگیری کامل شده", value: "۴۸", cls: "text-success" },
  { icon: Repeat, label: "مباحث مرور شده", value: "۲۳", cls: "text-info" },
  { icon: PencilLine, label: "تست‌های تمرین شده", value: "۱۸۲", cls: "text-primary" },
  { icon: Flame, label: "تداوم یادگیری", value: "۱۲ روز", cls: "text-warning" },
];

const subjects = [
  { name: "زیست‌شناسی", value: 78 },
  { name: "ریاضی", value: 64 },
  { name: "شیمی", value: 70 },
  { name: "فیزیک", value: 58 },
];

const milestones = [
  { title: "تکمیل اولین واحد یادگیری", date: "۲ هفته پیش" },
  { title: "۷ روز تداوم یادگیری", date: "۱ هفته پیش" },
  { title: "تکمیل ۵۰ تست تمرینی", date: "۴ روز پیش" },
  { title: "رشد ۱۰٪ در میانگین چکاب‌ها", date: "دیروز" },
];

function GrowthPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sprout className="h-6 w-6 text-success" /> مسیر رشد من
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          هر گام، یک رشد تازه — این مسیر فقط مربوط به خودِ توست.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={i}>
              <CardContent className="p-5 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl bg-muted grid place-items-center ${s.cls}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">رشد بر حسب درس</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjects.map((s) => (
              <div key={s.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-muted-foreground">{s.value}٪</span>
                </div>
                <Progress value={s.value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">نقاط درخشان مسیر</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {milestones.map((m, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-success/15 text-success grid place-items-center shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{m.title}</p>
                    <p className="text-xs text-muted-foreground">{m.date}</p>
                  </div>
                  <Badge variant="outline" className="text-success border-success/30">
                    رشد
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
