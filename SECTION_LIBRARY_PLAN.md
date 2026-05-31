# SECTION_LIBRARY_PLAN.md
**Phase 5 — Section Library Expansion**
Owner: Claude Code (architect). Date: 2026-05-31.
Status: TYPES DONE — renders not built yet. Codex picks up from Step 3.

---

## Step 1 — Target Library (18 sections)

### Existing sections (5, untouched)

| # | Name | File | Props type |
|---|------|------|------------|
| 1 | Hero | `HeroSection.tsx` | `HeroProps` |
| 2 | Product Grid | `ProductGridSection.tsx` | `ProductGridProps` |
| 3 | Offer Section | `OfferSection.tsx` | `OfferProps` |
| 4 | Screenshot Gallery | `ScreenshotGallerySection.tsx` | `ScreenshotGalleryProps` |
| 5 | CTA Section | `CTASection.tsx` | `CTAProps` |

### New sections (13)

#### Navigation / Header

| # | Name | File | Props type | Page role | Use case |
|---|------|------|------------|-----------|----------|
| 6 | NavBar | `NavBarSection.tsx` | `NavBarProps` | Navigation | Top nav with logo, links, primary CTA button; supports static and sticky position |

Fields: `logoText` (text), `links` (array: label+href), `ctaLabel` (text), `ctaHref` (text), `position` (select: static/sticky)  
Tokens: `--color-background`, `--color-surface`, `--color-textPrimary`, `--color-primary`, `--color-border`  
Layout variant: `position: 'static' | 'sticky'`

---

#### Social Proof

| # | Name | File | Props type | Page role | Use case |
|---|------|------|------------|-----------|----------|
| 7 | LogoStrip | `LogoStripSection.tsx` | `LogoStripProps` | Social proof | Horizontal strip of brand logos/names; "trusted by" credibility row |

Fields: `eyebrow` (text), `logos` (array: name+imageUrl)  
Tokens: `--color-background`, `--color-surface`, `--color-textSecondary`, `--color-border`  
Note: `imageUrl` empty → render brand name as styled text placeholder

| # | Name | File | Props type | Page role | Use case |
|---|------|------|------------|-----------|----------|
| 8 | TestimonialsSection | `TestimonialsSection.tsx` | `TestimonialsProps` | Social proof | Customer quotes with author, role, optional avatar and star rating |

Fields: `eyebrow` (text), `headline` (text), `testimonials` (array: quote, authorName, authorRole, authorCompany, avatarUrl, rating), `layout` (select: grid/slider)  
Tokens: `--color-surface`, `--color-surfaceAlt`, `--color-textPrimary`, `--color-textSecondary`, `--color-primary`, `--color-border`, `--radius-md`  
Layout variant: `layout: 'grid' | 'slider'` — slider uses CSS scroll-snap, no JS library

---

#### Feature Sections

| # | Name | File | Props type | Page role | Use case |
|---|------|------|------------|-----------|----------|
| 9 | FeatureGrid | `FeatureGridSection.tsx` | `FeatureGridProps` | Features | 2/3/4-column grid of icon+title+body feature cards |
| 10 | FeatureSplit | `FeatureSplitSection.tsx` | `FeatureSplitProps` | Features | Large image beside headline + copy + CTA; alternating sides across uses |

**FeatureGrid** fields: `eyebrow`, `headline`, `subheadline` (text/textarea), `features` (array: icon+title+body), `columns` (select: 2/3/4)  
Tokens: `--color-surface`, `--color-surfaceAlt`, `--color-textPrimary`, `--color-textSecondary`, `--color-primary`, `--color-border`, `--radius-md`  
Layout variant: `columns: 2 | 3 | 4`

**FeatureSplit** fields: `eyebrow`, `headline`, `body`, `ctaLabel`, `ctaHref`, `imageUrl`, `imageAlt` (text/textarea), `imagePosition` (select: left/right)  
Tokens: `--color-background`, `--color-surface`, `--color-textPrimary`, `--color-textSecondary`, `--color-primary`, `--radius-lg`  
Layout variant: `imagePosition: 'left' | 'right'` — this is the key layout toggle; same section renders both column orders

