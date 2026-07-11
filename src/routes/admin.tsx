import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "فضای مدیر مدرسه — به‌زودی | آتومیا" }],
  }),
  component: () => (
    <ComingSoon title="فضای کاری مدیر مدرسه" message="این بخش به‌زودی فعال خواهد شد." />
  ),
});
