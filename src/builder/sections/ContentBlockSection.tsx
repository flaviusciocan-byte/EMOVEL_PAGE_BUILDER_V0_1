import type { ContentBlockProps } from '../section-contract';
import { SectionSurface } from './SectionSurface';

export function ContentBlockSection(props: ContentBlockProps) {
  const { surface, width, backgroundImageUrl, eyebrow, headline, body, alignment, layout } = props;
  const isProse = layout === 'prose' || !layout;
  const isCenter = alignment === 'center';

  return (
    <SectionSurface surface={surface} width={width} backgroundImageUrl={backgroundImageUrl} className="emovel-contentblock">
      <style>{`
        .emovel-contentblock {
          border-bottom: 1px solid var(--color-border);
        }

        .emovel-contentblock__inner {
          width: min(100%, 72rem);
          margin: 0 auto;
          padding:
            clamp(var(--space-section-v), 6vw, 5.5rem)
            clamp(1.25rem, 4vw, var(--space-section-h));
        }

        .emovel-contentblock__content {
          max-width: 100%;
        }

        .emovel-contentblock__content--prose {
          max-width: 72ch;
        }

        .emovel-contentblock__content--center {
          margin-left: auto;
          margin-right: auto;
          text-align: center;
        }

        .emovel-contentblock__eyebrow {
          margin: 0 0 0.85rem;
          font-size: clamp(0.7rem, 1vw, 0.8rem);
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-secondary);
        }

        .emovel-contentblock__headline {
          margin: 0 0 clamp(1rem, 2.5vw, 1.75rem);
          font-size: clamp(1.75rem, 4vw, 2.85rem);
          font-weight: 760;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: var(--color-textPrimary);
          text-wrap: balance;
        }

        .emovel-contentblock__body {
          margin: 0;
          font-size: clamp(0.95rem, 1.35vw, 1.05rem);
          line-height: 1.8;
          color: var(--color-textSecondary);
          white-space: pre-wrap;
        }

        .emovel-contentblock__divider {
          width: 3rem;
          height: 2px;
          background: linear-gradient(90deg, var(--color-primary), transparent);
          border: none;
          margin: clamp(1.25rem, 2.5vw, 1.75rem) 0;
          flex-shrink: 0;
        }

        .emovel-contentblock__content--center .emovel-contentblock__divider {
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>

      <div className="emovel-contentblock__inner">
        <div
          className={[
            'emovel-contentblock__content',
            isProse ? 'emovel-contentblock__content--prose' : '',
            isCenter ? 'emovel-contentblock__content--center' : '',
          ].filter(Boolean).join(' ')}
        >
          {eyebrow ? <p className="emovel-contentblock__eyebrow">{eyebrow}</p> : null}
          {headline ? <h2 className="emovel-contentblock__headline">{headline}</h2> : null}
          {(eyebrow || headline) && body ? (
            <hr className="emovel-contentblock__divider" aria-hidden="true" />
          ) : null}
          {body ? <p className="emovel-contentblock__body">{body}</p> : null}
        </div>
      </div>
    </SectionSurface>
  );
}
