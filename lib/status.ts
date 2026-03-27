import { FINAL_SEEDS, INITIAL_SEEDS } from "@/lib/seed-data";
import type {
  AppStorageData,
  FrequencyTier,
  FinalItem,
  InitialItem,
  MappingStatus,
  TotalsSummary,
} from "@/lib/types";

export function getInitialStatus(actorName: string): MappingStatus {
  return actorName.trim() ? "complete" : "empty";
}

export function getFinalStatus(setName: string): MappingStatus {
  return setName.trim() ? "complete" : "empty";
}

export function getFrequencyTier(frequencyCount: number): FrequencyTier {
  if (frequencyCount >= 120) {
    return "very-high";
  }

  if (frequencyCount >= 80) {
    return "high";
  }

  if (frequencyCount >= 40) {
    return "medium";
  }

  if (frequencyCount >= 15) {
    return "low";
  }

  return "rare";
}

export function buildInitialItems(data: AppStorageData): InitialItem[] {
  return INITIAL_SEEDS.map((seed) => {
    const draft = data.initials[seed.id];
    const meta = data.initialMeta[seed.id];

    return {
      ...seed,
      actorName: draft?.actorName ?? "",
      description: draft?.description ?? "",
      notes: draft?.notes ?? "",
      status: getInitialStatus(draft?.actorName ?? ""),
      frequencyTier: getFrequencyTier(seed.frequencyCount),
      lastEditedAt: meta?.lastEditedAt ?? null,
    };
  });
}

export function buildFinalItems(data: AppStorageData): FinalItem[] {
  return FINAL_SEEDS.map((seed) => {
    const draft = data.finals[seed.id];
    const meta = data.finalMeta[seed.id];

    return {
      ...seed,
      setName: draft?.setName ?? "",
      description: draft?.description ?? "",
      locations: draft?.locations ?? [],
      notes: draft?.notes ?? "",
      status: getFinalStatus(draft?.setName ?? ""),
      frequencyTier: getFrequencyTier(seed.frequencyCount),
      lastEditedAt: meta?.lastEditedAt ?? null,
    };
  });
}

export function getTotalsSummary(data: AppStorageData): TotalsSummary {
  const initials = buildInitialItems(data);
  const finals = buildFinalItems(data);

  const completedInitials = initials.filter(
    (item) => item.status === "complete",
  ).length;
  const completedFinals = finals.filter((item) => item.status === "complete").length;

  return {
    initials: {
      completed: completedInitials,
      total: initials.length,
    },
    finals: {
      completed: completedFinals,
      total: finals.length,
    },
    overall: {
      completed: completedInitials + completedFinals,
      total: initials.length + finals.length,
    },
  };
}
