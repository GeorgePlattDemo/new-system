import { shapeProblems, DEFINITION_SHAPES } from "./shape.ts";
import { bindingValue, numberBinding, type CompileResult, type Inputs, type Recipe, type TraceStep } from "./recipe.ts";
import { compileWindowSeat } from "./window-seat.ts";

const DRESSED: Record<number, number> = { 2: 1.5, 3: 2.5, 4: 3.5, 6: 5.5, 8: 7.25, 10: 9.25, 12: 11.25 };

const block = (code: string, fact: string, owner: "USER" | "PROJECT" | "SYSTEM" = "USER") => ({ code, fact, owner });

function text(binding: unknown, inputs: Inputs, fact: string, blockers: CompileResult["blockers"]) {
  const got = bindingValue(binding, inputs);
  if (!got.ok || typeof got.value !== "string" || !got.value.trim()) {
    blockers.push(block("MISSING_INPUT", fact));
    return null;
  }
  return got.value.trim();
}

function num(binding: unknown, inputs: Inputs, fact: string, blockers: CompileResult["blockers"], opts?: { min?: number; integer?: boolean }) {
  const got = numberBinding(binding, inputs);
  if (!got.ok) {
    blockers.push(block("MISSING_INPUT", fact));
    return null;
  }
  if (opts?.min != null && !(got.value > opts.min)) {
    blockers.push(block("VALUE_NOT_POSITIVE", fact));
    return null;
  }
  if (opts?.integer && !Number.isInteger(got.value)) {
    blockers.push(block("COUNT_MUST_BE_A_WHOLE_NUMBER", fact));
    return null;
  }
  return got.value;
}

function boardDemand(rule: Record<string, unknown>, inputs: Inputs, recipe: Recipe, trace: TraceStep[], blockers: CompileResult["blockers"]) {
  const species = text(rule.species, inputs, "species", blockers);
  const workpiece = num(rule.workpieceLengthIn, inputs, "workpieceLengthIn", blockers, { min: 0 });
  const partCount = num(rule.partCount, inputs, "partCount", blockers, { min: 0, integer: true });
  const partLength = num(rule.partLengthIn, inputs, "partLengthIn", blockers, { min: 0 });
  const angle = num(rule.sawAngleDeg, inputs, "sawAngleDeg", blockers);
  const nominalT = num(rule.nominalT, inputs, "nominalT", blockers, { min: 0 });
  const nominalW = num(rule.nominalW, inputs, "nominalW", blockers, { min: 0 });
  const spotsOn = bindingValue(rule.spots, inputs);
  const spots = spotsOn.ok ? spotsOn.value === true || spotsOn.value === "true" : false;
  if (!spotsOn.ok) blockers.push(block("MISSING_INPUT", "spots"));
  const version = text(rule.configurationVersion, inputs, "configurationVersion", blockers);
  const title = text(rule.title, inputs, "title", blockers);
  if (blockers.length || species == null || workpiece == null || partCount == null || partLength == null || angle == null || nominalT == null || nominalW == null || version == null || title == null) {
    return null;
  }
  if (partCount < 1 || partCount > 24) {
    blockers.push(block("PART_COUNT_OUT_OF_RANGE", "partCount"));
    return null;
  }
  const parts = Array.from({ length: partCount }, (_, i) => {
    const partId = `PART-${i + 1}`;
    const xIn = partLength / 2;
    trace.push({
      id: `${partId}-spot-x`,
      rule: "board-workpiece",
      formula: "xIn = partLengthIn / 2, centered on the part and on the wide face",
      inputs: { partLengthIn: partLength },
      output: spots ? xIn : null,
    });
    return {
      partId,
      lengthIn: partLength,
      features: spots
        ? [
            {
              featureId: `SPOT-${i + 1}`,
              kind: "SPOT_ON_LOCATION",
              xIn,
              locationRule: "CENTERED_ON_PART",
              acrossWidthRule: "CENTERED_ON_WIDE_FACE",
            },
          ]
        : [],
    };
  });
  const declaredSawCuts = partCount + 1;
  trace.push({
    id: "declared-saw-cuts",
    rule: "board-workpiece",
    formula: "declaredSawCuts = partCount + 1 (one reference cut plus one cutoff per part)",
    inputs: { partCount },
    output: declaredSawCuts,
  });
  return {
    title,
    configurationId: recipe.configurationId,
    configurationVersion: version,
    classId: recipe.classId,
    materialDemand: { species, form: "board", nominalT, nominalW },
    definedWorkpieceLengthIn: workpiece,
    requiredOps: spots ? ["MITER_LIMITED", "SPOT_ON_LOCATION"] : ["MITER_LIMITED"],
    sawAngleDeg: angle,
    cutPlane: "miter-face",
    datumCMethod: "REFERENCE_CUT",
    declaredSawCuts,
    declaredSpotCount: spots ? partCount : 0,
    unresolvedConditions: [],
    parts,
  };
}

