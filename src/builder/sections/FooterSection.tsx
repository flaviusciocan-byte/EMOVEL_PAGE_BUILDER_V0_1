import type { FooterProps } from '../section-contract';
import { SectionSurface } from './SectionSurface';

export function FooterSection(props: FooterProps) {
  const { surface, width, backgroundImageUrl, logoText, tagline, linkGroups, copyright, socialLinks, brandMark, newsletter, legalLinks } = props;

  return (
    <SectionSurface surface={surface} width={width} backgroundImageUrl={backgroundImageUrl} as="footer" className="emovel-footer">
      <style>{`
        .emovel-footer {
          border-top: 1px solid var(--color-border);
          color: var(--color-textSecondary);
        }

        .emovel-footer__inner {
          width: min(100%, 72rem);
          margin: 0 auto;
          padding: clamp(3rem, 6vw, 4.5rem) clamp(1.25rem, 4vw, var(--space-section-h));
        }

        .emovel-footer__top {
          display: grid;
          grid-template-columns: 1fr repeat(auto-fit, minmax(9rem, 1fr));
          gap: clamp(2rem, 5vw, 3.5rem);
          margin-bottom: clamp(2rem, 4vw, 3rem);
        }

        .emovel-footer__brand {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .emovel-footer__logo {
          font-family: "Clash Display", "Cinzel", serif;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: var(--color-textPrimary);
          user-select: none;
        }

        .emovel-footer__tagline {
          font-size: 0.875rem;
          line-height: 1.6;
          color: var(--color-textSecondary);
          max-width: 22rem;
        }

        .emovel-footer__group-heading {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-textPrimary);
          margin: 0 0 0.85rem;
        }

        .emovel-footer__group-links {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .emovel-footer__group-link {
          font-size: 0.875rem;
          color: var(--color-textSecondary);
          text-decoration: none;
          transition: color var(--motion-duration) var(--motion-ease);
        }

        .emovel-footer__group-link:hover {
          color: var(--color-textPrimary);
        }

        .emovel-footer__bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          padding-top: clamp(1.25rem, 2.5vw, 1.75rem);
          border-top: 1px solid var(--color-border);
        }

        .emovel-footer__copyright {
          font-size: 0.8rem;
          color: var(--color-textSecondary);
        }

        .emovel-footer__social {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .emovel-footer__social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--color-textSecondary);
          text-decoration: none;
          transition:
            color var(--motion-duration) var(--motion-ease),
            border-color var(--motion-duration) var(--motion-ease),
            background var(--motion-duration) var(--motion-ease);
          white-space: nowrap;
        }

        .emovel-footer__social-link:hover {
          color: var(--color-primary);
          border-color: color-mix(in srgb, var(--color-primary) 50%, var(--color-border));
          background: color-mix(in srgb, var(--color-primary) 8%, transparent);
        }

        .emovel-footer__newsletter {
          padding: clamp(1.25rem, 2.5vw, 1.75rem) 0;
          border-top: 1px solid var(--color-border);
        }

        .emovel-footer__legal-links {
          display: flex;
          align-items: center;
          gap: 1rem;
          list-style: none;
          margin: 0;
          padding: 0;
          flex-wrap: wrap;
        }

        .emovel-footer__legal-link {
          font-size: 0.8rem;
          color: var(--color-textSecondary);
          text-decoration: none;
          transition: color var(--motion-duration) var(--motion-ease);
        }

        .emovel-footer__legal-link:hover {
          color: var(--color-textPrimary);
        }

        @container (max-width: 48rem) {
          .emovel-footer__top {
            grid-template-columns: 1fr 1fr;
          }
          .emovel-footer__brand {
            grid-column: 1 / -1;
          }
        }

        @container (max-width: 34rem) {
          .emovel-footer__top {
            grid-template-columns: 1fr;
          }
          .emovel-footer__bottom {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="emovel-footer__inner">
        <div className="emovel-footer__top">
          <div className="emovel-footer__brand">
            {logoText ? (
              <div className="emovel-footer__logo" data-brandmark={brandMark ?? 'none'}>{logoText}</div>
            ) : null}
            {tagline ? (
              <p className="emovel-footer__tagline">{tagline}</p>
            ) : null}
          </div>

          {(linkGroups ?? []).map((group, gi) => (
            <div key={gi}>
              {group.heading ? (
                <p className="emovel-footer__group-heading">{group.heading}</p>
              ) : null}
              <ul className="emovel-footer__group-links" role="list">
                {(group.links ?? []).map((link, li) => (
                  <li key={li}>
                    <a
                      className="emovel-footer__group-link"
                      href={link.href || '#'}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {newsletter ? (
          <div className="emovel-footer__newsletter">
            <p className="emovel-footer__group-heading">Newsletter</p>
          </div>
        ) : null}

        <div className="emovel-footer__bottom">
          <span className="emovel-footer__copyright">
            {copyright || `© ${new Date().getFullYear()}`}
          </span>

          {legalLinks && legalLinks.length > 0 ? (
            <ul className="emovel-footer__legal-links" role="list">
              {legalLinks.map((link, i) => (
                <li key={i}>
                  <a className="emovel-footer__legal-link" href={link.href || '#'}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}

          {socialLinks && socialLinks.length > 0 ? (
            <ul className="emovel-footer__social" role="list" aria-label="Social links">
              {socialLinks.map((link, i) => (
                <li key={i}>
                  <a
                    className="emovel-footer__social-link"
                    href={link.href || '#'}
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </SectionSurface>
  );
}
