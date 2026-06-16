import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Library, Upload, FileText, Video, ClipboardList, Link2, Trash2 } from "lucide-react";

export const Route = createFileRoute("/teacher/resources")({
  component: TeacherResources,
});

type Kind = "pdf" | "video" | "worksheet" | "link";

const kindMap: Record<Kind, { label: string; icon: typeof FileText; cls: string }> = {
  pdf: { label: "PDF", icon: FileText, cls: "bg-info/10 text-info" },
  video: { label: "ویدئو", icon: Video, cls: "bg-primary/10 text-primary" },
  worksheet: { label: "کاربرگ", icon: ClipboardList, cls: "bg-success/10 text-success" },
  link: { label: "لینک", icon: Link2, cls: "bg-accent text-accent-foreground" },
};

const resources: { title: string; kind: Kind; atomBit: string; date: string }[] = [
  { title: "جزوه فصل ۲ تنفس سلولی", kind: "pdf", atomBit: "تنفس سلولی", date: "۱۸ خرداد" },
  { title: "ویدئو میتوکندری", kind: "video", atomBit: "نقش میتوکندری", date: "۱۵ خرداد" },
  { title: "کاربرگ تمرین ATP", kind: "worksheet", atomBit: "ATP و انرژی سلولی", date: "۱۲ خرداد" },
  { title: "مقاله تکمیلی تنفس بی‌هوازی", kind: "link", atomBit: "تنفس بی‌هوازی", date: "۱۰ خرداد" },
  { title: "نمونه کاربرگ پایانی", kind: "worksheet", atomBit: "تنفس هوازی", date: "۵ خرداد" },
];

function TeacherResources() {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Library className="h-6 w-6 text-primary" /> منابع آموزشی
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            مدیریت منابع کلاسی شامل PDF، ویدئو، کاربرگ و لینک
          </p>
        </div>
        <Button className="rounded-full gap-1">
          <Upload className="h-4 w-4" /> بارگذاری منبع
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">منابع بارگذاری‌شده</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {resources.map((r, i) => {
              const k = kindMap[r.kind];
              const Icon = k.icon;
              return (
                <li key={i} className="flex items-center gap-3 p-4">
                  <div className={`h-10 w-10 rounded-xl grid place-items-center ${k.cls}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{r.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      واحد یادگیری: {r.atomBit} • {r.date}
                    </p>
                  </div>
                  <Badge variant="outline" className="hidden sm:inline-flex">{k.label}</Badge>
                  <Button size="sm" variant="ghost">اشتراک</Button>
                  <Button size="icon" variant="ghost" aria-label="حذف">
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
