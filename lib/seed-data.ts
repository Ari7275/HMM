import type {
  AppStorageData,
  FinalDraft,
  FinalSeed,
  InitialDraft,
  InitialSeed,
  ToneAreaReference,
} from "@/lib/types";

export const INITIAL_SEEDS: InitialSeed[] = [
  { id: "sh", pinyin: "sh", actorCategory: "male", frequencyCount: 142 },
  { id: "ji", pinyin: "ji", actorCategory: "female", frequencyCount: 136 },
  { id: "null-initial", pinyin: "ø", actorCategory: "male", frequencyCount: 131 },
  { id: "xi", pinyin: "xi", actorCategory: "female", frequencyCount: 127 },
  { id: "zh", pinyin: "zh", actorCategory: "male", frequencyCount: 127 },
  { id: "d", pinyin: "d", actorCategory: "male", frequencyCount: 113 },
  { id: "y", pinyin: "yi", actorCategory: "female", frequencyCount: 103 },
  { id: "g", pinyin: "g", actorCategory: "male", frequencyCount: 102 },
  { id: "s", pinyin: "s", actorCategory: "male", frequencyCount: 96 },
  { id: "ju", pinyin: "ju", actorCategory: "wildcard", frequencyCount: 89 },
  { id: "t", pinyin: "t", actorCategory: "male", frequencyCount: 89 },
  { id: "h", pinyin: "h", actorCategory: "male", frequencyCount: 86 },
  { id: "qi", pinyin: "qi", actorCategory: "female", frequencyCount: 85 },
  { id: "c", pinyin: "c", actorCategory: "male", frequencyCount: 75 },
  { id: "b", pinyin: "b", actorCategory: "male", frequencyCount: 73 },
  { id: "li", pinyin: "li", actorCategory: "female", frequencyCount: 72 },
  { id: "z", pinyin: "z", actorCategory: "male", frequencyCount: 71 },
  { id: "xu", pinyin: "xu", actorCategory: "wildcard", frequencyCount: 68 },
  { id: "hu", pinyin: "hu", actorCategory: "fictional", frequencyCount: 63 },
  { id: "m", pinyin: "m", actorCategory: "male", frequencyCount: 62 },
  { id: "k", pinyin: "k", actorCategory: "male", frequencyCount: 58 },
  { id: "shu", pinyin: "shu", actorCategory: "fictional", frequencyCount: 58 },
  { id: "l", pinyin: "l", actorCategory: "male", frequencyCount: 57 },
  { id: "ch", pinyin: "ch", actorCategory: "male", frequencyCount: 56 },
  { id: "gu", pinyin: "gu", actorCategory: "fictional", frequencyCount: 52 },
  { id: "qu", pinyin: "qu", actorCategory: "wildcard", frequencyCount: 52 },
  { id: "zhu", pinyin: "zhu", actorCategory: "fictional", frequencyCount: 50 },
  { id: "p", pinyin: "p", actorCategory: "male", frequencyCount: 48 },
  { id: "f", pinyin: "f", actorCategory: "male", frequencyCount: 46 },
  { id: "w", pinyin: "wu", actorCategory: "fictional", frequencyCount: 45 },
  { id: "bi", pinyin: "bi", actorCategory: "female", frequencyCount: 43 },
  { id: "r", pinyin: "r", actorCategory: "male", frequencyCount: 42 },
  { id: "du", pinyin: "du", actorCategory: "fictional", frequencyCount: 39 },
  { id: "ti", pinyin: "ti", actorCategory: "female", frequencyCount: 38 },
  { id: "di", pinyin: "di", actorCategory: "female", frequencyCount: 37 },
  { id: "chu", pinyin: "chu", actorCategory: "fictional", frequencyCount: 36 },
  { id: "n", pinyin: "n", actorCategory: "male", frequencyCount: 35 },
  { id: "mi", pinyin: "mi", actorCategory: "female", frequencyCount: 32 },
  { id: "ku", pinyin: "ku", actorCategory: "fictional", frequencyCount: 31 },
  { id: "yu", pinyin: "yu", actorCategory: "wildcard", frequencyCount: 31 },
  { id: "ni", pinyin: "ni", actorCategory: "female", frequencyCount: 28 },
  { id: "bu", pinyin: "bu", actorCategory: "fictional", frequencyCount: 28 },
  { id: "lu", pinyin: "lu", actorCategory: "fictional", frequencyCount: 27 },
  { id: "tu", pinyin: "tu", actorCategory: "fictional", frequencyCount: 26 },
  { id: "fu", pinyin: "fu", actorCategory: "fictional", frequencyCount: 24 },
  { id: "pi", pinyin: "pi", actorCategory: "female", frequencyCount: 21 },
  { id: "ru", pinyin: "ru", actorCategory: "fictional", frequencyCount: 21 },
  { id: "zu", pinyin: "zu", actorCategory: "fictional", frequencyCount: 18 },
  { id: "mu", pinyin: "mu", actorCategory: "fictional", frequencyCount: 16 },
  { id: "pu", pinyin: "pu", actorCategory: "fictional", frequencyCount: 14 },
  { id: "su", pinyin: "su", actorCategory: "fictional", frequencyCount: 12 },
  { id: "nu", pinyin: "nu", actorCategory: "fictional", frequencyCount: 8 },
  { id: "cu", pinyin: "cu", actorCategory: "fictional", frequencyCount: 6 },
  { id: "lv", pinyin: "lü", actorCategory: "wildcard", frequencyCount: 3 },
  { id: "nv", pinyin: "nü", actorCategory: "wildcard", frequencyCount: 2 },
];

export const FINAL_SEEDS: FinalSeed[] = [
  { id: "null-final", pinyin: "ø", category: "null", frequencyCount: 652 },
  { id: "an", pinyin: "an", category: "standard", frequencyCount: 398 },
  { id: "en", pinyin: "en", category: "standard", frequencyCount: 312 },
  { id: "eng", pinyin: "eng", category: "standard", frequencyCount: 287 },
  { id: "ao", pinyin: "ao", category: "standard", frequencyCount: 243 },
  { id: "ou", pinyin: "ou", category: "standard", frequencyCount: 219 },
  { id: "e", pinyin: "e", category: "standard", frequencyCount: 198 },
  { id: "ai", pinyin: "ai", category: "standard", frequencyCount: 186 },
  { id: "ang", pinyin: "ang", category: "standard", frequencyCount: 168 },
  { id: "a", pinyin: "a", category: "standard", frequencyCount: 138 },
  { id: "ong", pinyin: "ong", category: "standard", frequencyCount: 117 },
  { id: "ei", pinyin: "ei", category: "standard", frequencyCount: 86 },
  { id: "o", pinyin: "o", category: "standard", frequencyCount: 46 },
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

export const TONE_AREA_REFERENCE: ToneAreaReference[] = [
  { tone: 1, areas: ["Outside Front Entrance"], frequencyCount: 745 },
  { tone: 2, areas: ["Hallway", "Lobby", "Kitchen"], frequencyCount: 703 },
  { tone: 3, areas: ["Bedroom", "Living Room"], frequencyCount: 543 },
  { tone: 4, areas: ["Bathroom", "Backyard"], frequencyCount: 1047 },
  { tone: 0, areas: ["Roof"], frequencyCount: 12 },
];

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
