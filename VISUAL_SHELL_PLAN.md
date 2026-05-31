# VISUAL_SHELL_PLAN.md
**EMOVEL Page Builder v0.1 — Phase 5: Premium Visual Shell**
Date: 2026-05-30 · Planner: Claude Code (architect / integration planner)

---

## 1. Current Builder Status

| Item | Status |
|---|---|
| Puck editor | Running at localhost:5173 |
| All five sections | Registered, renderable, inspectable |
| ThemeProvider | Active — injects `--color-*` vars on wrapper div |
| ThemeSwitcher | Built in `theme.tsx` — functional but not surfaced in UI |
| Puck chrome | Default Puck UI (gray/white Puck design language) |
| EMOVEL visual shell | Not started |

Entry point: `src/App.tsx` renders `<ThemeProvider>` wrapping `<Puck>` directly. Puck controls its own three-panel layout (component list left, canvas center, fields right). No custom shell layer exists between `App.tsx` and Puck.

---

## 2. Visual Gap vs. reference-ui.html

The gap is large. Every visible chrome element differs.

| Area | Current (Puck default) | Target (reference-ui.html) |
|---|---|---|
| App background | Puck white/gray | `#050505` fixed dark |
| Layout grid | Puck internal (~240px / 1fr / 280px) | `236px 1fr 340px` + `57px` top bar |
| Sidebar | Puck component panel (drag list) | EMOVEL wordmark + nav groups + workspace footer |
| Active nav style | None (Puck owns sidebar) | Gold rail, darker surface, gold icon tint |
| Top bar | Puck minimal header (Publish button only) | Page name, draft pill, breakpoint indicator, Preview + Publish |
| Canvas background | Puck plain white iframe | Dotted dark pattern (`radial-gradient` 26px grid) |
| Preview frame | Puck iframe fills canvas | Max-width 860px, `border-radius 18px`, box-shadow, `--p-*` theme vars |
| Section library | Puck component drag list (text only) | Horizontal card dock with thumbnails, name, use-case, Add buttons |
| Inspector header | Puck "Editing: ComponentName" label | Tabs: Content / Style / Theme / Export |
| Inspector fields | Puck default field UI (functional) | EMOVEL dark field style with `--inset` background |
| Theme switcher | Not visible in UI | Preset cards in Theme tab (ThemeSwitcher already built) |
| Export tab | Not present | JSON structure output + Copy button |
| Grain overlay | None | SVG noise overlay at z-index 9999, 2.5% opacity |
| Typography | Browser default / Puck sans-serif | Cinzel (brand), Hanken Grotesk (body) — already loaded in index.html |
| Scrollbar | Browser default | Custom: 9px, `#23232b` thumb, rounded, border clip |

---

## 3. Safest Implementation Strategy

### Constraint
Puck v0.16 manages its own three-panel layout internally. Its DOM structure is:
- Left column: component list (drag source)
- Center: canvas / iframe
- Right: field inspector

These cannot be relocated without wrapping or overriding them. Rebuilding Puck's drag-and-drop, selection, and field binding would destroy the working builder.

### Chosen strategy: Layered CSS + Puck overrides

Apply changes in four ordered layers, each independently safe to ship and test:

**Layer 1 — Global chrome CSS override** (safe, CSS only)
Create `src/shell/chrome.css`. Import it in `App.tsx` after Puck's own CSS. Override Puck's class selectors and CSS variables to apply the EMOVEL dark palette. This layer requires no React changes and produces immediate visual improvement.

**Layer 2 — Puck header override** (low risk, one React component)
Use Puck's documented `overrides.header` slot to replace the default Puck header with a custom `TopBar.tsx`. The Puck Publish/Save action can be re-exposed via Puck's `headerActions` override or replicated as a prop callback. This layer adds the branded TopBar without touching the canvas or inspector.

**Layer 3 — Section library reskin** (medium risk)
The reference shows a horizontal card dock below the canvas. Puck's component list is vertical and in the left column. The safest approach is to use `overrides.componentList` to inject a styled wrapper around Puck's native drag handles, or to add a styled dock above/below the canvas that delegates `addSection` back to Puck's data API. Do not rebuild drag-and-drop. Keep Puck's component list functional behind the styled layer.

**Layer 4 — Inspector shell + ThemeSwitcher** (medium risk)
Use `overrides.actionBar` or a custom inspector wrapper to add EMOVEL-styled tabs above Puck's native field area. The Content tab shows Puck's native fields (untouched). The Theme tab mounts the existing `ThemeSwitcher` component. The Style and Export tabs can begin as static shells. This layer surfaces the ThemeSwitcher that already exists in `theme.tsx`.

