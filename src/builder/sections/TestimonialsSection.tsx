import type { TestimonialsProps } from '../section-contract';

function StarRating({ rating }: { rating: number }) {
  if (!rating) return null;
  const clamped = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <div className="emovel-testimonials__stars" aria-label={`${clamped} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < clamped ? 'star--filled' : 'star--empty'}>
          ★
        </span>
      ))}
    </div>
  );
}

function Avatar({ name, avatarUrl }: { name: string; avatarUrl: string }) {
  const initials = name
    .split(' ')
    .map((w) => w[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (avatarUrl) {
    return <img className="emovel-testimonials__avatar" src={avatarUrl} alt={name} />;
  }
  return (
    <div className="emovel-testimonials__avatar emovel-testimonials__avatar--initials" aria-hidden="true">
      {initials}
    </div>
  );
}

export function TestimonialsSection(props: TestimonialsProps) {
  const { eyebrow, headline, testimonials, layout } = props;
  const isSlider = layout === 'slider';

  return (
    <section className="emovel-testimonials">
      <style>{`
        .emovel-testimonials {
          background: var(--color-surfaceAlt);
          border-bottom: 1px solid var(--color-border);
          color: var(--color-textPrimary);
          container-type: inline-size;
        }

        .emovel-testimonials__inner {
          width: min(100%, 72rem);
          margin: 0 auto;
          padding:
            clamp(var(--space-section-v), 6vw, 5.5rem)
            clamp(1.25rem, 4vw, var(--space-section-h));
        }

        .emovel-testimonials__header {
          text-align: center;
          max-width: 44rem;
          margin: 0 auto clamp(2.5rem, 5vw, 4rem);
        }

        .emovel-testimonials__eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          margin: 0 0 0.75rem;
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: clamp(0.68rem, 1vw, 0.78rem);
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-textSecondary);
        }

        .emovel-testimonials__eyebrow::before {
          content: "";
          width: 0.28rem;
          height: 0.28rem;
          border-radius: var(--radius-pill);
          background: var(--color-primary);
          flex-shrink: 0;
        }

        .emovel-testimonials__headline {
          margin: 0;
          font-size: clamp(1.75rem, 4vw, 2.85rem);
          font-weight: 760;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: var(--color-textPrimary);
          text-wrap: balance;
        }

        /* Grid layout */
        .emovel-testimonials__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
          gap: clamp(0.85rem, 2vw, 1.25rem);
        }

        /* Slider layout */
        .emovel-testimonials__slider {
          display: flex;
          gap: clamp(0.85rem, 2vw, 1.25rem);
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-padding: clamp(1.25rem, 4vw, var(--space-section-h));
          -webkit-overflow-scrolling: touch;
          padding-bottom: 0.75rem;
          scrollbar-width: thin;
          scrollbar-color: var(--color-border) transparent;
        }

        .emovel-testimonials__slider::-webkit-scrollbar {
          height: 5px;
        }
        .emovel-testimonials__slider::-webkit-scrollbar-thumb {
          background: var(--color-border);
          border-radius: var(--radius-pill);
        }

        .emovel-testimonials__slider .emovel-testimonials__card {
          flex: 0 0 min(calc(100vw - 2.5rem), 22rem);
          scroll-snap-align: start;
        }

        /* Card */
        .emovel-testimonials__card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: clamp(1.25rem, 2.5vw, 1.75rem);
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          box-shadow: 0 1px 2px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.06);
          transition:
            border-color var(--motion-duration) var(--motion-ease),
            transform var(--motion-duration) var(--motion-ease),
            box-shadow var(--motion-duration) var(--motion-ease);
        }

        .emovel-testimonials__card:hover {
          border-color: color-mix(in srgb, var(--color-primary) 45%, var(--color-border));
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0,0,0,.12), 0 12px 32px rgba(0,0,0,.08);
        }

        .emovel-testimonials__stars {
          display: flex;
          gap: 2px;
          font-size: 0.9rem;
        }

        .star--filled { color: var(--color-primary); }
        .star--empty  { color: var(--color-border); }

        .emovel-testimonials__quote {
          margin: 0;
          font-size: clamp(0.9rem, 1.2vw, 1rem);
          line-height: 1.7;
          color: var(--color-textSecondary);
          flex: 1;
        }

        .emovel-testimonials__author {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .emovel-testimonials__avatar {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
          border: 1px solid var(--color-border);
        }

        .emovel-testimonials__avatar--initials {
          background: color-mix(in srgb, var(--color-primary) 18%, var(--color-surfaceAlt));
          border: 1px solid color-mix(in srgb, var(--color-primary) 35%, var(--color-border));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-primary);
          letter-spacing: 0.04em;
        }

        .emovel-testimonials__author-info {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .emovel-testimonials__author-name {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--color-textPrimary);
        }

        .emovel-testimonials__author-meta {
          font-size: 0.8rem;
          color: var(--color-textSecondary);
        }

        @container (max-width: 34rem) {
          .emovel-testimonials__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="emovel-testimonials__inner">
        <div className="emovel-testimonials__header">
          {eyebrow ? <p className="emovel-testimonials__eyebrow">{eyebrow}</p> : null}
          {headline ? <h2 className="emovel-testimonials__headline">{headline}</h2> : null}
        </div>

        <div className={isSlider ? 'emovel-testimonials__slider' : 'emovel-testimonials__grid'}>
          {(testimonials ?? []).map((t, i) => (
            <div key={i} className="emovel-testimonials__card">
              <StarRating rating={t.rating} />
              {t.quote ? (
                <blockquote className="emovel-testimonials__quote">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              ) : null}
              <div className="emovel-testimonials__author">
                <Avatar name={t.authorName || '?'} avatarUrl={t.avatarUrl || ''} />
                <div className="emovel-testimonials__author-info">
                  {t.authorName ? (
                    <span className="emovel-testimonials__author-name">{t.authorName}</span>
                  ) : null}
                  {(t.authorRole || t.authorCompany) ? (
                    <span className="emovel-testimonials__author-meta">
                      {[t.authorRole, t.authorCompany].filter(Boolean).join(' · ')}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
