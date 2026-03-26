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
import { getFinalStatus, getInitialStatus } from "@/lib/status";
import { filterFinalItems, filterInitialItems } from "@/lib/search";
import type {
  EditorSelection,
  FilterStatus,
  FinalDraft,
  FinalItem,
  InitialDraft,
  InitialItem,
} from "@/lib/types";

function toInitialCard(item: InitialItem): MappingGridItem {
  return {
    id: item.id,
    pinyin: item.pinyin,
    name: item.actorName,
    groupLabel: item.groupLabel,
    status: item.status,
    lastEditedAt: item.lastEditedAt,
  };
}

function toFinalCard(item: FinalItem): MappingGridItem {
  return {
    id: item.id,
    pinyin: item.pinyin,
    name: item.setName,
    groupLabel: item.groupLabel,
    status: item.status,
    lastEditedAt: item.lastEditedAt,
  };
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

  const filteredInitials = useMemo(
    () => filterInitialItems(initials, query, filter),
    [filter, initials, query],
  );
  const filteredFinals = useMemo(
    () => filterFinalItems(finals, query, filter),
    [filter, finals, query],
  );

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
        selectedFinal.zones !== finalDraft.zones ||
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
      zones: nextItem.zones,
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
          onFilterChange={setFilter}
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
            />
            <MappingGrid
              title="Finals"
              description="Reusable finals represented by sets. Zones remain free-text and can be kept as loose or detailed as you like."
              totalCount={finals.length}
              visibleCount={filteredFinals.length}
              items={filteredFinals.map(toFinalCard)}
              recentIds={finalRecentIds}
              onSelect={(id) => requestSelection({ kind: "final", id })}
              emptyTitle={finalEmpty.title}
              emptyDescription={finalEmpty.description}
              showOnboardingHint={hasNoMappings}
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
                    description="Tap a pinyin final to manage its set."
                    totalCount={finals.length}
                    visibleCount={filteredFinals.length}
                    items={filteredFinals.map(toFinalCard)}
                    recentIds={finalRecentIds}
                    onSelect={(id) => requestSelection({ kind: "final", id })}
                    emptyTitle={finalEmpty.title}
                    emptyDescription={finalEmpty.description}
                    showOnboardingHint={hasNoMappings}
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
                zones: current?.zones ?? "",
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
