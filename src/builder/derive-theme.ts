// Pure function: derive all 13 ColorTokens from minimal brand inputs.
// No side effects, no imports from themes.ts. Safe to call in tests.

import type { ColorTokens } from './tokens';

export interface ThemeInputs {
  primary: string;      // CSS hex color, e.g. "#D4AF37"
  accent?: string;      // optional; equals primary if omitted
  mode: 'light' | 'dark';
}

// Internal types — not exported
interface HSL { h: number; s: number; l: number }
interface RGB { r: number; g: number; b: number }

// ─── Hex / RGB / HSL conversion ──────────────────────────────────────────────

function hexToRgb(hex: string): RGB {
  const h = hex.replace('#', '').trim();
  const full = h.length === 3
    ? h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
    : h;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  switch (max) {
    case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
    case gn: h = ((bn - rn) / d + 2) / 6; break;
    default:  h = ((rn - gn) / d + 4) / 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hue2rgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function hslToRgb({ h, s, l }: HSL): RGB {
  const hn = h / 360, sn = s / 100, ln = l / 100;
  if (sn === 0) {
    const v = Math.round(ln * 255);
    return { r: v, g: v, b: v };
  }
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;
  return {
    r: Math.round(hue2rgb(p, q, hn + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hn) * 255),
    b: Math.round(hue2rgb(p, q, hn - 1 / 3) * 255),
  };
}

function rgbToHex({ r, g, b }: RGB): string {
  const clamp = (v: number) => Math.min(255, Math.max(0, Math.round(v)));
  return '#' + [r, g, b].map(v => clamp(v).toString(16).padStart(2, '0')).join('');
}

function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb({ ...hsl, l: clamp(hsl.l, 0, 100) }));
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

// ─── WCAG contrast math ───────────────────────────────────────────────────────

function linearize(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance({ r, g, b }: RGB): number {
  return 0.2126 * linearize(r / 255) + 0.7152 * linearize(g / 255) + 0.0722 * linearize(b / 255);
}

/** WCAG 2.1 contrast ratio between two RGB colors. Exported for tests. */
export function contrastRatio(a: RGB, b: RGB): number {
  const la = luminance(a), lb = luminance(b);
  const lighter = Math.max(la, lb), darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Exported hex-based wrapper for convenience in tests. */
export function hexContrast(hex1: string, hex2: string): number {
  return contrastRatio(hexToRgb(hex1), hexToRgb(hex2));
}

/**
 * Adjust `fg` lightness until contrast vs `bgRgb` meets `minRatio`.
 * Direction is inferred from background luminance:
 *   dark bg  → lighten fg
 *   light bg → darken fg
 */
function enforceContrast(fg: HSL, bgRgb: RGB, minRatio: number): HSL {
  const out = { ...fg };
  if (contrastRatio(hslToRgb(out), bgRgb) >= minRatio) return out;
  const bgLum = luminance(bgRgb);
  const step = bgLum < 0.18 ? 1 : -1; // dark bg → lighten; light bg → darken
  for (let i = 0; i < 100; i++) {
    out.l = clamp(out.l + step, 0, 100);
    if (contrastRatio(hslToRgb(out), bgRgb) >= minRatio) break;
    if (out.l === 0 || out.l === 100) break; // hit the wall — best we can do
  }
  return out;
}

// ─── deriveTheme ─────────────────────────────────────────────────────────────

/**
 * Derive all 13 ColorTokens from minimal brand inputs.
 *
 * Derivation mirrors the relationships used in the 6 built-in presets:
 *   - bg/surface/surfaceAlt = stepped lightness from a hue-tinted near-black or near-white
 *   - textPrimary = enforced ≥ 7:1 vs bg (WCAG AAA — body copy legibility)
 *   - textSecondary = enforced ≥ 4.5:1 vs bg (WCAG AA)
 *   - border = bg + larger lightness step (same proportion as presets)
 *   - primary = user input, display-clamped to a useful lightness band per mode
 *   - secondary = lighter (dark) or darker (light) variant of primary
 *   - accent = primary unless user supplied an accent
 *   - success / warning / danger = fixed per mode (matching preset conventions)
 *   - glow = rgba(primary, low alpha)
 */
export function deriveTheme(inputs: ThemeInputs): ColorTokens {
  const dark = inputs.mode === 'dark';

  // Parse primary input
  const pHsl = rgbToHsl(hexToRgb(inputs.primary.trim()));

  // ── Background — near-black or near-white with faint primary hue tint ──────
  const bgHsl: HSL = dark
    ? { h: pHsl.h, s: clamp(pHsl.s * 0.05, 0, 8),  l: 3.5 }
    : { h: pHsl.h, s: clamp(pHsl.s * 0.04, 0, 5),  l: 98.5 };
  const bgRgb = hslToRgb(bgHsl);

  // ── Surface layers — matched step sizes to presets ─────────────────────────
  //   dark:  +5L / +11L from bg (emovel: +3.4/+7.4; creator: +5/+8.5; launch: +7/+14)
  //   light: -4L / -8L  from bg (clean: -3/-7; shop: -6/-9)
  const surfaceHsl:    HSL = { ...bgHsl, l: clamp(bgHsl.l + (dark ?  5 : -4), 0, 100) };
  const surfaceAltHsl: HSL = { ...bgHsl, l: clamp(bgHsl.l + (dark ? 11 : -8), 0, 100) };

  // ── Text primary — near-white (dark) or near-black (light) ─────────────────
  const tpBase: HSL = dark
    ? { h: pHsl.h, s: clamp(pHsl.s * 0.04, 0, 6), l: 96 }
    : { h: pHsl.h, s: clamp(pHsl.s * 0.04, 0, 6), l: 6  };
  const textPrimary = enforceContrast(tpBase, bgRgb, 7.0); // ≥ AAA for body copy

  // ── Text secondary — mid-tone, enforce AA ─────────────────────────────────
  const tsBase: HSL = dark
    ? { h: pHsl.h, s: clamp(pHsl.s * 0.15, 0, 15), l: 60 }
    : { h: pHsl.h, s: clamp(pHsl.s * 0.12, 0, 12), l: 44 };
  const textSecondary = enforceContrast(tsBase, bgRgb, 4.5);

  // ── Border — slightly above surfaceAlt in lightness ───────────────────────
  const borderHsl: HSL = {
    ...bgHsl,
    s: clamp(bgHsl.s * 1.2, 0, 20),
    l: clamp(bgHsl.l + (dark ? 14 : -11), 0, 100),
  };

  // ── Primary — brand color, display-clamped to readable lightness band ──────
  // We do NOT enforce text contrast here — primary is a CTA background color,
  // not a text color. The clamping keeps it visible against the page bg.
  const primaryHsl: HSL = { ...pHsl, l: clamp(pHsl.l, dark ? 35 : 18, dark ? 76 : 58) };
  const primaryRgb  = hslToRgb(primaryHsl);

  // ── Secondary — lighter (dark) or darker (light) variant of primary ────────
  const secondaryHsl: HSL = {
    ...primaryHsl,
    l: clamp(primaryHsl.l + (dark ? 18 : -15), 5, 95),
    s: clamp(primaryHsl.s * 0.85, 0, 100),
  };

  // ── Accent ─────────────────────────────────────────────────────────────────
  let accentHsl: HSL;
  if (inputs.accent) {
    const aHsl = rgbToHsl(hexToRgb(inputs.accent.trim()));
    accentHsl = { ...aHsl, l: clamp(aHsl.l, dark ? 35 : 18, dark ? 76 : 58) };
  } else {
    accentHsl = { ...primaryHsl };
  }

  // ── Glow — rgba(primary, low alpha) ───────────────────────────────────────
  const glowAlpha = dark ? 0.18 : 0.10;
  const glow = `rgba(${primaryRgb.r},${primaryRgb.g},${primaryRgb.b},${glowAlpha})`;

  // ── Status colors — fixed per mode (matching preset conventions) ──────────
  const success = dark ? '#5BBF8A' : '#2E7D52';
  const warning = dark ? '#E0A93B' : '#B45309';
  const danger  = dark ? '#F26D6D' : '#B91C1C';

  return {
    background:    hslToHex(bgHsl),
    surface:       hslToHex(surfaceHsl),
    surfaceAlt:    hslToHex(surfaceAltHsl),
    textPrimary:   hslToHex(textPrimary),
    textSecondary: hslToHex(textSecondary),
    border:        hslToHex(borderHsl),
    primary:       hslToHex(primaryHsl),
    secondary:     hslToHex(secondaryHsl),
    accent:        hslToHex(accentHsl),
    success,
    warning,
    danger,
    glow,
  };
}
