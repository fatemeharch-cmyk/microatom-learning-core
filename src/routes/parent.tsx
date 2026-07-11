import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/parent")({
  head: () => ({
    meta: [{ title: "فضای والدین — به‌زودی | آتومیا" }],
  }),
  component: () => (
    <ComingSoon title="فضای کاری والدین" message="این بخش به‌زودی فعال خواهد شد." />
  ),
});
