/**
 * Project 1 bench view of a Store answer.
 * System defines the brace. Store selects the board and Q. This file prices nothing.
 */

export const REQUESTED_MINIMUM_IN = 60;
export const SPOT_RULE = "finishedLengthIn / 2";
export const SPOT_DATUM = "finished-part length, centered from either finished end, centered on the wide face";

/**
 * @param {number} finishedLengthIn
 */
export function spotAlongPart(finishedLengthIn) {
  const length = Number(finishedLengthIn);
  if (!Number.isFinite(length) || length <= 0) return null;
  return {
    rule: SPOT_RULE,
    datum: SPOT_DATUM,
    finishedLengthIn: length,
    xIn: Number((length / 2).toFixed(6)),
    kind: "SPOT_ON_LOCATION",
    acrossWidthRule: "CENTERED_ON_WIDE_FACE",
  };
}

/**
 * @param {string} label
 */
export function isChangeWoodTool(label) {
  return /change\s*wood|species/i.test(String(label || ""));
}

/**
 * @param {Record<string, any> | null | undefined} answer
 */
export function readStoreSelection(answer) {
  const evaluation = answer?.rawEvaluation || null;
  const estimate = answer?.rawEstimate || null;
  const resolution = answer?.materialResolution || {};
  const offering = answer?.rawOffering || {};
  const stockLengthIn = numberOrNull(resolution.stockLengthIn ?? resolution.workpieceLengthIn ?? offering.stockL_in);
  const status = evaluation?.status || null;
  const quote = status === "SUPPORTABLE" && estimate?.complete === true && numberOrNull(estimate?.totals?.Q) != null;
  return {
    status,
    quote,
    q: quote ? estimate.totals.Q : null,
    material: quote ? numberOrNull(estimate.totals.material) : null,
    sku: resolution.storeSku || offering.storeSku || null,
    stockLengthIn,
    reason: firstReason(answer, evaluation),
    offeredGrades: Array.isArray(resolution.offeredGrades) ? resolution.offeredGrades.map(String) : [],
  };
}

/**
 * @param {{ finishedLengthIn: number, species?: string, spotIn?: number, answer: Record<string, any> | null, requestedMinimumIn?: number }} input
 */
export function benchView({ finishedLengthIn, species, spotIn, answer, requestedMinimumIn = REQUESTED_MINIMUM_IN }) {
  const selection = readStoreSelection(answer);
  const wood = species === "spf" ? "SPF" : species === "syp-treated" ? "treated SYP" : species || "wood";
  const spot = spotAlongPart(finishedLengthIn);
  const current = selection.status != null;
  const longer = selection.quote && selection.stockLengthIn != null && selection.stockLengthIn > requestedMinimumIn;
  const stock = selection.quote ? selection.stockLengthIn : null;
  return {
    current,
    spot,
    spotMatches: spot && Number(spotIn) === spot.xIn,
    selection,
    priceLine: !current
      ? `${finishedLengthIn} in braces · ${wood} · ask the Store.`
      : selection.quote
        ? `${finishedLengthIn} in braces · ${wood} · ${stock}-inch board · $${selection.q.toFixed(2)} material and machine quote.`
        : `${finishedLengthIn} in braces · ${wood} · ${selection.status}${selection.reason ? " · " + selection.reason : ""}.`,
    stockLine: stock
      ? `ONE ${stock}-IN 2×4 · Store selected ${selection.sku || "board"} · schematic`
      : `ONE 5-FOOT 2×4 · 60 IN requested minimum · Store has not selected a board`,
    total: selection.quote ? `$${selection.q.toFixed(2)}` : "NOT COMPLETE",
    sku: selection.sku || "NOT MAPPED",
    swap: {
      visible: longer,
      html: longer
        ? `<b>The Store grabbed a longer board.</b> The ${requestedMinimumIn / 12}-foot board is not the one it selected. It selected ${selection.sku} at ${selection.stockLengthIn} in.`
        : "",
    },
  };
}

/**
 * @param {string | null | undefined} expectedRevisionId
 * @param {string | null | undefined} answerRevisionId
 */
export function acceptAnswer(expectedRevisionId, answerRevisionId) {
  return expectedRevisionId != null && expectedRevisionId === answerRevisionId;
}

/**
 * @param {unknown} value
 */
function numberOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

/**
 * @param {Record<string, any> | null | undefined} answer
 * @param {Record<string, any> | null} evaluation
 */
function firstReason(answer, evaluation) {
  /** @type {unknown[]} */
  const reasons = []
    .concat(answer?.priceCompleteness?.unresolvedConditions || [])
    .concat(answer?.priceCompleteness?.refusalConditions || [])
    .concat(evaluation?.reasonCodes || []);
  return reasons.find(Boolean) || evaluation?.materialResolution?.reason || null;
}
