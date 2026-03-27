"use client";

import { motion } from "framer-motion";
import { Layers3, Sparkles, UsersRound } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { DashboardShell } from "@/components/dashboard-shell";
import { EditorSheet } from "@/components/editor/editor-sheet";
import { FinalEditor } from "@/components/editor/final-editor";
import { InitialEditor } from "@/components/editor/initial-editor";
import { ImportExportControls } from "@/components/import-export-controls";
import { MappingGrid, type MappingGridItem } from "@/components/mapping-grid";
import { ProgressOverview } from "@/components/progress-overview";
import { RecentEditsStrip } from "@/components/recent-edits-strip";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { TopPriorities } from "@/components/top-priorities";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMappingStore } from "@/hooks/use-mapping-store";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  getFinalStatus,
  getFrequencyTier,
  getInitialStatus,
} from "@/lib/status";
import {
  filterFinalItems,
  filterInitialItems,
  sortFinalItems,
  sortInitialItems,
} from "@/lib/search";
import type {
  EditorSelection,
  FilterStatus,
  FinalDraft,
  FinalItem,
  InitialActorCategoryFilter,
  InitialDraft,
  InitialItem,
  MappingSortOption,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const INITIAL_CATEGORY_FILTERS: {
  value: InitialActorCategoryFilter;
  label: string;
}[] = [
  { value: "all", label: "All categories" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "fictional", label: "Fictional" },
  { value: "wildcard", label: "Wildcard" },
];

const SORT_OPTIONS: { value: MappingSortOption; label: string }[] = [
  { value: "frequency", label: "By frequency" },
  { value: "alphabetical", label: "A-Z" },
];

const ACTIVE_SORT_CLASS =
  "border-cyan-300/35 bg-cyan-300/12 text-cyan-100 shadow-[0_10px_24px_rgba(56,189,248,0.12)] hover:bg-cyan-300/16";

function toInitialCard(item: InitialItem): MappingGridItem {
  return {
    id: item.id,
    kind: "initial",
    pinyin: item.pinyin,
    name: item.actorName,
    status: item.status,
    actorCategory: item.actorCategory,
    frequencyCount: item.frequencyCount,
    frequencyTier: item.frequencyTier,
    lastEditedAt: item.lastEditedAt,
  };
}

function toFinalCard(item: FinalItem): MappingGridItem {
  return {
    id: item.id,
    kind: "final",
    pinyin: item.pinyin,
    name: item.setName,
    status: item.status,
    locations: item.locations,
    frequencyCount: item.frequencyCount,
    frequencyTier: item.frequencyTier,
    lastEditedAt: item.lastEditedAt,
  };
}

function getFrequencyLabel(tier: ReturnType<typeof getFrequencyTier>) {
  switch (tier) {
    case "very-high":
      return "Very common";
    case "high":
      return "Common";
    case "medium":
      return "Regular";
    case "low":
      return "Uncommon";
    case "rare":
      return "Rare";
  }
}

function sortByPriority<T extends { status: string; frequencyCount: number; pinyin: string }>(
  items: T[],
) {
  return [...items].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === "empty" ? -1 : 1;
    }

    if (b.frequencyCount !== a.frequencyCount) {
      return b.frequencyCount - a.frequencyCount;
    }

    return a.pinyin.localeCompare(b.pinyin);
  });
}

function getEmptyContent({
  kind,
  hasNoMappings,
  query,
  filter,
}: {
  kind: "initials" | "finals";
  hasNoMappings: boolean;
  query: string;
  filter: FilterStatus;
}) {
  if (hasNoMappings && filter !== "complete" && !query.trim()) {
    return {
      title: `No ${kind} filled yet`,
      description:
        kind === "initials"
          ? "Start assigning actor names to your HMM initials. Every completed item will immediately light up in the grid."
          : "Start assigning set names to your finals. This section is intentionally simple so you can refine your foundations first.",
    };
  }

  return {
    title: `No ${kind} match this view`,
    description:
      "Try a different search term or switch the status filter to reveal more mappings.",
  };
}

