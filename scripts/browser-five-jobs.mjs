#!/usr/bin/env node
// Real Chromium smoke of the published, nested five-project application.
// The Store is a separate local service at System's pinned revision; no mocks,
// alternate quote paths or fixture prices are inserted into the browser.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { chromium } from 'playwright';

// Exercise promise settlement and dispatch independently of Store's manufacturing answers.
{
  const window={};
  runInNewContext(readFileSync(new URL('../public/live/stb-outdoor-option-requests.js',import.meta.url),'utf8'),{window});
  const {enqueue}=window.STBOutdoorOptionRequests;
  const order=[];let release,currentGeneration=1;
  const gate=new Promise(resolve=>{release=resolve;});
  const active=enqueue(async()=>{order.push('active preview');await gate;return 'completed';},
    {preview:true,isCurrent:()=>currentGeneration===1});
  const discarded=Array.from({length:8},()=>assert.rejects(enqueue(async()=>{order.push('obsolete preview');},
    {preview:true,isCurrent:()=>currentGeneration===1}),{code:'OUTDOOR_PREVIEW_SUPERSEDED'}));
  currentGeneration=2;
  const selected=enqueue(async()=>{order.push('selected');return 'selected';},{isCurrent:()=>false});
  const current=enqueue(async()=>{order.push('current preview');return 'current';},
    {preview:true,isCurrent:()=>currentGeneration===2});
  release();
  assert.equal(await active,'completed','A started preview must finish normally');
  assert.equal(await selected,'selected','A selected inquiry must never be discarded');
  assert.equal(await current,'current');
  await Promise.all(discarded);
  assert.deepEqual(order,['active preview','selected','current preview']);
}

