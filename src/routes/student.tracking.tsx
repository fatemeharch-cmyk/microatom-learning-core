import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Timer } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { StudyTrackingPanel } from "@/components/student/study-tracking-panel";

export const Route = createFileRoute("/student/tracking")({
  component: StudyTracking,
});

function StudyTracking() {
  const { lang } = useI18n();
  const { t: themeT } = useTheme();
  const studyTimeLabel = themeT("study_time", "دوز مطالعه");
  const fa = lang === "fa";

  return (
    <div dir="rtl" className="space-y-6 w-full text-right">
      <div>
        <Badge variant="secondary" className="mb-2">
          <Timer className="h-3 w-3 mx-1" />
          {fa ? "ردیابی مطالعه" : "Study Tracking"}
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight">
          {fa ? `${studyTimeLabel}‌ی تو` : "Your study time"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {fa
            ? "هر جلسهٔ مطالعه‌ت رو به همراه فصلش ثبت کن تا خلاصهٔ روز، هفته و ماه رو ببینی."
            : "Log each study session with its chapter to see today, this week, and this month."}
        </p>
      </div>
      <StudyTrackingPanel />
    </div>
  );
}
