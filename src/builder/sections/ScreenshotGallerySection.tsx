import type { ScreenshotGalleryProps } from '../section-contract';
import { SectionSurface } from './SectionSurface';

export function ScreenshotGallerySection(props: ScreenshotGalleryProps) {
  const { surface, width, backgroundImageUrl, title, description, shots } = props;
  const items = shots.filter((item) => Boolean(item.caption)).slice(0, 6);

  return (
    <SectionSurface surface={surface} width={width} backgroundImageUrl={backgroundImageUrl} className="emovel-screenshot-gallery">
      <style>{`
        .emovel-screenshot-gallery {
          overflow: hidden;
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }

        .emovel-screenshot-gallery__inner {
          width: min(100%, 72rem);
          margin: 0 auto;
          padding: clamp(var(--space-section-v), 7vw, 6.75rem) clamp(1.25rem, 4vw, var(--space-section-h));
        }

        .emovel-screenshot-gallery__header {
          display: grid;
          grid-template-columns: minmax(0, 0.85fr) minmax(18rem, 0.65fr);
          gap: clamp(1rem, 4vw, 3rem);
          align-items: end;
          margin-bottom: clamp(2rem, 4vw, 3.25rem);
        }

        .emovel-screenshot-gallery__title {
          margin: 0;
          color: var(--color-textPrimary);
          font-size: clamp(2rem, 4.4vw, 3.75rem);
          font-weight: 760;
          letter-spacing: -0.035em;
          line-height: 1.02;
          text-wrap: balance;
        }

        .emovel-screenshot-gallery__description {
          margin: 0;
          color: var(--color-textSecondary);
          font-size: clamp(1rem, 1.35vw, 1.125rem);
          line-height: 1.7;
        }

        .emovel-screenshot-gallery__grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(1rem, 2vw, 1.35rem);
        }

        .emovel-screenshot-gallery__card {
          min-width: 0;
          overflow: hidden;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          background: var(--color-surface);
          box-shadow: 0 1px 2px rgba(0,0,0,.08), 0 8px 24px rgba(0,0,0,.06);
          transition:
            transform var(--motion-duration) var(--motion-ease),
            border-color var(--motion-duration) var(--motion-ease),
            box-shadow var(--motion-duration) var(--motion-ease);
        }

        .emovel-screenshot-gallery__card:hover {
          transform: translateY(-2px);
          border-color: var(--color-primary);
          box-shadow: 0 1.5rem 4rem color-mix(in srgb, var(--color-border) 60%, transparent);
        }

        .emovel-screenshot-gallery__img {
          display: block;
          width: 100%;
          aspect-ratio: 16 / 10;
          object-fit: cover;
          border-bottom: 1px solid var(--color-border);
        }

        .emovel-screenshot-gallery__caption {
          margin: 0;
          padding: 0.95rem 1rem 1.05rem;
          color: var(--color-textSecondary);
          font-size: 0.92rem;
          line-height: 1.55;
        }

        @container (max-width: 58rem) {
          .emovel-screenshot-gallery__header {
            grid-template-columns: 1fr;
            align-items: start;
          }
          .emovel-screenshot-gallery__description {
            max-width: 42rem;
          }
          .emovel-screenshot-gallery__grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @container (max-width: 38rem) {
          .emovel-screenshot-gallery__inner {
            padding-block: 4rem;
          }
          .emovel-screenshot-gallery__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="emovel-screenshot-gallery__inner">
        <div className="emovel-screenshot-gallery__header">
          <h2 className="emovel-screenshot-gallery__title">{title}</h2>
          {description ? (
            <p className="emovel-screenshot-gallery__description">{description}</p>
          ) : null}
        </div>

        {items.length > 0 ? (
          <div className="emovel-screenshot-gallery__grid">
            {items.map((shot, index) => (
              <figure
                className="emovel-screenshot-gallery__card"
                key={`${shot.caption}-${index}`}
              >
                {shot.imageUrl ? (
                  <img
                    src={shot.imageUrl}
                    alt={shot.alt || shot.caption || ''}
                    className="emovel-screenshot-gallery__img"
                  />
                ) : null}
                <figcaption className="emovel-screenshot-gallery__caption">
                  {shot.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : null}
      </div>
    </SectionSurface>
  );
}
