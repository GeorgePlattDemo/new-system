# Requirement matrix

Store candidate inspected: `4cb0c625ac00c62390129b55a52596b52f10decd`. The HTTP test reads `git rev-parse HEAD` and stops if that is not this commit. Not an approved production release. Not connected to live.

| Requirement | Implementation | Test | Status |
| --- | --- | --- | --- |
| Create, edit, save, reopen, evaluate without source edits | Session record, library recipes, save revision | `system.test.ts` edit, reopen, library | Implemented |
| One Store adapter, exact bytes, digest, release, receipt | `serializeRequest`, `interpretStoreHttp`, `forwardStoreRequest` | protocol test + HTTP test | Implemented |
| Receipt agrees with the answer, the release, the demand, and a real timestamp | `receiptProblems` | contradictory receipt, bad time, other release | Implemented |
| System does not price or rebuild receipts | Money is read off the answer. Hash only verifies. | HTTP prices asserted as returned | Implemented |
| Current acceptance follows the current answer | `visibleState` matches the live receipt | refusal after acceptance | Implemented |
| Nested saved records are validated | `loadRecord` | `projects: [null]`, round trip | Implemented |
| Malformed file and storage failure stay visible | Library and project page export; empty file is explicit | Not an automated browser test | Implemented in the page |
| Declared input types and bounds | `checkInputs` before the rule | invalid spots; zero shelves | Implemented |
| Retired `ALCOVE_INSERT_V1` and `BOARD_SQUARE_V1` stay refused | Not in the library. HTTP sends the retired name only as a negative test. | library test + HTTP | Implemented |
| Missing fact blocks before Store | Compiler blockers, `beginInquiry` | missing species | Implemented |
| Dispositions stay distinct. Partial is not full Q. Discovery is not Q. | `presentMoney`, visible states | unit tests | Implemented |
| Transport failure is not REFUSED or zero | `interpretStoreHttp` | unit test | Implemented |
| Late answer after edit or project switch | `activeAttemptId`, `selectProject` | unit tests | Implemented |
| Duplicate acceptance | decision keyed by revision + receipt hash | unit test | Implemented |
| Unknown saved version is not converted | `loadRecord` | unit test | Implemented |
| Reload retires a saved price without converting the file | `parkForReopen` on open | unit test | Implemented |
| Five experiences migrated | start-own, alcove, window-seat, outdoor, playhouse | compile + HTTP | Implemented as jobs, not as the old pages |
| Sixth job is data only | closet-cleats on `part-groups` | unit + HTTP SUPPORTABLE; lowering refused | Implemented |
| Project 1 and a second board share one rule | `board-workpiece` | demand equals published fixture; HTTP Q 11.09 and 8.54 | Implemented |
| Published Project 1 evidence unchanged | `reference/project-1/published/` | Q 11.09, times differ, physical BLOCKED | Preserved, not recomputed |
| Board end identity | null is omitted; a supplied string is sent | unit + HTTP `END_IDENTITY_NOT_REGISTERED_ON_MACHINE` | Reconciled, not deleted |
| Virtual evidence | `POST /v1/machine-evidence` on the pinned Store | Project 1 `VIRTUAL_EVIDENCE_READY`, time 86.46953628299116 s, admission BLOCKED | Implemented against this commit |
| Cut and sheet lowering | Store refusal, no local engine | HTTP `LOWERING_NOT_REGISTERED_FOR:CUT_PACKAGE_V1` | They fail, on purpose |
| Physical admission blocked, zero commands | Store admission plus System refusal of `physicalAuthority: true` | HTTP + unit | Implemented as a block |
| Checkout identity | `git rev-parse HEAD` before the joint test | HTTP test | Implemented |
| One verification command | `npm test` plus `.github/workflows/verify.yml` | CI checks out the pin | Checked in |
| Live cutover | not touched | — | Out of scope |

Window seat uses engine extension `window-seat-layout/1`. An extra hand-placed spot from the old page is not a control here. Each job page shows inputs, derived parts, requirements, Store findings, unresolved conditions, and acceptance history.
