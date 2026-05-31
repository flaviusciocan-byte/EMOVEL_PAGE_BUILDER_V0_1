// StatusBar — bottom bar of the editor.
// Left: "● SALVAT AUTOMAT" (gold dot, monospace).
// Right: "N SECȚIUNI · DESKTOP" (monospace).
// Gold dot is the only gold element here — part of the save-state indicator (brand-adjacent).

import { usePuck } from '@puckeditor/core';
import type { Data } from '@puckeditor/core';

export function StatusBar() {
  // usePuck() works here because StatusBar renders inside AppShell which is
  // the overrides.puck wrapper — mounted inside Puck's AppStoreProvider context.
  const { appState } = usePuck();
  const data   = (appState as { data: Data }).data;
  const count  = data?.content?.length ?? 0;

  return (
    <div className="emovel-statusbar">
      <style>{`
        .emovel-statusbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 26px;
          padding: 0 14px;
          background: var(--shell-s1);
          border-top: 1px solid var(--shell-b1);
          flex-shrink: 0;
        }

        .emovel-statusbar__left,
        .emovel-statusbar__right {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--shell-mono);
          font-size: 8px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--shell-text3);
          white-space: nowrap;
        }

        /* Gold dot — save indicator (design spec: punt auriu) */
        .emovel-statusbar__dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--shell-gold);
          flex-shrink: 0;
          box-shadow: 0 0 4px color-mix(in srgb, var(--shell-gold) 50%, transparent);
        }

        .emovel-statusbar__sep {
          color: var(--shell-b3);
        }
      `}</style>

      <div className="emovel-statusbar__left">
        <span className="emovel-statusbar__dot" aria-hidden="true" />
        Salvat automat
      </div>

      <div className="emovel-statusbar__right">
        <span>{count} secțiuni</span>
        <span className="emovel-statusbar__sep">·</span>
        <span>Desktop</span>
      </div>
    </div>
  );
}
