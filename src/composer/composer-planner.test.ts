import { describe, it, expect } from 'vitest';
import { planPageStructure } from './composer-planner';
import { classifyIntent }    from './composer-strategy';
import type { ValidatorManifest } from './page-schema-validator';
import manifestJson from '../../registry.manifest.json';

const manifest = manifestJson as ValidatorManifest;

// ── Always-present sections ────────────────────────────────────────────────────

describe('planPageStructure — always-present sections', () => {
  it('starts with NavigationBar', () => {
    const plan = planPageStructure(classifyIntent(''), manifest);
    expect(plan[0]?.registryName).toBe('NavigationBar');
  });

  it('includes HeroSection', () => {
    const plan = planPageStructure(classifyIntent(''), manifest);
    expect(plan.some(s => s.registryName === 'HeroSection')).toBe(true);
  });

  it('includes CTASection', () => {
    const plan = planPageStructure(classifyIntent(''), manifest);
    expect(plan.some(s => s.registryName === 'CTASection')).toBe(true);
  });

  it('HeroSection appears after NavigationBar', () => {
    const plan      = planPageStructure(classifyIntent(''), manifest);
    const navIndex  = plan.findIndex(s => s.registryName === 'NavigationBar');
    const heroIndex = plan.findIndex(s => s.registryName === 'HeroSection');
    expect(heroIndex).toBeGreaterThan(navIndex);
  });

  it('minimum 3 sections even with empty prompt', () => {
    const plan = planPageStructure(classifyIntent(''), manifest);
    expect(plan.length).toBeGreaterThanOrEqual(3);
  });
});

// ── Conditional sections ──────────────────────────────────────────────────────

describe('planPageStructure — gallery conditional', () => {
  it('gallery prompt includes GalleryShowcase', () => {
    const plan = planPageStructure(
      classifyIntent('show gallery of product screenshots'),
      manifest,
    );
    expect(plan.some(s => s.registryName === 'GalleryShowcase')).toBe(true);
  });

  it('no gallery prompt excludes GalleryShowcase', () => {
    const plan = planPageStructure(classifyIntent('simple SaaS pricing page'), manifest);
    expect(plan.some(s => s.registryName === 'GalleryShowcase')).toBe(false);
  });
});

describe('planPageStructure — testimonials conditional', () => {
  it('testimonials prompt includes TestimonialSection', () => {
    const plan = planPageStructure(
      classifyIntent('include customer testimonials and social proof'),
      manifest,
    );
    expect(plan.some(s => s.registryName === 'TestimonialSection')).toBe(true);
  });

  it('no testimonials prompt excludes TestimonialSection', () => {
    const plan = planPageStructure(classifyIntent('simple landing page'), manifest);
    expect(plan.some(s => s.registryName === 'TestimonialSection')).toBe(false);
  });
});

describe('planPageStructure — newsletter conditional', () => {
  it('newsletter prompt includes LeadCapture', () => {
    const plan = planPageStructure(
      classifyIntent('add newsletter signup for our email list'),
      manifest,
    );
    expect(plan.some(s => s.registryName === 'LeadCapture')).toBe(true);
  });

  it('no newsletter prompt excludes LeadCapture', () => {
    const plan = planPageStructure(classifyIntent('simple product page'), manifest);
    expect(plan.some(s => s.registryName === 'LeadCapture')).toBe(false);
  });
});

describe('planPageStructure — pricing conditional', () => {
  it('pricing prompt includes PricingSection', () => {
    const plan = planPageStructure(
      classifyIntent('SaaS pricing page with subscription plans and tiers'),
      manifest,
    );
    expect(plan.some(s => s.registryName === 'PricingSection')).toBe(true);
  });

  it('non-pricing prompt excludes PricingSection', () => {
    const plan = planPageStructure(
      classifyIntent('simple about page for the team'),
      manifest,
    );
    expect(plan.some(s => s.registryName === 'PricingSection')).toBe(false);
  });

  it('PricingSection appears before CTASection', () => {
    const plan        = planPageStructure(
      classifyIntent('SaaS pricing plans'),
      manifest,
    );
    const pricingIdx  = plan.findIndex(s => s.registryName === 'PricingSection');
    const ctaIdx      = plan.findIndex(s => s.registryName === 'CTASection');
    if (pricingIdx !== -1) {
      expect(pricingIdx).toBeLessThan(ctaIdx);
    }
  });

  it('PricingSection appears after HeroSection', () => {
    const plan       = planPageStructure(
      classifyIntent('SaaS billing plans'),
      manifest,
    );
    const heroIdx    = plan.findIndex(s => s.registryName === 'HeroSection');
    const pricingIdx = plan.findIndex(s => s.registryName === 'PricingSection');
    if (pricingIdx !== -1) {
      expect(pricingIdx).toBeGreaterThan(heroIdx);
    }
  });
});

