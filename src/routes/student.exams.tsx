import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, PlayCircle, Calendar, Award, Timer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/student/exams")({
  component: Exams,
});

const upcoming = [
  { id: 1, title: "آزمون جامع ریاضی - فصل ۱ و ۲", date: "پنج‌شنبه ۲۴ خرداد • ۱۰:۰۰", duration: "۹۰ دقیقه", questions: 30, kind: "رسمی" },
  { id: 2, title: "آزمون تشخیصی فیزیک", date: "شنبه ۲۶ خرداد • ۱۸:۰۰", duration: "۴۵ دقیقه", questions: 20, kind: "تطبیقی" },
];

const practice = [
  { id: 3, title: "تمرین سریع: توابع", q: 10, time: "۱۵ دقیقه" },
  { id: 4, title: "تمرین: قوانین نیوتن", q: 12, time: "۲۰ دقیقه" },
  { id: 5, title: "تمرین لغات زبان", q: 25, time: "۱۰ دقیقه" },
];

const past = [
  { id: 6, title: "آزمون ماهانه شیمی", date: "۱۰ خرداد", score: "۱۶/۲۰", correct: "۲۴ از ۳۰" },
  { id: 7, title: "آزمون هفتگی ریاضی", date: "۸ خرداد", score: "۱۸/۲۰", correct: "۲۷ از ۳۰" },
  { id: 8, title: "آزمون تشخیصی زبان", date: "۲ خرداد", score: "۱۴/۲۰", correct: "۲۱ از ۳۰" },
];

function Exams() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-success/15 text-success grid place-items-center">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">مرکز آزمون</h1>
          <p className="text-sm text-muted-foreground">آزمون‌های رسمی، تطبیقی و تمرینی</p>
        </div>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">پیش‌رو</TabsTrigger>
          <TabsTrigger value="practice">تمرینی</TabsTrigger>
          <TabsTrigger value="past">گذشته</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-3 mt-4">
          {upcoming.map((e) => (
            <Card key={e.id}>
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{e.title}</h3>
                    <Badge>{e.kind}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {e.date} • {e.questions} سؤال • {e.duration}
                  </p>
                </div>
                <Button variant="outline" className="rounded-full">یادآور</Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="practice" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {practice.map((p) => (
            <Card key={p.id} className="hover:shadow-md transition">
              <CardHeader>
                <CardTitle className="text-base">{p.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{p.q} سؤال</span>
                  <span className="flex items-center gap-1">
                    <Timer className="h-3 w-3" /> {p.time}
                  </span>
                </div>
                <Button size="sm" className="w-full rounded-full">
                  <PlayCircle className="h-4 w-4" /> شروع تمرین
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-3 mt-4">
          {past.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4 flex items-center gap-3">
                <Award className="h-5 w-5 text-xp" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{p.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {p.date} • {p.correct} صحیح
                  </p>
                </div>
                <Badge variant="secondary" className="bg-success/15 text-success border-0 text-base font-bold">
                  {p.score}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
