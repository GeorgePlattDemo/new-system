import assert from "node:assert/strict";
import { execFileSync, spawn, type ChildProcess } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { STORE_CANDIDATE } from "./store-candidate.ts";
import { answerPublishedWire } from "./store/published-wire.ts";
import {
  BENCH_STATUS,
  benchAnswer,
  budgetaryGaps,
  isChangeWoodTool,
  reconciles,
} from "../../public/live/stb-start-own-answer.mjs";

/*
 * Project 1 on the bench, against the pinned Store. Every answer here is a real Store answer for a request built by
 * the published bridge, sent through the published-wire adapter, stamped by the tile-host contract's inquire(),
 * and read by the bench's one projection. Nothing below supplies a price.
 */

type Json = Record<string, any>;
type Admission = Json;
type Part = { partId: string; lengthIn: number; features: { featureId: string; xIn: number }[] };
type Revision = { definitionRevisionId: string; tileId: string; facts: Record<string, { value: unknown; status: string }> };
type TileHostContract = {
  admit: (input: { revision: Revision; inquiryScope: string }) => Admission;
  inquire: (admission: Admission, ask: (request: Json) => Promise<Json>) => Promise<{ reachedStore: boolean; answer: Json | null }>;
  isCurrentAnswer: (input: { admission: Json | null; answer: Json | null }) => boolean;
};
type Bridge = { payloadFromDemand: (demand: Json, material: Json) => Json };
type Inquiry = Parameters<typeof benchAnswer>[0]["inquiry"];

const SCOPE = "USER_DEFINED_BOARD_V1";
const REQUESTED_MINIMUM_IN = 60;
const release = STORE_CANDIDATE.inspectedCommit;

// The published page's own modules: the tile-host contract and the User 1 bridge.
const contract: TileHostContract = await import(new URL("../../public/live/shared/tile-host-admission-contract.mjs", import.meta.url).href);
const bridgeWindow: { STBUserDefinedBoardRuntimeBridge?: Bridge } = {};
vm.runInNewContext(readFileSync(new URL("../../public/live/stb-user-defined-board-runtime-bridge.js", import.meta.url), "utf8"), { window: bridgeWindow });
const bridge = bridgeWindow.STBUserDefinedBoardRuntimeBridge;
if (!bridge) throw new Error("The published User 1 bridge did not load.");

let child: ChildProcess | null = null;
let origin = "";
async function storeOrigin() {
  if (origin) return origin;
  const root = process.env.STORE_ZERO_ROOT;
  if (!root) throw new Error("STORE_ZERO_ROOT is required. The bench is tested against the pinned Store, not a mock.");
  const head = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
  if (head !== release) throw new Error(`Store checkout ${head} is not the pinned commit ${release}.`);
  child = spawn(process.execPath, ["src/service/server.mjs"], {
    cwd: root,
    env: { ...process.env, STORE_ZERO_RELEASE: release, HOST: "127.0.0.1", PORT: "0" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let log = "";
  child.stdout?.on("data", (chunk) => { log += chunk.toString(); });
  child.stderr?.on("data", (chunk) => { log += chunk.toString(); });
  const port = await new Promise<string>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(log || "store did not start")), 8000);
    const wait = () => {
      const match = log.match(/listening on (\d+)/);
      if (match) {
        clearTimeout(timer);
        resolve(match[1]);
        return;
      }
      setTimeout(wait, 30);
    };
    wait();
  });
  origin = `http://127.0.0.1:${port}`;
  return origin;
}
test.after(() => {
  child?.kill("SIGTERM");
});

/** The brace as the page defines it: finished length L, spot at L / 2, the 8 in span angle, 60 in requested. */
function braceJob(lengthIn: number, material: Json = { species: "spf", form: "board", nominalT: 2, nominalW: 4 }, ops = ["MITER_LIMITED", "SPOT_ON_LOCATION"]) {
  const spotIn = Number((lengthIn / 2).toFixed(6));
  const sawAngleDeg = Number(((Math.asin(8 / lengthIn) * 180) / Math.PI).toFixed(12));
  const parts: Part[] = [1, 2].map((index) => ({
    partId: `PART-${index}`,
    lengthIn,
    features: [{ featureId: `SPOT-${index}`, kind: "SPOT_ON_LOCATION", xIn: spotIn, locationRule: "CENTERED_ON_PART", acrossWidthRule: "CENTERED_ON_WIDE_FACE" }],
  }));
  const datum = { sawAngleDeg, cutPlane: "miter-face", endIdentity: "both", endRelation: "parallel", lengthDatum: "long-long-outer-edge", datumCMethod: "REFERENCE_CUT" };
  return { lengthIn, spotIn, material, ops, parts, datum };
}
type BraceJob = ReturnType<typeof braceJob>;