// ── Section order invariants ──────────────────────────────────────────────────

describe('planPageStructure — section order', () => {
  it('GalleryShowcase appears before TestimonialSection when both present', () => {
    const plan = planPageStructure(
      classifyIntent('gallery screenshots and customer testimonials'),
      manifest,
    );
    const galleryIdx = plan.findIndex(s => s.registryName === 'GalleryShowcase');
    const testimIdx  = plan.findIndex(s => s.registryName === 'TestimonialSection');
    if (galleryIdx !== -1 && testimIdx !== -1) {
      expect(galleryIdx).toBeLessThan(testimIdx);
    }
  });

  it('CTASection appears after GalleryShowcase when both present', () => {
    const plan = planPageStructure(
      classifyIntent('product gallery screenshots'),
      manifest,
    );
    const ctaIdx     = plan.findIndex(s => s.registryName === 'CTASection');
    const galleryIdx = plan.findIndex(s => s.registryName === 'GalleryShowcase');
    if (galleryIdx !== -1) {
      expect(ctaIdx).toBeGreaterThan(galleryIdx);
    }
  });

  it('LeadCapture appears after CTASection when both present', () => {
    const plan = planPageStructure(
      classifyIntent('newsletter email signup'),
      manifest,
    );
    const ctaIdx  = plan.findIndex(s => s.registryName === 'CTASection');
    const leadIdx = plan.findIndex(s => s.registryName === 'LeadCapture');
    if (leadIdx !== -1) {
      expect(leadIdx).toBeGreaterThan(ctaIdx);
    }
  });
});

// ── Footer placement ──────────────────────────────────────────────────────────

describe('planPageStructure — FooterSection placement', () => {
  it('always emits FooterSection', () => {
    const plan = planPageStructure(classifyIntent(''), manifest);
    expect(plan.some(s => s.registryName === 'FooterSection')).toBe(true);
  });

  it('FooterSection is the last section', () => {
    const plan = planPageStructure(classifyIntent(''), manifest);
    expect(plan[plan.length - 1]?.registryName).toBe('FooterSection');
  });

  it('FooterSection appears after CTASection', () => {
    const plan    = planPageStructure(classifyIntent(''), manifest);
    const ctaIdx  = plan.findIndex(s => s.registryName === 'CTASection');
    const footIdx = plan.findIndex(s => s.registryName === 'FooterSection');
    expect(footIdx).toBeGreaterThan(ctaIdx);
  });

  it('FooterSection appears after LeadCapture when both present', () => {
    const plan    = planPageStructure(classifyIntent('newsletter email signup'), manifest);
    const leadIdx = plan.findIndex(s => s.registryName === 'LeadCapture');
    const footIdx = plan.findIndex(s => s.registryName === 'FooterSection');
    if (leadIdx !== -1) {
      expect(footIdx).toBeGreaterThan(leadIdx);
    }
  });
});

// ── Exclusions ────────────────────────────────────────────────────────────────

describe('planPageStructure — never-emit exclusions', () => {
  it('emits FeatureGrid when relevant prompt is given', () => {
    const plan = planPageStructure(
      classifyIntent('feature grid section with cards'),
      manifest,
    );
    expect(plan.some(s => s.registryName === 'FeatureGrid')).toBe(true);
  });

  it('never emits OfferSection', () => {
    const plan = planPageStructure(
      classifyIntent('offer section with benefits'),
      manifest,
    );
    expect(plan.some(s => s.registryName === 'OfferSection')).toBe(false);
  });
});

// ── Manifest compliance ───────────────────────────────────────────────────────

describe('planPageStructure — manifest compliance', () => {
  it('all planned sections are implemented in manifest', () => {
    const plan = planPageStructure(
      classifyIntent('gallery screenshots testimonials newsletter subscribe pricing plans'),
      manifest,
    );
    for (const section of plan) {
      const entry = manifest.components.find(c => c.registryName === section.registryName);
      expect(entry).toBeDefined();
      expect(entry?.status).toBe('implemented');
    }
  });

  it('every planned section has a non-empty rationale', () => {
    const plan = planPageStructure(
      classifyIntent('gallery screenshots and testimonials reviews'),
      manifest,
    );
    for (const section of plan) {
      expect(typeof section.rationale).toBe('string');
      expect(section.rationale.length).toBeGreaterThan(0);
    }
  });

  it('output is an array', () => {
    const plan = planPageStructure(classifyIntent(''), manifest);
    expect(Array.isArray(plan)).toBe(true);
  });
});
