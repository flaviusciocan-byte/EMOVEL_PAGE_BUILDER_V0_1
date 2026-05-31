import { useState, useRef } from 'react';
import { usePuck } from '@puckeditor/core';
import type { Data } from '@puckeditor/core';

// ExportPanel — mounted inside Puck's component tree (via InspectorShell Export tab).
// Uses usePuck() to read current data and dispatch setData for import.

export function ExportPanel() {
  const { appState, dispatch } = usePuck();
  const [importText, setImportText]   = useState('');
  const [importError, setImportError] = useState('');
  const [copied, setCopied]           = useState(false);
  const [imported, setImported]       = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Access current page data via appState.data (AppState.data: Data)
  const data = (appState as { data: Data }).data;
  const jsonString = JSON.stringify(data, null, 2);

  function handleCopy() {
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = jsonString;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownload() {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'page.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport() {
    setImportError('');
    setImported(false);
    try {
      const parsed = JSON.parse(importText) as Data;
      if (!Array.isArray(parsed.content)) throw new Error('Invalid structure: missing content array');
      if (!parsed.root) throw new Error('Invalid structure: missing root');
      dispatch({ type: 'setData', data: parsed });
      setImportText('');
      setImported(true);
      setTimeout(() => setImported(false), 2500);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Could not parse JSON');
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (typeof text === 'string') {
        setImportText(text);
        setImportError('');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const S = {
    panel: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 0,
      fontFamily: '"Hanken Grotesk", Inter, sans-serif',
      fontSize: 12,
      color: '#ededed',
    },
    section: {
      padding: '14px 14px 12px',
      borderBottom: '1px solid #2a2a31',
    },
    sectionLabel: {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase' as const,
      color: '#9CA3AF',
      marginBottom: 10,
    },
    row: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap' as const,
    },
    btn: {
      flex: 1,
      minWidth: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6px 10px',
      borderRadius: 8,
      border: '1px solid #2a2a31',
      background: '#15151a',
      color: '#ededed',
      fontSize: 11,
      fontWeight: 600,
      cursor: 'pointer',
      whiteSpace: 'nowrap' as const,
      transition: 'background 120ms ease, border-color 120ms ease',
    },
    btnPrimary: {
      background: 'linear-gradient(135deg, #F3DFA2, #D4AF37)',
      border: '1px solid #D4AF37',
      color: '#080808',
      fontWeight: 700,
    },
    btnSuccess: {
      background: '#15251a',
      border: '1px solid #2a5a31',
      color: '#4ade80',
    },
    textarea: {
      width: '100%',
      minHeight: 80,
      padding: '8px 10px',
      borderRadius: 8,
      border: '1px solid #2a2a31',
      background: '#101015',
      color: '#ededed',
      fontFamily: '"Menlo", "Consolas", monospace',
      fontSize: 10,
      lineHeight: 1.5,
      resize: 'vertical' as const,
      outline: 'none',
      boxSizing: 'border-box' as const,
    },
    error: {
      marginTop: 6,
      padding: '5px 8px',
      borderRadius: 6,
      background: 'rgba(239,68,68,0.1)',
      border: '1px solid rgba(239,68,68,0.3)',
      color: '#f87171',
      fontSize: 11,
      lineHeight: 1.4,
    },
    successMsg: {
      marginTop: 6,
      padding: '5px 8px',
      borderRadius: 6,
      background: 'rgba(74,222,128,0.08)',
      border: '1px solid rgba(74,222,128,0.28)',
      color: '#4ade80',
      fontSize: 11,
    },
    jsonPreview: {
      display: 'block',
      width: '100%',
      maxHeight: 80,
      overflow: 'hidden',
      padding: '7px 9px',
      borderRadius: 8,
      background: '#101015',
      border: '1px solid #2a2a31',
      color: '#9CA3AF',
      fontFamily: '"Menlo", "Consolas", monospace',
      fontSize: 10,
      lineHeight: 1.5,
      whiteSpace: 'pre' as const,
      boxSizing: 'border-box' as const,
      marginBottom: 8,
    },
    stat: {
      fontSize: 10,
      color: '#9CA3AF',
      marginBottom: 8,
    },
  };

  return (
    <div style={S.panel}>
      {/* Export section */}
      <div style={S.section}>
        <p style={S.sectionLabel}>Export</p>
        <div style={S.stat}>
          {data.content.length} section{data.content.length !== 1 ? 's' : ''}
        </div>
        <pre style={S.jsonPreview}>{jsonString.slice(0, 280)}{jsonString.length > 280 ? '\n…' : ''}</pre>
        <div style={S.row}>
          <button
            type="button"
            style={{ ...S.btn, ...(copied ? S.btnSuccess : {}) }}
            onClick={handleCopy}
          >
            {copied ? '✓ Copied' : 'Copy JSON'}
          </button>
          <button
            type="button"
            style={{ ...S.btn, ...S.btnPrimary }}
            onClick={handleDownload}
          >
            Download .json
          </button>
        </div>
      </div>

      {/* Import section */}
      <div style={S.section}>
        <p style={S.sectionLabel}>Import</p>
        <textarea
          style={S.textarea}
          value={importText}
          onChange={(e) => { setImportText(e.target.value); setImportError(''); }}
          placeholder={'Paste exported JSON here…'}
          spellCheck={false}
          aria-label="Paste page JSON to import"
        />
        {importError ? (
          <div style={S.error}>{importError}</div>
        ) : null}
        {imported ? (
          <div style={S.successMsg}>✓ Page imported successfully</div>
        ) : null}
        <div style={{ ...S.row, marginTop: 8 }}>
          <button
            type="button"
            style={S.btn}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload .json
          </button>
          <button
            type="button"
            style={{ ...S.btn, ...(importText.trim() ? S.btnPrimary : { opacity: 0.45, cursor: 'default' }) }}
            onClick={handleImport}
            disabled={!importText.trim()}
          >
            Apply
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
          aria-label="Upload JSON file"
        />
      </div>
    </div>
  );
}