function revisionOf(job: BraceJob, revisionId: string): Revision {
  return {
    definitionRevisionId: revisionId,
    tileId: "start-own",
    facts: {
      "start-own.material": { value: job.material, status: "CONFIRMED" },
      "start-own.workpiece-length": { value: REQUESTED_MINIMUM_IN, status: "CONFIRMED" },
      "start-own.parts": { value: job.parts, status: "CONFIRMED" },
      "start-own.operations": { value: job.ops, status: "DERIVED" },
      "start-own.datum": { value: job.datum, status: "DERIVED" },
      "start-own.spot-demand": { value: { required: true, mode: "SPOT_ON_LOCATION", totalCount: 2 }, status: "CONFIRMED" },
    },
  };
}

function payloadFor(job: BraceJob, facts: Json) {
  return bridge!.payloadFromDemand({
    configurationId: "SYO-USER1-XBRACE",
    configurationVersion: job.lengthIn === 16 ? "0.1" : job.lengthIn === 18 ? "0.2" : "review",
    definedWorkpieceLengthIn: facts["start-own.workpiece-length"],
    ...facts["start-own.datum"],
    requiredOps: facts["start-own.operations"],
    declaredSawCuts: facts["start-own.parts"].length + 1,
    declaredSpotCount: 2,
    parts: facts["start-own.parts"],
  }, facts["start-own.material"]);
}

let requestSequence = 0;
/** Admit the revision, then inquire through the published bridge payload and the published-wire adapter. */
async function ask(job: BraceJob, revisionId: string) {
  const admission = contract.admit({ revision: revisionOf(job, revisionId), inquiryScope: SCOPE });
  const base = await storeOrigin();
  const result = await contract.inquire(admission, async (request) => {
    const requestId = `bench-test-${++requestSequence}`;
    const answered = await answerPublishedWire({
      protocolVersion: "stb-store-zero-http/1", requestId, attemptId: `attempt-${requestSequence}`, attemptNumber: 1,
      projectId: "start-own", candidateRevisionId: revisionId, requestType: SCOPE, scope: SCOPE,
      demandSignature: "signed-by-the-browser", querySignature: null, payloadDigest: "digested-by-the-browser",
      expectedStorePin: release, sentAt: new Date().toISOString(), payload: payloadFor(job, request.facts),
    }, base);
    assert.equal(answered.httpStatus, 200, JSON.stringify(answered.body).slice(0, 300));
    return answered.body;
  });
  return { admission, answer: result.answer };
}

function inquiryOf(admission: Admission | null, answer: Json | null, extra: Partial<Inquiry> = {}): Inquiry {
  return { admission, answer, asking: false, askedRevisionId: null, failure: null, ...extra };
}

function read(job: BraceJob, revisionId: string, inquiry: Inquiry, confirmedRequestId: string | null = null) {
  return benchAnswer({ revisionId, requestedMinimumIn: REQUESTED_MINIMUM_IN, parts: job.parts, inquiry, isCurrentAnswer: contract.isCurrentAnswer, confirmedRequestId });
}

const cents = (value: number) => Math.round(value * 100);
/** A copy of a real answer with one fact changed, for checking that the bench refuses it. */
function altered(answer: Json, change: (copy: Json) => void) {
  const copy = JSON.parse(JSON.stringify(answer));
  change(copy);
  return copy;
}
function required<T>(value: T | null | undefined): T {
  assert.ok(value != null, "expected a Store answer");
  return value;
}

