import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { calculationHash, sha256Bytes } from "./hash.ts";
import { compileRecipe, isSupportedOp } from "./compile.ts";
import { LIBRARY, recipeById } from "./recipes/library.ts";
import { presentMoney, interpretStoreHttp, interpretMachineEvidence, serializeRequest } from "./store/interpret.ts";
import { acceptOffer, wireRequirements } from "./acceptance.ts";
import { machineBoundary } from "./machine.ts";
import {
  acceptCurrent,
  applyInquiryResult,
  beginInquiry,
  emptyRecord,
  loadRecord,
  openRecipe,
  reopen,
  parkForReopen,
  saveRevision,
  selectProject,
  setInput,
  visibleState,
} from "./session.ts";
import { shapeProblems, DEFINITION_SHAPES } from "./shape.ts";
import { STORE_CANDIDATE } from "./store-candidate.ts";

const publishedDemand = JSON.parse(readFileSync(new URL("./fixtures/definition-and-demand.json", import.meta.url), "utf8")).demand;
const publishedReview = JSON.parse(readFileSync(new URL("./fixtures/review-summary.json", import.meta.url), "utf8"));

function fixtureAnswer(args: {
  requestType: string;
  requestId: string;
  demand: unknown;
  status?: string;
  release?: string;
  evaluatedAt?: string;
  receiptStatus?: string;
  freshnessRule?: string;
  extra?: Record<string, unknown>;
}) {
  const status = args.status ?? "SUPPORTABLE";
  const identity = { fixture: "system-test" };
  const core: Record<string, unknown> = {
    freshnessRule: args.freshnessRule ?? "STB-STORE-FRESH-EVALUATION-0.1",
    requestType: args.requestType,
    requestId: args.requestId,
    evaluatedAt: args.evaluatedAt ?? "2026-10-08T18:00:00.000Z",
    authority: { storeRevision: args.release ?? STORE_CANDIDATE.inspectedCommit, catalogHash: "ab".repeat(32) },
    demandHash: calculationHash(args.demand),
    status: args.receiptStatus ?? status,
    calculationIdentity: identity,
  };
  return {
    requestType: args.requestType,
    requestId: args.requestId,
    status,
    freshEvaluation: true,
    calculationIdentity: identity,
    ...args.extra,
    evaluationReceipt: { ...core, receiptHash: calculationHash(core) },
  };
}

function wrapperFor(sentDigest: string, answer: Record<string, unknown>, release = STORE_CANDIDATE.inspectedCommit) {
  return { protocol: STORE_CANDIDATE.protocol, storeRelease: release, payloadDigest: sentDigest, respondedAt: "2026-10-08T18:00:01.000Z", answer };
}

test("project 1 and the second board job share one compiler", () => {
  const project1 = recipeById("project-1");
  const start = recipeById("start-own");
  assert.ok(project1 && start);
  assert.equal(project1.rule.op, start.rule.op);
  assert.equal(isSupportedOp("board-workpiece"), true);
  const specimen = compileRecipe(project1, project1.defaults);
  assert.equal(specimen.blockers.length, 0);
  assert.deepEqual(specimen.demand, publishedDemand);
  const other = compileRecipe(start, { ...start.defaults, species: "spf" });
  assert.equal(other.blockers.length, 0);
  assert.notDeepEqual(other.demand, specimen.demand);
  assert.equal((other.demand as { materialDemand: { species: string } }).materialDemand.species, "spf");
  assert.equal((other.demand as { parts: { lengthIn: number }[] }).parts[0].lengthIn, 16);
  assert.equal((other.demand as { sawAngleDeg: number }).sawAngleDeg, 30);
});

test("a missing species is an admission blocker and is not sent", () => {
  const start = recipeById("start-own")!;
  const compiled = compileRecipe(start, start.defaults);
  assert.ok(compiled.blockers.some((item) => item.fact === "species"));
  assert.equal(compiled.demand, null);
});

