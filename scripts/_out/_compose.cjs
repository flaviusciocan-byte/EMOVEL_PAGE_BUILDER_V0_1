var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// <stdin>
var stdin_exports = {};
__export(stdin_exports, {
  buildRegistryPageSchema: () => buildRegistryPageSchema,
  pageSchemaToPuckData: () => pageSchemaToPuckData
});
module.exports = __toCommonJS(stdin_exports);

// src/composer/composer-strategy.ts
function extractBrandName(prompt) {
  const patterns = [
    /\bfor\s+([A-Z][A-Za-z0-9]+)/,
    /\bcalled\s+([A-Z][A-Za-z0-9]+)/,
    /\bbrand\s+([A-Z][A-Za-z0-9]+)/,
    // Brand as grammatical subject: "ClinicFlow helps clinic managers…"
    /^([A-Z][A-Za-z0-9]+)\s+(?:helps?|is|lets?|enables?|makes?|allows?|provides?|delivers?|offers?|builds?|creates?|serves?|gives?|automates?|streamlines?|simplifies?|powers?)\b/
  ];
  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match?.[1]) return match[1];
  }
  return "EMOVEL";
}
var CTA_BY_PAGE_TYPE = {
  saas: {
    primary: { label: "Get started", href: "#get-started" },
    secondary: { label: "See how it works", href: "#demo" }
  },
  landing: {
    primary: { label: "Join the waitlist", href: "#waitlist" },
    secondary: { label: "Learn more", href: "#features" }
  },
  portfolio: {
    primary: { label: "View work", href: "#work" },
    secondary: { label: "Contact", href: "#contact" }
  },
  product: {
    primary: { label: "Shop now", href: "#shop" },
    secondary: { label: "Browse catalog", href: "#catalog" }
  },
  about: {
    primary: { label: "Meet the team", href: "#team" },
    secondary: { label: "Our story", href: "#story" }
  }
};
var TAGLINE_BY_PAGE_TYPE = {
  saas: "Build faster. Ship with confidence.",
  landing: "Be the first to experience the future.",
  portfolio: "Work that speaks for itself.",
  product: "Quality you can feel.",
  about: "The people behind the product."
};
var AUDIENCE_BY_PAGE_TYPE = {
  saas: "software teams and builders",
  landing: "early adopters and innovators",
  portfolio: "clients and collaborators",
  product: "buyers and enthusiasts",
  about: "candidates and partners"
};
var ACTION_VERBS = [
  "automate",
  "streamline",
  "launch",
  "build",
  "manage",
  "convert",
  "organize",
  "scale"
];
var GERUND_TO_VERB = {
  automating: "automate",
  streamlining: "streamline",
  launching: "launch",
  building: "build",
  managing: "manage",
  converting: "convert",
  organizing: "organize",
  scaling: "scale"
};
var PAST_TO_VERB = {
  automated: "automate",
  streamlined: "streamline",
  launched: "launch",
  built: "build",
  managed: "manage",
  converted: "convert",
  organized: "organize",
  scaled: "scale"
};
function cleanPhrase(value) {
  return value.replace(/[.!?]+$/g, "").replace(/\s+/g, " ").trim().toLowerCase();
}
function humanizeOfferObject(rawObject) {
  const object = cleanPhrase(rawObject).replace(/^the\s+/, "").replace(/^(their|your|our)\s+/, "");
  if (/^intake$/.test(object)) return "patient intake";
  if (/^forms?$/.test(object)) return "digital forms";
  if (/^leads?$/.test(object)) return "lead conversion";
  if (/^workflows?$/.test(object)) return "team workflows";
  if (/^operations?$/.test(object)) return "daily operations";
  return object || "workflows";
}
function preferCommercialVerb(verb, object) {
  const normalizedVerb = cleanPhrase(verb);
  const normalizedObject = cleanPhrase(object);
  if (/intake|workflow|operations?|process/.test(normalizedObject)) return "streamline";
  if (/site|page|landing|app|product/.test(normalizedObject)) return "launch";
  if (/lead|signup|visitor|conversion/.test(normalizedObject)) return "convert";
  if (/content|task|data|file/.test(normalizedObject)) return "organize";
  if (/team|project|client|clinic|practice/.test(normalizedObject)) return "manage";
  if (/growth|revenue|business/.test(normalizedObject)) return "scale";
  if (normalizedVerb in GERUND_TO_VERB) return GERUND_TO_VERB[normalizedVerb];
  if (normalizedVerb in PAST_TO_VERB) return PAST_TO_VERB[normalizedVerb];
  if (ACTION_VERBS.includes(normalizedVerb)) return normalizedVerb;
  return "streamline";
}
function extractAudience(prompt, pageType) {
  const lower = prompt.toLowerCase();
  const patterns = [
    /helps?\s+([a-z][a-z\s-]{2,60}?)\s+(?:automated?|automating|streamline|streamlining|launch|launching|build|building|manage|managing|convert|converting|organize|organizing|scale|scaling)\b/,
    /for\s+[A-Z][A-Za-z0-9]+\s+(?:that\s+)?helps?\s+([a-z][a-z\s-]{2,60}?)\s+/,
    /for\s+([a-z][a-z\s-]{2,50}?)(?:\s+who\b|\s+that\b|[.,]|$)/
  ];
  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match?.[1]) {
      const audience = cleanPhrase(match[1]).replace(/^(the|a|an)\s+/, "");
      if (audience && !/^(landing page|page|website|site)$/.test(audience)) return audience;
    }
  }
  if (/clinic|patient|intake/.test(lower)) return "clinic managers";
  return AUDIENCE_BY_PAGE_TYPE[pageType];
}
function extractHeroAction(prompt) {
  const patterns = [
    /helps?\s+[a-z][a-z\s-]{2,60}?\s+(automated?|automating|streamline|streamlining|launch|launching|build|building|manage|managing|convert|converting|organize|organizing|scale|scaling)\s+([a-z][a-z\s-]{2,80})/i,
    /(?:to|for)\s+(automated?|automating|streamline|streamlining|launch|launching|build|building|manage|managing|convert|converting|organize|organizing|scale|scaling)\s+([a-z][a-z\s-]{2,80})/i
  ];
  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match?.[1] && match[2]) {
      const object = humanizeOfferObject(match[2]);
      return { verb: preferCommercialVerb(match[1], object), object };
    }
  }
  if (/intake/.test(prompt.toLowerCase())) return { verb: "streamline", object: "patient intake" };
  return null;
}
function classifyIntent(prompt) {
  const lower = prompt.toLowerCase();
  const hasGallery = /\b(gallery|screenshot|screenshots|showcase|demo|preview)\b/.test(lower);
  const hasTestimonials = /\b(testimonial|testimonials|review|reviews|social\s+proof|customers\s+say|users\s+say)\b/.test(lower);
  const hasPricing = /\b(pricing|plans|billing|subscription|tier|tiers)\b/.test(lower);
  const hasNewsletter = /\b(newsletter|waitlist|signup|mailing)\b/.test(lower) || /\bemail\s+list\b/.test(lower) || /\bsign\s+up\b/.test(lower) || /\bsubscribe\b/.test(lower);
  let pageType = "saas";
  if (/\bportfolio\b/.test(lower)) {
    pageType = "portfolio";
  } else if (/\b(about|team|company|founder|founders|mission|story)\b/.test(lower)) {
    pageType = "about";
  } else if (/\b(product|shop|store|ecommerce|e-commerce|catalog)\b/.test(lower)) {
    pageType = "product";
  } else if (/\b(landing|launch|waitlist|coming\s+soon|early\s+access|announce)\b/.test(lower)) {
    pageType = "landing";
  }
  let tone = "premium";
  if (/\b(enterprise|b2b|professional|agency|compliance|corporate)\b/.test(lower)) {
    tone = "technical";
  } else if (/\b(startup|launch|waitlist|join\s+us|early|beta|first)\b/.test(lower)) {
    tone = "direct";
  }
  const brandName = extractBrandName(prompt);
  const ctas = CTA_BY_PAGE_TYPE[pageType];
  const audience = extractAudience(prompt, pageType);
  const heroAction = extractHeroAction(prompt);
  return {
    pageType,
    brand: {
      name: brandName,
      tagline: TAGLINE_BY_PAGE_TYPE[pageType]
    },
    audience,
    heroAction,
    primaryCTA: ctas.primary,
    secondaryCTA: ctas.secondary,
    tone,
    hasGallery,
    hasTestimonials,
    hasPricing,
    hasNewsletter
  };
}

