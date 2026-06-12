import type { Data } from '@puckeditor/core';

// Fields whose string values may reference local asset files.
const ASSET_FIELDS = [
  'backgroundImageUrl',
  'logoImageUrl',
  'imageUrl',
  'avatarUrl',
  'cardImageUrl',
  'objectImageUrl',
] as const;

const EXTERNAL_PREFIXES = ['http://', 'https://', 'data:', 'blob:'];
const LOCAL_PREFIXES    = ['assets/', '/assets/'];

function isLocalAsset(value: string): boolean {
  if (EXTERNAL_PREFIXES.some(p => value.startsWith(p))) return false;
  return LOCAL_PREFIXES.some(p => value.startsWith(p));
}

function normalize(path: string): string {
  return path.startsWith('/') ? path.slice(1) : path;
}

/**
 * Walk all section props in a Puck Data object and return the normalized
 * paths of every local asset reference found (e.g. "assets/hero.jpg").
 * External URLs, data URIs, and blob URLs are excluded.
 */
export function collectLocalAssetRefs(data: Data): string[] {
  const refs: string[] = [];
  for (const item of (data.content ?? [])) {
    const props = item.props as Record<string, unknown>;
    for (const field of ASSET_FIELDS) {
      const v = props?.[field];
      if (typeof v === 'string' && v && isLocalAsset(v)) {
        refs.push(normalize(v));
      }
    }
  }
  return refs;
}

/**
 * Validate all local asset references in a Puck Data object.
 * Returns an array of error strings; empty array = valid.
 *
 * Pass an existsFn appropriate for your environment:
 *   Node.js / tests:  (path) => existsSync(join(publicRoot, path))
 *   Browser export:   handled via fetch in publishToZip (see publish.ts)
 */
export function validatePageForExport(
  data: Data,
  existsFn: (assetPath: string) => boolean,
): string[] {
  return collectLocalAssetRefs(data)
    .filter(ref => !existsFn(ref))
    .map(ref => `MISSING ASSET: ${ref}`);
}
