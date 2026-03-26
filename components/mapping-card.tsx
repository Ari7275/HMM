"use client";

import { motion } from "framer-motion";
import { CheckCircle2, CircleDashed, Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { MappingStatus } from "@/lib/types";
import { cn, formatRelativeEditTime } from "@/lib/utils";

interface MappingCardProps {
  pinyin: string;
  name: string;
  status: MappingStatus;
  groupLabel: string;
  isRecent: boolean;
  lastEditedAt: string | null;
  onClick: () => void;
}

export function MappingCard({
  pinyin,
  name,
  status,
  groupLabel,
  isRecent,
  lastEditedAt,
  onClick,
}: MappingCardProps) {
  const isComplete = status === "complete";

  return (
    <motion.button
      type="button"
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        "group glass-panel relative flex min-h-36 flex-col rounded-[24px] p-4 text-left transition-all duration-200",
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
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{groupLabel}</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">{pinyin}</h3>
        </div>
        <Badge variant={isComplete ? "success" : "warning"} className="gap-1.5">
          {isComplete ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : (
            <CircleDashed className="h-3.5 w-3.5" />
          )}
          {isComplete ? "Complete" : "Empty"}
        </Badge>
      </div>

      <div className="relative mt-5 flex flex-1 flex-col justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            {isComplete ? "Assigned" : "Guidance"}
          </p>
          <p
            className={cn(
              "mt-2 text-sm leading-6",
              isComplete ? "text-slate-100" : "text-slate-400",
            )}
          >
            {isComplete ? name : "Tap to add your personal mapping for this sound."}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
          <span>Click anywhere to edit</span>
          {lastEditedAt ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" />
              {formatRelativeEditTime(lastEditedAt)?.replace("Edited ", "")}
            </span>
          ) : null}
        </div>
      </div>
    </motion.button>
  );
}
