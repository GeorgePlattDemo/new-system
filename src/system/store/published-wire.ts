/**
 * Speaks the published page's store wire and asks the replacement Store.
 * The page keeps its words. This file does not price anything itself.
 */

import { sha256Bytes } from "../hash.ts";
import { STORE_CANDIDATE } from "../store-candidate.ts";
import { interpretStoreHttp } from "./interpret.ts";

const PRICED_BOARD_ENDS = { endRelation: "parallel", lengthDatum: "long-long-outer-edge" } as const;

export type CarriedRequirement = {
  field: string;
  value: string;
  reported: "KEPT_ON_THE_JOB_NOT_A_STORE_BOARD_FIELD";
};

export type EndIdentityCanonicalization = {
  suppliedEndIdentity: string;
  sentEndIdentity: null;
  rule: "REDUNDANT_WITH_PRICED_LENGTH_DATUM";
  meaning: "parallel ends, length on the long-long outer edge; Store prices that geometry with no second end-identity string";
};

export type AssignedFeatureIdentity = {
  featureId: string;
  partId: string;
  index: number;
  kind: string;
};

type Json = Record<string, unknown>;

function asObject(value: unknown): Json | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Json) : null;
}

function finite(value: unknown): number | null {
  if (typeof value === "string" && value.trim() === "") return null;
  if (typeof value !== "number" && typeof value !== "string") return null;
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : null;
}

function statedText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text.length ? text : null;
}

/**
 * The published brace line, turned into the board demand the replacement Store accepts.
 * End relation and length datum are sent. A second end-identity string is not sent when
 * that datum is already the priced long-long outer edge: the supplied string stays on the
 * canonicalization record. A missing feature id on a declared spot gets a stable technical
 * id. A missing coordinate stays missing. Grade is sent only when the line already names one.
 */
export function boardDemandFromPublishedLine(line: Json): {
  demand: Json;
  carriedNotAccepted: CarriedRequirement[];
  endIdentityCanonicalization: EndIdentityCanonicalization | null;
  assignedFeatureIdentities: AssignedFeatureIdentity[];
  materialFormEstablished: boolean;
} {
  const carriedNotAccepted: CarriedRequirement[] = [];
  const assignedFeatureIdentities: AssignedFeatureIdentity[] = [];
  const material = asObject(line.materialDemand) ?? {};
  const formStated = statedText(material.form);
  const boardSelected = statedText(material.species) != null && finite(material.nominalT) != null && finite(material.nominalW) != null;
  const materialFormEstablished = formStated == null && boardSelected;
  const grade = statedText(material.grade);
  const materialDemand: Json = {
    ...material,
    ...(formStated != null ? { form: formStated } : materialFormEstablished ? { form: "board" } : {}),
    ...(grade != null ? { grade } : {}),
  };
  if (materialFormEstablished) materialDemand.form = "board";
  const endRelation = statedText(line.endRelation);
  const lengthDatum = statedText(line.lengthDatum);
  const suppliedEndIdentity = statedText(line.endIdentity);
  const redundantIdentity = suppliedEndIdentity != null && endRelation === PRICED_BOARD_ENDS.endRelation && lengthDatum === PRICED_BOARD_ENDS.lengthDatum;
  const endIdentityCanonicalization: EndIdentityCanonicalization | null = redundantIdentity
    ? {
        suppliedEndIdentity,
        sentEndIdentity: null,
        rule: "REDUNDANT_WITH_PRICED_LENGTH_DATUM",
        meaning: "parallel ends, length on the long-long outer edge; Store prices that geometry with no second end-identity string",
      }
    : null;
  const lengthObject = asObject(line.definedWorkpieceLength);
  const definedWorkpieceLengthIn = finite(lengthObject?.value ?? line.definedWorkpieceLengthIn);
  const parts = Array.isArray(line.parts) ? line.parts.map((part) => {
    const row = asObject(part) ?? {};
    const partId = String(row.partId ?? "");
    const features = Array.isArray(row.features) ? row.features.map((feature, index) => {
      const spot = asObject(feature) ?? {};
      const declared = statedText(spot.featureId);
      const featureId = declared ?? `declared:${partId || "part"}:feature:${index}`;
      if (!declared) assignedFeatureIdentities.push({ featureId, partId, index, kind: String(spot.kind ?? "") });
      return {
        featureId,
        kind: String(spot.kind ?? ""),
        xIn: finite(spot.xIn),
        locationRule: spot.locationRule == null ? null : String(spot.locationRule),
        acrossWidthRule: spot.acrossWidthRule == null ? null : String(spot.acrossWidthRule),
        insetFromEdgeIn: finite(spot.insetFromEdgeIn),
      };
    }) : [];
    return { partId, lengthIn: finite(row.lengthIn), features };
  }) : [];
  const spot = asObject(line.spotDemand);
  return {
    carriedNotAccepted,
    endIdentityCanonicalization,
    assignedFeatureIdentities,
    materialFormEstablished,
    demand: {
      title: "Start your own",
      configurationId: String(line.configurationId ?? ""),
      configurationVersion: String(line.configurationVersion ?? ""),
      classId: "user_defined_board",
      materialDemand,
      definedWorkpieceLengthIn,
      requiredOps: Array.isArray(line.requiredOps) ? line.requiredOps : [],
      sawAngleDeg: finite(line.sawAngleDeg),
      cutPlane: line.cutPlane == null ? null : String(line.cutPlane),
      datumCMethod: String(line.datumCMethod ?? ""),
      ...(endRelation != null ? { endRelation } : {}),
      ...(lengthDatum != null ? { lengthDatum } : {}),
      ...(redundantIdentity ? { endIdentity: null } : suppliedEndIdentity != null ? { endIdentity: suppliedEndIdentity } : {}),
      declaredSawCuts: finite(line.sawCuts),
      declaredSpotCount: finite(spot?.totalCount),
      unresolvedConditions: [],
      parts,
    },
  };
}

