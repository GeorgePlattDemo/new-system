# New System candidate — handoff

Not a completion claim. Not connected to the live System, the old Store, or Program. Physical admission stays blocked. No payment, reservation, or production release.

## What was checked

- Node and TanStack Start 1.168.60.
- `src/system/system.test.ts` — 25 passed. That includes a contradictory receipt (other release, REFUSED status, invalid time) rejected as protocol, a refusal after acceptance shown as refused while the earlier decision remains, `projects: [null]` rejected as malformed, an invalid spot control blocked instead of becoming “no spots,” and zero window-seat shelves admitted with no tower shelf parts.
- `STORE_ZERO_ROOT=/tmp/store-zero-main` with `git rev-parse HEAD` equal to `4cb0c625ac00c62390129b55a52596b52f10decd`, then `src/system/store/http.integration.test.ts` — 2 passed.
- That HTTP run checked the same commercial answers as before (Project 1 Q 11.09, SPF braces 8.54, alcove 429.16, playhouse 65.04, a 30 in rise refused, window seat 1489.09, A-frame 256.64, closet cleats supportable, lookup with no receipt and no Q, `BOARD_SQUARE_V1` refused, foreign origin HTTP 403).
- Machine evidence on that same checkout: Project 1 returned `VIRTUAL_EVIDENCE_READY`, physical authority false, admission `BLOCKED`, virtual time **86.46953628299116 s**. The published Store time **85.5001 s** was not overwritten and was not treated as the same number. A board packet that carried `endIdentity: "miter-face-long-point"` was refused `END_IDENTITY_NOT_REGISTERED_ON_MACHINE` with no records. Closet cleats, still supportable as a price, was refused `LOWERING_NOT_REGISTERED_FOR:CUT_PACKAGE_V1`.

## What the page now shows

Each saved job shows its inputs, derived parts, the end requirement and its explanation, Store findings, unresolved conditions, and acceptance history (current versus earlier). Virtual evidence is asked only for the current simulated acceptance, and only against the inspected machine configuration. The records on the page are the Store’s reply.

A saved file with a hole is not opened and is not repaired. The unreadable bytes can be downloaded. Replacing them with an empty file is a separate button. A storage failure stays visible and does not wipe the tab.

## Still true

- A face-miter board does not send a separate end identity, because `long-long-outer-edge` already names the long point. A string that was actually supplied is not stripped.
- Square, plan, and sheet identities stay on those jobs. Their request types are not lowered by the reference cell.
- Window seat’s old extra hand-placed spot is not a control in this candidate.
- `npm test` runs the repository checks, the System tests, and the HTTP joint test. The joint test stops if the checkout is not the pinned commit. CI checks Store Zero out at that commit.
- The published Project 1 review file was not rewritten.

## Not done

This is still a candidate. It is not the live application. It does not cut anything.
