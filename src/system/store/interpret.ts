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

function receiptProblems(answer: Record<string, unknown>, demand: unknown): string | null {
  const receipt = answer.evaluationReceipt as Record<string, unknown> | null | undefined;
  const discovery = answer.requestType === "OFFERING_LOOKUP" || answer.kind === "SEARCH" || answer.kind === "SKU" || answer.kind === "QUERY";
  if (discovery) {
    if (receipt) return "DISCOVERY_MUST_NOT_CARRY_A_RECEIPT";
    return null;
  }
  if (answer.freshEvaluation !== true) {
    if (receipt) return "UNEVALUATED_ANSWER_MUST_NOT_CARRY_A_RECEIPT";
    return null;
  }
  if (!receipt || typeof receipt !== "object") return "RECEIPT_REQUIRED";
  const { receiptHash, ...core } = receipt;
  if (typeof receiptHash !== "string" || calculationHash(core) !== receiptHash) return "RECEIPT_ALTERED";
  if (core.requestId !== answer.requestId || core.requestType !== answer.requestType) return "RECEIPT_ALTERED";
  if (core.demandHash !== calculationHash(demand)) return "DEMAND_HASH_MISMATCH";
  if ((core.authority as { storeRevision?: string } | undefined)?.storeRevision == null) return "RECEIPT_RELEASE_MISSING";
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
  const receipt = receiptProblems(record, args.demand);
  if (receipt) return { outcome: "protocol", code: receipt };
  return { outcome: "answer", wrapper, answer: record };
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
