import { useEffect, useRef } from 'react';
import { Puck, legacySideBarPlugin } from '@puckeditor/core';
import type { Data } from '@puckeditor/core';
import '@puckeditor/core/puck.css';
import './shell/chrome.css';
import { config, initialData } from './builder/puck.config';
import { ThemeProvider, useTheme, buildThemeCSSText } from './builder/theme';
import { puckOverrides } from './shell/puck-overrides';
import { publishToZip } from './builder/publish';
import { PageContextProvider } from './storage/PageContext';
import { BuilderModeContext } from './builder/BuilderModeContext';

const STORAGE_KEY = 'emovel-page-data';

function loadSavedData(): Data {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Data;
  } catch {
    // Invalid JSON — fall through to initial data
  }
  return initialData as Data;
}

const savedData = loadSavedData();
const legacySideBar = legacySideBarPlugin();

// AppInner is a child of ThemeProvider so it can call useTheme().
// This gives onPublish access to the current ThemeConfig for CSS generation.
function AppInner() {
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  // Inject theme CSS vars into Puck's canvas iframe on every theme change.
  // CSS custom properties do not cross document boundaries, so vars set on
  // the outer ThemeProvider div are invisible inside the iframe. We write a
  // <style id="emovel-theme"> tag directly into the iframe's <head> instead.
  useEffect(() => {
    const STYLE_ID = 'emovel-theme';

    function apply() {
      const iframe = document.querySelector<HTMLIFrameElement>('iframe');
      const doc = iframe?.contentDocument;
      if (!doc?.head) return;
      let el = doc.getElementById(STYLE_ID) as HTMLStyleElement | null;
      if (!el) {
        el = doc.createElement('style');
        el.id = STYLE_ID;
        doc.head.appendChild(el);
      }
      el.textContent = buildThemeCSSText(theme);
    }

    apply();
    // Re-apply when the iframe reloads (Puck resets the iframe on data changes)
    document.addEventListener('load', apply, true);
    return () => document.removeEventListener('load', apply, true);
  }, [theme]);

  return (
    <BuilderModeContext.Provider value={true}>
      <Puck
        config={config}
        data={savedData}
        plugins={[legacySideBar]}
        overrides={puckOverrides}
        onAction={(_, newState) => {
          // localStorage = fast autosave buffer. The authoritative copy is the file on disk
          // (saved explicitly via the Save button in TopBar / PageListPanel).
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState.data));
          } catch {
            // Storage full or unavailable — fail silently
          }
        }}
        onPublish={(data) => {
          // onPublish = ZIP static export. Saving to disk uses the Save button in TopBar.
          publishToZip(data, themeRef.current).catch((err) => {
            console.error('[EMOVEL] Publish failed:', err);
          });
        }}
      />
    </BuilderModeContext.Provider>
  );
}

export function App() {
  return (
    <PageContextProvider>
      <ThemeProvider>
        <AppInner />
      </ThemeProvider>
    </PageContextProvider>
  );
}
