import assert from "node:assert/strict";
import { execFileSync, spawn, type ChildProcess } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";
import { STORE_CANDIDATE } from "../store-candidate.ts";
import { answerPublishedWire, boardDemandFromPublishedLine } from "./published-wire.ts";

const root = process.env.STORE_ZERO_ROOT;
const release = STORE_CANDIDATE.inspectedCommit;
let child: ChildProcess | null = null;
let origin = "";

function assertCheckout() {
  if (!root) throw new Error("STORE_ZERO_ROOT is required. This test does not mock the Store.");
  const head = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
  if (head !== release) throw new Error(`Store checkout ${head} is not the pinned commit ${release}.`);
}

async function storeOrigin() {
  if (origin) return origin;
  assertCheckout();
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
  const health = await fetch(`http://127.0.0.1:${port}/health`);
  const body = await health.json();
  if (body.release !== release) throw new Error(`Store process advertised ${body.release}, not ${release}.`);
  origin = `http://127.0.0.1:${port}`;
  return origin;
}

test.after(() => {
  child?.kill("SIGTERM");
});

function braceLineAt(lengthIn: number) {
  const angle = Number(((Math.asin(8 / lengthIn) * 180) / Math.PI).toFixed(12));
  const spot = Number((lengthIn / 2).toFixed(6));
  return {
    configurationId: "SYO-USER1-XBRACE",
    configurationVersion: lengthIn === 16 ? "0.1" : lengthIn === 18 ? "0.2" : "review",
    materialDemand: { species: "spf", form: "board", nominalT: 2, nominalW: 4 },
    quantity: 1,
    requiredOps: ["MITER_LIMITED", "SPOT_ON_LOCATION"],
    definedWorkpieceLength: { value: "60", unit: "in" },
    sawCuts: 3,
    sawAngleDeg: angle,
    cutPlane: "miter-face",
    endIdentity: "both",
    endRelation: "parallel",
    lengthDatum: "long-long-outer-edge",
    datumCMethod: "REFERENCE_CUT",
    parts: [1, 2].map((index) => ({
      partId: `PART-${index}`,
      lengthIn,
      features: [{
        featureId: `SPOT-${index}`,
        kind: "SPOT_ON_LOCATION",
        xIn: spot,
        locationRule: "CENTERED_ON_PART",
        acrossWidthRule: "CENTERED_ON_WIDE_FACE",
      }],
    })),
    spotDemand: { required: true, totalCount: 2 },
  };
}

function braceLine() {
  return braceLineAt(16);
}

test("the served Start your own runtime names this Store", () => {
  const runtime = readFileSync(new URL("../../../public/live/stb-store-runtime.json", import.meta.url), "utf8");
  assert.equal(runtime.includes("railway.app"), false);
  assert.equal(runtime.includes("same-origin:/api/store-zero/job"), true);
  assert.equal(runtime.includes("4cb0c625ac00c62390129b55a52596b52f10decd"), true);
});

test("end names stay on the job and are reported when the board shape cannot carry them", () => {
  const translated = boardDemandFromPublishedLine(braceLine());
  assert.equal("endIdentity" in translated.demand, false);
  assert.equal(translated.demand.cutPlane, "miter-face");
  const parts = translated.demand.parts as { lengthIn: number }[];
  assert.equal(parts[0].lengthIn, 16);
  assert.deepEqual(
    translated.carriedNotAccepted.map((item) => item.field),
    ["endIdentity", "endRelation", "lengthDatum"],
  );
  assert.equal(translated.carriedNotAccepted[0].value, "both");
});

