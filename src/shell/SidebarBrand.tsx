// SidebarBrand — brand identity block at the top of the left drawer.
// Shows wordmark + "SECȚIUNI" mono label (section library title).
// Gold is reserved for the wordmark only (brand rule).

export function SidebarBrand() {
  return (
    <div className="emovel-sb">
      <style>{`
        .emovel-sb {
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }

        /* Brand row */
        .emovel-sb__brand {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 48px;
          padding: 0 14px;
          border-bottom: 1px solid var(--shell-b1);
        }

        .emovel-sb__wordmark {
          font-family: "Clash Display", "Cinzel", serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 3px;
          color: var(--shell-gold);
          user-select: none;
          white-space: nowrap;
        }

        .emovel-sb__version {
          font-family: var(--shell-mono);
          font-size: 8px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--shell-text3);
        }

        /* Section library header row */
        .emovel-sb__lib-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px 9px;
          border-bottom: 1px solid var(--shell-b1);
        }

        .emovel-sb__lib-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--shell-mono);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--shell-text2);
        }

        .emovel-sb__lib-title::before {
          content: "";
          width: 4px;
          height: 4px;
          background: var(--shell-blue);
          border-radius: 50%;
          flex-shrink: 0;
        }
      `}</style>

      {/* Brand row */}
      <div className="emovel-sb__brand">
        <span className="emovel-sb__wordmark">EMOVEL</span>
        <span className="emovel-sb__version">v0.1</span>
      </div>

      {/* Section library header */}
      <div className="emovel-sb__lib-header">
        <span className="emovel-sb__lib-title">Secțiuni</span>
      </div>
    </div>
  );
}
