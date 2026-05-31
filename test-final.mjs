/**
 * Final targeted test: drag all 5 to canvas → select Offer Section by clicking it in canvas
 * → verify fields → click Publish → capture JSON.
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:5174';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.setViewportSize({ width: 1440, height: 900 });

// Intercept console.log BEFORE page load
await page.addInitScript(() => {
  window.__publishData = null;
  const orig = console.log.bind(console);
  console.log = function (...args) {
    orig(...args);
    try {
      const str = args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
      if (str.includes('Page structure:')) {
        window.__publishData = str.slice(str.indexOf('{'));
      }
    } catch (_) {}
  };
});

const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', err => errors.push('PAGE_ERROR: ' + err.message));

await page.goto(BASE, { waitUntil: 'networkidle' });

// Helper: drag drawer item to canvas center
async function dragToCanvas(sectionName) {
  const items = page.locator('[class*="DrawerItem"]').filter({ hasText: sectionName });
  let src = null;
  const count = await items.count();
  for (let j = 0; j < count; j++) {
    const el = items.nth(j);
    const box = await el.boundingBox().catch(() => null);
    if (box && box.x < 280) { src = el; break; }
  }
  if (!src) {
    // Broader: any element in drawer area
    const allText = page.getByText(sectionName, { exact: true });
    const cnt = await allText.count();
    for (let j = 0; j < cnt; j++) {
      const el = allText.nth(j);
      const box = await el.boundingBox().catch(() => null);
      if (box && box.x < 280) { src = el; break; }
    }
  }
  if (!src) return false;
  const srcBox = await src.boundingBox().catch(() => null);
  if (!srcBox) return false;

  const sx = srcBox.x + srcBox.width / 2;
  const sy = srcBox.y + srcBox.height / 2;
  const tx = 700, ty = 500;

  await page.mouse.move(sx, sy);
  await page.mouse.down();
  await page.waitForTimeout(200);
  // Slow drag to trigger dnd
  const STEPS = 30;
  for (let i = 1; i <= STEPS; i++) {
    await page.mouse.move(sx + (tx - sx) * i / STEPS, sy + (ty - sy) * i / STEPS);
    await page.waitForTimeout(10);
  }
  await page.mouse.up();
  await page.waitForTimeout(500);
  return true;
}

// Drag all 5 sections
const SECTIONS = ['Hero', 'Product Grid', 'Offer Section', 'Screenshot Gallery', 'CTA Section'];
const dragResults = {};
for (const s of SECTIONS) {
  dragResults[s] = await dragToCanvas(s);
}
await page.waitForTimeout(500);
console.log('DRAG_RESULTS:', JSON.stringify(dragResults));

// Confirm all in outline
const outlineText = await page.evaluate(() => {
  const leftPanel = document.querySelector('[class*="SideBar--left"], [class*="left"]');
  return leftPanel?.innerText || document.body.innerText.slice(0, 800);
});
const sectionsInOutline = SECTIONS.map(s => ({ s, inOutline: outlineText.includes(s) }));
console.log('SECTIONS_IN_OUTLINE:', JSON.stringify(sectionsInOutline));

await page.screenshot({ path: 'screenshot-A-canvas.png' });

// ── Select Offer Section by clicking its canvas render ───────────────────
// The Offer Section renders a unique title "A clear offer, no noise"
// Find that text on the canvas and click it
const offerTitle = page.getByText('A clear offer, no noise').first();
const offerTitleVisible = await offerTitle.isVisible().catch(() => false);
if (offerTitleVisible) {
  await offerTitle.click();
  await page.waitForTimeout(400);
} else {
  // Scroll canvas to find it
  const canvasArea = page.locator('[class*="Puck-frame"], [class*="canvas"]').first();
  await canvasArea.evaluate(el => el.scrollTop += 500).catch(() => {});
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(300);
  const offerTitleAfterScroll = page.getByText('A clear offer, no noise').first();
  await offerTitleAfterScroll.click().catch(() => {});
  await page.waitForTimeout(400);
}
await page.screenshot({ path: 'screenshot-B-offer-selected.png' });

// Read Offer Section fields from right sidebar
const offerFieldsData = await page.evaluate(() => {
  const panel = document.querySelector('[class*="Fields"], form');
  if (!panel) return null;
  const inputs = Array.from(panel.querySelectorAll('input, textarea'));
  return {
    panelText: panel.innerText?.slice(0, 300),
    fields: inputs.map(el => ({ name: el.name || el.id || '', value: el.value?.slice(0, 80) })).filter(f => f.value),
  };
});
console.log('OFFER_FIELDS_DATA:', JSON.stringify(offerFieldsData));

// ── Field edit: change a visible field in the Offer Section ──────────────
// Find the title field (should be "A clear offer, no noise")
const titleInput = page.locator('input[value="A clear offer, no noise"]').first();
const titleVisible = await titleInput.isVisible().catch(() => false);
let liveEditResult = 'NOT_TESTED';
if (titleVisible) {
  await titleInput.fill('A clear offer — Phase 4 edited');
  await page.waitForTimeout(600);
  const canvasText = await page.evaluate(() =>
    document.querySelector('[class*="Puck-frame"], [class*="canvas"]')?.innerText || document.body.innerText
  );
  liveEditResult = canvasText.includes('Phase 4 edited') ? 'CONFIRMED' : 'NOT_IN_CANVAS';
  console.log('LIVE_EDIT:', liveEditResult);
  await page.screenshot({ path: 'screenshot-C-live-edit.png' });
  // Revert
  await titleInput.fill('A clear offer, no noise');
  await page.waitForTimeout(200);
} else {
  console.log('LIVE_EDIT: title input not visible (offer section may not be selected)');
}

// ── Publish ───────────────────────────────────────────────────────────────
const publishBtn = page.locator('button').filter({ hasText: /publish/i }).first();
const pubVisible = await publishBtn.isVisible().catch(() => false);
console.log('PUBLISH_BTN_VISIBLE:', pubVisible);
if (pubVisible) {
  await publishBtn.click();
  await page.waitForTimeout(2000);
}

const raw = await page.evaluate(() => window.__publishData);
console.log('PUBLISH_CAPTURED:', raw !== null);

if (raw) {
  const data = JSON.parse(raw);
  const types = (data.content || []).map(c => c.type);
  console.log('EXPORTED_SECTION_TYPES:', JSON.stringify(types));
  console.log('EXPORTED_SECTION_COUNT:', types.length);

  const offerComp = (data.content || []).find(c => c.type === 'Offer Section');
  if (offerComp) {
    const ben = offerComp.props?.benefits;
    console.log('BENEFITS_IN_EXPORT:', JSON.stringify(ben?.slice(0, 2)));
    console.log('BENEFITS_ALL_STRINGS:', ben?.every(b => typeof b === 'string'));
  }
  console.log('EXPORT_SNIPPET:', JSON.stringify(data).slice(0, 500));
}

await page.screenshot({ path: 'screenshot-D-final.png' });
console.log('CONSOLE_ERRORS_FINAL:', JSON.stringify(errors));

await browser.close();
