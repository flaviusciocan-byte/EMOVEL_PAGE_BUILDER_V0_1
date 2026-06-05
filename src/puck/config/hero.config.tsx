import { HeroSection } from '../../components/sections/HeroSection';
import type { MotionPattern } from '../../types/sections';

// ── Stored props ──────────────────────────────────────────────────────────────
// Puck stores all field values as strings/primitives. CTAs are flattened into
// separate label/href fields because Puck does not support nested object fields.
// enableCinematicLogo is stored as 'true'|'false' (Puck has no boolean field type).

export type HeroStoredProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  motionPattern: MotionPattern;
  enableCinematicLogo: 'true' | 'false';
  brandImageUrl?: string;
  brandImageAlt?: string;
};

// ── Field definitions ─────────────────────────────────────────────────────────

export const heroFields = {
  eyebrow: {
    type: 'text' as const,
    label: 'Eyebrow (optional)',
  },
  title: {
    type: 'text' as const,
    label: 'Title',
  },
  subtitle: {
    type: 'textarea' as const,
    label: 'Subtitle (optional)',
  },
  primaryCtaLabel: {
    type: 'text' as const,
    label: 'Primary CTA — label',
  },
  primaryCtaHref: {
    type: 'text' as const,
    label: 'Primary CTA — href',
  },
  secondaryCtaLabel: {
    type: 'text' as const,
    label: 'Secondary CTA — label',
  },
  secondaryCtaHref: {
    type: 'text' as const,
    label: 'Secondary CTA — href',
  },
  motionPattern: {
    type: 'select' as const,
    label: 'Motion pattern',
    options: [
      { value: 'depth-push',      label: 'Depth push (3D entrance)' },
      { value: 'slide-fade',      label: 'Slide fade'               },
      { value: 'parallax-reveal', label: 'Parallax reveal'          },
      { value: 'staggered-rise',  label: 'Staggered rise'           },
    ],
  },
  enableCinematicLogo: {
    type: 'select' as const,
    label: 'Cinematic logo wings',
    options: [
      { value: 'true',  label: 'Enabled'  },
      { value: 'false', label: 'Disabled' },
    ],
  },
  brandImageUrl: {
    type: 'text' as const,
    label: 'Brand image URL (optional)',
  },
  brandImageAlt: {
    type: 'text' as const,
    label: 'Brand image alt text',
  },
};

// ── Default props ─────────────────────────────────────────────────────────────

export const heroDefaultProps: HeroStoredProps = {
  eyebrow:             'Your brand',
  title:               'A headline that earns attention.',
  subtitle:            'One or two sentences that frame what you offer and who it is for.',
  primaryCtaLabel:     'Get started',
  primaryCtaHref:      '#',
  secondaryCtaLabel:   'Learn more',
  secondaryCtaHref:    '#',
  motionPattern:       'depth-push',
  enableCinematicLogo: 'true',
  brandImageUrl:       '',
  brandImageAlt:       '',
};

// ── Render function ───────────────────────────────────────────────────────────
// Composes flat Puck-stored fields into the typed HeroSectionProps contract.

export function renderHero(props: HeroStoredProps) {
  return (
    <HeroSection
      eyebrow={props.eyebrow || undefined}
      title={props.title}
      subtitle={props.subtitle || undefined}
      primaryCta={
        props.primaryCtaLabel
          ? { label: props.primaryCtaLabel, href: props.primaryCtaHref }
          : undefined
      }
      secondaryCta={
        props.secondaryCtaLabel
          ? { label: props.secondaryCtaLabel, href: props.secondaryCtaHref }
          : undefined
      }
      motionPattern={props.motionPattern}
      enableCinematicLogo={props.enableCinematicLogo !== 'false'}
      brandImageUrl={props.brandImageUrl || undefined}
      brandImageAlt={props.brandImageAlt || props.title}
    />
  );
}
