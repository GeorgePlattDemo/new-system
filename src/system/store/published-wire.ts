/**
 * Speaks the published page's store wire and asks the replacement Store.
 * The page keeps its words. This file does not price anything itself.
 */

const STORE_PROTOCOL = "STORE-ZERO-REQUEST-1";
const FRESHNESS = "STB-STORE-FRESH-EVALUATION-0.1";

export type CarriedRequirement = {
  field: string;
  value: string;
  reported: "KEPT_ON_THE_JOB_NOT_A_STORE_BOARD_FIELD";
};

type Json = Record<string, unknown>;

const KEPT_OFF_THE_BOARD_SHAPE = ["endIdentity", "endRelation", "lengthDatum"] as const;

function asObject(value: unknown): Json | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Json) : null;
}

function finite(value: unknown): number | null {
  const number = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(number) ? number : null;
}

/** The published brace line, turned into the board demand the replacement Store accepts. */
export function boardDemandFromPublishedLine(line: Json): { demand: Json; carriedNotAccepted: CarriedRequirement[] } {
  const carriedNotAccepted: CarriedRequirement[] = [];
  for (const field of KEPT_OFF_THE_BOARD_SHAPE) {
    const value = line[field];
    if (value != null && String(value).length) {
      carriedNotAccepted.push({ field, value: String(value), reported: "KEPT_ON_THE_JOB_NOT_A_STORE_BOARD_FIELD" });
    }
  }
  const lengthObject = asObject(line.definedWorkpieceLength);
  const definedWorkpieceLengthIn = finite(lengthObject?.value ?? line.definedWorkpieceLengthIn);
  const parts = Array.isArray(line.parts) ? line.parts.map((part) => {
    const row = asObject(part) ?? {};
    const features = Array.isArray(row.features) ? row.features.map((feature) => {
      const spot = asObject(feature) ?? {};
      return {
        featureId: String(spot.featureId ?? ""),
        kind: String(spot.kind ?? ""),
        xIn: finite(spot.xIn),
        locationRule: spot.locationRule == null ? null : String(spot.locationRule),
        acrossWidthRule: spot.acrossWidthRule == null ? null : String(spot.acrossWidthRule),
        insetFromEdgeIn: finite(spot.insetFromEdgeIn),
      };
    }) : [];
    return { partId: String(row.partId ?? ""), lengthIn: finite(row.lengthIn), features };
  }) : [];
  const spot = asObject(line.spotDemand);
  return {
    carriedNotAccepted,
    demand: {
      title: "Start your own",
      configurationId: String(line.configurationId ?? ""),
      configurationVersion: String(line.configurationVersion ?? ""),
      classId: "user_defined_board",
      materialDemand: line.materialDemand ?? null,
      definedWorkpieceLengthIn,
      requiredOps: Array.isArray(line.requiredOps) ? line.requiredOps : [],
      sawAngleDeg: finite(line.sawAngleDeg),
      cutPlane: line.cutPlane == null ? null : String(line.cutPlane),
      datumCMethod: String(line.datumCMethod ?? ""),
      declaredSawCuts: finite(line.sawCuts),
      declaredSpotCount: finite(spot?.totalCount) ?? 0,
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

async function postStore(origin: string, body: Json): Promise<{ httpStatus: number; wrapper: Json | null }> {
  const response = await fetch(new URL("/v1/requests", origin), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const wrapper = asObject(await response.json().catch(() => null));
  return { httpStatus: response.status, wrapper };
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

function pageAnswer(wire: Json, wrapper: Json, carriedNotAccepted: CarriedRequirement[]): Json {
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
  const reasonCodes = Array.isArray(answer.reasonCodes) ? answer.reasonCodes.map(String) : [];
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
      cellFamily: [],
      supportedOps: [],
    },
    calculationIdentity: answer.calculationIdentity ?? estimate?.calculationIdentity ?? null,
    carriedNotAccepted,
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

function pick(source: Json, keys: string[]): Json {
  const out: Json = {};
  for (const key of keys) if (source[key] != null) out[key] = source[key];
  return out;
}

function spotFrom(feature: Json, index: number, partId: string): Json | null {
  const xIn = finite(feature.xIn);
  if (xIn == null) return null;
  const spot: Json = {
    featureId: String(feature.featureId || `${partId}-SPOT-${index + 1}`),
    xIn,
  };
  if (feature.acrossWidthRule != null) spot.acrossWidthRule = String(feature.acrossWidthRule);
  const inset = finite(feature.insetFromEdgeIn);
  if (inset != null) spot.insetFromEdgeIn = inset;
  return spot;
}

function partsFrom(raw: unknown): Json[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((part) => {
    const row = asObject(part) ?? {};
    const partId = String(row.partId ?? row.componentId ?? "");
    const features = Array.isArray(row.spots) ? row.spots : Array.isArray(row.features) ? row.features : [];
    const spots = features
      .map((feature, index) => spotFrom(asObject(feature) ?? {}, index, partId))
      .filter((spot): spot is Json => spot != null);
    const lengthIn = finite(row.lengthIn ?? row.finishedLengthIn);
    return { partId, ...(lengthIn != null ? { lengthIn } : {}), ...(spots.length ? { spots } : {}) };
  });
}

function itemFrom(line: Json): Json | null {
  const requirement = asObject(line.requirement);
  const qty = finite(line.qty);
  const lineId = String(line.lineId || line.requirementId || "");
  if (!lineId) return null;
  const item: Json = { lineId, ...(qty != null ? { qty } : {}) };
  if (line.storeSku != null) item.storeSku = String(line.storeSku);
  else if (line.requirementId != null && !requirement) item.requirementId = String(line.requirementId);
  else if (requirement) item.requirement = pick(requirement, ["kind", "gauge", "diameterIn", "lengthIn", "finish", "unit"]);
  return item;
}

/** Published cut-package definition, without a tile name, in the Store's cut-package contract. */
export function cutDemandFromPublishedDefinition(definition: Json): { demand: Json; carriedNotAccepted: CarriedRequirement[] } {
  const carriedNotAccepted: CarriedRequirement[] = [];
  const packages = Array.isArray(definition.cutPackages) ? definition.cutPackages : [];
  const cutPackages = packages.map((pkg) => {
    const row = asObject(pkg) ?? {};
    const material = asObject(row.material) ?? {};
    const endCut = asObject(row.endCut) ?? {};
    const finished = finite(row.finishedWidthIn);
    return {
      packageId: String(row.packageId ?? ""),
      material: pick(material, ["species", "form", "nominalT", "nominalW", "grade"]),
      endCut: { angleDeg: finite(endCut.angleDeg) ?? 0 },
      ...(finished != null ? { finishedWidthIn: finished } : {}),
      parts: partsFrom(row.parts),
    };
  });
  const itemLines = (Array.isArray(definition.itemLines) ? definition.itemLines : [])
    .map((line) => itemFrom(asObject(line) ?? {}))
    .filter((line): line is Json => line != null);
  return {
    carriedNotAccepted,
    demand: {
      ...(definition.classId != null ? { classId: String(definition.classId) } : {}),
      configurationId: String(definition.configurationId ?? ""),
      configurationVersion: String(definition.configurationVersion ?? ""),
      cutPackages,
      ...(itemLines.length ? { itemLines } : {}),
    },
  };
}

/** Alcove's published insert, expressed as the cut packages and requirement the Store already accepts. */
export function cutDemandFromAlcoveInsert(definition: Json): { demand: Json; carriedNotAccepted: CarriedRequirement[] } {
  const carriedNotAccepted: CarriedRequirement[] = [];
  const material = asObject(definition.materialDemand) ?? {};
  const programs = Array.isArray(definition.componentPrograms) ? definition.componentPrograms : [];
  const groups = new Map<string, Json>();
  for (const program of programs) {
    const row = asObject(program) ?? {};
    const features = Array.isArray(row.features) ? row.features : [];
    const mill = features.some((feature) => asObject(feature)?.kind === "MILL_LONGITUDINAL_PROFILE");
    const finished = finite(row.finishedWidthIn);
    for (const feature of features) {
      const kind = asObject(feature)?.kind;
      if (kind && kind !== "SPOT_ON_LOCATION") {
        carriedNotAccepted.push({
          field: `feature:${String(asObject(feature)?.featureId ?? kind)}`,
          value: String(kind),
          reported: "KEPT_ON_THE_JOB_NOT_A_STORE_BOARD_FIELD",
        });
      }
    }
    const key = `${String(row.requirementId ?? "PARTS")}|${mill && finished != null ? finished : "full"}`;
    const existing = groups.get(key) ?? {
      packageId: mill && finished != null ? `${String(row.requirementId ?? "PARTS")}-TO-${finished}` : String(row.requirementId ?? "PARTS"),
      material: pick(material, ["species", "form", "nominalT", "nominalW", "grade"]),
      endCut: { angleDeg: 0 },
      ...(mill && finished != null ? { finishedWidthIn: finished } : {}),
      parts: [] as Json[],
    };
    const partId = String(row.componentId ?? "");
    const spots = features
      .filter((feature) => asObject(feature)?.kind !== "MILL_LONGITUDINAL_PROFILE")
      .map((feature, index) => spotFrom(asObject(feature) ?? {}, index, partId))
      .filter((spot): spot is Json => spot != null);
    (existing.parts as Json[]).push({
      partId,
      ...(finite(row.finishedLengthIn) != null ? { lengthIn: finite(row.finishedLengthIn) } : {}),
      ...(spots.length ? { spots } : {}),
    });
    groups.set(key, existing);
  }
  const hardware = asObject(definition.hardwareDemand);
  const itemLines = hardware?.requirementId
    ? [{ lineId: String(hardware.requirementId), requirementId: String(hardware.requirementId), qty: finite(hardware.qty) ?? 1 }]
    : [];
  if (definition.spotDemand != null) {
    carriedNotAccepted.push({ field: "spotDemand", value: "present", reported: "KEPT_ON_THE_JOB_NOT_A_STORE_BOARD_FIELD" });
  }
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

const SHEET_FEATURE_FIELDS = ["featureId", "kind", "placement", "widthIn", "straightHeightIn", "riseIn", "retain", "requestedTabCount", "within", "line", "fromEnd", "distanceIn"];

/** Published sheet definition, in the Store's sheet-package contract. Species is not invented. */
export function sheetDemandFromPublishedDefinition(definition: Json): { demand: Json; carriedNotAccepted: CarriedRequirement[] } {
  const sheet = asObject(definition.sheet) ?? {};
  const carriedNotAccepted: CarriedRequirement[] = [];
  const features = (Array.isArray(definition.features) ? definition.features : []).map((feature) => pick(asObject(feature) ?? {}, SHEET_FEATURE_FIELDS));
  return {
    carriedNotAccepted,
    demand: {
      configurationId: String(definition.configurationId ?? ""),
      configurationVersion: String(definition.configurationVersion ?? ""),
      sheet: pick(sheet, ["thicknessIn", "lengthIn", "widthIn", "species", "grade"]),
      features,
      ...(definition.returnAllPieces != null ? { returnAllPieces: definition.returnAllPieces === true } : {}),
      ...(definition.exteriorRatingRequested != null ? { exteriorRatingRequested: definition.exteriorRatingRequested === true } : {}),
    },
  };
}

function translatePublished(wire: Json): { storeRequestType: string; demand: Json; carriedNotAccepted: CarriedRequirement[] } | { error: string } {
  const payload = asObject(wire.payload);
  if (wire.requestType === "USER_DEFINED_BOARD_V1") {
    const line = asObject(payload?.line);
    if (!line) return { error: "PUBLISHED_LINE_REQUIRED" };
    const translated = boardDemandFromPublishedLine(line);
    return { storeRequestType: "USER_DEFINED_BOARD_V1", ...translated };
  }
  const definition = asObject(payload?.definition);
  if (!definition) return { error: "PUBLISHED_DEFINITION_REQUIRED" };
  if (wire.requestType === "CUT_PACKAGE_V1") {
    return { storeRequestType: "CUT_PACKAGE_V1", ...cutDemandFromPublishedDefinition(definition) };
  }
  if (wire.requestType === "SHEET_PACKAGE_V1") {
    return { storeRequestType: "SHEET_PACKAGE_V1", ...sheetDemandFromPublishedDefinition(definition) };
  }
  if (wire.requestType === "ALCOVE_INSERT_V1") {
    return { storeRequestType: "CUT_PACKAGE_V1", ...cutDemandFromAlcoveInsert(definition) };
  }
  return { error: "LIVE_JOB_NOT_MIGRATED_YET" };
}

/** Answer one published wire. Does not call any host except the replacement Store. */
export async function answerPublishedWire(wire: Json, origin: string): Promise<{ httpStatus: number; body: Json }> {
  if (wire.protocolVersion !== "stb-store-zero-http/1") {
    return { httpStatus: 422, body: { adapterError: true, code: "PUBLISHED_WIRE_NOT_RECOGNIZED" } };
  }
  if (wire.requestType === "OFFERING_LOOKUP") {
    const payload = asObject(wire.payload) ?? {};
    const sent = await postStore(origin, { requestType: "OFFERING_LOOKUP", requestId: String(wire.requestId), demand: { searchText: payload.searchText } });
    const answer = asObject(sent.wrapper?.answer);
    if (!sent.wrapper || sent.wrapper.protocol !== STORE_PROTOCOL || !answer) {
      return { httpStatus: 502, body: { adapterError: true, code: "REPLACEMENT_STORE_UNAVAILABLE" } };
    }
    const rows = Array.isArray(answer.offerings) ? answer.offerings : [];
    return {
      httpStatus: 200,
      body: echo(wire, {
        storePin: sent.wrapper.storeRelease,
        rawOfferings: rows,
        totalMatches: answer.totalMatches,
        truncated: answer.truncated === true,
      }),
    };
  }
  const translated = translatePublished(wire);
  if ("error" in translated) {
    return { httpStatus: 422, body: echo(wire, { adapterError: true, code: translated.error, requestType: wire.requestType }) };
  }
  const sent = await postStore(origin, {
    requestType: translated.storeRequestType,
    requestId: String(wire.requestId),
    demand: translated.demand,
  });
  const answer = asObject(sent.wrapper?.answer);
  if (!sent.wrapper || sent.wrapper.protocol !== STORE_PROTOCOL || !answer) {
    return { httpStatus: 502, body: { adapterError: true, code: "REPLACEMENT_STORE_UNAVAILABLE" } };
  }
  const body = pageAnswer(wire, sent.wrapper, translated.carriedNotAccepted);
  body.mappedCallInputs = { requestType: translated.storeRequestType, demand: translated.demand };
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

