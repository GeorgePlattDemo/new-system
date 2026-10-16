# Definitions

This file is the only place here that says what a shared word means.

The adopted definitions and specifications govern required behavior. Executable source, identified configuration and verified outputs establish what a particular revision actually implements. A disagreement is a conformance defect: preserve the requirement, identify the affected owner and evidence, and repair the implementation or obtain an explicit requirement decision. Neither a passing test nor existing code silently overrides the adopted contract. Documentation must distinguish adopted requirements, verified implementation, proposed capability and physical qualification.

The current Project 1 proof is maintained acceptance evidence, regenerated from the operative source and configuration when consequential behavior changes. Original sealed publications retain their source identities and historical results. Consequential changes must reconcile the affected definitions, specifications, masters, Program descriptions, current proof, tests, links and operational identities before completion. Preserve full technical content and distinguish modeled results, simulated commerce, commissioned execution and inspected output.

Store Zero answers the job. This page does not price, and it does not redefine a Store word.

Do not add a word just to make the page longer. Add one when two trades would otherwise use it differently, or when a record exposes it.

## Current application behavior

*Authority category: Current System Behavior*

**Automatic Bench pricing** — Each published Bench requests its current definition from the pinned Store when it opens and again when a price-relevant control changes. Its visible number is the Store's complete budgetary Q for that revision; no extra request or confirmation button is required to see it. Pending, refused, incomplete and unavailable answers retain their actual status. Confirmation and later commercial acts remain separate.

The five starting demo definitions are explicit. Outdoor starts with the Classic A-frame plan at 72 in, treated wood and coated hardware; its other plan remains selectable at Intent. Window Seat displays the same Store answer on Intent and the Bench, with its existing wood and spotting controls available on the Bench. Missing required facts in an edited or saved definition are not silently filled. Idea has a top NEXT → INTENT control, and Intent's forward controls read BRING IT TO THE BENCH →.

**Stock-aware System proposal** — System creates a visible, reproducible proposed part layout from the current pinned Store's offered material dimensions and the user's finished geometry. Minimize part count first and excess width second while retaining the user's defined dimensions. The proposal is part of the identified definition revision, not a Store price, a substitute SKU, or a machine command. Source nominal width and exact finished width are carried **per component**, not as one blanket board assumption. If a complete current Store offering lookup or a supportable layout is unavailable, the revision is not admitted to evaluation; System cannot invent stock or hide an operation.

**Bench shelf-edge finish** — Three user-selectable operations on an exactly 14-inch two-board shelf: (1) efficient default, 7¼ + 6¾ in, one free-edge ½-in removal; (2) balanced pieces, 7 + 7 in, one ¼-in removal per board; (3) all edges, 7 + 7 in, two **sequential** ⅛-in side removals per board, explicitly declared as `edgePreparation: {farEdgeRemovalIn:0.125, fenceEdgeRemovalIn:0.125}`. One surface is milled at a time. The Store alone checks its actual registered operation and includes each required longitudinal machining cycle, X return and actual one-time board load in modeled machine seconds and its own Q. A user can explicitly override the offered-size proposal, including a mixed nominal 1×10 plus 1×6 layout; unavailable, incompatible or unsupported definitions are refused rather than rewritten. Each material, finish, dimension or spotting change creates a new revision and demands a fresh current Store answer. Physical release remains blocked.

**One definitions authority** — This System page defines common words and design-to-Store handoff meanings. Program records why and Store implements its catalog, declared machine limits, evaluations, handling time and Q. Store's operational specification documents its actual evaluator and is not a second definitions authority. System, Store and Program must agree before presenting a job as answered; neither System nor Program contains a duplicate Store evaluator or economic fallback. This rule is enforced through the one pinned Store commit and the deployed Railway connection.

**Job-definition revision** — The identified record of this job's current requirements, values, derivations, unresolved facts and responsibilities. It is not the object sent to Store; that object is the Store inquiry.

**Store inquiry** — One attributable request to Store. A manufacturing inquiry contains exactly `requestType`, `requestId`, `demand` and the independently derived `manifest`; offering discovery carries no manufacturing manifest. The transmitted bytes are preserved. A changed definition requires a new evaluation.

**Admissible** — The facts required for the stated inquiry scope are present and the definition is representable in its declared shape. Admissibility does not establish supportability; capability and the manufacturing answer belong to Store.

**Evaluation receipt** — Store's frozen identity for one fresh evaluation: freshness rule `STB-STORE-FRESH-EVALUATION-0.1`, request type/ID, evaluation time, authority (Store release, catalog hash, manufacturing-model ID/hash and machine-configuration ID/hash), demand hash, manifest hash, status, calculation identity and receipt hash. System verifies its agreement with the requested definition and returned answer, including the expected Store release and a real UTC evaluation instant; it does not rebuild the receipt to make it pass. Hash identity establishes content consistency, not actor authentication or physical readiness.

**Payload digest** — SHA-256 of the exact request bytes. It is not a price and not a signature.

**Budgetary total (Q)** — The number the Store returned for a supportable job. Not a quote. A partial sum of supportable lines is not a full job Q. Discovery has no Q.

**Outdoor option preview** — Each alternative wood is evaluated as a separate complete manufacturing job. Each hardware alternative is evaluated with the currently selected wood. Displayed option amounts come only from the corresponding fresh Store answer. Alternatives never share stock allocation or part identities in one inquiry, and their preview answers never enter the commercial terms flow. The selected definition receives its own independent evaluation before proceeding.

Outdoor previews start when Intent opens. Outdoor sends one manufacturing inquiry at a time, with a selected job ahead of queued previews. A transport failure releases the queue for the next inquiry; it supplies no substitute price.

**Published release assets** — The manufacturing-core migration changes the versioned URLs for its live pages and scripts together. Returning browsers must load the current timing reader and commercial sequence; cached readers from a previous release do not describe the current Store response.

**Your call** — Reviewing the current Store answer for this revision and receipt. A fully evaluated supportable answer permits simulated acceptance, once per revision and receipt. Alcove may also show a complete scoped budgetary estimate with every unevaluated requirement disclosed; that review cannot create an offer, acceptance, payment, yard entry, production or pickup. An older acceptance stays in the file and does not become the state of a later refusal.

**Demo checkout** — Each of the five published projects explicitly enables the shared `stb-demo-commerce.js` source. It presents a simulated offer using the current complete Store manufacturing Q, USD, the Demo yard pickup path and versioned `STB-DEMO-TERMS` / `STB-DEMO-PICKUP` policy. The offer is valid for 24 hours; tax, delivery and additional services are outside its manufacturing-only scope. Accept & Pay records customer decision, seller order acceptance, simulated capture and queue entry as separate events in the shared commercial contract. Run the Yard Demo and pickup continue that same event stream through closeout. Every generated source record is marked SIMULATED; actual payment and physical authority stay false. This is an explicitly enabled prototype policy, not a fallback for absent commercial terms. The UI uses one short demo notice; receipts and technical evidence remain expandable. The final pickup receipt remains visible; the dev/rev guiderails stay visible. Job 1's former independent receipt generator is removed.

**Through-edge profile requirement** — A named feature on a finished part, stating its path length, position across the width and through depth. The cut-package inquiry carries these literal values in `parts[].edgeProfiles`. Store answers whether its parent-board preparation fulfills them; System does not substitute a different profile.

