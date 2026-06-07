import type { StatsBarProps } from '../section-contract';
import { SectionSurface } from './SectionSurface';

export function StatsBarSection(props: StatsBarProps) {
  const { surface, width, backgroundImageUrl, eyebrow, stats } = props;

  return (
    <SectionSurface surface={surface} width={width} backgroundImageUrl={backgroundImageUrl} className="emovel-statsbar">
      <style>{`
        .emovel-statsbar {
          border-bottom: 1px solid var(--color-border);
        }

        .emovel-statsbar__inner {
          width: min(100%, 72rem);
          margin: 0 auto;
          padding:
            clamp(2.5rem, 5vw, 4rem)
            clamp(1.25rem, 4vw, var(--space-section-h));
        }

        .emovel-statsbar__eyebrow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          text-align: center;
          margin: 0 0 1.75rem;
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: clamp(0.68rem, 1vw, 0.78rem);
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-textSecondary);
        }

        .emovel-statsbar__eyebrow::before {
          content: "";
          width: 0.28rem;
          height: 0.28rem;
          border-radius: var(--radius-pill);
          background: var(--color-primary);
          flex-shrink: 0;
        }

        .emovel-statsbar__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 10rem), 1fr));
          gap: 0;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .emovel-statsbar__stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 0.35rem;
          padding: clamp(1.25rem, 3vw, 2rem);
          border-right: 1px solid var(--color-border);
        }

        .emovel-statsbar__stat:last-child {
          border-right: none;
        }

        .emovel-statsbar__value {
          margin: 0;
          font-size: clamp(1.9rem, 4.5vw, 3rem);
          font-weight: 760;
          letter-spacing: -0.04em;
          line-height: 1;
          color: var(--color-textPrimary);
          background: linear-gradient(135deg, var(--color-textPrimary), var(--color-primary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .emovel-statsbar__label {
          margin: 0;
          font-size: clamp(0.8rem, 1.2vw, 0.9rem);
          color: var(--color-textSecondary);
          line-height: 1.4;
        }

        @container (max-width: 48rem) {
          .emovel-statsbar__grid {
            grid-template-columns: 1fr 1fr;
          }
          .emovel-statsbar__stat:nth-child(2n) {
            border-right: none;
          }
          .emovel-statsbar__stat:nth-child(-n+2) {
            border-bottom: 1px solid var(--color-border);
          }
        }

        @container (max-width: 28rem) {
          .emovel-statsbar__grid {
            grid-template-columns: 1fr;
          }
          .emovel-statsbar__stat {
            border-right: none;
            border-bottom: 1px solid var(--color-border);
          }
          .emovel-statsbar__stat:last-child {
            border-bottom: none;
          }
        }
      `}</style>

      <div className="emovel-statsbar__inner">
        {eyebrow ? <p className="emovel-statsbar__eyebrow">{eyebrow}</p> : null}

        <ul className="emovel-statsbar__grid" role="list">
          {(stats ?? []).map((stat, i) => (
            <li key={i} className="emovel-statsbar__stat">
              {stat.value ? (
                <p className="emovel-statsbar__value">{stat.value}</p>
              ) : null}
              {stat.label ? (
                <p className="emovel-statsbar__label">{stat.label}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </SectionSurface>
  );
}
