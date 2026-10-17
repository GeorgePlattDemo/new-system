# Scan-to-Build System

**Your idea should reach the cut, mill, and drill.**

Define it once. Nobody downstream should have to redraw it.

<a href="https://system-candidate-production.up.railway.app/"><kbd>▶ OPEN THE APP</kbd></a>

3D Solutions LLC · Greensboro, North Carolina

## Make what you meant

*Authority category: Current System Behavior*

A replacement brace. Shelves that fit an opening. A window seat that uses the space. The pieces for a picnic table. A panel with an arched opening.

The useful result is something you can build with. Scan-to-Build connects the person defining that result to the local Store that can supply the material and work.

Bring an idea, photo, sketch, scan, description, or prior work. Establish the project’s requirements at **Intent**, then work them on **the Bench**. The definition carries the dimensions, feature locations, and required operations forward to the Store. Cut, mill, and drill each have a place in that description: what the part must become, where the work belongs, and what material it needs.

These are not drawings handed to another programmer. Intent establishes the required operations; the Bench sets their values. For supported work, those values become the job-specific inputs to registered machine functions, without a second person programming the order.

The seam matters. Your idea should not lose its meaning when it leaves the screen and reaches the yard. The definition can travel to suitable local material before that material has to travel to distant processing.

## Start with the Bench

*Authority category: Current System Behavior*

The five-project application runs on Railway and sends each defined job to the independently deployed, pinned Store Zero.

