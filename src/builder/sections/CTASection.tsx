import type { CTAProps } from '../section-contract';

export function CTASection(props: CTAProps) {
  const { headline, subheadline, primaryAction, secondaryAction, supportText } = props;

  return (
    <section className="emovel-cta">
      <style>{`
        .emovel-cta {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 100%, var(--color-glow), transparent 32rem),
            linear-gradient(180deg, var(--color-surface), var(--color-background));
          color: var(--color-textPrimary);
          border-top: 1px solid var(--color-border);
        }

        .emovel-cta__inner {
          width: min(100%, 72rem);
          margin: 0 auto;
          padding: clamp(var(--space-section-v), 8vw, 7rem) clamp(1.25rem, 4vw, var(--space-section-h));
        }

        .emovel-cta__panel {
          position: relative;
          overflow: hidden;
          max-width: 58rem;
          margin: 0 auto;
          padding: clamp(2rem, 6vw, 4.25rem);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          background:
            linear-gradient(180deg, color-mix(in srgb, var(--color-surfaceAlt) 76%, transparent), var(--color-surface)),
            var(--color-surface);
          box-shadow: 0 1.5rem 4.5rem color-mix(in srgb, var(--color-background) 58%, transparent);
          text-align: center;
        }

        .emovel-cta__panel::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background:
            linear-gradient(90deg, transparent, var(--color-glow), transparent);
          opacity: 0.42;
          pointer-events: none;
        }

        .emovel-cta__content {
          position: relative;
          z-index: 1;
          max-width: 44rem;
          margin: 0 auto;
        }

        .emovel-cta__headline {
          margin: 0;
          color: var(--color-textPrimary);
          font-size: clamp(2.15rem, 5vw, 4.5rem);
          font-weight: 760;
          letter-spacing: -0.04em;
          line-height: 1.02;
          text-wrap: balance;
        }

        .emovel-cta__subheadline {
          max-width: 38rem;
          margin: clamp(1rem, 2.6vw, 1.4rem) auto 0;
          color: var(--color-textSecondary);
          font-size: clamp(1rem, 1.45vw, 1.18rem);
          line-height: 1.7;
        }

        .emovel-cta__actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.85rem;
          margin-top: clamp(1.75rem, 4vw, 2.4rem);
        }

        .emovel-cta__button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 3rem;
          padding: 0.88rem 1.25rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surfaceAlt);
          color: var(--color-textPrimary);
          font: inherit;
          font-size: 0.95rem;
          font-weight: 800;
          line-height: 1;
          text-decoration: none;
          transition:
            transform var(--motion-duration) var(--motion-ease),
            border-color var(--motion-duration) var(--motion-ease),
            background var(--motion-duration) var(--motion-ease),
            color var(--motion-duration) var(--motion-ease),
            box-shadow var(--motion-duration) var(--motion-ease);
        }

        .emovel-cta__button:hover {
          transform: translateY(-1px);
          border-color: var(--color-primary);
        }

        .emovel-cta__button--primary {
          border-color: var(--color-primary);
          background: var(--color-primary);
          color: var(--color-background);
          box-shadow: 0 1rem 2.6rem var(--color-glow);
        }

        .emovel-cta__button--primary:hover {
          box-shadow: 0 1.25rem 3.25rem var(--color-glow);
        }

        .emovel-cta__button--secondary {
          background: color-mix(in srgb, var(--color-surfaceAlt) 76%, transparent);
          color: var(--color-textPrimary);
        }

        .emovel-cta__support {
          max-width: 34rem;
          margin: clamp(1.1rem, 3vw, 1.45rem) auto 0;
          color: var(--color-textSecondary);
          font-size: 0.9rem;
          line-height: 1.6;
        }

        @media (max-width: 42rem) {
          .emovel-cta__inner {
            padding-block: 4rem;
          }

          .emovel-cta__panel {
            text-align: left;
          }

          .emovel-cta__subheadline,
          .emovel-cta__support {
            margin-left: 0;
            margin-right: 0;
          }

          .emovel-cta__actions {
            flex-direction: column;
            align-items: stretch;
          }

          .emovel-cta__button {
            width: 100%;
          }
        }
      `}</style>

      <div className="emovel-cta__inner">
        <div className="emovel-cta__panel">
          <div className="emovel-cta__content">
            <h2 className="emovel-cta__headline">{headline}</h2>
            {subheadline ? <p className="emovel-cta__subheadline">{subheadline}</p> : null}

            <div className="emovel-cta__actions" aria-label="Call to action">
              {primaryAction ? (
                <a className="emovel-cta__button emovel-cta__button--primary" href="#primary-action">
                  {primaryAction}
                </a>
              ) : null}
              {secondaryAction ? (
                <a className="emovel-cta__button emovel-cta__button--secondary" href="#secondary-action">
                  {secondaryAction}
                </a>
              ) : null}
            </div>

            {supportText ? <p className="emovel-cta__support">{supportText}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
