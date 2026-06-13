// Puck configuration — field definitions, defaultProps, and registered renders for all sections.
// Claude owns this file. Codex MUST NOT edit it.

import { useContext } from 'react';
import type { Config } from '@puckeditor/core';
import type {
  ProductCard,
  ProductGridProps,
  OfferProps,
  ShotItem,
  ScreenshotGalleryProps,
  CTAProps,
  CTALink,
  NavBarProps,
  LogoStripProps,
  LogoItem,
  FeatureGridProps,
  FeatureCard,
  ColumnCount,
  FeatureSplitProps,
  PricingTableProps,
  PricingPlan,
  FAQProps,
  FAQItem,
  TestimonialsProps,
  TestimonialCard,
  StatsBarProps,
  StatItem,
  VideoEmbedProps,
  NewsletterProps,
  TeamGridProps,
  TeamMember,
  ContentBlockProps,
  FooterProps,
  FooterLinkGroup,
  CardProps,
  CardVariant,
} from './section-contract';

import {
  heroFields,
  heroDefaultProps,
  renderHero,
  type HeroStoredProps,
} from '../puck/config/hero.config';
import { ProductGridSection }       from './sections/ProductGridSection';
import { OfferSection }             from './sections/OfferSection';
import { ScreenshotGallerySection } from './sections/ScreenshotGallerySection';
import { CTASection }               from './sections/CTASection';
import { NavBarSection }            from './sections/NavBarSection';
import { LogoStripSection }         from './sections/LogoStripSection';
import { FeatureGridSection }       from './sections/FeatureGridSection';
import { FeatureSplitSection }      from './sections/FeatureSplitSection';
import { PricingTableSection }      from './sections/PricingTableSection';
import { FAQSection }               from './sections/FAQSection';
import { TestimonialsSection }      from './sections/TestimonialsSection';
import { StatsBarSection }          from './sections/StatsBarSection';
import { VideoEmbedSection }        from './sections/VideoEmbedSection';
import { NewsletterSection }        from './sections/NewsletterSection';
import { TeamGridSection }          from './sections/TeamGridSection';
import { ContentBlockSection }      from './sections/ContentBlockSection';
import { FooterSection }            from './sections/FooterSection';
import { CardSection }              from './sections/CardSection';
import { BuilderModeContext }       from './BuilderModeContext';

// ─── Stored-props types ───────────────────────────────────────────────────────

// Puck's array field with arrayFields.text stores items as { text: string }[].
// OfferProps.benefits is string[] (the render contract). OfferStoredProps captures
// what Puck actually stores so fields, defaultProps, and getItemSummary type correctly.
type OfferStoredProps = Omit<OfferProps, 'benefits'> & { benefits: { text: string }[] };

// FooterLinkGroup.links is CTALink[] in the contract.
// Puck cannot nest array fields inside array fields, so links is stored as a textarea
// with one "Label | href" line per link. parseFooterLinks converts it at the render boundary.
type FooterLinkGroupStored = { heading: string; links: string };
type FooterStoredProps = Omit<FooterProps, 'linkGroups'> & {
  linkGroups: FooterLinkGroupStored[];
};

// ─── Normalize utilities ──────────────────────────────────────────────────────

// normalizeBenefits tolerates all three forms — string[], {text}[], and mixed —
// to handle both new editor state and any legacy saved data.
export function normalizeBenefits(raw: Array<string | { text?: string }>): string[] {
  return raw.map((b) => (typeof b === 'string' ? b : (b.text ?? '')));
}

function parseFooterLinks(raw: string): CTALink[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const sep = line.indexOf('|');
      if (sep === -1) return { label: line, href: '' };
      return { label: line.slice(0, sep).trim(), href: line.slice(sep + 1).trim() };
    });
}

// ─── Shared surface fields + defaults ─────────────────────────────────────────

const SURFACE_FIELDS = {
  surface: {
    type: 'select' as const,
    label: 'Surface',
    options: [
      { value: 'transparent', label: 'Transparent' },
      { value: 'base',        label: 'Base'        },
      { value: 'surface',     label: 'Surface'     },
      { value: 'surfaceAlt',  label: 'Surface Alt' },
      { value: 'image',       label: 'Image'       },
      { value: 'gradient',    label: 'Gradient'    },
    ],
  },
  width: {
    type: 'select' as const,
    label: 'Width',
    options: [
      { value: 'contained',  label: 'Contained'  },
      { value: 'full-bleed', label: 'Full bleed' },
    ],
  },
  backgroundImageUrl: {
    type: 'text' as const,
    label: 'Background image URL (surface = image)',
  },
};

