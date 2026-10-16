# Program alignment and commercial sequence template

Current shared transaction design and bounded installed contract

Store owns one manufacturing planner, selected-stock plan, modeled operation ledger and manufacturing Q. System's shared terms flow consumes the installed commercial event gate for offer, decision, order, simulated financial/fulfillment and custody records. Each downstream act consumes identified preceding evidence and adds its own source record. Public packet export preserves the exact accepted definition, manifest, Store answer and original customer decision.

The executable gate is `public/live/stb-commercial-sequence.js`, byte-identical to Store's `src/contracts/commercial-sequence.js`. Its exact schema, roles and links govern installed serialization. Only SIMULATED source adapters are installed; it performs no actual payment, inventory reservation or machine operation. The [manufacturing core](https://github.com/GeorgePlattDemo/store-zero/blob/main/src/evaluation/engine/store-manufacturing-core.mjs) is the adopted Store runtime authority.

The broader examples below are design requirements for future source integrations and durable custody, not alternate executable schemas or evidence that those integrations exist. System owns shared workflow meaning; Store owns its commercial acts, material, modeled time and Q. The six customer steps remain Intent, The bench, The Store answers, Your call, We cut it, Pick up & build.

## 1. Ownership and the point of connection

*Authority category: Current System Behavior*

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

*Authority category: Current System Behavior*

System and Store use the same executable event gate: System's `public/live/stb-commercial-sequence.js` and Store's `src/contracts/commercial-sequence.js` are byte-identical. System attaches the verified answer and manifest as C01. Later progression requires explicit, identified source records and seller policy. Customer acceptance, seller order, simulated finance, queue, execution, inspection and custody are separate source records. The UI retains its shared six-step navigation and leaves each unavailable stage pending.

Only simulated evidence sources are installed. Actual source records are refused. Each event validates prerequisites, identities, actor/source, expected sequence and idempotency; verification replays the gate and recomputes the content hashes. The `/v1/commercial-events` Store endpoint validates the submitted stream and proposed event without making external commercial or machine changes.

## 3. Reusable commercial sequence

*Authority category: Current System Behavior*

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

*Authority category: Current System Behavior*

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

*Authority category: Current System Behavior*

The installed serialization is governed by `public/live/stb-commercial-sequence.js`, byte-identical to Store's `src/contracts/commercial-sequence.js`. Use its actual field names, lower-case actor roles, allowed links and `previousHash`/`hash` chain. `create`, `recordEvent`, `deriveTransactionState` and `verify` derive state from explicit source evidence. The stream is carried in browser session memory; this module is not durable commercial storage.

The exact definition revision, request, receipt/calculation, manifest and Store authority remain bound. Offer, customer decision, order and later event identities are added by their responsible sources. Same idempotency key and identical content returns the existing event; changed content under that key is refused. Hash links establish content consistency, not actor authentication. Actual source records are refused because only SIMULATED adapters are installed.

## 6. Price, time, and exceptions

*Authority category: Current System Behavior*

**Customer amount.** Retain the unchanged manufacturing answer and Q. The seller's offer itemizes any additional services, freight, taxes, fees, discounts or allowances and supplies the agreed amount and currency. Every extra is either explicitly included in Q, separately priced, expressly waived, or unresolved. An unresolved amount cannot be converted to zero. System neither recomputes Store economics nor treats Q as the final transaction amount by assumption. Financial balances derive from confirmed records; capture and settlement are not both counted as separate customer payments.

**Complete service economics.** Program's trial requires preparation, machine occupancy, operator time, inspection, staging, handoff, recovery, rework, support, downtime and realistic utilization. The candidate already counts its declared loading/seat and release/label time. Record the remaining service activities and their costs separately, with inclusion/allocation basis so handling, operator cost and annual overhead are not counted twice. Keep modeled time, observed time, customer charges and internal costs distinct. Queue wait and payment delay do not become billable spindle time.

**Revision or substitution.** Create a new definition revision for a changed required result or material requirement, obtain a fresh Store answer, and issue the applicable new offer/change record. Seller substitution of an interchangeable parent within a declared allowed plan still needs a recorded compatibility/capability check and attributable commercial treatment. Never change the frozen sold scope or its price invisibly. A physically interrupted or altered job cannot resume merely because a new financial event arrived.

**Shortage, expiry or capacity loss.** Record the failed or expired commitment, its source and affected dependencies. Hold the applicable progression. Re-evaluate/re-offer where required by the change and terms; do not silently choose another species or replace an expired commitment with a displayed availability count.

**Cancellation and refund.** Record a request, the responsible seller's disposition, affected remaining scope, consumed material and any stop instruction separately. Refund requested, authorized and confirmed are different financial events. Apply the agreed seller terms and record the basis; this template specifies no cancellation fee, refund entitlement or schedule.

**Fault or nonconformance.** Preserve execution, loss and inspection evidence. Quarantine affected output and record the responsible disposition, rework/replacement scope and applicable commercial adjustment. Outstanding nonconformance blocks ordinary ready/handoff progression for that scope; any partial or qualified handoff needs explicit agreed disposition.

## 7. Future Work — source integrations and durable custody

*Authority category: Future Work*

Actual seller, financial, inventory, scheduling, notification, custody and local-machine adapters are future integrations. They must preserve the existing definition/manifest/receipt/calculation chain and avoid any second planner, Q or machine authority. Cross-order stock commitments require atomic concurrency; browser event custody is not that implementation.

Commission source authentication, durable records, policy-specific payment/reservation/capacity rules, correction and cancellation, shortage/nonconformance recovery, inspected fulfillment and target-controller readiness independently. An unresolved prior exception currently holds progression; a later resolved exception does not generally clear it. Proposed extensions require their own adopted contracts and verification.

## 8. Historical Evidence — design provenance

*Authority category: Historical Evidence*

Current owners are System's definitions, public terms and demo-commerce helpers; Store's request, packet and machine contracts; and the byte-identical shared commercial gate. Program's current supervised trial supplies future engineering and economic evidence requirements.

The original design was inspected against Program `5093b08`, System `0cb4bea` and Store `3afe00a`. Those identities document the proposal stage only; Git preserves the original envelope and adoption discussion. They do not certify present runtime behavior.
