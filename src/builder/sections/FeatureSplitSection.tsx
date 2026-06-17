import type { FeatureSplitProps } from '../section-contract';
import { SectionSurface } from './SectionSurface';

export function FeatureSplitSection(props: FeatureSplitProps) {
  const {
    surface, width, backgroundImageUrl,
    eyebrow,
    headline,
    body,
    ctaLabel,
    ctaHref,
    imageUrl,
    imageAlt,
    imagePosition,
  } = props;

  const imageFirst = imagePosition === 'left';

  return (
    <SectionSurface surface={surface} width={width} backgroundImageUrl={backgroundImageUrl} className="emovel-featuresplit">
      <style>{`
        .emovel-featuresplit {
          border-bottom: 1px solid var(--color-border);
        }

        .emovel-featuresplit__inner {
          width: min(100%, 72rem);
          margin: 0 auto;
          padding:
            clamp(var(--space-section-v), 7vw, 5.5rem)
            clamp(1.25rem, 4vw, var(--space-section-h));
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(2.5rem, 6vw, 5rem);
          align-items: center;
        }

        .emovel-featuresplit__inner--image-left .emovel-featuresplit__image {
          order: -1;
        }

        .emovel-featuresplit__image {
          position: relative;
          min-height: clamp(18rem, 36vw, 28rem);
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--color-border);
          background: var(--color-surfaceAlt);
          box-shadow: 0 2px 8px rgba(0,0,0,.12), 0 20px 60px rgba(0,0,0,.10);
        }

        .emovel-featuresplit__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .emovel-featuresplit__image-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .emovel-featuresplit__image-placeholder::before {
          content: "";
          position: absolute;
          inset: clamp(1rem, 3vw, 1.5rem);
          border: 1px solid var(--color-border);
          border-radius: calc(var(--radius-lg) - 0.25rem);
        }

        .emovel-featuresplit__image-placeholder::after {
          content: "";
          width: 44%;
          height: 36%;
          border-radius: var(--radius-md);
          background: color-mix(in srgb, var(--color-primary) 22%, var(--color-surfaceAlt));
          border: 1px solid color-mix(in srgb, var(--color-primary) 40%, var(--color-border));
        }

        .emovel-featuresplit__copy {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .emovel-featuresplit__eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          margin: 0;
          font-family: var(--font-mono);
          font-size: clamp(0.68rem, 1vw, 0.78rem);
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-textSecondary);
        }

        .emovel-featuresplit__eyebrow::before {
          content: "";
          width: 0.28rem;
          height: 0.28rem;
          border-radius: var(--radius-pill);
          background: var(--color-primary);
          flex-shrink: 0;
        }

        .emovel-featuresplit__headline {
          margin: 0;
          font-size: clamp(1.75rem, 4vw, 2.75rem);
          font-weight: 760;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: var(--color-textPrimary);
          text-wrap: balance;
        }

        .emovel-featuresplit__body {
          margin: 0;
          font-size: clamp(0.95rem, 1.4vw, 1.1rem);
          line-height: 1.7;
          color: var(--color-textSecondary);
        }

        .emovel-featuresplit__cta {
          display: inline-flex;
          align-items: center;
          padding: 0.75rem 1.35rem;
          border-radius: var(--radius-md);
          background: var(--color-primary);
          border: 1px solid color-mix(in srgb, var(--color-primary) 80%, var(--color-onPrimary));
          color: var(--color-background);
          font-size: 0.95rem;
          font-weight: 700;
          text-decoration: none;
          align-self: flex-start;
          transition:
            transform var(--motion-duration) var(--motion-ease),
            box-shadow var(--motion-duration) var(--motion-ease);
        }

        .emovel-featuresplit__cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px color-mix(in srgb, var(--color-primary) 32%, transparent);
        }

        @container (max-width: 54rem) {
          .emovel-featuresplit__inner {
            grid-template-columns: 1fr;
          }
          .emovel-featuresplit__inner--image-left .emovel-featuresplit__image {
            order: 0;
          }
        }
      `}</style>

      <div className={`emovel-featuresplit__inner${imageFirst ? ' emovel-featuresplit__inner--image-left' : ''}`}>
        <div className="emovel-featuresplit__image">
          {imageUrl ? (
            <img src={imageUrl} alt={imageAlt || ''} />
          ) : (
            <div className="emovel-featuresplit__image-placeholder" aria-hidden="true" />
          )}
        </div>

        <div className="emovel-featuresplit__copy">
          {eyebrow ? <p className="emovel-featuresplit__eyebrow">{eyebrow}</p> : null}
          {headline ? <h2 className="emovel-featuresplit__headline">{headline}</h2> : null}
          {body ? <p className="emovel-featuresplit__body">{body}</p> : null}
          {ctaLabel ? (
            <a className="emovel-featuresplit__cta" href={ctaHref || '#'}>
              {ctaLabel}
            </a>
          ) : null}
        </div>
      </div>
    </SectionSurface>
  );
}
