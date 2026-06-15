// Composer Section Builder — produces Puck-compatible props for each supported component.
// Props are designed to pass pageSchemaToPuckData without normalization.
// Only the Registry Composer v1 supported set is handled; unsupported names throw.

import type { ComposerStrategyProfile, PageType } from "./composer-strategy";

// ── Asset pool ────────────────────────────────────────────────────────────────
// Exact paths from public/assets/references/ASSET_INDEX.md.
// Always use assets/ prefix (not /assets/) for validator compatibility.

export const GALLERY_ASSETS = [
  "assets/references/emovel-reference-zimage-00007.png",
  "assets/references/emovel-reference-zimage-00008.png",
  "assets/references/emovel-reference-zimage-00009.png",
] as const;

// ── Navigation labels per page type ──────────────────────────────────────────

const NAV_LINKS_BY_PAGE_TYPE: Record<
  PageType,
  Array<{ label: string; href: string }>
> = {
  saas: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "#about" },
  ],
  landing: [
    { label: "About", href: "#about" },
    { label: "FAQ", href: "#faq" },
  ],
  portfolio: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  product: [
    { label: "Products", href: "#products" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  about: [
    { label: "Team", href: "#team" },
    { label: "Story", href: "#story" },
    { label: "Contact", href: "#contact" },
  ],
};

// ── Hero title / subtitle templates ──────────────────────────────────────────

const HERO_TITLE_BY_PAGE_TYPE: Record<PageType, (brandName: string) => string> =
  {
    saas: (b) => `${b} — Build smarter, ship faster.`,
    landing: (b) => `${b} — Join the next generation.`,
    portfolio: (_) => "Work that speaks for itself.",
    product: (b) => `${b} — Quality you can feel.`,
    about: (b) => `The people behind ${b}.`,
  };

const HERO_SUBTITLE_BY_PAGE_TYPE: Record<
  PageType,
  (brandName: string, audience: string) => string
> = {
  saas: (b, a) =>
    `A complete platform for ${a} who need to ship without friction. ${b} handles the complexity.`,
  landing: (b, a) =>
    `Be among the first ${a} to experience what ${b} can do. Limited spots available.`,
  portfolio: (_, a) =>
    `Crafted work for ${a}. Every project delivered to an uncompromising standard.`,
  product: (b, a) =>
    `Premium quality for ${a}. ${b} is built to the detail that matters.`,
  about: (b, a) =>
    `Meet the team building ${b} for ${a}. Driven by craft, not convention.`,
};

// linkGroups.links uses the Puck stored format: "Label | href" per line (textarea string).
// parseFooterLinks in puck.config.tsx converts this to CTALink[] at the render boundary.
const FOOTER_LINK_GROUPS_BY_PAGE_TYPE: Record<
  PageType,
  Array<{ heading: string; links: string }>
> = {
  saas: [
    {
      heading: "Product",
      links: "Features | #features\nPricing | #pricing\nChangelog | #changelog",
    },
    {
      heading: "Company",
      links: "About | #about\nBlog | #blog\nContact | #contact",
    },
    { heading: "Legal", links: "Privacy | #privacy\nTerms | #terms" },
  ],
  landing: [
    { heading: "About", links: "Story | #about\nTeam | #team" },
    { heading: "Legal", links: "Privacy | #privacy\nTerms | #terms" },
  ],
  portfolio: [
    { heading: "Work", links: "Projects | #work\nProcess | #process" },
    { heading: "Contact", links: "Get in touch | #contact" },
  ],
  product: [
    { heading: "Products", links: "Catalogue | #products\nAbout | #about" },
    { heading: "Legal", links: "Privacy | #privacy\nTerms | #terms" },
  ],
  about: [
    {
      heading: "Company",
      links: "Team | #team\nStory | #story\nContact | #contact",
    },
    { heading: "Legal", links: "Privacy | #privacy\nTerms | #terms" },
  ],
};

// ── Per-component builders ────────────────────────────────────────────────────

function buildNavigationBar(
  profile: ComposerStrategyProfile,
): Record<string, unknown> {
  return {
    logoText: profile.brand.name,
    links: NAV_LINKS_BY_PAGE_TYPE[profile.pageType],
    ctaLabel: profile.primaryCTA.label,
    ctaHref: profile.primaryCTA.href,
    position: "sticky",
    width: "contained",
    backgroundImageUrl: "",
    // surface intentionally omitted — Puck default 'surface' is not a Registry value
  };
}

function sentenceList(items: string[]): string {
  return items.filter(Boolean).slice(0, 2).join(" and ");
}

function buildHeroSection(
  profile: ComposerStrategyProfile,
): Record<string, unknown> {
  const { brief } = profile;
  const differentiatorCopy = sentenceList(brief.differentiators);
  const proofCopy = sentenceList(brief.proofPoints);
  const heroTitle = `${brief.productName} helps ${brief.audiencePhrase} ${brief.offer}.`;
  const heroSubtitle = `Built for ${brief.industry} teams with ${differentiatorCopy}. ${proofCopy}.`;
  const eyebrowByTone: Record<string, string> = {
    premium: profile.brand.name,
    technical: `Built for ${profile.audience}`,
    direct: `Now live — ${profile.brand.name}`,
  };

  return {
    eyebrow: eyebrowByTone[profile.tone] ?? profile.brand.name,
    title:
      heroTitle ||
      HERO_TITLE_BY_PAGE_TYPE[profile.pageType](profile.brand.name),
    subtitle:
      heroSubtitle ||
      HERO_SUBTITLE_BY_PAGE_TYPE[profile.pageType](
        profile.brand.name,
        profile.audience,
      ),
    primaryCtaLabel: brief.ctaIntent || profile.primaryCTA.label,
    primaryCtaHref: profile.primaryCTA.href,
    secondaryCtaLabel: profile.secondaryCTA.label,
    secondaryCtaHref: profile.secondaryCTA.href,
    motionPattern: "depth-push",
    enableCinematicLogo: "true",
    backgroundImageUrl: "",
    brandImageUrl: "",
    width: "contained",
    // surface intentionally omitted — Puck default 'transparent' is not a Registry value
  };
}

function buildGalleryShowcase(
  profile: ComposerStrategyProfile,
): Record<string, unknown> {
  const descByPageType: Record<PageType, string> = {
    saas: `Every detail of ${profile.brand.name} — from the clean interface to the powerful features beneath.`,
    landing: `A preview of what's coming. Built for ${profile.audience} who demand more.`,
    portfolio:
      "Selected work — each project crafted to an uncompromising standard.",
    product: `A closer look at the quality and detail that defines every ${profile.brand.name} product.`,
    about: `A look inside how we work at ${profile.brand.name}. Process, precision, and people.`,
  };

  return {
    title: `See ${profile.brand.name} in action`,
    description: descByPageType[profile.pageType],
    shots: [
      {
        caption: `${profile.brand.name} — overview`,
        imageUrl: GALLERY_ASSETS[0],
        alt: `${profile.brand.name} interface — primary view`,
      },
      {
        caption: `${profile.brand.name} — features`,
        imageUrl: GALLERY_ASSETS[1],
        alt: `${profile.brand.name} interface — feature detail`,
      },
      {
        caption: `${profile.brand.name} — detail`,
        imageUrl: GALLERY_ASSETS[2],
        alt: `${profile.brand.name} interface — workflow close-up`,
      },
    ],
    width: "contained",
    backgroundImageUrl: "",
    // surface intentionally omitted — Puck default 'transparent' is not a Registry value
  };
}

function buildTestimonialSection(
  profile: ComposerStrategyProfile,
): Record<string, unknown> {
  return {
    eyebrow: "What our users say",
    headline: `Trusted by teams that build with ${profile.brand.name}.`,
    testimonials: [
      {
        quote: `${profile.brand.name} changed how our team operates. The results were immediate and measurable.`,
        authorName: "Alex Johnson",
        authorRole: "Founder",
        authorCompany: "Studio One",
        avatarUrl: "",
        rating: 5,
      },
      {
        quote: `We evaluated three alternatives. ${profile.brand.name} was the only one that actually delivered.`,
        authorName: "Jordan Rivera",
        authorRole: "Head of Product",
        authorCompany: "Meridian Co.",
        avatarUrl: "",
        rating: 5,
      },
      {
        quote: `The quality of the output is what convinced our stakeholders. ${profile.brand.name} delivers.`,
        authorName: "Morgan Lee",
        authorRole: "Lead Engineer",
        authorCompany: "Vaulted Labs",
        avatarUrl: "",
        rating: 5,
      },
    ],
    layout: "grid",
    width: "contained",
    backgroundImageUrl: "",
    // surface intentionally omitted — Puck default 'surfaceAlt' is not a Registry value
  };
}

function buildPricingSection(
  profile: ComposerStrategyProfile,
): Record<string, unknown> {
  const { brief } = profile;
  const primaryDifferentiator = brief.differentiators[0] ?? "guided setup";
  const proofPoint = brief.proofPoints[0] ?? "practical outcomes";
  return {
    eyebrow: "Pricing",
    headline: `${brief.productName} pricing — ${brief.pricingHint} for ${brief.audiencePhrase}.`,
    subheadline: `Choose the ${brief.productName} plan that fits your ${brief.industry} workflow — from ${primaryDifferentiator} to ${proofPoint}.`,
    billingPeriod: "monthly",
    plans: [
      {
        name: "Starter",
        price: "Free",
        priceAnnual: "",
        description: `Everything you need to explore ${brief.offer}.`,
        features: `${primaryDifferentiator}\nCore workflow setup\n${proofPoint}\nCommunity support`,
        ctaLabel: brief.ctaIntent,
        ctaHref: "#",
        highlight: "none",
        badge: "",
      },
      {
        name: "Pro",
        price: "$49/mo",
        priceAnnual: "$39/mo",
        description: `For growing ${brief.industry} teams ready to scale ${brief.productName}.`,
        features: `Everything in Starter\nUnlimited projects\n${brief.differentiators[1] ?? "Advanced analytics"}\nPriority support`,
        ctaLabel: "Start free trial",
        ctaHref: "#",
        highlight: "featured",
        badge: "Most Popular",
      },
      {
        name: "Growth",
        price: "$99/mo",
        priceAnnual: "$79/mo",
        description: `For organizations that need ${brief.productName} tailored to complex operations.`,
        features: `Everything in Pro\n${brief.differentiators[2] ?? "Custom integrations"}\nDedicated account manager\nSLA guarantee`,
        ctaLabel: "Talk to sales",
        ctaHref: "#",
        highlight: "none",
        badge: "",
      },
    ],
    width: "contained",
    backgroundImageUrl: "",
    // surface intentionally omitted — inherits page universe via SectionSurface
  };
}

function buildCTASection(
  profile: ComposerStrategyProfile,
): Record<string, unknown> {
  const { brief } = profile;
  return {
    headline: `${brief.ctaIntent} with ${brief.productName}.`,
    subheadline: `Give ${brief.audiencePhrase} a clearer way to ${brief.offer}, backed by ${sentenceList(brief.proofPoints)}.`,
    primaryAction: brief.ctaIntent || profile.primaryCTA.label,
    secondaryAction: profile.secondaryCTA.label,
    supportText: "No commitment required.",
    surface: "inverted", // valid Registry value; creates conversion contrast
    width: "contained",
    backgroundImageUrl: "",
  };
}

function buildLeadCapture(
  profile: ComposerStrategyProfile,
): Record<string, unknown> {
  const { brief } = profile;
  return {
    eyebrow: `For ${brief.audiencePhrase}`,
    headline: `Get ${brief.productName} updates`,
    subheadline: `New ${brief.industry} insights, product updates, and practical ways to improve ${brief.offer}.`,
    inputPlaceholder: "Enter your email",
    ctaLabel: "Subscribe",
    privacyNote: "No spam. Unsubscribe anytime.",
    layout: "centered",
    width: "contained",
    backgroundImageUrl: "",
    // surface intentionally omitted — Puck default 'surface' is not a Registry value
  };
}

function buildFooterSection(
  profile: ComposerStrategyProfile,
): Record<string, unknown> {
  const { brief } = profile;
  return {
    logoText: profile.brand.name,
    tagline: `${brief.productName} helps ${brief.audiencePhrase} ${brief.offer}.`,
    linkGroups: FOOTER_LINK_GROUPS_BY_PAGE_TYPE[profile.pageType],
    copyright: `© ${new Date().getFullYear()} ${profile.brand.name}. All rights reserved.`,
    socialLinks: [
      { label: "Twitter", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
    width: "contained",
    backgroundImageUrl: "",
    // surface intentionally omitted — Puck default 'surface' is not a Registry value
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export function buildSectionProps(
  registryName: string,
  profile: ComposerStrategyProfile,
  _index: number,
): Record<string, unknown> {
  switch (registryName) {
    case "NavigationBar":
      return buildNavigationBar(profile);
    case "HeroSection":
      return buildHeroSection(profile);
    case "GalleryShowcase":
      return buildGalleryShowcase(profile);
    case "TestimonialSection":
      return buildTestimonialSection(profile);
    case "PricingSection":
      return buildPricingSection(profile);
    case "CTASection":
      return buildCTASection(profile);
    case "LeadCapture":
      return buildLeadCapture(profile);
    case "FooterSection":
      return buildFooterSection(profile);
    default:
      throw new Error(
        `buildSectionProps: no builder for registry component "${registryName}". ` +
          `Only Composer v1 supported components are allowed.`,
      );
  }
}
