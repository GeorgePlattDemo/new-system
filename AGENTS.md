# System — engineering rules for agents and maintainers

This repository runs the five published Scan-to-Build project experiences. The public entry is `/` → `public/live/system-build-current.html`; the child pages, assets and browser integrations are under `public/live/`. The former generic React `/bench` and `/projects/$projectId` pages have been retired. Keep customer-facing changes in the five published projects; typed recipes retain reference cases, and explicitly registered supported recipes also feed the bounded component tool through the existing compiler. Do not restore the retired generic React UI.

## Objective and method

*Authority category: Current System Behavior*

1. **Fix the underlying implementation in service of the user's objective.** State the intended outcome, find the owning executable path, reproduce the defect, repair its cause, and verify the outcome. A narrower test, a hardcoded result, a copied evaluator, a new facade or a document-only correction is not a substitute for fixing the requested behavior.
2. **Leave no unnecessary replacement code behind.** Before adding a helper, adapter, test or document, check for an existing owner. In the same change, retire genuinely superseded code, stale fixtures, redundant tests and references after demonstrating they have no remaining consumer. Keep independent regression/evidence tests and historical source identities.
3. **Keep the published user experience stable** unless a change expressly calls for it: all five project facts, controls, art, navigation, default and revised Store inquiries, refusals, and customer decision records. Do not silently make a required tool optional, fabricate a Store answer, or substitute another project page to pass a test.
4. **Use the protected PR procedure below.** Keep one owner-authorized temporary branch for this repository, preserve required checks and obtain owner review before merging. Inspect and reconcile concurrent changes before integration.
5. Every completed change reports what was improved, removed, measured and tested; identify any unproved or blocked consequence. Fix a pre-existing failure only when it is in the authorized scope.

## Owners and executable entry points

*Authority category: Current System Behavior*

| Responsibility | Owner / start reading here |
| --- | --- |
| Published entry and five-project pages | `src/routes/index.tsx` → `public/live/system-build-current.html` and its actual child frames |
| Public project/tool admission and revision rules | `public/live/shared/tile-host-admission-contract.mjs`, `public/live/stb-public-admission.mjs`, `public/live/shared/definition-contract.mjs` |
| Shared browser Store communication | `public/live/stb-store-client.js`; it transports the defined job and checks correlation/pin/freshness |
| Published request conversion | `src/routes/api/store-zero/job.ts`, `offering.ts` → `src/system/store/published-wire.ts` |
| Registered component tool | `public/live/component-tool.html`, `component-tool.mjs` → `src/routes/api/component-definition.ts`, `src/system/component-tool.ts`; registered recipe data reuse `compile.ts`, shared admission/client and the published Store adapter |
| Response receipt and identity interpretation | `src/system/store/interpret.ts`; Store alone calculates Q and owns its calculation identity |
| Independent component/feature coverage | `src/system/manifest.ts`; incomplete requirements remain visible and unfulfilled |
| Typed recipe/compiler ownership and owner-record reference fixtures | `src/system/compile.ts`, `src/system/recipes/library.ts`, `src/system/session.ts` and their direct tests |
| Store host and inspected revision | `src/system/store-candidate.ts`, `public/live/stb-store-runtime.json`, `startup.sh`, `.github/workflows/verify.yml` |
| Public five-project Chromium proof | `scripts/browser-five-jobs.mjs`, required by `.github/workflows/verify.yml` |
| System verification | `src/system/**/*.test.ts` and `npm test` |
| Application build and Railway host | `vite.config.ts`, `Dockerfile.railway` |

The concise public introduction is [README.md](README.md). Use these existing authorities for the affected responsibility:

