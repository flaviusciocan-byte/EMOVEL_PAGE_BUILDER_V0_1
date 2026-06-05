// Theme presets for EMOVEL Page Builder.
// Each theme provides all 13 color keys. App chrome is always fixed dark — this file drives the PAGE only.
// Default = EMOVEL Luxury Tech. Clients get their own theme via Custom Client slot.

import { type ColorTokens } from './tokens';

export interface ThemeConfig {
  id: string;
  label: string;
  description: string;
  isDefault?: true;
  swatches: [string, string, string]; // [background, surface, primary] — used in ThemeSwitcher
  colors: ColorTokens;
}

const emovel: ThemeConfig = {
  id: 'emovel',
  label: 'EMOVEL Luxury Tech',
  description: 'Black · Imperial Gold · luxury-tech',
  isDefault: true,
  swatches: ['#050505', '#0E0E10', '#D4AF37'],
  colors: {
    background:     '#050505',
    surface:        '#0E0E10',
    surfaceAlt:     '#16161A',
    textPrimary:    '#FFFFFF',
    textSecondary:  '#9A9A9E',
    border:         '#2A2A30',
    primary:        '#D4AF37',
    secondary:      '#2F6BFF',
    accent:         '#D4AF37',
    success:        '#5BBF8A',
    warning:        '#E0A93B',
    danger:         '#F26D6D',
    glow:           'rgba(212,175,55,.14)',
  },
};

const clean: ThemeConfig = {
  id: 'clean',
  label: 'Clean White',
  description: 'Editorial · white · high contrast',
  swatches: ['#FFFFFF', '#F5F4F0', '#0A0A0A'],
  colors: {
    background:     '#FFFFFF',
    surface:        '#F5F4F0',
    surfaceAlt:     '#ECEAE3',
    textPrimary:    '#0A0A0A',
    textSecondary:  '#6B6B66',
    border:         '#E2E0D8',
    primary:        '#0A0A0A',
    secondary:      '#2B2B2B',
    accent:         '#C2410C',
    success:        '#2E7D52',
    warning:        '#B45309',
    danger:         '#B91C1C',
    glow:           'rgba(10,10,10,.08)',
  },
};

const shop: ThemeConfig = {
  id: 'shop',
  label: 'Premium Shop',
  description: 'Warm luxe · commerce',
  swatches: ['#FAF6EF', '#F0E6D6', '#B87333'],
  colors: {
    background:     '#FAF6EF',
    surface:        '#F0E6D6',
    surfaceAlt:     '#E8DDC9',
    textPrimary:    '#2B2118',
    textSecondary:  '#8C7B66',
    border:         '#E8DDC9',
    primary:        '#B87333',
    secondary:      '#9A6A3C',
    accent:         '#B87333',
    success:        '#4F7C3A',
    warning:        '#C2830E',
    danger:         '#B0432C',
    glow:           'rgba(184,115,51,.16)',
  },
};

const creator: ThemeConfig = {
  id: 'creator',
  label: 'Creator Portfolio',
  description: 'Warm dark · coral-orange',
  swatches: ['#14100E', '#231A15', '#FF6B4A'],
  colors: {
    background:     '#14100E',
    surface:        '#231A15',
    surfaceAlt:     '#2E221B',
    textPrimary:    '#FBEFE9',
    textSecondary:  '#A08980',
    border:         '#3A2C24',
    primary:        '#FF6B4A',
    secondary:      '#FF8D72',
    accent:         '#FF6B4A',
    success:        '#5BBF8A',
    warning:        '#E0A93B',
    danger:         '#F26D6D',
    glow:           'rgba(255,107,74,.20)',
  },
};

const launch: ThemeConfig = {
  id: 'launch',
  label: 'Digital Product Launch',
  description: 'SaaS · electric blue',
  swatches: ['#0A0E1A', '#141B2E', '#5B8DEF'],
  colors: {
    background:     '#0A0E1A',
    surface:        '#141B2E',
    surfaceAlt:     '#1E2840',
    textPrimary:    '#F4F6FB',
    textSecondary:  '#8B95AD',
    border:         '#283450',
    primary:        '#5B8DEF',
    secondary:      '#87AEF5',
    accent:         '#5B8DEF',
    success:        '#4ADE80',
    warning:        '#FBBF24',
    danger:         '#F87171',
    glow:           'rgba(91,141,239,.20)',
  },
};

// Custom Client slot — placeholder palette. Replaced when onboarding a real client brand.
const custom: ThemeConfig = {
  id: 'custom',
  label: 'Custom Client Theme',
  description: 'Clients bring their own brand',
  swatches: ['#0E1311', '#1B2A23', '#34D399'],
  colors: {
    background:     '#0E1311',
    surface:        '#14201B',
    surfaceAlt:     '#1B2A23',
    textPrimary:    '#F2F5F3',
    textSecondary:  '#93A89C',
    border:         '#243A30',
    primary:        '#34D399',
    secondary:      '#A7F3D0',
    accent:         '#34D399',
    success:        '#34D399',
    warning:        '#FBBF24',
    danger:         '#F87171',
    glow:           'rgba(52,211,153,.22)',
  },
};

export const themes: Record<string, ThemeConfig> = {
  emovel,
  clean,
  shop,
  creator,
  launch,
  custom,
};

export const DEFAULT_THEME_ID = 'emovel';
