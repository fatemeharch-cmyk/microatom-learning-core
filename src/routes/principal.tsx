import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/principal")({
  head: () => ({
    meta: [{ title: "فضای مدیر — به‌زودی | آتومیا" }],
  }),
  component: () => (
    <ComingSoon title="فضای کاری مدیر مدرسه" message="این بخش به‌زودی فعال خواهد شد." />
  ),
});
