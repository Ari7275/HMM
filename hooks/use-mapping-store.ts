"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { createEmptyStorageData } from "@/lib/seed-data";
import { buildFinalItems, buildInitialItems, getTotalsSummary } from "@/lib/status";
import { clearStorageData, loadStorageData, saveStorageData } from "@/lib/storage";
import type {
  AppStorageData,
  FinalDraft,
  InitialDraft,
  RecentEdit,
} from "@/lib/types";

const WRITE_DEBOUNCE_MS = 350;
const RECENT_LIMIT = 6;

function buildRecentEdits(
  previous: RecentEdit[],
  nextEntry: RecentEdit,
): RecentEdit[] {
  return [
    nextEntry,
    ...previous.filter(
      (entry) => !(entry.kind === nextEntry.kind && entry.id === nextEntry.id),
    ),
  ].slice(0, RECENT_LIMIT);
}

export function useMappingStore() {
  const [data, setData] = useState<AppStorageData>(createEmptyStorageData);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const skipNextSaveRef = useRef(true);

  useEffect(() => {
    const nextData = loadStorageData();
    const frameId = window.requestAnimationFrame(() => {
      setData(nextData);
      setIsHydrated(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      saveStorageData(data);
      setIsSaving(false);
      setLastSavedAt(new Date().toISOString());
    }, WRITE_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [data, isHydrated]);

  const initials = useMemo(() => buildInitialItems(data), [data]);
  const finals = useMemo(() => buildFinalItems(data), [data]);
  const totals = useMemo(() => getTotalsSummary(data), [data]);

  const updateInitial = (id: string, patch: Partial<InitialDraft>) => {
    const seed = initials.find((item) => item.id === id);
    const updatedAt = new Date().toISOString();

    setIsSaving(true);
    setData((current) => ({
      ...current,
      initials: {
        ...current.initials,
        [id]: {
          ...current.initials[id],
          ...patch,
        },
      },
      initialMeta: {
        ...current.initialMeta,
        [id]: {
          lastEditedAt: updatedAt,
        },
      },
      recentEdits: buildRecentEdits(current.recentEdits, {
        kind: "initial",
        id,
        pinyin: seed?.pinyin ?? id,
        label:
          patch.actorName ??
          current.initials[id]?.actorName ??
          seed?.pinyin ??
          id,
        updatedAt,
      }),
    }));
  };

  const updateFinal = (id: string, patch: Partial<FinalDraft>) => {
    const seed = finals.find((item) => item.id === id);
    const updatedAt = new Date().toISOString();

    setIsSaving(true);
    setData((current) => ({
      ...current,
      finals: {
        ...current.finals,
        [id]: {
          ...current.finals[id],
          ...patch,
        },
      },
      finalMeta: {
        ...current.finalMeta,
        [id]: {
          lastEditedAt: updatedAt,
        },
      },
      recentEdits: buildRecentEdits(current.recentEdits, {
        kind: "final",
        id,
        pinyin: seed?.pinyin ?? id,
        label:
          patch.setName ??
          current.finals[id]?.setName ??
          seed?.pinyin ??
          id,
        updatedAt,
      }),
    }));
  };

  const replaceData = (nextData: AppStorageData) => {
    setIsSaving(false);
    setData(nextData);
    setLastSavedAt(new Date().toISOString());
    saveStorageData(nextData);
  };

  const resetData = () => {
    const nextData = createEmptyStorageData();
    clearStorageData();
    setIsSaving(false);
    setData(nextData);
    setLastSavedAt(null);
  };

  return {
    data,
    initials,
    finals,
    totals,
    recentEdits: data.recentEdits,
    isHydrated,
    isSaving,
    lastSavedAt,
    updateInitial,
    updateFinal,
    replaceData,
    resetData,
  };
}
