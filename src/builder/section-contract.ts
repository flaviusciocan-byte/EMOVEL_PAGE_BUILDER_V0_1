// Section prop types — the shared language between Codex renders and puck.config.
// Codex imports from this file. Claude owns this file.
// Do not add EMOVEL-specific defaults here; defaults live in puck.config.tsx.

// ── Per-section surface system ────────────────────────────────────────────────
// These three props are shared by every section. SectionSurface reads them to
// apply the outer background treatment. Defaults live in puck.config.tsx.

export type SurfaceVariant = 'transparent' | 'base' | 'surface' | 'surfaceAlt' | 'image' | 'gradient';
export type WidthVariant   = 'contained' | 'full-bleed';

export interface SharedSectionSurface {
  surface:            SurfaceVariant;
  width:              WidthVariant;
  backgroundImageUrl: string;  // only used when surface = 'image'; empty = no photo
}

// ─────────────────────────────────────────────────────────────────────────────

export type ProductStatus = 'available' | 'coming_soon' | 'early_access';

export interface ProductCard {
  title: string;
  description: string;
  status: ProductStatus;
  cta: string;
}

export interface HeroProps extends SharedSectionSurface {
  eyebrow: string;
  headline: string;
  description: string;
  primaryCTA: string;
  secondaryCTA: string;
}

export interface ProductGridProps extends SharedSectionSurface {
  sectionTitle: string;
  sectionDescription: string;
  products: ProductCard[];
}

// NOTE: benefits is string[] in the render contract.
// Puck's array field serializes items as { text: string }[].
// puck.config.tsx normalizes { text: string }[] → string[] before calling OfferSection.
// Codex renders against string[] and is unaware of Puck internals.
export interface OfferProps extends SharedSectionSurface {
  title: string;
  problem: string;
  solution: string;
  benefits: string[];
}

export interface ShotItem {
  caption: string;
}

export interface ScreenshotGalleryProps extends SharedSectionSurface {
  title: string;
  description: string;
  shots: ShotItem[];
}

