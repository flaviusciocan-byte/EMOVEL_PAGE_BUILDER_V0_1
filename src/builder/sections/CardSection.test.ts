// The component renders a <style> block containing all class names as CSS selectors.
// Presence/absence of rendered *elements* must be tested with class="..." (HTML attribute
// syntax) rather than bare class names, to distinguish the element from the CSS rule.

import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CardSection } from './CardSection';
import type { CardVariant } from '../section-contract';

const BASE_PROPS = {
  surface: 'transparent' as const,
  width: 'contained' as const,
  backgroundImageUrl: '',
  title: 'Test card title',
  body: 'Test body text.',
  eyebrow: '',
  cardImageUrl: '',
  objectImageUrl: '',
  ctaLabel: '',
  ctaHref: '#',
};

const VARIANTS: CardVariant[] = ['solid', 'glass', 'outline', 'image'];

// ── One test per variant: renders without crashing ───────────────────────────

describe('CardSection — renders without crashing', () => {
  for (const variant of VARIANTS) {
    it(`variant "${variant}"`, () => {
      const html = renderToStaticMarkup(
        createElement(CardSection, { ...BASE_PROPS, variant }),
      );
      expect(html).toContain('Test card title');
      // Variant modifier class present on the outer element (alongside SectionSurface classes)
      expect(html).toContain(`emovel-card--${variant}`);
    });
  }
});

// ── Optional content ─────────────────────────────────────────────────────────

describe('CardSection — conditional content', () => {
  it('renders eyebrow element when eyebrow is provided', () => {
    const html = renderToStaticMarkup(
      createElement(CardSection, { ...BASE_PROPS, variant: 'solid', eyebrow: 'Section label' }),
    );
    expect(html).toContain('Section label');
    // Actual rendered element has class=" attribute syntax
    expect(html).toContain('class="emovel-card__eyebrow"');
  });

  it('omits eyebrow element when eyebrow is empty', () => {
    const html = renderToStaticMarkup(
      createElement(CardSection, { ...BASE_PROPS, variant: 'solid', eyebrow: '' }),
    );
    // CSS rules contain ".emovel-card__eyebrow" — check attribute syntax to detect rendered element
    expect(html).not.toContain('class="emovel-card__eyebrow"');
  });

  it('renders CTA link when ctaLabel is set', () => {
    const html = renderToStaticMarkup(
      createElement(CardSection, { ...BASE_PROPS, variant: 'solid', ctaLabel: 'Get started', ctaHref: '#cta' }),
    );
    expect(html).toContain('Get started');
    expect(html).toContain('href="#cta"');
    expect(html).toContain('class="emovel-card__cta"');
  });

  it('omits CTA element when ctaLabel is empty', () => {
    const html = renderToStaticMarkup(
      createElement(CardSection, { ...BASE_PROPS, variant: 'solid', ctaLabel: '' }),
    );
    expect(html).not.toContain('class="emovel-card__cta"');
  });
});

// ── Image variant specific ───────────────────────────────────────────────────

describe('CardSection — image variant', () => {
  it('renders overlay element when variant is image', () => {
    const html = renderToStaticMarkup(
      createElement(CardSection, { ...BASE_PROPS, variant: 'image' }),
    );
    expect(html).toContain('class="emovel-card__overlay"');
  });

  it('renders bg element with inline style when cardImageUrl is set', () => {
    const html = renderToStaticMarkup(
      createElement(CardSection, {
        ...BASE_PROPS,
        variant: 'image',
        cardImageUrl: 'assets/hero-bg.jpg',
      }),
    );
    expect(html).toContain('class="emovel-card__bg"');
    expect(html).toContain('hero-bg.jpg');
  });

  it('omits bg element when cardImageUrl is empty', () => {
    const html = renderToStaticMarkup(
      createElement(CardSection, { ...BASE_PROPS, variant: 'image', cardImageUrl: '' }),
    );
    expect(html).not.toContain('class="emovel-card__bg"');
  });

  it('does NOT render overlay element for non-image variants', () => {
    for (const variant of ['solid', 'glass', 'outline'] as CardVariant[]) {
      const html = renderToStaticMarkup(
        createElement(CardSection, { ...BASE_PROPS, variant }),
      );
      expect(html, `${variant} should have no overlay element`).not.toContain('class="emovel-card__overlay"');
    }
  });
});

// ── Object image ─────────────────────────────────────────────────────────────

describe('CardSection — object image', () => {
  it('renders object img element when objectImageUrl is set', () => {
    const html = renderToStaticMarkup(
      createElement(CardSection, { ...BASE_PROPS, variant: 'solid', objectImageUrl: 'assets/object.png' }),
    );
    expect(html).toContain('class="emovel-card__object"');
    expect(html).toContain('object.png');
  });

  it('omits object img element when objectImageUrl is empty', () => {
    const html = renderToStaticMarkup(
      createElement(CardSection, { ...BASE_PROPS, variant: 'solid', objectImageUrl: '' }),
    );
    expect(html).not.toContain('class="emovel-card__object"');
  });
});