test("alcove compiles to cut packages with a 3 in rip and a requirement id, not a store sku", () => {
  const recipe = recipeById("alcove")!;
  const compiled = compileRecipe(recipe, recipe.defaults);
  assert.equal(compiled.engine, "supported");
  const demand = compiled.demand as {
    cutPackages: { packageId: string; finishedWidthIn?: number; parts: unknown[] }[];
    itemLines: { requirementId?: string; storeSku?: string }[];
  };
  const ripped = demand.cutPackages.find((pkg) => pkg.packageId === "SHELF-1X6-TO-3");
  assert.equal(ripped?.finishedWidthIn, 3);
  assert.equal(ripped?.parts.length, 5);
  assert.equal(demand.cutPackages.find((pkg) => pkg.packageId === "SHELF-1X6")?.parts.length, 10);
  assert.equal(demand.itemLines[0].requirementId, "ALCOVE-PINS-AND-SCREWS");
  assert.equal(demand.itemLines[0].storeSku, undefined);
  assert.equal(JSON.stringify(compiled).includes("ALCOVE_INSERT_V1"), false);
});

test("playhouse radius is the documented formula and a bad rise is not clamped", () => {
  const recipe = recipeById("playhouse")!;
  const compiled = compileRecipe(recipe, recipe.defaults);
  const radius = compiled.trace.find((step) => step.id === "arch-radius");
  assert.equal(radius?.output, 19.5);
  const tall = compileRecipe(recipe, { ...recipe.defaults, straightHeightIn: 30 });
  assert.equal(tall.blockers.length, 0, "admission does not refuse Store capability");
  assert.equal((tall.demand as { features: { straightHeightIn: number }[] }).features[0].straightHeightIn, 30);
});

test("outdoor sends nothing until a plan and a wood are chosen", () => {
  const recipe = recipeById("outdoor")!;
  assert.equal(compileRecipe(recipe, recipe.defaults).demand, null);
  const chosen = compileRecipe(recipe, { ...recipe.defaults, planId: "a-frame", wood: "treated" });
  assert.equal(chosen.blockers.length, 0);
  const packages = (chosen.demand as { cutPackages: { packageId: string; endCut: { angleDeg: number }; parts: { lengthIn: number }[] }[]; itemLines?: unknown[] }).cutPackages;
  assert.equal(packages.find((pkg) => pkg.packageId === "LEGS")?.endCut.angleDeg, 25);
  assert.equal(packages.find((pkg) => pkg.packageId === "LEGS")?.parts[0].lengthIn, 31.375);
  assert.equal(packages.find((pkg) => pkg.packageId === "SLATS")?.parts[0].lengthIn, 72);
  assert.equal((chosen.demand as { itemLines?: unknown[] }).itemLines, undefined);
});

test("closet cleats are data on the supported part-groups rule", () => {
  const recipe = recipeById("closet-cleats")!;
  assert.equal(recipe.engine, "supported");
  assert.equal(recipe.rule.op, "part-groups");
  assert.equal(isSupportedOp("part-groups"), true);
  const compiled = compileRecipe(recipe, recipe.defaults);
  assert.equal(compiled.engine, "supported");
  assert.equal(compiled.extensionId, undefined);
  const parts = (compiled.demand as { cutPackages: { parts: { partId: string; lengthIn: number }[] }[] }).cutPackages[0].parts;
  assert.deepEqual(parts.map((part) => part.partId), ["CLEAT-LONG-01", "CLEAT-LONG-02", "CLEAT-SHORT-01"]);
  const unknown = compileRecipe({ ...recipe, rule: { op: "page-name-switch" } }, recipe.defaults);
  assert.equal(unknown.demand, null);
  assert.equal(unknown.engine, "extension");
  assert.equal(unknown.blockers[0].code, "ENGINE_EXTENSION_REQUIRED");
});