---

#### Commerce / Conversion

| # | Name | File | Props type | Page role | Use case |
|---|------|------|------------|-----------|----------|
| 11 | PricingTable | `PricingTableSection.tsx` | `PricingTableProps` | Pricing | 2–3 plan columns with feature bullets, CTA per plan, optional monthly/annual toggle |

Fields: `eyebrow`, `headline`, `subheadline` (text/textarea), `plans` (array: name, price, priceAnnual, description, features, ctaLabel, ctaHref, highlight, badge), `billingPeriod` (select: monthly/both)  
Tokens: `--color-surface`, `--color-surfaceAlt`, `--color-textPrimary`, `--color-textSecondary`, `--color-primary`, `--color-secondary`, `--color-border`, `--color-success`, `--radius-lg`  
Note: `features` field is newline-delimited string (textarea) — render splits on `\n` to produce bullet list, avoiding nested array-within-array Puck limitation

---

#### Support / Trust

| # | Name | File | Props type | Page role | Use case |
|---|------|------|------------|-----------|----------|
| 12 | FAQSection | `FAQSection.tsx` | `FAQProps` | FAQ | Question/answer pairs reducing buyer friction; accordion or 2-column layout |

Fields: `eyebrow`, `headline`, `subheadline` (text/textarea), `items` (array: question+answer), `layout` (select: accordion/columns)  
Tokens: `--color-surface`, `--color-surfaceAlt`, `--color-textPrimary`, `--color-textSecondary`, `--color-border`, `--color-primary`, `--radius-md`  
Note: accordion layout uses native `<details>/<summary>` — no JS state required

---

#### Credibility

| # | Name | File | Props type | Page role | Use case |
|---|------|------|------------|-----------|----------|
| 13 | StatsBar | `StatsBarSection.tsx` | `StatsBarProps` | Metrics | Key metric band — large value + label pairs building credibility |

Fields: `eyebrow` (text), `stats` (array: value+label)  
Tokens: `--color-background`, `--color-surface`, `--color-textPrimary`, `--color-textSecondary`, `--color-primary`, `--color-border`

---

#### Media

| # | Name | File | Props type | Page role | Use case |
|---|------|------|------------|-----------|----------|
| 14 | VideoEmbed | `VideoEmbedSection.tsx` | `VideoEmbedProps` | Demo / media | Product demo video with headline, iframe embed, 16:9 or 4:3 aspect ratio |

Fields: `eyebrow`, `headline`, `subheadline`, `embedUrl`, `videoTitle` (text/textarea), `aspectRatio` (select: 16:9/4:3)  
Tokens: `--color-background`, `--color-surface`, `--color-textPrimary`, `--color-textSecondary`, `--color-primary`, `--radius-lg`, `--color-glow`  
Note: `embedUrl` must be the iframe embed URL, not the watch URL. Render: `<iframe src={embedUrl} title={videoTitle} ...>`

---

#### Lead Capture

| # | Name | File | Props type | Page role | Use case |
|---|------|------|------------|-----------|----------|
| 15 | NewsletterSection | `NewsletterSection.tsx` | `NewsletterProps` | Lead capture | Email opt-in with input + CTA button; centered or split layout |

Fields: `eyebrow`, `headline`, `subheadline`, `inputPlaceholder`, `ctaLabel`, `privacyNote` (text/textarea), `layout` (select: centered/split)  
Tokens: `--color-surface`, `--color-surfaceAlt`, `--color-textPrimary`, `--color-textSecondary`, `--color-primary`, `--color-border`, `--radius-pill`, `--radius-md`  
Note: form is presentational only — no server action or API; onSubmit wire-up is the site owner's concern

---

#### About