[Open the currently deployed application](https://system-candidate-production.up.railway.app/) and choose **Start your own**. It opens on Intent, with the job’s wood, cuts, and spot operation together. Take that definition to the Bench and adjust the part length. Watch the angle and spot location follow the same job.

One meaningful change, with its consequences visible. The Store evaluates the resulting request and supplies its own answer.

The library offers five bounded project classes:

| Project | What you work on |
| --- | --- |
| [**Start your own**](public/live/three-frames.html) | A user-defined board job with cuts and a bounded spot operation. |
| [**Critical fit**](public/live/system-build-base-8d8a9dd.html) | An alcove/shelf insert shaped by the opening it must fit. |
| [**Space utilization**](public/live/stb-window-seat-0.9.html) | A window-seat assembly that makes use of available space. |
| [**Outdoor build**](public/live/stb-outdoor-picnic-0.4.html) | A picnic-table project starting from a published plan. |
| [**Playhouse arched window**](public/live/system-build-current.html) | A sheet opening through the S-001 path, with retained tabs. |

Each keeps its own project facts while using the same journey. These source links identify the project owners; enter the application through **Open the app** to use the complete nested experience. The [registered component tool](https://system-candidate-production.up.railway.app/live/component-tool.html?v=public-conformance-20261017) defines a separate six-part component set through the same compiler and Store boundary; its [source and registration](public/live/component-tool.mjs) preserve both supported revisions.

## One trail from Intent to build

*Authority category: Current System Behavior*

**Intent → The bench → The Store answers → Your call → We cut it → Pick up & build**

**Idea** is the unnumbered intake before those steps: the source material and context you bring. **Intent** establishes this job’s requirements and meaningful controls. **The Bench** changes tool values and shows the resulting definition. **The Store answers** from its material, capability, modeled work, and economics. **Your call** records your decision; the later steps carry the job through the demonstrated yard and handoff sequence.

Alcove, Window Seat, Outdoor and Playhouse carry the idea reference into a shared Intent layout: **Grab your wood**, **Bring your tools**, and **What travels to the Bench**. Wood lookup discovers Store offerings; it does not evaluate a job. Material choices and added tools are established on Intent, and the Bench adjusts their values. Outdoor can ask for its attached published plan as it stands, or take selected tools to the Bench. The visual-reference rules for all five projects are in the System master.

Known information travels with the job. A changed definition gets a fresh Store evaluation. The identified revision, its answer, your next decision, and the consequential record remain together.

The [trail contract](public/live/stb-trail-contract.js) declares the shared journey. Start your own opens on Intent with Idea one back control away; Window Seat can also offer a full-scroll presentation from its Idea line. [Shared definitions](docs/DEFINITIONS.md) explain the terms used here.

## How the definition reaches the work

*Authority category: Current System Behavior*

**System defines what the job means. Store determines what that yard can provide. Local machine engineering registers the equipment once, in advance; a compiler then turns each accepted definition into instructions for it.**

The confirmed definition supplies the required result. Store adds identified material, supported operations, modeled work, and price. In the intended production chain, a registered local compiler translates the requirements and machine facts into ordered instructions and coordinates. The operator verifies the stock, loading, references, tooling, and readiness; inspection checks the parts against the same definition.

That is the connection this work investigates: the customer defines the result, and software carries it toward cut, mill, and drill without a second design entry.

You define what the job requires. The registered machine and its compiler decide the safe movements that do it. You are never commanding axes directly.

Current integration acceptance uses the Project 1 SPF cases. The original Project 1 publication remains historical evidence, not architectural authority. Required Chromium checks derive and accept both SPF settings, export each exact accepted packet, and verify real Store lowering and virtual replay. The workflow publishes its complete revision-bound proof; the [current engineering review](https://github.com/GeorgePlattDemo/store-zero/blob/main/docs/project-1-digital-trail/README.md) supplies the regenerating reference evidence.

## Three connected homes

*Authority category: Current System Behavior*

| Repository | Contribution |
| --- | --- |
| [**Program**](https://github.com/GeorgePlattDemo/3d-solutions-program) | The economic opportunity, research, candidate engineering, and questions worth testing. |
| **System** | The five published job screens, their definitions, and the request each one sends. |
| [**Store**](https://github.com/GeorgePlattDemo/store-zero) | Material, capability, modeled work, economics, and machine evidence for a bounded request. |

System asks the Store recorded in [`STORE_CANDIDATE`](src/system/store-candidate.ts). That record selects the inspected dependency. Verify the running release separately against Store health, its shipped-source digest and fresh receipts. The Store evaluates the request; the application presents that answer and preserves its identity.

Read the [complete System reference](SYSTEM-MASTER.md) for the working application, definition semantics and Store handoff.

## Where the executable work lives

*Authority category: Current System Behavior*

The public door is [the published shell](public/live/system-build-current.html). The [verification note](SYSTEM-MASTER.md#14-testing-and-verification) records what has been shown for the five jobs, and what has not.

| Question | Where the answer is |
| --- | --- |
| What do the words mean? | [Definitions](docs/DEFINITIONS.md) |
| Which Store commit is inspected? | [Store candidate](src/system/store-candidate.ts) |
| What has been shown for the five jobs? | [Verification note](SYSTEM-MASTER.md#14-testing-and-verification) |
| Where are definitions compiled and carried? | [Compiler](src/system/compile.ts), [independent manifest](src/system/manifest.ts), [published adapter](src/system/store/published-wire.ts) and [browser client](public/live/stb-store-client.js) |
| Which runtime and build are used? | [Architecture and deployment](SYSTEM-MASTER.md#13-application-architecture-and-deployment), [runtime config](public/live/stb-store-runtime.json), [Dockerfile](Dockerfile.railway) and [local startup](startup.sh) |
| How are the published jobs verified? | [Required CI](.github/workflows/verify.yml), [five-project Chromium acceptance](scripts/browser-five-jobs.mjs) and its generated `project-1-current-proof` artifact |
| What is the shared SKU, machine-time and Q engine? | [Store-owned manufacturing core](https://github.com/GeorgePlattDemo/store-zero/blob/main/src/evaluation/engine/store-manufacturing-core.mjs) |
| What evidence must each commercial and fulfillment event carry? | [Commercial sequence template](SYSTEM-MASTER.md#10-customer-decision-and-commercial-progression) |

Maintainers: read [AGENTS.md](AGENTS.md), then run the [verification commands](SYSTEM-MASTER.md#141-commands-and-observed-results) with the exact clean pinned Store and reviewed Program checkouts. The [release and rollback procedure](docs/verification/start-your-own.md#release-configuration-and-rollback-procedure) governs deployment.

Store owns the active manufacturing core. System submits the complete definition manifest and consumes its answers. The commercial specification and executable event gate are shared with Store; each simulated stage requires explicit source evidence. Physical and financial authority remain blocked.

All five jobs ask the pinned Store for a fresh answer to the revision on screen. An answer can be yes, no, or not yet: a refusal or an unresolved requirement is the result, not a failure to hide. Work the Store did not evaluate stays on the job, and the job is not presented as fully supportable. The [verification note](SYSTEM-MASTER.md#14-testing-and-verification) lists what each job sends, what was exercised, and what is still open.

Store prices are budgetary estimates. Machine time is modeled. Commercial and yard events are simulated. Physical production is not commissioned. A quote is not machine admission.

**NO BLOOD ON WOOD.**
