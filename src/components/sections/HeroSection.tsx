import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import type { HeroSectionProps } from '../../types/sections';
import { PATTERNS } from '../../motion/patterns';
import { CinematicWings } from './CinematicWings';
import { useCinematicLogo } from '../../hooks/useCinematicLogo';

// ── Editor detection ──────────────────────────────────────────────────────────
// Puck renders component previews inside an iframe.
// window.self !== window.top is the reliable, SSR-safe check for this.
//
// Cannot use usePuck(): it throws "must be used inside <Puck>" when called
// from renderToStaticMarkup (publish.ts static export) — confirmed in source.
// Cannot use renderContext: it is provided by BOTH the editor canvas AND the
// static <Render> component, so it cannot distinguish the two contexts.
//
// iframe check:  Puck editor  → window.self !== window.top → true  → no entrance
//                Published page → window.self === window.top → false → entrance runs
//                SSR / Node.js  → typeof window === 'undefined'     → false → entrance runs
function useIsInEditor(): boolean {
  if (typeof window === 'undefined') return false;
  try { return window.self !== window.top; }
  catch { return true; } // SecurityError = cross-origin iframe = treat as editor
}

// ── Component ─────────────────────────────────────────────────────────────────

export function HeroSection({
  id,
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  motionPattern = 'depth-push',
  enableCinematicLogo = true,
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef    = useRef<HTMLDivElement>(null);

  const isInEditor = useIsInEditor();
  const reduced    = useReducedMotion() ?? false;

  // Entrance animation only in presentation mode (non-editor, non-reduced-motion).
  // When shouldAnimate === false, all motion elements receive initial={false} and
  // animate={false}, which disables Framer Motion overrides and leaves content at
  // its natural CSS state (opacity: 1, no transform) — always visible.
  const shouldAnimate = !isInEditor && !reduced;

  // amount: 0 → fires on any viewport overlap, including above-fold at mount.
  // Original 0.1 could fail at sub-100% zoom where the IO threshold was never met
  // against the iframe viewport height, causing permanent opacity:0 in the editor.
  const inView = useInView(sectionRef, { once: true, amount: 0 });

  useCinematicLogo(logoRef, enableCinematicLogo);

  const pat = PATTERNS[motionPattern];
  const { isStaggered } = pat.framer;

  // Motion props: only applied when shouldAnimate is true.
  // initial={false} + animate={false} = Framer disables all overrides → natural visible state.
  const panelMotionProps = shouldAnimate
    ? {
        initial:    'hidden' as const,
        animate:    inView ? 'visible' as const : 'hidden' as const,
        variants:   pat.framer.panelVariants,
        transition: !isStaggered ? pat.framer.transition : undefined,
      }
    : { initial: false as const, animate: false as const };

  // Child variants only for staggered-rise in presentation mode.
  // When absent ({}) parent's initial={false} propagates nothing → children visible.
  const childMotionProps = shouldAnimate && isStaggered
    ? {
        variants:   pat.framer.childVariants,
        transition: pat.framer.transition,
      }
    : {};

  return (
    <section
      className="emovel-hero"
      id={id}
      ref={sectionRef}
      data-emovel-motion={motionPattern}
    >
      <style>{HERO_CSS}</style>

      {/* Ambient glow — derived from theme --color-glow token */}
      <div className="emovel-hero__glow" aria-hidden="true" />

      {/* perspective is set on inner so the panel's 3D transforms render with depth */}
      <div className="emovel-hero__inner">
        <motion.div
          className="emovel-hero__panel"
          {...panelMotionProps}
        >
          {enableCinematicLogo && (
            <div className="emovel-hero__logo" ref={logoRef}>
              <CinematicWings className="emovel-hero__wings" />
            </div>
          )}

          {eyebrow && (
            <motion.p
              className="emovel-hero__eyebrow"
              {...childMotionProps}
            >
              {eyebrow}
            </motion.p>
          )}

          <motion.h1
            className="emovel-hero__title"
            {...childMotionProps}
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              className="emovel-hero__subtitle"
              {...childMotionProps}
            >
              {subtitle}
            </motion.p>
          )}

          {(primaryCta || secondaryCta) && (
            <motion.div
              className="emovel-hero__actions"
              {...childMotionProps}
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
    </section>
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

  position: relative;
  overflow: hidden;
  background: var(--color-background);
  color: var(--color-textPrimary);
  border-bottom: 1px solid var(--color-border);
  container-type: inline-size;
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
    clamp(var(--space-hero-v, 4rem), 8vw, 7.5rem)
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
  margin-bottom: clamp(1.5rem, 3vw, 2.5rem);
}

.emovel-hero__wings {
  width: clamp(9rem, 20vw, 15rem);
  height: auto;
  color: var(--color-primary);
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
  font-size: clamp(2.6rem, 7vw, 5.2rem);
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
