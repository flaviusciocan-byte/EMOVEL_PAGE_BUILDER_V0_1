import { describe, it, expect } from 'vitest';
import { renderComposerBriefHTML, buildPageHTML } from './publish';
import type { ComposerBrief } from '../composer/page-schema';
import type { ThemeConfig } from './themes';
import type { Data } from '@puckeditor/core';
import { buildRegistryPageSchema } from '../composer/composer';
import { pageSchemaToPuckData }    from '../composer/page-schema-to-puck';
import type { ValidatorManifest }  from '../composer/page-schema-validator';
import manifestJson from '../../registry.manifest.json';

// ── Fixtures ─────────────────────────────────────────────────────────────────

const FULL_BRIEF: ComposerBrief = {
  projectName:          'ClinicFlow',
  audience:             'clinic managers and front-desk staff',
  coreOffer:            'Streamline patient scheduling',
  primaryAction:        'Join the waitlist',
  pageType:             'Launch Page',
  activationDepth:      undefined,
  progressMomentum:     undefined,
  emotionalSignalIndex: undefined,
};

const ALL_DEFINED_BRIEF: ComposerBrief = {
  projectName:          'Alpha',
  audience:             'early adopters',
  coreOffer:            'Core value',
  primaryAction:        'Get started',
  pageType:             'SaaS Landing',
  activationDepth:      'High',
  progressMomentum:     'Fast',
  emotionalSignalIndex: '8.4',
};

const MIN_THEME: ThemeConfig = {
  id: 'emovel', label: 'EMOVEL', description: '', swatches: ['#050505', '#0E0E10', '#D4AF37'], isDefault: true,
  colors: {
    background: '#050505', surface: '#0E0E10', surfaceAlt: '#16161A',
    textPrimary: '#FFFFFF', textSecondary: '#9A9A9E', border: '#2A2A30',
    primary: '#D4AF37', secondary: '#2F6BFF', accent: '#D4AF37',
    success: '#5BBF8A', warning: '#E0A93B', danger: '#F26D6D',
    glow: 'rgba(212,175,55,.14)',
  },
};

// ── renderComposerBriefHTML — presence checks ─────────────────────────────────

describe('renderComposerBriefHTML — section structure', () => {
  it('returns empty string when brief is undefined', () => {
    expect(renderComposerBriefHTML(undefined)).toBe('');
  });

  it('contains "Composer Brief" heading text', () => {
    expect(renderComposerBriefHTML(FULL_BRIEF)).toContain('Composer Brief');
  });

  it('wraps output in a <section> element', () => {
    const html = renderComposerBriefHTML(FULL_BRIEF);
    expect(html).toContain('<section');
    expect(html).toContain('</section>');
  });

  it('includes aria-label="Composer Brief"', () => {
    expect(renderComposerBriefHTML(FULL_BRIEF)).toContain('aria-label="Composer Brief"');
  });
});

// ── renderComposerBriefHTML — all eight field labels ──────────────────────────

describe('renderComposerBriefHTML — field labels', () => {
  it('renders "Product / Project" label', () => {
    expect(renderComposerBriefHTML(FULL_BRIEF)).toContain('Product / Project');
  });

  it('renders "Audience" label', () => {
    expect(renderComposerBriefHTML(FULL_BRIEF)).toContain('Audience');
  });

  it('renders "Core Offer" label', () => {
    expect(renderComposerBriefHTML(FULL_BRIEF)).toContain('Core Offer');
  });

  it('renders "Primary Action" label', () => {
    expect(renderComposerBriefHTML(FULL_BRIEF)).toContain('Primary Action');
  });

  it('renders "Page Type" label', () => {
    expect(renderComposerBriefHTML(FULL_BRIEF)).toContain('Page Type');
  });

  it('renders "Activation Depth" label', () => {
    expect(renderComposerBriefHTML(FULL_BRIEF)).toContain('Activation Depth');
  });

  it('renders "Progress Momentum" label', () => {
    expect(renderComposerBriefHTML(FULL_BRIEF)).toContain('Progress Momentum');
  });

  it('renders "Emotional Signal Index" label', () => {
    expect(renderComposerBriefHTML(FULL_BRIEF)).toContain('Emotional Signal Index');
  });
});

// ── renderComposerBriefHTML — values ──────────────────────────────────────────

describe('renderComposerBriefHTML — field values', () => {
  it('renders "Not detected" for undefined activationDepth', () => {
    expect(renderComposerBriefHTML(FULL_BRIEF)).toContain('Not detected');
  });

  it('renders "Not detected" for undefined progressMomentum', () => {
    const count = (renderComposerBriefHTML(FULL_BRIEF).match(/Not detected/g) ?? []).length;
    expect(count).toBeGreaterThanOrEqual(3); // activationDepth + progressMomentum + emotionalSignalIndex
  });

  it('renders actual projectName value', () => {
    expect(renderComposerBriefHTML(FULL_BRIEF)).toContain('ClinicFlow');
  });

  it('renders actual audience value', () => {
    expect(renderComposerBriefHTML(FULL_BRIEF)).toContain('clinic managers');
  });

  it('renders actual primaryAction value', () => {
    expect(renderComposerBriefHTML(FULL_BRIEF)).toContain('Join the waitlist');
  });

  it('no "Not detected" when all fields are defined', () => {
    expect(renderComposerBriefHTML(ALL_DEFINED_BRIEF)).not.toContain('Not detected');
  });

  it('renders all defined values when all fields are set', () => {
    const html = renderComposerBriefHTML(ALL_DEFINED_BRIEF);
    expect(html).toContain('High');
    expect(html).toContain('Fast');
    expect(html).toContain('8.4');
  });
});

