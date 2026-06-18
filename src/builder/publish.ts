// publish.ts — Static site export for EMOVEL Page Builder.
// Renders the current page to HTML using Puck's Render component +
// renderToStaticMarkup, inlines theme-derived CSS + motion animation CSS,
// and injects a vanilla IntersectionObserver script that triggers entrances
// on scroll (matching useInView behaviour in the React preview).
//
// Called from App.tsx's onPublish callback via AppInner (which has access
// to the active ThemeConfig through useTheme()).

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Render } from '@puckeditor/core';
import type { Data } from '@puckeditor/core';
import JSZip from 'jszip';

import { config } from './puck.config';
import type { ThemeConfig } from './themes';
import { collectLocalAssetRefs } from './export-validator';
import {
  COLOR_KEYS,
  colorVar,
  cssVarNames,
  radius,
  space,
  motion,
  shadow,
  fontStack,
  palette,
} from './tokens';
import {
  PATTERNS,
  WINGS,
  EASE_CSS,
  MOTION_TOKEN_CSS_VARS,
  MOTION_REDUCED_CSS_VARS,
} from '../motion/patterns';
import { FONT_FACES_EXPORT, FONT_EXPORT_ASSETS } from '../shell/font-faces';
import { SURF_CSS } from './sections/SectionSurface';
import type { KeyframeState, KeyframesDescriptor } from '../motion/patterns';
import type { ComposerBrief } from '../composer/page-schema';

// Canonical asset location: public/assets/...
// Page data references them as "assets/..." (root-relative, resolved by Vite / the exported HTML).
const BRAND_EXPORT_ASSETS: ReadonlyArray<{ sourcePath: string; zipPath: string }> = [
  { sourcePath: 'assets/app-icon-1024.png',          zipPath: 'app-icon/app-icon-1024.png'                              },
  { sourcePath: 'assets/avatar-on-dark-1024.png',    zipPath: 'social-avatar/avatar-on-dark-1024.png'                  },
  { sourcePath: 'assets/favicon/favicon.ico',        zipPath: 'favicon/favicon.ico'                                    },
  { sourcePath: 'assets/favicon-gold-256.png',       zipPath: 'favicon/favicon-gold-256.png'                           },
  { sourcePath: 'assets/favicon.ico',                zipPath: 'favicon/favicon.ico'                                    },
  { sourcePath: 'assets/og-image-3d.png',            zipPath: 'og-image/og-image-3d.png'                               },
  { sourcePath: 'assets/source-transparent/emovel-logo-3d-gold.png',      zipPath: 'assets/source-transparent/emovel-logo-3d-gold.png'      },
  { sourcePath: 'assets/source-transparent/emovel-logo-gold-on-dark.png', zipPath: 'assets/source-transparent/emovel-logo-gold-on-dark.png' },
  ...FONT_EXPORT_ASSETS,
];

// Rewrite table: builder-time paths → export-time paths.
// Only legacy "emovel-brand/" paths need rewriting; canonical "assets/" paths pass through as-is.
const EXPORT_ASSET_PATHS: ReadonlyArray<readonly [string, string]> = [
  ['emovel-brand/source-transparent/emovel-logo-gold-on-dark.png', 'assets/source-transparent/emovel-logo-gold-on-dark.png'],
  ['emovel-brand/source-transparent/emovel-logo-3d-gold.png',      'assets/source-transparent/emovel-logo-3d-gold.png'     ],
  ['emovel-brand/emovel-logo-gold-on-dark.png',                    'assets/source-transparent/emovel-logo-gold-on-dark.png'],
  ['emovel-brand/emovel-logo-3d-gold.png',                         'assets/source-transparent/emovel-logo-3d-gold.png'     ],
  ['/emovel-brand/favicon/favicon.ico',                            'favicon/favicon.ico'                                  ],
  ['emovel-brand/favicon/favicon.ico',                             'favicon/favicon.ico'                                  ],
  ['/emovel-brand/og-image-3d.png',                                'og-image/og-image-3d.png'                             ],
  ['emovel-brand/og-image-3d.png',                                 'og-image/og-image-3d.png'                             ],
];

// ─── CSS helpers ──────────────────────────────────────────────────────────────

