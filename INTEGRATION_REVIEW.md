# INTEGRATION_REVIEW.md
**EMOVEL Page Builder v0.1 — Phase 3 Integration Review**
Date: 2026-05-30 · Reviewer: Claude Code (architect / contract owner)

---

## Integration Verdict

**SECTIONS INTEGRATED. READY FOR LOCAL TEST (Phase 4).**

All five sections are registered in `puck.config.tsx`. Contract drift is resolved. No hardcoded colors, no locked EMOVEL content in renders, no external imports. The remaining IDE errors are pre-install type noise — they will fully resolve after `npm install` and are not code correctness issues.

---

## Files Reviewed

| File | Status |
|---|---|
| `src/builder/sections/HeroSection.tsx` | Reviewed — drift fixed |
| `src/builder/sections/ProductGridSection.tsx` | Reviewed — no issues |
| `src/builder/sections/OfferSection.tsx` | Reviewed — no issues |
| `src/builder/sections/ScreenshotGallerySection.tsx` | Reviewed — drift fixed |
| `src/builder/sections/CTASection.tsx` | Reviewed — no issues |
| `src/builder/section-contract.ts` | Reviewed — no changes needed |
| `src/builder/puck.config.tsx` | Fully replaced — sections integrated |
| `BUILDER_CONTRACT.md` | Reviewed — no changes needed |

---

## Files Edited

| File | Change |
|---|---|
| `src/builder/sections/HeroSection.tsx` | Contract drift fix: removed `subheadline` optional prop; `description` now used directly; CSS class renamed from `emovel-hero__subheadline` to `emovel-hero__description` for naming consistency |
| `src/builder/sections/ScreenshotGallerySection.tsx` | Contract drift fix: removed `screenshots` optional prop alias and internal `ScreenshotItem` type extension; `shots` is now the sole data source; image branch removed (not in v0.1 contract); simplified to caption-only card rendering |
| `src/builder/puck.config.tsx` | Full integration: real section imports wired; `SectionStub` removed; renders replaced; component keys renamed to required display names; `defaultProps` updated to neutral starter content; `initialData` root title updated to `'New Page'` |

## Files Created

| File | Purpose |
|---|---|
| `INTEGRATION_REVIEW.md` | This file |

---

## Contract Drift Found and Resolved

### A. HeroSection — `subheadline` vs `description`

