"use client";

import { Download, RefreshCcw, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { parseImportPayload, serializeExportPayload } from "@/lib/import-export";
import type { AppStorageData } from "@/lib/types";

interface ImportExportControlsProps {
  data: AppStorageData;
  onImportData: (data: AppStorageData) => void;
  onResetData: () => void;
}

export function ImportExportControls({
  data,
  onImportData,
  onResetData,
}: ImportExportControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImport, setPendingImport] = useState<AppStorageData | null>(null);
  const [pendingFileName, setPendingFileName] = useState("");

  const handleExport = () => {
    const blob = new Blob([serializeExportPayload(data)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);

    anchor.href = url;
    anchor.download = `mandarin-mappings-${date}.json`;
    anchor.click();
    URL.revokeObjectURL(url);

    toast.success("Mappings exported.");
  };

  const handleImportSelection = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsed = parseImportPayload(text);
      setPendingImport(parsed);
      setPendingFileName(file.name);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not import this file. Check the JSON and try again.",
      );
    } finally {
      event.target.value = "";
    }
  };

  const confirmImport = () => {
    if (!pendingImport) {
      return;
    }

    onImportData(pendingImport);
    setPendingImport(null);
    setPendingFileName("");
    toast.success("Mappings imported successfully.");
  };

  return (
    <div className="flex flex-wrap justify-end gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleImportSelection}
      />

      <Button variant="outline" size="sm" onClick={handleExport}>
        <Download className="h-4 w-4" />
        Export JSON
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-4 w-4" />
        Import JSON
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm">
            <RefreshCcw className="h-4 w-4" />
            Reset
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset all mappings?</AlertDialogTitle>
            <AlertDialogDescription>
              This clears your actor and set assignments and restores the seeded initials and finals. Your current browser data will be replaced.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onResetData();
                toast.success("Mappings reset.");
              }}
            >
              Reset everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(pendingImport)}
        onOpenChange={(open) => {
          if (!open) {
            setPendingImport(null);
            setPendingFileName("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import this backup?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingFileName
                ? `${pendingFileName} looks valid. Importing will replace the current local mappings in this browser.`
                : "Importing will replace the current local mappings in this browser."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmImport}>Import data</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