function keyframeStateToTransform(s: KeyframeState): string {
  const t: string[] = [];
  if (s.scale     !== undefined) t.push(`scale(${s.scale})`);
  if (s.rotateX   !== undefined) t.push(`rotateX(${s.rotateX}deg)`);
  if (s.translateX !== undefined) t.push(`translateX(${s.translateX}px)`);
  if (s.translateY !== undefined) t.push(`translateY(${s.translateY}px)`);
  if (s.translateZ !== undefined) t.push(`translateZ(${s.translateZ}px)`);
  return t.length > 0 ? t.join(' ') : 'none';
}

function keyframesToAtRule(name: string, desc: KeyframesDescriptor): string {
  return [
    `@keyframes ${name} {`,
    `  from { opacity: ${desc.from.opacity ?? 0}; transform: ${keyframeStateToTransform(desc.from)}; }`,
    `  to   { opacity: ${desc.to.opacity ?? 1}; transform: ${keyframeStateToTransform(desc.to)}; }`,
    '}',
  ].join('\n');
}

// ─── Motion CSS block ─────────────────────────────────────────────────────────

function buildMotionCSS(): string {
  const lines: string[] = ['/* ── Hero motion entrance ───────────────────────────────────────── */'];

  // @keyframes for the 3 non-staggered patterns
  for (const [pattern, def] of Object.entries(PATTERNS)) {
    if (def.keyframes) {
      lines.push(keyframesToAtRule(`emovel-${pattern}`, def.keyframes));
    }
  }
  // @keyframes for the staggered-rise child
  const staggerDef = PATTERNS['staggered-rise'];
  if (staggerDef.staggeredChild) {
    lines.push(keyframesToAtRule('emovel-staggered-rise', staggerDef.staggeredChild.keyframes));
  }

  // Panel-level triggers for non-staggered patterns
  for (const [pattern, def] of Object.entries(PATTERNS)) {
    if (!def.framer.isStaggered && def.keyframes) {
      const kf = def.keyframes;
      lines.push(
        `[data-emovel-motion="${pattern}"] .emovel-hero__panel {`,
        `  animation: emovel-${pattern} ${kf.duration}s ${kf.easing} both paused;`,
        `}`,
        `.is-inview[data-emovel-motion="${pattern}"] .emovel-hero__panel {`,
        `  animation-play-state: running;`,
        `}`,
      );
    }
  }

  // Staggered-rise: per-child triggers
  if (staggerDef.staggeredChild) {
    const { keyframes: kf, itemDelays } = staggerDef.staggeredChild;
    const childSelectors = [
      '.emovel-hero__eyebrow',
      '.emovel-hero__title',
      '.emovel-hero__subtitle',
      '.emovel-hero__actions',
    ];
    lines.push(
      childSelectors.map(s => `[data-emovel-motion="staggered-rise"] ${s}`).join(',\n') + ' {',
      `  animation: emovel-staggered-rise ${kf.duration}s ${kf.easing} both paused;`,
      `}`,
    );
    for (let i = 0; i < childSelectors.length; i++) {
      const delay = itemDelays[i] ?? 0;
      lines.push(
        `.is-inview[data-emovel-motion="staggered-rise"] ${childSelectors[i]} {`,
        `  animation-play-state: running;`,
        `  animation-delay: ${delay}s;`,
        `}`,
      );
    }
  }

  // Wings @keyframes
  lines.push(
    `@keyframes emovel-wings-rise {`,
    `  from { opacity: 0; transform: translateY(${WINGS.css.containerInitY}px); }`,
    `  to   { opacity: 1; transform: translateY(0); }`,
    `}`,
    `@keyframes emovel-wings-left {`,
    `  from { opacity: 0; transform: translateX(-${WINGS.css.pathInitX}px); }`,
    `  to   { opacity: 1; transform: translateX(0); }`,
    `}`,
    `@keyframes emovel-wings-right {`,
    `  from { opacity: 0; transform: translateX(${WINGS.css.pathInitX}px); }`,
    `  to   { opacity: 1; transform: translateX(0); }`,
    `}`,
  );

  // Wings: paused initial state
  lines.push(
    `.emovel-hero__logo {`,
    `  animation: emovel-wings-rise ${WINGS.css.containerDuration}s ${EASE_CSS} both paused;`,
    `}`,
    `.emovel-hero__logo .wing-left path {`,
    `  animation: emovel-wings-left ${WINGS.css.pathDuration}s ${EASE_CSS} both paused;`,
    `}`,
    `.emovel-hero__logo .wing-right path {`,
    `  animation: emovel-wings-right ${WINGS.css.pathDuration}s ${EASE_CSS} both paused;`,
    `}`,
  );

  // Wings: play on .is-inview (on the parent section, which has data-emovel-motion)
  const wL = WINGS.css.leftStaggerStart;
  const wR = WINGS.css.rightStaggerStart;
  const wS = WINGS.css.staggerStep;
  lines.push(
    `.is-inview[data-emovel-motion] .emovel-hero__logo { animation-play-state: running; }`,
    `.is-inview[data-emovel-motion] .emovel-hero__logo .wing-left path:nth-child(1) { animation-play-state:running; animation-delay:${wL}s; }`,
    `.is-inview[data-emovel-motion] .emovel-hero__logo .wing-left path:nth-child(2) { animation-play-state:running; animation-delay:${(wL + wS).toFixed(3)}s; }`,
    `.is-inview[data-emovel-motion] .emovel-hero__logo .wing-left path:nth-child(3) { animation-play-state:running; animation-delay:${(wL + wS * 2).toFixed(3)}s; }`,
    `.is-inview[data-emovel-motion] .emovel-hero__logo .wing-right path:nth-child(1) { animation-play-state:running; animation-delay:${wR}s; }`,
    `.is-inview[data-emovel-motion] .emovel-hero__logo .wing-right path:nth-child(2) { animation-play-state:running; animation-delay:${(wR + wS).toFixed(3)}s; }`,
    `.is-inview[data-emovel-motion] .emovel-hero__logo .wing-right path:nth-child(3) { animation-play-state:running; animation-delay:${(wR + wS * 2).toFixed(3)}s; }`,
  );

  // prefers-reduced-motion: disable all Hero motion, force final state
  lines.push(
    `@media (prefers-reduced-motion: reduce) {`,
    `  [data-emovel-motion] .emovel-hero__panel,`,
    `  [data-emovel-motion] .emovel-hero__eyebrow,`,
    `  [data-emovel-motion] .emovel-hero__title,`,
    `  [data-emovel-motion] .emovel-hero__subtitle,`,
    `  [data-emovel-motion] .emovel-hero__actions,`,
    `  .emovel-hero__logo,`,
    `  .emovel-hero__logo .wing-left path,`,
    `  .emovel-hero__logo .wing-right path {`,
    `    animation: none;`,
    `    opacity: 1;`,
    `    transform: none;`,
    `  }`,
    `}`,
  );

  return lines.join('\n');
}

