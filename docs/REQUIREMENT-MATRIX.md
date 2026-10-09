# Requirement matrix

Store candidate inspected: `d0c15fcd70b4357c8fa61d5505b95ec68cea8e65`. Not an approved production release.

| Requirement | Implementation | Test | Status |
| --- | --- | --- | --- |
| Create, edit, save, reopen, evaluate without source edits | Session record, library recipes, save revision | `system.test.ts` edit, reopen, library | Implemented |
| One Store adapter, exact bytes, digest, release, receipt | `serializeRequest`, `interpretStoreHttp`, `forwardStoreRequest` | protocol test + HTTP test | Implemented |
| System does not price or rebuild receipts | Money is read off the answer. Hash only verifies. | HTTP prices asserted as returned | Implemented |
| Retired `ALCOVE_INSERT_V1` and `BOARD_SQUARE_V1` stay refused | Not in the library. HTTP sends the retired name only as a negative test. | library test + HTTP | Implemented |
| Missing fact blocks before Store | Compiler blockers, `beginInquiry` | missing species | Implemented |
| Dispositions stay distinct. Partial is not full Q. Discovery is not Q. | `presentMoney`, visible states | unit tests | Implemented |
| Transport failure is not REFUSED or zero | `interpretStoreHttp` | unit test | Implemented |
| Late answer after edit or project switch | `activeAttemptId`, `selectProject` | unit tests | Implemented |
| Duplicate acceptance | decision keyed by revision + receipt hash | unit test | Implemented |
| Unknown saved version is not converted | `loadRecord` | unit test | Implemented |
| Reload retires a saved price without converting the file | `parkForReopen` on open | unit test + bench reopen of closet cleats | Implemented |
| Five experiences migrated | start-own, alcove, window-seat, outdoor, playhouse | compile + HTTP for four; window seat probed SUPPORTABLE $1489.09 | Implemented |
| Sixth job is data only | closet-cleats on `part-groups` | unit + HTTP SUPPORTABLE | Implemented |
| Project 1 and a second board share one rule | `board-workpiece` | demand equals published fixture; HTTP Q 11.09 and 8.54 | Implemented |
| Published Project 1 evidence unchanged | `reference/project-1/published/` | Q 11.09, times differ, physical BLOCKED | Preserved, not recomputed |
| Cut/sheet lowering unsupported. Board lowering not agreed over HTTP. | `machineView` | unit test | Explicitly not built |
| Physical admission blocked, zero commands | `machineView` | unit test | Implemented as a block |
| Virtual motion records | not fabricated | trail says none | Specified, not built |
| Store malformed-input fixes and a versioned machine endpoint | not in this candidate | — | Blocker |
| Live cutover, pins, origins, old repos | not touched | — | Out of scope |

Window seat uses engine extension `window-seat-layout/1`. An extra hand-placed spot from the old page is not a control here.
