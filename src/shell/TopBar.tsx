// TopBar — top bar of the editor. Mounted via overrides.header.
// Contains: EMOVEL wordmark · PAGE BUILDER label · collection selector · Save · Publish.
// Gold is used ONLY for the EMOVEL wordmark and the Publish button (via chrome.css
// [class*="_Button--primary_"] rule). Nothing else here uses gold.

import { useState, type ReactNode } from 'react';
import { usePuck } from '@puckeditor/core';
import type { Data } from '@puckeditor/core';
import { useTheme } from '../builder/theme';
import { themes } from '../builder/themes';
import { usePageContext } from '../storage/PageContext';

interface TopBarProps {
  actions: ReactNode;  // Puck's native header actions (Publish / Save buttons)
  children: ReactNode;
}

// Abbreviated theme label for the collection selector chip.
function shortLabel(label: string): string {
  return label.split(' ').slice(0, 2).join(' ').toUpperCase();
}

export function TopBar({ actions }: TopBarProps) {
  const { themeId, setTheme } = useTheme();
  const { appState } = usePuck();
  const { isSaving, savedAt, saveError, saveCurrent } = usePageContext();
  const [collectionOpen, setCollectionOpen] = useState(false);

  const currentTheme = themes[themeId];

  async function handleSave() {
    const data = (appState as { data: Data }).data;
    const title =
      (data.root as { props?: { title?: string } })?.props?.title ?? 'Untitled Page';
    await saveCurrent(data, title);
  }

  function saveLabel(): string {
    if (isSaving) return 'Saving…';
    if (saveError) return 'Error';
    if (savedAt) {
      const h = savedAt.getHours().toString().padStart(2, '0');
      const m = savedAt.getMinutes().toString().padStart(2, '0');
      return `Saved ${h}:${m}`;
    }
    return 'Save';
  }

  return (
    <header className="emovel-topbar">
      <style>{`
        .emovel-topbar {
          display: flex;
          align-items: center;
          height: 48px;
          padding: 0 16px;
          background: var(--shell-s1);
          border-bottom: 1px solid var(--shell-b1);
          gap: 0;
          box-sizing: border-box;
          font-family: "Satoshi", system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          flex-shrink: 0;
          position: relative;
          z-index: 10;
        }

        /* Wordmark: gold = brand rule applies here */
        .emovel-topbar__wordmark {
          font-family: "Clash Display", "Cinzel", serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 3px;
          color: var(--shell-gold);
          user-select: none;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .emovel-topbar__sep-v {
          width: 1px;
          height: 16px;
          background: var(--shell-b2);
          flex-shrink: 0;
          margin: 0 12px;
        }

        .emovel-topbar__label {
          font-family: var(--shell-mono);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--shell-text2);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .emovel-topbar__spacer {
          flex: 1;
        }

        /* Collection selector */
        .emovel-topbar__collection {
          position: relative;
          flex-shrink: 0;
        }

        .emovel-topbar__collection-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          background: transparent;
          border: 1px solid var(--shell-b2);
          border-radius: 4px;
          color: var(--shell-text2);
          font-family: var(--shell-mono);
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          white-space: nowrap;
          transition: border-color 120ms ease, color 120ms ease;
        }

        .emovel-topbar__collection-btn:hover {
          border-color: var(--shell-b3);
          color: var(--shell-text);
        }

        .emovel-topbar__collection-btn:active {
          transform: scale(0.97);
        }

        .emovel-topbar__collection-chevron {
          font-size: 8px;
          opacity: 0.7;
        }

        .emovel-topbar__collection-drop {
          position: absolute;
          top: calc(100% + 4px);
          right: 0;
          z-index: 200;
          background: var(--shell-s1);
          border: 1px solid var(--shell-b2);
          border-radius: 6px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.55);
          overflow: hidden;
          min-width: 180px;
        }

        .emovel-topbar__collection-item {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 8px 12px;
          background: transparent;
          border: none;
          color: var(--shell-text2);
          font-family: var(--shell-mono);
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          text-align: left;
          transition: background 100ms ease, color 100ms ease;
        }

        .emovel-topbar__collection-item:hover {
          background: var(--shell-blue-fill);
          color: var(--shell-text);
        }

        .emovel-topbar__collection-item--active {
          color: var(--shell-blue);
        }

        .emovel-topbar__collection-swatch {
          display: flex;
          width: 24px;
          height: 14px;
          border-radius: 3px;
          overflow: hidden;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.06);
        }

        /* Save button */
        .emovel-topbar__save-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          background: transparent;
          border: 1px solid var(--shell-b2);
          border-radius: 4px;
          color: var(--shell-text2);
          font-family: var(--shell-mono);
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          white-space: nowrap;
          margin-right: 6px;
          transition: border-color 120ms ease, color 120ms ease;
          min-width: 68px;
          justify-content: center;
        }

        .emovel-topbar__save-btn:hover {
          border-color: var(--shell-b3);
          color: var(--shell-text);
        }

        .emovel-topbar__save-btn:active {
          transform: scale(0.97);
        }

        .emovel-topbar__save-btn--saved {
          border-color: #D4AF37;
          color: #D4AF37;
        }

        .emovel-topbar__save-btn--error {
          border-color: #f87171;
          color: #f87171;
        }

        /* Puck native actions area (Publish button is styled gold via chrome.css) */
        .emovel-topbar__actions {
          display: flex;
          align-items: center;
          margin-left: 6px;
        }
      `}</style>

      {/* EMOVEL wordmark — gold per brand rule */}
      <span className="emovel-topbar__wordmark">EMOVEL</span>

      {/* Separator */}
      <div className="emovel-topbar__sep-v" />

      {/* PAGE BUILDER label — monospace, small */}
      <span className="emovel-topbar__label">Page Builder</span>

      {/* Push right */}
      <div className="emovel-topbar__spacer" />

      {/* Collection selector */}
      <div className="emovel-topbar__collection">
        <button
          type="button"
          className="emovel-topbar__collection-btn"
          onClick={() => setCollectionOpen(!collectionOpen)}
          aria-haspopup="listbox"
          aria-expanded={collectionOpen}
        >
          {shortLabel(currentTheme?.label ?? 'EMOVEL')}
          <span className="emovel-topbar__collection-chevron">▾</span>
        </button>

        {collectionOpen && (
          <div className="emovel-topbar__collection-drop" role="listbox">
            {Object.values(themes).map((t) => (
              <button
                key={t.id}
                type="button"
                role="option"
                aria-selected={t.id === themeId}
                className={`emovel-topbar__collection-item${t.id === themeId ? ' emovel-topbar__collection-item--active' : ''}`}
                onClick={() => { setTheme(t.id); setCollectionOpen(false); }}
              >
                <span className="emovel-topbar__collection-swatch">
                  {t.swatches.map((c, i) => (
                    <span key={i} style={{ flex: 1, background: c }} />
                  ))}
                </span>
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Separator */}
      <div style={{ width: 1, height: 16, background: 'var(--shell-b2)', margin: '0 10px', flexShrink: 0 }} />

      {/* Save button — writes page to pages/<slug>.page.json */}
      <button
        type="button"
        className={`emovel-topbar__save-btn${savedAt && !isSaving ? ' emovel-topbar__save-btn--saved' : ''}${saveError ? ' emovel-topbar__save-btn--error' : ''}`}
        onClick={() => { void handleSave(); }}
        disabled={isSaving}
        title={saveError ?? 'Save page to disk (pages/ folder)'}
      >
        {saveLabel()}
      </button>

      {/* Puck native actions — Publish button styled via chrome.css [class*="_Button--primary_"] */}
      <div className="emovel-topbar__actions">
        {actions}
      </div>
    </header>
  );
}
