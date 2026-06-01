import { Puck, legacySideBarPlugin } from '@puckeditor/core';
import type { Data } from '@puckeditor/core';
import { useRef } from 'react';
import '@puckeditor/core/puck.css';
import './shell/chrome.css';
import { config, initialData } from './builder/puck.config';
import { ThemeProvider, useTheme } from './builder/theme';
import { puckOverrides } from './shell/puck-overrides';
import { publishToZip } from './builder/publish';

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

  return (
    <Puck
      config={config}
      data={savedData}
      plugins={[legacySideBar]}
      overrides={puckOverrides}
      onAction={(_, newState) => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newState.data));
        } catch {
          // Storage full or unavailable — fail silently
        }
      }}
      onPublish={(data) => {
        // publishToZip renders the page to static HTML, wraps it with the
        // active theme's CSS token definitions, and downloads a .zip.
        publishToZip(data, themeRef.current).catch((err) => {
          console.error('[EMOVEL] Publish failed:', err);
        });
      }}
    />
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
