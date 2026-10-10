import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { webcrypto } from "node:crypto";
import test from "node:test";
import vm from "node:vm";

/*
 * The browser Store client's freshness rule, run as the browser runs it with a fake transport that echoes the wire.
 * A contract refusal (a field the Store does not declare yet: REFUSED, reason codes, no receipt, no price) is accepted
 * only when the caller opts in, and only as exactly that. Nothing else without a matching receipt is ever accepted.
 */

const PIN = "c1c044d14485a2c0e66e121543e4e887dcd54e29";
const source = readFileSync(new URL("../../public/live/stb-store-client.js", import.meta.url), "utf8");

type Json = Record<string, any>;
function clientWith(reply: (wire: Json) => Json) {
  const context: Json = {
    URL, TextEncoder, AbortSignal, crypto: webcrypto, JSON, Promise, Object, Array, String, Number, Math, Date, Error, Set, Map, Uint8Array,
    location: { origin: "http://localhost:1", hostname: "localhost" },
    document: { currentScript: { src: "http://localhost:1/live/stb-store-client.js" } },
  };
  context.window = context;
  context.fetch = async (url: string, init: Json = {}) => {
    if (String(url).endsWith("stb-store-runtime.json")) {
      return { ok: true, json: async () => ({ jobEndpoint: "same-origin:/api/store-zero/job", offeringEndpoint: "same-origin:/api/store-zero/offering", storePin: PIN }) };
    }
    const wire = JSON.parse(init.body);
    return { ok: true, json: async () => ({ ...wire, storePin: PIN, ...reply(wire) }) };
  };
  vm.runInNewContext(source, context);
  return context.STBStoreClient as { sendAdmittedJob: (input: Json) => Promise<Json> };
}

const admitted = { interface: "STB-DEFINITION-STORE-0.1", tileId: "playhouse", requestType: "SHEET_PACKAGE_V1", definitionRevisionId: "rev-1" };
const payload = { definition: { configurationId: "X", configurationVersion: "rev-1" }, definitionKind: "sheet_package.v1", ruleVersion: "0.1" };
const contractRefusal = { rawEvaluation: { status: "REFUSED", freshEvaluation: false, evaluationReceipt: null, reasonCodes: ["DEFINITION_FIELD_NOT_DECLARED:features[4].fromEdge"] } };

test("a contract refusal is not accepted by default", async () => {
  const client = clientWith(() => contractRefusal);
  await assert.rejects(client.sendAdmittedJob({ admitted, payload }), /STORE_FRESHNESS_ERROR/);
});

test("a contract refusal is accepted as exactly that when the tile opts in", async () => {
  const client = clientWith(() => contractRefusal);
  const answer = await client.sendAdmittedJob({ admitted, payload, allowNotEvaluatedRefusal: true });
  assert.equal(answer.rawEvaluation.status, "REFUSED");
  assert.equal(answer.rawEvaluation.freshEvaluation, false);
  assert.equal(answer.candidateRevisionId, "rev-1");
});

test("opting in never accepts an answer that is not a refusal with reason codes and no receipt", async () => {
  const cases: Record<string, Json> = {
    "a supportable answer with no receipt": { rawEvaluation: { status: "SUPPORTABLE", freshEvaluation: false, evaluationReceipt: null, reasonCodes: [] } },
    "a refusal with no reasons": { rawEvaluation: { status: "REFUSED", freshEvaluation: false, evaluationReceipt: null, reasonCodes: [] } },
    "an unreceipted fresh claim": { rawEvaluation: { status: "SUPPORTABLE", freshEvaluation: true, evaluationReceipt: null } },
    "a refusal that carries a receipt for another request": { rawEvaluation: { status: "REFUSED", freshEvaluation: false, reasonCodes: ["X"], evaluationReceipt: { requestId: "someone-else" } } },
    "no evaluation at all": {},
  };
  for (const [name, reply] of Object.entries(cases)) {
    const client = clientWith(() => reply);
    await assert.rejects(client.sendAdmittedJob({ admitted, payload, allowNotEvaluatedRefusal: true }), /STORE_FRESHNESS_ERROR/, name);
  }
});

test("opting in still checks that the answer is for this request, revision and pin", async () => {
  const wrongRevision = clientWith(() => ({ ...contractRefusal, candidateRevisionId: "rev-2" }));
  await assert.rejects(wrongRevision.sendAdmittedJob({ admitted, payload, allowNotEvaluatedRefusal: true }), /STORE_CORRELATION_ERROR/);
  const wrongPin = clientWith(() => ({ ...contractRefusal, storePin: "0".repeat(40) }));
  await assert.rejects(wrongPin.sendAdmittedJob({ admitted, payload, allowNotEvaluatedRefusal: true }), /STORE_PIN_MISMATCH/);
});
