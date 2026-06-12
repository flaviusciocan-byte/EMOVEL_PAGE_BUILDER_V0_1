// Shared Layer — declared once at registry level.
// No component re-declares these props.

/** Page-level color universe. Inherited by all components; palette cannot be overridden directly. */
export type Universe = 'noir' | 'ivory' | 'nordic' | 'terra' | 'mono';

/** Section background treatment. Implemented via SectionSurface. Default: base. */
export type Surface = 'base' | 'elevated' | 'inverted' | 'cinematic';

/**
 * Animation level.
 * Builder canvas always renders static regardless of this value.
 * Export renders the full declared motion.
 * Default: subtle.
 */
export type Motion = 'none' | 'subtle' | 'cinematic';

/** Internal padding scale. Maps to the existing token spacing system. Default: standard. */
export type Spacing = 'compact' | 'standard' | 'generous';

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
