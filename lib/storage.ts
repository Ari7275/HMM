import { createEmptyStorageData } from "@/lib/seed-data";
import type { AppStorageData } from "@/lib/types";

export const STORAGE_KEY = "mandarin-blueprint-mappings";

export function mergeWithDefaults(partial?: Partial<AppStorageData>): AppStorageData {
  const defaults = createEmptyStorageData();

  if (!partial) {
    return defaults;
  }

  return {
    version: partial.version ?? defaults.version,
    initials: { ...defaults.initials, ...partial.initials },
    finals: { ...defaults.finals, ...partial.finals },
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
