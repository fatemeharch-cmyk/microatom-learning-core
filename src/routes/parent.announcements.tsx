import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, CalendarDays, Newspaper, MessageSquare, BookOpen } from "lucide-react";
import { announcements, type Announcement } from "@/lib/parent-mock";

export const Route = createFileRoute("/parent/announcements")({
  component: AnnouncementsPage,
});

const cats: Record<Announcement["category"], { label: string; icon: typeof CalendarDays; cls: string }> = {
  event: { label: "رویداد", icon: CalendarDays, cls: "bg-primary/10 text-primary" },
  news: { label: "خبر", icon: Newspaper, cls: "bg-info/10 text-info" },
  message: { label: "پیام", icon: MessageSquare, cls: "bg-accent text-accent-foreground" },
  education: { label: "آموزشی", icon: BookOpen, cls: "bg-success/10 text-success" },
};

function AnnouncementsPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Megaphone className="h-6 w-6 text-primary" /> اطلاعیه‌های مدرسه
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          اخبار، رویدادها و پیام‌های آموزشی برای خانواده‌ها
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {announcements.map((a) => {
          const meta = cats[a.category];
          const Icon = meta.icon;
          return (
            <Card key={a.id} className="hover:shadow-md transition">
              <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                <div className={`h-10 w-10 rounded-xl grid place-items-center shrink-0 ${meta.cls}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base truncate">{a.title}</CardTitle>
                    <Badge variant="outline" className="text-[10px] shrink-0">{a.date}</Badge>
                  </div>
                  <Badge variant="secondary" className="mt-1.5 text-xs">{meta.label}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">{a.body}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
