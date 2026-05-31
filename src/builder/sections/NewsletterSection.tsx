import type { NewsletterProps } from '../section-contract';

export function NewsletterSection(props: NewsletterProps) {
  const {
    eyebrow,
    headline,
    subheadline,
    inputPlaceholder,
    ctaLabel,
    privacyNote,
    layout,
  } = props;

  const isSplit = layout === 'split';

  return (
    <section className="emovel-newsletter">
      <style>{`
        .emovel-newsletter {
          background:
            linear-gradient(135deg,
              color-mix(in srgb, var(--color-primary) 8%, var(--color-surface)),
              var(--color-surface)
            );
          border-bottom: 1px solid var(--color-border);
          color: var(--color-textPrimary);
        }

        .emovel-newsletter__inner {
          width: min(100%, 72rem);
          margin: 0 auto;
          padding:
            clamp(var(--space-section-v), 6vw, 5.5rem)
            clamp(1.25rem, 4vw, var(--space-section-h));
        }

        /* Centered layout */
        .emovel-newsletter__centered {
          text-align: center;
          max-width: 40rem;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.9rem;
        }

        /* Split layout */
        .emovel-newsletter__split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(2rem, 5vw, 4rem);
          align-items: center;
        }

        .emovel-newsletter__split-copy {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .emovel-newsletter__split-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .emovel-newsletter__eyebrow {
          margin: 0;
          font-size: clamp(0.7rem, 1vw, 0.8rem);
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-secondary);
        }

        .emovel-newsletter__headline {
          margin: 0;
          font-size: clamp(1.6rem, 3.5vw, 2.5rem);
          font-weight: 760;
          letter-spacing: -0.03em;
          line-height: 1.12;
          color: var(--color-textPrimary);
          text-wrap: balance;
        }

        .emovel-newsletter__subheadline {
          margin: 0;
          font-size: clamp(0.9rem, 1.3vw, 1rem);
          line-height: 1.65;
          color: var(--color-textSecondary);
        }

        .emovel-newsletter__form {
          display: flex;
          gap: 0.5rem;
          width: 100%;
          max-width: 28rem;
          flex-wrap: wrap;
        }

        .emovel-newsletter__centered .emovel-newsletter__form {
          margin: 0 auto;
        }

        .emovel-newsletter__input {
          flex: 1;
          min-width: 0;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background: color-mix(in srgb, var(--color-surfaceAlt) 90%, transparent);
          color: var(--color-textPrimary);
          font: inherit;
          font-size: 0.9rem;
          outline: none;
          transition:
            border-color var(--motion-duration) var(--motion-ease),
            box-shadow var(--motion-duration) var(--motion-ease);
        }

        .emovel-newsletter__input::placeholder {
          color: var(--color-textSecondary);
        }

        .emovel-newsletter__input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
        }

        .emovel-newsletter__submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-md);
          background: var(--color-primary);
          border: 1px solid color-mix(in srgb, var(--color-primary) 80%, #fff);
          color: var(--color-background);
          font: inherit;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition:
            transform var(--motion-duration) var(--motion-ease),
            box-shadow var(--motion-duration) var(--motion-ease);
        }

        .emovel-newsletter__submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px color-mix(in srgb, var(--color-primary) 35%, transparent);
        }

        .emovel-newsletter__privacy {
          margin: 0;
          font-size: 0.78rem;
          color: var(--color-textSecondary);
          line-height: 1.5;
        }

        @media (max-width: 48rem) {
          .emovel-newsletter__split {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 34rem) {
          .emovel-newsletter__form {
            flex-direction: column;
          }
          .emovel-newsletter__submit {
            width: 100%;
          }
        }
      `}</style>

      <div className="emovel-newsletter__inner">
        {isSplit ? (
          <div className="emovel-newsletter__split">
            <div className="emovel-newsletter__split-copy">
              {eyebrow ? <p className="emovel-newsletter__eyebrow">{eyebrow}</p> : null}
              {headline ? <h2 className="emovel-newsletter__headline">{headline}</h2> : null}
              {subheadline ? <p className="emovel-newsletter__subheadline">{subheadline}</p> : null}
            </div>
            <div className="emovel-newsletter__split-form">
              <form
                className="emovel-newsletter__form"
                onSubmit={(e) => e.preventDefault()}
                aria-label="Newsletter signup"
              >
                <input
                  className="emovel-newsletter__input"
                  type="email"
                  placeholder={inputPlaceholder || 'Enter your email'}
                  aria-label="Email address"
                />
                <button type="submit" className="emovel-newsletter__submit">
                  {ctaLabel || 'Subscribe'}
                </button>
              </form>
              {privacyNote ? (
                <p className="emovel-newsletter__privacy">{privacyNote}</p>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="emovel-newsletter__centered">
            {eyebrow ? <p className="emovel-newsletter__eyebrow">{eyebrow}</p> : null}
            {headline ? <h2 className="emovel-newsletter__headline">{headline}</h2> : null}
            {subheadline ? <p className="emovel-newsletter__subheadline">{subheadline}</p> : null}
            <form
              className="emovel-newsletter__form"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Newsletter signup"
            >
              <input
                className="emovel-newsletter__input"
                type="email"
                placeholder={inputPlaceholder || 'Enter your email'}
                aria-label="Email address"
              />
              <button type="submit" className="emovel-newsletter__submit">
                {ctaLabel || 'Subscribe'}
              </button>
            </form>
            {privacyNote ? (
              <p className="emovel-newsletter__privacy">{privacyNote}</p>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
