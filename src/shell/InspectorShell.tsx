// InspectorShell — inspector right panel with tab strip.
// Tabs: Content (Puck fields) · Generate (PromptPanel) · Theme · Pages.
// Active tab underline = electric blue.

import { useState, type ReactNode } from 'react';
import { ThemeSwitcher } from '../builder/theme';
import { PromptPanel } from './PromptPanel';
import { PageListPanel } from './PageListPanel';
import { ExportPanel } from './ExportPanel';

type Tab = 'content' | 'generate' | 'theme' | 'pages' | 'export';

const TABS: { id: Tab; label: string }[] = [
  { id: 'content',  label: 'Content'  },
  { id: 'generate', label: 'Generate' },
  { id: 'theme',    label: 'Theme'    },
  { id: 'pages',    label: 'Pages'    },
  { id: 'export',   label: 'Export'   },
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
          padding: 0 8px;
          border-bottom: 1px solid var(--shell-b1);
          flex-shrink: 0;
          background: var(--shell-s1);
          height: 40px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .emovel-insp__tabs::-webkit-scrollbar { display: none; }

        .emovel-insp__tab {
          display: inline-flex;
          align-items: center;
          padding: 0 7px 8px;
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
          flex-shrink: 0;
        }

        .emovel-insp__tab:hover {
          color: var(--shell-text2);
          background: rgba(255,255,255,0.025);
          border-radius: 4px 4px 0 0;
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
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--shell-mono);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--shell-text2);
          margin: 0 0 14px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--shell-b1);
        }

        .emovel-insp__theme-lbl::before {
          content: "";
          width: 4px;
          height: 4px;
          background: var(--shell-blue);
          border-radius: 50%;
          flex-shrink: 0;
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
        {active === 'content'  && children}
        {active === 'generate' && <PromptPanel />}
        {active === 'theme'    && (
          <div className="emovel-insp__theme">
            <p className="emovel-insp__theme-lbl">Visual collection</p>
            <ThemeSwitcher />
          </div>
        )}
        {active === 'pages'  && <PageListPanel />}
        {active === 'export' && <ExportPanel />}
      </div>
    </div>
  );
}
