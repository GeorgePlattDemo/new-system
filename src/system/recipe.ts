import { RECIPE_SCHEMA } from "./store-candidate.ts";
import type { RequestType } from "./shape.ts";

export type Binding = { literal: string | number | boolean | null } | { input: string };

export type InputKind = "text" | "number" | "integer" | "boolean" | "choice";

export type RecipeInput = {
  id: string;
  label: string;
  kind: InputKind;
  required: boolean;
  help?: string;
  choices?: { value: string; label: string }[];
};

export type TraceStep = {
  id: string;
  rule: string;
  formula: string;
  inputs: Record<string, unknown>;
  output: unknown;
};

export type SystemRequirements = {
  endRelation: string;
  lengthDatum: string;
  endIdentity: string;
};

export type Recipe = {
  schema: typeof RECIPE_SCHEMA;
  recipeId: string;
  version: string;
  title: string;
  summary: string;
  narrative: string;
  /** supported = existing compiler operations. extension = a named engine rule, not a data-only job. */
  engine: "supported" | "extension";
  extensionId?: string;
  requestType: RequestType;
  classId?: string;
  configurationId: string;
  requirements: SystemRequirements;
  inputs: RecipeInput[];
  defaults: Record<string, string | number | boolean | null>;
  rule: Record<string, unknown>;
};

export type CompileResult = {
  recipeId: string;
  recipeVersion: string;
  requestType: RequestType;
  demand: Record<string, unknown> | null;
  requirements: SystemRequirements;
  trace: TraceStep[];
  blockers: { code: string; fact: string; owner: "USER" | "PROJECT" | "SYSTEM" }[];
  engine: "supported" | "extension";
  extensionId?: string;
};

export type Inputs = Record<string, string | number | boolean | null | undefined>;

export function bindingValue(binding: unknown, inputs: Inputs): { ok: true; value: unknown } | { ok: false; missing: string } {
  if (!binding || typeof binding !== "object") return { ok: false, missing: "BINDING" };
  if ("literal" in binding) return { ok: true, value: (binding as { literal: unknown }).literal };
  if ("input" in binding) {
    const id = String((binding as { input: unknown }).input);
    const value = inputs[id];
    if (value === undefined || value === null || value === "") return { ok: false, missing: id };
    return { ok: true, value };
  }
  return { ok: false, missing: "BINDING" };
}

export function numberBinding(binding: unknown, inputs: Inputs): { ok: true; value: number } | { ok: false; missing: string } {
  const got = bindingValue(binding, inputs);
  if (!got.ok) return got;
  const value = typeof got.value === "number" ? got.value : Number(got.value);
  if (!Number.isFinite(value)) return { ok: false, missing: "input" in (binding as object) ? String((binding as { input: string }).input) : "NUMBER" };
  return { ok: true, value };
}
