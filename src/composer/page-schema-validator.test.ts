import { describe, it, expect } from 'vitest';
import { validatePageSchema } from './page-schema-validator';
import type { ValidatorManifest } from './page-schema-validator';

// Minimal test manifest — not the real generated one, to keep tests stable.
const manifest: ValidatorManifest = {
  registryVersion: '1.1',
  components: [
    { registryName: 'HeroSection',      status: 'implemented'    },
    { registryName: 'CTASection',       status: 'implemented'    },
    { registryName: 'FooterSection',    status: 'implemented'    },
    { registryName: 'GalleryShowcase',  status: 'implemented'    },
    { registryName: 'NavigationBar',    status: 'implemented'    },
    { registryName: 'DashboardPreview', status: 'notImplemented' },
    { registryName: 'WorkflowTimeline', status: 'notImplemented' },
  ],
};

// ── basic structure ────────────────────────────────────────────────────────────

describe('validatePageSchema — basic structure', () => {
  it('valid schema with zero components passes', () => {
    const result = validatePageSchema(
      { registryVersion: '1.1', title: 'Empty Page', components: [] },
      manifest,
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('valid schema with implemented components passes', () => {
    const result = validatePageSchema(
      {
        registryVersion: '1.1',
        title: 'Full Page',
        components: [
          { registryName: 'HeroSection',   props: {} },
          { registryName: 'CTASection',    props: {} },
          { registryName: 'FooterSection', props: {} },
        ],
      },
      manifest,
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('null schema fails with clear message', () => {
    const result = validatePageSchema(null, manifest);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/non-null object/);
  });

  it('array schema fails', () => {
    const result = validatePageSchema([], manifest);
    expect(result.valid).toBe(false);
  });
});

// ── registryVersion ────────────────────────────────────────────────────────────

describe('validatePageSchema — registryVersion', () => {
  it('wrong registryVersion fails', () => {
    const result = validatePageSchema(
      { registryVersion: '1.0', title: 'Test', components: [] },
      manifest,
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('registryVersion'))).toBe(true);
  });

  it('missing registryVersion fails', () => {
    const result = validatePageSchema(
      { title: 'Test', components: [] },
      manifest,
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('registryVersion'))).toBe(true);
  });

  it('correct registryVersion passes', () => {
    const result = validatePageSchema(
      { registryVersion: '1.1', title: 'Test', components: [] },
      manifest,
    );
    expect(result.valid).toBe(true);
  });
});

// ── component registration ─────────────────────────────────────────────────────

describe('validatePageSchema — component registration', () => {
  it('unknown component fails', () => {
    const result = validatePageSchema(
      {
        registryVersion: '1.1',
        title: 'Test',
        components: [{ registryName: 'NonExistentComponent', props: {} }],
      },
      manifest,
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('NonExistentComponent'))).toBe(true);
  });

  it('notImplemented component fails', () => {
    const result = validatePageSchema(
      {
        registryVersion: '1.1',
        title: 'Test',
        components: [{ registryName: 'DashboardPreview', props: {} }],
      },
      manifest,
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('DashboardPreview'))).toBe(true);
    expect(result.errors.some(e => e.includes('notImplemented'))).toBe(true);
  });

  it('second notImplemented component also fails', () => {
    const result = validatePageSchema(
      {
        registryVersion: '1.1',
        title: 'Test',
        components: [{ registryName: 'WorkflowTimeline', props: {} }],
      },
      manifest,
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('WorkflowTimeline'))).toBe(true);
  });
});

// ── shared prop values ─────────────────────────────────────────────────────────