function expandParts(
  spec: unknown,
  inputs: Inputs,
  blockers: CompileResult["blockers"],
): { partId: string; lengthIn: number }[] | null {
  if (!Array.isArray(spec)) return [];
  const parts: { partId: string; lengthIn: number }[] = [];
  for (const row of spec) {
    if (!row || typeof row !== "object") continue;
    const rec = row as Record<string, unknown>;
    const id = text(rec.id, inputs, "partId", blockers);
    const lengthIn = num(rec.lengthIn, inputs, "lengthIn", blockers, { min: 0 });
    const count = num(rec.count, inputs, "count", blockers, { min: 0, integer: true });
    if (!id || lengthIn == null || count == null) return null;
    for (let i = 1; i <= count; i++) parts.push({ partId: `${id}-${String(i).padStart(2, "0")}`, lengthIn });
  }
  return parts;
}

function partGroups(rule: Record<string, unknown>, inputs: Inputs, recipe: Recipe, trace: TraceStep[], blockers: CompileResult["blockers"]) {
  const groups = rule.groups;
  if (!Array.isArray(groups) || !groups.length) {
    blockers.push(block("GROUPS_REQUIRED", "groups", "SYSTEM"));
    return null;
  }
  const cutPackages = [];
  for (const group of groups) {
    const g = group as Record<string, unknown>;
    const packageId = text(g.id, inputs, "packageId", blockers);
    const species = text(g.species, inputs, "species", blockers);
    const grade = text(g.grade, inputs, "grade", blockers);
    const nominalT = num(g.nominalT, inputs, "nominalT", blockers, { min: 0 });
    const nominalW = num(g.nominalW, inputs, "nominalW", blockers, { min: 0 });
    const angle = num(g.angleDeg, inputs, "angleDeg", blockers);
    const parts = expandParts(g.parts, inputs, blockers);
    if (!packageId || !species || !grade || nominalT == null || nominalW == null || angle == null || !parts) return null;
    if (!parts.length) {
      blockers.push(block("PARTS_REQUIRED", packageId, "PROJECT"));
      return null;
    }
    const finished = g.finishedWidthIn ? numberBinding(g.finishedWidthIn, inputs) : null;
    if (finished && !finished.ok) {
      blockers.push(block("MISSING_INPUT", "finishedWidthIn"));
      return null;
    }
    cutPackages.push({
      packageId,
      material: { species, form: "board", nominalT, nominalW, grade },
      endCut: { angleDeg: angle },
      ...(finished ? { finishedWidthIn: finished.value } : {}),
      parts: parts.map((part) => ({ ...part, spots: [] })),
    });
    trace.push({
      id: packageId,
      rule: "part-groups",
      formula: "one package per declared group; part ids are the group part id plus a count",
      inputs: { packageId, count: parts.length, angleDeg: angle },
      output: parts.map((part) => part.partId),
    });
  }
  return {
    ...(recipe.classId ? { classId: recipe.classId } : {}),
    configurationId: recipe.configurationId,
    configurationVersion: String(rule.configurationVersion ?? "1"),
    cutPackages,
  };
}