// src/composer/composer-planner.ts
var NEVER_EMIT = /* @__PURE__ */ new Set(["FeatureGrid", "OfferSection"]);
function isImplemented(name, manifest) {
  return manifest.components.some(
    (c) => c.registryName === name && c.status === "implemented"
  );
}
function planPageStructure(profile, manifest) {
  const plan = [];
  function add(name, rationale) {
    if (NEVER_EMIT.has(name)) return;
    if (!isImplemented(name, manifest)) return;
    plan.push({ registryName: name, rationale });
  }
  add("NavigationBar", "Primary navigation \u2014 anchors every page; sticky for persistent access to the primary CTA.");
  add("HeroSection", "Above-the-fold impact \u2014 establishes brand identity and frames the primary conversion intent.");
  if (profile.hasGallery) {
    add(
      "GalleryShowcase",
      "Gallery/screenshot detected \u2014 visual evidence of product quality using real reference assets."
    );
  }
  if (profile.hasTestimonials) {
    add(
      "TestimonialSection",
      "Testimonials/social proof detected \u2014 reduces buyer hesitation before the conversion section."
    );
  }
  if (profile.hasPricing) {
    add(
      "PricingSection",
      "Pricing detected \u2014 transparent plan comparison helps visitors self-select before the CTA."
    );
  }
  add("CTASection", "Conversion anchor \u2014 always present to capture visitors who are ready to act.");
  if (profile.hasNewsletter) {
    add(
      "LeadCapture",
      "Newsletter/email detected \u2014 captures leads who are not ready to convert immediately."
    );
  }
  add("FooterSection", "Site footer \u2014 closes every page with navigation links, copyright, and social links.");
  return plan;
}