| # | Name | File | Props type | Page role | Use case |
|---|------|------|------------|-----------|----------|
| 16 | TeamGrid | `TeamGridSection.tsx` | `TeamGridProps` | About | Team member cards — name, role, bio, avatar; 2/3/4-column |
| 17 | ContentBlock | `ContentBlockSection.tsx` | `ContentBlockProps` | Content | Long-form text section for about copy, manifesto, or legal text |

**TeamGrid** fields: `eyebrow`, `headline`, `subheadline` (text/textarea), `members` (array: name, role, bio, avatarUrl), `columns` (select: 2/3/4)  
Tokens: `--color-surface`, `--color-surfaceAlt`, `--color-textPrimary`, `--color-textSecondary`, `--color-border`, `--radius-lg`

**ContentBlock** fields: `eyebrow`, `headline`, `body`, (text/textarea), `alignment` (select: left/center), `layout` (select: prose/wide)  
Tokens: `--color-background`, `--color-textPrimary`, `--color-textSecondary`, `--color-primary`, `--color-border`

---

#### Site Frame

| # | Name | File | Props type | Page role | Use case |
|---|------|------|------------|-----------|----------|
| 18 | FooterSection | `FooterSection.tsx` | `FooterProps` | Footer | Site footer with logo, tagline, link columns, copyright, social links |

Fields: `logoText`, `tagline`, `copyright` (text/textarea), `linkGroups` (array: heading + linksText), `socialLinks` (array: label+href)  
Tokens: `--color-surface`, `--color-surfaceAlt`, `--color-textPrimary`, `--color-textSecondary`, `--color-border`, `--color-primary`  
**Nested array note** (see Step 2 below): `linkGroups[n].links` cannot be a Puck array within a Puck array. puck.config.tsx workaround is defined there; render receives clean `FooterLinkGroup[]`.

---

## Step 2 — Contract Extension

File extended: `src/builder/section-contract.ts`  
tsc --noEmit: **PASS** (confirmed after changes)

### New shared types added

```typescript
CTALink            // { label, href } — reused by NavBar, FeatureSplit, Footer, social links
NavPosition        // 'static' | 'sticky'
ImagePosition      // 'left' | 'right'
ColumnCount        // 2 | 3 | 4  (numeric union — Puck select options use numeric values)
TestimonialLayout  // 'grid' | 'slider'
FAQLayout          // 'accordion' | 'columns'
NewsletterLayout   // 'centered' | 'split'
ContentAlignment   // 'left' | 'center'
ContentLayout      // 'prose' | 'wide'
AspectRatio        // '16:9' | '4:3'
PlanHighlight      // 'none' | 'featured'
BillingPeriod      // 'monthly' | 'both'
```

### New item / sub-interfaces added

```typescript
LogoItem           // { name, imageUrl }
FeatureCard        // { icon, title, body }
TestimonialCard    // { quote, authorName, authorRole, authorCompany, avatarUrl, rating }
PricingPlan        // { name, price, priceAnnual, description, features, ctaLabel, ctaHref, highlight, badge }
FAQItem            // { question, answer }
StatItem           // { value, label }
TeamMember         // { name, role, bio, avatarUrl }
FooterLinkGroup    // { heading, links: CTALink[] }
```

### New section prop interfaces added

```typescript
NavBarProps, LogoStripProps, FeatureGridProps, FeatureSplitProps, TestimonialsProps,
PricingTableProps, FAQProps, StatsBarProps, VideoEmbedProps, TeamGridProps,
NewsletterProps, ContentBlockProps, FooterProps
```

### Puck array serialization — F-4 lesson applied

Every array field is annotated in section-contract.ts with a `// PUCK:` comment documenting the stored shape and whether normalization is needed:

