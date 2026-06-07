// CardSection — premium standalone card with four visual variants.
// All colors via var(--color-*). All radius via var(--radius-*).
// Exception: "image" variant forces rgba(255,255,255,...) text over its dark gradient
// overlay — that is an accessibility invariant, not a theme color.

import type { CardProps } from '../section-contract';
import { SectionSurface } from './SectionSurface';

export function CardSection(props: CardProps) {
  const {
    surface, width, backgroundImageUrl,
    variant, title, body, eyebrow,
    cardImageUrl, objectImageUrl,
    ctaLabel, ctaHref,
  } = props;

  const isImage = variant === 'image';

  return (
    <SectionSurface surface={surface} width={width} backgroundImageUrl={backgroundImageUrl} className={`emovel-card emovel-card--${variant}`}>
      <style>{`
        /* ── Section shell ──────────────────────────────────── */
        .emovel-card {
          /* background and container-type provided by SectionSurface */
        }

        .emovel-card__inner {
          width: min(100%, 72rem);
          margin: 0 auto;
          padding:
            clamp(var(--space-section-v), 6vw, 5.5rem)
            clamp(1.25rem, 4vw, var(--space-section-h));
        }

        /* ── Card shell ─────────────────────────────────────── */
        .emovel-card__card {
          position: relative;
          overflow: hidden;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
        }

        /* ── Solid variant ──────────────────────────────────── */
        .emovel-card--solid .emovel-card__card {
          background: var(--color-surface);
          box-shadow:
            0 2px 8px rgba(0,0,0,.08),
            0 8px 32px rgba(0,0,0,.06),
            inset 0 1px 0 rgba(255,255,255,.04);
          transition: box-shadow var(--motion-duration) var(--motion-ease);
        }
        .emovel-card--solid .emovel-card__card:hover {
          box-shadow:
            0 4px 16px rgba(0,0,0,.12),
            0 16px 48px rgba(0,0,0,.09);
        }

        /* ── Glass variant ──────────────────────────────────── */
        .emovel-card--glass .emovel-card__card {
          background: color-mix(in srgb, var(--color-surface) 58%, transparent);
          backdrop-filter: blur(18px) saturate(1.4);
          -webkit-backdrop-filter: blur(18px) saturate(1.4);
          border: 1px solid var(--color-border);
          box-shadow: 0 4px 24px rgba(0,0,0,.10);
        }

        /* ── Outline variant ────────────────────────────────── */
        .emovel-card--outline .emovel-card__card {
          background: transparent;
          border: 1px solid var(--color-border);
        }

        /* ── Image variant ──────────────────────────────────── */
        .emovel-card--image .emovel-card__card {
          min-height: clamp(20rem, 50vw, 28rem);
        }

        /* Full-bleed background media layer */
        .emovel-card__bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          transform: scale(1.01); /* prevent hairline gaps at border-radius */
        }

        /* Gradient overlay — always dark, guarantees ≥ AA text contrast over any image */
        .emovel-card__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            rgba(0,0,0,.12) 0%,
            rgba(0,0,0,.62) 50%,
            rgba(0,0,0,.82) 100%
          );
        }

        /* Floating 3D object — top-right, screen blend drops black void */
        .emovel-card__object {
          position: absolute;
          top: clamp(-1.5rem, -3vw, -0.25rem);
          right: clamp(-1rem, -2vw, 0.25rem);
          width: clamp(7rem, 28vw, 13rem);
          max-width: 42%;
          height: auto;
          pointer-events: none;
          user-select: none;
          mix-blend-mode: screen;
          opacity: 0.92;
          z-index: 2;
        }

        /* ── Content ────────────────────────────────────────── */
        .emovel-card__content {
          position: relative;
          z-index: 1;
          padding: clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3.5vw, 2.5rem);
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        /* Image variant: push content toward the bottom of the card */
        .emovel-card--image .emovel-card__content {
          margin-top: auto;
        }

        /* Eyebrow */
        .emovel-card__eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          margin: 0;
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: clamp(0.68rem, 1vw, 0.78rem);
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-textSecondary);
        }
        .emovel-card__eyebrow::before {
          content: "";
          width: 0.28rem;
          height: 0.28rem;
          border-radius: var(--radius-pill);
          background: var(--color-primary);
          flex-shrink: 0;
        }

        /* Title */
        .emovel-card__title {
          margin: 0;
          font-size: clamp(1.65rem, 4vw, 2.5rem);
          font-weight: 760;
          letter-spacing: -0.03em;
          line-height: 1.12;
          color: var(--color-textPrimary);
          text-wrap: balance;
        }

        /* Body */
        .emovel-card__body {
          margin: 0;
          font-size: clamp(0.95rem, 1.4vw, 1.1rem);
          line-height: 1.65;
          color: var(--color-textSecondary);
          max-width: 56ch;
        }

        /* CTA button */
        .emovel-card__cta {
          display: inline-flex;
          align-items: center;
          align-self: flex-start;
          padding: 0.65rem 1.45rem;
          background: var(--color-primary);
          color: var(--color-background);
          border-radius: var(--radius-pill);
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.01em;
          text-decoration: none;
          transition:
            opacity var(--motion-duration) var(--motion-ease),
            transform var(--motion-duration) var(--motion-ease);
        }
        .emovel-card__cta:hover {
          opacity: 0.86;
          transform: translateY(-1px);
        }

        /* ── Image variant — forced-white text over the dark overlay ─── */
        /* rgba(255,255,255,...) is an accessibility invariant here,      */
        /* not a theme color — the overlay is always dark regardless of   */
        /* the active theme or palette.                                   */
        .emovel-card--image .emovel-card__eyebrow {
          color: rgba(255,255,255,.72);
        }
        .emovel-card--image .emovel-card__eyebrow::before {
          background: var(--color-primary);
        }
        .emovel-card--image .emovel-card__title {
          color: rgba(255,255,255,1);
        }
        .emovel-card--image .emovel-card__body {
          color: rgba(255,255,255,.82);
          max-width: 52ch;
        }
        .emovel-card--image .emovel-card__cta {
          background: rgba(255,255,255,.92);
          color: rgba(8,8,8,1);
        }

        /* ── Responsive ─────────────────────────────────────── */
        @container (max-width: 38rem) {
          .emovel-card__content {
            padding: 1.5rem;
          }
          .emovel-card--image .emovel-card__card {
            min-height: 18rem;
          }
          .emovel-card__object {
            width: clamp(5rem, 35vw, 9rem);
          }
        }
      `}</style>

      <div className="emovel-card__inner">
        <div className="emovel-card__card">

          {/* Background image layer — image variant only */}
          {isImage && cardImageUrl ? (
            <div
              className="emovel-card__bg"
              style={{ backgroundImage: `url(${cardImageUrl})` }}
              role="img"
              aria-label={title}
            />
          ) : null}

          {/* Dark gradient overlay — image variant only; ensures text ≥ AA over any photo */}
          {isImage ? (
            <div className="emovel-card__overlay" aria-hidden="true" />
          ) : null}

          {/* Floating 3D object — screen blend drops the black void from renders */}
          {objectImageUrl ? (
            <img
              className="emovel-card__object"
              src={objectImageUrl}
              alt=""
              aria-hidden="true"
            />
          ) : null}

          <div className="emovel-card__content">
            {eyebrow ? (
              <p className="emovel-card__eyebrow">{eyebrow}</p>
            ) : null}

            <h2 className="emovel-card__title">{title}</h2>

            {body ? (
              <p className="emovel-card__body">{body}</p>
            ) : null}

            {ctaLabel ? (
              <a className="emovel-card__cta" href={ctaHref || '#'}>
                {ctaLabel}
              </a>
            ) : null}
          </div>

        </div>
      </div>
    </SectionSurface>
  );
}
