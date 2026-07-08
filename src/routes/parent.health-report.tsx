import { createFileRoute } from "@tanstack/react-router";
import { HealthReportView } from "@/components/health-report/health-report-view";

export const Route = createFileRoute("/parent/health-report")({
  head: () => ({
    meta: [
      { title: "پرونده سلامت آموزشی فرزند شما" },
      {
        name: "description",
        content:
          "خلاصه وضعیت یادگیری، چکاب‌ها، دوز مطالعه و مسیر رشد فرزند شما.",
      },
    ],
  }),
  component: ParentHealthReportPage,
});

function ParentHealthReportPage() {
  return <HealthReportView audience="parent" />;
}
