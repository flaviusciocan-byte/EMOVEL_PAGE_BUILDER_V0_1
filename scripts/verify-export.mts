/**
 * scripts/verify-export.mts
 *
 * Real headless export verification for EMOVEL Page Builder v0.3.
 * Runner: node --experimental-strip-types scripts/verify-export.mts
 *
 * Strategy:
 *  1. Bundle src/builder/publish.ts via esbuild (CJS — avoids ESM/CJS issues
 *     from @puckeditor/core's Radix/react-remove-scroll dep chain).
 *  2. Bundle the composer pipeline (src/composer/composer.ts +
 *     page-schema-to-puck.ts) separately — pure TS, no React runtime.
 *  3. Load both bundles with createRequire.
 *  4. Call buildPageHTML() with:
 *       • hero-depth-push   — motionPattern: 'depth-push'
 *       • hero-staggered    — motionPattern: 'staggered-rise'
 *       • clinicflow-launch — full composer pipeline: prompt → schema → puck → HTML
 *  5. Write all three to scripts/_out/*.html.
 *  6. Read files back and assert on real content.
 *  Exit code 1 if any assertion fails.
 */

import { build } from 'esbuild';
import { createRequire }          from 'module';
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath }          from 'url';
import { dirname, join }          from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const ROOT       = join(__dirname, '..');
const OUT_DIR    = join(__dirname, '_out');

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

// ── 1. Bundle publish.ts ──────────────────────────────────────────────────────
// CJS format: avoids the "Dynamic require of stream/react" ESM-bundling issue
// that Puck's Radix UI dependency chain causes when bundled to ESM.

const BUNDLE = join(OUT_DIR, '_publish.cjs');

console.log('[harness] bundling publish.ts with esbuild (CJS)…');
await build({
  entryPoints: [join(ROOT, 'src', 'builder', 'publish.ts')],
  bundle:      true,
  platform:    'node',
  format:      'cjs',
  loader:      { '.tsx': 'tsx', '.ts': 'ts', '.css': 'empty' },
  jsx:         'automatic',
  jsxImportSource: 'react',
  outfile:     BUNDLE,
  define:      { 'process.env.NODE_ENV': '"production"' },
  logLevel:    'error',
});
console.log('[harness] bundle ready');

// ── 1b. Bundle composer pipeline ─────────────────────────────────────────────
// Pure TypeScript — no React/Puck runtime. Bundles composer.ts +
// page-schema-to-puck.ts via a stdin entry that re-exports both.

const COMPOSE_BUNDLE = join(OUT_DIR, '_compose.cjs');

console.log('[harness] bundling composer pipeline…');
await build({
  stdin: {
    contents: [
      `export { buildRegistryPageSchema } from './src/composer/composer';`,
      `export { pageSchemaToPuckData }    from './src/composer/page-schema-to-puck';`,
    ].join('\n'),
    loader:     'ts',
    resolveDir: ROOT,
  },
  bundle:   true,
  platform: 'node',
  format:   'cjs',
  loader:   { '.ts': 'ts', '.json': 'json' },
  outfile:  COMPOSE_BUNDLE,
  define:   { 'process.env.NODE_ENV': '"production"' },
  logLevel: 'error',
});
console.log('[harness] composer bundle ready');

// ── 2. Load bundles ───────────────────────────────────────────────────────────

const req = createRequire(import.meta.url);
const pub = req(BUNDLE) as {
  buildPageHTML: (data: unknown, theme: unknown) => string;
  buildStyleCSS: (theme: unknown) => string;
};

if (typeof pub.buildPageHTML !== 'function') {
  console.error('[harness] FATAL: buildPageHTML not exported from bundle');
  process.exit(1);
}

const compose = req(COMPOSE_BUNDLE) as {
  buildRegistryPageSchema: (prompt: string, manifest: unknown) => unknown;
  pageSchemaToPuckData:    (schema: unknown) => unknown;
};

const REGISTRY_MANIFEST = JSON.parse(readFileSync(join(ROOT, 'registry.manifest.json'), 'utf8'));

// ── 3. Test fixtures ──────────────────────────────────────────────────────────

const EMOVEL_THEME = {
  id: 'emovel', label: 'EMOVEL Luxury Tech', description: '',
  swatches: ['#050505', '#0E0E10', '#D4AF37'],
  isDefault: true,
  colors: {
    background:    '#050505', surface:       '#0E0E10', surfaceAlt:    '#16161A',
    textPrimary:   '#FFFFFF', textSecondary: '#9A9A9E', border:        '#2A2A30',
    primary:       '#D4AF37', secondary:     '#2F6BFF', accent:        '#D4AF37',
    success:       '#5BBF8A', warning:       '#E0A93B', danger:        '#F26D6D',
    glow:          'rgba(212,175,55,.14)',
  },
};

