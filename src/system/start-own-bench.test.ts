import assert from "node:assert/strict";
import test from "node:test";
import { acceptAnswer, benchView, isChangeWoodTool, spotAlongPart } from "../../public/live/stb-start-own-answer.mjs";

function answer(status: string, stock: number, q: number) {
  return {
    rawEvaluation: { status, materialResolution: status === "UNRESOLVED" ? { reason: "GRADE_CHOICE_REQUIRED", offeredGrades: ["above-ground", "ground-contact"] } : {} },
    rawEstimate: status === "SUPPORTABLE" ? { complete: true, totals: { Q: q, material: 3.13, machine_service: 5.94 }, cycle: { T_job_min: 1.425 } } : null,
    materialResolution: { storeSku: stock === 72 ? "STB-ZERO-SPF-2X4-72-001" : "STB-ZERO-SPF-2X4-60-001", workpieceLengthIn: stock, stockLengthIn: stock },
    priceCompleteness: { status: status === "SUPPORTABLE" ? "COMPLETE_FOR_TRAVEL_STANDARD" : status },
  };
}

test("16 in spot is 8 in and 18 in spot is 9 in on the finished-part center", () => {
  assert.equal(spotAlongPart(16)?.xIn, 8);
  assert.equal(spotAlongPart(18)?.xIn, 9);
  assert.equal(spotAlongPart(16)?.datum.includes("finished-part"), true);
});

test("a 60 in Store selection does not show the longer-board frame", () => {
  const view = benchView({ finishedLengthIn: 16, species: "spf", spotIn: 8, answer: answer("SUPPORTABLE", 60, 8.54) });
  assert.equal(view.selection.q, 8.54);
  assert.equal(view.swap.visible, false);
  assert.equal(view.sku, "STB-ZERO-SPF-2X4-60-001");
});

test("null price data stays missing and is not treated as zero", () => {
  const missing = answer("SUPPORTABLE", 72, null as unknown as number);
  missing.rawEstimate.totals.Q = null;
  missing.rawEstimate.totals.machine_service = null;
  const view = benchView({ finishedLengthIn: 18, species: "spf", spotIn: 9, answer: missing });
  assert.equal(view.selection.quote, false);
  assert.equal(view.selection.q, null);
  assert.equal(view.swap.visible, false);
});

test("the longer-board frame uses the Store refusal, not a generic longer-SKU sentence", () => {
  const body = answer("SUPPORTABLE", 72, 9.07);
  body.materialResolution.consideredCandidates = [
    { storeSku: "STB-ZERO-SPF-2X4-60-001", stockLengthIn: 60, candidateStatus: "REFUSED", reason: "LAST_REMAIN_BELOW_TWO_ROLLER_CONTROL" },
  ];
  body.rawEstimate.travel = { finalRemainderIn: 35.625 };
  const view = benchView({ finishedLengthIn: 18, species: "spf", spotIn: 9, answer: body });
  assert.equal(view.swap.visible, true);
  assert.equal(view.swap.html.includes("LAST_REMAIN_BELOW_TWO_ROLLER_CONTROL"), true);
  assert.equal(view.swap.html.includes("35.625"), true);
  assert.equal(view.selection.machineService, 5.94);
});

test("a refusal does not claim the Store grabbed a longer board", () => {
  const view = benchView({ finishedLengthIn: 18, species: "spf", spotIn: 9, answer: answer("REFUSED", 72, 9.07) });
  assert.equal(view.swap.visible, false);
  assert.equal(view.selection.quote, false);
});

test("an older revision cannot authorize the current one", () => {
  assert.equal(acceptAnswer("v2", "v2"), true);
  assert.equal(acceptAnswer("v2", "v1"), false);
});

test("Change Wood is a tool; a generic label is not a species selector", () => {
  assert.equal(isChangeWoodTool("Change Wood"), true);
  assert.equal(isChangeWoodTool("Taper"), false);
});
