# Five-job comparison

Not a migration claim. The published screens are not what this candidate shows.

## Deployed reference

The live page `system-build-current.html` was downloaded from the public site and compared byte for byte with System `main` at `bbcfd1a2c391d8a8121d02c9d5e6db14623a9541`.

Same file, same 258,752 bytes, same SHA-256 `00ce2d5104e180f23d70d9a25f023d7e60589a2393b0c617a80fc4678ffc72fd`.

The publish run that put that commit on the site is [37822597197](https://github.com/GeorgePlattDemo/scan-to-build-system/actions/runs/37822597197), completed 2026-10-08T18:14:18Z. The live response's last-modified time is 2026-10-08T18:14:10Z. These also matched that same commit: the trail contract, the front door, the window-seat page, the outdoor page, the window-seat hero, and `stb-store-runtime.json`.

`docs/project/CURRENT-SYSTEM-STATE.md` on that commit still names an older inspection (`be308947`). That file was not treated as the deployed bytes.

The published Store pin inside the app is `9c62d9d6f7775deef83d47196d32c9b5174a352c`, called at `https://store-zero-runtime-production.up.railway.app`. That host was not used for the checks below.

A byte copy of the published `public-build` tree is in `reference/published-app/`. It is not the page this candidate opens. Opening it as-is would call that old host.

## The five published names

From `stb-trail-contract.js` on that commit, the Shared Home tiles are:

| Tile | Published name | Pages |
| --- | --- | --- |
| start-own | Start your own | Idea (back), then Intent, proof store, your call, yard, terms, record |
| alcove | Critical fit | Idea, capture, config, review, store, request, yard, terms, recap, record |
| window-seat | Space utilization | One live page. Idea line may be Intent or One full scroll. |
| outdoor | Outdoor build | One live page |
| playhouse | Playhouse arched window | Idea, sheet, machine, store, review, request, yard, terms, result, record |

Every trail is Idea (unnumbered), then Intent, The bench, The Store answers, Your call, We cut it, Pick up & build.

## What this candidate shows instead

The candidate on `main` opens a generic library. The words, photographs, drawings, colors, and controls are not the published ones. Closet cleats is an extra job the published app does not have. Project 1 is a separate card. Neither replaces a live tile.

| Published job | Match | Missing or different | Interactions tested on the published screens | Result status |
| --- | --- | --- | --- | --- |
| Start your own | The board rule can build a demand. That is not the screen. | Idea, Intent, the bench drawing, catalog-backed wood, the derived angle, the six-step trail, and the wording are absent. | Not tested on the published screen. | Not a published-screen result. |
| Critical fit | A depth-strip cut list exists in the generic form. | Capture, photographs, the alcove pages, and the request the live page actually admits (`ALCOVE_INSERT_V1`) are absent. | Not tested on the published screen. | Not a published-screen result. |
| Space utilization | A window-seat extension exists in the generic form. | Hero, elevation, knobs, One full scroll, and the extra spot control are absent. | Not tested on the published screen. | Not a published-screen result. |
| Outdoor build | Two plans exist as form choices. | Photographs, the drawing, and the outdoor page are absent. | Not tested on the published screen. | Not a published-screen result. |
| Playhouse arched window | A sheet form exists. | The idea-to-record pages and the drawn opening are absent. | Not tested on the published screen. | Not a published-screen result. |

Earlier Store HTTP checks (Project 1, a second board, an alcove cut list, playhouse, window seat, outdoor) were against Store Zero, not against these five screens. They do not count as a migrated experience.

## Board ends

Published Start your own puts these on the demand together: `endRelation: "parallel"`, `lengthDatum: "long-long-outer-edge"`, `endIdentity: "both"`, `cutPlane: "miter-face"`.

The length, the angle, and the spot do not read `endIdentity`. The angle is `asin(span / finished length)`. The spot is `finished length / 2`. The workpiece length on that demand is 60 in. Omitting the string `"both"` does not change those three formulas.

It does remove a field the published page sends. Store Zero's reference-cell lowering refuses any non-null `requirements.endIdentity` with `END_IDENTITY_NOT_REGISTERED_ON_MACHINE`. That was read from Store Zero `4cb0c625`, file `src/machine/lowering.mjs`. It was not a new run of the published drawing.

No edit was made to stop the published page sending `"both"`.

## Window seat spot

On the published window-seat page the control is the added knob `XSPOT`, labeled "One more spot, on a part you pick". The person picks the part, a distance in from its end, and a placement across the board. The spot is 3/16 in wide and 3/16 in deep. If any of the three is missing, the page blocks: "The extra spot needs a part, a distance and a placement." It is not moved onto another part. It is off until added.

This candidate's generic window seat does not have that control. That was an unauthorized omission. It is not corrected by this note.

## Definitions

`docs/DEFINITIONS.md` in this candidate exists and can be read. It is a shortened glossary. It is not the application.

The governing pages are readable:

- System `docs/definitions/README.md` at `bbcfd1a2c391d8a8121d02c9d5e6db14623a9541`
- Store `docs/DEFINITIONS.md` at `96a671d8c11301663723118a251d5d798ada5b9e`

Neither file, and not the published HTML, contains the label `docs/DEFINITIONS.md [blocked]`. Nothing here was blocked from being read. The candidate summary must not stand in for those pages or for the explanation on the five jobs.

## Store commits named in this note

| Identity | Commit | What was done |
| --- | --- | --- |
| Published app, byte-matched | `bbcfd1a2c391d8a8121d02c9d5e6db14623a9541` | File comparison only. Live repos not edited. |
| Published Store pin | `9c62d9d6f7775deef83d47196d32c9b5174a352c` | Read from the published runtime file. Not called. |
| Candidate Store pin in source | `4cb0c625ac00c62390129b55a52596b52f10decd` | The pin the candidate code names. |
| Older Store Zero checkout still on disk | `d0c15fcd70b4357c8fa61d5505b95ec68cea8e65` | Not the pin in the candidate source. |

## Conflict, not yet acted on

The published pages call the old host, and `stb-store-handoff-contract.js` carries reference answers at pin `9c62d9d6`. Serving those pages unchanged keeps the pictures and the words, and also keeps a runtime call to the old host and those reference answers. Stripping the reference answers changes the published bench. That swap was not made.

## READMEs

The live System, Store, and Program README files were not edited.
