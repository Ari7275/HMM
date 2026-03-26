import { CheckCircle2, Layers3, Sparkles, UsersRound } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { TotalsSummary } from "@/lib/types";
import { formatRelativeEditTime } from "@/lib/utils";

interface ProgressOverviewProps {
  totals: TotalsSummary;
  isSaving: boolean;
  lastSavedAt: string | null;
}

function ProgressCard({
  label,
  value,
  helper,
  percent,
  icon: Icon,
}: {
  label: string;
  value: string;
  helper: string;
  percent: number;
  icon: typeof Sparkles;
}) {
  return (
    <Card className="glass-panel">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm text-slate-300">{label}</p>
            <p className="text-2xl font-semibold tracking-tight text-white">{value}</p>
            <p className="text-xs text-slate-400">{helper}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-100">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/6">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-indigo-300 to-cyan-300 transition-all duration-500"
            style={{ width: `${Math.max(percent, 4)}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function ProgressOverview({
  totals,
  isSaving,
  lastSavedAt,
}: ProgressOverviewProps) {
  const saveLabel = isSaving
    ? "Saving changes..."
    : formatRelativeEditTime(lastSavedAt) ?? "Autosave ready";

  return (
    <section className="grid gap-4 lg:grid-cols-[1.2fr_1.2fr_1fr]">
      <ProgressCard
        label="Initials"
        value={`${totals.initials.completed}/${totals.initials.total}`}
        helper="Actors assigned"
        percent={(totals.initials.completed / totals.initials.total) * 100}
        icon={UsersRound}
      />
      <ProgressCard
        label="Finals"
        value={`${totals.finals.completed}/${totals.finals.total}`}
        helper="Sets assigned"
        percent={(totals.finals.completed / totals.finals.total) * 100}
        icon={Layers3}
      />
      <Card className="glass-panel">
        <CardContent className="flex h-full flex-col justify-between p-5">
          <div className="space-y-2">
            <p className="text-sm text-slate-300">Overall completion</p>
            <p className="text-2xl font-semibold tracking-tight text-white">
              {Math.round((totals.overall.completed / totals.overall.total) * 100)}%
            </p>
            <p className="text-xs text-slate-400">
              {totals.overall.completed} of {totals.overall.total} mappings ready
            </p>
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              {saveLabel}
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Edits are applied instantly in the UI and persisted locally with debounced writes.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
