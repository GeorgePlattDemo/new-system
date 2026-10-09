import { PACKET_SCHEMA } from "./store-candidate.ts";
import { createId } from "./ids.ts";
import { validUtcTimestamp } from "./store/interpret.ts";
import type { SystemRequirements } from "./recipe.ts";

export type Decision = {
  decisionId: string;
  kind: "ACCEPTED";
  revisionId: string;
  requestId: string;
  receiptHash: string;
  offerId: string;
  decidedAt: string;
  evidenceClass: "SIMULATED";
};

export type AcceptedPacket = {
  schema: typeof PACKET_SCHEMA;
  packetId: string;
  project: { projectId: string; classId: string; title: string };
  definition: {
    definitionId: string;
    revisionId: string;
    requestType: string;
    demand: Record<string, unknown>;
    requirements: { endRelation: string; lengthDatum: string; endIdentity?: string };
  };
  storeAnswer: Record<string, unknown>;
  decision: {
    decisionId: string;
    kind: "ACCEPTED";
    offerId: string;
    decidedAt: string;
    evidenceClass: "SIMULATED";
  };
  authority: { physicalRelease: false; evidenceClass: "SIMULATED" };
};

/** Facts the machine packet may carry. The explanation stays on the revision. A supplied end identity is not stripped. */
export function wireRequirements(requirements: SystemRequirements): { endRelation: string; lengthDatum: string; endIdentity?: string } {
  const wire: { endRelation: string; lengthDatum: string; endIdentity?: string } = {
    endRelation: requirements.endRelation,
    lengthDatum: requirements.lengthDatum,
  };
  if (typeof requirements.endIdentity === "string" && requirements.endIdentity.trim()) wire.endIdentity = requirements.endIdentity;
  return wire;
}

export function acceptOffer(args: {
  decisions: Decision[];
  projectId: string;
  classId: string;
  title: string;
  definitionId: string;
  revisionId: string;
  requestType: string;
  demand: Record<string, unknown>;
  requirements: SystemRequirements;
  answer: Record<string, unknown>;
  now?: string;
}): { ok: true; decision: Decision; packet: AcceptedPacket; duplicate: boolean } | { ok: false; code: string } {
  if (args.answer.status !== "SUPPORTABLE" || args.answer.freshEvaluation !== true) return { ok: false, code: "ACCEPT_REQUIRES_FRESH_SUPPORTABLE" };
  if (args.answer.requestType === "OFFERING_LOOKUP") return { ok: false, code: "DISCOVERY_IS_NOT_AN_OFFER" };
  const receipt = args.answer.evaluationReceipt as { receiptHash?: string; requestId?: string; evaluatedAt?: string; status?: string } | undefined;
  if (!receipt?.receiptHash || receipt.requestId !== args.answer.requestId || receipt.status !== "SUPPORTABLE") return { ok: false, code: "ACCEPT_REQUIRES_RECEIPT" };
  const decidedAt = args.now ?? new Date().toISOString();
  if (!validUtcTimestamp(receipt.evaluatedAt) || !validUtcTimestamp(decidedAt)) return { ok: false, code: "ACCEPT_TIME_INVALID" };
  if (Date.parse(decidedAt) < Date.parse(receipt.evaluatedAt)) return { ok: false, code: "ACCEPT_BEFORE_ANSWER" };
  const existing = args.decisions.find(
    (decision) => decision.kind === "ACCEPTED" && decision.revisionId === args.revisionId && decision.receiptHash === receipt.receiptHash,
  );
  if (existing) {
    return {
      ok: true,
      duplicate: true,
      decision: existing,
      packet: {
        schema: PACKET_SCHEMA,
        packetId: `existing-for-${existing.decisionId}`,
        project: { projectId: args.projectId, classId: args.classId, title: args.title },
        definition: {
          definitionId: args.definitionId,
          revisionId: args.revisionId,
          requestType: args.requestType,
          demand: args.demand,
          requirements: wireRequirements(args.requirements),
        },
        storeAnswer: args.answer,
        decision: {
          decisionId: existing.decisionId,
          kind: "ACCEPTED",
          offerId: existing.offerId,
          decidedAt: existing.decidedAt,
          evidenceClass: "SIMULATED",
        },
        authority: { physicalRelease: false, evidenceClass: "SIMULATED" },
      },
    };
  }
  const decision: Decision = {
    decisionId: createId("decision"),
    kind: "ACCEPTED",
    revisionId: args.revisionId,
    requestId: String(args.answer.requestId),
    receiptHash: receipt.receiptHash,
    offerId: createId("offer"),
    decidedAt,
    evidenceClass: "SIMULATED",
  };
  const packet: AcceptedPacket = {
    schema: PACKET_SCHEMA,
    packetId: createId("packet"),
    project: { projectId: args.projectId, classId: args.classId || args.requestType, title: args.title },
    definition: {
      definitionId: args.definitionId,
      revisionId: args.revisionId,
      requestType: args.requestType,
      demand: args.demand,
      requirements: wireRequirements(args.requirements),
    },
    storeAnswer: args.answer,
    decision: {
      decisionId: decision.decisionId,
      kind: "ACCEPTED",
      offerId: decision.offerId,
      decidedAt: decision.decidedAt,
      evidenceClass: "SIMULATED",
    },
    authority: { physicalRelease: false, evidenceClass: "SIMULATED" },
  };
  return { ok: true, duplicate: false, decision, packet };
}