function depthStrips(rule: Record<string, unknown>, inputs: Inputs, recipe: Recipe, trace: TraceStep[], blockers: CompileResult["blockers"]) {
  const species = text(rule.species, inputs, "species", blockers);
  const grade = text(rule.grade, inputs, "grade", blockers);
  const nominalW = num(rule.nominalW, inputs, "nominalW", blockers, { integer: true, min: 0 });
  const height = num(rule.heightIn, inputs, "heightIn", blockers, { min: 0 });
  const depth = num(rule.depthIn, inputs, "depthIn", blockers, { min: 0 });
  const span = num(rule.spanIn, inputs, "spanIn", blockers, { min: 0 });
  const shelfCount = num(rule.shelfCount, inputs, "shelfCount", blockers, { min: 0, integer: true });
  const uprightCount = num(rule.uprightCount, inputs, "uprightCount", blockers, { min: 0, integer: true });
  if (blockers.length || !species || !grade || nominalW == null || height == null || depth == null || span == null || shelfCount == null || uprightCount == null) {
    return null;
  }
  const actual = DRESSED[nominalW];
  if (actual == null) {
    blockers.push(block("NOMINAL_WIDTH_NOT_IN_DRESSED_TABLE", "nominalW", "PROJECT"));
    return null;
  }
  const full = Math.floor(depth / actual + 1e-9);
  const last = Math.round((depth - full * actual) * 1e6) / 1e6;
  const strips = [
    ...Array.from({ length: full }, () => ({ nominalW, finishedWidthIn: null as number | null })),
    ...(last > 1e-9 ? [{ nominalW, finishedWidthIn: last }] : []),
  ];
  if (!strips.length) {
    blockers.push(block("DEPTH_DOES_NOT_MAKE_A_STRIP", "depthIn"));
    return null;
  }
  trace.push({
    id: "shelf-strips",
    rule: "depth-strips",
    formula: "full strips = floor(depth / dressed width); a remainder is one strip ripped to that remainder",
    inputs: { depth, nominalW, dressedWidthIn: actual },
    output: strips,
  });
  const material = { species, form: "board", nominalT: 1, nominalW, grade };
  const many = (prefix: string, n: number, lengthIn: number) =>
    Array.from({ length: n }, (_, i) => ({ partId: `${prefix}-${String(i + 1).padStart(2, "0")}`, lengthIn, spots: [] }));
  const kinds = new Map<string, { finishedWidthIn: number | null; perShelf: number }>();
  for (const strip of strips) {
    const packageId = `SHELF-1X${strip.nominalW}${strip.finishedWidthIn ? `-TO-${strip.finishedWidthIn}` : ""}`;
    const prev = kinds.get(packageId);
    kinds.set(packageId, { finishedWidthIn: strip.finishedWidthIn, perShelf: (prev?.perShelf ?? 0) + 1 });
  }
  const cutPackages = [
    { packageId: "UPRIGHTS", material, endCut: { angleDeg: 0 }, parts: many("UPRIGHT", uprightCount, height) },
    ...[...kinds].map(([packageId, k]) => ({
      packageId,
      material,
      endCut: { angleDeg: 0 },
      ...(k.finishedWidthIn ? { finishedWidthIn: k.finishedWidthIn } : {}),
      parts: many(packageId, shelfCount * k.perShelf, span),
    })),
  ];
  return {
    configurationId: recipe.configurationId,
    configurationVersion: "1",
    cutPackages,
    itemLines: [{ lineId: "PINS-AND-SCREWS", qty: 1, requirementId: "ALCOVE-PINS-AND-SCREWS" }],
  };
}

type PlanGroup = {
  id: string;
  nominalT: number;
  nominalW: number;
  angleDeg: number;
  scales?: boolean;
  parts: { id: string; count: number; lengthIn: number }[];
};
type Plan = {
  id: string;
  title: string;
  source: string;
  groups: PlanGroup[];
  hardware: { id: string; need: number; requirement: Record<string, unknown> }[];
};
type Wood = { key: string; species: string; grade: string };

function planGroups(rule: Record<string, unknown>, inputs: Inputs, recipe: Recipe, trace: TraceStep[], blockers: CompileResult["blockers"]) {
  const planId = text(rule.planId, inputs, "planId", blockers);
  const lengthIn = num(rule.lengthIn, inputs, "lengthIn", blockers, { min: 0 });
  const woodKey = text(rule.wood, inputs, "wood", blockers);
  const tier = text(rule.hardwareTier, inputs, "hardwareTier", blockers);
  const plans = (rule.plans as Plan[] | undefined) ?? [];
  const woods = (rule.woods as Wood[] | undefined) ?? [];
  if (!planId || lengthIn == null || !woodKey || !tier) return null;
  const plan = plans.find((item) => item.id === planId);
  const wood = woods.find((item) => item.key === woodKey);
  if (!plan) {
    blockers.push(block("PLAN_NOT_IN_RECIPE", "planId"));
    return null;
  }
  if (!wood) {
    blockers.push(block("WOOD_NOT_IN_RECIPE", "wood"));
    return null;
  }
  const cutPackages = plan.groups.map((group) => ({
    packageId: group.id,
    material: { species: wood.species, form: "board", nominalT: group.nominalT, nominalW: group.nominalW, grade: wood.grade },
    endCut: { angleDeg: group.angleDeg },
    parts: group.parts.flatMap((part) =>
      Array.from({ length: part.count }, (_, i) => ({
        partId: `${part.id}-${String(i + 1).padStart(2, "0")}`,
        lengthIn: group.scales ? lengthIn : part.lengthIn,
        spots: [],
      })),
    ),
  }));
  trace.push({
    id: "plan",
    rule: "plan-groups",
    formula: "scaling groups use the stated length; other groups keep the plan's published lengths and angles",
    inputs: { planId, lengthIn, wood: woodKey, source: plan.source },
    output: cutPackages.map((pkg) => ({ packageId: pkg.packageId, parts: pkg.parts.length })),
  });
  const itemLines =
    tier === "BYO"
      ? []
      : plan.hardware.map((line) => ({
          lineId: line.id,
          qty: line.need,
          requirement: { ...line.requirement, finish: tier, unit: "piece" },
        }));
  return {
    configurationId: recipe.configurationId,
    configurationVersion: plan.id,
    cutPackages,
    ...(itemLines.length ? { itemLines } : {}),
  };
}