function echo(wire: Json, extra: Json): Json {
  return {
    protocolVersion: wire.protocolVersion,
    requestId: wire.requestId,
    attemptId: wire.attemptId,
    attemptNumber: wire.attemptNumber,
    projectId: wire.projectId,
    candidateRevisionId: wire.candidateRevisionId,
    requestType: wire.requestType,
    scope: wire.scope,
    demandSignature: wire.demandSignature ?? null,
    querySignature: wire.querySignature ?? null,
    payloadDigest: wire.payloadDigest,
    sentAt: wire.sentAt ?? null,
    ...extra,
  };
}

async function postStore(origin: string, body: Json): Promise<{ httpStatus: number; responseText: string; sent: string }> {
  const sent = JSON.stringify(body);
  try {
    const response = await fetch(new URL("/v1/requests", origin), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: sent,
      signal: AbortSignal.timeout(15000),
    });
    return { httpStatus: response.status, responseText: await response.text(), sent };
  } catch {
    return { httpStatus: 0, responseText: "", sent };
  }
}

/** One rule for every published answer: the server pin governs, and a quotation needs its receipt. */
function readStoreReply(sent: { httpStatus: number; responseText: string; sent: string }, demand: Json, requestId: string, requestType: string) {
  return interpretStoreHttp({
    sentBody: sent.sent,
    sentDigest: sha256Bytes(sent.sent),
    requestType,
    requestId,
    demand,
    httpStatus: sent.httpStatus,
    responseText: sent.responseText,
    expectedRelease: STORE_CANDIDATE.inspectedCommit,
  });
}

function callerPinProblem(wire: Json): string | null {
  const pin = wire.expectedStorePin;
  if (pin == null || pin === "") return null;
  if (pin !== STORE_CANDIDATE.inspectedCommit) return "CALLER_PIN_DOES_NOT_GOVERN";
  return null;
}

