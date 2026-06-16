import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquareHeart, Star, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/parent/feedback")({
  component: FeedbackPage,
});

const questions = [
  { id: "experience", label: "تجربه کلی این هفته با همراهی آتومیا چطور بود؟" },
  { id: "communication", label: "کیفیت ارتباط مدرسه با خانواده در این هفته چگونه بود؟" },
  { id: "support", label: "احساس می‌کنید چقدر در مسیر یادگیری فرزندتان حمایت می‌شوید؟" },
];

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="p-1 rounded-full hover:bg-muted transition"
          aria-label={`امتیاز ${n}`}
        >
          <Star
            className={`h-6 w-6 transition ${
              n <= value ? "fill-warning text-warning" : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function FeedbackPage() {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const setRating = (id: string, v: number) =>
    setRatings((prev) => ({ ...prev, [id]: v }));

  const handleSubmit = () => {
    setSubmitted(true);
    toast.success("بازخورد شما با سپاس ثبت شد");
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquareHeart className="h-6 w-6 text-primary" /> بازخورد هفتگی
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          نظر شما به ما کمک می‌کند همراهی بهتری برای خانواده‌ها بسازیم
        </p>
      </div>

      {submitted ? (
        <Card className="border-success/30 bg-success/5">
          <CardContent className="p-8 text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-success mx-auto" />
            <h2 className="text-lg font-semibold">سپاس از همراهی شما</h2>
            <p className="text-sm text-muted-foreground">
              بازخورد شما ثبت شد و به بهبود مسیر آموزشی کمک می‌کند.
            </p>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => {
                setSubmitted(false);
                setRatings({});
                setNote("");
              }}
            >
              ارسال بازخورد جدید
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {questions.map((q) => (
            <Card key={q.id}>
              <CardHeader>
                <CardTitle className="text-base">{q.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <StarRating
                  value={ratings[q.id] || 0}
                  onChange={(v) => setRating(q.id, v)}
                />
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">پیشنهاد یا یادداشت (اختیاری)</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="note" className="sr-only">یادداشت</Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="هر پیشنهادی برای بهبود همراهی خانواده دارید بنویسید..."
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="rounded-full px-6" onClick={handleSubmit}>
              ارسال بازخورد
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
