"use client";

import { useEffect, useRef } from "react";
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
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open || isDesktop) {
      return;
    }

    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (!target.matches("input, textarea, select, [contenteditable='true']")) {
        return;
      }

      window.setTimeout(() => {
        target.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
      }, 180);
    };

    container.addEventListener("focusin", handleFocusIn);

    return () => container.removeEventListener("focusin", handleFocusIn);
  }, [isDesktop, open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isDesktop ? "right" : "bottom"}
        className={
          isDesktop
            ? "rounded-none"
            : "mobile-editor-sheet rounded-t-[32px]"
        }
      >
        <div className="flex h-full min-h-0 flex-col">
          <SheetHeader className="shrink-0 border-b border-white/6 pr-14">
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          <div
            ref={scrollContainerRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4 scroll-pb-32 [-webkit-overflow-scrolling:touch]"
          >
            <div className="p-6">{children}</div>
          </div>
          {footer ? (
            <div className="shrink-0 border-t border-white/6 bg-[linear-gradient(180deg,rgba(12,17,37,0.92),rgba(8,12,26,0.98))] px-6 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-xl">
              {footer}
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
