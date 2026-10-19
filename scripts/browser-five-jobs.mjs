#!/usr/bin/env node
// Real Chromium smoke of the published, nested five-project application.
// The Store is a separate local service at System's pinned revision; no mocks,
// alternate quote paths or fixture prices are inserted into the browser.
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import {resolve, join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import { chromium } from 'playwright';
import { profilePinnedStoreAnswer } from './profile-pinned-store.mjs';
import {exerciseComponentTool, lowerAcceptedPacket} from './browser-component-tool.mjs';

// Visual evidence belongs to this same public acceptance, beside its complete manufacturing proof.
const visualEvidence=[];
rmSync('artifacts/project-1-current-proof.json',{force:true});
rmSync('artifacts/visual',{recursive:true,force:true});
mkdirSync('artifacts/visual',{recursive:true});
async function inspectVisuals(page,surface,label,{required=[],expectArt=true}={}) {
  for(const selector of required)assert.equal(await surface.locator(selector).isVisible(),true,label+': '+selector);
  const assets=surface.locator('img:visible,svg:not([aria-hidden="true"]):visible,canvas:visible');
  let important=0;
  for(let i=0;i<await assets.count();i++){
    const asset=assets.nth(i),box=await asset.boundingBox();
    if(!box||box.width<48||box.height<40)continue; // Small controls are checked by their actual actions.
    await asset.scrollIntoViewIfNeeded();
    const facts=await asset.evaluate(async el=>{
      const r=el.getBoundingClientRect(),style=getComputedStyle(el);
      const hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);
      const base={tag:el.tagName.toLowerCase(),id:el.id,alt:el.getAttribute('alt')||el.getAttribute('aria-label'),box:{x:r.x,y:r.y,width:r.width,height:r.height},visible:el.checkVisibility({checkOpacity:true,checkVisibilityCSS:true}),uncovered:hit===el||el.contains(hit)||hit?.closest('svg')===el,viewport:{width:innerWidth,height:innerHeight,documentWidth:document.documentElement.scrollWidth}};
      if(el instanceof HTMLImageElement){
        await el.decode();
        return {...base,source:el.currentSrc,complete:el.complete,naturalWidth:el.naturalWidth,naturalHeight:el.naturalHeight};
      }
      if(el instanceof SVGSVGElement){
        const geometry=[...el.querySelectorAll('path,rect,line,circle,ellipse,polygon,polyline')].filter(n=>!n.closest('defs,clipPath,mask')).map(n=>{
          const b=n.getBBox();return {kind:n.tagName,box:{x:b.x,y:b.y,width:b.width,height:b.height},path:n.getAttribute('d'),points:n.getAttribute('points')};
        }).filter(n=>n.box.width>0||n.box.height>0);
        return {...base,geometry};
      }
      const ctx=el.getContext('2d'),pixels=ctx?.getImageData(0,0,el.width,el.height).data;
      return {...base,canvasWidth:el.width,canvasHeight:el.height,painted:pixels&&pixels.some((v,i)=>i%4===3&&v>0)};
    });
    assert.equal(facts.visible,true,label+': hidden '+facts.id);
    assert.equal(facts.uncovered,true,label+': covered '+facts.id);
    if(label.startsWith('mobile'))assert.ok(facts.viewport.documentWidth<=facts.viewport.width+1,label+': horizontal page overflow '+JSON.stringify(facts.viewport));
    if(facts.tag==='img'){
      assert.equal(facts.complete,true,label);assert.ok(facts.naturalWidth>0&&facts.naturalHeight>0,label+': decoded dimensions');
      assert.ok(facts.alt,label+': image needs an accessible description');
      facts.sourceHash=createHash('sha256').update(facts.source).digest('hex');
      if(facts.source.startsWith('data:'))facts.source=facts.source.slice(0,40)+'…';
    }else if(facts.tag==='svg')assert.ok(facts.geometry.length>0,label+': no drawn geometry');
    else assert.equal(facts.painted,true,label+': blank canvas');
    const screenshot='artifacts/visual/'+label.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-'+important+'.png';
    await page.screenshot({path:screenshot});
    visualEvidence.push({label,...facts,screenshot});important++;
  }
  if(expectArt)assert.ok(important>0,label+': no visible project art');
  if(!important){
    const screenshot='artifacts/visual/'+label.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.png';
    await page.screenshot({path:screenshot});visualEvidence.push({label,screenshot,artExpected:expectArt});
  }
}

async function inspectNarrowJourneys(page,base){
  await page.setViewportSize({width:390,height:844});
  await page.goto(base+'/live/component-tool.html?v=public-conformance-20261017');
  await page.locator('#prepare').click();
  await page.waitForFunction(()=>!document.getElementById('ask').disabled);
  assert.equal(await page.locator('#parts tr').count(),6);
  const componentReply=page.waitForResponse(r=>new URL(r.url()).pathname==='/api/store-zero/job'&&r.request().postDataJSON()?.projectId==='registered-components');
  await page.locator('#ask').click();
  const componentAnswer=await(await componentReply).json();
  assert.equal(componentAnswer.storeAnswer.status,'SUPPORTABLE');
  await page.locator('#result').filter({hasText:'Store answer: $'+componentAnswer.storeAnswer.Q.toFixed(2)}).waitFor({timeout:45000});
  assert.equal(await page.locator('body').evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'Component requirements must fit the narrow viewport');
  await inspectVisuals(page,page,'mobile component tool',{expectArt:false});
  await page.getByRole('link',{name:'Project Library',exact:true}).click();
  const content=page.frameLocator('#stb-current').frameLocator('#stb-current');
  await content.locator('#projects').waitFor({state:'visible'});
  await inspectVisuals(page,content.locator('#projects'),'mobile returning library');
  for(const [job,tile] of [['job1','[data-start-own-artifact]'],['alcove','[data-go="alcove-capture"]'],['window-seat','[data-window-seat-artifact]'],['outdoor','[data-outdoor-build-artifact]'],['playhouse','[data-go="window-parts"]']]){
    await content.locator('#projects button.tile'+tile).click();
    let surface=content,benchSurface;
    if(job==='job1'){
      surface=content.frameLocator('#start-own-proof-frame');
      await surface.locator('#stb-intent-next').waitFor();
      await inspectVisuals(page,surface,'mobile job1 intent');
      await content.getByRole('button',{name:'Idea',exact:true}).click();
      // The tile host schedules the child-screen switch; wait for the actual Idea page, then require its photo.
      await surface.locator('#stb-start-idea-screen').waitFor({state:'visible'});
      await inspectVisuals(page,surface,'mobile job1 idea',{required:['#stb-idea-img']});
      await surface.locator('#stb-idea-next').click();
      await surface.locator('#stb-add-tool').click();
      assert.equal(await surface.locator('#stb-ops-list').isVisible(),true);
      await surface.locator('#stb-ops-close').click();
      assert.equal(await surface.locator('#stb-ops-list').isVisible(),false);
      await surface.locator('#stb-intent-next').click();
      await surface.locator('#stb-price-total').filter({hasText:/\$\d/}).waitFor({timeout:45000});
      benchSurface=surface;
    }else if(job==='alcove'){
      await inspectVisuals(page,content.locator('#alcove-idea'),'mobile alcove idea');
      await content.locator('#alcove-idea button[data-go="alcove-capture"]').first().click();
      await inspectVisuals(page,content.locator('#alcove-capture'),'mobile alcove intent');
      await content.locator('#alcove-capture button[data-go="alcove-config"]').first().click();
      await content.locator('#alcove-bench-store-price').filter({hasText:/\$\d/}).waitFor({timeout:45000});
      benchSurface=content.locator('#alcove-config');
    }else if(job==='window-seat'){
      surface=content.frameLocator('#window-seat-frame');await surface.locator('#s-hero').waitFor();
      await inspectVisuals(page,surface,'mobile window seat idea');
      await surface.locator('#s-hero button[data-to="intent"]').click();
      await inspectVisuals(page,surface,'mobile window seat intent');
      await surface.locator('#s-intent .forward-heading button[data-to="bench"]').click();
      await surface.locator('#bench-money').filter({hasText:/\$[\d,]/}).waitFor({timeout:45000});
      benchSurface=surface;
    }else if(job==='outdoor'){
      surface=content.frameLocator('#outdoor-bench-leg-frame');await surface.locator('#idea-next').waitFor();
      await inspectVisuals(page,surface,'mobile outdoor idea',{expectArt:false});
      await surface.locator('#idea-next').click();
      await inspectVisuals(page,surface,'mobile outdoor intent');
      await surface.locator('#s-intent [data-to-bench]').click();
      await surface.locator('#outdoor-definition-price').filter({hasText:/\$\d/}).waitFor({timeout:45000});
      benchSurface=surface;
    }else{
      await inspectVisuals(page,content.locator('#playhouse-idea'),'mobile playhouse idea');
      await content.locator('#playhouse-idea button[data-canonical-go="playhouse-s001"]').click();
      await inspectVisuals(page,content.locator('#playhouse-s001'),'mobile playhouse intent');
      await content.locator('#ph-to-bench').click();
      benchSurface=content.locator('#playhouse-machine');
      assert.equal(await benchSurface.evaluate(e=>{const main=e.querySelector('.main').getBoundingClientRect(),rail=e.querySelector('.rail').getBoundingClientRect();return rail.width>=300&&rail.top>=main.bottom-1;}),true,'The narrow Playhouse rail must stack below its job');
    }
    await inspectVisuals(page,benchSurface,'mobile '+job+' bench');
    const clipped=await benchSurface.locator('input:visible,select:visible,button:visible').evaluateAll(nodes=>nodes.filter(e=>{const r=e.getBoundingClientRect();return r.left < -1 || r.right > innerWidth+1;}).map(e=>({id:e.id,label:e.getAttribute('aria-label')||e.textContent?.trim(),right:e.getBoundingClientRect().right,width:innerWidth})));
    assert.deepEqual(clipped,[],job+': narrow controls must stay within the visible column');
    if(job==='outdoor')for(const id of ['woods','tiers'])await surface.locator('#'+id).filter({hasNotText:/…|\?/}).waitFor({timeout:180000});
    const services=surface.getByRole('button',{name:'Additional services',exact:true});
    await services.click();
    const panel=surface.getByRole('dialog',{name:'Additional services',exact:true});
    assert.equal(await panel.getByRole('checkbox').count(),62);
    const choice=panel.getByRole('checkbox').first();await choice.check();
    // F6: every project's separate planning requests must appear as explicit exclusions
    // beside its Your Call terms, even when the Bench lives in a child frame.
    const exclusions=(job==='job1'?content:surface).locator('[data-stb-as-exclusion="'+(job==='job1'?'start-own':job)+'"]').first();
    await exclusions.filter({hasText:'A01'}).waitFor({state:'attached',timeout:15000});
    assert.match(await exclusions.textContent(),/NOT INCLUDED IN THIS OFFER/);
    await panel.getByRole('button',{name:'Close additional services',exact:true}).click();
    await services.click();assert.equal(await choice.isChecked(),true);
    await choice.uncheck();await panel.press('Escape');assert.equal(await panel.isVisible(),false);
    await content.getByRole('button',{name:'← Project Library',exact:true}).click();
    await content.locator('#projects').waitFor({state:'visible'});
  }
  // The same browser returns with its HTTP cache and owner storage intact.
  await page.reload();
  await content.locator('#projects').waitFor({state:'visible'});
  await content.locator('#projects button.tile[data-start-own-artifact]').click();
  const job1=content.frameLocator('#start-own-proof-frame');
  await inspectVisuals(page,job1,'mobile cached job1 intent');
  await content.getByRole('button',{name:'Idea',exact:true}).click();
  // Re-entering from a cached page still switches the nested Idea screen asynchronously.
  await job1.locator('#stb-start-idea-screen').waitFor({state:'visible'});
  await inspectVisuals(page,job1,'mobile cached job1 idea',{required:['#stb-idea-img']});
}