// ─── IntersectionObserver micro-script ───────────────────────────────────────
// ~20 lines of vanilla JS, zero dependencies.
// Replicates useInView({ once: true, amount: 0.1 }) from the React preview.
// Guard: if prefers-reduced-motion, all targets receive .is-inview immediately
// so CSS renders them at their final visible state with animation:none.

function buildIOScript(): string {
  return `(function(){` +
    `if(matchMedia('(prefers-reduced-motion:reduce)').matches){` +
      `document.querySelectorAll('[data-emovel-motion]').forEach(function(el){` +
        `el.classList.add('is-inview');` +
      `});` +
      `return;` +
    `}` +
    `var io=new IntersectionObserver(function(entries){` +
      `entries.forEach(function(entry){` +
        `if(entry.isIntersecting){` +
          `entry.target.classList.add('is-inview');` +
          `io.unobserve(entry.target);` +
        `}` +
      `});` +
    `},{threshold:0.1});` +
    `document.querySelectorAll('[data-emovel-motion]').forEach(function(el){` +
      `io.observe(el);` +
    `});` +
  `})();`;
}

// ─── CSS generation ───────────────────────────────────────────────────────────

/** Full page CSS for the exported page: font imports + token vars + base reset + motion. */
export function buildStyleCSS(theme: ThemeConfig): string {
  // Color tokens
  const colorVars = COLOR_KEYS.map(
    (key) => `  ${colorVar(key)}: ${theme.colors[key]};`,
  );

  // System tokens (radius, space, base motion, shadow, font)
  const systemVars = [
    `  ${cssVarNames.radiusSm}:          ${radius.sm};`,
    `  ${cssVarNames.radiusMd}:          ${radius.md};`,
    `  ${cssVarNames.radiusLg}:          ${radius.lg};`,
    `  ${cssVarNames.radiusPill}:        ${radius.pill};`,
    `  ${cssVarNames.spaceSectionV}:     ${space.sectionV};`,
    `  ${cssVarNames.spaceSectionH}:     ${space.sectionH};`,
    `  ${cssVarNames.spaceHeroV}:        ${space.heroV};`,
    `  ${cssVarNames.spaceHeroH}:        ${space.heroH};`,
    `  ${cssVarNames.spaceXs}:           ${space.xs};`,
    `  ${cssVarNames.spaceSm}:           ${space.sm};`,
    `  ${cssVarNames.motionEase}:        ${motion.ease};`,
    `  ${cssVarNames.motionDuration}:    ${motion.duration};`,
    `  ${cssVarNames.shadowCard}:        ${shadow.card};`,
    `  ${cssVarNames.shadowCardHover}:   ${shadow.cardHover};`,
    `  ${cssVarNames.shadowPrimaryGlow}: ${shadow.primaryGlow};`,
    `  ${cssVarNames.fontMono}:          ${fontStack.mono};`,
    `  ${cssVarNames.colorOnPrimary}:    ${palette.onPrimary};`,
  ];

  // Extended motion tokens (T5 — full set from tokens.motion.css)
  const motionExtVars = MOTION_TOKEN_CSS_VARS.map(
    ([name, value]) => `  ${name}: ${value};`,
  );

  // Reduced-motion token overrides
  const motionReducedVars = MOTION_REDUCED_CSS_VARS.map(
    ([name, value]) => `    ${name}: ${value};`,
  );

  return [
    '/* Generated by EMOVEL Page Builder */',
    `/* Theme: ${theme.label} */`,
    '',
    '/* Fonts — self-hosted, zero external requests */',
    FONT_FACES_EXPORT,
    '',
    '/* Design tokens */',
    ':root {',
    ...colorVars,
    ...systemVars,
    ...motionExtVars,
    '}',
    '',
    '@media (prefers-reduced-motion: reduce) {',
    '  :root {',
    ...motionReducedVars,
    '  }',
    '}',
    '',
    '/* Base reset */',
    '*, *::before, *::after { box-sizing: border-box; }',
    'html {',
    '  font-family: "Satoshi", system-ui, sans-serif;',
    '  -webkit-font-smoothing: antialiased;',
    '  text-rendering: geometricPrecision;',
    '}',
    'body {',
    '  margin: 0;',
    '  background: var(--color-background);',
    '  color: var(--color-textPrimary);',
    '}',
    'img, svg, video { display: block; max-width: 100%; }',
    'a { color: inherit; }',
    '',
    buildMotionCSS(),
    '',
    '/* Surface + width shared classes */',
    SURF_CSS,
  ].join('\n');
}

