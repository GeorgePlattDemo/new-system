#!/usr/bin/env node
// Real Chromium smoke of the published, nested five-project application.
// The Store is a separate local service at System's pinned revision; no mocks,
// alternate quote paths or fixture prices are inserted into the browser.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.STB_BROWSER_BASE || 'http://127.0.0.1:8080';
const expectedPin = 'f7123a73c1ca60aa7eb180a86a1c365eaffe95db';
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
let failed = false;
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const responses = [];
  page.on('response', r => {
    if (r.url().includes('/api/store-zero/')) responses.push({ path: new URL(r.url()).pathname, status: r.status() });
  });
  const entry = await page.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  assert.equal(entry.status(), 200, 'public route should load');
  await page.waitForFunction(() => Boolean(document.getElementById('stb-current')?.contentWindow?.document
    ?.getElementById('stb-current')?.contentWindow?.document?.querySelector('#projects')), { timeout: 30000 });
  const content = page.frameLocator('iframe#stb-current').frameLocator('iframe#stb-current');
  await content.locator('#projects').waitFor({ state: 'attached', timeout: 30000 });
  // Exercise the actual published tile buttons. The unmodified shell remains
  // responsible for routing their Idea/Intent/Bench experiences.
  const tiles = [
    ['Start Your Own', '[data-start-own-artifact="three-frames.html"]'],
    ['Alcove', '[data-go="alcove-capture"]'],
    ['Window Seat', '[data-window-seat-artifact="stb-window-seat-0.9.html"]'],
    ['Outdoor', '[data-outdoor-build-artifact="stb-outdoor-picnic-0.4.html"]']
  ];
  for (const [index, [label, destination]] of tiles.entries()) {
    if (index) await page.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    // Actual reader route: opening door -> New User -> Later -> project library.
    await content.locator('#landing button[data-go="new-user"]').click({ timeout: 15000 });
    await content.locator('#new-user button[data-canonical-go="projects"]').click({ timeout: 15000 });
    const tile = content.locator('#projects button.tile' + destination);
    try {
      await tile.waitFor({ state: 'visible', timeout: 12000 });
    } catch (error) {
      const details = await content.locator('body').evaluate(() => ({
        current: [...document.querySelectorAll('.page.on')].map(p => p.id),
        projectsDisplay: getComputedStyle(document.querySelector('#projects')).display,
        hash: location.hash
      }));
      throw new Error(label + ': library did not open: ' + JSON.stringify(details) + '\\n' + error);
    }
    await tile.click();
    const on = await content.locator('.page.on').count();
    assert.ok(on > 0, label + ': tile click left no visible page');
    if (label === 'Start Your Own') {
      const bench = content.frameLocator('iframe#start-own-proof-frame');
      await bench.locator('#stb-intent-next').click({ timeout: 15000 });
      await bench.locator('#stb-start-bench-screen').waitFor({ state: 'visible', timeout: 15000 });
      // Both values must be from live Store replies, never from test fixtures.
      await bench.locator('#stb-price-total').filter({ hasText: '$8.62' })
        .waitFor({ state: 'visible', timeout: 30000 });
      await bench.locator('button[data-length="18"]').click();
      await bench.locator('#stb-price-total').filter({ hasText: '$9.13' })
        .waitFor({ state: 'visible', timeout: 30000 });
      assert.ok(responses.some(r => r.path === '/api/store-zero/job' && r.status === 200),
        'Project 1 knob change did not reach the live pinned Store');
      console.log(JSON.stringify({ project: label, initialQ: 8.62, changedLengthIn: 18, revisedQ: 9.13, liveStore: true }));
    }
    console.log(JSON.stringify({ project: label, clicked: destination, visiblePage: true }));
  }
  // Playhouse is authored in the published System shell rather than the four
  // original project-library tiles. Check that its actual page exists.
  const playhouse = content.locator('#playhouse-intent, #playhouse-idea, #playhouse-record');
  await playhouse.first().waitFor({ state: 'attached', timeout: 10000 });
  console.log(JSON.stringify({ project: 'Playhouse', mounted: true }));
  const config = await page.evaluate(async () => {
    const r = await fetch('/live/stb-store-runtime.json', { cache: 'no-store' });
    if (!r.ok) throw new Error('Published Store config failed: ' + r.status);
    return r.json();
  });
  assert.equal(config.storePin, expectedPin, 'published Store release drifted');
  assert.equal(config.jobEndpoint, 'same-origin:/api/store-zero/job');
  assert.equal(config.offeringEndpoint, 'same-origin:/api/store-zero/offering');
  assert.ok(responses.every(r => r.status < 500), JSON.stringify(responses));
  console.log(JSON.stringify({ fiveProjectsMounted: true, storePin: config.storePin, storeResponses: responses }));
  await page.close();
} catch (error) {
  failed = true;
  console.error(error?.stack || String(error));
} finally {
  await browser.close();
}
if (failed) process.exitCode = 1;
