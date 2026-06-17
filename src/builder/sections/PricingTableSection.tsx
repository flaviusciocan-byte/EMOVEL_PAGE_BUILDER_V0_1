import { useState } from 'react';
import type { PricingTableProps } from '../section-contract';
import { SectionSurface } from './SectionSurface';

export function PricingTableSection(props: PricingTableProps) {
  const { surface, width, backgroundImageUrl, eyebrow, headline, subheadline, plans, billingPeriod } = props;
  const showToggle = billingPeriod === 'both';
  const [annual, setAnnual] = useState(false);

  return (
    <SectionSurface surface={surface} width={width} backgroundImageUrl={backgroundImageUrl} className="emovel-pricing">
      <style>{`
        .emovel-pricing {
          border-bottom: 1px solid var(--color-border);
        }

        .emovel-pricing__inner {
          width: min(100%, 72rem);
          margin: 0 auto;
          padding:
            clamp(var(--space-section-v), 6vw, 5.5rem)
            clamp(1.25rem, 4vw, var(--space-section-h));
        }

        .emovel-pricing__header {
          text-align: center;
          max-width: 44rem;
          margin: 0 auto clamp(2rem, 4vw, 3.5rem);
        }

        .emovel-pricing__eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          margin: 0 0 0.75rem;
          font-family: var(--font-mono);
          font-size: clamp(0.68rem, 1vw, 0.78rem);
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-textSecondary);
        }

        .emovel-pricing__eyebrow::before {
          content: "";
          width: 0.28rem;
          height: 0.28rem;
          border-radius: var(--radius-pill);
          background: var(--color-primary);
          flex-shrink: 0;
        }

        .emovel-pricing__headline {
          margin: 0;
          font-size: clamp(1.75rem, 4vw, 2.85rem);
          font-weight: 760;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: var(--color-textPrimary);
          text-wrap: balance;
        }

        .emovel-pricing__subheadline {
          margin: 0.75rem 0 0;
          font-size: clamp(0.95rem, 1.4vw, 1.1rem);
          line-height: 1.65;
          color: var(--color-textSecondary);
        }

        .emovel-pricing__toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: clamp(1.5rem, 3vw, 2.5rem);
        }

        .emovel-pricing__toggle-label {
          font-size: 0.875rem;
          color: var(--color-textSecondary);
          cursor: pointer;
          transition: color var(--motion-duration) var(--motion-ease);
        }

        .emovel-pricing__toggle-label--active {
          color: var(--color-textPrimary);
          font-weight: 600;
        }

        .emovel-pricing__toggle-switch {
          position: relative;
          width: 44px;
          height: 24px;
          background: var(--color-surfaceAlt);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-pill);
          cursor: pointer;
          transition: background var(--motion-duration) var(--motion-ease);
        }

        .emovel-pricing__toggle-switch--on {
          background: color-mix(in srgb, var(--color-primary) 28%, var(--color-surfaceAlt));
          border-color: color-mix(in srgb, var(--color-primary) 60%, var(--color-border));
        }

        .emovel-pricing__toggle-knob {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 18px;
          height: 18px;
          background: var(--color-textSecondary);
          border-radius: 50%;
          transition: transform var(--motion-duration) var(--motion-ease), background var(--motion-duration) var(--motion-ease);
        }

        .emovel-pricing__toggle-switch--on .emovel-pricing__toggle-knob {
          transform: translateX(20px);
          background: var(--color-primary);
        }

        .emovel-pricing__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr));
          gap: clamp(0.85rem, 2vw, 1.25rem);
          align-items: start;
        }

        .emovel-pricing__card {
          display: flex;
          flex-direction: column;
          padding: clamp(1.5rem, 3vw, 2rem);
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          position: relative;
          box-shadow: var(--shadow-card);
          transition:
            transform var(--motion-duration) var(--motion-ease),
            border-color var(--motion-duration) var(--motion-ease),
            box-shadow var(--motion-duration) var(--motion-ease);
        }

        .emovel-pricing__card:not(.emovel-pricing__card--featured):hover {
          transform: translateY(-2px);
          border-color: color-mix(in srgb, var(--color-primary) 40%, var(--color-border));
          box-shadow: var(--shadow-card-hover);
        }

        .emovel-pricing__card--featured {
          background: var(--color-surface);
          border-color: var(--color-primary);
          box-shadow: 0 0 0 1px var(--color-primary), 0 2px 8px rgba(0,0,0,.12), 0 12px 32px rgba(0,0,0,.10);
        }

        .emovel-pricing__badge {
          display: inline-flex;
          align-self: flex-start;
          padding: 0.25rem 0.7rem;
          border-radius: var(--radius-pill);
          background: color-mix(in srgb, var(--color-primary) 18%, var(--color-surfaceAlt));
          border: 1px solid color-mix(in srgb, var(--color-primary) 45%, var(--color-border));
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--color-primary);
          margin-bottom: 0.85rem;
        }

        .emovel-pricing__plan-name {
          margin: 0 0 0.4rem;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-textPrimary);
        }

        .emovel-pricing__plan-desc {
          margin: 0 0 1.25rem;
          font-size: 0.875rem;
          line-height: 1.55;
          color: var(--color-textSecondary);
        }

        .emovel-pricing__price {
          margin: 0 0 0.25rem;
          font-size: clamp(2rem, 4vw, 2.5rem);
          font-weight: 760;
          letter-spacing: -0.04em;
          line-height: 1;
          color: var(--color-textPrimary);
        }

        .emovel-pricing__divider {
          height: 1px;
          background: var(--color-border);
          margin: 1.25rem 0;
        }

        .emovel-pricing__features {
          list-style: none;
          margin: 0 0 1.5rem;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          flex: 1;
        }

        .emovel-pricing__feature {
          display: flex;
          align-items: baseline;
          gap: 0.6rem;
          font-size: 0.875rem;
          color: var(--color-textSecondary);
          line-height: 1.45;
        }

        .emovel-pricing__feature::before {
          content: "✓";
          color: var(--color-success);
          font-weight: 700;
          flex-shrink: 0;
          font-size: 0.8rem;
        }

        .emovel-pricing__cta {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.8rem 1.25rem;
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          font-weight: 700;
          text-decoration: none;
          text-align: center;
          transition:
            transform var(--motion-duration) var(--motion-ease),
            box-shadow var(--motion-duration) var(--motion-ease),
            background var(--motion-duration) var(--motion-ease);
          border: 1px solid var(--color-border);
          background: var(--color-surfaceAlt);
          color: var(--color-textPrimary);
        }

        .emovel-pricing__card--featured .emovel-pricing__cta {
          background: var(--color-primary);
          border-color: color-mix(in srgb, var(--color-primary) 80%, #fff);
          color: var(--color-background);
        }

        .emovel-pricing__cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px color-mix(in srgb, var(--color-border) 50%, transparent);
        }

        @container (max-width: 34rem) {
          .emovel-pricing__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="emovel-pricing__inner">
        <div className="emovel-pricing__header">
          {eyebrow ? <p className="emovel-pricing__eyebrow">{eyebrow}</p> : null}
          {headline ? <h2 className="emovel-pricing__headline">{headline}</h2> : null}
          {subheadline ? <p className="emovel-pricing__subheadline">{subheadline}</p> : null}
        </div>

        {showToggle ? (
          <div className="emovel-pricing__toggle">
            <span
              className={`emovel-pricing__toggle-label${!annual ? ' emovel-pricing__toggle-label--active' : ''}`}
              onClick={() => setAnnual(false)}
            >
              Monthly
            </span>
            <button
              type="button"
              className={`emovel-pricing__toggle-switch${annual ? ' emovel-pricing__toggle-switch--on' : ''}`}
              onClick={() => setAnnual(!annual)}
              aria-label="Toggle billing period"
            >
              <span className="emovel-pricing__toggle-knob" />
            </button>
            <span
              className={`emovel-pricing__toggle-label${annual ? ' emovel-pricing__toggle-label--active' : ''}`}
              onClick={() => setAnnual(true)}
            >
              Annual
            </span>
          </div>
        ) : null}

        <div className="emovel-pricing__grid">
          {(plans ?? []).map((plan, i) => {
            const isFeatured = plan.highlight === 'featured';
            const displayPrice = (annual && plan.priceAnnual) ? plan.priceAnnual : plan.price;
            const featureList = plan.features
              ? plan.features.split('\n').filter(Boolean)
              : [];

            return (
              <div
                key={i}
                className={`emovel-pricing__card${isFeatured ? ' emovel-pricing__card--featured' : ''}`}
              >
                {plan.badge ? (
                  <span className="emovel-pricing__badge">{plan.badge}</span>
                ) : null}

                {plan.name ? (
                  <h3 className="emovel-pricing__plan-name">{plan.name}</h3>
                ) : null}

                {plan.description ? (
                  <p className="emovel-pricing__plan-desc">{plan.description}</p>
                ) : null}

                {displayPrice ? (
                  <p className="emovel-pricing__price">{displayPrice}</p>
                ) : null}

                {featureList.length > 0 ? (
                  <>
                    <div className="emovel-pricing__divider" />
                    <ul className="emovel-pricing__features" role="list">
                      {featureList.map((f, fi) => (
                        <li key={fi} className="emovel-pricing__feature">{f}</li>
                      ))}
                    </ul>
                  </>
                ) : null}

                {plan.ctaLabel ? (
                  <a className="emovel-pricing__cta" href={plan.ctaHref || '#'}>
                    {plan.ctaLabel}
                  </a>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </SectionSurface>
  );
}
