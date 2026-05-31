import type { ReactNode } from 'react';
import { TopBar }             from './TopBar';
import { SidebarBrand }       from './SidebarBrand';
import { SectionLibraryDock } from './SectionLibraryDock';
import { InspectorShell }     from './InspectorShell';
import { AppShell }           from './AppShell';

// Total registered section count — keep in sync with puck.config.tsx components map.
const SECTION_COUNT = 18;

export const puckOverrides = {
  // Full-editor wrapper: 100vh layout + StatusBar + grain overlay.
  puck: ({ children }: { children: ReactNode }) => (
    <AppShell>{children}</AppShell>
  ),

  // Top bar: EMOVEL wordmark · PAGE BUILDER · collection selector · Export · Publish.
  header: ({ actions, children }: { actions: ReactNode; children: ReactNode }) => (
    <TopBar actions={actions} children={children} />
  ),

  // Left drawer: brand block + SECȚIUNI header + Puck's native draggable items.
  // children = Puck's drag handles — MUST remain in DOM for drag-to-canvas.
  drawer: ({ children }: { children: ReactNode }) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <SidebarBrand />
      <SectionLibraryDock sectionCount={SECTION_COUNT}>
        {children}
      </SectionLibraryDock>
    </div>
  ),

  // Right inspector: Content / Style / Theme tab strip above Puck's field UI.
  // children = Puck's native field inspector — shown under the Content tab.
  fields: ({ children }: { children: ReactNode }) => (
    <InspectorShell>{children}</InspectorShell>
  ),
} as const;
