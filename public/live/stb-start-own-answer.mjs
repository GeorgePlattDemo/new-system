/**
 * Project 1 bench view of a Store answer.
 * System defines the brace. Store selects the board and Q. This file prices nothing.
 *
 * benchAnswer() is the one reading of "has the Store answered this revision, and what did it say". Every
 * Store-dependent field on the bench, the Confirm gate and the trail's "within the envelope" decision read it.
 * It has no side effects and holds no state: the inquiry record it reads is the page's startOwnLive, and the
 * revision match is the tile-host contract's isCurrentAnswer(), passed in, not re-implemented here.
 */

/** One status per bench render. */
export const BENCH_STATUS = Object.freeze({
  NOT_ADMITTED: "NOT_ADMITTED",
  NOT_ASKED: "NOT_ASKED",
  ASKING: "ASKING",
  FAILED: "FAILED",
  REFUSED: "REFUSED",
  UNRESOLVED: "UNRESOLVED",
  INVALID: "INVALID",
  BUDGETARY: "BUDGETARY",
  CONFIRMED: "CONFIRMED",
});

/**
 * Plain words for the Store reasons this job can meet. The code itself stays in the evidence.
 * @type {Readonly<Record<string, string>>}
 */
const REASON_WORDS = Object.freeze({
  LAST_REMAIN_BELOW_TWO_ROLLER_CONTROL:
    "after the last cut, the board left behind would be too short for the machine's two holding rollers to keep control of it",
  NO_COMPLETE_DIMENSIONAL_CANDIDATE: "no board the Store offers can carry this whole job",
  GRADE_CHOICE_REQUIRED: "this wood comes in more than one grade, and the job does not name one",
  MATERIAL_CHOICE_REQUIRED: "the job does not name a wood the Store can match",
  NO_MATCHING_BOARD_OFFERING: "the Store does not offer this wood in this size",
  MATCHING_BOARD_NOT_AVAILABLE: "the Store's matching boards are not on hand",
  ON_HAND_SHORT: "the Store does not have enough of that board on hand",
  NOT_ON_HAND: "that board is not on hand",
});

/** @param {string} code */
export function reasonWords(code) {
  const text = String(code || "");
  const known = REASON_WORDS[text];
  if (known) return known;
  if (text.startsWith("OP_NOT_ON_OFFERING:")) return `the Store does not offer the ${text.slice("OP_NOT_ON_OFFERING:".length)} operation on this board`;
  return "";
}

/**
 * @param {string} label
 */
export function isChangeWoodTool(label) {
  return /change\s*wood|species/i.test(String(label || ""));
}

/**
 * @typedef {Record<string, any>} Json
 * @typedef {{ definitionRevisionId: string, code: string }} InquiryFailure
 * @typedef {{ admission: Json | null, answer: Json | null, asking: boolean, askedRevisionId: string | null, failure: InquiryFailure | null }} Inquiry
 * @typedef {{ partId: string, lengthIn: number, features?: { featureId: string, xIn: number }[] }} DefinedPart
 * @typedef {{ storeSku: string | null, stockLengthIn: number | null, candidateStatus: string | null, reason: string | null }} Candidate
 * @typedef {{ sku: string, stockLengthIn: number, requestedMinimumIn: number, selectionPolicy: string | null, unitPrice: number | null, candidates: Candidate[] }} Selection
 * @typedef {{ material: number, hardware: number | null, machineService: number, q: number, qBasis: string | null, engine: string | null, economicsId: string | null, documentKind: string | null, status: string | null, completeness: string | null }} Economics
 * @typedef {{ modeledMinutes: number | null, cycleModel: string | null, derivedSawCuts: number | null, derivedSpotCount: number | null, finalRemainderIn: number | null }} Work
 * @typedef {{ envelope: string | null, cellFamily: string[] | null, supportedOps: string[] | null, jobSupportability: string | null, physicalRelease: boolean | null, catalogPin: string | null, catalogClock: string | null }} Capability
 * @typedef {{ requestId: string | null, definitionRevisionId: string | null, storePin: string | null, inputHash: string | null, resultHash: string | null, receiptHash: string | null, evaluatedAt: string | null }} Identity
 * @typedef {{
 *   status: string,
 *   current: boolean,
 *   quote: boolean,
 *   confirmed: boolean,
 *   reasons: string[],
 *   blocking: { title: string, owner: string }[],
 *   failureCode: string | null,
 *   identity: Identity | null,
 *   selection: Selection | null,
 *   economics: Economics | null,
 *   work: Work | null,
 *   capability: Capability | null,
 *   offeredGrades: string[],
 *   refusedCandidates: Candidate[],
 *   swap: { visible: boolean, html: string },
 * }} BenchAnswer
 */

