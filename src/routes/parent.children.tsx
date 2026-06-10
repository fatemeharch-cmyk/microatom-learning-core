import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/parent/children")({
  component: () => (
    <PagePlaceholder title="Children" description="Per-child profile, classroom and learning activity." />
  ),
});
