import { CheckCircle2, CircleDashed, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { InitialActorCategory, InitialItem } from "@/lib/types";

const categoryCopy: Record<InitialActorCategory, string> = {
  male: "Male actor category",
  female: "Female actor category",
  fictional: "Fictional actor category",
  wildcard: "Wildcard actor category",
};

interface InitialEditorProps {
  item: InitialItem;
  onChange: (patch: {
    actorName?: string;
    description?: string;
    notes?: string;
  }) => void;
}

export function InitialEditor({ item, onChange }: InitialEditorProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Initial</p>
            <h3 className="mt-2 text-3xl font-semibold text-white">{item.pinyin}</h3>
            <p className="mt-2 text-sm text-slate-400">{categoryCopy[item.actorCategory]}</p>
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
          Assign the actor you want to represent this initial in your personal Hanzi Movie Method mapping.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="space-y-2">
          <Label htmlFor="initial-pinyin">Pinyin</Label>
          <Input id="initial-pinyin" value={item.pinyin} readOnly />
        </div>

        <div className="space-y-2">
          <Label htmlFor="initial-category">Actor category</Label>
          <Input id="initial-category" value={categoryCopy[item.actorCategory]} readOnly />
        </div>

        <div className="space-y-2">
          <Label htmlFor="actor-name">Actor name</Label>
          <Input
            id="actor-name"
            autoFocus
            value={item.actorName}
            onChange={(event) => onChange({ actorName: event.target.value })}
            placeholder={`Enter your ${item.actorCategory} actor`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="actor-description">Description</Label>
          <Textarea
            id="actor-description"
            value={item.description}
            onChange={(event) => onChange({ description: event.target.value })}
            placeholder="Visual details, vibe, mnemonic cues..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="actor-notes">Notes</Label>
          <Textarea
            id="actor-notes"
            value={item.notes}
            onChange={(event) => onChange({ notes: event.target.value })}
            placeholder="Any reminders, exceptions, or memory hooks..."
          />
        </div>
      </div>

      <Separator />

      <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
        <div className="flex items-center gap-3 text-white">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-2.5">
            <UserRound className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium">Draft preview</p>
            <p className="text-sm text-slate-400">
              Changes stay local to this editor until you explicitly save them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
