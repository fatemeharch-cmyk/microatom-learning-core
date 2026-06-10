import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/student/")({
  component: () => (
    <PagePlaceholder title="Welcome back" description="Your daily MicroAtoms and learning streak will appear here." />
  ),
});