function sheetOpening(rule: Record<string, unknown>, inputs: Inputs, recipe: Recipe, trace: TraceStep[], blockers: CompileResult["blockers"]) {
  const widthIn = num(rule.widthIn, inputs, "widthIn", blockers, { min: 0 });
  const straight = num(rule.straightHeightIn, inputs, "straightHeightIn", blockers, { min: 0 });
  const rise = num(rule.riseIn, inputs, "riseIn", blockers, { min: 0 });
  const cutLeft = num(rule.cutLeftIn, inputs, "cutLeftIn", blockers, { min: 0 });
  const cutRight = num(rule.cutRightIn, inputs, "cutRightIn", blockers, { min: 0 });
  const thickness = num(rule.thicknessIn, inputs, "thicknessIn", blockers, { min: 0 });
  const sheetL = num(rule.sheetLengthIn, inputs, "sheetLengthIn", blockers, { min: 0 });
  const sheetW = num(rule.sheetWidthIn, inputs, "sheetWidthIn", blockers, { min: 0 });
  if ([widthIn, straight, rise, cutLeft, cutRight, thickness, sheetL, sheetW].some((v) => v == null)) return null;
  const radius = (widthIn! * widthIn!) / (8 * rise!) + rise! / 2;
  trace.push({
    id: "arch-radius",
    rule: "sheet-opening",
    formula: "radius = width² / (8 × rise) + rise / 2",
    inputs: { widthIn, riseIn: rise },
    output: radius,
  });
  return {
    configurationId: recipe.configurationId,
    configurationVersion: `w${widthIn}-h${straight}-r${rise}-c${cutLeft}/${cutRight}`,
    sheet: { thicknessIn: thickness, lengthIn: sheetL, widthIn: sheetW },
    features: [
      {
        featureId: "OPENING",
        kind: "ARCHED_APERTURE",
        placement: "CENTERED",
        widthIn,
        straightHeightIn: straight,
        riseIn: rise,
        retain: "TABS",
        requestedTabCount: 4,
      },
      { featureId: "CENTER-SPLIT", kind: "STRAIGHT_SPLIT", within: "OPENING", line: "VERTICAL_CENTERLINE" },
      { featureId: "CUT-LEFT", kind: "CROSSCUT", fromEnd: "LEFT", distanceIn: cutLeft },
      { featureId: "CUT-RIGHT", kind: "CROSSCUT", fromEnd: "RIGHT", distanceIn: cutRight },
    ],
    returnAllPieces: true,
  };
}

const SUPPORTED_OPS = new Set(["board-workpiece", "part-groups", "depth-strips", "plan-groups", "sheet-opening"]);

export function compileRecipe(recipe: Recipe, inputs: Inputs): CompileResult {
  const trace: TraceStep[] = [];
  const blockers: CompileResult["blockers"] = [];
  const op = String(recipe.rule.op ?? "");
  let demand: Record<string, unknown> | null = null;
  if (op === "board-workpiece") demand = boardDemand(recipe.rule, inputs, recipe, trace, blockers);
  else if (op === "part-groups") demand = partGroups(recipe.rule, inputs, recipe, trace, blockers);
  else if (op === "depth-strips") demand = depthStrips(recipe.rule, inputs, recipe, trace, blockers);
  else if (op === "plan-groups") demand = planGroups(recipe.rule, inputs, recipe, trace, blockers);
  else if (op === "sheet-opening") demand = sheetOpening(recipe.rule, inputs, recipe, trace, blockers);
  else if (op === "window-seat-layout") {
    const seat = compileWindowSeat(inputs, recipe.configurationId);
    trace.push(...seat.trace);
    blockers.push(...seat.blockers);
    demand = seat.demand;
  } else {
    blockers.push(block("ENGINE_EXTENSION_REQUIRED", op || "rule", "SYSTEM"));
  }
  if (demand) {
    const shape = shapeProblems(demand, DEFINITION_SHAPES[recipe.requestType]);
    for (const code of shape) blockers.push(block(code, "demand", "SYSTEM"));
    if (shape.length) demand = null;
  }
  if (blockers.length) demand = null;
  return {
    recipeId: recipe.recipeId,
    recipeVersion: recipe.version,
    requestType: recipe.requestType,
    demand,
    requirements: recipe.requirements,
    trace,
    blockers,
    engine: SUPPORTED_OPS.has(op) ? "supported" : "extension",
    extensionId: SUPPORTED_OPS.has(op) ? undefined : op,
  };
}

export function isSupportedOp(op: string): boolean {
  return SUPPORTED_OPS.has(op);
}
