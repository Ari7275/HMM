import type { FilterStatus, FinalItem, InitialItem } from "@/lib/types";

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
): InitialItem[] {
  return items.filter((item) => {
    const matchesStatus = filter === "all" ? true : item.status === filter;
    const matchesSearch = matchesQuery(
      [item.pinyin, item.actorName, item.description, item.notes],
      query,
    );

    return matchesStatus && matchesSearch;
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
      [item.pinyin, item.setName, item.description, item.zones, item.notes],
      query,
    );

    return matchesStatus && matchesSearch;
  });
}