function requirementReport(carriedNotAccepted: CarriedRequirement[]) {
  const unevaluated = carriedNotAccepted.length > 0;
  return {
    requirementSatisfaction: {
      status: unevaluated ? "UNEVALUATED" : "SATISFIED",
      unevaluated: carriedNotAccepted,
    },
    machineAdmission: {
      status: "BLOCKED",
      physicalRelease: false,
      evidenceClass: "SIMULATED",
    },
  } as const;
}

function pageAnswer(wire: Json, wrapper: Json, carriedNotAccepted: CarriedRequirement[], notes: Json = {}): Json {
  const answer = asObject(wrapper.answer) ?? {};
  const estimate = asObject(answer.estimate);
  const receipt = asObject(answer.evaluationReceipt);
  const quoteComplete = answer.status === "SUPPORTABLE"
    && (estimate?.complete === true || asObject(answer.totals)?.sumOfSupportableLines != null || finite(answer.Q) != null);
  const requirements = requirementReport(carriedNotAccepted);
  const jobStatus = !quoteComplete
    ? "NOT_SUPPORTABLE"
    : requirements.requirementSatisfaction.status === "SATISFIED"
      ? "REQUIREMENTS_SATISFIED"
      : "NOT_FULLY_SUPPORTABLE";
  const firstLine = asObject(Array.isArray(answer.lines) ? answer.lines[0] : null);
  const price = asObject(firstLine?.price);
  const resolution = asObject(answer.materialResolution) ?? {};
  const capability = asObject(answer.capability) ?? asObject(resolution.capability);
  const reasonCodes = Array.isArray(answer.reasonCodes) ? answer.reasonCodes.map(String) : [];
  const cellFamily = Array.isArray(capability?.cellFamily) ? capability.cellFamily : null;
  const supportedOps = Array.isArray(capability?.supportedOps) ? capability.supportedOps : null;
  return echo(wire, {
    storePin: wrapper.storeRelease,
    rawEvaluation: { ...answer, freshEvaluation: answer.freshEvaluation === true, evaluationReceipt: receipt },
    rawEstimate: estimate ?? presentedEstimate(answer),
    evaluationReceipt: receipt,
    priceCompleteness: {
      status: quoteComplete ? "COMPLETE_FOR_TRAVEL_STANDARD" : String(answer.status ?? "UNRESOLVED"),
      scope: "QUOTE_ONLY",
      refusalConditions: answer.status === "REFUSED" ? reasonCodes : [],
      unresolvedConditions: answer.status === "UNRESOLVED" || answer.status === "UNAVAILABLE" ? reasonCodes : [],
      carriedNotAccepted,
    },
    requirementSatisfaction: requirements.requirementSatisfaction,
    machineAdmission: requirements.machineAdmission,
    jobSupportability: {
      status: jobStatus,
      quoteComplete,
      requirementsEvaluated: requirements.requirementSatisfaction.status === "SATISFIED",
      machineAdmitted: false,
    },
    materialResolution: {
      ...resolution,
      unitPrice: price?.sellingPrice ?? null,
      source: { repository: "replacement-store", pin: wrapper.storeRelease, clock: null },
    },
    rawOffering: {
      storeSku: resolution.storeSku ?? null,
      stockL_in: resolution.workpieceLengthIn ?? null,
      sellingPrice: price?.sellingPrice ?? null,
      cellFamily,
      supportedOps,
      capabilityAttribution: cellFamily || supportedOps ? "STORE_ANSWER" : "NOT_SUPPLIED_BY_STORE",
    },
    calculationIdentity: answer.calculationIdentity ?? estimate?.calculationIdentity ?? null,
    carriedNotAccepted,
    ...notes,
    wrapperRespondedAt: wrapper.respondedAt ?? null,
    storeProtocol: wrapper.protocol,
  });
}

function presentedEstimate(answer: Json): Json {
  const totals = asObject(answer.totals) ?? {};
  const complete = answer.status === "SUPPORTABLE";
  return {
    complete,
    totals: {
      material: totals.material ?? null,
      machine_service: totals.machine_service ?? null,
      hardware: totals.items ?? null,
      Q: complete ? totals.sumOfSupportableLines ?? answer.Q ?? null : null,
    },
  };
}

