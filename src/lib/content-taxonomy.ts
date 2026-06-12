/**
 * Content Taxonomy
 *
 * Canonical 9-level hierarchy used across the entire platform:
 *
 *   EducationLevel → Grade → Major → Subject → Chapter → Section → Atom → MicroAtom → Question
 *
 * v1 release ships ONLY with Grade 11 — Experimental Sciences content active.
 * Future levels, grades, and majors are intentionally not seeded. They can be
 * added as data later without changing this model or the surrounding UI.
 *
 * Stable string IDs (slugs) are used everywhere so DB rows, AI prompts,
 * analytics events, and URLs remain portable.
 */

export type ID = string;

export interface EducationLevel {
  id: ID;            // e.g. "secondary"
  nameFa: string;
  nameEn: string;
  active: boolean;
}

export interface Grade {
  id: ID;            // e.g. "g11"
  levelId: ID;
  nameFa: string;
  nameEn: string;
  order: number;
  active: boolean;
}

export interface Major {
  id: ID;            // e.g. "experimental"
  gradeId: ID;
  nameFa: string;
  nameEn: string;
  active: boolean;
}

export interface Subject {
  id: ID;            // e.g. "biology-11-exp"
  majorId: ID;
  nameFa: string;
  nameEn: string;
  color?: string;    // hex / token for UI accents
  active: boolean;
}

export interface Chapter {
  id: ID;
  subjectId: ID;
  nameFa: string;
  nameEn: string;
  order: number;
}

export interface Section {
  id: ID;
  chapterId: ID;
  nameFa: string;
  nameEn: string;
  order: number;
}

export interface Atom {
  id: ID;
  sectionId: ID;
  nameFa: string;
  nameEn: string;
  order: number;
}

export interface MicroAtom {
  id: ID;
  atomId: ID;
  nameFa: string;
  nameEn: string;
  /** estimated minutes to master */
  estMinutes?: number;
  /** difficulty 1..5 */
  difficulty?: number;
}

export interface Question {
  id: ID;
  microAtomId: ID;
  prompt: string;
  difficulty?: number;
}

// ---------------------------------------------------------------------------
// v1 catalog — only Grade 11 Experimental Sciences is seeded and visible.
// Future scopes are added as records, not hard-coded placeholders.
// ---------------------------------------------------------------------------

export const educationLevels: EducationLevel[] = [
  { id: "secondary", nameFa: "متوسطه دوم",  nameEn: "High School",    active: true  },
];

export const grades: Grade[] = [
  { id: "g11", levelId: "secondary", nameFa: "پایه یازدهم", nameEn: "Grade 11", order: 11, active: true  },
];

export const majors: Major[] = [
  { id: "experimental", gradeId: "g11", nameFa: "علوم تجربی", nameEn: "Experimental Sciences", active: true },
];

// Curriculum content is intentionally empty for MVP. It will be populated
// through the import workflow rather than generated or bundled in the app.
export const subjects: Subject[] = [];
export const chapters: Chapter[] = [];
export const sections: Section[] = [];
export const atoms: Atom[] = [];
export const microAtoms: MicroAtom[] = [];
export const questions: Question[] = [];

// ---------------------------------------------------------------------------
// Active scope — v1 default for the whole app.
// All feature modules (planner, exams, homework, analytics, AI) read from
// this object so when we add Grade 10 or Math major we just change the scope
// rather than touching feature code.
// ---------------------------------------------------------------------------

export interface ActiveScope {
  levelId: ID;
  gradeId: ID;
  majorId: ID;
}

export const DEFAULT_ACTIVE_SCOPE: ActiveScope = {
  levelId: "secondary",
  gradeId: "g11",
  majorId: "experimental",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const byId = <T extends { id: ID }>(arr: T[], id: ID) => arr.find((x) => x.id === id);

export function subjectsForScope(scope: ActiveScope = DEFAULT_ACTIVE_SCOPE) {
  return subjects.filter((s) => s.majorId === scope.majorId && s.active);
}
export function chaptersForSubject(subjectId: ID) {
  return chapters.filter((c) => c.subjectId === subjectId).sort((a, b) => a.order - b.order);
}
export function sectionsForChapter(chapterId: ID) {
  return sections.filter((section) => section.chapterId === chapterId).sort((a, b) => a.order - b.order);
}
export function atomsForSection(sectionId: ID) {
  return atoms.filter((atom) => atom.sectionId === sectionId).sort((x, y) => x.order - y.order);
}
export function microAtomsForAtom(atomId: ID) {
  return microAtoms.filter((m) => m.atomId === atomId);
}

export const HIERARCHY_LEVELS = [
  "Education Level",
  "Grade",
  "Major",
  "Subject",
  "Chapter",
  "Section",
  "Atom",
  "MicroAtom",
  "Question",
] as const;

export const HIERARCHY_LEVELS_FA = [
  "مقطع تحصیلی",
  "پایه",
  "رشته",
  "درس",
  "فصل",
  "گفتار",
  "اتم",
  "میکرواتم",
  "سؤال",
] as const;
