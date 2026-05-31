import type { FeatureGridProps } from '../section-contract';

export function FeatureGridSection(props: FeatureGridProps) {
  const { eyebrow, headline, subheadline, features, columns } = props;
  const cols = columns ?? 3;

  return (
    <section className="emovel-featuregrid">
      <style>{`
        .emovel-featuregrid {
          background: var(--color-background);
          border-bottom: 1px solid var(--color-border);
          color: var(--color-textPrimary);
        }

        .emovel-featuregrid__inner {
          width: min(100%, 72rem);
          margin: 0 auto;
          padding:
            clamp(var(--space-section-v), 6vw, 5.5rem)
            clamp(1.25rem, 4vw, var(--space-section-h));
        }

        .emovel-featuregrid__header {
          text-align: center;
          max-width: 44rem;
          margin: 0 auto clamp(2.5rem, 5vw, 4rem);
        }

        .emovel-featuregrid__eyebrow {
          margin: 0 0 0.85rem;
          font-size: clamp(0.7rem, 1vw, 0.8rem);
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-secondary);
        }

        .emovel-featuregrid__headline {
          margin: 0;
          font-size: clamp(1.75rem, 4vw, 2.85rem);
          font-weight: 760;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: var(--color-textPrimary);
          text-wrap: balance;
        }

        .emovel-featuregrid__subheadline {
          margin: 0.85rem 0 0;
          font-size: clamp(0.95rem, 1.4vw, 1.1rem);
          line-height: 1.65;
          color: var(--color-textSecondary);
        }

        .emovel-featuregrid__grid {
          display: grid;
          grid-template-columns: repeat(${cols}, minmax(0, 1fr));
          gap: clamp(0.85rem, 2vw, 1.25rem);
        }

        .emovel-featuregrid__card {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: clamp(1.25rem, 2.5vw, 1.75rem);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.025), transparent),
            var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          transition:
            border-color var(--motion-duration) var(--motion-ease),
            transform var(--motion-duration) var(--motion-ease),
            box-shadow var(--motion-duration) var(--motion-ease);
        }

        .emovel-featuregrid__card:hover {
          border-color: color-mix(in srgb, var(--color-primary) 55%, var(--color-border));
          transform: translateY(-2px);
          box-shadow: 0 8px 28px color-mix(in srgb, var(--color-glow) 40%, transparent);
        }

        .emovel-featuregrid__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: var(--radius-md);
          background: color-mix(in srgb, var(--color-primary) 14%, var(--color-surfaceAlt));
          border: 1px solid color-mix(in srgb, var(--color-primary) 28%, var(--color-border));
          font-size: 1.2rem;
          line-height: 1;
          flex-shrink: 0;
        }

        .emovel-featuregrid__card-title {
          margin: 0;
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-textPrimary);
          letter-spacing: -0.01em;
        }

        .emovel-featuregrid__card-body {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.65;
          color: var(--color-textSecondary);
          flex: 1;
        }

        @media (max-width: 54rem) {
          .emovel-featuregrid__grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 34rem) {
          .emovel-featuregrid__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="emovel-featuregrid__inner">
        <div className="emovel-featuregrid__header">
          {eyebrow ? <p className="emovel-featuregrid__eyebrow">{eyebrow}</p> : null}
          {headline ? <h2 className="emovel-featuregrid__headline">{headline}</h2> : null}
          {subheadline ? <p className="emovel-featuregrid__subheadline">{subheadline}</p> : null}
        </div>

        <div className="emovel-featuregrid__grid">
          {(features ?? []).map((card, i) => (
            <div key={i} className="emovel-featuregrid__card">
              {card.icon ? (
                <div className="emovel-featuregrid__icon" aria-hidden="true">
                  {card.icon}
                </div>
              ) : null}
              {card.title ? (
                <h3 className="emovel-featuregrid__card-title">{card.title}</h3>
              ) : null}
              {card.body ? (
                <p className="emovel-featuregrid__card-body">{card.body}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