function makeData(motionPattern: string, title: string) {
  return {
    content: [{
      type: 'Hero',
      id:   `test-hero-${motionPattern}`,
      props: {
        eyebrow:             'Verify',
        title,
        subtitle:            'Real export verification.',
        primaryCtaLabel:     'Start',
        primaryCtaHref:      '#start',
        secondaryCtaLabel:   'Learn',
        secondaryCtaHref:    '#learn',
        motionPattern,
        enableCinematicLogo: 'true',
      },
    }],
    root: { props: { title } },
  };
}

const DATA_DEPTH    = makeData('depth-push',      'Depth Push Test');
const DATA_STAGGER  = makeData('staggered-rise',  'Staggered Rise Test');

const CLINICFLOW_PROMPT =
  'launch page for ClinicFlow — helps clinic managers automate intake, ' +
  'organize appointments, and reduce front-desk admin work';

// ── 4. Generate + write ───────────────────────────────────────────────────────

console.log('[harness] generating depth-push export…');
const HTML_DEPTH   = pub.buildPageHTML(DATA_DEPTH,   EMOVEL_THEME);
const PATH_DEPTH   = join(OUT_DIR, 'hero-depth-push.html');
writeFileSync(PATH_DEPTH, HTML_DEPTH, 'utf8');
console.log(`[harness] written: ${PATH_DEPTH} (${HTML_DEPTH.length} chars)`);

console.log('[harness] generating staggered-rise export…');
const HTML_STAGGER = pub.buildPageHTML(DATA_STAGGER, EMOVEL_THEME);
const PATH_STAGGER = join(OUT_DIR, 'hero-staggered.html');
writeFileSync(PATH_STAGGER, HTML_STAGGER, 'utf8');
console.log(`[harness] written: ${PATH_STAGGER} (${HTML_STAGGER.length} chars)`);

console.log('[harness] generating clinicflow-launch export (full composer pipeline)…');
const clinicSchema = compose.buildRegistryPageSchema(CLINICFLOW_PROMPT, REGISTRY_MANIFEST);
const clinicData   = compose.pageSchemaToPuckData(clinicSchema);
const HTML_CLINIC  = pub.buildPageHTML(clinicData, EMOVEL_THEME);
const PATH_CLINIC  = join(OUT_DIR, 'clinicflow-launch.html');
writeFileSync(PATH_CLINIC, HTML_CLINIC, 'utf8');
console.log(`[harness] written: ${PATH_CLINIC} (${HTML_CLINIC.length} chars)`);

// ── 5. Assert on REAL file content ────────────────────────────────────────────
// Rules:
//  - read from disk (not from in-memory string) to confirm write succeeded
//  - no expected strings hard-coded here; all checks probe actual outputs
//  - each assertion prints PASS/FAIL + context from the file

let failures = 0;

function assert(label: string, condition: boolean, context?: string): void {
  if (condition) {
    console.log(`  PASS  ${label}`);
  } else {
    console.error(`  FAIL  ${label}${context ? `\n        context: ${context}` : ''}`);
    failures++;
  }
}

function lineOf(html: string, needle: string): string {
  const idx = html.indexOf(needle);
  if (idx === -1) return '(not found)';
  const line = html.slice(0, idx).split('\n').length;
  return `line ${line}: …${html.slice(Math.max(0, idx - 20), idx + needle.length + 20).replace(/\n/g, '↵')}…`;
}

// ─── Registry v1.1 helper functions ──────────────────────────────────────────

/** Strip all :root { ... } blocks so the remainder can be scanned for naked hex values. */
function stripRootBlocks(html: string): string {
  // [^{}]* matches multi-line content — :root blocks have no nested braces.
  return html.replace(/:root\s*\{[^{}]*\}/g, '');
}

