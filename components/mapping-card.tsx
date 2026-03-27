"use client";

import { motion } from "framer-motion";
import { CheckCircle2, CircleDashed, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type {
  FrequencyTier,
  InitialActorCategory,
  MappingStatus,
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface MappingCardProps {
  kind: "initial" | "final";
  pinyin: string;
  name: string;
  status: MappingStatus;
  actorCategory?: InitialActorCategory;
  locations?: string[];
  frequencyCount: number;
  frequencyTier: FrequencyTier;
  isRecent: boolean;
  onClick: () => void;
}

const categoryLabels: Record<InitialActorCategory, string> = {
  male: "Male",
  female: "Female",
  fictional: "Fictional",
  wildcard: "Wildcard",
};

const frequencyTierLabels: Record<FrequencyTier, string> = {
  "very-high": "Very common",
  high: "Common",
  medium: "Regular",
  low: "Uncommon",
  rare: "Rare",
};

const frequencyTierPills: Record<FrequencyTier, string> = {
  "very-high": "border-indigo-300/18 bg-indigo-300/12 text-indigo-100",
  high: "border-cyan-300/18 bg-cyan-300/10 text-cyan-100",
  medium: "border-white/10 bg-white/5 text-slate-200",
  low: "border-white/8 bg-white/[0.03] text-slate-300",
  rare: "border-white/6 bg-white/[0.02] text-slate-500",
};

function getUsageRatio(kind: "initial" | "final", frequencyCount: number) {
  const max = kind === "initial" ? 142 : 652;
  return Math.max(8, Math.round((frequencyCount / max) * 100));
}

export function MappingCard({
  kind,
  pinyin,
  name,
  status,
  actorCategory,
  locations = [],
  frequencyCount,
  frequencyTier,
  isRecent,
  onClick,
}: MappingCardProps) {
  const isComplete = status === "complete";
  const displayLocations = locations.slice(0, 3);
  const usageRatio = getUsageRatio(kind, frequencyCount);
  const frequencyCopy = `${frequencyTierLabels[frequencyTier]} (${frequencyCount} characters)`;
  const guidanceCopy =
    kind === "initial"
      ? "Assign a strong, memorable actor"
      : "Choose a very familiar place";
  const importanceClass = cn(
    frequencyTier === "very-high" &&
      (isComplete
        ? "border-emerald-300/18 shadow-[0_14px_36px_rgba(24,191,140,0.08)]"
        : "border-indigo-300/22 shadow-[0_18px_40px_rgba(111,124,255,0.12)]"),
    frequencyTier === "high" &&
      (isComplete
        ? "border-emerald-300/14 shadow-[0_12px_28px_rgba(24,191,140,0.05)]"
        : "border-cyan-300/16 shadow-[0_14px_34px_rgba(67,208,255,0.07)]"),
    (frequencyTier === "low" || frequencyTier === "rare") && "opacity-[0.96]",
  );

  return (
    <motion.button
      type="button"
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        "group glass-panel relative flex min-h-44 flex-col rounded-[24px] p-4 text-left transition-all duration-200",
        isComplete
          ? "border-emerald-400/15 bg-[linear-gradient(180deg,rgba(12,22,31,0.96),rgba(9,14,24,0.9))]"
          : "border-white/8 bg-[linear-gradient(180deg,rgba(13,18,36,0.95),rgba(8,12,25,0.88))]",
        importanceClass,
        isRecent && "ring-1 ring-indigo-300/30",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[24px] opacity-0 transition group-hover:opacity-100",
          isComplete
            ? "bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.14),transparent_35%)]"
            : "bg-[radial-gradient(circle_at_top_right,rgba(111,124,255,0.16),transparent_35%)]",
        )}
      />
      <div className="relative flex flex-wrap items-start justify-between gap-2">
        <Badge
          variant="outline"
          className={cn(
            "h-7 max-w-full whitespace-nowrap px-2.5 text-[11px] font-medium uppercase tracking-[0.18em]",
            frequencyTierPills[frequencyTier],
          )}
        >
          {frequencyTierLabels[frequencyTier].toUpperCase()}
        </Badge>
        <Badge
          variant={isComplete ? "success" : "warning"}
          className="h-7 shrink-0 gap-1.5 whitespace-nowrap"
        >
          {isComplete ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : (
            <CircleDashed className="h-3.5 w-3.5" />
          )}
          {isComplete ? "Complete" : "Empty"}
        </Badge>
      </div>

      <div className="relative mt-4 flex flex-1 flex-col justify-between gap-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
            {kind === "initial" && actorCategory
              ? `${categoryLabels[actorCategory]} actor`
              : "Set mapping"}
          </p>
          <h3 className="text-2xl font-semibold tracking-tight text-white">{pinyin}</h3>
          <p
            className={cn(
              "mt-3 text-sm leading-6",
              isComplete ? "text-slate-100" : "text-slate-400",
            )}
          >
            {isComplete ? name : guidanceCopy}
          </p>
        </div>

        <div className="space-y-3">
          {kind === "final" && displayLocations.length ? (
            <div className="flex flex-wrap gap-2">
              {displayLocations.map((location) => (
                <span
                  key={location}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-200"
                >
                  <MapPin className="h-3 w-3 text-cyan-200" />
                  {location}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs leading-5 text-slate-500">{guidanceCopy}</p>
          )}

          {kind === "final" && locations.length ? (
            <p className="text-xs text-slate-500">
              {locations.length} location{locations.length === 1 ? "" : "s"} selected
            </p>
          ) : null}

          <div className="space-y-2">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  isComplete
                    ? "bg-gradient-to-r from-emerald-400 to-cyan-300"
                    : "bg-gradient-to-r from-indigo-400 to-cyan-300",
                )}
                style={{ width: `${usageRatio}%` }}
              />
            </div>
            <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
              <span>{frequencyCopy}</span>
              <span>Usage: {frequencyCount} characters</span>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