**Explicit spot constraints** — The required tool diameter and full-diameter depth, when the job states them. They travel with the named spot and its location. Store checks them against its registered operation; a placement is not a generic drilled-hole specification.

**Virtual evidence** — Identified local-job, operation records, replay and blocked-admission result returned by Store's machine-evidence entry point for a verified accepted packet and expected registered configuration. Current schema `STB-MODELED-OPERATIONS-1` has evidence class `PREDICTED_OCCUPANCY_ONLY`. Dimensional records carry nominal moves/tool states; sheet occupancy does not establish a complete XY controller trajectory. System preserves this evidence rather than inventing it.

**Physical admission** — Always blocked in this candidate. No physical command is issued. Supportable is not permission to cut.

## End identity

*Authority category: Current System Behavior*

End geometry is part of the priced manufacturing definition. `endRelation` states how the ends relate; `lengthDatum` states where length is measured; `cutPlane` distinguishes face miter from other cutting planes. The registered user-board class uses parallel face-miter ends measured on the long-long outer edge. Angled cut packages independently declare end relation, plane, measured datum and `endPointOrientation`. Parallel face miters measured long-point-to-short-point with explicit long-to-short orientation derive a stock envelope from finished length plus actual selected-stock width × tan(angle). Unknown facts remain unresolved; unregistered operations are refused. Actual-width stock envelopes govern packing, inventory capacity and saw travel. The model cannot change these meanings to obtain a price.

`endIdentity` is an additional endpoint statement. The public board translator records a supplied redundant value such as `both` under `REDUNDANT_WITH_PRICED_LENGTH_DATUM` and sends null when parallel/long-long already expresses it. A nonredundant value travels unchanged. The current Store board compiler requires `endIdentity == null`; incompatible geometry is refused as `END_GEOMETRY_NOT_DECLARED`. This is the current contract, rather than the retired `END_IDENTITY_NOT_REGISTERED_ON_MACHINE` narrative.

Square cuts and sheet edges retain their own defined geometry. Current Store machine evidence accepts board, cut-package and sheet-package classes; it does not return the retired board-only `LOWERING_NOT_REGISTERED_FOR` disposition. Coverage means modeled ledger binding and replay, not a universally implemented controller program. The typed System machine helper recognizes the same three registered manufacturing classes and preserves those evidence limits.

## Manufacturing terminology: source words versus physical requirements

*Authority category: Adopted engineering requirements; implementation status is recorded in the System master's conformance register*

### Governing interpretation contract

**Manufacturing meaning contract (`STB-MANUFACTURING-MEANING-1`)** — The adopted semantic requirements in this section. This is a specification identifier, not a claim that a new runtime schema, general plan reader or physical machine function is installed. The contract applies to every project entering the shared manufacturing chain, including projects beyond the five demonstrations.

**Source expression** — Original customer wording, plan text, drawing mark or imported field, retained with its source document identity, revision and page, figure or other locator when available. Preserve missing provenance explicitly. Source expressions may be informal, incomplete or wrong; their recognition does not establish a physical feature.

**Physical requirement** — The measurable result required on an identified component: geometry, location, orientation, dimensions, relevant tolerances, material properties and completion conditions. It expresses what must exist after manufacture without selecting a merchant stock item or a machine-specific command.

**Established geometry** — Geometry supported by explicit source measurements, an identified drawing construction or an adopted derivation rule. Record the inputs, units, references, rule and result. An illustrative image, familiar project name, recognized word or available machine does not independently establish a dimension or orientation.

**Normalized manufacturing requirement** — An identified, machine-neutral physical requirement expressed without dependence on a source author's vocabulary. Preserve its source expressions and derivation witnesses separately. Normalization cannot replace the required result with an easier feature or remove an inconvenient constraint.

**Interpretation witness** — Attributable evidence connecting a normalized requirement to source facts or an explicit customer decision. It states which facts were observed, derived, assumed under an adopted rule, contradicted or left unresolved. A boolean label such as `DEFINED` is not itself evidence.

**Interpretation status** — Whether the facts needed to define the particular feature are established. Missing critical dimensions, datums, bottom conditions or contradictory evidence remain `UNRESOLVED`. A fully defined feature may still be unsupported by Store. System admission, Store supportability, customer acceptance and physical authorization are separate determinations.

**Contradiction** — Two attributable statements that cannot both describe the same requirement under the declared references. Preserve both and identify the decision needed. Do not resolve disagreement solely by choosing the text, drawing or interpretation that the registered machine can perform.

**Declared standard operation** — An explicitly selected, identified operation whose registered parameters provide a stated nominal result. An omitted parameter can adopt that nominal only where the selected operation and applicable default rule are part of the definition and remain visible in the record. A generic source request for a hole does not select D-001's standard spot.

**Registered operation** — Store's versioned declaration of the function, tool geometry, material and dimensional envelope, coordinates, limits, preconditions, modeled work and refusal conditions. Recognizing a term does not register a function. An operation's name cannot replace its physical and contractual definition.

**Requirement conservation** — Every independently required component, feature, material condition and unresolved fact remains attributable through revision, translation, inquiry, answer, acceptance and lowering. Preserve parameter values as well as identifiers. An independent manifest must expose omitted work; it cannot be derived solely from the already translated payload and thereby reproduce its omissions.

### Drilling, holes and seating surfaces

**Drilled spot / shallow pointed-drill feature** — A bounded local feature made by a pointed drill, with a cylindrical portion and conical bottom under the adopted idealized geometry. State component, axis, entry face, part-relative position, diameter, full-diameter depth or selected standard-operation rule, and relevant tolerances. This describes a result; Store separately establishes whether its tooling and stock can produce it.

**Spot drilling** — A drilling operation used to establish an entry or location for subsequent work. Purpose does not define diameter, point geometry, depth or the subsequent operation. D-001's identifier `SPOT_ON_LOCATION` denotes only its explicitly bounded shallow pointed-drill function; it does not register every operation called spot drilling.

**Spotface / spotfacing** — A localized flat seating surface, commonly around a hole. Define its seating plane, position, diameter or boundary, depth and required surface condition. A conical drill-bottom depression does not satisfy a flat seating requirement. Neither customer wording nor a convenience alias can map a flat-bottom spotface to D-001's pointed-drill feature.

**Pilot hole** — A hole serving a subsequent drill or fastener. The purpose alone supplies no diameter, depth, exit condition, axis or material suitability. Establish those requirements from the applicable design or an explicit customer decision. Preserve an incompletely specified pilot as unresolved rather than substituting a standard shallow spot.

**Blind hole** — A hole that terminates within the component. Define entry face, axis, position, diameter, depth datum and bottom geometry. State whether depth measures the cylindrical full-diameter portion or the deepest tool-point penetration. A blind hole is not necessarily a flat-bottom hole.

**Through-hole** — A hole required to pass through the material under its stated thickness and orientation. Define entry, exit, diameter, axis, position and any breakout requirements. A blind or shallow feature cannot fulfill it. No through-hole capability follows from D-001's shallow-spot registration.

**Clearance hole** — A hole providing clearance for an identified mating element. State the required diameter, fit or tolerance, axis, location and through/blind condition. A fastener name alone does not establish these values.

**Counterbore** — A cylindrical recess with a seating bottom associated with a hole. State recess and hole diameters, depth, concentric relationship and bottom requirements. It is distinct from a conical countersink and from a pointed-drill spot.

