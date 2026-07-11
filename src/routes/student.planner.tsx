import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Calendar, CalendarRange, Lightbulb, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudyPlanBoard } from "@/components/student/study-plan-board";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/student/planner")({
  component: PlannerPage,
});

function PlannerPage() {
  const { user } = useAuth();
  const studentId = user?.id ? String(user.id) : "";

  return (
    <div className="space-y-6 max-w-6xl" dir="rtl">
      {/* Hero */}
      <Card className="overflow-hidden border-0 bg-[image:var(--gradient-primary)] text-primary-foreground">
        <CardContent className="p-5 sm:p-6 flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-white/15 grid place-items-center shrink-0">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <Badge
              variant="secondary"
              className="bg-white/15 text-primary-foreground border-0 mb-2"
            >
              قدرت‌گرفته از توربو
            </Badge>
            <h1 className="text-xl sm:text-2xl font-bold">برنامه‌ریز توربو</h1>
            <p className="text-sm opacity-90 mt-1">
              برنامه دوز مطالعه امروزت را از ماموریت روزانه‌ات به‌شکل خودکار می‌سازیم. کارت‌ها را با
              درگ‌ و‌ دراپ بین ستون‌ها جابه‌جا کن تا پیشرفتت را ثبت کنی.
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="daily">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="daily">
            <Calendar className="h-4 w-4 mx-1" />
            روزانه
          </TabsTrigger>
          <TabsTrigger value="weekly">
            <CalendarRange className="h-4 w-4 mx-1" />
            هفتگی
          </TabsTrigger>
          <TabsTrigger value="recs">
            <Lightbulb className="h-4 w-4 mx-1" />
            پیشنهادهای توربو
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-4 space-y-3">
          {studentId ? (
            <StudyPlanBoard studentId={studentId} />
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-sm text-muted-foreground">
                برای دیدن برنامه امروز باید وارد حساب کاربری‌ات شده باشی.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="weekly" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                نقشه هفته
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              این بخش به‌زودی فعال می‌شود
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recs" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                پیشنهادهای شخصی توربو
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              این بخش به‌زودی فعال می‌شود
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
