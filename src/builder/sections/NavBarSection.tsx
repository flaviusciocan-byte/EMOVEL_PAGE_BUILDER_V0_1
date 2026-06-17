import { useId } from 'react';
import type { NavBarProps } from '../section-contract';
import { SectionSurface } from './SectionSurface';

export function NavBarSection(props: NavBarProps) {
  const { surface, width, backgroundImageUrl, logoText, logoImageUrl, links, ctaLabel, ctaHref, position, logoVariant, transparency } = props;

  // useId() generates stable IDs across browser + renderToStaticMarkup,
  // ensuring each NavBar instance has a unique checkbox ID.
  const uid      = useId().replace(/[^a-z0-9]/gi, '');
  const toggleId = `emnav-${uid}`;

  const safeLinks = links ?? [];

  return (
    <SectionSurface
      as="nav"
      ariaLabel="Site navigation"
      surface={surface}
      width={width}
      backgroundImageUrl={backgroundImageUrl}
      className={[
        'emovel-navbar',
        position === 'sticky'              ? 'emovel-navbar--sticky' : null,
        transparency === 'glass-over-hero' ? 'emovel-navbar--glass'  : null,
      ].filter(Boolean).join(' ')}
    >
      <style>{`
        /* ── Base ── */
        .emovel-navbar {
          border-bottom: 1px solid var(--color-border);
          z-index: 100;
        }

        /* Sticky modifier — overrides SectionSurface position:relative via cascade order */
        .emovel-navbar--sticky {
          position: sticky;
          top: 0;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          background: color-mix(in srgb, var(--color-surface) 88%, transparent);
        }

        /* Glass modifier — applied via transparency="glass-over-hero" */
        .emovel-navbar--glass {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          background: color-mix(in srgb, var(--color-surface) 88%, transparent);
        }

        /* ── Bar row ── */
        .emovel-navbar__bar {
          width: min(100%, 72rem);
          margin: 0 auto;
          padding: 0 clamp(1.25rem, 4vw, var(--space-section-h));
          height: 64px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* ── Logo ── */
        .emovel-navbar__logo {
          font-family: "Clash Display", "Cinzel", serif;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: var(--color-textPrimary);
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
          user-select: none;
          margin-right: 1.5rem;
        }

        .emovel-navbar__logo-img {
          display: block;
          width: auto;
          height: 30px;
          max-width: 156px;
          object-fit: contain;
        }

        /* ── Desktop links ── */
        .emovel-navbar__links {
          display: flex;
          align-items: center;
          gap: 0.15rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .emovel-navbar__link {
          display: inline-flex;
          align-items: center;
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-textSecondary);
          text-decoration: none;
          transition:
            color var(--motion-duration) var(--motion-ease),
            background var(--motion-duration) var(--motion-ease);
          white-space: nowrap;
        }

        .emovel-navbar__link:hover {
          color: var(--color-textPrimary);
          background: color-mix(in srgb, var(--color-surfaceAlt) 80%, transparent);
        }

        /* ── Spacer ── */
        .emovel-navbar__spacer { flex: 1; }

        /* ── CTA button ── */
        .emovel-navbar__cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.55rem 1.15rem;
          border-radius: var(--radius-md);
          background: var(--color-primary);
          border: 1px solid color-mix(in srgb, var(--color-primary) 80%, white);
          color: var(--color-background);
          font-size: 0.875rem;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
          transition:
            transform var(--motion-duration) var(--motion-ease),
            box-shadow var(--motion-duration) var(--motion-ease);
        }

        .emovel-navbar__cta:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-primary-glow);
        }

        /* ══════════════════════════════════════════════════════
           HAMBURGER — hidden checkbox state machine (no JS).
           Structure: input.toggle (pos 1) · div.bar (pos 2) · div.panel (pos 3)
           All are siblings inside <nav>, so the ~ combinator works.
           ══════════════════════════════════════════════════════ */

        /* Visually hidden but still interactive (click via <label>) */
        .emovel-navbar__toggle {
          position: absolute;
          width: 1px;
          height: 1px;
          margin: -1px;
          padding: 0;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
          border: 0;
          appearance: none;
        }

        /* Hamburger button — hidden on desktop, visible on mobile */
        .emovel-navbar__hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 4px;
          width: 36px;
          height: 36px;
          padding: 6px;
          border-radius: var(--radius-md);
          cursor: pointer;
          border: 1px solid var(--color-border);
          background: transparent;
          flex-shrink: 0;
          transition: background var(--motion-duration) var(--motion-ease);
        }

        .emovel-navbar__hamburger:hover {
          background: color-mix(in srgb, var(--color-surfaceAlt) 80%, transparent);
        }

        /* Three lines of the hamburger icon */
        .emovel-navbar__ham-1,
        .emovel-navbar__ham-2,
        .emovel-navbar__ham-3 {
          display: block;
          width: 16px;
          height: 1.5px;
          background: var(--color-textSecondary);
          border-radius: 2px;
          transform-origin: center;
          transition:
            transform var(--motion-duration) var(--motion-ease),
            opacity var(--motion-duration) var(--motion-ease);
        }

        /* Animate lines → X when menu is open */
        .emovel-navbar__toggle:checked ~ .emovel-navbar__bar .emovel-navbar__ham-1 {
          transform: rotate(45deg) translate(4px, 4px);
        }
        .emovel-navbar__toggle:checked ~ .emovel-navbar__bar .emovel-navbar__ham-2 {
          opacity: 0;
          transform: scaleX(0);
        }
        .emovel-navbar__toggle:checked ~ .emovel-navbar__bar .emovel-navbar__ham-3 {
          transform: rotate(-45deg) translate(4px, -4px);
        }

        /* ── Mobile panel — collapsed by default ── */
        .emovel-navbar__panel {
          overflow: hidden;
          max-height: 0;
          transition: max-height var(--motion-duration) var(--motion-ease);
          border-top: 0 solid transparent;
        }

        /* Panel expands when toggle is checked */
        .emovel-navbar__toggle:checked ~ .emovel-navbar__panel {
          max-height: 600px;
          border-top-width: 1px;
          border-top-color: var(--color-border);
        }

        .emovel-navbar__panel-inner {
          width: min(100%, 72rem);
          margin: 0 auto;
          padding: 1rem clamp(1.25rem, 4vw, var(--space-section-h));
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .emovel-navbar__panel-links {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .emovel-navbar__panel-link {
          display: block;
          padding: 0.6rem 0.75rem;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--color-textSecondary);
          text-decoration: none;
          transition:
            color var(--motion-duration) var(--motion-ease),
            background var(--motion-duration) var(--motion-ease);
        }

        .emovel-navbar__panel-link:hover {
          color: var(--color-textPrimary);
          background: color-mix(in srgb, var(--color-surfaceAlt) 80%, transparent);
        }

        .emovel-navbar__panel-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 0.5rem;
          padding: 0.65rem 1.15rem;
          border-radius: var(--radius-md);
          background: var(--color-primary);
          border: 1px solid color-mix(in srgb, var(--color-primary) 80%, white);
          color: var(--color-background);
          font-size: 0.875rem;
          font-weight: 700;
          text-decoration: none;
          align-self: flex-start;
        }

        /* ── Responsive breakpoints (container queries — work in Puck iframe + export) ── */
        @container (max-width: 47.999rem) {
          /* Mobile: hide desktop links, show hamburger */
          .emovel-navbar__links { display: none; }
          .emovel-navbar__cta   { display: none; }
          .emovel-navbar__hamburger { display: flex; }
        }

        @container (min-width: 48rem) {
          /* Desktop: always hide panel and hamburger regardless of checkbox state */
          .emovel-navbar__panel     { max-height: 0 !important; border-top-width: 0 !important; }
          .emovel-navbar__hamburger { display: none !important; }
        }
      `}</style>

      {/* ── Checkbox state machine ── visually hidden, toggled by label below ── */}
      <input
        type="checkbox"
        id={toggleId}
        className="emovel-navbar__toggle"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* ── Bar row: logo · desktop links · spacer · CTA · hamburger ── */}
      <div className="emovel-navbar__bar">
        <a className="emovel-navbar__logo" href="#">
          {logoVariant === 'wordmark'
            ? (logoText || 'Brand')
            : logoImageUrl
              ? <img className="emovel-navbar__logo-img" src={logoImageUrl} alt={logoText || 'Brand'} />
              : (logoText || 'Brand')
          }
        </a>

        {safeLinks.length > 0 && (
          <ul className="emovel-navbar__links" role="list">
            {safeLinks.map((link, i) => (
              <li key={i}>
                <a className="emovel-navbar__link" href={link.href || '#'}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        <span className="emovel-navbar__spacer" />

        {ctaLabel && (
          <a className="emovel-navbar__cta" href={ctaHref || '#'}>
            {ctaLabel}
          </a>
        )}

        {/* Hamburger label — clicking it checks/unchecks the hidden input */}
        <label
          htmlFor={toggleId}
          className="emovel-navbar__hamburger"
          aria-label="Toggle navigation menu"
        >
          <span className="emovel-navbar__ham-1" />
          <span className="emovel-navbar__ham-2" />
          <span className="emovel-navbar__ham-3" />
        </label>
      </div>

      {/* ── Mobile panel — shown via CSS :checked ~ .panel selector ── */}
      <div className="emovel-navbar__panel" role="region" aria-label="Mobile navigation">
        <div className="emovel-navbar__panel-inner">
          {safeLinks.length > 0 && (
            <ul className="emovel-navbar__panel-links" role="list">
              {safeLinks.map((link, i) => (
                <li key={i}>
                  <a className="emovel-navbar__panel-link" href={link.href || '#'}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {ctaLabel && (
            <a className="emovel-navbar__panel-cta" href={ctaHref || '#'}>
              {ctaLabel}
            </a>
          )}
        </div>
      </div>
    </SectionSurface>
  );
}
