import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeEditTime(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes <= 1) {
    return "Edited just now";
  }

  if (diffMinutes < 60) {
    return `Edited ${diffMinutes}m ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (diffHours < 24) {
    return `Edited ${diffHours}h ago`;
  }

  return `Edited ${date.toLocaleDateString()}`;
}
