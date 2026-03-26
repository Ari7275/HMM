import { Compass, SearchX, Sparkles } from "lucide-react";

import { MappingCard } from "@/components/mapping-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MappingStatus } from "@/lib/types";

export interface MappingGridItem {
  id: string;
  pinyin: string;
  name: string;
  groupLabel: string;
  status: MappingStatus;
  lastEditedAt: string | null;
}

interface MappingGridProps {
  title: string;
  description: string;
  totalCount: number;
  visibleCount: number;
  items: MappingGridItem[];
  recentIds: Set<string>;
  onSelect: (id: string) => void;
  emptyTitle: string;
  emptyDescription: string;
  showOnboardingHint?: boolean;
}

export function MappingGrid({
  title,
  description,
  totalCount,
  visibleCount,
  items,
  recentIds,
  onSelect,
  emptyTitle,
  emptyDescription,
  showOnboardingHint = false,
}: MappingGridProps) {
  return (
    <Card className="glass-panel overflow-hidden">
      <CardHeader className="border-b border-white/6 pb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="text-xl text-white">{title}</CardTitle>
            <p className="max-w-xl text-sm leading-6 text-slate-300">{description}</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Visible</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {visibleCount}/{totalCount}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        {items.length ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <MappingCard
                key={item.id}
                pinyin={item.pinyin}
                name={item.name}
                status={item.status}
                groupLabel={item.groupLabel}
                lastEditedAt={item.lastEditedAt}
                isRecent={recentIds.has(item.id)}
                onClick={() => onSelect(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-[26px] border border-dashed border-white/10 bg-white/[0.03] px-6 text-center">
            <div className="rounded-full border border-white/10 bg-white/5 p-4">
              {showOnboardingHint ? (
                <Sparkles className="h-6 w-6 text-indigo-200" />
              ) : (
                <SearchX className="h-6 w-6 text-slate-300" />
              )}
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">{emptyTitle}</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
              {emptyDescription}
            </p>
            {showOnboardingHint ? (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-indigo-300/15 bg-indigo-300/10 px-4 py-2 text-xs font-medium text-indigo-100">
                <Compass className="h-3.5 w-3.5" />
                Start with the initials or finals you use most often.
              </div>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
