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
  const saveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const nextData = loadStorageData();
    const frameId = window.requestAnimationFrame(() => {
      setData(nextData);
      setIsHydrated(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const initials = useMemo(() => buildInitialItems(data), [data]);
  const finals = useMemo(() => buildFinalItems(data), [data]);
  const totals = useMemo(() => getTotalsSummary(data), [data]);

  const saveInitial = (id: string, nextDraft: InitialDraft) => {
    const seed = initials.find((item) => item.id === id);
    const updatedAt = new Date().toISOString();

    setIsSaving(true);
    setData((current) => {
      const nextData = {
        ...current,
        initials: {
          ...current.initials,
          [id]: {
            ...nextDraft,
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
          label: nextDraft.actorName.trim() || seed?.pinyin || id,
          updatedAt,
        }),
      };

      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = window.setTimeout(() => {
        saveStorageData(nextData);
        setIsSaving(false);
        setLastSavedAt(updatedAt);
      }, WRITE_DEBOUNCE_MS);

      return nextData;
    });
  };

  const saveFinal = (id: string, nextDraft: FinalDraft) => {
    const seed = finals.find((item) => item.id === id);
    const updatedAt = new Date().toISOString();

    setIsSaving(true);
    setData((current) => {
      const nextData = {
        ...current,
        finals: {
          ...current.finals,
          [id]: {
            ...nextDraft,
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
          label: nextDraft.setName.trim() || seed?.pinyin || id,
          updatedAt,
        }),
      };

      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = window.setTimeout(() => {
        saveStorageData(nextData);
        setIsSaving(false);
        setLastSavedAt(updatedAt);
      }, WRITE_DEBOUNCE_MS);

      return nextData;
    });
  };

  const replaceData = (nextData: AppStorageData) => {
    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }
    setIsSaving(false);
    setData(nextData);
    setLastSavedAt(new Date().toISOString());
    saveStorageData(nextData);
  };

  const resetData = () => {
    const nextData = createEmptyStorageData();
    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }
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
    saveInitial,
    saveFinal,
    replaceData,
    resetData,
  };
}
