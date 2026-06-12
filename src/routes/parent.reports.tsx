import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/parent/reports")({
  component: () => (
    <PagePlaceholder title="Turbo Reports" description="Encouraging insights into growth, consistency, and next learning opportunities." />
  ),
});
