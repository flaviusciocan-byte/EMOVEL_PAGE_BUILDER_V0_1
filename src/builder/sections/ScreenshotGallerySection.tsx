import type { ScreenshotGalleryProps } from '../section-contract';

export function ScreenshotGallerySection(props: ScreenshotGalleryProps) {
  const { title, description, shots } = props;
  const items = shots.filter((item) => Boolean(item.caption)).slice(0, 6);

  return (
    <section className="emovel-screenshot-gallery">
      <style>{`
        .emovel-screenshot-gallery {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 0%, var(--color-glow), transparent 32rem),
            var(--color-background);
          color: var(--color-textPrimary);
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
          background:
            linear-gradient(180deg, color-mix(in srgb, var(--color-surfaceAlt) 72%, transparent), var(--color-surface)),
            var(--color-surface);
          box-shadow: 0 1.25rem 3.5rem color-mix(in srgb, var(--color-background) 52%, transparent);
          transition:
            transform var(--motion-duration) var(--motion-ease),
            border-color var(--motion-duration) var(--motion-ease),
            box-shadow var(--motion-duration) var(--motion-ease);
        }

        .emovel-screenshot-gallery__card:hover {
          transform: translateY(-2px);
          border-color: var(--color-primary);
          box-shadow: 0 1.5rem 4rem var(--color-glow);
        }

        .emovel-screenshot-gallery__placeholder {
          aspect-ratio: 16 / 10;
          background:
            linear-gradient(135deg, var(--color-surfaceAlt), var(--color-surface));
          border-bottom: 1px solid var(--color-border);
        }

        .emovel-screenshot-gallery__caption {
          margin: 0;
          padding: 0.95rem 1rem 1.05rem;
          color: var(--color-textSecondary);
          font-size: 0.92rem;
          line-height: 1.55;
        }

        @media (max-width: 58rem) {
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

        @media (max-width: 38rem) {
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
                <div className="emovel-screenshot-gallery__placeholder" aria-hidden="true" />
                <figcaption className="emovel-screenshot-gallery__caption">
                  {shot.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
