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
  swatches: ['#050505', '#15151A', '#D4AF37'],
  colors: {
    background:     '#050505',
    surface:        '#0B0B0F',
    surfaceAlt:     '#15151A',
    textPrimary:    '#FFFFFF',
    textSecondary:  '#9CA3AF',
    border:         '#2A2A31',
    primary:        '#D4AF37',
    secondary:      '#F3DFA2',
    accent:         '#00A3FF',
    success:        '#5BBF8A',
    warning:        '#E0A93B',
    danger:         '#F26D6D',
    glow:           'rgba(212,175,55,.20)',
  },
};

const clean: ThemeConfig = {
  id: 'clean',
  label: 'Clean White',
  description: 'Editorial · neutral · high contrast',
  swatches: ['#FFFFFF', '#EFEEEA', '#2563EB'],
  colors: {
    background:     '#FFFFFF',
    surface:        '#F7F7F5',
    surfaceAlt:     '#EFEEEA',
    textPrimary:    '#111111',
    textSecondary:  '#6B6B6B',
    border:         '#E5E4E0',
    primary:        '#111111',
    secondary:      '#6B6B6B',
    accent:         '#2563EB',
    success:        '#2E7D5B',
    warning:        '#D97706',
    danger:         '#DC2626',
    glow:           'rgba(17,17,17,.05)',
  },
};

const shop: ThemeConfig = {
  id: 'shop',
  label: 'Premium Shop',
  description: 'Warm luxe · commerce',
  swatches: ['#FAF8F5', '#F2ECE3', '#B08D57'],
  colors: {
    background:     '#FAF8F5',
    surface:        '#FFFFFF',
    surfaceAlt:     '#F2ECE3',
    textPrimary:    '#1C1814',
    textSecondary:  '#7A7066',
    border:         '#E7DECF',
    primary:        '#1C1814',
    secondary:      '#B08D57',
    accent:         '#B08D57',
    success:        '#4E7C59',
    warning:        '#C78D2A',
    danger:         '#C0392B',
    glow:           'rgba(176,141,87,.20)',
  },
};

const creator: ThemeConfig = {
  id: 'creator',
  label: 'Creator Portfolio',
  description: 'Expressive dark · coral',
  swatches: ['#0F0F12', '#1F1F26', '#FF6B5C'],
  colors: {
    background:     '#0F0F12',
    surface:        '#17171C',
    surfaceAlt:     '#1F1F26',
    textPrimary:    '#F5F5F7',
    textSecondary:  '#9A9AA5',
    border:         '#28282F',
    primary:        '#F5F5F7',
    secondary:      '#FF6B5C',
    accent:         '#FF6B5C',
    success:        '#4ADE80',
    warning:        '#FBBF24',
    danger:         '#F87171',
    glow:           'rgba(255,107,92,.24)',
  },
};

const launch: ThemeConfig = {
  id: 'launch',
  label: 'Digital Product Launch',
  description: 'SaaS · electric blue',
  swatches: ['#0A0E1A', '#1A2236', '#5B8DEF'],
  colors: {
    background:     '#0A0E1A',
    surface:        '#121829',
    surfaceAlt:     '#1A2236',
    textPrimary:    '#F4F6FB',
    textSecondary:  '#97A0B5',
    border:         '#232C42',
    primary:        '#5B8DEF',
    secondary:      '#7C5CFF',
    accent:         '#7C5CFF',
    success:        '#34D399',
    warning:        '#FBBF24',
    danger:         '#F87171',
    glow:           'rgba(91,141,239,.28)',
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
