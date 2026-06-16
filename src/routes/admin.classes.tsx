import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, School, Users } from "lucide-react";
import { classrooms } from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/classes")({
  component: AdminClasses,
});

function AdminClasses() {
  const grades = Array.from(new Set(classrooms.map((c) => c.grade)));
  const totalStudents = classrooms.reduce((s, c) => s + c.students, 0);

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Layers className="h-6 w-6 text-primary" /> پایه‌ها و کلاس‌ها
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          نمای کلی پایه‌ها، رشته‌ها، کلاس‌ها و مسئولان همراه.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard icon={<School className="h-4 w-4" />} label="پایه‌های فعال" value={grades.length.toLocaleString("fa-IR")} />
        <StatCard icon={<Layers className="h-4 w-4" />} label="کلاس‌های فعال" value={classrooms.length.toLocaleString("fa-IR")} />
        <StatCard icon={<Users className="h-4 w-4" />} label="مجموع دانش‌آموزان" value={totalStudents.toLocaleString("fa-IR")} />
      </div>

      {grades.map((g) => {
        const list = classrooms.filter((c) => c.grade === g);
        return (
          <Card key={g}>
            <CardHeader>
              <CardTitle className="text-base">پایه {g}</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {list.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-muted/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{c.name}</p>
                    <Badge variant="secondary" className="rounded-lg">{c.major}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {c.students.toLocaleString("fa-IR")} دانش‌آموز
                  </p>
                  <p className="text-xs text-muted-foreground">
                    همراه: <span className="font-medium text-foreground">{c.supervisor}</span>
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <span className="text-primary">{icon}</span>
          <span>{label}</span>
        </div>
        <p className="text-2xl font-bold mt-2">{value}</p>
      </CardContent>
    </Card>
  );
}
