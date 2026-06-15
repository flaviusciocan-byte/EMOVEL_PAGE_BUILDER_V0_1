// Self-hosted font @font-face declarations.
// Clash Display  — wordmark / headings  (replaces Cinzel CDN)
// Hanken Grotesk — body copy / UI       (Satoshi slot; drop in Satoshi WOFF2 + update
//                                        font-family stacks when files are available)
// JetBrains Mono — monospace shell
//
// DEV  paths: absolute (/fonts/...) — resolved against the Vite dev server origin.
// EXPORT paths: relative (fonts/...) — resolved against the ZIP root index.html.

function faces(prefix: string): string {
  return [
    // Clash Display
    `@font-face { font-family: 'Clash Display'; font-style: normal; font-weight: 400; font-display: swap; src: url('${prefix}clash-display/clash-display-400.woff2') format('woff2'); }`,
    `@font-face { font-family: 'Clash Display'; font-style: normal; font-weight: 500; font-display: swap; src: url('${prefix}clash-display/clash-display-500.woff2') format('woff2'); }`,
    `@font-face { font-family: 'Clash Display'; font-style: normal; font-weight: 600; font-display: swap; src: url('${prefix}clash-display/clash-display-600.woff2') format('woff2'); }`,
    `@font-face { font-family: 'Clash Display'; font-style: normal; font-weight: 700; font-display: swap; src: url('${prefix}clash-display/clash-display-700.woff2') format('woff2'); }`,
    // Hanken Grotesk
    `@font-face { font-family: 'Hanken Grotesk'; font-style: normal; font-weight: 400; font-display: swap; src: url('${prefix}hanken-grotesk/hanken-grotesk-400.woff2') format('woff2'); }`,
    `@font-face { font-family: 'Hanken Grotesk'; font-style: normal; font-weight: 500; font-display: swap; src: url('${prefix}hanken-grotesk/hanken-grotesk-500.woff2') format('woff2'); }`,
    `@font-face { font-family: 'Hanken Grotesk'; font-style: normal; font-weight: 600; font-display: swap; src: url('${prefix}hanken-grotesk/hanken-grotesk-600.woff2') format('woff2'); }`,
    `@font-face { font-family: 'Hanken Grotesk'; font-style: normal; font-weight: 700; font-display: swap; src: url('${prefix}hanken-grotesk/hanken-grotesk-700.woff2') format('woff2'); }`,
    // JetBrains Mono
    `@font-face { font-family: 'JetBrains Mono'; font-style: normal; font-weight: 400; font-display: swap; src: url('${prefix}jetbrains-mono/jetbrains-mono-400.woff2') format('woff2'); }`,
    `@font-face { font-family: 'JetBrains Mono'; font-style: normal; font-weight: 500; font-display: swap; src: url('${prefix}jetbrains-mono/jetbrains-mono-500.woff2') format('woff2'); }`,
    `@font-face { font-family: 'JetBrains Mono'; font-style: normal; font-weight: 700; font-display: swap; src: url('${prefix}jetbrains-mono/jetbrains-mono-700.woff2') format('woff2'); }`,
  ].join('\n');
}

/** For dev server + Puck iframe injection — absolute paths served from public/fonts/. */
export const FONT_FACES_DEV    = faces('/fonts/');

/** For the ZIP export's inline <style> — relative to index.html at ZIP root. */
export const FONT_FACES_EXPORT = faces('fonts/');

/** Entries for publish.ts BRAND_EXPORT_ASSETS — each font file bundled into the ZIP. */
export const FONT_EXPORT_ASSETS: ReadonlyArray<{ sourcePath: string; zipPath: string }> = [
  { sourcePath: 'fonts/clash-display/clash-display-400.woff2', zipPath: 'fonts/clash-display/clash-display-400.woff2' },
  { sourcePath: 'fonts/clash-display/clash-display-500.woff2', zipPath: 'fonts/clash-display/clash-display-500.woff2' },
  { sourcePath: 'fonts/clash-display/clash-display-600.woff2', zipPath: 'fonts/clash-display/clash-display-600.woff2' },
  { sourcePath: 'fonts/clash-display/clash-display-700.woff2', zipPath: 'fonts/clash-display/clash-display-700.woff2' },
  { sourcePath: 'fonts/hanken-grotesk/hanken-grotesk-400.woff2', zipPath: 'fonts/hanken-grotesk/hanken-grotesk-400.woff2' },
  { sourcePath: 'fonts/hanken-grotesk/hanken-grotesk-500.woff2', zipPath: 'fonts/hanken-grotesk/hanken-grotesk-500.woff2' },
  { sourcePath: 'fonts/hanken-grotesk/hanken-grotesk-600.woff2', zipPath: 'fonts/hanken-grotesk/hanken-grotesk-600.woff2' },
  { sourcePath: 'fonts/hanken-grotesk/hanken-grotesk-700.woff2', zipPath: 'fonts/hanken-grotesk/hanken-grotesk-700.woff2' },
  { sourcePath: 'fonts/jetbrains-mono/jetbrains-mono-400.woff2', zipPath: 'fonts/jetbrains-mono/jetbrains-mono-400.woff2' },
  { sourcePath: 'fonts/jetbrains-mono/jetbrains-mono-500.woff2', zipPath: 'fonts/jetbrains-mono/jetbrains-mono-500.woff2' },
  { sourcePath: 'fonts/jetbrains-mono/jetbrains-mono-700.woff2', zipPath: 'fonts/jetbrains-mono/jetbrains-mono-700.woff2' },
];