test("Start your own confirm path gets a fresh replacement-Store answer, not a copied price", async () => {
  const wire = {
    protocolVersion: "stb-store-zero-http/1",
    requestId: "start-own-live-1",
    projectId: "start-own",
    candidateRevisionId: "SYO-USER1-XBRACE-0.1-v1",
    requestType: "USER_DEFINED_BOARD_V1",
    scope: "USER_DEFINED_BOARD_V1",
    demandSignature: "demand",
    querySignature: null,
    payloadDigest: "digest",
    expectedStorePin: "4cb0c625ac00c62390129b55a52596b52f10decd",
    attemptId: "attempt-1",
    attemptNumber: 1,
    sentAt: "2026-10-09T02:00:00.000Z",
    payload: { line: braceLine(), definitionKind: "user_defined_board.v1", ruleVersion: "0.1" },
  };
  const answered = await answerPublishedWire(wire, await storeOrigin());
  assert.equal(answered.httpStatus, 200);
  const body = answered.body;
  assert.equal(body.adapterError, undefined);
  assert.equal(body.requestId, wire.requestId);
  assert.equal(body.storePin, "4cb0c625ac00c62390129b55a52596b52f10decd");
  const evaluation = body.rawEvaluation as { status?: string; freshEvaluation?: boolean };
  const estimate = body.rawEstimate as { complete?: boolean; totals?: { Q?: number } };
  const receipt = body.evaluationReceipt as { requestId?: string; freshnessRule?: string; authority?: { storeRevision?: string } };
  assert.equal(evaluation.status, "SUPPORTABLE");
  assert.equal(evaluation.freshEvaluation, true);
  assert.equal(estimate.complete, true);
  assert.equal(estimate.totals?.Q, 8.54);
  const price = body.priceCompleteness as { status?: string; scope?: string };
  assert.equal(price.status, "COMPLETE_FOR_TRAVEL_STANDARD");
  assert.equal(price.scope, "QUOTE_ONLY");
  const job = body.jobSupportability as { status?: string; machineAdmitted?: boolean; quoteComplete?: boolean };
  assert.equal(job.status, "NOT_FULLY_SUPPORTABLE");
  assert.equal(job.quoteComplete, true);
  assert.equal(job.machineAdmitted, false);
  const requirements = body.requirementSatisfaction as { status?: string };
  assert.equal(requirements.status, "UNEVALUATED");
  const machine = body.machineAdmission as { status?: string; physicalRelease?: boolean };
  assert.equal(machine.status, "BLOCKED");
  assert.equal(machine.physicalRelease, false);
  const resolution = body.materialResolution as { storeSku?: string; workpieceLengthIn?: number };
  assert.equal(resolution.storeSku, "STB-ZERO-SPF-2X4-60-001");
  assert.equal(resolution.workpieceLengthIn, 60);
  assert.equal(receipt.requestId, wire.requestId);
  assert.equal(receipt.freshnessRule, "STB-STORE-FRESH-EVALUATION-0.1");
  assert.equal(receipt.authority?.storeRevision, body.storePin);
  const carried = body.carriedNotAccepted as { field: string }[];
  assert.ok(carried.some((item) => item.field === "endIdentity"));
});

