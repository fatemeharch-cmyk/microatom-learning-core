import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/supervisor/parents")({
  component: () => (
    <PagePlaceholder title="اولیا" description="ارتباط و هماهنگی با اولیای دانش‌آموزان پایه." />
  ),
});
