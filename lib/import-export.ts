import { z } from "zod";

import { createEmptyStorageData, FINAL_SEEDS, INITIAL_SEEDS } from "@/lib/seed-data";
import { getFinalStatus, getInitialStatus } from "@/lib/status";
import {
  mergeWithDefaults,
  normalizeFinalDraft as normalizeStoredFinalDraft,
} from "@/lib/storage";
import type {
  AppStorageData,
  ExportFinalItem,
  ExportInitialItem,
  FinalDraft,
  InitialDraft,
  MappingExportPayload,
} from "@/lib/types";

const exportInitialSchema = z.object({
  id: z.string(),
  pinyin: z.string(),
  actorCategory: z.enum(["male", "female", "fictional", "wildcard"]).optional(),
  actorName: z.string().default(""),
  description: z.string().default(""),
  notes: z.string().default(""),
  status: z.enum(["empty", "complete"]).optional(),
});

const exportFinalSchema = z.object({
  id: z.string(),
  pinyin: z.string(),
  setName: z.string().default(""),
  description: z.string().default(""),
  locations: z.array(z.string()).default([]),
  notes: z.string().default(""),
  zones: z.string().optional(),
  status: z.enum(["empty", "complete"]).optional(),
});

const exportPayloadSchema = z.object({
  version: z.number().int().positive().optional(),
  exportedAt: z.string().optional(),
  initials: z.array(exportInitialSchema),
  finals: z.array(exportFinalSchema),
});

const initialPinyinAliases: Record<string, string[]> = {
  yi: ["y"],
  wu: ["w"],
  ø: ["Ø"],
};

const finalPinyinAliases: Record<string, string[]> = {
  ø: ["Ø"],
};

function normalizeInitialDraft(draft: Partial<InitialDraft>): InitialDraft {
  return {
    actorName: draft.actorName ?? "",
    description: draft.description ?? "",
    notes: draft.notes ?? "",
  };
}

function normalizeFinalDraft(draft: Partial<FinalDraft>): FinalDraft {
  return normalizeStoredFinalDraft(draft);
}

export function createExportPayload(data: AppStorageData): MappingExportPayload {
  const initials: ExportInitialItem[] = INITIAL_SEEDS.map((seed) => {
    const draft = normalizeInitialDraft(data.initials[seed.id]);

    return {
      id: seed.id,
      pinyin: seed.pinyin,
      actorCategory: seed.actorCategory,
      ...draft,
      status: getInitialStatus(draft.actorName),
    };
  });

  const finals: ExportFinalItem[] = FINAL_SEEDS.map((seed) => {
    const draft = normalizeFinalDraft(data.finals[seed.id]);

    return {
      id: seed.id,
      pinyin: seed.pinyin,
      ...draft,
      status: getFinalStatus(draft.setName),
    };
  });

  return {
    version: data.version,
    exportedAt: new Date().toISOString(),
    initials,
    finals,
  };
}

export function serializeExportPayload(data: AppStorageData): string {
  return JSON.stringify(createExportPayload(data), null, 2);
}

export function parseImportPayload(text: string): AppStorageData {
  const raw = JSON.parse(text) as unknown;
  const parsed = exportPayloadSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error("Import file is not a valid mappings export.");
  }

  const defaults = createEmptyStorageData();

  for (const item of parsed.data.initials) {
    const seed = INITIAL_SEEDS.find((candidate) => candidate.id === item.id);

    const validPinyin = seed
      ? [seed.pinyin, ...(initialPinyinAliases[seed.pinyin] ?? [])]
      : [];

    if (!seed || !validPinyin.includes(item.pinyin)) {
      continue;
    }

    defaults.initials[item.id] = normalizeInitialDraft(item);
  }

  for (const item of parsed.data.finals) {
    const seed = FINAL_SEEDS.find((candidate) => candidate.id === item.id);

    const validPinyin = seed
      ? [seed.pinyin, ...(finalPinyinAliases[seed.pinyin] ?? [])]
      : [];

    if (!seed || !validPinyin.includes(item.pinyin)) {
      continue;
    }

    defaults.finals[item.id] = normalizeFinalDraft(item);
  }

  return mergeWithDefaults(defaults);
}
