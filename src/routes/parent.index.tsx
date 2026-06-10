import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/parent/")({
  component: () => (
    <PagePlaceholder title="Family overview" description="Highlights and weekly summaries for your children." />
  ),
});
