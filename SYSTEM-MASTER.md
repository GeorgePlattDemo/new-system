# Scan-to-Build System — Complete Application, Definition and Workflow Reference

3D Solutions LLC · 12 October 2026

**Define it once. Nobody downstream should have to redraw it.**

[Open the working application](https://system-candidate-production.up.railway.app/).

A replacement brace, shelves fitted to an alcove, a window-seat assembly, a picnic table from a published plan, or a plywood panel with an arched opening: the application gives each project a working definition. Bring the idea and its evidence, establish the requirements at **Intent**, then change their values on **the Bench**. The drawing, component list, feature locations and identified revision follow the same choices.

Each Bench asks an identified Store for a fresh answer automatically. Store selects its material and parent stock, evaluates the declared operations, and returns its own modeled time and budgetary total Q, or an attributable reason the work cannot proceed. System presents and preserves that answer. A changed dimension, wood selection or feature belongs to a new definition and requires another evaluation.

The customer can examine what was entered, what System derived, what reached Store and what came back. The same identities carry the job toward the customer's decision and the subsequent commercial and fulfillment records. Start Your Own includes an explicitly enabled simulated offer, Accept & Pay, yard queue and pickup demonstration. Other projects retain their own pending commercial requirements.

The engineering connection is reusable: the customer's resolved component requirements meet a registered Store and machine model. System establishes what the parts must become; Store determines the material and processing it can provide. Registered local machine engineering supplies the equipment-specific transformations. The deeper manufacturing explanation, issued-patent correspondence, full historical Project 1 trail, stock search, timing and economics belong in the [completed Store master](https://github.com/GeorgePlattDemo/store-zero/blob/cd08aff624adf3b3a01ac0a42ea33681c5ba2bef/STORE-ZERO-MASTER.md). Program owns the [research and supervised laboratory proposition](https://github.com/GeorgePlattDemo/3d-solutions-program).

This reference explains the complete System application and its handoff. The [shared definitions](docs/DEFINITIONS.md) specify common meaning; the executable contracts specify their bounded interfaces. Current machine evidence is modeled, commerce is simulated and physical release remains blocked. Those evidence states travel with the records.

## Contents

<!-- TOC START -->
- [1. Source baseline and ownership](#1-source-baseline-and-ownership)
  - [1.1 Frozen revisions](#11-frozen-revisions)
  - [1.2 The three owners](#12-the-three-owners)
  - [1.3 Observed application baseline](#13-observed-application-baseline)
  - [1.4 Evidence and editorial scope](#14-evidence-and-editorial-scope)
- [2. The customer journey](#2-the-customer-journey)
  - [2.1 One intake and six trail steps](#21-one-intake-and-six-trail-steps)
  - [2.2 Idea and source intake](#22-idea-and-source-intake)
  - [2.3 Intent establishes the tools](#23-intent-establishes-the-tools)
  - [2.4 The Bench changes the definition](#24-the-bench-changes-the-definition)
  - [2.5 Additional services](#25-additional-services)
  - [2.6 References and imagery](#26-references-and-imagery)
- [3. Start Your Own](#3-start-your-own)
  - [3.1 Source and entry](#31-source-and-entry)
  - [3.2 Controlling geometry and derivation](#32-controlling-geometry-and-derivation)
  - [3.3 Components manifest and Store request](#33-components-manifest-and-store-request)
  - [3.4 Fresh answer and visible consequences](#34-fresh-answer-and-visible-consequences)
  - [3.5 Decision and verification](#35-decision-and-verification)
- [4. Alcove and critical fit](#4-alcove-and-critical-fit)
  - [4.1 Source context and controlling choices](#41-source-context-and-controlling-choices)
  - [4.2 Stock-aware definition proposal](#42-stock-aware-definition-proposal)
  - [4.3 Edge finish and features](#43-edge-finish-and-features)
  - [4.4 Translation and coverage](#44-translation-and-coverage)
  - [4.5 Response presentation and boundaries](#45-response-presentation-and-boundaries)
- [5. Window Seat and space utilization](#5-window-seat-and-space-utilization)
  - [5.1 Sources Intent and entry](#51-sources-intent-and-entry)
  - [5.2 Starting values and named geometry](#52-starting-values-and-named-geometry)
  - [5.3 Components tools and independent manifest](#53-components-tools-and-independent-manifest)
  - [5.4 Inquiry identity and Store response](#54-inquiry-identity-and-store-response)
  - [5.5 Decision records and verification limits](#55-decision-records-and-verification-limits)
- [6. Outdoor and published plans](#6-outdoor-and-published-plans)
  - [6.1 Source selection and fixed starting definition](#61-source-selection-and-fixed-starting-definition)
  - [6.2 Bench control and revision](#62-bench-control-and-revision)
  - [6.3 Option previews and the committed inquiry](#63-option-previews-and-the-committed-inquiry)
  - [6.4 The unresolved end-meaning correspondence](#64-the-unresolved-end-meaning-correspondence)
  - [6.5 Authority evidence and downstream flow](#65-authority-evidence-and-downstream-flow)
- [7. Playhouse and the sheet stream](#7-playhouse-and-the-sheet-stream)
  - [7.1 Source and ownership presentation](#71-source-and-ownership-presentation)
  - [7.2 Geometry and selected tools](#72-geometry-and-selected-tools)
  - [7.3 Definition manifest and boundary](#73-definition-manifest-and-boundary)
  - [7.4 Store result and refusal presentation](#74-store-result-and-refusal-presentation)
- [8. System compilation and shared meaning](#8-system-compilation-and-shared-meaning)
  - [8.1 From source to an identified requirement](#81-from-source-to-an-identified-requirement)
  - [8.2 Two active System surfaces](#82-two-active-system-surfaces)
  - [8.3 Public admission and responsibility](#83-public-admission-and-responsibility)
  - [8.4 Independent complete manifest](#84-independent-complete-manifest)
  - [8.5 Translation rules and unresolved meaning](#85-translation-rules-and-unresolved-meaning)
- [9. The Store communication boundary](#9-the-store-communication-boundary)
  - [9.1 Public wire and formal inquiry](#91-public-wire-and-formal-inquiry)
  - [9.2 Complete protocol-2 example](#92-complete-protocol-2-example)
  - [9.3 Response and receipt](#93-response-and-receipt)
  - [9.4 Public presentation and currentness](#94-public-presentation-and-currentness)
  - [9.5 Reproduce preserved bytes](#95-reproduce-preserved-bytes)
- [10. Customer decision and commercial progression](#10-customer-decision-and-commercial-progression)
  - [10.1 The installed shared gate](#101-the-installed-shared-gate)
  - [10.2 Source acts and the customer stages](#102-source-acts-and-the-customer-stages)
  - [10.3 Identity and event custody](#103-identity-and-event-custody)
  - [10.4 Start Your Own policy and other pending flows](#104-start-your-own-policy-and-other-pending-flows)
- [11. Records identity and custody](#11-records-identity-and-custody)
  - [11.1 What an owner record preserves](#111-what-an-owner-record-preserves)
  - [11.2 Generic revisions and attempts](#112-generic-revisions-and-attempts)
  - [11.3 Accepted packet and evidence](#113-accepted-packet-and-evidence)
  - [11.4 History and correction](#114-history-and-correction)
- [12. Refusals errors and unresolved work](#12-refusals-errors-and-unresolved-work)
  - [12.1 Separate dispositions](#121-separate-dispositions)
  - [12.2 Typical reasons and faithful translation](#122-typical-reasons-and-faithful-translation)
  - [12.3 Failures after an answer](#123-failures-after-an-answer)
- [13. Application architecture and deployment](#13-application-architecture-and-deployment)
  - [13.1 Loaded pages and their responsibilities](#131-loaded-pages-and-their-responsibilities)
  - [13.2 Shared runtime assets](#132-shared-runtime-assets)
  - [13.3 Server adapter and liveness](#133-server-adapter-and-liveness)
  - [13.4 Build startup and hosting](#134-build-startup-and-hosting)
  - [13.5 Platform infrastructure that remains active](#135-platform-infrastructure-that-remains-active)
- [14. Testing and verification](#14-testing-and-verification)
  - [14.1 Commands and observed results](#141-commands-and-observed-results)
  - [14.2 What the test families prove](#142-what-the-test-families-prove)
  - [14.3 Current and historical numbers](#143-current-and-historical-numbers)
  - [14.4 Navigation and dependency verification](#144-navigation-and-dependency-verification)
- [15. Discrepancies and repair boundaries](#15-discrepancies-and-repair-boundaries)
  - [15.1 Implementation and meaning repairs still pending](#151-implementation-and-meaning-repairs-still-pending)
  - [15.2 Explanation and reproduction drift](#152-explanation-and-reproduction-drift)
  - [15.3 Authority after consolidation](#153-authority-after-consolidation)
- [16. Source register and consolidation disposition](#16-source-register-and-consolidation-disposition)
  - [16.1 Exact System implementation sources](#161-exact-system-implementation-sources)
  - [16.2 Store Program and historical sources](#162-store-program-and-historical-sources)
  - [16.3 Dependency decisions and retirement](#163-dependency-decisions-and-retirement)
  - [16.4 Completion verification record](#164-completion-verification-record)
<!-- TOC END -->

## 1. Source baseline and ownership

### 1.1 Frozen revisions

The remote `main` heads were read before writing. System and Program match the attached audit. Store has added its completed explanatory master since the audit; its executable source is still consumed at System's existing pin. No Store or Program file is changed by this consolidation.

| Role | Repository | Exact revision inspected | Relationship to the audit |
| --- | --- | --- | --- |
| System source and starting `main` | `GeorgePlattDemo/new-system` | `ab09777d6f27d4b70a2193abc8564ebce611746f` | Unchanged |
| Store explanatory master | `GeorgePlattDemo/store-zero` | `cd08aff624adf3b3a01ac0a42ea33681c5ba2bef` | Master publication added |
| Store executable integration | `GeorgePlattDemo/store-zero` | `f7123a73c1ca60aa7eb180a86a1c365eaffe95db` | Same audited runtime |
| Program research | `GeorgePlattDemo/3d-solutions-program` | `04ec327df39a54e92aae65ef4b07d10f2c8a8985` | Unchanged |

The reconciliation source is *Scan-to-Build-Read-Only-Audit-2026-10-12(1).md*, SHA-256 `cb59aaf1f8f3901bc616de7fc1cd812f133e9cb368c34a146855b4c80a5dfb43`. It remains outside the repositories. Its earlier findings are checked against the source above and identified as current drift, an implementation discrepancy or dated evidence; an audit recommendation does not constitute a completed repair.

The executable pin is governed by `STORE_CANDIDATE.inspectedCommit` in `src/system/store-candidate.ts`. It also appears in `public/live/stb-store-runtime.json`, `.github/workflows/verify.yml` and `startup.sh`. These four declarations remain `f7123a73c1ca60aa7eb180a86a1c365eaffe95db`. The documentation commit `cd08aff` does not select a new executable Store. Joint tests run against a separate checkout whose actual HEAD is the exact runtime pin.

### 1.2 The three owners

| Owner | Governing responsibility | What it adds to the identified chain |
| --- | --- | --- |
| **Program** | Investigates and records why | Research question, economic comparison, proposed machine development, supervised trial, engineering investigation and findings |
| **System** | Defines what the job means | Customer declarations, controlling requirements, source interpretation, geometry, derivations, component and feature identity, revision, complete manifest, inquiries, answer presentation, customer decisions and owner-record custody |
| **Store** | Determines what the identified Store can provide | Its catalog, material and parent selection, declared stock, processing capability and plan, modeled time, Q, answer, refusal and manufacturing evidence |

Receiving another owner's record gives a layer custody of that record, not ownership of its facts. System may derive a seven-inch finished strip from a customer's fourteen-inch depth. Store chooses eligible parents and answers the required narrowing. System may display Store's selected SKU and time; it does not select a substitute parent or calculate a replacement amount when the service is unavailable.

The authoritative answering path is **published UI → published definition → System translation → shared transport → identified replacement Store → Store evaluation → response verification → published UI**. Offering discovery is a separate bounded question to that same Store. Historical fixtures are evidence and test inputs; they supply no fallback answer in the public path.

The seller, financial source, inventory authority, scheduler, local machine authority, operator, inspection and fulfillment roles contribute later facts through their respective records. System preserves the links between those facts. A Store result does not itself establish customer assent, bank activity, actual allocation, physical readiness or conformance.

### 1.3 Observed application baseline

At the starting revision System contains **162 tracked files**, including **17 Markdown/HTML explanatory or presentation files**. The latter count includes executable public HTML and the installation page; it is a stated inventory measure, not a deletion list.

Baseline verification on 12 October 2026 used Node `v24.19.0` locally. `npm test` passed **334 tests** in four groups: 197 repository/platform checks, 55 library/auth checks, 36 System checks and 46 published-wire/joint checks. `NITRO_PRESET=node-server npm run build` and `npm run typecheck` passed. The build produced `.output/server/index.mjs`; the database migration script skipped external migration because no `DATABASE_URL` was supplied. Hosted verification uses Node 22; `Dockerfile.railway` specifies Node `22.23.2-slim`.

The hosted application was opened through its real front door and all five project paths were examined. Idea and Intent navigation, Bench controls, imagery, developer/reviewer rails and fresh starting answers were observed. The current starting amounts are:

| Published project | Controlling starting definition | Store Q, USD |
| --- | --- | ---: |
| Start Your Own | Two 16-inch SPF 2×4 braces; 30° parallel face miters; center spots; 60-inch minimum parent requirement | $8.62 |
| Alcove | Pine/select; 72 H × 45½ W × 14 D; five shelves; ECONOMY edge finish; spots off | $379.11 |
| Window Seat | Pine/select; 94 H; modules 24/55/24 W; 14 D; 22-inch seat; 14-inch upper clear height; two bays/two cubbies; four shelves per tower; optional front and spots off | $1,193.10 |
| Outdoor | Classic A-frame; 72-inch slats; above-ground treated SYP; coated hardware; optional spots and decorative cuts off | $293.16 |
| Playhouse | ½-inch 96 × 48 sheet; centered opening 36 W, 24 straight height, 12 rise; tab-retained center/split; two end crosscuts at 18 inches | $76.56 |

These are modeled, revision-specific Store answers. They are not price constants in System. The 18-inch SPF brace variation was also observed at **$9.13**, with the Store selecting a 72-inch parent and returning a 35⅝-inch remainder. The previous 16-inch answer ceased to govern while that revised inquiry was pending.

Railway's read-only service record identifies project `scan-to-build-candidate`, service `system-candidate`, production environment, source `GeorgePlattDemo/new-system`, branch `main`, commit `ab09777d6f27d4b70a2193abc8564ebce611746f`. Deployment `a9fc85a3-2467-4d74-96cf-1e0aa2717ad9` was **SUCCESS**, created 11 October 2026 at 20:25:50 UTC. Its domain is `system-candidate-production.up.railway.app`; health check is `/healthz`; builder uses `Dockerfile.railway`. This observation establishes the starting deployment, not the status of a later documentation commit.

The loaded frame chain is **`system-build-current.html` → `system-build-front-door-0.5.html` → `system-build-base-8d8a9dd.html`**. The child base carries the page roots; the outer layers inject, register and reconcile current behavior. Start Your Own additionally loads `three-frames.html`; Window Seat and Outdoor each load their own named child page. Removing the front-door or base file would remove active application dependencies.

### 1.4 Evidence and editorial scope

This master consolidates current System knowledge. Detailed Store manufacturing, machine parameters, patent arrangements, controller-oriented historical evidence and complete economics remain explained in Store's completed master. Program's trial remains the research authority. The shared commercial executable and its two documentary copies remain aligned and unchanged during this assignment.

Application behavior, images, customer wording, geometry, controls, timing readers, Store responses, runtime pin, commercial gates and saved-record code are protected baseline behavior. An implementation defect found while writing is recorded with its owner and testable acceptance criteria. Documentation does not silently amend a cut datum or repair an unsupported field by omitting it.

Current machine records use `STB-MODELED-OPERATIONS-1` and `PREDICTED_OCCUPANCY_ONLY`. Historical Project 1's separate controller-oriented virtual sequence retains its original identities. The distinction matters when a page calls something a command or a machine result. Physical admission remains blocked and no physical motion is authorized by System. **NO BLOOD ON WOOD.**

## 2. The customer journey

### 2.1 One intake and six trail steps

**Idea → Intent → The Bench → The Store answers → Your call → We cut it → Pick up & build.**

Idea is unnumbered intake. The six numbered trail stages begin at Intent. `public/live/stb-trail-contract.js`, version `STB-TRAIL-CONTRACT-0.2`, declares the labels, tile identities, page memberships and two presentation exceptions. The host draws the numbered navigation from a validated tile message. A page and a trail stage are different: a stage can contain several project-owned pages.

| Stage | Customer activity and System behavior | Record carried or added |
| --- | --- | --- |
| Idea, unnumbered | Bring the source, story and known context; use visible NEXT → INTENT | Original declaration, reference and attributed known facts |
| 1 · Intent | Establish this job's required result, wood, tools and unresolved questions; BRING IT TO THE BENCH → | Controlling requirements, permissible controls, ownership and source basis |
| 2 · The Bench | Change defined values, inspect derived components/features and automatic Store answers | Revised definition, derivation, independent manifest and inquiry attempt |
| 3 · The Store answers | Inspect the exact returned disposition, selected supply, work and Q or refusal | Store response, receipt, calculation and current-revision binding |
| 4 · Your call | Review the answer and any offered scope; record the applicable decision | Definition review or customer decision on an identified offer |
| 5 · We cut it | Present the simulated yard progression when its event prerequisites exist | Source-owned simulated commercial/fulfillment events |
| 6 · Pick up & build | Present simulated readiness, handoff and retained project record | Staging/notice/custody/closeout evidence where recorded |

Start Your Own opens on Intent by the trail's declared owner exception; Idea remains accessible through its back control. The other tiles open on their Idea reference. A bounded source already supplies many Intent facts, so proceeding does not require typing them again. Window Seat's Idea line offers Intent or One full scroll. Both presentations use the same job state, inquiries and answer.

The landing page provides New User, Returning User and Professional doors. The New User path includes a Later option for using the demonstration without establishing an account. User 1 is the demonstration identity. These openings lead to the same library and governance; they do not create alternate definition or Store authorities.

Inactive later stages stay visible and disabled. A tile's declaration that a stage is usable controls navigation; it does not admit a Store inquiry or issue commercial authority. Switching tiles retires current-answer use for the previous project and keeps one project's facts from entering another's request.

### 2.2 Idea and source intake

The supported arrival vocabulary includes a description, sketch, photo, scan, existing plan, library project and previous work. The current published demonstrations make those forms concrete through retained stories, room references, elevation drawings, selected published plans and prior project controls. Start Your Own also provides its bounded board/file intake. These interfaces are not evidence of a universal automated scan, drawing or CAD interpreter.

A source can express what the customer wants while supplying no controlling dimension. A photo of an alcove does not establish its clear width. A sketch's 103-inch Window Seat dimension and separately recorded 104¼-inch controlling measured width retain their different roles. Source method and governing status are independently recorded. A number obtained from a scan does not become verified merely because it can be serialized.

System preserves the customer's words and identifies its own interpretation or derivation. A published project supplies named rules and explicit starting values. Unknown location, grade, end plane or structural relationship stays unknown until the responsible source settles it. The Bench cannot turn a picture into a missing bolt coordinate.

### 2.3 Intent establishes the tools

**Intent creates the job's knobs. The Bench changes a knob's value; it does not invent the knob.** A knob means a meaningful requirement or setting for this particular job. It can come from a source, a customer's explicit addition or a stated project rule. There is no universal menu that makes every operation available to every project.

Wood selection establishes species, form, relevant nominal dimensions and grade. Offering lookup asks Store what it offers and returns attributable material records. Attaching an eligible offering can establish the material class requested; it does not reserve that SKU, quote the job or choose Store's parent plan. The project retains the customer's selected requirement, and Store evaluates the completed result.

Adding a tool creates its associated information obligations. Window Seat's extra spot requires a target part, longitudinal offset and across-width placement; screws require gauge, length, finish and count. An incomplete added tool blocks the applicable inquiry. Named tools displayed as under construction remain unimplemented; their label does not become a priced operation.

Two separate lists matter. The **UI knob list** describes what the customer may change. The **independent complete manifest** identifies every dimensional component, sheet package, feature and sourced item expected at the Store boundary. A complete protocol manifest does not prove that every planned UI control has a separately formalized knob record, or that installation/structural questions are settled.

### 2.4 The Bench changes the definition

All five Benches initiate a fresh Store evaluation when the current definition is sufficiently admitted, and again when consequential values change. A person does not have to press a separate pricing button to see the starting number. Admission and transport may take time; while pending the interface exposes the pending state. Missing, refused or unavailable work has no fabricated replacement Q.

The drawing and requirement display derive from current project state. They do not turn a Store-selected stock length into a new customer finished length. Start Your Own's diagram follows Store's selected parent and returned remainder; the angle and center spot follow System's brace rule. Alcove's shelf strips retain exact depth. Window Seat's total width comes from its three module values. Outdoor changes only the source classes its stated rule permits. Playhouse retains the complete requested opening and cut features for Store to judge.

A consequential change invalidates use of the previous answer and closes dependent decision/fulfillment controls. The previous exchange remains history. A late reply must match the active project, revision and attempt before it can become current. Confirmation records a chosen definition or requests its answer; automatic budgetary evaluation and customer acceptance are distinct acts.

### 2.5 Additional services

`public/live/stb-additional-services.js` mounts one tiny **Addl svcs ▾** button per Bench. Start Your Own places it beside the work summary; Alcove below shelf heights; Window Seat above its control column; Outdoor below its size control; Playhouse beside the sheet controls. A guarded mount prevents duplicates when wrappers redraw or move content.

The popover contains **62 planning choices in nine groups**: pickup/packing/delivery; sanding/preparation; panels/sheets; holes/hardware; identification/grouping; finish/protection; inspection/quality; assembly; paperwork/closeout. The Close × control, Escape and outside pointer action close it. Its position follows the trigger and viewport; columns reduce on small screens. Closing does not erase selections.

Selections are keyed by project in `sessionStorage` as `stb-addl-svcs-review-v1:<project>`. The footer states **selected · planning only**. The installed menu does not add operations to the manufacturing inquiry, change Q, issue a seller offer or persist these choices as an owner-record contract. Any future priced service requires explicit scope, source, required facts and a Store/seller response. Its present purpose is to expose contemplated service needs in a compact review surface.

### 2.6 References and imagery

The existing project reference and its smaller Intent representation describe the same object. Start Your Own retains its crossed-brace repair reference and board geometry. Alcove retains its room SVG, fireplace, wall bow and floor slope. Window Seat retains `window-seat-hero-0.9.webp` and the separate controlling `window-seat-elevation-0.9.webp`. Outdoor retains each plan's own photograph under `assets/outdoor/`. Playhouse retains the sheet/opening/tab SVG.

Numbers, arrows, features, prices and manufacturing claims remain code/text-owned information. An illustrative raster image establishes neither fit nor processing capability. Use existing references first, identify an actual missing asset before proposing a replacement, and preserve the same project through Idea and Intent. This consolidation supplies no new art, crops or layout.

## 3. Start Your Own

### 3.1 Source and entry

The first tile demonstrates the replacement of two damaged picnic-bench crossmembers. Its reference image circles the 2×4 being replaced. It opens on Intent, where the wood, two parts, angled ends and center-spot tool are already stated. Idea is accessible behind it. The visible forward action is BRING IT TO THE BENCH →.

The active child is `three-frames.html`, augmented by `system-build-current.html`. The predecessor `stb-start-own-bench-leg-0.1.html` was retired from the active tree after route/reference verification; its exact source remains in Git at commit `6e3738219204dd2c3ffff0a57a06b5495042e1bb`. Current answering and Bench presentation are supported by `stb-user-defined-board-runtime-bridge.js` and `stb-start-own-answer.mjs`. The actual live frame, not a historical filename, establishes the active route.

The populated specimen starts at two 16-inch SPF nominal 2×4 parts, 30° parallel face miters, one centered 3/16-inch spot per part and a minimum 60-inch workpiece requirement. Intent offers material lookup and tools. Other named material/tool entries do not, by their labels alone, widen this specimen into arbitrary machining. Display-only additions remain separately identified.

### 3.2 Controlling geometry and derivation

The project keeps an **eight-inch horizontal span** while the person changes brace length. The current bounded demonstration admits lengths from 16 through 18 inches. Its derivation is:

$$\theta=\arcsin(8/L)\,180/\pi,\qquad rise=\sqrt{L^2-8^2},\qquad x_{spot}=L/2.$$

| Definition fact | 16-inch starting setting | 18-inch setting | Authority |
| --- | ---: | ---: | --- |
| Finished part length, each | 16 in | 18 in | Customer setting |
| Fixed horizontal span | 8 in | 8 in | Named project rule |
| Derived end angle | 30° | 26.387799961243° | System derivation |
| Derived rise | 13.856406 in | 16.124515 in | System derivation, rounded for display |
| Center spot from either finished end | 8 in | 9 in | System derivation |
| Required part count | 2 | 2 | Bounded specimen definition |
| Declared saw operations | 3 | 3 | One reference cut plus part separations |
| Workpiece minimum | 60 in | 60 in | Project requirement |

End meaning is explicit: `parallel`, `miter-face`, `long-long-outer-edge`, and `REFERENCE_CUT`. The public line also carries `endIdentity: "both"`. The published translator records its supplied value and the named `REDUNDANT_WITH_PRICED_LENGTH_DATUM` reconciliation, sending `endIdentity:null` when the existing parallel/long-long convention already states the same endpoint meaning. This retained canonicalization is different from deleting a supplied independent end requirement. A nonredundant supplied value remains in the demand and can be refused.

The controlling configuration is `SYO-USER1-XBRACE`. The endpoints use configuration versions `0.1` and `0.2`; intermediate settings use the declared review-intermediate label. The owner definition is `SYO-USER1-XBRACE-0.1`, with a separate incremented `versionId`. Configuration version, owner revision, request ID and receipt hash serve different purposes and are not interchangeable.

### 3.3 Components manifest and Store request

System emits `PART-1` and `PART-2`, each with its own length and feature. With spotting selected, the features are `SPOT-1` and `SPOT-2`, kind `SPOT_ON_LOCATION`, longitudinal coordinate `L/2`, `CENTERED_ON_PART` and `CENTERED_ON_WIDE_FACE`. The independent manifest lists both part IDs, both feature IDs, no sheet packages and no sourced item lines.

The public inquiry type and Store type are both `USER_DEFINED_BOARD_V1`. The public line's `definedWorkpieceLength` is normalized into finite `definedWorkpieceLengthIn`; System supplies the required operations and declared counts. An established selected board class may supply `form:"board"`. Grade travels when already specified. Store, rather than System, determines whether a missing grade is ambiguous.

Changing wood is a job tool when enabled, not a generic label to be treated as a species selector. An omitted spot coordinate is not converted to zero. A declared spot lacking a technical identifier receives a retained stable identity `declared:<partId>:feature:<index>`; that identity assignment does not supply missing geometry. Admission and the Store contract still enforce complete requirements.

### 3.4 Fresh answer and visible consequences

The current 16-inch SPF inquiry returns Q **$8.62**, comprising $2.61 material and $6.01 modeled service. Store selects `STB-ZERO-SPF-2X4-60-001` and returns 27.625 inches remaining. System's drawing follows those returned values; it does not calculate a substitute retained-control decision.

At 18 inches the current result is **$9.13**, $3.13 material plus $6.00 modeled service. Store selects `STB-ZERO-SPF-2X4-72-001` and returns 35.625 inches. The Bench displays that Store selected the longer board while the customer still requires at least 60 inches. A returned remainder and the declared 24-inch model screen are separate from verified physical roller contact.

`stb-start-own-answer.mjs` checks whether returned money, component/feature identities, receipt and material information agree before producing the unified Bench view. Its amount reconciliation detects contradictory returned totals; it is validation of Store facts, not a price engine. It also escapes Store text before rendering. Missing Q or machine service, a contradictory total, foreign feature identity, wrong pin or request receipt cannot become a visible complete price.

The automatic Bench inquiry is budgetary. Confirm & Send retains the identified definition and matching exchange for the Store-answer/decision path. Confirmation is not implicit acceptance of a previous automatic answer for another request. A later definition or failed inquiry cannot continue the earlier commercial stream.

### 3.5 Decision and verification

This tile alone explicitly enables the demo commerce source. A complete current Store answer can yield the 24-hour simulated offer, Accept & Pay, simulated seller order/capture/queue, yard demonstration and pickup/closeout described in chapter 10. All generated commercial source records remain SIMULATED.

`src/system/start-own-bench.test.ts` exercises the 16/18/16 sequence against the exact pinned Store; selected parents, spots and money; contradictory/missing answers; definition admission; pin/receipt/feature mismatch; revision-bound failure; and escaped Store text. `published-wire.test.ts` covers the same-end reconciliation and current public translation. Historical Project 1 fixtures remain separate evidence of their issued specimen, not a live price source.

## 4. Alcove and critical fit

### 4.1 Source context and controlling choices

Idea preserves the room SVG and the supplied observations: 94½-inch floor-to-ceiling height, 45½-inch opening width, 14½-inch available face depth, 45-inch mantel, 65-inch shelf-top preference, ½-inch wall bow and 1.2° floor slope. The scan is context. The measured controlling values and customer choices determine the unit. Bow and slope are recorded rather than automatically corrected.

Intent carries the smaller same-room reference, material selection, offering lookup and the optional shelf-elevation spotting tool. The Bench retains the existing dimension sliders/exact entries, species buttons, shelf count/elevations, edge-finish options and compact additional-services control. Exact dimensions are read back to the nearest 1/32 inch. The starting unit is **72 H × 45½ W × 14 D**, five shelves at **12, 24, 36, 45 and 65 inches**, Pine/select, spotting off.

The full-width starting preference includes no concealed fit allowance. With two ¾-inch side members, shelf span is `45.5 - 1.5 = 44` inches. Reducing configured width creates an explicit clearance, rather than changing a fit number inside the Store inquiry. Structural adequacy and installation execution remain distinct questions from manufacturing the stated components.

### 4.2 Stock-aware definition proposal

`alcoveBoardSpecifications` reads a complete current Store lookup for the chosen select species. It groups offered nominal 1× width classes by returned actual width, considers one or two equal source boards, then sorts proposals by fewest pieces, least excess width and nominal width. System is proposing the customer's finished-part arrangement from discovered classes. Store still selects parent lengths, SKUs and quantities during job evaluation.

The fourteen-inch default uses nominal **1×8 throughout**, including the four upright boards. The two shelf strips finish at 7¼ and 6¾ inches. Together they retain exactly fourteen inches. Ten shelf strips and four upright boards are separately identified. The chosen class's full-width 7¼-inch strip is a defined requirement; it is not an assertion of unoffered physical stock.

When the complete lookup lacks the requested default 1×8 class, the narrowly declared starting request can still be formed as **requested, not offered**, so Store can give its own refusal. The code does not attribute that request-only 7¼-inch strip to discovered stock. An incomplete lookup, incompatible species result, unavailable service or unsupported alternative proposal is not permission to invent stock. The explicit default refusal path is bounded to the known fourteen-inch requirement and corresponding source choice.

The user may override source widths, including the mixed nominal 1×10/1×6 proposal. Those dimensions become stated per-component requirements. A mixed proposal still has to satisfy positive widths, source-width compatibility, stated fractional resolution and the exact depth sum. It does not transfer parent selection to System.

### 4.3 Edge finish and features

| Bench mode | Finished shelf pieces | Declared edge preparation | System meaning |
| --- | --- | --- | --- |
| ECONOMY, 1 · default | 7¼ + 6¾ in | ½-inch removal from one free edge | Preserve one full strip and exact total depth |
| BALANCED, 2 · even | 7 + 7 in | ¼-inch removal on one edge of each strip | Equal finished strip widths |
| ALL_EDGES, 4 · all | 7 + 7 in | `farEdgeRemovalIn:0.125`, `fenceEdgeRemovalIn:0.125` on each strip | Two separately declared surfaces per strip |

System emits a `MILL_LONGITUDINAL_PROFILE` identity for a narrowed strip, with literal shelf-span path length, finished-width Y and through depth 0.75 inch. ALL_EDGES additionally carries the explicit two-edge preparation. The translator retains that geometry; Store decides whether parent preparation fulfills it and returns the associated processing plan/time. System does not add a local per-edge surcharge or duplicate the machine-time calculation.

Enabling shelf-elevation spotting produces one feature for every selected elevation on every upright board. With five shelves and four uprights that is **20 spots**. The inset is 1½ or 2 inches from the edge. Each feature names its target component, FROM_BASE coordinate, `DERIVED_FROM_SHELF_ELEVATION` basis, 3/16-inch diameter and 3/16-inch **full-diameter** penetration beyond the drill point. The inset control is disabled while spots are off.

### 4.4 Translation and coverage

Alcove's public scope remains `ALCOVE_INSERT_V1` as a System-facing definition label. `cutDemandFromAlcoveInsert` translates it to the actual Store class **`CUT_PACKAGE_V1`**. There is no restored Store-native Alcove evaluator.

The source definition contains `materialDemand`, `boardRequirements`, `componentPrograms`, `hardwareDemand`, `spotDemand`, configuration identity and unresolved conditions. Each component states its own `nominalW` and finished geometry. A blanket nominal width in material demand is blocked because it would override the component requirements.

The translator groups compatible components by requirement, nominal width, finished width and edge preparation. It requires the named parent operation to state CROSSCUT before supplying a square `angleDeg:0`. Spot identity/location and profile geometry remain literal. The hardware demand travels as the functional `ALCOVE-PINS-AND-SCREWS` requirement, quantity one; Store chooses its offering.

The independent manifest originates from all fourteen source component programs, the five default profile IDs and the one hardware requirement. With spotting enabled it includes the twenty additional spot IDs. The spot summary is consumed only if its identities, target components, coordinates, placement and constraints agree with the component features. An enabled contradictory summary remains a carried unresolved requirement. An explicitly disabled empty summary with no component spots is faithfully treated as no requested spotting.

### 4.5 Response presentation and boundaries

The current default returns **$379.11**: material $283.64, modeled service $77.47 and hardware $18.00; modeled total time is about **18.5924 minutes**. BALANCED and ALL_EDGES are separate evaluated definitions, recorded in Store's master at $439.28 and $499.24 for this baseline. Those figures illustrate returned variations; they are not System formulas or permanently assigned option prices.

The Bench presents selected SKUs, quantities, available counts, material/kit/service amounts and Store operation-ledger time. The time display reads current returned categories rather than the retired single-machine timing shape. A refused or incomplete definition has no complete displayed cycle.

A fully evaluated manufacturing scope can show `REQUIREMENTS_SATISFIED`. The shared contract also describes a terminal scoped budgetary-review state when a complete manufacturing estimate accompanies disclosed unevaluated requirements. That review cannot create an offer, acceptance, payment, queue, production or pickup. The current protocol manifest carries unresolved requirements, so a clean whole-job Store evaluation normally withholds Q for an actually incomplete manifest. The compatibility review gate does not manufacture a scope exception.

The shared terms flow is installed, but this tile does not inherit Start Your Own's demo seller policy. Missing offer/order/financial sources remain pending. `published-wire.test.ts` evaluates the actual public component programs, default profiles, spots, species/refusal cases, mixed/edge choices and unequal or missing requirements against the pinned Store. The generic library Alcove recipe is a separate definition and can return a different amount; its test figure $378.68 is not the public starting Q.

## 5. Window Seat and space utilization

### 5.1 Sources Intent and entry

Idea preserves the customer's own description and the existing finished-room photo. Intent carries the smaller photo, the elevation sketch, source/status fields, preferences, site observations and open questions. The sketch reads **103 W × 94 H**, with **24/55/24-inch** modules, fourteen-inch depth, upper storage/window/seat/cubbies and four shelves per tower. Seat and upper-storage heights are separately adopted values where the sketch is silent.

Measured facts have both a source and a governing status. Current examples include widths 104.5/104.25/104.5, with the narrowest controlling width 104.25; the controlling right height is 94.75, while the scanned left height is context. The source sketch's width, window head and source image do not silently replace those measurements. Sill height needs checking. Floor slope, baseboard, on-site fastening and the pictured hexagonal trim retain their respective noted/context/deferred roles.

The Idea presentation fork provides Intent or One full scroll. The full-scroll view shares the same definition and evaluation state and is not a second implementation. Intent's wood controls, offering lookup, side/divider spotting and optional front/extra-spot/screw tools carry into the Bench. The visible forward action is BRING IT TO THE BENCH →.

### 5.2 Starting values and named geometry

| Control | Starting value |
| --- | --- |
| Overall height | 94 in |
| Left / center / right width | 24 / 55 / 24 in |
| Desired depth | 14 in |
| Seat height | 22 in |
| Upper storage clear height | 14 in |
| Upper bays / lower cubbies | 2 / 2 |
| Tower shelves, left / right | 4 / 4 |
| Clearance per side | 0 in |
| Wood | Pine/select |
| Optional front / added extra spot / screw requirement | Not added |
| Side and divider spots | Off |

`window-seat-layout/1` is a named geometry extension. Editing recipe data alone cannot create its tower/seat/cubby rules. The public child supplies the full UI-specific version; `src/system/window-seat.ts` supplies the generic recipe extension.

Design thickness is **0.75 inch**. Overall width is the sum of module widths. Horizontal parts fit between their two sides: tower spans 22.5 inches and center spans 53.5. The window-head/upper-shelf datum is `H - T - upperClear - T`, 78.5 inches in the starting definition. Tower shelves under that datum divide the available height using their declared count and thickness. Lower divider length is `seat - 2T`, 20.5 inches. Upper divider length is the fourteen-inch clear upper height.

Depth uses the fewest integer runs from one through six for which `depth/runs ≤ 11.25`. Run width is rounded to 0.001 inch. An exact dressed width uses its matching nominal class; otherwise the next wider class carries an explicit finished-width requirement. Dressed width meanings used by this rule are nominal 2/3/4/6/8/10/12 → actual 1.5/2.5/3.5/5.5/7.25/9.25/11.25 inches. Fourteen-inch depth becomes two seven-inch runs, each from nominal 1×8. This establishes part geometry; Store judges the preparation and selects stock.

### 5.3 Components tools and independent manifest

The starting assembly has **24 finished assembly parts and 48 separately identified board runs**. Six full-height sides, each tower's top/bottom/four shelves, the center top/bottom/upper shelf/seat and one divider in each center storage area account for the assembly. Runs are identified beneath their assembly feature, such as `L-UPRIGHT-01-R1` and `C-SEAT-01-R2`. Every source run appears in the manufacturing manifest.

The optional FRONT value is stored as true in starting Bench state, but Intent's `added.front` is false. The controlling optional-tool manifest therefore excludes it. Reading that boolean in isolation incorrectly adds a front board and changes the quoted job. The current public default includes neither that board nor screw item lines.

Side spots attach to every tower-side run at derived shelf datums, using the chosen inset. Divider spots attach to the adjacent horizontal members at each divider center. An extra spot names its target finished part, X offset and centered/1½/2-inch across-width placement, then reaches the corresponding runs. These are separate features, not one unexplained aggregate hole count.

An added screw requirement requires gauge, positive length, finish and whole positive quantity. It is sent as a sourced item requirement; System does not choose the item SKU. Labels, inspection, bundling, packing and other retained asks use a separate displayed **kept, not sent** list. They do not enter manufacturing Q or become claimed completed work. That disclosed separation does not excuse dropping a manufacturing component or selected machining feature from the independent manifest.

### 5.4 Inquiry identity and Store response

The public `buildRequest` groups identified runs into SIDES/SHELVES/FRONT packages by nominal and finished widths. Packages over 120 parts are split into identified package groups. The job uses configuration `WINDOW-SEAT`; its revision combines an incrementing UI revision and a local change signature covering the identified record and request body. This short local signature is not Store's canonical calculation identity or an actor signature.

The source record includes the customer's idea, source filenames/roles, measurement source/status, taste, site observations, open questions, knob list, kept asks and derived width/run facts. The Store receives **`CUT_PACKAGE_V1`** plus a separately derived complete manifest of run/spot/item identities. The default has 48 board IDs, no spots, no sheet packages and no sourced items.

Current Q is **$1,193.10**: $795.59 material plus $397.51 modeled work, approximately **95.40 minutes**. The same fresh answer is presented on Intent and the Bench, with a link to the full line-by-line answer. Edited material or dimensions invalidate it and initiate a new inquiry; incomplete optional tools remain blockers.

The dated 11 October check recorded depth 13¾ inches at $1,192.91. It also recorded a Poplar variation without a complete estimate because every line could not be fulfilled. These are identified observations of that definition/pin, not a promise that every species button yields a price. Store chooses parents and can refuse or report unavailable work.

### 5.5 Decision records and verification limits

The later customer stages use the shared terms/event gate. A supportable budgetary answer permits review, while absent seller offer and policy records leave acceptance and fulfillment pending. Earlier simulations documented under earlier pins do not prove current commercial progression.

The public page exposes a project/audit record containing source interpretation, revisions, request and response information. Its current **Check it yourself** text saves demand alone and supplies an old three-field `evaluateStoreRequest` command. Protocol 2 requires the independent manifest; the command therefore does not reproduce the current answer. Its new `my-check` request ID would also change calculation input identity even if the missing manifest were supplied. Chapter 15 sets the exact repair criterion. This document gives the valid complete-request reproduction pattern in chapter 9 without modifying the protected page.

`system.test.ts` verifies the named geometry extension, positive/count requirements, invalid spot choices, genuine zero shelf counts, revision/late reply behavior and saved-record handling. Public-wire/joint tests verify actual public requests, extra spots and Store refusal of unhandled declarations. Source and record correctness are assessed separately from a successful manufacturing Q; seat strength and local attachment remain attributed unresolved/deferred questions.

## 6. Outdoor and published plans

### 6.1 Source selection and fixed starting definition

Idea names two published plans. Intent retains both photographs and source links. The current selected starting definition is **Classic A-frame**, 72-inch slats, above-ground treated SYP and coated hardware. The alternate **Table + two benches** is selectable at Intent. A small Item lookup and Add tools surface supplements the plan choices; known tools include hardware, cut, angle and wood species. No spot locations are presumed merely because the assembly uses fasteners.

| Source project | Fixed part classes | Length-controlled class | Hardware requirement in this application |
| --- | --- | --- | --- |
| Classic A-frame, Ana White | Four nominal 2×6 legs, 31.375 in at 25°; two 2×4 braces, 32.875 in at 25°; two 2×4 supports at 61; two 2×2 end cleats at 34.25 and one middle cleat at 29.25 | Six tabletop and six seat nominal 2×6 slats | 100 #10 × 2½-in wood screws; selected finish |
| Table + two benches, MyOutdoorPlans | Four table legs at 26; four table supports at 27.5; eight bench legs at 16.5; eight bench supports at 11.5; all nominal 2×4 and square | Seven table and six bench 2×4 slats | 26 #10 × 4½-in screws, 48 #10 × 2½-in screws, eight 3/8 × 5-in carriage-bolt assemblies; selected finish |

Only long slats follow the chosen table length. End-frame lengths and published angles stay in their named source classes. The alternate plan's hardware totals and screw gauge are application interpretations where its source supplies no count/gauge. Source, adopted choice, derivation and unresolved correspondence retain separate identities.

### 6.2 Bench control and revision

The Bench offers the existing set, wood and hardware choices, inch/foot length adjustments, automatic current Q and a bigger Bench for explicit part-class spotting or decorative cuts. Wood choices map to exact species/grade pairs: construction SPF, above-ground treated, ground-contact treated, cedar-tone ground-contact and cedar S4S. Hardware is BYO, coated, hot-dip galvanized, stainless or silicon bronze. BYO omits purchased item lines; it does not assert that assembly needs no fasteners.

Optional spots require a positive from-end distance, an admitted across-width placement, and the selected symmetric or middle arrangement. System assigns stable `<partId>-SPOT-<number>` IDs. Missing locations block submission rather than becoming zero. Decorative face-angle changes apply only to the declared square-cut class; the plan's angled classes retain their given angles.

A newly typed tool name has no implicit machine representation. When selected it remains a missing defined operation and blocks the inquiry until actual work is explicitly defined or the unsupported addition is removed. The project records that added tool, reference offering and source meaning rather than manufacturing a favorable empty operation.

`record`, `definitionFor`, `packagesFor` and `itemsFor` build one identified selected job. Configuration names identify the plan, such as `OUTDOOR-PICNIC-A-FRAME`; configuration revision includes the UI revision and local record/body change signature. Each piece receives a stable class/count ID. The starting A-frame has **23 part IDs**, five packages, no spots and one sourced hardware line.

### 6.3 Option previews and the committed inquiry

Wood/finish previews are separate complete manufacturing inquiries, not an offering lookup and not a shared allocation of all variants in one job. `stb-outdoor-option-requests.js` separates alternatives. The preview for a hardware tier uses the currently selected wood; the selected definition receives its own committed evaluation. Preview answers never enter the customer terms flow.

The page permits one manufacturing inquiry at a time. The committed current job has priority over queued alternatives; transport failure releases the queue without supplying a price. Intent starts previews, including the displayed From amounts. The Bench automatically asks the selected job without requiring another plan choice or Ask Store prompt.

Store's class is **`CUT_PACKAGE_V1`**. The independent manifest records the selected definition's exact board/spot/item identities and quantities. For the default, Q is **$293.16**, material $200.05, modeled work $74.23 and hardware $18.88, about **17.8151 minutes**. Store selects its parents and enough actual hardware packages; System preserves the distinction between requested pieces and purchased packs. The dated 11 October length-73 check returned $293.26 for its revised request.

### 6.4 The unresolved end-meaning correspondence

The public source text states that A-frame legs and cross supports are measured **long point to short point**. Both public `packagesFor` and the generic compiler currently send **`long-long-outer-edge`**, parallel ends and `miter-face`, using the same numerical lengths. No explicit transformation witness reconciles those conventions. The source's cross-support bevel wording also requires an identified plane/orientation interpretation.

The current Q is an answer to that encoded demand. It does not prove source-faithful transcription. System owns the required source datum/plane declaration and explicit transformation or unsupported disposition. This consolidation changes no lengths, angle, cut plane, material choice or refusal. The acceptance criteria are in chapter 15.

The Idea label **the plan's wood** similarly overattributes the all-treated default. The audit records the source's untreated tabletop/seat recommendation with treated legs as an option. The present all-treated variant can remain an explicit application/customer choice, but its source pedigree requires correction. That is separate from the datum question.

### 6.5 Authority evidence and downstream flow

The live Rule Book opens `stb-outdoor-reference-authority-0.3.html`, which links `STB-OUTDOOR-ANGLED-FRAME-RESEARCH-DOSSIER-0.1.html`. They remain reachable public references. Their unique dated source comparisons are retained; their exploratory designs are not additional admitted tiles.

The continuing interpretation rules are complete here: identify a named design family before transferring geometry; include datum, plane and angle convention in each dimension; retain published/derived/project-specific/inferred/unknown status; do not derive connection-hole coordinates from a picture; and defer structural relationship changes without a verified transform. An X frame is a dependent leg/brace/stretcher system, not a generic shape from which any new angle/height can be asserted. An exploratory donor and its September prices remain evidence of that captured revision.

Current committed answers reach the shared review/terms surface. Missing seller terms/order/finance remain pending; no Job 1 demo policy is silently inherited. `published-wire.test.ts` verifies alternative isolation, committed priority, stable spot identity, incomplete/off-board spots, revised answers, preserved unknown fields and Store evaluation. These checks prove the transmitted definition, not the unresolved external-plan correspondence.

## 7. Playhouse and the sheet stream

### 7.1 Source and ownership presentation

The fifth tile demonstrates a playhouse wall panel with an arched opening and retained useful pieces. Idea states the starting half-inch 48 × 96 sheet, opening 36 W × 24 straight height × 12 rise, kept center, returned remnants, owner trimming of retained tabs and no hardware purchase. Intent carries the same sheet/opening reference, an identified Store offering and the tools.

The published library copy is **read only**. Its price is already evaluated automatically. MAKE CHANGES creates the working presentation and enables controls; SAVE stores the copy for the demonstration owner. Opening is different from owning, and leaving an unsaved preview restores the library state. The other tiles do not all implement this same read-only copy mechanism.

### 7.2 Geometry and selected tools

The Bench starts at opening width 36 inches, straight-side height 24 and rise 12, giving total height 36. Its circular-segment radius derives from the customer's opening values:

$$R=w^2/(8r)+r/2=19.5\ \text{in at }w=36,r=12.$$

This is System's opening geometry. Cutter compensation, tab placement, processing capability, returned bounds, timing and Q remain Store-owned. The visible drawing identifies routed profile, retained tabs, split and straight-cut requests, including work outside the local routed field. A blue requested cut is still sent for Store's judgment.

The admitted Intent sheet fact includes positive thickness/length/width and selected Store species, grade and SKU. The opening fact requires positive width, straight height and rise. Tools include the two eighteen-inch end cuts, each added manual cut with orientation/end-or-edge datum/distance, and an optional pattern with both offsets. Zero is a valid pattern offset. Missing one offset or an added cut distance blocks admission; the interface does not fill an edited or saved job with demonstration values.

### 7.3 Definition manifest and boundary

`s001DefinitionFrom` builds **`SHEET_PACKAGE_V1`**, configuration `PLAYHOUSE-ARCHED-WINDOW`. Its revision identifies selected material, opening dimensions, requested tabs, end cuts and every added tool. The default feature list is:

| Feature ID | Required meaning |
| --- | --- |
| `OPENING` | Centered `ARCHED_APERTURE`, width 36, straight height 24, rise 12, retained with TABS, requested minimum four |
| `CENTER-SPLIT` | `STRAIGHT_SPLIT` within OPENING on its vertical centerline |
| `CUT-LEFT` | `CROSSCUT`, eighteen inches from the left sheet end |
| `CUT-RIGHT` | `CROSSCUT`, eighteen inches from the right sheet end |

Added cuts receive `CUT-M<n>` identities; a selected placement tool adds `PATTERN` within OPENING with literal offsets. `returnAllPieces:true` is preserved. The independent manifest has the configuration ID as its sheet-package identity, all feature IDs, no board parts and no sourced hardware. The selected SKU remains on System's job to check attribution, while the Store demand states its material dimensions/species/grade for Store matching.

Sheet translation copies the stated definition fields instead of maintaining a second list that could omit a retention operand. Thus a custom split's `splitTabMode` and `splitTabPositionsIn` reach Store unchanged. Missing required custom positions remains **UNRESOLVED / `SPLIT_TAB_POSITIONS_REQUIRED`**, with no Q. The screen does not currently expose a custom-split-position control; that boundary is exercised by endpoint/translation tests, not claimed as a clickable control.

### 7.4 Store result and refusal presentation

The default fresh answer is **$76.56**: material $26.55, hourly modeled work $30.01 and two separately charged full cuts totaling $20.00. Total modeled occupancy is about **9.34 minutes**, including the separately billed saw time. System does not charge those seconds a second time or replace the valid material-only $26.55 label with the whole job total.

Store's answer retains all modeled returned pieces, including the tab-retained center halves. The exact planned retention and returned bounds come from that answer. Geometric tabs are not a physically inspected release or a completed trim service.

A definition admitted by System can still exceed Store's routed field, contour, stock, material, split or panel-staging capability. Admission checks completeness, not Store limits. Oversized supplied openings reach Store and receive its refusal. A revised refusal removes the earlier supported amount and closes dependent stages. Unknown fields remain stated and receive Store's named contract refusal; the caller cannot obtain a favorable answer by dropping them.

The shared terms flow distinguishes customer review from absent seller offer/order/finance. MAKE CHANGES enables definition controls, not production. `playhouse-admission.test.ts` verifies exact required facts, missing material identity, added-cut datums/distances, zero pattern offsets and oversized admitted inputs. Public-wire/joint tests exercise the default and changed prices, complete feature coverage, custom-split requirements, field violations, additional panel work and preserved unhandled declarations. The dated width-35 check returned $76.43 against this Store baseline.

## 8. System compilation and shared meaning

### 8.1 From source to an identified requirement

System compilation converts a sufficiently established requirement into a complete manufacturing definition while retaining its meaning. Its inputs are attributed source facts, current customer choices, named project rules and unresolved responsibilities. Its outputs are component geometry, feature identity/location, material requirements, derivation witnesses, blockers and revision identity. Catalog allocation, machine occupancy and Q are later Store outputs.

A source fact needs its object, extent, units, datum, plane, source status and applicable rule. A length without its endpoints is incomplete. A 25° number without face/bevel convention, reference to square and end relation cannot govern an angled part. A user preference may be carried without becoming a cut. A source interpretation must remain identified as System's work rather than being rewritten as the customer's original declaration.

Derivations retain the named rule, formula, inputs and output. For example, the Start Your Own rule takes finished length and a fixed horizontal span and derives angle/rise/spot X; Window Seat takes module widths and design thickness and derives clear spans. These System transformations establish what is wanted. Store's subsequent neutral manufacturing conversion is its representation of how to supply that requirement, not another project design.

### 8.2 Two active System surfaces

The **published five-project surface** uses the HTML/JavaScript definitions, shared public admission, browser Store client and server published-wire adapter. The separate generic React UI at `/bench` and `/projects/$projectId` was retired from the active source tree. Typed recipe, definition and session modules remain as independently exercised contract/reference tests; their answers and starting geometry cannot substitute for the published pages.

The retained typed test/reference library contains seven recipes, including Project 1 and Closet cleats; it is not a second published project chooser. Closet cleats is not a public sixth tile. Historical Project 1 is explicitly identified test input, not a second active screen or price source.

| Module | System-owned function | Boundary |
| --- | --- | --- |
| `recipe.ts` | Input kinds, literal/input bindings, recipe requirements and trace shape | Missing input remains missing |
| `recipes/library.ts` | Named project recipes, starting values and declared source/rule data | Data cannot create an unimplemented geometry rule |
| `compile.ts` | Check inputs; derive board, grouped parts, depth strips, plan groups and sheet opening; produce trace/blockers | Supplies no Store stock plan or time/Q |
| `window-seat.ts` | Named `window-seat-layout/1` engine extension | Its geometry requires code, not just new recipe data |
| `shape.ts` | Generic System interface shape/type/undeclared-field checks | Structural admission; not a capability evaluator |
| `manifest.ts` | Source component/feature/item coverage expectation | Constructed from controlling source, independently of translated demand |
| `store/published-wire.ts` | Normalize published definitions, preserve stated obligations and ask Store | Translation and presentation only |
| `session.ts` | Revisions, attempts, decisions, packets, currentness and reopening | Preserves issued evidence; no fabricated new facts |

`compileRecipe` recognizes `board-workpiece`, `part-groups`, `depth-strips`, `plan-groups` and `sheet-opening` as supported named rules; Window Seat is an explicit extension. An unknown operation returns `ENGINE_EXTENSION_REQUIRED`. Required choice values, finite numbers, whole counts and lower bounds are checked. An explicit allowed zero count differs from a blank required value. Unknown fields or failed shape checks leave demand null with blockers, rather than quietly discarding the information.

### 8.3 Public admission and responsibility

`shared/definition-contract.mjs` supplies the responsibility ledger vocabulary: CANDIDATE, CONFIRMED, DERIVED, UNRESOLVED, DEFERRED, NOT_REQUIRED; owners USER, PROJECT, RULE, STORE, QUALIFIED_PERSON and GOVERNED; boundaries DEFINITION, STORE_SUBMISSION and PHYSICAL_RELEASE. Resolved values require a basis; DERIVED requires its rule and inputs. A classified ledger can explain supplied responsibilities without proving that its producing project identified every required responsibility.

`shared/tile-host-admission-contract.mjs` keeps two interfaces separate. `STB-TILE-HOST-0.1` states tile, current stage, usable steps and navigation request. `STB-DEFINITION-STORE-0.1` admits one identified revision for one declared inquiry scope. The latter checks the profile's required facts, including nested fields and conditional requirements; it does not merely check whichever rows a page happened to emit.

| Tile/profile at this baseline | Inquiry scope | Principal required facts |
| --- | --- | --- |
| Start Your Own 0.5 | `USER_DEFINED_BOARD_V1` | Material, minimum workpiece length, identified positive parts, operations, cut/datum meaning; complete selected spot demand |
| Alcove 0.3 | `ALCOVE_INSERT_V1` | Unit/opening, material/grade, both parent responsibilities, per-component source widths/finished sizes, spot on/off; Store-owned hardware demand may remain open |
| Window Seat 0.3 | `WINDOW_SEAT_COMMITTED` | Overall width/height/depth, all positive identified runs, selected optional-tool operands and retained-ask count |
| Outdoor 0.4 | `OUTDOOR_OPTIONS`, `OUTDOOR_COMMITTED` | Complete package/part declarations; committed scope also requires plan and explicit Bench work |
| Playhouse 0.3 | `SHEET_PACKAGE_V1` | Selected Store sheet identity/dimensions/species/grade, positive opening and every tool operand |

CONFIRMED or DERIVED facts that pass the profile's form travel as settled input. A missing USER/PROJECT/RULE fact blocks and names its owner. An unsettled STORE-owned requirement becomes an open demand for Store to resolve, such as Alcove hardware selection. A complete out-of-capability definition is admitted and reaches Store for an honest answer.

`inquire` calls its transport only after ADMITTED and stamps the reply with the admitted revision/scope. `isCurrentAnswer` requires that stamp and CURRENT authority. `availableSteps` draws navigation from admission/current answer and the review disposition. Saved usable-step flags do not create authority on reopening.

The browser client also retains `sendJob`, which uses `stb-public-admission.mjs` and the responsibility-ledger readiness seam. `sendAdmittedJob` is the transport for an already admitted tile-profile request and does not run that admission again. These are structural readiness interfaces serving installed call sites; neither supplies a second Store capability or price answer. The exact call site and inquiry scope, rather than a boolean supplied by a caller, control admission.

### 8.4 Independent complete manifest

The manifest states what **the controlling definition** requires, independently of what the adapter managed to translate. Store compares its consumed demand and planned coverage to that expectation.

| Field | Meaning |
| --- | --- |
| `jobId` | Source `configurationId` |
| `revision` | Source manufacturing `configurationVersion` |
| `boardPartIds` | Every identified dimensional part/run |
| `sheetPackageIds` | Every sheet package; the one-sheet public path uses its configuration ID |
| `featureIds` | Every named spot, profile, aperture, split, cut and pattern feature |
| `items` | Each sourced `lineId` and requested whole quantity |
| `unresolvedRequirements` | Declared unresolved source conditions and unevaluated carried requirements |

In `answerPublishedWire`, translation is called first to identify the supported mapping and any carried problems. The manifest is then constructed from the **original public line/definition**, not the translated demand. That actual call order should not be misreported as a temporal pre-translation calculation. The independent source basis is what prevents translation loss from redefining success. The generic recipe path builds the manifest from its compiled controlling demand before serialization.

Store's complete coverage comparison checks identities and quantities, not just equal counts. A missing spot cannot disappear because two parts still price. A duplicate identity cannot stand for two different components. A nonempty unresolved list prevents complete whole-job Q. The manifest establishes coverage of System's declared facts; it does not independently verify capture, external source interpretation, structural adequacy or a requirement never identified by System.

### 8.5 Translation rules and unresolved meaning

The board translator normalizes finite stated values, establishes a selected board form where its nominal material class permits it, retains grade if supplied, records redundant-end canonicalization and stable technical feature IDs. It does not supply a missing coordinate or grade choice. The cut translator requires explicit angle, part/spot/item identity and sends other stated fields unchanged for Store's own contract to accept or refuse. The Alcove mapping explicitly consumes its source component programs and reconciles summaries. The sheet mapping preserves the entire definition.

`unconsumed` fields on the cut/part/item paths travel to Store rather than being excluded. An undeclared bore or bevel consequently produces a named Store contract refusal. A sheet custom-retention field cannot disappear through a narrower System whitelist. Any obligation that has no valid mapping blocks or remains a named carried requirement. It is not hidden to obtain a supportable answer.

The generic System shape currently represents a narrower set of optional fields than Store's protocol-2 definition contract. It lacks some profile, two-edge, explicit spot-constraint and sheet-tool fields used by the public path. That is a separate generic-interface limitation, recorded in chapter 15; the explanation does not silently widen it or appoint it as the Store schema owner.

## 9. The Store communication boundary

### 9.1 Public wire and formal inquiry

The browser's outer transport is **`stb-store-zero-http/1`**. It retains project and customer revision identity around the original public payload. Its job envelope contains:

```js
{
  protocolVersion: 'stb-store-zero-http/1',
  requestId, projectId, candidateRevisionId, requestType, scope,
  demandSignature, querySignature: null, payloadDigest,
  expectedStorePin, attemptId, attemptNumber: 1, sentAt,
  payload // original identified line or definition
}
```

This is sent to same-origin `POST /api/store-zero/job`. Offering discovery uses `/api/store-zero/offering`, `OFFERING_LOOKUP`, `querySignature` and a search payload. The browser validates the configured endpoint path, protocol, origin and pin from `stb-store-runtime.json`. It uses no-store requests and bounded timeouts.

The server reads the original payload, translates it and sends Store's formal four-field job inquiry to `POST /v1/requests`. **`STORE-ZERO-REQUEST-2` identifies the response transport; it is not an extra field to insert into the formal request.** A caller's conflicting expected pin is rejected with `CALLER_PIN_DOES_NOT_GOVERN`; the server's inspected pin governs.

### 9.2 Complete protocol-2 example

The following is a complete valid inquiry for the 16-inch SPF specimen. Its example request ID is deliberate, so its calculation identities need not equal another inquiry with identical geometry. The baseline Q is $8.62 when evaluated against the identified runtime catalog/model.

```json
{
  "requestType": "USER_DEFINED_BOARD_V1",
  "requestId": "SYSTEM-MASTER-SYO-16",
  "demand": {
    "title": "Start your own",
    "configurationId": "SYO-USER1-XBRACE",
    "configurationVersion": "0.1",
    "classId": "user_defined_board",
    "materialDemand": {"species":"spf","form":"board","nominalT":2,"nominalW":4},
    "definedWorkpieceLengthIn": 60,
    "requiredOps": ["MITER_LIMITED","SPOT_ON_LOCATION"],
    "sawAngleDeg": 30,
    "cutPlane": "miter-face",
    "datumCMethod": "REFERENCE_CUT",
    "endRelation": "parallel",
    "lengthDatum": "long-long-outer-edge",
    "endIdentity": null,
    "declaredSawCuts": 3,
    "declaredSpotCount": 2,
    "unresolvedConditions": [],
    "parts": [
      {"partId":"PART-1","lengthIn":16,"features":[{"featureId":"SPOT-1","kind":"SPOT_ON_LOCATION","xIn":8,"locationRule":"CENTERED_ON_PART","acrossWidthRule":"CENTERED_ON_WIDE_FACE"}]},
      {"partId":"PART-2","lengthIn":16,"features":[{"featureId":"SPOT-2","kind":"SPOT_ON_LOCATION","xIn":8,"locationRule":"CENTERED_ON_PART","acrossWidthRule":"CENTERED_ON_WIDE_FACE"}]}
    ]
  },
  "manifest": {
    "jobId":"SYO-USER1-XBRACE", "revision":"0.1",
    "boardPartIds":["PART-1","PART-2"], "sheetPackageIds":[],
    "featureIds":["SPOT-1","SPOT-2"], "items":[], "unresolvedRequirements":[]
  }
}
```

For CUT_PACKAGE_V1, demand contains configuration identity, `cutPackages` and optional `itemLines`. Every package names material, end angle/meaning and positive identified parts; optional finished width, two-edge preparation, spots and profiles remain literal. Item quantity means the requested selector's unit: a structured screw requirement uses pieces; exact SKU/functional kit uses its declared selling unit. For SHEET_PACKAGE_V1, demand contains configuration, selected material dimensions/species/grade, complete named features and `returnAllPieces`. Chapters 4–7 fully explain those System definitions; the immutable Store master provides its exact large baseline inquiry examples and manufacturing interpretation.

OFFERING_LOOKUP is discovery: `{requestType, requestId, demand:{searchText}}`, without a manifest. Its result contains attributable offerings, catalog identity and returned limits, but no job Q, operation plan or quotation receipt. Attaching an offering must be followed by a complete job inquiry.

### 9.3 Response and receipt

Store's HTTP response wraps `{protocol, storeRelease, payloadDigest, respondedAt, answer}`. `payloadDigest` identifies the **exact serialized formal request bytes**. The outer browser payload digest identifies the canonical public payload instead; the two layers do not hash the same object.

The evaluated answer contains disposition, completeness, current configuration/job identity, selected stock, parent/work/coverage records, time, totals, calculation identity, freshness and receipt. Store is the issuer of those facts. Its receipt has exactly these fields:

| Receipt field | Binding or function |
| --- | --- |
| `freshnessRule` | `STB-STORE-FRESH-EVALUATION-0.1` |
| `requestType`, `requestId` | The actual evaluated inquiry |
| `evaluatedAt` | Real UTC evaluation instant |
| `authority` | Store revision, catalog hash, manufacturing model ID/hash and machine configuration ID/hash |
| `demandHash` | Canonical demand content |
| `manifestHash` | Canonical independent manifest content |
| `status` | Same disposition as the answer |
| `calculationIdentity` | Same `inputHash`/`resultHash` as the evaluated result |
| `receiptHash` | Canonical hash of the other receipt fields |

`interpretStoreHttp` checks HTTP 200, parseable JSON, protocol, expected release, raw-byte digest, request/type identity, sent demand/manifest agreement, required receipt shape/hash, freshness rule, status, real UTC timestamp, Store revision, catalog-hash shape and calculation-identity agreement. A receipt can attest a fresh negative evaluation; freshness does not mean supportability. A contract/admission rejection before evaluation carries no fresh receipt or calculation identity.

The model/configuration identities are preserved within the receipt authority and its hash. Machine-evidence requests separately compare the inspected configuration ID/hash. The HTTP interpreter's listed checks should not be inflated into an independent manufacturing-model evaluator or a cryptographic source authenticator.

### 9.4 Public presentation and currentness

The server returns the original outer correlation fields plus verified Store facts, `rawEvaluation`, `rawEstimate`, `evaluationReceipt`, material resolution, calculation identity and `mappedCallInputs:{requestType,demand,manifest}`. Its presentation projections read Store's operations/time/totals; they do not supply a new calculation. A conversion from returned seconds to displayed minutes/hours is presentation of Store time.

The browser verifies echoed protocol, request, attempt, project, customer revision, request type/scope, signatures/digest and Store pin. Tile and session code additionally reject a reply for an inactive attempt or changed revision. The browser can render a named pre-evaluation contract refusal through the explicitly bounded path; it remains a refusal without price or receipt, never a fresh supportable answer.

System distinguishes returned price completeness, requirement satisfaction and physical admission. `REQUIREMENTS_SATISFIED` means that the current translated manufacturing scope is fully answered with complete Store Q and no carried unevaluated requirement. `NOT_FULLY_SUPPORTABLE` exposes a scoped complete estimate with separately disclosed unresolved requirements where that compatibility path applies. Physical machine admission remains BLOCKED in both cases.

`presentMoney` reads Store totals. It retains older partial-result compatibility with an explicit partial-only label. The current whole-job core withholds complete Q for incomplete work; a sum of priced lines cannot stand for it. Network/protocol failure supplies no Q and no manufactured Store refusal.

### 9.5 Reproduce preserved bytes

A reproducible inquiry keeps **request ID, demand and independent manifest**, as well as its applicable release. A changed request ID can change calculation input identity even when Q stays equal. To check a saved complete `request.json`, run the following from a clean checkout of Store's exact runtime pin:

```sh
node --input-type=module <<'JS'
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {evaluateStoreRequest} from './src/requests/store-request.mjs';
const release=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(release!=='f7123a73c1ca60aa7eb180a86a1c365eaffe95db') throw Error('Wrong Store checkout');
const request=JSON.parse(fs.readFileSync('request.json','utf8'));
const answer=evaluateStoreRequest(request,{release});
console.log(JSON.stringify({status:answer.status,Q:answer.Q,
  calculationIdentity:answer.calculationIdentity,evaluationReceipt:answer.evaluationReceipt},null,2));
JS
```

This evaluates the original request rather than constructing a guessed manifest. With identical governing inputs the calculation identities can be compared. A new real evaluation time changes the receipt identity, so do not require its fresh receipt hash to equal an earlier timestamp's receipt. Reproducing raw transport bytes is a separate HTTP check. A saved answer remains historical after reproduction until System binds a fresh exchange to the current project revision.

## 10. Customer decision and commercial progression

### 10.1 The installed shared gate

`public/live/stb-commercial-sequence.js` is byte-identical to pinned Store's `src/contracts/commercial-sequence.js`. Its schema is `STB-COMMERCIAL-EVENT-1`. It declares twenty event types and validates an identified source event stream. `stb-terms-flow.js` presents that stream and closes dependent navigation when the definition changes. The six customer trail stages are a presentation of this fuller sequence, not six combined events that can create all subsequent facts automatically.

The gate accepts SIMULATED records. ACTUAL input is refused with `ACTUAL_SOURCE_ADAPTER_NOT_INSTALLED`. It has no financial, inventory, notification or machine side effect. Seller policy, customer decision, finance, stock assignment and local/quality/fulfillment evidence remain distinct even in a simulation.

The documentary `docs/commercial-sequence-template.md` remains the shared installed copy. Its opening says proposed/not adopted while its later section describes the adopted gate; its broad illustrative envelope differs from the executable envelope. It is retained unchanged because Store is frozen and unilateral amendment would break shared-contract alignment. This chapter explains actual behavior and records the coordinated repair in chapter 15.

### 10.2 Source acts and the customer stages

| Customer stage | Executable records and responsible source | What System presents |
| --- | --- | --- |
| Store answers | `StoreAnswerAttached`, System retaining the verified Store result | Complete current answer, manifest and receipt binding |
| Your call | `OfferIssued` by seller; `CustomerDecisionRecorded` by customer; `OrderAccepted` by seller | Actual offered scope/amount/terms and the separate accepted/declined/deferred/revision decision |
| Commercial entry | `FinancialEventRecorded`, `ReservationConfirmed`, `CapacityCommitmentRecorded`, `QueueEntryConfirmed` from their named roles | Policy-specific finance/stock/capacity conditions and queue |
| We cut it, preparation | `MaterialAllocated`, `MaterialIssued`, `ProductionReleaseRecorded`, `LocalPlanBound`, `LocalAdmissionRecorded` | Named stock, packet/plan, applicable release and local-admission evidence |
| We cut it, result | `ExecutionEventRecorded`, `InspectionDispositionRecorded` | Recorded execution kind and component disposition |
| Pick up & build | `StagingRecorded`, `ReadyNoticeRecorded`, `CustodyTransferred`, `ProjectCloseoutRecorded` | Packages, notice, recipient, handoff and owner closeout |
| Across the stream | `ExceptionRecorded` | Hold/disposition and affected history |

A manufacturing budgetary answer is not the seller's offer. The offer carries seller/location, offer ID/version, currency, manufacturing reference, complete offered amount, scope, terms, expiry, fulfillment, policy and extras. System keeps Store Q unchanged. Additional seller services, tax or delivery must receive explicit dispositions; an unresolved extra cannot silently become zero. The demo's manufacturing-only scope is an explicit choice.

Customer acceptance names the offer/version actually shown. Seller acceptance then supplies its own order identity and availability/capability assertions. Finance uses safe integer minor units and distinct AUTHORIZED/CAPTURED/SETTLED/FAILED/VOIDED/REFUNDED kinds. Policy states which kind is required and whether reservations/capacity are required. Queue position cannot be inferred from the user's acceptance or Store's selected stock.

Allocation identifies material, parent, lot, location, condition, quantities and compatible definition. Issue, release, local plan and admission bind that allocation and packet. Execution/inspection/staging/notice/custody each add their own identities and prerequisites. A simulated local `admitted:true` event does not override the machine evidence boundary's physical BLOCKED result.

### 10.3 Identity and event custody

The executable stream has ten fixed links: `projectId`, `definitionId`, `revisionId`, `manifestHash`, `requestId`, `receiptHash`, `storeRevision`, `modelHash`, `inputHash`, `resultHash`. Those values remain equal across the stream. Offer/order/packet/allocation identities belong in the corresponding event payload; the broader template example is not a valid instruction to add extra executable link fields.

Each source event supplies event/stream identity, sequence and expected previous sequence, causes, idempotency key, real UTC instants, attributed actor/authority, evidence class, links and payload. The stored event adds `previousHash` and `hash`. Replaying the shared verifier rechecks the gate and hash chain. Exact duplicate delivery returns the existing event; changed content under the same idempotency key is refused. Stale sequence and overlapping in-memory appends are blocked.

This validates content and causal consistency. It does not authenticate all asserted source actors or implement durable multi-process stock/order transactions. The gate's current exception handling also keeps an earlier unresolved exception blocking normal events even after a later RESOLVED record. Those limits require coordinated source/contract work; they are not hidden by presenting a successful demo.

### 10.4 Start Your Own policy and other pending flows

Start Your Own explicitly creates its terms flow with demo commerce enabled. `stb-demo-commerce.js` supplies **`STB-DEMO-TERMS / 1`**, **`STB-DEMO-PICKUP / 1`**, seller `store-zero-demo`, Demo yard, USD, pickup fulfillment and a 24-hour offer. Its amount is the complete current Store manufacturing Q. Tax, delivery and additional services are OUTSIDE_SCOPE. Policy requires CAPTURED and no reservation/capacity.

Accept & Pay records a customer decision, then separate simulated seller order acceptance, capture and queue entry. Run the Yard Demo generates explicitly simulated allocation/issue/release/plan/admission/execution/inspection/staging/notice records. Pickup appends custody and closeout with OWNER_BUILDS assembly status. The helper checks current revision and stream before and after appending. A revised definition cannot continue the old checkout.

The other four projects use the shared gate and terms presentation without that automatically installed seller policy. A complete manufacturing answer can open review; missing offer/order/financial evidence stays pending. The previous verification note's broad claims of simulated fulfillment must retain their earlier date and pin rather than being presented as current behavior for all tiles.

The complete transaction design and exact manufacturing/commercial qualifications are developed in [Store master chapter 10](https://github.com/GeorgePlattDemo/store-zero/blob/cd08aff624adf3b3a01ac0a42ea33681c5ba2bef/STORE-ZERO-MASTER.md#10-commercial-sequence-and-full-transaction). The shared executable remains the sole gate, rather than this explanation becoming another implementation.

## 11. Records identity and custody

### 11.1 What an owner record preserves

An owner-held record connects the original declaration/source, controlling definition, derivations, unresolved facts, independent manifest, inquiry attempts, returned answers, decisions and applicable later evidence. Each consequential fact retains its issuing owner. Reopening restores the retained definition and history; it does not create a newly evaluated Store fact, commercial decision or manufacturing outcome.

The installed record paths differ. The generic typed record is not the schema of every public tile's local state or session evidence export. The inherited term `stb-owner-archive`/`.stb.json` describes the broader owner-archive concept; this repository does not implement it as a universal importer across all five published tiles.

| Installed path | Actual stored/exported form | Current custody and limits |
| --- | --- | --- |
| Retired generic React routes `/bench` and `/projects/$projectId` | Former `STB-SYSTEM-RECORD-2` local record and JSON-download UI; source preserved in Git | Typed record fixtures and tests remain as technical reference; no active public React record page |
| Start Your Own public demo | `stb-start-own-user1-definition`, `stb-start-own-user1-bench`, `stb-proof-handoff-job1` localStorage keys | Definition/Bench settings and confirmed handoff; current answer must be obtained again |
| Published project-copy host, especially Playhouse | `stb-canonical-saved-projects-v1` keyed by demonstration owner | Captured controls, heights/material/format and registered state parts; opening/read-only/editing state is separate |
| Window Seat | Identified record and readable audit text for the session | Sources/status/knobs/kept asks and exchange evidence; its reproduction text currently has the manifest defect |
| Outdoor | `outdoor-evidence-<revision>.json` download | Session definition, demand/response/receipt and service/chain facts; explicitly an unsigned session snapshot |
| Shared terms flow | Revision-bound in-memory source/stream plus retained previous chains | Does not by itself provide durable commercial storage across reloads |
| Additional services menu | Project-keyed sessionStorage | Planning-only selections; no universal owner-record serialization |

The public project-copy host captures controls by DOM ID and separately registered non-DOM state such as Playhouse's sheet/tools. It restores those values through the project synchronization functions and recalculates current availability. It does not load an old page because a stored source string happens to name it. The loaded wrapper/page chain and named project mappings remain necessary compatibility surfaces.

### 11.2 Generic revisions and attempts

`session.ts` records `Project` identity, recipe/version, title/class, definition identity, current inputs, dirty state, revisions, current revision, inquiries, active attempt, price currentness, decisions, packets and optional machine-evidence attempts. A revision retains saved time, input snapshot, request type/demand, carried end requirements, derivation trace and blockers.

Generic revision identity is a truncated canonical content digest of recipe ID/version, inputs and demand. It identifies the local definition snapshot; it is not Store's result hash. `setInput` marks the project dirty, retires active inquiry/evidence and sets `pricesCurrent:false`. Saving compiles the new definition and preserves earlier snapshots. `beginInquiry` requires a saved, unblocked demand and retains exact serialized bytes/digest. Applying a reply checks the active project/attempt/revision before interpreting its content.

Project switch, park-for-reopen and reopen retire price/evidence currentness. Earlier attempts and accepted decisions remain in history. A later refused definition is displayed as refused, not still accepted because the project once had a favorable answer.

`use-record.ts` preserves malformed/unsupported raw files for recovery and exposes storage errors. A failed write does not replace the user's visible file with an empty one. Unknown version does not acquire a current schema merely by reopening. Resetting a malformed record is an explicit user action; there is no silent conversion.

### 11.3 Accepted packet and evidence

`acceptance.ts` emits **`STB-ACCEPTED-JOB-PACKET-2`** with packet/project identity, definition/revision/type, demand, independent manifest, carried requirements, unchanged Store answer, accepted simulated decision and false physical release. It requires fresh supportable status, a receipt bound to the same demand/manifest, and a decision instant no earlier than evaluation. Duplicate acceptance for the same revision/receipt is identified rather than producing another decision.

Machine evidence consumes that packet plus the inspected configuration ID/hash through `/v1/machine-evidence`. System preserves the request bytes/digest and response; an edited definition or changed current acceptance rejects late evidence. The interpreter requires VIRTUAL_EVIDENCE_READY with records/run/local job, false physical authority and BLOCKED admission with zero physical motion commands. It does not generate its own virtual operations when Store is missing.

The generic loader's `packetOk` currently accepts schema **1**, while the producer emits schema **2**. A direct probe on the exact baseline created a valid current packet from a real pinned-Store answer: the record loaded before adding the packet, but returned **MALFORMED** after the genuine packet was saved. Thus current accepted packets cannot safely round-trip through that loader as written. This is an executable compatibility defect, not a documentation spelling issue. Its repair remains pending under System authority.

### 11.4 History and correction

The append-only principle applies to consequential issued evidence: retain the original answer, decision and event identities, then add a new identified revision or correction. Current working input state and UI projections can change; they do not retroactively change a sealed historical result. An exported digest establishes content consistency, not authorship or a newly performed event.

System's two historical Project 1 JSON fixtures retain original specimen identities. Full manuscripts, patents and executable historical package remain in Store custody. Store's $11.09 historical result and the current $10.81 equivalent inquiry are separate evidence records; neither is the current 16-inch SPF public price. The reader does not need old repositories to understand that distinction.

## 12. Refusals errors and unresolved work

### 12.1 Separate dispositions

| Boundary/state | Meaning and presentation | Permitted consequence |
| --- | --- | --- |
| System admission BLOCKED | Missing, unsettled, malformed or undeclared required fact; names field and owner | No Store call; return to the controlling definition |
| Store SUPPORTABLE | Complete evaluated manufacturing scope and Q under that Store's facts | Present current result; commercial prerequisites remain separate |
| Store UNRESOLVED | Required meaning/evidence or complete calculation remains unsettled | Preserve reasons; no complete Q |
| Store REFUSED | Unsupported or invalid request/geometry/operation | Show actual reasons; close dependent continuation |
| Store UNAVAILABLE | No complete eligible supply plan from declared available inventory | Preserve supply disposition; no substitute stock/Q |
| Transport failure | Unreachable service, timeout or failing HTTP | Show transport error; do not attribute a made-up Store refusal |
| Protocol failure | Wrong release/bytes/identity/receipt or malformed response | Reject current-answer use and retain the failed attempt |
| Late response | Inactive project/revision/attempt | Reject as current; retain its attempt history |
| Commercial hold/pending | Required source act or policy is missing/invalid | Keep the responsible later stage pending |
| Physical admission BLOCKED | Local commissioned authority is absent | No physical motion |

### 12.2 Typical reasons and faithful translation

System reasons include `REQUIRED_FACT_UNSETTLED`, `INQUIRY_SCOPE_UNDECLARED`, `DEFINITION_REVISION_REQUIRED`, `PUBLISHED_DEFINITION_INCOMPLETE`, `UNSAVED_EDITS` and `ADMISSION_BLOCKED`. Store reasons include `INDEPENDENT_SYSTEM_MANIFEST_REQUIRED`, `MANIFEST_COVERAGE_MISMATCH`, `JOB_REQUIREMENTS_REMAIN_UNEVALUATED`, `GRADE_CHOICE_REQUIRED`, unoffered material, unsupported operation/geometry, and `SPLIT_TAB_POSITIONS_REQUIRED`. Current retained-length wording is `RETAINED_CONTROL_LENGTH_TOO_SHORT`; `LAST_REMAIN_BELOW_TWO_ROLLER_CONTROL` belongs to the older specimen/engine vocabulary.

The application retains raw reason codes and disclosed context. Some page-specific human-readable maps still name retired engine reasons; a new reason can fall through visibly as a raw code. That is explanation drift, not permission to soften it into supportable status. Unknown reasons must remain available with their source rather than being replaced with a guessed reassuring sentence.

Missing means unsupplied, not zero. Zero is valid where the requirement explicitly allows it, such as a pattern offset or zero tower shelves. A missing cut angle is not square. An absent grade is not a customer's selection. A disabled empty spotting requirement is different from an enabled feature whose position is missing.

### 12.3 Failures after an answer

A new definition closes old downstream authority before another answer arrives. The shared terms flow listens for consequential control input/change and invalidates its current chain. Receipt content disagreement, a caller pin override or a failed Store service cannot reopen it. An older accepted record survives as history but is not the current state of a refused revision.

Commercial exceptions remain attributable records. The current shared gate's conservative exception hold does not yet implement general recovery from an earlier unresolved event. System may present the hold; repairing its semantics requires the shared contract owner and coordinated Store changes. Local physical interruption/readiness/recovery remain outside System's price/definition authority and are explained in Store's machine chapter and Program's trial.

## 13. Application architecture and deployment

### 13.1 Loaded pages and their responsibilities

| Loaded surface | Actual dependency and function | Retention obligation |
| --- | --- | --- |
| `/` | `src/routes/index.tsx` redirects to `/live/system-build-current.html` | Public application front door |
| `system-build-current.html` | Loads front-door frame; injects current definitions, active bridges, tile registration, journey reconciliation and guides | Current shell and active application code |
| `system-build-front-door-0.5.html` | Loads base frame; project-copy host, demonstration owner, saved control/state restoration and page composition | Live wrapper and saved-project compatibility |
| `system-build-base-8d8a9dd.html` | Root pages, landing/library, Alcove definition/drawing/controls and inherited routes | Live base plus active Alcove code |
| `three-frames.html` | Active Start Your Own child; current wrapper augments its screens and definition | Published Job 1 |
| `stb-window-seat-0.9.html` | Full Window Seat source/status/geometry/controls/requests/session record | Published Window Seat |
| `stb-outdoor-picnic-0.4.html` | Selected plans, public/source imagery, option/committed requests, bigger Bench and evidence export | Published Outdoor |
| Playhouse injected pages in wrappers | Current sheet/tool/admission/drawing and read-only/working state | Published Playhouse and saved state parts |

The default release query marker is `v=demo-checkout-20261011` on page/script URLs where declared. The marker is a cache-loading identity, not the inspected Store commit. Keeping a current Store pin while loading an old response reader can still misdescribe an answer, so page/script identities and deployment verification matter.

The public application uses nested same-origin documents. Child frames own project state and definition; the host owns shared navigation. Messages are checked for origin, source/schema, project identity, stage and correlation. A host navigation message carries no demand or inquiry admission. Restoring the same page chain preserves DOM IDs and registered state parts used by saved copies.

Some base/front-door legacy text is overridden in the current composition but remains reachable through direct URLs or inherited page roots. Removing a hidden-looking block can alter first paint, navigation, restoring state or a direct public view. This consolidation therefore leaves active HTML bodies unchanged and records stale visible claims for a separate targeted source repair.

### 13.2 Shared runtime assets

The browser uses `stb-store-client.js`, `stb-store-runtime.json`, `stb-public-admission.mjs` and the two shared contract modules. Start Your Own's bridge/answer reader and Alcove's bridge carry their current definitions. `stb-trail-contract.js` and `stb-canonical-journey.js` declare/present the common trail. `stb-build-guide-spec.js` supplies the developer/reviewer rails, including admitted gaps.

`stb-intent-kit.js` and CSS mount compact offering lookup without holding a catalog or selecting Store parents. `stb-outdoor-option-requests.js` separates alternative manufacturing inquiries. `stb-terms-flow.js`, the shared commercial gate and `stb-demo-commerce.js` provide the event presentation and explicit Job 1 policy. `stb-additional-services.js` mounts planning menus across the nested documents. `store-zero-canonical-doctrine.js` supplies the shared Store reference/next-action text in the published children. These are live runtime dependencies, even when part of their content is explanatory.

Image assets and SVG/data-URL drawings remain at their existing identities. The two public Outdoor authority/research pages remain linked from the working Rule Book and contain dated independent source evidence. Their retention does not grant their exploratory designs a Store evaluator or make a historical donor the current source.

### 13.3 Server adapter and liveness

The public API routes parse the outer wire and call `answerPublishedWire`, using server-side `STORE_ZERO_ORIGIN` (local default `http://127.0.0.1:8091`). The adapter forwards only to the identified replacement Store. `/healthz` is System liveness; it does not attest Store availability or physical authority.

The former generic React routes and their private `storeHealth`, `forwardStoreRequest`, `forwardMachineEvidence` transport and `useRecord` hook were retired together. Their executable source and historical record behavior remain in Git. The live five-project application uses only `/api/store-zero/job`, `/api/store-zero/offering` and the published-wire adapter; those APIs retain their own bounded request handling and pinned Store answer checks.

`src/system/machine.ts` currently reports lowering registered only for USER_DEFINED_BOARD_V1. Store's current protocol-2 evidence accepts all three manufacturing classes; this generic presentation helper is stale and affects its displayed explanation. Actual HTTP cut-package evidence tests return VIRTUAL_EVIDENCE_READY with physical BLOCKED. The helper is retained and its separate acceptance criterion is recorded in chapter 15.

### 13.4 Build startup and hosting

The project uses React/TanStack Start/Router, Vite and Nitro. `npm run dev` goes through `scripts/with-app-env.mjs`; this preserves the inherited auth/environment wrapper. Vite dev binds `0.0.0.0:8080`; preview uses strict `127.0.0.1:8081`. Default `npm run build` selects the retained Vercel preset; `NITRO_PRESET=node-server` selects Railway's Node output. CI checks both. Present Railway hosting does not make the alternative build or its platform middleware safe to delete.

`Dockerfile.railway` installs the locked packages, builds Node output, runs typecheck and requires `.output/server/index.mjs`. The runtime stage runs that server with production, HOST=0.0.0.0 and PORT=8080. Railway config points to this Dockerfile, `main`, `/healthz` and the identified production service. The Store runs in its own service; System does not bundle its manufacturing engine.

`startup.sh` is the existing `/workspace` preview/restart contract. It verifies an actual clean Store checkout HEAD before starting or recognizing a local Store process under the inspected release; a label is not sufficient. A mismatched/dirty checkout is not advertised. It preserves the user-configured Store origin and starts through `npm run dev`. Local development and Railway production have separate startup mechanisms; neither proves the other was deployed.

### 13.5 Platform infrastructure that remains active

The repository retains build-connected authentication, database/migration and browser smoke checks. The Grok-specific preview bridge, preview-thumbnail hook and brand-asset writer were retired with their exclusive source and tests. Grok PWA/branding injection, the install tutorial and `public/__grok/` assets were likewise retired after verifying the five published project path.

The source-derived defaults keep accounts off without enabled configuration. The application root now supplies only its document shell and live public redirect; the separate React project UI, no-op auth provider and Grok preview chrome are retired. The actual auth server and database build paths remain until a separate complete dependency retirement can preserve the relevant invariants.

## 14. Testing and verification

### 14.1 Commands and observed results

Run System checks against a **clean exact pinned Store checkout**, not Store's later documentation HEAD:

```sh
STORE_ZERO_ROOT=/absolute/path/to/f7123a73-store-checkout npm test
npm run build
npm run typecheck
NITRO_PRESET=node-server npm run build
test -f .output/server/index.mjs
```

| Verification at the frozen source | Observed result | What it establishes |
| --- | --- | --- |
| Required System suite, actual Store HEAD f7123a73 | 334 passed, zero failures | Repository/platform, typed System, real HTTP integration and public-wire behaviors covered by those tests |
| Default production build | Passed | Retained Vercel build path and environment/migration wrapper |
| Railway Node production build | Passed; server output present | Current Node production packaging |
| TypeScript | Passed | Type/route checks for the installed source |
| Five hosted starting inquiries | $8.62 / $379.11 / $1,193.10 / $293.16 / $76.56 | Fresh automatic Q presented for the exact public definitions in chapter 1 |
| Hosted 16 → 18-inch brace change | Fresh $9.13, 72-inch parent and 35⅝-inch returned remainder | Geometry change/current-answer invalidation and Store-selected parent presentation |
| Master's complete protocol-2 example | SUPPORTABLE, Q $8.62 | Example includes the independent manifest and is executable against the real pinned core |
| Generic current-packet loader probe | Pre-acceptance record loads; genuine packet-2 record returns MALFORMED | Reproduced outstanding compatibility defect |
| Shared commercial text and gate | Both byte-identical to pinned Store copies | No unilateral shared-contract amendment |
| Hosted page inspection | All five intake/Intent/Bench paths and current rails observed | Actual loaded application, beyond filename/test-name assertions |

Local baseline Node was v24.19.0. Hosted `.github/workflows/verify.yml` runs Node 22, installs the locked dependencies, checks out Store exactly at the runtime pin, runs the full suite, default build, typecheck and Node build. Master verification and deferred retirement are recorded in section 16.4. No cleanup is authorized in this pass.

### 14.2 What the test families prove

`system.test.ts` covers named rule compilation, geometry/input blockers, preserved undefined fields, explicit counts, discovery versus Q, partial-result labeling, revision/currentness, real receipt constraints, reopening/schema handling, historical fixture identity, later refusal and machine-authority rejection. Its saved-record tests do not prove that the actual packet-2 producer and packet loader round-trip correctly; the direct probe exposes that missing correspondence.

`playhouse-admission.test.ts` exercises exact nested facts, incomplete wood identity, added-cut operands, pattern offsets and capability-independent admission. `store-client.test.ts` exercises browser transport/discovery validation. `published-wire.test.ts` covers the actual public definitions/translations, requirement preservation, source manifests, default/changed Store answers, alternative queries, unsupported fields, scoped-review/commercial constraints and demo sequence. `start-own-bench.test.ts` verifies the live returned facts as a consistent Bench view. `http.integration.test.ts` starts the real pinned Store, reads its health identity and checks the three definition classes, discovery, receipts and machine evidence.

Current repository tests protect required environments, authentication invariants, browser/process checks and Store request boundaries. The retired PWA/branding/install feature and its exclusive tests no longer form part of the published System build.

A passing suite is necessary, but cannot establish faithful external-plan interpretation, physical stock, commissioned movement or every direct-link obligation. Test names retaining an older adjective/price do not supersede their actual assertions. Browser observations of declared modeled prices do not constitute paid orders or inspected physical parts.

### 14.3 Current and historical numbers

Current prices belong to exact definitions, request identities, catalog, model and executable release. Changing a dimension/material/feature initiates a new inquiry; retaining a project title does not retain its price. A price decrease after a change is not inherently a defect if Store's complete selected plan changed; the returned requirements, stock and ledger must explain it. System has no authority to force a monotonic local price.

The retained verification note supplies dated historical observations:

| Original observation | Original Store identity/context | Continuing meaning |
| --- | --- | --- |
| 8 October: 16/18-inch SPF $8.54/$9.07; treated specimen $11.09/$11.08 | `4cb0c625ac00c62390129b55a52596b52f10decd`; end facts then carried unevaluated | Earlier integration state, not current full-job support |
| 9 October: 16/18-inch parent change and refusal/currentness checks | `1cea72c8223b2c738180b230c584c4ab557267ca` | Dated UI/receipt behavior under that release |
| 10 October: SPF $8.54/$9.07; Alcove $449.85; Window Seat Pine/Poplar $1,489.09/$2,005.89; Outdoor $275.52; Playhouse $76.57 | `81d958482bd25e784f122c97ffb11174013395af`; deployed initial repair `a722fc4cf0490b364d1fae1be520dd3a318a5a1e` | Dated earlier engine/definition/commercial demonstrations |
| 11 October: five current starts and altered Bench values | Exact current f7123a73 Store; adopted shared core/gate | Baseline observations repeated for starting values on 12 October |

The sealed original Project 1 result is **$11.09**, 85.5001-second Store time and a separate 86.46953628299116-second virtual sequence. The adopted-core equivalent is **$10.81**, with different selected stock and calculation identity. The public 16-inch SPF demonstration is **$8.62**. These identify three distinct inquiries/evidence states and must not be substituted for one another. The full manufacturing comparison remains in Store's master.

### 14.4 Navigation and dependency verification

Inspection begins with imports/generated routes, frames/scripts/styles, selected project sources/assets, tests/fixtures, deployment, saved-record mappings, direct current links and Markdown anchors. Live HTML was inspected in the loaded browser as well as source. The current outer/child graph, exact image assets, project-state IDs and Store runtime configuration are retained.

The project entry observation covered all five Idea/Intent/Bench paths. Start Your Own lands at Intent; the other Idea pages expose NEXT → INTENT; every Intent exposes BRING IT TO THE BENCH →. Addl svcs triggers appeared on each Bench; the installed common source and open/Close behavior were checked. The deployed five starting prices matched the frozen record. Final confirmation uses both unchanged source identities and renewed application observations after cleanup.

## 15. Discrepancies and repair boundaries

### 15.1 Implementation and meaning repairs still pending

| Finding and owner | Actual current state | Testable repair criterion |
| --- | --- | --- |
| **Outdoor source-to-demand end meaning — System** | Source says long-short; public and generic demand state long-long/miter-face with the same numbers; no transformation witness | Each angled class has identified source datum/plane and an explicit verified transformation or unsupported disposition; regression checks outgoing meaning. No silently changed lengths or expanded Store capability |
| **Outdoor material pedigree — System** | All-treated default is labeled the plan's wood; audit distinguishes source's untreated top/seat recommendation and optional treated legs | Keep any chosen treated variant as an explicit application/customer selection; correct source attribution and retain source versus inferred hardware counts |
| **Generic saved packet — System** | Producer emits packet2; loader accepts packet1; genuine current packet fails loading | Valid produced packet2 round-trips with unchanged demand/manifest/answer/decision; unknown or malformed versions remain rejected; reopening still retires current price/evidence |
| **Generic machine presentation — System** | `machine.ts` reports only board lowering; pinned Store evidence supports board/cut/sheet | Presentation matches all three inspected classes and actual endpoint results; unsupported/evidence failures remain explicit; physical admission remains BLOCKED |
| **Generic optional-field contract — System** | Typed `shape.ts` omits optional fields supported by public/Store protocol2 | Deliberate reconciliation of shared meanings and exact supported fields, with no Store capability/pricing duplicate and no silent drop of supplied requirements |
| **Exception recovery and broader source integration — shared contract owners** | Earlier unresolved exception remains a hold after later RESOLVED; source authentication/durable commercial integrations remain absent | Coordinated event correction/recovery policy and tests in both owners; exact byte alignment retained; actual evidence requires its commissioned source adapters |

These are not repaired by this consolidation. The Outdoor issue concerns the meaning of the defined job, not whether Store can correctly price the bytes it receives. The packet/machine findings affect the generic development/record path, not proof that every published tile fails. The shared-gate findings are coordinated work that cannot be amended while Store is frozen.

### 15.2 Explanation and reproduction drift

| Location | Present discrepancy | Required correction or consolidation disposition |
| --- | --- | --- |
| `docs/DEFINITIONS.md` at the starting revision | Earlier inquiry/receipt vocabulary, blank statuses, retired lowering limitation, per-cut prohibition and repeated/general terms | Pending a separate definitions reconciliation under System authority. The master explains actual protocol 2, independent manifest, receipt fields, dispositions and evidence classes without changing the dictionary in this pass |
| `AGENTS.md` at the starting revision | Assumed Grok-only chat, Vercel-only deployment, unavailable skills and generic scaffolding | Replaced with a concise map of current executable owners, preservation boundaries and required CI; inherited template instructions were retired along with their exclusive tests |
| Window Seat audit text | Saves demand only; command omits manifest and changes request ID; then claims same result hash | Export preserved full request, pin and identities; reproduce without guessing or renaming request; distinguish fresh receipt time/hash |
| `stb-build-guide-spec.js` | Alcove formal-knob-manifest gap can be confused with implemented protocol manifest; Window Seat fixed wood-list statement omits live discovery; Outdoor source coverage is incomplete | Correct each claim against its actual scope, distinguishing UI knob list, full protocol manifest and fixed buttons versus discovery; retain dev/rev guardrails |
| Window Seat spot explanation | Says 3/16-inch deep without the drill-point/full-diameter distinction | State 3/16-inch full-diameter penetration beyond point consistently with the defined operation; do not alter actual tool requirement |
| Page reason maps | Some retained-control/profile/sheet reasons belong to retired engine vocabulary | Explain current codes faithfully and retain unknown codes; do not manufacture success or conceal negative results |
| Shared commercial template | Proposed/not adopted opening contradicts installed section; example roles/links and removed paths lag gate | Coordinated rewrite of both original copies; executable gate/envelope controls current serialization. This assignment retains both unchanged |
| Active wrappers and Rule Book | Superseded embedded price/pin/request text and dated donor references remain shipped/reachable | Targeted future source/copy reconciliation after first-paint, direct-route and saved-state checks; current application language/layout stays unchanged here |
| Program trial opening | Describes current virtual commands more broadly than its precise modeled-ledger paragraph | Program-owned evidence-stage edit; Program remains unchanged here |
| Store master source register | Historical source register identified `stb-start-own-bench-leg-0.1.html` as current at its recorded revision; published Job 1 actually loads `three-frames.html` | Earlier standalone System HTML now retired; original preserved in Git; source register remains dated evidence, not a runtime selector |

The dictionary and agent boilerplate can be corrected as documentary governance within System's authority. Protected live-page wording and actual code discrepancies remain documented, rather than being silently changed during a document retirement. Historical price/evidence text stays in its original context.

### 15.3 Authority after consolidation

The original README remains the invitation into the current app, with one added link to this master. SYSTEM-MASTER supplies the complete System explanation. DEFINITIONS remains the System-owned shared-meaning authority, pending a later editorial reconciliation. AGENTS retains its existing maintenance safeguards. Required executable/shared contracts remain at their established paths. The externally linked dated verification note retains its evidence identity and link compatibility; it is not required to reconstruct the current explanation.

Current descriptive entry links name Program, new-system and store-zero. Immutable baseline source links are used for verification. A historical source mention explains the dated fact directly; it does not send the reader to a predecessor implementation for current behavior.

## 16. Source register and consolidation disposition

### 16.1 Exact System implementation sources

All runtime paths in the table describe **System source `ab09777d6f27d4b70a2193abc8564ebce611746f`**. This master-creation and restoration pass preserves their bytes, including the standalone page listed below. The single frozen commit identifies the exact revision of every linked path; no test fixture is relabeled as a public default.

| Current source | Function explained here | Meaningful verification |
| --- | --- | --- |
| [Current shell](https://github.com/GeorgePlattDemo/new-system/blob/ab09777d6f27d4b70a2193abc8564ebce611746f/public/live/system-build-current.html) | Current composition, Job 1 and Playhouse definitions, host registration | Loaded five-job browser; public-wire and Bench tests |
| [Front-door wrapper](https://github.com/GeorgePlattDemo/new-system/blob/ab09777d6f27d4b70a2193abc8564ebce611746f/public/live/system-build-front-door-0.5.html) | Base frame, project-copy/state restoration | Loaded nested graph and Playhouse ownership presentation |
| [Base and Alcove](https://github.com/GeorgePlattDemo/new-system/blob/ab09777d6f27d4b70a2193abc8564ebce611746f/public/live/system-build-base-8d8a9dd.html) | Landing/library, stock-aware Alcove geometry/component programs | Actual extracted public programs and Store tests |
| [Start Your Own child](https://github.com/GeorgePlattDemo/new-system/blob/ab09777d6f27d4b70a2193abc8564ebce611746f/public/live/three-frames.html) | Existing active Job 1 screens/reference | Loaded frame and Start Own Bench regression |
| [Window Seat](https://github.com/GeorgePlattDemo/new-system/blob/ab09777d6f27d4b70a2193abc8564ebce611746f/public/live/stb-window-seat-0.9.html) | Sources/status, geometry, inquiry and session audit | Public-wire, generic extension checks and browser |
| [Outdoor](https://github.com/GeorgePlattDemo/new-system/blob/ab09777d6f27d4b70a2193abc8564ebce611746f/public/live/stb-outdoor-picnic-0.4.html) | Selected plans, controls, previews/committed request, export | Public-wire alternative/spot/currentness checks and browser |
| [Trail](https://github.com/GeorgePlattDemo/new-system/blob/ab09777d6f27d4b70a2193abc8564ebce611746f/public/live/stb-trail-contract.js) | Idea, six labels, tile pages and declared exceptions | Host contract/public navigation |
| [Tile admission](https://github.com/GeorgePlattDemo/new-system/blob/ab09777d6f27d4b70a2193abc8564ebce611746f/public/live/shared/tile-host-admission-contract.mjs) | Nested scope readiness, nav and historical reopen | Published-wire and Playhouse admission tests |
| [Responsibility contract](https://github.com/GeorgePlattDemo/new-system/blob/ab09777d6f27d4b70a2193abc8564ebce611746f/public/live/shared/definition-contract.mjs) | Ledger status/owner/basis and boundary readiness | Public admission/System checks |
| [Browser client](https://github.com/GeorgePlattDemo/new-system/blob/ab09777d6f27d4b70a2193abc8564ebce611746f/public/live/stb-store-client.js) | Same-origin transport, discovery and outer correlation | Store-client/public-wire tests |
| [Published translator](https://github.com/GeorgePlattDemo/new-system/blob/ab09777d6f27d4b70a2193abc8564ebce611746f/src/system/store/published-wire.ts) | Preserve original obligations and consume verified Store answers | Actual published inputs plus real pinned HTTP |
| [Manifest](https://github.com/GeorgePlattDemo/new-system/blob/ab09777d6f27d4b70a2193abc8564ebce611746f/src/system/manifest.ts) | Independent expected component/feature/item identities | Coverage/drop/mismatch regressions |
| [Interpreter](https://github.com/GeorgePlattDemo/new-system/blob/ab09777d6f27d4b70a2193abc8564ebce611746f/src/system/store/interpret.ts) | Exact bytes, request/receipt/currentness and money/evidence presentation | System/HTTP integrity and failure cases |
| [Generic compiler](https://github.com/GeorgePlattDemo/new-system/blob/ab09777d6f27d4b70a2193abc8564ebce611746f/src/system/compile.ts) and [Window Seat extension](https://github.com/GeorgePlattDemo/new-system/blob/ab09777d6f27d4b70a2193abc8564ebce611746f/src/system/window-seat.ts) | Named derivations and blockers | System rule/input/geometry tests |
| [Recipes](https://github.com/GeorgePlattDemo/new-system/blob/ab09777d6f27d4b70a2193abc8564ebce611746f/src/system/recipes/library.ts), `recipe.ts`, `shape.ts`, `hash.ts`, `ids.ts` | Generic source rules/types, structural admission and content/instance identity | Compilation, malformed/version and unknown-field tests |
| [Session](https://github.com/GeorgePlattDemo/new-system/blob/ab09777d6f27d4b70a2193abc8564ebce611746f/src/system/session.ts), [acceptance](https://github.com/GeorgePlattDemo/new-system/blob/ab09777d6f27d4b70a2193abc8564ebce611746f/src/system/acceptance.ts), `machine.ts` | Generic custody, packet2, inspected evidence and presentation | System/HTTP tests plus actual loader discrepancy probe |
| [Shared commercial gate](https://github.com/GeorgePlattDemo/new-system/blob/ab09777d6f27d4b70a2193abc8564ebce611746f/public/live/stb-commercial-sequence.js), `stb-terms-flow.js`, `stb-demo-commerce.js` | Stream validation/presentation and explicit Job 1 sources | Shared byte equality; commercial/public-wire demo regressions |
| `stb-start-own-answer.mjs`, `stb-user-defined-board-runtime-bridge.js`, `stb-alcove-store-bridge.js` | Current public job bridges and verified Bench facts | Start Own Bench and published-wire tests |
| `stb-outdoor-option-requests.js`, `stb-intent-kit.js`, `stb-intent-kit.css` | Independent alternatives and offered-material discovery UI | Public-wire/Store-client tests and loaded Intent |
| `stb-additional-services.js` | 62 planning choices, mount/Close and per-project state | All five triggers; actual open/Close; unchanged common source |
| `stb-build-guide-spec.js`, `store-zero-canonical-doctrine.js`, `stb-canonical-journey.js` | Reviewer rails and shared reference/navigation presentation | Loaded pages, script reachability and unchanged source |
| `src/routes/api/store-zero/`, `src/system/store/published-wire.ts` | Active published Store request translation, transport and correlation | Type/build, pinned-Store HTTP, refusal and public Chromium verification |
| `src/routes/index.tsx`, `src/routes/healthz.ts`, root/router/generated routes | Front-door redirect, liveness and route composition | Build and hosted navigation |
| Active `src/lib/`, browser-test `scripts/`, migrations and Vite/Nitro configuration | Build-connected auth/host services and verification; inherited preview, brand-asset and Grok PWA machinery retired | Production builds, five-project Chromium CI and relevant environment invariants |
| `package.json`, lock, Vite/TypeScript config, `Dockerfile.railway`, `startup.sh`, workflow, `vercel.json` | Dependency/runtime/build/deployment contracts | Locked install, baseline build/type/tests and Railway source read |
| `public/live/assets/`, Window Seat WebP files, embedded SVG/data imagery | Existing reference and working geometric representations | Loaded screenshots and byte-preservation check |
| `src/system/fixtures/definition-and-demand.json`, `review-summary.json` | Original Project 1 specimen custody | Historical fixture identity checks; not current prices |

The surviving current documentary authorities are [Definitions](docs/DEFINITIONS.md), [AGENTS](AGENTS.md) and the [shared commercial contract](docs/commercial-sequence-template.md). This master explains their actual current source relationship. The dictionary and governance documents are restored to their pre-cleanup bytes and await a separate approved consolidation decision.

### 16.2 Store Program and historical sources

The [completed Store master at cd08aff](https://github.com/GeorgePlattDemo/store-zero/blob/cd08aff624adf3b3a01ac0a42ea33681c5ba2bef/STORE-ZERO-MASTER.md) is the canonical deeper explanatory destination. Its chapters 3/8 explain the current boundary/examples; 5/6 manufacturing and machine functions; 7 the preserved Project 1 trail; 9 evidence; 10 commerce; 11 refusals; and 14 exact primary source identities. System does not duplicate those manufacturing chapters.

The executable interface was checked at f7123a73 in `src/contracts/definitions.mjs`, `src/requests/store-request.mjs`, accepted-packet/machine contracts, HTTP service and shared commercial gate. The same commit was used by real joint tests and the complete master example. Store documentary HEAD cd08aff and runtime pin f7123a73 remain distinct.

Program's current [README](https://github.com/GeorgePlattDemo/3d-solutions-program/blob/04ec327df39a54e92aae65ef4b07d10f2c8a8985/README.md), [supervised trial](https://github.com/GeorgePlattDemo/3d-solutions-program/blob/04ec327df39a54e92aae65ef4b07d10f2c8a8985/SUPERVISED-LABORATORY-CELL-TRIAL.md) and evidence at the same revision establish its investigation/validation scope. They do not change application definitions or Store capability. Issued patents and sealed Project 1 manuscripts/ZIP/publication identities remain in Store custody with their original hashes. No source publication or Git history is removed.

### 16.3 Dependency decisions and proposed retirement

The master preserves historical source/reconciliation facts while describing current ownership. The generic React UI and standalone Job 1 predecessor were retired after consumer checks; their source remains in Git. Further removals require dependency proof for public links, saved records, production assets and original evidence.

| Exact file or group | Current disposition and reason |
| --- | --- |
| Historical `public/live/stb-start-own-bench-leg-0.1.html` | Retired from current tree; retained in Git at System commit `6e3738219204dd2c3ffff0a57a06b5495042e1bb`; live Job 1 loads `three-frames.html` |
| `docs/verification/start-your-own.md` | Retained: Program README and EVIDENCE link its current path; dated independent observations remain available |
| `docs/commercial-sequence-template.md` | Retained unchanged: shared copy; Store is frozen and coordinated contract revision is separate |
| `system-build-current.html`, `system-build-front-door-0.5.html`, `system-build-base-8d8a9dd.html` | Retained: working nested shell, page composition and saved-state dependencies |
| `three-frames.html`, `stb-window-seat-0.9.html`, `stb-outdoor-picnic-0.4.html` | Retained: active project frames, definitions and controls |
| `stb-outdoor-reference-authority-0.3.html`, `STB-OUTDOOR-ANGLED-FRAME-RESEARCH-DOSSIER-0.1.html` | Retained: current Outdoor Rule Book links and dated source evidence |
| Platform files, runtime modules, images, executable contracts, test sources, fixtures and deployment files | Retained: working application, verification and operational obligations |
| `README.md`, `docs/DEFINITIONS.md`, `AGENTS.md` | Original content preserved except one README link to `SYSTEM-MASTER.md`; any shortening awaits separate review |

The objective remains one readable introduction, one complete System master and only genuinely necessary supporting files. Git history can preserve discarded explanatory revisions in the future, but deletion must follow an approved file-by-file dependency disposition.

### 16.4 Completion verification record

The full sixteen-chapter master is complete. Its contents reflect the actual headings and its examples and source register reflect the recorded baseline. The README, definitions, maintainer safeguards, executable application and pinned Store interface remain protected. Two short duplicate editorial notes were retired after their enduring rules were reconciled with this master. Further retirement requires a file-specific dependency review. Required CI must pass against the exact pinned Store checkout.
