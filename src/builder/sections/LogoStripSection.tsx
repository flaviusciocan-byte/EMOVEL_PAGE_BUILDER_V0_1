import type { LogoStripProps } from '../section-contract';

export function LogoStripSection(props: LogoStripProps) {
  const { eyebrow, logos } = props;

  return (
    <section className="emovel-logostrip">
      <style>{`
        .emovel-logostrip {
          background: var(--color-surface);
          border-bottom: 1px solid var(--color-border);
          color: var(--color-textSecondary);
          container-type: inline-size;
        }

        .emovel-logostrip__inner {
          width: min(100%, 72rem);
          margin: 0 auto;
          padding:
            clamp(2rem, 4vw, 3rem)
            clamp(1.25rem, 4vw, var(--space-section-h));
        }

        .emovel-logostrip__eyebrow {
          text-align: center;
          margin: 0 0 1.5rem;
          font-size: clamp(0.7rem, 1vw, 0.8rem);
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-textSecondary);
        }

        .emovel-logostrip__track {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: clamp(1.5rem, 4vw, 3rem);
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .emovel-logostrip__item {
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.6;
          transition: opacity var(--motion-duration) var(--motion-ease);
          flex-shrink: 0;
        }

        .emovel-logostrip__item:hover {
          opacity: 1;
        }

        .emovel-logostrip__logo-img {
          display: block;
          height: 2rem;
          width: auto;
          max-width: 8rem;
          object-fit: contain;
          filter: grayscale(1);
          transition: filter var(--motion-duration) var(--motion-ease);
        }

        .emovel-logostrip__item:hover .emovel-logostrip__logo-img {
          filter: grayscale(0);
        }

        .emovel-logostrip__logo-text {
          font-family: "Cinzel", serif;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--color-textSecondary);
          white-space: nowrap;
          border: 1px solid var(--color-border);
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-md);
          background: var(--color-surfaceAlt);
        }

        @container (max-width: 34rem) {
          .emovel-logostrip__track {
            gap: 1rem;
          }
        }
      `}</style>

      <div className="emovel-logostrip__inner">
        {eyebrow ? <p className="emovel-logostrip__eyebrow">{eyebrow}</p> : null}

        <ul className="emovel-logostrip__track" role="list" aria-label="Partner logos">
          {(logos ?? []).map((logo, i) => (
            <li key={i} className="emovel-logostrip__item">
              {logo.imageUrl ? (
                <img
                  className="emovel-logostrip__logo-img"
                  src={logo.imageUrl}
                  alt={logo.name}
                />
              ) : (
                <span className="emovel-logostrip__logo-text">{logo.name}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
