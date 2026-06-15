import { describe, it, expect } from 'vitest';
import { classifyIntent } from './composer-strategy';
import type { PageType } from './composer-strategy';

// ── Defaults (empty prompt) ───────────────────────────────────────────────────

describe('classifyIntent — empty prompt defaults', () => {
  it('empty prompt → pageType: saas', () => {
    expect(classifyIntent('').pageType).toBe('saas');
  });

  it('empty prompt → brand.name: EMOVEL', () => {
    expect(classifyIntent('').brand.name).toBe('EMOVEL');
  });

  it('empty prompt → tone: premium', () => {
    expect(classifyIntent('').tone).toBe('premium');
  });

  it('empty prompt → hasGallery: false', () => {
    expect(classifyIntent('').hasGallery).toBe(false);
  });

  it('empty prompt → hasTestimonials: false', () => {
    expect(classifyIntent('').hasTestimonials).toBe(false);
  });

  it('empty prompt → hasPricing: false', () => {
    expect(classifyIntent('').hasPricing).toBe(false);
  });

  it('empty prompt → hasNewsletter: false', () => {
    expect(classifyIntent('').hasNewsletter).toBe(false);
  });
});

// ── Feature detection ─────────────────────────────────────────────────────────

describe('classifyIntent — gallery detection', () => {
  it('detects gallery from "gallery" keyword', () => {
    expect(classifyIntent('show a gallery of screenshots').hasGallery).toBe(true);
  });

  it('detects gallery from "screenshot" keyword', () => {
    expect(classifyIntent('include a screenshot of the dashboard').hasGallery).toBe(true);
  });

  it('detects gallery from "screenshots" keyword', () => {
    expect(classifyIntent('product screenshots showcase').hasGallery).toBe(true);
  });

  it('detects gallery from "showcase" keyword', () => {
    expect(classifyIntent('product showcase section').hasGallery).toBe(true);
  });
});

describe('classifyIntent — testimonials detection', () => {
  it('detects testimonials from "testimonials" keyword', () => {
    expect(classifyIntent('include customer testimonials section').hasTestimonials).toBe(true);
  });

  it('detects testimonials from "reviews" keyword', () => {
    expect(classifyIntent('show user reviews and ratings').hasTestimonials).toBe(true);
  });

  it('detects testimonials from "social proof" keyword', () => {
    expect(classifyIntent('add a social proof section to the page').hasTestimonials).toBe(true);
  });
});

describe('classifyIntent — newsletter detection', () => {
  it('detects newsletter from "newsletter" keyword', () => {
    expect(classifyIntent('add a newsletter signup').hasNewsletter).toBe(true);
  });

  it('detects newsletter from "email list" keyword', () => {
    expect(classifyIntent('grow our email list').hasNewsletter).toBe(true);
  });

  it('detects newsletter from "waitlist" keyword', () => {
    expect(classifyIntent('create waitlist signup').hasNewsletter).toBe(true);
  });

  it('detects newsletter from "subscribe" keyword', () => {
    expect(classifyIntent('users can subscribe for updates').hasNewsletter).toBe(true);
  });
});

describe('classifyIntent — pricing detection', () => {
  it('detects pricing from "pricing" keyword', () => {
    expect(classifyIntent('show pricing plans').hasPricing).toBe(true);
  });

  it('detects pricing from "billing" keyword', () => {
    expect(classifyIntent('billing and subscription options').hasPricing).toBe(true);
  });

  it('detects pricing from "plans" keyword', () => {
    expect(classifyIntent('compare our three plans').hasPricing).toBe(true);
  });
});

// ── Page type classification ──────────────────────────────────────────────────

describe('classifyIntent — page type detection', () => {
  it('detects about page from "about" keyword', () => {
    expect(classifyIntent('create an about us page for the team').pageType).toBe('about');
  });

  it('detects about page from "team" keyword', () => {
    expect(classifyIntent('show the team and company story').pageType).toBe('about');
  });

  it('detects portfolio page from "portfolio" keyword', () => {
    expect(classifyIntent('build a portfolio page for my work').pageType).toBe('portfolio');
  });

  it('detects product page from "product" keyword', () => {
    expect(classifyIntent('create a product page for our shop').pageType).toBe('product');
  });

  it('detects landing page from "launch" keyword', () => {
    expect(classifyIntent('launch page for waitlist signups').pageType).toBe('landing');
  });

  it('defaults to saas for generic builder prompt', () => {
    expect(classifyIntent('create a SaaS application with features and pricing').pageType).toBe('saas');
  });

  it('empty prompt defaults to saas', () => {
    expect(classifyIntent('').pageType).toBe('saas');
  });
});

