import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeartHandshake, Clock, FileText, ArrowRight } from "lucide-react";
import { mentoringMeetings, type MentoringMeeting } from "@/lib/parent-mock";

export const Route = createFileRoute("/parent/meetings")({
  component: MeetingsPage,
});

const typeMap: Record<MentoringMeeting["type"], string> = {
  student: "جلسه دانش‌آموز",
  parent: "ملاقات والدین",
};

function MeetingCard({ m }: { m: MentoringMeeting }) {
  return (
    <Card className="hover:shadow-md transition">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="text-base">{typeMap[m.type]}</CardTitle>
          <p className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {m.date} • {m.time} • با {m.with}
          </p>
        </div>
        <Badge
          className={
            m.status === "upcoming"
              ? "bg-primary/15 text-primary border-primary/30 border"
              : "bg-success/15 text-success border-success/30 border"
          }
        >
          {m.status === "upcoming" ? "پیش رو" : "انجام شد"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {m.summary && (
          <div className="p-3 rounded-xl bg-muted/40 flex gap-2">
            <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">خلاصه جلسه</p>
              <p className="text-sm">{m.summary}</p>
            </div>
          </div>
        )}
        {m.followUp && (
          <div className="p-3 rounded-xl bg-accent/30 flex gap-2">
            <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">گام بعدی</p>
              <p className="text-sm">{m.followUp}</p>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="rounded-full">جزئیات</Button>
          {m.status === "upcoming" && (
            <Button size="sm" variant="ghost" className="rounded-full">یادآور</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MeetingsPage() {
  const upcoming = mentoringMeetings.filter((m) => m.status === "upcoming");
  const past = mentoringMeetings.filter((m) => m.status === "completed");

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <HeartHandshake className="h-6 w-6 text-primary" /> جلسات همراهی
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          جلسات پیش رو و خلاصه جلسات گذشته با منتور
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">جلسات پیش رو</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {upcoming.map((m) => <MeetingCard key={m.id} m={m} />)}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">جلسات گذشته</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {past.map((m) => <MeetingCard key={m.id} m={m} />)}
        </div>
      </section>

      <Card className="bg-muted/40 border-dashed">
        <CardContent className="p-4 text-sm text-muted-foreground">
          یادداشت‌های خصوصی مشاوره‌ای در این صفحه نمایش داده نمی‌شوند. فقط خلاصه‌های آموزشی و گام‌های بعدی مشترک قابل مشاهده هستند.
        </CardContent>
      </Card>
    </div>
  );
}
