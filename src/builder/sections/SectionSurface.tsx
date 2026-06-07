import type { ReactNode } from 'react';
import type { SurfaceVariant, WidthVariant } from '../section-contract';

export interface SectionSurfaceProps {
  surface: SurfaceVariant;
  width: WidthVariant;
  backgroundImageUrl?: string;
  /** Semantic element override — defaults to 'section' */
  as?: 'section' | 'footer' | 'nav';
  /** Section-specific BEM root class forwarded to the outer element */
  className?: string;
  /** id forwarded to the outer landmark element (for anchor navigation) */
  id?: string;
  /** aria-label forwarded to the outer landmark element (primarily for <nav>) */
  ariaLabel?: string;
  children: ReactNode;
}

// ── CSS ───────────────────────────────────────────────────────────────────────
// All surface + width logic lives here — one place, not copy-pasted per section.
// Overlay uses the same dark gradient invariant as CardSection's image variant.

const SURF_CSS = `
.emovel-surf {
  position: relative;
  color: var(--color-textPrimary);
  container-type: inline-size;
}

/* ── Surface backgrounds ── */
.emovel-surf--transparent { background: transparent; }
.emovel-surf--base        { background: var(--color-background); }
.emovel-surf--surface     { background: var(--color-surface); }
.emovel-surf--surfaceAlt  { background: var(--color-surfaceAlt); }
.emovel-surf--image       { background: var(--color-background); }
.emovel-surf--gradient {
  background: linear-gradient(180deg, var(--color-background) 0%, var(--color-surface) 100%);
}

/* ── Width ── */
.emovel-surf--contained { /* natural block width — no override needed */ }
.emovel-surf--full-bleed {
  width: 100vw;
  margin-left: calc(50% - 50vw);
}

/* ── Image background layer ── */
.emovel-surf__bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* ── Dark gradient overlay — always dark so text ≥ AA over any photo ── */
.emovel-surf__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    160deg,
    rgba(0,0,0,.12) 0%,
    rgba(0,0,0,.62) 50%,
    rgba(0,0,0,.82) 100%
  );
}

/* ── Content wrapper — lifts section content above bg/overlay layers ── */
.emovel-surf__content {
  position: relative;
  z-index: 1;
}

/* Image surface: force white text for legibility over the dark overlay */
.emovel-surf--image .emovel-surf__content {
  color: rgba(255,255,255,1);
}
`.trim();

// ── Component ─────────────────────────────────────────────────────────────────

export function SectionSurface({
  surface,
  width,
  backgroundImageUrl = '',
  as = 'section',
  className,
  id,
  ariaLabel,
  children,
}: SectionSurfaceProps) {
  const isImage = surface === 'image';
  const hasBg   = isImage && Boolean(backgroundImageUrl);

  const outerClass = [
    'emovel-surf',
    `emovel-surf--${surface}`,
    `emovel-surf--${width}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      <style>{SURF_CSS}</style>

      {hasBg ? (
        <div
          className="emovel-surf__bg"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
          aria-hidden="true"
        />
      ) : null}

      {isImage ? (
        <div className="emovel-surf__overlay" aria-hidden="true" />
      ) : null}

      <div className="emovel-surf__content">
        {children}
      </div>
    </>
  );

  if (as === 'footer') return <footer  id={id} className={outerClass}>{inner}</footer>;
  if (as === 'nav')    return <nav     id={id} className={outerClass} aria-label={ariaLabel}>{inner}</nav>;
  return                      <section id={id} className={outerClass}>{inner}</section>;
}
