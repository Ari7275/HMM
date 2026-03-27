import type {
  FilterStatus,
  FinalItem,
  InitialActorCategoryFilter,
  InitialItem,
  MappingSortOption,
} from "@/lib/types";

function matchesQuery(values: string[], query: string): boolean {
  if (!query.trim()) {
    return true;
  }

  const normalizedQuery = query.trim().toLowerCase();
  return values.some((value) => value.toLowerCase().includes(normalizedQuery));
}

export function filterInitialItems(
  items: InitialItem[],
  query: string,
  filter: FilterStatus,
  categoryFilter: InitialActorCategoryFilter,
): InitialItem[] {
  return items.filter((item) => {
    const matchesStatus = filter === "all" ? true : item.status === filter;
    const matchesSearch = matchesQuery(
      [item.pinyin, item.actorCategory, item.actorName, item.description, item.notes],
      query,
    );
    const matchesCategory =
      categoryFilter === "all" ? true : item.actorCategory === categoryFilter;

    return matchesStatus && matchesSearch && matchesCategory;
  });
}

export function filterFinalItems(
  items: FinalItem[],
  query: string,
  filter: FilterStatus,
): FinalItem[] {
  return items.filter((item) => {
    const matchesStatus = filter === "all" ? true : item.status === filter;
    const matchesSearch = matchesQuery(
      [item.pinyin, item.setName, item.description, item.locations.join(" "), item.notes],
      query,
    );

    return matchesStatus && matchesSearch;
  });
}

function compareAlphabetically(a: { pinyin: string }, b: { pinyin: string }) {
  return a.pinyin.localeCompare(b.pinyin);
}

export function sortInitialItems(
  items: InitialItem[],
  sort: MappingSortOption,
): InitialItem[] {
  const nextItems = [...items];

  if (sort === "none") {
    return nextItems;
  }

  if (sort === "alphabetical") {
    return nextItems.sort(compareAlphabetically);
  }

  return nextItems.sort((a, b) => {
    if (b.frequencyCount !== a.frequencyCount) {
      return b.frequencyCount - a.frequencyCount;
    }

    return compareAlphabetically(a, b);
  });
}

export function sortFinalItems(
  items: FinalItem[],
  sort: MappingSortOption,
): FinalItem[] {
  const nextItems = [...items];

  if (sort === "none") {
    return nextItems;
  }

  if (sort === "alphabetical") {
    return nextItems.sort(compareAlphabetically);
  }

  return nextItems.sort((a, b) => {
    if (b.frequencyCount !== a.frequencyCount) {
      return b.frequencyCount - a.frequencyCount;
    }

    return compareAlphabetically(a, b);
  });
}
