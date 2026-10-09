import { calculationHash, sha256Bytes } from "../hash.ts";
import { STORE_CANDIDATE } from "../store-candidate.ts";

export type StoreRequest = {
  requestType: string;
  requestId: string;
  demand: Record<string, unknown>;
};

export function serializeRequest(request: StoreRequest): { body: string; digest: string } {
  const body = JSON.stringify(request);
  return { body, digest: sha256Bytes(body) };
}

export type Interpreted =
  | { outcome: "answer"; wrapper: Record<string, unknown>; answer: Record<string, unknown> }
  | { outcome: "transport" | "protocol"; code: string; detail?: string };

const FRESHNESS_RULE = "STB-STORE-FRESH-EVALUATION-0.1";
const RECEIPT_FIELDS = ["freshnessRule", "requestType", "requestId", "evaluatedAt", "authority", "demandHash", "status", "calculationIdentity", "receiptHash"];

/** A real UTC instant. Impossible dates and bare strings are not timestamps. */
export function validUtcTimestamp(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)) return false;
  const time = Date.parse(value);
  if (!Number.isFinite(time)) return false;
  const normalized = value.includes(".") ? value : value.replace(/Z$/, ".000Z");
  return new Date(time).toISOString() === normalized;
}

function receiptProblems(answer: Record<string, unknown>, demand: unknown, expectedRelease: string): string | null {
  const receipt = answer.evaluationReceipt as Record<string, unknown> | null | undefined;
  const discovery = answer.requestType === "OFFERING_LOOKUP" || answer.kind === "SEARCH" || answer.kind === "SKU" || answer.kind === "QUERY";
  if (discovery) {
    if (receipt) return "DISCOVERY_MUST_NOT_CARRY_A_RECEIPT";
    return null;
  }
  // A priced status is a quotation. It cannot pass as a receipt-free pre-evaluation.
  const quoted = answer.status === "SUPPORTABLE" || answer.status === "NOT_ALL_LINES_SUPPORTABLE";
  if (quoted && answer.freshEvaluation !== true) return "QUOTE_REQUIRES_FRESH_EVALUATION";
  if (answer.freshEvaluation !== true) {
    if (receipt) return "UNEVALUATED_ANSWER_MUST_NOT_CARRY_A_RECEIPT";
    return null;
  }
  if (!receipt || typeof receipt !== "object" || Array.isArray(receipt)) return "RECEIPT_REQUIRED";
  const keys = Object.keys(receipt);
  if (keys.some((key) => !RECEIPT_FIELDS.includes(key)) || RECEIPT_FIELDS.some((key) => !Object.hasOwn(receipt, key))) return "RECEIPT_FIELDS";
  const { receiptHash, ...core } = receipt;
  if (typeof receiptHash !== "string" || calculationHash(core) !== receiptHash) return "RECEIPT_ALTERED";
  if (core.requestId !== answer.requestId || core.requestType !== answer.requestType) return "RECEIPT_ALTERED";
  if (core.freshnessRule !== FRESHNESS_RULE) return "RECEIPT_FRESHNESS_RULE";
  if (core.status !== answer.status) return "RECEIPT_STATUS_CONTRADICTION";
  if (!validUtcTimestamp(core.evaluatedAt)) return "RECEIPT_TIME_INVALID";
  if (core.demandHash !== calculationHash(demand)) return "DEMAND_HASH_MISMATCH";
  const authority = core.authority;
  if (!authority || typeof authority !== "object" || Array.isArray(authority)) return "RECEIPT_AUTHORITY";
  const revision = (authority as { storeRevision?: unknown }).storeRevision;
  const catalogHash = (authority as { catalogHash?: unknown }).catalogHash;
  if (typeof revision !== "string" || !revision.trim()) return "RECEIPT_RELEASE_MISSING";
  if (revision !== expectedRelease) return "RECEIPT_RELEASE_MISMATCH";
  if (typeof catalogHash !== "string" || !/^[0-9a-f]{64}$/.test(catalogHash)) return "RECEIPT_AUTHORITY";
  if (calculationHash(answer.calculationIdentity ?? null) !== calculationHash(core.calculationIdentity ?? null)) return "RECEIPT_CALCULATION_IDENTITY";
  return null;
}

