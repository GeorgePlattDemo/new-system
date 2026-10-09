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
  const quoteComplete = answer.status === "SUPPORTABLE" && estimate?.complete === true && receipt?.freshnessRule === FRESHNESS;
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
    rawEstimate: estimate,
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
  if (wire.requestType !== "USER_DEFINED_BOARD_V1") {
    return {
      httpStatus: 422,
      body: echo(wire, { adapterError: true, code: "LIVE_JOB_NOT_MIGRATED_YET", requestType: wire.requestType }),
    };
  }
  const payload = asObject(wire.payload);
  const line = asObject(payload?.line);
  if (!line) return { httpStatus: 422, body: { adapterError: true, code: "PUBLISHED_LINE_REQUIRED" } };
  const translated = boardDemandFromPublishedLine(line);
  const sent = await postStore(origin, {
    requestType: "USER_DEFINED_BOARD_V1",
    requestId: String(wire.requestId),
    demand: translated.demand,
  });
  const answer = asObject(sent.wrapper?.answer);
  if (!sent.wrapper || sent.wrapper.protocol !== STORE_PROTOCOL || !answer) {
    return { httpStatus: 502, body: { adapterError: true, code: "REPLACEMENT_STORE_UNAVAILABLE" } };
  }
  return { httpStatus: 200, body: pageAnswer(wire, sent.wrapper, translated.carriedNotAccepted) };
}
