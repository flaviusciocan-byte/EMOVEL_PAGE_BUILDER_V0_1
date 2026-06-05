import type { Data } from '@puckeditor/core';
import type { PageSpec, PageSpecFooterLinkGroup, PageSpecSection } from './page-spec';

type PuckSectionType =
  | 'Nav Bar'
  | 'Hero'
  | 'Feature Grid'
  | 'Content Block'
  | 'Feature Split'
  | 'Offer Section'
  | 'Pricing Table'
  | 'Product Grid'
  | 'Stats Bar'
  | 'CTA Section'
  | 'FAQ'
  | 'Footer';

function sectionTypeForKind(kind: PageSpecSection['kind']): PuckSectionType {
  switch (kind) {
    case 'nav':
      return 'Nav Bar';
    case 'hero':
      return 'Hero';
    case 'featureGrid':
      return 'Feature Grid';
    case 'contentBlock':
      return 'Content Block';
    case 'featureSplit':
      return 'Feature Split';
    case 'offer':
      return 'Offer Section';
    case 'pricing':
      return 'Pricing Table';
    case 'productGrid':
      return 'Product Grid';
    case 'statsBar':
      return 'Stats Bar';
    case 'cta':
      return 'CTA Section';
    case 'faq':
      return 'FAQ';
    case 'footer':
      return 'Footer';
  }
}

function footerLinksToText(group: PageSpecFooterLinkGroup): string {
  return group.links.map((link) => `${link.label} | ${link.href}`).join('\n');
}

function propsForPuck(section: PageSpecSection): Record<string, unknown> {
  if (section.kind === 'offer') {
    return {
      ...section.props,
      benefits: section.props.benefits.map((text) => ({ text })),
    };
  }

  if (section.kind === 'footer') {
    return {
      ...section.props,
      linkGroups: section.props.linkGroups.map((group) => ({
        heading: group.heading,
        links: footerLinksToText(group),
      })),
    };
  }

  return section.props as unknown as Record<string, unknown>;
}

export function pageSpecToPuckData(spec: PageSpec): Data {
  return {
    root: { props: { title: spec.title } },
    content: spec.sections.map((section, index) => ({
      type: sectionTypeForKind(section.kind),
      props: {
        id: `${spec.slug}-${section.kind}-${index + 1}`,
        ...propsForPuck(section),
      },
    })),
  } as Data;
}