| Section | Array field | Puck stores as | Normalization |
|---------|-------------|----------------|---------------|
| NavBar | `links` | `CTALink[]` | None — fields match interface |
| LogoStrip | `logos` | `LogoItem[]` | None |
| FeatureGrid | `features` | `FeatureCard[]` | None |
| Testimonials | `testimonials` | `TestimonialCard[]` | None |
| PricingTable | `plans` | `PricingPlan[]` | None |
| FAQ | `items` | `FAQItem[]` | None |
| StatsBar | `stats` | `StatItem[]` | None |
| TeamGrid | `members` | `TeamMember[]` | None |
| NewsletterSection | — | — | — |
| Footer | `socialLinks` | `CTALink[]` | None |
| Footer | `linkGroups` | Textarea-parsed | **Architect handles** in puck.config.tsx — Puck cannot nest array-in-array; workaround: store each group's links as a `"Label \| href"` per-line textarea; parse in render wrapper |
| PricingTable | `plans[n].features` | `string` (textarea) | Render splits on `\n` — encoded in `PricingPlan.features: string` in contract (not `string[]`), so no runtime type mismatch |

Rule (from F-4): **never normalize in `resolveData`** — normalization happens at the render boundary in puck.config.tsx's render function, which calls the section with clean typed props.

### Existing interfaces — untouched

`ProductStatus`, `ProductCard`, `HeroProps`, `ProductGridProps`, `OfferProps`, `ShotItem`, `ScreenshotGalleryProps`, `CTAProps` — not modified.

---

## Step 3 — Build Order + Codex Task Template

### Build order (by leverage)

Priority order for Codex tasks. Sections every site needs come first.

| Order | Section | File | Reason |
|-------|---------|------|--------|
| 1 | NavBar | `NavBarSection.tsx` | Every page; frames everything below |
| 2 | FooterSection | `FooterSection.tsx` | Every page; closes the layout |
| 3 | FeatureGrid | `FeatureGridSection.tsx` | On nearly every landing page |
| 4 | FeatureSplit | `FeatureSplitSection.tsx` | Alt feature layout; pairs with FeatureGrid |
| 5 | PricingTable | `PricingTableSection.tsx` | Highest conversion value |
| 6 | FAQSection | `FAQSection.tsx` | Reduces friction; short to implement |
| 7 | TestimonialsSection | `TestimonialsSection.tsx` | Social proof, high trust impact |
| 8 | LogoStrip | `LogoStripSection.tsx` | Brand credibility; simplest section |
| 9 | StatsBar | `StatsBarSection.tsx` | Credibility; layout is a single row |
| 10 | NewsletterSection | `NewsletterSection.tsx` | Lead capture; every product site |
| 11 | VideoEmbed | `VideoEmbedSection.tsx` | Demo; medium complexity (iframe) |
| 12 | ContentBlock | `ContentBlockSection.tsx` | About/long-form pages |
| 13 | TeamGrid | `TeamGridSection.tsx` | About pages; last because niche |

### Codex task template (one task = one section)

Copy this block verbatim, substituting `<Name>`, `<NameProps>`, and `<file>`:

```
APPROVED TO EDIT BUILDER LAB SECTION ONLY.
Owner: Codex. Lab: C:\EMOVEL\30_LABS\EMOVEL_PAGE_BUILDER_V0_1

READ FIRST (do not skip):
  src/builder/section-contract.ts   — your props type is defined here
  SECTION_LIBRARY_PLAN.md           — QA checklist, token list, layout notes for this section
  BUILDER_CONTRACT.md               — color rules and file ownership

CREATE ONLY:
  src/builder/sections/<file>

DO NOT EDIT (contract files, shared):
  tokens.ts, themes.ts, section-contract.ts, theme.tsx, puck.config.tsx, package files,
  any other file in src/builder/sections/

TASK:
  Build a theme-aware <Name> section component using <NameProps> from section-contract.ts.

RULES — all are non-negotiable:
  - Color ONLY via CSS custom properties: var(--color-*), var(--radius-*), var(--space-*)
  - Zero hardcoded hex, rgb(), or named colors
  - Zero EMOVEL-specific copy — all text from props, all defaults in puck.config.tsx (not your file)
  - Mobile-first responsive: 360px → 768px → 1440px breakpoints
  - Named export: export function <Name>Section(props: <NameProps>) { … }
  - Import props type from '../section-contract' only — no other builder imports
  - No JS-dependent interactions unless the section's layout variant requires it
    (accordion = <details>/<summary>; slider = CSS scroll-snap)
  - Professional in both dark AND light themes — test mentally against emovel (dark) and clean (light)
  - See SECTION_LIBRARY_PLAN.md §Step 4 for the full visual QA checklist

STOP after creating this one file. Do not register it in puck.config.tsx — the architect does that.
```

