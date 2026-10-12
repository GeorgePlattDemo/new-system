# Scan-to-Build System — Complete Application, Definition and Workflow Reference

3D Solutions LLC · 12 October 2026

**Define it once. Nobody downstream should have to redraw it.**

[Open the working application](https://system-candidate-production.up.railway.app/).

A replacement brace, shelves fitted to an alcove, a window-seat assembly, a picnic table from a published plan, or a plywood panel with an arched opening: the application gives each project a working definition. Bring the idea and its evidence, establish the requirements at **Intent**, then change their values on **the Bench**. The drawing, component list, feature locations and identified revision follow the same choices.

Each Bench asks an identified Store for a fresh answer automatically. Store selects its material and parent stock, evaluates the declared operations, and returns its own modeled time and budgetary total Q, or an attributable reason the work cannot proceed. System presents and preserves that answer. A changed dimension, wood selection or feature belongs to a new definition and requires another evaluation.

The customer can examine what was entered, what System derived, what reached Store and what came back. The same identities carry the job toward the customer's decision and the subsequent commercial and fulfillment records. Start Your Own includes an explicitly enabled simulated offer, Accept & Pay, yard queue and pickup demonstration. Other projects retain their own pending commercial requirements.

The engineering connection is reusable: the customer's resolved component requirements meet a registered Store and machine model. System establishes what the parts must become; Store determines the material and processing it can provide. Registered local machine engineering supplies the equipment-specific transformations. The deeper manufacturing explanation, issued-patent correspondence, full historical Project 1 trail, stock search, timing and economics belong in the [completed Store master](https://github.com/GeorgePlattDemo/store-zero/blob/cd08aff624adf3b3a01ac0a42ea33681c5ba2bef/STORE-ZERO-MASTER.md). Program owns the [research and supervised laboratory proposition](https://github.com/GeorgePlattDemo/3d-solutions-program).

This reference explains the complete System application and its handoff. The [shared definitions](docs/DEFINITIONS.md) specify common meaning; the executable contracts specify their bounded interfaces. Current machine evidence is modeled, commerce is simulated and physical release remains blocked. Those evidence states travel with the records.

> Incremental publication: this first save contains the opening, full chapter outline and completed chapters 1–2. Further coherent groups are appended to this same file on `main` before any retirement.

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