### What this strategy preserves
- Puck drag-to-canvas — never touched
- Section field editing in the inspector — never touched
- `puck.config.tsx` — never touched
- All five section components — never touched
- `ThemeProvider` and token system — extended, not replaced
- `theme.tsx` ThemeSwitcher — reused, not rewritten

---

## 4. Component Breakdown

New files go in `src/shell/`. This directory does not exist yet.

| Component | File | Purpose |
|---|---|---|
| Chrome CSS | `src/shell/chrome.css` | Puck chrome color override. EMOVEL dark tokens applied to Puck's own class selectors. Scrollbar styles, grain overlay base, font-smoothing. |
| AppShell | `src/shell/AppShell.tsx` | Thin wrapper. Applies `overflow: hidden; height: 100vh` to contain Puck. May hold shared state passed to overrides via context or props. |
| TopBar | `src/shell/TopBar.tsx` | EMOVEL branded top bar. Page name, draft pill, breakpoint indicator, Preview and Publish action buttons. Mounted via `overrides.header`. |
| SidebarBrand | `src/shell/SidebarBrand.tsx` | EMOVEL wordmark + nav group items + workspace footer. Mounted via `overrides.componentList` as a header above the section drag list, or as a CSS-overlay positioning layer. |
| SectionLibraryDock | `src/shell/SectionLibraryDock.tsx` | Horizontal card dock: thumbnail, name, use-case, Add button. Mounted below the canvas via `overrides.iframe` wrapper or as a styled wrapper around Puck's component list. |
| InspectorShell | `src/shell/InspectorShell.tsx` | Tab strip (Content / Style / Theme / Export) injected above Puck's native field area. Theme tab mounts existing `ThemeSwitcher`. |
| puck-overrides | `src/shell/puck-overrides.tsx` | Single export: the `overrides` object passed to `<Puck overrides={...}>`. Imports TopBar, SidebarBrand, InspectorShell. Keeps App.tsx clean. |
| GrainOverlay | `src/shell/GrainOverlay.tsx` | Optional. Fixed SVG noise overlay. Pure CSS. Could be a single `<div>` in AppShell instead of a separate file. |

---

## 5. Files Likely to be Created

```
src/shell/chrome.css
src/shell/AppShell.tsx
src/shell/TopBar.tsx
src/shell/SidebarBrand.tsx
src/shell/SectionLibraryDock.tsx
src/shell/InspectorShell.tsx
src/shell/puck-overrides.tsx
```

Optional (can be deferred):
```
src/shell/GrainOverlay.tsx
src/shell/ExportPanel.tsx
src/shell/StyleInspector.tsx
```

---

## 6. Files Likely to be Edited

| File | Change |
|---|---|
| `src/App.tsx` | Import `chrome.css`. Wrap `<Puck>` in `<AppShell>`. Pass `overrides={puckOverrides}` to `<Puck>`. |
| `index.html` | Add `html, body { height: 100%; overflow: hidden; }` if not already present. Fonts already loaded — no change needed there. |

---

## 7. Files That Must Not Be Touched

| File | Reason |
|---|---|
| `src/builder/puck.config.tsx` | Owns section registration and Puck field config. Stable. |
| `src/builder/sections/HeroSection.tsx` | Section render. Stable. |
| `src/builder/sections/ProductGridSection.tsx` | Section render. Stable. |
| `src/builder/sections/OfferSection.tsx` | Section render. Stable. |
| `src/builder/sections/ScreenshotGallerySection.tsx` | Section render. Stable. |
| `src/builder/sections/CTASection.tsx` | Section render. Stable. |
| `src/builder/section-contract.ts` | Type source of truth. Stable. |
| `src/builder/tokens.ts` | Token definitions. Stable. |
| `src/builder/themes.ts` | Theme presets. Stable. |
| `src/builder/theme.tsx` | ThemeProvider + ThemeSwitcher. Stable. Reused by InspectorShell. |
| `package.json` | No new packages to install. |
| `tsconfig.json` | No config changes needed. |
| `vite.config.ts` | No config changes needed. |
| `C:\EMOVEL\10_EMOVEL_BUILDER` | Production. Off limits. |
| `C:\EMOVEL\20_PRODUCTS` | Production. Off limits. |
| `C:\Users\flavi\Desktop\EMOVEL Digital Systems` | Production. Off limits. |
| `C:\EMOVEL\30_LABS\EMOVEL_PAGE_BUILDER_FIGMA_UI\*` | Reference lab. Read only. Do not import. Do not merge. |

---