**How to register after Codex delivers:** Claude adds the section to `puck.config.tsx`:
1. Import the named export from `./sections/<file>`
2. Add the component key to `Config<{...}>` generic
3. Define `fields`, `defaultProps`, and `render` (including any normalization wrappers)
4. Run `tsc --noEmit` — must stay at 0 errors

---

## Step 4 — Visual QA Checklist (per section)

A section is **not done** until it passes all items below. "Compiles" is not done.

### Responsive (mandatory)

- [ ] **360px**: no horizontal overflow; single-column layout; tap targets ≥ 44px
- [ ] **768px**: intended tablet layout (usually 2-column or condensed multi-column)
- [ ] **1440px**: full desktop layout; content does not stretch past max-width container

### Spacing rhythm (mandatory)

- [ ] Section vertical padding uses `var(--space-section-v)` (54px) — or `var(--space-hero-v)` for Hero-adjacent sections
- [ ] Section horizontal padding uses `var(--space-section-h)` (52px) at desktop; collapses to ~20px at 360px
- [ ] Internal card/element gaps follow the system: `var(--radius-md)` for card padding, multiples of 8px for gaps
- [ ] No arbitrary pixel values for spacing that should come from the token system

### Theme compatibility (mandatory — tested in at least 3 of 6 themes)

- [ ] **emovel** (dark gold): primary = #D4AF37 — no gold-specific hardcoding
- [ ] **clean** (light white): textPrimary = #111 on white — verify contrast ≥ 4.5:1
- [ ] **launch** (dark blue): primary = #5B8DEF — verify no readability issues
- [ ] Passes at least one more theme (shop, creator, or custom)
- [ ] Zero hardcoded color — verified by grep for `#`, `rgb(`, `hsl(` in the file

### Contrast (mandatory)

- [ ] Body text on card background: ≥ 4.5:1 (WCAG AA normal text)
- [ ] Heading text on section background: ≥ 3:1 (WCAG AA large text)
- [ ] CTA button label on button background: ≥ 4.5:1
- [ ] Secondary/muted text on background: ≥ 3:1

### Content resilience (mandatory)

- [ ] **Long headline** (80+ chars): wraps cleanly, no overflow, no layout break
- [ ] **Empty optional field** (e.g. `imageUrl: ''`, `badge: ''`): section still renders — nothing blank shows a broken box
- [ ] **Array with 1 item**: single card does not stretch or mis-align in a grid
- [ ] **Array with max items** (e.g. 8 features, 4 plans): no horizontal overflow, no Z-index issues

### No layout shift

- [ ] Images/placeholders have explicit dimensions or aspect-ratio CSS — no reflow after load
- [ ] All font sizes defined; no system-font-size inheritance surprises

### Code quality (mandatory)

- [ ] Named export matches `puck.config.tsx` import (`export function <Name>Section`)
- [ ] Props type imported from `'../section-contract'` — no inline type duplication
- [ ] No `import React` (project uses `"jsx": "react-jsx"` automatic runtime)
- [ ] No unused imports
- [ ] tsc --noEmit still 0 errors after file is created

---

## Precondition Confirmation (recorded at plan creation)

| Check | Status |
|-------|--------|
| Puck version | `@puckeditor/core@0.21.2` ✅ |
| `tsc --noEmit` before types added | 0 errors ✅ |
| `tsc --noEmit` after types added | 0 errors ✅ |
| F-4 (benefits array editor) | Fixed — render-boundary normalization in puck.config.tsx ✅ |
| F-5 (ThemeSwitcher not mounted) | Open — known Phase 5 task, not a blocker for section builds |
| Existing interfaces modified | None — all 5 original interfaces untouched ✅ |
