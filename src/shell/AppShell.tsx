// AppShell — outermost editor wrapper. Applied via overrides.puck.
// Ensures 100vh height, contains Puck, mounts StatusBar at the bottom,
// and overlays the grain texture (purely decorative, pointer-events: none).

import type { ReactNode } from 'react';
import { StatusBar } from './StatusBar';

const GRAIN_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/></filter><rect width='120' height='120' filter='url(%23n)' opacity='1'/></svg>`;
const GRAIN_URL = `url("data:image/svg+xml,${GRAIN_SVG}")`;

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--shell-base)',
      }}
    >
      {/* Puck editor layout fills remaining space */}
      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {children}
      </div>

      {/* Status bar — pinned at the very bottom */}
      <StatusBar />

      {/* Grain overlay — decorative, no pointer events */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          pointerEvents: 'none',
          opacity: 0.022,
          mixBlendMode: 'overlay',
          backgroundImage: GRAIN_URL,
          backgroundRepeat: 'repeat',
          backgroundSize: '120px 120px',
        }}
      />
    </div>
  );
}