test("window seat is named as an engine extension and keeps 94 in uprights", () => {
  const recipe = recipeById("window-seat")!;
  assert.equal(recipe.engine, "extension");
  const compiled = compileRecipe(recipe, recipe.defaults);
  assert.equal(compiled.engine, "extension");
  assert.equal(compiled.extensionId, "window-seat-layout");
  const parts = (compiled.demand as { cutPackages: { parts: { lengthIn: number; partId: string }[]; finishedWidthIn?: number }[] }).cutPackages.flatMap((pkg) => pkg.parts);
  assert.equal(parts.length, 48);
  assert.ok(parts.some((part) => part.lengthIn === 94 && part.partId.includes("UPRIGHT")));
  assert.ok((compiled.demand as { cutPackages: { finishedWidthIn?: number }[] }).cutPackages.every((pkg) => pkg.finishedWidthIn === 7));
});

test("an undeclared field is a blocker, not a silent drop", () => {
  const recipe = recipeById("closet-cleats")!;
  const compiled = compileRecipe(recipe, recipe.defaults);
  assert.ok(compiled.demand);
  const dirty = { ...compiled.demand, spline: "no" };
  const problems = shapeProblems(dirty, DEFINITION_SHAPES.CUT_PACKAGE_V1);
  assert.ok(problems.some((code) => code.includes("spline")));
});

test("editing invalidates the current attempt and a late answer cannot update it", () => {
  let opened = openRecipe(emptyRecord(), "closet-cleats");
  assert.ok(!("error" in opened));
  const id = opened.projectId;
  let record = opened.record;
  let started = beginInquiry(record, id);
  assert.equal(started.ok, true);
  if (!started.ok) return;
  record = started.record;
  const attemptId = started.attempt.attemptId;
  const edited = setInput(record, id, "longIn", 40);
  assert.ok(!("error" in edited));
  record = edited as typeof record;
  const saved = saveRevision(record, id);
  assert.ok(!("error" in saved));
  record = saved.record;
  const late = applyInquiryResult(record, id, attemptId, 200, "{}");
  assert.equal(late.applied, false);
  assert.equal(late.code, "REJECTED_LATE");
  assert.equal(visibleState(late.record.projects[0]), "ready");
});

test("transport failure is not a Store refusal or a zero price", () => {
  let opened = openRecipe(emptyRecord(), "closet-cleats");
  if ("error" in opened) throw new Error(opened.error);
  let started = beginInquiry(opened.record, opened.projectId);
  assert.equal(started.ok, true);
  if (!started.ok) return;
  const applied = applyInquiryResult(started.record, opened.projectId, started.attempt.attemptId, 503, "down");
  assert.equal(applied.code, "HTTP_503");
  assert.equal(visibleState(applied.record.projects[0]), "transport_failure");
  const interpreted = started.attempt && interpretStoreHttp({
    sentBody: started.attempt.sentBody,
    sentDigest: started.attempt.sentDigest,
    requestType: "CUT_PACKAGE_V1",
    requestId: started.attempt.requestId,
    demand: {},
    httpStatus: 503,
    responseText: "down",
  });
  assert.equal(interpreted.outcome, "transport");
  assert.equal(presentMoney(null).kind, "none");
});

test("discovery is not Q and cannot be accepted", () => {
  const answer = { requestType: "OFFERING_LOOKUP", requestId: "L1", status: "ANSWERED", kind: "SEARCH", offerings: [] };
  assert.equal(presentMoney(answer).kind, "discovery");
  const accepted = acceptOffer({
    decisions: [],
    projectId: "p",
    classId: "lookup",
    title: "lookup",
    definitionId: "d",
    revisionId: "r",
    requestType: "OFFERING_LOOKUP",
    demand: { searchText: "2x4" },
    requirements: { endRelation: "n/a", lengthDatum: "n/a", endIdentity: "n/a" },
    answer,
  });
  assert.equal(accepted.ok, false);
});

test("partial sum is not labeled as a full job Q", () => {
  const view = presentMoney({ status: "NOT_ALL_LINES_SUPPORTABLE", totals: { sumOfSupportableLines: 12.5 } });
  assert.equal(view.kind, "partial");
  if (view.kind === "partial") assert.match(view.label, /Not a full job Q/);
});

