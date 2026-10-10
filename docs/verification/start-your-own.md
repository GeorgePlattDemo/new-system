# The five jobs — what answers, and what does not

This note is not part of the job. The five project screens do not link here.

Current as of 2026-10-10, against Store release `81d958482bd25e784f122c97ffb11174013395af`: the commit in `STORE_CANDIDATE`, `public/live/stb-store-runtime.json`, the CI Store checkout and `startup.sh`. Physical admission stays blocked. Earlier observations against earlier Store commits are kept under [History](#history); they are not current findings.

## What supplies a current answer

| Piece | Role | Supplies the current answer? |
|---|---|---|
| Published screens, drawings, developer notes, build-guide rails | Presentation | No |
| Intent and the Bench on each screen | Job definition | Defines the job. Does not price it. |
| Tile-host admission | Decides whether this revision may be asked | No price |
| Store client and `stb-store-runtime.json` | Same-origin `POST /api/store-zero/job` and offering lookup, pin `81d958482bd25e784f122c97ffb11174013395af` | Carries the answer. Does not invent one. |
| `src/system/store/published-wire.ts` | Puts the published definition in the Store's request shape and asks the pinned Store. Anything the definition states that it does not read travels to the Store as stated, and the Store's contract refuses an undeclared field by name. | Returns the Store's answer, then says whether that answer is the whole job. |
| Terms flow | Simulated acceptance, yard and pickup | Accepts a quote only. No machine admission. |
| Saved records | Reopen a definition | Not a current price, and not acceptance |

No copied Store answer or specimen travels with a page. Every price shown comes from the Store, asked for the current revision.

## Five jobs

| Job | Request the Store receives | Current Store answer |
|---|---|---|
| Start your own | `USER_DEFINED_BOARD_V1` | Fresh quote. End relation and length datum are sent and evaluated; a supplied end identity redundant with that datum is reconciled, not deleted. Machine blocked. |
| Critical fit (Alcove) | `CUT_PACKAGE_V1`, translated from the published insert | Fresh answer. The milled path and depth are not a Store field: they stay on the job as unevaluated, and the job is `NOT_FULLY_SUPPORTABLE`. Your call does not open (see Open items). |
| Space utilization (Window Seat) | `CUT_PACKAGE_V1` | Fresh answer. An extra spot on a chosen part is sent as a spot on that part. Asks the Store has no line for stay on the screen as "kept, not sent". |
| Outdoor build | `CUT_PACKAGE_V1` | Fresh answer for the committed table and for the option prices. |
| Playhouse arched window | `SHEET_PACKAGE_V1` | Fresh answer. A custom split with no tab positions is `UNRESOLVED` with `SPLIT_TAB_POSITIONS_REQUIRED`, and no Q. |

A request type the adapter does not translate is refused as `LIVE_JOB_NOT_MIGRATED_YET`. Closet cleats is not a tile.

## What was exercised on 2026-10-10

Automated, `npm test` against a checkout whose `git rev-parse HEAD` is `81d958482bd25e784f122c97ffb11174013395af` (322 tests, all passing), including:

- Start your own: 16 in SPF $8.54 on `STB-ZERO-SPF-2X4-60-001` ($2.61 wood + $5.93 machine); 18 in SPF $9.07 on `STB-ZERO-SPF-2X4-72-001` ($3.13 + $5.94); treated SYP with no grade `UNRESOLVED`; 84 in `REFUSED`. Machine admission `BLOCKED` on each.
- Stale and foreign answers: another Store pin, another request's receipt, an older revision's reply arriving late, a caller-supplied pin. Each is rejected.
- Playhouse: the default sheet $76.57; an added crosscut is priced; a cut through the opening, an opening outside the 48 × 36 in field, and a mixed-axis saw plan are refused; a custom split with omitted, null or empty tab positions is unresolved with no Q; with positions it is evaluated.
- Cut packages and sheets: a field the translator does not read (a bore on a part, a bevel on an end cut, an unknown sheet or feature field) reaches the Store and is refused by name.
- Alcove: the mill path and depth stay unevaluated and block a full-job claim.

In a browser, on a local build of this commit asking a local Store process started from that checkout, through the app's own `/api/store-zero/job` route. This is not the deployed application:

- Start your own: entering the bench, 16 in and 18 in each asked the Store fresh ($8.54, $9.07); Confirm asked again and opened Store answers and Your call.
- Playhouse: the default asked fresh ($76.57). Straight height 25 in asked fresh and was refused (`CENTER_WORK_FIELD_EXCEEDED`); Your call, We cut it and Pick up & build went inert. Back to 24 in asked again.
- Playhouse custom split, sent from the page to the app's own route: no positions and empty positions came back `UNRESOLVED`, `SPLIT_TAB_POSITIONS_REQUIRED`, `NOT_SUPPORTABLE`, no Q; positions `[6, 20]` came back priced. The Playhouse screen has no custom-split control.
- Outdoor: a 216 in table came back `NOT_ALL_LINES_SUPPORTABLE`; Confirm and Your call went inert.
- Window Seat: Intent and the Bench asked fresh; Your call opened on a supportable answer.
- Alcove: asked fresh on entry; Store answers showed the Store's budgetary figure; Accept and Your call stayed inert.

The deployed application was not reachable from the session that made these checks. Browser acceptance of the deployed application is not verified here.

## Open items

- Alcove's Your call gate waits for a price-completeness status (`COMPLETE_FOR_DECLARED_COMPONENT_TRAVEL`) the adapter never returns, so Alcove never reaches Your call. It fails closed. The Store answers page shows the Store's figure without saying that the milled work is unevaluated.
- Outdoor spots carry no feature id, and the cut-package path blocks a spot without one (`PUBLISHED_DEFINITION_INCOMPLETE`), so an Outdoor table with added spots is not asked.

## History

These were observed against earlier Store commits. They are kept as history and are not current findings.

Checked 2026-10-08 against Store `4cb0c625ac00c62390129b55a52596b52f10decd`:

- Start your own quotes: $8.54 (16 in SPF), $9.07 (18 in SPF), $11.09 (18 in treated SYP), $11.08 (16 in treated SYP). The end facts `endIdentity = both`, `endRelation = parallel` and `lengthDatum = long-long-outer-edge` were kept on the job unevaluated, so the job was presented as not fully supportable. The Store now evaluates end relation and length datum.
- The other four jobs were refused as `LIVE_JOB_NOT_MIGRATED_YET`. They have since been translated to the Store's cut-package and sheet-package requests.
- Store stopped: Confirm stayed on the bench with `STORE_ZERO_UNAVAILABLE`. An 84 in brace was refused. Save and reopen brought back the definition, not the price. Simulated acceptance of a quote closed as a simulation with physical authority "NOT ISSUABLE".

Observed in a browser against Store `1cea72c8223b2c738180b230c584c4ab557267ca`, on 2026-10-09:

- 16 in SPF on the 60 in board; 18 in SPF on the 72 in board with the longer-board frame naming `LAST_REMAIN_BELOW_TWO_ROLLER_CONTROL`; an 18 in reply held back until after a 16 in reply did not replace the 16 in answer; an unreachable Store, a reply naming another pin, and a receipt naming another request each showed "Store not reached" with no price; treated SYP came back `GRADE_CHOICE_REQUIRED`.
