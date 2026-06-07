import type { BillingPeriod, CTALink, PricingPlan } from './section-contract';
import {
  DEFAULT_GENERATED_COLUMNS,
  type PageSpec,
  type PageSpecBrand,
  type PageSpecSection,
} from './page-spec';

const SURF = { surface: 'transparent' as const, width: 'contained' as const, backgroundImageUrl: '' };

const DEFAULT_PROMPT =
  'Create an EMOVEL landing page for a premium page builder that turns prompts into editable pages.';

export type PageGenerationPreset = 'auto' | 'emovel-ui-rebuilder' | 'emovel-home';

export const PAGE_GENERATION_PRESETS: {
  id: PageGenerationPreset;
  label: string;
}[] = [
  { id: 'auto', label: 'Auto' },
  { id: 'emovel-ui-rebuilder', label: 'EMOVEL UI Rebuilder Landing Page' },
  { id: 'emovel-home', label: 'EMOVEL Home Page' },
];

function cleanText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function toTitleCase(value: string): string {
  return value
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'generated-page';
}

function sentenceCase(value: string): string {
  const cleaned = cleanText(value);
  if (!cleaned) return '';
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function inferBrandName(prompt: string): string {
  const quoted = prompt.match(/["']([^"']{2,48})["']/);
  if (quoted?.[1]) return toTitleCase(cleanText(quoted[1]));

  const named = prompt.match(/\b(?:for|brand|called|named)\s+([A-Z][A-Za-z0-9&.-]*(?:\s+[A-Z][A-Za-z0-9&.-]*){0,2})/);
  if (named?.[1]) return cleanText(named[1]);

  if (/\bemovel\b/i.test(prompt)) return 'EMOVEL';
  return 'EMOVEL';
}

function inferAudience(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('agency')) return 'creative agencies';
  if (lower.includes('founder')) return 'founders';
  if (lower.includes('saas')) return 'SaaS teams';
  if (lower.includes('real estate')) return 'real estate teams';
  if (lower.includes('enterprise')) return 'enterprise teams';
  if (lower.includes('coach') || lower.includes('consultant')) return 'consultants';
  return 'teams building high-converting web pages';
}

function inferProductPhrase(prompt: string): string {
  const cleaned = cleanText(prompt || DEFAULT_PROMPT);
  const withoutLead = cleaned.replace(/^(create|build|generate|make|design)\s+(a|an|the)?\s*/i, '');
  return sentenceCase(withoutLead).replace(/[.!?]+$/, '');
}

function makeLink(label: string, href: string): CTALink {
  return { label, href };
}

function buildBrand(prompt: string): PageSpecBrand {
  const name = inferBrandName(prompt);
  const audience = inferAudience(prompt);
  return {
    name,
    tagline: `A focused page engine for ${audience}.`,
    audience,
    primaryAction: makeLink('Generate a page', '#pricing'),
    secondaryAction: makeLink('See features', '#features'),
  };
}

function buildPricingPlans(brand: PageSpecBrand): PricingPlan[] {
  return [
    {
      name: 'Starter',
      price: '$0/mo',
      priceAnnual: '',
      description: `For ${brand.audience} validating a first page.`,
      features: 'Prompt-based first draft\nEditable Puck sections\nJSON page export',
      ctaLabel: 'Start free',
      ctaHref: '#',
      highlight: 'none',
      badge: '',
    },
    {
      name: 'Studio',
      price: '$49/mo',
      priceAnnual: '$39/mo',
      description: 'For teams shipping polished pages every week.',
      features: 'Everything in Starter\nReusable PageSpec structure\nStatic ZIP publishing\nPriority templates',
      ctaLabel: 'Choose Studio',
      ctaHref: '#',
      highlight: 'featured',
      badge: 'Best Fit',
    },
    {
      name: 'Ecosystem',
      price: 'Custom',
      priceAnnual: '',
      description: 'For EMOVEL ecosystem builds with multiple page types.',
      features: 'Page engine planning\nCustom section strategy\nLaunch support',
      ctaLabel: 'Talk to us',
      ctaHref: '#',
      highlight: 'none',
      badge: '',
    },
  ];
}

