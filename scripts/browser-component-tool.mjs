import assert from "node:assert/strict";
import {createHash} from "node:crypto";

/** Submit the original UI packet, retaining exact HTTP bytes and complete Store evidence. */
export async function lowerAcceptedPacket(packet, {storeOrigin, storePin, health, expectReady = true}) {
  assert.equal(health.release, storePin);
  const request = {packet, expectedMachineConfigId: health.machineEvidence.machineConfigId, expectedMachineConfigHash: health.machineEvidence.machineConfigHash};
  const raw = JSON.stringify(request);
  const response = await fetch(storeOrigin + "/v1/machine-evidence", {method: "POST", headers: {"content-type": "application/json"}, body: raw});
  const text = await response.text(), reply = JSON.parse(text);
  assert.equal(response.status, 200, JSON.stringify(reply));
  assert.equal(reply.protocol, health.machineEvidence.protocol);
  assert.equal(reply.storeRelease, storePin);
  assert.equal(reply.payloadDigest, createHash("sha256").update(raw).digest("hex"));
  if (expectReady) {
    const evidence = reply.answer, accepted = packet.storeAnswer;
    assert.equal(accepted.freshEvaluation, true);
    assert.equal(accepted.evaluationReceipt.authority.storeRevision, storePin);
    for (const key of ["boardPartIds", "sheetPackageIds", "featureIds"])
      assert.deepEqual([...accepted.manifestCoverage[key]].sort(), [...packet.definition.manifest[key]].sort());
    assert.deepEqual([...accepted.manifestCoverage.itemLineIds].sort(), packet.definition.manifest.items.map(item => item.lineId).sort());
    assert.equal(evidence.status, "VIRTUAL_EVIDENCE_READY", JSON.stringify(reply));
    assert.equal(evidence.localJob.packetId, packet.packetId);
    assert.equal(evidence.localJob.definitionId, packet.definition.definitionId);
    assert.equal(evidence.localJob.definitionRevision, packet.definition.revisionId);
    assert.equal(evidence.localJob.demandHash, accepted.evaluationReceipt.demandHash);
    assert.equal(evidence.localJob.manifestHash, accepted.evaluationReceipt.manifestHash);
    assert.deepEqual(evidence.localJob.storeCalculationIdentity, accepted.calculationIdentity);
    assert.deepEqual(evidence.localJob.operations, accepted.operations);
    assert.deepEqual(evidence.localJob.parents, accepted.parents);
    assert.deepEqual(evidence.localJob.predictedTime, accepted.time);
    assert.deepEqual(evidence.records.sequence, accepted.operations);
    assert.equal(evidence.records.binding.packetHash, evidence.localJob.packetHash);
    assert.equal(evidence.records.binding.machineConfigHash, health.machineEvidence.machineConfigHash);
    assert.equal(evidence.run.status, "VIRTUAL_MODEL_COMPLETE");
    assert.equal(evidence.run.timeSec, accepted.time.totalSeconds);
    assert.equal(evidence.physicalAuthority, false);
    assert.equal(evidence.admission.status, "BLOCKED");
    assert.equal(evidence.admission.motionCommands, 0);
  }
  return {request, reply, http: {status: response.status, requestBytes: Buffer.byteLength(raw), responseBytes: Buffer.byteLength(text)}};
}

