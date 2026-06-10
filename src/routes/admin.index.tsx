import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/admin/")({
  component: () => (
    <PagePlaceholder title="Platform overview" description="Tenant health, usage and KPIs." />
  ),
});
