# Puck Migration Log — @measured/puck → @puckeditor/core

## Phase 3-A: Package migration (0.16.2 → 0.21.2)

**Date:** 2026-05-30  
**Status:** PASS — runtime verified, tsc: 9 errors before / 0 after (see Phase 3-B)

### Snapshot before changes

| Item | Value |
|------|-------|
| Old package | `@measured/puck@0.16.2` |
| New package | `@puckeditor/core@0.21.2` (exact pin, no `^`) |
| Lockfile | `package-lock.json` |

### Breaking-change applicability (0.16.2 → 0.21.2)

| Version | Change | Applies? |
|---------|--------|----------|
| 0.17 | No breaking changes | — |
| 0.18 | React 17 dropped; DropZone wrapper; Drawer direction prop | Not applicable (React 18; zero DropZones; no Drawer) |
| 0.19 | DropZones deprecated → Slots API | **Not applicable** — we use zero DropZones |
| 0.20 | `overrides.components` → `drawer`, `overrides.componentList` → `drawerItem` | **Not applicable** — we use no `overrides` prop |
| 0.21 | Package rename; CSS path; Plugin Rail | **Applied** — all three handled |

### Files changed

| File | Change |
|------|--------|
| `package.json` | `"@measured/puck": "^0.16.0"` → `"@puckeditor/core": "0.21.2"` |
| `src/App.tsx` | Import from `@puckeditor/core`; CSS from `@puckeditor/core/puck.css` |
| `src/builder/puck.config.tsx` | Import `Config` from `@puckeditor/core` |

### Plugin Rail — opted OUT

Used `legacySideBarPlugin()` from `@puckeditor/core` to restore the pre-0.21 sidebar layout.
Reason: MVP; Plugin Rail is a new UI element that changes the editor layout. The official upgrade
guide provides `legacySideBarPlugin` for exactly this case.

### Protected files — untouched

`tokens.ts`, `themes.ts`, `section-contract.ts`, and all 5 section files — zero changes, confirmed by grep.

### Known TypeScript issue at end of Phase 3-A

`tsc --noEmit` reported 9 errors (6 × `TS2322` render incompatibilities + 3 × `TS6133` stale React
imports). These were resolved in Phase 3-B below.

---

## Phase 3-B: Type safety + benefits normalization

**Date:** 2026-05-30  
**Status:** PASS — `tsc --noEmit` exits 0

### tsc error count

| Phase | Errors |
|-------|--------|
| After Phase 3-A (pre-3-B) | **9** (6 × TS2322, 3 × TS6133) |
| After Phase 3-B | **0** |

### Root cause of the 6 × TS2322 errors

`Config` without type parameters resolves to `ConfigInternal<DefaultComponents>` where
`DefaultComponents = Record<string, any>`. This instantiates every component's render as
`PuckComponent<any>`, which in Puck 0.21 expands to:

```ts
(props: WithId<WithPuckProps<{ [K in keyof any]: WithDeepSlots<any, SlotComponent> }>>) => JSX.Element
```

TypeScript's structural checker does not consider `{ [x: string]: any }` as having named
properties (e.g. `eyebrow`, `headline`), so typed render functions like
`(props: HeroProps) => JSX.Element` were rejected. This is a TypeScript-level tightening in 0.21 —
no runtime breakage, but `--noEmit` failed.

### Fix — Config parameterization (`src/builder/puck.config.tsx` only)

Changed from `satisfies Config` (unparameterized) to an explicit type annotation:

```ts
export const config: Config<{
  'Hero':               HeroProps;
  'Product Grid':       ProductGridProps;
  'Offer Section':      OfferProps;
  'Screenshot Gallery': ScreenshotGalleryProps;
  'CTA Section':        CTAProps;
}> = { ... };
```

**Why `: Config<{...}>` annotation rather than `satisfies Config<{...}>`:**
`satisfies` preserves the narrow literal type of `config`. When that literal type is passed to
`<Puck<UserConfig extends Config> config={config}>`, TypeScript re-checks the literal against the
base `Config` bound — which fails for the same reason as before. The explicit `: Config<{...}>`
annotation widens `config`'s type to `Config<{Hero: HeroProps, ...}>`, which structurally extends
`Config` (base) and satisfies the `Puck` component's generic bound.

Individual `defaultProps` entries keep their own `satisfies HeroProps` / `satisfies ProductGridProps`
etc. checks, so per-field validation is preserved.

**Secondary fix — `getItemSummary` parameter types:**
With the parameterized Config, `getItemSummary` is now typed as `(item: ItemType) => ReactNode`.
The `Record<string, unknown>` parameter type was replaced with the correct item types from
section-contract.ts:
- Product Grid: `(item: ProductCard) => item.title || 'Product'`
- Screenshot Gallery: `(item: ShotItem) => item.caption || 'Shot'`
- Offer Section benefits: no change needed — `ArrayField<never>` (from `string[]` element type)
  types `getItemSummary` as `(item: never) => ReactNode`, which `Record<string, unknown>` satisfies.

### Benefits normalization — `resolveData` mechanism

**The mismatch:**
Puck's `array` field serializes items as `{ text: string }[]` (editor-internal representation).
`OfferProps.benefits` is `string[]` (render contract). These two types cannot be unified in the
Config type parameter because `string` is not `{ [key: string]: any }` (primitive vs. object).

**Mechanism chosen: `resolveData` (per-component config property)**

Two alternatives considered and rejected:
- `transformProps` — a batch data-migration utility (`transformProps(data, transforms)`) for
  one-shot transformation of a full saved Data JSON payload. Not a live editor hook; not scoped
  to a single component.
- `fieldTransforms` — a `<Puck fieldTransforms={...}>` prop that applies per-field-type globally.
  Lives in App.tsx (outside the "fix in puck.config.tsx only" constraint); applies to ALL array
  fields, not just benefits.

`resolveData` is per-component, fires on every prop change and on load, lives in the component
config (puck.config.tsx), and is designed precisely for normalizing stored field values before they
reach the render function:

```ts
// In the 'Offer Section' component config:
resolveData: ({ props }) => ({
  props: {
    benefits: normalizeBenefits(props.benefits as Array<string | { text?: string }>),
  },
}),
render: (props: OfferProps) => <OfferSection {...props} />,
```

The `as Array<string | { text?: string }>` cast is intentional: TypeScript types `props.benefits`
as `string[]` (per `OfferProps`), but the array field editor passes `{ text: string }[]` at
runtime. The cast acknowledges the boundary without lying about the contract.

**Normalization is correct for all three input forms:**

| Input form | Source | Output |
|------------|--------|--------|
| `string[]` | defaultProps on initial load | `string[]` (identity) |
| `{ text: string }[]` | Puck array field editor | `string[]` (extracted) |
| Mixed `(string \| { text?: string })[]` | partially-migrated data | `string[]` (both handled) |

### Pre-existing TS6133 errors fixed in same pass

`"jsx": "react-jsx"` (automatic JSX runtime) does not require `import React from 'react'`.
Three files had stale default React imports that triggered `noUnusedLocals`:
- `src/App.tsx` — `import React` removed
- `src/builder/puck.config.tsx` — `import React` removed
- `src/builder/theme.tsx` — `React` removed from default import; named imports retained

### Protected files — untouched

`section-contract.ts` — not changed. `benefits` remains `string[]`.  
`OfferSection.tsx` — not changed. Renders `string[]` as before.  
All 5 section component files — not changed.
