import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { compileRecipe } from "../compile.ts";
import { recipeById } from "../recipes/library.ts";
import { acceptOffer } from "../acceptance.ts";
import { beginInquiry, emptyRecord, openRecipe } from "../session.ts";
import { interpretMachineEvidence, interpretStoreHttp, presentMoney } from "./interpret.ts";
import { STORE_CANDIDATE } from "../store-candidate.ts";
import { sha256Bytes } from "../hash.ts";

const root = process.env.STORE_ZERO_ROOT;
const release = STORE_CANDIDATE.inspectedCommit;

function assertCheckout() {
  if (!root) throw new Error("STORE_ZERO_ROOT is required. This test does not mock the Store and does not label an unverified checkout.");
  let head = "";
  try {
    head = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
  } catch (error) {
    throw new Error(`Cannot read the git identity of ${root}. Refusing to call it ${release}. ${error instanceof Error ? error.message : ""}`);
  }
  if (head !== release) throw new Error(`Store checkout ${head} is not the pinned commit ${release}.`);
}

async function withStore(fn: (base: string) => Promise<void>) {
  assertCheckout();
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
    assert.equal(project1.status, "UNRESOLVED");
    assert.equal((project1.materialResolution as { reason?: string }).reason, "GRADE_CHOICE_REQUIRED");
    assert.equal(presentMoney(project1).kind, "none");
    assert.equal(project1.estimate, null);

    const braces = await ask("start-own", { species: "spf" });
    assert.equal(braces.status, "SUPPORTABLE");
    assert.equal((braces.estimate as { totals: { Q: number } }).totals.Q, 8.54);
    assert.notEqual((braces.estimate as { totals: { Q: number } }).totals.Q, 11.09);

    const alcove = await ask("alcove");
    assert.equal(alcove.status, "SUPPORTABLE");
    assert.equal((alcove.totals as { sumOfSupportableLines: number }).sumOfSupportableLines, 429.16);

    const playhouse = await ask("playhouse");
    assert.equal(playhouse.status, "SUPPORTABLE");
    assert.equal((playhouse.totals as { Q: number }).Q, 76.57);
    assert.equal((playhouse.totals as { manual_cut_service:number }).manual_cut_service, 20);

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

test("HTTP: machine evidence for a board, a supplied end identity, and a cut package", async () => {
  await withStore(async (base) => {
    const health = await (await fetch(base + "/health")).json();
    assert.equal(health.machineEvidence.protocol, STORE_CANDIDATE.machineEvidenceProtocol);
    assert.equal(health.machineEvidence.machineConfigId, STORE_CANDIDATE.inspectedMachine.machineConfigId);
    assert.equal(health.machineEvidence.machineConfigHash, STORE_CANDIDATE.inspectedMachine.machineConfigHash);
    assert.equal(health.machineEvidence.physicalAuthority, false);

    const packetFor = async (recipeId: string, inputs?: Record<string, string | number | boolean | null>) => {
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
      if (!started.ok) throw new Error(started.code);
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
      assert.equal(read.outcome, "answer", res.text.slice(0, 500));
      if (read.outcome !== "answer") throw new Error("unreachable");
      const recipe = recipeById(recipeId)!;
      const evaluatedAt = (read.answer.evaluationReceipt as { evaluatedAt: string }).evaluatedAt;
      const accepted = acceptOffer({
        decisions: [],
        projectId: opened.projectId,
        classId: recipe.classId ?? recipe.requestType,
        title: recipe.title,
        definitionId: opened.record.projects[0].definitionId,
        revisionId: opened.record.projects[0].currentRevisionId ?? "rev",
        requestType: recipe.requestType,
        demand: JSON.parse(started.attempt.sentBody).demand,
        requirements: recipe.requirements,
        answer: read.answer,
        now: new Date(Date.parse(evaluatedAt) + 1000).toISOString(),
      });
      if (!accepted.ok) throw new Error(accepted.code);
      return accepted.packet;
    };

    const askEvidence = async (packet: unknown) => {
      const body = JSON.stringify({
        packet,
        expectedMachineConfigId: health.machineEvidence.machineConfigId,
        expectedMachineConfigHash: health.machineEvidence.machineConfigHash,
      });
      const res = await fetch(base + "/v1/machine-evidence", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
      });
      const text = await res.text();
      const read = interpretMachineEvidence({
        sentBody: body,
        sentDigest: sha256Bytes(body),
        httpStatus: res.status,
        responseText: text,
        expectedPacketId: (packet as { packetId: string }).packetId,
      });
      assert.equal(read.outcome, "answer", text.slice(0, 500));
      return read.outcome === "answer" ? read.answer : {};
    };

    const board = await packetFor("start-own", { species: "spf" });
    assert.equal(board.definition.requirements.endIdentity, undefined);
    const ready = await askEvidence(board);
    assert.equal(ready.status, "VIRTUAL_EVIDENCE_READY");
    assert.equal(ready.physicalAuthority, false);
    assert.equal((ready.admission as { status: string; motionCommands: number }).status, "BLOCKED");
    assert.equal((ready.admission as { motionCommands: number }).motionCommands, 0);
    const time = (ready.run as { timeSec: number }).timeSec;
    assert.equal(typeof time, "number");
    assert.ok(time > 0);
    assert.notEqual(time, 85.5001);

    const named = structuredClone(board);
    named.definition.requirements = { ...named.definition.requirements, endIdentity: "miter-face-long-point" };
    const refusedEnd = await askEvidence(named);
    assert.equal(refusedEnd.status, "REFUSED");
    assert.ok((refusedEnd.reasonCodes as string[]).includes("PACKET_REQUIREMENTS_DIFFER_FROM_DEFINITION"));
    assert.equal(refusedEnd.localJob, undefined);
    assert.equal(refusedEnd.records, undefined);

    const cleats = await packetFor("closet-cleats");
    assert.equal(cleats.definition.requirements.endIdentity, "square-end");
    const refusedCut = await askEvidence(cleats);
    assert.equal(refusedCut.status, "REFUSED");
    assert.ok((refusedCut.reasonCodes as string[]).includes("LOWERING_NOT_REGISTERED_FOR:CUT_PACKAGE_V1"));
    assert.equal(refusedCut.records, undefined);
  });
});
