import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/parent/reports")({
  component: () => (
    <PagePlaceholder title="Reports" description="Mastery, attendance and growth reports across subjects." />
  ),
});
