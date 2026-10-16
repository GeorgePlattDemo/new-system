/**
 * The Store candidate this System was inspected against.
 * This is not an approved production release. A later Store release is reconciled
 * by changing this record on purpose and rerunning contract acceptance.
 * The commit is the git identity of the checkout. A running process is not labeled
 * with this commit unless that checkout's HEAD was read and matched.
 */
export const STORE_CANDIDATE = Object.freeze({
  name: "Store Zero",
  protocol: "STORE-ZERO-REQUEST-2",
  inspectedCommit: "c9b75a23f7dc79258bb43f7100415a0c2db0c1e7",
  requestsPath: "/v1/requests",
  healthPath: "/health",
  machineEvidencePath: "/v1/machine-evidence",
  machineEvidenceProtocol: "STORE-ZERO-MACHINE-EVIDENCE-2",
  /** Read from the pinned Store's registered configuration. Not a caller override. */
  inspectedMachine: Object.freeze({
    machineConfigId: "STORE-MANUFACTURING-CORE-0.1",
    machineConfigHash: "87542b1d56d7e5624d6d85557a0d213b226b9ffc4454d561fd8616379c1e6884",
    physicalAuthority: false as const,
    requestTypes: Object.freeze(["USER_DEFINED_BOARD_V1","CUT_PACKAGE_V1","SHEET_PACKAGE_V1"]),
  }),
  retiredRequestTypes: Object.freeze(["ALCOVE_INSERT_V1", "BOARD_SQUARE_V1"]),
  acceptedRequestTypes: Object.freeze([
    "USER_DEFINED_BOARD_V1",
    "CUT_PACKAGE_V1",
    "SHEET_PACKAGE_V1",
    "OFFERING_LOOKUP",
  ]),
});

export const RECORD_SCHEMA = "STB-SYSTEM-RECORD-2";
export const PACKET_SCHEMA = "STB-ACCEPTED-JOB-PACKET-2";
export const RECIPE_SCHEMA = "STB-LIBRARY-RECIPE-1";