/**
 * What a published object states beyond the fields this translator reads. It travels to the Store unchanged, so the
 * Store's contract refuses an undeclared field by name; it is never dropped here and the rest answered as the whole job.
 */
function unconsumed(source: Json, consumed: string[]): Json {
  const out: Json = {};
  for (const key of Object.keys(source)) if (!consumed.includes(key)) out[key] = source[key];
  return out;
}

type Translation = { demand: Json; carriedNotAccepted: CarriedRequirement[] } | { blocked: CarriedRequirement[] };

function blocked(field: string, value: string): Translation {
  return { blocked: [{ field, value, reported: "KEPT_ON_THE_JOB_NOT_A_STORE_BOARD_FIELD" }] };
}

function spotFrom(feature: Json, index: number, partId: string, problems: CarriedRequirement[]): Json | null {
  const xIn = finite(feature.xIn);
  if (xIn == null) {
    problems.push({ field: `spot:${String(feature.featureId || partId)}`, value: "location missing", reported: "KEPT_ON_THE_JOB_NOT_A_STORE_BOARD_FIELD" });
    return null;
  }
  if (feature.featureId == null) {
    problems.push({ field: `spot:${partId}[${index}]`, value: "feature id missing", reported: "KEPT_ON_THE_JOB_NOT_A_STORE_BOARD_FIELD" });
    return null;
  }
  const spot: Json = { featureId: String(feature.featureId), xIn };
  if (feature.acrossWidthRule != null) spot.acrossWidthRule = String(feature.acrossWidthRule);
  const inset = finite(feature.insetFromEdgeIn);
  if (inset != null) spot.insetFromEdgeIn = inset;
  return spot;
}

function partsFrom(raw: unknown, problems: CarriedRequirement[]): Json[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((part) => {
    const row = asObject(part) ?? {};
    const partId = String(row.partId ?? row.componentId ?? "");
    const features = Array.isArray(row.spots) ? row.spots : Array.isArray(row.features) ? row.features : [];
    const spots = features
      .map((feature, index) => {
        const stated = asObject(feature) ?? {};
        const spot = spotFrom(stated, index, partId, problems);
        return spot && { ...unconsumed(stated, ["featureId", "xIn", "acrossWidthRule", "insetFromEdgeIn"]), ...spot };
      })
      .filter((spot): spot is Json => spot != null);
    const lengthIn = finite(row.lengthIn ?? row.finishedLengthIn);
    return {
      ...unconsumed(row, ["partId", "componentId", "lengthIn", "finishedLengthIn", "spots", "features"]),
      partId,
      ...(lengthIn != null ? { lengthIn } : {}),
      ...(spots.length ? { spots } : {}),
    };
  });
}

function itemFrom(line: Json, problems: CarriedRequirement[]): Json | null {
  const requirement = asObject(line.requirement);
  const qty = finite(line.qty);
  const lineId = String(line.lineId || line.requirementId || "");
  if (!lineId || qty == null) {
    problems.push({ field: "itemLine", value: lineId || "missing id or quantity", reported: "KEPT_ON_THE_JOB_NOT_A_STORE_BOARD_FIELD" });
    return null;
  }
  const item: Json = { ...unconsumed(line, ["lineId", "requirementId", "qty", "storeSku", "requirement"]), lineId, qty };
  if (line.storeSku != null) item.storeSku = String(line.storeSku);
  else if (line.requirementId != null && !requirement) item.requirementId = String(line.requirementId);
  else if (requirement) item.requirement = { ...requirement };
  else problems.push({ field: `itemLine:${lineId}`, value: "no sku, requirement id, or requirement", reported: "KEPT_ON_THE_JOB_NOT_A_STORE_BOARD_FIELD" });
  return item;
}

/**
 * Published cut-package definition, without a tile name, in the Store's cut-package contract. A missing angle, spot
 * location or item identity blocks before the Store. Anything else the definition states travels as stated.
 */
