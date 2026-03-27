export type MappingStatus = "empty" | "complete";
export type FilterStatus = "all" | MappingStatus;
export type InitialActorCategory = "male" | "female" | "fictional" | "wildcard";
export type InitialActorCategoryFilter = "all" | InitialActorCategory;
export type FrequencyTier = "very-high" | "high" | "medium" | "low" | "rare";
export type MappingSortOption = "none" | "frequency" | "alphabetical";

export type FinalCategory = "standard" | "null";

export interface InitialSeed {
  id: string;
  pinyin: string;
  actorCategory: InitialActorCategory;
  frequencyCount: number;
}

export interface FinalSeed {
  id: string;
  pinyin: string;
  category: FinalCategory;
  frequencyCount: number;
}

export interface InitialDraft {
  actorName: string;
  description: string;
  notes: string;
}

export interface FinalDraft {
  setName: string;
  description: string;
  locations: string[];
  notes: string;
}

export interface InitialItem extends InitialSeed, InitialDraft {
  status: MappingStatus;
  frequencyTier: FrequencyTier;
  lastEditedAt: string | null;
}

export interface FinalItem extends FinalSeed, FinalDraft {
  status: MappingStatus;
  frequencyTier: FrequencyTier;
  lastEditedAt: string | null;
}

export interface RecentEdit {
  kind: "initial" | "final";
  id: string;
  pinyin: string;
  label: string;
  updatedAt: string;
}

export interface StoredMetadata {
  lastEditedAt: string | null;
}

export interface ToneAreaReference {
  tone: 0 | 1 | 2 | 3 | 4;
  areas: string[];
  frequencyCount: number;
}

export interface AppStorageData {
  version: number;
  initials: Record<string, InitialDraft>;
  finals: Record<string, FinalDraft>;
  initialMeta: Record<string, StoredMetadata>;
  finalMeta: Record<string, StoredMetadata>;
  recentEdits: RecentEdit[];
}

export interface CompletionSummary {
  completed: number;
  total: number;
}

export interface TotalsSummary {
  initials: CompletionSummary;
  finals: CompletionSummary;
  overall: CompletionSummary;
}

export interface EditorSelection {
  kind: "initial" | "final";
  id: string;
}

export interface ExportInitialItem extends InitialDraft {
  id: string;
  pinyin: string;
  actorCategory: InitialActorCategory;
  status: MappingStatus;
}

export interface ExportFinalItem extends FinalDraft {
  id: string;
  pinyin: string;
  status: MappingStatus;
}

export interface MappingExportPayload {
  version: number;
  exportedAt: string;
  initials: ExportInitialItem[];
  finals: ExportFinalItem[];
}

export interface LegacyFinalDraftShape {
  setName?: unknown;
  description?: unknown;
  locations?: unknown;
  notes?: unknown;
  zones?: unknown;
}
