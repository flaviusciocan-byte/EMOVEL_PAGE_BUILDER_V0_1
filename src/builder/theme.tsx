// ThemeProvider — injects the active page theme as CSS custom properties on a wrapper div.
// useTheme — hook for components that need to read or switch the active theme.
// ThemeSwitcher — preset picker; mounted in the inspector Theme tab.

import { createContext, useContext, useState, type CSSProperties, type ReactNode } from 'react';
import { themes, DEFAULT_THEME_ID, type ThemeConfig } from './themes';
import { COLOR_KEYS, colorVar, cssVarNames, radius, space, motion } from './tokens';

interface ThemeContextValue {
  themeId: string;
  theme: ThemeConfig;
  setTheme: (id: string) => void;
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

  vars[cssVarNames.radiusSm]      = radius.sm;
  vars[cssVarNames.radiusMd]      = radius.md;
  vars[cssVarNames.radiusLg]      = radius.lg;
  vars[cssVarNames.radiusPill]    = radius.pill;
  vars[cssVarNames.spaceSectionV] = space.sectionV;
  vars[cssVarNames.spaceSectionH] = space.sectionH;
  vars[cssVarNames.spaceHeroV]    = space.heroV;
  vars[cssVarNames.spaceHeroH]    = space.heroH;
  vars[cssVarNames.motionEase]    = motion.ease;
  vars[cssVarNames.motionDuration]= motion.duration;

  return vars as CSSProperties;
}

/** CSS text block that defines all theme + system tokens as :root custom properties.
 *  Injected into Puck's canvas iframe so sections can resolve var(--color-*). */
export function buildThemeCSSText(theme: ThemeConfig): string {
  const lines: string[] = [':root {'];
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
  lines.push(`  ${cssVarNames.motionEase}: ${motion.ease};`);
  lines.push(`  ${cssVarNames.motionDuration}: ${motion.duration};`);
  lines.push('}');
  return lines.join('\n');
}

interface ThemeProviderProps {
  children: ReactNode;
  initialThemeId?: string;
}

export function ThemeProvider({ children, initialThemeId = DEFAULT_THEME_ID }: ThemeProviderProps) {
  const [themeId, setThemeId] = useState(initialThemeId);
  const theme = themes[themeId] ?? themes[DEFAULT_THEME_ID];

  function setTheme(id: string) {
    if (themes[id]) setThemeId(id);
  }

  return (
    <ThemeContext.Provider value={{ themeId, theme, setTheme }}>
      <div style={buildCSSVars(theme)}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function ThemeSwitcher() {
  const { themeId, setTheme } = useTheme();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Object.values(themes).map((t) => {
        const active = t.id === themeId;
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
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
    </div>
  );
}
