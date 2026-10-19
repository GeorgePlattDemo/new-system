/** Declared demo seller and fulfillment source. Uses Store Q; never prices work or performs commerce. */
(function(root){
  'use strict';
  const POLICY=Object.freeze({id:'STB-DEMO-PICKUP',version:'1',requiredFinancialKind:'CAPTURED',reservationRequired:false,capacityRequired:false,stageOrder:['OrderAccepted','FinancialEventRecorded','QueueEntryConfirmed','MaterialAllocated','ProductionReleaseRecorded']});
  const TERMS=Object.freeze({id:'STB-DEMO-TERMS',version:'1',sellerId:'store-zero-demo',sellerLocation:'Demo yard',currency:'USD',validHours:24,fulfillment:'PICKUP',notice:'Demo · no money moves or machines run.'});
  const copy=value=>JSON.parse(JSON.stringify(value));
  const id=kind=>'SIM-'+kind+'-'+root.crypto.randomUUID();
  function create({body,extraRequests = [],read,append,isCurrent}){
    const answer=body.rawEvaluation,receipt=body.evaluationReceipt||answer?.evaluationReceipt;
    const amount=answer?.totals?.Q;
    if(answer?.status!=='SUPPORTABLE'||answer.complete!==true||!answer.manifestCoverage||!receipt?.manifestHash||typeof amount!=='number'||!Number.isFinite(amount)||amount<0)throw Error('COMPLETE_STORE_MANIFEST_EVIDENCE_REQUIRED');
    if(!Array.isArray(answer.selectedStock)||!answer.selectedStock.length||answer.selectedStock.some(row=>!row.storeSku||!Number.isInteger(row.qty)||row.qty<1))throw Error('DEMO_STORE_STOCK_EVIDENCE_REQUIRED');
    const amountMinor=Math.round(amount*100),streamId=read().streamId;
    const latest=type=>read().events.findLast(event=>event.eventType===type);
    function active(){if(!isCurrent()||read()?.streamId!==streamId)throw Error('DEMO_REVISION_CHANGED');}
    async function write(type,payload){
      active();
      const before=read(),spec=root.STBCommercialSequence.types[type];
      const eventId=id(type),at=new Date().toISOString();
      const required=spec.requires.map(kind=>before.events.findLast(event=>event.eventType===kind));
      if(required.some(event=>!event))throw Error('COMMERCIAL_PREREQUISITE_MISSING');
      await append({schema:root.STBCommercialSequence.schema,eventId,eventType:type,streamId,sequence:before.sequence+1,expectedPreviousSequence:before.sequence,causedByEventIds:required.map(event=>event.eventId),idempotencyKey:eventId,occurredAt:at,recordedAt:at,actor:{partyId:spec.role==='customer'?'demo-customer':TERMS.sellerId,role:spec.role},evidenceClass:'SIMULATED',authority:{sourceSystem:'stb-demo-commerce',sourceRecordId:eventId,verificationRecordId:eventId,policyId:POLICY.id,policyVersion:POLICY.version},links:before.events[0].links,payload});
      active();return latest(type);
    }
    async function prepareOffer(){
      if(latest('OfferIssued'))return;
      const until=new Date(Date.now()+TERMS.validHours*60*60*1000).toISOString();
      await write('OfferIssued',{offerId:id('OFFER'),offerVersion:'1',sellerId:TERMS.sellerId,sellerLocation:TERMS.sellerLocation,currency:TERMS.currency,manufacturingQMinor:amountMinor,amountMinor,scope:'MANUFACTURING_MODEL_ONLY',termsId:TERMS.id,termsVersion:TERMS.version,validUntil:until,fulfillment:{mode:TERMS.fulfillment,timingBasis:'Store-modeled work; advance the yard simulation to READY',location:TERMS.sellerLocation},policy:copy(POLICY),extras:[{kind:'tax',disposition:'OUTSIDE_SCOPE'},{kind:'delivery',disposition:'OUTSIDE_SCOPE'},{kind:'additional-services',disposition:'OUTSIDE_SCOPE'},...copy(extraRequests)]});
    }
    async function checkout(){
      const offer=latest('OfferIssued'),decision=latest('CustomerDecisionRecorded');
      if(!offer||decision?.payload.decision!=='ACCEPTED')return;
      if(!latest('OrderAccepted'))await write('OrderAccepted',{orderId:id('ORDER'),offerId:offer.payload.offerId,offerVersion:offer.payload.offerVersion,availabilityConfirmed:true,capabilityConfirmed:true});
      if(!latest('FinancialEventRecorded')){const payment=id('PAYMENT');await write('FinancialEventRecorded',{financialEventId:payment,kind:'CAPTURED',currency:TERMS.currency,amountMinor,providerRecordId:payment});}
      if(!latest('QueueEntryConfirmed'))await write('QueueEntryConfirmed',{queueEntryId:id('QUEUE'),position:1});
    }
    async function runYard(){
      if(!latest('QueueEntryConfirmed')||latest('ReadyNoticeRecorded'))return;
      const links=read().events[0].links;
      if(!latest('MaterialAllocated'))await write('MaterialAllocated',{allocationId:id('ALLOCATION'),atomic:true,assignments:answer.selectedStock.map(row=>({parentId:id('PARENT'),materialId:id('MATERIAL'),lotId:id('LOT'),storeSku:row.storeSku,qty:row.qty,location:TERMS.sellerLocation,condition:'SIMULATED_REFERENCE_STOCK',compatibleDefinitionId:links.definitionId}))});
      const allocation=latest('MaterialAllocated').payload;
      if(!latest('MaterialIssued'))await write('MaterialIssued',{issueId:id('ISSUE'),allocationId:allocation.allocationId,materialIds:allocation.assignments.map(row=>row.materialId),location:TERMS.sellerLocation});
      if(!latest('ProductionReleaseRecorded'))await write('ProductionReleaseRecorded',{releaseId:id('RELEASE'),packetId:id('PACKET'),allocationId:allocation.allocationId,releaseAuthorityId:id('DEMO-RELEASE')});
      if(!latest('LocalPlanBound'))await write('LocalPlanBound',{localPlanId:id('PLAN'),packetId:latest('ProductionReleaseRecorded').payload.packetId,allocationId:allocation.allocationId,planHash:await root.STBCommercialSequence.hash({basis:'DEMO_REFERENCE_ONLY',operations:answer.operations}),machineConfigHash:await root.STBCommercialSequence.hash({basis:'DEMO_REFERENCE_ONLY',manufacturingModelHash:links.modelHash})});
      if(!latest('LocalAdmissionRecorded'))await write('LocalAdmissionRecorded',{admissionId:id('DEMO-ADMISSION'),localPlanId:latest('LocalPlanBound').payload.localPlanId,readinessRecordId:id('DEMO-READINESS'),admitted:true});
      const admission=latest('LocalAdmissionRecorded').payload;
      if(!latest('ExecutionEventRecorded'))await write('ExecutionEventRecorded',{executionId:id('DEMO-EXECUTION'),admissionId:admission.admissionId,kind:'COMPLETED'});
      const components=[...answer.manifestCoverage.boardPartIds,...answer.manifestCoverage.sheetPackageIds];
      if(!latest('InspectionDispositionRecorded'))await write('InspectionDispositionRecorded',{inspectionId:id('DEMO-INSPECTION'),executionId:latest('ExecutionEventRecorded').payload.executionId,disposition:'ACCEPTED',components});
      if(!latest('StagingRecorded'))await write('StagingRecorded',{stagingId:id('STAGING'),inspectionId:latest('InspectionDispositionRecorded').payload.inspectionId,packages:[id('PACKAGE')],components,remnants:answer.parents.map(parent=>({packageId:parent.packageId,remainingLengthIn:parent.remainingLengthIn??null})),location:TERMS.sellerLocation});
      await write('ReadyNoticeRecorded',{noticeId:id('READY'),stagingId:latest('StagingRecorded').payload.stagingId,recipientId:'demo-customer',noticeRecordId:id('DEMO-NOTICE')});
    }
    async function pickup(){
      const ready=latest('ReadyNoticeRecorded');if(!ready)return;
      if(!latest('CustodyTransferred'))await write('CustodyTransferred',{handoffId:id('HANDOFF'),noticeId:ready.payload.noticeId,recipientId:ready.payload.recipientId,packages:latest('StagingRecorded').payload.packages,handoffEvidenceId:id('DEMO-PICKUP')});
      if(!latest('ProjectCloseoutRecorded'))await write('ProjectCloseoutRecorded',{closeoutId:id('CLOSEOUT'),handoffId:latest('CustodyTransferred').payload.handoffId,records:read().events.map(event=>event.eventId),assemblyStatus:'OWNER_BUILDS'});
    }
    return Object.freeze({prepareOffer,checkout,runYard,pickup});
  }
  root.STBDemoCommerce=Object.freeze({create,terms:TERMS,policy:POLICY});
})(typeof window!=='undefined'?window:globalThis);
