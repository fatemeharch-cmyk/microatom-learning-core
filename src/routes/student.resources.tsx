import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Video, ClipboardList, FileSpreadsheet, Link2, Library } from "lucide-react";

export const Route = createFileRoute("/student/resources")({
  component: ResourcesPage,
});

type Kind = "pdf" | "video" | "worksheet" | "exam" | "link";

const kindMap: Record<Kind, { label: string; icon: typeof FileText; cls: string }> = {
  pdf: { label: "PDF", icon: FileText, cls: "bg-info/10 text-info" },
  video: { label: "ویدئو", icon: Video, cls: "bg-primary/10 text-primary" },
  worksheet: { label: "کاربرگ", icon: ClipboardList, cls: "bg-success/10 text-success" },
  exam: { label: "نمونه چکاب", icon: FileSpreadsheet, cls: "bg-warning/10 text-warning" },
  link: { label: "لینک", icon: Link2, cls: "bg-accent text-accent-foreground" },
};

const groups = [
  {
    subject: "زیست‌شناسی",
    items: [
      { atomBit: "تنفس سلولی", title: "جزوه فصل ۲", kind: "pdf" as Kind },
      { atomBit: "تنفس سلولی", title: "ویدئو آموزشی میتوکندری", kind: "video" as Kind },
      { atomBit: "ژنتیک", title: "کاربرگ تمرین", kind: "worksheet" as Kind },
    ],
  },
  {
    subject: "ریاضی",
    items: [
      { atomBit: "معادله درجه دوم", title: "نمونه چکاب فصل ۲", kind: "exam" as Kind },
      { atomBit: "معادله درجه دوم", title: "ویدئو حل تمرین", kind: "video" as Kind },
    ],
  },
  {
    subject: "شیمی",
    items: [
      { atomBit: "استوکیومتری", title: "جزوه محاسبات مولی", kind: "pdf" as Kind },
      { atomBit: "استوکیومتری", title: "منبع آنلاین تکمیلی", kind: "link" as Kind },
    ],
  },
];

function ResourcesPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Library className="h-6 w-6 text-primary" /> منابع آموزشی
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          منابع مرتب شده بر اساس درس و واحد یادگیری
        </p>
      </div>

      <div className="space-y-6">
        {groups.map((g) => (
          <div key={g.subject} className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{g.subject}</h2>
              <span className="text-xs text-muted-foreground">
                {g.items.length} منبع
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {g.items.map((it, i) => {
                const k = kindMap[it.kind];
                const Icon = k.icon;
                return (
                  <Card key={i} className="hover:shadow-md transition">
                    <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                      <div className={`h-10 w-10 rounded-xl grid place-items-center ${k.cls}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm leading-tight">{it.title}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          واحد یادگیری: {it.atomBit}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">{k.label}</Badge>
                      <Button size="sm" variant="ghost" className="rounded-full">
                        مشاهده
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
