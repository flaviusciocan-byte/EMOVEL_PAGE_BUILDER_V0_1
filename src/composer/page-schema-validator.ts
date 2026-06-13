import {
  UNIVERSE_VALUES,
  SURFACE_VALUES,
  MOTION_VALUES,
  SPACING_VALUES,
} from '../registry/shared';
import type { PageSchemaValidationResult } from './page-schema';

/** Minimal manifest shape the validator needs — matches registry.manifest.json. */
export interface ValidatorManifest {
  registryVersion: string;
  components: Array<{
    registryName: string;
    status: 'implemented' | 'notImplemented';
  }>;
}

// ── Asset path rules (mirrors export-validator.ts logic) ─────────────────────

const EXTERNAL_PREFIXES = ['http://', 'https://', 'data:', 'blob:'];
const LOCAL_PREFIXES    = ['assets/', '/assets/'];

const ASSET_FIELDS = [
  'backgroundImageUrl',
  'logoImageUrl',
  'imageUrl',
  'avatarUrl',
  'cardImageUrl',
  'objectImageUrl',
] as const;

function isValidAssetValue(value: string): boolean {
  if (!value) return true;
  if (EXTERNAL_PREFIXES.some(p => value.startsWith(p))) return true;
  return LOCAL_PREFIXES.some(p => value.startsWith(p));
}

function checkAssetFields(
  props: Record<string, unknown>,
  prefix: string,
  errors: string[],
): void {
  // Top-level asset fields
  for (const field of ASSET_FIELDS) {
    const v = props[field];
    if (typeof v === 'string' && !isValidAssetValue(v)) {
      errors.push(
        `${prefix}.props.${field} "${v}" must start with assets/ or /assets/ (or be empty / an external URL)`,
      );
    }
  }

  // Nested array items (e.g. shots[].imageUrl for GalleryShowcase)
  for (const [propKey, propValue] of Object.entries(props)) {
    if (Array.isArray(propValue)) {
      for (let j = 0; j < propValue.length; j++) {
        const item = propValue[j];
        if (item !== null && typeof item === 'object') {
          const itemObj = item as Record<string, unknown>;
          for (const field of ASSET_FIELDS) {
            const v = itemObj[field];
            if (typeof v === 'string' && !isValidAssetValue(v)) {
              errors.push(
                `${prefix}.props.${propKey}[${j}].${field} "${v}" must start with assets/ or /assets/ (or be empty / an external URL)`,
              );
            }
          }
        }
      }
    }
  }
}

// ── Validator ─────────────────────────────────────────────────────────────────

/**
 * Validate a Page Schema against the current registry manifest.
 *
 * Accepts `unknown` so callers can pass JSON.parse output without pre-casting.
 * Returns { valid, errors } — never throws.
 */
export function validatePageSchema(
  schema: unknown,
  manifest: ValidatorManifest,
): PageSchemaValidationResult {
  const errors: string[] = [];

  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
    return { valid: false, errors: ['schema must be a non-null object'] };
  }

  const s = schema as Record<string, unknown>;

  // 1. registryVersion must match manifest
  if (s.registryVersion !== manifest.registryVersion) {
    errors.push(
      `registryVersion mismatch: schema has "${s.registryVersion}", manifest requires "${manifest.registryVersion}"`,
    );
  }

  // 2. components must be an array
  if (!Array.isArray(s.components)) {
    errors.push('components must be an array');
    return { valid: errors.length === 0, errors };
  }

  // Build manifest lookup
  const manifestMap = new Map(
    manifest.components.map(c => [c.registryName, c]),
  );

  for (let i = 0; i < (s.components as unknown[]).length; i++) {
    const comp = (s.components as unknown[])[i];

    if (!comp || typeof comp !== 'object' || Array.isArray(comp)) {
      errors.push(`components[${i}] must be an object`);
      continue;
    }

    const c = comp as Record<string, unknown>;
    const name = c.registryName;

    if (typeof name !== 'string' || !name) {
      errors.push(`components[${i}].registryName must be a non-empty string`);
      continue;
    }

    // 3. registryName must be known in manifest
    const entry = manifestMap.get(name);
    if (!entry) {
      errors.push(
        `components[${i}] "${name}" is not a registered component in the manifest`,
      );
      continue;
    }

    // 4. component must be implemented
    if (entry.status !== 'implemented') {
      errors.push(
        `components[${i}] "${name}" has status "${entry.status}" — only implemented components are allowed in a Page Schema`,
      );
    }

    // 5–8. Per-prop validation
    if (
      c.props !== undefined &&
      c.props !== null &&
      typeof c.props === 'object' &&
      !Array.isArray(c.props)
    ) {
      const p = c.props as Record<string, unknown>;
      const loc = `components[${i}] "${name}"`;

      if (
        p.universe !== undefined &&
        !(UNIVERSE_VALUES as readonly string[]).includes(p.universe as string)
      ) {
        errors.push(
          `${loc}.props.universe "${p.universe}" is not valid — allowed: ${UNIVERSE_VALUES.join(', ')}`,
        );
      }
      if (
        p.surface !== undefined &&
        !(SURFACE_VALUES as readonly string[]).includes(p.surface as string)
      ) {
        errors.push(
          `${loc}.props.surface "${p.surface}" is not valid — allowed: ${SURFACE_VALUES.join(', ')}`,
        );
      }
      if (
        p.motion !== undefined &&
        !(MOTION_VALUES as readonly string[]).includes(p.motion as string)
      ) {
        errors.push(
          `${loc}.props.motion "${p.motion}" is not valid — allowed: ${MOTION_VALUES.join(', ')}`,
        );
      }
      if (
        p.spacing !== undefined &&
        !(SPACING_VALUES as readonly string[]).includes(p.spacing as string)
      ) {
        errors.push(
          `${loc}.props.spacing "${p.spacing}" is not valid — allowed: ${SPACING_VALUES.join(', ')}`,
        );
      }

      if (p.aiLock !== undefined && !Array.isArray(p.aiLock)) {
        errors.push(`${loc}.props.aiLock must be an array`);
      }
      if (p.anchorId !== undefined && typeof p.anchorId !== 'string') {
        errors.push(`${loc}.props.anchorId must be a string`);
      }

      checkAssetFields(p, loc, errors);
    }
  }

  return { valid: errors.length === 0, errors };
}