| Authority | Owns |
| --- | --- |
| [docs/DEFINITIONS.md](docs/DEFINITIONS.md) | The sole authoritative shared manufacturing definitions and handoff meanings; runtime schemas implement these requirements |
| [SYSTEM-MASTER.md](SYSTEM-MASTER.md) | Complete application, definition and transport explanation; [chapter 8](SYSTEM-MASTER.md#8-system-compilation-and-shared-meaning) governs the handoff and the [conformance register](SYSTEM-MASTER.md#155-manufacturing-contract-conformance-register) tracks cross-repository obligations |
| [Commercial design map](docs/commercial-sequence-template.md) and [public executable gate](public/live/stb-commercial-sequence.js) | Intended transaction design and installed event serialization respectively; Store's corresponding runtime copy remains in its own repository |
| [Start Your Own verification](docs/verification/start-your-own.md), [five-project browser check](scripts/browser-five-jobs.mjs) and [component-tool check](scripts/browser-component-tool.mjs) | Identified verification scope and actual public application checks |
| [Documentation checker](scripts/check-documentation.py) and [required CI](.github/workflows/verify.yml) | Current owner links, frozen README bytes and the supported verification sequence |

Disagreements between adopted requirements and executable behavior are conformance defects under the documentation authority and completion contract below.

## Engineering and evidence boundaries

*Authority category: Current System Behavior*

- **Program investigates why; System defines the job and its owner-held record; Store answers what this yard can supply.** Never implement another catalog, machine timing calculation, stock decision or Q engine in System. Preserve Store’s substantial manufacturing engineering and patent-related technical content at its owner; do not move it into System or Program or create another shared definitions document.
- Store receives the actual customer requirements and an **independently derived manifest** for every job; preserve all part, feature, item and unresolved-requirement identities. A requirement not evaluated by Store cannot silently become fulfilled. A refusal and `UNRESOLVED` are legitimate outcomes.
- Every displayed answer belongs to exactly its requested definition revision and actual Store release. Compare receipts, identities, amounts and hashes against the pinned reply; a former quote, fixture, screenshot, static specimen or client-supplied pin never becomes authority.
- The current Store integration pin is owned by `STORE_CANDIDATE.inspectedCommit` in `src/system/store-candidate.ts`; browser runtime config, CI checkout, browser acceptance and `startup.sh` must name that same exact commit. Read those operative declarations rather than copying a second pin into these instructions. Move all references together only after verifying an exact Store checkout and rerunning joint tests. Store `main` moving does not repin the live app.
- Preserve actual manufacturing geometry. For a parallel, `long-long-outer-edge` board datum, a redundant end identity can be reconciled, but no independently required endpoint, spot, profile, split or tab may disappear. Unknown facts remain unknown.
- Physical machine admission/release stays blocked; the described sale, payment, allocation, queue and handoff events retain their actual evidence status and separate custody. A budgetary Q does not authorize physical work.
- Owner records cannot automatically upgrade malformed or unknown schemas. Original issued patents, sealed Project 1 proof, and historical revisions retain their identities; never rewrite evidence to make a test pass.
- Preserve customer-facing dev/reviewer disclosures and safety boundaries while improving their clarity. **NO BLOOD ON WOOD.**

## Verification and safe consolidation

*Authority category: Current System Behavior*

- Before and after changing executable code, run `npm test` with `STORE_ZERO_ROOT` pointing to a checkout whose HEAD is the exact Store pin. Run the Railway production build and TypeScript acceptance defined in `.github/workflows/verify.yml`. Published five-project Chromium navigation, default/revised Q and refusal/correlation protections are mandatory, not replaced by screenshots.
- For performance changes measure representative fresh Store evaluation time, search nodes, stock, operations, Q and refusal/search-completion identity. Optimize the *same* algorithm/contract; do not cache quotations or weaken search bounds to advertise speed. Browser endpoint-config reuse never caches a customer answer.
- Trace both static and runtime consumers before removing a page, provider, endpoint, file or test. Distinguish an active child frame, a public direct link, a test fixture, an original artifact and a genuine unused module. A passing build alone is insufficient proof that an externally linked page has no readers.
- The published application has no account interface, account-specific server functions, database or migration layer. Do not restore retired app-builder authentication, popup, environment-injection, preview or Vercel infrastructure.
- Keep one implementation per responsibility, one source for governing facts, and one useful test per distinct invariant. Prefer simplifying the current path over creating a parallel replacement. Update imports, routes, tests, README/master references and deployment configuration together when their underlying owner changes.

## Documentation authority and completion contract

*Authority category: Adopted engineering requirements*

Read the shared [manufacturing meaning contract](https://github.com/GeorgePlattDemo/new-system/blob/main/docs/DEFINITIONS.md#manufacturing-terminology-source-words-versus-physical-requirements), the affected owner's specification/master and the existing conformance register before changing behavior. Definitions govern common meaning; System master chapter 8 governs definition and handoff obligations; Store specification sections 1, 3 and 15 govern registration, evaluation and evidence; Program owns research and laboratory claims. A project name, a source word, existing code or a green test cannot override those responsibilities.

The adopted definitions and specifications govern required behavior. Executable source, identified configuration and verified outputs establish what a particular revision actually implements. A disagreement is a conformance defect: preserve the requirement, identify the affected owner and evidence, and repair the implementation or obtain an explicit requirement decision. Neither a passing test nor existing code silently overrides the adopted contract. Documentation must distinguish adopted requirements, verified implementation, proposed capability and physical qualification.

The current Project 1 proof is maintained acceptance evidence, regenerated from the operative source and configuration when consequential behavior changes. Original sealed publications retain their source identities and historical results. Consequential changes must reconcile the affected definitions, specifications, masters, Program descriptions, current proof, tests, links and operational identities before completion. Preserve full technical content and distinguish modeled results, simulated commerce, commissioned execution and inspected output.

For each bounded change, identify the requirement, owning executable path, failing behavior or missing evidence, affected readers and acceptance condition. Preserve component and feature identities, exact parameter constraints, unresolved requirements and attributable refusals. Do not infer a convenient feature from vocabulary, weaken an assertion, omit work, create a fallback answer, duplicate an evaluator or introduce a project-specific capability exception. If the contract itself must change, state the substantive reason and its consequences explicitly; obtain any necessary owner decision rather than silently redefining success.

Documentation is maintained engineering authority. Amend affected sections in their existing locations, preserving technical depth, rationale, complete examples and useful cross-references. Update current generated evidence through its generator; retain sealed original bytes. Do not freeze the current proof to preserve old numbers. Link live guidance to its current owner and immutable evidence to its exact revision. Check file and heading destinations whenever editing linked material. Root READMEs preserve their established public argument, technical meaning and tone. Make only owner-authorized, necessary navigation or verified current-state corrections; inspect the complete before/after diff. Existing checks retain exact approved README identities. Update an identity only alongside the specifically authorized, reviewed README change, never merely to obtain a pass. README authorization does not authorize a runtime repin. Preserve historical publication and patent identities independently.

Implementation proceeds only after the affected normative documentation and acceptance obligations are coherent. A change is complete when required checks pass for its exact revisions, all affected operative documents and evidence agree, and deployment identity has been verified where deployment is in scope. The System master's single conformance register identifies open cross-repository obligations and the evidence needed to close each one. Local masters describe their owning details rather than maintaining competing status lists.

## Bounded maintenance procedure

*Authority category: Adopted engineering requirements*

1. Record the authorized outcome, baseline SHA, governing requirement, actual owning implementation and acceptance condition before editing. Follow the owner map from the published entry, definition and independent manifest through translation, shared transport, Store evaluation and response presentation. Reproduce a behavior defect and an applicable unfavorable case; for documentary work identify the exact incorrect instruction or reference.
2. Identify downstream consumers before replacing or deleting anything: imports, dynamic browser scripts, public/direct links, nested frames, routes, schemas, records, tests and evidence. Record the old responsibility, surviving owner and verification that required behavior remains. If use cannot be excluded, retain the candidate and explain why. Retire a genuinely superseded path in the same verified change rather than adding a parallel implementation.
3. Put a bounded impact account in the PR: requirement → owning source → consumers/contracts → affected definitions/specifications/masters → maintained Project 1 proof → tests and any authorized release consequences. Reconcile each affected owner within scope; explain unaffected items and report unresolved dependencies. Use the existing conformance register rather than creating another tracking document.
4. Repair the cause at its owner. Preserve geometry, exact operands, all component/feature identities and unresolved demand through the complete chain. Do not add fallback answers, cached quotations, local stock/Q decisions, test-only success, permissive defaults or undocumented workarounds. Do not weaken, skip or delete tests to obtain a pass; a demonstrably incorrect expectation requires governing source evidence and an explanation, with independent unfavorable coverage retained.
5. Amend affected governing sections in place and regenerate current Project 1 outputs through existing generators when consequential behavior changes. Preserve complete technical reasoning, the independently identified specimens and sealed historical bytes/checksums. Resolve a requirement/implementation contradiction or report the unmet contract; do not redefine the requirement to fit code.
6. Run the documentation checker against identified owner checkouts and the supported verification commands above: exact pinned clean Store, tests, production build, TypeScript and required five-project Chromium including additional component work. Record full source/dependency SHAs, Node version, outcomes and CI/proof links. Verify fresh Store correlation/refusals and blocked physical admission when affected. Do not repin or deploy unless separately in scope; where authorized, verify actual runtime/source identity and retain rollback rather than trusting a label.

## Protected integration and branch hygiene

*Authority category: Adopted engineering requirements*

1. Start from verified current `main` and record its full SHA. Inspect local changes and concurrent work before editing; preserve work outside the authorized scope. Use exactly one necessary temporary PR branch in each affected repository for the authorized task. Reuse its safe existing task branch; do not create speculative, redundant or parallel branches, branch-creating worktrees or renamed branches to evade this limit.
2. Keep all task changes in one bounded PR per affected repository. Inspect its complete diff, changed-file list and README comparison before publishing. Do not force-push, rewrite history or repositories, bypass protections, weaken required checks, or treat a tool limitation as authority to do so.
3. Run the repository verification commands above and all required PR checks against the exact proposed source and dependency revisions. Record full SHAs and check URLs. A green result from an earlier head is not verification of a later change; reconcile and reverify changed source, dependencies or merge-base consequences.
4. Obtain the owner's review and explicit merge authorization for the exact reviewed change. Permission to implement or open a PR is not permission to merge. Preserve GitHub's required checks and approvals; when the task ends at review, submit the PR and stop. A blocked approval or integration is reported precisely while other independent authorized work continues.
5. After an authorized merge, verify the resulting `main`, checks and content before deleting that task's local and remote branch. For prior merged, abandoned or stray branches, establish their heads, provenance and disposition of every distinct change first; a squash requires content comparison rather than ancestry alone. Delete them only within owner-authorized cleanup after integration or preserved historical custody is established. Retain and report unresolved work instead of discarding it. Report the final branch list and any deletion blocked by access.

## Completion evidence

*Authority category: Adopted engineering requirements*

Report the objective, actual changed and removed files, full source/dependency revisions, exact successful and failed checks with links, reconciled documents/proof, retained historical evidence, branch disposition and unresolved conditions. Label work separately as prepared, committed, verified, submitted for review, merged and deployed. A pending PR is not integrated work; a merge is not a deployment; passing software tests do not establish commissioned capability or inspected output. Write **NOT VERIFIED** for any condition without evidence. Stop at the owner's requested review gate; do not advance to later tasks or deployment without authorization.
