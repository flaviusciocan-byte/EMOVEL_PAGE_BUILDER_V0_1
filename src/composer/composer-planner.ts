// Composer Planner — selects and orders Registry sections based on a strategy profile.
// Pure function. Deterministic given the same profile + manifest.

import type { ComposerStrategyProfile } from './composer-strategy';
import type { ValidatorManifest }       from './page-schema-validator';

export interface PlannedSection {
  registryName: string;
  rationale:    string;
}

// These components are excluded regardless of manifest status.
// OfferSection: Puck-only component, not in Registry manifest.
const NEVER_EMIT = new Set(['OfferSection']);

function isImplemented(name: string, manifest: ValidatorManifest): boolean {
  return manifest.components.some(
    c => c.registryName === name && c.status === 'implemented',
  );
}

export function planPageStructure(
  profile:  ComposerStrategyProfile,
  manifest: ValidatorManifest,
): PlannedSection[] {
  const plan: PlannedSection[] = [];

  function add(name: string, rationale: string): void {
    if (NEVER_EMIT.has(name)) return;
    if (!isImplemented(name, manifest)) return;
    plan.push({ registryName: name, rationale });
  }

  // ── Fixed structure ─────────────────────────────────────────────────────────

  add('NavigationBar', 'Primary navigation — anchors every page; sticky for persistent access to the primary CTA.');
  add('HeroSection',   'Above-the-fold impact — establishes brand identity and frames the primary conversion intent.');

  // ── Brand trust signals ─────────────────────────────────────────────────────

  add('TrustStrip', 'Brand trust band — logos of partners or clients build credibility early in the page.');

  // ── Conditional content sections ────────────────────────────────────────────

  if (profile.hasGallery) {
    add('GalleryShowcase',
      'Gallery/screenshot detected — visual evidence of product quality using real reference assets.');
  }

  if (profile.hasTestimonials) {
    add('TestimonialSection',
      'Testimonials/social proof detected — reduces buyer hesitation before the conversion section.');
  }

  // FeatureGrid (CardSection) is always useful for feature highlights
  add('FeatureGrid',
    'Feature highlight — single premium card showcasing a key capability or value proposition.');

  // EditorialSection (FeatureSplitSection) — image + copy layout
  add('EditorialSection',
    'Editorial layout — image paired with copy for storytelling and feature deep-dive.');

  // ProductShowcase (ProductGridSection) — product card grid
  if (profile.pageType === 'product' || profile.pageType === 'saas') {
    add('ProductShowcase',
      'Product showcase — card grid displaying products or offerings with status and CTAs.');
  }

  if (profile.hasPricing) {
    add('PricingSection',
      'Pricing detected — transparent plan comparison helps visitors self-select before the CTA.');
  }

  // FAQSection — always useful for objection handling
  add('FAQSection',
    'FAQ — addresses common objections and reduces buyer hesitation before the conversion.');

  // ── Conversion anchor ───────────────────────────────────────────────────────
  // CTASection always appears, after any content sections, before any lead capture.

  add('CTASection', 'Conversion anchor — always present to capture visitors who are ready to act.');

  // ── Optional lead capture ────────────────────────────────────────────────────

  if (profile.hasNewsletter) {
    add('LeadCapture',
      'Newsletter/email detected — captures leads who are not ready to convert immediately.');
  }

  // ── Site footer ──────────────────────────────────────────────────────────────
  // FooterSection always appears last — every generated page must close with a footer.

  add('FooterSection', 'Site footer — closes every page with navigation links, copyright, and social links.');

  return plan;
}
