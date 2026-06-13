import { describe, it, expect } from 'vitest';
import { collectLocalAssetRefs, validatePageForExport } from './export-validator';
import type { Data } from '@puckeditor/core';

function makeData(
  sections: Array<{ type: string; id: string; props: Record<string, unknown> }>,
): Data {
  return { content: sections, root: { props: {} } };
}

// ── collectLocalAssetRefs ─────────────────────────────────────────────────────

describe('collectLocalAssetRefs', () => {
  it('returns empty for data with no sections', () => {
    expect(collectLocalAssetRefs(makeData([]))).toEqual([]);
  });

  it('returns empty when all asset fields are empty strings', () => {
    const data = makeData([{
      type: 'Hero', id: 'h1',
      props: { backgroundImageUrl: '', logoImageUrl: '', imageUrl: '' },
    }]);
    expect(collectLocalAssetRefs(data)).toEqual([]);
  });

  it('collects backgroundImageUrl starting with assets/', () => {
    const data = makeData([{
      type: 'Hero', id: 'h1', props: { backgroundImageUrl: 'assets/hero-bg.jpg' },
    }]);
    expect(collectLocalAssetRefs(data)).toEqual(['assets/hero-bg.jpg']);
  });

  it('normalizes /assets/ paths by stripping the leading slash', () => {
    const data = makeData([{
      type: 'Hero', id: 'h1', props: { backgroundImageUrl: '/assets/hero-bg.jpg' },
    }]);
    expect(collectLocalAssetRefs(data)).toEqual(['assets/hero-bg.jpg']);
  });

  it('ignores https:// URLs', () => {
    const data = makeData([{
      type: 'Hero', id: 'h1', props: { imageUrl: 'https://cdn.example.com/image.jpg' },
    }]);
    expect(collectLocalAssetRefs(data)).toEqual([]);
  });

  it('ignores http:// URLs', () => {
    const data = makeData([{
      type: 'Hero', id: 'h1', props: { imageUrl: 'http://cdn.example.com/image.jpg' },
    }]);
    expect(collectLocalAssetRefs(data)).toEqual([]);
  });

  it('ignores data: URIs', () => {
    const data = makeData([{
      type: 'Hero', id: 'h1', props: { avatarUrl: 'data:image/png;base64,abc123' },
    }]);
    expect(collectLocalAssetRefs(data)).toEqual([]);
  });

  it('ignores blob: URLs', () => {
    const data = makeData([{
      type: 'Hero', id: 'h1', props: { cardImageUrl: 'blob:http://localhost/uuid' },
    }]);
    expect(collectLocalAssetRefs(data)).toEqual([]);
  });

  it('collects all six designated asset fields', () => {
    const data = makeData([{
      type: 'Mixed', id: 'm1', props: {
        backgroundImageUrl: 'assets/bg.jpg',
        logoImageUrl:       'assets/logo.png',
        imageUrl:           'assets/img.jpg',
        avatarUrl:          'assets/avatar.png',
        cardImageUrl:       'assets/card.jpg',
        objectImageUrl:     'assets/object.png',
      },
    }]);
    expect(collectLocalAssetRefs(data)).toHaveLength(6);
  });

  it('collects refs across multiple sections', () => {
    const data = makeData([
      { type: 'Hero',   id: 'h1', props: { backgroundImageUrl: 'assets/bg.jpg', logoImageUrl: 'assets/logo.png' } },
      { type: 'Footer', id: 'f1', props: { imageUrl: 'assets/footer-img.jpg' } },
    ]);
    expect(collectLocalAssetRefs(data)).toEqual([
      'assets/bg.jpg',
      'assets/logo.png',
      'assets/footer-img.jpg',
    ]);
  });

  it('does not collect non-asset-field props even if they look like paths', () => {
    const data = makeData([{
      type: 'Hero', id: 'h1', props: { title: 'assets/fake.jpg', ctaHref: 'assets/whatever' },
    }]);
    expect(collectLocalAssetRefs(data)).toEqual([]);
  });
});

