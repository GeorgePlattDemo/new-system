# Scan-to-Build System — Complete Application, Definition and Workflow Reference

3D Solutions LLC · 12 October 2026

**Define it once. Nobody downstream should have to redraw it.**

[Open the working application](https://system-candidate-production.up.railway.app/).

A replacement brace, shelves fitted to an alcove, a window-seat assembly, a picnic table from a published plan, or a plywood panel with an arched opening: the application gives each project a working definition. Bring the idea and its evidence, establish the requirements at **Intent**, then change their values on **the Bench**. The drawing, component list, feature locations and identified revision follow the same choices.

Each Bench asks an identified Store for a fresh answer automatically. Store selects its material and parent stock, evaluates the declared operations, and returns its own modeled time and budgetary total Q, or an attributable reason the work cannot proceed. System presents and preserves that answer. A changed dimension, wood selection or feature belongs to a new definition and requires another evaluation.

The customer can examine what was entered, what System derived, what reached Store and what came back. The same identities carry the job toward the customer's decision and the subsequent commercial and fulfillment records. Start Your Own includes an explicitly enabled simulated offer, Accept & Pay, yard queue and pickup demonstration. Other projects retain their own pending commercial requirements.

The engineering connection is reusable: the customer's resolved component requirements meet a registered Store and machine model. System establishes what the parts must become; Store determines the material and processing it can provide. Registered local machine engineering supplies the equipment-specific transformations. The deeper manufacturing explanation, issued-patent correspondence, full historical Project 1 trail, stock search, timing and economics belong in the [completed Store master](https://github.com/GeorgePlattDemo/store-zero/blob/cd08aff624adf3b3a01ac0a42ea33681c5ba2bef/STORE-ZERO-MASTER.md). Program owns the [research and supervised laboratory proposition](https://github.com/GeorgePlattDemo/3d-solutions-program).

This reference explains the complete System application and its handoff. The [shared definitions](docs/DEFINITIONS.md) specify common meaning; the executable contracts specify their bounded interfaces. Current machine evidence is modeled, commerce is simulated and physical release remains blocked. Those evidence states travel with the records.

> Incremental publication: this save contains the opening, full chapter outline and completed chapters 1–7. Further coherent groups are appended to this same file on `main` before any retirement.

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
- [4. Alcove and critical fit](#4-alcove-and-critical-fit)
- [5. Window Seat and space utilization](#5-window-seat-and-space-utilization)
- [6. Outdoor and published plans](#6-outdoor-and-published-plans)
- [7. Playhouse and the sheet stream](#7-playhouse-and-the-sheet-stream)
- [8. System compilation and shared meaning](#8-system-compilation-and-shared-meaning)
- [9. The Store communication boundary](#9-the-store-communication-boundary)
- [10. Customer decision and commercial progression](#10-customer-decision-and-commercial-progression)
- [11. Records identity and custody](#11-records-identity-and-custody)
- [12. Refusals errors and unresolved work](#12-refusals-errors-and-unresolved-work)
- [13. Application architecture and deployment](#13-application-architecture-and-deployment)
- [14. Testing and verification](#14-testing-and-verification)
- [15. Discrepancies and repair boundaries](#15-discrepancies-and-repair-boundaries)
- [16. Source register and consolidation disposition](#16-source-register-and-consolidation-disposition)
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

Numbers, arrows, features, prices and manufacturing claims remain code/text-owned information. An illustrative raster image establishes neither fit nor processing capability. The former imagery brief's continuing rule is to use the existing references first, identify an actual missing asset before proposing a replacement, and preserve the same project through Idea and Intent. This consolidation supplies no new art, crops or layout.

## 3. Start Your Own

### 3.1 Source and entry

The first tile demonstrates the replacement of two damaged picnic-bench crossmembers. Its reference image circles the 2×4 being replaced. It opens on Intent, where the wood, two parts, angled ends and center-spot tool are already stated. Idea is accessible behind it. The visible forward action is BRING IT TO THE BENCH →.

The active child is `three-frames.html`, augmented by `system-build-current.html`. The separate `stb-start-own-bench-leg-0.1.html` is an earlier standalone surface; it is not the child loaded by the current shell. Current answering and Bench presentation are also supported by `stb-user-defined-board-runtime-bridge.js` and `stb-start-own-answer.mjs`. A historical-looking filename does not identify the active route; the actual frame and bridge do.

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