## 8. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Puck CSS specificity conflicts | Medium | Use `chrome.css` with high-specificity selectors or `!important` only on Puck's own override classes. Test each layer independently before proceeding. |
| `overrides.header` removes Puck's native Publish flow | Medium | Re-expose `onPublish` via props from App.tsx passed into TopBar. Puck's `onPublish` callback still fires when called via the data API. |
| `overrides.componentList` breaks drag-to-canvas | High | Do not replace the component list — only wrap it or style its container. Keep Puck's drag handles in the DOM at all times. |
| ThemeProvider scope mismatch | Low | `ThemeProvider` wraps `<Puck>` in App.tsx. Shell components rendered via Puck overrides are children of Puck — they inherit the same context. No scope issue expected. |
| Inspector override hiding Puck's field UI | Medium | The custom tab strip should add above Puck's native inspector body, not replace it. The Content tab is effectively a no-op shell — Puck's fields remain visible beneath. |
| CSS custom property namespace collision | Low | App chrome will use `--emovel-*` prefix in `chrome.css` to avoid collisions with Puck's own CSS variables. Page preview continues to use `--color-*` (existing). |
| Grain overlay performance | Low | The SVG noise overlay is a single 120×120px SVG pattern repeated at 25% opacity. No JS. No impact. |
| Font FOUT on load | Low | Cinzel and Hanken Grotesk are already declared in `index.html` with `display=swap`. No action needed. |

---

## 9. Step-by-Step Codex Tasks

Tasks are ordered for minimum risk. Each task is independently shippable and testable.

### Task 1 — Create `src/shell/chrome.css` (CSS chrome override)

Write a CSS file that:
- Sets `body { background: #050505; }` and `color: #EDEDED` to override Puck's white body
- Targets Puck's root container and panel elements to apply `--bg`, `--surface`, `--surfaceAlt` values
- Applies EMOVEL border color (`#2A2A31`) to Puck's panel borders
- Sets custom scrollbar styles (9px, `#23232b` thumb, 2px transparent border, border-clip)
- Applies `-webkit-font-smoothing: antialiased` globally
- Targets Puck's field inputs to apply `--inset` (`#101015`) background, `#2A2A31` border, `#FFFFFF` text
- Targets Puck's primary button to apply champagne-to-gold gradient

Import this file in `src/App.tsx` after `@measured/puck/dist/index.css`. Test: open the builder and confirm the app chrome is now dark EMOVEL.

### Task 2 — Create `src/shell/TopBar.tsx` + wire `overrides.header`

Write `TopBar.tsx` as a React component matching the reference-ui.html `.topbar` section:
- EMOVEL wordmark placeholder (or blank left area)
- Page name label (hardcoded `"New Page"` for now, matching `initialData.root.props.title`)
- Draft status pill with warning dot
- Desktop breakpoint indicator (static, non-functional)
- Preview button (ghost style, non-functional)
- Publish button (gold gradient, calls the Puck `onPublish` callback passed as prop)

Write `src/shell/puck-overrides.tsx` exporting a `puckOverrides` object with `header: TopBar`.

Edit `src/App.tsx` to import and pass `overrides={puckOverrides}` to `<Puck>`.

Test: builder loads with branded TopBar; Publish still logs to console.

### Task 3 — Style the Puck component list as EMOVEL section library

Inspect Puck's component list DOM structure (using browser DevTools on the running app). Identify Puck's own class names for the component panel and individual component items.

In `chrome.css`, add styles that:
- Apply `--surfaceAlt` background and EMOVEL card border to each component item
- Apply gold-accent border to the Add/drag icon buttons
- Apply correct font weight and text color

Do not create a new `SectionLibraryDock.tsx` in this task — style Puck's existing DOM. Defer full dock extraction to a later task.

Test: the Puck component list looks close to the reference card dock style.

### Task 4 — Create `src/shell/SidebarBrand.tsx` + inject above component list

Write `SidebarBrand.tsx`:
- EMOVEL wordmark: `EMO<gold>VEL</gold>` using Cinzel, 18px, letter-spacing 0.18em
- Nav group items (non-functional, static): Pages, Sections, Themes, Assets, Export, Settings
- Active state on "Sections" by default
- Workspace footer: avatar placeholder, user label

Wire into `puck-overrides.tsx` using whichever Puck override slot positions correctly above the component list (check `overrides.puck` or a positioned wrapper inside `overrides.componentList`).

Test: sidebar shows EMOVEL brand identity alongside the working drag component list.

### Task 5 — Wire ThemeSwitcher into an inspector shell