export function MappingDashboard() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [initialCategoryFilter, setInitialCategoryFilter] =
    useState<InitialActorCategoryFilter>("all");
  const [initialSort, setInitialSort] = useState<MappingSortOption>("frequency");
  const [finalSort, setFinalSort] = useState<MappingSortOption>("frequency");
  const [mobileTab, setMobileTab] = useState<"initials" | "finals">("initials");
  const [selection, setSelection] = useState<EditorSelection | null>(null);
  const [initialDraft, setInitialDraft] = useState<InitialDraft | null>(null);
  const [finalDraft, setFinalDraft] = useState<FinalDraft | null>(null);
  const [pendingSelection, setPendingSelection] = useState<EditorSelection | null>(null);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const initialsSectionRef = useRef<HTMLDivElement | null>(null);
  const finalsSectionRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    initials,
    finals,
    totals,
    recentEdits,
    isSaving,
    lastSavedAt,
    saveInitial,
    saveFinal,
    replaceData,
    resetData,
  } = useMappingStore();

  const filteredInitials = useMemo(() => {
    return sortInitialItems(
      filterInitialItems(initials, query, filter, initialCategoryFilter),
      initialSort,
    );
  }, [filter, initialCategoryFilter, initialSort, initials, query]);
  const filteredFinals = useMemo(() => {
    return sortFinalItems(filterFinalItems(finals, query, filter), finalSort);
  }, [filter, finalSort, finals, query]);

  const selectedInitial =
    selection?.kind === "initial"
      ? initials.find((item) => item.id === selection.id) ?? null
      : null;
  const selectedFinal =
    selection?.kind === "final"
      ? finals.find((item) => item.id === selection.id) ?? null
      : null;

  const isInitialDirty = Boolean(
    selectedInitial &&
      initialDraft &&
      (selectedInitial.actorName !== initialDraft.actorName ||
        selectedInitial.description !== initialDraft.description ||
        selectedInitial.notes !== initialDraft.notes),
  );

  const isFinalDirty = Boolean(
    selectedFinal &&
      finalDraft &&
      (selectedFinal.setName !== finalDraft.setName ||
        selectedFinal.description !== finalDraft.description ||
        selectedFinal.locations.join("|") !== finalDraft.locations.join("|") ||
        selectedFinal.notes !== finalDraft.notes),
  );

  const hasUnsavedChanges = isInitialDirty || isFinalDirty;

  const initialRecentIds = useMemo(
    () =>
      new Set(recentEdits.filter((item) => item.kind === "initial").map((item) => item.id)),
    [recentEdits],
  );
  const finalRecentIds = useMemo(
    () =>
      new Set(recentEdits.filter((item) => item.kind === "final").map((item) => item.id)),
    [recentEdits],
  );
  const topPriorityItems = useMemo(() => {
    const targetCount = 8;
    const sortedInitials = sortByPriority(initials);
    const sortedFinals = sortByPriority(finals);
    const half = Math.floor(targetCount / 2);

    const pickedInitials = sortedInitials.slice(0, Math.min(half, sortedInitials.length));
    const pickedFinals = sortedFinals.slice(0, Math.min(half, sortedFinals.length));

    const remainderPool = [
      ...sortedInitials.slice(pickedInitials.length).map((item) => ({
        ...item,
        kind: "initial" as const,
      })),
      ...sortedFinals.slice(pickedFinals.length).map((item) => ({
        ...item,
        kind: "final" as const,
      })),
    ];

    const remainder = sortByPriority(remainderPool).slice(
      0,
      targetCount - pickedInitials.length - pickedFinals.length,
    );

    return [
      ...pickedInitials.map((item) => ({ ...item, kind: "initial" as const })),
      ...pickedFinals.map((item) => ({ ...item, kind: "final" as const })),
      ...remainder,
    ]
      .sort((a, b) => {
        if (a.status !== b.status) {
          return a.status === "empty" ? -1 : 1;
        }

        if (b.frequencyCount !== a.frequencyCount) {
          return b.frequencyCount - a.frequencyCount;
        }

        return a.pinyin.localeCompare(b.pinyin);
      })
      .map((item) => ({
        id: item.id,
        kind: item.kind,
        pinyin: item.pinyin,
        status: item.status,
        frequencyLabel: getFrequencyLabel(item.frequencyTier),
        frequencyCount: item.frequencyCount,
      }));
  }, [finals, initials]);

  const hasNoMappings = totals.overall.completed === 0;

  const initialEmpty = getEmptyContent({
    kind: "initials",
    hasNoMappings,
    query,
    filter,
  });
  const finalEmpty = getEmptyContent({
    kind: "finals",
    hasNoMappings,
    query,
    filter,
  });

  const applySelection = (nextSelection: EditorSelection | null) => {
    setSelection(nextSelection);

    if (!nextSelection) {
      setInitialDraft(null);
      setFinalDraft(null);
      return;
    }

    if (nextSelection.kind === "initial") {
      const nextItem = initials.find((item) => item.id === nextSelection.id);

      if (!nextItem) {
        setSelection(null);
        setInitialDraft(null);
        setFinalDraft(null);
        return;
      }

      setInitialDraft({
        actorName: nextItem.actorName,
        description: nextItem.description,
        notes: nextItem.notes,
      });
      setFinalDraft(null);
      return;
    }

    const nextItem = finals.find((item) => item.id === nextSelection.id);

    if (!nextItem) {
      setSelection(null);
      setInitialDraft(null);
      setFinalDraft(null);
      return;
    }

    setFinalDraft({
      setName: nextItem.setName,
      description: nextItem.description,
      locations: nextItem.locations,
      notes: nextItem.notes,
    });
    setInitialDraft(null);
  };

  const requestSelection = (nextSelection: EditorSelection | null) => {
    const isSameSelection =
      selection?.kind === nextSelection?.kind && selection?.id === nextSelection?.id;

    if (isSameSelection) {
      return;
    }

    if (hasUnsavedChanges) {
      setPendingSelection(nextSelection);
      setShowUnsavedDialog(true);
      return;
    }

    applySelection(nextSelection);
  };

  const discardUnsavedChanges = () => {
    setShowUnsavedDialog(false);
    applySelection(pendingSelection);
    setPendingSelection(null);
  };

  const editorInitialItem =
    selectedInitial && initialDraft
      ? {
          ...selectedInitial,
          ...initialDraft,
          status: getInitialStatus(initialDraft.actorName),
        }
      : null;

  const editorFinalItem =
    selectedFinal && finalDraft
      ? {
          ...selectedFinal,
          ...finalDraft,
          status: getFinalStatus(finalDraft.setName),
        }
      : null;

  const saveCurrentEditor = () => {
    if (selectedInitial && initialDraft) {
      saveInitial(selectedInitial.id, initialDraft);
      applySelection(null);
      return;
    }

    if (selectedFinal && finalDraft) {
      saveFinal(selectedFinal.id, finalDraft);
      applySelection(null);
    }
  };

  const scrollToMobileSection = (kind: "initials" | "finals") => {
    if (isDesktop) {
      return;
    }

    setMobileTab(kind);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const target =
          kind === "initials" ? initialsSectionRef.current : finalsSectionRef.current;

        target?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
  };

  const initialCategoryControls = (
    <div className="flex flex-col gap-3 pt-1">
      <div className="flex flex-wrap gap-2">
        {INITIAL_CATEGORY_FILTERS.map((item) => (
          <Button
            key={item.value}
            variant={initialCategoryFilter === item.value ? "default" : "outline"}
            size="sm"
            onClick={() =>
              setInitialCategoryFilter((current) => (current === item.value ? "all" : item.value))
            }
            className={cn(
              "min-w-0 rounded-full",
              initialCategoryFilter !== item.value && "bg-white/4 hover:bg-white/8",
            )}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {SORT_OPTIONS.map((item) => (
          <Button
            key={item.value}
            variant="outline"
            size="sm"
            onClick={() =>
              setInitialSort((current) => (current === item.value ? "none" : item.value))
            }
            className={cn(
              "min-w-24 rounded-full",
              initialSort === item.value ? ACTIVE_SORT_CLASS : "bg-white/4 hover:bg-white/8",
            )}
          >
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );

  const finalSortControls = (
    <div className="flex flex-wrap gap-2 pt-1">
      {SORT_OPTIONS.map((item) => (
        <Button
          key={item.value}
          variant="outline"
          size="sm"
          onClick={() => setFinalSort((current) => (current === item.value ? "none" : item.value))}
          className={cn(
            "min-w-24 rounded-full",
            finalSort === item.value ? ACTIVE_SORT_CLASS : "bg-white/4 hover:bg-white/8",
          )}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );

  return (
    <>
      <DashboardShell
        heading="Mandarin Blueprint / HMM Mapper"
        subheading="A simple, polished personal workspace for managing your fixed initials-to-actors and finals-to-sets system. Edit directly from the pinyin chart, keep progress visible at a glance, and back everything up to JSON."
        status={
          <div className="flex flex-wrap justify-end gap-2">
            <Badge variant="outline" className="gap-2 border-white/10 bg-white/5 px-3 py-1.5 text-slate-200">
              <UsersRound className="h-3.5 w-3.5" />
              55 initials
            </Badge>
            <Badge variant="outline" className="gap-2 border-white/10 bg-white/5 px-3 py-1.5 text-slate-200">
              <Layers3 className="h-3.5 w-3.5" />
              13 finals
            </Badge>
          </div>
        }
        actions={
          <ImportExportControls
            data={data}
            onImportData={(nextData) => {
              replaceData(nextData);
              applySelection(null);
            }}
            onResetData={() => {
              resetData();
              applySelection(null);
            }}
          />
        }
      >
        <ProgressOverview
          totals={totals}
          isSaving={isSaving}
          lastSavedAt={lastSavedAt}
          onJumpToInitials={!isDesktop ? () => scrollToMobileSection("initials") : undefined}
          onJumpToFinals={!isDesktop ? () => scrollToMobileSection("finals") : undefined}
        />

        <SearchFilterBar
          query={query}
          filter={filter}
          onQueryChange={setQuery}
          onFilterChange={(value) =>
            setFilter((current) => (current === value ? "all" : value))
          }
        />

        <TopPriorities
          items={topPriorityItems}
          onSelect={(item) =>
            requestSelection({
              kind: item.kind,
              id: item.id,
            })
          }
        />

        <RecentEditsStrip edits={recentEdits} onSelect={requestSelection} />

        {hasNoMappings ? (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-[28px] px-5 py-5"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-indigo-300/15 bg-indigo-300/10 p-3 text-indigo-100">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-white">Your mapping space is ready</p>
                <p className="max-w-3xl text-sm leading-6 text-slate-400">
                  Nothing is assigned yet, which is totally fine. Tap any pinyin tile to start building your personal actor and set system. Completed items will automatically switch to the complete state with stronger visual emphasis.
                </p>
              </div>
            </div>
          </motion.section>
        ) : null}

        {isDesktop ? (
          <div className="grid gap-6 xl:grid-cols-2">
            <MappingGrid
              title="Initials"
              description="Reusable HMM initials represented by actors. Click any pinyin item to edit directly."
              totalCount={initials.length}
              visibleCount={filteredInitials.length}
              items={filteredInitials.map(toInitialCard)}
              recentIds={initialRecentIds}
              onSelect={(id) => requestSelection({ kind: "initial", id })}
              emptyTitle={initialEmpty.title}
              emptyDescription={initialEmpty.description}
              showOnboardingHint={hasNoMappings}
              headerControls={initialCategoryControls}
            />
            <MappingGrid
              title="Finals"
              description="Reusable finals represented by sets, with structured locations inside each set for cleaner scanning."
              totalCount={finals.length}
              visibleCount={filteredFinals.length}
              items={filteredFinals.map(toFinalCard)}
              recentIds={finalRecentIds}
              onSelect={(id) => requestSelection({ kind: "final", id })}
              emptyTitle={finalEmpty.title}
              emptyDescription={finalEmpty.description}
              showOnboardingHint={hasNoMappings}
              headerControls={finalSortControls}
            />
          </div>
        ) : (
          <Tabs value={mobileTab} onValueChange={(value) => setMobileTab(value as "initials" | "finals")}>
            <TabsList className="w-full">
              <TabsTrigger value="initials" className="flex-1">
                Initials
              </TabsTrigger>
              <TabsTrigger value="finals" className="flex-1">
                Finals
              </TabsTrigger>
            </TabsList>
            <TabsContent value="initials" forceMount className="data-[state=inactive]:hidden">
              {mobileTab === "initials" ? (
                <motion.div
                  ref={initialsSectionRef}
                  key="initials"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="scroll-mt-6"
                >
                  <MappingGrid
                    title="Initials"
                    description="Tap a pinyin sound to manage its actor."
                    totalCount={initials.length}
                    visibleCount={filteredInitials.length}
                    items={filteredInitials.map(toInitialCard)}
                    recentIds={initialRecentIds}
                    onSelect={(id) => requestSelection({ kind: "initial", id })}
                    emptyTitle={initialEmpty.title}
                    emptyDescription={initialEmpty.description}
                    showOnboardingHint={hasNoMappings}
                    headerControls={initialCategoryControls}
                  />
                </motion.div>
              ) : null}
            </TabsContent>
            <TabsContent value="finals" forceMount className="data-[state=inactive]:hidden">
              {mobileTab === "finals" ? (
                <motion.div
                  ref={finalsSectionRef}
                  key="finals"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="scroll-mt-6"
                >
                  <MappingGrid
                    title="Finals"
                    description="Tap a pinyin final to manage its set and internal locations."
                    totalCount={finals.length}
                    visibleCount={filteredFinals.length}
                    items={filteredFinals.map(toFinalCard)}
                    recentIds={finalRecentIds}
                    onSelect={(id) => requestSelection({ kind: "final", id })}
                    emptyTitle={finalEmpty.title}
                    emptyDescription={finalEmpty.description}
                    showOnboardingHint={hasNoMappings}
                    headerControls={finalSortControls}
                  />
                </motion.div>
              ) : null}
            </TabsContent>
          </Tabs>
        )}
      </DashboardShell>

      <EditorSheet
        open={Boolean(selection)}
        onOpenChange={(open) => {
          if (!open) {
            requestSelection(null);
          }
        }}
        title={selectedInitial ? `Edit initial ${selectedInitial.pinyin}` : selectedFinal ? `Edit final ${selectedFinal.pinyin}` : "Edit mapping"}
        description={
          selectedInitial
            ? "Update the actor mapping for this initial."
            : selectedFinal
              ? "Update the set mapping for this final."
              : "Choose a mapping from the chart to edit."
        }
        isDesktop={isDesktop}
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => requestSelection(null)}>
              Cancel
            </Button>
            <Button onClick={saveCurrentEditor}>
              Save
            </Button>
          </div>
        }
      >
        {editorInitialItem ? (
          <InitialEditor
            item={editorInitialItem}
            onChange={(patch) =>
              setInitialDraft((current) => ({
                actorName: current?.actorName ?? "",
                description: current?.description ?? "",
                notes: current?.notes ?? "",
                ...patch,
              }))
            }
          />
        ) : null}

        {editorFinalItem ? (
          <FinalEditor
            item={editorFinalItem}
            onChange={(patch) =>
              setFinalDraft((current) => ({
                setName: current?.setName ?? "",
                description: current?.description ?? "",
                locations: current?.locations ?? [],
                notes: current?.notes ?? "",
                ...patch,
              }))
            }
          />
        ) : null}
      </EditorSheet>

      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have edits in progress that have not been saved yet. Canceling or closing now will discard them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setPendingSelection(null);
              }}
            >
              Keep editing
            </AlertDialogCancel>
            <AlertDialogAction onClick={discardUnsavedChanges}>
              Discard changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
