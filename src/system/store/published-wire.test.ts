import assert from "node:assert/strict";
import { execFileSync, spawn, type ChildProcess } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { webcrypto } from "node:crypto";
import { STORE_CANDIDATE } from "../store-candidate.ts";
import { answerPublishedWire, boardDemandFromPublishedLine, postPublishedWire } from "./published-wire.ts";
import { DEFINITION_SHAPES } from "../shape.ts";
import { fileURLToPath, pathToFileURL } from "node:url";
import {componentDefinition} from "../component-tool.ts";

const root = process.env.STORE_ZERO_ROOT;
const release = STORE_CANDIDATE.inspectedCommit;
const tileHostContract = await import(new URL("../../../public/live/shared/tile-host-admission-contract.mjs", import.meta.url).href);
let child: ChildProcess | null = null;
let origin = "";

function assertCheckout(checkout = root) {
  if (!checkout) throw new Error("STORE_ZERO_ROOT is required. This test does not mock the Store.");
  const head = execFileSync("git", ["rev-parse", "HEAD"], { cwd: checkout, encoding: "utf8" }).trim();
  if (head !== release) throw new Error(`Store checkout ${head} is not the pinned commit ${release}.`);
  const dirty=execFileSync("git",["status","--porcelain"],{cwd:checkout,encoding:"utf8"}).trim();
  if(dirty)throw new Error("Pinned Store checkout has modified or untracked files; refusing to label it as the inspected release.");
}

const systemRoot = fileURLToPath(new URL("../../../", import.meta.url));
const commercialFile = fileURLToPath(new URL("../../../public/live/stb-commercial-sequence.js", import.meta.url));

