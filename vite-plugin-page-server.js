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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
var PAGES_DIR = path.resolve(process.cwd(), 'pages');
var TRASH_DIR = path.join(PAGES_DIR, '.trash');
function ensureDirs() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.mkdir(PAGES_DIR, { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fs.mkdir(TRASH_DIR, { recursive: true })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function slugToFile(slug) {
    return path.join(PAGES_DIR, "".concat(slug, ".page.json"));
}
function safeSlug(raw) {
    return (raw
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || 'page');
}
function uniqueSlug(base) {
    return __awaiter(this, void 0, void 0, function () {
        var slug, n;
        return __generator(this, function (_a) {
            slug = base;
            n = 0;
            while (fsSync.existsSync(slugToFile(slug))) {
                n++;
                slug = "".concat(base, "-").concat(n);
            }
            return [2 /*return*/, slug];
        });
    });
}
function readBody(req) {
    return new Promise(function (resolve, reject) {
        var chunks = [];
        req.on('data', function (c) { return chunks.push(c); });
        req.on('end', function () { return resolve(Buffer.concat(chunks).toString('utf-8')); });
        req.on('error', reject);
    });
}
function readPageFile(file) {
    return __awaiter(this, void 0, void 0, function () {
        var content, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.readFile(file, 'utf-8')];
                case 1:
                    content = _b.sent();
                    return [2 /*return*/, JSON.parse(content)];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function json(res, status, body) {
    var text = JSON.stringify(body);
    res.writeHead(status, {
        'Content-Type': 'application/json',
        'Content-Length': String(Buffer.byteLength(text)),
        'Access-Control-Allow-Origin': '*',
    });
    res.end(text);
}
function handleRequest(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var rawPath, parts, method, files, pageFiles, pages, result, slug, page, body, _a, _b, title, slug, now, page, slug, body, _c, _d, existing, now, page, slug, file, existing, body, _e, _f, updated, slug, file, trashFile, slug, existing, body, _g, _h, newTitle, newSlug, now, page, err_1;
        var _this = this;
        var _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        return __generator(this, function (_w) {
            switch (_w.label) {
                case 0:
                    rawPath = (_j = req.url) !== null && _j !== void 0 ? _j : '/';
                    parts = rawPath.replace(/^\/+/, '').split('/').filter(Boolean);
                    method = (_k = req.method) !== null && _k !== void 0 ? _k : 'GET';
                    if (method === 'OPTIONS') {
                        res.writeHead(204, {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
                            'Access-Control-Allow-Headers': 'Content-Type',
                        });
                        res.end();
                        return [2 /*return*/];
                    }
                    _w.label = 1;
                case 1:
                    _w.trys.push([1, 26, , 27]);
                    if (!(method === 'GET' && parts.length === 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, fs.readdir(PAGES_DIR)];
                case 2:
                    files = _w.sent();
                    pageFiles = files.filter(function (f) { return f.endsWith('.page.json'); });
                    return [4 /*yield*/, Promise.all(pageFiles.map(function (f) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, readPageFile(path.join(PAGES_DIR, f))];
                        }); }); }))];
                case 3:
                    pages = _w.sent();
                    result = pages
                        .filter(function (p) { return p !== null; })
                        .map(function (_a) {
                        var slug = _a.slug, title = _a.title, createdAt = _a.createdAt, modifiedAt = _a.modifiedAt, version = _a.version;
                        return ({
                            slug: slug,
                            title: title,
                            createdAt: createdAt,
                            modifiedAt: modifiedAt,
                            version: version,
                        });
                    })
                        .sort(function (a, b) { return b.modifiedAt.localeCompare(a.modifiedAt); });
                    json(res, 200, result);
                    return [2 /*return*/];
                case 4:
                    if (!(method === 'GET' && parts.length >= 1)) return [3 /*break*/, 6];
                    slug = safeSlug(parts[0]);
                    return [4 /*yield*/, readPageFile(slugToFile(slug))];
                case 5:
                    page = _w.sent();
                    if (!page) {
                        json(res, 404, { error: 'Not found' });
                        return [2 /*return*/];
                    }
                    json(res, 200, page);
                    return [2 /*return*/];
                case 6:
                    if (!(method === 'POST' && parts.length === 0)) return [3 /*break*/, 10];
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, readBody(req)];
                case 7:
                    body = _b.apply(_a, [_w.sent()]);
                    title = String((_l = body.title) !== null && _l !== void 0 ? _l : 'Untitled Page');
                    return [4 /*yield*/, uniqueSlug(safeSlug(String((_m = body.slug) !== null && _m !== void 0 ? _m : title)))];
                case 8:
                    slug = _w.sent();
                    now = new Date().toISOString();
                    page = {
                        version: 1,
                        title: title,
                        slug: slug,
                        createdAt: now,
                        modifiedAt: now,
                        content: (_o = body.content) !== null && _o !== void 0 ? _o : { root: { props: { title: title } }, content: [] },
                    };
                    return [4 /*yield*/, fs.writeFile(slugToFile(slug), JSON.stringify(page, null, 2), 'utf-8')];
                case 9:
                    _w.sent();
                    json(res, 201, page);
                    return [2 /*return*/];
                case 10:
                    if (!(method === 'PUT' && parts.length >= 1)) return [3 /*break*/, 14];
                    slug = safeSlug(parts[0]);
                    _d = (_c = JSON).parse;
                    return [4 /*yield*/, readBody(req)];
                case 11:
                    body = _d.apply(_c, [_w.sent()]);
                    return [4 /*yield*/, readPageFile(slugToFile(slug))];
                case 12:
                    existing = _w.sent();
                    now = new Date().toISOString();
                    page = __assign(__assign({ version: 1 }, (existing !== null && existing !== void 0 ? existing : {})), { slug: slug, title: String((_q = (_p = body.title) !== null && _p !== void 0 ? _p : existing === null || existing === void 0 ? void 0 : existing.title) !== null && _q !== void 0 ? _q : 'Untitled Page'), createdAt: (_r = existing === null || existing === void 0 ? void 0 : existing.createdAt) !== null && _r !== void 0 ? _r : now, modifiedAt: now, content: (_t = (_s = body.content) !== null && _s !== void 0 ? _s : existing === null || existing === void 0 ? void 0 : existing.content) !== null && _t !== void 0 ? _t : { root: { props: { title: slug } }, content: [] } });
                    return [4 /*yield*/, fs.writeFile(slugToFile(slug), JSON.stringify(page, null, 2), 'utf-8')];
                case 13:
                    _w.sent();
                    json(res, 200, page);
                    return [2 /*return*/];
                case 14:
                    if (!(method === 'PATCH' && parts.length >= 1)) return [3 /*break*/, 18];
                    slug = safeSlug(parts[0]);
                    file = slugToFile(slug);
                    return [4 /*yield*/, readPageFile(file)];
                case 15:
                    existing = _w.sent();
                    if (!existing) {
                        json(res, 404, { error: 'Not found' });
                        return [2 /*return*/];
                    }
                    _f = (_e = JSON).parse;
                    return [4 /*yield*/, readBody(req)];
                case 16:
                    body = _f.apply(_e, [_w.sent()]);
                    updated = __assign(__assign({}, existing), { title: String((_u = body.title) !== null && _u !== void 0 ? _u : existing.title), modifiedAt: new Date().toISOString() });
                    return [4 /*yield*/, fs.writeFile(file, JSON.stringify(updated, null, 2), 'utf-8')];
                case 17:
                    _w.sent();
                    json(res, 200, updated);
                    return [2 /*return*/];
                case 18:
                    if (!(method === 'DELETE' && parts.length >= 1)) return [3 /*break*/, 20];
                    slug = safeSlug(parts[0]);
                    file = slugToFile(slug);
                    if (!fsSync.existsSync(file)) {
                        json(res, 404, { error: 'Not found' });
                        return [2 /*return*/];
                    }
                    trashFile = path.join(TRASH_DIR, "".concat(slug, "-").concat(Date.now(), ".page.json"));
                    return [4 /*yield*/, fs.rename(file, trashFile)];
                case 19:
                    _w.sent();
                    json(res, 200, { ok: true });
                    return [2 /*return*/];
                case 20:
                    if (!(method === 'POST' && parts.length >= 2 && parts[1] === 'duplicate')) return [3 /*break*/, 25];
                    slug = safeSlug(parts[0]);
                    return [4 /*yield*/, readPageFile(slugToFile(slug))];
                case 21:
                    existing = _w.sent();
                    if (!existing) {
                        json(res, 404, { error: 'Not found' });
                        return [2 /*return*/];
                    }
                    _h = (_g = JSON).parse;
                    return [4 /*yield*/, readBody(req)];
                case 22:
                    body = _h.apply(_g, [_w.sent()]);
                    newTitle = String((_v = body.title) !== null && _v !== void 0 ? _v : "".concat(existing.title, " Copy"));
                    return [4 /*yield*/, uniqueSlug(safeSlug(newTitle))];
                case 23:
                    newSlug = _w.sent();
                    now = new Date().toISOString();
                    page = __assign(__assign({}, existing), { title: newTitle, slug: newSlug, createdAt: now, modifiedAt: now });
                    return [4 /*yield*/, fs.writeFile(slugToFile(newSlug), JSON.stringify(page, null, 2), 'utf-8')];
                case 24:
                    _w.sent();
                    json(res, 201, page);
                    return [2 /*return*/];
                case 25:
                    next();
                    return [3 /*break*/, 27];
                case 26:
                    err_1 = _w.sent();
                    console.error('[Page Server Error]', err_1);
                    json(res, 500, { error: 'Internal server error' });
                    return [3 /*break*/, 27];
                case 27: return [2 /*return*/];
            }
        });
    });
}
export function pageServerPlugin() {
    var initialized = false;
    return {
        name: 'emovel-page-server',
        configureServer: function (server) {
            if (!initialized) {
                void ensureDirs().catch(function (err) { return console.error('[Page Server] Failed to init dirs:', err); });
                initialized = true;
            }
            server.middlewares.use('/api/pages', function (req, res, next) {
                void handleRequest(req, res, next).catch(function (err) {
                    console.error('[Page Server] Request handler error:', err);
                    json(res, 500, { error: 'Internal server error' });
                });
            });
        },
    };
}
