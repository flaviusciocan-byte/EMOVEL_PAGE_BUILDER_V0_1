// PageContext — tracks which page file is currently open, and provides
// the save-to-disk operation. Lives above Puck so TopBar and PageListPanel
// can both access it via usePageContext().
//
// saveCurrent(data, title) is called by TopBar (which reads Puck state).
// setCurrentPage(slug, title) is called by PageListPanel after opening a file.

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Data } from '@puckeditor/core';
import { createPage, savePage } from './page-client';

interface PageContextValue {
  currentSlug: string | null;
  currentTitle: string;
  isSaving: boolean;
  savedAt: Date | null;
  saveError: string | null;
  setCurrentPage: (slug: string, title: string) => void;
  saveCurrent: (data: Data, title: string) => Promise<void>;
}

const PageContext = createContext<PageContextValue | null>(null);

export function usePageContext(): PageContextValue {
  const ctx = useContext(PageContext);
  if (!ctx) throw new Error('usePageContext must be used inside PageContextProvider');
  return ctx;
}

interface PageContextProviderProps {
  children: ReactNode;
}

export function PageContextProvider({ children }: PageContextProviderProps) {
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  function setCurrentPage(slug: string, title: string) {
    setCurrentSlug(slug || null);
    setCurrentTitle(title);
    setSavedAt(null);
    setSaveError(null);
  }

  async function saveCurrent(data: Data, title: string) {
    setSaveError(null);
    setIsSaving(true);
    try {
      let slug = currentSlug;
      if (!slug) {
        const page = await createPage(title, data);
        slug = page.slug;
        setCurrentSlug(slug);
        setCurrentTitle(page.title);
      } else {
        await savePage(slug, data, title);
        setCurrentTitle(title);
      }
      setSavedAt(new Date());
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <PageContext.Provider value={{ currentSlug, currentTitle, isSaving, savedAt, saveError, setCurrentPage, saveCurrent }}>
      {children}
    </PageContext.Provider>
  );
}