test("the 18 in brace is a different fresh answer, and the Store advances off the 60 in board", async () => {
  const line = braceLineAt(18);
  assert.equal(line.parts[0].features[0].xIn, 9);
  assert.equal(line.sawAngleDeg, 26.387799961243);
  const wire = {
    protocolVersion: "stb-store-zero-http/1",
    requestId: "start-own-live-18",
    projectId: "start-own",
    candidateRevisionId: "SYO-USER1-XBRACE-0.1-v2",
    requestType: "USER_DEFINED_BOARD_V1",
    scope: "USER_DEFINED_BOARD_V1",
    demandSignature: "demand-18",
    querySignature: null,
    payloadDigest: "digest-18",
    expectedStorePin: "4cb0c625ac00c62390129b55a52596b52f10decd",
    attemptId: "attempt-18",
    attemptNumber: 1,
    sentAt: "2026-10-09T03:00:00.000Z",
    payload: { line, definitionKind: "user_defined_board.v1", ruleVersion: "0.1" },
  };
  const answered = await answerPublishedWire(wire, await storeOrigin());
  assert.equal(answered.httpStatus, 200);
  const body = answered.body;
  const evaluation = body.rawEvaluation as { status?: string; freshEvaluation?: boolean };
  const estimate = body.rawEstimate as { complete?: boolean; totals?: { Q?: number } };
  const receipt = body.evaluationReceipt as { requestId?: string; freshnessRule?: string; authority?: { storeRevision?: string } };
  const resolution = body.materialResolution as { storeSku?: string; workpieceLengthIn?: number };
  assert.equal(evaluation.status, "SUPPORTABLE");
  assert.equal(evaluation.freshEvaluation, true);
  assert.equal(estimate.complete, true);
  assert.equal(estimate.totals?.Q, 9.07);
  assert.notEqual(estimate.totals?.Q, 8.54);
  assert.equal(resolution.storeSku, "STB-ZERO-SPF-2X4-72-001");
  assert.equal(resolution.workpieceLengthIn, 72);
  const job = body.jobSupportability as { status?: string; machineAdmitted?: boolean };
  assert.equal(job.status, "NOT_FULLY_SUPPORTABLE");
  assert.equal(job.machineAdmitted, false);
  assert.equal((body.requirementSatisfaction as { status?: string }).status, "UNEVALUATED");
  assert.equal((body.machineAdmission as { physicalRelease?: boolean }).physicalRelease, false);
  assert.equal(receipt.requestId, wire.requestId);
  assert.equal(receipt.freshnessRule, "STB-STORE-FRESH-EVALUATION-0.1");
  assert.equal(receipt.authority?.storeRevision, "4cb0c625ac00c62390129b55a52596b52f10decd");
  const carried = body.carriedNotAccepted as { field: string; value: string }[];
  assert.deepEqual(carried.map((item) => `${item.field}=${item.value}`), [
    "endIdentity=both",
    "endRelation=parallel",
    "lengthDatum=long-long-outer-edge",
  ]);
});

test("a board the Store refuses is not a complete quote and not a supportable job", async () => {
  const line = braceLineAt(84);
  const wire = {
    protocolVersion: "stb-store-zero-http/1",
    requestId: "start-own-live-refused",
    projectId: "start-own",
    candidateRevisionId: "SYO-USER1-XBRACE-0.1-v84",
    requestType: "USER_DEFINED_BOARD_V1",
    scope: "USER_DEFINED_BOARD_V1",
    demandSignature: "demand-84",
    querySignature: null,
    payloadDigest: "digest-84",
    expectedStorePin: "4cb0c625ac00c62390129b55a52596b52f10decd",
    attemptId: "attempt-84",
    attemptNumber: 1,
    sentAt: "2026-10-09T04:00:00.000Z",
    payload: { line, definitionKind: "user_defined_board.v1", ruleVersion: "0.1" },
  };
  const answered = await answerPublishedWire(wire, await storeOrigin());
  assert.equal(answered.httpStatus, 200);
  const body = answered.body;
  const evaluation = body.rawEvaluation as { status?: string; freshEvaluation?: boolean };
  const price = body.priceCompleteness as { status?: string };
  const job = body.jobSupportability as { status?: string; quoteComplete?: boolean; machineAdmitted?: boolean };
  assert.equal(evaluation.status, "REFUSED");
  assert.equal(evaluation.freshEvaluation, true);
  assert.notEqual(price.status, "COMPLETE_FOR_TRAVEL_STANDARD");
  assert.equal(job.status, "NOT_SUPPORTABLE");
  assert.equal(job.quoteComplete, false);
  assert.equal(job.machineAdmitted, false);
  assert.equal((body.requirementSatisfaction as { status?: string }).status, "UNEVALUATED");
  assert.equal((body.machineAdmission as { physicalRelease?: boolean }).physicalRelease, false);
});

