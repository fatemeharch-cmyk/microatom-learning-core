import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/teacher/")({
  component: () => (
    <PagePlaceholder title="Today's overview" description="Class snapshots, alerts and pending reviews." />
  ),
});
