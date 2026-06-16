import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ListChecks, Plus, Target, Calendar } from "lucide-react";
import { followUps, type FollowUp } from "@/lib/supervisor-mock";

export const Route = createFileRoute("/supervisor/followups")({
  component: FollowUpsPage,
});

const statusMap: Record<FollowUp["status"], { label: string; cls: string }> = {
  open: { label: "آغاز شده", cls: "bg-info/15 text-info border-info/30" },
  in_progress: { label: "در حال پیگیری", cls: "bg-primary/15 text-primary border-primary/30" },
  completed: { label: "به نتیجه رسید", cls: "bg-success/15 text-success border-success/30" },
};

function FollowUpsPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ListChecks className="h-6 w-6 text-primary" /> پیگیری‌ها
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            اهداف فعال همراهی و نقاط پیگیری بعدی
          </p>
        </div>
        <Button className="rounded-full gap-1">
          <Plus className="h-4 w-4" /> پیگیری جدید
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {followUps.map((f) => (
          <Card key={f.id} className="hover:shadow-md transition">
            <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
                  <Target className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-base truncate">{f.goal}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">{f.studentName}</p>
                </div>
              </div>
              <Badge className={`${statusMap[f.status].cls} border shrink-0`}>
                {statusMap[f.status].label}
              </Badge>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> پیگیری بعدی: {f.nextDate}
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="rounded-full">یادداشت</Button>
                <Button size="sm" variant="ghost" className="rounded-full">به‌روزرسانی</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
