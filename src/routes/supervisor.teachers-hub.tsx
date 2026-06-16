import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Sparkles, NotebookPen, CheckCircle2 } from "lucide-react";
import { teacherNotes, type TeacherNote } from "@/lib/supervisor-mock";

export const Route = createFileRoute("/supervisor/teachers-hub")({
  component: TeachersHub,
});

const statusMap: Record<TeacherNote["status"], { label: string; cls: string }> = {
  new: { label: "تازه", cls: "bg-info/15 text-info border-info/30" },
  in_progress: { label: "در حال بررسی", cls: "bg-primary/15 text-primary border-primary/30" },
  resolved: { label: "به نتیجه رسید", cls: "bg-success/15 text-success border-success/30" },
};

function TeachersHub() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" /> ارتباط با دبیران
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          مرکز همکاری آموزشی — پیشنهادها، یادداشت‌ها و پیگیری‌های مشترک
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-info/10 text-info grid place-items-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">پیشنهادهای تازه</p>
              <p className="text-xl font-bold">۱</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
              <NotebookPen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">در حال بررسی</p>
              <p className="text-xl font-bold">۱</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-success/10 text-success grid place-items-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">به نتیجه رسیده</p>
              <p className="text-xl font-bold">۱</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-semibold">پیشنهادها و یادداشت‌های دبیران</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {teacherNotes.map((n) => (
            <Card key={n.id} className="hover:shadow-md transition">
              <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {n.teacher.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <CardTitle className="text-base truncate">{n.teacher}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {n.subject} • {n.topic}
                    </p>
                  </div>
                </div>
                <Badge className={`${statusMap[n.status].cls} border shrink-0`}>
                  {statusMap[n.status].label}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm leading-relaxed">{n.note}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{n.date}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="rounded-full">
                      ثبت پاسخ آموزشی
                    </Button>
                    <Button size="sm" variant="ghost" className="rounded-full">
                      علامت‌گذاری
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="bg-muted/40 border-dashed">
        <CardContent className="p-4 text-sm text-muted-foreground">
          این بخش برای همکاری آموزشی طراحی شده است. به جای گفتگوی آزاد، روی کارت‌های یادداشت و وضعیت پیگیری تمرکز می‌کنیم.
        </CardContent>
      </Card>
    </div>
  );
}
