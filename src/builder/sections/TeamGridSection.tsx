import type { TeamGridProps } from '../section-contract';

function TeamAvatar({ name, avatarUrl }: { name: string; avatarUrl: string }) {
  const initials = name
    .split(' ')
    .map((w) => w[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (avatarUrl) {
    return <img className="emovel-teamgrid__avatar" src={avatarUrl} alt={name} />;
  }
  return (
    <div className="emovel-teamgrid__avatar emovel-teamgrid__avatar--initials" aria-hidden="true">
      {initials || '?'}
    </div>
  );
}

export function TeamGridSection(props: TeamGridProps) {
  const { eyebrow, headline, subheadline, members, columns } = props;
  const cols = columns ?? 3;

  return (
    <section className="emovel-teamgrid">
      <style>{`
        .emovel-teamgrid {
          background: var(--color-background);
          border-bottom: 1px solid var(--color-border);
          color: var(--color-textPrimary);
          container-type: inline-size;
        }

        .emovel-teamgrid__inner {
          width: min(100%, 72rem);
          margin: 0 auto;
          padding:
            clamp(var(--space-section-v), 6vw, 5.5rem)
            clamp(1.25rem, 4vw, var(--space-section-h));
        }

        .emovel-teamgrid__header {
          text-align: center;
          max-width: 44rem;
          margin: 0 auto clamp(2.5rem, 5vw, 4rem);
        }

        .emovel-teamgrid__eyebrow {
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

        .emovel-teamgrid__eyebrow::before {
          content: "";
          width: 0.28rem;
          height: 0.28rem;
          border-radius: var(--radius-pill);
          background: var(--color-primary);
          flex-shrink: 0;
        }

        .emovel-teamgrid__headline {
          margin: 0;
          font-size: clamp(1.75rem, 4vw, 2.85rem);
          font-weight: 760;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: var(--color-textPrimary);
          text-wrap: balance;
        }

        .emovel-teamgrid__subheadline {
          margin: 0.75rem 0 0;
          font-size: clamp(0.95rem, 1.4vw, 1.1rem);
          line-height: 1.65;
          color: var(--color-textSecondary);
        }

        .emovel-teamgrid__grid {
          display: grid;
          grid-template-columns: repeat(${cols}, minmax(0, 1fr));
          gap: clamp(1rem, 2.5vw, 1.5rem);
        }

        .emovel-teamgrid__card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.75rem;
          padding: clamp(1.5rem, 3vw, 2rem);
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          box-shadow: 0 1px 2px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.06);
          transition:
            border-color var(--motion-duration) var(--motion-ease),
            transform var(--motion-duration) var(--motion-ease),
            box-shadow var(--motion-duration) var(--motion-ease);
        }

        .emovel-teamgrid__card:hover {
          border-color: color-mix(in srgb, var(--color-primary) 45%, var(--color-border));
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0,0,0,.12), 0 12px 32px rgba(0,0,0,.08);
        }

        .emovel-teamgrid__avatar {
          width: 5rem;
          height: 5rem;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--color-border);
          display: block;
          flex-shrink: 0;
        }

        .emovel-teamgrid__avatar--initials {
          background: color-mix(in srgb, var(--color-primary) 18%, var(--color-surfaceAlt));
          border: 2px solid color-mix(in srgb, var(--color-primary) 40%, var(--color-border));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--color-primary);
          letter-spacing: 0.04em;
        }

        .emovel-teamgrid__name {
          margin: 0;
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-textPrimary);
          letter-spacing: -0.01em;
        }

        .emovel-teamgrid__role {
          margin: 0;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--color-primary);
        }

        .emovel-teamgrid__bio {
          margin: 0;
          font-size: 0.875rem;
          line-height: 1.6;
          color: var(--color-textSecondary);
        }

        @container (max-width: 54rem) {
          .emovel-teamgrid__grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @container (max-width: 34rem) {
          .emovel-teamgrid__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="emovel-teamgrid__inner">
        <div className="emovel-teamgrid__header">
          {eyebrow ? <p className="emovel-teamgrid__eyebrow">{eyebrow}</p> : null}
          {headline ? <h2 className="emovel-teamgrid__headline">{headline}</h2> : null}
          {subheadline ? <p className="emovel-teamgrid__subheadline">{subheadline}</p> : null}
        </div>

        <div className="emovel-teamgrid__grid">
          {(members ?? []).map((member, i) => (
            <div key={i} className="emovel-teamgrid__card">
              <TeamAvatar name={member.name || ''} avatarUrl={member.avatarUrl || ''} />
              {member.name ? (
                <h3 className="emovel-teamgrid__name">{member.name}</h3>
              ) : null}
              {member.role ? (
                <p className="emovel-teamgrid__role">{member.role}</p>
              ) : null}
              {member.bio ? (
                <p className="emovel-teamgrid__bio">{member.bio}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
