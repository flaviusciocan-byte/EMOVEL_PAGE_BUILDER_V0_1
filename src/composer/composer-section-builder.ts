// Composer Section Builder — produces Puck-compatible props for each supported component.
// Props are designed to pass pageSchemaToPuckData without normalization.
// Only the Registry Composer v1 supported set is handled; unsupported names throw.

import type { ComposerStrategyProfile, PageType } from './composer-strategy';

// ── Asset pool ────────────────────────────────────────────────────────────────
// Exact paths from public/assets/references/ASSET_INDEX.md.
// Always use assets/ prefix (not /assets/) for validator compatibility.

export const GALLERY_ASSETS = [
  'assets/references/emovel-reference-zimage-00007.png',
  'assets/references/emovel-reference-zimage-00008.png',
  'assets/references/emovel-reference-zimage-00009.png',
] as const;

// ── Navigation labels per page type ──────────────────────────────────────────

const NAV_LINKS_BY_PAGE_TYPE: Record<PageType, Array<{ label: string; href: string }>> = {
  saas:      [
    { label: 'Features', href: '#features' },
    { label: 'Pricing',  href: '#pricing'  },
    { label: 'About',    href: '#about'    },
  ],
  landing:   [
    { label: 'About', href: '#about' },
    { label: 'FAQ',   href: '#faq'   },
  ],
  portfolio: [
    { label: 'Work',    href: '#work'    },
    { label: 'About',   href: '#about'   },
    { label: 'Contact', href: '#contact' },
  ],
  product:   [
    { label: 'Products', href: '#products' },
    { label: 'About',    href: '#about'    },
    { label: 'Contact',  href: '#contact'  },
  ],
  about:     [
    { label: 'Team',    href: '#team'    },
    { label: 'Story',   href: '#story'   },
    { label: 'Contact', href: '#contact' },
  ],
};

// ── Hero title / subtitle templates ──────────────────────────────────────────

const HERO_TITLE_BY_PAGE_TYPE: Record<PageType, (brandName: string) => string> = {
  saas:      (b) => `${b} — Build smarter, ship faster.`,
  landing:   (b) => `${b} — Join the next generation.`,
  portfolio: (_) => 'Work that speaks for itself.',
  product:   (b) => `${b} — Quality you can feel.`,
  about:     (b) => `The people behind ${b}.`,
};

const HERO_SUBTITLE_BY_PAGE_TYPE: Record<PageType, (brandName: string, audience: string) => string> = {
  saas:      (b, a) => `A complete platform for ${a} who need to ship without friction. ${b} handles the complexity.`,
  landing:   (b, a) => `Be among the first ${a} to experience what ${b} can do. Limited spots available.`,
  portfolio: (_, a) => `Crafted work for ${a}. Every project delivered to an uncompromising standard.`,
  product:   (b, a) => `Premium quality for ${a}. ${b} is built to the detail that matters.`,
  about:     (b, a) => `Meet the team building ${b} for ${a}. Driven by craft, not convention.`,
};

const CTA_HEADLINE_BY_TONE: Record<string, (brandName: string) => string> = {
  premium:   (b) => `Ready to experience ${b}?`,
  technical: (b) => `Start building with ${b} today.`,
  direct:    (b) => `Join ${b} — it takes under a minute.`,
};

// ── Per-component builders ────────────────────────────────────────────────────

function buildNavigationBar(profile: ComposerStrategyProfile): Record<string, unknown> {
  return {
    logoText:         profile.brand.name,
    links:            NAV_LINKS_BY_PAGE_TYPE[profile.pageType],
    ctaLabel:         profile.primaryCTA.label,
    ctaHref:          profile.primaryCTA.href,
    position:         'sticky',
    width:            'contained',
    backgroundImageUrl: '',
    // surface intentionally omitted — Puck default 'surface' is not a Registry value
  };
}

function buildHeroSection(profile: ComposerStrategyProfile): Record<string, unknown> {
  const eyebrowByTone: Record<string, string> = {
    premium:   profile.brand.name,
    technical: `Built for ${profile.audience}`,
    direct:    `Now live — ${profile.brand.name}`,
  };

  return {
    eyebrow:             eyebrowByTone[profile.tone] ?? profile.brand.name,
    title:               HERO_TITLE_BY_PAGE_TYPE[profile.pageType](profile.brand.name),
    subtitle:            HERO_SUBTITLE_BY_PAGE_TYPE[profile.pageType](profile.brand.name, profile.audience),
    primaryCtaLabel:     profile.primaryCTA.label,
    primaryCtaHref:      profile.primaryCTA.href,
    secondaryCtaLabel:   profile.secondaryCTA.label,
    secondaryCtaHref:    profile.secondaryCTA.href,
    motionPattern:       'depth-push',
    enableCinematicLogo: 'true',
    backgroundImageUrl:  '',
    brandImageUrl:       '',
    width:               'contained',
    // surface intentionally omitted — Puck default 'transparent' is not a Registry value
  };
}

