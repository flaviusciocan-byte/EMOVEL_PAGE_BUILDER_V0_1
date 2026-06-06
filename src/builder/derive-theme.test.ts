import { describe, it, expect } from 'vitest';
import { deriveTheme, hexContrast } from './derive-theme';
import { COLOR_KEYS } from './tokens';

const AA  = 4.5;
const AAA = 7.0;

// ─── Edge-case inputs ────────────────────────────────────────────────────────

const CASES = [
  { label: 'EMOVEL gold, dark',       inputs: { primary: '#D4AF37', mode: 'dark'  } },
  { label: 'electric blue, dark',     inputs: { primary: '#5B8DEF', mode: 'dark'  } },
  { label: 'warm coral, dark',        inputs: { primary: '#FF6B4A', mode: 'dark'  } },
  { label: 'near-grey, dark',         inputs: { primary: '#888888', mode: 'dark'  } },
  { label: 'very dark primary, dark', inputs: { primary: '#0A0A0A', mode: 'dark'  } },
  { label: 'very light primary, dark',inputs: { primary: '#F5F5F5', mode: 'dark'  } },
  { label: 'saturated red, light',    inputs: { primary: '#FF0000', mode: 'light' } },
  { label: 'warm coral, light',       inputs: { primary: '#FF6B4A', mode: 'light' } },
  { label: 'near-grey, light',        inputs: { primary: '#888888', mode: 'light' } },
  { label: 'very dark primary, light',inputs: { primary: '#0A0A0A', mode: 'light' } },
  { label: 'very light primary, light',inputs:{ primary: '#F5F5F5', mode: 'light' } },
  { label: 'deep purple, dark',       inputs: { primary: '#6B21A8', mode: 'dark'  } },
  { label: 'custom accent, dark',     inputs: { primary: '#D4AF37', accent: '#5CC8FF', mode: 'dark' } },
] as const;

// ─── Token completeness ───────────────────────────────────────────────────────

describe('deriveTheme — token completeness', () => {
  it('returns exactly 13 tokens', () => {
    const tokens = deriveTheme({ primary: '#D4AF37', mode: 'dark' });
    expect(Object.keys(tokens).sort()).toEqual([...COLOR_KEYS].sort());
  });

  it('all hex tokens are valid hex strings', () => {
    const tokens = deriveTheme({ primary: '#5B8DEF', mode: 'dark' });
    const hexKeys = ['background', 'surface', 'surfaceAlt', 'textPrimary', 'textSecondary',
                     'border', 'primary', 'secondary', 'accent', 'success', 'warning', 'danger'] as const;
    for (const key of hexKeys) {
      expect(tokens[key]).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('glow token is a valid rgba() string', () => {
    const tokens = deriveTheme({ primary: '#FF6B4A', mode: 'dark' });
    expect(tokens.glow).toMatch(/^rgba\(\d+,\d+,\d+,[\d.]+\)$/);
  });
});

// ─── WCAG contrast guarantees ────────────────────────────────────────────────

describe('deriveTheme — textPrimary vs background ≥ AAA (7:1)', () => {
  for (const { label, inputs } of CASES) {
    it(label, () => {
      const t = deriveTheme(inputs);
      const ratio = hexContrast(t.textPrimary, t.background);
      expect(ratio, `textPrimary on bg: ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(AAA);
    });
  }
});

describe('deriveTheme — textSecondary vs background ≥ AA (4.5:1)', () => {
  for (const { label, inputs } of CASES) {
    it(label, () => {
      const t = deriveTheme(inputs);
      const ratio = hexContrast(t.textSecondary, t.background);
      expect(ratio, `textSecondary on bg: ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(AA);
    });
  }
});

describe('deriveTheme — textPrimary vs surface ≥ AA (4.5:1)', () => {
  for (const { label, inputs } of CASES) {
    it(label, () => {
      const t = deriveTheme(inputs);
      const ratio = hexContrast(t.textPrimary, t.surface);
      expect(ratio, `textPrimary on surface: ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(AA);
    });
  }
});

// ─── Mode-specific invariants ─────────────────────────────────────────────────

describe('deriveTheme — dark mode background is dark', () => {
  it('background luminance < 0.05 for dark mode', () => {
    const t = deriveTheme({ primary: '#D4AF37', mode: 'dark' });
    // Luminance of a proper dark bg should be very low
    const ratio = hexContrast(t.background, '#FFFFFF');
    expect(ratio).toBeGreaterThanOrEqual(10); // white vs very dark bg
  });
});

describe('deriveTheme — light mode background is light', () => {
  it('background has high contrast vs black for light mode', () => {
    const t = deriveTheme({ primary: '#D4AF37', mode: 'light' });
    const ratio = hexContrast(t.background, '#000000');
    expect(ratio).toBeGreaterThanOrEqual(10); // black vs near-white bg
  });
});

// ─── Surface ordering ─────────────────────────────────────────────────────────

describe('deriveTheme — surface layering', () => {
  it('dark: surface is lighter than background', () => {
    const t = deriveTheme({ primary: '#5B8DEF', mode: 'dark' });
    // surface should have higher contrast vs pure black than background does
    const bgVsBlack      = hexContrast(t.background, '#000000');
    const surfaceVsBlack = hexContrast(t.surface, '#000000');
    expect(surfaceVsBlack).toBeGreaterThan(bgVsBlack);
  });

  it('light: surface is darker than background', () => {
    const t = deriveTheme({ primary: '#5B8DEF', mode: 'light' });
    const bgVsWhite      = hexContrast(t.background, '#FFFFFF');
    const surfaceVsWhite = hexContrast(t.surface, '#FFFFFF');
    expect(surfaceVsWhite).toBeGreaterThan(bgVsWhite);
  });
});

// ─── Accent override ──────────────────────────────────────────────────────────

describe('deriveTheme — accent input', () => {
  it('accent differs from primary when accent is supplied', () => {
    const t = deriveTheme({ primary: '#D4AF37', accent: '#5CC8FF', mode: 'dark' });
    expect(t.accent).not.toEqual(t.primary);
  });

  it('accent equals primary when accent is omitted', () => {
    const t = deriveTheme({ primary: '#D4AF37', mode: 'dark' });
    expect(t.accent).toEqual(t.primary);
  });
});
