# System — engineering rules for agents and maintainers

This repository runs the five published Scan-to-Build project experiences. The public entry is `/` → `public/live/system-build-current.html`; the child pages, assets and browser integrations are under `public/live/`. The former generic React `/bench` and `/projects/$projectId` pages have been retired. Keep customer-facing changes in the five published projects; typed recipe and record modules retained for contract tests are not a second UI.

## Objective and method

1. **Fix the underlying implementation in service of the user's objective.** State the intended outcome, find the owning executable path, reproduce the defect, repair its cause, and verify the outcome. A narrower test, a hardcoded result, a copied evaluator, a new facade or a document-only correction is not a substitute for fixing the requested behavior.
2. **Leave no unnecessary replacement code behind.** Before adding a helper, adapter, test or document, check for an existing owner. In the same change, retire genuinely superseded code, stale fixtures, redundant tests and references after demonstrating they have no remaining consumer. Keep independent regression/evidence tests and historical source identities.
3. **Keep the published user experience stable** unless a change expressly calls for it: all five project facts, controls, art, navigation, default and revised Store inquiries, refusals, and customer decision records. Do not silently make a required tool optional, fabricate a Store answer, or substitute another project page to pass a test.
4. **One working branch: `main`.** No task branches, replacement repositories or compatibility implementations. Inspect the current head, make small truthful commits directly to main, and never force-push. If another commit lands, inspect and reconcile before continuing.
5. Every completed change reports what was improved, removed, measured and tested; identify any unproved or blocked consequence. Fix a pre-existing failure only when it is in the authorized scope.

## Owners and executable entry points

| Responsibility | Owner / start reading here |
| --- | --- |
| Published entry and five-project pages | `src/routes/index.tsx` → `public/live/system-build-current.html` and its actual child frames |
| Public project/tool admission and revision rules | `public/live/shared/tile-host-admission-contract.mjs`, `public/live/stb-public-admission.mjs`, `public/live/shared/definition-contract.mjs` |
| Shared browser Store communication | `public/live/stb-store-client.js`; it transports the defined job and checks correlation/pin/freshness |
| Published request conversion | `src/routes/api/store-zero/job.ts`, `offering.ts` → `src/system/store/published-wire.ts` |
| Response receipt and identity interpretation | `src/system/store/interpret.ts`; Store alone calculates Q and owns its calculation identity |
| Independent component/feature coverage | `src/system/manifest.ts`; incomplete requirements remain visible and unfulfilled |
| Typed recipe and owner-record contract fixtures (not a published UI) | `src/system/compile.ts`, `src/system/recipes/library.ts`, `src/system/session.ts` and their direct tests |
| Store host and inspected revision | `src/system/store-candidate.ts`, `public/live/stb-store-runtime.json`, `startup.sh`, `.github/workflows/verify.yml` |
| Public five-project Chromium proof | `scripts/browser-five-jobs.mjs`, required by `.github/workflows/verify.yml` |
| System verification | `src/system/**/*.test.ts`, `scripts/**/*.test.mjs`, and `npm test` |
| App host infrastructure still connected to build | `vite.config.ts`, `src/lib/auth/`, `src/lib/db.ts` |

The concise public introduction is `README.md`. Shared vocabulary is `docs/DEFINITIONS.md`. Full technical explanation is `SYSTEM-MASTER.md`; the current commercial event contract is exercised by `public/live/stb-commercial-sequence.js` and the Store's `src/contracts/commercial-sequence.js`. Deep explanation does not override executable behavior: discrepancies require source-level reconciliation and appropriate tests.

## Engineering and evidence boundaries

- **Program investigates why; System defines the job and its owner-held record; Store answers what this yard can supply.** Never implement another catalog, machine timing calculation, stock decision or Q engine in System.
- Store receives the actual customer requirements and an **independently derived manifest** for every job; preserve all part, feature, item and unresolved-requirement identities. A requirement not evaluated by Store cannot silently become fulfilled. A refusal and `UNRESOLVED` are legitimate outcomes.
- Every displayed answer belongs to exactly its requested definition revision and actual Store release. Compare receipts, identities, amounts and hashes against the pinned reply; a former quote, fixture, screenshot, static specimen or client-supplied pin never becomes authority.
- The current Store integration pin is `f7123a73c1ca60aa7eb180a86a1c365eaffe95db`, recorded in `src/system/store-candidate.ts`, browser runtime config, CI checkout and `startup.sh`. Move all references together only after verifying an exact Store checkout and rerunning joint tests. Store `main` moving does not repin the live app.
- Preserve actual manufacturing geometry. For a parallel, `long-long-outer-edge` board datum, a redundant end identity can be reconciled, but no independently required endpoint, spot, profile, split or tab may disappear. Unknown facts remain unknown.
- Physical machine admission/release stays blocked; the described sale, payment, allocation, queue and handoff events retain their actual evidence status and separate custody. A budgetary Q does not authorize physical work.
- Owner records cannot automatically upgrade malformed or unknown schemas. Original issued patents, sealed Project 1 proof, and historical revisions retain their identities; never rewrite evidence to make a test pass.
- Preserve customer-facing dev/reviewer disclosures and safety boundaries while improving their clarity. **NO BLOOD ON WOOD.**

## Verification and safe consolidation

- Before and after changing executable code, run `npm test` with `STORE_ZERO_ROOT` pointing to a checkout whose HEAD is the exact Store pin. Run the Vercel and Railway production builds and TypeScript acceptance defined in `.github/workflows/verify.yml`. Published five-project Chromium navigation, default/revised Q and refusal/correlation protections are mandatory, not replaced by screenshots.
- For performance changes measure representative fresh Store evaluation time, search nodes, stock, operations, Q and refusal/search-completion identity. Optimize the *same* algorithm/contract; do not cache quotations or weaken search bounds to advertise speed. Browser endpoint-config reuse never caches a customer answer.
- Trace both static and runtime consumers before removing a page, provider, endpoint, file or test. Distinguish an active child frame, a public direct link, a test fixture, an original artifact and a genuine unused module. A passing build alone is insufficient proof that an externally linked page has no readers.
- Grok PWA/branding injection and its app-builder tutorial are retired. The Grok preview host bridge is retired with its exclusive code; authentication and database infrastructure remain while their active development/build chains and security checks require them. Do not restore unrelated platform scaffolding.
- Keep one implementation per responsibility, one source for governing facts, and one useful test per distinct invariant. Prefer simplifying the current path over creating a parallel replacement. Update imports, routes, tests, README/master references and deployment configuration together when their underlying owner changes.
