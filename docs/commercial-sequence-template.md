# Program alignment and commercial sequence template

11 October 2026 · Proposed shared contract for all jobs · Revision 0.1

The shared manufacturing candidate has now been reviewed against Program's current authority and trial requirements. It belongs at the Store evaluation boundary: one neutral job, one selected-stock plan, one modeled operation ledger, and one manufacturing Q. A separate System transaction module should carry the subsequent offer, decision, order, financial, fulfillment, and custody records. Each downstream act consumes the identified output of the preceding act and adds its own evidence.

This is a concrete implementation template, published identically in System and Store for review. System retains authority over shared workflow meanings; Store retains authority over its commercial acts, material, modeled time and Q. The [manufacturing candidate](https://github.com/GeorgePlattDemo/store-zero/blob/main/docs/store-manufacturing-core.mjs) is published only in Store. These candidates have not been adopted into the runtime. The proposed event names require adoption in System's shared definitions and contracts; the shared map creates no second definitions authority. The existing six customer steps can remain: Intent, The bench, The Store answers, Your call, We cut it, Pick up & build.

## 1. Ownership and the point of connection

| Owner | Responsibility in this design | Output carried forward |
| --- | --- | --- |
| Program | Research, candidate engineering, full-service economic comparison, experiments, adoption rationale | Identified assumptions, findings, proposed tests, and development decisions |
| System | Job meaning, revision, complete manifest, contracts, customer decision, transaction and owner-record custody | Exact definition, attributable Store answer and commercial records, linked without reinterpretation |
| Store / responsible seller | Catalog, represented stock, admitted capability, modeled time, Q, commercial terms, reservations, allocations, scheduling, fulfillment | Identified answer or refusal; seller-issued offer and seller-confirmed downstream acts |
| Financial source | Evidence of the actual financial act under the seller's terms | Attributable authorization, capture, settlement, failure, void, refund, or other agreed tender record |
| Local implementation and operator | Registered configuration, lowering, material admission, readiness, local operating permission and execution | Identified plan, admission result, execution evidence, faults and consumed material |
| Inspection and fulfillment roles | Conformance disposition, staging, notification, actual transfer | Inspection, package inventory, notice, and custody records |

One manufacturing engine serves every neutral job; one transaction module serves every supported job. Project-specific code supplies job requirements. Seller policy supplies commercial requirements. The transaction module does not select replacement SKUs, reproduce Q, or generate controller instructions.

The join is the frozen definition revision plus the exact Store request, answer, receipt, calculation identities, and authority. Add an offer/version, customer decision, seller order, and packet identity as those acts occur. Material, capacity, release, execution, inspection, and custody receive their own identities. A single order ID is insufficient to identify all these acts.

The candidate's `selectedStock` is a proposed SKU/quantity plan. Its `operations` ledger predicts occupied time. Its `Q` covers material, hardware, and its declared machine/cut service. Reservation, actual work, financial activity, and inspected results come from their respective sources.

## 2. Adopted implementation

System and Store use the same executable event gate: System's `public/live/stb-commercial-sequence.js` and Store's `src/contracts/commercial-sequence.js` are byte-identical. System attaches the verified answer and manifest as C01. Later progression requires explicit, identified source records and seller policy. Acceptance no longer manufactures payment, queue, cutting, inspection, or custody evidence. The UI retains its shared six-step navigation and leaves each unavailable stage pending.

Only simulated evidence sources are installed. Actual source records are refused. Each event validates prerequisites, identities, actor/source, expected sequence and idempotency; verification replays the gate and recomputes the content hashes. The `/v1/commercial-events` Store endpoint validates the submitted stream and proposed event without making external commercial or machine changes.

## 3. Reusable commercial sequence

Each row specifies an event to record after its stated act has occurred. Missing evidence leaves the next applicable act pending or blocked. Sending a command records a request, not its successful result. Simulated runs use the same requirements and retain `evidenceClass: "SIMULATED"` throughout.

| Event | Responsible source | Prerequisites and required output | Permitted next progression |
| --- | --- | --- | --- |
| C01 `StoreAnswerAttached` | Store answer; System verifies and retains it | Confirmed revision and independent complete manifest; exact request/answer correlation, current expected Store release, intact receipt and calculation identities; all unevaluated requirements named | Present the answer. Only a complete supportable scope can proceed to an offer for that scope |
| C02 `OfferIssued` | Responsible seller | C01, identified scope, offer ID/version, seller/location, currency, itemized total, terms version, validity, fulfillment method, payment and reservation policy, timing basis | Present these exact terms for a customer decision |
| C03 `CustomerDecisionRecorded` | Identified customer decision retained by System | Exact offer/version and revision shown; decision ID, accepted/declined/deferred/revision requested, time and attributable evidence | Accepted decision may proceed to seller acceptance. Other decisions preserve the result without progressing the order |
| C04 `OrderAccepted` | Responsible seller | Accepted C03; valid offer; seller-confirmed availability/capability and agreed terms; order ID, accepted scope and offer snapshot | Initiate the agreed payment, reservation, and scheduling requirements |
| C05 `FinancialEventRecorded` | Agreed financial source, confirmed by seller adapter | Order/offer identity, source record ID, currency and amount in minor units, actual event kind and time; duplicate delivery is idempotent | Advance only the financial condition explicitly required by the terms; an authorization, capture and settlement remain distinct facts |
| C06 `ReservationConfirmed` / `CapacityCommitmentRecorded` | Store and scheduler | Required stock/capacity commitments under seller policy; quantities, location, expiry/release rules, capacity window and commitment IDs | Permit the corresponding queue or allocation progression; absent commitments remain explicitly absent |
| C07 `QueueEntryConfirmed` | Yard scheduler | Accepted order and the seller's explicit entry conditions; queue ID, order/scope, dependencies and schedule basis | Pending work becomes visible to the yard; queue position does not permit machine motion |
| C08 `ProductionReleaseRecorded` | Responsible local production authority | Accepted frozen scope; terms' financial condition; valid required commitments and actual material allocation; identified job packet, responsible authority and restrictions | Permit preparation of the bound local plan and request local admission |

Rows C05–C07 can progress in a different order only when the identified seller policy states the dependencies. Full prepayment, deposit, approved credit, and payment at pickup are different policies; this template selects none of them. A missing policy blocks the affected progression. Reservation before seller acceptance, if supported, is a separate provisional commitment with its own expiry and disposition.

A fresh seller validation at C04 is retained as a new record. It does not overwrite C01 or the offered answer. If the offered price, required result, supported scope, or terms change, issue a new offer and obtain the required customer decision. A seller's commercial commitment is preserved according to its terms; later Store re-evaluation cannot silently change an accepted amount or release unresolved physical work.

## 4. Linked material, execution, and custody sequence

These are separate records attached to the commercial order. They make the commercial outcome auditable without turning the transaction module into a machine controller.

| Event | Required prior facts | Evidence and next act |
| --- | --- | --- |
| F01 `MaterialAllocated` | Accepted scope, selected-stock plan, applicable reservation and allocation policy | Store identifies actual parents/lots/quantity/location and condition; confirms compatibility and atomically commits quantities. SKU selection alone supplies none of this evidence |
| F02 `MaterialIssued` | Valid F01 and work-preparation authority | Record physical movement to the local cell and the responsible custody; preserve unused stock, returned remnants, loss and consumption as subsequent acts |
| F03 `LocalPlanBound` | C08, exact accepted packet and requirements, actual allocated material, registered local configuration | Retain command artifact identity, configuration/tool/transform identities, lowering version, required inspections and unresolved prerequisites. Reject unsupported or inconsistent work |
| F04 `LocalAdmissionRecorded` | Bound plan and verified local prerequisites | Local authority records admission or refusal for the actual machine/material/configuration. Physical admission stays BLOCKED while commissioning requirements remain unmet |
| F05 `ExecutionEventRecorded` | Valid local admission, current readiness, and locally authorized start | Record start, progress, interruption, completion or failure, execution ID, consumed material and actual operation evidence. Faults invalidate dependent permissions according to local rules |
| F06 `InspectionDispositionRecorded` | Identified outputs and same required revision; applicable inspection criteria | Record uninspected/conforming/nonconforming/dispositioned components and measured evidence. Any accepted secondary-work responsibility must be explicit and within the offered scope |
| F07 `StagingRecorded` | Required inspection/completion dispositions settled for the handed-over scope | Identify package IDs, physical component IDs, labels, quantities, returned remnants and location; preserve rejected or missing parts separately |
| F08 `ReadyNoticeRecorded` | F07 and terms' ready-notice conditions | Record the notice actually issued, its referenced scope and fulfillment instructions. Delivery of a notice can be recorded separately when evidence exists |
| F09 `CustodyTransferred` | Identified recipient or authorized carrier, packages and actual transfer; terms' handoff conditions | Record transfer ID, parties, location/time, package/part quantities, condition and attributable acknowledgment |
| F10 `ProjectCloseoutRecorded` | Custody/completion disposition and financial/reconciliation conditions specified by the terms | Append an owner-record closeout with known results, unresolved claims or further work. Delivery of components does not establish that the customer's assembly is complete |

F01 must precede C08; F02's position relative to C08 is governed by the local material-issue policy. F03–F05 preserve the machine-specific progression separately. Inspection and secondary-work disposition gate staging/readiness for the agreed handed-over scope. The documented System completion statuses and roles should govern these completion decisions when adopted.

## 5. Common record envelope

The following is a fill-in schema example, not an executed event. The event module assigns IDs and sequence under concurrency control. The responsible adapter supplies source evidence; UI text cannot supply it.

```json
{
  "schema": "STB-COMMERCIAL-EVENT-1",
  "eventId": "<unique-event-id>",
  "eventType": "OrderAccepted",
  "streamId": "<transaction-stream-id>",
  "sequence": 4,
  "expectedPreviousSequence": 3,
  "causedByEventIds": ["<accepted-customer-decision-event-id>"],
  "idempotencyKey": "<source-system-and-source-record-id>",
  "occurredAt": "<source-UTC-instant>",
  "recordedAt": "<System-UTC-instant>",
  "actor": { "partyId": "<seller-id>", "role": "SELLER" },
  "evidenceClass": "SIMULATED",
  "authority": {
    "sourceSystem": "<responsible-source>",
    "sourceRecordId": "<source-record-id>",
    "verificationRecordId": "<adapter-verification-id>",
    "policyId": "<seller-policy-id>",
    "policyVersion": "<policy-version>"
  },
  "links": {
    "projectId": "<project-id>",
    "definitionId": "<definition-id>",
    "revisionId": "<revision-id>",
    "manifestHash": "<complete-manifest-hash>",
    "requestId": "<Store-request-id>",
    "receiptHash": "<unchanged-Store-receipt-hash>",
    "storeRevision": "<adopted-Store-release>",
    "modelId": "<adopted-model-id>",
    "modelHash": "<adopted-model-hash>",
    "inputHash": "<Store-calculation-input-hash>",
    "resultHash": "<Store-calculation-result-hash>",
    "offerId": "<seller-offer-id>",
    "offerVersion": "<seller-offer-version>",
    "decisionId": "<customer-decision-id>",
    "orderId": "<seller-order-id>",
    "packetId": "<accepted-packet-id>"
  },
  "payload": {
    "acceptedScopeId": "<scope-id>",
    "termsVersion": "<agreed-terms-version>",
    "currency": "USD",
    "agreedTotalMinor": null,
    "sellerAcceptanceReference": "<seller-acceptance-record>"
  },
  "previousEventHash": "<previous-event-hash>",
  "eventHash": "<hash-of-canonical-record-excluding-eventHash>"
}
```

`null` amount and placeholder identities make this example incomplete; it must fail an actual `OrderAccepted` gate. Before an order or packet exists, omit those links and require them only in events that depend on them. Domain-specific events additionally link financial, reservation, capacity, material, release, execution, inspection, package and transfer IDs as applicable.

System's event module validates these records, appends them durably, and derives separate commercial, financial, material, production, quality and custody states. Reopening the owner file preserves the original snapshots, events and schema versions. Corrections and changes append identified records; history is retained.

The module exposes a bounded interface such as `recordEvent(validatedSourceRecord, expectedSequence)` and `deriveTransactionState(events, identifiedPolicy)`. Source adapters perform the actual authorized business or machine acts. The event module has no automatic financial, inventory or physical side effects. Retries return the existing event when the same idempotency key and payload recur; a changed payload under that key is refused. Cross-order stock commitment belongs in the Store's inventory authority with atomic concurrency control.

## 6. Price, time, and exceptions

**Customer amount.** Retain the unchanged manufacturing answer and Q. The seller's offer itemizes any additional services, freight, taxes, fees, discounts or allowances and supplies the agreed amount and currency. Every extra is either explicitly included in Q, separately priced, expressly waived, or unresolved. An unresolved amount cannot be converted to zero. System neither recomputes Store economics nor treats Q as the final transaction amount by assumption. Financial balances derive from confirmed records; capture and settlement are not both counted as separate customer payments.

**Complete service economics.** Program's trial requires preparation, machine occupancy, operator time, inspection, staging, handoff, recovery, rework, support, downtime and realistic utilization. The candidate already counts its declared loading/seat and release/label time. Record the remaining service activities and their costs separately, with inclusion/allocation basis so handling, operator cost and annual overhead are not counted twice. Keep modeled time, observed time, customer charges and internal costs distinct. Queue wait and payment delay do not become billable spindle time.

**Revision or substitution.** Create a new definition revision for a changed required result or material requirement, obtain a fresh Store answer, and issue the applicable new offer/change record. Seller substitution of an interchangeable parent within a declared allowed plan still needs a recorded compatibility/capability check and attributable commercial treatment. Never change the frozen sold scope or its price invisibly. A physically interrupted or altered job cannot resume merely because a new financial event arrived.

**Shortage, expiry or capacity loss.** Record the failed or expired commitment, its source and affected dependencies. Hold the applicable progression. Re-evaluate/re-offer where required by the change and terms; do not silently choose another species or replace an expired commitment with a displayed availability count.

**Cancellation and refund.** Record a request, the responsible seller's disposition, affected remaining scope, consumed material and any stop instruction separately. Refund requested, authorized and confirmed are different financial events. Apply the agreed seller terms and record the basis; this template specifies no cancellation fee, refund entitlement or schedule.

**Fault or nonconformance.** Preserve execution, loss and inspection evidence. Quarantine affected output and record the responsible disposition, rework/replacement scope and applicable commercial adjustment. Outstanding nonconformance blocks ordinary ready/handoff progression for that scope; any partial or qualified handoff needs explicit agreed disposition.

## 7. Specific integration surfaces and remaining decisions

| Surface | Proposed change |
| --- | --- |
| Program `governance/authority.md`, `research/bounded-cell-trial.md` | Existing ownership and full-service research requirements guide this design; reference adopted owner contracts and retain candidate/adoption findings without duplicating the engine |
| System `docs/DEFINITIONS.md` and affected contracts | Adopt the missing event meanings, source roles, financial distinctions, domains, policy references and revision behavior once; reuse existing completion meanings |
| System `public/live/stb-terms-flow.js` | Retain the shared all-job flow; delegate to one transaction module and render verified pending/completed/blocked events without automatic success propagation |
| System `src/system/acceptance.ts`, `src/system/session.ts` | Freeze exact offer/decision/answer content, persist event identities and history, and explicitly evolve the accepted-packet/owner-record schema |
| Store `src/requests/store-request.mjs` and contracts | Adopt the manufacturing candidate through the one request/receipt boundary; bind answer authority to model/configuration; expose seller commercial and stock actions separately through attributable interfaces |
| Local registered implementation | Consume the accepted requirements, actual material and explicit release; retain configuration, admission, execution and result identities; reject incompatible plans |

The implementation must resolve the seller/location and permitted actors; offer validity and acceptance policy; fulfillment scope and timing; price inclusions and tax source; payment/credit schedule; reservation and capacity policy; cancellation/refund handling; inspection criteria and secondary-work responsibility; partial fulfillment and actual custody evidence. These are required policy fields, not invented defaults. The present demonstration keeps commerce simulated and physical admission blocked.

Adoption can proceed in bounded stages: first the canonical event/policy and manifest contracts; then Store's single manufacturing authority and System's lossless answer/offer/event integration; then exact packet/lowering verification and joint tests before a deliberate pin change. A simulation of the event chain can be exercised before any actual commercial or machine interfaces are available. Historical Project 1 evidence remains unchanged.

Required future checks include: refusal/unresolved scope cannot open an offer; edited or stale offer cannot be accepted as current; acceptance alone cannot satisfy financial/allocation gates; duplicates/concurrent submissions cannot duplicate orders, charges or stock commitments; revised jobs retain old history; shortage/nonconformance blocks dependent work; an actual financial event cannot promote simulated physical evidence; pickup requires the applicable quality, financial and transfer evidence; and owner-record export/import preserves identities and schema versions. These are proposed adoption tests, not tests claimed to have run for this template.

## 8. Sources and verification of this delivery

Inspected current repository heads:

- [Program · 5093b08](https://github.com/GeorgePlattDemo/3d-solutions-program/tree/5093b08dfafddfd38b345b816727739dc3bf5285): README, AGENTS, authority, Demand as Architecture, Bounded Cell Trial, Machine Development, and Evidence.
- [System · 0cb4bea](https://github.com/GeorgePlattDemo/new-system/tree/0cb4bea743b16a026f57e46d873d433761835069): shared definitions, terms flow, acceptance/session surfaces, and Store boundary references.
- [Store · 3afe00a](https://github.com/GeorgePlattDemo/store-zero/tree/3afe00ac8672da0791ee8a7af05422d24f6785ab): operational specification and accepted-packet contract; Project 1 review Appendix C H01–H12 supplies the preserved handoff rationale.

The manufacturing core is active in Store's `src/evaluation/engine/store-manufacturing-core.mjs`. System submits its complete definition manifest and consumes the Store's quote and operation ledger. The shared commercial module implements the sequence gates above for explicit simulated evidence. Physical production, financial activity, stock reservation and custody require commissioned source adapters and remain blocked in this migration.
