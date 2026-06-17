import { describe, it, expect } from 'vitest';
import { buildRegistryPageSchema } from './composer';
import { validatePageSchema }      from './page-schema-validator';
import { pageSchemaToPuckData }    from './page-schema-to-puck';
import type { ValidatorManifest }  from './page-schema-validator';
import manifestJson from '../../registry.manifest.json';

const manifest = manifestJson as ValidatorManifest;

// ── Output shape ──────────────────────────────────────────────────────────────

describe('buildRegistryPageSchema — output shape', () => {
  it('returns registryVersion from manifest', () => {
    const schema = buildRegistryPageSchema('', manifest);
    expect(schema.registryVersion).toBe(manifest.registryVersion);
  });

  it('returns a non-empty title', () => {
    const schema = buildRegistryPageSchema('', manifest);
    expect(typeof schema.title).toBe('string');
    expect(schema.title.length).toBeGreaterThan(0);
  });

  it('returns components array', () => {
    const schema = buildRegistryPageSchema('', manifest);
    expect(Array.isArray(schema.components)).toBe(true);
  });

  it('minimum 3 components (NavigationBar + HeroSection + CTASection)', () => {
    const schema = buildRegistryPageSchema('', manifest);
    expect(schema.components.length).toBeGreaterThanOrEqual(3);
  });

  it('always includes NavigationBar, HeroSection, CTASection', () => {
    const schema = buildRegistryPageSchema('', manifest);
    const names  = schema.components.map(c => c.registryName);
    expect(names).toContain('NavigationBar');
    expect(names).toContain('HeroSection');
    expect(names).toContain('CTASection');
  });

  it('title includes brand name', () => {
    const schema = buildRegistryPageSchema('create a page for Acme', manifest);
    expect(schema.title).toContain('Acme');
  });

  it('different prompts produce different titles', () => {
    const a = buildRegistryPageSchema('page for Acme', manifest);
    const b = buildRegistryPageSchema('page for Notion', manifest);
    expect(a.title).not.toBe(b.title);
  });
});

// ── Validation gate ───────────────────────────────────────────────────────────

