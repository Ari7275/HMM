import { createEmptyStorageData } from "@/lib/seed-data";
import type { AppStorageData, FinalDraft, LegacyFinalDraftShape } from "@/lib/types";

export const STORAGE_KEY = "mandarin-blueprint-mappings";

function appendLegacyZonesToNotes(notes: string, zones: string): string {
  const trimmedZones = zones.trim();

  if (!trimmedZones) {
    return notes;
  }

  const trimmedNotes = notes.trim();

  if (!trimmedNotes) {
    return `Legacy zones:\n${trimmedZones}`;
  }

  if (trimmedNotes.includes(trimmedZones)) {
    return trimmedNotes;
  }

  return `${trimmedNotes}\n\nLegacy zones:\n${trimmedZones}`;
}

export function normalizeFinalDraft(input?: LegacyFinalDraftShape): FinalDraft {
  const rawNotes = typeof input?.notes === "string" ? input.notes : "";
  const rawZones = typeof input?.zones === "string" ? input.zones : "";
  const rawLocations = Array.isArray(input?.locations)
    ? input.locations.filter((value): value is string => typeof value === "string")
    : [];

  return {
    setName: typeof input?.setName === "string" ? input.setName : "",
    description: typeof input?.description === "string" ? input.description : "",
    locations: rawLocations,
    notes: appendLegacyZonesToNotes(rawNotes, rawZones),
  };
}

export function mergeWithDefaults(partial?: Partial<AppStorageData>): AppStorageData {
  const defaults = createEmptyStorageData();

  if (!partial) {
    return defaults;
  }

  return {
    version: defaults.version,
    initials: { ...defaults.initials, ...partial.initials },
    finals: Object.fromEntries(
      Object.entries({ ...defaults.finals, ...partial.finals }).map(([key, value]) => [
        key,
        normalizeFinalDraft(value as LegacyFinalDraftShape | undefined),
      ]),
    ),
    initialMeta: { ...defaults.initialMeta, ...partial.initialMeta },
    finalMeta: { ...defaults.finalMeta, ...partial.finalMeta },
    recentEdits: partial.recentEdits?.slice(0, 8) ?? defaults.recentEdits,
  };
}

export function loadStorageData(): AppStorageData {
  if (typeof window === "undefined") {
    return createEmptyStorageData();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return createEmptyStorageData();
    }

    const parsed = JSON.parse(raw) as Partial<AppStorageData>;
    return mergeWithDefaults(parsed);
  } catch {
    return createEmptyStorageData();
  }
}

export function saveStorageData(data: AppStorageData): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearStorageData(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
