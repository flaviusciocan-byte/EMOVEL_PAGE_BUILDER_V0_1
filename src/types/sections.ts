export type MotionPattern =
  | 'slide-fade'
  | 'depth-push'
  | 'parallax-reveal'
  | 'staggered-rise';

export type CtaLink = { label: string; href: string };

export type SurfaceVariant = 'transparent' | 'base' | 'surface' | 'surfaceAlt' | 'image' | 'gradient';
export type WidthVariant   = 'contained' | 'full-bleed';

export type HeroSectionProps = {
  id?: string;
  surface?: SurfaceVariant;
  width?: WidthVariant;
  backgroundImageUrl?: string;
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
