# Scan-to-Build System — maintainer rules

The five-project application in `public/live/` is the public front door. `/bench` is the generic development/record bench. [SYSTEM-MASTER.md](SYSTEM-MASTER.md) explains current behavior; [DEFINITIONS.md](docs/DEFINITIONS.md) specifies shared meaning. Read applicable source and tests before changing either.

## Owners and protected behavior

- **Program investigates why; System defines what the job means; Store determines what its identified Store can provide.** Keep declarations, interpretation, derivations and source evidence distinct.
- System owns requirements, geometry, revisions, complete manifests, inquiries, presentation, decisions and custody. It does not implement Store's stock search, manufacturing evaluator, time or Q. No embedded-price, old-evaluator or saved-answer fallback.
- Preserve all five project experiences, images, drawings, customer wording, controls, next/back navigation, Idea as unnumbered intake, Intent as step 1, automatic Bench evaluation, Addl svcs/Close and visible developer/reviewer rails unless the task authorizes their change.
- A missing fact stays missing. Complete expected manifests come from the controlling definition before translation. Never drop a requirement or disguise a scoped estimate as full support.
- A Store answer governs only its exact evaluated revision and active attempt. Reopening retires current answer authority; prior facts remain history. Unknown/malformed saved schemas remain rejected.
- Preserve nonredundant supplied end identity. The published board translator's recorded redundant-end canonicalization retains the supplied value and its rule. Never silently reinterpret Outdoor's unresolved source datum.
- Window Seat's additional spot belongs on the person's selected part and requires its own current Store evaluation.
- Physical release stays false and physical admission BLOCKED. No actual payment, reservation or production release. Simulated events remain identified and pass the installed shared gate.
- Machine evidence comes from the pinned Store's `/v1/machine-evidence`, matched to its inspected configuration. Do not clone a machine engine or promote modeled occupancy into physical commands. **NO BLOOD ON WOOD.**

## Store pin and shared contracts

The governing pin is `STORE_CANDIDATE.inspectedCommit` in `src/system/store-candidate.ts`: **`f7123a73c1ca60aa7eb180a86a1c365eaffe95db`**. `public/live/stb-store-runtime.json`, `.github/workflows/verify.yml` and `startup.sh` name the same commit. A caller-supplied pin does not select a release.

Change the four declarations together only under an authorized integration change, after testing a clean Store checkout whose actual `git rev-parse HEAD` matches the new pin. Never relabel an arbitrary process. Store's master revision cd08aff is documentary and does not authorize moving the runtime pin. A local Store is not a deployed Store.

`public/live/stb-commercial-sequence.js` and `docs/commercial-sequence-template.md` are shared byte-identical copies of Store's contract. Coordinated changes require both owners and their tests; do not shorten or amend one copy independently.

## Shared repository rules

1. One branch: **main**. Work lands on main; no branch or pull request is created for this consolidation.
2. Carry only source actually used, but establish imports, generated routes, direct links, records, tests and deployment obligations before deletion. Old names alone prove nothing.
3. One executable Store commit across candidate, runtime, CI and startup; test that exact checkout before integration changes.
4. Missing facts remain missing and answers remain revision-bound.
5. Completion requires main, green CI and consistent current explanations. Update the master/dictionary when governed behavior changes; identify unresolved discrepancies rather than claiming repair.

## Verification

```sh
STORE_ZERO_ROOT=/absolute/path/to/clean-pinned-store npm test
npm run build
npm run typecheck
NITRO_PRESET=node-server npm run build
```

The joint tests reject a Store checkout at another HEAD. Required tests include retained platform/auth checks, System definitions/admission/records and real pinned HTTP/public-wire behavior. No substitute evaluator or mock Q may make the integration green.

For application-affecting work, inspect actual browser rendering, navigation, changed controls, current/late responses and the applicable project paths. Check asset/script/frame reachability and console failures. Test both development and built/deployed output as relevant; never delegate verification to the user. Existing `scripts/browser-smoke.mjs` and preview helpers remain available under their actual environment prerequisites. A local smoke command is not proof of hosted rendering.

## Active platform and deployment safeguards

The hosted candidate uses Railway, `Dockerfile.railway` and `/healthz`. The default Vite/Nitro Vercel build remains an exercised contract; preserve both presets and `serverDir: './server'`. Hosted CI uses Node 22 and the container pins Node 22.23.2-slim.

Preserve `startup.sh` as the workspace restart contract. It assumes the repository is mounted at `/workspace`, verifies a clean pinned Store, starts only missing services and returns without blocking. Keep it synchronized with runtime changes and start development through `npm run dev`, which applies `scripts/with-app-env.mjs`. Keep development `0.0.0.0:8080` and preview `127.0.0.1:8081`; use the restart/stop helpers when preview is required.

Retain the named router export, error presentation, document shell, `<AuthProvider>` and `<PreviewHostBridge />`. Keep the PWA/branding injector, middleware, install page, `public/__grok/`, `server/`, platform scripts and prewired `src/lib/` helpers. Do not hide/strip installed branding or block its injected resource. Public application routes belong in `src/routes/`; do not repurpose platform middleware.

Auth/accounts remain off without the declared environment configuration. Do not restore an untracked `.env`, absent skill or retired directory to satisfy checks. Keep secrets server-side; only intentionally public variables reach the client. Preserve migration readiness and auth invariants. If an authorized task adds user data, enforce verified server identity and scope access appropriately; never substitute a preview/demo identity for deployed authority. Do not add a React `/auth/popup` route over the existing popup plugin.

Existing styles, error visibility, PWA install/preview behavior and branding assets remain build/runtime obligations. New dependencies must preserve the lock and hosted install/build contract. This repository does not require unavailable `.grok/skills` or reference files, a new scaffold or an unrelated art pipeline to maintain its existing application.

## Retained brand-task guard

The historical numbered rule remains named because the platform tests enforce it:

6. **Brand-asset pass** — If an authorized separate branding task runs, its preview marker is `/workspace/.grok/og-pending`, stale after **10 minutes**. Keep it fresh only while generating and remove it when finished. Never `wait_tasks`; never `get_task_output` for that background task. Preserve its completion notification and continue independent application work. This rule does not require launching an art task for documentation maintenance.
