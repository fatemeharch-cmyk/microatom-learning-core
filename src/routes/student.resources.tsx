import { createFileRoute } from "@tanstack/react-router";
import { Library } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/student/resources")({
  component: ResourcesPage,
});

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

      <Card className="border-dashed">
        <CardContent className="p-10 flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 grid place-items-center mb-4">
            <Library className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">منابع آموزشی هنوز فعال نیست</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md leading-7">
            این بخش هنوز به داده واقعی وصل نشده و به‌زودی فعال می‌شود. پس از اتصال، جزوه‌ها، ویدئوها، کاربرگ‌ها و لینک‌های تکمیلی درس‌ها در اینجا نمایش داده می‌شود.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
