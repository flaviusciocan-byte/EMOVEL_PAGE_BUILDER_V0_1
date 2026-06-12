import type { SharedRegistryProps, Surface, Motion, Spacing } from './shared';

export interface ResolvedSharedProps {
  universe: SharedRegistryProps['universe'];
  surface: Surface;
  motion: Motion;
  spacing: Spacing;
  anchorId: string;
  aiLock: string[];
}

export function resolveSharedProps(props: SharedRegistryProps): ResolvedSharedProps {
  return {
    universe: props.universe,
    surface:  props.surface  ?? 'base',
    motion:   props.motion   ?? 'subtle',
    spacing:  props.spacing  ?? 'standard',
    anchorId: props.anchorId ?? generateAnchorId(),
    aiLock:   props.aiLock   ?? [],
  };
}

function generateAnchorId(): string {
  return `section-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
