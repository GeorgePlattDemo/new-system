# Scan-to-Build System

**Your idea should reach the cut, mill, and drill.**

Define it once. Nobody downstream should have to redraw it.

<a href="https://georgeplattdemo.github.io/scan-to-build-system/system-build-current.html"><kbd>▶ OPEN THE APP</kbd></a>

3D Solutions LLC · Greensboro, North Carolina

## Make what you meant

A replacement brace. Shelves that fit an opening. A window seat that uses the space. The pieces for a picnic table. A panel with an arched opening.

The useful result is something you can build with. Scan-to-Build connects the person defining that result to the local Store that can supply the material and work.

Bring an idea, photo, sketch, scan, description, or prior work. Establish the project’s requirements at **Intent**, then work them on **the Bench**. The definition carries the dimensions, feature locations, and required operations forward to the Store. Cut, mill, and drill each have a place in that description: what the part must become, where the work belongs, and what material it needs.

The seam matters. Your idea should not lose its meaning when it leaves the screen and reaches the yard. The definition can travel to suitable local material before that material has to travel to distant processing.

## Start with the Bench

This repository is the replacement candidate. It is not the promoted publication. The live demonstration remains the published application until that promotion is made on purpose.

[Open the published demonstration](https://georgeplattdemo.github.io/scan-to-build-system/system-build-current.html) and choose **Start your own**. It opens on Intent, with the job’s wood, cuts, and spot operation together. Take that definition to the Bench and adjust the part length. Watch the angle and spot location follow the same job.

One meaningful change, with its consequences visible. The Store evaluates the resulting request and supplies its own answer.

The library offers five bounded project classes:

| Project | What you work on |
| --- | --- |
| **Start your own** | A user-defined board job with cuts and a bounded spot operation. |
| **Critical fit** | An alcove/shelf insert shaped by the opening it must fit. |
| **Space utilization** | A window-seat assembly that makes use of available space. |
| **Outdoor build** | A picnic-table project starting from a published plan. |
| **Playhouse arched window** | A sheet opening through the S-001 path, with retained tabs. |

Each keeps its own project facts while using the same journey.

## One trail from Intent to build

**Intent → The bench → The Store answers → Your call → We cut it → Pick up & build**

**Idea** is the unnumbered intake before those steps: the source material and context you bring. **Intent** establishes this job’s requirements and meaningful controls. **The Bench** changes tool values and shows the resulting definition. **The Store answers** from its material, capability, modeled work, and economics. **Your call** records your decision; the later steps carry the job through the demonstrated yard and handoff sequence.

Known information travels with the job. A changed definition gets a fresh Store evaluation. The identified revision, its answer, your next decision, and the consequential record remain together.

The [trail contract](public/live/stb-trail-contract.js) declares the shared journey. Start your own opens on Intent with Idea one back control away; Window Seat can also offer a full-scroll presentation from its Idea line. [Shared definitions](docs/DEFINITIONS.md) explain the terms used here.

## How the definition reaches the work

**System defines what the job means. Store determines what that yard can provide. Local machine engineering translates the accepted requirements for its equipment.**

The confirmed definition supplies the required result. Store adds identified material, supported operations, modeled work, and price. In the intended production chain, a registered local compiler translates the requirements and machine facts into ordered instructions and coordinates. The operator verifies the stock, loading, references, tooling, and readiness; inspection checks the parts against the same definition.

That is the connection this work investigates: the customer defines the result, and software carries it toward cut, mill, and drill without a second design entry.

Project 1 evidence stays with this candidate as fixtures and the joint Store test. It is evidence of one board path, not a second application.

## Three connected homes

| Repository | Contribution |
| --- | --- |
| [**Program**](https://github.com/GeorgePlattDemo/3d-solutions-program) | The economic opportunity, research, candidate engineering, and questions worth testing. |
| **This candidate** | The five published job screens, their definitions, and the request each one sends. |
| [**Store**](https://github.com/GeorgePlattDemo/store-zero) | Material, capability, modeled work, economics, and machine evidence for a bounded request. |

System asks the Store recorded in [`STORE_CANDIDATE`](src/system/store-candidate.ts). That record is an inspected commit, not a production release. The Store evaluates the request; the application presents that answer and preserves its identity.

## What this candidate actually contains

The public door is [the published shell](public/live/system-build-current.html). The [verification note](docs/verification/start-your-own.md) records what has been shown for Start your own, and what has not.

| Question | Where the answer is |
| --- | --- |
| What do the words mean? | [Definitions](docs/DEFINITIONS.md) |
| Which Store commit is inspected? | [Store candidate](src/system/store-candidate.ts) |
| What has been shown for Start your own? | [Verification note](docs/verification/start-your-own.md) |

The other four jobs still have their published screens. They are not yet answered by this Store. That is unfinished work, not a hidden success.

Store prices are budgetary estimates. Machine time is modeled. Commercial and yard events are simulated. Physical production is not commissioned. A quote is not machine admission.

**NO BLOOD ON WOOD.**