test("wrong release, bad digest, altered receipt and a contradictory receipt are protocol failures", () => {
  const demand = { title: "x" };
  const sent = serializeRequest({ requestType: "USER_DEFINED_BOARD_V1", requestId: "A", demand });
  const answer = fixtureAnswer({ requestType: "USER_DEFINED_BOARD_V1", requestId: "A", demand });
  const good = wrapperFor(sent.digest, answer);
  const base = { sentBody: sent.body, sentDigest: sent.digest, requestType: "USER_DEFINED_BOARD_V1", requestId: "A", demand, httpStatus: 200 };
  assert.equal(interpretStoreHttp({ ...base, responseText: JSON.stringify(good) }).outcome, "answer");
  assert.equal(interpretStoreHttp({ ...base, responseText: JSON.stringify({ ...good, storeRelease: "other" }) }).outcome, "protocol");
  assert.equal(interpretStoreHttp({ ...base, responseText: JSON.stringify({ ...good, payloadDigest: "nope" }) }).outcome, "protocol");
  const altered = structuredClone(good);
  (altered.answer.evaluationReceipt as { receiptHash: string }).receiptHash = "dead";
  assert.equal(interpretStoreHttp({ ...base, responseText: JSON.stringify(altered) }).outcome, "protocol");
  const otherRelease = interpretStoreHttp({ ...base, responseText: JSON.stringify(wrapperFor(sent.digest, fixtureAnswer({ requestType: "USER_DEFINED_BOARD_V1", requestId: "A", demand, release: "not-this-store" }))) });
  if (otherRelease.outcome !== "protocol") assert.fail(otherRelease.outcome);
  assert.equal(otherRelease.code, "RECEIPT_RELEASE_MISMATCH");
  const badTime = interpretStoreHttp({ ...base, responseText: JSON.stringify(wrapperFor(sent.digest, fixtureAnswer({ requestType: "USER_DEFINED_BOARD_V1", requestId: "A", demand, evaluatedAt: "2026-02-31T00:00:00.000Z" }))) });
  if (badTime.outcome !== "protocol") assert.fail(badTime.outcome);
  assert.equal(badTime.code, "RECEIPT_TIME_INVALID");
  const contradictory = interpretStoreHttp({ ...base, responseText: JSON.stringify(wrapperFor(sent.digest, fixtureAnswer({ requestType: "USER_DEFINED_BOARD_V1", requestId: "A", demand, receiptStatus: "REFUSED", evaluatedAt: "yesterday", release: "other-store" }))) });
  if (contradictory.outcome !== "protocol") assert.fail(contradictory.outcome);
  assert.equal(contradictory.code, "RECEIPT_STATUS_CONTRADICTION");
  const switched = structuredClone(good);
  switched.answer.requestId = "B";
  (switched.answer.evaluationReceipt as { requestId: string; receiptHash: string }).requestId = "B";
  const core = { ...(switched.answer.evaluationReceipt as object) } as Record<string, unknown>;
  delete core.receiptHash;
  (switched.answer.evaluationReceipt as { receiptHash: string }).receiptHash = calculationHash(core);
  assert.equal(interpretStoreHttp({ ...base, responseText: JSON.stringify(switched) }).outcome, "protocol");
});

