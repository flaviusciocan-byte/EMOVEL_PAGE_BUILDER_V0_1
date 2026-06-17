import type { FAQProps } from '../section-contract';
import { SectionSurface } from './SectionSurface';

export function FAQSection(props: FAQProps) {
  const { surface, width, backgroundImageUrl, eyebrow, headline, subheadline, items, layout } = props;
  const isColumns = layout === 'columns';

  return (
    <SectionSurface surface={surface} width={width} backgroundImageUrl={backgroundImageUrl} className="emovel-faq">
      <style>{`
        .emovel-faq {
          border-bottom: 1px solid var(--color-border);
        }

        .emovel-faq__inner {
          width: min(100%, 72rem);
          margin: 0 auto;
          padding:
            clamp(var(--space-section-v), 6vw, 5.5rem)
            clamp(1.25rem, 4vw, var(--space-section-h));
        }

        .emovel-faq__header {
          text-align: center;
          max-width: 44rem;
          margin: 0 auto clamp(2.5rem, 5vw, 4rem);
        }

        .emovel-faq__eyebrow {
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

        .emovel-faq__eyebrow::before {
          content: "";
          width: 0.28rem;
          height: 0.28rem;
          border-radius: var(--radius-pill);
          background: var(--color-primary);
          flex-shrink: 0;
        }

        .emovel-faq__headline {
          margin: 0;
          font-size: clamp(1.75rem, 4vw, 2.85rem);
          font-weight: 760;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: var(--color-textPrimary);
          text-wrap: balance;
        }

        .emovel-faq__subheadline {
          margin: 0.75rem 0 0;
          font-size: clamp(0.95rem, 1.4vw, 1.1rem);
          line-height: 1.65;
          color: var(--color-textSecondary);
        }

        /* Accordion layout */
        .emovel-faq__list {
          max-width: 52rem;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        /* Columns layout */
        .emovel-faq__list--columns {
          max-width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          align-items: start;
        }

        .emovel-faq__item {
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 2px 8px rgba(0,0,0,.04);
          transition:
            border-color var(--motion-duration) var(--motion-ease),
            box-shadow var(--motion-duration) var(--motion-ease);
        }

        .emovel-faq__item:hover {
          border-color: color-mix(in srgb, var(--color-primary) 35%, var(--color-border));
          box-shadow: 0 1px 3px rgba(0,0,0,.10), 0 4px 16px rgba(0,0,0,.06);
        }

        .emovel-faq__item[open] {
          border-color: color-mix(in srgb, var(--color-primary) 45%, var(--color-border));
        }

        .emovel-faq__question {
          list-style: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1.1rem 1.25rem;
          font-size: 0.975rem;
          font-weight: 600;
          color: var(--color-textPrimary);
          cursor: pointer;
          user-select: none;
          transition: color var(--motion-duration) var(--motion-ease);
        }

        .emovel-faq__question::-webkit-details-marker {
          display: none;
        }

        .emovel-faq__question::after {
          content: "+";
          font-size: 1.1rem;
          font-weight: 400;
          color: var(--color-primary);
          flex-shrink: 0;
          transition: transform var(--motion-duration) var(--motion-ease);
        }

        .emovel-faq__item[open] > .emovel-faq__question::after {
          transform: rotate(45deg);
        }

        .emovel-faq__answer {
          padding: 0 1.25rem 1.1rem;
          font-size: 0.9rem;
          line-height: 1.7;
          color: var(--color-textSecondary);
        }

        @container (max-width: 48rem) {
          .emovel-faq__list--columns {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="emovel-faq__inner">
        <div className="emovel-faq__header">
          {eyebrow ? <p className="emovel-faq__eyebrow">{eyebrow}</p> : null}
          {headline ? <h2 className="emovel-faq__headline">{headline}</h2> : null}
          {subheadline ? <p className="emovel-faq__subheadline">{subheadline}</p> : null}
        </div>

        <div className={`emovel-faq__list${isColumns ? ' emovel-faq__list--columns' : ''}`}>
          {(items ?? []).map((item, i) => (
            <details key={i} className="emovel-faq__item">
              <summary className="emovel-faq__question">{item.question}</summary>
              <div className="emovel-faq__answer">{item.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </SectionSurface>
  );
}
