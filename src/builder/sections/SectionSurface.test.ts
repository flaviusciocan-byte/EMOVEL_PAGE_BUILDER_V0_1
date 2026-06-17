import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SectionSurface } from './SectionSurface';
import type { SurfaceVariant, WidthVariant } from '../section-contract';

const SURFACES: SurfaceVariant[] = ['transparent', 'base', 'surface', 'surfaceAlt', 'image', 'gradient'];
const WIDTHS: WidthVariant[] = ['contained', 'full-bleed'];

// ── Surface variants: render without crashing ────────────────────────────────

describe('SectionSurface — surface variants render without crashing', () => {
  for (const surface of SURFACES) {
    it(`surface="${surface}"`, () => {
      const html = renderToStaticMarkup(
        createElement(SectionSurface, { surface, width: 'contained', children: 'test' }),
      );
      expect(html).toContain(`emovel-surf--${surface}`);
      expect(html).toContain('test');
    });
  }
});

// ── Width variants ───────────────────────────────────────────────────────────

describe('SectionSurface — width variants', () => {
  for (const width of WIDTHS) {
    it(`width="${width}"`, () => {
      const html = renderToStaticMarkup(
        createElement(SectionSurface, { surface: 'base', width, children: 'content' }),
      );
      expect(html).toContain(`emovel-surf--${width}`);
    });
  }
});

// ── Semantic element override ─────────────────────────────────────────────────

describe('SectionSurface — semantic element', () => {
  it('renders <section> by default', () => {
    const html = renderToStaticMarkup(
      createElement(SectionSurface, { surface: 'base', width: 'contained', children: 'x' }),
    );
    expect(html).toMatch(/^<section /);
  });

  it('renders <footer> when as="footer"', () => {
    const html = renderToStaticMarkup(
      createElement(SectionSurface, { surface: 'base', width: 'contained', as: 'footer', children: 'x' }),
    );
    expect(html).toMatch(/^<footer /);
  });

  it('renders <nav> when as="nav"', () => {
    const html = renderToStaticMarkup(
      createElement(SectionSurface, { surface: 'base', width: 'contained', as: 'nav', children: 'x' }),
    );
    expect(html).toMatch(/^<nav /);
  });
});

// ── Image surface ─────────────────────────────────────────────────────────────

describe('SectionSurface — image surface', () => {
  it('emits overlay element when surface=image', () => {
    const html = renderToStaticMarkup(
      createElement(SectionSurface, { surface: 'image', width: 'contained', children: 'x' }),
    );
    expect(html).toContain('class="emovel-surf__overlay"');
  });

  it('emits bg element when backgroundImageUrl is set', () => {
    const html = renderToStaticMarkup(
      createElement(SectionSurface, {
        surface: 'image',
        width: 'contained',
        backgroundImageUrl: 'assets/bg.jpg',
        children: 'x',
      }),
    );
    expect(html).toContain('class="emovel-surf__bg"');
    expect(html).toContain('bg.jpg');
  });

  it('omits bg element when backgroundImageUrl is empty', () => {
    const html = renderToStaticMarkup(
      createElement(SectionSurface, { surface: 'image', width: 'contained', backgroundImageUrl: '', children: 'x' }),
    );
    expect(html).not.toContain('class="emovel-surf__bg"');
  });

  it('does NOT emit overlay for non-image surfaces', () => {
    for (const surface of ['transparent', 'base', 'surface', 'surfaceAlt', 'gradient'] as SurfaceVariant[]) {
      const html = renderToStaticMarkup(
        createElement(SectionSurface, { surface, width: 'contained', children: 'x' }),
      );
      expect(html, `${surface} should have no overlay`).not.toContain('class="emovel-surf__overlay"');
    }
  });
});

// ── className + id forwarding ─────────────────────────────────────────────────

describe('SectionSurface — className and id forwarding', () => {
  it('forwards className to outer element', () => {
    const html = renderToStaticMarkup(
      createElement(SectionSurface, { surface: 'base', width: 'contained', className: 'emovel-hero', children: 'x' }),
    );
    expect(html).toContain('emovel-hero');
  });

  it('forwards id to outer element', () => {
    const html = renderToStaticMarkup(
      createElement(SectionSurface, { surface: 'base', width: 'contained', id: 'features', children: 'x' }),
    );
    expect(html).toContain('id="features"');
  });
});

// ── undefined / null prop guard ───────────────────────────────────────────────

describe('SectionSurface — undefined/null surface and width guard', () => {
  it('falls back to "transparent" when surface is undefined', () => {
    const html = renderToStaticMarkup(
      createElement(SectionSurface, { surface: undefined as unknown as SurfaceVariant, width: 'contained', children: 'x' }),
    );
    expect(html).toContain('emovel-surf--transparent');
    expect(html).not.toContain('emovel-surf--undefined');
  });

  it('falls back to "contained" when width is undefined', () => {
    const html = renderToStaticMarkup(
      createElement(SectionSurface, { surface: 'base', width: undefined as unknown as WidthVariant, children: 'x' }),
    );
    expect(html).toContain('emovel-surf--contained');
    expect(html).not.toContain('emovel-surf--undefined');
  });

  it('falls back to "transparent" when surface is null', () => {
    const html = renderToStaticMarkup(
      createElement(SectionSurface, { surface: null as unknown as SurfaceVariant, width: 'contained', children: 'x' }),
    );
    expect(html).not.toContain('--undefined');
    expect(html).not.toContain('--null');
  });

  it('never emits "--undefined" or "--null" in className for any falsy prop', () => {
    for (const bad of [undefined, null] as unknown[]) {
      const html = renderToStaticMarkup(
        createElement(SectionSurface, {
          surface: bad as SurfaceVariant,
          width: bad as WidthVariant,
          children: 'x',
        }),
      );
      expect(html).not.toContain('--undefined');
      expect(html).not.toContain('--null');
    }
  });
});
