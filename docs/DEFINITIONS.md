# Definitions

This file is the only place here that says what a shared word means.

If the code and this page disagree, that is a defect to fix on purpose. Neither one wins by being quieter.

Store Zero answers the job. This page does not price, and it does not redefine a Store word.

Do not add a word just to make the page longer. Add one when two trades would otherwise use it differently, or when a record exposes it.

## What this candidate adds

**Job-definition revision** — The identified record of this job's requirements, values, derivations and unresolved facts. It is not the object sent to the Store. What goes to the Store is the Store inquiry.

**Store inquiry** — One request: type, request id, and demand. The bytes are kept. A later edit does not reuse their answer.

**Admissible** — The facts this job's rule requires are present and the demand fits the declared shape. Admissible is not supportable. Supportable is the Store's answer.

**Evaluation receipt** — The Store's frozen record of one fresh evaluation: freshness rule `STB-STORE-FRESH-EVALUATION-0.1`, request type and id, evaluation time, authority (including the Store release and catalog hash), demand hash, status, calculation identity, and the hash of those fields. A receipt that contradicts the answer, names another release, or carries a time that is not a real UTC instant is not an answer. System checks that agreement. System does not rebuild the receipt to make it pass.

**Payload digest** — SHA-256 of the exact request bytes. It is not a price and not a signature.

**Budgetary total (Q)** — The number the Store returned for a supportable job. Not a quote. A partial sum of supportable lines is not a full job Q. Discovery has no Q.

**Your call** — Accepting the current supportable answer for this revision and this receipt. Simulated. One acceptance per revision and receipt. An older acceptance stays in the file and does not become the state of a later refusal.

**Virtual evidence** — What `POST /v1/machine-evidence` returns for an accepted packet against the advertised machine configuration. System does not invent the records. Physical authority on that answer is false.

**Physical admission** — Always blocked in this candidate. No physical command is issued. Supportable is not permission to cut.

## End identity

Three System facts can ride with a job. The Store does not price them. The reference cell may refuse them.

- **endRelation** — How the two ends relate. The reference cell registers `parallel` for a board.
- **lengthDatum** — Where the length is measured. The reference cell registers `long-long-outer-edge` for a board. That name already means the long point of the outer edge.
- **endIdentity** — A further name for which point the length reaches, only when the length datum does not already say it.

A face-miter board in this library does **not** send `endIdentity: "miter-face-long-point"`. That string is the same fact as `lengthDatum: "long-long-outer-edge"`. The reference cell has no registered mapping for a separate end-identity string, and it refuses any non-null `endIdentity` with `END_IDENTITY_NOT_REGISTERED_ON_MACHINE` before it will emit a command. Omitting the unregistered string is the reconciliation. Deleting the explanation, or stripping a string that was actually supplied, is not. If a packet carries a non-null end identity, this candidate sends it and shows the refusal.

Square cuts, plan ends and the sheet's factory edge keep their own end identity. Those jobs are not boards. The reference cell answers `LOWERING_NOT_REGISTERED_FOR` for their request type. Their identity is not removed to avoid that refusal, and a supportable price is not machine evidence.

## Shared terms


**Trail** — The one six-step path every project follows: **Intent → The bench → The Store answers → Your call → We cut it → Pick up & build.** Idea comes before it, unnumbered. Declared in `apps/stb/public-build/stb-trail-contract.js` (`STB-TRAIL-CONTRACT-0.2`); the rules are AGENTS.md "Trail rules"; enforced by the trail scoreboard test.

**Job-definition revision** — The identified record of this job's current requirements, values, derivations and unresolved responsibilities. It is not "the object sent to Store"; what goes to Store is the Store inquiry.

**Admissible** — Sufficiently defined and representable for the stated Store inquiry. Admissible is not supportable: whether the job is supportable is the Store's answer.

**Admission profile** — Per tile and inquiry scope, the facts a job-definition revision must settle before a Store inquiry, each with its owner. Admission checks these declared requirements, never the rows a tile happened to emit, and never Store capability. Spec: [tile/host and definition/Store contract](../application/TILE-HOST-ADMISSION-CONTRACT.md) (`STB-DEFINITION-STORE-0.1`); used by all five public tiles before their Store inquiries.

