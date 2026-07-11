import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/student/progress")({
  component: ProgressPage,
});

function ProgressPage() {
  return (
    <div className="space-y-6 max-w-6xl" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">پیشرفت من</h1>
        <p className="text-sm text-muted-foreground mt-1">روند یادگیری، تسلط و XP شما</p>
      </div>

      <Card className="border-dashed">
        <CardContent className="p-10 flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 grid place-items-center mb-4">
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">پیشرفت هنوز فعال نیست</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md leading-7">
            این بخش هنوز به داده واقعی وصل نشده و به‌زودی فعال می‌شود. پس از اتصال، نمودار XP، میزان تسلط بر درس‌ها و نشان‌های رشد در اینجا نمایش داده می‌شود.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
