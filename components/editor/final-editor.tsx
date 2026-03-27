import { Check, CheckCircle2, ChevronDown, CircleDashed, MapPinned } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { SET_LOCATION_OPTIONS } from "@/lib/seed-data";
import type { FinalItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FinalEditorProps {
  item: FinalItem;
  onChange: (patch: {
    setName?: string;
    description?: string;
    locations?: string[];
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
          Assign the set you want for this final and pick the meaningful areas inside it.
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

        <div className="space-y-3">
          <Label>Locations</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-auto min-h-12 w-full justify-between rounded-2xl px-4 py-3 text-left font-medium"
              >
                <span className="truncate">
                  {item.locations.length
                    ? `${item.locations.length} location${item.locations.length === 1 ? "" : "s"} selected`
                    : "Choose locations inside this set"}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[min(22rem,calc(100vw-2rem))] p-2">
              <div className="space-y-1">
                {SET_LOCATION_OPTIONS.map((location) => {
                  const isSelected = item.locations.includes(location);

                  return (
                    <button
                      key={location}
                      type="button"
                      onClick={() =>
                        onChange({
                          locations: isSelected
                            ? item.locations.filter((value) => value !== location)
                            : [...item.locations, location],
                        })
                      }
                      className={cn(
                        "flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm transition",
                        isSelected
                          ? "bg-indigo-300/12 text-white"
                          : "text-slate-300 hover:bg-white/5",
                      )}
                    >
                      <span>{location}</span>
                      <span
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full border",
                          isSelected
                            ? "border-indigo-300/30 bg-indigo-300/20 text-indigo-100"
                            : "border-white/10 text-transparent",
                        )}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>

          {item.locations.length ? (
            <div className="flex flex-wrap gap-2">
              {item.locations.map((location) => (
                <span
                  key={location}
                  className="inline-flex items-center rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100"
                >
                  {location}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No locations selected yet. Pick the areas you want to reuse inside this set.
            </p>
          )}
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
            <p className="text-sm font-medium">Draft locations preview</p>
            <p className="text-sm text-slate-400">
              Locations stay structured for quick scanning, while notes remain flexible.
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {item.locations.length ? (
            item.locations.map((location) => (
              <span
                key={location}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-100"
              >
                {location}
              </span>
            ))
          ) : (
            <div className="rounded-[20px] border border-white/8 bg-slate-950/40 px-4 py-3 text-sm leading-6 text-slate-400">
              No structured locations yet. Add the areas inside this set that matter to you.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