/** Real public controls, shared client, fresh independent Store, original acceptance and exact packet. */
export async function exerciseComponentTool(page, { base, storeOrigin, storePin, entryPath }) {
  const replies = [],
    requests = [],
    readers = [];
  const observe = (response) => {
    if (new URL(response.url()).pathname === "/api/store-zero/job")
      readers.push(response.json().then((body) => replies.push(body)));
  };
  const observeRequest = (request) => {
    if (new URL(request.url()).pathname === "/api/store-zero/job")
      requests.push(request.postDataJSON());
  };
  page.on("response", observe);
  page.on("request", observeRequest);
  const records = [],
    refusals = [];
  try {
    assert.equal(entryPath,"/live/component-tool.html?v=public-conformance-20261017",'Use the actual versioned README tool destination');
    await page.goto(base + entryPath);
    await page.locator("#input-shelfIn").waitFor();
    assert.equal(await page.locator("#ask").isDisabled(), true);
    const prepare = async () => {
      await page.locator("#prepare").click();
      await page.locator("#ask").waitFor({ state: "visible" });
      await page.waitForFunction(() => !document.getElementById("ask").disabled);
      assert.equal(await page.locator("#parts tr").count(), 6);
    };
    const evaluate = async () => {
      await page.locator("#ask").click();
      await page.waitForFunction(() => !document.getElementById("ask").disabled);
      await Promise.all(readers);
      return replies.at(-1);
    };
    const health = await (await fetch(storeOrigin + "/health")).json();
    assert.equal(health.release, storePin);
    const lower = (packet, expectReady = true) => lowerAcceptedPacket(packet, {storeOrigin, storePin, health, expectReady});
    for (const shelfIn of [24, 30]) {
      if (shelfIn !== 24) {
        await page.locator("#input-shelfIn").fill(String(shelfIn));
        assert.equal(await page.locator("#packet").isDisabled(), true);
        assert.equal(await page.locator('[data-terms-action="accept"]').count(), 0);
      }
      await prepare();
      const body = await evaluate();
      assert.equal(body.storePin, storePin);
      assert.equal(body.storeAnswer.status, "SUPPORTABLE");
      assert.equal(body.storeAnswer.complete, true);
      assert.equal(body.candidateRevisionId, body.mappedCallInputs.manifest.revision);
      assert.equal(body.mappedCallInputs.manifest.boardPartIds.length, 6);
      await page.locator('[data-terms-action="accept"]').click();
      await page.waitForFunction(() => !document.getElementById("packet").disabled);
      const downloaded = page.waitForEvent("download");
      await page.locator("#packet").click();
      await downloaded;
      const state = await page.evaluate(async () => {
        const flow = window.STBTermsFlow.instance("registered-components");
        return { accepted: await flow.acceptedPacket(), commercial: flow.state().commercial };
      });
      assert.equal(state.accepted.status, "ACCEPTED_PACKET_READY");
      const packet = state.accepted.packet;
      assert.deepEqual(packet.definition.demand, body.mappedCallInputs.demand);
      assert.deepEqual(packet.definition.manifest, body.mappedCallInputs.manifest);
      assert.deepEqual(packet.storeAnswer, body.storeAnswer);
      const evidence = await lower(packet);
      records.push({ shelfIn, body, packet, commercial: state.commercial, machine: evidence });
    }
    assert.notEqual(records[0].body.candidateRevisionId, records[1].body.candidateRevisionId);
    assert.notEqual(
      records[0].body.evaluationReceipt.receiptHash,
      records[1].body.evaluationReceipt.receiptHash,
    );
    const altered = structuredClone(records[1].packet);
    altered.definition.demand.cutPackages[0].parts[0].lengthIn += 1;
    const tampered = await lower(altered, false);
    assert.equal(tampered.reply.answer.status, "REFUSED");
    assert.equal(tampered.reply.answer.localJob, undefined);
    refusals.push({ kind: "altered-packet", ...tampered });
    await page.locator("#input-sideIn").fill("0");
    const count = requests.length;
    await page.locator("#prepare").click();
    await page
      .locator("#result")
      .filter({ hasText: /VALUE_NOT_POSITIVE/ })
      .waitFor();
    assert.equal(await page.locator("#ask").isDisabled(), true);
    assert.equal(requests.length, count);
    await page.locator("#input-sideIn").fill("8");
    await page.locator("#input-shelfIn").fill("200");
    await prepare();
    const refused = await evaluate();
    assert.equal(refused.storeAnswer.status, "REFUSED");
    assert.equal(refused.storeAnswer.Q, null);
    assert.equal(await page.locator('[data-terms-action="accept"]').count(), 0);
    assert.equal(await page.locator("#packet").isDisabled(), true);
    refusals.push({ kind: "overlong-parts", body: refused });
    const repeated = await evaluate();
    assert.equal(repeated.storeAnswer.status, "REFUSED");
    assert.notEqual(repeated.evaluationReceipt.receiptHash, refused.evaluationReceipt.receiptHash);
    refusals.push({ kind: "repeated-refusal", body: repeated });
    console.log(
      JSON.stringify({
        project: "Display stand components",
        acceptedRevisions: records.map((record) => record.body.candidateRevisionId),
        parts: 6,
        freshStoreReplies: replies.length,
        physicalCommands: 0,
      }),
    );
    return { health, records, refusals, requests };
  } finally {
    page.off("response", observe);
    page.off("request", observeRequest);
  }
}
