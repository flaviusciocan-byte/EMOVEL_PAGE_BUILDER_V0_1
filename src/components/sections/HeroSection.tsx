import { useRef } from 'react';
import { motion } from 'motion/react';
import type { HeroSectionProps } from '../../types/sections';
import { CinematicWings } from './CinematicWings';
import { useCinematicLogo } from '../../hooks/useCinematicLogo';
import { SectionSurface } from '../../builder/sections/SectionSurface';

// ── Component ─────────────────────────────────────────────────────────────────

export function HeroSection({
  id,
  surface = 'transparent',
  width = 'contained',
  backgroundImageUrl = '',
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  enableCinematicLogo = true,
  brandImageUrl,
  brandImageAlt,
}: HeroSectionProps) {
  const logoRef = useRef<HTMLDivElement>(null);

  useCinematicLogo(logoRef, enableCinematicLogo);

  return (
    <SectionSurface
      surface={surface}
      width={width}
      backgroundImageUrl={backgroundImageUrl}
      className="emovel-hero"
      id={id}
    >
      <style>{HERO_CSS}</style>

      {/* Ambient glow — derived from theme --color-glow token */}
      <div className="emovel-hero__glow" aria-hidden="true" />

      {/* perspective is set on inner so the panel's 3D transforms render with depth */}
      <div className="emovel-hero__inner">
        <motion.div
          className="emovel-hero__panel"
          initial={false}
          animate={false}
        >
          {brandImageUrl ? (
            <div className="emovel-hero__logo">
              <img
                className="emovel-hero__brand-img"
                src={brandImageUrl}
                alt={brandImageAlt || title}
              />
            </div>
          ) : enableCinematicLogo && (
            <div className="emovel-hero__logo" ref={logoRef}>
              <CinematicWings className="emovel-hero__wings" />
            </div>
          )}

          {eyebrow && (
            <motion.p
              className="emovel-hero__eyebrow"
              initial={false}
              animate={false}
            >
              {eyebrow}
            </motion.p>
          )}

          <motion.h1
            className="emovel-hero__title"
            initial={false}
            animate={false}
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              className="emovel-hero__subtitle"
              initial={false}
              animate={false}
            >
              {subtitle}
            </motion.p>
          )}

          {(primaryCta || secondaryCta) && (
            <motion.div
              className="emovel-hero__actions"
              initial={false}
              animate={false}
            >
              {primaryCta && (
                <a
                  className="emovel-hero__btn emovel-hero__btn--primary"
                  href={primaryCta.href}
                >
                  {primaryCta.label}
                </a>
              )}
              {secondaryCta && (
                <a
                  className="emovel-hero__btn emovel-hero__btn--secondary"
                  href={secondaryCta.href}
                >
                  {secondaryCta.label}
                </a>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </SectionSurface>
  );
}

// ── Inline CSS ────────────────────────────────────────────────────────────────
// Injected via <style> for Puck canvas iframe compatibility.
// Mirrors src/components/sections/HeroSection.css.
// All colors reference theme tokens (--color-*). No hex values here.

const HERO_CSS = `
.emovel-hero {
  --hero-perspective: 1200px;
  --hero-btn-dur: var(--motion-duration, 180ms);
  --hero-btn-ease: var(--motion-ease, cubic-bezier(.22, 1, .36, 1));

  overflow: hidden;
  border-bottom: 1px solid var(--color-border);
  isolation: isolate;
}

@media (prefers-reduced-motion: reduce) {
  .emovel-hero {
    --hero-btn-dur: 0.01ms;
  }
}

.emovel-hero__glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 80% 50% at 50% -10%,
    var(--color-glow, rgba(212,175,55,.14)),
    transparent
  );
  pointer-events: none;
  z-index: 0;
}

.emovel-hero__inner {
  position: relative;
  z-index: 1;
  perspective: var(--hero-perspective);
  width: min(100%, 72rem);
  margin: 0 auto;
  padding:
    clamp(2.75rem, 5vw, 4.75rem)
    clamp(1.25rem, 4vw, var(--space-hero-h, 3.25rem));
}

.emovel-hero__panel {
  transform-style: preserve-3d;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.emovel-hero__logo {
  margin-bottom: clamp(0.875rem, 2vw, 1.5rem);
}

.emovel-hero__wings {
  width: clamp(7rem, 14vw, 10rem);
  height: auto;
  color: var(--color-primary);
}

.emovel-hero__brand-img {
  display: block;
  width: clamp(8rem, 18vw, 12rem);
  height: auto;
  object-fit: contain;
}

.emovel-hero__eyebrow {
  margin: 0 0 1rem;
  color: var(--color-secondary);
  font-size: clamp(0.7rem, 1vw, 0.8rem);
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.emovel-hero__title {
  margin: 0;
  color: var(--color-textPrimary);
  font-size: clamp(2.35rem, 5.4vw, 4.4rem);
  font-weight: 780;
  letter-spacing: -0.04em;
  line-height: 0.96;
  text-wrap: balance;
  max-width: 54rem;
}

.emovel-hero__subtitle {
  max-width: 38rem;
  margin: clamp(1.2rem, 2.5vw, 1.75rem) 0 0;
  color: var(--color-textSecondary);
  font-size: clamp(0.95rem, 1.4vw, 1.1rem);
  line-height: 1.7;
  text-wrap: balance;
}

.emovel-hero__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: clamp(1.75rem, 4vw, 2.5rem);
}

.emovel-hero__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.85rem;
  padding: 0.75rem 1.4rem;
  border-radius: var(--radius-md);
  font: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  transition:
    transform var(--hero-btn-dur) var(--hero-btn-ease),
    box-shadow var(--hero-btn-dur) var(--hero-btn-ease),
    border-color var(--hero-btn-dur) var(--hero-btn-ease);
}

.emovel-hero__btn--primary {
  background: var(--color-primary);
  color: var(--color-background);
  border: 1px solid var(--color-primary);
}

.emovel-hero__btn--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px var(--color-glow, rgba(212,175,55,.14));
}

.emovel-hero__btn--secondary {
  background: transparent;
  color: var(--color-textPrimary);
  border: 1px solid var(--color-border);
}

.emovel-hero__btn--secondary:hover {
  transform: translateY(-1px);
  border-color: var(--color-primary);
}

@container (max-width: 36rem) {
  .emovel-hero__actions {
    flex-direction: column;
    align-items: stretch;
  }
  .emovel-hero__btn {
    width: 100%;
    text-align: center;
  }
}
`.trim();
