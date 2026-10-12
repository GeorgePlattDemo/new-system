# Shared definitions and System meaning

This is the concise authority for common job meaning and System's handoff semantics. The [System master](../SYSTEM-MASTER.md) explains the application; executable contracts constrain serialized records. A disagreement between this dictionary and code is an explicit reconciliation item. Neither a convenient implementation nor an explanatory example silently changes meaning.

**Program investigates and records why. System defines what the job means. Store determines what its identified Store can provide.** Store owns its catalog, stock, operations, modeled time, Q, answers and manufacturing evidence. This dictionary does not redefine those implementations; their complete explanation is in the [identified Store master](https://github.com/GeorgePlattDemo/store-zero/blob/cd08aff624adf3b3a01ac0a42ea33681c5ba2bef/STORE-ZERO-MASTER.md).

## Customer definition and journey

| Term | Governing meaning |
| --- | --- |
| **Scan-to-Build** | A sufficiently resolved requirement meets identified material and bounded productive capability, receives an attributable answer or refusal and preserves the consequential record. A scan is optional |
| **Owner declaration** | What the person actually supplied. Interpretation, classification and derivation retain their provenance and do not rewrite the declaration |
| **Idea** | Unnumbered intake/context: description, image, sketch, scan, plan or previous work. Its contents are not automatically governing dimensions |
| **Intent** | Step 1: establishes this job's requirements, scope, meaningful controls, tools and unresolved facts |
| **The Bench** | Changes values established at Intent and displays the resulting definition. It does not invent a required knob |
| **Knob / configurator** | A setting needed to state or vary one job; the configurator is that job's established set of controls, not a universal project definition |
| **Trail** | Six numbered stages: Intent → The Bench → The Store answers → Your call → We cut it → Pick up & build. A stage can contain several pages |
| **Shared Home / tile** | The project library and one bounded project entry. The library has no project trail buttons |
| **Three doors / User 1** | New, returning and professional entries lead to the same library. User 1 is a demonstration identity, not authenticated account evidence |
| **Library project** | Published mapped definition opened read-only; MAKE CHANGES establishes a working copy and SAVE adds it to My Projects. Opening is distinct from owning |
| **Requirement / constraint / preference** | Respectively a condition that must be satisfied, a limit on solutions and a desired condition that is not mandatory unless explicitly selected as a requirement |
| **Selection / confirmation** | An entitled actor's deliberate choice or acknowledgment. Neither establishes physical truth by itself |
| **Job-definition revision** | Identified customer requirements, values, derivations, feature/component identities and unresolved responsibilities at one revision. It is distinct from the outgoing inquiry |
| **Source / observation / verification** | Origin of information, an attributed observed/document-derived result, and establishment by the required method/authority. Declared and observed facts retain their status |
| **Measurement / uncertainty** | A value from a stated method and its associated doubt. Numeric precision alone establishes neither accuracy nor verification |
| **Admission profile** | Independently declared required facts for a tile and inquiry scope, each with its responsible owner. It does not derive its completeness from whatever rows the tile emits |
| **Responsibility ledger** | Recorded status, owner and basis for required facts. Missing, contradicted, stale or unverified required facts remain explicit |
| **Admissible** | Sufficiently defined and structurally representable for this inquiry. Store alone determines supportability |
| **Tile-host message** | Versioned tile identity, stage, usable steps and navigation request. Navigable does not mean admitted for Store inquiry |
| **Dev / reviewer guide** | Retained maintenance notes, governing rules and declared gaps. It does not create customer requirements or Store facts |
| **Additional services** | Selected further planning requirements exposed by Addl svcs. Current selections are not priced, sent to Store or included in an owner export |

The [trail](../public/live/stb-trail-contract.js), [tile admission contract](../public/live/shared/tile-host-admission-contract.mjs) and [definition responsibility contract](../public/live/shared/definition-contract.mjs) are their current executable interfaces. Their serialized status vocabularies are not interchangeable with ordinary prose.

## Geometry material and features

| Term | Governing meaning |
| --- | --- |
| **Part / component / feature** | An identified manufactured item, an item participating in a deliverable, and an identified required characteristic or operation location. Every consequential requirement is attributable to its item |
| **Dimension** | Extent, angle or position with units and reference meaning. A bare number does not settle its datum or plane |
| **Nominal / actual / finished size** | Commercial size designation, relevant physical material dimension and required result. They may differ and cannot be substituted silently |
| **Clear / usable dimension** | Unobstructed extent between identified boundaries, or portion available after stated limitations |
| **Fit / allowance / tolerance** | Geometric compatibility, intentional amount reserved for a named purpose and permitted variation. Fit alone establishes no structural adequacy |
| **Datum / origin / coordinates** | Identified engineering reference, coordinate zero and stated axes/directions. Site, part and machine coordinates are distinct; a transform needs an explicit relationship |
| **Material class / specification** | What the material is and what the particular use requires. Neither is a merchant SKU |
| **Species / species group / grade** | Appropriate botanical/commercial identity, commercial grouping and classification under an identified grading rule. Pine or hardwood alone may be insufficient |
| **Form / condition** | Board, sheet, hardware or other supplied form and relevant surfacing, moisture or other required condition. A sheet label alone does not identify its grade or suitability |
| **Stock-aware proposal** | System's reproducible part layout using current Store-offered dimensions and required finished geometry: minimize part count, then excess width. Per-component source nominal and finished width remain explicit |
| **End relation** | How the two ends relate, such as parallel. It is not a length datum |
| **Length datum** | Where finished length is measured. `long-long-outer-edge` is the current board convention; a source's long-point/short-point value requires an explicit correspondence |
| **Cut plane** | Which geometric plane carries the angle. Face miter and edge bevel are distinct requirements |
| **End identity** | Further identity of the measured endpoint when the datum does not already settle it. A supplied nonredundant identity travels unchanged or remains an explicit unresolved/refused obligation |
| **Redundant-end canonicalization** | Published board translation records a supplied second end label as redundant when the stated parallel/long-long datum already carries the priced meaning. It retains the supplied value and rule; it is not permission to erase a nonredundant requirement |
| **Kept face / kerf** | Finished face intended to remain and material removed by a saw cut. Neither changes the customer's stated dimension without an identified derivation |
| **Spot requirement** | Named location and across-width rule, with tool diameter and full-diameter depth when explicitly required. Drill-point travel is distinct from full-diameter penetration |
| **Through-edge profile** | Named path length, width position and through depth carried literally in `parts[].edgeProfiles`; Store determines supportability |
| **Edge preparation** | Named removal at the far and fence edges, carried as `edgePreparation`. Two edge removals remain separate required operations |
| **Tab / return requirement** | Stated retention mode, count/location and return of pieces. Retained tabs do not establish an external rating or completed assembly |
| **Manifest** | Independent expected coverage from the complete controlling definition before wire translation: `jobId`, `revision`, `boardPartIds`, `sheetPackageIds`, `featureIds`, `items` and `unresolvedRequirements`. Each item carries line identity and quantity; omitted work cannot become a complete answer |
| **Remnant / scrap** | Remaining input retained for useful return and material discarded under the declared process. Retention is a stated requirement, not inferred from a price |

The generic System optional-field shape is narrower than the current public/Store contract. That implementation discrepancy does not redefine a shared word or permit loss of supplied requirements. Outdoor's unresolved long-short versus long-long mapping is documented in the master and remains unrepaired.

## Inquiry answer and identities

| Term | Governing meaning |
| --- | --- |
| **Store pin** | Exact inspected executable commit governed by `STORE_CANDIDATE.inspectedCommit`. Runtime JSON, CI checkout and startup name the same commit. A caller label does not select a release |
| **Offering discovery** | `OFFERING_LOOKUP` asks the identified Store about offerings and returned limits. It carries no job manifest, Q or evaluation receipt and does not evaluate a job |
| **Store inquiry** | Formal job request `{requestType, requestId, demand, manifest}`. Preserve its exact bytes. `STORE-ZERO-REQUEST-2` is the HTTP response protocol, not an additional request field |
| **Manufacturing class** | Current job types `USER_DEFINED_BOARD_V1`, `CUT_PACKAGE_V1` and `SHEET_PACKAGE_V1`. Published projects retain separate definitions even when sharing a class. `BOARD_SQUARE_V1` and `ALCOVE_INSERT_V1` are retired Store request names |
| **Published wire** | Browser/server envelope `stb-store-zero-http/1`, carrying project/revision/scope/signatures around the original payload. It is distinct from Store's formal inquiry and its raw-byte digest |
| **Payload digest** | SHA-256 of the exact formal request bytes on the Store HTTP exchange. A digest is neither price nor signature |
| **Calculation identity** | Store's `inputHash` and `resultHash` for the governing inquiry/catalog/model. Preserve request ID when reproducing identity; identical geometry with another ID need not produce the same input identity |
| **Fresh evaluation** | A new evaluation of a formal request at identified Store state. Freshness does not imply supportability or stock reservation |
| **Evaluation receipt** | Exactly `freshnessRule`, `requestType`, `requestId`, `evaluatedAt`, `authority`, `demandHash`, `manifestHash`, `status`, `calculationIdentity`, `receiptHash`. Rule is `STB-STORE-FRESH-EVALUATION-0.1`; authority identifies Store/catalog/model/machine. Its hashed content must agree with the answer, inquiry, manifest and expected release |
| **Current answer** | Verified answer bound to the active attempt and exact definition revision. A later edit or reopening makes an earlier answer historical. A delayed reply does not regain current authority |
| **Store dispositions** | `SUPPORTABLE`, `REFUSED`, `UNRESOLVED`, and retained compatibility `NOT_ALL_LINES_SUPPORTABLE`. Inquiry rejection before evaluation is distinct from a fresh negative evaluation |
| **Budgetary Q** | Complete budgetary amount returned by Store for its identified evaluated scope. It may include material, modeled machine service, sourced items and registered manual service. System does not compute replacement Q or impose a per-cut prohibition on Store |
| **Partial / scoped estimate** | Priced subresult or complete estimate for a narrower declared scope. It cannot stand for full-job support; every carried unevaluated requirement remains visible |
| **Automatic Bench evaluation** | Opening or a relevant control change asks Store for the current definition. Pending/refused/unavailable states supply no replacement price; customer confirmation remains separate |
| **Outdoor option preview** | Separate complete inquiry for one alternative. Its answer does not govern the selected job or enter commercial terms. The selected definition has its own evaluation |
| **Refusal / unresolved** | Explicit negative boundary result, or missing/unsettled required information. Preserve the source's status and reason; unknown reason codes remain visible |
| **Transport / protocol failure** | Failed exchange or identity/contract mismatch. Neither becomes a manufactured Store refusal, a zero price or success |
| **Fail closed** | Do not advance the protected act when required facts or authority are missing, invalid, stale or contradictory |

Receipt verification checks the current interpreter's actual bindings; it does not independently recompute manufacturing or authenticate external source actors. The [candidate record](../src/system/store-candidate.ts), [manifest constructor](../src/system/manifest.ts) and [interpreter](../src/system/store/interpret.ts) identify the current implementations. The runtime pin remains `f7123a73c1ca60aa7eb180a86a1c365eaffe95db`; Store's documentary master at cd08aff is a separate identity.

## Records commerce and machine evidence

| Term | Governing meaning |
| --- | --- |
| **Owner record / archive** | Owner-held custody of declarations, revisions, original inquiries, manifests, responses, receipts and decisions, with consequential history. Public `stb-owner-archive` `.stb.json` and generic `STB-SYSTEM-RECORD-2` are separate actual record paths |
| **Version compatibility** | A saved schema is admitted deliberately. Unknown/malformed versions remain rejected; absent facts are not invented. Current generic packet2 production versus packet1 loader validation is an outstanding defect |
| **Accepted packet** | `STB-ACCEPTED-JOB-PACKET-2` binds the accepted definition, manifest, Store answer, receipt and simulated decision. Packet validity does not confer physical authority |
| **Append-only / correction** | Retain consequential prior acts; identify subsequent correction or supersession rather than silently replacing history. Idempotency prevents duplicate effects for the same identified act |
| **Your call / review** | Customer consideration of the current Store answer. `DefinitionReviewRecorded` and `UnresolvedDefinitionAcknowledged` record confirmation/acknowledgment, not purchase or resolved support |
| **Offer / order / capture / allocation** | Separate seller policy, accepted commercial obligation, finance evidence and stock/capacity assignment. One does not prove the others |
| **Demo checkout** | Explicit Job 1 SIMULATED policy: manufacturing-only USD Q, identified terms/pickup policy and 24-hour offer. Tax, delivery and additional services are outside scope. It supplies no fallback policy for other projects |
| **Commercial event** | Source-issued event under `STB-COMMERCIAL-EVENT-1`. Stream links remain exactly `projectId`, `definitionId`, `revisionId`, `manifestHash`, `requestId`, `receiptHash`, `storeRevision`, `modelHash`, `inputHash`, `resultHash`. Event-specific offer/order/packet identities belong in payload |
| **Source authority** | Responsible actor's entitlement within stated scope. Current shared gate accepts simulated records and refuses ACTUAL input until commissioned source adapters exist |
| **Simulated / modeled / actual** | Represented event without physical occurrence, calculated expectation, and observation from a real event. They retain distinct evidence labels |
| **Virtual machine evidence** | Pinned Store's `POST /v1/machine-evidence` answer for an accepted packet and inspected configuration. Current board/cut/sheet classes return modeled operations/predicted occupancy, not physical commands |
| **Work packet / lowering / machine program** | Governed work description, equipment-specific transformation and local executable representation. These are distinct stages; an informative model is not commissioned controller code |
| **Capability / readiness / authorization** | Ability within an envelope, present conditions for work and permission from the responsible authority for a specific act. None silently promotes into the next |
| **Machine/workpiece reference** | Machine-side reference and established workpiece origin. Homing does not prove the part reference; `POSITION_VALID` does not prove readiness or release |
| **Physical admission** | BLOCKED throughout this candidate; `physicalAuthority` is false. Price, acceptance, packet, modeled evidence or network presence cannot issue motion |
| **Inspection / handoff / closeout** | Attributed conformance evidence, custody transfer and identified completion record. READY or staged material does not mean picked up |

The [shared commercial contract](commercial-sequence-template.md) and [executable gate](../public/live/stb-commercial-sequence.js) remain unchanged and aligned with Store. The broader documentary example is not permission to add serialized fields. Store facts remain Store-owned: SKU identifies a merchant offering, material specification describes the requirement, fixture stock is not live inventory, an offering is not allocation, and budgetary Q is not a binding quote.

**No silent promotion. A saved answer is history. Admissible is not supportable. Supportable is not machine-ready. Simulation is not physical manufacture. NO BLOOD ON WOOD.**
