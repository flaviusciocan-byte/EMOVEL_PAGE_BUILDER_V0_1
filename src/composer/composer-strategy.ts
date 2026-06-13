// Composer Strategy — deterministic intent classification.
// No external API. Synchronous. Pure function.

export type PageType    = 'saas' | 'landing' | 'portfolio' | 'product' | 'about';
export type ComposerTone = 'premium' | 'technical' | 'direct';

export interface ComposerStrategyProfile {
  pageType:        PageType;
  brand:           { name: string; tagline: string };
  audience:        string;
  primaryCTA:      { label: string; href: string };
  secondaryCTA:    { label: string; href: string };
  tone:            ComposerTone;
  hasGallery:      boolean;
  hasTestimonials: boolean;
  hasPricing:      boolean;
  hasNewsletter:   boolean;
}

// ── Brand extraction ─────────────────────────────────────────────────────────

function extractBrandName(prompt: string): string {
  // Looks for uppercase-starting word following known lead-in phrases.
  const patterns: RegExp[] = [
    /\bfor\s+([A-Z][A-Za-z0-9]+)/,
    /\bcalled\s+([A-Z][A-Za-z0-9]+)/,
    /\bbrand\s+([A-Z][A-Za-z0-9]+)/,
  ];
  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match?.[1]) return match[1];
  }
  return 'EMOVEL';
}

// ── Stable CTA pairs per page type ───────────────────────────────────────────

type CTAPair = { primary: { label: string; href: string }; secondary: { label: string; href: string } };

const CTA_BY_PAGE_TYPE: Record<PageType, CTAPair> = {
  saas:      {
    primary:   { label: 'Get started',       href: '#get-started' },
    secondary: { label: 'See how it works',  href: '#demo'        },
  },
  landing:   {
    primary:   { label: 'Join the waitlist', href: '#waitlist'    },
    secondary: { label: 'Learn more',        href: '#features'    },
  },
  portfolio: {
    primary:   { label: 'View work',         href: '#work'        },
    secondary: { label: 'Contact',           href: '#contact'     },
  },
  product:   {
    primary:   { label: 'Shop now',          href: '#shop'        },
    secondary: { label: 'Browse catalog',    href: '#catalog'     },
  },
  about:     {
    primary:   { label: 'Meet the team',     href: '#team'        },
    secondary: { label: 'Our story',         href: '#story'       },
  },
};

const TAGLINE_BY_PAGE_TYPE: Record<PageType, string> = {
  saas:      'Build faster. Ship with confidence.',
  landing:   'Be the first to experience the future.',
  portfolio: 'Work that speaks for itself.',
  product:   'Quality you can feel.',
  about:     'The people behind the product.',
};

const AUDIENCE_BY_PAGE_TYPE: Record<PageType, string> = {
  saas:      'software teams and builders',
  landing:   'early adopters and innovators',
  portfolio: 'clients and collaborators',
  product:   'buyers and enthusiasts',
  about:     'candidates and partners',
};

// ── Main classifier ───────────────────────────────────────────────────────────

export function classifyIntent(prompt: string): ComposerStrategyProfile {
  const lower = prompt.toLowerCase();

  // ── Feature flags ───────────────────────────────────────────────────────────

  const hasGallery = /\b(gallery|screenshot|screenshots|showcase|demo|preview)\b/.test(lower);

  const hasTestimonials =
    /\b(testimonial|testimonials|review|reviews|social\s+proof|customers\s+say|users\s+say)\b/.test(lower);

  const hasPricing =
    /\b(pricing|plans|billing|subscription|tier|tiers)\b/.test(lower);

  const hasNewsletter =
    /\b(newsletter|waitlist|signup|mailing)\b/.test(lower) ||
    /\bemail\s+list\b/.test(lower) ||
    /\bsign\s+up\b/.test(lower) ||
    /\bsubscribe\b/.test(lower);

  // ── Page type (priority order) ──────────────────────────────────────────────

  let pageType: PageType = 'saas';
  if (/\bportfolio\b/.test(lower)) {
    pageType = 'portfolio';
  } else if (/\b(about|team|company|founder|founders|mission|story)\b/.test(lower)) {
    pageType = 'about';
  } else if (/\b(product|shop|store|ecommerce|e-commerce|catalog)\b/.test(lower)) {
    pageType = 'product';
  } else if (/\b(landing|launch|waitlist|coming\s+soon|early\s+access|announce)\b/.test(lower)) {
    pageType = 'landing';
  }

  // ── Tone ────────────────────────────────────────────────────────────────────

  let tone: ComposerTone = 'premium';
  if (/\b(enterprise|b2b|professional|agency|compliance|corporate)\b/.test(lower)) {
    tone = 'technical';
  } else if (/\b(startup|launch|waitlist|join\s+us|early|beta|first)\b/.test(lower)) {
    tone = 'direct';
  }

  const brandName = extractBrandName(prompt);
  const ctas      = CTA_BY_PAGE_TYPE[pageType];

  return {
    pageType,
    brand: {
      name:    brandName,
      tagline: TAGLINE_BY_PAGE_TYPE[pageType],
    },
    audience:    AUDIENCE_BY_PAGE_TYPE[pageType],
    primaryCTA:  ctas.primary,
    secondaryCTA: ctas.secondary,
    tone,
    hasGallery,
    hasTestimonials,
    hasPricing,
    hasNewsletter,
  };
}