// Exercise promise settlement and dispatch independently of Store's manufacturing answers.
{
  const window={};
  runInNewContext(readFileSync(new URL('../public/live/stb-outdoor-option-requests.js',import.meta.url),'utf8'),{window,setTimeout,clearTimeout,Date});
  const {enqueue,deferPreviews}=window.STBOutdoorOptionRequests;
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
  deferPreviews(50);
  const preview=enqueue(async()=>{order.push('preview after selected');return 'preview';},{preview:true});
  const chosen=enqueue(async()=>{order.push('selected before waiting preview');return 'selected';});
  assert.equal(await chosen,'selected');
  assert.equal(await preview,'preview');
  assert.deepEqual(order.slice(-2),['selected before waiting preview','preview after selected']);
}

const base = process.env.STB_BROWSER_BASE || 'http://127.0.0.1:8080';
for (const endpoint of ['job', 'offering']) {
  for (const [body, status, code] of [['{', 400, 'PUBLISHED_WIRE_NOT_JSON'], ['null', 400, 'PUBLISHED_WIRE_NOT_JSON'], ['[]', 422, 'PUBLISHED_WIRE_NOT_RECOGNIZED'], ['{}', 422, 'PUBLISHED_WIRE_NOT_RECOGNIZED']]) {
    const response = await fetch(`${base}/api/store-zero/${endpoint}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body });
    assert.equal(response.status, status, `${endpoint}: ${body}`);
    assert.deepEqual(await response.json(), { adapterError: true, code });
  }
}
const expectedPin = '10d36c09ff6e0dac3c098a004821efea81a2b58d';
const storeRoot=resolve(process.env.STORE_ZERO_ROOT||fileURLToPath(new URL('../.store-zero/',import.meta.url)));
assert.equal(execFileSync('git',['rev-parse','HEAD'],{cwd:storeRoot,encoding:'utf8'}).trim(),expectedPin,'Browser acceptance requires the exact Store checkout');
assert.equal(execFileSync('git',['status','--porcelain'],{cwd:storeRoot,encoding:'utf8'}).trim(),'','Browser acceptance requires clean Store source');
const {sourceDigest}=await import(pathToFileURL(join(storeRoot,'src/service/server.mjs')).href);
const {machineEvidenceIdentity}=await import(pathToFileURL(join(storeRoot,'src/machine/evidence.mjs')).href);
const storeOrigin=process.env.STORE_ZERO_ORIGIN||'http://127.0.0.1:8091';
const storeHealth=await(await fetch(storeOrigin+'/health')).json();
assert.equal(storeHealth.release,expectedPin);
assert.deepEqual(storeHealth.source,sourceDigest());
assert.deepEqual(storeHealth.machineEvidence,machineEvidenceIdentity());
const launchArgs=['--no-sandbox','--disable-dev-shm-usage',...JSON.parse(process.env.PLAYWRIGHT_CHROMIUM_ARGS||'[]')];
const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}:{}), args: launchArgs });
let failed = false;
let page;
try {
  page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const responses = [];
  const project1Specimens = [], project1Refusals = [];
  const publishedJobs = [], publishedRefusals = [];
  const evaluations = [], responseReads = [], responseReadErrors = [];
  const configRequests = [];
  const outdoorRequests=[],pageErrors=[],outdoorProfileTargets=[];
  const resourceErrors=[],consoleErrors=[],resourceChecks=[],navigationAborts=[];
  let outdoorInFlight=0,outdoorMaxInFlight=0;
  const outdoorWire=r=>{try{const body=r.postDataJSON();return body?.projectId==='outdoor'?body:null;}catch{return null;}};
  page.on('pageerror',error=>pageErrors.push(String(error)));
  page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
  page.on('requestfailed',request=>{
    const record={url:request.url(),type:request.resourceType(),error:request.failure()?.errorText};
    if(record.error==='net::ERR_ABORTED'&&['document','fetch','xhr'].includes(record.type))navigationAborts.push(record);
    else resourceErrors.push(record);
  });
  let extendedSeatConfigReads = 0, extendedOutdoorConfigReads = 0;
  page.on('request', r => {
    if (new URL(r.url()).pathname === '/live/stb-store-runtime.json') configRequests.push(r.url());
    if (new URL(r.url()).pathname === '/api/store-zero/job') {
      const wire=outdoorWire(r);
      if(wire){outdoorRequests.push({wire,started:performance.now(),request:r});outdoorInFlight++;outdoorMaxInFlight=Math.max(outdoorMaxInFlight,outdoorInFlight);}
    }
  });
  for(const event of ['requestfinished','requestfailed'])page.on(event,r=>{
    if(new URL(r.url()).pathname==='/api/store-zero/job'&&outdoorWire(r)){
      outdoorInFlight--;
      const tracked=outdoorRequests.find(x=>x.request===r);
      if(tracked)tracked.finished=performance.now();
    }
  });
  page.on('response', r => {
    const type=r.request().resourceType(),mime=r.headers()['content-type']||'';
    const expected={document:/text\/html/,script:/(?:javascript|ecmascript)/,stylesheet:/text\/css/,image:/image\//,font:/(?:font|octet-stream)/}[type];
    if(expected){
      const record={url:r.url(),type,status:r.status(),mime,cacheControl:r.headers()['cache-control']||''};resourceChecks.push(record);
      // 304 reuses previously validated bytes, while 3xx redirects carry no resource body; MIME belongs to 2xx content.
      if(r.status()>=400||(r.status()>=200&&r.status()<300&&!expected.test(mime)))resourceErrors.push(record);
      if(new URL(r.url()).pathname.startsWith('/live/')&&!record.cacheControl.includes('no-cache'))resourceErrors.push({...record,error:'Published assets must revalidate rather than silently retain an earlier release'});
    }
    if (r.url().includes('/api/store-zero/')) responses.push({ path: new URL(r.url()).pathname, status: r.status() });
    if (new URL(r.url()).pathname === '/api/store-zero/job') responseReads.push(r.json().then(
      body=>evaluations.push(body), error=>responseReadErrors.push(String(error))));
  });
  const entry = await page.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  assert.equal(entry.status(), 200, 'public route should load');
  await page.waitForFunction(() => Boolean(document.getElementById('stb-current')?.contentWindow?.document
    ?.getElementById('stb-current')?.contentWindow?.document?.querySelector('#projects')), { timeout: 30000 });
  const content = page.frameLocator('iframe#stb-current').frameLocator('iframe#stb-current');
  for (const frame of [page.locator('iframe#stb-current'), page.frameLocator('iframe#stb-current').locator('iframe#stb-current')])
    assert.ok((await frame.getAttribute('src')).includes('?v=public-conformance-20261017'), 'The updated nested page must invalidate its earlier cached source');
  await content.locator('#projects').waitFor({ state: 'attached', timeout: 30000 });
  const programReadme=content.locator('#landing > .rail > .foot a.landing-program-link');
  await programReadme.waitFor({state:'visible'});
  assert.equal(await programReadme.getAttribute('href'),'https://github.com/GeorgePlattDemo/3d-solutions-program/blob/main/README.md');
  assert.equal((await programReadme.locator('.program-caption').innerText()).trim(),'program readme');
  assert.equal(await programReadme.locator('svg[viewBox="0 0 16 16"] path').count(),1);
  const pillBox=await programReadme.locator('.ghpill').boundingBox();
  const railBox=await content.locator('#landing > .rail').boundingBox();
  assert.ok(pillBox&&railBox&&pillBox.width<=50&&pillBox.height<=33
    &&pillBox.x>=railBox.x&&pillBox.x+pillBox.width<=railBox.x+railBox.width,
    'Program link pill must remain understated and fit in the landing rail');
  const journey = async (surface, projectId, label) => {
    const nav = content.locator('.recovery-nav');
    const stages = ['1 · Intent','2 · The bench','3 · The Store answers','4 · Your call','5 · We cut it','6 · Pick up & build'];
    for (const name of stages) assert.equal(await nav.getByRole('button',{name,exact:true}).isVisible(),true,label+': missing '+name);
    assert.equal(await nav.getByRole('button',{name:stages[4],exact:true}).isDisabled(),true);
    assert.equal(await nav.getByRole('button',{name:stages[5],exact:true}).isDisabled(),true);
    await nav.getByRole('button',{name:stages[3],exact:true}).click();
    if(projectId==='alcove'){
      const separate=surface.locator('[data-stb-as-exclusion="alcove"]');
      await separate.waitFor({state:'visible',timeout:15000});
      assert.match(await separate.innerText(),/A01 · Counter pickup — ASAP/);
      assert.match(await separate.innerText(),/NOT INCLUDED IN THIS OFFER/);
    }
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
    {
      const exported=await surface.locator('body').evaluate(async (_body,projectId)=>{
        let owner=window;
        while(!owner.STBTermsFlow&&owner!==owner.parent)owner=owner.parent;
        const flow=owner.STBTermsFlow.instance(projectId);
        return {accepted:await flow.acceptedPacket(),transaction:flow.state().commercial};
      },projectId);
      assert.equal(exported.accepted.status,'ACCEPTED_PACKET_READY',JSON.stringify(exported));
      const packet=exported.accepted.packet;
      assert.deepEqual(packet.definition.demand,answer.mappedCallInputs.demand);
      assert.deepEqual(packet.definition.manifest,answer.mappedCallInputs.manifest);
      assert.deepEqual(packet.storeAnswer,answer.storeAnswer);
      const {request,reply,http}=await lowerAcceptedPacket(packet,{storeOrigin,storePin:expectedPin,health:storeHealth});
      const evidence=reply.answer;
      if(projectId==='start-own'){
       const point=(0.1875/2)/Math.tan(118*Math.PI/360);
       for(const part of packet.definition.demand.parts)for(const feature of part.features){
        const depth=feature.fullDiameterDepthIn??0.1875;
        const parent=packet.storeAnswer.parents.find(p=>p.partIds?.includes(part.partId));
        assert.ok(parent,'Each spot must belong to its evaluated parent');
        const moves=evidence.localJob.operations.filter(o=>o.kind==='MOVE'&&o.axis==='Z'&&o.subject===feature.featureId&&o.target<parent.actualT);
        assert.equal(moves.length,1);assert.ok(Math.abs(moves[0].target-(parent.actualT-point-depth))<1e-12);
       }
      }
      const record={label,projectId,health:storeHealth,applicationAnswer:answer,transaction:exported.transaction,machineRequest:request,machineReply:reply,machineHttp:http};
      publishedJobs.push(record);
      if(projectId==='start-own')project1Specimens.push({...record,lengthIn:packet.definition.demand.parts[0].lengthIn});
      if(['alcove','window-seat','outdoor'].includes(projectId))assert.ok(http.requestBytes>256*1024,label+': exercise the formerly rejected complete packet');
      if(label==='Outdoor · A-frame'){
        const envelopes=evidence.records.sequence.filter(e=>e.kind==='STOCK_ENVELOPE_DERIVED');
        assert.deepEqual(envelopes,packet.storeAnswer.operations.filter(e=>e.kind==='STOCK_ENVELOPE_DERIVED'));
        assert.ok(envelopes.some(e=>e.subject.startsWith('LEG-')));
        assert.equal(envelopes.filter(e=>e.subject.startsWith('BRACE-')).length,2);
      }
      if(label==='Window Seat default'){
        for(const [kind,change]of [
          ['missing component',r=>r.packet.definition.demand.cutPackages[0].parts.pop()],
          ['missing operation',r=>r.packet.storeAnswer.operations.pop()],
          ['incompatible configuration',r=>r.expectedMachineConfigHash='0'.repeat(64)]
        ]){
          const mutant=structuredClone(request);change(mutant);
          // Keep the original UI packet untouched; deliberately invalid copies must refuse.
          const response=await fetch(storeOrigin+'/v1/machine-evidence',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(mutant)}),refusal=await response.json();
          assert.equal(response.status,200);assert.equal(refusal.answer.status,'REFUSED');assert.equal(refusal.answer.localJob,undefined);
          publishedRefusals.push({kind,request:mutant,reply:refusal,httpStatus:response.status});
        }
      }
      console.log(JSON.stringify({project:label,packetId:packet.packetId,packetHash:evidence.localJob.packetHash,machineHttp:http,lowering:evidence.status,replay:evidence.run.status,physicalAdmission:evidence.admission.status}));
    }
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
    await page.waitForFunction(() => Boolean(document.getElementById('stb-current')?.contentWindow?.document
      ?.getElementById('stb-current')?.contentWindow?.document?.documentElement?.dataset.canonicalJourneyVersion), { timeout: 30000 });
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
    if(!index)await inspectVisuals(page,content.locator('#projects'),'desktop project library');
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
      await bench.locator('#stb-start-intent-screen').waitFor({state:'visible'});
      await inspectVisuals(page,bench,'desktop job1 intent',{required:['#stb-start-intent-screen .stb-user1-img','.stb-pick-ring']});
      const originalPhoto=await bench.locator('#stb-start-intent-screen .stb-user1-img').getAttribute('src');
      assert.equal(createHash('sha256').update(originalPhoto).digest('hex'),'2e494febcfc41895534055ab11e7ded433b3bd4e1319d82537d58489de4ba6b2','Preserve the exact original Job 1 photograph');
      await content.getByRole('button',{name:'Idea',exact:true}).click();
      await bench.locator('#stb-start-idea-screen').waitFor({state:'visible'});
      assert.equal(await bench.locator('#stb-idea-img').getAttribute('src'),originalPhoto,'Idea must retain the original Intent photograph');
      await inspectVisuals(page,bench,'desktop job1 idea',{required:['#stb-idea-img']});
      await bench.locator('#stb-idea-next').click();
      await bench.locator('#stb-intent-next').click({ timeout: 15000 });
      await bench.locator('#stb-start-bench-screen').waitFor({ state: 'visible', timeout: 15000 });
      // Both values must be from live Store replies, never from test fixtures.
      await bench.locator('#stb-price-total').filter({ hasText: '$8.62' })
        .waitFor({ state: 'visible', timeout: 30000 });
      await inspectVisuals(page,bench,'desktop job1 bench',{required:['#stb-user1-bench-svg']});
      assert.equal(await bench.locator('#stb-bench-dynamic-geometry line[stroke-width="5"]').count(),3,'Draw all three angled cuts');
      assert.equal(await bench.locator('#stb-bench-dynamic-geometry circle[stroke="#2f6f9e"]').count(),2,'Draw both defined spots');
      await bench.locator('#stb-confirm-store').click();
      await content.locator('#proof-store').waitFor({state:'visible',timeout:45000});
      await journey(content,'start-own','Project 1 default');
      await content.getByRole('button',{name:'2 · The bench',exact:true}).click();
      await bench.locator('button[data-length="18"]').click();
      await bench.locator('#stb-price-total').filter({ hasText: '$9.13' })
        .waitFor({ state: 'visible', timeout: 30000 });
      assert.ok(responses.some(r => r.path === '/api/store-zero/job' && r.status === 200),
        'Project 1 knob change did not reach the live pinned Store');
      await bench.locator('#stb-confirm-store').click();
      await content.locator('#proof-store').waitFor({state:'visible',timeout:45000});
      await journey(content,'start-own',label);
      assert.equal(await content.locator('#proof-record details').evaluate(e=>e.open),true,'Project documentation must start visible');
      // Exercise the real customer's independent spot X and depth inputs, not
      // a synthesized direct API call. The original accepted proof remains intact.
      await content.getByRole('button',{name:'2 · The bench',exact:true}).click();
      const beforeSpotRequests=responses.filter(r=>r.path==='/api/store-zero/job'&&r.status===200).length;
      await bench.locator('#stb-spot-location-mode').selectOption('selected');
      await bench.locator('#stb-spot-part1-x').fill('5.25');
      await bench.locator('#stb-spot-part2-x').fill('10.25');
      await bench.locator('#stb-spot-full-depth').fill('0.125');
      await bench.locator('#stb-def-spot-location').filter({hasText:'part 1 5¼ in from start'})
        .waitFor({state:'visible',timeout:15000});
      await bench.locator('#stb-price-total').filter({hasText:/\$\d/})
        .waitFor({state:'visible',timeout:45000});
      const drawnSpots=await bench.locator('#stb-bench-dynamic-geometry circle[stroke="#2f6f9e"]').evaluateAll(nodes=>nodes.map(n=>Number(n.getAttribute('cx'))));
      for(const [i,x] of [5.25,18+10.25].entries())assert.ok(Math.abs(drawnSpots[i]-(40+x*820/72))<1e-8,'The drawing must follow each selected longitudinal spot');
      const selected=await bench.locator('body').evaluate(()=>window.parent.STBStartOwnLive?.revision());
      const entered=selected?.facts?.['start-own.parts']?.value;
      assert.equal(entered?.[0]?.features?.[0]?.xIn,5.25);
      assert.equal(entered?.[1]?.features?.[0]?.xIn,10.25);
      assert.equal(entered?.[0]?.features?.[0]?.fullDiameterDepthIn,0.125);
      assert.equal(entered?.[0]?.features?.[0]?.locationRule,'PART_RELATIVE_FROM_START');
      assert.ok(responses.filter(r=>r.path==='/api/store-zero/job'&&r.status===200).length>beforeSpotRequests,
        'Selected spot coordinates and depth must trigger a fresh Store inquiry');
      await bench.locator('#stb-confirm-store').click();
      await content.locator('#proof-store').waitFor({state:'visible',timeout:45000});
      await journey(content,'start-own','Project 1 selected spots and depth');
      const acceptedSpots=project1Specimens.at(-1).machineRequest.packet.definition.demand.parts.flatMap(p=>p.features);
      assert.deepEqual(acceptedSpots.map(f=>f.xIn),[5.25,10.25]);
      assert.deepEqual(acceptedSpots.map(f=>f.fullDiameterDepthIn),[0.125,0.125]);
      await content.getByRole('button',{name:'2 · The bench',exact:true}).click();
      const depthRefusal=page.waitForResponse(async r=>{
        if(new URL(r.url()).pathname!=='/api/store-zero/job')return false;
        try{return (await r.json()).storeAnswer?.reasonCodes?.includes('SPOT_FULL_DIAMETER_DEPTH_EXCEEDS_MAX');}catch{return false;}
      },{timeout:45000});
      await bench.locator('#stb-spot-full-depth').fill('0.25');
      const refused=await (await depthRefusal).json();
      assert.equal(refused.storeAnswer.status,'REFUSED');assert.equal(refused.storeAnswer.Q,null);
      assert.equal(refused.jobSupportability.quoteComplete,false);
      const retryRefusal=page.waitForResponse(async r=>{
        if(new URL(r.url()).pathname!=='/api/store-zero/job')return false;
        try{const body=await r.json();return body.requestId!==refused.requestId&&body.storeAnswer?.reasonCodes?.includes('SPOT_FULL_DIAMETER_DEPTH_EXCEEDS_MAX');}catch{return false;}
      },{timeout:45000});
      // Confirm & Send performs another inquiry. Only complete support can
      // leave the Bench; it cannot accept or release a refused definition.
      await bench.locator('#stb-confirm-store').click();
      const retried=await (await retryRefusal).json();
      assert.notEqual(retried.requestId,refused.requestId);
      assert.equal(retried.storeAnswer.status,'REFUSED');assert.equal(retried.storeAnswer.Q,null);
      assert.equal(retried.jobSupportability.quoteComplete,false);
      assert.equal(await bench.locator('#stb-start-bench-screen').isVisible(),true);
      assert.equal(await content.locator('#proof-store').isVisible(),false);
      const noPacket=await content.locator('body').evaluate(async()=>{
        let owner=window;
        while(!owner.STBTermsFlow&&owner!==owner.parent)owner=owner.parent;
        return owner.STBTermsFlow.instance('start-own').acceptedPacket();
      });
      assert.equal(noPacket.status,'REFUSED','Refusal must invalidate the previous accepted revision');
      assert.equal(await content.getByRole('button',{name:'4 · Your call',exact:true}).isDisabled(),true);
      project1Refusals.push(refused,retried);
      console.log(JSON.stringify({ project: label, initialQ: 8.62, changedLengthIn: 18, revisedQ: 9.13,
        selectedSpotXIn:[5.25,10.25],fullDiameterDepthIn:0.125,liveStore:true }));
    }
    if (label === 'Alcove') {
      // The Alcove project tile opens its unnumbered Idea page first.
      if (await content.locator('#alcove-idea').isVisible()) {
        await inspectVisuals(page,content.locator('#alcove-idea'),'desktop alcove idea');
        await content.locator('#alcove-idea button[data-go="alcove-capture"]').first().click();
      }
      await content.locator('#alcove-capture').waitFor({ state: 'visible', timeout: 15000 });
      await inspectVisuals(page,content.locator('#alcove-capture'),'desktop alcove intent');
      await content.locator('#alcove-capture button[data-go="alcove-config"]').first().click();
      const price = content.locator('#alcove-bench-store-price');
      await price.filter({ hasText: /\$[0-9]+/ }).waitFor({ state: 'visible', timeout: 45000 });
      await inspectVisuals(page,content.locator('#alcove-config'),'desktop alcove bench');
      // F6: make the selection through the actual menu and carry its explicit exclusion to Your Call.
      const asButton=content.locator('#alcove-config .stb-as-trigger');
      await asButton.click();
      const asDialog=content.getByRole('dialog',{name:'Additional services'});
      await asDialog.getByRole('checkbox').first().check();
      await asDialog.getByRole('button',{name:'Close additional services'}).click();
      const pine = (await price.innerText()).trim();
      await content.locator('#confirm-alcove-inline').click();
      await content.locator('#store').waitFor({state:'visible',timeout:45000});
      // F7/F8: one current Store answer, not the historical yard example, governs every live status.
      const currentReceipt=await content.locator('body').evaluate(()=>({
        status:window.STBAlcoveStoreAnswer.rawEvaluation.status,
        hash:window.STBAlcoveStoreAnswer.evaluationReceipt.receiptHash,
        q:window.STBAlcoveStoreAnswer.rawEstimate?.totals?.Q
      }));
      const currentStatus=currentReceipt.status;
      await content.locator('#alcove-order-status').filter({hasText:currentStatus}).waitFor({timeout:15000});
      assert.equal((await content.locator('#alcove-order-status').innerText()).trim(),
        currentStatus+' · receipt '+currentReceipt.hash,'Live status must carry the current Store receipt');
      if(currentStatus==='SUPPORTABLE'){
        assert.ok(Number.isFinite(currentReceipt.q));
        assert.match(await content.locator('#alcove-current-capability').innerText(),
          new RegExp('\\$'+currentReceipt.q.toFixed(2).replace('.','\\.')));
      }
      const liveCapability=await content.locator('#alcove-current-capability').textContent();
      assert.ok(liveCapability.includes(currentStatus),'Current capability must come from fresh Store answer');
      assert.match(await content.locator('#alcove-store-yard-answer').textContent(),/Historical reference|HISTORICAL EXAMPLE/);
      const firstOffer=await content.locator('body').evaluate(async()=>{
        let host=window;while(!host.STBTermsFlow&&host!==host.parent)host=host.parent;
        const flow=host.STBTermsFlow.instance('alcove');
        for(let n=0;n<120;n++){
          const offer=flow.state().commercial?.events?.find(e=>e.eventType==='OfferIssued');
          if(offer)return offer.payload.offerId;
          await new Promise(resolve=>setTimeout(resolve,100));
        }
        throw Error('ALCOVE_INITIAL_OFFER_MISSING');
      });
      const serviceChoice=content.locator('#decisionRows .rowline').first().getByRole('button',{name:'Sanded 150'});
      await serviceChoice.click();
      const scopedOffer=await content.locator('body').evaluate(async()=>{
        let host=window;while(!host.STBTermsFlow&&host!==host.parent)host=host.parent;
        const flow=host.STBTermsFlow.instance('alcove');
        for(let n=0;n<120;n++){
          const state=flow.state();
          const offer=state.commercial?.events?.find(e=>e.eventType==='OfferIssued');
          if(offer?.payload?.extras?.some(e=>e.kind==='alcove-choice-01'&&e.selection==='Sanded 150'))
            return {offer:offer.payload,scope:state.scopeRequests};
          await new Promise(resolve=>setTimeout(resolve,100));
        }
        throw Error('ALCOVE_SELECTED_SERVICE_MISSING_FROM_SELLER_OFFER');
      });
      assert.notEqual(scopedOffer.offer.offerId,firstOffer,'An Alcove service change must retire the previous simulated offer');
      assert.equal(scopedOffer.scope.length,10,'All ten customer service selections must survive to offer scope');
      assert.equal(scopedOffer.offer.extras.filter(e=>e.kind.startsWith('alcove-choice-')).length,10,
        'Every Alcove choice must be separately recorded with its disposition');
      assert.ok(scopedOffer.scope.some(e=>e.label==='Edge condition'&&e.selection==='Sanded 150'&&e.disposition==='UNRESOLVED'));
      assert.ok(scopedOffer.offer.extras.some(e=>e.kind==='alcove-choice-01'&&e.disposition==='UNRESOLVED'));
      assert.match(await content.locator('#request [data-unaccepted-services]').textContent(),/Sanded 150/);
      await journey(content,'alcove','Alcove default');
      await content.getByRole('button',{name:'2 · The bench',exact:true}).click();
      await content.locator('#alcove-config').waitFor({state:'visible'});
      const before = responses.filter(r => r.path === '/api/store-zero/job' && r.status === 200).length;
      // Hold the real next inquiry in transit; no answer or price is substituted.
      let releaseInquiry;
      const pendingInquiry = new Promise(resolve => { releaseInquiry = resolve; });
      const inTransit = [];
      const holdInquiry = route => {
        const handled = (async () => {
          if (route.request().postDataJSON()?.projectId === 'alcove') await pendingInquiry;
          await route.continue();
        })();
        inTransit.push(handled);
        return handled;
      };
      await page.route('**/api/store-zero/job', holdInquiry);
      const sent = page.waitForRequest(r => new URL(r.url()).pathname === '/api/store-zero/job' && r.postDataJSON()?.projectId === 'alcove');
      try {
        await content.locator('#alcove-config button[data-material="poplar"]').click();
        await sent;
        for (const id of ['p-price','r-q','review-price','store-price'])
          assert.equal(await content.locator('#'+id).textContent(), 'ASKING STORE ZERO…', id+': obsolete amount remained while pending');
      } finally {
        releaseInquiry();
        await Promise.all(inTransit);
        await page.unroute('**/api/store-zero/job', holdInquiry);
      }
      await price.filter({ hasNotText: pine }).waitFor({ state: 'visible', timeout: 45000 });
      await price.filter({ hasText: /\$[0-9]+/ }).waitFor({ state: 'visible', timeout: 45000 });
      const poplar = (await price.innerText()).trim();
      assert.notEqual(poplar, pine, 'Changing Alcove species failed to update the visible Store Q');
      const after = responses.filter(r => r.path === '/api/store-zero/job' && r.status === 200).length;
      assert.ok(after > before, 'Alcove species change did not receive a new Store answer');
      await content.locator('#confirm-alcove-inline').click();
      await content.locator('#store').waitFor({state:'visible',timeout:45000});
      await journey(content,'alcove','Alcove revised species');
      // P1 #1: The real Store search contains cherry rows mentioning oak in their description.
      // These rows must not prevent the oak material demand from reaching manufacturing evaluation.
      await content.getByRole('button',{name:'2 · The bench',exact:true}).click();
      await content.locator('#alcove-config').waitFor({state:'visible'});
      const oakLookup = page.waitForResponse(r=>new URL(r.url()).pathname==='/api/store-zero/offering'
        &&r.request().postDataJSON()?.projectId==='alcove',{timeout:45000});
      const oakEvaluation = page.waitForResponse(r=>new URL(r.url()).pathname==='/api/store-zero/job'
        &&r.request().postDataJSON()?.projectId==='alcove',{timeout:45000});
      await content.locator('#alcove-config button[data-material="oak"]').click();
      const lookupBody = JSON.stringify(await (await oakLookup).json());
      assert.ok(lookupBody.includes('"species":"cherry"')&&lookupBody.includes('"species":"oak"'),
        'Oak discovery regression must exercise the real mixed-species Store search');
      assert.equal((await oakEvaluation).status(),200,'Oak must reach the Store, whether supported or honestly refused');
      await content.locator('#p-price').filter({hasNotText:/ASKING STORE ZERO|NOT SENT TO THE STORE/}).waitFor({timeout:45000});
      const oakAdmission=await content.locator('body').evaluate(()=>window.STBAlcoveLive.admission());
      assert.equal(oakAdmission.admission.result,'ADMITTED');
      assert.equal(oakAdmission.request.facts['alcove.material'].species,'oak');
      const oakState=await content.locator('body').evaluate(()=>window.STBAlcoveLive.state());
      assert.equal(oakState.answer.authority,'CURRENT','Oak must show its actual returned answer');
      // Restore a known stocked species so dimension regressions compare actual Store replies.
      const pineEvaluation = page.waitForResponse(r=>new URL(r.url()).pathname==='/api/store-zero/job'
        &&r.request().postDataJSON()?.projectId==='alcove',{timeout:45000});
      await content.locator('#alcove-config button[data-material="pine"]').click();
      assert.equal((await pineEvaluation).status(),200);
      await price.filter({hasText:/\$[0-9]+/}).waitFor({timeout:45000});

      // P1 #2: The user's unit height, not the highest shelf, controls the entered field.
      const h=content.locator('#x-h');
      const quoteRequests=()=>responses.filter(r=>r.path==='/api/store-zero/job'&&r.status===200).length;
      const beforeConflict=quoteRequests();
      await h.fill('60');
      await h.press('Enter');
      await content.locator('#p-price').filter({hasText:'NOT SENT TO THE STORE'}).waitFor({timeout:15000});
      assert.equal(await h.inputValue(),'60');
      assert.equal(await content.locator('#c-h').inputValue(),'60');
      assert.ok((await content.locator('#alcove-dimension-feedback').innerText()).includes('65 in'));
      assert.equal((await content.locator('body').evaluate(()=>window.STBAlcoveLive.revision()))
        .facts['alcove.opening'].status,'UNRESOLVED');
      assert.equal(quoteRequests(),beforeConflict,'Conflicting unit height must not reach the Store');
      await content.locator('#confirm-alcove-inline').click();
      assert.equal(await content.locator('#alcove-config').isVisible(),true,'Cannot confirm a conflicting height');
      const correctedHeight=page.waitForResponse(r=>new URL(r.url()).pathname==='/api/store-zero/job'
        &&r.request().postDataJSON()?.projectId==='alcove',{timeout:45000});
      await h.fill('68');await h.press('Enter');
      assert.equal((await correctedHeight).status(),200,'Resolved height must reach Store evaluation');
      await price.filter({hasText:/\$[0-9]+/}).waitFor({timeout:45000});

      // P1 #3: malformed text and out-of-range numbers must remain visible and unadmitted.
      const w=content.locator('#x-w'),originalWidth=await content.locator('#c-w').inputValue();
      const beforeMalformed=quoteRequests();
      await w.fill('40junk');await w.press('Enter');
      await content.locator('#p-price').filter({hasText:'NOT SENT TO THE STORE'}).waitFor({timeout:15000});
      assert.equal(await w.inputValue(),'40junk');
      assert.equal(await content.locator('#c-w').inputValue(),originalWidth);
      assert.equal(await w.getAttribute('aria-invalid'),'true');
      assert.ok((await content.locator('#alcove-dimension-feedback').innerText()).includes('42–45 1/2'));
      assert.equal(quoteRequests(),beforeMalformed,'Malformed exact width must not be submitted');
      await w.fill('40');await w.press('Enter');
      assert.equal(await w.inputValue(),'40','Out-of-range exact entry must not be clamped to 42');
      assert.equal(await content.locator('#c-w').inputValue(),originalWidth);
      const correctedWidth=page.waitForResponse(r=>new URL(r.url()).pathname==='/api/store-zero/job'
        &&r.request().postDataJSON()?.projectId==='alcove',{timeout:45000});
      await w.fill('42 1/2');await w.press('Enter');
      assert.equal((await correctedWidth).status(),200,'Complete in-bounds fraction must reach the Store');
      assert.equal(await content.locator('#c-w').inputValue(),'42.5');
      assert.equal(await w.getAttribute('aria-invalid'),'false');
      console.log(JSON.stringify({project:label,pine,poplar,oakLookupMixed:true,oakAdmitted:true,
        heightConflictBlocked:true,invalidExactPreserved:true,fractionAccepted:true,freshStoreAnswer:true}));
    }
    if (label === 'Window Seat') {
      assert.ok((await content.locator('iframe#window-seat-frame').getAttribute('src')).includes('?v=public-conformance-20261017'),'The host must invalidate the previously cached Window Seat page');
      const seat = content.frameLocator('iframe#window-seat-frame');
      const before = responses.filter(r => r.path === '/api/store-zero/job' && r.status === 200).length;
      await seat.locator('#s-hero').waitFor({state:'visible'});
      await inspectVisuals(page,seat,'desktop window seat idea');
      await seat.locator('#s-hero button[data-to="intent"]').click({ timeout: 15000 });
      await inspectVisuals(page,seat,'desktop window seat intent');
      await seat.locator('#s-intent .forward-heading button[data-to="bench"]').click({ timeout: 15000 });
      const money = seat.locator('#bench-money');
      await money.filter({ hasText: /\$[0-9]+/ }).waitFor({ state: 'visible', timeout: 45000 });
      await inspectVisuals(page,seat,'desktop window seat bench');
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
      const auditText=await seat.locator('body').evaluate(()=>window.STBWindowSeat.auditText());
      const auditMatch=auditText.match(/1\. Save this as window-seat\.json:\n([^]*?)\n2\. Get the Store/);
      assert.ok(auditMatch,'Window Seat audit must export a complete reproducible request');
      const auditRequest=JSON.parse(auditMatch[1]);
      assert.equal(auditRequest.requestId,pine.requestId);
      assert.equal(auditRequest.requestType,pine.mappedCallInputs.requestType);
      assert.deepEqual(auditRequest.demand,pine.mappedCallInputs.demand);
      assert.deepEqual(auditRequest.manifest,pine.mappedCallInputs.manifest);
      await profilePinnedStoreAnswer({...pine,requestId:auditRequest.requestId,mappedCallInputs:auditRequest});
      await seat.locator('#btn-ask').click();
      await journey(seat,'window-seat','Window Seat default');
      await content.getByRole('button',{name:'2 · The bench',exact:true}).click();
      await seat.locator('#s-bench').waitFor({state:'visible'});
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
      await journey(seat,'window-seat','Window Seat revised dimensions');
      const seatTerms=await seat.locator('body').evaluate(()=>window.STBWindowSeat.state().terms);
      assert.equal(seatTerms.commercial.physicalAuthority,false);
      assert.equal(seatTerms.commercial.paymentAuthority,false);
      assert.equal(await seat.locator('body').evaluate(()=>window.STBTermsFlow.verify(window.STBWindowSeat.state().terms)),true);
      extendedSeatConfigReads=configRequests.length-configReadsBeforeSpeciesChecks;
      console.log(JSON.stringify({project:label,benchPrice:quote,poplar:poplarPrice,oakStockShortageVisible:true,
        oakMillingQ:oak.rawEvaluation.Q,missingStockRefusalVisible:true,freshStoreAnswer:true}));
    }
    if (label === 'Outdoor') {
      assert.ok((await content.locator('iframe#outdoor-bench-leg-frame').getAttribute('src')).includes('?v=public-conformance-20261017'),'The host must invalidate the previously cached Outdoor page');
      const outdoor = content.frameLocator('iframe#outdoor-bench-leg-frame');
      assert.ok((await outdoor.locator('script[src*="stb-outdoor-option-requests.js"]').getAttribute('src')).includes('?v=selected-first-20261015'),'The corrected queue must not reuse the previously cached script');
      const before = responses.filter(r => r.path === '/api/store-zero/job' && r.status === 200).length;
      await outdoor.locator('#s-idea').waitFor({state:'visible'});
      await inspectVisuals(page,outdoor,'desktop outdoor idea',{expectArt:false});
      await outdoor.locator('#idea-next').click({ timeout: 15000 });
      await inspectVisuals(page,outdoor,'desktop outdoor intent');
      await outdoor.locator('#s-intent [data-to-bench]').click({ timeout: 15000 });
      const money = outdoor.locator('#outdoor-definition-price');
      let quote;
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
      const sourcePlan=await waitOutdoorAnswer();
      await inspectVisuals(page,outdoor,'desktop outdoor bench');
      assert.equal(sourcePlan.rawEvaluation.status,'SUPPORTABLE',JSON.stringify(sourcePlan.rawEvaluation.reasonRecords));
      assert.ok(typeof sourcePlan.rawEvaluation.Q==='number' && sourcePlan.rawEvaluation.Q>0);
      assert.equal((await money.innerText()).trim(),String.fromCharCode(36)+sourcePlan.rawEvaluation.Q.toFixed(2));
      const braces=sourcePlan.rawEvaluation.operations.filter(e=>e.kind==='STOCK_ENVELOPE_DERIVED' && e.subject.startsWith('BRACE-'));
      const braceEnvelope=32.875+3.5*Math.tan(25*Math.PI/180);
      assert.equal(braces.length,2,'Both cross supports must have separate stock envelopes');
      assert.ok(braces.every(e=>Math.abs(e.stockEnvelopeLengthIn-braceEnvelope)<1e-9));
      assert.ok(sourcePlan.rawEvaluation.parents.some(p=>p.components?.some(c=>c.partId.startsWith('BRACE-'))),
        'The quote must contain Store parent-stock planning');
      await outdoor.locator('#bench-confirm').click();
      await journey(outdoor,'outdoor','Outdoor · A-frame');
      const planResults=[];
      for (const [plan, initialQ, revisedQ] of [['table-benches',288.23,321.94]]) {
        if (plan==='table-benches') {
          await content.getByRole('button',{name:'1 · Intent',exact:true}).click();
          await outdoor.locator('#s-intent [data-plan="table-benches"]').click();
        }
        const initial=await waitOutdoorAnswer();
        quote=(await money.innerText()).trim();
        assert.ok(responses.filter(r => r.path === '/api/store-zero/job' && r.status === 200).length > before);
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
        const measurements=[],previewSequences=[];let lastSelectedAnswer=null;
        for(const length of [84,96,108]){
          const start=performance.now();
          await outdoor.locator('#s-build [data-size="12"]').click();
          const prefix=await outdoor.locator('body').evaluate(()=>window.STBOutdoorPicnic.optionsRequest().configurationVersion);
          previewSequences.push({prefix,changedAt:start});
          const activePreview=length===84?page.waitForRequest(r=>outdoorWire(r)?.candidateRevisionId===prefix+'-wood-treated',{timeout:45000}):null;
          const answer=await waitOutdoorAnswer();
          assert.equal(answer.rawEvaluation.status,'SUPPORTABLE');
          assert.equal((await money.innerText()).trim(),'$'+answer.rawEvaluation.Q.toFixed(2));
          lastSelectedAnswer=answer;
          const selectedRequest=outdoorRequests.findLast(x=>x.wire.candidateRevisionId===answer.candidateRevisionId);
          const completedAt=performance.now();
          measurements.push({length,elapsedMs:Math.round(completedAt-start),Q:answer.rawEvaluation.Q,
            beforeHttpMs:selectedRequest?Math.round(selectedRequest.started-start):null,
            systemStoreHttpMs:selectedRequest?.finished?Math.round(selectedRequest.finished-selectedRequest.started):null,
            afterHttpMs:selectedRequest?.finished?Math.round(completedAt-selectedRequest.finished):null,
            searchNodes:answer.rawEvaluation.optimization?.nodes??null,receipt:answer.evaluationReceipt.receiptHash});
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
        outdoorProfileTargets.push({plan,body:lastSelectedAnswer});
        planResults.push({plan,initialQ,revisedQ,wholeJobRefusalVisible:true,recovery:true});
      }
      // Read the final current comparisons before navigation destroys their response bodies.
      await content.getByRole('button',{name:'2 · The bench',exact:true}).click();
      await outdoor.locator('#woods').filter({hasNotText:/…|\?/}).waitFor({state:'visible',timeout:180000});
      await outdoor.locator('#tiers').filter({hasNotText:/…|\?/}).waitFor({state:'visible',timeout:180000});
      await Promise.all(responseReads);
      await outdoor.locator('#to-edge').click();
      await outdoor.locator('#s-edge').waitFor({state:'visible'});
      const part=outdoor.locator('#parts-bench .part').first();
      const kind=await part.getAttribute('data-part');
      await part.locator('[data-tool="spots"]').click();
      assert.equal(await outdoor.locator('#send-work').isDisabled(),true,'Missing spot locations must block this work');
      await part.locator('[data-in="fromEndIn"]').fill('2');
      await part.locator('[data-in="place"]').selectOption('CENTER');
      const spotted=await waitOutdoorAnswer();
      assert.equal(spotted.rawEvaluation.status,'SUPPORTABLE');
      assert.ok(spotted.mappedCallInputs.manifest.featureIds.some(id=>id.startsWith(kind+'-')&&id.includes('SPOT')),'Added locations must reach the independent manifest');
      await inspectVisuals(page,outdoor,'desktop outdoor bigger bench');
      await part.locator('[data-tool="deco"]').click();
      await part.locator('[data-in="angle"]').fill('85');
      const steep=await waitOutdoorAnswer();
      assert.equal(steep.rawEvaluation.status,'REFUSED');assert.equal(steep.rawEvaluation.Q,null);
      assert.equal(await outdoor.locator('#send-work').isDisabled(),true);
      await outdoor.locator('#back-plan').click();
      const recovered=await waitOutdoorAnswer();
      assert.equal(recovered.rawEvaluation.status,'SUPPORTABLE');
      assert.equal(recovered.mappedCallInputs.manifest.featureIds.some(id=>id.includes('SPOT')),false,'Back to the plan must remove only the added work');
      extendedOutdoorConfigReads=configRequests.length-extraConfigStart;
      console.log(JSON.stringify({ project: label, benchPrice: quote, liveStore: true, planResults }));
    }
    if (label === 'Playhouse') {
      const before = responses.filter(r => r.path === '/api/store-zero/job' && r.status === 200).length;
      await inspectVisuals(page,content.locator('#playhouse-idea'),'desktop playhouse idea');
      await content.locator('#playhouse-idea button[data-canonical-go="playhouse-s001"]').click({ timeout: 15000 });
      await content.locator('#playhouse-s001').waitFor({ state: 'visible', timeout: 15000 });
      await inspectVisuals(page,content.locator('#playhouse-s001'),'desktop playhouse intent');
      await content.locator('#ph-to-bench').click({ timeout: 15000 });
      await content.locator('#playhouse-machine').waitFor({ state: 'visible', timeout: 15000 });
      await inspectVisuals(page,content.locator('#playhouse-machine'),'desktop playhouse bench');
      const originalOpeningPath=await content.locator('#s001-opening-path').getAttribute('d');
      assert.match(originalOpeningPath,/ A /,'The opening must contain its actual circular arc');
      assert.equal(await content.locator('#s001-tab-markers circle').count(),4,'Show all four reference retention tabs');
      await content.locator('#playhouse-machine button[data-canonical-go="playhouse-store"]').click({ timeout: 15000 });
      const quote = content.locator('#s001-live-q');
      await quote.filter({ hasText: /\$[0-9]+/ }).waitFor({ state: 'visible', timeout: 45000 });
      assert.ok(responses.filter(r => r.path === '/api/store-zero/job' && r.status === 200).length > before,
        'Playhouse sheet definition received no current Store answer');
      await journey(content,'playhouse','Playhouse default');
      assert.equal(await content.locator('#playhouse-result [data-s001-bind="status"]').textContent(),'SUPPORTABLE','Recap must show the actual matching Store status');
      assert.equal(await content.locator('#playhouse-record [data-s001-bind="status"]').textContent(),'SUPPORTABLE','The owner record must carry that same actual result');
      await content.getByRole('button',{name:'2 · The bench',exact:true}).click();
      await content.locator('#playhouse-machine').waitFor({state:'visible'});
      const opening=content.locator('#s001-opening-width');
      assert.equal(await opening.isDisabled(),true,'The library copy remains read only');
      await content.locator('[data-canonical-preview-action="edit"]:visible').click();
      assert.equal(await opening.isEnabled(),true);
      const widthBefore=Number(await opening.inputValue());
      await opening.focus();await opening.press('ArrowLeft');
      assert.equal(Number(await opening.inputValue()),widthBefore-0.5);
      assert.notEqual(await content.locator('#s001-opening-path').getAttribute('d'),originalOpeningPath,'The drawing must update with the revised opening');
      assert.ok(Number(await content.locator('#s001-straight-height').getAttribute('min'))>0);
      assert.ok(Number(await content.locator('#s001-arch-rise').getAttribute('min'))>0);
      const oldPlayhouse=publishedJobs.findLast(r=>r.projectId==='playhouse');
      await content.locator('#playhouse-machine button[data-canonical-go="playhouse-store"]').click();
      await quote.filter({hasText:'$76.49'}).waitFor({state:'visible',timeout:45000});
      await journey(content,'playhouse','Playhouse revised width');
      const revisedPlayhouse=publishedJobs.at(-1);
      assert.equal(revisedPlayhouse.machineRequest.packet.definition.demand.features.find(f=>f.featureId==='OPENING').widthIn,widthBefore-0.5);
      assert.notEqual(revisedPlayhouse.applicationAnswer.candidateRevisionId,oldPlayhouse.applicationAnswer.candidateRevisionId);
      assert.notEqual(revisedPlayhouse.applicationAnswer.evaluationReceipt.receiptHash,oldPlayhouse.applicationAnswer.evaluationReceipt.receiptHash);
      assert.notEqual(revisedPlayhouse.machineReply.answer.localJob.packetHash,oldPlayhouse.machineReply.answer.localJob.packetHash);
      const playhouse=await content.locator('body').evaluate(()=>window.STBPlayhouseLive.terms());
      assert.equal(playhouse.commercial.physicalAuthority,false);
      assert.equal(playhouse.commercial.paymentAuthority,false);
      // F5: review the same added pattern/crosscut revision actually priced by the Store.
      await content.getByRole('button',{name:'1 · Intent',exact:true}).click();
      await content.locator('#ph-add-select').selectOption('PATTERN');
      await content.locator('#ph-add-go').click();
      await content.locator('#ph-add-select').selectOption('MANUAL_CUT');
      await content.locator('#ph-add-go').click();
      await content.getByRole('button',{name:'2 · The bench',exact:true}).click();
      const patternSlider=content.locator('#playhouse-machine input[data-ph-field="offsetXIn"]');
      const pricedReply=page.waitForResponse(r=>new URL(r.url()).pathname==='/api/store-zero/job'
        &&r.request().postDataJSON()?.projectId==='playhouse'
        &&r.request().postDataJSON()?.payload?.definition?.features?.some(f=>f.featureId==='PATTERN'&&f.offsetXIn===2),{timeout:45000});
      await patternSlider.evaluate(el=>{el.value='2';el.dispatchEvent(new Event('input',{bubbles:true}))});
      const priced=await pricedReply;
      const pricedBody=await priced.json();
      assert.equal(pricedBody.rawEvaluation.status,'SUPPORTABLE','Pattern and manual third cut must be evaluated, not waved through');
      assert.equal(pricedBody.rawEvaluation.freshEvaluation,true);
      const sentDefinition=priced.request().postDataJSON().payload.definition;
      await content.locator('#playhouse-machine button[data-canonical-go="playhouse-store"]').click();
      await content.locator('#s001-live-q').filter({hasText:/\$[0-9]+/}).waitFor({timeout:45000});
      await content.locator('#playhouse-store button[data-canonical-go="playhouse-review"]').click();
      const reviewItems=await content.locator('#s001-review-features li').allTextContents();
      assert.equal(reviewItems.length,sentDefinition.features.length,'REVIEW feature count must match the admitted Store definition');
      for(const feature of sentDefinition.features)assert.ok(reviewItems.some(text=>text.includes(feature.featureId)), 'Missing Store-bound review feature '+feature.featureId);
      assert.match(reviewItems.join(' '),/2 in X/,'REVIEW must identify actual pattern placement');
      assert.match(await content.locator('#s001-review-sheet').textContent(),/STB-ZERO-PLY/);
      assert.ok((await content.locator('#s001-review-version').textContent()).includes(pricedBody.requestId));
      // F4: a new out-of-field revision receives a REAL, fresh geometry refusal without
      // rawEvaluation.configurationVersion; it must never be relabeled as a transport-version error.
      await content.getByRole('button',{name:'2 · The bench',exact:true}).click();
      const refusedReply=page.waitForResponse(r=>new URL(r.url()).pathname==='/api/store-zero/job'
        &&r.request().postDataJSON()?.projectId==='playhouse'
        &&r.request().postDataJSON()?.payload?.definition?.features?.some(f=>f.featureId==='PATTERN'&&f.offsetXIn===7),{timeout:45000});
      await patternSlider.evaluate(el=>{el.value='7';el.dispatchEvent(new Event('input',{bubbles:true}))});
      const refusedBody=await (await refusedReply).json();
      assert.equal(refusedBody.rawEvaluation.status,'REFUSED');
      assert.equal(refusedBody.rawEvaluation.freshEvaluation,true);
      assert.equal(refusedBody.rawEvaluation.configurationVersion,undefined,'Real geometric refusals do not carry raw configurationVersion');
      assert.ok(refusedBody.rawEvaluation.reasonCodes.includes('ROUTED_PROFILE_OUTSIDE_WORK_FIELD'));
      assert.equal(refusedBody.rawEvaluation.totals,null,'Store refusal is not a Q');
      await content.locator('#playhouse-machine button[data-canonical-go="playhouse-store"]').click();
      await content.locator('#s001-live-reasons').filter({hasText:'ROUTED_PROFILE_OUTSIDE_WORK_FIELD'}).waitFor({timeout:45000});
      assert.equal(await content.locator('#s001-live-answer').getAttribute('data-store-status'),'REFUSED');
      assert.equal(await content.locator('#s001-live-q').textContent(),'—','Refused geometry must not show a made-up price');
      assert.equal(await content.locator('#playhouse-review button[data-s001-needs-supportable]').isDisabled(),true);
      console.log(JSON.stringify({project:label,pricedReviewFeatureCount:reviewItems.length,geometryRefusalPreserved:true,rawRefusalUnversioned:true,liveStore:true}));
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
  // and geometry/Outdoor probes have separately counted configuration reads.
  // Keep the original allowance for the five-project navigation itself.
  assert.ok(configRequests.length-extendedSeatConfigReads-extendedOutdoorConfigReads <= 12,
    'Repeated runtime config fetches remain excessive: ' + configRequests.length);
  for(const {plan,body} of outdoorProfileTargets){
    const stages=await profilePinnedStoreAnswer(body);
    console.log(JSON.stringify({project:'Outdoor pinned Store stage profile',plan,...stages}));
  }
  console.log(JSON.stringify({ fiveProjectsMounted: true, storePin: config.storePin,
    configRequests: configRequests.length, extendedSeatConfigReads, extendedOutdoorConfigReads, storeResponses: responses }));
  assert.deepEqual(project1Specimens.map(s=>s.lengthIn),[16,18,18]);
  assert.deepEqual(Object.fromEntries(['start-own','alcove','window-seat','outdoor','playhouse'].map(id=>[id,publishedJobs.filter(r=>r.projectId===id).length])),{'start-own':3,alcove:2,'window-seat':2,outdoor:2,playhouse:2});
  for(const id of ['start-own','alcove','window-seat','outdoor','playhouse']){
    const jobs=publishedJobs.filter(r=>r.projectId===id);
    // Master §3 distinguishes owner revisions from reusable manufacturing configuration labels.
    assert.equal(new Set(jobs.map(r=>r.applicationAnswer.candidateRevisionId)).size,jobs.length,id+': each accepted owner definition must have its own revision');
    assert.equal(new Set(jobs.map(r=>r.applicationAnswer.evaluationReceipt.receiptHash)).size,jobs.length,id+': later work must not reuse an earlier receipt');
    assert.equal(new Set(jobs.map(r=>r.machineReply.answer.localJob.packetHash)).size,jobs.length,id+': each lowering must bind its actual packet');
  }
  const toolLink=readFileSync('README.md','utf8').match(/\[registered component tool\]\(([^)]+)\)/)?.[1];
  assert.ok(toolLink,'The README must expose its registered tool');
  const toolDestination=new URL(toolLink);
  assert.equal(toolDestination.origin,'https://system-candidate-production.up.railway.app');
  const additionalJob=await exerciseComponentTool(page,{base,entryPath:toolDestination.pathname+toolDestination.search,storeOrigin:process.env.STORE_ZERO_ORIGIN||'http://127.0.0.1:8091',storePin:expectedPin});
  await inspectNarrowJourneys(page,base);
  await Promise.all(responseReads);
  assert.deepEqual(pageErrors,[], 'The additional public tool must not introduce browser errors');
  assert.deepEqual(consoleErrors,[],'Customer journeys must not emit console errors');
  assert.deepEqual(resourceErrors,[],'Essential browser resources must load with their correct MIME types');
  const systemRevision=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
  const dirty=execFileSync('git',['status','--porcelain','--untracked-files=no'],{encoding:'utf8'}).trim().length>0;
  if(process.env.CI)assert.equal(dirty,false,'Published proof must identify a clean System checkout');
  mkdirSync('artifacts',{recursive:true});
  writeFileSync('artifacts/project-1-current-proof.json',JSON.stringify({schema:'PROJECT-1-BROWSER-PROOF-1',systemRevision,workingTreeModified:dirty,storeRevision:expectedPin,conditions:{node:process.version,chromium:browser.version(),base,launchArgs},physicalAuthority:false,specimens:project1Specimens,refusals:project1Refusals,publishedJobs,publishedRefusals,additionalJob,visualEvidence,resourceChecks,navigationAborts},null,2)+'\n');
  await page.close();
} catch (error) {
  failed = true;
  if(page&&!page.isClosed())await page.screenshot({path:'artifacts/visual/failure.png'}).catch(()=>{});
  console.error(error?.stack || String(error));
} finally {
  writeFileSync('artifacts/visual/inspection.json',JSON.stringify({failed,visualEvidence},null,2)+'\n');
  await browser.close();
}
if (failed) process.exitCode = 1;
