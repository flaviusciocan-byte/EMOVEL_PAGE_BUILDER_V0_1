// SectionLibraryDock — scrollable container for the section list.
// children = Puck's native draggable items (MUST stay in DOM for drag-to-canvas).
// Icon styling and hover/selection colour are applied via chrome.css on Puck's
// _DrawerItem-draggable_ elements so drag handles are never disrupted.

import type { ReactNode } from 'react';

interface SectionLibraryDockProps {
  children: ReactNode;
  sectionCount?: number;
}

export function SectionLibraryDock({ children, sectionCount }: SectionLibraryDockProps) {
  return (
    <div className="emovel-dock">
      <style>{`
        .emovel-dock {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow: hidden;
          min-height: 0;
        }

        /* Count badge row — right-aligned, tiny */
        .emovel-dock__meta {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0 14px 6px;
          flex-shrink: 0;
        }

        .emovel-dock__count {
          font-family: var(--shell-mono);
          font-size: 8px;
          font-weight: 500;
          letter-spacing: 0.1em;
          color: var(--shell-text3);
        }

        /* Scrollable Puck list */
        .emovel-dock__list {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 0 6px 10px;
          scrollbar-width: thin;
          scrollbar-color: var(--shell-b2) transparent;
        }

        .emovel-dock__list::-webkit-scrollbar {
          width: 4px;
        }

        .emovel-dock__list::-webkit-scrollbar-thumb {
          background: var(--shell-b2);
          border-radius: 999px;
        }
      `}</style>

      {sectionCount != null && (
        <div className="emovel-dock__meta">
          <span className="emovel-dock__count">{sectionCount} total</span>
        </div>
      )}

      {/* Puck's draggable items — must remain in DOM */}
      <div className="emovel-dock__list">
        {children}
      </div>
    </div>
  );
}
