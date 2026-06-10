import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/parent/messages")({
  component: () => (
    <PagePlaceholder title="Messages" description="Communicate with teachers and grade supervisors." />
  ),
});
