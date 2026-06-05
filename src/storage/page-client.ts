// page-client.ts — client-side API for the page file storage server.
// All functions call the /api/pages endpoints served by vite-plugin-page-server.ts.
// If the dev server is not running (build preview, production), calls reject with a
// network error — callers are expected to catch and fall back to localStorage.

import type { Data } from '@puckeditor/core';

export interface PageFileMeta {
  slug: string;
  title: string;
  createdAt: string;
  modifiedAt: string;
  version: number;
}

export interface PageFile extends PageFileMeta {
  content: Data;
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/pages${path}`, init);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText })) as { error?: string };
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function listPages(): Promise<PageFileMeta[]> {
  return call<PageFileMeta[]>('');
}

export function loadPage(slug: string): Promise<PageFile> {
  return call<PageFile>(`/${slug}`);
}

export function savePage(slug: string, data: Data, title: string): Promise<PageFile> {
  return call<PageFile>(`/${slug}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: data, title }),
  });
}

export function createPage(title: string, data?: Data): Promise<PageFile> {
  return call<PageFile>('', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content: data }),
  });
}

export function deletePage(slug: string): Promise<void> {
  return call<void>(`/${slug}`, { method: 'DELETE' });
}

export function duplicatePage(slug: string, title: string): Promise<PageFile> {
  return call<PageFile>(`/${slug}/duplicate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
}

export function renamePage(slug: string, title: string): Promise<PageFile> {
  return call<PageFile>(`/${slug}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
}
