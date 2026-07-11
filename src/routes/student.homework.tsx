import { createFileRoute } from "@tanstack/react-router";
import { NotebookPen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/student/homework")({
  component: HomeworkPage,
});

function HomeworkPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <NotebookPen className="h-6 w-6 text-primary" /> ماموریت‌های من
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          همه ماموریت‌های فعال و تکمیل شده در یک نگاه
        </p>
      </div>

      <Card className="border-dashed">
        <CardContent className="p-10 flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 grid place-items-center mb-4">
            <NotebookPen className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">ماموریت‌ها هنوز فعال نیست</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md leading-7">
            این بخش هنوز به داده واقعی وصل نشده و به‌زودی فعال می‌شود. پس از اتصال، ماموریت‌های فعال، مهلت‌ها و وضعیت تکمیل هر کدام در اینجا نمایش داده می‌شود.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
