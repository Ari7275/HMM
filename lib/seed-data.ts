import type {
  AppStorageData,
  FinalDraft,
  FinalSeed,
  InitialDraft,
  InitialSeed,
} from "@/lib/types";

export const INITIAL_SEEDS: InitialSeed[] = [
  { id: "null-initial", pinyin: "ø", actorCategory: "male" },
  { id: "b", pinyin: "b", actorCategory: "male" },
  { id: "p", pinyin: "p", actorCategory: "male" },
  { id: "m", pinyin: "m", actorCategory: "male" },
  { id: "f", pinyin: "f", actorCategory: "male" },
  { id: "d", pinyin: "d", actorCategory: "male" },
  { id: "t", pinyin: "t", actorCategory: "male" },
  { id: "n", pinyin: "n", actorCategory: "male" },
  { id: "l", pinyin: "l", actorCategory: "male" },
  { id: "z", pinyin: "z", actorCategory: "male" },
  { id: "c", pinyin: "c", actorCategory: "male" },
  { id: "s", pinyin: "s", actorCategory: "male" },
  { id: "zh", pinyin: "zh", actorCategory: "male" },
  { id: "ch", pinyin: "ch", actorCategory: "male" },
  { id: "sh", pinyin: "sh", actorCategory: "male" },
  { id: "r", pinyin: "r", actorCategory: "male" },
  { id: "g", pinyin: "g", actorCategory: "male" },
  { id: "k", pinyin: "k", actorCategory: "male" },
  { id: "h", pinyin: "h", actorCategory: "male" },
  { id: "y", pinyin: "yi", actorCategory: "female" },
  { id: "bi", pinyin: "bi", actorCategory: "female" },
  { id: "pi", pinyin: "pi", actorCategory: "female" },
  { id: "mi", pinyin: "mi", actorCategory: "female" },
  { id: "di", pinyin: "di", actorCategory: "female" },
  { id: "ti", pinyin: "ti", actorCategory: "female" },
  { id: "ni", pinyin: "ni", actorCategory: "female" },
  { id: "li", pinyin: "li", actorCategory: "female" },
  { id: "ji", pinyin: "ji", actorCategory: "female" },
  { id: "qi", pinyin: "qi", actorCategory: "female" },
  { id: "xi", pinyin: "xi", actorCategory: "female" },
  { id: "w", pinyin: "wu", actorCategory: "fictional" },
  { id: "bu", pinyin: "bu", actorCategory: "fictional" },
  { id: "pu", pinyin: "pu", actorCategory: "fictional" },
  { id: "mu", pinyin: "mu", actorCategory: "fictional" },
  { id: "fu", pinyin: "fu", actorCategory: "fictional" },
  { id: "du", pinyin: "du", actorCategory: "fictional" },
  { id: "tu", pinyin: "tu", actorCategory: "fictional" },
  { id: "nu", pinyin: "nu", actorCategory: "fictional" },
  { id: "lu", pinyin: "lu", actorCategory: "fictional" },
  { id: "zu", pinyin: "zu", actorCategory: "fictional" },
  { id: "cu", pinyin: "cu", actorCategory: "fictional" },
  { id: "su", pinyin: "su", actorCategory: "fictional" },
  { id: "zhu", pinyin: "zhu", actorCategory: "fictional" },
  { id: "chu", pinyin: "chu", actorCategory: "fictional" },
  { id: "shu", pinyin: "shu", actorCategory: "fictional" },
  { id: "ru", pinyin: "ru", actorCategory: "fictional" },
  { id: "gu", pinyin: "gu", actorCategory: "fictional" },
  { id: "ku", pinyin: "ku", actorCategory: "fictional" },
  { id: "hu", pinyin: "hu", actorCategory: "fictional" },
  { id: "yu", pinyin: "yu", actorCategory: "wildcard" },
  { id: "nv", pinyin: "nü", actorCategory: "wildcard" },
  { id: "lv", pinyin: "lü", actorCategory: "wildcard" },
  { id: "ju", pinyin: "ju", actorCategory: "wildcard" },
  { id: "qu", pinyin: "qu", actorCategory: "wildcard" },
  { id: "xu", pinyin: "xu", actorCategory: "wildcard" },
];

export const FINAL_SEEDS: FinalSeed[] = [
  { id: "a", pinyin: "a", category: "standard" },
  { id: "ai", pinyin: "ai", category: "standard" },
  { id: "ao", pinyin: "ao", category: "standard" },
  { id: "an", pinyin: "an", category: "standard" },
  { id: "ang", pinyin: "ang", category: "standard" },
  { id: "o", pinyin: "o", category: "standard" },
  { id: "ou", pinyin: "ou", category: "standard" },
  { id: "ong", pinyin: "ong", category: "standard" },
  { id: "e", pinyin: "e", category: "standard" },
  { id: "ei", pinyin: "ei", category: "standard" },
  { id: "en", pinyin: "en", category: "standard" },
  { id: "eng", pinyin: "eng", category: "standard" },
  { id: "null-final", pinyin: "ø", category: "null" },
];

export const SET_LOCATION_OPTIONS = [
  "outside front entrance",
  "hallway",
  "lobby",
  "kitchen",
  "living room",
  "bedroom",
  "bathroom",
  "backyard",
  "roof",
] as const;

export const createEmptyInitialDraft = (): InitialDraft => ({
  actorName: "",
  description: "",
  notes: "",
});

export const createEmptyFinalDraft = (): FinalDraft => ({
  setName: "",
  description: "",
  locations: [],
  notes: "",
});

export const createEmptyStorageData = (): AppStorageData => ({
  version: 2,
  initials: Object.fromEntries(
    INITIAL_SEEDS.map((item) => [item.id, createEmptyInitialDraft()]),
  ),
  finals: Object.fromEntries(
    FINAL_SEEDS.map((item) => [item.id, createEmptyFinalDraft()]),
  ),
  initialMeta: Object.fromEntries(
    INITIAL_SEEDS.map((item) => [item.id, { lastEditedAt: null }]),
  ),
  finalMeta: Object.fromEntries(
    FINAL_SEEDS.map((item) => [item.id, { lastEditedAt: null }]),
  ),
  recentEdits: [],
});
