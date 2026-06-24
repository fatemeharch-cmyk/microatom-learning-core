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
import { useHealthGlossary } from "@/lib/health-glossary";

const defaultItems: NavItem[] = [
  { title: "امروز من", url: "/student", icon: Sun },
  { title: "گام بعدی", url: "/student/next-step", icon: Footprints },
  { title: "دفتر یادگیری", url: "/student/notebook", icon: BookOpenCheck },
  { title: "برنامه هفتگی", url: "/student/schedule", icon: CalendarRange },
  { title: "تکالیف", url: "/student/homework", icon: NotebookPen },
  { title: "آزمون‌ها", url: "/student/exams", icon: GraduationCap },
  { title: "منابع آموزشی", url: "/student/resources", icon: Library },
  { title: "مسیر رشد", url: "/student/growth", icon: Sprout },
];

function StudentLayout() {
  const { studentItems } = useHealthGlossary();
  const items: NavItem[] = studentItems ?? defaultItems;
  return (
    <StudentShell items={items}>
      <Outlet />
    </StudentShell>
  );
}

export const Route = createFileRoute("/student")({
  component: StudentLayout,
});
