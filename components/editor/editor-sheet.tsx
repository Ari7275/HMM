"use client";

import type { ReactNode } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EditorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  isDesktop: boolean;
  children: ReactNode;
}

export function EditorSheet({
  open,
  onOpenChange,
  title,
  description,
  isDesktop,
  children,
}: EditorSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isDesktop ? "right" : "bottom"}
        className={isDesktop ? "rounded-none" : "rounded-t-[32px]"}
      >
        <SheetHeader className="border-b border-white/6 pr-14">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100%-5.5rem)]">
          <div className="p-6">{children}</div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
