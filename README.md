# Mandarin Blueprint Mapper

A small personal web app for managing your Mandarin Blueprint / Hanzi Movie Method mappings.

## Tech Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- `shadcn/ui`-style component primitives
- Framer Motion for subtle transitions
- `localStorage` for persistence

## Project Structure

- `app/`: Next.js entrypoints, layout, and global styles.
- `components/`: dashboard UI, grids, editor sheet, and reusable controls.
- `components/ui/`: shared UI primitives.
- `hooks/`: responsive helpers and the mapping store.
- `lib/`: seed data, types, search helpers, persistence, import/export, and status logic.

## Seed Data

The fixed HMM sound inventory lives in `lib/seed-data.ts`.

- `INITIAL_SEEDS` contains the reusable initials / actor slots.
- `FINAL_SEEDS` contains the reusable finals / set slots.

These seeds are treated as the source of truth for the available pinyin items. Imported or stored data is merged onto them so the chart stays intact.

## Persistence

Persistence is handled in `hooks/use-mapping-store.ts` and `lib/storage.ts`.

- The app loads saved data from `localStorage` on the client.
- Editor changes stay in local draft state while you type.
- Nothing is committed to app state or `localStorage` until you click `Save`.
- When you save, the visible app state updates immediately and the browser write is slightly deferred to avoid unnecessary storage churn.
- Closing or canceling with unsaved edits discards the draft after confirmation.

## Import / Export

Import and export helpers live in `lib/import-export.ts`.

- `Export JSON` downloads the current mappings as a readable JSON file.
- `Import JSON` validates the uploaded file before replacing local data.
- Unknown or malformed data is rejected so bad JSON does not break the app.
- `Reset` clears saved mappings and restores the empty seeded state.

## Running The Project

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

Useful commands:

```bash
npm run lint
npm run typecheck
npm run build
```

## Phase 2 Ideas

- Add optional tone metadata or tone-aware views.
- Add lightweight tagging or favorites for high-priority mappings.
- Add richer import/export versioning for future schema changes.
- Introduce a backend sync layer without changing the UI model.
- Expand into full Hanzi movie composition once the foundational mapping workflow feels solid.
