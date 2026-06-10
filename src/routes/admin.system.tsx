import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/admin/system")({
  component: () => (
    <PagePlaceholder title="System" description="Integrations, AI settings and audit logs." />
  ),
});