// ── validatePageForExport ─────────────────────────────────────────────────────

describe('validatePageForExport', () => {
  it('returns empty array when there are no local asset refs', () => {
    const data = makeData([{
      type: 'Hero', id: 'h1', props: { backgroundImageUrl: '' },
    }]);
    expect(validatePageForExport(data, () => true)).toEqual([]);
  });

  it('returns empty array when all referenced assets exist', () => {
    const data = makeData([{
      type: 'Hero', id: 'h1', props: { backgroundImageUrl: 'assets/hero.jpg' },
    }]);
    expect(validatePageForExport(data, () => true)).toEqual([]);
  });

  it('returns one error string per missing asset', () => {
    const data = makeData([{
      type: 'Hero', id: 'h1', props: {
        backgroundImageUrl: 'assets/missing.jpg',
        logoImageUrl:       'assets/also-missing.png',
      },
    }]);
    const errors = validatePageForExport(data, () => false);
    expect(errors).toHaveLength(2);
    expect(errors[0]).toContain('MISSING ASSET');
    expect(errors[0]).toContain('assets/missing.jpg');
    expect(errors[1]).toContain('MISSING ASSET');
    expect(errors[1]).toContain('assets/also-missing.png');
  });

  it('reports only missing assets, not existing ones', () => {
    const existing = new Set(['assets/present.jpg']);
    const data = makeData([{
      type: 'Hero', id: 'h1', props: {
        backgroundImageUrl: 'assets/present.jpg',
        logoImageUrl:       'assets/missing.png',
      },
    }]);
    const errors = validatePageForExport(data, p => existing.has(p));
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('assets/missing.png');
    expect(errors[0]).not.toContain('assets/present.jpg');
  });

  it('error strings begin with MISSING ASSET:', () => {
    const data = makeData([{
      type: 'Hero', id: 'h1', props: { imageUrl: 'assets/image.jpg' },
    }]);
    const [error] = validatePageForExport(data, () => false);
    expect(error).toMatch(/^MISSING ASSET:/);
  });

  it('returns empty array for an external URL even when existsFn returns false', () => {
    const data = makeData([{
      type: 'Hero', id: 'h1', props: { imageUrl: 'https://external.com/img.jpg' },
    }]);
    expect(validatePageForExport(data, () => false)).toEqual([]);
  });
});

// ── collectLocalAssetRefs — nested arrays ─────────────────────────────────────

