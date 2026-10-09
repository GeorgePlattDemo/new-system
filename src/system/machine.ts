import type { RequestType } from "./shape.ts";

export type MachineView = {
  lowering: "UNSUPPORTED" | "NOT_AGREED";
  reason: string;
  physicalAdmission: "BLOCKED";
  physicalAuthority: false;
  physicalCommands: [];
  virtualEvidence: null;
};

/**
 * The current Store HTTP service does not return machine records.
 * System does not import the Store machine engine and does not invent motion.
 * Physical admission stays blocked. There is no physical command.
 */
export function machineView(requestType: RequestType | null): MachineView {
  if (requestType == null) {
    return {
      lowering: "NOT_AGREED",
      reason: "No definition is saved, so there is nothing to lower.",
      physicalAdmission: "BLOCKED",
      physicalAuthority: false,
      physicalCommands: [],
      virtualEvidence: null,
    };
  }
  if (requestType !== "USER_DEFINED_BOARD_V1") {
    return {
      lowering: "UNSUPPORTED",
      reason: `Store lowering is registered for USER_DEFINED_BOARD_V1 only. ${requestType} stays unsupported until Store implements it and a System test verifies it. Commercially usable is not machine-ready.`,
      physicalAdmission: "BLOCKED",
      physicalAuthority: false,
      physicalCommands: [],
      virtualEvidence: null,
    };
  }
  return {
    lowering: "NOT_AGREED",
    reason:
      "Store can lower a verified board packet inside its own module, but this candidate's HTTP service does not expose that interface. System will not clone it. Machine evidence waits for a versioned Store-owned endpoint and for Store's malformed-input fixes.",
    physicalAdmission: "BLOCKED",
    physicalAuthority: false,
    physicalCommands: [],
    virtualEvidence: null,
  };
}
