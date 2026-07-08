import { createFileRoute } from "@tanstack/react-router";
import { HealthReportView } from "@/components/health-report/health-report-view";

export const Route = createFileRoute("/student/health-report")({
  head: () => ({
    meta: [
      { title: "پرونده سلامت آموزشی — دانش‌آموز" },
      {
        name: "description",
        content:
          "خلاصه چکاب‌ها، نبض یادگیری، دوز مطالعه و نسخه فعال دانش‌آموز.",
      },
    ],
  }),
  component: StudentHealthReportPage,
});

function StudentHealthReportPage() {
  return <HealthReportView audience="student" />;
}
