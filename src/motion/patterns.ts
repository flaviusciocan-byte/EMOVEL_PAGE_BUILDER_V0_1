// Single Source of Truth for all Hero motion patterns.
// Both the React runtime (Framer Motion) and the static export (CSS @keyframes)
// derive their values from this file — never from each other.

import type { Variants, Transition } from 'motion/react';
import type { MotionPattern } from '../types/sections';

// ── Easing ────────────────────────────────────────────────────────────────────
// Source: --motion-ease-out in tokens.motion.css

const EASE_TUPLE: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_CSS = 'cubic-bezier(.22,1,.36,1)';

// ── Token-derived scale constants ─────────────────────────────────────────────
// Source: tokens.motion.css

const DUR = {
  fast:      0.20,  // --motion-duration-fast
  base:      0.40,  // --motion-duration-base
  slow:      0.70,  // --motion-duration-slow
  cinematic: 1.10,  // --motion-duration-cinematic
} as const;

const DIST = {
  sm: 12,  // px — --motion-distance-sm
  md: 24,  // px — --motion-distance-md
  lg: 40,  // px — --motion-distance-lg
} as const;

const DEPTH = {
  perspective: 1200,  // px — --depth-perspective
  tiltX:          6,  // deg — --depth-tilt-enter-x
  z:            -40,  // px — --depth-z-enter
} as const;

// ── Wing animation timings ────────────────────────────────────────────────────
// Single source values (ms / px). Both runtime consumers derive from here:
//   WINGS.anime → Anime.js v4 (useCinematicLogo.ts), values in ms
//   WINGS.css   → CSS export  (publish.ts buildMotionCSS), durations in s

const WINGS_RAW = {
  containerMs:   600,   // ms — container fade + rise
  containerInitY:  20,  // px — initial translateY
  pathMs:        440,   // ms — each feather path
  pathInitX:      16,   // px — initial translateX magnitude
  leftStartMs:   200,   // ms — absolute timeline position of first left path
  rightStartMs:  240,   // ms — absolute timeline position of first right path
  staggerMs:      55,   // ms — between successive paths (Anime.js stagger)
} as const;

export const WINGS = {
  /** Anime.js v4 parameters — consumed by useCinematicLogo.ts */
  anime: {
    containerDuration: WINGS_RAW.containerMs,
    containerInitY:    WINGS_RAW.containerInitY,
    pathDuration:      WINGS_RAW.pathMs,
    pathInitX:         WINGS_RAW.pathInitX,
    leftStaggerStart:  WINGS_RAW.leftStartMs,
    rightStaggerStart: WINGS_RAW.rightStartMs,
    staggerStep:       WINGS_RAW.staggerMs,
  },
  /** CSS descriptor — consumed by publish.ts buildMotionCSS (durations in s) */
  css: {
    containerDuration: WINGS_RAW.containerMs   / 1000,
    containerInitY:    WINGS_RAW.containerInitY,
    pathDuration:      WINGS_RAW.pathMs        / 1000,
    pathInitX:         WINGS_RAW.pathInitX,
    leftStaggerStart:  WINGS_RAW.leftStartMs   / 1000,
    rightStaggerStart: WINGS_RAW.rightStartMs  / 1000,
    staggerStep:       WINGS_RAW.staggerMs     / 1000,
  },
} as const;

// ── CSS var injection sets (for publish.ts :root block) ───────────────────────

export const MOTION_TOKEN_CSS_VARS: ReadonlyArray<readonly [string, string]> = [
  ['--motion-duration-fast',       `${DUR.fast}s`],
  ['--motion-duration-base',       `${DUR.base}s`],
  ['--motion-duration-slow',       `${DUR.slow}s`],
  ['--motion-duration-cinematic',  `${DUR.cinematic}s`],
  ['--motion-ease-out',            EASE_CSS],
  ['--motion-ease-spring',         'cubic-bezier(.34,1.56,.64,1)'],
  ['--motion-distance-sm',         `${DIST.sm}px`],
  ['--motion-distance-md',         `${DIST.md}px`],
  ['--motion-distance-lg',         `${DIST.lg}px`],
  ['--depth-perspective',          `${DEPTH.perspective}px`],
  ['--depth-tilt-enter-x',         `${DEPTH.tiltX}deg`],
  ['--depth-tilt-enter-y',         '-2deg'],
  ['--depth-z-enter',              `${DEPTH.z}px`],
  ['--lighting-rim',               'var(--color-glow, rgba(212,175,55,.14))'],
  ['--lighting-ambient',           'var(--color-surface, #0E0E10)'],
];

