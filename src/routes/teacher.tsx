import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/teacher")({
  head: () => ({
    meta: [{ title: "فضای دبیر — به‌زودی | آتومیا" }],
  }),
  component: () => (
    <ComingSoon title="فضای کاری دبیر" message="این بخش به‌زودی فعال خواهد شد." />
  ),
});
