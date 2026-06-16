/**
 * Resource service — learning resources keyed to atom bits.
 */
import { getAtomBits, getSubjects } from "@/lib/mock";
import type { AtomBit, Subject } from "@/lib/types";

export interface LearningResource {
  id: string;
  title: string;
  atomBitId: string;
  subjectId: string;
  kind: "video" | "reading" | "exercise";
  url?: string;
}

async function buildResources(): Promise<LearningResource[]> {
  const atomBits = await getAtomBits();
  return atomBits.flatMap<LearningResource>((bit: AtomBit) => [
    {
      id: `${bit.id}-video`,
      title: `ویدئو: ${bit.title}`,
      atomBitId: bit.id,
      subjectId: bit.subjectId,
      kind: "video",
    },
    {
      id: `${bit.id}-reading`,
      title: `جزوه: ${bit.title}`,
      atomBitId: bit.id,
      subjectId: bit.subjectId,
      kind: "reading",
    },
    {
      id: `${bit.id}-exercise`,
      title: `تمرین: ${bit.title}`,
      atomBitId: bit.id,
      subjectId: bit.subjectId,
      kind: "exercise",
    },
  ]);
}

export async function getLearningResources(): Promise<{
  subjects: Subject[];
  resources: LearningResource[];
}> {
  const [subjects, resources] = await Promise.all([getSubjects(), buildResources()]);
  return { subjects, resources };
}

export async function getResourcesByAtomBit(atomBitId: string): Promise<LearningResource[]> {
  const resources = await buildResources();
  return resources.filter((r) => r.atomBitId === atomBitId);
}
