import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface DashboardShellProps {
  heading: string;
  subheading: string;
  actions?: ReactNode;
  status?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function DashboardShell({
  heading,
  subheading,
  actions,
  status,
  children,
  className,
}: DashboardShellProps) {
  return (
    <main className={cn("mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8", className)}>
      <section className="glass-panel grid-glow relative overflow-hidden rounded-[32px] px-5 py-6 sm:px-7 sm:py-7 lg:px-10 lg:py-9">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-[0.24em] text-slate-300 uppercase">
              Personal Mapping Studio
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.8rem]">
                {heading}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                {subheading}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-stretch gap-3 lg:max-w-md lg:items-end">
            {status}
            {actions}
          </div>
        </div>
      </section>

      <section className="mt-6 flex flex-1 flex-col gap-6">{children}</section>
    </main>
  );
}
