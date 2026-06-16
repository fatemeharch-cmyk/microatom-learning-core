import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ClipboardEdit, Upload, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/teacher/log")({
  component: ClassLog,
});

const atomBits = [
  "تنفس سلولی — مقدمه",
  "تنفس هوازی",
  "تنفس بی‌هوازی",
  "نقش میتوکندری",
  "ATP و انرژی سلولی",
];

function ClassLog() {
  const [topic, setTopic] = useState<string>("");

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardEdit className="h-6 w-6 text-primary" /> ثبت کلاس
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            یک ثبت یک‌دقیقه‌ای برای حفظ مسیر یادگیری دانش‌آموزان
          </p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Sparkles className="h-3 w-3" /> پیشنهاد توربو فعال
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">اطلاعات کلاس</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>کلاس</Label>
            <Select defaultValue="11-1">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="11-1">یازدهم تجربی ۱</SelectItem>
                <SelectItem value="11-2">یازدهم تجربی ۲</SelectItem>
                <SelectItem value="11-3">یازدهم تجربی ۳</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>زنگ</Label>
            <Select defaultValue="1">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((p) => (
                  <SelectItem key={p} value={String(p)}>زنگ {p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">مبحث امروز (واحد یادگیری)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select value={topic} onValueChange={setTopic}>
            <SelectTrigger><SelectValue placeholder="یک واحد یادگیری انتخاب کنید" /></SelectTrigger>
            <SelectContent>
              {atomBits.map((a) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {topic && (
            <div className="p-3 rounded-xl bg-accent/30 flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-success" />
              توربو این واحد یادگیری را به مسیر کلاس اضافه می‌کند.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">فعالیت کلاسی</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="مثلاً: حل گروهی ۳ مسئله از فصل ۲"
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">تکلیف</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="مثلاً: تمرین‌های ۵ تا ۱۲ صفحه ۴۵"
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">بارگذاری فایل یا منبع</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-sm mt-2">فایل را اینجا رها کنید یا انتخاب کنید</p>
            <p className="text-xs text-muted-foreground mt-1">PDF, تصویر, ویدئو</p>
          </div>
          <Input type="text" placeholder="یا یک لینک منبع وارد کنید" />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" className="rounded-full">پیش‌نویس</Button>
        <Button className="rounded-full" onClick={() => toast.success("کلاس با موفقیت ثبت شد")}>
          ذخیره ثبت کلاس
        </Button>
      </div>
    </div>
  );
}
