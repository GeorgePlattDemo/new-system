/**
 * The Store candidate this System was inspected against.
 * This is not an approved production release. A later Store release is reconciled
 * by changing this record on purpose and rerunning contract acceptance.
 */
export const STORE_CANDIDATE = Object.freeze({
  name: "Store Zero",
  protocol: "STORE-ZERO-REQUEST-1",
  inspectedCommit: "d0c15fcd70b4357c8fa61d5505b95ec68cea8e65",
  requestsPath: "/v1/requests",
  healthPath: "/health",
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
