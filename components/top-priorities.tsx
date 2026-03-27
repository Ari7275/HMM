"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, CircleDashed } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MappingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TopPriorityItem {
  id: string;
  kind: "initial" | "final";
  pinyin: string;
  status: MappingStatus;
  frequencyLabel: string;
  frequencyCount: number;
}

interface TopPrioritiesProps {
  items: TopPriorityItem[];
  onSelect: (item: TopPriorityItem) => void;
}

export function TopPriorities({ items, onSelect }: TopPrioritiesProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="glass-panel overflow-hidden">
      <CardHeader className="border-b border-white/6 pb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl text-white">Top priorities</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsOpen((current) => !current)}
                className="rounded-full"
              >
                {isOpen ? "Hide" : "Show"}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </Button>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-300">
              The highest-frequency mappings worth locking in first. Use this as your guided starting queue.
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Focus set</p>
            <p className="mt-1 text-lg font-semibold text-white">{items.length} items</p>
          </div>
        </div>
      </CardHeader>
      {isOpen ? (
        <CardContent className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => {
            const isComplete = item.status === "complete";

            return (
              <button
                key={`${item.kind}-${item.id}`}
                type="button"
                onClick={() => onSelect(item)}
                className={cn(
                  "rounded-[24px] border p-4 text-left transition hover:-translate-y-0.5 hover:bg-white/[0.04]",
                  isComplete
                    ? "border-emerald-400/12 bg-emerald-400/[0.06]"
                    : "border-indigo-300/18 bg-indigo-300/[0.08]",
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
                    {item.kind}
                  </span>
                  <Badge
                    variant={isComplete ? "success" : "warning"}
                    className="shrink-0 gap-1.5"
                  >
                    {isComplete ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <CircleDashed className="h-3.5 w-3.5" />
                    )}
                    {isComplete ? "Complete" : "Empty"}
                  </Badge>
                </div>

                <h3 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                  {item.pinyin}
                </h3>

                <p className="mt-3 text-sm text-slate-300">
                  {item.frequencyLabel} ({item.frequencyCount} characters)
                </p>

                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/6">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      isComplete
                        ? "bg-gradient-to-r from-emerald-400 to-cyan-300"
                        : "bg-gradient-to-r from-indigo-400 to-cyan-300",
                    )}
                    style={{
                      width: `${Math.max(12, Math.round((item.frequencyCount / 652) * 100))}%`,
                    }}
                  />
                </div>
              </button>
            );
          })}
        </CardContent>
      ) : null}
    </Card>
  );
}