test("reopen keeps history and requires a new inquiry before acceptance", () => {
  let opened = openRecipe(emptyRecord(), "closet-cleats");
  if ("error" in opened) throw new Error(opened.error);
  const id = opened.projectId;
  let started = beginInquiry(opened.record, id);
  if (!started.ok) throw new Error(started.code);
  const demand = JSON.parse(started.attempt.sentBody).demand;
  const answer = fixtureAnswer({
    requestType: "CUT_PACKAGE_V1",
    requestId: started.attempt.requestId,
    demand,
    extra: { totals: { sumOfSupportableLines: 10 } },
  });
  const wrapper = wrapperFor(started.attempt.sentDigest, answer);
  let applied = applyInquiryResult(started.record, id, started.attempt.attemptId, 200, JSON.stringify(wrapper));
  assert.equal(visibleState(applied.record.projects[0]), "supportable");
  let accepted = acceptCurrent(applied.record, id, "2026-10-09T00:00:00.000Z");
  assert.equal(accepted.code, "ACCEPTED_SIMULATED");
  const again = acceptCurrent(accepted.record, id, "2026-10-09T00:00:01.000Z");
  assert.equal(again.duplicate, true);
  assert.equal(again.record.projects[0].decisions.length, 1);
  assert.equal(again.record.projects[0].packets.length, 1);
  assert.equal(again.record.projects[0].packets[0].authority.physicalRelease, false);
  const reopened = reopen(again.record, id);
  if ("error" in reopened) throw new Error(reopened.error);
  assert.equal(reopened.projects[0].revisions.length, 1);
  assert.equal(reopened.projects[0].decisions.length, 1);
  assert.equal(acceptCurrent(reopened, id).code, "ANSWER_NOT_CURRENT");
  assert.equal(machineBoundary("CUT_PACKAGE_V1").loweringRegistered, false);
  assert.equal(machineBoundary("USER_DEFINED_BOARD_V1").loweringRegistered, true);
  assert.equal(machineBoundary("USER_DEFINED_BOARD_V1").physicalAuthority, false);
  assert.equal(machineBoundary("SHEET_PACKAGE_V1").physicalAdmission, "BLOCKED");
});

test("a response after a project switch does not land on the other project", () => {
  const first = openRecipe(emptyRecord(), "closet-cleats");
  if ("error" in first) throw new Error(first.error);
  const second = openRecipe(first.record, "playhouse");
  if ("error" in second) throw new Error(second.error);
  const started = beginInquiry(second.record, first.projectId);
  if (!started.ok) throw new Error(started.code);
  const switched = selectProject(started.record, second.projectId);
  const late = applyInquiryResult(switched, second.projectId, started.attempt.attemptId, 200, "{}");
  assert.equal(late.code, "UNKNOWN_ATTEMPT");
  const stale = applyInquiryResult(switched, first.projectId, started.attempt.attemptId, 200, "{}");
  assert.equal(stale.code, "REJECTED_LATE");
});

test("malformed and unknown saved records are not converted", () => {
  assert.equal(loadRecord(null).ok, false);
  assert.equal(loadRecord({ schema: "STB-SYSTEM-RECORD-0", projects: [] }).ok, false);
  if (!loadRecord({ schema: "STB-SYSTEM-RECORD-0", projects: [] }).ok) {
    assert.equal(loadRecord({ schema: "STB-SYSTEM-RECORD-0", projects: [] }).ok === false && (loadRecord({ schema: "STB-SYSTEM-RECORD-0", projects: [] }) as { code: string }).code, "UNSUPPORTED_VERSION");
  }
  assert.equal(loadRecord({ schema: "STB-SYSTEM-RECORD-1", projects: [] }).ok, true);
});

test("reopening a saved file keeps the decision and retires the price", () => {
  let opened = openRecipe(emptyRecord(), "closet-cleats");
  if ("error" in opened) throw new Error(opened.error);
  const id = opened.projectId;
  const started = beginInquiry(opened.record, id);
  if (!started.ok) throw new Error(started.code);
  const demand = JSON.parse(started.attempt.sentBody).demand;
  const answer = fixtureAnswer({
    requestType: "CUT_PACKAGE_V1",
    requestId: started.attempt.requestId,
    demand,
    extra: { totals: { sumOfSupportableLines: 23.4 } },
  });
  const wrapper = wrapperFor(started.attempt.sentDigest, answer);
  const applied = applyInquiryResult(started.record, id, started.attempt.attemptId, 200, JSON.stringify(wrapper));
  const accepted = acceptCurrent(applied.record, id, "2026-10-09T00:00:00.000Z");
  const parked = parkForReopen(accepted.record);
  assert.equal(parked.projects[0].decisions.length, 1);
  assert.equal(parked.projects[0].packets.length, 1);
  assert.equal(parked.projects[0].attempts.length, 1);
  assert.equal(parked.projects[0].pricesCurrent, false);
  assert.equal(parked.projects[0].activeAttemptId, null);
  assert.equal(acceptCurrent(parked, id).code, "ANSWER_NOT_CURRENT");
  assert.equal(visibleState(parked.projects[0]), "ready");
  assert.deepEqual(parked.projects[0].packets[0].definition.demand, demand);
});

