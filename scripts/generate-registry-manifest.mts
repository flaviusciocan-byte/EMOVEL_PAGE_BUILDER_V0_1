/**
 * scripts/generate-registry-manifest.mts
 *
 * Generates registry.manifest.json from TypeScript source of truth.
 * TypeScript is authoritative — the manifest is never written by hand.
 *
 * Runner: node --experimental-strip-types scripts/generate-registry-manifest.mts
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

import { REGISTRY_VERSION }                           from '../src/registry/version.ts';
import { componentRegistry }                          from '../src/registry/componentRegistry.ts';
import { UNIVERSE_VALUES, SURFACE_VALUES, MOTION_VALUES, SPACING_VALUES } from '../src/registry/shared.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const OUTPUT     = resolve(__dirname, '../registry.manifest.json');

const components = Object.values(componentRegistry)
  .sort((a, b) => a.registryIndex - b.registryIndex)
  .map((entry) => ({
    registryVersion:   REGISTRY_VERSION,
    registryName:      entry.registryName,
    implementationKey: entry.implementationKey,
    status:            entry.status,
    category:          entry.category,
    requiresAssets:    entry.requiresAssets,
    notes:             entry.notes ?? null,
  }));

const manifest = {
  registryVersion: REGISTRY_VERSION,
  generatedFrom:   'TypeScript',
  source: {
    registry: 'src/registry/componentRegistry.ts',
    shared:   'src/registry/shared.ts',
  },
  sharedProps: {
    universe: {
      allowedValues: [...UNIVERSE_VALUES],
    },
    surface: {
      allowedValues: [...SURFACE_VALUES],
      default:       'base',
    },
    motion: {
      allowedValues: [...MOTION_VALUES],
      default:       'subtle',
    },
    spacing: {
      allowedValues: [...SPACING_VALUES],
      default:       'standard',
    },
    anchorId: {
      type:    'string',
      default: 'auto-generated',
    },
    aiLock: {
      type:    'string[]',
      default: [],
    },
  },
  components,
};

writeFileSync(OUTPUT, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(`[generate-registry-manifest] wrote ${OUTPUT}`);
console.log(`[generate-registry-manifest] ${components.length} components`);