// src/composer/composer-section-builder.ts
var GALLERY_ASSETS = [
  "assets/references/emovel-reference-zimage-00007.png",
  "assets/references/emovel-reference-zimage-00008.png",
  "assets/references/emovel-reference-zimage-00009.png"
];
var NAV_LINKS_BY_PAGE_TYPE = {
  saas: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "#about" }
  ],
  landing: [
    { label: "About", href: "#about" },
    { label: "FAQ", href: "#faq" }
  ],
  portfolio: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" }
  ],
  product: [
    { label: "Products", href: "#products" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" }
  ],
  about: [
    { label: "Team", href: "#team" },
    { label: "Story", href: "#story" },
    { label: "Contact", href: "#contact" }
  ]
};
var HERO_TITLE_BY_PAGE_TYPE = {
  saas: (b, a, action) => action ? `${b} helps ${a} ${action.verb} ${action.object}.` : `${b} \u2014 Build smarter, ship faster.`,
  landing: (b) => `${b} \u2014 Join the next generation.`,
  portfolio: (_) => "Work that speaks for itself.",
  product: (b) => `${b} \u2014 Quality you can feel.`,
  about: (b) => `The people behind ${b}.`
};
var HERO_SUBTITLE_BY_PAGE_TYPE = {
  saas: (b, a) => `A complete platform for ${a} who need to ship without friction. ${b} handles the complexity.`,
  landing: (b, a) => `Be among the first ${a} to experience what ${b} can do. Limited spots available.`,
  portfolio: (_, a) => `Crafted work for ${a}. Every project delivered to an uncompromising standard.`,
  product: (b, a) => `Premium quality for ${a}. ${b} is built to the detail that matters.`,
  about: (b, a) => `Meet the team building ${b} for ${a}. Driven by craft, not convention.`
};
var FOOTER_TAGLINE_BY_PAGE_TYPE = {
  saas: (_b, a) => `Built for ${a} who demand more.`,
  landing: (b, _a) => `${b} \u2014 worth being part of.`,
  portfolio: (_b, _a) => "Every project built to an uncompromising standard.",
  product: (b, _a) => `${b} \u2014 quality you can feel.`,
  about: (b, _a) => `The people and craft behind ${b}.`
};
var FOOTER_LINK_GROUPS_BY_PAGE_TYPE = {
  saas: [
    { heading: "Product", links: "Features | #features\nPricing | #pricing\nChangelog | #changelog" },
    { heading: "Company", links: "About | #about\nBlog | #blog\nContact | #contact" },
    { heading: "Legal", links: "Privacy | #privacy\nTerms | #terms" }
  ],
  landing: [
    { heading: "About", links: "Story | #about\nTeam | #team" },
    { heading: "Legal", links: "Privacy | #privacy\nTerms | #terms" }
  ],
  portfolio: [
    { heading: "Work", links: "Projects | #work\nProcess | #process" },
    { heading: "Contact", links: "Get in touch | #contact" }
  ],
  product: [
    { heading: "Products", links: "Catalogue | #products\nAbout | #about" },
    { heading: "Legal", links: "Privacy | #privacy\nTerms | #terms" }
  ],
  about: [
    { heading: "Company", links: "Team | #team\nStory | #story\nContact | #contact" },
    { heading: "Legal", links: "Privacy | #privacy\nTerms | #terms" }
  ]
};
var PRICING_HEADLINE_BY_TONE = {
  premium: (b) => `Everything ${b} offers \u2014 one clear price.`,
  technical: (b) => `${b} pricing \u2014 built to scale with your team.`,
  direct: (_) => "Simple pricing. No surprises."
};
var CTA_HEADLINE_BY_TONE = {
  premium: (b) => `Ready to experience ${b}?`,
  technical: (b) => `Start building with ${b} today.`,
  direct: (b) => `Join ${b} \u2014 it takes under a minute.`
};
function buildNavigationBar(profile) {
  return {
    logoText: profile.brand.name,
    links: NAV_LINKS_BY_PAGE_TYPE[profile.pageType],
    ctaLabel: profile.primaryCTA.label,
    ctaHref: profile.primaryCTA.href,
    position: "sticky",
    width: "contained",
    backgroundImageUrl: ""
    // surface intentionally omitted — Puck default 'surface' is not a Registry value
  };
}
function buildHeroSection(profile) {
  const eyebrowByTone = {
    premium: profile.brand.name,
    technical: `Built for ${profile.audience}`,
    direct: `Now live \u2014 ${profile.brand.name}`
  };
  return {
    eyebrow: eyebrowByTone[profile.tone] ?? profile.brand.name,
    title: HERO_TITLE_BY_PAGE_TYPE[profile.pageType](profile.brand.name, profile.audience, profile.heroAction),
    subtitle: HERO_SUBTITLE_BY_PAGE_TYPE[profile.pageType](profile.brand.name, profile.audience),
    primaryCtaLabel: profile.primaryCTA.label,
    primaryCtaHref: profile.primaryCTA.href,
    secondaryCtaLabel: profile.secondaryCTA.label,
    secondaryCtaHref: profile.secondaryCTA.href,
    motionPattern: "depth-push",
    enableCinematicLogo: "true",
    backgroundImageUrl: "",
    brandImageUrl: "",
    width: "contained"
    // surface intentionally omitted — Puck default 'transparent' is not a Registry value
  };
}
function buildGalleryShowcase(profile) {
  const descByPageType = {
    saas: `Every detail of ${profile.brand.name} \u2014 from the clean interface to the powerful features beneath.`,
    landing: `A preview of what's coming. Built for ${profile.audience} who demand more.`,
    portfolio: "Selected work \u2014 each project crafted to an uncompromising standard.",
    product: `A closer look at the quality and detail that defines every ${profile.brand.name} product.`,
    about: `A look inside how we work at ${profile.brand.name}. Process, precision, and people.`
  };
  return {
    title: `See ${profile.brand.name} in action`,
    description: descByPageType[profile.pageType],
    shots: [
      {
        caption: `${profile.brand.name} \u2014 overview`,
        imageUrl: GALLERY_ASSETS[0],
        alt: `${profile.brand.name} interface \u2014 primary view`
      },
      {
        caption: `${profile.brand.name} \u2014 features`,
        imageUrl: GALLERY_ASSETS[1],
        alt: `${profile.brand.name} interface \u2014 feature detail`
      },
      {
        caption: `${profile.brand.name} \u2014 detail`,
        imageUrl: GALLERY_ASSETS[2],
        alt: `${profile.brand.name} interface \u2014 workflow close-up`
      }
    ],
    width: "contained",
    backgroundImageUrl: ""
    // surface intentionally omitted — Puck default 'transparent' is not a Registry value
  };
}
function buildTestimonialSection(profile) {
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
        rating: 5
      },
      {
        quote: `We evaluated three alternatives. ${profile.brand.name} was the only one that actually delivered.`,
        authorName: "Jordan Rivera",
        authorRole: "Head of Product",
        authorCompany: "Meridian Co.",
        avatarUrl: "",
        rating: 5
      },
      {
        quote: `The quality of the output is what convinced our stakeholders. ${profile.brand.name} delivers.`,
        authorName: "Morgan Lee",
        authorRole: "Lead Engineer",
        authorCompany: "Vaulted Labs",
        avatarUrl: "",
        rating: 5
      }
    ],
    layout: "grid",
    width: "contained",
    backgroundImageUrl: ""
    // surface intentionally omitted — Puck default 'surfaceAlt' is not a Registry value
  };
}
function buildPricingSection(profile) {
  const headlineFn = PRICING_HEADLINE_BY_TONE[profile.tone] ?? PRICING_HEADLINE_BY_TONE["premium"];
  return {
    eyebrow: "Pricing",
    headline: headlineFn(profile.brand.name),
    subheadline: "Start free. Scale as you grow. No hidden fees.",
    billingPeriod: "monthly",
    plans: [
      {
        name: "Starter",
        price: "Free",
        priceAnnual: "",
        description: `Everything you need to get started with ${profile.brand.name}.`,
        features: "Core feature one\nCore feature two\nCore feature three\nCommunity support",
        ctaLabel: "Get started free",
        ctaHref: "#",
        highlight: "none",
        badge: ""
      },
      {
        name: "Pro",
        price: "$49/mo",
        priceAnnual: "$39/mo",
        description: `For growing teams that need the full power of ${profile.brand.name}.`,
        features: "Everything in Starter\nUnlimited projects\nAdvanced analytics\nPriority support",
        ctaLabel: "Start free trial",
        ctaHref: "#",
        highlight: "featured",
        badge: "Most Popular"
      },
      {
        name: "Growth",
        price: "$99/mo",
        priceAnnual: "$79/mo",
        description: "For scaling teams with enterprise-grade needs.",
        features: "Everything in Pro\nCustom integrations\nDedicated account manager\nSLA guarantee",
        ctaLabel: "Talk to sales",
        ctaHref: "#",
        highlight: "none",
        badge: ""
      }
    ],
    width: "contained",
    backgroundImageUrl: ""
    // surface intentionally omitted — inherits page universe via SectionSurface
  };
}
function buildCTASection(profile) {
  const headlineFn = CTA_HEADLINE_BY_TONE[profile.tone] ?? CTA_HEADLINE_BY_TONE["premium"];
  return {
    headline: headlineFn(profile.brand.name),
    subheadline: `Join ${profile.audience} who use ${profile.brand.name} to build with confidence.`,
    primaryAction: profile.primaryCTA.label,
    secondaryAction: profile.secondaryCTA.label,
    supportText: "No commitment required.",
    surface: "inverted",
    // valid Registry value; creates conversion contrast
    width: "contained",
    backgroundImageUrl: ""
  };
}
function buildLeadCapture(profile) {
  return {
    eyebrow: "Stay in the loop",
    headline: `Get ${profile.brand.name} updates`,
    subheadline: "Early access, new features, and announcements \u2014 directly to you.",
    inputPlaceholder: "Enter your email",
    ctaLabel: "Subscribe",
    privacyNote: "No spam. Unsubscribe anytime.",
    layout: "centered",
    width: "contained",
    backgroundImageUrl: ""
    // surface intentionally omitted — Puck default 'surface' is not a Registry value
  };
}
function buildFooterSection(profile) {
  const taglineFn = FOOTER_TAGLINE_BY_PAGE_TYPE[profile.pageType];
  return {
    logoText: profile.brand.name,
    tagline: taglineFn(profile.brand.name, profile.audience),
    linkGroups: FOOTER_LINK_GROUPS_BY_PAGE_TYPE[profile.pageType],
    copyright: `\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} ${profile.brand.name}. All rights reserved.`,
    socialLinks: [
      { label: "Twitter", href: "#" },
      { label: "LinkedIn", href: "#" }
    ],
    width: "contained",
    backgroundImageUrl: ""
    // surface intentionally omitted — Puck default 'surface' is not a Registry value
  };
}
function buildSectionProps(registryName, profile, _index) {
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
        `buildSectionProps: no builder for registry component "${registryName}". Only Composer v1 supported components are allowed.`
      );
  }
}