// ─── HTML generation ──────────────────────────────────────────────────────────

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'page';
}

// ── Composer Brief export section ─────────────────────────────────────────────
// Rendered into the static HTML only — not visible in the live Builder UI.
// Inserted immediately after the first Hero section (emovel-hero class).

const BRIEF_CSS = `
.emovel-brief{background:var(--color-surface);border-top:1px solid var(--color-border);border-bottom:1px solid var(--color-border);}
.emovel-brief__inner{width:min(100%,72rem);margin:0 auto;padding:clamp(2rem,4vw,3rem) clamp(1.25rem,4vw,3.25rem);}
.emovel-brief__eyebrow{margin:0 0 1.5rem;font-size:.7rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--color-primary);}
.emovel-brief__grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(16rem,1fr));gap:.75rem 2rem;margin:0;padding:0;}
.emovel-brief__row{display:flex;flex-direction:column;gap:.2rem;padding:.65rem 0;border-bottom:1px solid var(--color-border);}
.emovel-brief__term{font-size:.68rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--color-textSecondary);}
.emovel-brief__value{margin:0;font-size:.875rem;line-height:1.4;color:var(--color-textPrimary);}
.emovel-brief__value--missing{color:var(--color-textSecondary);font-style:italic;}
`.trim();

const BRIEF_FIELDS: ReadonlyArray<[keyof ComposerBrief, string]> = [
  ['projectName',          'Product / Project'],
  ['audience',             'Audience'],
  ['coreOffer',            'Core Offer'],
  ['primaryAction',        'Primary Action'],
  ['pageType',             'Page Type'],
  ['activationDepth',      'Activation Depth'],
  ['progressMomentum',     'Progress Momentum'],
  ['emotionalSignalIndex', 'Emotional Signal Index'],
];

