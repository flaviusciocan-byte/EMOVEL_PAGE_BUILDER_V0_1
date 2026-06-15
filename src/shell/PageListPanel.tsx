// PageListPanel — shown in the Inspector "Pages" tab.
// Lists all pages/  *.page.json files, allows open / new / duplicate / rename / delete.
// Requires the Vite dev server (vite-plugin-page-server) to be running.
// Falls back gracefully when the server is not available (build preview / production).

import { useState, useEffect, useRef } from 'react';
import { usePuck } from '@puckeditor/core';
import type { Data } from '@puckeditor/core';
import {
  listPages,
  loadPage,
  createPage,
  deletePage,
  duplicatePage,
  renamePage,
  type PageFileMeta,
} from '../storage/page-client';
import { usePageContext } from '../storage/PageContext';

function fmt(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

export function PageListPanel() {
  const { dispatch, appState } = usePuck();
  const { currentSlug, setCurrentPage, saveCurrent } = usePageContext();
  const [pages, setPages] = useState<PageFileMeta[]>([]);
  const [offline, setOffline] = useState(false);
  const [status, setStatus] = useState('');
  const [renamingSlug, setRenamingSlug] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const renameRef = useRef<HTMLInputElement>(null);

  useEffect(() => { void refresh(); }, []);

  useEffect(() => {
    if (renamingSlug && renameRef.current) renameRef.current.focus();
  }, [renamingSlug]);

  async function refresh() {
    try {
      const list = await listPages();
      setPages(list);
      setOffline(false);
    } catch {
      setOffline(true);
    }
  }

  async function handleOpen(slug: string, title: string) {
    try {
      const pageFile = await loadPage(slug);
      dispatch({ type: 'setData', data: pageFile.content as Data });
      setCurrentPage(slug, title);
      setStatus(`Opened "${title}"`);
    } catch {
      setStatus('Failed to load page');
    }
  }

  async function handleNew() {
    const blank: Data = { root: { props: { title: 'New Page' } }, content: [] } as Data;
    try {
      const page = await createPage('New Page', blank);
      dispatch({ type: 'setData', data: page.content as Data });
      setCurrentPage(page.slug, page.title);
      await refresh();
      setStatus(`Created "${page.title}"`);
    } catch {
      // Server not running — just clear Puck canvas
      dispatch({ type: 'setData', data: blank });
      setCurrentPage('', 'New Page');
      setStatus('New page (save when server is running)');
    }
  }

  async function handleSaveCurrent() {
    const data = (appState as { data: Data }).data;
    const title = (data.root as { props?: { title?: string } })?.props?.title ?? 'Untitled Page';
    await saveCurrent(data, title);
    await refresh();
    setStatus('Saved');
  }

  async function handleDuplicate(slug: string, title: string) {
    try {
      const page = await duplicatePage(slug, `${title} Copy`);
      await refresh();
      setStatus(`Duplicated → "${page.title}"`);
    } catch {
      setStatus('Failed to duplicate');
    }
  }

  function startRename(slug: string, title: string) {
    setRenamingSlug(slug);
    setRenameValue(title);
  }

  async function commitRename(slug: string) {
    const newTitle = renameValue.trim();
    if (!newTitle) { setRenamingSlug(null); return; }
    try {
      await renamePage(slug, newTitle);
      setRenamingSlug(null);
      await refresh();
    } catch {
      setStatus('Rename failed');
      setRenamingSlug(null);
    }
  }

  async function handleDelete(slug: string, title: string) {
    if (!confirm(`Move "${title}" to trash? (recoverable from pages/.trash/)`)) return;
    try {
      await deletePage(slug);
      if (currentSlug === slug) setCurrentPage('', '');
      await refresh();
      setStatus(`Moved "${title}" to trash`);
    } catch {
      setStatus('Failed to delete');
    }
  }

  const S = {
    wrap: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 0,
      fontFamily: '"Satoshi", system-ui, sans-serif',
    },
    toolbar: {
      display: 'flex',
      gap: 6,
      padding: '10px 12px 8px',
      borderBottom: '1px solid var(--shell-b1)',
      flexShrink: 0 as const,
    },
    btn: {
      flex: 1,
      minHeight: 28,
      padding: '0 8px',
      border: '1px solid var(--shell-b2)',
      borderRadius: 5,
      background: 'transparent',
      color: 'var(--shell-text2)',
      fontFamily: 'var(--shell-mono)',
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase' as const,
      cursor: 'pointer',
      whiteSpace: 'nowrap' as const,
    },
    btnGold: {
      borderColor: '#D4AF37',
      background: 'linear-gradient(135deg, #D4AF37 0%, #b8931a 100%)',
      color: '#080808',
    },
    list: {
      overflowY: 'auto' as const,
      flex: 1,
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      gap: 0,
      padding: '8px 12px',
      borderBottom: '1px solid var(--shell-b1)',
      cursor: 'pointer' as const,
    },
    rowActive: {
      background: 'rgba(92,200,255,0.06)',
    },
    meta: {
      flex: 1,
      minWidth: 0,
    },
    title: {
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--shell-text)',
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    date: {
      fontSize: 9,
      color: 'var(--shell-text3)',
      fontFamily: 'var(--shell-mono)',
      marginTop: 2,
    },
    actions: {
      display: 'flex',
      gap: 3,
      flexShrink: 0 as const,
      opacity: 0,
    },
    icon: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 22,
      height: 22,
      border: '1px solid var(--shell-b2)',
      borderRadius: 4,
      background: 'transparent',
      color: 'var(--shell-text3)',
      fontSize: 11,
      cursor: 'pointer' as const,
      padding: 0,
    },
    renameInput: {
      flex: 1,
      height: 22,
      padding: '0 6px',
      border: '1px solid var(--shell-blue)',
      borderRadius: 4,
      background: '#101015',
      color: 'var(--shell-text)',
      fontSize: 11,
      fontFamily: '"Satoshi", system-ui, sans-serif',
      outline: 'none',
    },
    offline: {
      padding: '16px 12px',
      color: 'var(--shell-text3)',
      fontFamily: 'var(--shell-mono)',
      fontSize: 9,
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
      lineHeight: 1.7,
    },
    status: {
      padding: '6px 12px',
      fontSize: 10,
      color: 'var(--shell-text3)',
      fontFamily: 'var(--shell-mono)',
      borderTop: '1px solid var(--shell-b1)',
      minHeight: 24,
    },
  };

  if (offline) {
    return (
      <div style={S.wrap}>
        <div style={S.offline}>
          Save server not running.<br />
          Pages use browser storage only.<br />
          Run <strong style={{ color: 'var(--shell-text2)' }}>npm run dev</strong> to enable file saves.
        </div>
        {status && <div style={S.status}>{status}</div>}
      </div>
    );
  }

  return (
    <div style={S.wrap}>
      <style>{`
        .epages-row:hover .epages-actions { opacity: 1 !important; }
        .epages-row:hover { background: rgba(255,255,255,0.025); }
      `}</style>

      {/* Toolbar */}
      <div style={S.toolbar}>
        <button type="button" style={{ ...S.btn, ...S.btnGold }} onClick={handleNew}>
          + New
        </button>
        <button type="button" style={S.btn} onClick={handleSaveCurrent}>
          Save
        </button>
        <button type="button" style={S.btn} onClick={refresh}>
          ↺
        </button>
      </div>

      {/* Page list */}
      <div style={S.list}>
        {pages.length === 0 && (
          <div style={{ ...S.offline, paddingTop: 20 }}>
            No saved pages yet.<br />
            Click <strong style={{ color: 'var(--shell-text2)' }}>+ New</strong> or <strong style={{ color: 'var(--shell-text2)' }}>Save</strong> to create one.
          </div>
        )}

        {pages.map(p => (
          <div
            key={p.slug}
            className="epages-row"
            style={{ ...S.row, ...(p.slug === currentSlug ? S.rowActive : {}) }}
          >
            {renamingSlug === p.slug ? (
              <>
                <input
                  ref={renameRef}
                  style={S.renameInput}
                  value={renameValue}
                  onChange={e => setRenameValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') void commitRename(p.slug);
                    if (e.key === 'Escape') setRenamingSlug(null);
                  }}
                  onBlur={() => void commitRename(p.slug)}
                />
              </>
            ) : (
              <>
                <div style={S.meta} onClick={() => void handleOpen(p.slug, p.title)}>
                  <div style={{ ...S.title, ...(p.slug === currentSlug ? { color: 'var(--shell-blue)' } : {}) }}>
                    {p.slug === currentSlug && <span style={{ marginRight: 4, fontSize: 8 }}>●</span>}
                    {p.title}
                  </div>
                  <div style={S.date}>{fmt(p.modifiedAt)}</div>
                </div>
                <div className="epages-actions" style={S.actions}>
                  <button
                    type="button"
                    style={S.icon}
                    title="Rename"
                    onClick={e => { e.stopPropagation(); startRename(p.slug, p.title); }}
                  >✎</button>
                  <button
                    type="button"
                    style={S.icon}
                    title="Duplicate"
                    onClick={e => { e.stopPropagation(); void handleDuplicate(p.slug, p.title); }}
                  >⧉</button>
                  <button
                    type="button"
                    style={{ ...S.icon, color: '#f87171' }}
                    title="Move to trash"
                    onClick={e => { e.stopPropagation(); void handleDelete(p.slug, p.title); }}
                  >✕</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {status && <div style={S.status}>{status}</div>}
    </div>
  );
}
