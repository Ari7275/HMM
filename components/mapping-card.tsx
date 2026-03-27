"use client";

import { motion } from "framer-motion";
import { CheckCircle2, CircleDashed, Clock3, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { InitialActorCategory, MappingStatus } from "@/lib/types";
import { cn, formatRelativeEditTime } from "@/lib/utils";

interface MappingCardProps {
  kind: "initial" | "final";
  pinyin: string;
  name: string;
  status: MappingStatus;
  actorCategory?: InitialActorCategory;
  locations?: string[];
  isRecent: boolean;
  lastEditedAt: string | null;
  onClick: () => void;
}

const categoryStyles: Record<InitialActorCategory, string> = {
  male: "border-sky-300/20 bg-sky-300/10 text-sky-100",
  female: "border-pink-300/20 bg-pink-300/10 text-pink-100",
  fictional: "border-violet-300/20 bg-violet-300/10 text-violet-100",
  wildcard: "border-amber-300/20 bg-amber-300/10 text-amber-100",
};

const categoryLabels: Record<InitialActorCategory, string> = {
  male: "Male",
  female: "Female",
  fictional: "Fictional",
  wildcard: "Wildcard",
};

export function MappingCard({
  kind,
  pinyin,
  name,
  status,
  actorCategory,
  locations = [],
  isRecent,
  lastEditedAt,
  onClick,
}: MappingCardProps) {
  const isComplete = status === "complete";
  const displayLocations = locations.slice(0, 3);

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
      <div className="relative flex min-h-9 flex-col items-start gap-2">
        <div className="min-w-0">
          {kind === "initial" && actorCategory ? (
            <Badge
              variant="outline"
              className={cn(
                "h-7 max-w-full whitespace-nowrap px-2.5 text-[11px] font-medium uppercase tracking-[0.18em]",
                categoryStyles[actorCategory],
              )}
            >
              {categoryLabels[actorCategory]}
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="h-7 max-w-full whitespace-nowrap border-white/10 bg-white/5 px-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300"
            >
              Set
            </Badge>
          )}
        </div>
        <Badge
          variant={isComplete ? "success" : "warning"}
          className="h-7 justify-center gap-1.5 whitespace-nowrap"
        >
          {isComplete ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : (
            <CircleDashed className="h-3.5 w-3.5" />
          )}
          {isComplete ? "Complete" : "Empty"}
        </Badge>
      </div>

      <div className="relative mt-5 flex flex-1 flex-col justify-between gap-5">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-white">{pinyin}</h3>
          <p
            className={cn(
              "mt-3 text-sm leading-6",
              isComplete ? "text-slate-100" : "text-slate-400",
            )}
          >
            {isComplete
              ? name
              : kind === "initial"
                ? "Add the actor that represents this initial."
                : "Add the set that represents this final."}
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
            <p className="text-xs leading-5 text-slate-500">
              {kind === "initial"
                ? actorCategory
                  ? `${categoryLabels[actorCategory]} actor category`
                  : "Actor category"
                : "Select meaningful areas inside the set."}
            </p>
          )}

          <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
            <span>Tap card to edit</span>
            {lastEditedAt ? (
              <span className="inline-flex items-center gap-1.5 text-right">
                <Clock3 className="h-3.5 w-3.5" />
                {formatRelativeEditTime(lastEditedAt)?.replace("Edited ", "")}
              </span>
            ) : (
              <span className="text-slate-600">Not edited yet</span>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
}