// src/composer/composer.ts
var PAGE_TYPE_LABELS = {
  saas: "SaaS Landing",
  landing: "Launch Page",
  portfolio: "Portfolio",
  product: "Product Page",
  about: "About Page"
};
function buildRegistryPageSchema(prompt, manifest) {
  const profile = classifyIntent(prompt);
  const plan = planPageStructure(profile, manifest);
  const components = plan.map((planned, index) => ({
    registryName: planned.registryName,
    props: buildSectionProps(planned.registryName, profile, index)
  }));
  const composerBrief = {
    projectName: profile.brand.name,
    audience: profile.audience,
    coreOffer: profile.brand.tagline,
    primaryAction: profile.primaryCTA.label,
    pageType: PAGE_TYPE_LABELS[profile.pageType],
    activationDepth: void 0,
    progressMomentum: void 0,
    emotionalSignalIndex: void 0
  };
  return {
    registryVersion: manifest.registryVersion,
    title: `${profile.brand.name} \u2014 ${PAGE_TYPE_LABELS[profile.pageType]}`,
    components,
    composerBrief
  };
}

// src/composer/page-schema-to-puck.ts
var REGISTRY_TO_PUCK = {
  "HeroSection": "Hero",
  "TrustStrip": "Logo Strip",
  "FeatureGrid": "Card",
  "ProductShowcase": "Product Grid",
  "PricingSection": "Pricing Table",
  "FAQSection": "FAQ",
  "CTASection": "CTA Section",
  "NavigationBar": "Nav Bar",
  "FooterSection": "Footer",
  "TestimonialSection": "Testimonials",
  "EditorialSection": "Feature Split",
  "GalleryShowcase": "Screenshot Gallery",
  "LeadCapture": "Newsletter"
};
function pageSchemaToPuckData(schema) {
  const content = schema.components.map((comp, index) => {
    const puckType = REGISTRY_TO_PUCK[comp.registryName];
    if (!puckType) {
      throw new Error(
        `pageSchemaToPuckData: no Puck mapping for registry component "${comp.registryName}". Ensure the component is implemented and listed in REGISTRY_TO_PUCK.`
      );
    }
    return {
      type: puckType,
      props: {
        id: `${comp.registryName}-${index}`,
        ...comp.props
      }
    };
  });
  return {
    root: { props: { title: schema.title, composerBrief: schema.composerBrief } },
    content,
    zones: {}
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  buildRegistryPageSchema,
  pageSchemaToPuckData
});