export function cutDemandFromPublishedDefinition(definition: Json): Translation {
  const problems: CarriedRequirement[] = [];
  const packages = Array.isArray(definition.cutPackages) ? definition.cutPackages : [];
  const cutPackages = packages.map((pkg) => {
    const row = asObject(pkg) ?? {};
    const material = asObject(row.material) ?? {};
    const endCut = asObject(row.endCut) ?? {};
    const angle = finite(endCut.angleDeg);
    if (angle == null) problems.push({ field: `endCut:${String(row.packageId ?? "")}`, value: "angle missing", reported: "KEPT_ON_THE_JOB_NOT_A_STORE_BOARD_FIELD" });
    const finished = finite(row.finishedWidthIn);
    return {
      ...unconsumed(row, ["packageId", "material", "endCut", "finishedWidthIn", "parts"]),
      packageId: String(row.packageId ?? ""),
      material: { ...material },
      ...(angle != null ? { endCut: { ...endCut, angleDeg: angle } } : {}),
      ...(finished != null ? { finishedWidthIn: finished } : {}),
      parts: partsFrom(row.parts, problems),
    };
  });
  const itemLines = (Array.isArray(definition.itemLines) ? definition.itemLines : [])
    .map((line) => itemFrom(asObject(line) ?? {}, problems))
    .filter((line): line is Json => line != null);
  if (problems.length) return { blocked: problems };
  return {
    carriedNotAccepted: [],
    demand: {
      ...unconsumed(definition, ["classId", "configurationId", "configurationVersion", "cutPackages", "itemLines"]),
      ...(definition.classId != null ? { classId: String(definition.classId) } : {}),
      configurationId: String(definition.configurationId ?? ""),
      configurationVersion: String(definition.configurationVersion ?? ""),
      cutPackages,
      ...(itemLines.length ? { itemLines } : {}),
    },
  };
}

/** Alcove's published insert, expressed as the cut packages and requirement the Store already accepts. */
export function cutDemandFromAlcoveInsert(definition: Json): Translation {
  const carriedNotAccepted: CarriedRequirement[] = [];
  const problems: CarriedRequirement[] = [];
  const material = asObject(definition.materialDemand) ?? {};
  const programs = Array.isArray(definition.componentPrograms) ? definition.componentPrograms : [];
  const groups = new Map<string, Json>();
  for (const program of programs) {
    const row = asObject(program) ?? {};
    const features = Array.isArray(row.features) ? row.features : [];
    const mills = features.map((feature) => asObject(feature)).filter((feature) => feature?.kind === "MILL_LONGITUDINAL_PROFILE");
    const finished = finite(row.finishedWidthIn);
    for (const mill of mills) {
      const yIn = finite(mill?.yIn);
      if (yIn == null || finished == null || yIn !== finished) {
        problems.push({ field: `mill:${String(mill?.featureId ?? "")}`, value: "finished width does not equal the mill y", reported: "KEPT_ON_THE_JOB_NOT_A_STORE_BOARD_FIELD" });
      }
      carriedNotAccepted.push({
        field: `mill:${String(mill?.featureId ?? "")}`,
        value: `pathLengthIn=${String(mill?.pathLengthIn ?? "")};totalDepthIn=${String(mill?.totalDepthIn ?? "")}`,
        reported: "KEPT_ON_THE_JOB_NOT_A_STORE_BOARD_FIELD",
      });
    }
    const key = `${String(row.requirementId ?? "PARTS")}|${mills.length && finished != null ? finished : "full"}`;
    const requirements = Array.isArray(definition.boardRequirements) ? definition.boardRequirements : [];
    const parent = requirements.find((item) => asObject(item)?.requirementId === row.requirementId);
    const ops = Array.isArray(asObject(parent)?.requiredOps) ? asObject(parent)?.requiredOps as unknown[] : [];
    const square = ops.includes("CROSSCUT");
    if (!square) problems.push({ field: `endCut:${String(row.requirementId ?? "")}`, value: "published operation does not state a square crosscut", reported: "KEPT_ON_THE_JOB_NOT_A_STORE_BOARD_FIELD" });
    const existing = groups.get(key) ?? {
      packageId: mills.length && finished != null ? `${String(row.requirementId ?? "PARTS")}-TO-${finished}` : String(row.requirementId ?? "PARTS"),
      material: { ...material },
      ...(square ? { endCut: { angleDeg: 0 } } : {}),
      ...(mills.length && finished != null ? { finishedWidthIn: finished } : {}),
      parts: [] as Json[],
    };
    const partId = String(row.componentId ?? "");
    const spots = features
      .filter((feature) => asObject(feature)?.kind === "SPOT_ON_LOCATION")
      .map((feature, index) => spotFrom(asObject(feature) ?? {}, index, partId, problems))
      .filter((spot): spot is Json => spot != null);
    (existing.parts as Json[]).push({
      partId,
      ...(finite(row.finishedLengthIn) != null ? { lengthIn: finite(row.finishedLengthIn) } : {}),
      ...(spots.length ? { spots } : {}),
    });
    groups.set(key, existing);
  }
  const hardware = asObject(definition.hardwareDemand);
  const itemLines = hardware ? [itemFrom({ lineId: hardware.requirementId, requirementId: hardware.requirementId, qty: hardware.qty }, problems)].filter((line): line is Json => line != null) : [];
  if (definition.spotDemand != null) {
    carriedNotAccepted.push({ field: "spotDemand", value: "present", reported: "KEPT_ON_THE_JOB_NOT_A_STORE_BOARD_FIELD" });
  }
  if (problems.length) return { blocked: problems };
  return {
    carriedNotAccepted,
    demand: {
      configurationId: String(definition.configurationId ?? ""),
      configurationVersion: String(definition.configurationVersion ?? ""),
      cutPackages: [...groups.values()],
      ...(itemLines.length ? { itemLines } : {}),
    },
  };
}