/**
 * The bench's one reading of the Store for one definition revision.
 *
 * @param {{
 *   revisionId: string | null,
 *   requestedMinimumIn: number,
 *   parts: DefinedPart[],
 *   inquiry: Inquiry,
 *   isCurrentAnswer: (input: { admission: Json | null, answer: Json | null }) => boolean,
 *   confirmedRequestId?: string | null,
 * }} input
 * @returns {BenchAnswer}
 */
export function benchAnswer({ revisionId, requestedMinimumIn, parts, inquiry, isCurrentAnswer, confirmedRequestId = null }) {
  const admission = inquiry.admission;
  const forThisRevision = revisionId != null && admission?.definitionRevisionId === revisionId;
  if (forThisRevision && admission?.admission?.result === "BLOCKED") {
    const blocking = (admission.admission.blocking || []).map((/** @type {Json} */ row) => ({ title: String(row.title || row.factId || ""), owner: String(row.owner || "") }));
    return empty(BENCH_STATUS.NOT_ADMITTED, { blocking });
  }
  if (inquiry.asking && revisionId != null && inquiry.askedRevisionId === revisionId) return empty(BENCH_STATUS.ASKING);
  const answer = inquiry.answer;
  if (forThisRevision && answer && answer.definitionRevisionId === revisionId && isCurrentAnswer({ admission, answer })) {
    return readAnswer(answer, { requestedMinimumIn, parts, confirmedRequestId });
  }
  if (inquiry.failure && inquiry.failure.definitionRevisionId === revisionId) {
    return empty(BENCH_STATUS.FAILED, { failureCode: inquiry.failure.code });
  }
  return empty(BENCH_STATUS.NOT_ASKED);
}

/**
 * Is this Store answer a complete budgetary answer for the job it was asked about? The one gate the bench,
 * Confirm and the trail use. It checks the Store's own statements and their arithmetic; it computes no price.
 *
 * @param {Json | null | undefined} answer
 * @param {{ requestedMinimumIn: number, parts: DefinedPart[] }} job
 * @returns {string[]} the conditions that keep it from being one; empty when it is one.
 */