/** Pure renderer — no React, no DOM.  Exported for unit-testing. */
export function renderComposerBriefHTML(brief: ComposerBrief | undefined): string {
  if (!brief) return '';
  const rows = BRIEF_FIELDS.map(([key, label]) => {
    const raw = brief[key];
    const val = raw !== undefined
      ? `<dd class="emovel-brief__value">${escapeHTML(String(raw))}</dd>`
      : `<dd class="emovel-brief__value emovel-brief__value--missing">Not detected</dd>`;
    return `<div class="emovel-brief__row"><dt class="emovel-brief__term">${escapeHTML(label)}</dt>${val}</div>`;
  }).join('');
  return (
    `<section class="emovel-brief" aria-label="Composer Brief">` +
    `<style>${BRIEF_CSS}</style>` +
    `<div class="emovel-brief__inner">` +
    `<p class="emovel-brief__eyebrow">Composer Brief</p>` +
    `<dl class="emovel-brief__grid">${rows}</dl>` +
    `</div></section>`
  );
}

function normalizeExportAssetPaths(html: string): string {
  return EXPORT_ASSET_PATHS.reduce(
    (nextHTML, [builderPath, exportPath]) => nextHTML.split(builderPath).join(exportPath),
    html,
  );
}

/** Render page sections to HTML via Puck's Render component. */
function renderBody(data: Data): string {
  return renderToStaticMarkup(
    createElement(Render, { config, data }),
  );
}

/** Full index.html document with inline styles and IO micro-script. */
function buildIndexHTML(
  bodyHTML:  string,
  title:     string,
  styleCSS:  string,
  ioScript:  string,
): string {
  const safeTitle = escapeHTML(title);
  const exportBodyHTML = normalizeExportAssetPaths(bodyHTML);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}</title>
  <link rel="icon" href="favicon/favicon.ico">
  <meta property="og:image" content="og-image/og-image-3d.png">
  <style>
${styleCSS}
  </style>
</head>
<body>
${exportBodyHTML}
<script>${ioScript}</script>
</body>
</html>`;
}

// ─── Named export for headless/test usage ────────────────────────────────────

/** Returns the full index.html string without triggering a download.
 *  Used by the verify-export harness; no browser APIs required. */
export function buildPageHTML(data: Data, theme: ThemeConfig): string {
  const title =
    typeof (data.root as { props?: { title?: string } })?.props?.title === 'string'
      ? ((data.root as { props: { title: string } }).props.title || 'page')
      : 'page';
  return buildIndexHTML(renderBody(data), title, buildStyleCSS(theme), buildIOScript());
}

// ─── ZIP download ─────────────────────────────────────────────────────────────

async function addBrandAssetsToZip(zip: JSZip): Promise<void> {
  await Promise.all(
    BRAND_EXPORT_ASSETS.map(async ({ sourcePath, zipPath }) => {
      const res = await fetch(`/${sourcePath}`);
      if (!res.ok) return;
      zip.file(zipPath, await res.blob());
    }),
  );
}

/** Render the page to a .zip containing a self-contained index.html and trigger download. */
export async function publishToZip(
  data:  Data,
  theme: ThemeConfig,
): Promise<void> {
  // ── Asset validation — block export if any local asset ref is missing ────────
  const assetRefs = collectLocalAssetRefs(data);
  if (assetRefs.length > 0) {
    const checks = await Promise.all(
      assetRefs.map(async (ref): Promise<string | null> => {
        try {
          const r = await fetch(`/${ref}`);
          return r.ok ? null : ref;
        } catch {
          return ref;
        }
      }),
    );
    const missing = checks.filter((r): r is string => r !== null);
    if (missing.length > 0) {
      throw new Error(
        `EMOVEL export blocked — MISSING ASSET\n` +
        missing.map(p => `  MISSING ASSET: ${p}`).join('\n'),
      );
    }
  }

  const title =
    typeof (data.root as { props?: { title?: string } })?.props?.title === 'string'
      ? ((data.root as { props: { title: string } }).props.title || 'page')
      : 'page';

  const bodyHTML  = renderBody(data);
  const styleCSS  = buildStyleCSS(theme);
  const ioScript  = buildIOScript();
  const indexHTML = buildIndexHTML(bodyHTML, title, styleCSS, ioScript);

  const zip = new JSZip();
  zip.file('index.html', indexHTML);
  await addBrandAssetsToZip(zip);

  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });

  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href     = url;
  a.download = `${slugify(title)}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