describe('collectLocalAssetRefs — nested arrays', () => {
  it('collects imageUrl from nested array items', () => {
    const data = makeData([{
      type: 'Gallery', id: 'g1',
      props: {
        shots: [
          { caption: 'One', imageUrl: 'assets/references/img-00007.png' },
          { caption: 'Two', imageUrl: 'assets/references/img-00008.png' },
        ],
      },
    }]);
    expect(collectLocalAssetRefs(data)).toEqual([
      'assets/references/img-00007.png',
      'assets/references/img-00008.png',
    ]);
  });

  it('normalizes /assets/ prefix inside nested items', () => {
    const data = makeData([{
      type: 'Gallery', id: 'g1',
      props: {
        shots: [
          { caption: 'One', imageUrl: '/assets/references/img-00007.png' },
        ],
      },
    }]);
    expect(collectLocalAssetRefs(data)).toEqual(['assets/references/img-00007.png']);
  });

  it('ignores external URLs inside nested items', () => {
    const data = makeData([{
      type: 'Gallery', id: 'g1',
      props: {
        shots: [
          { caption: 'One', imageUrl: 'https://cdn.example.com/img.jpg' },
        ],
      },
    }]);
    expect(collectLocalAssetRefs(data)).toEqual([]);
  });

  it('ignores empty imageUrl inside nested items', () => {
    const data = makeData([{
      type: 'Gallery', id: 'g1',
      props: {
        shots: [
          { caption: 'One', imageUrl: '' },
          { caption: 'Two', imageUrl: '' },
        ],
      },
    }]);
    expect(collectLocalAssetRefs(data)).toEqual([]);
  });

  it('ignores nested items with no asset fields', () => {
    const data = makeData([{
      type: 'Gallery', id: 'g1',
      props: {
        shots: [
          { caption: 'Caption only' },
        ],
      },
    }]);
    expect(collectLocalAssetRefs(data)).toEqual([]);
  });

  it('collects nested assets alongside top-level assets', () => {
    const data = makeData([{
      type: 'Gallery', id: 'g1',
      props: {
        backgroundImageUrl: 'assets/bg.jpg',
        shots: [
          { caption: 'One', imageUrl: 'assets/references/img-00007.png' },
        ],
      },
    }]);
    expect(collectLocalAssetRefs(data)).toEqual([
      'assets/bg.jpg',
      'assets/references/img-00007.png',
    ]);
  });

  it('deduplicates when the same path appears more than once', () => {
    const data = makeData([{
      type: 'Gallery', id: 'g1',
      props: {
        shots: [
          { caption: 'A', imageUrl: 'assets/references/img-00007.png' },
          { caption: 'B', imageUrl: 'assets/references/img-00007.png' },
        ],
      },
    }]);
    expect(collectLocalAssetRefs(data)).toEqual(['assets/references/img-00007.png']);
  });

  it('deduplicates when the same path appears in top-level and nested', () => {
    const data = makeData([{
      type: 'Gallery', id: 'g1',
      props: {
        imageUrl: 'assets/references/img-00007.png',
        shots: [
          { caption: 'A', imageUrl: 'assets/references/img-00007.png' },
        ],
      },
    }]);
    expect(collectLocalAssetRefs(data)).toEqual(['assets/references/img-00007.png']);
  });

  it('skips prop values that are strings or numbers, not arrays', () => {
    const data = makeData([{
      type: 'Hero', id: 'h1',
      props: {
        imageUrl:    'assets/top.jpg',
        title:       'assets/fake.jpg',
        columnCount: 3,
      },
    }]);
    expect(collectLocalAssetRefs(data)).toEqual(['assets/top.jpg']);
  });
});

// ── validatePageForExport — nested arrays ─────────────────────────────────────

describe('validatePageForExport — nested arrays', () => {
  it('reports missing asset in nested array item', () => {
    const data = makeData([{
      type: 'Gallery', id: 'g1',
      props: {
        shots: [
          { caption: 'One', imageUrl: 'assets/references/missing.png' },
        ],
      },
    }]);
    const errors = validatePageForExport(data, () => false);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('MISSING ASSET');
    expect(errors[0]).toContain('assets/references/missing.png');
  });

  it('does not report nested asset when existsFn confirms it exists', () => {
    const existing = new Set(['assets/references/img-00007.png']);
    const data = makeData([{
      type: 'Gallery', id: 'g1',
      props: {
        shots: [
          { caption: 'One', imageUrl: 'assets/references/img-00007.png' },
        ],
      },
    }]);
    expect(validatePageForExport(data, p => existing.has(p))).toEqual([]);
  });

  it('reports mixed top-level and nested missing assets', () => {
    const data = makeData([{
      type: 'Gallery', id: 'g1',
      props: {
        backgroundImageUrl: 'assets/bg-missing.jpg',
        shots: [
          { caption: 'One', imageUrl: 'assets/references/missing.png' },
        ],
      },
    }]);
    const errors = validatePageForExport(data, () => false);
    expect(errors).toHaveLength(2);
    expect(errors.some(e => e.includes('assets/bg-missing.jpg'))).toBe(true);
    expect(errors.some(e => e.includes('assets/references/missing.png'))).toBe(true);
  });
});
