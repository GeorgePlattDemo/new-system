# Start your own — what answers, and what does not

This note is not part of the job. The five project screens do not link here.

Checked 2026-10-08 against Store release `4cb0c625ac00c62390129b55a52596b52f10decd`. Physical admission stays blocked.

## What supplies a current answer

| Piece | Role | Supplies the current answer? |
|---|---|---|
| Published screens, drawings, developer notes, build-guide rails | Presentation. Notes stay, including wording and placement. | No |
| Bench in the Start your own page | Job definition: parts, angle, wood, and the three end facts | Defines the job. Does not price it. |
| Tile-host admission | Decides whether this revision may be asked | No price |
| Board runtime bridge | Puts the admitted job on the wire, including `endIdentity`, `endRelation`, and `lengthDatum` | No price |
| Store client and `stb-store-runtime.json` | Same-origin `POST /api/store-zero/job` and offering lookup, pin `4cb0c625ac00c62390129b55a52596b52f10decd` | Carries the answer. Does not invent one. |
| `src/system/store/published-wire.ts` | Asks the pinned Store. Keeps the three end facts on the job and off the board shape. | Returns the Store's quote, then says whether that quote is the whole job. |
| Terms flow | Simulated acceptance, yard, and pickup | Accepts the quote only. No machine admission. |
| Saved bench record | Length and wood on reopen | Not a current price, and not acceptance |

No copied Store answer or specimen travels with the page. The specimen file copied from the original Store, `stb-store-handoff-contract.js`, is deleted; every Start your own price comes from the Store, asked for the current revision.

## Three different answers

A Start your own confirm can come back with all three of these at once:

| | 16 in SPF | 18 in SPF | 18 in treated SYP | 16 in treated SYP | 84 in, either wood |
|---|---|---|---|---|---|
| Quote | $8.54 complete. 5-foot SPF `STB-ZERO-SPF-2X4-60-001`. Wood $2.61, machine $5.93. | $9.07 complete. 6-foot SPF `STB-ZERO-SPF-2X4-72-001`. Wood $3.13, machine $5.94. | $11.09 complete. 6-foot treated `STB-ZERO-PTAG-2X4-72-001`. Wood $5.15, machine $5.94. | $11.08 complete. Same 6-foot treated board. Wood $5.15, machine $5.93. | Not complete. Store status `REFUSED`. |
| Requirements | Not satisfied. `endIdentity = both`, `endRelation = parallel`, `lengthDatum = long-long-outer-edge` stayed on the job and were not evaluated. | Same | Same | Same | Same, and the quote itself was refused |
| Machine | Blocked | Blocked | Blocked | Blocked | Blocked |

The 18 in brace does not fit a 5-foot board and still leave 24 in for the last grab after three 1/8 in kerfs. Treated SYP has no 5-foot 2×4, so 16 in treated also takes the 6-foot board. Those are Store selections, not prices kept in the browser.

The screen states the quote, names the unevaluated end facts, and says the whole job is not fully supportable. Machine admission stays blocked. The simulated accept path accepts that quote. It does not admit a machine, and it does not claim every requirement was evaluated.

## What was exercised

- 16 in SPF, 18 in SPF, 18 in treated, and 16 in treated, each by a fresh confirm. After a confirm, the Store-answers page shows the quote above.
- Store stopped. Confirm stayed on the bench: `STORE_ZERO_UNAVAILABLE`. Total stayed `NOT COMPLETE`. The specimen was not substituted.
- An 84 in brace, through the same admit-and-inquire path the bench uses. The Store returned `REFUSED`. The page stayed on the bench. Store answers and Your call stayed closed.
- Save and reopen. 18 in and treated SYP came back. The price did not. Store answers, Your call, and the yard stayed closed. The pin on the Store-answers page was “—” and Q was `NOT COMPLETE`.
- Simulated acceptance of the $11.09 quote, yard, and pickup. The record closed as a simulation. Physical authority stayed “NOT ISSUABLE”.
- One recorded confirm after that: `GET /live/stb-store-runtime.json` 200, `POST /api/store-zero/job` 200. No other host was requested.
- Developer notes were still on the bench and on the Store-answers page.

`npm test` passed, including the joint check that the Store checkout is `4cb0c625ac00c62390129b55a52596b52f10decd`.

## Five jobs

| Job | Screen | Current Store answer |
|---|---|---|
| Start your own | Kept | Fresh quote, as above. Not fully supportable. Machine blocked. |
| Critical fit | Kept | Not migrated. The request is refused as `LIVE_JOB_NOT_MIGRATED_YET`. |
| Space utilization | Kept | Not migrated. Same refusal. The extra spot on a chosen part stays on that screen and is not answered here. |
| Outdoor build | Kept | Not migrated. Same refusal. |
| Playhouse arched window | Kept | Not migrated. Same refusal. |

Closet cleats is not a tile.

## The bench reads one answer

Entering the bench, and every change to the job while on it, makes a revision and asks the Store about that revision through the same admit-and-inquire path. `benchAnswer()` in `public/live/stb-start-own-answer.mjs` is the bench's one reading of that inquiry: one status (not sent, asking, Store not reached, refused, unresolved, not accepted, budgetary, confirmed) and, only for a complete budgetary answer, the Store's board, remainder, Q and its parts. Every Store field on the bench, the Confirm gate and the trail's within-envelope decision read it. An answer counts only when the tile-host contract's `isCurrentAnswer()` matches it to the revision on the bench, its receipt names its own request and the Store pin, its Q equals the Store's listed components to the cent, and the Store's travel echoes the definition's parts and spots unchanged. Confirmed means the confirmed record names that answer's request.

Observed in a browser against Store `1cea72c8223b2c738180b230c584c4ab557267ca`, on 2026-10-09:

- 16 in SPF: `STB-ZERO-SPF-2X4-60-001`, 60 in, $2.61 + $5.93 = $8.54, 27⅝ in remains, spots at 8 in. No longer-board frame.
- 18 in SPF: `STB-ZERO-SPF-2X4-72-001`, 72 in, $3.13 + $5.94 = $9.07, 35⅝ in remains, spots at 9 in. The drawing is at 72 in with the 60 in requested minimum marked. The longer-board frame names the refused 60 in board and `LAST_REMAIN_BELOW_TWO_ROLLER_CONTROL`.
- 18 then 16 with the 18 in reply held back until after the 16 in reply: the bench stayed at 60 in and $8.54.
- Store unreachable, a reply naming another Store pin, and a reply whose receipt names another request: each showed “Store not reached” with its code, no board, no price and no remainder band.
- Change Wood is offered only after Intent adds it. Treated SYP came back unresolved (`GRADE_CHOICE_REQUIRED`, with the offered grades) and showed no price.
- Confirm at 18 in, then back to the bench: confirmed, same $9.07. Changing the length after that is a new budgetary revision, and Store answers and Your call close.

The Store's answer reports the remainder, not its retained-control minimum, so the bench no longer prints a “spare” figure or calls 24 in a Store-returned value.

Nothing here was published.
