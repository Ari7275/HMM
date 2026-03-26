"use client";

import type { ReactNode } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface EditorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  isDesktop: boolean;
  children: ReactNode;
  footer?: ReactNode;
}

export function EditorSheet({
  open,
  onOpenChange,
  title,
  description,
  isDesktop,
  children,
  footer,
}: EditorSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isDesktop ? "right" : "bottom"}
        className={
          isDesktop
            ? "rounded-none"
            : "h-[100dvh] max-h-[100dvh] rounded-t-[32px] sm:h-[92dvh] sm:max-h-[92dvh]"
        }
      >
        <div className="flex h-full min-h-0 flex-col">
          <SheetHeader className="shrink-0 border-b border-white/6 pr-14">
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="p-6">{children}</div>
          </div>
          {footer ? (
            <div className="sticky bottom-0 shrink-0 border-t border-white/6 bg-[linear-gradient(180deg,rgba(12,17,37,0.92),rgba(8,12,26,0.98))] px-6 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-xl">
              {footer}
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
