// Token types, system token values, and CSS variable name mapping.
// ThemeProvider reads these to inject vars. Sections consume vars only — never import from here directly.

export const COLOR_KEYS = [
  'background',
  'surface',
  'surfaceAlt',
  'textPrimary',
  'textSecondary',
  'border',
  'primary',
  'secondary',
  'accent',
  'success',
  'warning',
  'danger',
  'glow',
] as const;

export type ColorKey = (typeof COLOR_KEYS)[number];

export type ColorTokens = Record<ColorKey, string>;

/** Returns the CSS custom property name for a color token key. */
export function colorVar(key: ColorKey): string {
  return `--color-${key}`;
}

// System tokens — shape and motion. These are fixed across all themes.
export const radius = {
  sm: '9px',
  md: '14px',
  lg: '18px',
  pill: '999px',
} as const;

export const space = {
  sectionV: '54px',   // vertical padding for standard sections
  sectionH: '52px',   // horizontal padding for standard sections
  heroV: '64px',      // vertical padding for hero
  heroH: '52px',      // horizontal padding for hero
} as const;

export const motion = {
  ease: 'cubic-bezier(.22, 1, .36, 1)',
  duration: '180ms',
} as const;

// ─── Shell color tokens ───────────────────────────────────────────────────────
// Fixed EMOVEL editor-chrome colors. NOT theme-dependent — do not use inside
// section renders. Injected as --shell-* CSS custom properties in chrome.css.
// Gold (#D4AF37) is RESERVED for brand wordmark and the Publish action ONLY.
// Electric blue (#2F6BFF) is used for selection, active state, and interaction.
export const shellTokens = {
  // Layered backgrounds (deepest → lightest layer)
  base:    '#050505',   // app background — deepest
  s1:      '#080809',   // topbar, sidebar, inspector surfaces
  s2:      '#0a0a0b',   // input, textarea, code block backgrounds
  s3:      '#0d0d0e',   // canvas background

  // Text
  text:    '#FFFFFF',   // primary — labels, headings
  text2:   '#9a9a9e',   // secondary — descriptions, placeholders
  text3:   '#5a5a5e',   // weak — disabled, de-emphasised

  // Brand (reserved)
  gold:    '#D4AF37',   // wordmark + Publish button ONLY — nothing else

  // Interaction
  blue:    '#2F6BFF',   // selection, active tab, focus, hovered section
  blueFill:'#11203f',   // subtle blue background fill for selected states

  // Borders
  b1:      '#161618',   // hair-line separators
  b2:      '#202024',   // component card borders
  b3:      '#232327',   // slightly stronger component borders
} as const;

export type ShellTokenKey = keyof typeof shellTokens;

/** CSS custom property name for a shell token key. */
export function shellVar(key: ShellTokenKey): string {
  return `--shell-${key}`;
}

/** CSS custom property names for system tokens. Used by ThemeProvider injection. */
export const cssVarNames = {
  radiusSm: '--radius-sm',
  radiusMd: '--radius-md',
  radiusLg: '--radius-lg',
  radiusPill: '--radius-pill',
  spaceSectionV: '--space-section-v',
  spaceSectionH: '--space-section-h',
  spaceHeroV: '--space-hero-v',
  spaceHeroH: '--space-hero-h',
  motionEase: '--motion-ease',
  motionDuration: '--motion-duration',
} as const;