**Tile-host message** — What a tile tells its host: tile id, interface version, current stage, usable steps, navigation request (`STB-TILE-HOST-0.1`, same spec). A usable step does not authorize a Store inquiry.

**Knob** — One setting needed to state or vary this job. Not a setting needed for the job to be accepted. Made at intent, for that job, auto or by hand, from the need. Turned on the bench. Never added there.

**Configurator** — The knobs made for one job at intent. A tool, not the program. There is no universal configurator.

**Shared Home** — The project library page. It shows no step buttons; the six steps appear only inside a live project.

**Tile** — One project on the Shared Home. Each tile tests a different way a job arrives: one board, a published plan, an exact fit, a whole assembly, a different material.

**Three doors** — New user, Returning user and Professional (`ACTORS` in `apps/stb/shared/contracts.mjs`). Different openings, same Shared Home, same rules.

**User 1** — The one demonstration account. Not real authentication.

**Library project** — A mapped project as published. **Opening ≠ owning:** a library project opens read-only; *Make changes* creates a working copy and *Save* puts it in My Projects. The published library project stays unchanged.

**Dev guide** — The right-hand rail: short developer notes, rules and admitted gaps for reviewers. Not customer copy.

**Store request type** — The kind of question System asks the Store. The names are `OFFERING_LOOKUP`, `BOARD_SQUARE_V1`, `USER_DEFINED_BOARD_V1`, `ALCOVE_INSERT_V1`, `CUT_PACKAGE_V1`, and `SHEET_PACKAGE_V1`. `BOARD_SQUARE_V1` and `ALCOVE_INSERT_V1` are retired names. The Store refuses them. They are not library jobs. The accepted types are `USER_DEFINED_BOARD_V1`, `CUT_PACKAGE_V1`, `SHEET_PACKAGE_V1`, and `OFFERING_LOOKUP`.

**Store answer status** — `STORE_JOB_STATUSES`:

**Cut-package line status** — `SUPPORTABLE`, `NOT_ALL_LINES_SUPPORTABLE`, `UNRESOLVED`. Each line of a cut package is answered on its own.

**Q** — The Store's budgetary total: `Q = Σ stock/sourced selling price + machine service price`, where machine service price = modeled machine hours × the Store's declared machine sell rate. No per-cut fees, placeholders or browser estimates may stand in. Missing input → no complete Q.

**Retained control** — The length of board the two rollers must still hold through the last cut: 24 in on D-001 (the roller spacing). A board that would leave less is refused for that job (`LAST_REMAIN_BELOW_TWO_ROLLER_CONTROL`), and the Store moves to the next longer board.

**Datum A / B / C** — D-001 references. A: the fixed fence (`Y = 0`). B: the fixed table (`Z = 0`). C: the workpiece's own lengthwise origin, set per loaded board by a declared reference event such as a cleanup cut.

**Calculation identity** — The input hash and result hash of one Store evaluation. The same governing inputs must return the same identity; a mismatch fails closed as `STORE_CALCULATION_DIVERGENCE`.

**Fresh evaluation** — Every formal Store request is evaluated again against current Store state. An earlier answer is history, not a current answer.

**Store pin** — The exact Store commit the app calls. Its current operational owner is `STORE_PIN` in [`apps/stb/shared/contracts.mjs`](../../apps/stb/shared/contracts.mjs). Changing it is a deliberate, separate act (see the protected path in [AGENTS.md](../../AGENTS.md)).

**Stages 1–4** — Store/cell evidence levels: one board; Store Zero and the D-001 reference cell; a physical cell; an evidence-informed system. Store owns these levels.

**Stub** — The part of the Store's board left after the parts are cut. It goes back to the customer with the parts.

**Review record** — `DefinitionReviewRecorded` (the person confirmed this exact definition) and `UnresolvedDefinitionAcknowledged` (the person acknowledged what is still unresolved). Neither is purchase, payment, reservation or production authority.

**Completion roles** — `CUSTOMER`, `CELL_STEWARD`, `OPERATOR`. Each role may take only its listed completion actions; an operator may stop work or report a condition, not promote completion.

**Completion records** — `CompletionPlanRecorded`, `CompletionDecisionRecorded`, `ProjectCloseoutRecorded`.

