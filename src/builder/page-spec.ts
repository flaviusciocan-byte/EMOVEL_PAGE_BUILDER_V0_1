import type {
  ColumnCount,
  CTALink,
  CTAProps,
  FAQProps,
  FeatureGridProps,
  FeatureSplitProps,
  ContentBlockProps,
  NavBarProps,
  PricingTableProps,
  ProductGridProps,
  StatsBarProps,
} from './section-contract';
import type { HeroStoredProps } from '../puck/config/hero.config';

export type GeneratedSectionKind =
  | 'nav'
  | 'hero'
  | 'featureGrid'
  | 'contentBlock'
  | 'featureSplit'
  | 'offer'
  | 'pricing'
  | 'productGrid'
  | 'statsBar'
  | 'cta'
  | 'faq'
  | 'footer';

export interface PageSpecMeta {
  source: 'prompt';
  prompt: string;
  generatedAt: string;
  generator: 'deterministic-v1';
}

export interface PageSpecBrand {
  name: string;
  tagline: string;
  audience: string;
  primaryAction: CTALink;
  secondaryAction: CTALink;
}

export interface PageSpecOfferProps {
  title: string;
  problem: string;
  solution: string;
  benefits: string[];
}

export interface PageSpecFooterLinkGroup {
  heading: string;
  links: CTALink[];
}

export interface PageSpecFooterProps {
  logoText: string;
  tagline: string;
  linkGroups: PageSpecFooterLinkGroup[];
  copyright: string;
  socialLinks: CTALink[];
}

export type PageSpecSection =
  | { kind: 'nav'; props: NavBarProps }
  | { kind: 'hero'; props: HeroStoredProps }
  | { kind: 'featureGrid'; props: FeatureGridProps }
  | { kind: 'contentBlock'; props: ContentBlockProps }
  | { kind: 'featureSplit'; props: FeatureSplitProps }
  | { kind: 'offer'; props: PageSpecOfferProps }
  | { kind: 'pricing'; props: PricingTableProps }
  | { kind: 'productGrid'; props: ProductGridProps }
  | { kind: 'statsBar'; props: StatsBarProps }
  | { kind: 'cta'; props: CTAProps }
  | { kind: 'faq'; props: FAQProps }
  | { kind: 'footer'; props: PageSpecFooterProps };

export interface PageSpec {
  version: 1;
  title: string;
  slug: string;
  brand: PageSpecBrand;
  sections: PageSpecSection[];
  meta: PageSpecMeta;
}

export const DEFAULT_GENERATED_COLUMNS: ColumnCount = 3;