**Countersink** — A conical recess associated with a hole. State included angle, major diameter or defined depth, axis and relationship to the hole and fastener seat. Drill-point angle alone does not establish countersinking capability or a compliant fastener seat.

**Drill-point included angle** — The angle between opposite generating lines of the idealized conical drill point. It is not the workpiece entry angle, countersink requirement or full-diameter penetration.

**Full-diameter penetration** — Depth from the entry surface to the deepest section at which the entire specified cylindrical diameter has been produced, measured along the declared hole axis. For the idealized pointed drill this excludes the additional conical point height.

**Total drill-tip plunge** — Travel from first tip contact at the entry surface to the deepest tip position. For diameter D, included point angle a and requested full-diameter depth d, point height is h = (D/2)/tan(a/2), and total plunge is d + h. Tool clearance and approach movement are separate travel segments.

**D-001 bounded spot** — The registered test tool has diameter 0.1875 inch and included point angle 118 degrees. The adopted maximum full-diameter penetration is 0.1875 inch beyond the conical point. At that maximum, point height is approximately 0.056330683 inch and total tip plunge approximately 0.243830683 inch. The adopted variable-depth contract is 0 < d <= 0.1875 inch. Each accepted feature's actual d must govern its Z target, travel, occupied time and calculation identity. The diameter remains fixed unless the registered configuration is explicitly changed. These are modeled parameters, not inspected machine performance. The Store specification and System conformance register identify the installed fixed-depth or variable-depth implementation; this definition does not claim that an unmerged implementation is operative.

**Selected spot location** — An identified position relative to a declared finished-part datum and entry face. A center rule such as X = L/2 is a derivation, not arbitrary location control. An explicitly selected X must survive translation unchanged. Across-width centering, a permitted inset and an arbitrary Y coordinate are different representations; expose only the representation actually supported. Store checks tool-radius clearance, registered travel, stock geometry and applicable control limits. It cannot move a requested feature to obtain supportability.

### Cut planes, end relationships and stock consumption

**Face miter** — In the adopted board convention, an angled end plane whose trace across the prepared broad face is oblique to a square crosscut, with no independent tilt through the board thickness. State the component faces, reference axes, angle convention and end relationship. The word miter alone cannot establish all of those facts.

**Bevel** — A sloped face or edge whose precise plane must be established relative to the component faces. For board end cuts, distinguish tilt through thickness from an angle across the broad face. Preserve the source word when a plan uses it loosely, but derive the operative plane from substantiated geometry. A true bevel remains distinct from a face miter.

**Compound angled cut** — A cut with independent angular components in the declared reference system, such as a face-miter angle combined with thickness tilt. Both components and their datums are required. A single scalar angle or a face-miter registration cannot silently represent compound geometry.

**Square crosscut** — A crosscut with a plane perpendicular to the declared length axis and the required faces. A missing angle is not a square-cut declaration. An explicitly adopted square-end convention may supply its stated references only within that convention's scope.

**Crosscut** — A cut across a board's declared length or grain direction. Specify the actual cut plane and result; a process name does not independently establish a finished length.

**Rip** — A longitudinal separating cut. Define retained width, reference edge, cut path, kerf, through condition and returned pieces. A through rip is distinct from a partial-depth groove and from edge surfacing.

**End relation** — The geometric relationship between the two finished end planes, including whether they are parallel or opposed under the declared board convention. State their orientations rather than inferring the relationship from a project name.

**Long point / short point** — The extreme intersections of an angled end with identified reference edges or faces. Name those edges or faces. A length stated as long-to-short, long-to-long or short-to-short is incomplete without that reference and end orientation.

**Finished dimension** — Required size of the completed component measured between its specified references. Preserve it when selecting or planning parent stock. A larger stock envelope is not a revised finished dimension.

**Stock envelope** — The parent-material extent needed to contain the defined finished geometry before separately accounted cut consumption and process allowances. Derive it from actual stock section, end planes and measurement references. For the registered parallel face-miter long-point-to-short-point convention, the longitudinal envelope is L + W*tan(theta). This formula is specific to that convention; it is not a universal angled-part formula.

**Axial kerf consumption** — Parent-length consumption attributable to a cut under the declared orientation. Keep blade-width kerf, its projected axial effect, reference cleanup and other allowances distinct. Count each physical cut and its retained side under the registered planning convention.

**Retained face** — The material face that remains after a cut and is used for subsequent geometry or reference. Identify the kept side and its transform. A nominal saw-plane event or a convenient coordinate reset does not prove the retained face was measured or registered physically.

### Routing, milling and edge preparation

**Routing / milling** — Material removal by a rotating cutter along a defined path. Establish the removed volume or required surface, entry and exit, section, depth, orientation, end conditions and relevant tolerances. The machine's cutter, pass strategy, feed and restraint are Store planning facts.

**Dado** — A channel or housing across the declared grain direction in ordinary woodworking usage. Define its actual cross-section, path, width, depth and open or stopped ends. The source name does not substitute for these facts or register a crosswise routing operation.

**Groove** — A channel commonly running with the grain in woodworking usage. Record the actual orientation, path, section, width, depth and end conditions because other trades use the word more broadly. A groove cannot be reduced to an edge profile unless the required removed geometry is identical.

**Rabbet / rebate** — An open-sided recess along an edge or end. Define the reference face and edge, shoulder, width, depth and path. Its L-shaped section is distinct from an enclosed channel or a through rip.

**Slot** — An elongated opening or recess. State width, depth or through condition, path, orientation and end shape. The word alone does not determine whether the feature is a groove, aperture or another operation.

**Edge preparation** — Removal from specified parent edges to establish required finished width or surfaces. Identify each edge, its removal amount, sequence-dependent references and required result. A two-edge requirement cannot be counted as one pass unless the registered operation actually produces both surfaces.

**Profile** — A defined section or boundary followed along a stated path. State the section, position, path length and depth/through condition. A source requesting rounding, a chamfer, a groove or a rabbet does not select the currently registered longitudinal through-edge profile merely by using the word profile.

**Pass / engagement / feed** — Respectively, one traversal removing its declared material; the cutter's actual radial and axial contact; and relative processing speed under specified units. Distinguish them from rapid positioning and spindle speed. Store must count the passes and returns needed for the complete required geometry under registered limits.

### Material, references and evidence

**Nominal and actual section** — Nominal size is a named commercial designation; actual section is the dimensional basis declared for the selected stock. System states required geometry and material; Store supplies offered actual dimensions. The familiar nominal-to-dressed relationship is not evidence for every material or offering.

**Material suitability requirement** — Required species or allowable alternatives, grade and governing rule, treatment, stock form, condition and intended service constraints. Availability and machinability do not establish structural adequacy, code compliance or suitability for an unstated use. Missing consequential material conditions remain explicit.

**Part reference and machine reference** — A part reference locates the customer's feature. A machine reference locates tooling or work under its registered coordinate system. Preserve the transformation and its sign, axis, units and datum assumptions; the machine origin cannot redefine the customer's feature position. The existing Datum and Origin entries also apply.

**Dimensional tolerance and measurement uncertainty** — Tolerance is the permitted variation in the requirement; measurement uncertainty concerns the evidence used to judge it. A numerical model's precision is neither a manufacturing tolerance nor proof of conformity. Preserve specified tolerances and any missing inspection method.