test("published project 1 evidence is unchanged and is not a live Q", () => {
  assert.equal(publishedReview.storeTotals.Q, 11.09);
  assert.equal(publishedReview.storeTimeSec, 85.5001);
  assert.notEqual(publishedReview.virtualTimeSec, publishedReview.storeTimeSec);
  assert.equal(publishedReview.physicalAdmission, "BLOCKED");
  assert.equal(sha256Bytes(readFileSync(new URL("./fixtures/review-summary.json", import.meta.url), "utf8")).length, 64);
});

test("retired request types are not in the library", () => {
  const blob = JSON.stringify(LIBRARY);
  assert.equal(blob.includes("BOARD_SQUARE_V1"), false);
  assert.equal(blob.includes("ALCOVE_INSERT_V1"), false);
  assert.equal(LIBRARY.length, 7);
});

test("an invalid spot control is not turned into no spots", () => {
  const start = recipeById("start-own")!;
  const compiled = compileRecipe(start, { ...start.defaults, species: "spf", spots: "maybe" });
  assert.equal(compiled.demand, null);
  assert.ok(compiled.blockers.some((item) => item.code === "INPUT_TYPE" && item.fact === "spots"));
  const off = compileRecipe(start, { ...start.defaults, species: "spf", spots: false });
  assert.equal(off.blockers.length, 0);
  assert.equal((off.demand as { declaredSpotCount: number }).declaredSpotCount, 0);
});

test("window seat zero shelves is a real count and emits no tower shelf", () => {
  const recipe = recipeById("window-seat")!;
  const compiled = compileRecipe(recipe, { ...recipe.defaults, leftShelves: 0, rightShelves: 0 });
  assert.equal(compiled.blockers.length, 0);
  assert.ok(compiled.demand);
  const ids = (compiled.demand as { cutPackages: { parts: { partId: string }[] }[] }).cutPackages.flatMap((pkg) => pkg.parts.map((part) => part.partId));
  assert.equal(ids.some((id) => id.startsWith("L-SHELF") || id.startsWith("R-SHELF")), false);
  assert.ok(ids.some((id) => id.includes("UPPER-SHELF")));
});

test("a null project does not load, and a saved project round-trips", () => {
  const broken = loadRecord({ schema: "STB-SYSTEM-RECORD-1", projects: [null] });
  assert.equal(broken.ok, false);
  if (!broken.ok) assert.equal(broken.code, "MALFORMED");
  const opened = openRecipe(emptyRecord(), "closet-cleats");
  if ("error" in opened) throw new Error(opened.error);
  const again = loadRecord(JSON.parse(JSON.stringify(opened.record)));
  assert.equal(again.ok, true);
});

