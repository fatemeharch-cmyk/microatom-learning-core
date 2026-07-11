import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/student/health-report")({
  head: () => ({
    meta: [
      { title: "پرونده سلامت آموزشی — دانش‌آموز" },
      {
        name: "description",
        content:
          "خلاصه چکاب‌ها، نبض یادگیری، دوز مطالعه و نسخه پیشنهادی دانش‌آموز.",
      },
    ],
  }),
  component: StudentHealthReportPage,
});

function StudentHealthReportPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/student/health-learning-report", replace: true });
  }, [navigate]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
      در حال انتقال...
    </div>
  );
}
