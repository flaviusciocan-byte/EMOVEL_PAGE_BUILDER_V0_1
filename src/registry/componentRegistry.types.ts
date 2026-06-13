export type RegistryStatus = 'implemented' | 'notImplemented';

export type ComponentCategory =
  | 'hero'
  | 'trust'
  | 'features'
  | 'product'
  | 'pricing'
  | 'faq'
  | 'cta'
  | 'dashboard'
  | 'timeline'
  | 'showcase'
  | 'structure'
  | 'testimonials'
  | 'editorial'
  | 'lead';

export interface ComponentRegistryEntry {
  /** Official 1-based index from Registry v1.1 (01–10 for this batch). */
  registryIndex: number;
  /** Public name used in Registry v1.1 and in Page Schema. */
  registryName: string;
  /**
   * Path key identifying the implementation file (relative to src/).
   * null when status is notImplemented.
   */
  implementationKey: string | null;
  status: RegistryStatus;
  category: ComponentCategory;
  /** True when the component requires real uploaded assets to be usable. */
  requiresAssets: boolean;
  notes?: string;
}