const SURFACE_DEFAULTS = {
  surface:            'transparent' as const,
  width:              'contained'   as const,
  backgroundImageUrl: '',
};

// ─── Builder-only warning components ─────────────────────────────────────────
// Rendered only when BuilderModeContext is true (inside Puck canvas).
// The context defaults to false, so renderToStaticMarkup never includes these.

/** Card render wrapper — shows MISSING ASSET banner in the builder canvas only. */
export function CardRender(props: CardProps) {
  const isBuilder = useContext(BuilderModeContext);
  const showWarning = isBuilder && props.variant === 'image' && !props.cardImageUrl;
  return (
    <>
      {showWarning && (
        <div style={{
          padding: '0.6rem 1rem 0.6rem 1.1rem',
          background: 'color-mix(in srgb, var(--color-warning) 10%, var(--color-surface))',
          borderLeft: '2px solid var(--color-warning)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.2rem',
        }}>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-warning)',
          }}>MISSING ASSET</span>
          <span style={{
            fontSize: '0.8rem',
            color: 'var(--color-textSecondary)',
          }}>Image variant requires a real cardImageUrl before export.</span>
        </div>
      )}
      <CardSection {...props} />
    </>
  );
}

// ─── Config ───────────────────────────────────────────────────────────────────
// Explicit type annotation (not satisfies) so config's type is Config<{...}>, which extends
// the base Config and satisfies Puck<UserConfig extends Config>'s prop constraint.
export const config: Config<{
  'Hero':               HeroStoredProps;
  'Product Grid':       ProductGridProps;
  'Offer Section':      OfferStoredProps;
  'Screenshot Gallery': ScreenshotGalleryProps;
  'CTA Section':        CTAProps;
  'Nav Bar':            NavBarProps;
  'Logo Strip':         LogoStripProps;
  'Feature Grid':       FeatureGridProps;
  'Feature Split':      FeatureSplitProps;
  'Pricing Table':      PricingTableProps;
  'FAQ':                FAQProps;
  'Testimonials':       TestimonialsProps;
  'Stats Bar':          StatsBarProps;
  'Video Embed':        VideoEmbedProps;
  'Newsletter':         NewsletterProps;
  'Team Grid':          TeamGridProps;
  'Content Block':      ContentBlockProps;
  'Footer':             FooterStoredProps;
  'Card':               CardProps;
}> = {
  components: {

    // ── Hero ────────────────────────────────────────────────────────────────
    'Hero': {
      fields:       heroFields,
      defaultProps: heroDefaultProps,
      render:       renderHero,
    },

    // ── Product Grid ────────────────────────────────────────────────────────
    'Product Grid': {
      fields: {
        ...SURFACE_FIELDS,
        sectionTitle:       { type: 'text'     as const, label: 'Section title' },
        sectionDescription: { type: 'textarea' as const, label: 'Section description' },
        products: {
          type: 'array' as const,
          label: 'Products',
          arrayFields: {
            title:       { type: 'text'     as const, label: 'Title' },
            description: { type: 'textarea' as const, label: 'Description' },
            status: {
              type: 'select' as const,
              label: 'Status',
              options: [
                { value: 'available',    label: 'Available' },
                { value: 'coming_soon',  label: 'Coming soon' },
                { value: 'early_access', label: 'Early access' },
              ],
            },
            cta: { type: 'text' as const, label: 'CTA label' },
          },
          getItemSummary: (item: ProductCard) => item.title || 'Product',
        },
      },
      defaultProps: {
        ...SURFACE_DEFAULTS,
        sectionTitle:       'The Collection',
        sectionDescription: 'Modular products, each refined to a finished standard.',
        products: [
          { title: 'Product One',   description: 'A short, honest description of what this product does.', status: 'available'    as const, cta: 'View' },
          { title: 'Product Two',   description: 'A short, honest description of what this product does.', status: 'available'    as const, cta: 'View' },
          { title: 'Product Three', description: 'A short, honest description of what this product does.', status: 'early_access' as const, cta: 'Join' },
        ],
      } satisfies ProductGridProps,
      render: (props: ProductGridProps) => <ProductGridSection {...props} />,
    },

    // ── Offer Section ────────────────────────────────────────────────────────
    // Puck stores benefits as { text: string }[] (OfferStoredProps).
    // normalizeBenefits converts to string[] at the render boundary only —
    // stored state is never rewritten, so the array field editor always shows correct values.
    'Offer Section': {
      fields: {
        ...SURFACE_FIELDS,
        title:    { type: 'text'     as const, label: 'Section title' },
        problem:  { type: 'textarea' as const, label: 'The problem' },
        solution: { type: 'textarea' as const, label: 'The solution' },
        benefits: {
          type: 'array' as const,
          label: 'Benefits',
          arrayFields: {
            text: { type: 'text' as const, label: 'Benefit' },
          },
          getItemSummary: (item: { text: string }) => item.text || 'Benefit',
        },
      },
      defaultProps: {
        ...SURFACE_DEFAULTS,
        title:    'A clear offer, no noise',
        problem:  'Describe the real friction your buyer experiences before finding you.',
        solution: 'Describe how your product resolves that friction specifically.',
        benefits: [
          { text: 'Benefit one' },
          { text: 'Benefit two' },
          { text: 'Benefit three' },
          { text: 'Benefit four' },
        ],
      } satisfies OfferStoredProps,
      render: (props: OfferStoredProps) => (
        <OfferSection
          {...props}
          benefits={normalizeBenefits(props.benefits)}
        />
      ),
    },

    // ── Screenshot Gallery ───────────────────────────────────────────────────
    'Screenshot Gallery': {
      fields: {
        ...SURFACE_FIELDS,
        title:       { type: 'text'     as const, label: 'Section title' },
        description: { type: 'textarea' as const, label: 'Description' },
        shots: {
          type: 'array' as const,
          label: 'Shots',
          arrayFields: {
            caption: { type: 'text' as const, label: 'Caption' },
          },
          getItemSummary: (item: ShotItem) => item.caption || 'Shot',
        },
      },
      defaultProps: {
        ...SURFACE_DEFAULTS,
        title:       'See it in action',
        description: 'A short line that frames what the visitor is about to see.',
        shots: [
          { caption: 'Caption for screenshot one' },
          { caption: 'Caption for screenshot two' },
          { caption: 'Caption for screenshot three' },
        ],
      } satisfies ScreenshotGalleryProps,
      render: (props: ScreenshotGalleryProps) => <ScreenshotGallerySection {...props} />,
    },

    // ── CTA Section ──────────────────────────────────────────────────────────
    'CTA Section': {
      fields: {
        ...SURFACE_FIELDS,
        headline:        { type: 'text'     as const, label: 'Headline' },
        subheadline:     { type: 'textarea' as const, label: 'Subheadline' },
        primaryAction:   { type: 'text'     as const, label: 'Primary action' },
        secondaryAction: { type: 'text'     as const, label: 'Secondary action' },
        supportText:     { type: 'text'     as const, label: 'Support text' },
      },
      defaultProps: {
        ...SURFACE_DEFAULTS,
        headline:        'Ready when you are.',
        subheadline:     'One sentence that removes hesitation and confirms what the visitor gets next.',
        primaryAction:   'Get started',
        secondaryAction: 'Talk to us',
        supportText:     'No commitment required.',
      } satisfies CTAProps,
      render: (props: CTAProps) => <CTASection {...props} />,
    },

    // ── Nav Bar ──────────────────────────────────────────────────────────────
    'Nav Bar': {
      fields: {
        ...SURFACE_FIELDS,
        logoText: { type: 'text' as const, label: 'Logo text' },
        logoImageUrl: { type: 'text' as const, label: 'Logo image URL (optional)' },
        links: {
          type: 'array' as const,
          label: 'Nav links',
          arrayFields: {
            label: { type: 'text' as const, label: 'Label' },
            href:  { type: 'text' as const, label: 'Href' },
          },
          getItemSummary: (item: CTALink) => item.label || 'Link',
        },
        ctaLabel: { type: 'text' as const, label: 'CTA label' },
        ctaHref:  { type: 'text' as const, label: 'CTA href' },
        position: {
          type: 'select' as const,
          label: 'Position',
          options: [
            { value: 'static', label: 'Static' },
            { value: 'sticky', label: 'Sticky (follows scroll)' },
          ],
        },
      },
      defaultProps: {
        ...SURFACE_DEFAULTS,
        surface: 'surface' as const,
        logoText: 'Brand',
        logoImageUrl: '',
        links: [
          { label: 'Features', href: '#features' },
          { label: 'Pricing',  href: '#pricing'  },
          { label: 'About',    href: '#about'     },
        ],
        ctaLabel: 'Get started',
        ctaHref:  '#',
        position: 'static',
      } satisfies NavBarProps,
      render: (props: NavBarProps) => <NavBarSection {...props} />,
    },

    // ── Logo Strip ───────────────────────────────────────────────────────────
    'Logo Strip': {
      fields: {
        ...SURFACE_FIELDS,
        eyebrow: { type: 'text' as const, label: 'Eyebrow' },
        logos: {
          type: 'array' as const,
          label: 'Logos',
          arrayFields: {
            name:     { type: 'text' as const, label: 'Brand name' },
            imageUrl: { type: 'text' as const, label: 'Image URL (leave blank for text)' },
          },
          getItemSummary: (item: LogoItem) => item.name || 'Logo',
        },
      },
      defaultProps: {
        ...SURFACE_DEFAULTS,
        eyebrow: 'Trusted by leading teams',
        logos: [
          { name: 'Acme Corp',  imageUrl: '' },
          { name: 'Globex',     imageUrl: '' },
          { name: 'Initech',    imageUrl: '' },
          { name: 'Umbrella',   imageUrl: '' },
          { name: 'Vandelay',   imageUrl: '' },
        ],
      } satisfies LogoStripProps,
      render: (props: LogoStripProps) => <LogoStripSection {...props} />,
    },

    // ── Feature Grid ─────────────────────────────────────────────────────────
    'Feature Grid': {
      fields: {
        ...SURFACE_FIELDS,
        eyebrow:     { type: 'text'     as const, label: 'Eyebrow' },
        headline:    { type: 'text'     as const, label: 'Headline' },
        subheadline: { type: 'textarea' as const, label: 'Subheadline' },
        features: {
          type: 'array' as const,
          label: 'Features',
          arrayFields: {
            icon:  { type: 'text'     as const, label: 'Icon (emoji or short text)' },
            title: { type: 'text'     as const, label: 'Title' },
            body:  { type: 'textarea' as const, label: 'Body' },
          },
          getItemSummary: (item: FeatureCard) => item.title || 'Feature',
        },
        columns: {
          type: 'select' as const,
          label: 'Columns',
          options: [
            { value: 2, label: '2 columns' },
            { value: 3, label: '3 columns' },
            { value: 4, label: '4 columns' },
          ],
        },
      },
      defaultProps: {
        ...SURFACE_DEFAULTS,
        eyebrow:     'Features',
        headline:    'Everything you need to succeed.',
        subheadline: 'A short line that adds context to the headline above.',
        features: [
          { icon: '⚡', title: 'Fast setup',        body: 'One sentence that explains the value clearly and concisely.' },
          { icon: '🛡️', title: 'Secure by default', body: 'One sentence that explains the value clearly and concisely.' },
          { icon: '📊', title: 'Insights built in',  body: 'One sentence that explains the value clearly and concisely.' },
        ],
        columns: 3 as ColumnCount,
      } satisfies FeatureGridProps,
      render: (props: FeatureGridProps) => <FeatureGridSection {...props} />,
    },

    // ── Feature Split ────────────────────────────────────────────────────────
    'Feature Split': {
      fields: {
        ...SURFACE_FIELDS,
        eyebrow:  { type: 'text'     as const, label: 'Eyebrow' },
        headline: { type: 'text'     as const, label: 'Headline' },
        body:     { type: 'textarea' as const, label: 'Body' },
        ctaLabel: { type: 'text'     as const, label: 'CTA label' },
        ctaHref:  { type: 'text'     as const, label: 'CTA href' },
        imageUrl: { type: 'text'     as const, label: 'Image URL (leave blank for placeholder)' },
        imageAlt: { type: 'text'     as const, label: 'Image alt text' },
        imagePosition: {
          type: 'select' as const,
          label: 'Image position',
          options: [
            { value: 'left',  label: 'Left' },
            { value: 'right', label: 'Right' },
          ],
        },
      },
      defaultProps: {
        ...SURFACE_DEFAULTS,
        eyebrow:       'How it works',
        headline:      'A specific benefit your buyer gains.',
        body:          'Two or three sentences that explain the benefit in concrete terms. Be specific about the outcome.',
        ctaLabel:      'Learn more',
        ctaHref:       '#',
        imageUrl:      '',
        imageAlt:      '',
        imagePosition: 'right',
      } satisfies FeatureSplitProps,
      render: (props: FeatureSplitProps) => <FeatureSplitSection {...props} />,
    },

    // ── Pricing Table ────────────────────────────────────────────────────────
    'Pricing Table': {
      fields: {
        ...SURFACE_FIELDS,
        eyebrow:     { type: 'text'     as const, label: 'Eyebrow' },
        headline:    { type: 'text'     as const, label: 'Headline' },
        subheadline: { type: 'textarea' as const, label: 'Subheadline' },
        plans: {
          type: 'array' as const,
          label: 'Plans',
          arrayFields: {
            name:        { type: 'text'     as const, label: 'Plan name' },
            price:       { type: 'text'     as const, label: 'Monthly price (e.g. $49/mo)' },
            priceAnnual: { type: 'text'     as const, label: 'Annual price (e.g. $39/mo)' },
            description: { type: 'textarea' as const, label: 'Description' },
            features:    { type: 'textarea' as const, label: 'Features (one per line)' },
            ctaLabel:    { type: 'text'     as const, label: 'CTA label' },
            ctaHref:     { type: 'text'     as const, label: 'CTA href' },
            highlight: {
              type: 'select' as const,
              label: 'Highlight style',
              options: [
                { value: 'none',     label: 'None' },
                { value: 'featured', label: 'Featured (elevated)' },
              ],
            },
            badge: { type: 'text' as const, label: 'Badge text (leave blank to hide)' },
          },
          getItemSummary: (item: PricingPlan) => item.name || 'Plan',
        },
        billingPeriod: {
          type: 'select' as const,
          label: 'Billing period',
          options: [
            { value: 'monthly', label: 'Monthly only' },
            { value: 'both',    label: 'Monthly + Annual toggle' },
          ],
        },
      },
      defaultProps: {
        ...SURFACE_DEFAULTS,
        eyebrow:     'Pricing',
        headline:    'Simple, transparent pricing.',
        subheadline: 'One line that removes a common objection about pricing complexity.',
        plans: [
          {
            name:        'Starter',
            price:       '$0/mo',
            priceAnnual: '',
            description: 'For individuals just getting started.',
            features:    'Core feature one\nCore feature two\nCore feature three',
            ctaLabel:    'Get started free',
            ctaHref:     '#',
            highlight:   'none'    as const,
            badge:       '',
          },
          {
            name:        'Pro',
            price:       '$49/mo',
            priceAnnual: '$39/mo',
            description: 'For growing teams that need more.',
            features:    'Everything in Starter\nPro feature one\nPro feature two\nPro feature three',
            ctaLabel:    'Start free trial',
            ctaHref:     '#',
            highlight:   'featured' as const,
            badge:       'Most Popular',
          },
        ],
        billingPeriod: 'monthly',
      } satisfies PricingTableProps,
      render: (props: PricingTableProps) => <PricingTableSection {...props} />,
    },

    // ── FAQ ──────────────────────────────────────────────────────────────────
    'FAQ': {
      fields: {
        ...SURFACE_FIELDS,
        eyebrow:     { type: 'text'     as const, label: 'Eyebrow' },
        headline:    { type: 'text'     as const, label: 'Headline' },
        subheadline: { type: 'textarea' as const, label: 'Subheadline' },
        items: {
          type: 'array' as const,
          label: 'Items',
          arrayFields: {
            question: { type: 'text'     as const, label: 'Question' },
            answer:   { type: 'textarea' as const, label: 'Answer' },
          },
          getItemSummary: (item: FAQItem) => item.question || 'Question',
        },
        layout: {
          type: 'select' as const,
          label: 'Layout',
          options: [
            { value: 'accordion', label: 'Accordion (stacked)' },
            { value: 'columns',   label: 'Two columns' },
          ],
        },
      },
      defaultProps: {
        ...SURFACE_DEFAULTS,
        eyebrow:     'FAQ',
        headline:    'Questions, answered.',
        subheadline: '',
        items: [
          { question: 'What makes this different from alternatives?', answer: 'A specific, honest answer that addresses the real concern behind the question.' },
          { question: 'How long does setup take?',                    answer: 'A specific, honest answer that addresses the real concern behind the question.' },
          { question: 'Is there a free trial?',                      answer: 'A specific, honest answer that addresses the real concern behind the question.' },
          { question: 'What support do you offer?',                  answer: 'A specific, honest answer that addresses the real concern behind the question.' },
        ],
        layout: 'accordion',
      } satisfies FAQProps,
      render: (props: FAQProps) => <FAQSection {...props} />,
    },

    // ── Testimonials ─────────────────────────────────────────────────────────
    'Testimonials': {
      fields: {
        ...SURFACE_FIELDS,
        eyebrow:  { type: 'text' as const, label: 'Eyebrow' },
        headline: { type: 'text' as const, label: 'Headline' },
        testimonials: {
          type: 'array' as const,
          label: 'Testimonials',
          arrayFields: {
            quote:         { type: 'textarea' as const, label: 'Quote' },
            authorName:    { type: 'text'     as const, label: 'Author name' },
            authorRole:    { type: 'text'     as const, label: 'Role' },
            authorCompany: { type: 'text'     as const, label: 'Company' },
            avatarUrl:     { type: 'text'     as const, label: 'Avatar URL (leave blank for initials)' },
            rating: {
              type: 'number' as const,
              label: 'Star rating (0 = none, 1–5)',
              min: 0,
              max: 5,
              step: 1,
            },
          },
          getItemSummary: (item: TestimonialCard) => item.authorName || 'Testimonial',
        },
        layout: {
          type: 'select' as const,
          label: 'Layout',
          options: [
            { value: 'grid',   label: 'Grid' },
            { value: 'slider', label: 'Horizontal slider' },
          ],
        },
      },
      defaultProps: {
        ...SURFACE_DEFAULTS,
        surface: 'surfaceAlt' as const,
        eyebrow:  'What people are saying',
        headline: 'Trusted by builders worldwide.',
        testimonials: [
          { quote: 'This is exactly what I needed. The results were immediate and undeniable.', authorName: 'Alex Johnson',   authorRole: 'Founder',      authorCompany: 'Acme Inc.',  avatarUrl: '', rating: 5 },
          { quote: 'I was skeptical at first, but the outcome changed my mind completely.',     authorName: 'Jordan Rivera',  authorRole: 'Head of Growth', authorCompany: 'Globex Co.', avatarUrl: '', rating: 5 },
          { quote: 'The team is responsive and the product keeps getting better every month.',  authorName: 'Morgan Lee',    authorRole: 'CTO',           authorCompany: 'Initech',    avatarUrl: '', rating: 5 },
        ],
        layout: 'grid',
      } satisfies TestimonialsProps,
      render: (props: TestimonialsProps) => <TestimonialsSection {...props} />,
    },

    // ── Stats Bar ────────────────────────────────────────────────────────────
    'Stats Bar': {
      fields: {
        ...SURFACE_FIELDS,
        eyebrow: { type: 'text' as const, label: 'Eyebrow' },
        stats: {
          type: 'array' as const,
          label: 'Stats',
          arrayFields: {
            value: { type: 'text' as const, label: 'Value (e.g. "10,000+")' },
            label: { type: 'text' as const, label: 'Label (e.g. "Active users")' },
          },
          getItemSummary: (item: StatItem) => item.value || 'Stat',
        },
      },
      defaultProps: {
        ...SURFACE_DEFAULTS,
        surface: 'surface' as const,
        eyebrow: 'By the numbers',
        stats: [
          { value: '10,000+', label: 'Active users' },
          { value: '99.9%',   label: 'Uptime SLA'   },
          { value: '4.9/5',   label: 'Avg. rating'  },
          { value: '< 24h',   label: 'Avg. response' },
        ],
      } satisfies StatsBarProps,
      render: (props: StatsBarProps) => <StatsBarSection {...props} />,
    },

    // ── Video Embed ──────────────────────────────────────────────────────────
    'Video Embed': {
      fields: {
        ...SURFACE_FIELDS,
        eyebrow:     { type: 'text'     as const, label: 'Eyebrow' },
        headline:    { type: 'text'     as const, label: 'Headline' },
        subheadline: { type: 'textarea' as const, label: 'Subheadline' },
        embedUrl:    { type: 'text'     as const, label: 'Embed URL (full iframe src, not watch URL)' },
        videoTitle:  { type: 'text'     as const, label: 'Video title (for accessibility)' },
        aspectRatio: {
          type: 'select' as const,
          label: 'Aspect ratio',
          options: [
            { value: '16:9', label: '16:9 (widescreen)' },
            { value: '4:3',  label: '4:3 (standard)' },
          ],
        },
      },
      defaultProps: {
        ...SURFACE_DEFAULTS,
        eyebrow:     'See it in action',
        headline:    'Watch the product in under two minutes.',
        subheadline: 'A short line that frames why the video is worth watching.',
        embedUrl:    '',
        videoTitle:  'Product demo',
        aspectRatio: '16:9',
      } satisfies VideoEmbedProps,
      render: (props: VideoEmbedProps) => <VideoEmbedSection {...props} />,
    },

    // ── Newsletter ───────────────────────────────────────────────────────────
    'Newsletter': {
      fields: {
        ...SURFACE_FIELDS,
        eyebrow:          { type: 'text'     as const, label: 'Eyebrow' },
        headline:         { type: 'text'     as const, label: 'Headline' },
        subheadline:      { type: 'textarea' as const, label: 'Subheadline' },
        inputPlaceholder: { type: 'text'     as const, label: 'Input placeholder' },
        ctaLabel:         { type: 'text'     as const, label: 'CTA label' },
        privacyNote:      { type: 'text'     as const, label: 'Privacy note' },
        layout: {
          type: 'select' as const,
          label: 'Layout',
          options: [
            { value: 'centered', label: 'Centered' },
            { value: 'split',    label: 'Split (copy left, form right)' },
          ],
        },
      },
      defaultProps: {
        ...SURFACE_DEFAULTS,
        surface: 'surface' as const,
        eyebrow:          'Stay in the loop',
        headline:         'Get updates before everyone else.',
        subheadline:      'Early access, product announcements, and nothing else.',
        inputPlaceholder: 'Enter your email',
        ctaLabel:         'Subscribe',
        privacyNote:      'No spam. Unsubscribe anytime.',
        layout:           'centered',
      } satisfies NewsletterProps,
      render: (props: NewsletterProps) => <NewsletterSection {...props} />,
    },

    // ── Team Grid ────────────────────────────────────────────────────────────
    'Team Grid': {
      fields: {
        ...SURFACE_FIELDS,
        eyebrow:     { type: 'text'     as const, label: 'Eyebrow' },
        headline:    { type: 'text'     as const, label: 'Headline' },
        subheadline: { type: 'textarea' as const, label: 'Subheadline' },
        members: {
          type: 'array' as const,
          label: 'Members',
          arrayFields: {
            name:      { type: 'text'     as const, label: 'Name' },
            role:      { type: 'text'     as const, label: 'Role' },
            bio:       { type: 'textarea' as const, label: 'Bio' },
            avatarUrl: { type: 'text'     as const, label: 'Avatar URL (leave blank for initials)' },
          },
          getItemSummary: (item: TeamMember) => item.name || 'Member',
        },
        columns: {
          type: 'select' as const,
          label: 'Columns',
          options: [
            { value: 2, label: '2 columns' },
            { value: 3, label: '3 columns' },
            { value: 4, label: '4 columns' },
          ],
        },
      },
      defaultProps: {
        ...SURFACE_DEFAULTS,
        eyebrow:     'The team',
        headline:    'The people behind the product.',
        subheadline: '',
        members: [
          { name: 'Alex Johnson', role: 'Co-Founder & CEO', bio: 'A short bio that gives the person dimension without being a CV.',         avatarUrl: '' },
          { name: 'Jordan Rivera', role: 'Head of Design',  bio: 'A short bio that gives the person dimension without being a CV.',         avatarUrl: '' },
          { name: 'Morgan Lee',   role: 'Lead Engineer',    bio: 'A short bio that gives the person dimension without being a CV.',         avatarUrl: '' },
        ],
        columns: 3 as ColumnCount,
      } satisfies TeamGridProps,
      render: (props: TeamGridProps) => <TeamGridSection {...props} />,
    },

    // ── Content Block ────────────────────────────────────────────────────────
    'Content Block': {
      fields: {
        ...SURFACE_FIELDS,
        eyebrow:  { type: 'text'     as const, label: 'Eyebrow' },
        headline: { type: 'text'     as const, label: 'Headline' },
        body:     { type: 'textarea' as const, label: 'Body text' },
        alignment: {
          type: 'select' as const,
          label: 'Text alignment',
          options: [
            { value: 'left',   label: 'Left' },
            { value: 'center', label: 'Center' },
          ],
        },
        layout: {
          type: 'select' as const,
          label: 'Layout width',
          options: [
            { value: 'prose', label: 'Prose (72ch max — best for reading)' },
            { value: 'wide',  label: 'Wide (full section width)' },
          ],
        },
      },
      defaultProps: {
        ...SURFACE_DEFAULTS,
        eyebrow:   '',
        headline:  'A heading for long-form content.',
        body:      'Write your content here. This section renders body text as-is, preserving line breaks. Use it for about pages, manifestos, legal content, or any narrative that benefits from a clean reading experience.',
        alignment: 'left',
        layout:    'prose',
      } satisfies ContentBlockProps,
      render: (props: ContentBlockProps) => <ContentBlockSection {...props} />,
    },

    // ── Footer ───────────────────────────────────────────────────────────────
    // linkGroups.links is stored as a textarea ("Label | href" per line).
    // parseFooterLinks converts to CTALink[] at the render boundary.
    'Footer': {
      fields: {
        ...SURFACE_FIELDS,
        logoText: { type: 'text'     as const, label: 'Logo text' },
        tagline:  { type: 'textarea' as const, label: 'Tagline' },
        linkGroups: {
          type: 'array' as const,
          label: 'Link groups',
          arrayFields: {
            heading: { type: 'text'     as const, label: 'Group heading' },
            links:   { type: 'textarea' as const, label: 'Links — one "Label | href" per line' },
          },
          getItemSummary: (item: FooterLinkGroupStored) => item.heading || 'Link group',
        },
        copyright: { type: 'text' as const, label: 'Copyright line' },
        socialLinks: {
          type: 'array' as const,
          label: 'Social links',
          arrayFields: {
            label: { type: 'text' as const, label: 'Label' },
            href:  { type: 'text' as const, label: 'Href' },
          },
          getItemSummary: (item: CTALink) => item.label || 'Social link',
        },
      },
      defaultProps: {
        ...SURFACE_DEFAULTS,
        surface: 'surface' as const,
        logoText: 'Brand',
        tagline:  'A short tagline that explains what the brand stands for.',
        linkGroups: [
          { heading: 'Product', links: 'Features | #features\nPricing | #pricing\nChangelog | #changelog' },
          { heading: 'Company', links: 'About | #about\nBlog | #blog\nContact | #contact'               },
          { heading: 'Legal',   links: 'Privacy | #privacy\nTerms | #terms'                             },
        ],
        copyright:   `© ${new Date().getFullYear()} Your Brand. All rights reserved.`,
        socialLinks: [
          { label: 'Twitter',  href: '#' },
          { label: 'LinkedIn', href: '#' },
        ],
      } satisfies FooterStoredProps,
      render: (props: FooterStoredProps) => (
        <FooterSection
          surface={props.surface}
          width={props.width}
          backgroundImageUrl={props.backgroundImageUrl}
          logoText={props.logoText}
          tagline={props.tagline}
          copyright={props.copyright}
          socialLinks={props.socialLinks}
          linkGroups={props.linkGroups.map(
            (g): FooterLinkGroup => ({ heading: g.heading, links: parseFooterLinks(g.links) }),
          )}
        />
      ),
    },

    // ── Card ─────────────────────────────────────────────────────────────────
    'Card': {
      fields: {
        ...SURFACE_FIELDS,
        variant: {
          type: 'select' as const,
          label: 'Variant',
          options: [
            { value: 'solid',   label: 'Solid (filled surface, soft shadow)' },
            { value: 'glass',   label: 'Glass (translucent + backdrop blur)'  },
            { value: 'outline', label: 'Outline (transparent, border only)'   },
            { value: 'image',   label: 'Image (full-bleed background photo)'  },
          ],
        },
        title:          { type: 'text'     as const, label: 'Title' },
        body:           { type: 'textarea' as const, label: 'Body text' },
        eyebrow:        { type: 'text'     as const, label: 'Eyebrow (leave blank to hide)' },
        cardImageUrl:   { type: 'text'     as const, label: 'Card image URL (image variant; assets/… path)' },
        objectImageUrl: { type: 'text'     as const, label: 'Object image URL (floating 3D asset; assets/… path)' },
        ctaLabel:       { type: 'text'     as const, label: 'CTA label (leave blank to hide)' },
        ctaHref:        { type: 'text'     as const, label: 'CTA href' },
      },
      defaultProps: {
        ...SURFACE_DEFAULTS,
        variant:        'solid' as CardVariant,
        title:          'Your headline goes here.',
        body:           'A supporting sentence that gives context and motivates the reader to act.',
        eyebrow:        '',
        cardImageUrl:   '',
        objectImageUrl: '',
        ctaLabel:       'Get started',
        ctaHref:        '#',
      } satisfies CardProps,
      render: CardRender,
    },
  },
};

export const initialData = {
  content: [],
  root: { props: { title: 'New Page' } },
};
