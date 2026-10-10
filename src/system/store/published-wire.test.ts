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
  assert.equal(runtime.includes("c1c044d14485a2c0e66e121543e4e887dcd54e29"), true);
});

test("priced end geometry is sent, and a redundant end identity is reconciled rather than deleted", () => {
  const translated = boardDemandFromPublishedLine(braceLine());
  assert.equal(translated.demand.endRelation, "parallel");
  assert.equal(translated.demand.lengthDatum, "long-long-outer-edge");
  assert.equal(translated.demand.endIdentity, null);
  assert.equal(translated.demand.cutPlane, "miter-face");
  const parts = translated.demand.parts as { lengthIn: number }[];
  assert.equal(parts[0].lengthIn, 16);
  assert.deepEqual(translated.carriedNotAccepted, []);
  assert.equal(translated.endIdentityCanonicalization?.suppliedEndIdentity, "both");
  assert.equal(translated.endIdentityCanonicalization?.sentEndIdentity, null);
  assert.equal(translated.endIdentityCanonicalization?.rule, "REDUNDANT_WITH_PRICED_LENGTH_DATUM");
});

test("a declared spot with no feature id gets a stable id, and a missing location is not zero", () => {
  const line = braceLine();
  delete (line.parts[0].features[0] as { featureId?: string }).featureId;
  (line.parts[0].features[0] as { xIn: number | null }).xIn = null;
  const translated = boardDemandFromPublishedLine(line);
  const features = (translated.demand.parts as { features: { featureId: string; xIn: number | null }[] }[])[0].features;
  assert.equal(features[0].featureId, "declared:PART-1:feature:0");
  assert.equal(features[0].xIn, null);
  assert.equal(translated.assignedFeatureIdentities[0].featureId, "declared:PART-1:feature:0");
  const other = braceLine();
  other.endRelation = "splayed";
  other.endIdentity = "short-point";
  const kept = boardDemandFromPublishedLine(other);
  assert.equal(kept.demand.endIdentity, "short-point");
  assert.equal(kept.endIdentityCanonicalization, null);
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
    expectedStorePin: "c1c044d14485a2c0e66e121543e4e887dcd54e29",
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
  assert.equal(body.storePin, release);
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
  assert.equal(job.status, "REQUIREMENTS_SATISFIED");
  assert.equal(job.quoteComplete, true);
  assert.equal(job.machineAdmitted, false);
  const requirements = body.requirementSatisfaction as { status?: string };
  assert.equal(requirements.status, "SATISFIED");
  const machine = body.machineAdmission as { status?: string; physicalRelease?: boolean };
  assert.equal(machine.status, "BLOCKED");
  assert.equal(machine.physicalRelease, false);
  const resolution = body.materialResolution as { storeSku?: string; workpieceLengthIn?: number };
  assert.equal(resolution.storeSku, "STB-ZERO-SPF-2X4-60-001");
  assert.equal(resolution.workpieceLengthIn, 60);
  assert.equal(receipt.requestId, wire.requestId);
  assert.equal(receipt.freshnessRule, "STB-STORE-FRESH-EVALUATION-0.1");
  assert.equal(receipt.authority?.storeRevision, body.storePin);
  const canonical = body.endIdentityCanonicalization as { suppliedEndIdentity?: string };
  assert.equal(canonical.suppliedEndIdentity, "both");
  assert.deepEqual(body.carriedNotAccepted, []);
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
    expectedStorePin: "c1c044d14485a2c0e66e121543e4e887dcd54e29",
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
  assert.equal(job.status, "REQUIREMENTS_SATISFIED");
  assert.equal(job.machineAdmitted, false);
  assert.equal((body.requirementSatisfaction as { status?: string }).status, "SATISFIED");
  assert.equal((body.machineAdmission as { physicalRelease?: boolean }).physicalRelease, false);
  assert.equal(receipt.requestId, wire.requestId);
  assert.equal(receipt.freshnessRule, "STB-STORE-FRESH-EVALUATION-0.1");
  assert.equal(receipt.authority?.storeRevision, release);
  const canonical = body.endIdentityCanonicalization as { suppliedEndIdentity?: string; sentEndIdentity?: null };
  assert.equal(canonical.suppliedEndIdentity, "both");
  assert.equal(canonical.sentEndIdentity, null);
  const offering = body.rawOffering as { supportedOps?: unknown; cellFamily?: unknown; capabilityAttribution?: string };
  assert.equal(offering.supportedOps, null);
  assert.equal(offering.cellFamily, null);
  assert.equal(offering.capabilityAttribution, "NOT_SUPPLIED_BY_STORE");
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
    expectedStorePin: "c1c044d14485a2c0e66e121543e4e887dcd54e29",
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
  assert.equal((body.requirementSatisfaction as { status?: string }).status, "SATISFIED");
  assert.equal((body.machineAdmission as { physicalRelease?: boolean }).physicalRelease, false);
});