/**
 * Published sheet definition, in the Store's sheet-package contract. Every field the job states is sent as stated:
 * the Store's contract is the one list of sheet fields, and it refuses a field it does not declare, by name. System
 * keeps no copy of that list, so a stated requirement (a custom split's tab positions, for one) is never dropped
 * here and answered as a different job. Species is not invented.
 */
export function sheetDemandFromPublishedDefinition(definition: Json): { demand: Json; carriedNotAccepted: CarriedRequirement[] } {
  return {
    carriedNotAccepted: [],
    demand: {
      ...definition,
      configurationId: String(definition.configurationId ?? ""),
      configurationVersion: String(definition.configurationVersion ?? ""),
    },
  };
}

function translatePublished(wire: Json): { storeRequestType: string; demand: Json; carriedNotAccepted: CarriedRequirement[]; notes: Json } | { error: string; blocked?: CarriedRequirement[] } {
  const payload = asObject(wire.payload);
  if (wire.requestType === "USER_DEFINED_BOARD_V1") {
    const line = asObject(payload?.line);
    if (!line) return { error: "PUBLISHED_LINE_REQUIRED" };
    const translated = boardDemandFromPublishedLine(line);
    return {
      storeRequestType: "USER_DEFINED_BOARD_V1",
      demand: translated.demand,
      carriedNotAccepted: translated.carriedNotAccepted,
      notes: {
        endIdentityCanonicalization: translated.endIdentityCanonicalization,
        assignedFeatureIdentities: translated.assignedFeatureIdentities,
        materialFormEstablished: translated.materialFormEstablished,
      },
    };
  }
  const definition = asObject(payload?.definition);
  if (!definition) return { error: "PUBLISHED_DEFINITION_REQUIRED" };
  const requestType = wire.requestType;
  if (requestType !== "CUT_PACKAGE_V1" && requestType !== "SHEET_PACKAGE_V1" && requestType !== "ALCOVE_INSERT_V1") {
    return { error: "LIVE_JOB_NOT_MIGRATED_YET" };
  }
  const translated = requestType === "CUT_PACKAGE_V1"
    ? cutDemandFromPublishedDefinition(definition)
    : requestType === "SHEET_PACKAGE_V1"
      ? sheetDemandFromPublishedDefinition(definition)
      : cutDemandFromAlcoveInsert(definition);
  if ("blocked" in translated) return { error: "PUBLISHED_DEFINITION_INCOMPLETE", blocked: translated.blocked };
  return {
    storeRequestType: requestType === "ALCOVE_INSERT_V1" ? "CUT_PACKAGE_V1" : requestType,
    demand: translated.demand,
    carriedNotAccepted: translated.carriedNotAccepted,
    notes: {},
  };
}

