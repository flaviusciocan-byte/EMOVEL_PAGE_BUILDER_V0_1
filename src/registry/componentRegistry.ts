import type { ComponentRegistryEntry } from './componentRegistry.types';

// Registry v1.1 — Components 01–16 (15 GalleryShowcase deferred — requires ShotItem.imageUrl extension).
// Implementation keys are path strings, not direct imports, to avoid
// circular dependency risk between registry and visual components.

export const componentRegistry: Readonly<Record<string, ComponentRegistryEntry>> = {

  HeroSection: {
    registryIndex: 1,
    registryName: 'HeroSection',
    implementationKey: 'components/sections/HeroSection',
    status: 'implemented',
    category: 'hero',
    requiresAssets: false,
  },

  TrustStrip: {
    registryIndex: 2,
    registryName: 'TrustStrip',
    implementationKey: 'builder/sections/LogoStripSection',
    status: 'implemented',
    category: 'trust',
    requiresAssets: false,
    notes: 'StatsBarSection (builder/sections/StatsBarSection) is also available for metrics-based trust signals.',
  },

  FeatureGrid: {
    registryIndex: 3,
    registryName: 'FeatureGrid',
    implementationKey: 'builder/sections/CardSection',
    status: 'implemented',
    category: 'features',
    requiresAssets: false,
    notes: 'Registry v1.1 explicit mapping: FeatureGrid → CardSection. FeatureGridSection also exists as a supplementary feature-card grid.',
  },

  ProductShowcase: {
    registryIndex: 4,
    registryName: 'ProductShowcase',
    implementationKey: 'builder/sections/ProductGridSection',
    status: 'implemented',
    category: 'product',
    requiresAssets: false,
  },

  PricingSection: {
    registryIndex: 5,
    registryName: 'PricingSection',
    implementationKey: 'builder/sections/PricingTableSection',
    status: 'implemented',
    category: 'pricing',
    requiresAssets: false,
  },

  FAQSection: {
    registryIndex: 6,
    registryName: 'FAQSection',
    implementationKey: 'builder/sections/FAQSection',
    status: 'implemented',
    category: 'faq',
    requiresAssets: false,
  },

  CTASection: {
    registryIndex: 7,
    registryName: 'CTASection',
    implementationKey: 'builder/sections/CTASection',
    status: 'implemented',
    category: 'cta',
    requiresAssets: false,
  },

  DashboardPreview: {
    registryIndex: 8,
    registryName: 'DashboardPreview',
    implementationKey: null,
    status: 'notImplemented',
    category: 'dashboard',
    requiresAssets: true,
    notes: 'No existing dashboard preview component. Requires a real dashboard screenshot or live embed asset.',
  },

  WorkflowTimeline: {
    registryIndex: 9,
    registryName: 'WorkflowTimeline',
    implementationKey: null,
    status: 'notImplemented',
    category: 'timeline',
    requiresAssets: false,
    notes: 'No existing workflow or timeline component.',
  },

  ThreeDShowcase: {
    registryIndex: 10,
    registryName: 'ThreeDShowcase',
    implementationKey: null,
    status: 'notImplemented',
    category: 'showcase',
    requiresAssets: true,
    notes: 'No existing 3D showcase component. Requires real 3D model or rendered asset.',
  },


  NavigationBar: {
    registryIndex: 11,
    registryName: 'NavigationBar',
    implementationKey: 'builder/sections/NavBarSection',
    status: 'implemented',
    category: 'structure',
    requiresAssets: false,
    notes: 'logoVariant and transparency added. hide-on-scroll intentionally deferred — requires JS scroll handler.',
  },

  FooterSection: {
    registryIndex: 12,
    registryName: 'FooterSection',
    implementationKey: 'builder/sections/FooterSection',
    status: 'implemented',
    category: 'structure',
    requiresAssets: false,
    notes: 'newsletter is a presentational slot only — not connected to a provider.',
  },

  // ── 13–16 ────────────────────────────────────────────────────────────────────

  TestimonialSection: {
    registryIndex: 13,
    registryName: 'TestimonialSection',
    implementationKey: 'builder/sections/TestimonialsSection',
    status: 'implemented',
    category: 'testimonials',
    requiresAssets: false,
    notes: 'Existing TestimonialsSection is adopted as Registry v1.1 TestimonialSection.',
  },

  EditorialSection: {
    registryIndex: 14,
    registryName: 'EditorialSection',
    implementationKey: 'builder/sections/FeatureSplitSection',
    status: 'implemented',
    category: 'editorial',
    requiresAssets: false,
    notes: 'Existing FeatureSplitSection is adopted pragmatically as EditorialSection for image-plus-copy editorial layouts. Dedicated EditorialSection may be created later if needed.',
  },

  GalleryShowcase: {
    registryIndex: 15,
    registryName: 'GalleryShowcase',
    implementationKey: 'builder/sections/ScreenshotGallerySection',
    status: 'implemented',
    category: 'gallery',
    requiresAssets: true,
    notes: 'Existing ScreenshotGallerySection is upgraded and adopted as GalleryShowcase using real local imageUrl assets. Advanced aspect/layout/lightbox/captionMode controls are deferred. Empty-state policy: requires at least one shot with non-empty imageUrl.',
  },

  LeadCapture: {
    registryIndex: 16,
    registryName: 'LeadCapture',
    implementationKey: 'builder/sections/NewsletterSection',
    status: 'implemented',
    category: 'lead',
    requiresAssets: false,
    notes: 'Existing NewsletterSection is adopted as email-focused LeadCapture. Multi-field lead forms are deferred.',
  },

} as const;
