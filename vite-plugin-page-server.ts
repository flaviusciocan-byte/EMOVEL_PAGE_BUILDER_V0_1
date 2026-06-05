// vite-plugin-page-server.ts
// Dev-only Vite plugin that exposes a REST API for reading/writing page files.
// Endpoint prefix: /api/pages
//   GET    /api/pages              → list all saved pages (metadata only)
//   GET    /api/pages/:slug        → load a full page file
//   POST   /api/pages              → create a new page (body: {title, content?})
//   PUT    /api/pages/:slug        → save / update a page (body: {title?, content})
//   PATCH  /api/pages/:slug        → rename only (body: {title})
//   DELETE /api/pages/:slug        → move to pages/.trash/
//   POST   /api/pages/:slug/duplicate → duplicate (body: {title?})
//
// Files live at: pages/<slug>.page.json
// Trash lives at: pages/.trash/<slug>-<ts>.page.json
// Only active in `npm run dev`; the build output is a static SPA that does not use this server.

import type { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';

const PAGES_DIR = path.resolve(process.cwd(), 'pages');
const TRASH_DIR = path.join(PAGES_DIR, '.trash');

interface PageRecord {
  version: number;
  title: string;
  slug: string;
  createdAt: string;
  modifiedAt: string;
  content: unknown;
}

function ensureDirs(): void {
  fs.mkdirSync(PAGES_DIR, { recursive: true });
  fs.mkdirSync(TRASH_DIR, { recursive: true });
}

function slugToFile(slug: string): string {
  return path.join(PAGES_DIR, `${slug}.page.json`);
}

function safeSlug(raw: string): string {
  return (
    raw
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'page'
  );
}

function uniqueSlug(base: string): string {
  let slug = base;
  let n = 0;
  while (fs.existsSync(slugToFile(slug))) {
    n++;
    slug = `${base}-${n}`;
  }
  return slug;
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    req.on('error', reject);
  });
}

function readPageFile(file: string): PageRecord | null {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as PageRecord;
  } catch {
    return null;
  }
}

function json(res: ServerResponse, status: number, body: unknown): void {
  const text = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': String(Buffer.byteLength(text)),
    'Access-Control-Allow-Origin': '*',
  });
  res.end(text);
}

type NextFn = (err?: unknown) => void;

async function handleRequest(
  req: IncomingMessage,
  res: ServerResponse,
  next: NextFn,
): Promise<void> {
  const rawPath = req.url ?? '/';
  const parts = rawPath.replace(/^\/+/, '').split('/').filter(Boolean);
  const method = req.method ?? 'GET';

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  // GET /api/pages — list all pages (metadata only, sorted newest first)
  if (method === 'GET' && parts.length === 0) {
    const files = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.page.json'));
    const pages = files
      .map(f => readPageFile(path.join(PAGES_DIR, f)))
      .filter((p): p is PageRecord => p !== null)
      .map(({ slug, title, createdAt, modifiedAt, version }) => ({
        slug, title, createdAt, modifiedAt, version,
      }))
      .sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));
    json(res, 200, pages);
    return;
  }

  // GET /api/pages/:slug — load full page
  if (method === 'GET' && parts.length >= 1) {
    const slug = safeSlug(parts[0]);
    const page = readPageFile(slugToFile(slug));
    if (!page) { json(res, 404, { error: 'Not found' }); return; }
    json(res, 200, page);
    return;
  }

  // POST /api/pages — create new page
  if (method === 'POST' && parts.length === 0) {
    const body = JSON.parse(await readBody(req)) as { title?: string; slug?: string; content?: unknown };
    const title = String(body.title ?? 'Untitled Page');
    const slug = uniqueSlug(safeSlug(String(body.slug ?? title)));
    const now = new Date().toISOString();
    const page: PageRecord = {
      version: 1,
      title,
      slug,
      createdAt: now,
      modifiedAt: now,
      content: body.content ?? { root: { props: { title } }, content: [] },
    };
    fs.writeFileSync(slugToFile(slug), JSON.stringify(page, null, 2), 'utf-8');
    json(res, 201, page);
    return;
  }

  // PUT /api/pages/:slug — save / update page
  if (method === 'PUT' && parts.length >= 1) {
    const slug = safeSlug(parts[0]);
    const body = JSON.parse(await readBody(req)) as { title?: string; content?: unknown };
    const existing = readPageFile(slugToFile(slug));
    const now = new Date().toISOString();
    const page: PageRecord = {
      version: 1,
      ...(existing ?? {}),
      slug,
      title: String(body.title ?? existing?.title ?? 'Untitled Page'),
      createdAt: existing?.createdAt ?? now,
      modifiedAt: now,
      content: body.content ?? existing?.content ?? { root: { props: { title: slug } }, content: [] },
    };
    fs.writeFileSync(slugToFile(slug), JSON.stringify(page, null, 2), 'utf-8');
    json(res, 200, page);
    return;
  }

  // PATCH /api/pages/:slug — rename only
  if (method === 'PATCH' && parts.length >= 1) {
    const slug = safeSlug(parts[0]);
    const file = slugToFile(slug);
    const existing = readPageFile(file);
    if (!existing) { json(res, 404, { error: 'Not found' }); return; }
    const body = JSON.parse(await readBody(req)) as { title?: string };
    const updated: PageRecord = {
      ...existing,
      title: String(body.title ?? existing.title),
      modifiedAt: new Date().toISOString(),
    };
    fs.writeFileSync(file, JSON.stringify(updated, null, 2), 'utf-8');
    json(res, 200, updated);
    return;
  }

  // DELETE /api/pages/:slug — move to trash (never hard-deletes)
  if (method === 'DELETE' && parts.length >= 1) {
    const slug = safeSlug(parts[0]);
    const file = slugToFile(slug);
    if (!fs.existsSync(file)) { json(res, 404, { error: 'Not found' }); return; }
    const trashFile = path.join(TRASH_DIR, `${slug}-${Date.now()}.page.json`);
    fs.renameSync(file, trashFile);
    json(res, 200, { ok: true });
    return;
  }

  // POST /api/pages/:slug/duplicate
  if (method === 'POST' && parts.length >= 2 && parts[1] === 'duplicate') {
    const slug = safeSlug(parts[0]);
    const existing = readPageFile(slugToFile(slug));
    if (!existing) { json(res, 404, { error: 'Not found' }); return; }
    const body = JSON.parse(await readBody(req)) as { title?: string };
    const newTitle = String(body.title ?? `${existing.title} Copy`);
    const newSlug = uniqueSlug(safeSlug(newTitle));
    const now = new Date().toISOString();
    const page: PageRecord = { ...existing, title: newTitle, slug: newSlug, createdAt: now, modifiedAt: now };
    fs.writeFileSync(slugToFile(newSlug), JSON.stringify(page, null, 2), 'utf-8');
    json(res, 201, page);
    return;
  }

  next();
}

export function pageServerPlugin(): Plugin {
  return {
    name: 'emovel-page-server',
    configureServer(server) {
      ensureDirs();
      server.middlewares.use('/api/pages', (req: IncomingMessage, res: ServerResponse, next: NextFn) => {
        void handleRequest(req, res, next);
      });
    },
  };
}
