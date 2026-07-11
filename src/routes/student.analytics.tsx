import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/student/analytics")({
  component: PersonalAnalyticsPage,
});

function PersonalAnalyticsPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-6 max-w-6xl" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("analytics_title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("analytics_subtitle")}</p>
      </div>

      <Card className="border-dashed">
        <CardContent className="p-10 flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 grid place-items-center mb-4">
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">تحلیل‌های شخصی هنوز فعال نیست</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md leading-7">
            این بخش هنوز به داده واقعی وصل نشده و به‌زودی فعال می‌شود. پس از اتصال، نمودارهای روند چکاب، ماموریت‌ها و دوز مطالعه در اینجا نمایش داده می‌شود.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