**Completion plan status** — `BLOCKED`, `NEEDS_CUSTOMER_DECISION`, `NEEDS_STEWARD_DECISION`, `SECONDARY_WORK_PENDING`, `READY_FOR_HANDOFF`, `CLOSED`.

**Secondary work option** — Who finishes work the machine does not: `YARD_SECONDARY`, `CUSTOMER_COMPLETES`, `THIRD_PARTY_COMPLETES`.

**Owner archive** — The exported project file (`stb-owner-archive`, `.stb.json`). It reopens the same project with its revisions, Store requests, answers and records.

**Simulated** — Shown in the app but not performed: offer, acceptance, payment, the yard queue and the cut. Always labelled.

**Project** — May mean an ordinary human undertaking or a governed `ProjectInstance`. Use the more precise meaning when it matters.

**Definition** — May mean a plain-language description, product definition, data definition, or resolved requirement. State what is being defined.

**Project definition** — Plain-language umbrella for the information describing what is wanted and what it must satisfy. Not a new canonical object.

**Model** — May mean a 3D model, data model, mathematical model, simulation model, machine model, or language model.

**Stock** — May mean raw material, merchandise at a yard, supplier inventory, or one particular physical piece.

**Available** — May mean on hand, obtainable, unreserved, machine-capable, or ready. The word alone is insufficient when the distinction matters.

**Hardwood** — Botanical/commercial grouping. Not a species and not a guarantee that the wood is physically hard.

**Grade** — Classification under a particular grading rule or commercial system. The governing system matters.

**Scan** — A capture method. A scan is not automatically a verified measurement or fabrication definition.

**Measurement** — A value produced by a stated measurement process. Not exact truth merely because it contains numbers.

**Verified** — Established through an applicable verification act. Not synonymous with plausible, repeated, high-confidence, or machine-readable.

**Datum** — Engineering reference with a specific meaning. Do not use it casually for every zero, stop, edge, or convenient reference.

**Fixture** — May mean physical manufacturing workholding or controlled software test data. Qualify when necessary.

**Program** — May mean software, machine instructions, an institutional program, or a project initiative.

**Mode** — May mean machine operating mode, process choice, software state, or other unrelated conditions. Qualify it.

**State** — May describe software, machine condition, inventory, lifecycle, commercial status, or knowledge status.

**Capability** — Ability within a stated envelope. Not availability, readiness, acceptance, or authorization.

**Release** — May mean software release, material release, packet release, operator release, or permission for another act.

**Authorization** — Permission from a defined authority for a defined act. Not validation, readiness, authentication, or eligibility.

**Execution** — May mean running software, running a simulation, or performing physical work.

**Production** — May mean deployed software or actual physical manufacture. Never leave the meaning ambiguous near machine control.

**Build** — May mean software build, machine construction, fabrication, assembly, or installation.

**Need** — Something a person wants changed, supplied, repaired, made, learned, or resolved. It does not require a known product.

