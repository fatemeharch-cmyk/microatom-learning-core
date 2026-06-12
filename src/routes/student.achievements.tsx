import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/student/achievements")({
  component: () => (
    <PagePlaceholder title="Growth Badges" description="Celebrate your Learning Streak, AtomBit progress, and personal milestones." />
  ),
});
