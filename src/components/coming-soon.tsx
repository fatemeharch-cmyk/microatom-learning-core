import { Link } from "@tanstack/react-router";
import { Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Full-page Persian RTL "coming soon" lock screen used by workspaces
 * whose backend is not yet connected. Do not render any real UI or data
 * here — this is a production-mode guardrail.
 */
export function ComingSoon({
  title,
  message = "این بخش به‌زودی فعال خواهد شد.",
}: {
  title: string;
  message?: string;
}) {
  return (
    <div
      dir="rtl"
      className="font-vazir min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-6"
    >
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>آتومیا</span>
        </div>
        <div className="mt-6 mx-auto h-16 w-16 rounded-2xl bg-primary/10 grid place-items-center">
          <Clock className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mt-5">{title}</h1>
        <p className="text-sm text-muted-foreground mt-3 leading-7">
          {message}
        </p>
        <div className="mt-6">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/login">بازگشت به صفحه ورود</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
