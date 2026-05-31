// InspectorShell — inspector right panel with tab strip.
// Tabs: Content (Puck fields) · Style (placeholder) · Theme (ThemeSwitcher).
// Active tab underline = electric blue.

import { useState, type ReactNode } from 'react';
import { ThemeSwitcher } from '../builder/theme';

type Tab = 'content' | 'style' | 'theme';

const TABS: { id: Tab; label: string }[] = [
  { id: 'content', label: 'Content' },
  { id: 'style',   label: 'Style'   },
  { id: 'theme',   label: 'Theme'   },
];

interface InspectorShellProps {
  children: ReactNode; // Puck's native field inspector — shown under Content tab
}

export function InspectorShell({ children }: InspectorShellProps) {
  const [active, setActive] = useState<Tab>('content');

  return (
    <div className="emovel-insp">
      <style>{`
        .emovel-insp {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
          background: var(--shell-s1);
        }

        /* Tab strip */
        .emovel-insp__tabs {
          display: flex;
          align-items: flex-end;
          padding: 0 12px;
          border-bottom: 1px solid var(--shell-b1);
          flex-shrink: 0;
          background: var(--shell-s1);
          height: 40px;
        }

        .emovel-insp__tab {
          display: inline-flex;
          align-items: center;
          padding: 0 8px 8px;
          height: 100%;
          font-family: var(--shell-mono);
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--shell-text3);
          cursor: pointer;
          border: none;
          background: none;
          border-bottom: 1.5px solid transparent;
          margin-bottom: -1px;
          transition: color 120ms ease, border-color 120ms ease;
          white-space: nowrap;
          user-select: none;
        }

        .emovel-insp__tab:hover {
          color: var(--shell-text2);
        }

        .emovel-insp__tab--active {
          color: var(--shell-blue);
          border-bottom-color: var(--shell-blue);
        }

        /* Panel body */
        .emovel-insp__body {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: thin;
          scrollbar-color: var(--shell-b2) transparent;
        }

        .emovel-insp__body::-webkit-scrollbar { width: 4px; }
        .emovel-insp__body::-webkit-scrollbar-thumb {
          background: var(--shell-b2);
          border-radius: 999px;
        }

        /* Theme panel */
        .emovel-insp__theme {
          padding: 16px 14px;
        }

        .emovel-insp__theme-lbl {
          font-family: var(--shell-mono);
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--shell-text3);
          margin: 0 0 12px;
        }

        /* Style placeholder */
        .emovel-insp__placeholder {
          padding: 32px 16px;
          text-align: center;
          color: var(--shell-text3);
          font-family: var(--shell-mono);
          font-size: 9px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          line-height: 2;
        }
      `}</style>

      {/* Tab strip */}
      <div className="emovel-insp__tabs" role="tablist" aria-label="Inspector panels">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            className={`emovel-insp__tab${active === tab.id ? ' emovel-insp__tab--active' : ''}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panel body */}
      <div
        className="emovel-insp__body"
        role="tabpanel"
        aria-label={`${active} panel`}
      >
        {active === 'content' && children}

        {active === 'style' && (
          <div className="emovel-insp__placeholder">
            Style overrides<br />Phase 6
          </div>
        )}

        {active === 'theme' && (
          <div className="emovel-insp__theme">
            <p className="emovel-insp__theme-lbl">Visual collection</p>
            <ThemeSwitcher />
          </div>
        )}
      </div>
    </div>
  );
}
