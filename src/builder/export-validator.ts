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
 * Duplicates are suppressed — each path appears at most once.
 *
 * Scans two levels:
 *   1. Top-level props (existing behaviour, unchanged).
 *   2. Each element of any array-valued prop (e.g. shots[].imageUrl).
 */
export function collectLocalAssetRefs(data: Data): string[] {
  const seen = new Set<string>();
  const refs: string[] = [];

  function addRef(value: unknown) {
    if (typeof value === 'string' && value && isLocalAsset(value)) {
      const normalized = normalize(value);
      if (!seen.has(normalized)) {
        seen.add(normalized);
        refs.push(normalized);
      }
    }
  }

  for (const item of (data.content ?? [])) {
    const props = item.props as Record<string, unknown>;

    // Level 1: top-level asset fields
    for (const field of ASSET_FIELDS) {
      addRef(props?.[field]);
    }

    // Level 2: nested array items — same ASSET_FIELDS checked per object element
    for (const propValue of Object.values(props ?? {})) {
      if (Array.isArray(propValue)) {
        for (const arrayItem of propValue) {
          if (arrayItem !== null && typeof arrayItem === 'object') {
            for (const field of ASSET_FIELDS) {
              addRef((arrayItem as Record<string, unknown>)[field]);
            }
          }
        }
      }
    }
  }

  return refs;
}

/**
 * Registry entries that require real assets for export.
 * Maps registry component name → required asset field paths.
 * When a component is present in page data and marked requiresAssets,
 * the empty-state policy blocks export if required fields are empty.
 */
const REQUIRED_ASSET_COMPONENTS: Record<string, ReadonlyArray<readonly string[]>> = {
  GalleryShowcase: [['shots'], ['shots', 'imageUrl']],
};

/**
 * Validate empty-state policy: components with requiresAssets: true
 * must have non-empty values in their required asset fields.
 * Returns error strings; empty array = valid.
 */
export function validateRequiredAssets(data: Data): string[] {
  const errors: string[] = [];

  for (const item of (data.content ?? [])) {
    const props = item.props as Record<string, unknown>;
    const type = item.type as string;

    // Map Puck component type back to registry name
    let registryName: string | null = null;
    for (const [regName, puckType] of Object.entries({
      'GalleryShowcase': 'Screenshot Gallery',
    })) {
      if (puckType === type) { registryName = regName; break; }
    }

    if (!registryName) continue;
    const requiredPaths = REQUIRED_ASSET_COMPONENTS[registryName];
    if (!requiredPaths) continue;

    for (const path of requiredPaths) {
      if (path.length === 1) {
        // Direct prop check: e.g. shots must be non-empty array
        const val = props[path[0]];
        if (!Array.isArray(val) || val.length === 0) {
          errors.push(`MISSING REQUIRED ASSET: ${registryName}.${path[0]} must have at least one item`);
        }
      } else if (path.length === 2) {
        // Nested array field: e.g. shots[].imageUrl must be non-empty for at least one item
        const arr = props[path[0]];
        if (Array.isArray(arr)) {
          const hasNonEmpty = arr.some((item: unknown) => {
            if (item && typeof item === 'object') {
              return Boolean((item as Record<string, unknown>)[path[1]]);
            }
            return false;
          });
          if (!hasNonEmpty) {
            errors.push(`MISSING REQUIRED ASSET: ${registryName}.${path[0]}[].${path[1]} must have at least one non-empty value`);
          }
        }
      }
    }
  }

  return errors;
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
  const assetErrors = collectLocalAssetRefs(data)
    .filter(ref => !existsFn(ref))
    .map(ref => `MISSING ASSET: ${ref}`);

  const requiredErrors = validateRequiredAssets(data);

  return [...assetErrors, ...requiredErrors];
}