/**
 * Reads one Store HTTP result. A non-2xx response, bad JSON, wrong release,
 * or a digest that is not the bytes we sent is never turned into REFUSED or Q = 0.
 */
export function interpretStoreHttp(args: {
  sentBody: string;
  sentDigest: string;
  requestType: string;
  requestId: string;
  demand: unknown;
  httpStatus: number;
  responseText: string;
  expectedRelease?: string;
}): Interpreted {
  const expected = args.expectedRelease ?? STORE_CANDIDATE.inspectedCommit;
  if (args.httpStatus === 0) return { outcome: "transport", code: "STORE_UNREACHABLE" };
  if (args.httpStatus !== 200) return { outcome: "transport", code: `HTTP_${args.httpStatus}`, detail: args.responseText.slice(0, 500) };
  let wrapper: Record<string, unknown>;
  try {
    wrapper = JSON.parse(args.responseText) as Record<string, unknown>;
  } catch {
    return { outcome: "transport", code: "RESPONSE_NOT_JSON" };
  }
  if (wrapper.protocol !== STORE_CANDIDATE.protocol) return { outcome: "protocol", code: "PROTOCOL_MISMATCH", detail: String(wrapper.protocol) };
  if (wrapper.storeRelease !== expected) return { outcome: "protocol", code: "WRONG_RELEASE", detail: String(wrapper.storeRelease) };
  if (wrapper.payloadDigest !== args.sentDigest || sha256Bytes(args.sentBody) !== args.sentDigest) {
    return { outcome: "protocol", code: "DIGEST_MISMATCH" };
  }
  const answer = wrapper.answer;
  if (!answer || typeof answer !== "object" || Array.isArray(answer)) return { outcome: "protocol", code: "ANSWER_MISSING" };
  const record = answer as Record<string, unknown>;
  if (record.requestType !== args.requestType || record.requestId !== args.requestId) return { outcome: "protocol", code: "ANSWER_IDENTITY_MISMATCH" };
  const receipt = receiptProblems(record, args.demand, expected);
  if (receipt) return { outcome: "protocol", code: receipt };
  return { outcome: "answer", wrapper, answer: record };
}

/**
 * Reads one machine-evidence HTTP result. Success is only VIRTUAL_EVIDENCE_READY
 * with physical authority false and admission blocked. A refusal is an answer.
 * A claim of physical authority is not success.
 */