Write `src/shell/InspectorShell.tsx`:
- Tab strip with four tabs: Content, Style, Theme, Export
- Content tab: renders nothing (Puck's native fields show through as-is)
- Theme tab: renders existing `<ThemeSwitcher />` from `src/builder/theme.tsx`
- Style and Export tabs: static placeholder text for now

Wire into `puck-overrides.tsx` using whichever Puck override slot wraps or prepends the inspector area.

Test: Theme tab appears; clicking theme presets changes `--color-*` vars and page sections rerender correctly.

### Task 6 — Add dotted canvas background + preview frame shadow

In `chrome.css` or a new `src/shell/canvas.css`:
- Target Puck's iframe/canvas wrapper element
- Apply `background-image: radial-gradient(rgba(255,255,255,.05) 1px, transparent 1px); background-size: 26px 26px`
- Apply `background: #050505` to the canvas outer area
- Target the preview frame element (Puck's iframe or inner div) to add `border-radius: 18px`, `box-shadow: 0 30px 80px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.02)`, and `max-width: 860px; margin: 0 auto`

Test: canvas area shows dotted dark pattern; preview frame has rounded corners and shadow.

### Task 7 — Add grain overlay + final polish

Add a fixed grain overlay to `AppShell.tsx` (or `App.tsx`):
```
position: fixed; inset: 0; z-index: 9999; pointer-events: none;
opacity: 0.025; mix-blend-mode: overlay;
background-image: url("data:image/svg+xml,<SVG noise pattern>")
```

Review builder against `reference-ui.html` in a side-by-side browser comparison. Note remaining gaps for a follow-up visual pass.

---

## 10. What Can Be Styled Safely Now vs. What Should Wait

### Safe to implement now (no risk to working builder)

- `chrome.css` — pure CSS, additive, no React changes
- `TopBar.tsx` — isolated component, no section or data impact
- Sidebar brand injection — visual layer only, no logic
- ThemeSwitcher in inspector — component already exists and works
- Canvas dotted background — CSS on Puck's wrapper elements
- Preview frame shadow/radius — CSS only
- Grain overlay — purely decorative, fixed-position

### Should wait (higher risk or requires more research)

- Full `SectionLibraryDock.tsx` replacement — risks breaking Puck's drag-to-canvas if Puck's component list is removed from DOM
- `ContentInspector` tab (live field editing in React) — Puck owns this. Replacing it requires switching to `<Puck.Editor>` headless API, which is a significant architectural change. Not appropriate for v0.1.
- `StyleInspector` tab (token steppers, swatch controls) — requires new state management for per-section style overrides. Deferred to Phase 6.
- `ExportPanel` (JSON output view) — depends on reading Puck's data state. Feasible but not critical now.
- ThemeProvider scope split (separate `--emovel-*` app chrome from `--color-*` page theme) — technically the right architecture (matching the `--p-*` pattern in the reference), but the current single-provider setup works for v0.1. Defer to Phase 6.

---

## 11. Recommendation for First Codex Task

**Task 1 — Create `src/shell/chrome.css`.**

This is the highest-impact, lowest-risk first step:

- No React code to write
- No Puck API surface to navigate
- No risk of breaking the working builder
- Produces immediately visible EMOVEL dark chrome (background, surfaces, borders, inputs, buttons)
- Gives the team a visual confidence signal that the shell approach is working before adding any React components
- Completely reversible: removing one `import` in `App.tsx` restores Puck default

After Task 1 passes a visual review, proceed to Task 2 (TopBar override). Task 2 is the next safest because it adds a discrete, testable React component and exercises the Puck `overrides` API for the first time.

---

## Appendix: Token Mapping Reference

For Codex use when writing `chrome.css`:

| Reference var | Value | Puck target areas |
|---|---|---|
| `--bg: #050505` | App body, canvas outer wrapper |
| `--surface: #0B0B0F` | Sidebar bg, topbar bg, inspector bg |
| `--surfaceAlt: #15151A` | Component cards, active nav item, inspector inset |
| `--inset: #101015` | Input backgrounds, code pre backgrounds |
| `--text: #EDEDED` | General text color |
| `--text-strong: #FFFFFF` | Labels, headings |
| `--text2: #9CA3AF` | Secondary labels, field labels |
| `--border: #2A2A31` | Panel borders, input borders |
| `--gold: #D4AF37` | Active nav icon, Add button border/text, Publish button |
| `--champagne: #F3DFA2` | Publish button gradient start |
| `--blue: #00A3FF` | Active inspector tab underline, focus ring |
| `--blue-glow: rgba(0,163,255,.22)` | Focus box-shadow |
| `--gold-glow: rgba(212,175,55,.16)` | Gold glow effects |

Note: The app chrome in `chrome.css` uses these values directly as literals, not as CSS custom properties, to avoid colliding with Puck's own internal variables.