export const MOTION_REDUCED_CSS_VARS: ReadonlyArray<readonly [string, string]> = [
  ['--motion-duration-fast',       '0.01ms'],
  ['--motion-duration-base',       '0.01ms'],
  ['--motion-duration-slow',       '0.01ms'],
  ['--motion-duration-cinematic',  '0.01ms'],
  ['--motion-distance-sm',         '0'],
  ['--motion-distance-md',         '0'],
  ['--motion-distance-lg',         '0'],
  ['--depth-tilt-enter-x',         '0deg'],
  ['--depth-tilt-enter-y',         '0deg'],
  ['--depth-z-enter',              '0px'],
];

// ── Types ─────────────────────────────────────────────────────────────────────

export type KeyframeState = {
  opacity?: number;
  translateY?: number;
  translateX?: number;
  translateZ?: number;
  rotateX?: number;
  scale?: number;
};

export type KeyframesDescriptor = {
  from: KeyframeState;
  to: KeyframeState;
  duration: number;
  easing: string;
};

export type StaggeredChildDescriptor = {
  keyframes: KeyframesDescriptor;
  // Per-item delay in seconds for 4 hero copy elements:
  // [.emovel-hero__eyebrow, .emovel-hero__title, .emovel-hero__subtitle, .emovel-hero__actions]
  itemDelays: readonly number[];
};

export type FramerDescriptor = {
  panelVariants: Variants;
  childVariants?: Variants;
  transition: Transition;
  isStaggered: boolean;
};

export type PatternDef = {
  framer: FramerDescriptor;
  keyframes: KeyframesDescriptor | null;  // null for staggered-rise (no panel animation)
  staggeredChild?: StaggeredChildDescriptor;
};

// ── SSOT pattern definitions ──────────────────────────────────────────────────

export const PATTERNS: Record<MotionPattern, PatternDef> = {

  'slide-fade': {
    framer: {
      panelVariants: {
        hidden:  { opacity: 0, y: DIST.sm },
        visible: { opacity: 1, y: 0 },
      },
      transition:  { duration: 0.60, ease: EASE_TUPLE },
      isStaggered: false,
    },
    keyframes: {
      from:     { opacity: 0, translateY: DIST.sm },
      to:       { opacity: 1, translateY: 0 },
      duration: 0.60,
      easing:   EASE_CSS,
    },
  },

  'depth-push': {
    framer: {
      panelVariants: {
        hidden:  { opacity: 0, scale: 0.96, rotateX: DEPTH.tiltX, z: DEPTH.z },
        visible: { opacity: 1, scale: 1,    rotateX: 0,            z: 0 },
      },
      transition:  { duration: 0.70, ease: EASE_TUPLE },
      isStaggered: false,
    },
    keyframes: {
      from:     { opacity: 0, scale: 0.96, rotateX: DEPTH.tiltX, translateZ: DEPTH.z },
      to:       { opacity: 1, scale: 1,    rotateX: 0,            translateZ: 0 },
      duration: 0.70,
      easing:   EASE_CSS,
    },
  },

  'parallax-reveal': {
    framer: {
      panelVariants: {
        hidden:  { opacity: 0, y: -DIST.sm, scale: 1.02 },
        visible: { opacity: 1, y: 0,        scale: 1 },
      },
      transition:  { duration: 0.80, ease: EASE_TUPLE },
      isStaggered: false,
    },
    keyframes: {
      from:     { opacity: 0, translateY: -DIST.sm, scale: 1.02 },
      to:       { opacity: 1, translateY: 0,        scale: 1 },
      duration: 0.80,
      easing:   EASE_CSS,
    },
  },

  'staggered-rise': {
    framer: {
      panelVariants: {
        hidden:  {},
        visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
      },
      childVariants: {
        hidden:  { opacity: 0, y: 32 },
        visible: { opacity: 1, y: 0 },
      },
      transition:  { duration: 0.55, ease: EASE_TUPLE },
      isStaggered: true,
    },
    keyframes: null,
    staggeredChild: {
      keyframes: {
        from:     { opacity: 0, translateY: 32 },
        to:       { opacity: 1, translateY: 0 },
        duration: 0.55,
        easing:   EASE_CSS,
      },
      // Mirrors Framer orchestration: delayChildren(0.05) + staggerChildren(0.1) * index
      itemDelays: [0.05, 0.15, 0.25, 0.35],
    },
  },

};
