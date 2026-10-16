/** Bounded public registration of supported recipes. Store remains the evaluator. */
import { compileRecipe } from "./compile.ts";
import { calculationHash } from "./hash.ts";
import { definitionManifest } from "./manifest.ts";
import { LIBRARY, recipeById } from "./recipes/library.ts";
import type { Inputs } from "./recipe.ts";

export function componentTools() {
  return LIBRARY.filter((recipe) => recipe.publicTool === true).map(
    ({ recipeId, version, title, summary, narrative, inputs, defaults }) => ({
      recipeId,
      version,
      title,
      summary,
      narrative,
      inputs,
      defaults,
    }),
  );
}

export function componentDefinition(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return { error: "COMPONENT_DEFINITION_REQUIRED" };
  const body = value as Record<string, unknown>;
  if (Object.keys(body).some((key) => !["recipeId", "inputs"].includes(key)))
    return { error: "UNDECLARED_COMPONENT_FIELD" };
  const recipe = typeof body.recipeId === "string" ? recipeById(body.recipeId) : null;
  if (
    !recipe?.publicTool ||
    recipe.engine !== "supported" ||
    recipe.requestType !== "CUT_PACKAGE_V1"
  )
    return { error: "REGISTERED_COMPONENT_TOOL_REQUIRED" };
  if (!body.inputs || typeof body.inputs !== "object" || Array.isArray(body.inputs))
    return { error: "COMPONENT_INPUTS_REQUIRED" };
  const inputs = body.inputs as Inputs;
  if (Object.keys(inputs).some((key) => !recipe.inputs.some((input) => input.id === key)))
    return { error: "UNKNOWN_INPUT" };
  const compiled = compileRecipe(recipe, inputs);
  const revision = calculationHash({
    recipeId: recipe.recipeId,
    version: recipe.version,
    inputs,
    demand: compiled.demand,
  });
  if (compiled.demand) compiled.demand = { ...compiled.demand, configurationVersion: revision };
  return {
    recipeId: recipe.recipeId,
    title: recipe.title,
    inputs,
    revision,
    requirements: compiled.requirements,
    trace: compiled.trace,
    blockers: compiled.blockers,
    payload: compiled.demand
      ? { definitionKind: "cut_package.v1", ruleVersion: "0.1", definition: compiled.demand }
      : null,
    manifest: compiled.demand ? definitionManifest(recipe.requestType, compiled.demand) : null,
  };
}
