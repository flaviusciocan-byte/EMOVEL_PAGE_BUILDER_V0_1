// Confirms that the MISSING ASSET warning never appears in the static export path.
// BuilderModeContext defaults to false, so renderToStaticMarkup (used by publishToZip
// and the verify-export harness) produces clean HTML with no builder UI.

import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CardRender } from './puck.config';
import type { CardProps } from './section-contract';

// The exact scenario that triggers the warning in the builder canvas:
// variant === 'image' AND cardImageUrl is empty.
const IMAGE_CARD_NO_URL: CardProps = {
  surface:            'transparent',
  width:              'contained',
  backgroundImageUrl: '',
  variant:            'image',
  title:              'Test Card Title',
  body:               'Body text.',
  eyebrow:            '',
  cardImageUrl:       '',
  objectImageUrl:     '',
  ctaLabel:           '',
  ctaHref:            '#',
};

describe('CardRender — export path is clean', () => {
  it('does not include MISSING ASSET when no BuilderModeContext.Provider exists', () => {
    const html = renderToStaticMarkup(createElement(CardRender, IMAGE_CARD_NO_URL));
    expect(html).not.toContain('MISSING ASSET');
    expect(html).not.toContain('cardImageUrl before export');
  });

  it('still renders card content in the export path', () => {
    const html = renderToStaticMarkup(createElement(CardRender, IMAGE_CARD_NO_URL));
    expect(html).toContain('Test Card Title');
    expect(html).toContain('emovel-card');
  });
});
