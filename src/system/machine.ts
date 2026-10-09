import type { RequestType } from "./shape.ts";
import { STORE_CANDIDATE } from "./store-candidate.ts";

export type MachineBoundary = {
  requestType: RequestType | null;
  evidencePath: typeof STORE_CANDIDATE.machineEvidencePath;
  loweringRegistered: boolean;
  reason: string;
  physicalAdmission: "BLOCKED";
  physicalAuthority: false;
};

/**
 * What this candidate will ask the Store to lower. It does not lower anything itself
 * and it does not turn a missing answer into records.
 */
export function machineBoundary(requestType: RequestType | null): MachineBoundary {
  if (requestType === "USER_DEFINED_BOARD_V1") {
    return {
      requestType,
      evidencePath: STORE_CANDIDATE.machineEvidencePath,
      loweringRegistered: true,
      reason:
        "The reference cell registers parallel ends and length on the long-long outer edge. That datum is the long point of the miter face, so this job does not add a second end-identity string. Evidence is only what the Store returns for the accepted packet. A supplied end identity is sent, not stripped, and the cell refuses it.",
      physicalAdmission: "BLOCKED",
      physicalAuthority: false,
    };
  }
  return {
    requestType,
    evidencePath: STORE_CANDIDATE.machineEvidencePath,
    loweringRegistered: false,
    reason: requestType
      ? `The reference cell does not lower ${requestType}. A supportable price is not machine evidence. The Store's refusal is the finding. This page does not invent records to avoid it.`
      : "No definition is saved, so there is nothing to lower.",
    physicalAdmission: "BLOCKED",
    physicalAuthority: false,
  };
}
