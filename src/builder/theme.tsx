// ThemeProvider — injects the active page theme as CSS custom properties on a wrapper div.
// useTheme — hook for components that need to read or switch the active theme.
// ThemeSwitcher — preset picker + live custom-brand derivation; mounted in the inspector Theme tab.

import { createContext, useContext, useState, type CSSProperties, type ReactNode } from 'react';
import { themes, DEFAULT_THEME_ID, type ThemeConfig } from './themes';
import { COLOR_KEYS, colorVar, cssVarNames, radius, space, motion, shadow, fontStack, palette, type ColorTokens } from './tokens';
import { deriveTheme, type ThemeInputs } from './derive-theme';
import { FONT_FACES_DEV } from '../shell/font-faces';
import { SURF_CSS } from './sections/SectionSurface';

interface ThemeContextValue {
  themeId: string;
  theme: ThemeConfig;
  setTheme: (id: string) => void;
  setCustomTheme: (inputs: ThemeInputs) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}

function buildCSSVars(theme: ThemeConfig): CSSProperties {
  const vars: Record<string, string> = {};

  for (const key of COLOR_KEYS) {
    vars[colorVar(key)] = theme.colors[key];
  }

  vars[cssVarNames.radiusSm]           = radius.sm;
  vars[cssVarNames.radiusMd]           = radius.md;
  vars[cssVarNames.radiusLg]           = radius.lg;
  vars[cssVarNames.radiusPill]         = radius.pill;
  vars[cssVarNames.spaceSectionV]      = space.sectionV;
  vars[cssVarNames.spaceSectionH]      = space.sectionH;
  vars[cssVarNames.spaceHeroV]         = space.heroV;
  vars[cssVarNames.spaceHeroH]         = space.heroH;
  vars[cssVarNames.spaceXs]            = space.xs;
  vars[cssVarNames.spaceSm]            = space.sm;
  vars[cssVarNames.motionEase]         = motion.ease;
  vars[cssVarNames.motionDuration]     = motion.duration;
  vars[cssVarNames.shadowCard]         = shadow.card;
  vars[cssVarNames.shadowCardHover]    = shadow.cardHover;
  vars[cssVarNames.shadowPrimaryGlow]  = shadow.primaryGlow;
  vars[cssVarNames.fontMono]           = fontStack.mono;
  vars[cssVarNames.colorOnPrimary]     = palette.onPrimary;

  return vars as CSSProperties;
}

/** CSS text block injected into Puck's canvas iframe.
 *  Includes self-hosted @font-face declarations + all theme/system tokens as :root vars. */
export function buildThemeCSSText(theme: ThemeConfig): string {
  const lines: string[] = [FONT_FACES_DEV, ':root {'];
  for (const key of COLOR_KEYS) {
    lines.push(`  ${colorVar(key)}: ${theme.colors[key]};`);
  }
  lines.push(`  ${cssVarNames.radiusSm}: ${radius.sm};`);
  lines.push(`  ${cssVarNames.radiusMd}: ${radius.md};`);
  lines.push(`  ${cssVarNames.radiusLg}: ${radius.lg};`);
  lines.push(`  ${cssVarNames.radiusPill}: ${radius.pill};`);
  lines.push(`  ${cssVarNames.spaceSectionV}: ${space.sectionV};`);
  lines.push(`  ${cssVarNames.spaceSectionH}: ${space.sectionH};`);
  lines.push(`  ${cssVarNames.spaceHeroV}: ${space.heroV};`);
  lines.push(`  ${cssVarNames.spaceHeroH}: ${space.heroH};`);
  lines.push(`  ${cssVarNames.spaceXs}: ${space.xs};`);
  lines.push(`  ${cssVarNames.spaceSm}: ${space.sm};`);
  lines.push(`  ${cssVarNames.motionEase}: ${motion.ease};`);
  lines.push(`  ${cssVarNames.motionDuration}: ${motion.duration};`);
  lines.push(`  ${cssVarNames.shadowCard}: ${shadow.card};`);
  lines.push(`  ${cssVarNames.shadowCardHover}: ${shadow.cardHover};`);
  lines.push(`  ${cssVarNames.shadowPrimaryGlow}: ${shadow.primaryGlow};`);
  lines.push(`  ${cssVarNames.fontMono}: ${fontStack.mono};`);
  lines.push(`  ${cssVarNames.colorOnPrimary}: ${palette.onPrimary};`);
  lines.push('}');
  lines.push('', SURF_CSS);
  return lines.join('\n');
}

interface ThemeProviderProps {
  children: ReactNode;
  initialThemeId?: string;
}

export function ThemeProvider({ children, initialThemeId = DEFAULT_THEME_ID }: ThemeProviderProps) {
  const [themeId, setThemeId] = useState(initialThemeId);
  const [customColors, setCustomColors] = useState<ColorTokens | null>(null);

  const baseTheme = themes[themeId] ?? themes[DEFAULT_THEME_ID];

  // When custom is active and derived colors exist, overlay them onto the base config.
  // All non-custom themes are served from themes.ts unchanged.
  const theme: ThemeConfig =
    themeId === 'custom' && customColors !== null
      ? {
          ...baseTheme,
          colors: customColors,
          swatches: [
            customColors.background,
            customColors.surface,
            customColors.primary,
          ] as [string, string, string],
        }
      : baseTheme;

  function setTheme(id: string) {
    if (themes[id]) setThemeId(id);
  }

  function setCustomTheme(inputs: ThemeInputs) {
    setCustomColors(deriveTheme(inputs));
    setThemeId('custom');
  }

  return (
    <ThemeContext.Provider value={{ themeId, theme, setTheme, setCustomTheme }}>
      <div style={buildCSSVars(theme)}>{children}</div>
    </ThemeContext.Provider>
  );
}

