// Page Schema — the AI-native contract between the Composer and Puck.
// AI produces a PageSchema. The Validation Gate checks it.
// pageSchemaToPuckData() converts it to Puck Data for the canvas.
// AI never writes JSX directly.

import type { Universe, Surface, Motion, Spacing } from '../registry/shared';

/** Props that every registry component may carry in a Page Schema. */
export interface PageSchemaSharedProps {
  universe?: Universe;
  surface?:  Surface;
  motion?:   Motion;
  spacing?:  Spacing;
  anchorId?: string;
  aiLock?:   string[];
}

/**
 * One section in a Page Schema.
 * registryName uses the official Registry v1.1 name (e.g. HeroSection, GalleryShowcase).
 * props carries shared props plus any component-specific props.
 */
export interface PageSchemaComponent {
  registryName: string;
  props: PageSchemaSharedProps & Record<string, unknown>;
}

/** Full Page Schema produced by the Composer and consumed by the Validation Gate. */
export interface PageSchema {
  registryVersion: string;
  title:           string;
  components:      PageSchemaComponent[];
}

/** Result returned by validatePageSchema(). */
export interface PageSchemaValidationResult {
  valid:  boolean;
  errors: string[];
}