describe('buildRegistryPageSchema — validation gate (golden tests)', () => {
  it('empty prompt schema validates against real manifest', () => {
    const schema = buildRegistryPageSchema('', manifest);
    const result = validatePageSchema(schema, manifest);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('gallery prompt schema validates against real manifest', () => {
    const schema = buildRegistryPageSchema('product gallery with screenshots', manifest);
    const result = validatePageSchema(schema, manifest);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('full-featured prompt schema validates against real manifest', () => {
    const schema = buildRegistryPageSchema(
      'show gallery screenshots testimonials reviews newsletter email signup',
      manifest,
    );
    const result = validatePageSchema(schema, manifest);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('about page schema validates', () => {
    const schema = buildRegistryPageSchema('about the team and company story', manifest);
    const result = validatePageSchema(schema, manifest);
    expect(result.valid).toBe(true);
  });
});

// ── Puck data conversion ──────────────────────────────────────────────────────

describe('buildRegistryPageSchema → pageSchemaToPuckData', () => {
  it('schema converts to Puck data without throwing', () => {
    const schema = buildRegistryPageSchema('', manifest);
    expect(() => pageSchemaToPuckData(schema)).not.toThrow();
  });

  it('gallery prompt output Puck data includes Screenshot Gallery', () => {
    const schema = buildRegistryPageSchema('show gallery of screenshots', manifest);
    const data   = pageSchemaToPuckData(schema);
    expect(data.content.some(c => c.type === 'Screenshot Gallery')).toBe(true);
  });

  it('newsletter prompt output Puck data includes Newsletter', () => {
    const schema = buildRegistryPageSchema('add newsletter email signup', manifest);
    const data   = pageSchemaToPuckData(schema);
    expect(data.content.some(c => c.type === 'Newsletter')).toBe(true);
  });

  it('output Puck data always includes Nav Bar and Hero', () => {
    const schema = buildRegistryPageSchema('', manifest);
    const data   = pageSchemaToPuckData(schema);
    expect(data.content.some(c => c.type === 'Nav Bar')).toBe(true);
    expect(data.content.some(c => c.type === 'Hero')).toBe(true);
  });

  it('output Puck data always includes CTA Section', () => {
    const schema = buildRegistryPageSchema('', manifest);
    const data   = pageSchemaToPuckData(schema);
    expect(data.content.some(c => c.type === 'CTA Section')).toBe(true);
  });
});

// ── HeroSection props shape ───────────────────────────────────────────────────

describe('buildRegistryPageSchema — HeroSection props correctness', () => {
  function heroProps() {
    const schema = buildRegistryPageSchema('', manifest);
    return schema.components.find(c => c.registryName === 'HeroSection')?.props ?? {};
  }

  it('HeroSection props use "title" not "headline"', () => {
    const props = heroProps();
    expect(props).toHaveProperty('title');
    expect(props).not.toHaveProperty('headline');
  });

  it('HeroSection props use "primaryCtaLabel" not "primaryCTA"', () => {
    const props = heroProps();
    expect(props).toHaveProperty('primaryCtaLabel');
    expect(props).not.toHaveProperty('primaryCTA');
  });

  it('HeroSection props use "subtitle" not "description"', () => {
    const props = heroProps();
    expect(props).toHaveProperty('subtitle');
    expect(props).not.toHaveProperty('description');
  });

  it('HeroSection title is a non-empty string', () => {
    const props = heroProps();
    expect(typeof props.title).toBe('string');
    expect((props.title as string).length).toBeGreaterThan(0);
  });

  it('HeroSection title rewrites ClinicFlow intake copy into natural commercial English', () => {
    const schema = buildRegistryPageSchema(
      'create a SaaS page for ClinicFlow that helps clinic managers automated intake',
      manifest,
    );
    const props = schema.components.find(c => c.registryName === 'HeroSection')?.props ?? {};
    expect(props.title).toBe('ClinicFlow helps clinic managers streamline patient intake.');
  });

  it('HeroSection title avoids noun-phrase help patterns for extracted offers', () => {
    const schema = buildRegistryPageSchema(
      'create a SaaS page for ClinicFlow that helps clinic managers automated intake',
      manifest,
    );
    const props = schema.components.find(c => c.registryName === 'HeroSection')?.props ?? {};
    expect(props.title).not.toMatch(/helps clinic managers automated intake/i);
  });

  it('HeroSection primaryCtaLabel is a non-empty string', () => {
    const props = heroProps();
    expect(typeof props.primaryCtaLabel).toBe('string');
    expect((props.primaryCtaLabel as string).length).toBeGreaterThan(0);
  });

  it('HeroSection primaryCtaHref is present', () => {
    expect(heroProps()).toHaveProperty('primaryCtaHref');
  });

  it('HeroSection enableCinematicLogo is "true"', () => {
    expect(heroProps().enableCinematicLogo).toBe('true');
  });

  it('HeroSection motionPattern is "depth-push"', () => {
    expect(heroProps().motionPattern).toBe('depth-push');
  });
});

// ── CTASection props shape ────────────────────────────────────────────────────

describe('buildRegistryPageSchema — CTASection props correctness', () => {
  function ctaProps() {
    const schema = buildRegistryPageSchema('', manifest);
    return schema.components.find(c => c.registryName === 'CTASection')?.props ?? {};
  }

  it('CTASection has "headline" field', () => {
    expect(ctaProps()).toHaveProperty('headline');
  });

  it('CTASection has "primaryAction" field', () => {
    expect(ctaProps()).toHaveProperty('primaryAction');
  });

  it('CTASection has "secondaryAction" field', () => {
    expect(ctaProps()).toHaveProperty('secondaryAction');
  });

  it('CTASection surface is "inverted"', () => {
    expect(ctaProps().surface).toBe('inverted');
  });

  it('CTASection headline is a non-empty string', () => {
    const props = ctaProps();
    expect(typeof props.headline).toBe('string');
    expect((props.headline as string).length).toBeGreaterThan(0);
  });
});

// ── GalleryShowcase props ─────────────────────────────────────────────────────

describe('buildRegistryPageSchema — GalleryShowcase props correctness', () => {
  it('gallery prompt includes GalleryShowcase component', () => {
    const schema = buildRegistryPageSchema('product gallery screenshots', manifest);
    expect(schema.components.some(c => c.registryName === 'GalleryShowcase')).toBe(true);
  });

  it('GalleryShowcase shots use assets/references/ paths', () => {
    const schema   = buildRegistryPageSchema('product gallery screenshots', manifest);
    const gallery  = schema.components.find(c => c.registryName === 'GalleryShowcase');
    const shots    = gallery?.props.shots as Array<{ imageUrl: string }> | undefined;
    expect(shots).toBeDefined();
    expect(shots!.length).toBeGreaterThan(0);
    for (const shot of shots!) {
      expect(typeof shot.imageUrl).toBe('string');
      expect(shot.imageUrl.startsWith('assets/references/')).toBe(true);
    }
  });

  it('GalleryShowcase shots have caption and alt', () => {
    const schema   = buildRegistryPageSchema('product gallery screenshots', manifest);
    const gallery  = schema.components.find(c => c.registryName === 'GalleryShowcase');
    const shots    = gallery?.props.shots as Array<{ caption: string; alt: string }> | undefined;
    for (const shot of shots!) {
      expect(shot.caption.length).toBeGreaterThan(0);
      expect(shot.alt.length).toBeGreaterThan(0);
    }
  });
});

// ── FooterSection ─────────────────────────────────────────────────────────────

describe('buildRegistryPageSchema — FooterSection', () => {
  it('always includes FooterSection', () => {
    const schema = buildRegistryPageSchema('', manifest);
    expect(schema.components.some(c => c.registryName === 'FooterSection')).toBe(true);
  });

  it('FooterSection is the last component', () => {
    const schema = buildRegistryPageSchema('', manifest);
    const last   = schema.components[schema.components.length - 1];
    expect(last?.registryName).toBe('FooterSection');
  });

  it('FooterSection props include logoText, tagline, copyright, linkGroups, socialLinks', () => {
    const schema  = buildRegistryPageSchema('', manifest);
    const footer  = schema.components.find(c => c.registryName === 'FooterSection');
    expect(footer?.props).toHaveProperty('logoText');
    expect(footer?.props).toHaveProperty('tagline');
    expect(footer?.props).toHaveProperty('copyright');
    expect(footer?.props).toHaveProperty('linkGroups');
    expect(footer?.props).toHaveProperty('socialLinks');
  });

  it('FooterSection linkGroups use "Label | href" textarea string format', () => {
    const schema     = buildRegistryPageSchema('', manifest);
    const footer     = schema.components.find(c => c.registryName === 'FooterSection');
    const groups     = footer?.props.linkGroups as Array<{ heading: string; links: string }> | undefined;
    expect(Array.isArray(groups)).toBe(true);
    expect(groups!.length).toBeGreaterThan(0);
    for (const group of groups!) {
      expect(typeof group.heading).toBe('string');
      expect(typeof group.links).toBe('string');
      expect(group.links.length).toBeGreaterThan(0);
    }
  });

  it('FooterSection schema validates against real manifest', () => {
    const schema = buildRegistryPageSchema('', manifest);
    const result = validatePageSchema(schema, manifest);
    expect(result.valid).toBe(true);
  });

  it('schema with FooterSection converts to Puck data including Footer type', () => {
    const schema = buildRegistryPageSchema('', manifest);
    const data   = pageSchemaToPuckData(schema);
    expect(data.content.some(c => c.type === 'Footer')).toBe(true);
  });

  it('Footer is the last Puck content item', () => {
    const schema = buildRegistryPageSchema('', manifest);
    const data   = pageSchemaToPuckData(schema);
    const last   = data.content[data.content.length - 1];
    expect(last?.type).toBe('Footer');
  });

  it('FooterSection logoText contains brand name', () => {
    const schema  = buildRegistryPageSchema('create a page for Acme', manifest);
    const footer  = schema.components.find(c => c.registryName === 'FooterSection');
    expect((footer?.props.logoText as string)).toContain('Acme');
  });
});

// ── PricingSection ────────────────────────────────────────────────────────────

describe('buildRegistryPageSchema — PricingSection', () => {
  const PRICING_PROMPT = 'SaaS pricing page with subscription plans';

  it('pricing prompt includes PricingSection', () => {
    const schema = buildRegistryPageSchema(PRICING_PROMPT, manifest);
    expect(schema.components.some(c => c.registryName === 'PricingSection')).toBe(true);
  });

  it('non-pricing prompt excludes PricingSection', () => {
    const schema = buildRegistryPageSchema('simple about page for the team', manifest);
    expect(schema.components.some(c => c.registryName === 'PricingSection')).toBe(false);
  });

  it('PricingSection appears before CTASection', () => {
    const schema      = buildRegistryPageSchema(PRICING_PROMPT, manifest);
    const pricingIdx  = schema.components.findIndex(c => c.registryName === 'PricingSection');
    const ctaIdx      = schema.components.findIndex(c => c.registryName === 'CTASection');
    expect(pricingIdx).toBeGreaterThan(-1);
    expect(pricingIdx).toBeLessThan(ctaIdx);
  });

  it('pricing schema validates against real manifest', () => {
    const schema = buildRegistryPageSchema(PRICING_PROMPT, manifest);
    const result = validatePageSchema(schema, manifest);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('pageSchemaToPuckData converts PricingSection to "Pricing Table"', () => {
    const schema = buildRegistryPageSchema(PRICING_PROMPT, manifest);
    const data   = pageSchemaToPuckData(schema);
    expect(data.content.some(c => c.type === 'Pricing Table')).toBe(true);
  });

  it('PricingSection emits exactly 3 plans', () => {
    const schema   = buildRegistryPageSchema(PRICING_PROMPT, manifest);
    const pricing  = schema.components.find(c => c.registryName === 'PricingSection');
    const plans    = pricing?.props.plans as unknown[];
    expect(Array.isArray(plans)).toBe(true);
    expect(plans!.length).toBe(3);
  });

  it('plans have name, price, description, features, ctaLabel, highlight, badge', () => {
    const schema  = buildRegistryPageSchema(PRICING_PROMPT, manifest);
    const pricing = schema.components.find(c => c.registryName === 'PricingSection');
    const plans   = pricing?.props.plans as Array<Record<string, unknown>>;
    for (const plan of plans) {
      expect(typeof plan.name).toBe('string');
      expect(typeof plan.price).toBe('string');
      expect(typeof plan.description).toBe('string');
      expect(typeof plan.features).toBe('string');
      expect(typeof plan.ctaLabel).toBe('string');
      expect(typeof plan.highlight).toBe('string');
      expect(typeof plan.badge).toBe('string');
    }
  });

  it('plan features are newline-separated strings', () => {
    const schema  = buildRegistryPageSchema(PRICING_PROMPT, manifest);
    const pricing = schema.components.find(c => c.registryName === 'PricingSection');
    const plans   = pricing?.props.plans as Array<{ features: string }>;
    for (const plan of plans) {
      expect(typeof plan.features).toBe('string');
      expect(plan.features.length).toBeGreaterThan(0);
      expect(plan.features).toContain('\n');
    }
  });

  it('Pro plan has highlight "featured" and badge "Most Popular"', () => {
    const schema  = buildRegistryPageSchema(PRICING_PROMPT, manifest);
    const pricing = schema.components.find(c => c.registryName === 'PricingSection');
    const plans   = pricing?.props.plans as Array<{ name: string; highlight: string; badge: string }>;
    const pro     = plans.find(p => p.name === 'Pro');
    expect(pro?.highlight).toBe('featured');
    expect(pro?.badge).toBe('Most Popular');
  });

  it('headline contains brand name for premium tone', () => {
    const schema  = buildRegistryPageSchema('SaaS pricing plans for Acme', manifest);
    const pricing = schema.components.find(c => c.registryName === 'PricingSection');
    expect((pricing?.props.headline as string)).toContain('Acme');
  });
});

// ── Exclusions ────────────────────────────────────────────────────────────────

describe('buildRegistryPageSchema — exclusions', () => {
  it('never includes FeatureGrid', () => {
    const schema = buildRegistryPageSchema('feature grid cards section', manifest);
    expect(schema.components.some(c => c.registryName === 'FeatureGrid')).toBe(false);
  });

  it('no gallery prompt excludes GalleryShowcase', () => {
    const schema = buildRegistryPageSchema('simple SaaS landing page', manifest);
    expect(schema.components.some(c => c.registryName === 'GalleryShowcase')).toBe(false);
  });
});

// ── ComposerBrief ─────────────────────────────────────────────────────────────

describe('buildRegistryPageSchema — composerBrief', () => {
  it('schema includes composerBrief object', () => {
    const schema = buildRegistryPageSchema('', manifest);
    expect(schema.composerBrief).toBeDefined();
    expect(typeof schema.composerBrief).toBe('object');
  });

  it('composerBrief has all eight fields', () => {
    const brief = buildRegistryPageSchema('', manifest).composerBrief!;
    expect(brief).toHaveProperty('projectName');
    expect(brief).toHaveProperty('audience');
    expect(brief).toHaveProperty('coreOffer');
    expect(brief).toHaveProperty('primaryAction');
    expect(brief).toHaveProperty('pageType');
    expect(brief).toHaveProperty('activationDepth');
    expect(brief).toHaveProperty('progressMomentum');
    expect(brief).toHaveProperty('emotionalSignalIndex');
  });

  it('projectName reflects extracted brand name', () => {
    const brief = buildRegistryPageSchema('launch page for ClinicFlow', manifest).composerBrief!;
    expect(brief.projectName).toBe('ClinicFlow');
  });

  it('audience is a non-empty string', () => {
    const brief = buildRegistryPageSchema('', manifest).composerBrief!;
    expect(typeof brief.audience).toBe('string');
    expect((brief.audience as string).length).toBeGreaterThan(0);
  });

  it('primaryAction reflects CTA label', () => {
    const brief = buildRegistryPageSchema('', manifest).composerBrief!;
    expect(typeof brief.primaryAction).toBe('string');
    expect((brief.primaryAction as string).length).toBeGreaterThan(0);
  });

  it('pageType is populated from PAGE_TYPE_LABELS', () => {
    const brief = buildRegistryPageSchema('SaaS landing page', manifest).composerBrief!;
    expect(typeof brief.pageType).toBe('string');
    expect((brief.pageType as string).length).toBeGreaterThan(0);
  });

  it('activationDepth / progressMomentum / emotionalSignalIndex are undefined', () => {
    const brief = buildRegistryPageSchema('', manifest).composerBrief!;
    expect(brief.activationDepth).toBeUndefined();
    expect(brief.progressMomentum).toBeUndefined();
    expect(brief.emotionalSignalIndex).toBeUndefined();
  });
});

describe('pageSchemaToPuckData — composerBrief preserved in root props', () => {
  it('Puck root.props contains composerBrief', () => {
    const schema = buildRegistryPageSchema('', manifest);
    const data   = pageSchemaToPuckData(schema);
    const rootProps = (data.root as { props?: Record<string, unknown> }).props;
    expect(rootProps).toHaveProperty('composerBrief');
  });

  it('Puck root composerBrief matches schema composerBrief', () => {
    const schema = buildRegistryPageSchema('launch page for ClinicFlow', manifest);
    const data   = pageSchemaToPuckData(schema);
    const rootProps = (data.root as { props?: Record<string, unknown> }).props;
    expect(rootProps?.composerBrief).toEqual(schema.composerBrief);
  });

  it('Puck root composerBrief.projectName matches brand', () => {
    const schema = buildRegistryPageSchema('launch page for ClinicFlow', manifest);
    const data   = pageSchemaToPuckData(schema);
    const rootProps = (data.root as { props?: Record<string, unknown> }).props;
    const brief  = rootProps?.composerBrief as Record<string, unknown> | undefined;
    expect(brief?.projectName).toBe('ClinicFlow');
  });
});
