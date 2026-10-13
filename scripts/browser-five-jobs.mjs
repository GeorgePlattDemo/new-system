#!/usr/bin/env node
// Real Chromium smoke of the published, nested five-project application.
// The Store is a separate local service at System's pinned revision; no mocks,
// alternate quote paths or fixture prices are inserted into the browser.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.STB_BROWSER_BASE || 'http://127.0.0.1:8080';
const expectedPin = 'e3d203d1ff297ea096e2a6b2ea97b85a78b13cc2';
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
let failed = false;
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const responses = [];
  const evaluations = [], responseReads = [];
  const configRequests = [];
  let extendedSeatConfigReads = 0;
  page.on('request', r => {
    if (new URL(r.url()).pathname === '/live/stb-store-runtime.json') configRequests.push(r.url());
  });
  page.on('response', r => {
    if (r.url().includes('/api/store-zero/')) responses.push({ path: new URL(r.url()).pathname, status: r.status() });
    if (new URL(r.url()).pathname === '/api/store-zero/job') responseReads.push(r.json().then(body=>evaluations.push(body)));
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
    ['Outdoor', '[data-outdoor-build-artifact="stb-outdoor-picnic-0.4.html"]'],
    ['Playhouse', '[data-go="window-parts"]']
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
    const activePages = await content.locator('.page.on').evaluateAll(nodes => nodes.map(n => n.id));
    assert.ok(activePages.length > 0, label + ': tile click left no visible page');
    assert.ok(!activePages.includes('projects'), label + ': tile click stayed on Project Library');
    if (label === 'Playhouse') {
      assert.ok(activePages.some(id => id.startsWith('playhouse-')),
        'Playhouse click did not open its project: ' + JSON.stringify(activePages));
    }
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
    if (label === 'Alcove') {
      // The Alcove project tile opens its unnumbered Idea page first.
      if (await content.locator('#alcove-idea').isVisible()) {
        await content.locator('#alcove-idea button[data-go="alcove-capture"]').first().click();
      }
      await content.locator('#alcove-capture').waitFor({ state: 'visible', timeout: 15000 });
      await content.locator('#alcove-capture button[data-go="alcove-config"]').first().click();
      const price = content.locator('#alcove-bench-store-price');
      await price.filter({ hasText: /\$[0-9]+/ }).waitFor({ state: 'visible', timeout: 45000 });
      const pine = (await price.innerText()).trim();
      const before = responses.filter(r => r.path === '/api/store-zero/job' && r.status === 200).length;
      await content.locator('#alcove-config button[data-material="poplar"]').click();
      await price.filter({ hasNotText: pine }).waitFor({ state: 'visible', timeout: 45000 });
      await price.filter({ hasText: /\$[0-9]+/ }).waitFor({ state: 'visible', timeout: 45000 });
      const poplar = (await price.innerText()).trim();
      assert.notEqual(poplar, pine, 'Changing Alcove species failed to update the visible Store Q');
      const after = responses.filter(r => r.path === '/api/store-zero/job' && r.status === 200).length;
      assert.ok(after > before, 'Alcove species change did not receive a new Store answer');
      console.log(JSON.stringify({ project: label, pine, poplar, freshStoreAnswer: true }));
    }
    if (label === 'Window Seat') {
      const seat = content.frameLocator('iframe#window-seat-frame');
      const before = responses.filter(r => r.path === '/api/store-zero/job' && r.status === 200).length;
      await seat.locator('#s-hero button[data-to="intent"]').click({ timeout: 15000 });
      await seat.locator('#s-intent .forward-heading button[data-to="bench"]').click({ timeout: 15000 });
      const money = seat.locator('#bench-money');
      await money.filter({ hasText: /\$[0-9]+/ }).waitFor({ state: 'visible', timeout: 45000 });
      const quote = (await money.innerText()).trim();
      assert.ok(responses.filter(r => r.path === '/api/store-zero/job' && r.status === 200).length > before,
        'Window Seat Bench displayed no fresh Store response');
      const currentAnswer = async () => {
        await Promise.all(responseReads);
        const revision=await seat.locator('body').evaluate(()=>window.STBWindowSeat.request().configurationVersion);
        return evaluations.filter(body=>body.projectId==='window-seat'&&body.candidateRevisionId===revision).at(-1);
      };
      const waitAnswer = async () => {
        await money.filter({hasText:'STORE ZERO',hasNotText:'UPDATING'}).waitFor({state:'visible',timeout:45000});
        return currentAnswer();
      };
      const pine = await currentAnswer();
      assert.equal(pine.rawEvaluation.status,'SUPPORTABLE');
      const configReadsBeforeSpeciesChecks=configRequests.length;
      await seat.locator('#bench-species [data-material="poplar"]').click();
      const poplar = await waitAnswer();
      assert.equal(poplar.rawEvaluation.status,'SUPPORTABLE','Poplar mixed-length stock must complete the published job');
      assert.equal(poplar.rawEvaluation.manifestCoverage.boardPartIds.length,48);
      assert.ok(poplar.mappedCallInputs.demand.cutPackages.every(p=>p.material.species==='poplar'));
      assert.notEqual(poplar.evaluationReceipt.receiptHash,pine.evaluationReceipt.receiptHash);
      assert.notEqual(poplar.evaluationReceipt.demandHash,pine.evaluationReceipt.demandHash);
      const poplarPrice=(await money.innerText()).trim();
      assert.ok(poplarPrice.includes(new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(poplar.rawEvaluation.Q)));
      await seat.locator('#bench-species [data-material="oak"]').click();
      const shortage = await waitAnswer();
      assert.equal(shortage.rawEvaluation.status,'UNAVAILABLE');
      assert.ok(shortage.rawEvaluation.reasonCodes.includes('ON_HAND_SHORT'));
      assert.equal(shortage.rawEvaluation.Q,null);
      assert.equal(shortage.rawEvaluation.stockShortage.requiredParts,12);
      assert.equal(shortage.rawEvaluation.stockShortage.availablePartCapacity,8);
      assert.ok((await money.innerText()).includes('ON_HAND_SHORT'),'The Store shortage must be visible at the Bench');
      await seat.locator('#btn-ask').click();
      assert.ok((await seat.locator('#store-panel').innerText()).includes('ON_HAND_SHORT'));
      assert.ok(!(await seat.locator('#store-panel').innerText()).includes('0 line(s) not supportable'));
      assert.ok((await seat.locator('#audit-text').textContent()).includes('ON_HAND_SHORT'));
      const refused = await seat.locator('body').evaluate(()=>window.STBWindowSeat.state());
      assert.equal(refused.terms.callOpen,false);
      assert.ok(refused.terms.reasons.some(r=>r.code==='ON_HAND_SHORT'));
      await seat.locator('#s-store button[data-to="bench"]').click();
      await seat.locator('#v-H').fill('70');
      await seat.locator('#v-H').press('Enter');
      await waitAnswer();
      await seat.locator('#v-wC').fill('30');
      await seat.locator('#v-wC').press('Enter');
      await waitAnswer();
      await seat.locator('#v-shL').fill('1');
      await seat.locator('#v-shL').press('Enter');
      await waitAnswer();
      await seat.locator('#v-shR').fill('1');
      await seat.locator('#v-shR').press('Enter');
      const oak = await waitAnswer();
      assert.equal(oak.rawEvaluation.status,'SUPPORTABLE','A stocked oak job must use the same milling model: '+JSON.stringify(oak.rawEvaluation.reasonCodes));
      assert.ok(oak.rawEvaluation.operations.some(e=>e.category==='MILL'&&e.seconds>0));
      assert.ok(oak.mappedCallInputs.demand.cutPackages.every(p=>p.material.species==='oak'));
      assert.notEqual(oak.evaluationReceipt.receiptHash,shortage.evaluationReceipt.receiptHash);
      await seat.locator('#bench-species [data-material="cherry"]').click();
      const missing = await waitAnswer();
      assert.ok(missing.rawEvaluation.reasonCodes.includes('NO_MATCHING_BOARD_OFFERING'));
      assert.equal(missing.rawEvaluation.Q,null);
      assert.ok((await money.innerText()).includes('NO_MATCHING_BOARD_OFFERING'));
      extendedSeatConfigReads=configRequests.length-configReadsBeforeSpeciesChecks;
      console.log(JSON.stringify({project:label,benchPrice:quote,poplar:poplarPrice,oakStockShortageVisible:true,
        oakMillingQ:oak.rawEvaluation.Q,missingStockRefusalVisible:true,freshStoreAnswer:true}));
    }
    if (label === 'Outdoor') {
      const outdoor = content.frameLocator('iframe#outdoor-bench-leg-frame');
      const before = responses.filter(r => r.path === '/api/store-zero/job' && r.status === 200).length;
      await outdoor.locator('#idea-next').click({ timeout: 15000 });
      await outdoor.locator('#s-intent [data-to-bench]').click({ timeout: 15000 });
      const money = outdoor.locator('#outdoor-definition-price');
      await money.filter({ hasText: /\$[0-9]+/ }).waitFor({ state: 'visible', timeout: 45000 });
      const quote = (await money.innerText()).trim();
      assert.ok(responses.filter(r => r.path === '/api/store-zero/job' && r.status === 200).length > before,
        'Outdoor Bench displayed no fresh Store response');
      console.log(JSON.stringify({ project: label, benchPrice: quote, liveStore: true }));
    }
    if (label === 'Playhouse') {
      const before = responses.filter(r => r.path === '/api/store-zero/job' && r.status === 200).length;
      await content.locator('#playhouse-idea button[data-canonical-go="playhouse-s001"]').click({ timeout: 15000 });
      await content.locator('#playhouse-s001').waitFor({ state: 'visible', timeout: 15000 });
      await content.locator('#ph-to-bench').click({ timeout: 15000 });
      await content.locator('#playhouse-machine').waitFor({ state: 'visible', timeout: 15000 });
      await content.locator('#playhouse-machine button[data-canonical-go="playhouse-store"]').click({ timeout: 15000 });
      const quote = content.locator('#s001-live-q');
      await quote.filter({ hasText: /\$[0-9]+/ }).waitFor({ state: 'visible', timeout: 45000 });
      assert.ok(responses.filter(r => r.path === '/api/store-zero/job' && r.status === 200).length > before,
        'Playhouse sheet definition received no current Store answer');
      console.log(JSON.stringify({ project: label, benchPrice: (await quote.innerText()).trim(), liveStore: true }));
    }
    console.log(JSON.stringify({ project: label, clicked: destination, visiblePage: true }));
  }

  const config = await page.evaluate(async () => {
    const r = await fetch('/live/stb-store-runtime.json', { cache: 'no-store' });
    if (!r.ok) throw new Error('Published Store config failed: ' + r.status);
    return r.json();
  });
  assert.equal(config.storePin, expectedPin, 'published Store release drifted');
  assert.equal(config.jobEndpoint, 'same-origin:/api/store-zero/job');
  assert.equal(config.offeringEndpoint, 'same-origin:/api/store-zero/offering');
  assert.ok(responses.every(r => r.status < 500), JSON.stringify(responses));
  // Keep the original five-project navigation allowance. The extended species
  // and geometry inquiries may legitimately cross the client's five-second
  // configuration expiry; count those extra reads separately.
  assert.ok(configRequests.length-extendedSeatConfigReads <= 12,
    'Repeated runtime config fetches remain excessive: ' + configRequests.length);
  console.log(JSON.stringify({ fiveProjectsMounted: true, storePin: config.storePin,
    configRequests: configRequests.length, extendedSeatConfigReads, storeResponses: responses }));
  await page.close();
} catch (error) {
  failed = true;
  console.error(error?.stack || String(error));
} finally {
  await browser.close();
}
if (failed) process.exitCode = 1;
