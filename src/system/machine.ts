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
  if (STORE_CANDIDATE.inspectedMachine.requestTypes.some(type => type === requestType)) {
    return {
      requestType,
      evidencePath: STORE_CANDIDATE.machineEvidencePath,
      loweringRegistered: true,
      reason:
        "The inspected Store registers modeled evidence for board, cut-package and sheet definitions. Evidence requires the exact accepted packet and successful Store verification; supported price alone is insufficient. Records describe predicted occupancy, with physical admission blocked. Sheet evidence is not a complete controller trajectory.",
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