**Idea** — Defined once, in [The trail](#the-trail): the unnumbered workspace before the steps.

**Interest** — Something a person cares about before a specific project is necessarily formed.

**Intent** — Defined once, in [The trail](#the-trail): step 1, where this job's scope and permissible controls are established.

**Requirement** — Condition that must be satisfied for the applicable result.

**Constraint** — Condition that limits possible solutions.

**Preference** — Desired condition that is not automatically mandatory.

**Selection** — Choice deliberately made by the person or actor entitled to make it. Selection is not verification.

**Confirmation** — Explicit acknowledgment of information or a choice. Confirmation does not automatically establish physical truth.

**Measurement** — Observed dimensional or other value produced through a stated method.

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

**Scan** — Spatial capture method. Useful evidence, but not automatically verified fabrication geometry.

**Laser measurement** — Measurement using a laser-based instrument. The instrument alone does not establish authority or verification.

**Tape measurement** — Measurement using a tape or rule. A legitimate capture method when properly recorded.

**Drawing** — Graphic or digital representation whose role must be identified: design intent, existing condition, shop information, extracted measurement, or another purpose.

**Site condition** — Physical condition at the place where the project must fit, function, attach, or be installed.

**Unresolved** — Required information or determination remains unknown, unverified, disputed, stale, unavailable, or otherwise incomplete.

**Defer** — Stop the present decision because something required is not yet sufficient.

**Refuse** — Explicit negative result because the request exceeds an applicable rule, material, capability, authority, or safety boundary.

**Wood** — Material derived from woody plants. Does not by itself establish species, grade, moisture, properties, or suitability.

**Hardwood** — Wood from the angiosperm grouping. Not necessarily physically hard.

**Softwood** — Wood generally associated with gymnosperms/conifers. Not necessarily physically soft.

**Hardwood tree** — Legitimate broad description of a tree in the hardwood grouping. Insufficient as exact material identity.

**Species** — Botanical or accepted commercial species identity established by an appropriate source.

**Species group** — Commercial grouping containing more than one species.

**Pine** — Common or commercial grouping that may refer to multiple species. Do not automatically treat it as one exact species.

**MaterialClass** — Governed material-identity layer describing what the material is independently of merchant SKU.

**MaterialSpec** — Material specified for a particular use and form. Not a SKU.

**Form** — Physical commercial/manufacturing form such as dimensional lumber, board, sheet, panel, or hardware.

**Lumber** — Sawn wood product. Additional information is normally needed to establish usable identity.

**Dimensional lumber / dimension lumber** — Industry term associated with particular lumber size categories. Not every rectangular piece of wood is formally dimension lumber.

**Board** — Individual elongated piece of lumber. Says nothing by itself about species, grade, dimensions, condition, or availability.

**Sheet / panel** — Broad sheet-form category. Does not identify plywood, MDF, particleboard, OSB, grade, thickness, or emissions status.

**Rough** — Lumber not surfaced to final smooth/uniform dimensions.

**Surfaced / dressed** — Lumber machined for improved surface and dimensional uniformity.

**S2S** — Surfaced on two sides.

**S4S** — Surfaced on four sides.

**Grade** — Classification under a named grading system or declared commercial rule.

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

**Process plan** — Structured description of the operations and resources required to produce the result.

**Sequence** — Ordered arrangement of operations or events.

**Station** — Defined physical location or function within a machine or cell where work occurs.

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

**Datum** — Formal engineering reference under the applicable dimensional/tolerancing system.

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

**Machine program / cell program** — Machine-runtime representation of operations. Downstream from project and process definition.

**Numerical control (NC) / computer numerical control (CNC)** — Machine control using programmed numerical instructions.

**G-code** — Common CNC programming representation. Not a generic synonym for WorkPacket, process plan, or machine-readable instructions.

**Postprocessor / lowering** — Transformation from a neutral/process representation into machine- or controller-specific instructions.

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

**Service** — Software component providing a defined function through an interface.

**Module** — Cohesive software or domain unit with a defined responsibility.

**Package** — Versioned or repository-local software unit.

**Dependency** — Component, package, contract, or resource required by another component.

**State** — Current condition within a defined software or domain state model.

**Event** — Recorded occurrence that happened and may explain or produce a state change.

**Command** — Request to perform an act or change state. A command does not prove that the act is authorized or succeeded.

**Query** — Request for information.

**Runtime** — Software while executing or the environment in which it executes.

**Software build** — Process of producing/checking executable or distributable software from source.

**Compile** — Translate source into another executable or intermediate representation.

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

**Authorization** — Permission to perform a particular act.

**Eligibility** — Determination that prerequisites for a possible next act are satisfied. Not authorization.

**Authority** — Right or responsibility to make a particular decision, declaration, refusal, verification, or authorization within stated scope.

**Issuer** — Actor or component entitled to create a particular authoritative record.

**Replay** — Reuse of a previously issued artifact or request in another time or context.

**DeclaredRecord** — Preserves a person's declared interest or intent without replacing it with system interpretation.

**ClassHypothesis** — Proposed classification of a project. It does not replace the declaration.

**ProjectInstance** — Governed project record binding the applicable project information and lifecycle.

**Observation** — Measured or document-derived result with provenance and status. Not automatically verified.

**ObservationSet** — Structured output from a capture method containing observations, coverage, unresolved conditions, and status.

**MaterialClass** — Governed material identity.

**MaterialSpec** — Governed specification of material for a particular use/form. Not a merchant SKU.

**OfferingRecord** — Merchant/location/channel representation of an offered material or product.

**InventoryAssertion** — Time-bounded statement about quantity or availability.

**CapabilityCard** — Holder-declared capability, limits, prerequisites, and refusals. Not availability, quotation, or execution authorization.

**MachineEnvelope** — Versioned representation of machine operations and limits.

**GateResult** — Structured result of a named rule evaluation: pass, fail, unresolved, or inapplicable.

**RefusalRecord** — Preserved structured refusal and its basis.

**WorkPacket** — Versioned make-path description of governed work. Does not authorize machine motion.

**SimulationAuthorization** — Authorization for the specified simulation context only.

**ProductionExecutionAuthorization** — Production authority type. Not currently issuable by the governed v0.2.x runtime.

**SimulatedExecutionEvent** — Record that simulated execution occurred. Does not establish physical fabrication or production readiness.

**ResolutionRecord** — Record of how the inquiry or project resolved.

**OutcomeRecord** — Preserved result including what changed and what remains unresolved.

**Scan-to-Build** — Governed path intended to let a sufficiently resolved requirement reach relevant material and bounded productive capability, receive an honest result or refusal, and preserve the consequential record.

**Scan** — In the name Scan-to-Build, does not mean a laser or 3D scan is mandatory. Manual measurement, drawings, laser instruments, spatial capture, or other governed evidence may establish the needed information.

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

These are Store-owned. A change in a yard word does not rewrite a job.


**Product** — Commercially recognizable good or service. A need does not have to begin as a product.

**Catalog item** — General product identity represented in a catalog. Not automatically a particular merchant's offering.

**Stock-keeping unit (SKU)** — Merchant- or channel-specific product identifier. Commercial identity, not material identity.

**Merchant** — Entity presenting an offering for commercial supply.

**Seller of record** — Accountable party to the applicable commercial transaction.

**Supplier** — Party supplying material or product into the commercial chain.

**Offering** — Material or product represented through a particular merchant, location, or channel under stated conditions.

**Inventory** — General commercial concept for goods held or represented for sale or use.

**Stock** — Physical material represented at a location or through a supply channel.

**Stock snapshot / InventoryAssertion** — Time-bounded assertion about quantity or availability associated with an offering.

**On hand** — Represented as physically present at the applicable location and time. Not necessarily reserved or usable for a particular job.

**Available** — Commercial status whose source and meaning must be known: local, supplier, special-order, reserved, or another defined basis.

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

**Service** — Bounded work supplied by a yard or another holder. Prefer the specific service name.

**Capability** — Declared ability to perform specified work within stated limits.

**Refusal boundary** — Condition under which a holder states that it will not accept or perform the requested work.

**Store Zero** — Deliberately fictional reference lumberyard used to make Store behavior testable and auditable.

**Store Zero fact** — Declared synthetic fact about Store Zero's assets, stock, supplier relationships, equipment, capability, or limitations.

**Fixture fact** — Controlled assumption used for testing. Not an observed industry fact.

**Store inquiry** — Structured question asking what a Store can truthfully report about material, offering, stock, supply route, fulfillment, or capability.

**Store response** — Structured answer containing applicable Store facts, limitations, freshness, provenance, and unresolved conditions.

**Store evaluation** — Comparison of a bounded requirement against applicable Store facts.

**Fulfillment node / node** — Bounded yard/store environment capable of reporting relevant material, stock, fulfillment, and capability information.

**Store accept** — Store-side determination that its represented facts support the applicable next governed step. Not machine authorization.

**Store defer** — Store-side result indicating that required Store information or capability is insufficient at present.

**Store refusal** — Store-side result indicating that the request falls outside a declared Store boundary.

**Special-order route** — Store-represented path to material or goods not satisfied through the applicable local-stock path.

**Machine capability reference** — Store-visible declaration or reference to machine or cell capability conforming to governed `MachineEnvelope` semantics. A Store may declare a machine-specific envelope instance but does not redefine those semantics or infer new capability from observed success. Not machine readiness or authorization.


## Never equate


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

**Admissible ≠ supportable**

**Supportable ≠ machine-ready**

**Virtual evidence ≠ a cut**

**endIdentity omitted ≠ endIdentity deleted**
