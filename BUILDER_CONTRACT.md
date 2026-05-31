# BUILDER_CONTRACT.md
**EMOVEL Page Builder v0.1 — Foundation Contract**
Status: Phase 1 complete (foundation). Owner of this document: Claude Code.

---

## 1. Scope
A small, productive assembler for premium pages. Not Webflow. Not a marketplace. Not a 3D editor.

Flow: choose theme → choose sections → edit content → preview → save/export page structure (JSON).

Lab location (production untouched):
```
C:\EMOVEL\30_LABS\EMOVEL_PAGE_BUILDER_V0_1
```
Do NOT touch: `10_EMOVEL_BUILDER`, `20_PRODUCTS`, `EMOVEL Digital Systems`.

---

## 2. Roles
- **Claude Code** — architect / integrator / contract owner. Owns shared files. Only one allowed to edit them.
- **Codex** — section factory. Owns render only. One section = one file. Touches nothing shared.

**Shared files (Codex MUST NOT edit):**
`tokens.ts` · `themes.ts` · `section-contract.ts` · `theme.tsx` · `puck.config.tsx` · package/root config.

---

## 3. File map (delivered in Phase 1)
```
src/builder/
  tokens.ts            # token types, system tokens (radius/space/motion), CSS var mapping
  themes.ts            # 5 themes + custom client scaffold; default = EMOVEL Luxury Tech
  section-contract.ts  # exact prop types for the 5 sections — the shared language
  theme.tsx            # ThemeProvider + useTheme + ThemeSwitcher skeleton
  puck.config.tsx      # field definitions + defaultProps (data contract); imports renders
  sections/            # EMPTY — Codex fills this in Phase 2
```

---

## 4. Color rule (non-negotiable)
EMOVEL Luxury Tech is the **default theme, not the system limit.** Clients get their own theme.

- Every theme provides all 13 color keys: `background, surface, surfaceAlt, textPrimary, textSecondary, border, primary, secondary, accent, success, warning, danger, glow`.
- Sections read color **only** via CSS variables (`var(--color-primary)` …). **Zero hardcoded colors.**
- `ThemeProvider` injects the active theme as CSS vars on a wrapper; sections inherit.

Themes shipped: EMOVEL Luxury Tech (default), Clean White, Premium Shop, Creator Portfolio, Digital Product Launch, + Custom Client slot.

---

## 5. Section contract (what Codex builds)
One file per section in `src/builder/sections/`. Render only. Import prop types from `../section-contract`.

| Section | File | Props type |
|---|---|---|
| Hero | `HeroSection.tsx` | `HeroProps` |
| Product Grid | `ProductGridSection.tsx` | `ProductGridProps` |
| Offer | `OfferSection.tsx` | `OfferProps` |
| Screenshot Gallery | `ScreenshotGallerySection.tsx` | `ScreenshotGalleryProps` |
| CTA | `CTASection.tsx` | `CTAProps` |

**Universal done criteria (every section):**
1. Responsive, mobile-first.
2. Theme-aware via CSS vars — no hardcoded color.
3. No dependency on EMOVEL-specific copy; all content from props.
4. Premium in both dark and light themes.

Export each as a **named export** matching the import in `puck.config.tsx`
(e.g. `export function HeroSection(props: HeroProps) { … }`).

---

## 6. Known integration items (Phase 3 — Claude)
- `Offer.benefits` is `string[]`, but Puck arrays hold objects. `puck.config.tsx` flags this
  (`benefits` field). Integration normalizes Puck's array shape → `string[]` before render,
  OR the field is finalized then. Codex implements render against `string[]` and ignores Puck internals.
- After all 5 sections exist, Claude verifies contract compliance, theme behavior, consistency,
  then writes the integration review.

---

## 7. Execution order
1. **Phase 1 — Claude:** foundation contract. ✅ (this delivery)
2. **Phase 2 — Codex:** 5 sections, isolated, one task each.
3. **Phase 3 — Claude:** register, verify theme + consistency, review.
4. **Phase 4 — local test:** `npm install`, `npm run dev`, manual test. (Puck = `@measured/puck`.)
5. **Phase 5 — first real use:** EMOVEL commercial landing page (internal, no external client yet).

No packages installed and no servers started in Phase 1, per mandate.

---

## 8. Codex task template (copy per section)
```
APPROVED TO EDIT BUILDER LAB SECTION ONLY.

Read: src/builder/section-contract.ts and BUILDER_CONTRACT.md
Create only: src/builder/sections/<Name>Section.tsx

Do not edit: tokens.ts, themes.ts, puck.config.tsx, theme.tsx, package files.

Build a theme-aware <Name> section using the defined props type.
Color only via var(--color-*). Responsive. No hardcoded color. No EMOVEL-specific copy.
Export as: export function <Name>Section(props: <Name>Props) { ... }

Stop after creating this section.
```
