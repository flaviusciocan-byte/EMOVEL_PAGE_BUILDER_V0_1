// Registry Composer v1 — main entry point.
// Deterministic pipeline: prompt → profile → plan → props → PageSchema.
// No external API. No JSX. No side effects.

import type { PageSchema }          from './page-schema';
import type { ValidatorManifest }   from './page-schema-validator';
import { classifyIntent }           from './composer-strategy';
import type { PageType }            from './composer-strategy';
import { planPageStructure }        from './composer-planner';
import { buildSectionProps }        from './composer-section-builder';

const PAGE_TYPE_LABELS: Record<PageType, string> = {
  saas:      'SaaS Landing',
  landing:   'Launch Page',
  portfolio: 'Portfolio',
  product:   'Product Page',
  about:     'About Page',
};

export function buildRegistryPageSchema(
  prompt:   string,
  manifest: ValidatorManifest,
): PageSchema {
  const profile    = classifyIntent(prompt);
  const plan       = planPageStructure(profile, manifest);
  const components = plan.map((planned, index) => ({
    registryName: planned.registryName,
    props:        buildSectionProps(planned.registryName, profile, index),
  }));

  return {
    registryVersion: manifest.registryVersion,
    title:           `${profile.brand.name} — ${PAGE_TYPE_LABELS[profile.pageType]}`,
    components,
  };
}
