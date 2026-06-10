import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/supervisor/teachers")({
  component: () => (
    <PagePlaceholder title="Teachers" description="Teacher performance and content coverage." />
  ),
});
