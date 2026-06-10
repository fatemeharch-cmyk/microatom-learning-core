import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/supervisor/")({
  component: () => (
    <PagePlaceholder title="Grade snapshot" description="High-level mastery and at-risk indicators." />
  ),
});
