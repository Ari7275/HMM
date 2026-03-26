import { CheckCircle2, CircleDashed, MapPinned } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { FinalItem } from "@/lib/types";

interface FinalEditorProps {
  item: FinalItem;
  onChange: (patch: {
    setName?: string;
    description?: string;
    zones?: string;
    notes?: string;
  }) => void;
}

export function FinalEditor({ item, onChange }: FinalEditorProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Final</p>
            <h3 className="mt-2 text-3xl font-semibold text-white">{item.pinyin}</h3>
          </div>
          <Badge variant={item.status === "complete" ? "success" : "warning"} className="gap-1.5">
            {item.status === "complete" ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <CircleDashed className="h-3.5 w-3.5" />
            )}
            {item.status === "complete" ? "Complete" : "Empty"}
          </Badge>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-400">
          Assign the set you want for this final. Zones stay fully free-form and are rendered as readable multi-line notes.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="space-y-2">
          <Label htmlFor="final-pinyin">Pinyin</Label>
          <Input id="final-pinyin" value={item.pinyin} readOnly />
        </div>

        <div className="space-y-2">
          <Label htmlFor="set-name">Set name</Label>
          <Input
            id="set-name"
            autoFocus
            value={item.setName}
            onChange={(event) => onChange({ setName: event.target.value })}
            placeholder="Enter your set"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="set-description">Description</Label>
          <Textarea
            id="set-description"
            value={item.description}
            onChange={(event) => onChange({ description: event.target.value })}
            placeholder="What does this place feel like?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="zones">Zones</Label>
          <Textarea
            id="zones"
            value={item.zones}
            onChange={(event) => onChange({ zones: event.target.value })}
            placeholder={"List areas, landmarks, or movement paths.\nOne line per cue works well."}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="set-notes">Notes</Label>
          <Textarea
            id="set-notes"
            value={item.notes}
            onChange={(event) => onChange({ notes: event.target.value })}
            placeholder="Any reminders for how this set should be used..."
          />
        </div>
      </div>

      <Separator />

      <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
        <div className="flex items-center gap-3 text-white">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-2.5">
            <MapPinned className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium">Draft zones preview</p>
            <p className="text-sm text-slate-400">
              Use free text however you like. Line breaks are preserved, but nothing is committed until you save.
            </p>
          </div>
        </div>
        <div className="zones-text mt-4 min-h-24 rounded-[20px] border border-white/8 bg-slate-950/40 px-4 py-3 text-sm leading-6 text-slate-200">
          {item.zones.trim() || "No zones added yet. Try listing key corners, shelves, doors, or directional paths."}
        </div>
      </div>
    </div>
  );
}
