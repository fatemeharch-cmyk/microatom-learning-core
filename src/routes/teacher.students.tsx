import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Search, Sparkles, MessageCircle, Award } from "lucide-react";

export const Route = createFileRoute("/teacher/students")({
  component: TeacherStudents,
});

type Tag = "great" | "more_practice" | "talk";

const tagMap: Record<Tag, { label: string; cls: string; icon: typeof Award }> = {
  great: { label: "مشارکت خوب", cls: "bg-success/15 text-success border-success/30", icon: Award },
  more_practice: { label: "نیاز به تمرین بیشتر", cls: "bg-info/15 text-info border-info/30", icon: Sparkles },
  talk: { label: "پیشنهاد گفتگوی آموزشی", cls: "bg-primary/15 text-primary border-primary/30", icon: MessageCircle },
};

const students: { name: string; class: string; tag: Tag }[] = [
  { name: "آرمان کریمی", class: "یازدهم ۱", tag: "great" },
  { name: "ساره موسوی", class: "یازدهم ۱", tag: "more_practice" },
  { name: "محمد رضایی", class: "یازدهم ۱", tag: "great" },
  { name: "نیلوفر احمدی", class: "یازدهم ۲", tag: "talk" },
  { name: "علی نوری", class: "یازدهم ۲", tag: "great" },
  { name: "فاطمه حسینی", class: "یازدهم ۳", tag: "more_practice" },
  { name: "امیر صالحی", class: "یازدهم ۳", tag: "great" },
  { name: "زهرا مرادی", class: "یازدهم ۲", tag: "more_practice" },
];

function TeacherStudents() {
  const [q, setQ] = useState("");
  const filtered = students.filter((s) => s.name.includes(q) || s.class.includes(q));

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" /> دانش‌آموزان کلاس
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          فهرست دانش‌آموزان درس شما — فقط با نگاه آموزشی
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
          <CardTitle className="text-base">جستجو</CardTitle>
          <div className="relative w-full max-w-xs">
            <Search className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="نام یا کلاس..."
              className="pr-9"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {filtered.map((s, i) => {
              const tg = tagMap[s.tag];
              const Icon = tg.icon;
              return (
                <li key={i} className="flex items-center gap-3 p-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {s.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.class}</p>
                  </div>
                  <Badge className={`${tg.cls} border gap-1 hidden sm:inline-flex`}>
                    <Icon className="h-3 w-3" /> {tg.label}
                  </Badge>
                  <Button size="sm" variant="ghost">نمای آموزشی</Button>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-muted/40 border-dashed">
        <CardContent className="p-4 text-sm text-muted-foreground">
          توجه: یادداشت‌های مشاوره‌ای و تحلیل‌های شخصی دانش‌آموز در دسترس معلم قرار ندارد و فقط نزد منتور و خانواده محفوظ است.
        </CardContent>
      </Card>
    </div>
  );
}
