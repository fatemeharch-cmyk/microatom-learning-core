import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  DEFAULT_ACTIVE_SCOPE,
  byId,
  educationLevels,
  grades,
  majors,
  type ActiveScope,
  type EducationLevel,
  type Grade,
  type Major,
} from "./content-taxonomy";

interface ScopeContextValue {
  scope: ActiveScope;
  setScope: (s: ActiveScope) => void;
  level: EducationLevel | undefined;
  grade: Grade | undefined;
  major: Major | undefined;
  /** v1 lock — true while only Grade 11 Experimental is shipped. */
  locked: boolean;
}

const ScopeContext = createContext<ScopeContextValue | null>(null);

export function ScopeProvider({ children }: { children: ReactNode }) {
  const [scope, setScope] = useState<ActiveScope>(DEFAULT_ACTIVE_SCOPE);
  const value = useMemo<ScopeContextValue>(
    () => ({
      scope,
      setScope,
      level: byId(educationLevels, scope.levelId),
      grade: byId(grades, scope.gradeId),
      major: byId(majors, scope.majorId),
      locked: true,
    }),
    [scope],
  );
  return <ScopeContext.Provider value={value}>{children}</ScopeContext.Provider>;
}

export function useScope() {
  const ctx = useContext(ScopeContext);
  if (!ctx) {
    // Safe fallback so non-wrapped trees still render with the v1 defaults.
    return {
      scope: DEFAULT_ACTIVE_SCOPE,
      setScope: () => {},
      level: byId(educationLevels, DEFAULT_ACTIVE_SCOPE.levelId),
      grade: byId(grades, DEFAULT_ACTIVE_SCOPE.gradeId),
      major: byId(majors, DEFAULT_ACTIVE_SCOPE.majorId),
      locked: true,
    } satisfies ScopeContextValue;
  }
  return ctx;
}