/** Naked hex color strings outside any :root block — must be empty for token-origin compliance. */
function findNakedHex(html: string): string[] {
  return [...stripRootBlocks(html).matchAll(/#[0-9a-fA-F]{3,6}(?![0-9a-fA-F])/g)]
    .map(m => m[0]);
}

/** Asset paths found in src="assets/..." attributes. */
function extractAssetSrcs(html: string): string[] {
  return [...html.matchAll(/src="(assets\/[^"]+)"/g)].map(m => m[1]);
}

// Strings that must not appear in any EMOVEL export — indicates placeholder / demo content.
const PLACEHOLDER_TERMS = [
  'lorem ipsum', 'todo', 'fake', 'dummy', 'example.com', 'src=""', 'placeholder',
];

/**
 * Registry v1.1 export checks.
 * Runs all five policy assertions against a single generated HTML file.
 */
function runRegistryV11Checks(html: string, fileLabel: string): void {
  console.log(`\n── Registry v1.1 checks — ${fileLabel} ─────────────────`);

  // 1. Imperial Cold Gold — exact value must be declared as --color-primary
  assert(`[${fileLabel}] Imperial Cold Gold declared as --color-primary: #D4AF37`,
    html.includes('--color-primary: #D4AF37'),
    lineOf(html, '--color-primary: #D4AF37'));

  // 2. Token-origin — no naked hex colors outside the :root token block
  const nakedHex = findNakedHex(html);
  assert(`[${fileLabel}] no naked hex colors outside :root token block`,
    nakedHex.length === 0,
    nakedHex.length > 0 ? `found: ${nakedHex.slice(0, 5).join(', ')}` : undefined);

  // 3. Token usage — var(--color-primary) must be referenced in section CSS
  assert(`[${fileLabel}] var(--color-primary) referenced in section CSS`,
    html.includes('var(--color-primary)'),
    lineOf(html, 'var(--color-primary)'));

  // 4. Zero-placeholder — no demo / placeholder strings in export
  const placeholderHits = PLACEHOLDER_TERMS.filter(t => html.toLowerCase().includes(t));
  assert(`[${fileLabel}] no placeholder/demo strings in export`,
    placeholderHits.length === 0,
    placeholderHits.length > 0 ? `found terms: ${placeholderHits.join(', ')}` : undefined);

  // 5. Asset resolution — every src="assets/..." must point to a real file under public/
  const assetRefs = extractAssetSrcs(html);
  const missing   = assetRefs.filter(ref => !existsSync(join(ROOT, 'public', ref)));
  assert(
    `[${fileLabel}] all src="assets/..." paths resolve under public/ (${assetRefs.length} checked)`,
    missing.length === 0,
    missing.length > 0 ? `missing: ${missing.join(', ')}` : undefined,
  );
}

// ── Assertions on hero-depth-push.html ────────────────────────────────────────

console.log('\n── hero-depth-push.html ──────────────────────────────────────');
const D = readFileSync(PATH_DEPTH, 'utf8');

assert('@keyframes emovel-depth-push present',
  D.includes('@keyframes emovel-depth-push'),
  lineOf(D, '@keyframes emovel-depth-push'));

assert('@keyframes emovel-staggered-rise present (always generated)',
  D.includes('@keyframes emovel-staggered-rise'),
  lineOf(D, '@keyframes emovel-staggered-rise'));

assert('@keyframes emovel-wings-rise present',
  D.includes('@keyframes emovel-wings-rise'),
  lineOf(D, '@keyframes emovel-wings-rise'));

assert('@keyframes emovel-wings-left present',
  D.includes('@keyframes emovel-wings-left'),
  lineOf(D, '@keyframes emovel-wings-left'));

assert('@keyframes emovel-wings-right present',
  D.includes('@keyframes emovel-wings-right'),
  lineOf(D, '@keyframes emovel-wings-right'));

assert('panel paused animation rule present (depth-push)',
  D.includes('[data-emovel-motion="depth-push"] .emovel-hero__panel'),
  lineOf(D, '[data-emovel-motion="depth-push"] .emovel-hero__panel'));

assert('.is-inview panel trigger present',
  D.includes('.is-inview[data-emovel-motion="depth-push"] .emovel-hero__panel'),
  lineOf(D, '.is-inview[data-emovel-motion="depth-push"] .emovel-hero__panel'));

assert('animation-play-state: running present',
  D.includes('animation-play-state: running'),
  lineOf(D, 'animation-play-state: running'));

assert('data-emovel-motion="depth-push" on Hero section element',
  D.includes('data-emovel-motion="depth-push"'),
  lineOf(D, 'data-emovel-motion="depth-push"'));

const scriptCount = (D.match(/<script>/g) ?? []).length;
assert('IO micro-script inline exactly once',
  scriptCount === 1,
  `found ${scriptCount} <script> tag(s)`);

assert('IO script observes data-emovel-motion',
  D.includes("[data-emovel-motion]") && D.includes("classList.add('is-inview')"),
  lineOf(D, "classList.add('is-inview')"));

assert('IO script threshold:0.1',
  D.includes('threshold:0.1'),
  lineOf(D, 'threshold:0.1'));

assert('@media prefers-reduced-motion with animation: none',
  D.includes('@media (prefers-reduced-motion: reduce)') && D.includes('animation: none'),
  lineOf(D, 'animation: none'));

// Motion token set in :root
assert(':root contains --motion-duration-fast',
  D.includes('--motion-duration-fast'),
  lineOf(D, '--motion-duration-fast'));
assert(':root contains --depth-perspective',
  D.includes('--depth-perspective'),
  lineOf(D, '--depth-perspective'));
assert(':root contains --lighting-rim',
  D.includes('--lighting-rim'),
  lineOf(D, '--lighting-rim'));
assert(':root contains --motion-distance-sm',
  D.includes('--motion-distance-sm'),
  lineOf(D, '--motion-distance-sm'));

// Wings selectors — verify they target actual CinematicWings SVG structure
// CinematicWings renders: <g class="wing-left"> with 3 <path> children
// CSS must use .wing-left path:nth-child(1/2/3) — confirmed against the SVG
assert('wings left path:nth-child(1) selector present',
  D.includes('.wing-left path:nth-child(1)'),
  lineOf(D, '.wing-left path:nth-child(1)'));
assert('wings right path:nth-child(2) selector present',
  D.includes('.wing-right path:nth-child(2)'),
  lineOf(D, '.wing-right path:nth-child(2)'));

// Verify CinematicWings SVG is actually in the body (logo rendered)
assert('CinematicWings SVG present (wing-left class in body)',
  D.includes('class="wing-left"') || D.includes('class="emovel-hero__wings"'),
  lineOf(D, 'wing-left'));

// ── Assertions on hero-staggered.html ─────────────────────────────────────────

console.log('\n── hero-staggered.html ───────────────────────────────────────');
const S = readFileSync(PATH_STAGGER, 'utf8');

assert('data-emovel-motion="staggered-rise" on Hero element',
  S.includes('data-emovel-motion="staggered-rise"'),
  lineOf(S, 'data-emovel-motion="staggered-rise"'));

assert('.is-inview staggered title trigger present',
  S.includes('.is-inview[data-emovel-motion="staggered-rise"] .emovel-hero__title'),
  lineOf(S, '.is-inview[data-emovel-motion="staggered-rise"] .emovel-hero__title'));

assert('staggered title animation-delay: 0.15s',
  S.includes('animation-delay: 0.15s'),
  lineOf(S, 'animation-delay: 0.15s'));

assert('staggered eyebrow delay: 0.05s',
  S.includes('animation-delay: 0.05s'),
  lineOf(S, 'animation-delay: 0.05s'));

assert('staggered actions delay: 0.35s',
  S.includes('animation-delay: 0.35s'),
  lineOf(S, 'animation-delay: 0.35s'));

assert('no panel animation for staggered-rise (no emovel-staggered-rise panel rule)',
  !S.includes('[data-emovel-motion="staggered-rise"] .emovel-hero__panel {'),
  lineOf(S, '[data-emovel-motion="staggered-rise"] .emovel-hero__panel {'));

runRegistryV11Checks(D, 'hero-depth-push');
runRegistryV11Checks(S, 'hero-staggered');

// ── Assertions on clinicflow-launch.html ──────────────────────────────────────

console.log('\n── clinicflow-launch.html ────────────────────────────────────');
const C = readFileSync(PATH_CLINIC, 'utf8');

assert('[clinicflow] Composer Brief section present',
  C.includes('Composer Brief'),
  lineOf(C, 'Composer Brief'));

assert('[clinicflow] ClinicFlow brand name present',
  C.includes('ClinicFlow'),
  lineOf(C, 'ClinicFlow'));

assert('[clinicflow] "Product / Project" field label present',
  C.includes('Product / Project'),
  lineOf(C, 'Product / Project'));

assert('[clinicflow] "Core Offer" field label present',
  C.includes('Core Offer'),
  lineOf(C, 'Core Offer'));

assert('[clinicflow] "Activation Depth" field label present',
  C.includes('Activation Depth'),
  lineOf(C, 'Activation Depth'));

assert('[clinicflow] "Launch Page" page type present',
  C.includes('Launch Page'),
  lineOf(C, 'Launch Page'));

const notDetectedCount = (C.match(/Not detected/g) ?? []).length;
assert('[clinicflow] "Not detected" appears ≥ 3 times (Spine metrics absent)',
  notDetectedCount >= 3,
  `found ${notDetectedCount} occurrence(s)`);

runRegistryV11Checks(C, 'clinicflow-launch');

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n── result: ${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`} ──────────────────────────────`);
if (failures > 0) process.exit(1);