// ─── ThemeSwitcher ────────────────────────────────────────────────────────────

const S_custom = {
  panel: {
    marginTop: 2,
    padding: '12px 11px',
    borderRadius: 9,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 10,
  },
  label: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: 'var(--color-textSecondary)',
    marginBottom: 4,
    margin: 0,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  colorWell: {
    width: 28,
    height: 28,
    borderRadius: 6,
    border: '1px solid var(--color-border)',
    cursor: 'pointer',
    padding: 0,
    flexShrink: 0 as const,
  },
  modeBtn: (active: boolean): CSSProperties => ({
    flex: 1,
    padding: '5px 0',
    borderRadius: 6,
    border: active ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
    background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
    color: active ? 'var(--color-textPrimary)' : 'var(--color-textSecondary)',
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'border-color 120ms ease, color 120ms ease',
  }),
  checkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    fontSize: 11,
    color: 'var(--color-textSecondary)',
    cursor: 'pointer',
  } as CSSProperties,
};

export function ThemeSwitcher() {
  const { themeId, setTheme, setCustomTheme } = useTheme();

  // Local state for the custom brand inputs — persists while user tweaks colors
  const [primaryColor, setPrimaryColor] = useState('#D4AF37');
  const [accentColor, setAccentColor]   = useState('#5CC8FF');
  const [hasAccent, setHasAccent]       = useState(false);
  const [surfaceMode, setSurfaceMode]   = useState<'light' | 'dark'>('dark');

  function activateCustom() {
    setCustomTheme({
      primary: primaryColor,
      mode: surfaceMode,
      ...(hasAccent ? { accent: accentColor } : {}),
    });
  }

  function handlePrimaryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setPrimaryColor(val);
    if (themeId === 'custom') {
      setCustomTheme({ primary: val, mode: surfaceMode, ...(hasAccent ? { accent: accentColor } : {}) });
    }
  }

  function handleAccentChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setAccentColor(val);
    if (themeId === 'custom' && hasAccent) {
      setCustomTheme({ primary: primaryColor, mode: surfaceMode, accent: val });
    }
  }

  function handleModeChange(m: 'light' | 'dark') {
    setSurfaceMode(m);
    if (themeId === 'custom') {
      setCustomTheme({ primary: primaryColor, mode: m, ...(hasAccent ? { accent: accentColor } : {}) });
    }
  }

  function handleAccentToggle(e: React.ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked;
    setHasAccent(checked);
    if (themeId === 'custom') {
      setCustomTheme({ primary: primaryColor, mode: surfaceMode, ...(checked ? { accent: accentColor } : {}) });
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Object.values(themes).map((t) => {
        const active = t.id === themeId;
        return (
          <button
            key={t.id}
            onClick={() => t.id === 'custom' ? activateCustom() : setTheme(t.id)}
            aria-pressed={active}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 11px',
              border: active
                ? '1px solid var(--color-accent)'
                : '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              background: 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: `border-color var(--motion-duration) var(--motion-ease)`,
            }}
          >
            <span
              style={{
                display: 'flex',
                width: 42,
                height: 30,
                borderRadius: 7,
                overflow: 'hidden',
                flexShrink: 0,
                border: '1px solid rgba(255,255,255,.10)',
              }}
            >
              {t.swatches.map((c, i) => (
                <span key={i} style={{ flex: 1, background: c }} />
              ))}
            </span>

            <span style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--color-textPrimary)',
                }}
              >
                {t.label}
                {t.isDefault && (
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '.06em',
                      textTransform: 'uppercase',
                      border: '1px solid var(--color-primary)',
                      borderRadius: 4,
                      padding: '1px 5px',
                      color: 'var(--color-primary)',
                    }}
                  >
                    Default
                  </span>
                )}
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: 10.5,
                  color: 'var(--color-textSecondary)',
                  marginTop: 2,
                }}
              >
                {t.description}
              </span>
            </span>

            {active && (
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth={2.2}
                style={{ flexShrink: 0 }}
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </button>
        );
      })}

      {/* ── Custom brand inputs — visible only when Custom theme is active ── */}
      {themeId === 'custom' && (
        <div style={S_custom.panel}>

          <div>
            <p style={S_custom.label}>Brand color</p>
            <div style={{ ...S_custom.row, marginTop: 6 }}>
              <input
                type="color"
                value={primaryColor}
                onChange={handlePrimaryChange}
                style={S_custom.colorWell}
                title="Primary brand color"
                aria-label="Primary brand color"
              />
              <span style={{ fontSize: 11, color: 'var(--color-textSecondary)', fontFamily: 'monospace' }}>
                {primaryColor.toUpperCase()}
              </span>
            </div>
          </div>

          <div>
            <p style={S_custom.label}>Surface mode</p>
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              {(['dark', 'light'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => handleModeChange(m)}
                  style={S_custom.modeBtn(m === surfaceMode)}
                  aria-pressed={m === surfaceMode}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={S_custom.checkRow}>
              <input
                type="checkbox"
                checked={hasAccent}
                onChange={handleAccentToggle}
                style={{ accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              />
              Custom accent color
            </label>
            {hasAccent && (
              <div style={{ ...S_custom.row, marginTop: 8 }}>
                <input
                  type="color"
                  value={accentColor}
                  onChange={handleAccentChange}
                  style={S_custom.colorWell}
                  title="Accent color"
                  aria-label="Accent color"
                />
                <span style={{ fontSize: 11, color: 'var(--color-textSecondary)', fontFamily: 'monospace' }}>
                  {accentColor.toUpperCase()}
                </span>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
