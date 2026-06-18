# EMOVEL Page Builder v0.1

Local page builder. Black · Gold `#D4AF37` · Electric blue. Cinematic motion. Static ZIP export.

---


## Quick start

```
npm install
npm run dev       # starts editor at http://localhost:5173
npm run build     # production build (tsc + vite)
```

---

## Data flow

```
prompt text
    │
    ▼
generatePageSpecFromPrompt()        → PageSpec (generator input format only)
    │
    ▼
pageSpecToPuckData()                → Puck Data  ←──── authoritative runtime shape
    │                                     │
    │                               Puck editor
    │                                     │
    ├── onAction ──────────────────► localStorage  (autosave buffer; survives refresh)
    │
    ├── TopBar "Save" ─────────────► pages/<slug>.page.json  (source of truth on disk)
    │
    └── Puck "Publish" ────────────► <page-title>.zip  (static HTML export)
```

**Rules:**

- `PageSpec` is a one-way generator input. Nothing reads it back after conversion.
- Puck `Data` is the single runtime truth. All saving, rendering, and export use it.
- `localStorage` is a fast autosave buffer only. The authoritative copy is the file on disk.

---

## Saved pages → GitHub

1. Edit a page in the builder.
2. Click **Save** in the top bar → writes `pages/<slug>.page.json`.
3. Commit: `git add pages/ && git commit -m "page: update <slug>"`.
4. Push: `git push`.

The `pages/` folder is tracked by Git. Every saved page is a human-readable JSON file,
diff-able, and recoverable via `git log`.

Deleted pages go to `pages/.trash/` (never hard-deleted). To restore, move the file back
to `pages/` and rename it to `<slug>.page.json`.

---

## Asset conventions

All brand images live in `public/assets/`. Page data references them with the canonical
prefix `assets/...` (root-relative), e.g.:

```
assets/emovel-logo-3d-gold.png
assets/source-transparent/emovel-logo-gold-on-dark.png
```

This path resolves identically in the editor preview (Vite dev server) and in the exported
ZIP — no manual path editing required.

---

## Active Hero path

```
src/puck/config/hero.config.tsx       ← Puck field definitions + renderHero()
src/components/sections/HeroSection.tsx  ← cinematic Hero render (wings, motion, 3D logo)
src/types/sections.ts                 ← HeroSectionProps interface
```

There is no other Hero. `src/builder/sections/` contains all other section components.

---

## Palette

| Token    | Value       | Use                          |
|----------|-------------|------------------------------|
| Gold     | `#D4AF37`   | Brand accent, CTA buttons    |
| Black    | `#050505`   | Page background              |
| White    | `#FFFFFF`   | Primary text                 |
| Grey     | `#2A2A30`   | Borders, surfaces            |
| Blue     | `#5CC8FF`   | Shell UI accent (editor only)|

Editor shell uses fixed dark chrome colors (see `tokens.ts` shell section).
Page themes are defined in `src/builder/themes.ts` — EMOVEL Luxury Tech is the default.
