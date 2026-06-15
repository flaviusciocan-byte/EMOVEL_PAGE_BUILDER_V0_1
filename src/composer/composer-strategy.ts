// Composer Strategy — deterministic intent classification.
// No external API. Synchronous. Pure function.

export type PageType    = 'saas' | 'landing' | 'portfolio' | 'product' | 'about';
export type ComposerTone = 'premium' | 'technical' | 'direct';

export interface ComposerStrategyProfile {
  pageType:        PageType;
  brand:           { name: string; tagline: string };
  audience:        string;
  heroAction:      { verb: string; object: string } | null;
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

// ── Commercial copy extraction ───────────────────────────────────────────────

const ACTION_VERBS = [
  'automate',
  'streamline',
  'launch',
  'build',
  'manage',
  'convert',
  'organize',
  'scale',
] as const;

const GERUND_TO_VERB: Record<string, string> = {
  automating:  'automate',
  streamlining: 'streamline',
  launching:   'launch',
  building:    'build',
  managing:    'manage',
  converting:  'convert',
  organizing:  'organize',
  scaling:     'scale',
};

const PAST_TO_VERB: Record<string, string> = {
  automated:  'automate',
  streamlined: 'streamline',
  launched:   'launch',
  built:      'build',
  managed:    'manage',
  converted:  'convert',
  organized:  'organize',
  scaled:     'scale',
};

function cleanPhrase(value: string): string {
  return value
    .replace(/[.!?]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function humanizeOfferObject(rawObject: string): string {
  const object = cleanPhrase(rawObject)
    .replace(/^the\s+/, '')
    .replace(/^(their|your|our)\s+/, '');

  if (/^intake$/.test(object)) return 'patient intake';
  if (/^forms?$/.test(object)) return 'digital forms';
  if (/^leads?$/.test(object)) return 'lead conversion';
  if (/^workflows?$/.test(object)) return 'team workflows';
  if (/^operations?$/.test(object)) return 'daily operations';

  return object || 'workflows';
}

function preferCommercialVerb(verb: string, object: string): string {
  const normalizedVerb = cleanPhrase(verb);
  const normalizedObject = cleanPhrase(object);

  if (/intake|workflow|operations?|process/.test(normalizedObject)) return 'streamline';
  if (/site|page|landing|app|product/.test(normalizedObject)) return 'launch';
  if (/lead|signup|visitor|conversion/.test(normalizedObject)) return 'convert';
  if (/content|task|data|file/.test(normalizedObject)) return 'organize';
  if (/team|project|client|clinic|practice/.test(normalizedObject)) return 'manage';
  if (/growth|revenue|business/.test(normalizedObject)) return 'scale';

  if (normalizedVerb in GERUND_TO_VERB) return GERUND_TO_VERB[normalizedVerb];
  if (normalizedVerb in PAST_TO_VERB) return PAST_TO_VERB[normalizedVerb];
  if ((ACTION_VERBS as readonly string[]).includes(normalizedVerb)) return normalizedVerb;
  return 'streamline';
}

function extractAudience(prompt: string, pageType: PageType): string {
  const lower = prompt.toLowerCase();
  const patterns = [
    /helps?\s+([a-z][a-z\s-]{2,60}?)\s+(?:automated?|automating|streamline|streamlining|launch|launching|build|building|manage|managing|convert|converting|organize|organizing|scale|scaling)\b/,
    /for\s+[A-Z][A-Za-z0-9]+\s+(?:that\s+)?helps?\s+([a-z][a-z\s-]{2,60}?)\s+/,
    /for\s+([a-z][a-z\s-]{2,50}?)(?:\s+who\b|\s+that\b|[.,]|$)/,
  ];

  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match?.[1]) {
      const audience = cleanPhrase(match[1]).replace(/^(the|a|an)\s+/, '');
      if (audience && !/^(landing page|page|website|site)$/.test(audience)) return audience;
    }
  }

  if (/clinic|patient|intake/.test(lower)) return 'clinic managers';
  return AUDIENCE_BY_PAGE_TYPE[pageType];
}

function extractHeroAction(prompt: string): { verb: string; object: string } | null {
  const patterns = [
    /helps?\s+[a-z][a-z\s-]{2,60}?\s+(automated?|automating|streamline|streamlining|launch|launching|build|building|manage|managing|convert|converting|organize|organizing|scale|scaling)\s+([a-z][a-z\s-]{2,80})/i,
    /(?:to|for)\s+(automated?|automating|streamline|streamlining|launch|launching|build|building|manage|managing|convert|converting|organize|organizing|scale|scaling)\s+([a-z][a-z\s-]{2,80})/i,
  ];

  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match?.[1] && match[2]) {
      const object = humanizeOfferObject(match[2]);
      return { verb: preferCommercialVerb(match[1], object), object };
    }
  }

  if (/intake/.test(prompt.toLowerCase())) return { verb: 'streamline', object: 'patient intake' };
  return null;
}

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

  const brandName  = extractBrandName(prompt);
  const ctas       = CTA_BY_PAGE_TYPE[pageType];
  const audience   = extractAudience(prompt, pageType);
  const heroAction = extractHeroAction(prompt);

  return {
    pageType,
    brand: {
      name:    brandName,
      tagline: TAGLINE_BY_PAGE_TYPE[pageType],
    },
    audience,
    heroAction,
    primaryCTA:  ctas.primary,
    secondaryCTA: ctas.secondary,
    tone,
    hasGallery,
    hasTestimonials,
    hasPricing,
    hasNewsletter,
  };
}