function buildGalleryShowcase(profile: ComposerStrategyProfile): Record<string, unknown> {
  const descByPageType: Record<PageType, string> = {
    saas:      `Every detail of ${profile.brand.name} — from the clean interface to the powerful features beneath.`,
    landing:   `A preview of what's coming. Built for ${profile.audience} who demand more.`,
    portfolio: 'Selected work — each project crafted to an uncompromising standard.',
    product:   `A closer look at the quality and detail that defines every ${profile.brand.name} product.`,
    about:     `A look inside how we work at ${profile.brand.name}. Process, precision, and people.`,
  };

  return {
    title:       `See ${profile.brand.name} in action`,
    description: descByPageType[profile.pageType],
    shots: [
      {
        caption:  `${profile.brand.name} — overview`,
        imageUrl: GALLERY_ASSETS[0],
        alt:      `${profile.brand.name} interface — primary view`,
      },
      {
        caption:  `${profile.brand.name} — features`,
        imageUrl: GALLERY_ASSETS[1],
        alt:      `${profile.brand.name} interface — feature detail`,
      },
      {
        caption:  `${profile.brand.name} — detail`,
        imageUrl: GALLERY_ASSETS[2],
        alt:      `${profile.brand.name} interface — workflow close-up`,
      },
    ],
    width:              'contained',
    backgroundImageUrl: '',
    // surface intentionally omitted — Puck default 'transparent' is not a Registry value
  };
}

function buildTestimonialSection(profile: ComposerStrategyProfile): Record<string, unknown> {
  return {
    eyebrow:  'What our users say',
    headline: `Trusted by teams that build with ${profile.brand.name}.`,
    testimonials: [
      {
        quote:         `${profile.brand.name} changed how our team operates. The results were immediate and measurable.`,
        authorName:    'Alex Johnson',
        authorRole:    'Founder',
        authorCompany: 'Studio One',
        avatarUrl:     '',
        rating:        5,
      },
      {
        quote:         `We evaluated three alternatives. ${profile.brand.name} was the only one that actually delivered.`,
        authorName:    'Jordan Rivera',
        authorRole:    'Head of Product',
        authorCompany: 'Meridian Co.',
        avatarUrl:     '',
        rating:        5,
      },
      {
        quote:         `The quality of the output is what convinced our stakeholders. ${profile.brand.name} delivers.`,
        authorName:    'Morgan Lee',
        authorRole:    'Lead Engineer',
        authorCompany: 'Vaulted Labs',
        avatarUrl:     '',
        rating:        5,
      },
    ],
    layout:             'grid',
    width:              'contained',
    backgroundImageUrl: '',
    // surface intentionally omitted — Puck default 'surfaceAlt' is not a Registry value
  };
}

function buildCTASection(profile: ComposerStrategyProfile): Record<string, unknown> {
  const headlineFn = CTA_HEADLINE_BY_TONE[profile.tone] ?? CTA_HEADLINE_BY_TONE['premium'];
  return {
    headline:        headlineFn(profile.brand.name),
    subheadline:     `Join ${profile.audience} who use ${profile.brand.name} to build with confidence.`,
    primaryAction:   profile.primaryCTA.label,
    secondaryAction: profile.secondaryCTA.label,
    supportText:     'No commitment required.',
    surface:         'inverted',  // valid Registry value; creates conversion contrast
    width:           'contained',
    backgroundImageUrl: '',
  };
}

function buildLeadCapture(profile: ComposerStrategyProfile): Record<string, unknown> {
  return {
    eyebrow:          'Stay in the loop',
    headline:         `Get ${profile.brand.name} updates`,
    subheadline:      'Early access, new features, and announcements — directly to you.',
    inputPlaceholder: 'Enter your email',
    ctaLabel:         'Subscribe',
    privacyNote:      'No spam. Unsubscribe anytime.',
    layout:           'centered',
    width:            'contained',
    backgroundImageUrl: '',
    // surface intentionally omitted — Puck default 'surface' is not a Registry value
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export function buildSectionProps(
  registryName: string,
  profile:      ComposerStrategyProfile,
  _index:       number,
): Record<string, unknown> {
  switch (registryName) {
    case 'NavigationBar':      return buildNavigationBar(profile);
    case 'HeroSection':        return buildHeroSection(profile);
    case 'GalleryShowcase':    return buildGalleryShowcase(profile);
    case 'TestimonialSection': return buildTestimonialSection(profile);
    case 'CTASection':         return buildCTASection(profile);
    case 'LeadCapture':        return buildLeadCapture(profile);
    default:
      throw new Error(
        `buildSectionProps: no builder for registry component "${registryName}". ` +
        `Only Composer v1 supported components are allowed.`,
      );
  }
}
