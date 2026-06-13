import type { Data } from '@puckeditor/core';
import type { PageSchema } from './page-schema';

// Registry component name → Puck editor component key.
// Only implemented components appear here; notImplemented components have no Puck mapping.
const REGISTRY_TO_PUCK: Record<string, string> = {
  'HeroSection':        'Hero',
  'TrustStrip':         'Logo Strip',
  'FeatureGrid':        'Card',
  'ProductShowcase':    'Product Grid',
  'PricingSection':     'Pricing Table',
  'FAQSection':         'FAQ',
  'CTASection':         'CTA Section',
  'NavigationBar':      'Nav Bar',
  'FooterSection':      'Footer',
  'TestimonialSection': 'Testimonials',
  'EditorialSection':   'Feature Split',
  'GalleryShowcase':    'Screenshot Gallery',
  'LeadCapture':        'Newsletter',
};

/**
 * Convert a validated Page Schema to Puck Data.
 *
 * Throws an explicit error for any registry component that has no Puck mapping
 * (notImplemented components, typos, or future components not yet wired).
 *
 * Call validatePageSchema() before this to ensure the schema is well-formed.
 */
export function pageSchemaToPuckData(schema: PageSchema): Data {
  const content = schema.components.map((comp, index) => {
    const puckType = REGISTRY_TO_PUCK[comp.registryName];
    if (!puckType) {
      throw new Error(
        `pageSchemaToPuckData: no Puck mapping for registry component "${comp.registryName}". ` +
        `Ensure the component is implemented and listed in REGISTRY_TO_PUCK.`,
      );
    }
    return {
      type: puckType,
      props: {
        id: `${comp.registryName}-${index}`,
        ...comp.props,
      },
    };
  });

  return {
    root: { props: { title: schema.title } },
    content,
    zones: {},
  } as Data;
}