**Retention / restraint / holding allowance** — Retention keeps designated material connected, such as sheet tabs. Restraint controls material movement under process loads. A modeled holding delay or remaining-length screen does not establish physical restraint. Define tab geometry, kept pieces and later separation as requirements when applicable.

**Modeled, generated, executed and inspected** — A model predicts; a generator emits identified records; a controller executes admitted instructions; inspection establishes measured results under an identified method. Preserve these separate evidence states through every receipt, packet and account of the work.

### Interpretation and extensibility decisions

| Condition | Required System action | Required Store consequence |
| --- | --- | --- |
| Source word conflicts with independently established geometry | Preserve both, establish which evidence and explicit decision resolve the conflict, retain the derivation | Evaluate the resulting exact requirement; capability never decides the interpretation |
| Critical geometry or material fact missing | Retain an identified unresolved requirement and request the responsible decision | No complete Q for the incomplete job |
| Feature fully defined but operation unregistered | Preserve the exact physical result and all operands | Return an attributable unsupported-capability refusal |
| Source term unknown | Preserve it and its context; establish geometry independently if evidence permits | Do not silently discard it or substitute a familiar operation |
| Explicit value malformed, null or outside its required domain | Retain or reject the invalid requirement at its owning boundary | No coercion to zero, omission or fallback to a nominal value |
| New project uses existing representable features | Use the shared admission, manifest, translation and evaluation contracts | Use the same registered evaluator without project-name exceptions |
| New feature lacks representation or registration | Identify the missing contract or capability and its owner | Require an explicit versioned extension and evidence before claiming support |

These requirements govern future general plan ingestion as well as bounded structured definitions. They do not claim installed optical character recognition, drawing inference, general natural-language interpretation or universal support for arbitrary plans. A typed helper exercised only by contract tests cannot establish that the published customer path enforces the same requirement.

### Terminology references

