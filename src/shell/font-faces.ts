// Self-hosted font @font-face declarations.
// Clash Display  — wordmark / headings       public/fonts/clash-display/
// Satoshi        — body copy / UI            public/fonts/satoshi/
// Cinzel         — wordmark fallback         public/fonts/cinzel/
// JetBrains Mono — monospace shell           public/fonts/jetbrains-mono/
//
// DEV  paths: absolute (/fonts/...) — resolved against the Vite dev server origin.
// EXPORT paths: relative (fonts/...) — resolved against the ZIP root index.html.

function faces(prefix: string): string {
  return [
    // Clash Display (wordmark / headings)
    `@font-face { font-family: 'Clash Display'; font-style: normal; font-weight: 400; font-display: swap; src: url('${prefix}clash-display/clash-display-400.woff2') format('woff2'); }`,
    `@font-face { font-family: 'Clash Display'; font-style: normal; font-weight: 500; font-display: swap; src: url('${prefix}clash-display/clash-display-500.woff2') format('woff2'); }`,
    `@font-face { font-family: 'Clash Display'; font-style: normal; font-weight: 600; font-display: swap; src: url('${prefix}clash-display/clash-display-600.woff2') format('woff2'); }`,
    `@font-face { font-family: 'Clash Display'; font-style: normal; font-weight: 700; font-display: swap; src: url('${prefix}clash-display/clash-display-700.woff2') format('woff2'); }`,
    // Satoshi (body copy / UI)
    `@font-face { font-family: 'Satoshi'; font-style: normal; font-weight: 300; font-display: swap; src: url('${prefix}satoshi/satoshi-300.woff2') format('woff2'); }`,
    `@font-face { font-family: 'Satoshi'; font-style: normal; font-weight: 400; font-display: swap; src: url('${prefix}satoshi/satoshi-400.woff2') format('woff2'); }`,
    `@font-face { font-family: 'Satoshi'; font-style: normal; font-weight: 500; font-display: swap; src: url('${prefix}satoshi/satoshi-500.woff2') format('woff2'); }`,
    `@font-face { font-family: 'Satoshi'; font-style: normal; font-weight: 700; font-display: swap; src: url('${prefix}satoshi/satoshi-700.woff2') format('woff2'); }`,
    // Cinzel (wordmark fallback)
    `@font-face { font-family: 'Cinzel'; font-style: normal; font-weight: 400; font-display: swap; src: url('${prefix}cinzel/cinzel-400.woff2') format('woff2'); }`,
    `@font-face { font-family: 'Cinzel'; font-style: normal; font-weight: 600; font-display: swap; src: url('${prefix}cinzel/cinzel-600.woff2') format('woff2'); }`,
    // JetBrains Mono (monospace shell)
    `@font-face { font-family: 'JetBrains Mono'; font-style: normal; font-weight: 400; font-display: swap; src: url('${prefix}jetbrains-mono/jetbrains-mono-400.woff2') format('woff2'); }`,
    `@font-face { font-family: 'JetBrains Mono'; font-style: normal; font-weight: 500; font-display: swap; src: url('${prefix}jetbrains-mono/jetbrains-mono-500.woff2') format('woff2'); }`,
    `@font-face { font-family: 'JetBrains Mono'; font-style: normal; font-weight: 700; font-display: swap; src: url('${prefix}jetbrains-mono/jetbrains-mono-700.woff2') format('woff2'); }`,
  ].join('\n');
}

/** For dev server + Puck iframe injection — absolute paths served from public/fonts/. */
export const FONT_FACES_DEV    = faces('/fonts/');

/** For the ZIP export's inline <style> — relative to index.html at ZIP root. */
export const FONT_FACES_EXPORT = faces('fonts/');

/** Entries for publish.ts BRAND_EXPORT_ASSETS — each font file bundled into the ZIP.
 *  Satoshi entries are included so the ZIP is structurally complete; the WOFF2 files
 *  must exist in public/fonts/satoshi/ at export time or the fetch will 404-skip them. */
export const FONT_EXPORT_ASSETS: ReadonlyArray<{ sourcePath: string; zipPath: string }> = [
  { sourcePath: 'fonts/clash-display/clash-display-400.woff2', zipPath: 'fonts/clash-display/clash-display-400.woff2' },
  { sourcePath: 'fonts/clash-display/clash-display-500.woff2', zipPath: 'fonts/clash-display/clash-display-500.woff2' },
  { sourcePath: 'fonts/clash-display/clash-display-600.woff2', zipPath: 'fonts/clash-display/clash-display-600.woff2' },
  { sourcePath: 'fonts/clash-display/clash-display-700.woff2', zipPath: 'fonts/clash-display/clash-display-700.woff2' },
  { sourcePath: 'fonts/satoshi/satoshi-300.woff2', zipPath: 'fonts/satoshi/satoshi-300.woff2' },
  { sourcePath: 'fonts/satoshi/satoshi-400.woff2', zipPath: 'fonts/satoshi/satoshi-400.woff2' },
  { sourcePath: 'fonts/satoshi/satoshi-500.woff2', zipPath: 'fonts/satoshi/satoshi-500.woff2' },
  { sourcePath: 'fonts/satoshi/satoshi-700.woff2', zipPath: 'fonts/satoshi/satoshi-700.woff2' },
  { sourcePath: 'fonts/cinzel/cinzel-400.woff2', zipPath: 'fonts/cinzel/cinzel-400.woff2' },
  { sourcePath: 'fonts/cinzel/cinzel-600.woff2', zipPath: 'fonts/cinzel/cinzel-600.woff2' },
  { sourcePath: 'fonts/jetbrains-mono/jetbrains-mono-400.woff2', zipPath: 'fonts/jetbrains-mono/jetbrains-mono-400.woff2' },
  { sourcePath: 'fonts/jetbrains-mono/jetbrains-mono-500.woff2', zipPath: 'fonts/jetbrains-mono/jetbrains-mono-500.woff2' },
  { sourcePath: 'fonts/jetbrains-mono/jetbrains-mono-700.woff2', zipPath: 'fonts/jetbrains-mono/jetbrains-mono-700.woff2' },
];
