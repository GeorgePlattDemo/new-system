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
  inspectedCommit: "a3a83a6aefdeb9eba7f85beaf09323de72ed7e8d",
  requestsPath: "/v1/requests",
  healthPath: "/health",
  machineEvidencePath: "/v1/machine-evidence",
  machineEvidenceProtocol: "STORE-ZERO-MACHINE-EVIDENCE-2",
  /** Read from the pinned Store's registered configuration. Not a caller override. */
  inspectedMachine: Object.freeze({
    machineConfigId: "STORE-MANUFACTURING-CORE-0.1",
    machineConfigHash: "0394f8ac97eb89191b94fb83fd7390049ddd68e427a91629a1a14c98dce814df",
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