function buildSections(prompt: string, brand: PageSpecBrand): PageSpecSection[] {
  const product = inferProductPhrase(prompt);
  const billingPeriod: BillingPeriod = 'monthly';

  return [
    {
      kind: 'nav',
      props: {
        ...SURF,
        logoText: brand.name,
        links: [
          makeLink('Features', '#features'),
          makeLink('Offer', '#offer'),
          makeLink('Pricing', '#pricing'),
          makeLink('FAQ', '#faq'),
        ],
        ctaLabel: brand.primaryAction.label,
        ctaHref: brand.primaryAction.href,
        position: 'sticky',
      },
    },
    {
      kind: 'hero',
      props: {
        ...SURF,
        eyebrow: brand.name,
        title: `${brand.name} turns prompts into editable pages.`,
        subtitle: `${product}. Start with a structured draft, refine every section in the builder, then export clean page data or a static site.`,
        primaryCtaLabel: brand.primaryAction.label,
        primaryCtaHref: brand.primaryAction.href,
        secondaryCtaLabel: brand.secondaryAction.label,
        secondaryCtaHref: brand.secondaryAction.href,
        motionPattern: 'depth-push',
        enableCinematicLogo: 'true',
      },
    },
    {
      kind: 'featureGrid',
      props: {
        ...SURF,
        eyebrow: 'Page engine',
        headline: 'Generated structure, human control.',
        subheadline: `A practical workflow for ${brand.audience}: prompt the first draft, then edit the result as normal Puck sections.`,
        features: [
          {
            icon: '01',
            title: 'Prompt to PageSpec',
            body: 'Turn a plain-language brief into a typed internal page plan.',
          },
          {
            icon: '02',
            title: 'PageSpec to Puck Data',
            body: 'Map generated intent into existing registered sections and stored props.',
          },
          {
            icon: '03',
            title: 'Editable by design',
            body: 'Every generated page remains fully editable in the current builder.',
          },
        ],
        columns: DEFAULT_GENERATED_COLUMNS,
      },
    },
    {
      kind: 'offer',
      props: {
        title: 'A faster path from idea to launch-ready page.',
        problem: `${toTitleCase(brand.audience)} often lose time turning raw positioning into a usable landing page structure.`,
        solution: `${brand.name} creates a complete editable draft with navigation, hero, offer, pricing, CTA, FAQ, and footer already connected.`,
        benefits: [
          'Start from a complete page instead of a blank canvas.',
          'Keep every section editable in the existing builder.',
          'Export both the structured PageSpec and production-ready page output.',
          'Avoid external integrations until the core engine is stable.',
        ],
      },
    },
    {
      kind: 'pricing',
      props: {
        ...SURF,
        eyebrow: 'Pricing',
        headline: 'Choose the workflow that fits the page volume.',
        subheadline: 'Start simple, then expand into a repeatable EMOVEL page engine.',
        plans: buildPricingPlans(brand),
        billingPeriod,
      },
    },
    {
      kind: 'cta',
      props: {
        ...SURF,
        headline: 'Generate the first draft, then make it yours.',
        subheadline: `Use ${brand.name} to create a complete page structure from a prompt and continue editing with the tools already in the builder.`,
        primaryAction: 'Generate Page',
        secondaryAction: 'Export PageSpec',
        supportText: 'No external AI or API required in this version.',
      },
    },
    {
      kind: 'faq',
      props: {
        ...SURF,
        eyebrow: 'FAQ',
        headline: 'Questions before generating.',
        subheadline: '',
        items: [
          {
            question: 'Is the generated page editable?',
            answer: 'Yes. The generator loads standard Puck Data, so every section can be edited manually after generation.',
          },
          {
            question: 'Does this use an external AI service?',
            answer: 'No. This version is deterministic and runs locally from the prompt text.',
          },
          {
            question: 'Can I export the generated structure?',
            answer: 'Yes. The Prompt panel exports PageSpec, while the existing builder export keeps exporting Puck JSON.',
          },
          {
            question: 'Does ZIP publish still work?',
            answer: 'Yes. Generated pages use the same publish flow as manually built pages.',
          },
        ],
        layout: 'accordion',
      },
    },
    {
      kind: 'footer',
      props: {
        logoText: brand.name,
        tagline: brand.tagline,
        linkGroups: [
          {
            heading: 'Builder',
            links: [
              makeLink('Features', '#features'),
              makeLink('Pricing', '#pricing'),
              makeLink('Generate', '#'),
            ],
          },
          {
            heading: 'Company',
            links: [
              makeLink('About', '#about'),
              makeLink('Contact', '#contact'),
            ],
          },
          {
            heading: 'Legal',
            links: [
              makeLink('Privacy', '#privacy'),
              makeLink('Terms', '#terms'),
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} ${brand.name}. All rights reserved.`,
        socialLinks: [
          makeLink('LinkedIn', '#'),
          makeLink('X', '#'),
        ],
      },
    },
  ];
}

function shouldUseUiRebuilderPreset(prompt: string, preset: PageGenerationPreset): boolean {
  return preset === 'emovel-ui-rebuilder' || /\bui\s*rebuilder\b/i.test(prompt);
}

function shouldUseEmovelHomePreset(prompt: string, preset: PageGenerationPreset): boolean {
  return preset === 'emovel-home' || /\bemovel\s+home\b/i.test(prompt);
}

function buildEmovelHomePageSpec(rawPrompt: string): PageSpec {
  const prompt = cleanText(rawPrompt) || 'Create the EMOVEL Home Page.';
  const brand: PageSpecBrand = {
    name: 'EMOVEL',
    tagline: 'Sisteme digitale premium, controlate si monetizabile.',
    audience: 'fondatori si echipe care construiesc produse digitale comerciale',
    primaryAction: makeLink('Intră în sistem', '#ecosystem'),
    secondaryAction: makeLink('Explorează ecosistemul', '#ecosystem'),
  };
  const title = 'EMOVEL Home Page';

  return {
    version: 1,
    title,
    slug: slugify(title),
    brand,
    sections: [
      {
        kind: 'nav',
        props: {
          ...SURF,
          logoText: 'EMOVEL',
          logoImageUrl: 'assets/source-transparent/emovel-logo-gold-on-dark.png',
          links: [
            makeLink('Home', '#'),
            makeLink('Ecosystem', '#ecosystem'),
            makeLink('Builder', '#builder'),
            makeLink('Assistants', '#assistants'),
            makeLink('Marketing System', '#marketing-system'),
            makeLink('Prompt Engine', '#prompt-engine'),
            makeLink('Docs', '#docs'),
          ],
          ctaLabel: 'Sign In',
          ctaHref: '#sign-in',
          position: 'sticky',
        },
      },
      {
        kind: 'hero',
        props: {
          ...SURF,
          eyebrow: 'EMOVEL',
          title: 'Construiește sisteme care convertesc',
          subtitle:
            'Transformă ideile în produse digitale structurate și monetizabile — nu instrumente izolate, ci sisteme controlate.',
          primaryCtaLabel: 'Intră în sistem',
          primaryCtaHref: '#ecosystem',
          secondaryCtaLabel: 'Vezi ecosistemul',
          secondaryCtaHref: '#ecosystem',
          motionPattern: 'depth-push',
          enableCinematicLogo: 'true',
          brandImageUrl: 'assets/emovel-logo-3d-gold.png',
          brandImageAlt: 'EMOVEL gold 3D logo',
        },
      },
      {
        kind: 'featureGrid',
        props: {
          ...SURF,
          eyebrow: 'Ecosistem premium',
          headline: 'O arhitectură pentru produse digitale monetizabile.',
          subheadline:
            'EMOVEL unește page systems, prompt engines, marketing assets, AI assistants și structuri comerciale într-un sistem coerent.',
          features: [
            {
              icon: '01',
              title: 'Page Systems',
              body: 'Pagini comerciale construite ca sisteme editabile, nu ca layout-uri izolate.',
            },
            {
              icon: '02',
              title: 'Prompt Engines',
              body: 'Fluxuri de prompturi care transformă direcția strategică în output reutilizabil.',
            },
            {
              icon: '03',
              title: 'AI Assistants',
              body: 'Asistenți specializați pentru execuție, conținut, analiză și structurare comercială.',
            },
          ],
          columns: DEFAULT_GENERATED_COLUMNS,
        },
      },
      {
        kind: 'offer',
        props: {
          title: 'Nu construiești un tool. Construiești un sistem.',
          problem:
            'Produsele digitale eșuează când pagina, oferta, marketingul și automatizarea sunt tratate separat.',
          solution:
            'EMOVEL organizează fiecare componentă într-o arhitectură controlată: pagini, asset-uri, prompturi, asistenți și mecanisme de monetizare.',
          benefits: [
            'Direcție de brand coerentă pentru fiecare pagină și produs.',
            'Structură comercială clară înainte de execuție vizuală.',
            'Componente editabile în Builder și exportabile prin fluxul existent.',
            'O bază scalabilă pentru oferte digitale, campanii și sisteme AI.',
          ],
        },
      },
      {
        kind: 'productGrid',
        props: {
          ...SURF,
          sectionTitle: 'Ecosistemul EMOVEL',
          sectionDescription:
            'Modulele principale ale sistemului lucrează împreună pentru a transforma ideile în produse comerciale controlate.',
          products: [
            {
              title: 'Page Builder',
              description: 'Motorul pentru pagini editabile, preseturi PageSpec și export publicabil.',
              status: 'available',
              cta: 'Deschide',
            },
            {
              title: 'UI Rebuilder',
              description: 'Transformă referințe validate în blueprint-uri comerciale EMOVEL-ready.',
              status: 'early_access',
              cta: 'Explorează',
            },
            {
              title: 'Prompt Engine',
              description: 'Sistem pentru generarea, rafinarea și reutilizarea direcției strategice.',
              status: 'early_access',
              cta: 'Vezi',
            },
            {
              title: 'Marketing System',
              description: 'Asset-uri, mesaje și campanii conectate la structura comercială a produsului.',
              status: 'coming_soon',
              cta: 'Plan',
            },
          ],
        },
      },
      {
        kind: 'statsBar',
        props: {
          ...SURF,
          eyebrow: 'Control comercial',
          stats: [
            { value: '01', label: 'ecosistem central' },
            { value: '06+', label: 'module comerciale' },
            { value: '100%', label: 'pagini editabile' },
            { value: '0', label: 'tool-uri izolate' },
          ],
        },
      },
      {
        kind: 'cta',
        props: {
          ...SURF,
          headline: 'Intră în sistemul care transformă ideile în structuri monetizabile.',
          subheadline:
            'Pornește cu Builder-ul, extinde cu prompt engines și conectează fiecare produs digital la un mecanism comercial clar.',
          primaryAction: 'Intră în sistem',
          secondaryAction: 'Citește docs',
          supportText: 'Dark cinematic luxury tech. Calm authority. Built for commercial control.',
        },
      },
      {
        kind: 'faq',
        props: {
          ...SURF,
          eyebrow: 'FAQ',
          headline: 'Ce este EMOVEL?',
          subheadline: '',
          items: [
            {
              question: 'Este EMOVEL doar un page builder?',
              answer:
                'Nu. Page Builder este motorul central, dar EMOVEL este un ecosistem pentru produse digitale, prompt engines, asistenți AI, marketing assets și structuri monetizabile.',
            },
            {
              question: 'Paginiile generate rămân editabile?',
              answer:
                'Da. Presetul creează secțiuni Puck normale, astfel încât fiecare bloc poate fi modificat manual în Builder.',
            },
            {
              question: 'Pot exporta pagina normal?',
              answer:
                'Da. Presetul folosește același PageSpec, același Puck Data și același flux de export/publicare existent.',
            },
            {
              question: 'Care este direcția vizuală?',
              answer:
                'Dark cinematic luxury tech: fundal negru arhitectural, tipografie editorială albă, accente subtile blue/gold și spațiere premium.',
            },
          ],
          layout: 'accordion',
        },
      },
      {
        kind: 'footer',
        props: {
          logoText: 'EMOVEL',
          tagline:
            'Ecosistem premium pentru produse digitale, page systems, prompt engines și structuri comerciale monetizabile.',
          linkGroups: [
            {
              heading: 'Ecosystem',
              links: [
                makeLink('Home', '#'),
                makeLink('Builder', '#builder'),
                makeLink('Assistants', '#assistants'),
                makeLink('Marketing System', '#marketing-system'),
              ],
            },
            {
              heading: 'Systems',
              links: [
                makeLink('Prompt Engine', '#prompt-engine'),
                makeLink('Docs', '#docs'),
                makeLink('Sign In', '#sign-in'),
              ],
            },
            {
              heading: 'Legal',
              links: [
                makeLink('Privacy', '#privacy'),
                makeLink('Terms', '#terms'),
              ],
            },
          ],
          copyright: `© ${new Date().getFullYear()} EMOVEL. All rights reserved.`,
          socialLinks: [
            makeLink('LinkedIn', '#'),
            makeLink('X', '#'),
          ],
        },
      },
    ],
    meta: {
      source: 'prompt',
      prompt,
      generatedAt: new Date().toISOString(),
      generator: 'deterministic-v1',
    },
  };
}

function buildUiRebuilderPageSpec(rawPrompt: string): PageSpec {
  const prompt = cleanText(rawPrompt) || 'Create the EMOVEL UI Rebuilder landing page.';
  const brand: PageSpecBrand = {
    name: 'EMOVEL UI Rebuilder',
    tagline: 'Reference intelligence for premium commercial page rebuilds.',
    audience: 'builders turning proven references into EMOVEL-ready pages',
    primaryAction: makeLink('Export Blueprint', '#cta'),
    secondaryAction: makeLink('See System', '#features'),
  };
  const title = 'EMOVEL UI Rebuilder Landing Page';

  return {
    version: 1,
    title,
    slug: slugify(title),
    brand,
    sections: [
      {
        kind: 'nav',
        props: {
          ...SURF,
          logoText: 'EMOVEL',
          links: [
            makeLink('Intelligence', '#features'),
            makeLink('Blueprint', '#blueprint'),
            makeLink('Export', '#export'),
            makeLink('FAQ', '#faq'),
          ],
          ctaLabel: 'Start Rebuild',
          ctaHref: '#cta',
          position: 'sticky',
        },
      },
      {
        kind: 'hero',
        props: {
          ...SURF,
          eyebrow: 'EMOVEL UI Rebuilder',
          title: 'Rebuild Any Reference Into a Premium Commercial Page',
          subtitle:
            'Analyze proven pages, extract their conversion logic and generate an EMOVEL-ready blueprint for landing pages, product pages and digital offers.',
          primaryCtaLabel: 'Create Blueprint',
          primaryCtaHref: '#cta',
          secondaryCtaLabel: 'Explore Logic',
          secondaryCtaHref: '#features',
          motionPattern: 'depth-push',
          enableCinematicLogo: 'true',
        },
      },
      {
        kind: 'featureGrid',
        props: {
          ...SURF,
          eyebrow: 'Core system',
          headline: 'From reference page to commercial blueprint.',
          subheadline:
            'The preset translates the static UI Rebuilder direction into editable builder sections that keep the conversion strategy visible.',
          features: [
            {
              icon: '01',
              title: 'Reference Intelligence',
              body: 'Identify the page structure, offer hierarchy, visual rhythm and persuasive moments that make a reference work.',
            },
            {
              icon: '02',
              title: 'Commercial DNA',
              body: 'Extract the reusable conversion logic behind the design instead of copying surface-level styling.',
            },
            {
              icon: '03',
              title: 'EMOVEL Rebuild Blueprint',
              body: 'Convert the insight into a page-ready blueprint aligned with EMOVEL sections, tone and export needs.',
            },
          ],
          columns: DEFAULT_GENERATED_COLUMNS,
        },
      },
      {
        kind: 'contentBlock',
        props: {
          ...SURF,
          eyebrow: 'Commercial DNA',
          headline: 'Understand why the reference converts before rebuilding it.',
          body:
            'UI Rebuilder treats a reference page as a strategic artifact. It reads the promise, audience, objections, proof, CTA pressure and section order, then turns that commercial logic into a reusable planning layer for new EMOVEL pages.',
          alignment: 'left',
          layout: 'prose',
        },
      },
      {
        kind: 'featureSplit',
        props: {
          ...SURF,
          eyebrow: 'Claude Code Prompt Export',
          headline: 'Package the rebuild as an implementation-ready prompt.',
          body:
            'The final blueprint can be shaped into a precise Claude Code prompt with page intent, section order, copy direction, interaction notes and quality constraints. The goal is not raw JSX output; it is a clean build brief that stays compatible with the EMOVEL page engine.',
          ctaLabel: 'Prepare Export',
          ctaHref: '#cta',
          imageUrl: '',
          imageAlt: 'Blueprint export preview',
          imagePosition: 'right',
        },
      },
      {
        kind: 'cta',
        props: {
          ...SURF,
          headline: 'Turn the next winning reference into an EMOVEL-ready build plan.',
          subheadline:
            'Use UI Rebuilder to move from inspiration to structured commercial blueprint, then continue inside the Builder where every section remains editable.',
          primaryAction: 'Start Rebuild',
          secondaryAction: 'Export PageSpec',
          supportText: 'Editable in Puck. Exportable through the existing Builder flow.',
        },
      },
      {
        kind: 'faq',
        props: {
          ...SURF,
          eyebrow: 'FAQ',
          headline: 'How UI Rebuilder fits the Builder.',
          subheadline: '',
          items: [
            {
              question: 'Does this create a static React/Tailwind page?',
              answer: 'No. This preset creates PageSpec and Puck Data so the result stays editable inside EMOVEL Page Builder.',
            },
            {
              question: 'What does Reference Intelligence mean?',
              answer: 'It means analyzing the structure, conversion logic, proof, CTA flow and offer clarity behind a proven page.',
            },
            {
              question: 'Can the generated page be published normally?',
              answer: 'Yes. The generated page uses existing Puck sections, so JSON export and ZIP publish continue to work.',
            },
            {
              question: 'Does this call an external AI service?',
              answer: 'No. This preset is deterministic and local.',
            },
          ],
          layout: 'accordion',
        },
      },
      {
        kind: 'footer',
        props: {
          logoText: 'EMOVEL',
          tagline: 'Premium page systems from reference intelligence to editable output.',
          linkGroups: [
            {
              heading: 'System',
              links: [
                makeLink('Reference Intelligence', '#features'),
                makeLink('Blueprint', '#blueprint'),
                makeLink('Prompt Export', '#export'),
              ],
            },
            {
              heading: 'Builder',
              links: [
                makeLink('Page Builder', '#'),
                makeLink('PageSpec', '#'),
                makeLink('Publish', '#'),
              ],
            },
            {
              heading: 'Legal',
              links: [
                makeLink('Privacy', '#privacy'),
                makeLink('Terms', '#terms'),
              ],
            },
          ],
          copyright: `© ${new Date().getFullYear()} EMOVEL. All rights reserved.`,
          socialLinks: [
            makeLink('LinkedIn', '#'),
            makeLink('X', '#'),
          ],
        },
      },
    ],
    meta: {
      source: 'prompt',
      prompt,
      generatedAt: new Date().toISOString(),
      generator: 'deterministic-v1',
    },
  };
}

export function generatePageSpecFromPrompt(
  rawPrompt: string,
  preset: PageGenerationPreset = 'auto',
): PageSpec {
  const prompt = cleanText(rawPrompt) || DEFAULT_PROMPT;
  if (shouldUseEmovelHomePreset(prompt, preset)) {
    return buildEmovelHomePageSpec(prompt);
  }

  if (shouldUseUiRebuilderPreset(prompt, preset)) {
    return buildUiRebuilderPageSpec(prompt);
  }

  const brand = buildBrand(prompt);
  const title = `${brand.name} Generated Page`;

  return {
    version: 1,
    title,
    slug: slugify(title),
    brand,
    sections: buildSections(prompt, brand),
    meta: {
      source: 'prompt',
      prompt,
      generatedAt: new Date().toISOString(),
      generator: 'deterministic-v1',
    },
  };
}