test("the bench does not ask the specimen function for the current answer", () => {
  const page = readFileSync(new URL("../../../public/live/system-build-current.html", import.meta.url), "utf8");
  const handoff = readFileSync(new URL("../../../public/live/stb-store-handoff-contract.js", import.meta.url), "utf8");
  assert.equal(page.includes("startOwnOfferings"), false);
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
  assert.equal(down.body.code, "STORE_UNREACHABLE");
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

const playhouseSheet = (version: string, extra: Record<string, unknown>[] = [], sheet: Record<string, unknown> = {}) => ({
  configurationId: "PLAYHOUSE-ARCHED-WINDOW",
  configurationVersion: version,
  sheet: { thicknessIn: 0.5, lengthIn: 96, widthIn: 48, species: "pine", grade: "sheathing-4ply", ...sheet },
  features: [
    { featureId: "OPENING", kind: "ARCHED_APERTURE", placement: "CENTERED", widthIn: 36, straightHeightIn: 24, riseIn: 12, retain: "TABS", requestedTabCount: 4 },
    { featureId: "CENTER-SPLIT", kind: "STRAIGHT_SPLIT", within: "OPENING", line: "VERTICAL_CENTERLINE" },
    { featureId: "CUT-LEFT", kind: "CROSSCUT", fromEnd: "LEFT", distanceIn: 18 },
    { featureId: "CUT-RIGHT", kind: "CROSSCUT", fromEnd: "RIGHT", distanceIn: 18 },
    ...extra,
  ],
  returnAllPieces: true,
});

test("Playhouse tools: an added crosscut is evaluated by the Store, never dropped, and changes the price", async () => {
  const origin = await storeOrigin();
  const ask = (version: string, definition: Record<string, unknown>) =>
    answerPublishedWire(wireFor("playhouse", "SHEET_PACKAGE_V1", version, { definition, definitionKind: "sheet_package.v1", ruleVersion: "0.1" }), origin);
  const base = await ask("ph-base", playhouseSheet("ph-base"));
  const raw = (answer: { body: Record<string, unknown> }) => answer.body.rawEvaluation as Record<string, any>;
  assert.equal(raw(base).status, "SUPPORTABLE");
  assert.equal(raw(base).totals.Q, 76.57);
  assert.equal(raw(base).totals.material, 26.55);
  assert.equal(raw(base).totals.machine_service, 30.02);
  assert.equal(raw(base).totals.manual_cut_service, 20);
  assert.equal(raw(base).totals.manualCutCount, 2);
  assert.equal(raw(base).material.storeSku, "STB-ZERO-PLY-050-48X96-001");
  const cut = await ask("ph-cut", playhouseSheet("ph-cut", [{ featureId: "CUT-M1", kind: "CROSSCUT", fromEnd: "LEFT", distanceIn: 26 }]));
  assert.equal(raw(cut).status, "SUPPORTABLE");
  assert.equal(raw(cut).freshEvaluation, true);
  assert.ok(raw(cut).totals.Q > raw(base).totals.Q, "the added cut is priced, not dropped");
  assert.ok(raw(cut).operations.some((op: { opId: string; xIn?: number }) => op.opId === "CROSSCUT" && op.xIn === 26));
  assert.deepEqual(cut.body.carriedNotAccepted, []);
  const mapped = (cut.body.mappedCallInputs as { demand: { features: { featureId: string }[] } }).demand;
  assert.ok(mapped.features.some((feature) => feature.featureId === "CUT-M1"), "the added cut reached the Store");
  // A cut through the opening is the Store's refusal, with its own reason.
  const through = await ask("ph-through", playhouseSheet("ph-through", [{ featureId: "CUT-M1", kind: "CROSSCUT", fromEnd: "LEFT", distanceIn: 48 }]));
  assert.equal(raw(through).status, "REFUSED");
  assert.ok(raw(through).reasonRecords.some((r: { code: string }) => r.code === "CROSSCUT_INTERSECTS_ROUTED_FEATURE"));
  // Another wood the Store offers is priced for that wood.
  const fir = await ask("ph-fir", playhouseSheet("ph-fir", [], { thicknessIn: 0.625, species: "fir", grade: "BCX-sanded" }));
  assert.equal(raw(fir).status, "SUPPORTABLE");
  assert.equal(raw(fir).material.storeSku, "STB-ZERO-PLY-063-48X96-001");
  assert.equal(raw(fir).totals.manual_cut_service, 20);
  assert.ok(raw(fir).totals.Q > raw(base).totals.Q, "the different Store sheet and machine passes produce a different Q");
});

test("Playhouse pattern within the centered 48 x 36 field is freshly evaluated; outside field is refused with no Q", async () => {
  const origin = await storeOrigin();
  const ask = (version: string, definition: Record<string, unknown>) =>
    answerPublishedWire(wireFor("playhouse", "SHEET_PACKAGE_V1", version,
      { definition, definitionKind:"sheet_package.v1", ruleVersion:"0.1" }), origin);
  const pattern = { featureId:"PATTERN", kind:"PATTERN", within:"OPENING", offsetXIn:2, offsetYIn:0 };
  const within = await ask("ph-pattern-in", playhouseSheet("ph-pattern-in",[pattern]));
  const accepted = within.body.rawEvaluation as Record<string, any>;
  assert.equal(accepted.status, "SUPPORTABLE");
  assert.equal(accepted.freshEvaluation, true);
  assert.equal(accepted.totals.Q, 76.57);
  assert.equal(accepted.features.apertures[0].box.x0, 32);
  assert.equal(accepted.featureAnswers.find((f: { featureId: string }) => f.featureId === "PATTERN").status, "ANSWERED");
  assert.deepEqual(within.body.carriedNotAccepted, []);
  assert.ok(accepted.evaluationReceipt);
  const moved = await ask("ph-pattern-out", playhouseSheet("ph-pattern-out",[{...pattern,offsetXIn:7}]));
  const refused = moved.body.rawEvaluation as Record<string, any>;
  assert.equal(refused.status, "REFUSED");
  assert.equal(refused.freshEvaluation, true);
  assert.ok(refused.reasonCodes.includes("CENTER_WORK_FIELD_EXCEEDED"));
  assert.equal(refused.totals, null);
  assert.equal(refused.Q, null);
  assert.deepEqual(moved.body.carriedNotAccepted, []);
  const tooTall = playhouseSheet("ph-height-out");
  (tooTall.features[0] as { straightHeightIn:number }).straightHeightIn=25;
  const heightRefusal = await ask("ph-height-out",tooTall);
  assert.equal((heightRefusal.body.rawEvaluation as Record<string, any>).status,"REFUSED");
  assert.ok((heightRefusal.body.rawEvaluation as Record<string, any>).reasonCodes.includes("CENTER_WORK_FIELD_EXCEEDED"));
});

test("the same Store supports standalone manual full-length rips; unsafe mixed-axis Playhouse saw plans are refused", async () => {
  const origin = await storeOrigin();
  const ask = (version: string, definition: Record<string, unknown>) =>
    answerPublishedWire(wireFor("playhouse", "SHEET_PACKAGE_V1", version,
      { definition, definitionKind:"sheet_package.v1", ruleVersion:"0.1" }), origin);
  const rip = {featureId:"CUT-M1",kind:"RIP",fromEdge:"BOTTOM",distanceIn:12};
  const alone={...playhouseSheet("ph-rip-only"),features:[rip]};
  const done=await ask("ph-rip-only",alone);
  const evaluated=done.body.rawEvaluation as Record<string, any>;
  assert.equal(evaluated.status,"SUPPORTABLE");
  assert.equal(evaluated.freshEvaluation,true);
  assert.equal(evaluated.totals.manual_cut_service,10);
  assert.equal(evaluated.totals.Q,37.94);
  assert.ok(evaluated.operations.some((op:{opId:string,lengthIn?:number})=>op.opId==="RIP"&&op.lengthIn===96));
  assert.deepEqual(done.body.carriedNotAccepted,[]);
  const onPlayhouse=await ask("ph-rip-mixed",playhouseSheet("ph-rip-mixed",[rip]));
  const refusal=onPlayhouse.body.rawEvaluation as Record<string, any>;
  assert.equal(refusal.status,"REFUSED");
  assert.equal(refusal.freshEvaluation,true);
  assert.ok(refusal.reasonCodes.includes("ORTHOGONAL_SAW_STAGING_NOT_DEFINED"));
  assert.equal(refusal.Q,null);
  assert.deepEqual(onPlayhouse.body.carriedNotAccepted,[]);
});

test("a sheet or feature field the translator does not carry is reported, not silently dropped", async () => {
  const origin = await storeOrigin();
  const definition = playhouseSheet("ph-extra", [{ featureId: "X", kind: "CROSSCUT", fromEnd: "LEFT", distanceIn: 26, colour: "red" }], { storeSku: "STB-ZERO-PLY-050-48X96-001" });
  const answered = await answerPublishedWire(wireFor("playhouse", "SHEET_PACKAGE_V1", "ph-extra", { definition, definitionKind: "sheet_package.v1", ruleVersion: "0.1" }), origin);
  const carried = answered.body.carriedNotAccepted as { field: string; reported: string }[];
  assert.deepEqual(carried.map((item) => item.field).sort(), ["features[4].colour", "sheet.storeSku"]);
  assert.ok(carried.every((item) => item.reported === "NOT_A_STORE_SHEET_FIELD"));
  const demand = (answered.body.mappedCallInputs as { demand: { sheet: Record<string, unknown>; features: Record<string, unknown>[] } }).demand;
  assert.equal(demand.sheet.storeSku, undefined);
  assert.equal(demand.features[4].colour, undefined);
});

test("alcove milling path and depth stay unevaluated and block a full-job claim", async () => {
  const origin = await storeOrigin();
  const definition = {
    configurationId: "ALCOVE-USER1",
    configurationVersion: "alcove-mill",
    boardRequirements: [{ requirementId: "ALCOVE-SHELF-PARENTS", requiredOps: ["CROSSCUT"] }],
    materialDemand: { species: "poplar", form: "board", nominalT: 1, nominalW: 6, grade: "select" },
    componentPrograms: [{
      componentId: "ALCOVE-SHELF-01",
      requirementId: "ALCOVE-SHELF-PARENTS",
      finishedLengthIn: 30,
      finishedWidthIn: 5.5,
      features: [{ featureId: "MILL-1", kind: "MILL_LONGITUDINAL_PROFILE", yIn: 5.5, pathLengthIn: 30, totalDepthIn: 0.25 }],
    }],
  };
  const answered = await answerPublishedWire(wireFor("alcove", "ALCOVE_INSERT_V1", "alcove-mill", { definition }), origin);
  assert.equal(answered.httpStatus, 200);
  const carried = answered.body.carriedNotAccepted as { field: string; value: string }[];
  assert.ok(carried.some((item) => item.field === "mill:MILL-1" && item.value.includes("pathLengthIn=30") && item.value.includes("totalDepthIn=0.25")));
  const job = answered.body.jobSupportability as { status?: string };
  assert.notEqual(job.status, "REQUIREMENTS_SATISFIED");
});

test("a caller pin cannot govern, and a supportable-looking failure is not a quote", async () => {
  const origin = await storeOrigin();
  const wire = wireFor("start-own", "USER_DEFINED_BOARD_V1", "pin-override", { line: braceLine() });
  const overridden = await answerPublishedWire({ ...wire, expectedStorePin: "4cb0c625ac00c62390129b55a52596b52f10decd" }, origin);
  assert.equal(overridden.httpStatus, 422);
  assert.equal(overridden.body.code, "CALLER_PIN_DOES_NOT_GOVERN");
  assert.equal(overridden.body.rawEstimate, undefined);

  const { createServer } = await import("node:http");
  const { sha256Bytes } = await import("../hash.ts");
  const adversarial = await new Promise<{ url: string; close: () => void }>((resolve) => {
    const server = createServer((req, res) => {
      let raw = "";
      req.on("data", (chunk) => { raw += chunk; });
      req.on("end", () => {
        const sent = JSON.parse(raw) as { requestId?: string; requestType?: string };
        const digest = sha256Bytes(raw);
        const base = { protocol: "STORE-ZERO-REQUEST-1", storeRelease: release, payloadDigest: digest };
        if (sent.requestId?.endsWith("http-500")) {
          res.writeHead(500, { "content-type": "application/json" });
          res.end(JSON.stringify({ ...base, answer: { status: "SUPPORTABLE", requestId: sent.requestId, requestType: sent.requestType, freshEvaluation: true, Q: 1 } }));
          return;
        }
        if (sent.requestId?.endsWith("no-receipt")) {
          res.writeHead(200, { "content-type": "application/json" });
          res.end(JSON.stringify({ ...base, answer: { status: "SUPPORTABLE", requestId: sent.requestId, requestType: sent.requestType, Q: 1 } }));
          return;
        }
        if (sent.requestId?.endsWith("wrong-id")) {
          res.writeHead(200, { "content-type": "application/json" });
          res.end(JSON.stringify({ ...base, answer: { status: "SUPPORTABLE", requestId: "other", requestType: sent.requestType, freshEvaluation: true } }));
          return;
        }
        if (sent.requestId?.endsWith("wrong-release")) {
          res.writeHead(200, { "content-type": "application/json" });
          res.end(JSON.stringify({ ...base, storeRelease: "not-the-server-pin", answer: { status: "SUPPORTABLE", requestId: sent.requestId, requestType: sent.requestType, freshEvaluation: true } }));
          return;
        }
        res.writeHead(200, { "content-type": "text/plain" });
        res.end("not-json");
      });
    });
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      resolve({ url: `http://127.0.0.1:${port}`, close: () => server.close() });
    });
  });
  try {
    const http500 = await answerPublishedWire(wireFor("start-own", "USER_DEFINED_BOARD_V1", "http-500", { line: braceLine() }), adversarial.url);
    assert.equal(http500.httpStatus, 502);
    assert.equal(http500.body.code, "HTTP_500");
    assert.equal(http500.body.rawEstimate, undefined);
    const missingReceipt = await answerPublishedWire(wireFor("start-own", "USER_DEFINED_BOARD_V1", "no-receipt", { line: braceLine() }), adversarial.url);
    assert.equal(missingReceipt.httpStatus, 502);
    assert.equal(missingReceipt.body.code, "QUOTE_REQUIRES_FRESH_EVALUATION");
    assert.equal(missingReceipt.body.rawEstimate, undefined);
    const wrongId = await answerPublishedWire(wireFor("start-own", "USER_DEFINED_BOARD_V1", "wrong-id", { line: braceLine() }), adversarial.url);
    assert.equal(wrongId.body.code, "ANSWER_IDENTITY_MISMATCH");
    const wrongRelease = await answerPublishedWire(wireFor("start-own", "USER_DEFINED_BOARD_V1", "wrong-release", { line: braceLine() }), adversarial.url);
    assert.equal(wrongRelease.body.code, "WRONG_RELEASE");
    const malformed = await answerPublishedWire(wireFor("start-own", "USER_DEFINED_BOARD_V1", "malformed", { line: braceLine() }), adversarial.url);
    assert.equal(malformed.body.code, "RESPONSE_NOT_JSON");
  } finally {
    adversarial.close();
  }
});

