import { describe, it, expect } from 'vitest';
import { pageSchemaToPuckData } from './page-schema-to-puck';
import type { PageSchema } from './page-schema';

// ── component name mapping ─────────────────────────────────────────────────────

describe('pageSchemaToPuckData — registry to Puck name mapping', () => {
  it('HeroSection maps to Hero', () => {
    const schema: PageSchema = {
      registryVersion: '1.1',
      title: 'Test',
      components: [{ registryName: 'HeroSection', props: {} }],
    };
    expect(pageSchemaToPuckData(schema).content[0].type).toBe('Hero');
  });

  it('GalleryShowcase maps to Screenshot Gallery', () => {
    const schema: PageSchema = {
      registryVersion: '1.1',
      title: 'Test',
      components: [{ registryName: 'GalleryShowcase', props: {} }],
    };
    expect(pageSchemaToPuckData(schema).content[0].type).toBe('Screenshot Gallery');
  });

  it('FooterSection maps to Footer', () => {
    const schema: PageSchema = {
      registryVersion: '1.1',
      title: 'Test',
      components: [{ registryName: 'FooterSection', props: {} }],
    };
    expect(pageSchemaToPuckData(schema).content[0].type).toBe('Footer');
  });

  it('NavigationBar maps to Nav Bar', () => {
    const schema: PageSchema = {
      registryVersion: '1.1',
      title: 'Test',
      components: [{ registryName: 'NavigationBar', props: {} }],
    };
    expect(pageSchemaToPuckData(schema).content[0].type).toBe('Nav Bar');
  });

  it('CTASection maps to CTA Section', () => {
    const schema: PageSchema = {
      registryVersion: '1.1',
      title: 'Test',
      components: [{ registryName: 'CTASection', props: {} }],
    };
    expect(pageSchemaToPuckData(schema).content[0].type).toBe('CTA Section');
  });

  it('LeadCapture maps to Newsletter', () => {
    const schema: PageSchema = {
      registryVersion: '1.1',
      title: 'Test',
      components: [{ registryName: 'LeadCapture', props: {} }],
    };
    expect(pageSchemaToPuckData(schema).content[0].type).toBe('Newsletter');
  });

  it('TestimonialSection maps to Testimonials', () => {
    const schema: PageSchema = {
      registryVersion: '1.1',
      title: 'Test',
      components: [{ registryName: 'TestimonialSection', props: {} }],
    };
    expect(pageSchemaToPuckData(schema).content[0].type).toBe('Testimonials');
  });

  it('EditorialSection maps to Feature Split', () => {
    const schema: PageSchema = {
      registryVersion: '1.1',
      title: 'Test',
      components: [{ registryName: 'EditorialSection', props: {} }],
    };
    expect(pageSchemaToPuckData(schema).content[0].type).toBe('Feature Split');
  });
});

// ── unsupported components ─────────────────────────────────────────────────────

describe('pageSchemaToPuckData — unsupported components', () => {
  it('unsupported component throws explicit error', () => {
    const schema: PageSchema = {
      registryVersion: '1.1',
      title: 'Test',
      components: [{ registryName: 'DashboardPreview', props: {} }],
    };
    expect(() => pageSchemaToPuckData(schema)).toThrow('DashboardPreview');
  });

  it('unknown component throws explicit error', () => {
    const schema: PageSchema = {
      registryVersion: '1.1',
      title: 'Test',
      components: [{ registryName: 'FakeComponent', props: {} }],
    };
    expect(() => pageSchemaToPuckData(schema)).toThrow('FakeComponent');
  });
});

// ── output shape ───────────────────────────────────────────────────────────────

describe('pageSchemaToPuckData — output shape', () => {
  it('output has root, content, and zones', () => {
    const schema: PageSchema = {
      registryVersion: '1.1',
      title: 'My Page',
      components: [{ registryName: 'HeroSection', props: {} }],
    };
    const data = pageSchemaToPuckData(schema);
    expect(data.root).toBeDefined();
    expect(Array.isArray(data.content)).toBe(true);
    expect(data.zones).toBeDefined();
  });

  it('title is placed in root.props', () => {
    const schema: PageSchema = {
      registryVersion: '1.1',
      title: 'EMOVEL Cinematic Codex',
      components: [],
    };
    const data = pageSchemaToPuckData(schema);
    // root.props is optional in Puck's Data type but we always populate it
    expect(data.root.props?.title).toBe('EMOVEL Cinematic Codex');
  });

  it('component props are forwarded to the Puck content item', () => {
    const schema: PageSchema = {
      registryVersion: '1.1',
      title: 'Test',
      components: [
        {
          registryName: 'CTASection',
          props: { headline: 'Act Now', surface: 'inverted', spacing: 'generous' },
        },
      ],
    };
    const data = pageSchemaToPuckData(schema);
    expect(data.content[0].props.headline).toBe('Act Now');
    expect(data.content[0].props.surface).toBe('inverted');
    expect(data.content[0].props.spacing).toBe('generous');
  });

  it('each content item has a non-empty id in props', () => {
    const schema: PageSchema = {
      registryVersion: '1.1',
      title: 'Test',
      components: [
        { registryName: 'HeroSection',   props: {} },
        { registryName: 'FooterSection', props: {} },
      ],
    };
    const data = pageSchemaToPuckData(schema);
    expect(typeof data.content[0].props.id).toBe('string');
    expect(data.content[0].props.id).toBeTruthy();
    expect(typeof data.content[1].props.id).toBe('string');
    expect(data.content[1].props.id).toBeTruthy();
  });

  it('content items get distinct ids', () => {
    const schema: PageSchema = {
      registryVersion: '1.1',
      title: 'Test',
      components: [
        { registryName: 'HeroSection',   props: {} },
        { registryName: 'FooterSection', props: {} },
      ],
    };
    const data = pageSchemaToPuckData(schema);
    expect(data.content[0].props.id).not.toBe(data.content[1].props.id);
  });

  it('empty components produces empty content array', () => {
    const schema: PageSchema = {
      registryVersion: '1.1',
      title: 'Blank',
      components: [],
    };
    const data = pageSchemaToPuckData(schema);
    expect(data.content).toHaveLength(0);
  });

  it('multiple components map in order', () => {
    const schema: PageSchema = {
      registryVersion: '1.1',
      title: 'Full Page',
      components: [
        { registryName: 'NavigationBar', props: {} },
        { registryName: 'HeroSection',   props: {} },
        { registryName: 'CTASection',    props: {} },
        { registryName: 'FooterSection', props: {} },
      ],
    };
    const data = pageSchemaToPuckData(schema);
    expect(data.content).toHaveLength(4);
    expect(data.content[0].type).toBe('Nav Bar');
    expect(data.content[1].type).toBe('Hero');
    expect(data.content[2].type).toBe('CTA Section');
    expect(data.content[3].type).toBe('Footer');
  });
});
