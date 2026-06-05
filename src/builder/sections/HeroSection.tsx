import type { HeroProps } from '../section-contract';

export type HeroStyle = 'minimal' | 'editorial' | 'cinematic' | 'split';

export type HeroSectionProps = HeroProps & {
  heroStyle?:       HeroStyle;
  backgroundImage?: string;
  mediaUrl?:        string;
};

const YEAR = new Date().getFullYear();

export function HeroSection(props: HeroSectionProps) {
  const {
    eyebrow,
    headline,
    description,
    primaryCTA,
    secondaryCTA,
    heroStyle      = 'minimal',
    backgroundImage,
    mediaUrl,
  } = props;

  const hasBg = heroStyle === 'cinematic' && !!backgroundImage;

  const primaryBtn = primaryCTA ? (
    <a className="emovel-hero__btn emovel-hero__btn--primary" href="#primary">{primaryCTA}</a>
  ) : null;

  const secondaryBtn = secondaryCTA ? (
    <a className="emovel-hero__btn emovel-hero__btn--secondary" href="#secondary">{secondaryCTA}</a>
  ) : null;

  const actions = (primaryBtn || secondaryBtn) ? (
    <div className="emovel-hero__actions">{primaryBtn}{secondaryBtn}</div>
  ) : null;

  return (
    <section
      className="emovel-hero"
      data-style={heroStyle}
      data-has-bg={hasBg ? 'true' : undefined}
      style={hasBg ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      <style>{`
        /* ── Base ───────────────────────────────────────────────────────────── */
        .emovel-hero {
          position: relative;
          overflow: hidden;
          background: var(--color-background);
          color: var(--color-textPrimary);
          border-bottom: 1px solid var(--color-border);
          container-type: inline-size;
        }

        .emovel-hero__inner {
          width: min(100%, 72rem);
          margin: 0 auto;
          padding:
            clamp(var(--space-hero-v), 8vw, 7.5rem)
            clamp(1.25rem, 4vw, var(--space-hero-h));
        }

        /* ── Shared copy elements ──────────────────────────────────────────── */
        .emovel-hero__eyebrow {
          margin: 0 0 1rem;
          color: var(--color-secondary);
          font-size: clamp(0.7rem, 1vw, 0.8rem);
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .emovel-hero__headline {
          margin: 0;
          color: var(--color-textPrimary);
          font-size: clamp(2.6rem, 7vw, 5.2rem);
          font-weight: 780;
          letter-spacing: -0.04em;
          line-height: 0.96;
          text-wrap: balance;
        }

        .emovel-hero__description {
          max-width: 38rem;
          margin: clamp(1.2rem, 2.5vw, 1.75rem) 0 0;
          color: var(--color-textSecondary);
          font-size: clamp(0.95rem, 1.4vw, 1.1rem);
          line-height: 1.7;
        }

        .emovel-hero__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: clamp(1.75rem, 4vw, 2.5rem);
        }

        /* ── Buttons ──────────────────────────────────────────────────────── */
        .emovel-hero__btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 2.85rem;
          padding: 0.75rem 1.4rem;
          border-radius: var(--radius-md);
          font: inherit;
          font-size: 0.9rem;
          font-weight: 700;
          line-height: 1;
          text-decoration: none;
          white-space: nowrap;
          transition:
            transform var(--motion-duration) var(--motion-ease),
            box-shadow var(--motion-duration) var(--motion-ease),
            border-color var(--motion-duration) var(--motion-ease);
        }

        .emovel-hero__btn--primary {
          background: var(--color-primary);
          color: var(--color-background);
          border: 1px solid var(--color-primary);
        }

        .emovel-hero__btn--primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px var(--color-glow);
        }

        .emovel-hero__btn--secondary {
          background: transparent;
          color: var(--color-textPrimary);
          border: 1px solid var(--color-border);
        }

        .emovel-hero__btn--secondary:hover {
          transform: translateY(-1px);
          border-color: var(--color-primary);
        }

        /* ══════════════════════════════════════════════════════════════════════
           MINIMAL — centered, large, generous negative space, zero decoration
           ══════════════════════════════════════════════════════════════════════ */
        .emovel-hero[data-style="minimal"] .emovel-hero__inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding-block: clamp(5rem, 12vw, 9rem);
        }

        .emovel-hero[data-style="minimal"] .emovel-hero__copy {
          max-width: 54rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .emovel-hero[data-style="minimal"] .emovel-hero__headline {
          font-size: clamp(3.2rem, 8.5vw, 6.5rem);
          font-weight: 800;
          letter-spacing: -0.05em;
        }

        .emovel-hero[data-style="minimal"] .emovel-hero__description {
          text-align: center;
        }

        .emovel-hero[data-style="minimal"] .emovel-hero__actions {
          justify-content: center;
        }

        /* ══════════════════════════════════════════════════════════════════════
           EDITORIAL — asymmetric magazine layout, typography-first
           ══════════════════════════════════════════════════════════════════════ */
        .emovel-hero[data-style="editorial"] .emovel-hero__inner {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 0;
          padding-block: clamp(4rem, 9vw, 6.5rem);
        }

        .emovel-hero__ed-left {
          padding-right: clamp(2rem, 5vw, 3.5rem);
          border-right: 1px solid var(--color-border);
        }

        .emovel-hero__ed-right {
          padding-left: clamp(2rem, 5vw, 3.5rem);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1.5rem;
        }

        .emovel-hero[data-style="editorial"] .emovel-hero__headline {
          font-family: "Cinzel", serif;
          font-size: clamp(2.8rem, 7.5vw, 5.4rem);
          line-height: 0.94;
          letter-spacing: -0.02em;
        }

        .emovel-hero__ed-index {
          display: block;
          font-family: "JetBrains Mono", "Courier New", monospace;
          font-size: 0.72rem;
          font-weight: 400;
          color: var(--color-textSecondary);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .emovel-hero[data-style="editorial"] .emovel-hero__description {
          margin-top: 0;
          flex: 1;
        }

        .emovel-hero[data-style="editorial"] .emovel-hero__actions {
          margin-top: 0;
        }

        /* ══════════════════════════════════════════════════════════════════════
           CINEMATIC — full-height, background image support, text bottom-left
           ══════════════════════════════════════════════════════════════════════ */
        .emovel-hero[data-style="cinematic"] {
          background: var(--color-surface);
          background-size: cover;
          background-position: center;
          min-height: clamp(28rem, 60vh, 50rem);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        /* Flat token-based overlay for readability when a background image is set */
        .emovel-hero__cin-overlay {
          position: absolute;
          inset: 0;
          background: color-mix(in srgb, var(--color-background) 52%, transparent);
          pointer-events: none;
        }

        .emovel-hero[data-style="cinematic"] .emovel-hero__inner {
          position: relative;
          z-index: 1;
          padding-block-start: clamp(3rem, 8vw, 5rem);
        }

        .emovel-hero[data-style="cinematic"] .emovel-hero__copy {
          max-width: 44rem;
        }

        /* ══════════════════════════════════════════════════════════════════════
           SPLIT — text left, media right
           ══════════════════════════════════════════════════════════════════════ */
        .emovel-hero[data-style="split"] .emovel-hero__inner {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: clamp(2.5rem, 6vw, 4.5rem);
          align-items: center;
          padding-block: clamp(var(--space-hero-v), 8vw, 7rem);
        }

        .emovel-hero[data-style="split"] .emovel-hero__copy {
          max-width: 36rem;
        }

        .emovel-hero__media {
          min-height: clamp(18rem, 36vw, 30rem);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          background: var(--color-surfaceAlt);
          overflow: hidden;
          display: flex;
          align-items: stretch;
        }

        .emovel-hero__media-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .emovel-hero__media-ph {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-textSecondary);
          font-family: "JetBrains Mono", "Courier New", monospace;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        /* ── Container responsive breakpoints ─────────────────────────────── */
        @container (max-width: 54rem) {
          .emovel-hero[data-style="editorial"] .emovel-hero__inner,
          .emovel-hero[data-style="split"] .emovel-hero__inner {
            grid-template-columns: 1fr;
          }

          .emovel-hero__ed-left {
            border-right: none;
            border-bottom: 1px solid var(--color-border);
            padding-right: 0;
            padding-bottom: clamp(1.5rem, 3vw, 2rem);
          }

          .emovel-hero__ed-right {
            padding-left: 0;
            padding-top: clamp(1.5rem, 3vw, 2rem);
          }

          .emovel-hero__media {
            min-height: 18rem;
          }
        }

        @container (max-width: 36rem) {
          .emovel-hero__actions {
            flex-direction: column;
          }

          .emovel-hero__btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>

      {/* ── MINIMAL ──────────────────────────────────────────────────────── */}
      {heroStyle === 'minimal' && (
        <div className="emovel-hero__inner">
          <div className="emovel-hero__copy">
            {eyebrow   && <p className="emovel-hero__eyebrow">{eyebrow}</p>}
            <h1 className="emovel-hero__headline">{headline}</h1>
            {description && <p className="emovel-hero__description">{description}</p>}
            {actions}
          </div>
        </div>
      )}

      {/* ── EDITORIAL ────────────────────────────────────────────────────── */}
      {heroStyle === 'editorial' && (
        <div className="emovel-hero__inner">
          <div className="emovel-hero__ed-left">
            {eyebrow && <p className="emovel-hero__eyebrow">{eyebrow}</p>}
            <h1 className="emovel-hero__headline">{headline}</h1>
          </div>
          <div className="emovel-hero__ed-right">
            <span className="emovel-hero__ed-index">01 — {YEAR}</span>
            {description && <p className="emovel-hero__description">{description}</p>}
            {actions}
          </div>
        </div>
      )}

      {/* ── CINEMATIC ────────────────────────────────────────────────────── */}
      {heroStyle === 'cinematic' && (
        <>
          {hasBg && <div className="emovel-hero__cin-overlay" aria-hidden="true" />}
          <div className="emovel-hero__inner">
            <div className="emovel-hero__copy">
              {eyebrow   && <p className="emovel-hero__eyebrow">{eyebrow}</p>}
              <h1 className="emovel-hero__headline">{headline}</h1>
              {description && <p className="emovel-hero__description">{description}</p>}
              {actions}
            </div>
          </div>
        </>
      )}

      {/* ── SPLIT ────────────────────────────────────────────────────────── */}
      {heroStyle === 'split' && (
        <div className="emovel-hero__inner">
          <div className="emovel-hero__copy">
            {eyebrow   && <p className="emovel-hero__eyebrow">{eyebrow}</p>}
            <h1 className="emovel-hero__headline">{headline}</h1>
            {description && <p className="emovel-hero__description">{description}</p>}
            {actions}
          </div>
          <div className="emovel-hero__media">
            {mediaUrl
              ? <img src={mediaUrl} alt="" className="emovel-hero__media-img" />
              : <div className="emovel-hero__media-ph" aria-hidden="true">
                  <span>Media</span>
                </div>
            }
          </div>
        </div>
      )}
    </section>
  );
}