// ── renderComposerBriefHTML — security ───────────────────────────────────────

describe('renderComposerBriefHTML — HTML escaping', () => {
  it('escapes < and > in values', () => {
    const xss: ComposerBrief = { ...FULL_BRIEF, projectName: '<script>alert(1)</script>' };
    const html = renderComposerBriefHTML(xss);
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('escapes " in values', () => {
    const xss: ComposerBrief = { ...FULL_BRIEF, audience: 'a"b' };
    const html = renderComposerBriefHTML(xss);
    expect(html).toContain('&quot;');
    expect(html).not.toMatch(/audience[^<]*"b/);
  });
});

// ── buildPageHTML — Composer Brief must be excluded from exported HTML ─────────

describe('buildPageHTML — composerBrief is excluded from exported HTML', () => {
  const DATA_WITH_BRIEF: Data = {
    content: [],
    root: { props: { title: 'Test Page', composerBrief: FULL_BRIEF as unknown } } as Data['root'],
  };

  it('exported HTML does not contain "Composer Brief"', () => {
    const html = buildPageHTML(DATA_WITH_BRIEF, MIN_THEME);
    expect(html).not.toContain('Composer Brief');
  });

  it('exported HTML does not contain "Product / Project" label', () => {
    const html = buildPageHTML(DATA_WITH_BRIEF, MIN_THEME);
    expect(html).not.toContain('Product / Project');
  });

  it('exported HTML does not contain "Activation Depth" label', () => {
    const html = buildPageHTML(DATA_WITH_BRIEF, MIN_THEME);
    expect(html).not.toContain('Activation Depth');
  });

  it('exported HTML does not contain "Not detected"', () => {
    const html = buildPageHTML(DATA_WITH_BRIEF, MIN_THEME);
    expect(html).not.toContain('Not detected');
  });

  it('exported HTML does not contain Composer Brief when root.props has no composerBrief', () => {
    const dataWithout: Data = {
      content: [],
      root: { props: { title: 'No Brief' } },
    };
    expect(buildPageHTML(dataWithout, MIN_THEME)).not.toContain('Composer Brief');
  });
});

// ── ClinicFlow full-pipeline fixture ──────────────────────────────────────────
// Uses the real composer → schema → puck-data → export pipeline end-to-end.
// Prompt mirrors: "ClinicFlow helps clinic managers automate intake, organize
// appointments, and reduce front-desk admin work."

const CLINICFLOW_PROMPT =
  'launch page for ClinicFlow — helps clinic managers automate intake, ' +
  'organize appointments, and reduce front-desk admin work';

const MANIFEST = manifestJson as ValidatorManifest;

describe('ClinicFlow full-pipeline — composer pipeline and HTML', () => {
  function buildClinicFlowHTML(): string {
    const schema = buildRegistryPageSchema(CLINICFLOW_PROMPT, MANIFEST);
    const data   = pageSchemaToPuckData(schema);
    return buildPageHTML(data, MIN_THEME);
  }

  it('composer extracts ClinicFlow as brand name', () => {
    const schema = buildRegistryPageSchema(CLINICFLOW_PROMPT, MANIFEST);
    expect(schema.composerBrief?.projectName).toBe('ClinicFlow');
  });

  it('composer sets pageType to Launch Page', () => {
    const schema = buildRegistryPageSchema(CLINICFLOW_PROMPT, MANIFEST);
    expect(schema.composerBrief?.pageType).toBe('Launch Page');
  });

  it('Puck root.props carries composerBrief after conversion', () => {
    const schema    = buildRegistryPageSchema(CLINICFLOW_PROMPT, MANIFEST);
    const data      = pageSchemaToPuckData(schema);
    const rootProps = (data.root as { props?: Record<string, unknown> }).props;
    expect(rootProps?.composerBrief).toBeDefined();
  });

  it('exported HTML does not contain "Composer Brief"', () => {
    expect(buildClinicFlowHTML()).not.toContain('Composer Brief');
  });

  it('exported HTML contains "ClinicFlow" (brand in page content)', () => {
    expect(buildClinicFlowHTML()).toContain('ClinicFlow');
  });

  it('exported HTML does not contain "Activation Depth"', () => {
    expect(buildClinicFlowHTML()).not.toContain('Activation Depth');
  });

  it('exported HTML does not contain "Not detected"', () => {
    expect(buildClinicFlowHTML()).not.toContain('Not detected');
  });
});

// ── buildPageHTML never emits Composer Brief diagnostic — any data shape ───────

describe('buildPageHTML — Composer Brief absent regardless of data shape', () => {
  it('no Composer Brief when data has no composerBrief', () => {
    const data: Data = { content: [], root: { props: { title: 'MyApp' } } };
    expect(buildPageHTML(data, MIN_THEME)).not.toContain('Composer Brief');
  });

  it('no Composer Brief when data has composerBrief', () => {
    const data: Data = {
      content: [],
      root: { props: { title: 'Test', composerBrief: ALL_DEFINED_BRIEF as unknown } } as Data['root'],
    };
    expect(buildPageHTML(data, MIN_THEME)).not.toContain('Composer Brief');
  });

  it('no "Not detected" in export even when all brief fields are undefined', () => {
    const data: Data = { content: [], root: { props: { title: '' } } };
    expect(buildPageHTML(data, MIN_THEME)).not.toContain('Not detected');
  });

  it('no Composer Brief for data with no root.props at all', () => {
    const data = { content: [], root: {} } as unknown as Data;
    expect(buildPageHTML(data, MIN_THEME)).not.toContain('Composer Brief');
  });
});