const base = process.env.STB_BROWSER_BASE || 'http://127.0.0.1:8080';
const expectedPin = 'e3d203d1ff297ea096e2a6b2ea97b85a78b13cc2';
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
let failed = false;
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const responses = [];
  const evaluations = [], responseReads = [], responseReadErrors = [];
  const configRequests = [];
  const outdoorRequests=[],pageErrors=[];
  let outdoorInFlight=0,outdoorMaxInFlight=0;
  const outdoorWire=r=>{try{const body=r.postDataJSON();return body?.projectId==='outdoor'?body:null;}catch{return null;}};
  page.on('pageerror',error=>pageErrors.push(String(error)));
  let extendedSeatConfigReads = 0, extendedOutdoorConfigReads = 0;
  page.on('request', r => {
    if (new URL(r.url()).pathname === '/live/stb-store-runtime.json') configRequests.push(r.url());
    if (new URL(r.url()).pathname === '/api/store-zero/job') {
      const wire=outdoorWire(r);
      if(wire){outdoorRequests.push({wire,started:performance.now()});outdoorInFlight++;outdoorMaxInFlight=Math.max(outdoorMaxInFlight,outdoorInFlight);}
    }
  });
  for(const event of ['requestfinished','requestfailed'])page.on(event,r=>{
    if(new URL(r.url()).pathname==='/api/store-zero/job'&&outdoorWire(r))outdoorInFlight--;
  });
  page.on('response', r => {
    if (r.url().includes('/api/store-zero/')) responses.push({ path: new URL(r.url()).pathname, status: r.status() });
    if (new URL(r.url()).pathname === '/api/store-zero/job') responseReads.push(r.json().then(
      body=>evaluations.push(body), error=>responseReadErrors.push(String(error))));
  });
  const entry = await page.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  assert.equal(entry.status(), 200, 'public route should load');
  await page.waitForFunction(() => Boolean(document.getElementById('stb-current')?.contentWindow?.document
    ?.getElementById('stb-current')?.contentWindow?.document?.querySelector('#projects')), { timeout: 30000 });
  const content = page.frameLocator('iframe#stb-current').frameLocator('iframe#stb-current');
  await content.locator('#projects').waitFor({ state: 'attached', timeout: 30000 });
  const journey = async (surface, projectId, label) => {
    const nav = content.locator('.recovery-nav');
    const stages = ['1 · Intent','2 · The bench','3 · The Store answers','4 · Your call','5 · We cut it','6 · Pick up & build'];
    for (const name of stages) assert.equal(await nav.getByRole('button',{name,exact:true}).isVisible(),true,label+': missing '+name);
    assert.equal(await nav.getByRole('button',{name:stages[4],exact:true}).isDisabled(),true);
    assert.equal(await nav.getByRole('button',{name:stages[5],exact:true}).isDisabled(),true);
    await nav.getByRole('button',{name:stages[3],exact:true}).click();
    const accept=surface.locator('[data-terms-action="accept"]:visible');
    await accept.waitFor({timeout:15000});
    await Promise.all(responseReads);
    const answer=evaluations.filter(a=>a.projectId===projectId&&a.rawEvaluation?.status==='SUPPORTABLE'&&!a.candidateRevisionId?.includes('-wood-')&&!a.candidateRevisionId?.includes('-tier-')).at(-1);
    assert.ok(answer,label+': no real selected Store answer');
    const Q=answer.rawEvaluation.totals.Q;
    assert.ok((await accept.innerText()).includes('$'+Q.toFixed(2)),label+': offer differs from Store Q');
    const visibleChain=surface.locator('.stb-terms:visible');
    assert.equal(await visibleChain.locator('[data-terms-event="arrived"]').isVisible(),true);
    assert.ok((await visibleChain.innerText()).includes(answer.evaluationReceipt.receiptHash.slice(0,16)),label+': receipt must be visible without expansion');
    await accept.click();
    const yard=surface.locator('[data-terms-action="yard"]:visible');
    await yard.waitFor({timeout:15000});
    assert.equal(await nav.getByRole('button',{name:stages[4],exact:true}).isEnabled(),true);
    assert.equal(await nav.getByRole('button',{name:stages[5],exact:true}).isDisabled(),true);
    await nav.getByRole('button',{name:stages[3],exact:true}).click();
    assert.equal(await surface.locator('[data-terms-action="accept"]:visible').count(),0,'Revisiting Your call must not create a second checkout');
    await nav.getByRole('button',{name:stages[4],exact:true}).click();
    await yard.click();
    const pickup=surface.locator('[data-terms-action="pickup"]:visible');
    await pickup.waitFor({timeout:15000});
    assert.equal(await nav.getByRole('button',{name:stages[5],exact:true}).isEnabled(),true);
    await nav.getByRole('button',{name:stages[4],exact:true}).click();
    assert.equal(await surface.locator('[data-terms-action="yard"]:visible').count(),0,'A ready job must not run twice');
    await nav.getByRole('button',{name:stages[5],exact:true}).click();
    await pickup.click();
    const receipt=surface.locator('[data-terms-receipt]:visible');
    await receipt.waitFor({timeout:15000});
    const receiptText=await receipt.innerText();
    assert.ok(receiptText.includes(answer.evaluationReceipt.receiptHash));
    assert.ok(receiptText.includes('$'+Q.toFixed(2)));
    assert.ok(receiptText.includes('simulated payment')&&receiptText.includes('Demo receipt'));
    for(const name of stages)assert.equal(await nav.getByRole('button',{name,exact:true}).isVisible(),true);
    console.log(JSON.stringify({project:label,fullJourney:'Store → accept → yard demo → pickup',Q,visibleReceipts:true,storeReceipt:answer.evaluationReceipt.receiptHash}));
  };
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
    if (index) {
      await Promise.all(responseReads);
      await page.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    }
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
      await bench.locator('#stb-confirm-store').click();
      await content.locator('#proof-store').waitFor({state:'visible',timeout:45000});
      await journey(content,'start-own',label);
      assert.equal(await content.locator('#proof-record details').evaluate(e=>e.open),true,'Project documentation must start visible');
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
      await content.locator('#confirm-alcove-inline').click();
      await content.locator('#store').waitFor({state:'visible',timeout:45000});
      await journey(content,'alcove',label);
      console.log(JSON.stringify({ project: label, pine, poplar, freshStoreAnswer: true }));
    }
    if (label === 'Window Seat') {
      assert.ok((await content.locator('iframe#window-seat-frame').getAttribute('src')).includes('?v=journey-visible-20261015'),'The host must invalidate the previously cached Window Seat page');
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
      await seat.locator('#bench-species [data-material="pine"]').click();
      await waitAnswer();
      await seat.locator('#btn-ask').click();
      await journey(seat,'window-seat',label);
      const seatTerms=await seat.locator('body').evaluate(()=>window.STBWindowSeat.state().terms);
      assert.equal(seatTerms.commercial.physicalAuthority,false);
      assert.equal(seatTerms.commercial.paymentAuthority,false);
      assert.equal(await seat.locator('body').evaluate(()=>window.STBTermsFlow.verify(window.STBWindowSeat.state().terms)),true);
      extendedSeatConfigReads=configRequests.length-configReadsBeforeSpeciesChecks;
      console.log(JSON.stringify({project:label,benchPrice:quote,poplar:poplarPrice,oakStockShortageVisible:true,
        oakMillingQ:oak.rawEvaluation.Q,missingStockRefusalVisible:true,freshStoreAnswer:true}));
    }
    if (label === 'Outdoor') {
      assert.ok((await content.locator('iframe#outdoor-bench-leg-frame').getAttribute('src')).includes('?v=journey-visible-20261015'),'The host must invalidate the previously cached Outdoor page');
      const outdoor = content.frameLocator('iframe#outdoor-bench-leg-frame');
      assert.ok((await outdoor.locator('script[src*="stb-outdoor-option-requests.js"]').getAttribute('src')).includes('?v=queue-correction-20261015'),'The corrected queue must not reuse the previously cached script');
      const before = responses.filter(r => r.path === '/api/store-zero/job' && r.status === 200).length;
      await outdoor.locator('#idea-next').click({ timeout: 15000 });
      await outdoor.locator('#s-intent [data-to-bench]').click({ timeout: 15000 });
      const money = outdoor.locator('#outdoor-definition-price');
      await money.filter({ hasText: /\$[0-9]+/ }).waitFor({ state: 'visible', timeout: 45000 });
      const quote = (await money.innerText()).trim();
      assert.ok(responses.filter(r => r.path === '/api/store-zero/job' && r.status === 200).length > before,
        'Outdoor Bench displayed no fresh Store response');
      const extraConfigStart = configRequests.length;
      const waitOutdoorAnswer = async () => {
        await page.waitForFunction(() => {
          const win=document.getElementById('stb-current')?.contentWindow?.document
            ?.getElementById('stb-current')?.contentWindow?.document
            ?.getElementById('outdoor-bench-leg-frame')?.contentWindow;
          const state=win?.STBOutdoorPicnic?.state();
          return state?.current && !state.asking && !state.error;
        }, undefined, { timeout: 45000 });
        await Promise.all(responseReads);
        const revision=await outdoor.locator('body').evaluate(()=>window.STBOutdoorPicnic.request().configurationVersion);
        const answer=evaluations.filter(body=>body.projectId==='outdoor'&&body.candidateRevisionId===revision).at(-1);
        assert.ok(answer, 'Outdoor has no real Store reply for its current revision');
        assert.equal(answer.storePin,expectedPin);
        return answer;
      };
      const planResults=[];
      for (const [plan, initialQ, revisedQ] of [['a-frame',293.16,320.25],['table-benches',288.23,321.94]]) {
        if (plan==='table-benches') {
          await content.getByRole('button',{name:'1 · Intent',exact:true}).click();
          await outdoor.locator('#s-intent [data-plan="table-benches"]').click();
        }
        const initial=await waitOutdoorAnswer();
        assert.equal(initial.rawEvaluation.status,'SUPPORTABLE');
        assert.equal(initial.rawEvaluation.Q,initialQ);
        assert.equal((await money.innerText()).trim(),'$'+initialQ.toFixed(2));
        await outdoor.locator('#s-build [data-size="12"]').click();
        const revised=await waitOutdoorAnswer();
        assert.equal(revised.rawEvaluation.status,'SUPPORTABLE');
        assert.equal(revised.rawEvaluation.Q,revisedQ);
        assert.equal((await money.innerText()).trim(),'$'+revisedQ.toFixed(2));
        assert.notEqual(revised.evaluationReceipt.receiptHash,initial.evaluationReceipt.receiptHash);
        assert.notEqual(revised.evaluationReceipt.demandHash,initial.evaluationReceipt.demandHash);
        const stableParts=def=>def.cutPackages.flatMap(p=>p.parts).filter(p=>!p.partId.includes('SLAT')&&!p.partId.startsWith('TOP-')&&!p.partId.startsWith('SEAT-'));
        assert.deepEqual(stableParts(revised.mappedCallInputs.demand),stableParts(initial.mappedCallInputs.demand));
        await outdoor.locator('#len').press('End');
        const refused=await waitOutdoorAnswer();
        assert.equal(refused.rawEvaluation.status,'REFUSED');
        assert.equal(refused.rawEvaluation.Q,null);
        assert.ok(refused.rawEvaluation.reasonCodes.includes('RETAINED_CONTROL_LENGTH_TOO_SHORT'));
        assert.equal((refused.rawEvaluation.packages||[]).length,0,'Exercise a whole-job refusal without failed line items');
        const status=await outdoor.locator('#outdoor-definition-status').innerText();
        assert.ok(status.includes('REFUSED')&&status.includes('RETAINED_CONTROL_LENGTH_TOO_SHORT'),status);
        assert.ok((await outdoor.locator('#bench-instant').innerText()).includes('RETAINED_CONTROL_LENGTH_TOO_SHORT'));
        assert.equal((await money.innerText()).trim(),'No complete price');
        const state=await outdoor.locator('body').evaluate(()=>window.STBOutdoorPicnic.state());
        assert.equal(state.terms.stage,'REFUSED_BY_STORE');
        assert.equal(state.terms.callOpen,false);
        assert.ok(state.terms.reasons.some(r=>r.code==='RETAINED_CONTROL_LENGTH_TOO_SHORT'));
        assert.ok((await outdoor.locator('#call-terms').textContent()).includes('RETAINED_CONTROL_LENGTH_TOO_SHORT'));
        await content.getByRole('button',{name:'3 · The Store answers',exact:true}).click();
        assert.ok((await outdoor.locator('#answer').innerText()).includes('RETAINED_CONTROL_LENGTH_TOO_SHORT'));
        await content.getByRole('button',{name:'2 · The bench',exact:true}).click();
        await outdoor.locator('#s-build').waitFor({state:'visible',timeout:15000});
        await outdoor.locator('#len').press('Home');
        const recovery=await waitOutdoorAnswer();
        assert.equal(recovery.rawEvaluation.status,'SUPPORTABLE');
        assert.notEqual(recovery.evaluationReceipt.receiptHash,refused.evaluationReceipt.receiptHash);
        // Restore the plan's existing 72-inch starting behavior for the next checks.
        await outdoor.locator('#s-build [data-size="12"]').click();
        await waitOutdoorAnswer();
        for(const id of ['woods','tiers'])await outdoor.locator('#'+id).filter({hasNotText:/…|\?/}).waitFor({state:'visible',timeout:180000});
        await Promise.all(responseReads);
        const measurements=[],previewSequences=[];
        for(const length of [84,96,108]){
          const start=performance.now();
          await outdoor.locator('#s-build [data-size="12"]').click();
          const prefix=await outdoor.locator('body').evaluate(()=>window.STBOutdoorPicnic.optionsRequest().configurationVersion);
          previewSequences.push({prefix,changedAt:start});
          const activePreview=length===84?page.waitForRequest(r=>outdoorWire(r)?.candidateRevisionId===prefix+'-wood-treated',{timeout:45000}):null;
          const answer=await waitOutdoorAnswer();
          assert.equal(answer.rawEvaluation.status,'SUPPORTABLE');
          assert.equal((await money.innerText()).trim(),'$'+answer.rawEvaluation.Q.toFixed(2));
          measurements.push({length,elapsedMs:Math.round(performance.now()-start),Q:answer.rawEvaluation.Q,receipt:answer.evaluationReceipt.receiptHash});
          if(activePreview)await activePreview;
        }
        for(const id of ['woods','tiers'])await outdoor.locator('#'+id).filter({hasNotText:/…|\?/}).waitFor({state:'visible',timeout:180000});
        await Promise.all(responseReads);
        for(let i=0;i<previewSequences.length-1;i++){
          const stale=outdoorRequests.filter(r=>r.wire.candidateRevisionId.startsWith(previewSequences[i].prefix+'-')&&r.started>previewSequences[i+1].changedAt);
          assert.equal(stale.length,0,'Superseded, queued previews reached Store: '+JSON.stringify(stale.map(r=>r.wire.candidateRevisionId)));
        }
        const latest=previewSequences.at(-1).prefix;
        const comparisons=evaluations.filter(a=>a.projectId==='outdoor'&&a.candidateRevisionId.startsWith(latest+'-'));
        assert.equal(comparisons.length,9,'Keep all five wood and four hardware comparisons');
        for(const answer of comparisons){
          const revision=answer.candidateRevisionId;
          assert.equal(answer.mappedCallInputs.demand.configurationVersion,revision);
          assert.ok(answer.evaluationReceipt.receiptHash);
          if(revision.includes('-wood-')){
            const key=revision.split('-wood-')[1],button=outdoor.locator('#woods [data-wood="'+key+'"]');
            const lines=answer.rawEvaluation.packages||[];
            const supported=lines.length>0&&lines.every(l=>l.status==='SUPPORTABLE');
            const expected=supported?'$'+Math.round(lines.reduce((sum,l)=>sum+Number(l.Q||0),0)):'Not as stocked';
            assert.ok((await button.innerText()).includes(expected));
          }else{
            const key=revision.split('-tier-')[1],button=outdoor.locator('#tiers [data-tier="'+key+'"]');
            const lines=answer.rawEvaluation.items||[];
            const supported=lines.length>0&&lines.every(l=>l.status==='SUPPORTABLE');
            const expected=supported?'+$'+Math.round(lines.reduce((sum,l)=>sum+Number(l.Q||0),0)):'Not stocked yet';
            assert.ok((await button.innerText()).includes(expected));
          }
        }
        const selectedState=await outdoor.locator('body').evaluate(()=>window.STBOutdoorPicnic.state());
        assert.equal(selectedState.terms.version,selectedState.answer.definitionRevisionId);
        assert.equal(selectedState.answer.inquiryScope,'OUTDOOR_COMMITTED');
        await outdoor.locator('#bench-confirm').click();
        for(const service of ['sanding','cart','pallet']){
          const choice=outdoor.locator('[data-outdoor-service="'+service+'"]');
          await choice.click();
          assert.equal(await outdoor.locator('#confirm').isDisabled(),true,'An unpriced service must not authorize checkout');
          assert.equal(await content.getByRole('button',{name:'4 · Your call',exact:true}).isDisabled(),true);
          assert.equal(await content.getByRole('button',{name:'5 · We cut it',exact:true}).isVisible(),true);
          assert.equal(await content.getByRole('button',{name:'6 · Pick up & build',exact:true}).isVisible(),true);
          await choice.click();
          assert.equal(await outdoor.locator('#confirm').isEnabled(),true);
        }
        await journey(outdoor,'outdoor',label+' · '+plan);
        const completed=await outdoor.locator('body').evaluate(()=>window.STBOutdoorPicnic.state().terms);
        assert.equal(completed.stage,'HANDED_OFF');
        assert.equal(completed.commercial.physicalAuthority,false);
        assert.equal(completed.commercial.paymentAuthority,false);
        assert.equal(await outdoor.locator('body').evaluate(()=>window.STBTermsFlow.verify(window.STBOutdoorPicnic.state().terms)),true);
        console.log(JSON.stringify({project:label,plan,rapidSizeChanges:measurements,obsoleteQueuedPreviewsSent:0,comparisonReplies:comparisons.length}));
        planResults.push({plan,initialQ,revisedQ,wholeJobRefusalVisible:true,recovery:true});
      }
      // Read the final current comparisons before navigation destroys their response bodies.
      await content.getByRole('button',{name:'2 · The bench',exact:true}).click();
      await outdoor.locator('#woods').filter({hasNotText:/…|\?/}).waitFor({state:'visible',timeout:180000});
      await outdoor.locator('#tiers').filter({hasNotText:/…|\?/}).waitFor({state:'visible',timeout:180000});
      await Promise.all(responseReads);
      extendedOutdoorConfigReads=configRequests.length-extraConfigStart;
      console.log(JSON.stringify({ project: label, benchPrice: quote, liveStore: true, planResults }));
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
      await journey(content,'playhouse',label);
      const playhouse=await content.locator('body').evaluate(()=>window.STBPlayhouseLive.terms());
      assert.equal(playhouse.commercial.physicalAuthority,false);
      assert.equal(playhouse.commercial.paymentAuthority,false);
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
  await Promise.all(responseReads);
  assert.deepEqual(responseReadErrors,[], 'Every observed Store response body must be read');
  assert.deepEqual(pageErrors,[], 'Browser promises and scripts must not fail');
  assert.equal(outdoorMaxInFlight,1,'Outdoor must not flood Store with concurrent inquiries');
  assert.ok(responses.every(r => r.status < 500), JSON.stringify(responses));
  // Keep the original five-project navigation allowance. The extended species
  // and geometry/Outdoor inquiries may legitimately cross the client's five-second
  // configuration expiry; count those extra reads separately.
  assert.ok(configRequests.length-extendedSeatConfigReads-extendedOutdoorConfigReads <= 12,
    'Repeated runtime config fetches remain excessive: ' + configRequests.length);
  console.log(JSON.stringify({ fiveProjectsMounted: true, storePin: config.storePin,
    configRequests: configRequests.length, extendedSeatConfigReads, extendedOutdoorConfigReads, storeResponses: responses }));
  await page.close();
} catch (error) {
  failed = true;
  console.error(error?.stack || String(error));
} finally {
  await browser.close();
}
if (failed) process.exitCode = 1;