test("the bench does not ask the specimen function for the current answer", () => {
  const page = readFileSync(new URL("../../../public/live/system-build-current.html", import.meta.url), "utf8");
  const handoff = readFileSync(new URL("../../../public/live/stb-store-handoff-contract.js", import.meta.url), "utf8");
  assert.equal(page.includes("resolveUser1StoreReference"), false);
  assert.equal(page.includes("exact promoted Store reference matched"), false);
  assert.equal(handoff.includes("MATCHED_STORE_REFERENCE"), false);
  assert.equal(handoff.includes("status:'HISTORICAL_SPECIMEN'"), true);
  assert.equal(page.includes("Build guide · developer notes"), true);
});
function wireFor(projectId: string, requestType: string, revision: string, payload: Record<string, unknown>) {
  return {
    protocolVersion: "stb-store-zero-http/1",
    requestId: `${projectId}-${revision}`,
    projectId,
    candidateRevisionId: revision,
    requestType,
    scope: requestType,
    demandSignature: revision,
    querySignature: null,
    payloadDigest: revision,
    expectedStorePin: release,
    attemptId: `attempt-${revision}`,
    attemptNumber: 1,
    sentAt: "2026-10-09T05:00:00.000Z",
    payload,
  };
}

test("a missing angle, spot, or item line is not sent as a smaller job", async () => {
  const origin = await storeOrigin();
  const missingAngle = await answerPublishedWire(wireFor("outdoor", "CUT_PACKAGE_V1", "no-angle", {
    definition: { configurationId: "OUTDOOR", configurationVersion: "x", cutPackages: [{ packageId: "LEGS", material: { species: "spf", form: "board", nominalT: 2, nominalW: 4, grade: "construction" }, parts: [{ partId: "LEG-01", lengthIn: 30 }] }] },
  }), origin);
  assert.equal(missingAngle.httpStatus, 422);
  assert.equal(missingAngle.body.code, "PUBLISHED_DEFINITION_INCOMPLETE");
  assert.equal(missingAngle.body.rawEvaluation, undefined);
  const missingSpot = await answerPublishedWire(wireFor("window-seat", "CUT_PACKAGE_V1", "no-spot", {
    definition: { configurationId: "WINDOW-SEAT", configurationVersion: "x", cutPackages: [{ packageId: "SIDES", material: { species: "poplar", form: "board", nominalT: 1, nominalW: 6, grade: "select" }, endCut: { angleDeg: 0 }, parts: [{ partId: "UPRIGHT-1", lengthIn: 36, spots: [{ featureId: "SPOT-1" }] }] }] },
  }), origin);
  assert.equal(missingSpot.body.code, "PUBLISHED_DEFINITION_INCOMPLETE");
  const down = await answerPublishedWire(wireFor("playhouse", "SHEET_PACKAGE_V1", "down", {
    definition: { configurationId: "PLAYHOUSE-ARCHED-WINDOW", configurationVersion: "down", sheet: { thicknessIn: 0.5, lengthIn: 96, widthIn: 48 }, features: [], returnAllPieces: true },
  }), "http://127.0.0.1:9");
  assert.equal(down.httpStatus, 502);
  assert.equal(down.body.code, "REPLACEMENT_STORE_UNAVAILABLE");
  assert.equal(down.body.rawEstimate, undefined);
});

test("an empty published definition is not migrated by invention", async () => {
  const answered = await answerPublishedWire(wireFor("alcove", "ALCOVE_INSERT_V1", "empty", {}), await storeOrigin());
  assert.equal(answered.httpStatus, 422);
  assert.equal(answered.body.code, "PUBLISHED_DEFINITION_REQUIRED");
});

