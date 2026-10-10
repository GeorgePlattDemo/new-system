/**
 * The Store candidate this System was inspected against.
 * This is not an approved production release. A later Store release is reconciled
 * by changing this record on purpose and rerunning contract acceptance.
 * The commit is the git identity of the checkout. A running process is not labeled
 * with this commit unless that checkout's HEAD was read and matched.
 */
export const STORE_CANDIDATE = Object.freeze({
  name: "Store Zero",
  protocol: "STORE-ZERO-REQUEST-1",
  inspectedCommit: "81d958482bd25e784f122c97ffb11174013395af",
  requestsPath: "/v1/requests",
  healthPath: "/health",
  machineEvidencePath: "/v1/machine-evidence",
  machineEvidenceProtocol: "STORE-ZERO-MACHINE-EVIDENCE-1",
  /** Read from the pinned Store's registered configuration. Not a caller override. */
  inspectedMachine: Object.freeze({
    machineConfigId: "D001-REFERENCE-REVIEW-0.2",
    machineConfigHash: "467fac4bf43503b7d694826e00a0158acc70f90ab884886d7f2ddfc3dbbb5ecc",
    physicalAuthority: false as const,
    requestTypes: Object.freeze(["USER_DEFINED_BOARD_V1"]),
  }),
  retiredRequestTypes: Object.freeze(["ALCOVE_INSERT_V1", "BOARD_SQUARE_V1"]),
  acceptedRequestTypes: Object.freeze([
    "USER_DEFINED_BOARD_V1",
    "CUT_PACKAGE_V1",
    "SHEET_PACKAGE_V1",
    "OFFERING_LOOKUP",
  ]),
});

export const RECORD_SCHEMA = "STB-SYSTEM-RECORD-1";
export const PACKET_SCHEMA = "STB-ACCEPTED-JOB-PACKET-1";
export const RECIPE_SCHEMA = "STB-LIBRARY-RECIPE-1";