export interface CTAProps extends SharedSectionSurface {
  headline: string;
  subheadline: string;
  primaryAction: string;
  secondaryAction: string;
  supportText: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 5 EXPANSION — 13 new sections (types only; renders are Phase 5 Codex tasks)
// Claude owns these types. Codex imports but does not modify.
// ─────────────────────────────────────────────────────────────────────────────

// ── Shared sub-types ──────────────────────────────────────────────────────────

/** Reusable link: label shown to visitor + destination href. */
export interface CTALink {
  label: string;
  href: string;
}

// ── Layout variant string-literal unions (follow ProductStatus pattern) ───────

export type NavPosition       = 'static' | 'sticky';
export type ImagePosition     = 'left' | 'right';
export type ColumnCount       = 2 | 3 | 4;           // Puck select: option values must be numeric
export type TestimonialLayout = 'grid' | 'slider';   // slider = CSS scroll-snap, no JS lib
export type FAQLayout         = 'accordion' | 'columns';
export type NewsletterLayout  = 'centered' | 'split';
export type ContentAlignment  = 'left' | 'center';
export type ContentLayout     = 'prose' | 'wide';    // prose = ~72ch max; wide = full section
export type AspectRatio       = '16:9' | '4:3';
export type PlanHighlight     = 'none' | 'featured';
export type BillingPeriod     = 'monthly' | 'both';  // 'both' = show monthly/annual toggle

// ─────────────────────────────────────────────────────────────────────────────
// 1. NavBar
// Page role: Navigation / Header
// Tokens: --color-background, --color-surface, --color-textPrimary, --color-primary, --color-border
// ─────────────────────────────────────────────────────────────────────────────
export interface NavBarProps extends SharedSectionSurface {
  logoText: string;
  logoImageUrl?: string;
  // PUCK: array field with arrayFields {label:text, href:text} → stored as CTALink[] → no normalization needed
  links: CTALink[];
  ctaLabel: string;
  ctaHref: string;
  position: NavPosition;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. LogoStrip
// Page role: Social proof / brand credibility band
// Tokens: --color-background, --color-surface, --color-textSecondary, --color-border
// ─────────────────────────────────────────────────────────────────────────────
export interface LogoItem {
  name: string;       // brand name — displayed as text when imageUrl is empty
  imageUrl: string;   // logo image URL; empty string = render name as styled text
}

export interface LogoStripProps extends SharedSectionSurface {
  eyebrow: string;
  // PUCK: array field with arrayFields {name:text, imageUrl:text} → stored as LogoItem[] → no normalization needed
  logos: LogoItem[];
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. FeatureGrid
// Page role: Feature/benefit cards — 2/3/4-column grid
// Tokens: --color-surface, --color-surfaceAlt, --color-textPrimary, --color-textSecondary,
//         --color-primary, --color-border, --radius-md
// ─────────────────────────────────────────────────────────────────────────────
export interface FeatureCard {
  icon: string;   // emoji or short icon identifier; render as styled text
  title: string;
  body: string;
}

export interface FeatureGridProps extends SharedSectionSurface {
  eyebrow: string;
  headline: string;
  subheadline: string;
  // PUCK: array field with arrayFields {icon:text, title:text, body:textarea} → stored as FeatureCard[] → no normalization needed
  features: FeatureCard[];
  columns: ColumnCount;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. FeatureSplit
// Page role: Feature highlight — large image beside copy (image-left OR image-right variant)
// Layout variant: imagePosition controls which side the image occupies
// Tokens: --color-background, --color-surface, --color-textPrimary, --color-textSecondary,
//         --color-primary, --radius-lg
// ─────────────────────────────────────────────────────────────────────────────
export interface FeatureSplitProps extends SharedSectionSurface {
  eyebrow: string;
  headline: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  imageUrl: string;       // image URL; empty string = decorative color placeholder
  imageAlt: string;
  imagePosition: ImagePosition;  // layout variant — 'left' | 'right'
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. TestimonialsSection
// Page role: Social proof — customer quotes
// Tokens: --color-surface, --color-surfaceAlt, --color-textPrimary, --color-textSecondary,
//         --color-primary, --color-border, --radius-md
// ─────────────────────────────────────────────────────────────────────────────
export interface TestimonialCard {
  quote: string;
  authorName: string;
  authorRole: string;
  authorCompany: string;
  avatarUrl: string;   // image URL; empty string = render initials placeholder
  rating: number;      // 0 = no stars; 1–5 = star rating displayed
}

export interface TestimonialsProps extends SharedSectionSurface {
  eyebrow: string;
  headline: string;
  // PUCK: array field — stored as TestimonialCard[] → no normalization needed
  testimonials: TestimonialCard[];
  layout: TestimonialLayout;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. PricingTable
// Page role: Pricing — 2–3 plan columns with feature lists
// Tokens: --color-surface, --color-surfaceAlt, --color-textPrimary, --color-textSecondary,
//         --color-primary, --color-secondary, --color-border, --color-success, --radius-lg
// ─────────────────────────────────────────────────────────────────────────────
export interface PricingPlan {
  name: string;
  price: string;         // e.g. "$49/mo"
  priceAnnual: string;   // e.g. "$39/mo" — empty string when billingPeriod is 'monthly'
  description: string;
  // features is a newline-delimited string rendered as bullet list.
  // Using string (textarea in Puck) avoids nested array-within-array Puck limitation.
  // Render: features.split('\n').filter(Boolean) → string[] bullets.
  features: string;
  ctaLabel: string;
  ctaHref: string;
  highlight: PlanHighlight;  // 'featured' = elevated card with primary color accent
  badge: string;             // e.g. "Most Popular" — empty string = no badge rendered
}

export interface PricingTableProps extends SharedSectionSurface {
  eyebrow: string;
  headline: string;
  subheadline: string;
  // PUCK: array field — stored as PricingPlan[] → no normalization needed
  plans: PricingPlan[];
  billingPeriod: BillingPeriod;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. FAQSection
// Page role: FAQ — question/answer pairs reducing buyer friction
// Tokens: --color-surface, --color-surfaceAlt, --color-textPrimary, --color-textSecondary,
//         --color-border, --color-primary, --radius-md
// Implementation note: accordion layout uses <details>/<summary> (native, no JS)
// ─────────────────────────────────────────────────────────────────────────────
export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQProps extends SharedSectionSurface {
  eyebrow: string;
  headline: string;
  subheadline: string;
  // PUCK: array field with arrayFields {question:text, answer:textarea} → stored as FAQItem[] → no normalization needed
  items: FAQItem[];
  layout: FAQLayout;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. StatsBar
// Page role: Key metrics / credibility band
// Tokens: --color-background, --color-surface, --color-textPrimary, --color-textSecondary,
//         --color-primary, --color-border
// ─────────────────────────────────────────────────────────────────────────────
export interface StatItem {
  value: string;   // e.g. "10,000+" — rendered large/prominent
  label: string;   // e.g. "Happy Customers" — rendered smaller below value
}

export interface StatsBarProps extends SharedSectionSurface {
  eyebrow: string;
  // PUCK: array field with arrayFields {value:text, label:text} → stored as StatItem[] → no normalization needed
  stats: StatItem[];
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. VideoEmbed
// Page role: Product demo / video section
// Tokens: --color-background, --color-surface, --color-textPrimary, --color-textSecondary,
//         --color-primary, --radius-lg, --color-glow
// Implementation note: render an <iframe> with title attr; no autoplay
// ─────────────────────────────────────────────────────────────────────────────
export interface VideoEmbedProps extends SharedSectionSurface {
  eyebrow: string;
  headline: string;
  subheadline: string;
  embedUrl: string;      // full iframe embed URL — NOT the watch URL
  videoTitle: string;    // iframe title attribute (accessibility)
  aspectRatio: AspectRatio;
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. TeamGrid
// Page role: About / team member showcase
// Tokens: --color-surface, --color-surfaceAlt, --color-textPrimary, --color-textSecondary,
//         --color-border, --radius-lg
// ─────────────────────────────────────────────────────────────────────────────
export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;   // image URL; empty string = render initials in color placeholder
}

export interface TeamGridProps extends SharedSectionSurface {
  eyebrow: string;
  headline: string;
  subheadline: string;
  // PUCK: array field with arrayFields {name:text, role:text, bio:textarea, avatarUrl:text} → stored as TeamMember[] → no normalization needed
  members: TeamMember[];
  columns: ColumnCount;
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. NewsletterSection
// Page role: Lead capture / email opt-in
// Tokens: --color-surface, --color-surfaceAlt, --color-textPrimary, --color-textSecondary,
//         --color-primary, --color-border, --radius-pill, --radius-md
// ─────────────────────────────────────────────────────────────────────────────
export interface NewsletterProps extends SharedSectionSurface {
  eyebrow: string;
  headline: string;
  subheadline: string;
  inputPlaceholder: string;  // e.g. "Enter your email"
  ctaLabel: string;          // e.g. "Subscribe"
  privacyNote: string;       // e.g. "No spam. Unsubscribe anytime."
  layout: NewsletterLayout;
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. ContentBlock
// Page role: Long-form text content (about, manifesto, legal)
// Tokens: --color-background, --color-textPrimary, --color-textSecondary,
//         --color-primary, --color-border
// ─────────────────────────────────────────────────────────────────────────────
export interface ContentBlockProps extends SharedSectionSurface {
  eyebrow: string;
  headline: string;
  body: string;                 // long-form body text (textarea in Puck)
  alignment: ContentAlignment;
  layout: ContentLayout;        // 'prose' = ~72ch max-width; 'wide' = full section width
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. FooterSection
// Page role: Site footer — links, copyright, social
// Tokens: --color-surface, --color-surfaceAlt, --color-textPrimary, --color-textSecondary,
//         --color-border, --color-primary
//
// PUCK NESTED ARRAY NOTE: FooterLinkGroup.links: CTALink[] cannot be expressed as a
// Puck array field within a Puck array field (Puck does not support nested array fields).
// puck.config.tsx workaround: each FooterLinkGroup stores links as a textarea string
// with one "Label | href" per line. The render function in puck.config.tsx parses
// this into CTALink[] before passing to FooterSection.
// FooterSection itself receives clean FooterLinkGroup[] and is unaware of Puck internals.
// ─────────────────────────────────────────────────────────────────────────────
export interface FooterLinkGroup {
  heading: string;
  links: CTALink[];
}

export interface FooterProps extends SharedSectionSurface {
  logoText: string;
  tagline: string;
  // PUCK: nested array — see note above; puck.config.tsx normalizes at render boundary
  linkGroups: FooterLinkGroup[];
  copyright: string;
  // PUCK: array field with arrayFields {label:text, href:text} → stored as CTALink[] → no normalization needed
  socialLinks: CTALink[];
}

// ─────────────────────────────────────────────────────────────────────────────
// 14. Card Section
// Page role: Premium standalone card — glass / solid / outline / image variants
// Tokens: --color-background, --color-surface, --color-textPrimary, --color-textSecondary,
//         --color-primary, --color-border, --radius-lg, --radius-pill
// Note: "image" variant forces rgba(255,255,255,1) text over a dark gradient overlay —
// this is an accessibility invariant, not a theme color (see CardSection.tsx).
// ─────────────────────────────────────────────────────────────────────────────
export type CardVariant = 'glass' | 'solid' | 'outline' | 'image';

export interface CardProps extends SharedSectionSurface {
  variant: CardVariant;
  title: string;
  body: string;
  eyebrow: string;    // empty string = not rendered
  cardImageUrl: string;   // full-bleed bg for "image" card variant; empty = solid color fallback
  objectImageUrl: string; // floating 3D object PNG (screen blend); empty = no object
  ctaLabel: string;   // CTA button label; empty = button not rendered
  ctaHref: string;    // CTA destination href
}
