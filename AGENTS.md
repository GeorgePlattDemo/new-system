# System — engineering rules for agents and maintainers

This repository runs the five published Scan-to-Build project experiences. The public entry is `/` → `public/live/system-build-current.html`; the child pages, assets and browser integrations are under `public/live/`. The former generic React `/bench` and `/projects/$projectId` pages have been retired. Keep customer-facing changes in the five published projects; typed recipes retain reference cases, and explicitly registered supported recipes also feed the bounded component tool through the existing compiler. Do not restore the retired generic React UI.

## Objective and method

*Authority category: Current System Behavior*

1. **Fix the underlying implementation in service of the user's objective.** State the intended outcome, find the owning executable path, reproduce the defect, repair its cause, and verify the outcome. A narrower test, a hardcoded result, a copied evaluator, a new facade or a document-only correction is not a substitute for fixing the requested behavior.
2. **Leave no unnecessary replacement code behind.** Before adding a helper, adapter, test or document, check for an existing owner. In the same change, retire genuinely superseded code, stale fixtures, redundant tests and references after demonstrating they have no remaining consumer. Keep independent regression/evidence tests and historical source identities.
3. **Keep the published user experience stable** unless a change expressly calls for it: all five project facts, controls, art, navigation, default and revised Store inquiries, refusals, and customer decision records. Do not silently make a required tool optional, fabricate a Store answer, or substitute another project page to pass a test.
4. **`main` is the only permitted working branch.** Do not create additional local or remote branches, including task, review, feature, repair or documentation branches. Do not create a branch-creating worktree, rename a branch to evade the rule, or change these instructions to accommodate a tool. If an authorized change cannot proceed on `main`, stop and report the exact blocker. Preserve the prepared work and wait for the conflicting condition to be resolved. Do not force-push, bypass protection or rewrite a repository as a workaround. Inspect and reconcile concurrent changes before integration.
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

## Current integrated proof

*Authority category: Current System Behavior*

The adopted definitions and specifications govern required behavior. Executable source, identified configuration and verified outputs establish what a particular revision actually implements. A disagreement is a conformance defect: preserve the requirement, identify the affected owner and evidence, and repair the implementation or obtain an explicit requirement decision. Neither a passing test nor existing code silently overrides the adopted contract. Documentation must distinguish adopted requirements, verified implementation, proposed capability and physical qualification.

The current Project 1 proof is maintained acceptance evidence, regenerated from the operative source and configuration when consequential behavior changes. Original sealed publications retain their source identities and historical results. Consequential changes must reconcile the affected definitions, specifications, masters, Program descriptions, current proof, tests, links and operational identities before completion. Preserve full technical content and distinguish modeled results, simulated commerce, commissioned execution and inspected output.

## Engineering and evidence boundaries

*Authority category: Current System Behavior*

- **Program investigates why; System defines the job and its owner-held record; Store answers what this yard can supply.** Never implement another catalog, machine timing calculation, stock decision or Q engine in System.
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

Documentation is maintained engineering authority. Amend affected sections in their existing locations, preserving technical depth, rationale, complete examples and useful cross-references. Update current generated evidence through its generator; retain sealed original bytes. Do not freeze the current proof to preserve old numbers. Link live guidance to its current owner and immutable evidence to its exact revision. Check file and heading destinations whenever editing linked material. For the authorized documentation/conformance work, all three repository-root READMEs are frozen byte-for-byte; preserve their destinations and report a conflict rather than editing them.

Implementation proceeds only after the affected normative documentation and acceptance obligations are coherent. A change is complete when required checks pass for its exact revisions, all affected operative documents and evidence agree, and deployment identity has been verified where deployment is in scope. The System master's single conformance register identifies open cross-repository obligations and the evidence needed to close each one. Local masters describe their owning details rather than maintaining competing status lists.

Apply authorized, verified changes to `main` only. If repository settings require a pull request, another branch or unavailable approval, stop and report that exact conflict; do not create or use an additional working branch, bypass protection, weaken verification, or amend the single-branch rule. Preserve the prepared change and its evidence. A pending commit is not integrated work, and successful source checks do not establish deployment.
