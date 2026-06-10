import { createFileRoute } from "@tanstack/react-router";
import { User, Mail, School, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/student/profile")({
  component: Profile,
});

function Profile() {
  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">آر</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-right">
            <h1 className="text-xl font-bold">آرمین رضایی</h1>
            <p className="text-sm text-muted-foreground">دانش‌آموز پایه دهم • رشته ریاضی</p>
            <div className="flex gap-2 mt-2 justify-center sm:justify-start">
              <Badge>سطح ۸</Badge>
              <Badge variant="secondary" className="bg-xp/15 text-xp border-0">۲٬۴۸۰ XP</Badge>
            </div>
          </div>
          <Button variant="outline" className="rounded-full">
            <Settings className="h-4 w-4" /> ویرایش
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">اطلاعات حساب</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Row icon={Mail} label="ایمیل" value="armin@example.com" />
          <Row icon={School} label="مدرسه" value="دبیرستان شهید بهشتی" />
          <Row icon={User} label="کلاس" value="۱۰-الف • سرپرست: خانم احمدی" />
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card/50">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-muted-foreground w-24 text-xs">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
