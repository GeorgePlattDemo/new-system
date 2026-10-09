import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { compileRecipe } from "../compile.ts";
import { recipeById } from "../recipes/library.ts";
import { beginInquiry, emptyRecord, openRecipe } from "../session.ts";
import { interpretStoreHttp, presentMoney } from "./interpret.ts";
import { STORE_CANDIDATE } from "../store-candidate.ts";

const root = process.env.STORE_ZERO_ROOT;
const release = STORE_CANDIDATE.inspectedCommit;

async function withStore(fn: (base: string) => Promise<void>) {
  if (!root) {
    throw new Error("STORE_ZERO_ROOT is required. This test does not mock the Store.");
  }
  const child = spawn(process.execPath, ["src/service/server.mjs"], {
    cwd: root,
    env: { ...process.env, STORE_ZERO_RELEASE: release, HOST: "127.0.0.1", PORT: "0" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let log = "";
  child.stdout.on("data", (chunk) => {
    log += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    log += chunk.toString();
  });
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
  try {
    await fn(`http://127.0.0.1:${port}`);
  } finally {
    child.kill("SIGTERM");
  }
}

async function post(base: string, body: string, headers: Record<string, string> = {}) {
  const res = await fetch(base + "/v1/requests", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body,
  });
  return { status: res.status, text: await res.text(), cors: res.headers.get("access-control-allow-origin") };
}

test("HTTP: Project 1, the other board, alcove, playhouse, cleats, partial outdoor, lookup and a retired type", async () => {
  await withStore(async (base) => {
    const health = await fetch(base + "/health");
    assert.equal(health.status, 200);
    const healthBody = await health.json();
    assert.equal(healthBody.release, release);
    assert.equal(healthBody.protocol, STORE_CANDIDATE.protocol);

    const ask = async (recipeId: string, inputs?: Record<string, string | number | boolean | null>) => {
      const recipe = recipeById(recipeId)!;
      let opened = openRecipe(emptyRecord(), recipeId);
      if ("error" in opened) throw new Error(opened.error);
      if (inputs) {
        const { setInput, saveRevision } = await import("../session.ts");
        let record = opened.record;
        for (const [key, value] of Object.entries(inputs)) {
          const next = setInput(record, opened.projectId, key, value);
          if ("error" in next) throw new Error(next.error);
          record = next;
        }
        const saved = saveRevision(record, opened.projectId);
        if ("error" in saved) throw new Error(saved.error);
        opened = { record: saved.record, projectId: opened.projectId };
      }
      const started = beginInquiry(opened.record, opened.projectId);
      if (!started.ok) throw new Error(started.code + " " + recipeId);
      const res = await post(base, started.attempt.sentBody);
      const read = interpretStoreHttp({
        sentBody: started.attempt.sentBody,
        sentDigest: started.attempt.sentDigest,
        requestType: JSON.parse(started.attempt.sentBody).requestType,
        requestId: started.attempt.requestId,
        demand: JSON.parse(started.attempt.sentBody).demand,
        httpStatus: res.status,
        responseText: res.text,
      });
      assert.equal(read.outcome, "answer", res.text.slice(0, 400));
      return read.outcome === "answer" ? read.answer : {};
    };

    const project1 = await ask("project-1");
    assert.equal(project1.status, "SUPPORTABLE");
    assert.equal((project1.estimate as { totals: { Q: number } }).totals.Q, 11.09);
    assert.equal(presentMoney(project1).kind, "full");

    const braces = await ask("start-own", { species: "spf" });
    assert.equal(braces.status, "SUPPORTABLE");
    assert.equal((braces.estimate as { totals: { Q: number } }).totals.Q, 8.54);
    assert.notEqual((braces.estimate as { totals: { Q: number } }).totals.Q, 11.09);

    const alcove = await ask("alcove");
    assert.equal(alcove.status, "SUPPORTABLE");
    assert.equal((alcove.totals as { sumOfSupportableLines: number }).sumOfSupportableLines, 429.16);

    const playhouse = await ask("playhouse");
    assert.equal(playhouse.status, "SUPPORTABLE");
    assert.equal((playhouse.totals as { Q: number }).Q, 65.04);

    const windowSeat = await ask("window-seat");
    assert.equal(windowSeat.status, "SUPPORTABLE");
    const windowMoney = presentMoney(windowSeat);
    assert.equal(windowMoney.kind, "full");
    if (windowMoney.kind === "full") assert.equal(windowMoney.amount, 1489.09);

    const aFrame = await ask("outdoor", { planId: "a-frame", wood: "treated", hardwareTier: "BYO" });
    assert.equal(aFrame.status, "SUPPORTABLE");
    const aFrameMoney = presentMoney(aFrame);
    assert.equal(aFrameMoney.kind, "full");
    if (aFrameMoney.kind === "full") assert.equal(aFrameMoney.amount, 256.64);

    const cleats = await ask("closet-cleats");
    assert.equal(cleats.status, "SUPPORTABLE");
    assert.equal(presentMoney(cleats).kind, "full");

    const outdoor = await ask("outdoor", { planId: "table-benches", wood: "ground-contact", hardwareTier: "BYO" });
    assert.ok(outdoor.status === "SUPPORTABLE" || outdoor.status === "NOT_ALL_LINES_SUPPORTABLE");

    const refusedRise = await ask("playhouse", { straightHeightIn: 30 });
    assert.equal(refusedRise.status, "REFUSED");
    assert.equal(presentMoney(refusedRise).kind, "none");

    const lookupBody = JSON.stringify({ requestType: "OFFERING_LOOKUP", requestId: "look-1", demand: { searchText: "2x4 treated 72" } });
    const lookup = await post(base, lookupBody);
    const lookupRead = interpretStoreHttp({
      sentBody: lookupBody,
      sentDigest: (await import("../hash.ts")).sha256Bytes(lookupBody),
      requestType: "OFFERING_LOOKUP",
      requestId: "look-1",
      demand: { searchText: "2x4 treated 72" },
      httpStatus: lookup.status,
      responseText: lookup.text,
    });
    assert.equal(lookupRead.outcome, "answer");
    if (lookupRead.outcome === "answer") {
      assert.equal(lookupRead.answer.evaluationReceipt, undefined);
      assert.equal(presentMoney(lookupRead.answer).kind, "discovery");
      assert.equal("Q" in lookupRead.answer, false);
    }

    const retired = await post(base, JSON.stringify({ requestType: "BOARD_SQUARE_V1", requestId: "no", demand: { count: 3 } }));
    const retiredRead = interpretStoreHttp({
      sentBody: JSON.stringify({ requestType: "BOARD_SQUARE_V1", requestId: "no", demand: { count: 3 } }),
      sentDigest: (await import("../hash.ts")).sha256Bytes(JSON.stringify({ requestType: "BOARD_SQUARE_V1", requestId: "no", demand: { count: 3 } })),
      requestType: "BOARD_SQUARE_V1",
      requestId: "no",
      demand: { count: 3 },
      httpStatus: retired.status,
      responseText: retired.text,
    });
    assert.equal(retiredRead.outcome, "answer");
    if (retiredRead.outcome === "answer") assert.deepEqual(retiredRead.answer.reasonCodes, ["REQUEST_TYPE_NOT_ACCEPTED"]);

    const evil = await post(base, lookupBody, { origin: "https://evil.example" });
    assert.equal(evil.status, 403);
    assert.equal(interpretStoreHttp({
      sentBody: lookupBody,
      sentDigest: (await import("../hash.ts")).sha256Bytes(lookupBody),
      requestType: "OFFERING_LOOKUP",
      requestId: "look-1",
      demand: {},
      httpStatus: evil.status,
      responseText: evil.text,
    }).outcome, "transport");

    const compiled = compileRecipe(recipeById("project-1")!, recipeById("project-1")!.defaults);
    assert.equal((compiled.demand as { definedWorkpieceLengthIn: number }).definedWorkpieceLengthIn, 60);
  });
});