export function interpretMachineEvidence(args: {
  sentBody: string;
  sentDigest: string;
  httpStatus: number;
  responseText: string;
  expectedRelease?: string;
  expectedPacketId?: string;
}): Interpreted {
  const expected = args.expectedRelease ?? STORE_CANDIDATE.inspectedCommit;
  if (args.httpStatus === 0) return { outcome: "transport", code: "STORE_UNREACHABLE" };
  if (args.httpStatus !== 200) return { outcome: "transport", code: `HTTP_${args.httpStatus}`, detail: args.responseText.slice(0, 500) };
  let sent: Record<string, unknown>;
  try {
    sent = JSON.parse(args.sentBody) as Record<string, unknown>;
  } catch {
    return { outcome: "protocol", code: "EVIDENCE_REQUEST_NOT_JSON" };
  }
  const sentKeys = Object.keys(sent);
  if (sentKeys.length !== 3 || sent.packet == null || typeof sent.expectedMachineConfigId !== "string" || typeof sent.expectedMachineConfigHash !== "string") {
    return { outcome: "protocol", code: "EVIDENCE_REQUEST_SHAPE" };
  }
  if (args.expectedPacketId && (!sent.packet || typeof sent.packet !== "object" || (sent.packet as { packetId?: unknown }).packetId !== args.expectedPacketId)) {
    return { outcome: "protocol", code: "EVIDENCE_PACKET_MISMATCH" };
  }
  let wrapper: Record<string, unknown>;
  try {
    wrapper = JSON.parse(args.responseText) as Record<string, unknown>;
  } catch {
    return { outcome: "transport", code: "RESPONSE_NOT_JSON" };
  }
  if (wrapper.protocol !== STORE_CANDIDATE.machineEvidenceProtocol) return { outcome: "protocol", code: "PROTOCOL_MISMATCH", detail: String(wrapper.protocol) };
  if (wrapper.storeRelease !== expected) return { outcome: "protocol", code: "WRONG_RELEASE", detail: String(wrapper.storeRelease) };
  if (wrapper.payloadDigest !== args.sentDigest || sha256Bytes(args.sentBody) !== args.sentDigest) return { outcome: "protocol", code: "DIGEST_MISMATCH" };
  const answer = wrapper.answer;
  if (!answer || typeof answer !== "object" || Array.isArray(answer)) return { outcome: "protocol", code: "ANSWER_MISSING" };
  const record = answer as Record<string, unknown>;
  if (record.physicalAuthority !== false) return { outcome: "protocol", code: "PHYSICAL_AUTHORITY_CLAIMED" };
  if (record.status === "VIRTUAL_EVIDENCE_READY") {
    const admission = record.admission as { status?: unknown; physicalAuthority?: unknown; motionCommands?: unknown } | undefined;
    if (!admission || admission.status !== "BLOCKED" || admission.physicalAuthority !== false || admission.motionCommands !== 0) {
      return { outcome: "protocol", code: "PHYSICAL_ADMISSION_NOT_BLOCKED" };
    }
    if (record.localJob == null || record.records == null || record.run == null) return { outcome: "protocol", code: "EVIDENCE_RECORDS_MISSING" };
    return { outcome: "answer", wrapper, answer: record };
  }
  if (record.status === "REFUSED" || record.status === "STALE") {
    if (record.localJob != null || record.records != null || record.run != null) return { outcome: "protocol", code: "REFUSED_EVIDENCE_CARRIES_ARTIFACTS" };
    return { outcome: "answer", wrapper, answer: record };
  }
  return { outcome: "protocol", code: "EVIDENCE_STATUS_UNKNOWN", detail: String(record.status) };
}

export type MoneyView =
  | { kind: "none"; status: string }
  | { kind: "discovery" }
  | { kind: "full"; amount: number | null; label: string }
  | { kind: "partial"; amount: number | null; label: string };

/** Reads money the Store already returned. Does not add, invent, or call a missing total zero. */
export function presentMoney(answer: Record<string, unknown> | null): MoneyView {
  if (!answer) return { kind: "none", status: "NO_ANSWER" };
  if (answer.requestType === "OFFERING_LOOKUP" || answer.kind === "SEARCH" || answer.kind === "SKU" || answer.kind === "QUERY") {
    return { kind: "discovery" };
  }
  const status = String(answer.status ?? "");
  if (status === "NOT_ALL_LINES_SUPPORTABLE") {
    const totals = answer.totals as { sumOfSupportableLines?: number } | undefined;
    return {
      kind: "partial",
      amount: typeof totals?.sumOfSupportableLines === "number" ? totals.sumOfSupportableLines : null,
      label: "Partial sum of supportable lines only. Not a full job Q.",
    };
  }
  if (status !== "SUPPORTABLE") return { kind: "none", status };
  const estimate = answer.estimate as { totals?: { Q?: number } } | undefined;
  const totals = answer.totals as { Q?: number; sumOfSupportableLines?: number } | undefined;
  const amount =
    typeof estimate?.totals?.Q === "number"
      ? estimate.totals.Q
      : typeof totals?.Q === "number"
        ? totals.Q
        : typeof answer.Q === "number"
          ? (answer.Q as number)
          : typeof totals?.sumOfSupportableLines === "number"
            ? totals.sumOfSupportableLines
            : null;
  return { kind: "full", amount, label: "Budgetary total from this Store answer. Not a quote." };
}
