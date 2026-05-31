import type { HeroProps } from '../section-contract';

// visualStyle is an internal layout variant — not in the contract, not a Puck field.
// When used via Puck the default 'panel' is always applied.
type InternalHeroProps = HeroProps & {
  visualStyle?: 'panel' | 'orbital' | 'minimal';
};

export function HeroSection(props: InternalHeroProps) {
  const {
    eyebrow,
    headline,
    description,
    primaryCTA,
    secondaryCTA,
    visualStyle = 'panel',
  } = props;

  const showVisual = visualStyle !== 'minimal';
  const visualClass =
    visualStyle === 'orbital'
      ? 'emovel-hero__visual emovel-hero__visual--orbital'
      : 'emovel-hero__visual';

  return (
    <section className="emovel-hero" data-visual-style={visualStyle}>
      <style>{`
        .emovel-hero {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 18% 18%, var(--color-glow), transparent 34rem),
            linear-gradient(135deg, var(--color-background), var(--color-surface));
          color: var(--color-textPrimary);
          border-bottom: 1px solid var(--color-border);
        }

        .emovel-hero__inner {
          width: min(100%, 72rem);
          margin: 0 auto;
          padding: clamp(var(--space-hero-v), 8vw, 7.5rem) clamp(1.25rem, 4vw, var(--space-hero-h));
          display: grid;
          grid-template-columns: minmax(0, 1.04fr) minmax(18rem, 0.78fr);
          gap: clamp(2.5rem, 6vw, 5rem);
          align-items: center;
        }

        .emovel-hero__copy {
          position: relative;
          z-index: 1;
          max-width: 42rem;
        }

        .emovel-hero__eyebrow {
          margin: 0 0 1rem;
          color: var(--color-secondary);
          font-size: clamp(0.72rem, 1vw, 0.82rem);
          font-weight: 700;
          letter-spacing: 0.18em;
          line-height: 1.35;
          text-transform: uppercase;
        }

        .emovel-hero__headline {
          margin: 0;
          color: var(--color-textPrimary);
          font-size: clamp(2.65rem, 7vw, 5.7rem);
          font-weight: 760;
          letter-spacing: -0.045em;
          line-height: 0.96;
          text-wrap: balance;
        }

        .emovel-hero__description {
          max-width: 38rem;
          margin: clamp(1.25rem, 2.5vw, 1.75rem) 0 0;
          color: var(--color-textSecondary);
          font-size: clamp(1rem, 1.45vw, 1.2rem);
          line-height: 1.7;
        }

        .emovel-hero__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.85rem;
          margin-top: clamp(1.8rem, 4vw, 2.5rem);
        }

        .emovel-hero__button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 3rem;
          padding: 0.85rem 1.25rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surfaceAlt);
          color: var(--color-textPrimary);
          font: inherit;
          font-size: 0.95rem;
          font-weight: 700;
          line-height: 1;
          text-decoration: none;
          transition:
            transform var(--motion-duration) var(--motion-ease),
            border-color var(--motion-duration) var(--motion-ease),
            background var(--motion-duration) var(--motion-ease),
            color var(--motion-duration) var(--motion-ease),
            box-shadow var(--motion-duration) var(--motion-ease);
        }

        .emovel-hero__button:hover {
          transform: translateY(-1px);
          border-color: var(--color-primary);
          box-shadow: 0 1rem 2.5rem var(--color-glow);
        }

        .emovel-hero__button--primary {
          border-color: var(--color-primary);
          background: var(--color-primary);
          color: var(--color-background);
        }

        .emovel-hero__button--secondary {
          background: color-mix(in srgb, var(--color-surfaceAlt) 78%, transparent);
        }

        .emovel-hero__visual {
          position: relative;
          min-height: clamp(19rem, 38vw, 31rem);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          background:
            linear-gradient(180deg, color-mix(in srgb, var(--color-surfaceAlt) 74%, transparent), var(--color-surface)),
            radial-gradient(circle at 50% 0%, var(--color-glow), transparent 60%);
          box-shadow: 0 1.6rem 4.5rem color-mix(in srgb, var(--color-background) 58%, transparent);
          overflow: hidden;
        }

        .emovel-hero__visual::before,
        .emovel-hero__visual::after {
          content: "";
          position: absolute;
          inset: clamp(1.15rem, 3vw, 1.75rem);
          border: 1px solid var(--color-border);
          border-radius: calc(var(--radius-lg) - 0.35rem);
        }

        .emovel-hero__visual::after {
          inset: auto clamp(1.15rem, 3vw, 1.75rem) clamp(1.15rem, 3vw, 1.75rem);
          height: 38%;
          background:
            linear-gradient(90deg, var(--color-primary), var(--color-secondary)),
            var(--color-surfaceAlt);
          opacity: 0.18;
        }

        .emovel-hero__visual-core {
          position: absolute;
          inset: 24% 18% auto;
          height: 34%;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          box-shadow: inset 0 1px 0 color-mix(in srgb, var(--color-textPrimary) 12%, transparent);
        }

        .emovel-hero__visual-core::before,
        .emovel-hero__visual-core::after {
          content: "";
          position: absolute;
          left: 12%;
          right: 12%;
          height: 1px;
          background: var(--color-border);
        }

        .emovel-hero__visual-core::before { top: 38%; }
        .emovel-hero__visual-core::after  { top: 62%; }

        .emovel-hero__visual--orbital .emovel-hero__visual-core {
          inset: 28% 22% auto;
          height: 44%;
          border-radius: var(--radius-pill);
        }

        .emovel-hero__visual--orbital::before {
          border-radius: var(--radius-pill);
          transform: rotate(-10deg);
        }

        .emovel-hero__visual--orbital::after {
          height: 1px;
          inset: 50% 12% auto;
          opacity: 0.34;
        }

        @media (max-width: 54rem) {
          .emovel-hero__inner {
            grid-template-columns: 1fr;
          }
          .emovel-hero__copy {
            max-width: 100%;
          }
          .emovel-hero__visual {
            min-height: 18rem;
          }
        }

        @media (max-width: 34rem) {
          .emovel-hero__inner {
            padding-block: 4rem;
          }
          .emovel-hero__actions {
            flex-direction: column;
          }
          .emovel-hero__button {
            width: 100%;
          }
        }
      `}</style>

      <div className="emovel-hero__inner">
        <div className="emovel-hero__copy">
          {eyebrow ? <p className="emovel-hero__eyebrow">{eyebrow}</p> : null}
          <h1 className="emovel-hero__headline">{headline}</h1>
          {description ? <p className="emovel-hero__description">{description}</p> : null}

          <div className="emovel-hero__actions" aria-label="Hero actions">
            {primaryCTA ? (
              <a className="emovel-hero__button emovel-hero__button--primary" href="#primary-action">
                {primaryCTA}
              </a>
            ) : null}
            {secondaryCTA ? (
              <a className="emovel-hero__button emovel-hero__button--secondary" href="#secondary-action">
                {secondaryCTA}
              </a>
            ) : null}
          </div>
        </div>

        {showVisual ? (
          <div className={visualClass} aria-hidden="true">
            <div className="emovel-hero__visual-core" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
