/**
 * Study Dose service — wired to Xano.
 *
 * Endpoints:
 *   POST /study-dose/create
 *   GET  /study-dose/my
 *   GET  /study-dose/student/{student_id}
 */
import { apiClient } from "@/lib/api/client";
import type { DoseEntry } from "@/lib/mock/biology-ch1";

interface RawDose {
  id?: number | string;
  student_id?: number | string;
  user_id?: number | string;
  micro_atom_id?: string;
  microAtomId?: string;
  minutes?: number;
  created_at?: number | string;
  at?: number;
}

function normalize(r: RawDose): DoseEntry {
  const at =
    typeof r.created_at === "number"
      ? r.created_at
      : r.created_at
        ? new Date(r.created_at).getTime()
        : (r.at ?? Date.now());
  return {
    id: String(r.id ?? `d-${at}`),
    studentId: String(r.student_id ?? r.user_id ?? ""),
    microAtomId: String(r.micro_atom_id ?? r.microAtomId ?? ""),
    minutes: Number(r.minutes ?? 0),
    at,
  };
}

function toList(payload: unknown): DoseEntry[] {
  const arr = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as { items?: unknown[] })?.items)
      ? (payload as { items: unknown[] }).items
      : [];
  return (arr as RawDose[]).map(normalize);
}

export async function createStudyDose(input: {
  microAtomId: string;
  minutes: number;
  studentId?: string;
}): Promise<DoseEntry> {
  const res = await apiClient.post<RawDose>("/study-dose/create", {
    micro_atom_id: input.microAtomId,
    minutes: input.minutes,
    ...(input.studentId ? { student_id: input.studentId } : {}),
  });
  return normalize(res.data ?? {});
}

export async function listMyStudyDoses(): Promise<DoseEntry[]> {
  const res = await apiClient.get<unknown>("/study-dose/my");
  return toList(res.data);
}

export async function listStudentStudyDoses(
  studentId: string,
): Promise<DoseEntry[]> {
  const res = await apiClient.get<unknown>(
    `/study-dose/student/${encodeURIComponent(studentId)}`,
  );
  return toList(res.data);
}