export function budgetaryGaps(answer, { requestedMinimumIn, parts }) {
  /** @type {string[]} */
  const gaps = [];
  const evaluation = answer?.rawEvaluation || null;
  const estimate = answer?.rawEstimate || null;
  const receipt = answer?.evaluationReceipt || evaluation?.evaluationReceipt || null;
  const resolution = answer?.materialResolution || {};
  if (evaluation?.status !== "SUPPORTABLE") gaps.push(`STORE_STATUS_${evaluation?.status || "MISSING"}`);
  if (evaluation?.freshEvaluation !== true || receipt?.requestId == null || receipt.requestId !== answer?.requestId
      || receipt?.authority?.storeRevision == null || receipt.authority.storeRevision !== answer?.storePin) {
    gaps.push("STORE_RECEIPT_DOES_NOT_MATCH_THIS_REQUEST");
  }
  if (estimate?.complete !== true || answer?.priceCompleteness?.status !== "COMPLETE_FOR_TRAVEL_STANDARD"
      || answer?.priceCompleteness?.scope !== "QUOTE_ONLY") {
    gaps.push("STORE_ECONOMICS_INCOMPLETE");
  }
  const job = answer?.jobSupportability?.status;
  if (job !== "NOT_FULLY_SUPPORTABLE" && job !== "REQUIREMENTS_SATISFIED") gaps.push("JOB_SUPPORTABILITY_NOT_STATED");
  if (answer?.machineAdmission?.physicalRelease !== false) gaps.push("PHYSICAL_RELEASE_NOT_BLOCKED");
  if (!reconciles(estimate?.totals)) gaps.push("STORE_TOTALS_DO_NOT_RECONCILE");
  const stock = numberOrNull(resolution.workpieceLengthIn);
  if (!text(resolution.storeSku) || stock == null) gaps.push("STORE_SELECTION_MISSING");
  if (numberOrNull(resolution.requestedMinimumWorkpieceLengthIn) !== requestedMinimumIn) gaps.push("STORE_REQUESTED_MINIMUM_MISMATCH");
  if (stock != null && stock < requestedMinimumIn) gaps.push("STORE_SELECTION_BELOW_REQUESTED_MINIMUM");
  if (!featuresEchoed(estimate?.travel?.parts, parts)) gaps.push("STORE_FEATURES_DO_NOT_MATCH_DEFINITION");
  return gaps;
}

/**
 * The Store's Q must equal the Store's own listed cost components, to the cent. Each listed component must be a
 * number; a missing component is not zero, and a total with no components is not a total.
 *
 * @param {Json | null | undefined} totals
 */
export function reconciles(totals) {
  if (!totals || typeof totals !== "object") return false;
  const q = numberOrNull(totals.Q);
  const material = numberOrNull(totals.material);
  const machineService = numberOrNull(totals.machine_service);
  if (q == null || material == null || machineService == null) return false;
  let cents = cent(material) + cent(machineService);
  if (totals.hardware != null) {
    const hardware = numberOrNull(totals.hardware);
    if (hardware == null) return false;
    cents += cent(hardware);
  }
  return cents === cent(q);
}

/**
 * @param {Json} answer
 * @param {{ requestedMinimumIn: number, parts: DefinedPart[], confirmedRequestId: string | null }} job
 * @returns {BenchAnswer}
 */