test("a later refusal is not still shown as accepted, and the earlier acceptance stays", () => {
  let opened = openRecipe(emptyRecord(), "closet-cleats");
  if ("error" in opened) throw new Error(opened.error);
  const id = opened.projectId;
  const started = beginInquiry(opened.record, id);
  if (!started.ok) throw new Error(started.code);
  const demand = JSON.parse(started.attempt.sentBody).demand;
  const answer = fixtureAnswer({ requestType: "CUT_PACKAGE_V1", requestId: started.attempt.requestId, demand, extra: { totals: { sumOfSupportableLines: 23.4 } } });
  const applied = applyInquiryResult(started.record, id, started.attempt.attemptId, 200, JSON.stringify(wrapperFor(started.attempt.sentDigest, answer)));
  const accepted = acceptCurrent(applied.record, id, "2026-10-09T00:00:00.000Z");
  assert.equal(visibleState(accepted.record.projects[0]), "accepted_simulated");
  const again = beginInquiry(accepted.record, id);
  if (!again.ok) throw new Error(again.code);
  const refused = fixtureAnswer({ requestType: "CUT_PACKAGE_V1", requestId: again.attempt.requestId, demand, status: "REFUSED", extra: { reasonCodes: ["FIXTURE_REFUSAL"] } });
  const next = applyInquiryResult(again.record, id, again.attempt.attemptId, 200, JSON.stringify(wrapperFor(again.attempt.sentDigest, refused)));
  assert.equal(visibleState(next.record.projects[0]), "refused");
  assert.equal(next.record.projects[0].decisions.length, 1);
  assert.equal(next.record.projects[0].packets.length, 1);
  assert.equal(next.record.projects[0].packets[0].authority.physicalRelease, false);
});

test("a board packet omits a null end identity and does not strip a supplied one", () => {
  const recipe = recipeById("project-1")!;
  const compiled = compileRecipe(recipe, recipe.defaults);
  assert.equal(compiled.requirements.endIdentity, null);
  assert.match(compiled.requirements.endExplanation ?? "", /does not send one/);
  const demand = compiled.demand as Record<string, unknown>;
  const answer = fixtureAnswer({ requestType: "USER_DEFINED_BOARD_V1", requestId: "board-1", demand });
  const omitted = acceptOffer({
    decisions: [],
    projectId: "p",
    classId: recipe.classId ?? recipe.requestType,
    title: recipe.title,
    definitionId: "d",
    revisionId: "r",
    requestType: recipe.requestType,
    demand,
    requirements: compiled.requirements,
    answer,
    now: "2026-10-09T00:00:00.000Z",
  });
  assert.equal(omitted.ok, true);
  if (!omitted.ok) return;
  assert.equal(omitted.packet.definition.requirements.endIdentity, undefined);
  assert.equal("endExplanation" in omitted.packet.definition.requirements, false);
  assert.deepEqual(wireRequirements(compiled.requirements), { endRelation: "parallel", lengthDatum: "long-long-outer-edge" });
  const supplied = acceptOffer({
    decisions: [],
    projectId: "p",
    classId: "c",
    title: "t",
    definitionId: "d",
    revisionId: "r2",
    requestType: recipe.requestType,
    demand,
    requirements: { ...compiled.requirements, endIdentity: "miter-face-long-point" },
    answer,
    now: "2026-10-09T00:00:00.000Z",
  });
  assert.equal(supplied.ok, true);
  if (supplied.ok) assert.equal(supplied.packet.definition.requirements.endIdentity, "miter-face-long-point");
});

test("physical authority on machine evidence is not success", () => {
  const body = JSON.stringify({
    packet: { packetId: "p" },
    expectedMachineConfigId: STORE_CANDIDATE.inspectedMachine.machineConfigId,
    expectedMachineConfigHash: STORE_CANDIDATE.inspectedMachine.machineConfigHash,
  });
  const digest = (awaitedDigest(body));
  const claim = {
    protocol: STORE_CANDIDATE.machineEvidenceProtocol,
    storeRelease: STORE_CANDIDATE.inspectedCommit,
    payloadDigest: digest,
    respondedAt: "2026-10-08T18:00:01.000Z",
    answer: { status: "VIRTUAL_EVIDENCE_READY", physicalAuthority: true, localJob: {}, records: {}, run: {}, admission: { status: "BLOCKED", physicalAuthority: false, motionCommands: 0 } },
  };
  const read = interpretMachineEvidence({ sentBody: body, sentDigest: digest, httpStatus: 200, responseText: JSON.stringify(claim), expectedPacketId: "p" });
  assert.equal(read.outcome, "protocol");
  if (read.outcome === "protocol") assert.equal(read.code, "PHYSICAL_AUTHORITY_CLAIMED");
});

function awaitedDigest(body: string) {
  return sha256Bytes(body);
}
