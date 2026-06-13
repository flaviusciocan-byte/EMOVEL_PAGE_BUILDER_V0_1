// Composer Planner — selects and orders Registry sections based on a strategy profile.
// Pure function. Deterministic given the same profile + manifest.

import type { ComposerStrategyProfile } from './composer-strategy';
import type { ValidatorManifest }       from './page-schema-validator';

export interface PlannedSection {
  registryName: string;
  rationale:    string;
}

// These components are excluded regardless of manifest status.
// FooterSection: linkGroups.links serialization format not yet normalized in pageSchemaToPuckData.
// FeatureGrid: maps to CardSection (single card); props are incompatible with a feature grid.
// OfferSection: Puck-only component, not in Registry manifest.
const NEVER_EMIT = new Set(['FooterSection', 'FeatureGrid', 'OfferSection']);

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

  // ── Conditional content sections ────────────────────────────────────────────

  if (profile.hasGallery) {
    add('GalleryShowcase',
      'Gallery/screenshot detected — visual evidence of product quality using real reference assets.');
  }

  if (profile.hasTestimonials) {
    add('TestimonialSection',
      'Testimonials/social proof detected — reduces buyer hesitation before the conversion section.');
  }

  // ── Conversion anchor ───────────────────────────────────────────────────────
  // CTASection always appears, after any content sections, before any lead capture.

  add('CTASection', 'Conversion anchor — always present to capture visitors who are ready to act.');

  // ── Optional lead capture ────────────────────────────────────────────────────

  if (profile.hasNewsletter) {
    add('LeadCapture',
      'Newsletter/email detected — captures leads who are not ready to convert immediately.');
  }

  return plan;
}