function readAnswer(answer, { requestedMinimumIn, parts, confirmedRequestId }) {
  const evaluation = answer.rawEvaluation || {};
  const estimate = answer.rawEstimate || {};
  const resolution = answer.materialResolution || {};
  const offering = answer.rawOffering || {};
  const receipt = answer.evaluationReceipt || evaluation.evaluationReceipt || null;
  /** @type {Candidate[]} */
  const candidates = Array.isArray(resolution.consideredCandidates)
    ? resolution.consideredCandidates.map((/** @type {Json} */ row) => ({
        storeSku: text(row?.storeSku),
        stockLengthIn: numberOrNull(row?.stockLengthIn),
        candidateStatus: text(row?.candidateStatus),
        reason: text(row?.reason),
      }))
    : [];
  const refusedCandidates = candidates.filter((row) => row.candidateStatus === "REFUSED");
  /** @type {Identity} */
  const identity = {
    requestId: text(answer.requestId),
    definitionRevisionId: text(answer.definitionRevisionId),
    storePin: text(answer.storePin),
    inputHash: text(answer.calculationIdentity?.inputHash),
    resultHash: text(answer.calculationIdentity?.resultHash),
    receiptHash: text(receipt?.receiptHash),
    evaluatedAt: text(receipt?.evaluatedAt),
  };
  const storeReasons = unique([
    ...(answer.priceCompleteness?.refusalConditions || []),
    ...(answer.priceCompleteness?.unresolvedConditions || []),
    ...(evaluation.reasonCodes || []),
    resolution.reason,
    ...refusedCandidates.map((row) => row.reason),
  ]);
  const offeredGrades = Array.isArray(resolution.offeredGrades) ? resolution.offeredGrades.map(String) : [];
  const base = { current: true, identity, offeredGrades, refusedCandidates };

  if (evaluation.status === "REFUSED") return { ...empty(BENCH_STATUS.REFUSED), ...base, reasons: storeReasons };
  if (evaluation.status !== "SUPPORTABLE") {
    return { ...empty(BENCH_STATUS.UNRESOLVED), ...base, reasons: storeReasons.length ? storeReasons : [String(evaluation.status || "STORE_STATUS_MISSING")] };
  }

  const gaps = budgetaryGaps(answer, { requestedMinimumIn, parts });
  if (gaps.length) return { ...empty(BENCH_STATUS.INVALID), ...base, reasons: gaps };

  const totals = estimate.totals;
  /** @type {Selection} */
  const selection = {
    sku: String(resolution.storeSku),
    stockLengthIn: Number(resolution.workpieceLengthIn),
    requestedMinimumIn,
    selectionPolicy: text(resolution.selectionPolicy),
    unitPrice: numberOrNull(resolution.unitPrice),
    candidates,
  };
  /** @type {Economics} */
  const economics = {
    material: Number(totals.material),
    hardware: totals.hardware == null ? null : Number(totals.hardware),
    machineService: Number(totals.machine_service),
    q: Number(totals.Q),
    qBasis: text(totals.Q_basis),
    engine: estimate.engine?.id ? `${estimate.engine.id} · v${estimate.engine.version}` : null,
    economicsId: text(estimate.economics?.id),
    documentKind: text(estimate.engine?.documentKind),
    status: text(estimate.status),
    completeness: text(answer.priceCompleteness?.status),
  };
  /** @type {Work} */
  const work = {
    modeledMinutes: numberOrNull(estimate.cycle?.T_job_min),
    cycleModel: estimate.cycle?.model ? `${estimate.cycle.model} · v${estimate.cycle.version}` : null,
    derivedSawCuts: numberOrNull(estimate.travel?.derivedSawCuts),
    derivedSpotCount: numberOrNull(estimate.travel?.derivedSpotCount),
    finalRemainderIn: numberOrNull(estimate.travel?.finalRemainderIn),
  };
  /** @type {Capability} */
  const capability = {
    envelope: text(receipt?.authority?.machineEnvelope?.id),
    cellFamily: Array.isArray(offering.cellFamily) ? offering.cellFamily.map(String) : null,
    supportedOps: Array.isArray(offering.supportedOps) ? offering.supportedOps.map(String) : null,
    jobSupportability: text(answer.jobSupportability?.status),
    physicalRelease: answer.machineAdmission?.physicalRelease === false ? false : null,
    catalogPin: text(resolution.source?.pin),
    catalogClock: text(resolution.source?.clock),
  };
  const confirmed = confirmedRequestId != null && confirmedRequestId === identity.requestId;
  return {
    ...empty(confirmed ? BENCH_STATUS.CONFIRMED : BENCH_STATUS.BUDGETARY),
    ...base,
    quote: true,
    confirmed,
    selection,
    economics,
    work,
    capability,
    swap: longerBoardFrame({ parts, selection, work }),
  };
}

/**
 * "The Store grabbed a longer board." Shown only for a complete answer whose selected board is longer than the
 * requested minimum, and only from what the Store said about the boards it considered.
 *
 * @param {{ parts: DefinedPart[], selection: Selection, work: Work }} input
 */
