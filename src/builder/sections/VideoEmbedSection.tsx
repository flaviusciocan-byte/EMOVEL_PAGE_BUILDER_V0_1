import type { VideoEmbedProps } from '../section-contract';

export function VideoEmbedSection(props: VideoEmbedProps) {
  const { eyebrow, headline, subheadline, embedUrl, videoTitle, aspectRatio } = props;

  // Aspect ratio percentage: 16:9 = 56.25%, 4:3 = 75%
  const paddingTop = aspectRatio === '4:3' ? '75%' : '56.25%';

  return (
    <section className="emovel-videoembed">
      <style>{`
        .emovel-videoembed {
          background: var(--color-background);
          border-bottom: 1px solid var(--color-border);
          color: var(--color-textPrimary);
        }

        .emovel-videoembed__inner {
          width: min(100%, 72rem);
          margin: 0 auto;
          padding:
            clamp(var(--space-section-v), 6vw, 5.5rem)
            clamp(1.25rem, 4vw, var(--space-section-h));
        }

        .emovel-videoembed__header {
          text-align: center;
          max-width: 44rem;
          margin: 0 auto clamp(2rem, 4vw, 3.5rem);
        }

        .emovel-videoembed__eyebrow {
          margin: 0 0 0.75rem;
          font-size: clamp(0.7rem, 1vw, 0.8rem);
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-secondary);
        }

        .emovel-videoembed__headline {
          margin: 0;
          font-size: clamp(1.75rem, 4vw, 2.85rem);
          font-weight: 760;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: var(--color-textPrimary);
          text-wrap: balance;
        }

        .emovel-videoembed__subheadline {
          margin: 0.75rem 0 0;
          font-size: clamp(0.95rem, 1.4vw, 1.1rem);
          line-height: 1.65;
          color: var(--color-textSecondary);
        }

        .emovel-videoembed__frame-wrapper {
          position: relative;
          max-width: 54rem;
          margin: 0 auto;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--color-border);
          box-shadow: 0 2px 8px rgba(0,0,0,.14), 0 20px 60px rgba(0,0,0,.12);
        }

        .emovel-videoembed__ratio {
          position: relative;
          width: 100%;
          height: 0;
          overflow: hidden;
          background: var(--color-surface);
        }

        .emovel-videoembed__frame {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: 0;
          display: block;
        }

        .emovel-videoembed__placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          background: var(--color-surface);
          color: var(--color-textSecondary);
        }

        .emovel-videoembed__play-icon {
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
          background: color-mix(in srgb, var(--color-primary) 18%, var(--color-surfaceAlt));
          border: 1px solid color-mix(in srgb, var(--color-primary) 45%, var(--color-border));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
        }

        .emovel-videoembed__placeholder-label {
          font-size: 0.875rem;
          color: var(--color-textSecondary);
        }
      `}</style>

      <div className="emovel-videoembed__inner">
        <div className="emovel-videoembed__header">
          {eyebrow ? <p className="emovel-videoembed__eyebrow">{eyebrow}</p> : null}
          {headline ? <h2 className="emovel-videoembed__headline">{headline}</h2> : null}
          {subheadline ? <p className="emovel-videoembed__subheadline">{subheadline}</p> : null}
        </div>

        <div className="emovel-videoembed__frame-wrapper">
          <div className="emovel-videoembed__ratio" style={{ paddingTop }}>
            {embedUrl ? (
              <iframe
                className="emovel-videoembed__frame"
                src={embedUrl}
                title={videoTitle || headline || 'Video'}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="emovel-videoembed__placeholder" aria-label="Video placeholder">
                <div className="emovel-videoembed__play-icon" aria-hidden="true">▶</div>
                <span className="emovel-videoembed__placeholder-label">
                  {videoTitle || 'Add embed URL in inspector'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
