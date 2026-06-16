import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  Sun,
  Footprints,
  BookOpenCheck,
  CalendarRange,
  NotebookPen,
  GraduationCap,
  Library,
  Sprout,
} from "lucide-react";
import { StudentShell, type NavItem } from "@/components/student/student-shell";

const items: NavItem[] = [
  { title: "امروز من", url: "/student", icon: Sun },
  { title: "گام بعدی", url: "/student/next-step", icon: Footprints },
  { title: "دفتر یادگیری", url: "/student/notebook", icon: BookOpenCheck },
  { title: "برنامه هفتگی", url: "/student/schedule", icon: CalendarRange },
  { title: "تکالیف", url: "/student/homework", icon: NotebookPen },
  { title: "آزمون‌ها", url: "/student/exams", icon: GraduationCap },
  { title: "منابع آموزشی", url: "/student/resources", icon: Library },
  { title: "مسیر رشد", url: "/student/growth", icon: Sprout },
];

export const Route = createFileRoute("/student")({
  component: () => (
    <StudentShell items={items}>
      <Outlet />
    </StudentShell>
  ),
});
