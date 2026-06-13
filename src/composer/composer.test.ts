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

// ── Exclusions ────────────────────────────────────────────────────────────────

describe('buildRegistryPageSchema — exclusions', () => {
  it('never includes FooterSection', () => {
    const schema = buildRegistryPageSchema('full page with footer links', manifest);
    expect(schema.components.some(c => c.registryName === 'FooterSection')).toBe(false);
  });

  it('never includes FeatureGrid', () => {
    const schema = buildRegistryPageSchema('feature grid cards section', manifest);
    expect(schema.components.some(c => c.registryName === 'FeatureGrid')).toBe(false);
  });

  it('no gallery prompt excludes GalleryShowcase', () => {
    const schema = buildRegistryPageSchema('simple SaaS landing page', manifest);
    expect(schema.components.some(c => c.registryName === 'GalleryShowcase')).toBe(false);
  });
});
