import { createFileRoute } from "@tanstack/react-router";
import { NotebookPen, Clock, AlertCircle, CheckCircle2, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/student/homework")({
  component: Homework,
});

type HW = {
  id: number;
  title: string;
  subject: string;
  teacher: string;
  due: string;
  status: "pending" | "submitted" | "overdue" | "graded";
  score?: string;
};

const list: HW[] = [
  { id: 1, title: "تمرین‌های صفحه ۸۴ ریاضی", subject: "ریاضی", teacher: "خانم احمدی", due: "امروز ۲۰:۰۰", status: "pending" },
  { id: 2, title: "گزارش آزمایش پاندول", subject: "فیزیک", teacher: "آقای رضایی", due: "فردا ۲۳:۵۹", status: "pending" },
  { id: 3, title: "ترجمه درس ۴", subject: "زبان", teacher: "خانم کریمی", due: "دیروز", status: "overdue" },
  { id: 4, title: "خلاصه فصل ۱ شیمی", subject: "شیمی", teacher: "آقای موسوی", due: "۱۷ خرداد", status: "submitted" },
  { id: 5, title: "انشای آزاد", subject: "ادبیات", teacher: "خانم نوری", due: "۱۵ خرداد", status: "graded", score: "۱۸/۲۰" },
];

function Homework() {
  const counts = {
    all: list.length,
    pending: list.filter((h) => h.status === "pending").length,
    overdue: list.filter((h) => h.status === "overdue").length,
    done: list.filter((h) => h.status === "submitted" || h.status === "graded").length,
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-warning/15 text-warning grid place-items-center">
          <NotebookPen className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">مرکز تکالیف</h1>
          <p className="text-sm text-muted-foreground">همه تکالیف معلم‌هات در یک جا</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MiniStat label="کل" value={counts.all} />
        <MiniStat label="در انتظار" value={counts.pending} tone="info" />
        <MiniStat label="تأخیر" value={counts.overdue} tone="destructive" />
        <MiniStat label="انجام شده" value={counts.done} tone="success" />
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">همه</TabsTrigger>
          <TabsTrigger value="pending">در انتظار</TabsTrigger>
          <TabsTrigger value="overdue">تأخیری</TabsTrigger>
          <TabsTrigger value="done">انجام شده</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-3 mt-4">
          {list.map((h) => <HWRow key={h.id} hw={h} />)}
        </TabsContent>
        <TabsContent value="pending" className="space-y-3 mt-4">
          {list.filter((h) => h.status === "pending").map((h) => <HWRow key={h.id} hw={h} />)}
        </TabsContent>
        <TabsContent value="overdue" className="space-y-3 mt-4">
          {list.filter((h) => h.status === "overdue").map((h) => <HWRow key={h.id} hw={h} />)}
        </TabsContent>
        <TabsContent value="done" className="space-y-3 mt-4">
          {list.filter((h) => h.status === "submitted" || h.status === "graded").map((h) => <HWRow key={h.id} hw={h} />)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MiniStat({
  label,
  value,
  tone = "muted",
}: {
  label: string;
  value: number;
  tone?: "muted" | "info" | "destructive" | "success";
}) {
  const toneMap = {
    muted: "text-foreground",
    info: "text-info",
    destructive: "text-destructive",
    success: "text-success",
  } as const;
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-2xl font-bold ${toneMap[tone]}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function HWRow({ hw }: { hw: HW }) {
  const statusBadge = {
    pending: <Badge variant="secondary" className="bg-info/15 text-info border-0">در انتظار</Badge>,
    overdue: <Badge variant="secondary" className="bg-warning/15 text-warning border-0">فرصت تکمیل</Badge>,
    submitted: <Badge variant="secondary" className="bg-success/15 text-success border-0">تحویل شده</Badge>,
    graded: <Badge variant="secondary" className="bg-success/15 text-success border-0">نمره: {hw.score}</Badge>,
  }[hw.status];

  const Icon = hw.status === "overdue" ? AlertCircle : hw.status === "pending" ? Clock : CheckCircle2;
  const iconTone =
    hw.status === "overdue"
      ? "text-destructive"
      : hw.status === "pending"
        ? "text-info"
        : "text-success";

  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <Icon className={`h-5 w-5 shrink-0 ${iconTone}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold truncate">{hw.title}</h3>
            {statusBadge}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {hw.subject} • {hw.teacher} • مهلت: {hw.due}
          </p>
        </div>
        {(hw.status === "pending" || hw.status === "overdue") && (
          <Button size="sm" className="rounded-full">
            <Upload className="h-4 w-4" /> ارسال
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
