import { GraduationCap, BookOpen, Users, ShieldCheck, Settings, type LucideIcon } from "lucide-react";

/**
 * Atomia Role Framework
 * ---------------------
 * Single source of truth for supported roles, their landing routes,
 * permissions and presentation. Designed to be backend-agnostic so we can
 * later plug it into Xano (or any auth provider) without touching the UI.
 *
 * Future integration:
 *   - Replace MOCK_AVAILABLE_ROLES with roles returned by the auth API.
 *   - Replace `hasPermission` with a check against the user's granted
 *     permissions list from Xano.
 */

export type RoleId = "student" | "teacher" | "supervisor" | "parent" | "admin";

export type Permission =
  | "view:own_progress"
  | "view:class_progress"
  | "view:grade_progress"
  | "view:child_progress"
  | "view:school_analytics"
  | "manage:content"
  | "manage:users"
  | "manage:system"
  | "mentor:students"
  | "communicate:parents";

export type RoleDefinition = {
  id: RoleId;
  /** Persian (RTL) label — primary user-facing name */
  labelFa: string;
  /** English label — fallback */
  labelEn: string;
  descriptionFa: string;
  descriptionEn: string;
  /** Default landing route when the role is selected */
  landing: string;
  icon: LucideIcon;
  /** Tailwind accent token used by the switcher chip */
  accent: string;
  permissions: Permission[];
};

export const ROLES: Record<RoleId, RoleDefinition> = {
  student: {
    id: "student",
    labelFa: "دانش‌آموز",
    labelEn: "Student",
    descriptionFa: "مسیر یادگیری شخصی با AtomBit",
    descriptionEn: "Grow through personalized AtomBits",
    landing: "/student",
    icon: GraduationCap,
    accent: "from-blue-500 to-indigo-500",
    permissions: ["view:own_progress"],
  },
  teacher: {
    id: "teacher",
    labelFa: "دبیر",
    labelEn: "Teacher",
    descriptionFa: "مدیریت کلاس و محتوای آموزشی",
    descriptionEn: "Create content & track classes",
    landing: "/teacher",
    icon: BookOpen,
    accent: "from-emerald-500 to-teal-500",
    permissions: ["view:class_progress", "manage:content"],
  },
  supervisor: {
    id: "supervisor",
    labelFa: "مسئول پایه",
    labelEn: "Grade Supervisor",
    descriptionFa: "همراهی و راهبری پایه تحصیلی",
    descriptionEn: "Oversee grade-wide growth",
    landing: "/supervisor",
    icon: ShieldCheck,
    accent: "from-purple-500 to-fuchsia-500",
    permissions: [
      "view:grade_progress",
      "mentor:students",
      "communicate:parents",
    ],
  },
  parent: {
    id: "parent",
    labelFa: "والدین",
    labelEn: "Parent",
    descriptionFa: "همراه رشد فرزند شما",
    descriptionEn: "Follow your child's journey",
    landing: "/parent",
    icon: Users,
    accent: "from-pink-500 to-rose-500",
    permissions: ["view:child_progress"],
  },
  admin: {
    id: "admin",
    labelFa: "مدیر مدرسه",
    labelEn: "School Admin",
    descriptionFa: "مدیریت پلتفرم، کاربران و سیستم",
    descriptionEn: "Manage platform, users & system",
    landing: "/admin",
    icon: Settings,
    accent: "from-amber-500 to-orange-500",
    permissions: [
      "view:school_analytics",
      "manage:users",
      "manage:system",
      "manage:content",
    ],
  },
};

export const ROLE_ORDER: RoleId[] = [
  "student",
  "teacher",
  "supervisor",
  "parent",
  "admin",
];

/**
 * MOCK auth state — what the "currently signed-in user" is allowed to use.
 * Replace with the role list returned by Xano on login. For now we allow
 * every role so the platform is fully demo-able.
 */
export const MOCK_AVAILABLE_ROLES: RoleId[] = [...ROLE_ORDER];

export function getRole(id: RoleId): RoleDefinition {
  return ROLES[id];
}

export function hasPermission(roleId: RoleId, permission: Permission): boolean {
  return ROLES[roleId].permissions.includes(permission);
}

/** Infer the active role from a pathname like `/student/daily` → "student". */
export function roleFromPath(pathname: string): RoleId | null {
  const seg = pathname.split("/").filter(Boolean)[0];
  if (seg && (ROLE_ORDER as string[]).includes(seg)) return seg as RoleId;
  return null;
}