These references support terminology distinctions; they do not certify this demonstration, its machine model or its proposed apparatus. DEWALT's [DWS779 instruction manual](https://www.dewalt.com/GLOBALBOM/QU/DWS779/20/Instruction_Manual/EN/N445793_DWS779.pdf) distinguishes miter, bevel and compound settings. Gühring's [RT 100 P tooling publication](https://www.guhring.co.jp/cms/wordpress/wp-content/plugins/guhring/pdf/catalog_115.pdf) distinguishes pointed and flat-bottom tooling results. Mitutoyo's [Quick Guide to Precision Measuring Instruments](https://www.mitutoyo.com/webfoo/wp-content/uploads/E11003-Quick-Guide.pdf) provides dimensional-metrology context. The geometric operands and refusal obligations above are this system's adopted requirements; external terminology never expands the registered Store capability.

## Shared terms

*Authority category: Current System Behavior*

General and capitalized domain terms describe their stated concepts. They do not assert that every named record type is implemented in the current application. Current serialization and behavior follow the specifically identified executable contracts and schemas.

**Trail** — The one six-step path every project follows: **Intent → The bench → The Store answers → Your call → We cut it → Pick up & build.** Idea comes before it, unnumbered. Declared in `public/live/stb-trail-contract.js` (`STB-TRAIL-CONTRACT-0.2`) and drawn by the shared tile host in `public/live/system-build-current.html`. This repository has no separate trail test.

**Admission profile** — Per tile and inquiry scope, the facts a job-definition revision must settle before a Store inquiry, each with its owner. Admission checks these declared requirements, never the rows a tile happened to emit, and never Store capability. Spec: [tile/host and definition/Store contract](../SYSTEM-MASTER.md#83-public-admission-and-responsibility) (`STB-DEFINITION-STORE-0.1`); used by all five public tiles before their Store inquiries.

**Tile-host message** — What a tile tells its host: tile id, interface version, current stage, usable steps, navigation request (`STB-TILE-HOST-0.1`, same spec). A usable step does not authorize a Store inquiry.

**Knob** — One setting needed to state or vary this job. Not a setting needed for the job to be accepted. Made at intent, for that job, auto or by hand, from the need. Turned on the bench. Never added there.

**Configurator** — The knobs made for one job at intent. A tool, not the program. There is no universal configurator.

**Shared Home** — The project library page. It shows no step buttons; the six steps appear only inside a live project.

**Tile** — One project on the Shared Home. Each tile tests a different way a job arrives: one board, a published plan, an exact fit, a whole assembly, a different material.

**Three doors** — New user, Returning user and Professional (the landing page of `public/live/system-build-base-8d8a9dd.html`). Different openings, same Shared Home, same rules.

**User 1** — The one demonstration account. Not real authentication.

**Library project** — A mapped project as published. **Opening ≠ owning:** a library project opens read-only; *Make changes* creates a working copy and *Save* puts it in My Projects. The published library project stays unchanged.

**Dev guide** — The right-hand rail: short developer notes, rules and admitted gaps for reviewers. Not customer copy.

**Store request type** — The kind of question System asks the Store. The names are `OFFERING_LOOKUP`, `BOARD_SQUARE_V1`, `USER_DEFINED_BOARD_V1`, `ALCOVE_INSERT_V1`, `CUT_PACKAGE_V1`, and `SHEET_PACKAGE_V1`. `BOARD_SQUARE_V1` and `ALCOVE_INSERT_V1` are retired names. The Store refuses them. They are not library jobs. The accepted types are `USER_DEFINED_BOARD_V1`, `CUT_PACKAGE_V1`, `SHEET_PACKAGE_V1`, and `OFFERING_LOOKUP`.

**Store answer status** — Current whole-job dispositions include `SUPPORTABLE`, `REFUSED` and `UNRESOLVED`; unknown request types are refused at Store admission. System transport unavailability is a separate condition and supplies no Store answer. A complete manufacturing Q requires the whole admitted job to be supportable. Preserve the actual returned status and reason; do not reinterpret a favorable subset as completion.

**Cut-package line status** — Historical evaluators returned line-level statuses including `NOT_ALL_LINES_SUPPORTABLE`. Current cut packages feed the one whole-job manufacturing engine, which either supplies complete evaluated coverage and Q or reports its actual refusal/unresolved result. A parent/package contribution is not an independent full-job quote.

**Q** — Store's complete budgetary manufacturing total: material + sourced hardware + modeled hourly service + separately billed panel-saw cuts. Hourly service uses the evaluated ledger's hourly-billed seconds and Store sell rate; per-cut panel occupancy is excluded from hourly billing. Whole-job service and Q round at their defined boundaries. Browser estimates, placeholders and partial line sums cannot replace the complete Store result.

**Retained control** — A declared material/control limit. Current D-001 planning requires at least 24 inches remaining after the final part and nominal kerf consumption. Parent patterns enforce this capacity; specific cycle checks can return `RETAINED_CONTROL_LENGTH_TOO_SHORT`. The historical `LAST_REMAIN_BELOW_TWO_ROLLER_CONTROL` label remains dated evidence. Retained length does not establish both rollers' contact, restraint or traction at every indexed position; the current model preserves those physical gaps.

**Datum A / B / C** — D-001 references. A: the fixed fence (`Y = 0`). B: the fixed table (`Z = 0`). C: the workpiece's own lengthwise origin, set per loaded board by a declared reference event such as a cleanup cut.

**Calculation identity** — The input hash and result hash of one Store evaluation. The same governing inputs must return the same identity; a mismatch fails closed as `STORE_CALCULATION_DIVERGENCE`.

**Fresh evaluation** — Every formal Store request is evaluated again against current Store state. An earlier answer is history, not a current answer.

**Store pin** — The exact Store commit the app calls. Its owner is `STORE_CANDIDATE.inspectedCommit` in [`src/system/store-candidate.ts`](../src/system/store-candidate.ts); the published runtime pin, the CI Store checkout and `startup.sh` name the same commit and move with it (see [AGENTS.md](../AGENTS.md)).

**Stages 1–4** — Store/cell evidence levels: one board; Store Zero and the D-001 reference cell; a physical cell; an evidence-informed system. Store owns these levels.

**Stub** — The part of the Store's board left after the parts are cut. It goes back to the customer with the parts.

**Review record** — `DefinitionReviewRecorded` (the person confirmed this exact definition) and `UnresolvedDefinitionAcknowledged` (the person acknowledged what is still unresolved). Neither is purchase, payment, reservation or production authority.

**Completion roles** — `CUSTOMER`, `CELL_STEWARD`, `OPERATOR`. Each role may take only its listed completion actions; an operator may stop work or report a condition, not promote completion.

**Completion records** — `CompletionPlanRecorded`, `CompletionDecisionRecorded`, `ProjectCloseoutRecorded`.

**Completion plan status** — `BLOCKED`, `NEEDS_CUSTOMER_DECISION`, `NEEDS_STEWARD_DECISION`, `SECONDARY_WORK_PENDING`, `READY_FOR_HANDOFF`, `CLOSED`.

**Secondary work option** — Who finishes work the machine does not: `YARD_SECONDARY`, `CUSTOMER_COMPLETES`, `THIRD_PARTY_COMPLETES`.

**Owner archive** — An exported project record preserving its identified definition, revisions, requests, answers and subsequent records. Schema and reopening behavior belong to the producing surface: `stb-owner-archive` / `.stb.json` is not a universal schema for every current project. See [record custody](../SYSTEM-MASTER.md#111-what-an-owner-record-preserves).

**Simulated** — Shown in the app but not performed: offer, acceptance, payment, the yard queue and the cut. Always labelled.

**Project** — May mean an ordinary human undertaking or a governed `ProjectInstance`. Use the more precise meaning when it matters.

**Definition** — May mean a plain-language description, product definition, data definition, or resolved requirement. State what is being defined.

**Project definition** — Plain-language umbrella for the information describing what is wanted and what it must satisfy. Not a new canonical object.

**Model** — May mean a 3D model, data model, mathematical model, simulation model, machine model, or language model.

**Stock** — Raw material, merchandise, supplier inventory or a particular physical piece. State the location or supply channel and whether the record describes an offering, on-hand inventory, allocation or an identified parent.

**Available** — May mean on hand, obtainable, unreserved, machine-capable or ready. State the relevant source, status and scope, including local, supplier, special-order or reserved status; commercial availability alone does not establish machine readiness or authority.

**Hardwood** — Botanical/commercial grouping associated with angiosperm wood. It is not a species identity or a guarantee of physical hardness.

**Grade** — Classification under a named grading rule or commercial system. The governing system must be identified.

**Scan** — A capture method, including spatial capture. Capture does not automatically establish a verified measurement or fabrication definition. Scan-to-Build does not require a laser scan: attributed manual measurements, drawings, laser instruments, 3D capture and other source evidence can define the job.

**Measurement** — A value obtained by a stated measurement process. Its method, reference and applicable uncertainty matter; numerical precision alone does not establish exact truth.

**Verified** — Established through an applicable verification act. Not synonymous with plausible, repeated, high-confidence, or machine-readable.

**Datum** — An engineering reference defined under the applicable dimensioning and tolerancing system. A convenient zero, stop or edge is not automatically a datum; its role must be declared.

**Fixture** — May mean physical manufacturing workholding or controlled software test data. Qualify when necessary.

**Program** — May mean software, machine instructions, an institutional program, or a project initiative.

**Mode** — May mean machine operating mode, process choice, software state, or other unrelated conditions. Qualify it.

**State** — An identified condition in software, machine operation, inventory, lifecycle, commerce or knowledge. Qualify the domain and whether the condition is declared, derived or observed.

**Capability** — Declared ability to perform specified operations within a stated envelope and limits. It is distinct from availability, readiness, customer acceptance and authorization.

**Release** — May mean software release, material release, packet release, operator release, or permission for another act.

**Authorization** — Permission from a defined actor for a defined act and scope. Validation, authentication, eligibility and readiness do not alone supply that permission.

**Execution** — May mean running software, running a simulation, or performing physical work.

**Production** — May mean deployed software or actual physical manufacture. Never leave the meaning ambiguous near machine control.

**Build** — May mean software build, machine construction, fabrication, assembly, or installation.

**Need** — Something a person wants changed, supplied, repaired, made, learned, or resolved. It does not require a known product.

**Idea** — Defined once, in [The trail](../SYSTEM-MASTER.md#21-one-intake-and-six-trail-steps): the unnumbered workspace before the steps.

**Interest** — Something a person cares about before a specific project is necessarily formed.

**Intent** — Defined once, in [The trail](../SYSTEM-MASTER.md#21-one-intake-and-six-trail-steps): step 1, where this job's scope and permissible controls are established.

**Requirement** — Condition that must be satisfied for the applicable result.

**Constraint** — Condition that limits possible solutions.

**Preference** — Desired condition that is not automatically mandatory.

**Selection** — Choice deliberately made by the person or actor entitled to make it. Selection is not verification.

**Confirmation** — Explicit acknowledgment of information or a choice. Confirmation does not automatically establish physical truth.

**Dimension** — Measurable extent such as width, height, depth, thickness, diameter, angle, or position. Consequential dimensions require units.

**Nominal size** — Conventional product designation that may differ from physical dimensions. A nominal 2×4 is the familiar example.

**Actual size** — Physical dimension of the relevant material or object.

**Usable dimension** — Portion of an actual dimension available for the intended use after relevant limitations are considered.

**Clear dimension** — Unobstructed usable distance between identified boundaries.

**Fit** — Whether geometry can occupy or engage the intended space within applicable constraints and allowances. Fit does not establish structural adequacy.

**Allowance** — Intentional amount reserved for a named purpose such as fit, scribing, trimming, movement, or finishing.

**Tolerance** — Permitted variation from a requirement.

**Accuracy** — Closeness to the applicable reference or accepted value.

**Precision / repeatability** — Closeness of repeated results to one another. Precision is not accuracy.

**Uncertainty** — Doubt associated with a measurement result. Not the same thing as a generic confidence score.

**Capture** — Acquisition of project or site evidence using an identified method.

**Laser measurement** — Measurement using a laser-based instrument. The instrument alone does not establish authority or verification.

**Tape measurement** — Measurement using a tape or rule. A legitimate capture method when properly recorded.

**Drawing** — Graphic or digital representation whose role must be identified: design intent, existing condition, shop information, extracted measurement, or another purpose.

**Site condition** — Physical condition at the place where the project must fit, function, attach, or be installed.

**Unresolved** — Required information or determination remains unknown, unverified, disputed, stale, unavailable, or otherwise incomplete.

**Defer** — Stop the present decision because something required is not yet sufficient.

**Refuse** — Explicit negative result because the request exceeds an applicable rule, material, capability, authority, or safety boundary.

**Wood** — Material derived from woody plants. Does not by itself establish species, grade, moisture, properties, or suitability.

**Softwood** — Wood generally associated with gymnosperms/conifers. Not necessarily physically soft.

**Hardwood tree** — Legitimate broad description of a tree in the hardwood grouping. Insufficient as exact material identity.

**Species** — Botanical or accepted commercial species identity established by an appropriate source.

**Species group** — Commercial grouping containing more than one species.

**Pine** — Common or commercial grouping that may refer to multiple species. Do not automatically treat it as one exact species.

**MaterialClass** — Governed material identity describing what the material is, independent of a merchant SKU or a particular physical stock identity.

**MaterialSpec** — Governed material requirement for the intended use and form. It is not a merchant SKU or a physical stock identity.

**Form** — Physical commercial/manufacturing form such as dimensional lumber, board, sheet, panel, or hardware.

**Lumber** — Sawn wood product. Additional information is normally needed to establish usable identity.

**Dimensional lumber / dimension lumber** — Industry term associated with particular lumber size categories. Not every rectangular piece of wood is formally dimension lumber.

**Board** — Individual elongated piece of lumber. Says nothing by itself about species, grade, dimensions, condition, or availability.

**Sheet / panel** — Broad sheet-form category. Does not identify plywood, MDF, particleboard, OSB, grade, thickness, or emissions status.

**Rough** — Lumber not surfaced to final smooth/uniform dimensions.

**Surfaced / dressed** — Lumber machined for improved surface and dimensional uniformity.

**S2S** — Surfaced on two sides.

**S4S** — Surfaced on four sides.

**Moisture content** — Amount of water present in wood under the applicable measurement convention.

**Grain** — Direction and arrangement of wood fibers. Not a substitute for species, grade, strength, or appearance requirements.

**Characteristic / defect** — Observable feature whose significance depends on the material rule and intended application.

**Warp** — Departure from intended board geometry, including bow, crook, cup, and twist.

**Board foot (`bf`)** — Volume measure equal to 144 cubic inches.

**Linear foot (`lf`)** — Length measure only.

**Each (`ea`)** — Count of individual items or pieces.

**Yield** — Useful required output obtainable from stated input material under stated assumptions and process.

**Offcut / remnant** — Material remaining after processing that may retain useful value.

**Waste / scrap** — Material not retained for the intended useful path.

**Stock material** — Input material from which a part or component is produced.

**Workpiece** — Material currently being worked on or positioned for manufacturing.

**Part** — Defined manufactured item with requirements attributable to it.

**Component** — Part or supplied item participating in a larger assembly or deliverable.

**Feature** — Defined characteristic such as a face, edge, hole, slot, or profile.

**Product definition** — Engineering information describing what the required part or product must be.

**Process** — Organized manufacturing activity used to transform or handle material.

**Operation** — Bounded manufacturing action such as crosscut, bore, trim, rout, or spot.

**Process plan** — Store's identified choice of stock, resources and ordered manufacturing work for the complete customer definition. Current `operations` are the same occupancy ledger used for time and Q. The verified plan is the input to accepted-job lowering, not an invitation for a second planner to reconstruct or replace it.

**Sequence** — Ordered arrangement of operations or events.

**Station** — An identified tooling location or function in a machine/cell, with registered coordinates, tools, permissible actions and references. Its geometry is a configuration fact established before routine customer orders, not a coordinate invented by the job exporter.

**Machine** — Physical equipment performing or supporting manufacturing operations.

**Cell** — Bounded arrangement of machines, stations, tooling, handling, control, and human functions.

**Machine family** — Functional grouping of machines. Does not prescribe one particular design.

**Machine Capability Level (MCL)** — Retired planning label (MCL-1 to MCL-4). Use Stages 1–4 instead (see *Stages 1–4* above). Not an industrial standard or runtime machine state.

**Capability envelope** — Declared operations, materials, dimensions, tolerances, prerequisites, and refusals for a capability.

**MachineEnvelope** — Governed versioned representation of machine limits and allowed/refused operations. Not proof of production readiness.

**Readiness** — Present ability to perform work given current material, tooling, machine, operator, and safety conditions.

**Tool / tooling** — Physical cutter, drill, saw blade, or other manufacturing tool required for an operation.

**Workholding** — Means of locating, supporting, restraining, or clamping the workpiece.

**Physical fixture** — Manufacturing device used to locate, guide, support, or hold a workpiece or tool.

**Setup** — Required arrangement of machine, tooling, workholding, material, and configuration before work.

**Machine reference** — Fixed machine-side geometric reference.

**Origin** — Defined zero point of a coordinate system. Not automatically a formal datum.

**Origin face / establishing feature** — Physical feature used to establish a working reference for subsequent operations.

**Coordinate system** — Defined origin, axes, and directions used to express locations.

**Site coordinates** — Coordinates associated with the physical project site.

**Part / workpiece coordinates** — Coordinates associated with the part or workpiece.

**Machine coordinates** — Coordinates associated with the physical machine.

**Transform / mapping** — Defined relationship between coordinate systems.

**Kerf** — Material removed by a saw cut.

**Kept face** — Finished face intended to remain after cutting.

**Indexing move** — Motion used to reposition a workpiece or tool for another operation.

**Feed** — Controlled motion associated with performing a manufacturing operation.

**Controller** — Hardware/software responsible for executing machine-control logic.

**Machine program / cell program** — Controller-runtime representation produced from a verified accepted job and registered mappings. Distinct from the current `PREDICTED_OCCUPANCY_ONLY` ledger and from generated but uncompiled Structured Text. The original Project 1 controller-oriented reference is historical evidence; physical execution remains blocked.

**Numerical control (NC) / computer numerical control (CNC)** — Machine control using programmed numerical instructions.

**G-code** — Common CNC programming representation. Not a generic synonym for WorkPacket, process plan, or machine-readable instructions.

**Postprocessor / lowering** — Binding or transformation of an accepted, verified manufacturing plan under a registered machine configuration. Current Store lowering binds the exact accepted occupancy ledger into local-job and modeled-operation records. A future controller-oriented export extends this layer with registered axis/tool/datum mappings; it cannot change System geometry, select new stock, silently omit operations or recalculate Q.

**Operator release** — Human act making an applicable machine/program step available within the defined operating process.

**Cycle start** — Local act initiating an allowed machine cycle.

**Interlock** — Control condition restricting operation unless required conditions are satisfied.

**Emergency stop (E-stop)** — Safety function for stopping hazardous operation.

**Calibration** — Established relationship between an indicated value and a reference under stated conditions.

**Machine cycle time** — Time associated with a defined machine-cycle boundary.

**Cycle-time estimate** — Calculated expected cycle duration. Not price, quote, reservation, or measured actual time.

**Actual** — Observed result from an actual event or measurement, distinct from estimated or simulated values.

**Fail closed** — Do not proceed to the protected action when required information or authority is missing, invalid, stale, contradictory, or unknown.

**Manual mode / automatic mode** — Explicit local machine operating conditions with different control assumptions. Manual mode does not imply that automated axes are physically hand-powered, and automatic mode does not imply network dependence.

**POSITION_VALID** — Machine-local condition that the workpiece reference required for an applicable commanded motion has been established and remains valid under the declared machine conditions. It is not readiness, authorization, or proof of part conformance.

**Data** — Represented information. Structured data is not automatically established fact.

**Record** — Stored representation of a defined declaration, observation, event, decision, state, or result.

**Object** — Defined conceptual or software entity. A conceptual object is not automatically an active runtime object.

**Type** — Defined category or data shape with stated semantics.

**Class** — May mean a software construct or a domain category. Qualify when needed.

**Instance** — Particular realization of a type or class.

**Field** — Named data element in a structured representation.

**Schema** — Machine-readable description of permitted data structure. Schema validity does not prove physical truth.

**Validation** — Check against defined structural or rule requirements. Not automatically verification or authorization.

**Verification** — Establishment through the required method and authority that a defined claim satisfies its verification requirement.

**Interface** — Defined boundary through which components or actors exchange information.

**Port** — Named architectural boundary for a defined interaction. Not necessarily a network socket.

**Application programming interface (API)** — Programmatic interface. Does not necessarily mean HTTP.

**Endpoint / route** — Addressable API operation.

**Adapter** — Boundary component translating between external and internal representations without becoming the source of domain authority.

**Service** — A bounded manufacturing or yard operation, or a software component exposing an interface. Qualify the meaning: a software service is not itself evidence that physical work has been performed. Prefer the specific manufacturing service name.

**Module** — Cohesive software or domain unit with a defined responsibility.

**Package** — Versioned or repository-local software unit.

**Dependency** — Component, package, contract, or resource required by another component.

**Event** — Recorded occurrence that happened and may explain or produce a state change.

**Command** — Request to perform an act or change state. A command does not prove that the act is authorized or succeeded.

**Query** — Request for information.

**Runtime** — Software while executing or the environment in which it executes.

**Software build** — Process of producing/checking executable or distributable software from source.

**Compile** — Derive an identified representation from source requirements under declared rules. System compilation establishes customer meaning, geometry, features and the independent manifest; Store conversion normalizes those facts into its internal neutral job; Store planning generates the admitted stock/operation ledger; accepted-job lowering binds that ledger to registered machine facts. These are stages in one authority chain. A controller-oriented export is a further mapping stage, not a second project compiler, manufacturing planner or price engine.

**Deploy** — Place/configure software into an environment where it can operate.

**Environment** — Context such as fixture, test, simulation, development, or production.

**Simulation** — Representation of behavior without claiming the corresponding physical production event occurred.

**Software fixture / test fixture** — Controlled test data and context used to reproduce behavior.

**Mock** — Simplified substitute for a real component used for testing.

**Deterministic** — Same defined inputs, rules, and versions produce the same defined result.

**Idempotent** — Repeating an applicable operation has the same intended effect as performing it once.

**Immutable** — Not altered after the applicable release/freeze point; correction requires another version or identity.

**Append-only** — Consequential history is added rather than silently rewritten.

**Version** — Identified revision of a contract, rule, record, packet, envelope, or software artifact.

**Semantic Versioning (SemVer)** — `major.minor.patch` version convention with declared compatibility meaning.

**Git commit** — Recorded repository snapshot with history and metadata.

**Branch** — Named line/reference of Git development.

**Merge** — Combination of Git histories or changes. Not automatically architectural approval.

**Canonical** — Designated representation that controls when multiple representations exist.

**Normative** — Content that imposes requirements within its stated scope.

**Informative** — Explanatory or contextual content that does not itself impose implementation requirements.

**Conformance** — Demonstrated satisfaction of a specifically identified specification, fixture, milestone, or test set.

**Provenance** — Information describing where something came from and how it was produced or changed.

**Hash** — Deterministic digest used to identify content or detect changes. Not proof of authorship.

**Digital signature** — Cryptographic mechanism for authenticity/integrity under an applicable key and trust model.

**Authentication** — Establishing identity.

**Eligibility** — Determination that prerequisites for a possible next act are satisfied. Not authorization.

**Authority** — Right or responsibility to make a particular decision, declaration, refusal, verification, or authorization within stated scope.

**Issuer** — Actor or component entitled to create a particular authoritative record.

**Replay** — Re-evaluation or execution of a preserved representation in a stated context. Current virtual replay validates the bound ordered ledger, nominal positions, tool states and durations. Replaying a request obtains a fresh evaluation; it does not renew an old receipt or establish physical execution.

**DeclaredRecord** — Preserves a person's declared interest or intent without replacing it with system interpretation.

**ClassHypothesis** — Proposed classification of a project. It does not replace the declaration.

**ProjectInstance** — Governed project record binding the applicable project information and lifecycle.

**Observation** — Measured or document-derived result with provenance and status. Not automatically verified.

**ObservationSet** — Structured output from a capture method containing observations, coverage, unresolved conditions, and status.

**OfferingRecord** — Merchant/location/channel representation of an offered material or product.

**InventoryAssertion** — Time-bounded statement about quantity or availability.

**CapabilityCard** — Holder-declared capability, limits, prerequisites, and refusals. Not availability, quotation, or execution authorization.

**GateResult** — Structured result of a named rule evaluation: pass, fail, unresolved, or inapplicable.

**RefusalRecord** — Preserved structured refusal and its basis.

**WorkPacket** — General versioned make-path description of governed work. Current accepted-job serialization is `STB-ACCEPTED-JOB-PACKET-2`, retaining exact demand, independent manifest, Store answer/receipt and simulated accepted decision. The general term neither replaces that contract nor authorizes machine motion.

**SimulationAuthorization** — Authorization for the specified simulation context only.

**ProductionExecutionAuthorization** — Governed production authority concept. Its v0.2.x reference is historical terminology; the current Store evidence contract always returns physical admission BLOCKED and grants no production authority.

**SimulatedExecutionEvent** — Record that simulated execution occurred. Does not establish physical fabrication or production readiness.

**ResolutionRecord** — Record of how the inquiry or project resolved.

**OutcomeRecord** — Preserved result including what changed and what remains unresolved.

**Scan-to-Build** — Governed path intended to let a sufficiently resolved requirement reach relevant material and bounded productive capability, receive an honest result or refusal, and preserve the consequential record.

**Demand as Architecture** — Proposition that incomplete human or commercial demand can become an earlier system input before it has necessarily become a SKU, RFQ, or fully specified order.

**Callable** — Described and exposed sufficiently that another actor or system can ask a meaningful bounded question and receive an attributable answer.

**Data before atoms / information before atoms** — Resolve consequential information before unnecessarily moving or transforming physical material.

**Smallest useful increment** — Add only the information, process, or machine capability needed beyond what the existing yard already provides.

**Refusal is an outcome** — Correct refusal demonstrates successful system behavior when the request lies outside an applicable boundary.

**No silent promotion** — A weaker information state does not become a stronger one merely because continuation would be convenient.

**Owner declaration remains owner declaration** — System interpretation may structure or classify a person's words but does not rewrite them as though the interpretation were the original declaration.

**Capability is not authority** — Ability to perform work does not confer permission to perform it.

**Machine does not infer the project** — Physical execution receives sufficiently resolved instructions; it does not decide what the person meant.

**Store does not rewrite the job definition** — Store facts and Store convenience do not create or modify the canonical shared operational meaning owned by System.

**NO BLOOD ON WOOD** — Safety authority and refusal boundaries take precedence over convenience, throughput, demonstration success, or software completion.

**A saved answer ≠ a current answer** — a saved Store answer is history, not current authority.

## Store terms

*Authority category: Current System Behavior*

These are Store-owned. A change in a yard word does not rewrite a job.

**Product** — Commercially recognizable good or service. A need does not have to begin as a product.

**Catalog item** — General product identity represented in a catalog. Not automatically a particular merchant's offering.

**Stock-keeping unit (SKU)** — Merchant- or channel-specific product identifier. Commercial identity, not material identity.

**Merchant** — Entity presenting an offering for commercial supply.

**Seller of record** — Accountable party to the applicable commercial transaction.

**Supplier** — Party supplying material or product into the commercial chain.

**Offering** — Material or product represented through a particular merchant, location, or channel under stated conditions.

**Inventory** — General commercial concept for goods held or represented for sale or use.

**Stock snapshot / InventoryAssertion** — Time-bounded assertion about quantity or availability associated with an offering.

**On hand** — Represented as physically present at the applicable location and time. Not necessarily reserved or usable for a particular job.

**Reserved / allocated** — Quantity deliberately held for a particular customer, order, project, or commitment.

**Special order** — Commercial route for obtaining an item outside ordinary local on-hand stock.

**Lead time** — Expected elapsed time before fulfillment under stated assumptions.

**Price observation** — Price reported or observed from a particular source and time. Not automatically a binding quote.

**Estimate** — Calculated or informed expectation. Not automatically binding.

**Quote** — Commercial offer under stated scope, price, validity, terms, and responsible seller.

**Reservation** — Commercial commitment holding specified stock or capacity. Not authorization to manufacture.

**Order** — Commercial instruction or commitment to supply defined goods or services.

**Substitution** — Replacement of one specified material or product with another under an applicable substitution rule.

**Equivalent** — Meets a defined equivalence criterion. Not merely similar.

**Lot** — Identified production or supply grouping when relevant to condition, certification, traceability, or confirmation.

**Tally** — Lumber quantity or measurement record under the applicable commercial practice.

**Pickup** — Fulfillment by transfer of goods at a designated location.

**Delivery** — Fulfillment by transporting goods to a designated destination.

**Fulfillment** — Completion of the applicable physical/commercial supply path. Not necessarily fabrication.

**Refusal boundary** — Condition under which a holder states that it will not accept or perform the requested work.

**Store Zero** — Deliberately fictional reference lumberyard used to make Store behavior testable and auditable.

**Store Zero fact** — Declared synthetic fact about Store Zero's assets, stock, supplier relationships, equipment, capability, or limitations.

**Fixture fact** — Controlled assumption used for testing. Not an observed industry fact.

**Store response** — Structured answer containing applicable Store facts, limitations, freshness, provenance, and unresolved conditions.

**Store evaluation** — Comparison of a bounded requirement against applicable Store facts.

**Fulfillment node / node** — Bounded yard/store environment capable of reporting relevant material, stock, fulfillment, and capability information.

**Store accept** — Store-side determination that its represented facts support the applicable next governed step. Not machine authorization.

**Store defer** — Store-side result indicating that required Store information or capability is insufficient at present.

**Store refusal** — Store-side result indicating that the request falls outside a declared Store boundary.

**Special-order route** — Store-represented path to material or goods not satisfied through the applicable local-stock path.

**Machine capability reference** — Store-visible declaration or reference to machine or cell capability conforming to governed `MachineEnvelope` semantics. A Store may declare a machine-specific envelope instance but does not redefine those semantics or infer new capability from observed success. Not machine readiness or authorization.

## Never equate

*Authority category: Current System Behavior*

**User declaration ≠ system interpretation**

**Declared ≠ observed**

**Observed ≠ verified**

**Measurement ≠ exact truth**

**Precision ≠ accuracy**

**Confidence ≠ verification**

**Nominal size ≠ actual size**

**Hardwood ≠ hard wood**

**Hardwood ≠ species**

**MaterialSpec ≠ SKU**

**Material availability ≠ machine capability**

**Capability ≠ readiness**

**Readiness ≠ authorization**

**WorkPacket ≠ machine program**

**Process plan ≠ G-code**

**G-code ≠ authority**

**Physical fixture ≠ software fixture**

**Machine reference ≠ automatically a formal datum**

**Machine homing ≠ workpiece reference establishment**

**POSITION_VALID ≠ readiness**

**POSITION_VALID ≠ authorization**

**Cycle-time estimate ≠ measured cycle time**

**Authentication ≠ authorization**

**Hash ≠ digital signature**

**Schema-valid ≠ physically true**

**Deterministic ≠ correct**

**Simulation ≠ production**

**Simulated execution ≠ physical fabrication**

**Git commit ≠ architectural approval**

**Defined ≠ activated**

**Narrative example ≠ fixture identity**

**Candidate definition ≠ WorkPacket**

**Store `SUPPORTABLE` ≠ fabrication authorization**

**Store evaluation ≠ commercial assent**

**`DefinitionReviewRecorded` ≠ purchase, payment, reservation or production authority**

**`UnresolvedDefinitionAcknowledged` ≠ support or resolution**

**Budgetary estimate / Q ≠ binding quote**

**Fixture stock ≠ live inventory**

**Current / applicable ≠ live / fresh**

**Idea contents ≠ controlling facts**

**Job-definition revision ≠ Store inquiry**

**Admissible ≠ supportable**

**Step ≠ page**

**Accept ≠ pay ≠ allocate ≠ release ≠ ready ≠ Cycle Start**

**Staged ≠ picked up**

**READY ≠ custody transfer**

**Network presence ≠ permission for Cycle Start**

**Catalog item ≠ offering**

**Offering ≠ stock**

**Stock ≠ reservation**

**On hand ≠ available for this project**

**Special-order listing ≠ confirmed supplier availability**

**Price observation ≠ quote**

**Estimate ≠ quote**

**Quote ≠ reservation**

**Board foot ≠ piece count**

**Store accept ≠ governed authorization**

**Fixture fact ≠ industry fact**

**A saved answer ≠ a current answer**

**Supportable ≠ machine-ready**

**Virtual evidence ≠ a cut**

**endIdentity omitted ≠ endIdentity deleted**

## Current integrated manufacturing proof

*Authority category: Current System Behavior*

**Current integration proof using Project 1 cases** — Regenerated end-to-end acceptance evidence for the current System/Store, covering customer derivation, independent manifest, fresh evaluation, original accepted decision, exact packet export, registered lowering and virtual replay. Both 16-inch and 18-inch SPF settings are exercised. Reference files bind current executable source; browser-run artifacts identify actual repository revisions and Store health. Consequential code, contract or specification changes reconcile the proof and all affected operative documents. Original sealed source publications retain provenance and cannot substitute for current proof.

**Exact accepted Store answer** — The unmodified answer retained by the published adapter as `storeAnswer`, distinct from display projections. `acceptedPacket()` exports it with the existing linked simulated customer decision, demand and manifest; it creates no replacement quote, stock selection or decision. Store independently verifies the packet before lowering.

## Future Work

*Authority category: Future Work*

**Capability-impact analysis** — Successor requirement to compare today's registered capability with a separately registered hypothetical configuration against complete identified demand, refusals and unresolved requirements. Added feasibility, time/Q and full capability/service cost remain attributable to each configuration. Machine-learning proposals grant no capability or release. Additional machines extend registration/mappings without rebuilding the definition compiler. This engine is not installed current behavior.

## Historical Evidence

*Authority category: Historical Evidence*

**Original Project 1 publication** — The sealed treated-lumber specimen, original controller-oriented sequence and publication hashes record their original revisions. They establish provenance and historical results, not current architectural authority. Current SPF acceptance evidence is generated and identified separately.
