// Shared Layer — declared once at registry level.
// No component re-declares these props.

/** Allowed values — used by the manifest generator so TypeScript is the single source of truth. */
export const UNIVERSE_VALUES = ['noir', 'ivory', 'nordic', 'terra', 'mono'] as const;
export const SURFACE_VALUES  = ['transparent', 'base', 'surface', 'surfaceAlt', 'image', 'gradient', 'elevated', 'inverted', 'cinematic'] as const;
export const MOTION_VALUES   = ['none', 'subtle', 'cinematic'] as const;
export const SPACING_VALUES  = ['compact', 'standard', 'generous'] as const;

/** Page-level color universe. Inherited by all components; palette cannot be overridden directly. */
export type Universe = typeof UNIVERSE_VALUES[number];

/** Section background treatment. Implemented via SectionSurface. Default: base. */
export type Surface = typeof SURFACE_VALUES[number];

/**
 * Animation level.
 * Builder canvas always renders static regardless of this value.
 * Export renders the full declared motion.
 * Default: subtle.
 */
export type Motion = typeof MOTION_VALUES[number];

/** Internal padding scale. Maps to the existing token spacing system. Default: standard. */
export type Spacing = typeof SPACING_VALUES[number];

/**
 * Props shared by every registered EMOVEL Builder component.
 *
 * Rules:
 * - universe is inherited from page-level config; components cannot override palette.
 * - surface maps to SectionSurface.
 * - motion is static on the Builder canvas; full motion appears only in export.
 * - spacing maps to the token spacing scale.
 * - anchorId supports internal navigation and deep-linking; auto-generated when absent.
 * - aiLock lists props the AI layer is not permitted to modify.
 */
export interface SharedRegistryProps {
  universe?: Universe;
  surface?: Surface;
  motion?: Motion;
  spacing?: Spacing;
  anchorId?: string;
  aiLock?: string[];
}
