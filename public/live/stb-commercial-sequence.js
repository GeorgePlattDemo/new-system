/** Shared commercial/fulfillment contract. No payment, reservation, machine or notification side effects. */
(function(root){
  'use strict';
  const SCHEMA='STB-COMMERCIAL-EVENT-1';
  const TYPES=Object.freeze({
    StoreAnswerAttached:{role:'system',requires:[],fields:['status','complete','manifestCoverageComplete']},
    OfferIssued:{role:'seller',requires:['StoreAnswerAttached'],fields:['offerId','offerVersion','sellerId','sellerLocation','currency','manufacturingQMinor','amountMinor','scope','termsId','termsVersion','validUntil','fulfillment','policy','extras']},
    CustomerDecisionRecorded:{role:'customer',requires:['OfferIssued'],fields:['decisionId','offerId','offerVersion','decision']},
    OrderAccepted:{role:'seller',requires:['CustomerDecisionRecorded'],fields:['orderId','offerId','offerVersion','availabilityConfirmed','capabilityConfirmed']},
    FinancialEventRecorded:{role:'finance',requires:['OrderAccepted'],fields:['financialEventId','kind','currency','amountMinor','providerRecordId']},
    ReservationConfirmed:{role:'inventory',requires:['OrderAccepted'],fields:['reservationId','expiresAt','stock']},
    CapacityCommitmentRecorded:{role:'scheduler',requires:['OrderAccepted'],fields:['capacityId','expiresAt','slot']},
    QueueEntryConfirmed:{role:'scheduler',requires:['OrderAccepted'],fields:['queueEntryId','position']},
    MaterialAllocated:{role:'inventory',requires:['OrderAccepted'],fields:['allocationId','assignments','atomic']},
    MaterialIssued:{role:'inventory',requires:['MaterialAllocated'],fields:['issueId','allocationId','materialIds','location']},
    ProductionReleaseRecorded:{role:'release',requires:['QueueEntryConfirmed','MaterialAllocated'],fields:['releaseId','packetId','allocationId','releaseAuthorityId']},
    LocalPlanBound:{role:'local',requires:['ProductionReleaseRecorded','MaterialIssued'],fields:['localPlanId','packetId','allocationId','planHash','machineConfigHash']},
    LocalAdmissionRecorded:{role:'local',requires:['LocalPlanBound'],fields:['admissionId','localPlanId','readinessRecordId','admitted']},
    ExecutionEventRecorded:{role:'local',requires:['LocalAdmissionRecorded'],fields:['executionId','admissionId','kind']},
    InspectionDispositionRecorded:{role:'quality',requires:['ExecutionEventRecorded'],fields:['inspectionId','executionId','disposition','components']},
    StagingRecorded:{role:'fulfillment',requires:['InspectionDispositionRecorded'],fields:['stagingId','inspectionId','packages','components','remnants','location']},
    ReadyNoticeRecorded:{role:'fulfillment',requires:['StagingRecorded'],fields:['noticeId','stagingId','recipientId','noticeRecordId']},
    CustodyTransferred:{role:'fulfillment',requires:['ReadyNoticeRecorded'],fields:['handoffId','noticeId','recipientId','packages','handoffEvidenceId']},
    ProjectCloseoutRecorded:{role:'system',requires:['CustodyTransferred'],fields:['closeoutId','handoffId','records','assemblyStatus']},
    ExceptionRecorded:{role:null,requires:['StoreAnswerAttached'],fields:['exceptionId','kind','disposition','affectedEventIds']}
  });
  const LINK_FIELDS=['projectId','definitionId','revisionId','manifestHash','requestId','receiptHash','storeRevision','modelHash','inputHash','resultHash'];
  const EVENT_FIELDS=['schema','eventId','eventType','streamId','sequence','expectedPreviousSequence','causedByEventIds','idempotencyKey','occurredAt','recordedAt','actor','evidenceClass','authority','links','payload'];
  const canonical=v=>Array.isArray(v)?'['+v.map(canonical).join(',')+']':v&&typeof v==='object'?'{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canonical(v[k])).join(',')+'}':JSON.stringify(v);
  const clone=v=>JSON.parse(JSON.stringify(v));
  const text=v=>typeof v==='string'&&v.trim().length>0;
  const instant=v=>text(v)&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(v)&&!Number.isNaN(Date.parse(v))&&new Date(v).toISOString()===v;
  const fail=code=>{throw new Error(code);};
  async function hash(value){const data=await root.crypto.subtle.digest('SHA-256',new TextEncoder().encode(canonical(value)));return Array.from(new Uint8Array(data),v=>v.toString(16).padStart(2,'0')).join('');}
  function create({streamId,links}){
    if(!text(streamId)||!links||LINK_FIELDS.some(k=>!text(links[k])))fail('COMMERCIAL_IDENTITY_REQUIRED');
    const binding=clone(links),events=[];let held=false;
    const latest=type=>events.findLast(e=>e.eventType===type);
    function validate(e){
      if(!e||typeof e!=='object'||Array.isArray(e)||Object.keys(e).some(k=>!EVENT_FIELDS.includes(k))||EVENT_FIELDS.some(k=>!Object.hasOwn(e,k)))fail('COMMERCIAL_EVENT_SHAPE');
      const type=TYPES[e.eventType];if(!type||e.schema!==SCHEMA)fail('COMMERCIAL_EVENT_NOT_DECLARED');
      if(e.evidenceClass!=='SIMULATED')fail('ACTUAL_SOURCE_ADAPTER_NOT_INSTALLED');
      if(e.streamId!==streamId||LINK_FIELDS.some(k=>e.links?.[k]!==binding[k])||Object.keys(e.links).some(k=>!LINK_FIELDS.includes(k)))fail('COMMERCIAL_REVISION_BINDING_MISMATCH');
      if(!text(e.eventId)||!text(e.idempotencyKey)||!instant(e.occurredAt)||!instant(e.recordedAt)||Date.parse(e.recordedAt)<Date.parse(e.occurredAt))fail('COMMERCIAL_IDENTITY_OR_TIME_INVALID');
      if(!e.actor||!text(e.actor.partyId)||!text(e.actor.role)||type.role&&e.actor.role!==type.role)fail('COMMERCIAL_ACTOR_MISMATCH');
      if(!e.authority||['sourceSystem','sourceRecordId','verificationRecordId','policyId','policyVersion'].some(k=>!text(e.authority[k])))fail('COMMERCIAL_SOURCE_EVIDENCE_REQUIRED');
      if(!Array.isArray(e.causedByEventIds)||e.causedByEventIds.some(id=>!events.some(p=>p.eventId===id)))fail('COMMERCIAL_CAUSE_NOT_RECORDED');
      if(!Number.isInteger(e.sequence)||e.sequence!==events.length+1||e.expectedPreviousSequence!==events.length)fail('COMMERCIAL_SEQUENCE_CONFLICT');
      if(events.some(p=>p.eventId===e.eventId))fail('COMMERCIAL_EVENT_ID_REUSED');
      if(type.requires.some(t=>!latest(t)))fail('COMMERCIAL_PREREQUISITE_MISSING');
      if(type.requires.some(t=>!e.causedByEventIds.includes(latest(t).eventId)))fail('COMMERCIAL_CAUSAL_EVIDENCE_MISSING');
      const p=e.payload;if(!p||typeof p!=='object'||Array.isArray(p)||type.fields.some(k=>p[k]===undefined||p[k]===null))fail('COMMERCIAL_PAYLOAD_INCOMPLETE');
      if(e.eventType!=='FinancialEventRecorded'&&e.eventType!=='ExecutionEventRecorded'&&e.eventType!=='ExceptionRecorded'&&latest(e.eventType))fail('COMMERCIAL_STAGE_ALREADY_RECORDED');
      if(e.eventType!=='ExceptionRecorded'&&events.some(x=>x.eventType==='ExceptionRecorded'&&x.payload.disposition!=='RESOLVED'))fail('COMMERCIAL_EXCEPTION_HOLD');
      const offer=latest('OfferIssued')?.payload,decision=latest('CustomerDecisionRecorded')?.payload;
      if(e.eventType==='StoreAnswerAttached'&&(p.status!=='SUPPORTABLE'||p.complete!==true||p.manifestCoverageComplete!==true))fail('COMPLETE_STORE_ANSWER_REQUIRED');
      if(e.eventType==='OfferIssued'){
        if(!Number.isSafeInteger(p.amountMinor)||p.amountMinor<0||!Number.isSafeInteger(p.manufacturingQMinor)||p.manufacturingQMinor<0||!text(p.currency)||!instant(p.validUntil)||Date.parse(p.validUntil)<=Date.parse(e.occurredAt))fail('OFFER_AMOUNT_OR_EXPIRY_INVALID');
        if(!p.policy||!text(p.policy.id)||!text(p.policy.version)||!['NONE','AUTHORIZED','CAPTURED','SETTLED'].includes(p.policy.requiredFinancialKind)||typeof p.policy.reservationRequired!=='boolean'||typeof p.policy.capacityRequired!=='boolean'||!Array.isArray(p.policy.stageOrder)||new Set(p.policy.stageOrder).size!==p.policy.stageOrder.length)fail('COMMERCIAL_POLICY_UNRESOLVED');
        if(!Array.isArray(p.extras)||p.extras.some(x=>!text(x.kind)||!['INCLUDED','SEPARATE','WAIVED','UNRESOLVED','OUTSIDE_SCOPE'].includes(x.disposition)))fail('COMMERCIAL_EXTRAS_UNRESOLVED');
        if(p.scope!=='MANUFACTURING_MODEL_ONLY'&&p.extras.some(x=>x.disposition==='UNRESOLVED'))fail('COMMERCIAL_EXTRAS_UNRESOLVED');
      }
      if(e.eventType==='CustomerDecisionRecorded'&&(!['ACCEPTED','DECLINED','DEFERRED','REVISION_REQUESTED'].includes(p.decision)||p.offerId!==offer.offerId||p.offerVersion!==offer.offerVersion||Date.parse(e.occurredAt)>Date.parse(offer.validUntil)))fail('CUSTOMER_DECISION_MISMATCH');
      if(e.eventType==='OrderAccepted'&&(decision.decision!=='ACCEPTED'||p.offerId!==offer.offerId||p.offerVersion!==offer.offerVersion||p.availabilityConfirmed!==true||p.capabilityConfirmed!==true))fail('SELLER_ORDER_ACCEPTANCE_REQUIRED');
      if(e.eventType==='FinancialEventRecorded'&&(!['AUTHORIZED','CAPTURED','SETTLED','FAILED','VOIDED','REFUNDED'].includes(p.kind)||!Number.isSafeInteger(p.amountMinor)||p.amountMinor<0||p.currency!==offer.currency||['AUTHORIZED','CAPTURED','SETTLED'].includes(p.kind)&&p.amountMinor!==offer.amountMinor))fail('FINANCIAL_EVENT_MISMATCH');
      if(e.eventType==='FinancialEventRecorded'&&p.kind==='SETTLED'&&!events.some(x=>x.eventType==='FinancialEventRecorded'&&x.payload.kind==='CAPTURED'))fail('FINANCIAL_CAPTURE_REQUIRED');
      if(e.eventType==='FinancialEventRecorded'&&['VOIDED','REFUNDED'].includes(p.kind)&&!events.some(x=>x.eventType==='FinancialEventRecorded'&&['AUTHORIZED','CAPTURED','SETTLED'].includes(x.payload.kind)))fail('FINANCIAL_PRIOR_EVENT_REQUIRED');
      if(offer?.policy.stageOrder.includes(e.eventType)){const at=offer.policy.stageOrder.indexOf(e.eventType);if(offer.policy.stageOrder.slice(0,at).some(t=>!latest(t)))fail('COMMERCIAL_POLICY_ORDER_BLOCKED');}
      if(['QueueEntryConfirmed','ProductionReleaseRecorded'].includes(e.eventType)){
        if(offer.policy.requiredFinancialKind!=='NONE'&&!events.some(x=>x.eventType==='FinancialEventRecorded'&&x.payload.kind===offer.policy.requiredFinancialKind)||offer.policy.reservationRequired&&!latest('ReservationConfirmed')||offer.policy.capacityRequired&&!latest('CapacityCommitmentRecorded'))fail('COMMERCIAL_POLICY_GATE_BLOCKED');
        if(events.some(x=>x.eventType==='FinancialEventRecorded'&&['FAILED','VOIDED','REFUNDED'].includes(x.payload.kind)))fail('FINANCIAL_DISPOSITION_BLOCKED');
        for(const t of ['ReservationConfirmed','CapacityCommitmentRecorded'])if(latest(t)&&Date.parse(latest(t).payload.expiresAt)<Date.parse(e.occurredAt))fail('COMMERCIAL_COMMITMENT_EXPIRED');
      }
      if(['ReservationConfirmed','CapacityCommitmentRecorded'].includes(e.eventType)&&(!instant(p.expiresAt)||Date.parse(p.expiresAt)<=Date.parse(e.occurredAt)))fail('COMMERCIAL_COMMITMENT_EXPIRY_REQUIRED');
      if(e.eventType==='MaterialAllocated'&&(p.atomic!==true||!Array.isArray(p.assignments)||!p.assignments.length||p.assignments.some(a=>['parentId','materialId','lotId','location','condition','compatibleDefinitionId'].some(k=>!text(a[k]))||!Number.isInteger(a.qty)||a.qty<1||a.compatibleDefinitionId!==binding.definitionId)))fail('ACTUAL_ALLOCATION_RECORD_REQUIRED');
      if(e.eventType==='MaterialIssued'&&(p.allocationId!==latest('MaterialAllocated').payload.allocationId||!Array.isArray(p.materialIds)||!p.materialIds.length||p.materialIds.some(id=>!latest('MaterialAllocated').payload.assignments.some(a=>a.materialId===id))))fail('MATERIAL_ISSUE_MISMATCH');
      if(e.eventType==='ProductionReleaseRecorded'&&p.allocationId!==latest('MaterialAllocated').payload.allocationId)fail('RELEASE_ALLOCATION_MISMATCH');
      if(e.eventType==='LocalPlanBound'&&(p.packetId!==latest('ProductionReleaseRecorded').payload.packetId||p.allocationId!==latest('MaterialAllocated').payload.allocationId))fail('LOCAL_PLAN_BINDING_MISMATCH');
      if(e.eventType==='LocalAdmissionRecorded'&&(p.localPlanId!==latest('LocalPlanBound').payload.localPlanId||p.admitted!==true))fail('LOCAL_ADMISSION_REQUIRED');
      if(e.eventType==='ExecutionEventRecorded'&&(!['STARTED','PROGRESS','FAILED','COMPLETED'].includes(p.kind)||p.admissionId!==latest('LocalAdmissionRecorded').payload.admissionId))fail('EXECUTION_ADMISSION_MISMATCH');
      if(e.eventType==='InspectionDispositionRecorded'&&(latest('ExecutionEventRecorded').payload.kind!=='COMPLETED'||p.executionId!==latest('ExecutionEventRecorded').payload.executionId||!['ACCEPTED','REWORK','SCRAP','HOLD'].includes(p.disposition)||!Array.isArray(p.components)||!p.components.length))fail('INSPECTION_COMPLETION_REQUIRED');
      if(e.eventType==='StagingRecorded'&&(latest('InspectionDispositionRecorded').payload.disposition!=='ACCEPTED'||p.inspectionId!==latest('InspectionDispositionRecorded').payload.inspectionId||!Array.isArray(p.packages)||!p.packages.length||!Array.isArray(p.components)||!Array.isArray(p.remnants)))fail('QUALITY_DISPOSITION_BLOCKED');
      if(e.eventType==='ReadyNoticeRecorded'&&p.stagingId!==latest('StagingRecorded').payload.stagingId)fail('READY_STAGING_MISMATCH');
      if(e.eventType==='CustodyTransferred'&&(p.noticeId!==latest('ReadyNoticeRecorded').payload.noticeId||p.recipientId!==latest('ReadyNoticeRecorded').payload.recipientId||canonical(p.packages)!==canonical(latest('StagingRecorded').payload.packages)))fail('CUSTODY_HANDOFF_MISMATCH');
      if(e.eventType==='ProjectCloseoutRecorded'&&p.handoffId!==latest('CustodyTransferred').payload.handoffId)fail('CLOSEOUT_HANDOFF_MISMATCH');
    }
    async function recordEvent(source,expectedSequence){
      const e=clone(source),existing=events.find(x=>x.idempotencyKey===e.idempotencyKey);
      if(existing){const {hash:_,previousHash:__,...original}=existing;if(canonical(original)!==canonical(e))fail('COMMERCIAL_IDEMPOTENCY_CONFLICT');return clone(existing);}
      if(held||expectedSequence!==events.length||e.expectedPreviousSequence!==expectedSequence)fail('COMMERCIAL_SEQUENCE_CONFLICT');
      validate(e);held=true;
      try{const previousHash=events.at(-1)?.hash??null,stored={...e,previousHash,hash:await hash({...e,previousHash})};events.push(stored);return clone(stored);}finally{held=false;}
    }
    function deriveTransactionState(){
      const last=events.at(-1);return {schema:SCHEMA,streamId,sequence:events.length,stage:last?.eventType??'NO_ANSWER',evidenceClass:'SIMULATED',physicalAuthority:false,paymentAuthority:false,events:clone(events),pending:!latest('OrderAccepted')?'SELLER_ORDER_ACCEPTANCE_REQUIRED':!latest('QueueEntryConfirmed')?'COMMERCIAL_POLICY_GATE_BLOCKED':!latest('ProductionReleaseRecorded')?'PRODUCTION_RELEASE_REQUIRED':null};
    }
    return Object.freeze({recordEvent,deriveTransactionState});
  }
  async function verify(events){
    if(!Array.isArray(events))return false;
    if(!events.length)return true;
    try{const stream=create({streamId:events[0].streamId,links:events[0].links});for(const stored of events){const {hash:actual,previousHash,...e}=stored;const result=await stream.recordEvent(e,e.expectedPreviousSequence);if(result.hash!==actual||result.previousHash!==previousHash)return false;}return true;}catch{return false;}
  }
  const api=Object.freeze({schema:SCHEMA,types:TYPES,create,canonical,hash,verify});
  root.STBCommercialSequence=api;
  if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
