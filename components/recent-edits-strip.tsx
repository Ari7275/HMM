import { History, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { EditorSelection, RecentEdit } from "@/lib/types";
import { formatRelativeEditTime } from "@/lib/utils";

interface RecentEditsStripProps {
  edits: RecentEdit[];
  onSelect: (selection: EditorSelection) => void;
}

export function RecentEditsStrip({ edits, onSelect }: RecentEditsStripProps) {
  if (!edits.length) {
    return (
      <div className="glass-panel rounded-[26px] px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-indigo-100">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-white">Recent edits will appear here</p>
            <p className="text-sm leading-6 text-slate-400">
              Once you update a mapping, it will stay surfaced for quick return and subtle highlighting in the chart.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-[26px] px-5 py-4">
      <div className="flex items-center gap-2 text-sm font-medium text-white">
        <History className="h-4 w-4 text-slate-300" />
        Recently edited
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {edits.map((edit) => (
          <Button
            key={`${edit.kind}-${edit.id}`}
            variant="outline"
            size="sm"
            className="h-auto rounded-2xl px-4 py-3 text-left"
            onClick={() =>
              onSelect({
                kind: edit.kind,
                id: edit.id,
              })
            }
          >
            <span className="flex flex-col items-start">
              <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                {edit.kind} · {edit.pinyin}
              </span>
              <span className="mt-1 text-sm text-white">
                {edit.label.trim() || "Untitled mapping"}
              </span>
              <span className="mt-1 text-[11px] text-slate-500">
                {formatRelativeEditTime(edit.updatedAt)}
              </span>
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