function longerBoardFrame({ parts, selection, work }) {
  if (!(selection.stockLengthIn > selection.requestedMinimumIn)) return { visible: false, html: "" };
  const minimum = selection.requestedMinimumIn;
  const finished = parts.length ? parts[0].lengthIn : null;
  const shorter = selection.candidates.filter((row) => row.stockLengthIn != null && row.stockLengthIn < selection.stockLengthIn);
  const atMinimum = shorter.find((row) => row.stockLengthIn === minimum) || null;
  const picked = `${boardWords(selection.stockLengthIn)} (${escapeHtml(selection.sku)})`;
  let why;
  if (atMinimum && atMinimum.candidateStatus === "REFUSED") {
    const words = reasonWords(atMinimum.reason || "");
    why = `The Store considered its ${boardWords(minimum)} (${escapeHtml(atMinimum.storeSku || "")}) and refused it`
      + (words ? `: ${escapeHtml(words)}` : "")
      + `. It moved up to the ${picked}.`;
  } else if (shorter.length) {
    why = `The Store's answer names no ${inches(minimum)} board for this job. The shortest board it could use is the ${picked}.`;
  } else {
    why = `The Store's answer lists no board shorter than the ${picked} for this job.`;
  }
  const lead = finished != null ? `At ${inches(finished)} a brace, the job still asks for at least ${inches(minimum)} of board. ` : "";
  const extra = work.finalRemainderIn != null ? ` The extra comes back with your stub: ${inches(work.finalRemainderIn)}.` : "";
  const evidence = shorter
    .filter((row) => row.candidateStatus === "REFUSED")
    .map((row) => `${escapeHtml(row.storeSku || "")} · ${row.stockLengthIn} in · REFUSED · ${escapeHtml(row.reason || "no reason given")}`);
  return {
    visible: true,
    html: `<b>The Store grabbed a longer board.</b> ${lead}${why}${extra}`
      + (evidence.length ? ` <small>Store evidence: ${evidence.join("; ")}.</small>` : ""),
  };
}

/**
 * @param {string} status
 * @param {Partial<BenchAnswer>} [extra]
 * @returns {BenchAnswer}
 */
function empty(status, extra = {}) {
  return {
    status,
    current: false,
    quote: false,
    confirmed: false,
    reasons: [],
    blocking: [],
    failureCode: null,
    identity: null,
    selection: null,
    economics: null,
    work: null,
    capability: null,
    offeredGrades: [],
    refusedCandidates: [],
    swap: { visible: false, html: "" },
    ...extra,
  };
}

/**
 * The Store's echoed parts must carry the definition's parts, lengths and feature coordinates unchanged.
 *
 * @param {unknown} echoed
 * @param {DefinedPart[]} parts
 */
function featuresEchoed(echoed, parts) {
  if (!Array.isArray(echoed) || echoed.length !== parts.length) return false;
  return parts.every((part, index) => {
    const row = echoed[index];
    if (!row || row.partId !== part.partId || numberOrNull(row.lengthIn) !== part.lengthIn) return false;
    const want = part.features || [];
    const got = Array.isArray(row.features) ? row.features : [];
    return got.length === want.length && want.every((feature, at) =>
      got[at]?.featureId === feature.featureId && numberOrNull(got[at]?.xIn) === feature.xIn);
  });
}

/** @param {number} value */
function cent(value) {
  return Math.round(value * 100);
}

/** @param {unknown[]} values */
function unique(values) {
  return [...new Set(values.filter((value) => typeof value === "string" && value.length > 0).map(String))];
}

/** @param {unknown} value */
function text(value) {
  return typeof value === "string" && value.length ? value : null;
}

/**
 * @param {unknown} value
 */
function numberOrNull(value) {
  if (value == null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

/** @param {number} value */
export function inches(value) {
  const eighths = Math.round(value * 8);
  const whole = Math.trunc(eighths / 8);
  const fraction = ["", "⅛", "¼", "⅜", "½", "⅝", "¾", "⅞"][Math.abs(eighths % 8)];
  return `${whole || !fraction ? whole : ""}${fraction} in`;
}

/** @param {number} lengthIn */
function boardWords(lengthIn) {
  const feet = lengthIn / 12;
  return Number.isInteger(feet) ? `${feet}-foot 2×4 (${lengthIn} in)` : `${inches(lengthIn)} 2×4`;
}

/** @type {Readonly<Record<string, string>>} */
const HTML_ESCAPES = Object.freeze({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" });

/** @param {string} value */
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}
