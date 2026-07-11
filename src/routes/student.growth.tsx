import { createFileRoute } from "@tanstack/react-router";
import { Sprout } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/student/growth")({
  component: GrowthPage,
});

function GrowthPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sprout className="h-6 w-6 text-success" /> مسیر رشد من
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          هر گام، یک رشد تازه — این مسیر فقط مربوط به خودِ توست.
        </p>
      </div>

      <Card className="border-dashed">
        <CardContent className="p-10 flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-2xl bg-success/10 grid place-items-center mb-4">
            <Sprout className="h-8 w-8 text-success" />
          </div>
          <h2 className="text-lg font-semibold">مسیر رشد هنوز فعال نیست</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md leading-7">
            این بخش هنوز به داده واقعی وصل نشده و به‌زودی فعال می‌شود. پس از اتصال، آمار رشد، تداوم یادگیری و نقاط درخشان مسیرت در اینجا نمایش داده می‌شود.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