// Private arguments permit negative test copies; the required pairing test uses
// the actual System source and the same exact, clean Store checkout as HTTP tests.
function assertCommercialPair(checkout = root, systemFile = commercialFile) {
  const systemRevision = execFileSync("git", ["rev-parse", "HEAD"], { cwd: systemRoot, encoding: "utf8" }).trim();
  const storeFile = join(checkout ?? "<STORE_ZERO_ROOT missing>", "src/contracts/commercial-sequence.js");
  const sources = `System ${systemFile} @ ${systemRevision}; Store ${storeFile} @ required ${release}`;
  try {
    assertCheckout(checkout);
    assert.ok(readFileSync(systemFile).equals(readFileSync(storeFile)), "commercial contract bytes differ");
  } catch (error) {
    throw new Error(`${sources}: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
  }
  return sources;
}

test("commercial contract bytes match the exact inspected Store pairing", (t) => {
  t.diagnostic(assertCommercialPair());
});

test("commercial pairing rejects altered bytes, missing sources and an unrelated revision", (t) => {
  const temporary = mkdtempSync(join(tmpdir(), "commercial-pair-negative-"));
  try {
    const copy = join(temporary, "altered-system-contract.js");
    writeFileSync(copy, Buffer.concat([readFileSync(commercialFile), Buffer.from("\n")]));
    assert.throws(() => assertCommercialPair(root, copy), /commercial contract bytes differ/);
    t.diagnostic("Rejected altered test copy with unchanged exported names and version strings.");
    rmSync(copy);
    assert.throws(() => assertCommercialPair(root, copy), /ENOENT/);
    assert.throws(() => assertCommercialPair(join(temporary, "unavailable-store")), /ENOENT/);
    t.diagnostic("Rejected missing contract file and unavailable Store checkout; neither comparison skipped.");
    assert.throws(() => assertCommercialPair(systemRoot), /is not the pinned commit/);
    t.diagnostic("Rejected the actual System checkout as Store: its revision is not the inspected Store pin.");
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});

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

test("shared HTTP boundary preserves malformed JSON and unrecognized-wire errors", async () => {
  for (const body of ["{", "null", "false", "7", '"wire"']) {
    const reply = await postPublishedWire(new Request("http://system/api/store-zero/job", { method: "POST", body }), "http://127.0.0.1:1");
    assert.equal(reply.status, 400, body);
    assert.deepEqual(await reply.json(), { adapterError: true, code: "PUBLISHED_WIRE_NOT_JSON" });
  }
  for (const body of ["[]", "{}"]) {
    const reply = await postPublishedWire(new Request("http://system/api/store-zero/offering", { method: "POST", body }), "http://127.0.0.1:1");
    assert.equal(reply.status, 422, body);
    assert.deepEqual(await reply.json(), { adapterError: true, code: "PUBLISHED_WIRE_NOT_RECOGNIZED" });
  }
});

test("shared HTTP boundary carries fresh Store job and discovery replies unchanged", async () => {
  const origin = await storeOrigin();
  const wire = wireFor("start-own", "USER_DEFINED_BOARD_V1", "http-boundary", { line: braceLine() });
  const reply = await postPublishedWire(new Request("http://system/api/store-zero/job", { method: "POST", body: JSON.stringify(wire) }), origin);
  assert.equal(reply.status, 200);
  const body = await reply.json();
  assert.equal(body.requestId, wire.requestId);
  assert.equal(body.rawEvaluation.status, "SUPPORTABLE");
  assert.equal(body.rawEvaluation.freshEvaluation, true);
  assert.equal(body.rawEstimate.totals.Q, 8.62);
  assert.equal(body.evaluationReceipt.authority.storeRevision, release);
  assert.equal(body.machineAdmission.physicalRelease, false);
  const lookup = wireFor("lookup", "OFFERING_LOOKUP", "http-boundary", { searchText: "pine" });
  const discovered = await postPublishedWire(new Request("http://system/api/store-zero/offering", { method: "POST", body: JSON.stringify(lookup) }), origin);
  assert.equal(discovered.status, 200);
  const offerings = await discovered.json();
  assert.equal(offerings.requestId, lookup.requestId);
  assert.equal(offerings.storePin, release);
  assert.ok(offerings.rawOfferings.length > 0);
  assert.equal(offerings.rawEstimate, undefined);
  const unavailable = await postPublishedWire(new Request("http://system/api/store-zero/job", { method: "POST", body: JSON.stringify(wire) }), "http://127.0.0.1:1");
  assert.equal(unavailable.status, 502);
  const failed = await unavailable.json();
  assert.equal(failed.adapterError, true);
  assert.equal(failed.rawEstimate, undefined);
});

test('registered component work preserves six independent parts through the published adapter and refuses an overlong revision',async()=>{
  assert.deepEqual(componentDefinition({recipeId:'start-own',inputs:{}}),{error:'REGISTERED_COMPONENT_TOOL_REQUIRED'});
  assert.deepEqual(componentDefinition({recipeId:'display-stand-components',inputs:{shelfIn:24,sideIn:8,species:'pine',grade:'select',unknown:1}}),{error:'UNKNOWN_INPUT'});
  const definition=componentDefinition({recipeId:'display-stand-components',inputs:{shelfIn:24,sideIn:8,species:'pine',grade:'select'}});
  if('error' in definition)throw new Error(definition.error);
  assert.deepEqual(definition.blockers,[]);
  const request={protocolVersion:'stb-store-zero-http/1',projectId:'registered-components',candidateRevisionId:definition.revision,requestType:'CUT_PACKAGE_V1',requestId:'component-source',payload:definition.payload,expectedStorePin:release};
  const reply=await answerPublishedWire(request,await storeOrigin());
  assert.equal(reply.httpStatus,200);
  const answer=reply.body.storeAnswer as Record<string,any>,mapped=reply.body.mappedCallInputs as Record<string,any>;
  assert.equal(answer.status,'SUPPORTABLE');assert.equal(answer.complete,true);
  assert.deepEqual(mapped.manifest,definition.manifest);
  const expected=structuredClone((definition.payload as any).definition);
  // The published contract omits an empty optional spots array. There is no
  // feature to drop; verify that exact normalization and every other operand.
  for(const group of expected.cutPackages)for(const part of group.parts){assert.deepEqual(part.spots,[]);delete part.spots;}
  assert.deepEqual(mapped.demand,expected);
  assert.deepEqual(answer.manifestCoverage.boardPartIds,['RAIL-01','RAIL-02','SHELF-01','SHELF-02','SIDE-01','SIDE-02']);
  assert.equal(answer.revision,definition.revision);
  for(const value of [null,-1,0,'bad']){
    const invalid=componentDefinition({recipeId:'display-stand-components',inputs:{shelfIn:24,sideIn:value,species:'pine',grade:'select'}});
    assert.ok(!('error' in invalid)&&invalid.payload===null&&invalid.blockers.length>0);
  }
  const excessive=componentDefinition({recipeId:'display-stand-components',inputs:{shelfIn:200,sideIn:8,species:'pine',grade:'select'}});
  if('error' in excessive)throw new Error(excessive.error);
  assert.notEqual(excessive.revision,definition.revision);
  const refused=await answerPublishedWire({...request,requestId:'component-overlong',candidateRevisionId:excessive.revision,payload:excessive.payload},await storeOrigin());
  assert.equal(refused.httpStatus,200);
  const failed=refused.body.storeAnswer as Record<string,any>;
  assert.equal(failed.status,'REFUSED');assert.equal(failed.Q,null);
  assert.notEqual(failed.evaluationReceipt.receiptHash,answer.evaluationReceipt.receiptHash);
});

test('System definition shapes exactly match the inspected Store contract including optional geometry',async()=>{
  assertCheckout();
  const store=await import(pathToFileURL(`${root}/src/contracts/definitions.mjs`).href);
  assert.deepEqual(DEFINITION_SHAPES,store.DEFINITION_SHAPES);
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
  assert.equal(runtime.includes(release), true);
  const workflow=readFileSync(new URL('../../../.github/workflows/verify.yml',import.meta.url),'utf8');
  const startup=readFileSync(new URL('../../../startup.sh',import.meta.url),'utf8');
  const browser=readFileSync(new URL('../../../scripts/browser-five-jobs.mjs',import.meta.url),'utf8');
  assert.equal(startup.match(/^want=(\w+)$/m)?.[1],release);
  assert.equal(browser.match(/const expectedPin = '([a-f0-9]+)'/)?.[1],release);
  assert.deepEqual([...workflow.matchAll(/repository: GeorgePlattDemo\/store-zero\s+ref: ([a-f0-9]{40})/g)].map(m=>m[1]),[release,release]);
  const programRoot=process.env.PROGRAM_ROOT || new URL('../../../.program',import.meta.url);
  const programHead=execFileSync('git',['rev-parse','HEAD'],{cwd:programRoot,encoding:'utf8'}).trim();
  assert.equal(workflow.match(/repository: GeorgePlattDemo\/3d-solutions-program\s+ref: ([a-f0-9]{40})/)?.[1],programHead);
  assert.equal(workflow.match(/STORE_ZERO_RELEASE=([a-f0-9]{40})/)?.[1],release);
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

test("Start Your Own preserves stated drill diameter and full-diameter depth into real Store refusal", async () => {
  const origin = await storeOrigin();
  const ask = async (field: "toolDiameterIn"|"fullDiameterDepthIn", value: number, revision: string) => {
    const line = structuredClone(braceLine());
    const feature = line.parts[0].features[0] as Record<string, unknown>;
    feature[field] = value;
    const normalized = boardDemandFromPublishedLine(line);
    assert.equal(((normalized.demand.parts as {features:Record<string,unknown>[]}[])[0].features[0])[field], value);
    return answerPublishedWire(wireFor("start-own", "USER_DEFINED_BOARD_V1", revision, {
      line, definitionKind:"user_defined_board.v1", ruleVersion:"0.1",
    }), origin);
  };
  const diameter = await ask("toolDiameterIn", 0.25, "wrong-diameter");
  assert.equal((diameter.body.rawEvaluation as {status?:string}).status, "REFUSED");
  assert.ok(((diameter.body.rawEvaluation as {reasonCodes?:string[]}).reasonCodes??[]).includes("SPOT_DIAMETER_NOT_DECLARED"));
  const depth = await ask("fullDiameterDepthIn", 0.25, "too-deep");
  assert.equal((depth.body.rawEvaluation as {status?:string}).status, "REFUSED");
  assert.ok(((depth.body.rawEvaluation as {reasonCodes?:string[]}).reasonCodes??[]).includes("SPOT_FULL_DIAMETER_DEPTH_EXCEEDS_MAX"));
  const registered = await ask("fullDiameterDepthIn", 0.1875, "registered-depth");
  assert.equal((registered.body.rawEvaluation as {status?:string}).status, "SUPPORTABLE");
  const explicitDepth=(registered.body.mappedCallInputs as {demand:{parts:{features:Record<string,unknown>[]}[]}}).demand.parts[0].features[0].fullDiameterDepthIn;
  assert.equal(explicitDepth,0.1875);
});

test("selected part-relative spot X and shallower depth go through current pinned Store and real Z motion", async () => {
  const origin=await storeOrigin();
  const line=structuredClone(braceLine());
  line.parts[0].features[0].locationRule="PART_RELATIVE_FROM_START";
  line.parts[0].features[0].xIn=5.25;
  (line.parts[0].features[0] as Record<string, unknown>).fullDiameterDepthIn=0.125;
  line.parts[1].features[0].locationRule="PART_RELATIVE_FROM_START";
  line.parts[1].features[0].xIn=10.25;
  const result=await answerPublishedWire(wireFor("start-own","USER_DEFINED_BOARD_V1","selected-spot-parts",{
    line,definitionKind:"user_defined_board.v1",ruleVersion:"0.1"
  }),origin);
  assert.equal(result.httpStatus,200);
  const answer=result.body.storeAnswer as Record<string,any>;
  assert.equal(answer.status,"SUPPORTABLE",JSON.stringify(answer.reasonRecords));
  assert.equal(answer.Q>0,true);
  const features=(result.body.mappedCallInputs as {demand:{parts:{features:Record<string,unknown>[]}[]}}).demand.parts;
  assert.equal(features[0].features[0].xIn,5.25);
  assert.equal(features[0].features[0].fullDiameterDepthIn,0.125);
  assert.equal(features[1].features[0].xIn,10.25);
  const stock=answer.parents.find((p:any)=>p.kind==="board");
  assert.ok(stock);
  const point=0.09375/Math.tan(118*Math.PI/360);
  const deeperZ=answer.operations.filter((e:any)=>e.kind==="MOVE"&&e.category==="SPOT"&&e.axis==="Z"
    &&e.subject==="SPOT-1"&&e.target<stock.actualT);
  assert.equal(deeperZ.length,1);
  assert.ok(Math.abs(deeperZ[0].target-(stock.actualT-point-0.125))<1e-9);
  const invalid=structuredClone(line);
  (invalid.parts[0].features[0] as Record<string,unknown>).fullDiameterDepthIn=0.25;
  const denied=await answerPublishedWire(wireFor("start-own","USER_DEFINED_BOARD_V1","too-deep-spot",{
    line:invalid,definitionKind:"user_defined_board.v1",ruleVersion:"0.1"
  }),origin);
  assert.equal((denied.body.storeAnswer as any).status,"REFUSED");
  assert.ok(((denied.body.storeAnswer as any).reasonCodes||[]).includes("SPOT_FULL_DIAMETER_DEPTH_EXCEEDS_MAX"));
  assert.equal((denied.body.storeAnswer as any).Q,null);
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
    expectedStorePin: release,
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
  assert.equal(estimate.totals?.Q, 8.62);
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
    expectedStorePin: release,
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
  assert.equal(estimate.totals?.Q, 9.13);
  assert.notEqual(estimate.totals?.Q, 8.62);
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
  assert.ok(Array.isArray(offering.supportedOps) && offering.supportedOps.includes("CROSSCUT") && offering.supportedOps.includes("SPOT_ON_LOCATION"));
  assert.deepEqual(offering.cellFamily, ["D-001"]);
  assert.equal(offering.capabilityAttribution, "STORE_ANSWER");
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
    expectedStorePin: release,
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
  assert.equal(evaluation.status, "UNAVAILABLE");
  assert.equal(evaluation.freshEvaluation, true);
  assert.notEqual(price.status, "COMPLETE_FOR_TRAVEL_STANDARD");
  assert.equal(job.status, "NOT_SUPPORTABLE");
  assert.equal(job.quoteComplete, false);
  assert.equal(job.machineAdmitted, false);
  assert.equal((body.requirementSatisfaction as { status?: string }).status, "SATISFIED");
  assert.equal((body.machineAdmission as { physicalRelease?: boolean }).physicalRelease, false);
});

test("no copied Store specimen or answer travels with the page; the Store is asked", () => {
  const page = readFileSync(new URL("../../../public/live/system-build-current.html", import.meta.url), "utf8");
  assert.equal(existsSync(new URL("../../../public/live/stb-store-handoff-contract.js", import.meta.url)), false);
  assert.equal(page.includes("stb-store-handoff-contract"), false);
  assert.equal(page.includes("STBStoreHandoffContract"), false);
  assert.equal(page.includes("startOwnOfferings"), false);
  assert.equal(page.includes("exact promoted Store reference matched"), false);
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

function publishedFunction(file: string, name: string, context: Record<string, unknown> = {}) {
  const source = readFileSync(new URL(`../../../public/live/${file}`, import.meta.url), "utf8");
  const match = source.match(new RegExp(`^[ \\t]*function ${name}\\([^\\n]*}$`, "m"))
    ?? source.match(new RegExp(`(^[ \\t]*)function ${name}\\([^]*?^\\1}`, "m"));
  assert.ok(match, `${file} must define ${name}`);
  return runInNewContext(`(${match[0]})`, context);
}

function publishedTerms(projectId: string, demoCommerce = false) {
  const window = { crypto: webcrypto } as Record<string, any>;
  runInNewContext(readFileSync(new URL("../../../public/live/stb-commercial-sequence.js",import.meta.url),"utf8"),{window,TextEncoder});
  runInNewContext(readFileSync(new URL("../../../public/live/stb-demo-commerce.js",import.meta.url),"utf8"),{window,TextEncoder});
  runInNewContext(readFileSync(new URL("../../../public/live/stb-terms-flow.js", import.meta.url), "utf8"), { window, TextEncoder });
  return window.STBTermsFlow.create({ projectId, demoCommerce });
}

test('current Project 1 accepts both published settings and sends unchanged packets through real Store evidence',async()=>{
 const origin=await storeOrigin();
 for(const length of [16,18]){
  const response=await answerPublishedWire(wireFor('start-own','USER_DEFINED_BOARD_V1','current-proof-'+length,{line:braceLineAt(length)}),origin);
  const body=response.body as any,terms=publishedTerms('start-own',true);
  terms.setAnswer({version:body.candidateRevisionId,status:'SUPPORTABLE',total:body.rawEstimate.totals.Q,body});
  assert.equal((await terms.acceptedPacket()).status,'REFUSED');
  await terms.accept();
  const accepted=JSON.parse(JSON.stringify(await terms.acceptedPacket()));
  assert.equal(accepted.status,'ACCEPTED_PACKET_READY',JSON.stringify(accepted));
  const packet=accepted.packet;
  assert.deepEqual(packet.storeAnswer,body.storeAnswer);
  assert.deepEqual(packet.definition.demand,body.mappedCallInputs.demand);
  assert.deepEqual(packet.definition.manifest,body.mappedCallInputs.manifest);
  const decision=terms.state().commercial.events.find((e:any)=>e.eventType==='CustomerDecisionRecorded');
  assert.equal(packet.decision.decisionId,decision.payload.decisionId);
  const result=await (await fetch(origin+STORE_CANDIDATE.machineEvidencePath,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({packet,expectedMachineConfigId:STORE_CANDIDATE.inspectedMachine.machineConfigId,expectedMachineConfigHash:STORE_CANDIDATE.inspectedMachine.machineConfigHash})})).json();
  const evidence=result.answer;
  assert.equal(evidence.status,'VIRTUAL_EVIDENCE_READY',JSON.stringify(result));
  assert.deepEqual(evidence.localJob.operations,packet.storeAnswer.operations);
  assert.equal(evidence.run.timeSec,packet.storeAnswer.time.totalSeconds);
  assert.equal(evidence.admission.motionCommands,0);
  terms.invalidate();assert.equal((await terms.acceptedPacket()).status,'REFUSED');
 }
});

test('Outdoor resolves sourced parallel end geometry with visible stock envelope and rejects unregistered angle',async()=>{
 const page=readFileSync(new URL('../../../public/live/stb-outdoor-picnic-0.4.html',import.meta.url),'utf8');
 const match=page.match(/const PLANS=([^]*?)\n};/);assert.ok(match);
 const plans=runInNewContext('('+match[1]+'\n})',{fmt:String});
 const kindsOf=(cfg:any)=>plans[cfg.plan].groups(72).flatMap((g:any)=>g.parts.map(([kind,n,len]:any)=>({kind,n,len,g})));
 const packagesFor=publishedFunction('stb-outdoor-picnic-0.4.html','packagesFor',{
  WOODS:[{key:'treated',species:'syp-treated',grade:'above-ground'}],kindsOf,decoAngle:()=>null,spotsFor:()=>null
 });
 const packages=packagesFor({plan:'a-frame',parts:{}},['treated']);
 const legs=packages.find((p:any)=>p.packageId.endsWith('|LEGS')),braces=packages.find((p:any)=>p.packageId.endsWith('|BRACES'));
 assert.equal(legs.endCut.lengthDatum,'long-point-to-short-point');
 assert.equal(legs.endCut.endRelation,'parallel');
 assert.equal(legs.endCut.endPointOrientation,'long-to-short');
 assert.equal(legs.parts[0].lengthIn,31.375);
 assert.equal(braces.endCut.plane,'miter-face');
 assert.equal(braces.endCut.endRelation,'parallel');
 assert.equal(braces.endCut.endPointOrientation,'long-to-short');
 assert.equal(braces.parts[0].lengthIn,32.875);
 const origin=await storeOrigin();
 const response=await answerPublishedWire(wireFor('outdoor','CUT_PACKAGE_V1','source-ends',{definition:{configurationId:'OUTDOOR-SOURCE',configurationVersion:'source-ends',cutPackages:packages}}),origin);
 const answer=(response.body as any).storeAnswer;
 assert.equal(answer.status,'SUPPORTABLE',JSON.stringify(answer.reasonRecords));
 assert.equal(answer.complete,true);
 assert.ok(answer.Q>0);
 const derived=answer.operations.filter((event:any)=>event.kind==='STOCK_ENVELOPE_DERIVED' && event.subject.startsWith('BRACE-'));
 assert.equal(derived.length,2);
 const expectedEnvelope=32.875+3.5*Math.tan(25*Math.PI/180);
 for(const event of derived){
   assert.ok(Math.abs(event.stockEnvelopeLengthIn-expectedEnvelope)<1e-9);
   assert.ok(Math.abs(event.endOffsetIn-(expectedEnvelope-32.875))<1e-9);
 }
 assert.equal(answer.components.filter((p:any)=>p.partId.startsWith('BRACE-')).length,2);
 const invalid=structuredClone(packages);
 invalid.find((p:any)=>p.packageId.endsWith('|BRACES')).endCut.angleDeg=50;
 const negative=await answerPublishedWire(wireFor('outdoor','CUT_PACKAGE_V1','unregistered-angle',{definition:{configurationId:'OUTDOOR-SOURCE',configurationVersion:'unregistered-angle',cutPackages:invalid}}),origin);
 const refused=(negative.body as any).storeAnswer;
 assert.equal(refused.status,'REFUSED');
 assert.ok(refused.reasonCodes.includes('END_ANGLE_OUTSIDE_MODEL'));
 assert.equal(refused.reasonMessage,'Requested end angle 50° exceeds the registered saw limit of 45°.');
 assert.equal(refused.reasonRecords[0].message,refused.reasonMessage);
});

test("Job 1 demo checkout uses the current Store Q and one verified transaction through pickup", async () => {
  const response=await answerPublishedWire(wireFor("start-own","USER_DEFINED_BOARD_V1","demo-checkout",{line:braceLineAt(16)}),await storeOrigin());
  const body=response.body as any;
  assert.equal(body.rawEvaluation.complete,true);
  const terms=publishedTerms("start-own",true);
  terms.setAnswer({version:"demo-checkout",status:"SUPPORTABLE",total:body.rawEstimate.totals.Q,body});
  await terms.accept();
  let state=terms.state();
  assert.equal(state.stage,"QUEUED");
  const offer=state.commercial.events.find((event:any)=>event.eventType==="OfferIssued");
  const payment=state.commercial.events.find((event:any)=>event.eventType==="FinancialEventRecorded");
  assert.equal(offer.payload.manufacturingQMinor,862);
  assert.equal(offer.payload.amountMinor,862);
  assert.equal(payment.payload.amountMinor,862);
  assert.equal(offer.links.receiptHash,body.evaluationReceipt.receiptHash);
  assert.equal(offer.payload.termsId,"STB-DEMO-TERMS");
  const paidCount=state.commercial.sequence;
  await terms.accept();
  assert.equal(terms.state().commercial.sequence,paidCount,"a second click does not create a second order or payment");
  await terms.runYard();
  assert.equal(terms.state().stage,"READY");
  await terms.pickup();
  state=terms.state();
  assert.equal(state.stage,"HANDED_OFF");
  assert.equal(state.receipt.simulated,true);
  assert.equal(state.commercial.events.at(-1).eventType,"ProjectCloseoutRecorded");
  assert.equal(state.commercial.physicalAuthority,false);
  assert.equal(state.commercial.paymentAuthority,false);
  assert.equal(body.machineAdmission.status,"BLOCKED");
  const contractContext={window:{crypto:webcrypto} as any,TextEncoder};
  runInNewContext(readFileSync(new URL("../../../public/live/stb-commercial-sequence.js",import.meta.url),"utf8"),contractContext);
  assert.equal(await contractContext.window.STBCommercialSequence.verify(state.commercial.events),true);
});

test("Job 1 demo decline and revision changes cannot carry an older payment into new work", async () => {
  const first=(await answerPublishedWire(wireFor("start-own","USER_DEFINED_BOARD_V1","demo-first",{line:braceLineAt(16)}),await storeOrigin())).body as any;
  const second=(await answerPublishedWire(wireFor("start-own","USER_DEFINED_BOARD_V1","demo-next",{line:braceLineAt(18)}),await storeOrigin())).body as any;
  const terms=publishedTerms("start-own",true);
  terms.setAnswer({version:"demo-first",status:"SUPPORTABLE",total:first.rawEstimate.totals.Q,body:first});
  await terms.decline();
  await terms.runYard();
  await terms.pickup();
  assert.equal(terms.state().stage,"DECLINED");
  assert.equal(terms.state().receipt,null);
  terms.setAnswer({version:"demo-next",status:"SUPPORTABLE",total:second.rawEstimate.totals.Q,body:second});
  await terms.accept();
  const paid=terms.state().commercial.events.find((event:any)=>event.eventType==="FinancialEventRecorded");
  assert.equal(paid.payload.amountMinor,913);
  assert.equal(paid.links.receiptHash,second.evaluationReceipt.receiptHash);
  terms.invalidate();
  assert.equal(terms.state().yardOpen,false);
  assert.equal(terms.state().receipt,null);
  await terms.runYard();
  assert.equal(terms.state().commercial,null);
});

test("Alcove's published gate opens Your call for a fully evaluated current Store answer", async () => {
  const definition = {
    configurationId: "ALCOVE-USER1", configurationVersion: "alcove-call",
    materialDemand: { species: "poplar", form: "board", nominalT: 1, grade: "select" },
    boardRequirements: [{ requirementId: "SHELVES", requiredOps: ["CROSSCUT"] }],
    componentPrograms: [{ componentId: "SHELF-01", requirementId: "SHELVES", nominalW: 6, finishedLengthIn: 30, finishedWidthIn: 5.5, features: [] }],
  };
  const answered = await answerPublishedWire(wireFor("alcove", "ALCOVE_INSERT_V1", "alcove-call", { definition }), await storeOrigin());
  const body = answered.body as Record<string, any>;
  assert.equal(body.jobSupportability.status, "REQUIREMENTS_SATISFIED");
  const gate = publishedFunction("system-build-current.html", "alcoveSupportable");
  assert.equal(gate(body), true);
  assert.equal(gate({ ...body, rawEvaluation: { ...body.rawEvaluation, status: "REFUSED" } }), false);
  const terms = publishedTerms("alcove");
  terms.setAnswer({ version: "alcove-call", status: "SUPPORTABLE", total: body.rawEstimate.totals.Q, body });
  assert.equal(terms.state().callOpen, true);
  await terms.accept();
  assert.equal(terms.state().yardOpen, false);
  await terms.runYard();
  await terms.pickup();
  assert.equal(terms.state().stage, "ANSWERED");
  assert.equal(terms.state().pendingReason,"SELLER_OFFER_AND_TERMS_REQUIRED");
});

test("Alcove clears every displayed amount while a replacement Store answer is pending", () => {
  const nodes = new Map<string, { textContent: string; value: string; innerHTML: string }>();
  const document = { getElementById: (id: string) => {
    if (!nodes.has(id)) nodes.set(id, { textContent: "$372.19", value: "14", innerHTML: "" });
    return nodes.get(id)!;
  } };
  const context = { document, alcove: { material: "pine" }, ALCOVE_MATERIAL_DISPLAY: { pine: { name: "Pine" } }, fmt: String };
  const syncTransaction = publishedFunction("system-build-base-8d8a9dd.html", "syncTransaction", context);
  syncTransaction();
  const pending = publishedFunction("system-build-base-8d8a9dd.html", "setAlcoveStorePending", {
    document, syncTransaction, renderAlcoveCycleRun: () => {},
  });
  pending();
  for (const id of ["p-price", "r-q", "review-price", "store-price"])
    assert.equal(document.getElementById(id).textContent, "ASKING STORE ZERO…", id);
});

test("Alcove unresolved installation requirements block whole-job Q and all commercial stages",async()=>{
  const definition={configurationId:"ALCOVE-USER1",configurationVersion:"unresolved",materialDemand:{species:"poplar",form:"board",nominalT:1,grade:"select"},boardRequirements:[{requirementId:"SHELVES",requiredOps:["CROSSCUT"]}],componentPrograms:[{componentId:"SHELF-01",requirementId:"SHELVES",nominalW:6,finishedLengthIn:30,finishedWidthIn:5.5,features:[]}],unresolvedConditions:["INSTALLATION_LOAD_RATING_REQUIRED"]};
  const answered=await answerPublishedWire(wireFor("alcove","ALCOVE_INSERT_V1","unresolved",{definition}),await storeOrigin());
  const body=answered.body as any;assert.equal(body.rawEvaluation.status,"UNRESOLVED");assert.equal(body.rawEstimate.complete,false);assert.equal(body.rawEstimate.totals.Q,null);assert.equal(body.jobSupportability.status,"NOT_SUPPORTABLE");
  const terms=publishedTerms("alcove");terms.setAnswer({version:"unresolved",status:"UNRESOLVED",total:null,body});
  for(const action of ["accept","decline","runYard","pickup"])await terms[action]();assert.equal(terms.state().yardOpen,false);assert.equal(terms.state().receipt,null);
});

test("Alcove shows direct Store-backed 1x8 selection on Intent and Bench, and Idea has a real next route", () => {
  const source=readFileSync(new URL("../../../public/live/system-build-base-8d8a9dd.html",import.meta.url),"utf8");
  const buttons=source.match(/<button[^>]*data-alcove-use-1x8/g)||[];
  assert.equal(buttons.length,2,"Intent and Bench must each have a visible 1x8 selector");
  assert.match(source,/async function selectAlcoveOneByEight\(\)/);
  assert.match(source,/alcoveStock\.offers\.find\(r=>r\.offered===true/);
  assert.match(source,/chooseAlcoveOfferedBoard\(matched\)/);
  const idea=source.split('<section class="page" id="alcove-idea">')[1]?.split('<svg class="edge"')[0]||"";
  assert.match(idea,/<button[^>]*data-go="alcove-capture"[^>]*>NEXT → INTENT<\/button>/);
  const front=readFileSync(new URL("../../../public/live/system-build-front-door-0.5.html",import.meta.url),"utf8");
  const current=readFileSync(new URL("../../../public/live/system-build-current.html",import.meta.url),"utf8");
  assert.match(front,/system-build-base-8d8a9dd\.html\?v=public-conformance-20261017/);
  assert.match(current,/system-build-front-door-0\.5\.html\?v=public-conformance-20261017/);
});

test("Alcove submits actual 1x8 demands: Store mills stocked Oak and refuses missing Cherry stock", async () => {
  const page="system-build-base-8d8a9dd.html";
  const starting={depthIn:14,nominalW:8,requiredFullStripIn:7.25};
  for(const [species,offered,expected] of [
    ["cherry",[{nominalW:4,actualW:3.5},{nominalW:6,actualW:5.5}],"NO_MATCHING_BOARD_OFFERING"],
    ["oak",[{nominalW:6,actualW:5.5},{nominalW:8,actualW:7.25}],null],
  ] as const){
    const stock={species,status:"READY",offers:offered.map(o=>({...o,species,offered:true,form:"board",nominalT:1,grade:"select"})),pin:release};
    const finish={mode:"ECONOMY",mixed:false,first:10,second:6};
    const boardSpecs=publishedFunction(page,"alcoveBoardSpecifications",{
      alcoveStock:stock,alcoveFinish:finish,ALCOVE_STARTING_1X8_REQUIREMENT:starting
    });
    const components=publishedFunction(page,"alcoveComponentPrograms");
    const signature=publishedFunction(page,"alcoveDefinitionSignature",{alcoveBoardSpecifications:boardSpecs,alcoveFinish:finish});
    const revisionFor=publishedFunction(page,"alcoveRevision",{
      alcove:{pilotShelves:false},alcoveBoardSpecifications:boardSpecs,alcoveComponentPrograms:components,
      alcoveDefinitionSignature:signature,ALCOVE_PROJECT_ID:"alcove"
    });
    const revision=revisionFor({h:72,w:45.5,d:14,n:5,span:44,material:species,pilotFeatures:[]});
    assert.equal(revision.facts["alcove.component-programs"].value.length,14,`${species}: real component programs must exist`);
    const admitted=tileHostContract.admit({revision,inquiryScope:"ALCOVE_INSERT_V1"});
    assert.equal(admitted.admission.result,tileHostContract.ADMISSION_RESULT.ADMITTED,`${species}: Store must own material/capability refusal`);
    const definitionFrom=publishedFunction(page,"alcoveDefinitionFrom",{
      ALCOVE_HARDWARE_DEMAND:{requirementId:"ALCOVE-PINS-AND-SCREWS",description:"pins + screws",qty:1,selectionAuthority:"STORE_ZERO"}
    });
    const definition=definitionFrom(admitted.request);
    assert.equal(definition.componentPrograms.length,14);
    assert.ok(definition.componentPrograms.every((part:Record<string,any>)=>part.nominalW===8));
    const result=(await answerPublishedWire(wireFor("alcove","ALCOVE_INSERT_V1",`alcove-${species}-material-check`,{definition}),await storeOrigin()));
    assert.equal(result.httpStatus,200,`${species}: did not reach Store Zero`);
    const evaluation=(result.body as Record<string,any>).rawEvaluation;
    if(expected){
      assert.equal(evaluation.Q,null);
      assert.ok(evaluation.reasonCodes.includes(expected),`${species}: expected real Store refusal ${expected}; got ${evaluation.reasonCodes}`);
    }else{
      assert.equal(evaluation.status,"SUPPORTABLE");
      assert.ok(evaluation.Q>0);
      assert.equal(evaluation.manifestCoverage.boardPartIds.length,14);
      assert.ok(evaluation.operations.some((op:Record<string,any>)=>op.category==="MILL"&&op.seconds>0));
      assert.equal(evaluation.freshEvaluation,true);
    }
  }
});

test("Alcove automatically proposes 1x8; selecting an offered 1x8 attaches its nominal class without pinning a SKU", () => {
  const page="system-build-base-8d8a9dd.html";
  const offers=[6,8,10].map(w=>({offered:true,form:"board",grade:"select",species:"pine",nominalT:1,
    nominalW:w,actualW:w===6?5.5:w===8?7.25:9.25,storeSku:"STORE-OFFERED-"+w}));
  const stock={species:"pine",status:"READY",offers,pin:"the-current-Store"};
  const finish={mode:"ECONOMY",mixed:false,first:10,second:6};
  const proposed=publishedFunction(page,"alcoveBoardSpecifications",{alcoveStock:stock,alcoveFinish:finish})({d:14,material:"pine"});
  assert.deepEqual(Array.from(proposed.shelves.strips,(b:any)=>[b.nominalW,b.finishedWidthIn]),[[8,7.25],[8,6.75]]);
  const elements:Record<string,any>={
    "alcove-mixed-boards":{checked:false},"alcove-board-first":{value:"10"},
    "alcove-board-second":{value:"6"},"alcove-board-override":{open:false}
  };
  const alcove={material:"pine"};
  let refreshed=0,lookups=0;
  const choose=publishedFunction(page,"chooseAlcoveOfferedBoard",{
    alcove,alcoveFinish:finish,ALCOVE_MATERIAL_DISPLAY:{pine:{},poplar:{},cherry:{},oak:{}},
    document:{getElementById:(id:string)=>elements[id]},
    syncAlcove:()=>{refreshed++},updateAlcoveOfferings:()=>{lookups++}
  });
  assert.equal(choose(offers[1]),true);
  assert.equal(finish.mixed,true);
  assert.equal(finish.first,8);assert.equal(finish.second,8);
  assert.equal(elements["alcove-mixed-boards"].checked,true);
  assert.equal(elements["alcove-board-override"].open,true);
  assert.equal(refreshed,1);assert.equal(lookups,0);
  const forced=publishedFunction(page,"alcoveBoardSpecifications",{alcoveStock:stock,alcoveFinish:finish})({d:14,material:"pine"});
  assert.deepEqual(Array.from(forced.shelves.strips,(b:any)=>b.nominalW),[8,8]);
  assert.equal(choose({...offers[1],grade:"quality"}),false,"a rejected grade must not mutate the definition");
  assert.equal(refreshed,1);
});

test("Alcove's actual definition with pilot spots switched off and full-width strips is fully evaluated", async () => {
  const offers=[6,8,10].map(w=>({offered:true,species:"pine",form:"board",grade:"select",nominalT:1,nominalW:w,actualW:w===6?5.5:w===8?7.25:9.25}));
  const stock={species:"pine",status:"READY",offers,pin:"test-fixture"};
  const finish={mode:"ECONOMY",mixed:false,first:10,second:6};
  const specs=publishedFunction("system-build-base-8d8a9dd.html","alcoveBoardSpecifications",{alcoveStock:stock,alcoveFinish:finish});
  const componentPrograms=publishedFunction("system-build-base-8d8a9dd.html","alcoveComponentPrograms");
  const signature=publishedFunction("system-build-base-8d8a9dd.html","alcoveDefinitionSignature",{alcoveBoardSpecifications:specs,alcoveFinish:finish});
  const revision = publishedFunction("system-build-base-8d8a9dd.html", "alcoveRevision", {
    alcove: { pilotShelves: false },alcoveBoardSpecifications:specs,alcoveComponentPrograms:componentPrograms,
    alcoveDefinitionSignature: signature, ALCOVE_PROJECT_ID: "alcove",
  })({ h: 72, w: 45.5, d: 11, n: 5, span: 44, material: "pine", pilotFeatures: [] });
  const definitionFrom = publishedFunction("system-build-base-8d8a9dd.html", "alcoveDefinitionFrom", {
    ALCOVE_HARDWARE_DEMAND: { requirementId: "ALCOVE-PINS-AND-SCREWS", description: "pins + screws", qty: 1, selectionAuthority: "STORE_ZERO" },
  });
  const definition = definitionFrom({ definitionRevisionId: revision.definitionRevisionId,
    facts: Object.fromEntries(Object.entries(revision.facts).map(([key, fact]) => [key, (fact as { value: unknown }).value])),
    openDemands: ["alcove.hardware"],
  });
  assert.equal(definition.spotDemand.enabled, false);
  assert.equal(definition.componentPrograms.length, 14);
  const ask = (suffix: string, spotDemand: Record<string, unknown>) => answerPublishedWire(
    wireFor("alcove", "ALCOVE_INSERT_V1", `alcove-off-${suffix}`, { definition: { ...definition, configurationVersion: `alcove-off-${suffix}`, spotDemand } }),
    origin!,
  );
  await storeOrigin();
  const body = (await ask("complete", definition.spotDemand)).body as Record<string, any>;
  assert.equal(body.rawEvaluation.status, "SUPPORTABLE");
  assert.equal(body.rawEvaluation.freshEvaluation, true);
  assert.equal(body.jobSupportability.status, "REQUIREMENTS_SATISFIED");
  assert.deepEqual(body.requirementSatisfaction.unevaluated, []);
  assert.ok(body.mappedCallInputs.demand.cutPackages.every((pkg: Record<string, any>) => pkg.parts.every((part: Record<string, any>) => !part.spots?.length)));
  assert.equal(publishedFunction("system-build-current.html", "alcoveSupportable")(body), true);
  assert.equal(body.machineAdmission.physicalRelease, false);
  const withComponentSpot = { ...definition, configurationVersion: "alcove-off-component-spot",
    componentPrograms: definition.componentPrograms.map((part: Record<string, unknown>, index: number) => index ? part : {
      ...part, features: [{ featureId: "UPRIGHT-SPOT", kind: "SPOT_ON_LOCATION", xIn: 12, acrossWidthRule: "INSET_FROM_EDGE", insetFromEdgeIn: 1.5 }],
    }),
  };
  const contradictory = (await answerPublishedWire(wireFor("alcove", "ALCOVE_INSERT_V1", "alcove-off-component-spot", { definition: withComponentSpot }), origin!)).body as Record<string, any>;
  assert.equal(contradictory.jobSupportability.status, "NOT_SUPPORTABLE");
  assert.ok(contradictory.mappedCallInputs.demand.cutPackages.some((pkg: Record<string, any>) => pkg.parts.some((part: Record<string, any>) => part.spots?.length === 1)));
  for (const [name, changed] of [
    ["extra-requirement", { ...definition.spotDemand, requiredDiameterIn: 0.5 }],
    ["missing-enabled", { ...definition.spotDemand, enabled: undefined }],
    ["unmapped-spot", { ...definition.spotDemand, features: [{ featureId: "UNMAPPED", kind: "SPOT_ON_LOCATION", xIn: 12 }] }],
  ] as const) {
    const incomplete = (await ask(name, changed)).body as Record<string, any>;
    assert.equal(incomplete.jobSupportability.status, "NOT_SUPPORTABLE", name);
    assert.ok(incomplete.requirementSatisfaction.unevaluated.some((item: { field: string }) => item.field === "spotDemand"), name);
    assert.equal(publishedFunction("system-build-current.html", "alcoveSupportable")(incomplete), false, name);
  }
});

test("Outdoor's published generator identifies every selected spot before translation and Store evaluation", async () => {
  const file = "stb-outdoor-picnic-0.4.html";
  const spotsFor = publishedFunction(file, "spotsFor", {
    num: Number, SPOT_PLACES: [{ k: "CENTER", rule: "CENTERED_ON_WIDE_FACE" }],
  });
  const packagesFor = publishedFunction(file, "packagesFor", {
    WOODS: [{ key: "treated", species: "syp-treated", grade: "above-ground" }],
    kindsOf: () => [{ kind: "LEG", n: 2, len: 31.375, g: { id: "LEGS", board: [2, 6], angle: 25,
      endRelation: "parallel", lengthDatum: "long-point-to-short-point",
      endPointOrientation: "long-to-short", plane: "miter-face" } }],
    decoAngle: () => null, spotsFor,
  });
  const packages = packagesFor({ parts: { LEG: { spots: { on: true, fromEndIn: 6, place: "CENTER", middle: true } } } }, ["treated"]);
  const spots = packages.flatMap((pkg: any) => pkg.parts.flatMap((part: any) => part.spots));
  assert.equal(spots.length, 6);
  assert.equal(new Set(spots.map((spot: any) => spot.featureId)).size, 6);
  assert.ok(spots.every((spot: any) => typeof spot.featureId === "string" && spot.featureId.length > 0));
  assert.deepEqual(Array.from(packages[0].parts[0].spots, (spot: any) => spot.xIn), [6, 15.688, 25.375]);
  const ask = async (version: string, cutPackages: unknown) => {
    const answered = await answerPublishedWire(wireFor("outdoor", "CUT_PACKAGE_V1", version, {
      definition: { configurationId: "OUTDOOR", configurationVersion: version, cutPackages },
    }), await storeOrigin());
    return { ...answered, body: answered.body as Record<string, any> };
  };
  const plain = await ask("outdoor-plain", packagesFor({ parts: {} }, ["treated"]));
  const marked = await ask("outdoor-spots", packages);
  assert.equal(marked.httpStatus, 200);
  assert.equal(marked.body.rawEvaluation.status, "SUPPORTABLE");
  assert.equal(marked.body.rawEvaluation.packages[0].spotCount, 6);
  assert.ok(marked.body.rawEstimate.totals.Q > plain.body.rawEstimate.totals.Q);
  assert.deepEqual(JSON.parse(JSON.stringify(marked.body.mappedCallInputs.demand.cutPackages)), JSON.parse(JSON.stringify(packages)));
  const missing = JSON.parse(JSON.stringify(packages));
  delete missing[0].parts[0].spots[0].featureId;
  const incomplete = await ask("outdoor-missing-id", missing);
  assert.equal(incomplete.httpStatus, 422);
  assert.equal(incomplete.body.code, "PUBLISHED_DEFINITION_INCOMPLETE");
  const unsupported = JSON.parse(JSON.stringify(packages));
  unsupported[0].parts[0].spots[0].xIn = 40;
  const refused = await ask("outdoor-spot-outside", unsupported);
  assert.notEqual(refused.body.rawEvaluation.status, "SUPPORTABLE");
  assert.equal(refused.body.rawEstimate.complete, false);
});

test("a cut-package field the translator does not read reaches the Store, which refuses it by name; it is not dropped", async () => {
  const origin = await storeOrigin();
  const legs = { packageId: "LEGS", material: { species: "syp-treated", form: "board", nominalT: 2, nominalW: 6, grade: "above-ground" }, endCut: { angleDeg: 25,endRelation:"parallel",lengthDatum:"long-long-outer-edge",plane:"miter-face" }, parts: [{ partId: "LEG-01", lengthIn: 31.375 }] };
  const ask = (version: string, cutPackages: Record<string, unknown>[]) => answerPublishedWire(wireFor("outdoor", "CUT_PACKAGE_V1", version, {
    definition: { configurationId: "OUTDOOR", configurationVersion: version, cutPackages }, definitionKind: "cut_package.v1", ruleVersion: "0.1",
  }), origin);
  const plain = await ask("cut-plain", [legs]);
  assert.equal((plain.body.rawEvaluation as { status?: string }).status, "SUPPORTABLE");
  for (const [version, cutPackages, code] of [
    ["cut-bore", [{ ...legs, parts: [{ partId: "LEG-01", lengthIn: 31.375, bore: { diameterIn: 0.5 } }] }], "DEFINITION_FIELD_NOT_DECLARED:cutPackages[0].parts[0].bore"],
    ["cut-bevel", [{ ...legs, endCut: { ...legs.endCut, bevelDeg: 10 } }], "DEFINITION_FIELD_NOT_DECLARED:cutPackages[0].endCut.bevelDeg"],
  ] as const) {
    const answered = await ask(version, [...cutPackages]);
    const raw = answered.body.rawEvaluation as { status?: string; reasonCodes?: string[] };
    assert.equal(raw.status, "REFUSED", version);
    assert.deepEqual(raw.reasonCodes, [code]);
    assert.equal((answered.body.jobSupportability as { status: string }).status, "NOT_SUPPORTABLE");
  }
});

test("Outdoor option alternatives get independent Store receipts even when one wood is unavailable", async () => {
  const window: Record<string, any> = {};
  runInNewContext(readFileSync(new URL("../../../public/live/stb-outdoor-option-requests.js", import.meta.url), "utf8"), {window,setTimeout,clearTimeout,Date});
  const leg = {partId:"LEG-01",lengthIn:31.375};
  const endCut = {angleDeg:25,endRelation:"parallel",lengthDatum:"long-long-outer-edge",plane:"miter-face"};
  const options = {
    configurationId:"OUTDOOR-PICNIC-OPTIONS",configurationVersion:"independent-options",optionWood:"treated",
    cutPackages:[
      {packageId:"treated|LEGS",material:{species:"syp-treated",form:"board",nominalT:2,nominalW:6,grade:"above-ground"},endCut,parts:[leg]},
      {packageId:"cherry|LEGS",material:{species:"cherry",form:"board",nominalT:2,nominalW:6,grade:"select"},endCut,parts:[leg]}
    ],
    itemLines:[{lineId:"COATED|S25",qty:100,requirement:{kind:"wood-screw",gauge:"#10",lengthIn:2.5,finish:"coated",unit:"piece"}}]
  };
  const variants = window.STBOutdoorOptionRequests.split(options);
  const receipts = new Set<string>();
  const answers = new Map<string, Record<string, any>>();
  for (const variant of variants) {
    const def = variant.definition;
    const revision = def.configurationVersion;
    const response = await answerPublishedWire(wireFor("outdoor","CUT_PACKAGE_V1",revision,{definition:def,definitionKind:"cut_package.v1",ruleVersion:"0.1"}),await storeOrigin());
    assert.equal(response.httpStatus,200);
    const body = response.body as Record<string, any>;
    assert.equal(body.candidateRevisionId,revision);
    assert.match(body.evaluationReceipt.manifestHash,/^[a-f0-9]{64}$/);
    receipts.add(body.evaluationReceipt.receiptHash);
    answers.set(variant.kind+":"+variant.key,body);
  }
  assert.equal(receipts.size,3);
  assert.equal(answers.get("wood:treated")?.rawEvaluation.status,"SUPPORTABLE");
  assert.notEqual(answers.get("wood:cherry")?.rawEvaluation.status,"SUPPORTABLE");
  assert.equal(answers.get("wood:cherry")?.rawEstimate.totals.Q,null);
  assert.equal(answers.get("tier:COATED")?.rawEvaluation.status,"SUPPORTABLE");
  assert.ok(answers.get("tier:COATED")?.rawEvaluation.items[0].Q>0);
});

test("Outdoor inquiry queue runs one job at a time and gives selected work priority after a preview failure", async () => {
  const window: Record<string, any> = {};
  runInNewContext(readFileSync(new URL("../../../public/live/stb-outdoor-option-requests.js", import.meta.url), "utf8"), {window,setTimeout,clearTimeout,Date});
  const {enqueue} = window.STBOutdoorOptionRequests;
  const order: string[] = [];
  let release!: () => void;
  const gate = new Promise<void>(resolve=>{release=resolve});
  const first = enqueue(async()=>{order.push("first preview");await gate;throw new Error("transport failed")},{preview:true});
  const failed = assert.rejects(first,/transport failed/);
  const preview = enqueue(async()=>{order.push("next preview");return "preview"},{preview:true});
  const selected = enqueue(async()=>{order.push("selected job");return "selected"});
  assert.deepEqual(order,["first preview"]);
  release();
  await failed;
  assert.equal(await selected,"selected");
  assert.equal(await preview,"preview");
  assert.deepEqual(order,["first preview","selected job","next preview"]);
});

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
    materialDemand: { species: "poplar", form: "board", nominalT: 1, grade: "select" },
    componentPrograms: [
      { componentId: "ALCOVE-UPRIGHT-01", requirementId: "ALCOVE-UPRIGHT-PARENTS", nominalW: 6, finishedLengthIn: 36, finishedWidthIn: 5.5, features: [{ featureId: "SPOT-1", kind: "SPOT_ON_LOCATION", xIn: 12, acrossWidthRule: "CENTERED_ON_WIDE_FACE" }] },
      { componentId: "ALCOVE-SHELF-01-STRIP-01", requirementId: "ALCOVE-SHELF-PARENTS", nominalW: 6, finishedLengthIn: 30, finishedWidthIn: 5.5, features: [] },
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
    cutPackages: [{ packageId: "treated|LEGS", material: { species: "syp-treated", form: "board", nominalT: 2, nominalW: 6, grade: "above-ground" }, endCut: { angleDeg: 25,endRelation:"parallel",lengthDatum:"long-long-outer-edge",plane:"miter-face" }, parts: [{ partId: "LEG-01", lengthIn: 31.375 }] }],
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
  assert.equal(raw(base).totals.Q, 76.56);
  assert.equal(raw(base).totals.material, 26.55);
  assert.equal(raw(base).totals.machine_service, 30.01);
  assert.equal(raw(base).totals.manual_cut_service, 20);
  assert.equal(raw(base).totals.manualCutCount, 2);
  assert.equal(raw(base).selectedStock[0].storeSku, "STB-ZERO-PLY-050-48X96-001");
  const cut = await ask("ph-cut", playhouseSheet("ph-cut", [{ featureId: "CUT-M1", kind: "CROSSCUT", fromEnd: "LEFT", distanceIn: 26 }]));
  assert.equal(raw(cut).status, "SUPPORTABLE");
  assert.equal(raw(cut).freshEvaluation, true);
  assert.ok(raw(cut).totals.Q > raw(base).totals.Q, "the added cut is priced, not dropped");
  assert.ok(raw(cut).operations.some((op:any)=>op.kind==="PANEL_SAW_CUT"&&op.cutKind==="CROSSCUT"&&op.positionIn===26));
  assert.deepEqual(cut.body.carriedNotAccepted, []);
  const mapped = (cut.body.mappedCallInputs as { demand: { features: { featureId: string }[] } }).demand;
  assert.ok(mapped.features.some((feature) => feature.featureId === "CUT-M1"), "the added cut reached the Store");
  // A cut through the opening is the Store's refusal, with its own reason.
  const through = await ask("ph-through", playhouseSheet("ph-through", [{ featureId: "CUT-M1", kind: "CROSSCUT", fromEnd: "LEFT", distanceIn: 48 }]));
  assert.equal(raw(through).status, "REFUSED");
  assert.ok(raw(through).reasonRecords.some((r: { code: string }) => r.code === "PANEL_CUT_INTERSECTS_ROUTED_FEATURE"));
  // Another wood the Store offers is priced for that wood.
  const fir = await ask("ph-fir", playhouseSheet("ph-fir", [], { thicknessIn: 0.625, species: "fir", grade: "BCX-sanded" }));
  assert.equal(raw(fir).status, "SUPPORTABLE");
  assert.equal(raw(fir).selectedStock[0].storeSku, "STB-ZERO-PLY-063-48X96-001");
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
  assert.equal(accepted.totals.Q, 76.56);
  assert.equal(accepted.parents.find((p:any)=>p.kind==="sheet").geometry.apertures[0].box.x0, 32);
  assert.ok(accepted.operations.some((op:any)=>op.kind==="FEATURE_ANSWERED"&&op.featureId==="PATTERN"));
  assert.deepEqual(within.body.carriedNotAccepted, []);
  assert.ok(accepted.evaluationReceipt);
  const moved = await ask("ph-pattern-out", playhouseSheet("ph-pattern-out",[{...pattern,offsetXIn:7}]));
  const refused = moved.body.rawEvaluation as Record<string, any>;
  assert.equal(refused.status, "REFUSED");
  assert.equal(refused.freshEvaluation, true);
  assert.ok(refused.reasonCodes.includes("ROUTED_PROFILE_OUTSIDE_WORK_FIELD"));
  assert.equal(refused.totals, null);
  assert.equal(refused.Q, null);
  assert.deepEqual(moved.body.carriedNotAccepted, []);
  const tooTall = playhouseSheet("ph-height-out");
  (tooTall.features[0] as { straightHeightIn:number }).straightHeightIn=25;
  const heightRefusal = await ask("ph-height-out",tooTall);
  assert.equal((heightRefusal.body.rawEvaluation as Record<string, any>).status,"REFUSED");
  assert.ok((heightRefusal.body.rawEvaluation as Record<string, any>).reasonCodes.includes("ROUTED_PROFILE_OUTSIDE_WORK_FIELD"));
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
  assert.ok(evaluated.operations.some((op:any)=>op.kind==="PANEL_SAW_CUT"&&op.cutKind==="RIP"&&op.pathLengthIn===96));
  assert.deepEqual(done.body.carriedNotAccepted,[]);
  const onPlayhouse=await ask("ph-rip-mixed",playhouseSheet("ph-rip-mixed",[rip]));
  const refusal=onPlayhouse.body.rawEvaluation as Record<string, any>;
  assert.equal(refusal.status,"REFUSED");
  assert.equal(refusal.freshEvaluation,true);
  assert.ok(refusal.reasonCodes.includes("PANEL_CUT_INTERSECTS_ROUTED_FEATURE"),refusal.reasonCodes.join(","));
  assert.equal(refusal.Q,null);
  assert.deepEqual(onPlayhouse.body.carriedNotAccepted,[]);
});

test("a sheet or feature field the job states reaches the Store, which refuses an undeclared one by name", async () => {
  const origin = await storeOrigin();
  const definition = playhouseSheet("ph-extra", [{ featureId: "X", kind: "CROSSCUT", fromEnd: "LEFT", distanceIn: 26, colour: "red" }], { storeSku: "STB-ZERO-PLY-050-48X96-001" });
  const answered = await answerPublishedWire(wireFor("playhouse", "SHEET_PACKAGE_V1", "ph-extra", { definition, definitionKind: "sheet_package.v1", ruleVersion: "0.1" }), origin);
  const demand = (answered.body.mappedCallInputs as { demand: { sheet: Record<string, unknown>; features: Record<string, unknown>[] } }).demand;
  assert.equal(demand.sheet.storeSku, "STB-ZERO-PLY-050-48X96-001");
  assert.equal(demand.features[4].colour, "red");
  const raw = answered.body.rawEvaluation as Record<string, any>;
  assert.equal(raw.status, "REFUSED");
  assert.deepEqual([...raw.reasonCodes].sort(), ["DEFINITION_FIELD_NOT_DECLARED:features[4].colour", "DEFINITION_FIELD_NOT_DECLARED:sheet.storeSku"]);
  assert.equal(raw.Q ?? null, null);
  assert.equal((answered.body.jobSupportability as { status: string }).status, "NOT_SUPPORTABLE");
});

test("Playhouse custom split: absent tab positions stay required; the split and the job are unresolved and no Q is complete", async () => {
  const origin = await storeOrigin();
  const ask = (version: string, split: Record<string, unknown>) => {
    const definition: Record<string, any> = playhouseSheet(version);
    definition.features = definition.features.map((feature: Record<string, unknown>) => feature.featureId === "CENTER-SPLIT" ? { ...feature, ...split } : feature);
    return answerPublishedWire(wireFor("playhouse", "SHEET_PACKAGE_V1", version, { definition, definitionKind: "sheet_package.v1", ruleVersion: "0.1" }), origin);
  };
  for (const [name, split] of [["omitted", { splitTabMode: "CUSTOM" }], ["null", { splitTabMode: "CUSTOM", splitTabPositionsIn: null }], ["empty", { splitTabMode: "CUSTOM", splitTabPositionsIn: [] }]] as const) {
    const answered = await ask(`ph-split-${name}`, split);
    const raw = answered.body.rawEvaluation as Record<string, any>;
    const sentSplit = (answered.body.mappedCallInputs as { demand: { features: Record<string, unknown>[] } }).demand.features.find((feature) => feature.featureId === "CENTER-SPLIT");
    assert.equal(sentSplit?.splitTabMode, "CUSTOM", `${name}: the custom mode reached the Store`);
    assert.equal(raw.status, "UNRESOLVED", name);
    assert.equal(raw.freshEvaluation, true);
    assert.ok(raw.reasonCodes.includes("SPLIT_TAB_POSITIONS_REQUIRED"));
    assert.ok(raw.reasonRecords.some((r:any)=>r.subject==="CENTER-SPLIT"));
    assert.equal(raw.Q, null);
    assert.equal(raw.totals, null);
    assert.notEqual((answered.body.priceCompleteness as { status: string }).status, "COMPLETE_FOR_TRAVEL_STANDARD");
    assert.equal((answered.body.jobSupportability as { status: string; quoteComplete: boolean }).status, "NOT_SUPPORTABLE");
    assert.equal((answered.body.jobSupportability as { quoteComplete: boolean }).quoteComplete, false);
  }
  const placed = await ask("ph-split-placed", { splitTabMode: "CUSTOM", splitTabPositionsIn: [6, 20] });
  const raw = placed.body.rawEvaluation as Record<string, any>;
  assert.equal(raw.status, "SUPPORTABLE");
  assert.ok(raw.manifestCoverage.featureIds.includes("CENTER-SPLIT"));
  assert.equal(typeof raw.totals.Q, "number");
});

test("a declared shallow Alcove profile reaches the shared model as literal geometry", async () => {
  const origin = await storeOrigin();
  const definition = {
    configurationId: "ALCOVE-USER1",
    configurationVersion: "alcove-mill",
    boardRequirements: [{ requirementId: "ALCOVE-SHELF-PARENTS", requiredOps: ["CROSSCUT"] }],
    materialDemand: { species: "poplar", form: "board", nominalT: 1, grade: "select" },
    componentPrograms: [{
      componentId: "ALCOVE-SHELF-01",
      requirementId: "ALCOVE-SHELF-PARENTS",
      nominalW: 6,
      finishedLengthIn: 30,
      finishedWidthIn: 5.5,
      features: [{ featureId: "MILL-1", kind: "MILL_LONGITUDINAL_PROFILE", yIn: 5.5, pathLengthIn: 30, totalDepthIn: 0.25 }],
    }],
  };
  const answered = await answerPublishedWire(wireFor("alcove", "ALCOVE_INSERT_V1", "alcove-mill", { definition }), origin);
  assert.equal(answered.httpStatus, 200);
  const body = answered.body as Record<string, any>;
  const profile = body.mappedCallInputs.demand.cutPackages[0].parts[0].edgeProfiles[0];
  assert.equal(profile.pathLengthIn, 30);
  assert.equal(profile.totalDepthIn, 0.25);
  assert.equal(body.rawEvaluation.status,"SUPPORTABLE");
  assert.ok(body.rawEvaluation.operations.some((op:any)=>op.kind==="ROUTER_CUT"&&op.axialDepthIn===0.25));
  assert.equal(body.rawEstimate.complete,true);
  assert.equal(publishedFunction("system-build-current.html", "alcoveBudgetaryReview", { tileHostContract })(body), false);
  const job = answered.body.jobSupportability as { status?: string };
  assert.equal(job.status,"REQUIREMENTS_SATISFIED");
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
        const base = { protocol: "STORE-ZERO-REQUEST-2", storeRelease: release, payloadDigest: digest };
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


test("the published default Alcove, including through profiles and shelf-elevation spots, reaches full Store evaluation", async () => {
  const file = "system-build-base-8d8a9dd.html";
  const alcove = { material: "pine", pilotShelves: true, spotInsetIn: 1.5, H: [12, 24, 36, 45, 65, 68, 70] };
  const inputs: Record<string, {value: string}> = { "c-h": {value:"72"}, "c-w": {value:"45.5"}, "c-d": {value:"14"}, "c-n": {value:"5"} };
  const snapshot = publishedFunction(file, "currentAlcoveSnapshot", { alcove, document: {getElementById:(id: string)=>inputs[id]} })();
  const offers=[6,8,10].map(w=>({offered:true,species:"pine",form:"board",grade:"select",nominalT:1,nominalW:w,actualW:w===6?5.5:w===8?7.25:9.25}));
  const stock={species:"pine",status:"READY",offers,pin:"test-fixture"};
  const finish={mode:"ECONOMY",mixed:false,first:10,second:6};
  const specs=publishedFunction(file,"alcoveBoardSpecifications",{alcoveStock:stock,alcoveFinish:finish});
  const components=publishedFunction(file,"alcoveComponentPrograms");
  const revision = publishedFunction(file, "alcoveRevision", {alcove, alcoveBoardSpecifications:specs, alcoveComponentPrograms:components,
    alcoveDefinitionSignature:publishedFunction(file,"alcoveDefinitionSignature",{alcoveBoardSpecifications:specs,alcoveFinish:finish}), ALCOVE_PROJECT_ID:"alcove"})(snapshot);
  const definition = publishedFunction(file,"alcoveDefinitionFrom", {ALCOVE_HARDWARE_DEMAND:{requirementId:"ALCOVE-PINS-AND-SCREWS",qty:1}})({
    definitionRevisionId:revision.definitionRevisionId,
    facts:Object.fromEntries(Object.entries(revision.facts).map(([key,fact])=>[key,(fact as {value:unknown}).value])), openDemands:["alcove.hardware"]});
  const ask = async (def: Record<string, any>, version: string) => (await answerPublishedWire(wireFor("alcove","ALCOVE_INSERT_V1",version,
    {definition:{...def,configurationVersion:version}}),await storeOrigin())).body as Record<string,any>;
  const valid = await ask(definition,"alcove-explicit-valid");
  assert.equal(valid.rawEvaluation.status,"SUPPORTABLE");
  assert.equal(valid.jobSupportability.status,"REQUIREMENTS_SATISFIED");
  assert.deepEqual(valid.requirementSatisfaction.unevaluated,[]);
  assert.equal(valid.rawEvaluation.packages.reduce((n: number,p: any)=>n+p.spotCount,0),20);
  const profiles=valid.rawEvaluation.components.flatMap((p:any)=>p.features.filter((f:any)=>f.kind==="MILL_LONGITUDINAL_PROFILE"));
  assert.equal(profiles.length,5);
  assert.ok(profiles.every((f:any)=>f.pathLengthIn===44&&f.yIn===6.75&&f.totalDepthIn===.75));
  assert.equal(publishedFunction("system-build-current.html","alcoveSupportable")(valid),true);
  // Three Bench choices are distinct Store definitions. Compare complete Store answers.
  const pricedFinish = async (mode: "BALANCED"|"ALL_EDGES") => {
    const choice={...finish,mode};
    const chosenSpecs=publishedFunction(file,"alcoveBoardSpecifications",{alcoveStock:stock,alcoveFinish:choice});
    const chosenSignature=publishedFunction(file,"alcoveDefinitionSignature",{alcoveBoardSpecifications:chosenSpecs,alcoveFinish:choice});
    const chosenRevision=publishedFunction(file,"alcoveRevision",{
      alcove,alcoveBoardSpecifications:chosenSpecs,alcoveComponentPrograms:components,
      alcoveDefinitionSignature:chosenSignature,ALCOVE_PROJECT_ID:"alcove"
    })(snapshot);
    const chosenDefinition=publishedFunction(file,"alcoveDefinitionFrom",{
      ALCOVE_HARDWARE_DEMAND:{requirementId:"ALCOVE-PINS-AND-SCREWS",qty:1}
    })({
      definitionRevisionId:chosenRevision.definitionRevisionId,
      facts:Object.fromEntries(Object.entries(chosenRevision.facts).map(([key,fact])=>[key,(fact as {value:unknown}).value])),
      openDemands:["alcove.hardware"]
    });
    return await ask(chosenDefinition,"alcove-edge-"+mode);
  };
  const balanced=await pricedFinish("BALANCED");
  const allEdges=await pricedFinish("ALL_EDGES");
  assert.equal(balanced.rawEvaluation.status,"SUPPORTABLE");
  assert.equal(allEdges.rawEvaluation.status,"SUPPORTABLE");
  assert.equal(allEdges.jobSupportability.status,"REQUIREMENTS_SATISFIED");
  const allStrips=allEdges.rawEvaluation.packages.filter((p:any)=>p.packageId.startsWith("ALCOVE-SHELF"));
  assert.ok(allStrips.length>0&&allStrips.every((p:any)=>["FAR_EDGE","FENCE_EDGE"].every(subject=>p.events.some((op:any)=>op.kind==="ROUTER_CUT"&&op.subject===subject))));
  assert.ok(allEdges.rawEstimate.totals.Q>balanced.rawEstimate.totals.Q,"Store must charge its modeled additional machining, not a UI surcharge");
  assert.equal(allEdges.machineAdmission.physicalRelease,false);

  const storeTime=publishedFunction(file,"alcoveStoreTime");
  const displayedTime=storeTime(valid);
  assert.ok(displayedTime.T_MACHINE_sec>0);
  assert.equal(displayedTime.T_MACHINE_sec,valid.rawEvaluation.time.totalSeconds);
  assert.equal(displayedTime.T_MACHINE_min,valid.rawEvaluation.time.totalMinutes);
  assert.deepEqual(displayedTime.categories,valid.rawEvaluation.time.categories);
  const missingTime=JSON.parse(JSON.stringify(valid));delete missingTime.rawEvaluation.time;
  assert.equal(storeTime(missingTime),null);
  const scopedOnly=JSON.parse(JSON.stringify(valid));scopedOnly.jobSupportability.status="REQUIREMENTS_NOT_FULLY_EVALUATED";
  assert.equal(storeTime(scopedOnly),null);
  assert.equal(valid.machineAdmission.physicalRelease,false);
  const withoutSpots=JSON.parse(JSON.stringify(definition));
  withoutSpots.spotDemand.enabled=false;withoutSpots.spotDemand.features=[];
  withoutSpots.componentPrograms.forEach((p:any)=>{p.features=p.features.filter((f:any)=>f.kind!=="SPOT_ON_LOCATION")});
  const plain=await ask(withoutSpots,"alcove-explicit-plain");
  assert.equal(plain.jobSupportability.status,"REQUIREMENTS_SATISFIED");
  assert.ok(valid.rawEstimate.totals.Q>plain.rawEstimate.totals.Q);
  const wrongTool=JSON.parse(JSON.stringify(definition));wrongTool.spotDemand.toolDiameterIn=.5;
  wrongTool.spotDemand.features.forEach((f:any)=>f.toolDiameterIn=.5);
  wrongTool.componentPrograms.forEach((p:any)=>p.features.filter((f:any)=>f.kind==="SPOT_ON_LOCATION").forEach((f:any)=>f.toolDiameterIn=.5));
  const refused=await ask(wrongTool,"alcove-explicit-wrong-tool");
  assert.equal(refused.rawEstimate.complete,false);
  assert.equal(refused.rawEvaluation.status,"REFUSED");
  assert.equal(refused.rawEvaluation.Q,null);
  assert.ok(refused.rawEvaluation.reasonCodes.includes("SPOT_DIAMETER_NOT_DECLARED"));
  assert.equal(publishedFunction("system-build-current.html","alcoveSupportable")(refused),false);
  assert.equal(storeTime(refused),null);
  const incomplete=JSON.parse(JSON.stringify(definition));delete incomplete.componentPrograms[0].features[0].xIn;
  const missing=await ask(incomplete,"alcove-explicit-missing-location");
  assert.equal(missing.adapterError,true);assert.equal(missing.rawEstimate,undefined);
  assert.ok(missing.carriedNotAccepted.some((r:any)=>r.value==="location missing"));
});

test('actual board translation keeps malformed and unknown physical requirements for Store refusal',async()=>{
 const cases:[string,unknown][]=[['insetFromEdgeIn',null],['insetFromEdgeIn','bad'],['locationRule',null],['acrossWidthRule',null],['fullDiameterDepthIn',null],['fullDiameterDepthIn',0],['fullDiameterDepthIn',-0.125],['fullDiameterDepthIn','0.125'],['requiredFlatBottom',true],['kind','FLAT_BOTTOM_SPOTFACE'],['kind','pilot hole']];
 for(const [field,value] of cases){
  const line=braceLine();(line.parts[0].features[0] as Record<string,unknown>)[field]=value;
  const mapped=boardDemandFromPublishedLine(line).demand as any;
  assert.deepEqual(mapped.parts[0].features[0][field],value,field);
  const r=await answerPublishedWire(wireFor('start-own','USER_DEFINED_BOARD_V1','operand-'+field,{line}),await storeOrigin());
  assert.equal((r.body.storeAnswer as any).status,'REFUSED',field+': '+JSON.stringify(r.body));
  assert.equal((r.body.storeAnswer as any).Q??null,null);assert.notEqual((r.body.jobSupportability as any).status,'REQUIREMENTS_SATISFIED');
 }
 for(const edit of [(line:any)=>line.parts[0].requiredSurface='flat-seat',(line:any)=>line.requiredSurface='flat-seat',(line:any)=>line.unresolvedConditions=['pilot depth unspecified']]){
  const line=braceLine();edit(line);
  const r=await answerPublishedWire(wireFor('start-own','USER_DEFINED_BOARD_V1','unknown-physical',{line}),await storeOrigin());
  assert.notEqual((r.body.storeAnswer as any).status,'SUPPORTABLE');assert.equal((r.body.storeAnswer as any).Q??null,null);
 }
});
test('published angled ends require physical geometry regardless of the source word',async()=>{
 const base={configurationId:'SOURCE-TERMS',configurationVersion:'source-terms',cutPackages:[{packageId:'BRACE',material:{species:'syp-treated',form:'board',nominalT:2,nominalW:4,grade:'above-ground'},endCut:{angleDeg:25,sourceTerm:'bevel',endRelation:'parallel',lengthDatum:'long-point-to-short-point',endPointOrientation:'long-to-short',plane:'miter-face'},parts:[{partId:'BRACE-1',lengthIn:32.875}]}]};
 const valid=await answerPublishedWire(wireFor('outdoor','CUT_PACKAGE_V1','source-terms',{definition:base}),await storeOrigin());
 assert.equal((valid.body.storeAnswer as any).status,'SUPPORTABLE');
 assert.equal((valid.body.manufacturingMeaning as any)[0].sourceTerm,'bevel');
 assert.equal((valid.body.manufacturingMeaning as any)[0].sourceTermUsedAsAuthority,false);
 for(const field of ['plane','lengthDatum','endPointOrientation']){
  const missing=structuredClone(base);delete (missing.cutPackages[0].endCut as any)[field];
  const r=await answerPublishedWire(wireFor('outdoor','CUT_PACKAGE_V1','source-terms',{definition:missing}),await storeOrigin());
  assert.equal(r.body.code,'PUBLISHED_DEFINITION_INCOMPLETE');assert.equal(r.body.storeAnswer,undefined);
 }
 const bevel=structuredClone(base);bevel.cutPackages[0].endCut.plane='bevel-through-thickness';
 const refused=await answerPublishedWire(wireFor('outdoor','CUT_PACKAGE_V1','source-terms',{definition:bevel}),await storeOrigin());
 assert.notEqual((refused.body.storeAnswer as any).status,'SUPPORTABLE');assert.equal((refused.body.storeAnswer as any).Q??null,null);
});

test('a contradictory spot summary or unsupported board service cannot be priced as the old smaller job',async()=>{
 for(const edit of [(l:any)=>l.spotDemand.requiredFlatBottom=true,(l:any)=>l.spotDemand.mode='COUNTERBORE',(l:any)=>l.spotDemand.totalCount=3,(l:any)=>l.quantity=2,(l:any)=>l.drillCycles=1,(l:any)=>l.drillDepthIn=0.5]){
  const line=braceLine();edit(line);
  const r=await answerPublishedWire(wireFor('start-own','USER_DEFINED_BOARD_V1','summary-conflict',{line}),await storeOrigin());
  assert.equal(r.body.code,'PUBLISHED_DEFINITION_INCOMPLETE');assert.equal(r.body.storeAnswer,undefined);assert.ok((r.body.carriedNotAccepted as any[]).length);
 }
});
