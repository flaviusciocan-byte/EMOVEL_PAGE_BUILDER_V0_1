// Composer Strategy — deterministic intent classification.
// No external API. Synchronous. Pure function.

export type PageType = "saas" | "landing" | "portfolio" | "product" | "about";
export type ComposerTone = "premium" | "technical" | "direct";

export interface ComposerBrief {
  productName: string;
  industry: string;
  audiencePhrase: string;
  offer: string;
  differentiators: string[];
  proofPoints: string[];
  ctaIntent: string;
  pricingHint: string;
}

export interface ComposerStrategyProfile {
  pageType: PageType;
  brand: { name: string; tagline: string };
  audience: string;
  primaryCTA: { label: string; href: string };
  secondaryCTA: { label: string; href: string };
  tone: ComposerTone;
  hasGallery: boolean;
  hasTestimonials: boolean;
  hasPricing: boolean;
  hasNewsletter: boolean;
  brief: ComposerBrief;
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
  return "EMOVEL";
}

function cleanPhrase(value: string): string {
  return value
    .replace(/[.!?]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function firstMatch(prompt: string, patterns: RegExp[]): string | undefined {
  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    const value = match?.[1] ? cleanPhrase(match[1]) : "";
    if (value) return value;
  }
  return undefined;
}

function splitList(value: string): string[] {
  return value
    .split(/,|\band\b|\bwith\b/i)
    .map((item) => cleanPhrase(item))
    .filter(Boolean)
    .slice(0, 3);
}

function extractIndustry(prompt: string, pageType: PageType): string {
  const lower = prompt.toLowerCase();
  if (/\b(fintech|finance|banking|payments)\b/.test(lower))
    return "financial services";
  if (/\b(health|healthcare|clinic|wellness)\b/.test(lower))
    return "healthcare";
  if (/\b(real estate|property|realtor)\b/.test(lower)) return "real estate";
  if (/\b(restaurant|food|coffee|cafe)\b/.test(lower))
    return "food and hospitality";
  if (/\b(ai|automation|developer|devops|software)\b/.test(lower))
    return "software";

  const explicit = firstMatch(prompt, [
    /\b(?:for|in|serving)\s+(?:the\s+)?([a-z][a-z\s-]+?)\s+(?:industry|market|teams|companies|brands|businesses)\b/i,
    /\b([a-z][a-z\s-]+?)\s+(?:saas|platform|app|software|shop|store|product)\b/i,
  ]);
  if (explicit && !/^(create|build|make|a|an|the)$/i.test(explicit))
    return explicit.toLowerCase();

  const fallback: Record<PageType, string> = {
    saas: "software",
    landing: "digital products",
    portfolio: "creative services",
    product: "commerce",
    about: "professional services",
  };
  return fallback[pageType];
}

function extractAudiencePhrase(prompt: string, pageType: PageType): string {
  const explicit = firstMatch(prompt, [
    /\b(?:for|helping|serves|serving)\s+([a-z][a-z\s-]+?)\s+(?:who|to|with|that|$)/i,
    /\b(?:targeting|aimed at)\s+([a-z][a-z\s-]+?)(?:\s+with|\s+who|[.!?]|$)/i,
  ]);
  if (explicit && !/^(a|an|the|create|build|make)$/i.test(explicit))
    return explicit.toLowerCase();
  return AUDIENCE_BY_PAGE_TYPE[pageType];
}

function extractOffer(
  prompt: string,
  pageType: PageType,
  brandName: string,
): string {
  const explicit = firstMatch(prompt, [
    /\bwho\s+need\s+(.+?)(?:\s+with\s+|[.!?]|$)/i,
    /\b(?:helps?|to)\s+(.+?)(?:\s+with\s+|[.!?]|$)/i,
    /\b(?:offers?|selling|sell|promotes?)\s+(.+?)(?:\s+for\s+|\s+to\s+|\s+with\s+|[.!?]|$)/i,
  ]);
  if (explicit && explicit.length <= 80) return explicit.toLowerCase();
  const fallback: Record<PageType, string> = {
    saas: "a faster way to launch and manage work",
    landing: "early access to a focused new experience",
    portfolio: "high-quality creative work",
    product: "premium products built for everyday use",
    about: `a clear look at the people behind ${brandName}`,
  };
  return fallback[pageType];
}

function extractDifferentiators(prompt: string, tone: ComposerTone): string[] {
  const explicit = firstMatch(prompt, [
    /\b(?:with|featuring|includes?|including)\s+(.+?)(?:[.!?]|$)/i,
    /\b(?:differentiat(?:or|ors|es)|unique because|unlike others,?)\s+(.+?)(?:[.!?]|$)/i,
  ]);
  const items = explicit ? splitList(explicit) : [];
  if (items.length > 0) return items;
  return tone === "technical"
    ? ["reliable workflows", "scalable controls", "clear reporting"]
    : ["polished experience", "fast setup", "measurable results"];
}

function extractProofPoints(prompt: string): string[] {
  const explicit = firstMatch(prompt, [
    /\b(?:trusted by|used by|proof|customers include|backed by)\s+(.+?)(?:[.!?]|$)/i,
  ]);
  const items = explicit ? splitList(explicit) : [];
  return items.length > 0
    ? items
    : ["built for real teams", "designed around practical outcomes"];
}

function extractCtaIntent(prompt: string, pageType: PageType): string {
  const lower = prompt.toLowerCase();
  if (/\b(book|schedule)\s+(a\s+)?(demo|call)\b/.test(lower))
    return "Book a demo";
  if (/\b(start|free)\s+trial\b/.test(lower)) return "Start a free trial";
  if (/\b(join|waitlist|early access)\b/.test(lower))
    return "Join the waitlist";
  if (/\b(shop|buy|order)\b/.test(lower)) return "Shop now";
  return CTA_BY_PAGE_TYPE[pageType].primary.label;
}

function extractPricingHint(prompt: string): string {
  const explicit = firstMatch(prompt, [
    /\b(?:starting at|starts at|from)\s+(\$?\d+[\w./-]*)/i,
    /\b(\$\d+[\w./-]*)/i,
  ]);
  if (explicit) return explicit;
  if (/\bfree\b/i.test(prompt)) return "Free starter option";
  if (/\benterprise\b/i.test(prompt)) return "Enterprise-ready plans";
  return "Simple monthly plans";
}

function buildComposerBrief(
  prompt: string,
  pageType: PageType,
  brandName: string,
  tone: ComposerTone,
): ComposerBrief {
  return {
    productName: brandName,
    industry: extractIndustry(prompt, pageType),
    audiencePhrase: extractAudiencePhrase(prompt, pageType),
    offer: extractOffer(prompt, pageType, brandName),
    differentiators: extractDifferentiators(prompt, tone),
    proofPoints: extractProofPoints(prompt),
    ctaIntent: extractCtaIntent(prompt, pageType),
    pricingHint: extractPricingHint(prompt),
  };
}

// ── Stable CTA pairs per page type ───────────────────────────────────────────

type CTAPair = {
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
};

const CTA_BY_PAGE_TYPE: Record<PageType, CTAPair> = {
  saas: {
    primary: { label: "Get started", href: "#get-started" },
    secondary: { label: "See how it works", href: "#demo" },
  },
  landing: {
    primary: { label: "Join the waitlist", href: "#waitlist" },
    secondary: { label: "Learn more", href: "#features" },
  },
  portfolio: {
    primary: { label: "View work", href: "#work" },
    secondary: { label: "Contact", href: "#contact" },
  },
  product: {
    primary: { label: "Shop now", href: "#shop" },
    secondary: { label: "Browse catalog", href: "#catalog" },
  },
  about: {
    primary: { label: "Meet the team", href: "#team" },
    secondary: { label: "Our story", href: "#story" },
  },
};

const TAGLINE_BY_PAGE_TYPE: Record<PageType, string> = {
  saas: "Build faster. Ship with confidence.",
  landing: "Be the first to experience the future.",
  portfolio: "Work that speaks for itself.",
  product: "Quality you can feel.",
  about: "The people behind the product.",
};

const AUDIENCE_BY_PAGE_TYPE: Record<PageType, string> = {
  saas: "software teams and builders",
  landing: "early adopters and innovators",
  portfolio: "clients and collaborators",
  product: "buyers and enthusiasts",
  about: "candidates and partners",
};

// ── Main classifier ───────────────────────────────────────────────────────────

export function classifyIntent(prompt: string): ComposerStrategyProfile {
  const lower = prompt.toLowerCase();

  // ── Feature flags ───────────────────────────────────────────────────────────

  const hasGallery =
    /\b(gallery|screenshot|screenshots|showcase|demo|preview)\b/.test(lower);

  const hasTestimonials =
    /\b(testimonial|testimonials|review|reviews|social\s+proof|customers\s+say|users\s+say)\b/.test(
      lower,
    );

  const hasPricing = /\b(pricing|plans|billing|subscription|tier|tiers)\b/.test(
    lower,
  );

  const hasNewsletter =
    /\b(newsletter|waitlist|signup|mailing)\b/.test(lower) ||
    /\bemail\s+list\b/.test(lower) ||
    /\bsign\s+up\b/.test(lower) ||
    /\bsubscribe\b/.test(lower);

  // ── Page type (priority order) ──────────────────────────────────────────────

  let pageType: PageType = "saas";
  if (/\bportfolio\b/.test(lower)) {
    pageType = "portfolio";
  } else if (
    /\b(about|team|company|founder|founders|mission|story)\b/.test(lower)
  ) {
    pageType = "about";
  } else if (
    /\b(product|shop|store|ecommerce|e-commerce|catalog)\b/.test(lower)
  ) {
    pageType = "product";
  } else if (
    /\b(landing|launch|waitlist|coming\s+soon|early\s+access|announce)\b/.test(
      lower,
    )
  ) {
    pageType = "landing";
  }

  // ── Tone ────────────────────────────────────────────────────────────────────

  let tone: ComposerTone = "premium";
  if (
    /\b(enterprise|b2b|professional|agency|compliance|corporate)\b/.test(lower)
  ) {
    tone = "technical";
  } else if (
    /\b(startup|launch|waitlist|join\s+us|early|beta|first)\b/.test(lower)
  ) {
    tone = "direct";
  }

  const brandName = extractBrandName(prompt);
  const ctas = CTA_BY_PAGE_TYPE[pageType];
  const brief = buildComposerBrief(prompt, pageType, brandName, tone);

  return {
    pageType,
    brand: {
      name: brandName,
      tagline: TAGLINE_BY_PAGE_TYPE[pageType],
    },
    audience: AUDIENCE_BY_PAGE_TYPE[pageType],
    primaryCTA: ctas.primary,
    secondaryCTA: ctas.secondary,
    tone,
    hasGallery,
    hasTestimonials,
    hasPricing,
    hasNewsletter,
    brief,
  };
}
