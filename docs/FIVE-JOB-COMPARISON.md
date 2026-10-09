# Five-job comparison

One job is migrated. The other four are not.

## Deployed reference

The live page `system-build-current.html` was downloaded from the public site and compared byte for byte with System `main` at `bbcfd1a2c391d8a8121d02c9d5e6db14623a9541`.

Same file, same 258,752 bytes, same SHA-256 `00ce2d5104e180f23d70d9a25f023d7e60589a2393b0c617a80fc4678ffc72fd`.

The publish run that put that commit on the site is [37822597197](https://github.com/GeorgePlattDemo/scan-to-build-system/actions/runs/37822597197), completed 2026-10-08T18:14:18Z. The live response's last-modified time is 2026-10-08T18:14:10Z. These also matched that same commit: the trail contract, the front door, the window-seat page, the outdoor page, the window-seat hero, and `stb-store-runtime.json`.

`docs/project/CURRENT-SYSTEM-STATE.md` on that commit still names an older inspection (`be308947`). That file was not treated as the deployed bytes.

The published Store pin inside the app is `9c62d9d6f7775deef83d47196d32c9b5174a352c`, called at `https://store-zero-runtime-production.up.railway.app`. That host was not used.

A byte copy of the published `public-build` tree is in `reference/published-app/`. Opening that copy as-is would call the old host. The running page does not open that copy.

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

## What is on the front door now

The front door is the published five-job shell. The generic library is at `/bench`. It is not a tile and it is not a migrated job.

`reference/published-app/` is still the untouched byte copy of the publication, including the old host. It is not the page that opens.

The served copy differs from that byte copy in three files, and only as plumbing:

| File | What changed |
| --- | --- |
| `stb-store-runtime.json` | Job and offering calls go to `same-origin:/api/store-zero/job` and `same-origin:/api/store-zero/offering`. Pin is `4cb0c625ac00c62390129b55a52596b52f10decd`. The old host name is not in this file. |
| `stb-store-client.js` | A `same-origin:` prefix is resolved on this origin. The screen text is unchanged. |
| `system-build-current.html` | Reopening reads the saved length and wood back onto the controls. The three end names are shown on the Store answer as kept on the job, not accepted as Store board fields. The original sentences stay. |

No other published file was edited. The five tile names on the shared home were read from the running page: Start your own, Critical fit, Space utilization, Outdoor build, Playhouse arched window. Closet cleats is not a tile.

## Start your own — migrated on this page

Checked on the running page, with the old host blocked and no call to it in the network log. The confirm call was `POST /api/store-zero/job` and it returned 200. Four earlier job posts on that same load returned 422. Those are not this job's answer. The adapter returns `LIVE_JOB_NOT_MIGRATED_YET` for every request type other than `USER_DEFINED_BOARD_V1` and `OFFERING_LOOKUP`.

| Check | What the page did |
| --- | --- |
| Opens | Intent, not the generic form. Heading "Start your own project". Length control 16. |
| History is not the answer | "The displayed Store reference is history/preview. Confirm requests a fresh Store Zero evaluation before the Store Answer step." |
| 16 in geometry | 30.000° ends. Spot 8 in, from 16 ÷ 2. |
| 18 in control | Length 18. Drawn parts read 18 in. Angle 26.388°. Spot 9 in, from 18 ÷ 2. The original static "16 in" label is hidden; the live drawing is the one that changes. |
| Fresh Store answer at 18 in | "The Store can support this version. Estimated total: $9.07." Q `$9.07 · BudgetaryEstimate`. This is not the 16 in figure of $8.54. |
| Board the Store picked | SKU `STB-ZERO-SPF-2X4-72-001`. The defined-workpiece line stays "60 in · confirmed project fact", which is the project's minimum, not the selected board. |
| Store pin | `4cb0c625ac00c62390129b55a52596b52f10decd` |
| Modeled time | 1.4250 min · `STB-D001-DIMENSIONAL-TRAVEL-0.1` |
| End names | Shown, not deleted: "Kept on this job, not accepted as a field on this Store request: endIdentity = both; endRelation = parallel; lengthDatum = long-long-outer-edge." |
| Your call | "ACCEPT SIMULATED OFFER & SEND TO STORE · $9.07 →". Thread: "X BRACE · 2 × 18 in · 26.4° ends · spot 9 in". The page says no money moves. |
| Yard | Same pin and $9.07. "no money moved". Run the yard reached READY. Physical authority stays "NOT ISSUABLE". No machine runs. |
| Pickup | "PICKED UP. GO FIX THAT BENCH." Terms / handoff receipt. "no money moved and no machine ran." |
| Reopen | Saved length comes back as 18. Angle comes back as 26.388°. The history/preview sentence is showing. "The Store answers" stays disabled. The Store pin on that step stays "—" and Q stays "NOT COMPLETE" until a new confirm. The saved $9.07 is not the current answer. |

The 16 in path was checked earlier on this same page: Q $8.54, same pin, same carried end names. The 18 in path is the one recorded above because it is the change that cannot be confused with the HTML default.

## The other four — not migrated

Their published screens are in the shell. Their Store request types are not accepted by this replacement path. A successful generic-form price does not count. No interaction on those four jobs was walked as a migration.

| Published job | Screen present | Store path | Status |
| --- | --- | --- | --- |
| Critical fit | Published pages are in the shell. The live page admits `ALCOVE_INSERT_V1`. | That type is refused here with `LIVE_JOB_NOT_MIGRATED_YET`. It was not rewritten into a cut package. | Not migrated |
| Space utilization | Published window-seat page, including the `XSPOT` control labeled "One more spot, on a part you pick". | Not walked. Not a current Store answer. | Not migrated |
| Outdoor build | Published outdoor page and its photographs. | Not walked. Not a current Store answer. | Not migrated |
| Playhouse arched window | Published idea-to-record pages are in the shell. | Not walked. Not a current Store answer. | Not migrated |

## Board ends

Published Start your own puts these on the demand together: `endRelation: "parallel"`, `lengthDatum: "long-long-outer-edge"`, `endIdentity: "both"`, `cutPlane: "miter-face"`.

The length, the angle, and the spot do not read `endIdentity`. The angle is `asin(span / finished length)`. The spot is `finished length / 2`. The workpiece length the project asks for is 60 in. Omitting the string `"both"` does not change those three formulas.

Store Zero's board shape does not accept `endIdentity`, `endRelation`, or `lengthDatum`. They are not stripped off the screen. They are kept on the job and reported on the Store answer, as the 18 in check shows. `cutPlane: "miter-face"` is sent.

## Window seat spot

On the published window-seat page the control is the added knob `XSPOT`, labeled "One more spot, on a part you pick". That page is the one the Space utilization tile loads. The control was not removed.

That job has not been migrated. The extra spot has not been sent to the replacement Store, and it has not been shown as a current answer. The generic library still does not have this control. That library is not the job.

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
| Published Store pin | `9c62d9d6f7775deef83d47196d32c9b5174a352c` | Read from the published runtime file in the reference copy. Not called. |
| Replacement Store pin | `4cb0c625ac00c62390129b55a52596b52f10decd` | Answered the Start your own confirm. |
| Older Store Zero checkout still on disk | `d0c15fcd70b4357c8fa61d5505b95ec68cea8e65` | Not the pin that answered. |

## Not done

This is one migrated job. It is not a five-job migration. Nothing was published. The live deployment and the live repositories were not edited and were not connected.

## READMEs

The live System, Store, and Program README files were not edited.