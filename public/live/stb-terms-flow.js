(function(root){
  'use strict';

  // One shared evidence-gated commercial sequence. A customer decision is not seller acceptance,
  // payment, allocation or production. Missing seller terms and source evidence remain pending.
  const VERSION = 'STB-TERMS-FLOW-1';
  const EVENTS = Object.freeze([
    Object.freeze({ id:'sent',      label:'Your definition · sent',                  who:'you' }),
    Object.freeze({ id:'arrived',   label:'Arrived at Store Zero · receipt',         who:'store' }),
    Object.freeze({ id:'answered',  label:'Store answered · budgetary answer',       who:'store' }),
    Object.freeze({ id:'offered',   label:'Simulated offer · created',               who:'system demo' }),
    Object.freeze({ id:'decision',  label:'Your call',                               who:'you' }),
    Object.freeze({ id:'paid',      label:'Paid (simulated)',                        who:'commercial simulation' }),
    Object.freeze({ id:'queued',    label:'Sent to the Store · in the yard queue',   who:'yard' }),
    Object.freeze({ id:'allocated', label:'Material allocated',                      who:'store' }),
    Object.freeze({ id:'released',  label:'Production released',                     who:'release' }),
    Object.freeze({ id:'cut',       label:'Cut · mill · drill · label',              who:'local cell' }),
    Object.freeze({ id:'staged',    label:'Packaging / staging',                     who:'yard' }),
    Object.freeze({ id:'ready',     label:'READY notice',                            who:'fulfillment' }),
    Object.freeze({ id:'custody',   label:'Picked up · custody (handoff)',           who:'you' })
  ]);
  const COMMERCIAL_ALIASES=Object.freeze({StoreAnswerAttached:'answered',OfferIssued:'offered',CustomerDecisionRecorded:'decision',OrderAccepted:'order',FinancialEventRecorded:'paid',ReservationConfirmed:'reserved',CapacityCommitmentRecorded:'capacity',QueueEntryConfirmed:'queued',MaterialAllocated:'allocated',MaterialIssued:'issued',ProductionReleaseRecorded:'released',LocalPlanBound:'plan',LocalAdmissionRecorded:'admitted',ExecutionEventRecorded:'cut',InspectionDispositionRecorded:'inspected',StagingRecorded:'staged',ReadyNoticeRecorded:'ready',CustodyTransferred:'custody',ProjectCloseoutRecorded:'closed',ExceptionRecorded:'exception'});
  const CONFIG_ROOTS = Object.freeze({
    alcove:'#alcove-config',
    'window-seat':'#s-configure'
  });
  const START_OWN_CONTROLS = 'button[data-length],#stb-config-length,button[data-species]';
  const DOWNSTREAM_STAGES = new Set(['request','review','yard','terms','recap','record']);
  const INSTANCES = new Map();
  const WATCHED_DOCS = new WeakSet();
  const WATCHED_DOC_LIST = new Set();

  function canonical(value){
    if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
    if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + canonical(value[k])).join(',') + '}';
    return JSON.stringify(value === undefined ? null : value);
  }
  async function sha256(value){
    const bytes = new TextEncoder().encode(canonical(value));
    const digest = await root.crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2,'0')).join('');
  }
  const now = () => new Date().toISOString();
  const shortId = prefix => prefix + '-' + root.crypto.randomUUID().slice(0,8).toUpperCase();
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const money = n => Number.isFinite(Number(n)) ? '$' + Number(n).toFixed(2) : '—';

  function closeDownstreamNav(projectId){
    for (const doc of WATCHED_DOC_LIST) {
      try {
        doc.querySelectorAll(`.recovery-nav button[data-job-project="${projectId}"]`).forEach(button => {
          if (!DOWNSTREAM_STAGES.has(button.dataset.journeyStage)) return;
          button.disabled = true;
          button.setAttribute('aria-disabled','true');
        });
      } catch (_) { /* a stale document reference never reopens authority */ }
    }
  }

  function watchDefinitionDocument(doc){
    if (!doc || WATCHED_DOCS.has(doc)) return;
    WATCHED_DOCS.add(doc);
    WATCHED_DOC_LIST.add(doc);

    const fromDefinitionControl = event => {
      const target = event.target;
      if (!target?.closest) return;

      for (const [projectId, selector] of Object.entries(CONFIG_ROOTS)) {
        const flow = INSTANCES.get(projectId);
        if (!flow || !target.closest(selector) || target.closest('.stb-terms')) continue;
        if (event.type === 'click' && !target.closest('button,[data-material],[data-depth],[data-n],[data-k]')) continue;
        flow.invalidate();
        return;
      }

      const startOwn = INSTANCES.get('start-own');
      if (startOwn && target.closest(START_OWN_CONTROLS)) startOwn.invalidate();
    };
    doc.addEventListener('input', fromDefinitionControl, true);
    doc.addEventListener('change', fromDefinitionControl, true);
    doc.addEventListener('click', fromDefinitionControl, true);

    const attachFrames = () => {
      for (const frame of doc.querySelectorAll('iframe')) {
        try { if (frame.contentDocument) watchDefinitionDocument(frame.contentDocument); } catch (_) { /* cross-origin frames are not project controls */ }
        if (frame.dataset.stbTermsWatchBound === 'true') continue;
        frame.dataset.stbTermsWatchBound = 'true';
        frame.addEventListener('load', () => {
          try { if (frame.contentDocument) watchDefinitionDocument(frame.contentDocument); } catch (_) { /* same boundary */ }
        });
      }
    };
    attachFrames();
    const MutationObserverCtor = doc.defaultView?.MutationObserver || root.MutationObserver;
    if (doc.documentElement && MutationObserverCtor) {
      new MutationObserverCtor(attachFrames).observe(doc.documentElement, { childList:true, subtree:true });
    }
  }

  function create({ projectId, title, demoCommerce = false }){
    if (!projectId) throw new Error('TERMS_FLOW_PROJECT_REQUIRED');
    let chain = null;
    let invalidatedIdentity = null;
    const history = [];
    const listeners = new Set();
    const notify = () => listeners.forEach(fn => { try { fn(state()); } catch (_) { /* a listener never breaks the flow */ } });

    function event(id){ return chain?.events.find(e => e.id === id) || null; }
    function last(){ return chain?.events[chain.events.length - 1] || null; }

    function invalidate(){
      if (!chain) { closeDownstreamNav(projectId); return state(); }
      if (chain) {
        invalidatedIdentity = String(chain.version) + '|' + String(chain.requestId || '');
        history.push(chain);
      }
      chain = null;
      closeDownstreamNav(projectId);
      notify();
      return state();
    }

    function setAnswer(answer){
      if (!answer) return invalidate();
      const body = answer.body || {};
      const receipt = body.evaluationReceipt || body.rawEvaluation?.evaluationReceipt || null;
      const incomingVersion = String(answer.version);
      const incomingRequestId = body.requestId || null;
      const incomingIdentity = incomingVersion + '|' + String(incomingRequestId || '');
      if (!chain && invalidatedIdentity === incomingIdentity) return state();
      if (chain && chain.version === incomingVersion && chain.requestId === incomingRequestId) return state();
      if (chain) history.push(chain);
      invalidatedIdentity = null;
      chain = {
        projectId, title: title || projectId,
        version: incomingVersion,
        requestId: incomingRequestId,
        storePin: body.storePin || null,
        status: answer.status,
        total: answer.total,
        reasons: Array.isArray(answer.reasons) ? answer.reasons.slice() : [],
        orderId: null, paymentId: null, source:JSON.parse(JSON.stringify(body)), commercial:null, demo:null, recording:null, commercialError:null,
        events: [
          { id:'sent', at: answer.sentAt || body.sentAt || null, hash: body.payloadDigest || null, detail: 'demand ' + String(body.demandSignature || '—').slice(0,16) + '…' },
          { id:'arrived', at: receipt?.evaluatedAt || null, hash: receipt?.receiptHash || null, detail: 'request ' + String(body.requestId || '—').slice(0,8) + ' · Store ' + String(body.storePin || '—').slice(0,7) },
          { id:'answered', at: receipt?.evaluatedAt || null, hash: body.calculationIdentity?.resultHash || receipt?.calculationIdentity?.resultHash || null,
            detail: answer.status === 'SUPPORTABLE' ? 'Store price · ' + money(answer.total) : answer.status + ' · ' + (answer.reasons || []).map(r => r.code).join(', ') }
        ]
      };
      const current=chain;
      void ensureCommercial().then(()=>{if(chain===current)notify();}).catch(error=>{if(chain===current){chain.commercialError=error.message;notify();}});
      notify();
      return state();
    }

    async function ensureCommercial(){
      if(!chain || chain.status!=='SUPPORTABLE')return null;
      const current=chain;
      if(current.recording)return current.recording;
      current.recording=(async()=>{
        const body=current.source,answer=body.rawEvaluation||{},receipt=body.evaluationReceipt||answer.evaluationReceipt;
        if(!root.STBCommercialSequence)throw new Error('COMMERCIAL_CONTRACT_NOT_LOADED');
        if(!receipt||answer.complete!==true||!answer.manifestCoverage)throw new Error('COMPLETE_STORE_MANIFEST_EVIDENCE_REQUIRED');
        const links={projectId,definitionId:String(answer.jobId),revisionId:String(answer.revision),manifestHash:receipt.manifestHash,requestId:current.requestId,receiptHash:receipt.receiptHash,storeRevision:current.storePin,modelHash:receipt.authority?.manufacturingModel?.hash,inputHash:answer.calculationIdentity?.inputHash,resultHash:answer.calculationIdentity?.resultHash};
        current.commercial=root.STBCommercialSequence.create({streamId:projectId+'|'+current.version+'|'+current.requestId,links});
        const at=receipt.evaluatedAt;
        await current.commercial.recordEvent({schema:root.STBCommercialSequence.schema,eventId:'answer:'+receipt.receiptHash,eventType:'StoreAnswerAttached',streamId:projectId+'|'+current.version+'|'+current.requestId,sequence:1,expectedPreviousSequence:0,causedByEventIds:[],idempotencyKey:'answer:'+receipt.receiptHash,occurredAt:at,recordedAt:at,actor:{partyId:'system',role:'system'},evidenceClass:'SIMULATED',authority:{sourceSystem:'store-zero',sourceRecordId:receipt.receiptHash,verificationRecordId:receipt.receiptHash,policyId:'PROTOTYPE-EVIDENCE-ONLY',policyVersion:'1'},links,payload:{status:answer.status,complete:answer.complete,manifestCoverageComplete:true}},0);
        if(demoCommerce){
          if(!root.STBDemoCommerce)throw Error('DEMO_COMMERCIAL_SOURCE_NOT_LOADED');
          if(current.total!==answer.totals?.Q)throw Error('DEMO_STORE_AMOUNT_MISMATCH');
          current.demo=root.STBDemoCommerce.create({body,read:()=>current.commercial.deriveTransactionState(),append:source=>appendCommercialEvent(current,source),isCurrent:()=>chain===current});
          await current.demo.prepareOffer();
        }
        return current.commercial;
      })();
      return current.recording;
    }
    function canAccept(){const offer=chain?.commercial?.deriveTransactionState().events.find(e=>e.eventType==='OfferIssued');return !!chain&&chain.status==='SUPPORTABLE'&&!event('decision')&&!!offer&&Date.parse(offer.payload.validUntil)>=Date.now();}
    async function appendCommercialEvent(current,source){
      if(chain!==current)return state();
      const stored=await current.commercial.recordEvent(source,source.expectedPreviousSequence);
      if(chain!==current)return state();
      const id=COMMERCIAL_ALIASES[stored.eventType],existing=chain.events.find(e=>e.sourceEventId===stored.eventId);
      if(id&&!existing&&stored.eventType!=='StoreAnswerAttached')chain.events.push({id,at:stored.recordedAt,hash:stored.hash,prevHash:stored.previousHash,sourceEventId:stored.eventId,detail:stored.eventType==='CustomerDecisionRecorded'?stored.payload.decision:stored.eventType+' · SIMULATED'});
      if(stored.eventType==='OrderAccepted')chain.orderId=stored.payload.orderId;
      if(stored.eventType==='FinancialEventRecorded'&&['CAPTURED','SETTLED'].includes(stored.payload.kind))chain.paymentId=stored.payload.financialEventId;
      notify();return state();
    }
    async function recordCommercialEvent(source){
      const current=chain,stream=await ensureCommercial();if(!stream||chain!==current)return state();
      return appendCommercialEvent(current,source);
    }
    async function decision(kind){
      const current=chain,stream=await ensureCommercial();if(!stream||chain!==current||!canAccept())return state();
      const snapshot=stream.deriveTransactionState(),offer=snapshot.events.find(e=>e.eventType==='OfferIssued'),at=now(),id=shortId('SIM-DECISION');
      return recordCommercialEvent({schema:root.STBCommercialSequence.schema,eventId:id,eventType:'CustomerDecisionRecorded',streamId:snapshot.streamId,sequence:snapshot.sequence+1,expectedPreviousSequence:snapshot.sequence,causedByEventIds:[offer.eventId],idempotencyKey:id,occurredAt:at,recordedAt:at,actor:{partyId:'prototype-customer',role:'customer'},evidenceClass:'SIMULATED',authority:{sourceSystem:'system-customer-action',sourceRecordId:id,verificationRecordId:id,policyId:offer.payload.policy.id,policyVersion:offer.payload.policy.version},links:offer.links,payload:{decisionId:id,offerId:offer.payload.offerId,offerVersion:offer.payload.offerVersion,decision:kind}});
    }
    async function accept(){const current=chain;await decision('ACCEPTED');if(chain===current&&current?.demo)await current.demo.checkout();return state();}
    const decline=()=>decision('DECLINED');
    async function runYard(){const current=chain;await ensureCommercial();if(chain===current&&current?.demo)await current.demo.runYard();return state();}
    async function pickup(){const current=chain;await ensureCommercial();if(chain===current&&current?.demo)await current.demo.pickup();return state();}

    // Serialize the customer's existing decision and the exact evaluated definition. No new offer,
    // decision, stock choice or quotation is created here. Store independently verifies this packet.
    async function acceptedPacket(){
      const current=chain;
      const refuse=code=>({status:'REFUSED',reasonCodes:[code]});
      if(!current)return refuse('CURRENT_ACCEPTED_JOB_REQUIRED');
      await ensureCommercial();
      if(chain!==current)return refuse('DEFINITION_CHANGED');
      const body=current.source,answer=body.storeAnswer,inputs=body.mappedCallInputs;
      const events=current.commercial?.deriveTransactionState().events||[];
      const decision=events.find(e=>e.eventType==='CustomerDecisionRecorded'&&e.payload.decision==='ACCEPTED');
      const offer=events.find(e=>e.eventType==='OfferIssued'&&e.payload.offerId===decision?.payload.offerId);
      if(!decision||!offer||!await root.STBCommercialSequence.verify(events))return refuse('ACCEPTED_SOURCE_DECISION_REQUIRED');
      const receipt=answer?.evaluationReceipt;
      if(answer?.status!=='SUPPORTABLE'||answer.complete!==true||!receipt||!inputs||body.requirementSatisfaction?.status!=='SATISFIED')return refuse('COMPLETE_STORE_ANSWER_REQUIRED');
      const {receiptHash,...receiptCore}=receipt;
      if(receiptHash!==await sha256(receiptCore)||receipt.demandHash!==await sha256(inputs.demand)||receipt.manifestHash!==await sha256(inputs.manifest)
        ||receipt.authority.storeRevision!==current.storePin||decision.links.receiptHash!==receiptHash||decision.links.revisionId!==inputs.manifest.revision
        ||answer.requestId!==current.requestId||answer.requestType!==inputs.requestType||decision.evidenceClass!=='SIMULATED')return refuse('ACCEPTED_JOB_BINDING_MISMATCH');
      if(chain!==current)return refuse('DEFINITION_CHANGED');
      const demand=inputs.demand;
      const requirements={};
      if(inputs.requestType==='USER_DEFINED_BOARD_V1')for(const key of ['endRelation','lengthDatum','endIdentity'])if(demand[key]!=null)requirements[key]=demand[key];
      return {status:'ACCEPTED_PACKET_READY',packet:JSON.parse(JSON.stringify({
        schema:'STB-ACCEPTED-JOB-PACKET-2',packetId:'PACKET-'+decision.payload.decisionId,
        project:{projectId,classId:demand.classId||inputs.requestType,title:current.title},
        definition:{definitionId:inputs.manifest.jobId,revisionId:inputs.manifest.revision,requestType:inputs.requestType,demand,manifest:inputs.manifest,requirements},
        storeAnswer:answer,
        decision:{decisionId:decision.payload.decisionId,kind:'ACCEPTED',offerId:decision.payload.offerId,decidedAt:decision.occurredAt,evidenceClass:'SIMULATED'},
        authority:{physicalRelease:false,evidenceClass:'SIMULATED'}
      }))};
    }

    function stage(){
      if (!chain) return 'NO_ANSWER';
      if (chain.status === 'BUDGETARY_REVIEW') return 'REVIEW_REQUIRED';
      if (chain.status !== 'SUPPORTABLE') return 'REFUSED_BY_STORE';
      const d = event('decision');
      if (!d) return 'ANSWERED';
      if (d.detail === 'DECLINED') return 'DECLINED';
      if (event('custody')) return 'HANDED_OFF';
      if (event('ready')) return 'READY';
      return event('queued')?'QUEUED':'SELLER_PENDING';
    }

    function receipt(){
      if (!event('custody')) return null;
      return {
        flow: VERSION, projectId, title: chain.title, version: chain.version,
        orderId: chain.orderId, paymentId: chain.paymentId, total: chain.total, storePin: chain.storePin, requestId: chain.requestId,
        events: chain.events.map(e => ({ id: e.id, at: e.at, hash: e.hash, prevHash: e.prevHash || null, detail: e.detail })),
        simulated: true
      };
    }

    function state(){
      const s = stage();
      return {
        flow: VERSION, projectId, stage: s,
        version: chain?.version || null, status: chain?.status || null, total: chain?.total ?? null,
        reasons: chain?.reasons || [],
        canAccept: canAccept(),
        callOpen: s !== 'NO_ANSWER' && s !== 'REFUSED_BY_STORE',
        yardOpen: ['QUEUED','READY','HANDED_OFF'].includes(s),
        recordOpen: ['READY','HANDED_OFF'].includes(s),
        orderId: chain?.orderId || null,
        events: (chain?.events || []).map(e => ({ ...e })),
        commercial:chain?.commercial?.deriveTransactionState()??null,
        pendingReason:chain?.commercialError||(!event('offered')?'SELLER_OFFER_AND_TERMS_REQUIRED':null),
        receipt: receipt(),
        history: history.length
      };
    }

    if (root.addEventListener) {
      root.addEventListener('message', message => {
        if (message.data?.type === 'STB_PROJECT_DEFINITION_CHANGED' && message.data?.projectId === projectId) invalidate();
      });
    }

    function renderChain(){
      const done = new Map((chain?.events || []).map(e => [e.id, e]));
      const s = stage();
      const rows = EVENTS.map(def => {
        const e = done.get(def.id);
        let label = def.label;
        if (def.id === 'decision' && e) label = 'Your call · ' + e.detail.toLowerCase();
        if (def.id === 'answered' && e && s === 'REFUSED_BY_STORE') label = 'Store answered · ' + chain.status.toLowerCase();
        const open = !e;
        return '<div class="stb-terms-row' + (open ? ' open' : '') + '" data-terms-event="' + def.id + '" data-terms-state="' + (open ? 'open' : 'done') + '">'
          + '<span class="stb-terms-dot">' + (open ? '○' : '✓') + '</span>'
          + '<span class="stb-terms-label">' + esc(label) + '<small>' + esc(def.who) + (e?.detail ? ' · ' + esc(e.detail) : '') + '</small></span>'
          + '<code class="stb-terms-hash">' + (e?.hash ? esc(String(e.hash).slice(0,16)) + '…' : (open ? '—' : 'no hash')) + '</code></div>';
      }).join('');
      const reasons = s === 'REFUSED_BY_STORE' && chain.reasons.length
        ? '<ul class="stb-terms-reasons">' + chain.reasons.map(r => '<li><b>' + esc(r.code) + '</b>' + (r.text ? ' · ' + esc(r.text) : '') + '</li>').join('') + '</ul>'
        : '';
      return '<section class="stb-terms" data-terms-stage="' + s + '"><h3 class="stb-terms-hd">RECEIPTS · ' + esc(chain?.title || projectId) + '</h3>' + rows + reasons + '</section>';
    }

    function renderControls(step){
      const s = stage();
      if (step === 'call') {
        if (s === 'NO_ANSWER') return '<p class="stb-terms-wait">Waiting on a current Store answer for this version.</p>';
        if (s === 'REVIEW_REQUIRED') return '<p class="stb-terms-wait" data-budgetary-review>Scoped Store budgetary estimate: ' + esc(money(chain.total))
          + '. The whole job is not fully supportable. Not evaluated: ' + chain.reasons.map(r => esc(r.text || r.code)).join('; ')
          + '. Return to the Bench to finish this definition.</p>';
        if (s === 'REFUSED_BY_STORE') return '<p class="stb-terms-refused" data-terms-refused>The Store did not support this version (' + esc(chain.status) + '). The refusal is the result. Change the definition to ask again.</p>';
        if (s === 'DECLINED') return '<p class="stb-terms-declined">You passed on this version. Return to the Bench to try another.</p>';
        if (s === 'SELLER_PENDING') return '<p class="stb-terms-wait">Your choice is recorded. Waiting for the seller to confirm the order.</p>';
        if(s==='ANSWERED'&&!canAccept())return '<p class="stb-terms-wait">'+(chain.commercialError?'This version is missing transaction evidence: '+esc(chain.commercialError)+'.':demoCommerce?'Preparing the offer for this version…':'Store price returned. A seller offer is not available for this version.')+'</p>';
        if (s !== 'ANSWERED') return '<p class="stb-terms-done">Seller order · ' + esc(chain.orderId) + '.</p>';
        return '<p class="stb-terms-note">Demo · no money moves or machines run.</p><div class="stb-terms-actions"><button type="button" class="stb-terms-go" data-terms-action="accept">'+(demoCommerce?'ACCEPT &amp; PAY':'ACCEPT OFFER')+' · ' + esc(money(chain.total)) + ' →</button>'
          + '<button type="button" class="stb-terms-ghost" data-terms-action="decline">NO THANKS</button></div>';
      }
      if (step === 'yard') {
        if (!['QUEUED','READY','HANDED_OFF'].includes(s)) return '<p class="stb-terms-wait">This job has not entered the yard queue yet.</p>';
        if (s === 'QUEUED') return demoCommerce?'<p class="stb-terms-done">Paid. Your job is in the yard queue.</p><button type="button" class="stb-terms-go" data-terms-action="yard">RUN THE YARD DEMO →</button>':'<p class="stb-terms-wait">Your job is queued. Waiting for the yard records.</p>';
        return '<p class="stb-terms-done">Your parts are READY for pickup.</p>';
      }
      if (step === 'record') {
        if (s === 'READY') return demoCommerce?'<p class="stb-terms-done">Your parts and remnants are ready.</p><button type="button" class="stb-terms-go" data-terms-action="pickup">PICK UP MY PARTS →</button>':'<p class="stb-terms-wait">Ready for the pickup record.</p>';
        if (s === 'HANDED_OFF') return renderReceipt();
        return '<p class="stb-terms-wait">Nothing to pick up yet. This opens once the simulated yard run is READY.</p>';
      }
      return '';
    }

    function renderReceipt(){
      const r = receipt();
      if (!r) return '';
      return '<section class="stb-terms-receipt" data-terms-receipt><h3 class="stb-terms-hd">PICKUP RECEIPT · ' + esc(money(r.total)) + '</h3>'
        + '<div class="stb-terms-kv"><span>Order</span><b>' + esc(r.orderId) + '</b></div>'
        + '<div class="stb-terms-kv"><span>Version</span><b>' + esc(r.version) + '</b></div>'
        + '<div class="stb-terms-kv"><span>Total (Store budgetary Q; simulated payment)</span><b>' + esc(money(r.total)) + ' · ' + esc(r.paymentId) + '</b></div>'
        + '<div class="stb-terms-kv"><span>Store</span><b>' + esc(String(r.storePin).slice(0,12)) + ' · request ' + esc(String(r.requestId).slice(0,8)) + '</b></div>'
        + r.events.map(e => '<div class="stb-terms-kv"><span>' + esc(EVENTS.find(d => d.id === e.id)?.label || e.id) + '</span><code>' + esc(e.hash || '—') + '</code></div>').join('')
        + '<p class="stb-terms-note">Demo receipt · tied to the version you approved.</p></section>';
    }

    function bind(host, after){
      if (!host || host.dataset.termsBound === projectId) return;
      host.dataset.termsBound = projectId;
      host.addEventListener('click', async event => {
        const button = event.target.closest?.('[data-terms-action]');
        if (!button || !host.contains(button)) return;
        event.preventDefault();
        button.disabled = true;
        const action = button.dataset.termsAction;
        const run = { accept, decline, yard: runYard, pickup }[action];
        if (!run) return;
        try{const next = await run();if (typeof after === 'function') after(action, next);}
        catch(error){if(chain){chain.commercialError=String(error.message||error);notify();}button.disabled=false;}
      });
    }

    const flow = Object.freeze({ setAnswer, invalidate, recordCommercialEvent, accept, decline, runYard, pickup, acceptedPacket, state, renderChain, renderControls, renderReceipt, bind, onChange: fn => { listeners.add(fn); return () => listeners.delete(fn); } });
    INSTANCES.set(projectId, flow);
    return flow;
  }

  const STYLE = '.stb-terms{margin:12px 0;padding:12px 14px;border:1px solid var(--line,var(--border,#ddd));border-radius:10px;background:var(--card,var(--surface,#fff))}'
    + '.stb-terms-hd{margin:0 0 8px;font-size:10.5px;font-weight:700;letter-spacing:.08em;color:var(--brand,var(--accent,#8a5a2b))}'
    + '.stb-terms-row{display:grid;grid-template-columns:18px minmax(0,1fr) auto;gap:8px;align-items:baseline;padding:5px 0;border-bottom:1px dashed var(--line,var(--border,#ddd));font-size:13px}'
    + '.stb-terms-row.open{opacity:.55}.stb-terms-dot{color:var(--ok,#2f6b3a);font-weight:700}.stb-terms-label small{display:block;color:var(--ink2,var(--text2,#666));font-size:11.5px}'
    + '.stb-terms-hash{font:11px ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--ink2,var(--text2,#666));word-break:break-all}'
    + '.stb-terms-reasons{margin:8px 0 0;padding-left:18px;color:var(--bad,#9b2c1f);font-size:13px}'
    + '.stb-terms-note{margin:8px 0 0;font-size:12px;color:var(--ink2,var(--text2,#666))}'
    + '.stb-terms-actions{display:flex;flex-wrap:wrap;gap:10px;margin:10px 0}'
    + '.stb-terms-go{background:var(--brand,#8a5a2b);color:var(--brand-ink,#fff);border:0;border-radius:10px;padding:12px 18px;font-weight:700;cursor:pointer}'
    + '.stb-terms-ghost{background:transparent;color:inherit;border:1px solid var(--line,var(--border,#ccc));border-radius:10px;padding:12px 18px;font-weight:600;cursor:pointer}'
    + '.stb-terms-go:disabled,.stb-terms-ghost:disabled{opacity:.45;cursor:not-allowed}'
    + '.stb-terms-refused{color:var(--bad,#9b2c1f);font-weight:600}.stb-terms-wait,.stb-terms-declined,.stb-terms-done{color:var(--ink2,var(--text2,#666))}'
    + '.stb-terms-receipt{margin:12px 0;padding:12px 14px;border:2px solid var(--brand,#8a5a2b);border-radius:10px}'
    + '.stb-terms-kv{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr);gap:10px;padding:3px 0;font-size:12.5px}.stb-terms-kv code{font:11px ui-monospace,Menlo,monospace;word-break:break-all}';
  function installStyle(doc){
    const d = doc || root.document;
    if (!d) return;
    watchDefinitionDocument(d);
    if (d.getElementById('stb-terms-style')) return;
    const style = d.createElement('style');
    style.id = 'stb-terms-style';
    style.textContent = STYLE;
    d.head.append(style);
  }

  async function verify(state){return !!root.STBCommercialSequence&&await root.STBCommercialSequence.verify(state?.commercial?.events||[]);}
  root.STBTermsFlow = Object.freeze({ version: VERSION, events: EVENTS, create, installStyle, sha256, canonical, verify, instance: id => INSTANCES.get(id) || null });
})(typeof window !== 'undefined' ? window : globalThis);