// ── Brand extraction ──────────────────────────────────────────────────────────

describe('classifyIntent — brand extraction', () => {
  it('extracts brand from "for X" pattern', () => {
    expect(classifyIntent('create a landing page for Acme').brand.name).toBe('Acme');
  });

  it('extracts brand from "called X" pattern', () => {
    expect(classifyIntent('a product called Notion').brand.name).toBe('Notion');
  });

  it('extracts brand from "brand X" pattern', () => {
    expect(classifyIntent('the brand Stripe is a fintech product').brand.name).toBe('Stripe');
  });

  it('defaults brand to EMOVEL when no pattern matches', () => {
    expect(classifyIntent('just a generic SaaS page').brand.name).toBe('EMOVEL');
  });
});

// ── CTA labels ────────────────────────────────────────────────────────────────

describe('classifyIntent — CTA labels are non-empty for all page types', () => {
  const prompts: Record<PageType, string> = {
    saas:      'a SaaS platform',
    landing:   'a launch landing page',
    portfolio: 'a portfolio showcase',
    product:   'a product shop page',
    about:     'an about the team page',
  };

  const pageTypes: PageType[] = ['saas', 'landing', 'portfolio', 'product', 'about'];

  for (const pageType of pageTypes) {
    it(`primaryCTA.label is non-empty for pageType "${pageType}"`, () => {
      const profile = classifyIntent(prompts[pageType]);
      expect(typeof profile.primaryCTA.label).toBe('string');
      expect(profile.primaryCTA.label.length).toBeGreaterThan(0);
    });

    it(`secondaryCTA.label is non-empty for pageType "${pageType}"`, () => {
      const profile = classifyIntent(prompts[pageType]);
      expect(typeof profile.secondaryCTA.label).toBe('string');
      expect(profile.secondaryCTA.label.length).toBeGreaterThan(0);
    });

    it(`primaryCTA.href starts with # for pageType "${pageType}"`, () => {
      const profile = classifyIntent(prompts[pageType]);
      expect(profile.primaryCTA.href.startsWith('#')).toBe(true);
    });
  }
});

// ── Profile shape ─────────────────────────────────────────────────────────────

describe('classifyIntent — profile completeness', () => {
  it('returns all required profile fields', () => {
    const profile = classifyIntent('test prompt');
    expect(profile).toHaveProperty('pageType');
    expect(profile).toHaveProperty('brand');
    expect(profile).toHaveProperty('brand.name');
    expect(profile).toHaveProperty('brand.tagline');
    expect(profile).toHaveProperty('audience');
    expect(profile).toHaveProperty('primaryCTA');
    expect(profile).toHaveProperty('secondaryCTA');
    expect(profile).toHaveProperty('tone');
    expect(profile).toHaveProperty('hasGallery');
    expect(profile).toHaveProperty('hasTestimonials');
    expect(profile).toHaveProperty('hasPricing');
    expect(profile).toHaveProperty('hasNewsletter');
  });

  it('brand.tagline is non-empty string', () => {
    expect(classifyIntent('').brand.tagline.length).toBeGreaterThan(0);
  });

  it('audience is non-empty string', () => {
    expect(classifyIntent('').audience.length).toBeGreaterThan(0);
  });
});

// ── Commercial copy extraction ───────────────────────────────────────────────

describe('classifyIntent — commercial hero copy fields', () => {
  it('extracts a natural ClinicFlow audience and action', () => {
    const profile = classifyIntent(
      'create a SaaS page for ClinicFlow that helps clinic managers automated intake',
    );
    expect(profile.audience).toBe('clinic managers');
    expect(profile.heroAction).toEqual({ verb: 'streamline', object: 'patient intake' });
  });

  it('keeps heroAction null when no offer is extracted', () => {
    expect(classifyIntent('').heroAction).toBeNull();
  });
});