test("16 in SPF: the Store's 60 in board, its own Q, and the definition's 8 in spots, one status everywhere", async () => {
  const job = braceJob(16);
  const { admission, answer } = await ask(job, "SYO-USER1-XBRACE-0.1-v2");
  const view = read(job, "SYO-USER1-XBRACE-0.1-v2", inquiryOf(admission, answer));
  assert.equal(view.status, BENCH_STATUS.BUDGETARY);
  assert.equal(view.quote, true);
  assert.equal(view.confirmed, false);
  assert.equal(view.selection?.sku, "STB-ZERO-SPF-2X4-60-001");
  assert.equal(view.selection?.stockLengthIn, 60);
  assert.equal(view.economics?.material, 2.61);
  assert.equal(view.economics?.machineService, 5.93);
  assert.equal(view.economics?.q, 8.54);
  assert.equal(view.work?.finalRemainderIn, 27.625);
  assert.equal(view.swap.visible, false);
  assert.equal(view.identity?.definitionRevisionId, "SYO-USER1-XBRACE-0.1-v2");
  assert.equal(view.identity?.storePin, release);
  // The definition's spot survived the exchange: the Store's travel names each feature at L / 2.
  const travel = required(answer).rawEstimate.travel;
  const features = (travel.parts as Json[]).map((part) => (part.features as Json[]).map((feature) => [feature.featureId, feature.kind, feature.xIn]));
  assert.deepEqual(features, [[["SPOT-1", "SPOT_ON_LOCATION", 8]], [["SPOT-2", "SPOT_ON_LOCATION", 8]]]);
  const spotOps = (travel.operationPlan as Json[]).filter((op) => op.kind === "SPOT_ON_LOCATION");
  assert.deepEqual(spotOps.map((op) => [op.partRelativeXIn, op.fullDiameterDepthIn, op.acrossWidthRule]), [[8, 0.1875, "CENTERED_ON_WIDE_FACE"], [8, 0.1875, "CENTERED_ON_WIDE_FACE"]]);
});

