export type MotionPattern =
  | 'slide-fade'
  | 'depth-push'
  | 'parallax-reveal'
  | 'staggered-rise';

export type CtaLink = { label: string; href: string };

export type HeroSectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
  motionPattern?: MotionPattern;
  enableCinematicLogo?: boolean;
  brandImageUrl?: string;
  brandImageAlt?: string;
};
