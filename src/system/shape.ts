/**
 * Shape check for the published Store definition contracts.
 * Null means "not supplied" and is allowed; required facts are admission's job
 * and the Store's job. An undeclared field is a problem. System does not drop it.
 */

type ShapeNode =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | { object: Record<string, ShapeNode> }
  | { array: ShapeNode }
  | { enum: readonly unknown[]; code?: string }
  | { any: true };

const describe = (value: unknown) =>
  value === null ? "null" : Array.isArray(value) ? "array" : typeof value;

function check(value: unknown, node: ShapeNode, path: string, problems: string[], prefix: string) {
  if (value === null || value === undefined) return;
  if (typeof node === "string") {
    const ok =
      node === "string"
        ? typeof value === "string"
        : node === "number"
          ? typeof value === "number" && Number.isFinite(value)
          : node === "integer"
            ? Number.isInteger(value)
            : node === "boolean"
              ? typeof value === "boolean"
              : false;
    if (!ok) problems.push(`${prefix}_FIELD_TYPE:${path}:${node}`);
    return;
  }
  if ("any" in node) return;
  if ("enum" in node) {
    if (!node.enum.includes(value)) problems.push(node.code ?? `${prefix}_FIELD_VALUE:${path}`);
    return;
  }
  if ("array" in node) {
    if (!Array.isArray(value)) {
      problems.push(`${prefix}_FIELD_TYPE:${path}:array`);
      return;
    }
    value.forEach((item, i) => check(item, node.array, `${path}[${i}]`, problems, prefix));
    return;
  }
  if ("object" in node) {
    if (describe(value) !== "object") {
      problems.push(`${prefix}_FIELD_TYPE:${path || "(root)"}:object`);
      return;
    }
    const record = value as Record<string, unknown>;
    for (const key of Object.keys(record)) {
      const at = path ? `${path}.${key}` : key;
      if (Object.hasOwn(node.object, key)) check(record[key], node.object[key], at, problems, prefix);
      else problems.push(`${prefix}_FIELD_NOT_DECLARED:${at}`);
    }
  }
}

export function shapeProblems(value: unknown, node: ShapeNode, prefix = "DEFINITION"): string[] {
  const problems: string[] = [];
  check(value, node, "", problems, prefix);
  return problems;
}

const strings = { array: "string" as const };

const boardMaterial = {
  object: {
    species: "string" as const,
    form: "string" as const,
    nominalT: "number" as const,
    nominalW: "number" as const,
    grade: "string" as const,
  },
};

export const DEFINITION_SHAPES = {
  USER_DEFINED_BOARD_V1: {
    object: {
      title: "string",
      configurationId: "string",
      configurationVersion: "string",
      classId: "string",
      materialDemand: {
        object: { species: "string", form: "string", nominalT: "number", nominalW: "number" },
      },
      definedWorkpieceLengthIn: "number",
      requiredOps: strings,
      sawAngleDeg: "number",
      cutPlane: "string",
      datumCMethod: "string",
      declaredSawCuts: "integer",
      declaredSpotCount: "integer",
      unresolvedConditions: strings,
      parts: {
        array: {
          object: {
            partId: "string",
            lengthIn: "number",
            features: {
              array: {
                object: {
                  featureId: "string",
                  kind: "string",
                  xIn: "number",
                  locationRule: "string",
                  acrossWidthRule: "string",
                  insetFromEdgeIn: "number",
                },
              },
            },
          },
        },
      },
    },
  },
  CUT_PACKAGE_V1: {
    object: {
      classId: "string",
      configurationId: "string",
      configurationVersion: "string",
      cutPackages: {
        array: {
          object: {
            packageId: "string",
            material: boardMaterial,
            endCut: { object: { angleDeg: "number" } },
            finishedWidthIn: "number",
            parts: {
              array: {
                object: {
                  partId: "string",
                  lengthIn: "number",
                  spots: {
                    array: {
                      object: {
                        featureId: "string",
                        xIn: "number",
                        acrossWidthRule: "string",
                        insetFromEdgeIn: "number",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      itemLines: {
        array: {
          object: {
            lineId: "string",
            storeSku: "string",
            requirementId: "string",
            qty: "integer",
            requirement: {
              object: {
                kind: "string",
                gauge: "string",
                diameterIn: "number",
                lengthIn: "number",
                finish: "string",
                unit: "string",
              },
            },
          },
        },
      },
    },
  },
  SHEET_PACKAGE_V1: {
    object: {
      configurationId: "string",
      configurationVersion: "string",
      sheet: {
        object: {
          thicknessIn: "number",
          lengthIn: "number",
          widthIn: "number",
          species: "string",
          grade: "string",
        },
      },
      features: {
        array: {
          object: {
            featureId: "string",
            kind: "string",
            placement: "string",
            widthIn: "number",
            straightHeightIn: "number",
            riseIn: "number",
            retain: "string",
            requestedTabCount: "integer",
            within: "string",
            line: "string",
            fromEnd: "string",
            distanceIn: "number",
          },
        },
      },
      returnAllPieces: "boolean",
      exteriorRatingRequested: "boolean",
    },
  },
} as const;

export type RequestType = keyof typeof DEFINITION_SHAPES;
