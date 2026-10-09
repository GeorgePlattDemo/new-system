# New System candidate — handoff

Not a completion claim. The bench runs. The Store candidate was asked over HTTP. Machine lowering and physical admission are still blocked. Both candidates stay parked.

## What was run

- Node v22.23.3. TanStack Start 1.168.60.
- `node --experimental-strip-types --test src/system/system.test.ts` — 19 passed.
- `STORE_ZERO_ROOT` at Store Zero `d0c15fcd70b4357c8fa61d5505b95ec68cea8e65`, then `src/system/store/http.integration.test.ts` — passed.
- That HTTP run checked health, Project 1 Q **11.09**, the SPF brace Q **8.54**, alcove **429.16**, playhouse **65.04** and a 30 in rise refused, window seat **1489.09**, A-frame outdoor **256.64**, closet cleats supportable, offering lookup with no receipt and no Q, `BOARD_SQUARE_V1` refused, and a foreign browser origin rejected with HTTP 403.
- `tsc --noEmit` passed. Production build passed.
- In the bench, Closet cleats returned SUPPORTABLE **$23.40**. Accepting twice kept one simulated decision and one packet. Leaving and coming back kept the decision and dropped the dollar figure. Start your own, with no species, showed `MISSING_INPUT` and sent nothing.

## Two trails

**Project 1.** Inputs are the published specimen: treated 2×4, 60 in workpiece, two 18 in parts, face miter 26.387799961243°, centered spots. The compiler is `board-workpiece`, the same rule as Start your own. The demand matches `reference/project-1/published/definition-and-demand.json`. The Store answer over HTTP was SUPPORTABLE, Q 11.09. The published review in the same folder still says Store time 85.5001 s and virtual time 86.4695 s. They are not equal. Nothing here rewrites that file. Lowering is NOT_AGREED. Physical admission is BLOCKED.

**Closet cleats.** A sixth job. Cedar 2×4, two 32 in cleats and one 18 in cleat, square cuts, no hardware. The recipe's only operation is `part-groups`. No compiler branch is named for a closet. The bench showed SUPPORTABLE $23.40, demand hash, request id, digest, release `d0c15fcd70b4`, and a receipt. Acceptance of that answer is simulated. Asking again for the same revision and receipt does not add a second decision. Reopening the saved file does not treat $23.40 as current.

## Data-only proof

`closet-cleats` is a library record. Replacing its operation with an unknown name returns `ENGINE_EXTENSION_REQUIRED` and sends nothing. Window seat does not get to claim the same thing: its record is marked `extension` and `window-seat-layout/1`.

## Blockers still open

- No agreed Store HTTP endpoint for machine lowering or virtual evidence. System will not clone the Store machine engine.
- Cut packages and sheet packages are explicitly unsupported for lowering.
- Physical authority is false. Zero physical commands.
- Commercial effects are simulated. No reservation, payment, or release.
- This candidate is not connected to the live application, the old Store, or Program.
- A later Store release must be written down and the HTTP test rerun. `d0c15fc` is the inspected baseline only.
- The old hand-placed extra spot on Window seat is not a control in this candidate.

## Setup

System tests do not import Store source. The HTTP test starts the Store candidate process and talks to it. Set `STORE_ZERO_ROOT` to a checkout of the inspected commit and `STORE_ZERO_RELEASE` to that commit. The bench forwards exact request bytes to `STORE_ZERO_ORIGIN` (default `http://127.0.0.1:8091`).