**Found:** Codex defined `HeroSectionProps = HeroProps & { subheadline?: string; visualStyle?: string }`. The component used `const supportingText = subheadline || description` — preferring an optional prop that Puck never passes (it's not in the config fields). The CSS class was named `emovel-hero__subheadline` while the contract field is `description`.

**Decision:** `description` is the canonical contract field. The `subheadline` alias was dead code when used via Puck. Removed.

**Resolved:** `HeroSection` now accepts `HeroProps` (plus internal `visualStyle` with default). It uses `description` directly. CSS class renamed to `emovel-hero__description`. No contract changes required — `section-contract.ts` `HeroProps.description` was already correct.

### B. ScreenshotGallerySection — `screenshots` vs `shots`

**Found:** Codex defined `ScreenshotGallerySectionProps = ScreenshotGalleryProps & { screenshots?: ScreenshotItem[] }` where `ScreenshotItem` added `src` and `alt` fields not in the contract. The component used `screenshots || shots` — trying both field names. The Puck config field is `shots`. The render included an image branch (`<img src={...} />`) that would never trigger because `ShotItem` has only `caption`.

**Decision:** `shots` is the canonical field name (it's in both the contract and Puck config). Image fields (`src`, `alt`) are out of scope for v0.1. The gallery renders caption-only cards with a styled placeholder area — appropriate for a text-driven builder at this stage.

**Resolved:** `ScreenshotGallerySection` now accepts `ScreenshotGalleryProps` directly. `screenshots` alias and `ScreenshotItem` internal type are removed. Image branch removed. Placeholder div renders in place of images.

### C. CTASection — action labels vs structured objects

**Found:** `CTAProps` defines `primaryAction` and `secondaryAction` as plain strings. Both buttons link to `#primary-action` and `#secondary-action` as placeholder hrefs.

**Decision:** Labels only for v0.1. The Puck config has no URL fields. Adding URLs would require a new Puck field, a contract update, and a render change — appropriate for a future phase. No change made.

**Status:** No drift. Contract and render are aligned.

---

## Final Prop Shapes Per Section

### Hero
```typescript
interface HeroProps {
  eyebrow: string;
  headline: string;
  description: string;    // paragraph text under headline
  primaryCTA: string;
  secondaryCTA: string;
}
// Internal only (not a Puck field, not in contract):
// visualStyle?: 'panel' | 'orbital' | 'minimal'  — defaults to 'panel'
```

### Product Grid
```typescript
interface ProductGridProps {
  sectionTitle: string;
  sectionDescription: string;
  products: Array<{
    title: string;
    description: string;
    status: 'available' | 'coming_soon' | 'early_access';
    cta: string;
  }>;
}
```

### Offer Section
```typescript
interface OfferProps {
  title: string;
  problem: string;
  solution: string;
  benefits: string[];   // Puck delivers { text: string }[]; puck.config normalizes to string[]
}
```

### Screenshot Gallery
```typescript
interface ScreenshotGalleryProps {
  title: string;
  description: string;
  shots: Array<{ caption: string }>;  // caption-only for v0.1; image fields deferred
}
```

### CTA Section
```typescript
interface CTAProps {
  headline: string;
  subheadline: string;
  primaryAction: string;    // label only; URL field deferred to future phase
  secondaryAction: string;  // label only
  supportText: string;
}
```

---

## Puck Registry Status

| Puck component key | Section component | Registered | Render live |
|---|---|---|---|
| `Hero` | `HeroSection` | ✅ | ✅ |
| `Product Grid` | `ProductGridSection` | ✅ | ✅ |
| `Offer Section` | `OfferSection` | ✅ | ✅ (benefits normalized) |
| `Screenshot Gallery` | `ScreenshotGallerySection` | ✅ | ✅ |
| `CTA Section` | `CTASection` | ✅ | ✅ |

`SectionStub` is removed. No Phase 2/3 TODO comments remain in `puck.config.tsx`.

---

## Theme / Token Status

All five sections use only `var(--color-*)`, `var(--radius-*)`, `var(--space-*)`, and `var(--motion-*)` CSS custom properties. No hardcoded color values were found in any section render.

Token coverage per section (all confirmed present):

| Token | Hero | ProductGrid | Offer | Gallery | CTA |
|---|---|---|---|---|---|
| `--color-background` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `--color-surface` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `--color-surfaceAlt` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `--color-textPrimary` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `--color-textSecondary` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `--color-border` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `--color-primary` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `--color-secondary` | ✅ | ✅ | ✅ | — | — |
| `--color-glow` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `--color-success` | — | ✅ | ✅ | — | — |
| `--color-warning` | — | — | ✅ | — | — |
| `--color-accent` | — | — | — | — | — |
| `--color-danger` | — | — | — | — | — |
| `--radius-md/lg/pill` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `--space-section-v/h` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `--space-hero-v/h` | ✅ | — | — | — | — |
| `--motion-duration/ease` | ✅ | ✅ | — | ✅ | ✅ |

`--color-accent` and `--color-danger` are defined in `tokens.ts` and `themes.ts` but not currently used by any section. This is expected — they are available for future sections or style controls.

`--color-secondary` maps to champagne (`#F3DFA2`) in the EMOVEL theme and is used in Hero (eyebrow) and ProductGrid (badge accent). All other themes supply their own `secondary` value.

---

## IDE Diagnostics — Pre-Install Noise

The IDE is reporting TypeScript errors on every `.tsx` file in the project. **These are all caused by `@types/react` and `@measured/puck` not being installed yet.** They are not code errors.

Error classes observed:
- `Cannot find module 'react'` — no `node_modules` present
- `Cannot find module '@measured/puck'` — no `node_modules` present
- `JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists` — same root cause
- `This JSX tag requires the module path 'react/jsx-runtime' to exist` — same root cause

Additionally, the IDE showed:
- `'props' is declared but its value is never read` on render functions — TypeScript cannot track JSX spread `{...props}` without React types; these are false positives
- `'_normalized' is declared but its value is never read` — stale cached diagnostic from the previous `puck.config.tsx` which used `_normalized` as a deliberately-unused variable name; the current file uses `normalized` and passes it directly to `<OfferSection>`

**All of the above will resolve when `npm install` is run in Phase 4.**

---

## Remaining Issues

### Minor — Hardcoded text in OfferSection render

`OfferSection.tsx` line 233 renders the benefits section with the hardcoded heading `"What visitors understand"`. This text does not come from props.

**Severity:** Low. The text is neutral and generic. It does not contain EMOVEL-specific copy.
**Action:** Acceptable for v0.1. A future Codex task could add a `benefitsLabel?: string` prop with that as the default.

### Minor — Gallery is caption-only in v0.1

`ScreenshotGallerySection` renders placeholder tiles instead of real images. This is intentional: `ShotItem` has only `caption` and there is no image upload in the Puck config yet.

**Severity:** Low. The section is visually complete (styled placeholder tiles + captions). It correctly represents the content structure.
**Action:** Acceptable for v0.1. Phase 5 or later can add an `imageUrl` field to `ShotItem` and the Puck config.

### Minor — CTA buttons use placeholder hrefs

Both action buttons in `HeroSection` and `CTASection` use `href="#primary-action"` and `href="#secondary-action"` as placeholders.

**Severity:** Low. Expected for a static page builder with no routing.
**Action:** Acceptable for v0.1.

---

## What Codex May Safely Fix Next

If a follow-up Codex task is needed before Phase 4, the following are safe:

- Add `benefitsLabel?: string` prop to `OfferSection` to make the "What visitors understand" heading editable (update `section-contract.ts`, `OfferSection.tsx`, and the corresponding Puck field in `puck.config.tsx`)
- Add a `kicker` (small label above the section title) to `ProductGridSection` or `OfferSection` if the visual needs it
- Improve the gallery placeholder tile (add subtle pattern or icon) without changing the contract

Each task: one section file + optionally `section-contract.ts` + `puck.config.tsx`. No other shared files.

---

## What Must Not Be Touched

- `src/builder/tokens.ts` — stable; no missing tokens identified
- `src/builder/themes.ts` — stable; all 6 themes verified present
- `src/builder/theme.tsx` — stable; `ThemeProvider` and `ThemeSwitcher` are correct
- `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html` — root config; Phase 4 only
- `C:\EMOVEL\10_EMOVEL_BUILDER` — production; never touch
- `C:\EMOVEL\20_PRODUCTS` — production; never touch
- `C:\Users\flavi\Desktop\EMOVEL Digital Systems` — production; never touch
- `C:\EMOVEL\30_LABS\EMOVEL_PAGE_BUILDER_FIGMA_UI` — reference lab; do not merge

---

## Recommendation

**Proceed to Phase 4: local test.**

Run `npm install` then `npm run dev`. Verify:
1. Puck editor loads with all five sections available in the sidebar
2. Dragging each section into the canvas renders the correct component
3. Editing content fields in the inspector updates the live preview
4. Theme switcher changes all `--color-*` vars and sections respond visually
5. Each section looks correct in both a dark theme (EMOVEL Luxury Tech) and a light theme (Clean White or Premium Shop)

No code changes are required before running the local test.