function rejected(wire: Json, code: string, extra: Json = {}): { httpStatus: number; body: Json } {
  return { httpStatus: code === "CALLER_PIN_DOES_NOT_GOVERN" ? 422 : 502, body: echo(wire, { adapterError: true, code, ...extra }) };
}

/** Answer one published wire. Does not call any host except the replacement Store. */
export async function answerPublishedWire(wire: Json, origin: string): Promise<{ httpStatus: number; body: Json }> {
  if (wire.protocolVersion !== "stb-store-zero-http/1") {
    return { httpStatus: 422, body: { adapterError: true, code: "PUBLISHED_WIRE_NOT_RECOGNIZED" } };
  }
  const pinProblem = callerPinProblem(wire);
  if (pinProblem) return rejected(wire, pinProblem, { serverRelease: STORE_CANDIDATE.inspectedCommit });
  if (wire.requestType === "OFFERING_LOOKUP") {
    const payload = asObject(wire.payload) ?? {};
    const demand = { searchText: payload.searchText };
    const sent = await postStore(origin, { requestType: "OFFERING_LOOKUP", requestId: String(wire.requestId), demand });
    const read = readStoreReply(sent, demand, String(wire.requestId), "OFFERING_LOOKUP");
    if (read.outcome !== "answer") return rejected(wire, read.code, { detail: read.detail });
    const answer = read.answer;
    const rows = Array.isArray(answer.offerings) ? answer.offerings : [];
    return {
      httpStatus: 200,
      body: echo(wire, {
        storePin: read.wrapper.storeRelease,
        rawOfferings: rows,
        totalMatches: answer.totalMatches,
        truncated: answer.truncated === true,
      }),
    };
  }
  const translated = translatePublished(wire);
  if ("error" in translated) {
    return { httpStatus: 422, body: echo(wire, { adapterError: true, code: translated.error, requestType: wire.requestType, carriedNotAccepted: translated.blocked ?? [] }) };
  }
  const sent = await postStore(origin, {
    requestType: translated.storeRequestType,
    requestId: String(wire.requestId),
    demand: translated.demand,
  });
  const read = readStoreReply(sent, translated.demand, String(wire.requestId), translated.storeRequestType);
  if (read.outcome !== "answer") return rejected(wire, read.code);
  const body = pageAnswer(wire, read.wrapper, translated.carriedNotAccepted, translated.notes);
  body.mappedCallInputs = { requestType: translated.storeRequestType, demand: translated.demand };
  const answer = read.answer;
  const packages = Array.isArray(answer.packages) ? answer.packages : [];
  const items = Array.isArray(answer.items) ? answer.items : [];
  if (packages.length || items.length) {
    body.rawEvaluation = {
      ...(asObject(body.rawEvaluation) ?? {}),
      lines: [
        ...packages.map((pkg) => {
          const row = asObject(pkg) ?? {};
          return { role: row.packageId, storeSku: row.storeSku ?? null, qty: row.boards ?? null, price: { sellingPrice: asObject(row.totals)?.material ?? row.sellingPrice ?? null }, stock: { status: row.status ?? null } };
        }),
        ...items.map((item) => {
          const row = asObject(item) ?? {};
          return { role: row.lineId, storeSku: row.storeSku ?? null, qty: row.qty ?? null, price: { sellingPrice: row.sellingPrice ?? null }, stock: { status: row.status ?? null } };
        }),
      ],
    };
  }
  return { httpStatus: 200, body };
}

