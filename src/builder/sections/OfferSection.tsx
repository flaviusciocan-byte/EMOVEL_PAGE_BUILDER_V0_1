import type { OfferProps } from '../section-contract';

export function OfferSection(props: OfferProps) {
  const { title, problem, solution, benefits } = props;
  const visibleBenefits = benefits.filter(Boolean);

  return (
    <section className="emovel-offer">
      <style>{`
        .emovel-offer {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 12% 12%, var(--color-glow), transparent 28rem),
            linear-gradient(180deg, var(--color-background), var(--color-surface));
          color: var(--color-textPrimary);
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }

        .emovel-offer__inner {
          width: min(100%, 72rem);
          margin: 0 auto;
          padding: clamp(var(--space-section-v), 7vw, 6.5rem) clamp(1.25rem, 4vw, var(--space-section-h));
          display: grid;
          grid-template-columns: minmax(0, 0.82fr) minmax(20rem, 1fr);
          gap: clamp(2rem, 6vw, 5rem);
          align-items: start;
        }

        .emovel-offer__intro {
          position: sticky;
          top: clamp(1rem, 4vw, 3rem);
        }

        .emovel-offer__kicker {
          margin: 0 0 0.9rem;
          color: var(--color-secondary);
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          line-height: 1.35;
          text-transform: uppercase;
        }

        .emovel-offer__title {
          margin: 0;
          color: var(--color-textPrimary);
          font-size: clamp(2rem, 4.6vw, 3.9rem);
          font-weight: 760;
          letter-spacing: -0.038em;
          line-height: 1.02;
          text-wrap: balance;
        }

        .emovel-offer__body {
          display: grid;
          gap: clamp(1rem, 2vw, 1.35rem);
        }

        .emovel-offer__comparison {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(1rem, 2vw, 1.25rem);
        }

        .emovel-offer__panel,
        .emovel-offer__benefits {
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          background:
            linear-gradient(180deg, color-mix(in srgb, var(--color-surfaceAlt) 70%, transparent), var(--color-surface)),
            var(--color-surface);
          box-shadow: 0 1.25rem 3.5rem color-mix(in srgb, var(--color-background) 52%, transparent);
        }

        .emovel-offer__panel {
          min-height: 15rem;
          padding: clamp(1.1rem, 2.5vw, 1.5rem);
        }

        .emovel-offer__label {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          color: var(--color-textSecondary);
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          line-height: 1;
          text-transform: uppercase;
        }

        .emovel-offer__label::before {
          content: "";
          width: 0.45rem;
          height: 0.45rem;
          border-radius: var(--radius-pill);
          background: var(--label-color, var(--color-primary));
          box-shadow: 0 0 1rem color-mix(in srgb, var(--label-color, var(--color-primary)) 48%, transparent);
        }

        .emovel-offer__label--problem {
          --label-color: var(--color-warning);
        }

        .emovel-offer__label--solution {
          --label-color: var(--color-primary);
        }

        .emovel-offer__text {
          margin: 0;
          color: var(--color-textPrimary);
          font-size: clamp(1rem, 1.3vw, 1.12rem);
          line-height: 1.7;
        }

        .emovel-offer__benefits {
          padding: clamp(1.1rem, 2.5vw, 1.5rem);
        }

        .emovel-offer__benefits-title {
          margin: 0 0 1rem;
          color: var(--color-textPrimary);
          font-size: 0.84rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          line-height: 1.2;
          text-transform: uppercase;
        }

        .emovel-offer__benefit-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.8rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .emovel-offer__benefit {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 0.75rem;
          align-items: start;
          min-height: 4.5rem;
          padding: 0.9rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: color-mix(in srgb, var(--color-surfaceAlt) 52%, transparent);
          color: var(--color-textSecondary);
          font-size: 0.95rem;
          line-height: 1.55;
        }

        .emovel-offer__check {
          display: inline-grid;
          width: 1.35rem;
          height: 1.35rem;
          place-items: center;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-pill);
          background: color-mix(in srgb, var(--color-success) 14%, var(--color-surface));
          color: var(--color-success);
          font-size: 0.84rem;
          font-weight: 900;
          line-height: 1;
        }

        .emovel-offer__check::before {
          content: "";
          width: 0.42rem;
          height: 0.68rem;
          border-right: 2px solid currentColor;
          border-bottom: 2px solid currentColor;
          transform: translateY(-0.06rem) rotate(38deg);
        }

        @media (max-width: 58rem) {
          .emovel-offer__inner {
            grid-template-columns: 1fr;
          }

          .emovel-offer__intro {
            position: static;
            max-width: 44rem;
          }
        }

        @media (max-width: 42rem) {
          .emovel-offer__inner {
            padding-block: 4rem;
          }

          .emovel-offer__comparison,
          .emovel-offer__benefit-list {
            grid-template-columns: 1fr;
          }

          .emovel-offer__panel {
            min-height: auto;
          }

          .emovel-offer__benefit {
            min-height: auto;
          }
        }
      `}</style>

      <div className="emovel-offer__inner">
        <div className="emovel-offer__intro">
          <p className="emovel-offer__kicker">Offer</p>
          <h2 className="emovel-offer__title">{title}</h2>
        </div>

        <div className="emovel-offer__body">
          <div className="emovel-offer__comparison">
            <article className="emovel-offer__panel">
              <span className="emovel-offer__label emovel-offer__label--problem">Problem</span>
              <p className="emovel-offer__text">{problem}</p>
            </article>

            <article className="emovel-offer__panel">
              <span className="emovel-offer__label emovel-offer__label--solution">Solution</span>
              <p className="emovel-offer__text">{solution}</p>
            </article>
          </div>

          {visibleBenefits.length > 0 ? (
            <div className="emovel-offer__benefits">
              <h3 className="emovel-offer__benefits-title">What visitors understand</h3>
              <ul className="emovel-offer__benefit-list">
                {visibleBenefits.map((benefit, index) => (
                  <li className="emovel-offer__benefit" key={`${benefit}-${index}`}>
                    <span className="emovel-offer__check" aria-hidden="true" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