test("18 in SPF: Store refuses 60 in on retained control, selects 72 in, and the longer-board frame says why", async () => {
  const job = braceJob(18);
  const { admission, answer } = await ask(job, "SYO-USER1-XBRACE-0.1-v3");
  const view = read(job, "SYO-USER1-XBRACE-0.1-v3", inquiryOf(admission, answer));
  assert.equal(view.status, BENCH_STATUS.BUDGETARY);
  assert.equal(view.selection?.sku, "STB-ZERO-SPF-2X4-72-001");
  assert.equal(view.selection?.stockLengthIn, 72);
  assert.equal(view.selection?.requestedMinimumIn, 60);
  assert.equal(view.economics?.material, 3.13);
  assert.equal(view.economics?.machineService, 5.94);
  assert.equal(view.economics?.q, 9.07);
  assert.equal(view.work?.finalRemainderIn, 35.625);
  assert.deepEqual(view.refusedCandidates.map((row) => [row.storeSku, row.stockLengthIn, row.reason]), [["STB-ZERO-SPF-2X4-60-001", 60, "LAST_REMAIN_BELOW_TWO_ROLLER_CONTROL"]]);
  assert.equal(view.swap.visible, true);
  assert.match(view.swap.html, /^<b>The Store grabbed a longer board\.<\/b>/);
  assert.match(view.swap.html, /refused it: after the last cut, the board left behind would be too short for the machine&#39;s two holding rollers/);
  assert.match(view.swap.html, /6-foot 2×4 \(72 in\) \(STB-ZERO-SPF-2X4-72-001\)/);
  assert.match(view.swap.html, /comes back with your stub: 35⅝ in/);
  assert.match(view.swap.html, /STB-ZERO-SPF-2X4-60-001 · 60 in · REFUSED · LAST_REMAIN_BELOW_TWO_ROLLER_CONTROL/);
  assert.doesNotMatch(view.swap.html, /no 60 in board|not available|unavailable/i);
  const travel = required(answer).rawEstimate.travel;
  assert.deepEqual((travel.parts as Json[]).map((part) => part.features[0].xIn), [9, 9]);
});

test("the Store's numbers reconcile by its own convention, and the bench shows them without computing a price", async () => {
  for (const length of [16, 18]) {
    const job = braceJob(length);
    const answer = required((await ask(job, `SYO-USER1-XBRACE-arith-${length}`)).answer);
    const estimate = answer.rawEstimate;
    const totals = estimate.totals;
    // Q = material + items + machine service, to the cent; every component the Store lists is counted.
    assert.equal(cents(totals.material) + cents(totals.hardware) + cents(totals.machine_service), cents(totals.Q));
    // Machine service = modeled machine hours × the Store's declared sell rate, rounded to the cent.
    assert.equal(cents(totals.machine_service), cents(estimate.travel.time.T_MACHINE_hr * estimate.economics.sellRatePerHour));
    // Material is the selected board's selling price, quantity one.
    assert.equal(totals.material, answer.materialResolution.unitPrice);
    assert.equal(totals.Q_basis, "CALCULATED_FROM_DECLARED_STAGE2_MODEL");
    assert.equal(reconciles(totals), true);
    // The modeled time the bench shows is the same machine time the price used.
    assert.equal(estimate.cycle.T_job_min, estimate.travel.time.T_MACHINE_min);
  }
});

test("a contradictory price is refused, not displayed: $3.13 + $5.94 is not $8.54", async () => {
  const job = braceJob(18);
  const { admission, answer } = await ask(job, "SYO-USER1-XBRACE-0.1-v4");
  const contradiction = altered(required(answer), (copy) => { copy.rawEstimate.totals.Q = 8.54; });
  const view = read(job, "SYO-USER1-XBRACE-0.1-v4", inquiryOf(admission, contradiction));
  assert.equal(view.status, BENCH_STATUS.INVALID);
  assert.equal(view.quote, false);
  assert.equal(view.economics, null);
  assert.deepEqual(view.reasons, ["STORE_TOTALS_DO_NOT_RECONCILE"]);
  assert.equal(view.swap.visible, false);
});

test("missing money stays missing: a null Q, a null service or a non-number item is never a quote", async () => {
  const job = braceJob(16);
  const answer = required((await ask(job, "SYO-USER1-XBRACE-0.1-v5")).answer);
  const cases: [string, (copy: Json) => void][] = [
    ["Q", (copy) => { copy.rawEstimate.totals.Q = null; }],
    ["machine_service", (copy) => { copy.rawEstimate.totals.machine_service = null; }],
    ["material", (copy) => { delete copy.rawEstimate.totals.material; }],
    ["hardware", (copy) => { copy.rawEstimate.totals.hardware = "unknown"; }],
  ];
  for (const [field, change] of cases) {
    const copy = altered(answer, change);
    assert.equal(reconciles(copy.rawEstimate.totals), false, field);
    assert.deepEqual(budgetaryGaps(copy, { requestedMinimumIn: 60, parts: job.parts }), ["STORE_TOTALS_DO_NOT_RECONCILE"], field);
  }
  const incomplete = altered(answer, (copy) => { copy.rawEstimate.complete = false; });
  assert.deepEqual(budgetaryGaps(incomplete, { requestedMinimumIn: 60, parts: job.parts }), ["STORE_ECONOMICS_INCOMPLETE"]);
});

test("16 → 18 → 16: each revision reads only its own answer; an older answer is never current", async () => {
  const sixteen = braceJob(16);
  const eighteen = braceJob(18);
  const first = await ask(sixteen, "SYO-USER1-XBRACE-0.1-v6");
  const second = await ask(eighteen, "SYO-USER1-XBRACE-0.1-v7");
  const third = await ask(sixteen, "SYO-USER1-XBRACE-0.1-v8");
  assert.equal(read(sixteen, "SYO-USER1-XBRACE-0.1-v8", inquiryOf(third.admission, third.answer)).selection?.stockLengthIn, 60);
  // The 18 in answer arrives after the bench moved back to 16: same Store, supportable, but another revision.
  const late = read(sixteen, "SYO-USER1-XBRACE-0.1-v8", inquiryOf(third.admission, second.answer));
  assert.equal(late.status, BENCH_STATUS.NOT_ASKED);
  assert.equal(late.quote, false);
  assert.equal(late.selection, null);
  // An answer whose admission is not the bench's revision is not current either.
  assert.equal(read(sixteen, "SYO-USER1-XBRACE-0.1-v8", inquiryOf(first.admission, first.answer)).status, BENCH_STATUS.NOT_ASKED);
  // While the new revision is being asked, nothing from the last one is shown.
  const asking = read(sixteen, "SYO-USER1-XBRACE-0.1-v8", inquiryOf(third.admission, second.answer, { asking: true, askedRevisionId: "SYO-USER1-XBRACE-0.1-v8" }));
  assert.equal(asking.status, BENCH_STATUS.ASKING);
  assert.equal(asking.economics, null);
  // A saved answer (HISTORY authority) for the same revision is not current.
  const history = { ...required(third.answer), authority: "HISTORY" };
  assert.equal(read(sixteen, "SYO-USER1-XBRACE-0.1-v8", inquiryOf(third.admission, history)).status, BENCH_STATUS.NOT_ASKED);
});

test("a budgetary inquiry is not a confirmation; the confirmed record must name this answer's request", async () => {
  const job = braceJob(16);
  const { admission, answer } = await ask(job, "SYO-USER1-XBRACE-0.1-v9");
  const inquiry = inquiryOf(admission, answer);
  assert.equal(read(job, "SYO-USER1-XBRACE-0.1-v9", inquiry).status, BENCH_STATUS.BUDGETARY);
  assert.equal(read(job, "SYO-USER1-XBRACE-0.1-v9", inquiry, "some-other-request").status, BENCH_STATUS.BUDGETARY);
  const confirmed = read(job, "SYO-USER1-XBRACE-0.1-v9", inquiry, required(answer).requestId);
  assert.equal(confirmed.status, BENCH_STATUS.CONFIRMED);
  assert.equal(confirmed.confirmed, true);
  assert.equal(confirmed.capability?.physicalRelease, false);
});

test("Store refusal and Store unresolved answers keep their reasons and show no board, price or longer-board claim", async () => {
  const taper = braceJob(16, undefined, ["MITER_LIMITED", "SPOT_ON_LOCATION", "TAPER"]);
  const refused = await ask(taper, "SYO-USER1-XBRACE-0.1-v10");
  const refusal = read(taper, "SYO-USER1-XBRACE-0.1-v10", inquiryOf(refused.admission, refused.answer));
  assert.equal(refusal.status, BENCH_STATUS.REFUSED);
  assert.equal(refusal.current, true);
  assert.equal(refusal.quote, false);
  assert.equal(refusal.selection, null);
  assert.equal(refusal.economics, null);
  assert.equal(refusal.swap.visible, false);
  assert.ok(refusal.reasons.includes("NO_COMPLETE_DIMENSIONAL_CANDIDATE"));
  assert.ok(refusal.reasons.includes("OP_NOT_ON_OFFERING:TAPER"));

  const treated = braceJob(16, { species: "syp-treated", form: "board", nominalT: 2, nominalW: 4 });
  const unresolved = await ask(treated, "SYO-USER1-XBRACE-0.1-v11");
  const open = read(treated, "SYO-USER1-XBRACE-0.1-v11", inquiryOf(unresolved.admission, unresolved.answer));
  assert.equal(open.status, BENCH_STATUS.UNRESOLVED);
  assert.deepEqual(open.reasons, ["GRADE_CHOICE_REQUIRED"]);
  assert.deepEqual(open.offeredGrades, ["above-ground", "ground-contact", "ground-contact-cedartone"]);
  assert.equal(open.economics, null);
});

test("a definition missing a required fact is never sent; the bench names what is missing", async () => {
  const job = braceJob(16, { form: "board", nominalT: 2, nominalW: 4 });
  const { admission, answer } = await ask(job, "SYO-USER1-XBRACE-0.1-v12");
  assert.equal(answer, null);
  const view = read(job, "SYO-USER1-XBRACE-0.1-v12", inquiryOf(admission, null));
  assert.equal(view.status, BENCH_STATUS.NOT_ADMITTED);
  assert.deepEqual(view.blocking, [{ title: "Material demand", owner: "USER" }]);
});

test("identity mismatches are rejected: another Store pin, another request's receipt, another job's features", async () => {
  const job = braceJob(16);
  const { admission, answer } = await ask(job, "SYO-USER1-XBRACE-0.1-v13");
  const real = required(answer);
  const gaps = (copy: Json, parts = job.parts) => read({ ...job, parts }, "SYO-USER1-XBRACE-0.1-v13", inquiryOf(admission, copy)).reasons;
  assert.deepEqual(gaps(altered(real, (copy) => { copy.storePin = "0".repeat(40); })), ["STORE_RECEIPT_DOES_NOT_MATCH_THIS_REQUEST"]);
  assert.deepEqual(gaps(altered(real, (copy) => { copy.evaluationReceipt.requestId = "an-earlier-request"; })), ["STORE_RECEIPT_DOES_NOT_MATCH_THIS_REQUEST"]);
  assert.deepEqual(gaps(altered(real, (copy) => { copy.rawEvaluation.freshEvaluation = false; })), ["STORE_RECEIPT_DOES_NOT_MATCH_THIS_REQUEST"]);
  // The 16 in answer read against the 18 in definition: its features are not this job's.
  assert.deepEqual(gaps(real, braceJob(18).parts), ["STORE_FEATURES_DO_NOT_MATCH_DEFINITION"]);
  assert.deepEqual(gaps(altered(real, (copy) => { copy.machineAdmission.physicalRelease = true; })), ["PHYSICAL_RELEASE_NOT_BLOCKED"]);
});

test("the adapter refuses a caller pin that is not the pinned Store, and a Store it cannot reach", async () => {
  const job = braceJob(16);
  const admission = contract.admit({ revision: revisionOf(job, "SYO-USER1-XBRACE-0.1-pin"), inquiryScope: SCOPE });
  const payload = payloadFor(job, admission.request.facts);
  const wire = (pin: string) => ({
    protocolVersion: "stb-store-zero-http/1", requestId: "bench-pin", attemptId: "a", attemptNumber: 1, projectId: "start-own",
    candidateRevisionId: "SYO-USER1-XBRACE-0.1-pin", requestType: SCOPE, scope: SCOPE, demandSignature: "d", querySignature: null,
    payloadDigest: "p", expectedStorePin: pin, sentAt: "now", payload,
  });
  const wrongPin = await answerPublishedWire(wire("f".repeat(40)), await storeOrigin());
  assert.equal(wrongPin.httpStatus, 422);
  assert.equal(wrongPin.body.code, "CALLER_PIN_DOES_NOT_GOVERN");
  const unreachable = await answerPublishedWire(wire(release), "http://127.0.0.1:9");
  assert.equal(unreachable.body.adapterError, true);
  assert.equal(unreachable.httpStatus, 502);
});

test("a failed ask is shown for its own revision only", () => {
  const job = braceJob(16);
  const admission = contract.admit({ revision: revisionOf(job, "SYO-USER1-XBRACE-0.1-v14"), inquiryScope: SCOPE });
  const failure = { definitionRevisionId: "SYO-USER1-XBRACE-0.1-v14", code: "STORE_ZERO_UNAVAILABLE" };
  const failed = read(job, "SYO-USER1-XBRACE-0.1-v14", inquiryOf(admission, null, { failure }));
  assert.equal(failed.status, BENCH_STATUS.FAILED);
  assert.equal(failed.failureCode, "STORE_ZERO_UNAVAILABLE");
  assert.equal(failed.economics, null);
  const next = contract.admit({ revision: revisionOf(job, "SYO-USER1-XBRACE-0.1-v15"), inquiryScope: SCOPE });
  assert.equal(read(job, "SYO-USER1-XBRACE-0.1-v15", inquiryOf(next, null, { failure })).status, BENCH_STATUS.NOT_ASKED);
});

test("Store text in the longer-board frame is escaped, never injected", async () => {
  const job = braceJob(18);
  const { admission, answer } = await ask(job, "SYO-USER1-XBRACE-0.1-v16");
  const hostile = altered(required(answer), (copy) => {
    copy.materialResolution.consideredCandidates[0].storeSku = "<img src=x onerror=alert(1)>";
    copy.materialResolution.consideredCandidates[0].reason = "<script>x</script>";
  });
  const view = read(job, "SYO-USER1-XBRACE-0.1-v16", inquiryOf(admission, hostile));
  assert.equal(view.swap.visible, true);
  assert.equal(view.swap.html.includes("<img"), false);
  assert.equal(view.swap.html.includes("<script>"), false);
  assert.match(view.swap.html, /&lt;img src=x onerror=alert\(1\)&gt;/);
});

test("Change Wood is a tool; a generic label is not a species selector", () => {
  assert.equal(isChangeWoodTool("Change Wood"), true);
  assert.equal(isChangeWoodTool("Taper"), false);
});
