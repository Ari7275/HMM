export type MappingStatus = "empty" | "complete";
export type FilterStatus = "all" | MappingStatus;

export type InitialCategory =
  | "male"
  | "female"
  | "fictional"
  | "leader"
  | "null";

export type FinalCategory = "standard" | "null";

export interface InitialSeed {
  id: string;
  pinyin: string;
  category: InitialCategory;
  groupLabel: string;
}

export interface FinalSeed {
  id: string;
  pinyin: string;
  category: FinalCategory;
  groupLabel: string;
}

export interface InitialDraft {
  actorName: string;
  description: string;
  notes: string;
}

export interface FinalDraft {
  setName: string;
  description: string;
  zones: string;
  notes: string;
}

export interface InitialItem extends InitialSeed, InitialDraft {
  status: MappingStatus;
  lastEditedAt: string | null;
}

export interface FinalItem extends FinalSeed, FinalDraft {
  status: MappingStatus;
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