describe('validatePageSchema — shared props', () => {
  it('invalid universe value fails', () => {
    const result = validatePageSchema(
      {
        registryVersion: '1.1',
        title: 'Test',
        components: [{ registryName: 'HeroSection', props: { universe: 'rainbow' } }],
      },
      manifest,
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('universe'))).toBe(true);
  });

  it('valid universe value passes', () => {
    const result = validatePageSchema(
      {
        registryVersion: '1.1',
        title: 'Test',
        components: [{ registryName: 'HeroSection', props: { universe: 'noir' } }],
      },
      manifest,
    );
    expect(result.valid).toBe(true);
  });

  it('invalid surface value fails', () => {
    const result = validatePageSchema(
      {
        registryVersion: '1.1',
        title: 'Test',
        components: [{ registryName: 'HeroSection', props: { surface: 'floating' } }],
      },
      manifest,
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('surface'))).toBe(true);
  });

  it('valid surface value passes', () => {
    const result = validatePageSchema(
      {
        registryVersion: '1.1',
        title: 'Test',
        components: [{ registryName: 'HeroSection', props: { surface: 'inverted' } }],
      },
      manifest,
    );
    expect(result.valid).toBe(true);
  });

  it('invalid motion value fails', () => {
    const result = validatePageSchema(
      {
        registryVersion: '1.1',
        title: 'Test',
        components: [{ registryName: 'HeroSection', props: { motion: 'fast' } }],
      },
      manifest,
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('motion'))).toBe(true);
  });

  it('invalid spacing value fails', () => {
    const result = validatePageSchema(
      {
        registryVersion: '1.1',
        title: 'Test',
        components: [{ registryName: 'HeroSection', props: { spacing: 'huge' } }],
      },
      manifest,
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('spacing'))).toBe(true);
  });

  it('aiLock must be array — string fails', () => {
    const result = validatePageSchema(
      {
        registryVersion: '1.1',
        title: 'Test',
        components: [{ registryName: 'HeroSection', props: { aiLock: 'headline' } }],
      },
      manifest,
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('aiLock'))).toBe(true);
  });

  it('aiLock as array passes', () => {
    const result = validatePageSchema(
      {
        registryVersion: '1.1',
        title: 'Test',
        components: [{ registryName: 'HeroSection', props: { aiLock: ['headline'] } }],
      },
      manifest,
    );
    expect(result.valid).toBe(true);
  });

  it('anchorId must be string — number fails', () => {
    const result = validatePageSchema(
      {
        registryVersion: '1.1',
        title: 'Test',
        components: [{ registryName: 'HeroSection', props: { anchorId: 42 } }],
      },
      manifest,
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('anchorId'))).toBe(true);
  });

  it('anchorId as string passes', () => {
    const result = validatePageSchema(
      {
        registryVersion: '1.1',
        title: 'Test',
        components: [{ registryName: 'HeroSection', props: { anchorId: 'hero-section' } }],
      },
      manifest,
    );
    expect(result.valid).toBe(true);
  });
});

// ── asset fields ──────────────────────────────────────────────────────────────

describe('validatePageSchema — asset field paths', () => {
  it('relative path without assets/ prefix fails', () => {
    const result = validatePageSchema(
      {
        registryVersion: '1.1',
        title: 'Test',
        components: [
          { registryName: 'HeroSection', props: { backgroundImageUrl: 'images/bg.jpg' } },
        ],
      },
      manifest,
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('backgroundImageUrl'))).toBe(true);
  });

  it('assets/ prefix passes', () => {
    const result = validatePageSchema(
      {
        registryVersion: '1.1',
        title: 'Test',
        components: [
          { registryName: 'HeroSection', props: { backgroundImageUrl: 'assets/bg.jpg' } },
        ],
      },
      manifest,
    );
    expect(result.valid).toBe(true);
  });

  it('/assets/ prefix passes', () => {
    const result = validatePageSchema(
      {
        registryVersion: '1.1',
        title: 'Test',
        components: [
          { registryName: 'HeroSection', props: { backgroundImageUrl: '/assets/bg.jpg' } },
        ],
      },
      manifest,
    );
    expect(result.valid).toBe(true);
  });

  it('external https URL passes', () => {
    const result = validatePageSchema(
      {
        registryVersion: '1.1',
        title: 'Test',
        components: [
          { registryName: 'HeroSection', props: { imageUrl: 'https://cdn.example.com/img.jpg' } },
        ],
      },
      manifest,
    );
    expect(result.valid).toBe(true);
  });

  it('empty string asset value passes', () => {
    const result = validatePageSchema(
      {
        registryVersion: '1.1',
        title: 'Test',
        components: [
          { registryName: 'HeroSection', props: { backgroundImageUrl: '' } },
        ],
      },
      manifest,
    );
    expect(result.valid).toBe(true);
  });

  it('nested array asset with invalid path fails', () => {
    const result = validatePageSchema(
      {
        registryVersion: '1.1',
        title: 'Test',
        components: [
          {
            registryName: 'GalleryShowcase',
            props: {
              shots: [
                { caption: 'One', imageUrl: 'uploads/img.jpg' },
              ],
            },
          },
        ],
      },
      manifest,
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('imageUrl'))).toBe(true);
  });

  it('nested array asset with assets/ prefix passes', () => {
    const result = validatePageSchema(
      {
        registryVersion: '1.1',
        title: 'Test',
        components: [
          {
            registryName: 'GalleryShowcase',
            props: {
              shots: [
                { caption: 'One', imageUrl: 'assets/references/img-00007.png' },
              ],
            },
          },
        ],
      },
      manifest,
    );
    expect(result.valid).toBe(true);
  });
});
