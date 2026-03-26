import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FilterStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SearchFilterBarProps {
  query: string;
  filter: FilterStatus;
  onQueryChange: (value: string) => void;
  onFilterChange: (value: FilterStatus) => void;
}

const FILTERS: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "complete", label: "Complete" },
  { value: "empty", label: "Empty" },
];

export function SearchFilterBar({
  query,
  filter,
  onQueryChange,
  onFilterChange,
}: SearchFilterBarProps) {
  return (
    <div className="glass-panel grid gap-4 rounded-[28px] p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by pinyin, actor name, set name, description, notes..."
          className="pl-11"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <Button
            key={item.value}
            variant={filter === item.value ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(item.value)}
            className={cn(
              "min-w-24",
              filter !== item.value && "bg-white/4 hover:bg-white/8",
            )}
          >
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