test("the four published jobs reach the pinned Store and a changed input changes the answer", async () => {
  const origin = await storeOrigin();
  const alcove = {
    configurationId: "ALCOVE-USER1",
    configurationVersion: "alcove-a",
    boardRequirements: [
      { requirementId: "ALCOVE-UPRIGHT-PARENTS", requiredOps: ["CROSSCUT"] },
      { requirementId: "ALCOVE-SHELF-PARENTS", requiredOps: ["CROSSCUT"] },
    ],
    materialDemand: { species: "poplar", form: "board", nominalT: 1, nominalW: 6, grade: "select" },
    componentPrograms: [
      { componentId: "ALCOVE-UPRIGHT-01", requirementId: "ALCOVE-UPRIGHT-PARENTS", finishedLengthIn: 36, finishedWidthIn: 5.5, features: [{ featureId: "SPOT-1", kind: "SPOT_ON_LOCATION", xIn: 12, acrossWidthRule: "CENTERED_ON_WIDE_FACE", insetFromEdgeIn: 0.75 }] },
      { componentId: "ALCOVE-SHELF-01-STRIP-01", requirementId: "ALCOVE-SHELF-PARENTS", finishedLengthIn: 30, finishedWidthIn: 5.5, features: [] },
    ],
    hardwareDemand: { requirementId: "ALCOVE-PINS-AND-SCREWS", qty: 1 },
  };
  const alcoveAnswer = await answerPublishedWire(wireFor("alcove", "ALCOVE_INSERT_V1", "alcove-a", { definition: alcove, definitionKind: "alcove_insert.v1", ruleVersion: "0.1" }), origin);
  assert.equal(alcoveAnswer.httpStatus, 200);
  assert.equal(alcoveAnswer.body.adapterError, undefined);
  assert.equal(alcoveAnswer.body.projectId, "alcove");
  assert.equal(alcoveAnswer.body.storePin, release);
  assert.equal((alcoveAnswer.body.mappedCallInputs as { requestType?: string }).requestType, "CUT_PACKAGE_V1");
  assert.equal((alcoveAnswer.body.rawEvaluation as { freshEvaluation?: boolean }).freshEvaluation, true);
  assert.notEqual((alcoveAnswer.body.rawEvaluation as { status?: string }).status, undefined);
  const taller = { ...alcove, configurationVersion: "alcove-b", componentPrograms: alcove.componentPrograms.map((row) => ({ ...row, finishedLengthIn: row.finishedLengthIn + 12 })) };
  const tallerAnswer = await answerPublishedWire(wireFor("alcove", "ALCOVE_INSERT_V1", "alcove-b", { definition: taller, definitionKind: "alcove_insert.v1", ruleVersion: "0.1" }), origin);
  assert.notEqual((alcoveAnswer.body.rawEvaluation as { calculationIdentity?: { inputHash?: string } }).calculationIdentity?.inputHash, (tallerAnswer.body.rawEvaluation as { calculationIdentity?: { inputHash?: string } }).calculationIdentity?.inputHash);

  const seat = {
    configurationId: "WINDOW-SEAT",
    configurationVersion: "ws-a",
    cutPackages: [{ packageId: "SIDES-1X6", material: { species: "poplar", form: "board", nominalT: 1, nominalW: 6, grade: "select" }, endCut: { angleDeg: 0 }, parts: [{ partId: "UPRIGHT-1", lengthIn: 36, spots: [{ featureId: "SPOT-1", xIn: 18, acrossWidthRule: "CENTERED_ON_WIDE_FACE" }] }] }],
  };
  const seatAnswer = await answerPublishedWire(wireFor("window-seat", "CUT_PACKAGE_V1", "ws-a", { definition: seat, definitionKind: "cut_package.v1", ruleVersion: "0.1" }), origin);
  assert.equal(seatAnswer.body.storePin, release);
  assert.equal((seatAnswer.body.rawEvaluation as { status?: string }).status, "SUPPORTABLE");
  const longerSeat = { ...seat, configurationVersion: "ws-b", cutPackages: [{ ...seat.cutPackages[0], parts: [{ partId: "UPRIGHT-1", lengthIn: 72, spots: [{ featureId: "SPOT-1", xIn: 36, acrossWidthRule: "CENTERED_ON_WIDE_FACE" }] }] }] };
  const longerAnswer = await answerPublishedWire(wireFor("window-seat", "CUT_PACKAGE_V1", "ws-b", { definition: longerSeat, definitionKind: "cut_package.v1", ruleVersion: "0.1" }), origin);
  const seatQ = (seatAnswer.body.rawEstimate as { totals?: { Q?: number } }).totals?.Q;
  const longerQ = (longerAnswer.body.rawEstimate as { totals?: { Q?: number } }).totals?.Q;
  assert.equal(typeof seatQ, "number");
  assert.notEqual(seatQ, longerQ);

  const outdoor = {
    configurationId: "OUTDOOR-PICNIC-A-FRAME",
    configurationVersion: "od-a",
    cutPackages: [{ packageId: "treated|LEGS", material: { species: "syp-treated", form: "board", nominalT: 2, nominalW: 6, grade: "above-ground" }, endCut: { angleDeg: 25 }, parts: [{ partId: "LEG-01", lengthIn: 31.375 }] }],
  };
  const outdoorAnswer = await answerPublishedWire(wireFor("outdoor", "CUT_PACKAGE_V1", "od-a", { definition: outdoor, definitionKind: "cut_package.v1", ruleVersion: "0.1" }), origin);
  assert.equal((outdoorAnswer.body.rawEvaluation as { freshEvaluation?: boolean }).freshEvaluation, true);
  assert.equal(outdoorAnswer.body.candidateRevisionId, "od-a");
  const square = { ...outdoor, configurationVersion: "od-b", cutPackages: [{ ...outdoor.cutPackages[0], endCut: { angleDeg: 0 } }] };
  const squareAnswer = await answerPublishedWire(wireFor("outdoor", "CUT_PACKAGE_V1", "od-b", { definition: square, definitionKind: "cut_package.v1", ruleVersion: "0.1" }), origin);
  assert.notEqual((outdoorAnswer.body.rawEvaluation as { calculationIdentity?: { inputHash?: string } }).calculationIdentity?.inputHash, (squareAnswer.body.rawEvaluation as { calculationIdentity?: { inputHash?: string } }).calculationIdentity?.inputHash);

  const sheet = {
    configurationId: "PLAYHOUSE-ARCHED-WINDOW",
    configurationVersion: "playhouse-a",
    sheet: { thicknessIn: 0.5, lengthIn: 96, widthIn: 48 },
    features: [
      { featureId: "OPENING", kind: "ARCHED_APERTURE", placement: "CENTERED", widthIn: 36, straightHeightIn: 24, riseIn: 12, retain: "TABS", requestedTabCount: 4 },
      { featureId: "CENTER-SPLIT", kind: "STRAIGHT_SPLIT", within: "OPENING", line: "VERTICAL_CENTERLINE" },
      { featureId: "CUT-LEFT", kind: "CROSSCUT", fromEnd: "LEFT", distanceIn: 18 },
      { featureId: "CUT-RIGHT", kind: "CROSSCUT", fromEnd: "RIGHT", distanceIn: 18 },
    ],
    returnAllPieces: true,
  };
  const playhouse = await answerPublishedWire(wireFor("playhouse", "SHEET_PACKAGE_V1", "playhouse-a", { definition: sheet, definitionKind: "sheet_package.v1", ruleVersion: "0.1" }), origin);
  assert.equal(playhouse.body.projectId, "playhouse");
  assert.equal((playhouse.body.rawEvaluation as { configurationVersion?: string }).configurationVersion, "playhouse-a");
  assert.equal((playhouse.body.rawEvaluation as { status?: string }).status, "SUPPORTABLE");
  const highRise = { ...sheet, configurationVersion: "playhouse-b", features: sheet.features.map((feature) => feature.featureId === "OPENING" ? { ...feature, riseIn: 30 } : feature) };
  const refused = await answerPublishedWire(wireFor("playhouse", "SHEET_PACKAGE_V1", "playhouse-b", { definition: highRise, definitionKind: "sheet_package.v1", ruleVersion: "0.1" }), origin);
  assert.equal((refused.body.rawEvaluation as { status?: string }).status, "REFUSED");
  assert.notEqual((refused.body.priceCompleteness as { status?: string }).status, "COMPLETE_FOR_TRAVEL_STANDARD");
});

