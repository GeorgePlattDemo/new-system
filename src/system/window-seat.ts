/**
 * Engine extension `window-seat-layout/1`.
 * This is not a data-only job. The tower, seat and cubby geometry is a named rule
 * ported from the Window Seat design explanation. A new job does not get this
 * behavior by editing a recipe alone.
 *
 * Stated rules:
 * - Board thickness in the elevation is 3/4 in (T = 0.75). It is a design thickness, not a Store price.
 * - Boards across the depth: the fewest 1× boards whose share of the depth is no wider than 11.25 in, and never more than 6.
 * - A run width that matches a dressed width is that nominal board. A run width between dressed widths is the next wider board, ripped to the run width.
 * - Dressed widths are the ordinary lumber sizes 1.5, 2.5, 3.5, 5.5, 7.25, 9.25, 11.25 for nominal 2, 3, 4, 6, 8, 10, 12.
 * - Tower shelves: the top shelf lines up with the center upper shelf (the window-head line). Shelves below divide the space under it evenly.
 * - Side spots, when asked, are only centered, 1.5 in inset, or 2 in inset. Any other inset is not invented and is not sent.
 */
import type { Inputs, TraceStep } from "./recipe.ts";
import { numberBinding } from "./recipe.ts";

const T = 0.75;
const DRESSED = [
  { n: 2, a: 1.5 },
  { n: 3, a: 2.5 },
  { n: 4, a: 3.5 },
  { n: 6, a: 5.5 },
  { n: 8, a: 7.25 },
  { n: 10, a: 9.25 },
  { n: 12, a: 11.25 },
];
const WIDEST = DRESSED[DRESSED.length - 1].a;

const r3 = (v: number) => Math.round(v * 1000) / 1000;

export function derivedRuns(depth: number): number {
  for (let n = 1; n <= 6; n++) if (depth / n <= WIDEST + 1e-9) return n;
  return 6;
}

function boardFor(w: number): { nominalW: number; mill: number | null } | null {
  const exact = DRESSED.find((d) => Math.abs(d.a - w) < 0.001);
  if (exact) return { nominalW: exact.n, mill: null };
  const wider = DRESSED.find((d) => d.a > w + 0.001);
  if (!wider) return null;
  return { nominalW: wider.n, mill: r3(w) };
}

type Run = { id: string; len: number; w: number; owner: string; role: string };
type Feat = { id: string; role: string; len: number; runs: { id: string; len: number; w: number }[]; shelfDatums?: number[] };

function spot(featureId: string, xIn: number, place: string) {
  if (place === "CENTER") return { featureId, xIn: r3(xIn), acrossWidthRule: "CENTERED_ON_WIDE_FACE" };
  const inset = place === "1.5" ? 1.5 : place === "2" ? 2 : null;
  if (inset == null) return null;
  return { featureId, xIn: r3(xIn), acrossWidthRule: "INSET_FROM_EDGE", insetFromEdgeIn: inset };
}

export function compileWindowSeat(inputs: Inputs, configurationId: string): {
  demand: Record<string, unknown> | null;
  trace: TraceStep[];
  blockers: { code: string; fact: string; owner: "USER" | "PROJECT" | "SYSTEM" }[];
} {
  const trace: TraceStep[] = [];
  const blockers: { code: string; fact: string; owner: "USER" | "PROJECT" | "SYSTEM" }[] = [];
  const need = (id: string) => {
    const got = numberBinding({ input: id }, inputs);
    if (!got.ok || !(got.value > 0)) {
      blockers.push({ code: "MISSING_INPUT", fact: id, owner: "USER" });
      return null;
    }
    return got.value;
  };
  const countAtLeast = (id: string, min: number) => {
    const got = numberBinding({ input: id }, inputs);
    if (!got.ok) {
      blockers.push({ code: "MISSING_INPUT", fact: id, owner: "USER" });
      return null;
    }
    if (!Number.isInteger(got.value)) {
      blockers.push({ code: "COUNT_MUST_BE_A_WHOLE_NUMBER", fact: id, owner: "USER" });
      return null;
    }
    if (got.value < min) {
      blockers.push({ code: "VALUE_BELOW_MINIMUM", fact: id, owner: "USER" });
      return null;
    }
    return got.value;
  };
  const H = need("heightIn");
  const leftW = need("leftWidthIn");
  const centerW = need("centerWidthIn");
  const rightW = need("rightWidthIn");
  const depth = need("depthIn");
  const seat = need("seatHeightIn");
  const upperH = need("upperClearIn");
  const bays = countAtLeast("upperBays", 1);
  const cub = countAtLeast("cubbies", 1);
  const leftShelves = countAtLeast("leftShelves", 0);
  const rightShelves = countAtLeast("rightShelves", 0);
  const species = inputs.species;
  if (typeof species !== "string" || !species.trim()) blockers.push({ code: "MISSING_INPUT", fact: "species", owner: "USER" });
  if (blockers.length || H == null || leftW == null || centerW == null || rightW == null || depth == null || seat == null || upperH == null || bays == null || cub == null || leftShelves == null || rightShelves == null) {
    return { demand: null, trace, blockers };
  }

  const runs = inputs.runsSet == null || inputs.runsSet === "" ? derivedRuns(depth) : Number(inputs.runsSet);
  if (!Number.isInteger(runs) || runs < 1 || runs > 6) {
    blockers.push({ code: "RUNS_OUT_OF_RANGE", fact: "runsSet", owner: "USER" });
    return { demand: null, trace, blockers };
  }
  const runW = r3(depth / runs);
  const board = boardFor(runW);
  trace.push({
    id: "depth-runs",
    rule: "window-seat-layout/1",
    formula: "fewest n in 1..6 with depth/n <= 11.25; run width = depth/n",
    inputs: { depth, runsSet: inputs.runsSet ?? null },
    output: { runs, runW, board },
  });
  if (!board) {
    blockers.push({ code: "RUN_WIDER_THAN_DRESSED_STOCK", fact: "depthIn", owner: "PROJECT" });
    return { demand: null, trace, blockers };
  }

  const seq: Record<string, number> = {};
  const feats: Feat[] = [];
  function feat(asm: string, role: string, len: number, extra?: { shelfDatums?: number[] }): Feat {
    const pre = asm.replace("ASM-", "").charAt(0);
    const key = pre + "-" + role;
    seq[key] = (seq[key] || 0) + 1;
    const id = key + "-" + String(seq[key]).padStart(2, "0");
    const runsHere = Array.from({ length: runs }, (_, i) => ({ id: `${id}-R${i + 1}`, len: r3(len), w: runW }));
    const f: Feat = { id, role, len: r3(len), runs: runsHere, ...extra };
    feats.push(f);
    return f;
  }
  const height = Number(H);
  const upper = Number(upperH);
  function tower(asm: string, w: number, count: number) {
    feat(asm, "UPRIGHT", height);
    feat(asm, "UPRIGHT", height);
    feat(asm, "TOP", w - 2 * T);
    feat(asm, "BOTTOM", w - 2 * T);
    const datum = height - T - upper - T;
    const shelfDatums: number[] = [];
    if (count >= 1) {
      const bay = (datum - T - (count - 1) * T) / count;
      for (let i = 1; i < count; i++) {
        const y = T + i * bay + (i - 1) * T;
        shelfDatums.push(r3(y));
        feat(asm, "SHELF", w - 2 * T);
      }
      shelfDatums.push(r3(datum));
      feat(asm, "SHELF", w - 2 * T, { shelfDatums });
    }
    return { datum: r3(datum), shelfDatums };
  }
  const left = tower("ASM-LEFT", leftW, leftShelves);
  const right = tower("ASM-RIGHT", rightW, rightShelves);
  feat("ASM-CENTER", "UPRIGHT", H);
  feat("ASM-CENTER", "UPRIGHT", H);
  feat("ASM-CENTER", "TOP", centerW - 2 * T);
  feat("ASM-CENTER", "BOTTOM", centerW - 2 * T);
  const uy = H - T - upperH - T;
  feat("ASM-CENTER", "UPPER-SHELF", centerW - 2 * T);
  for (let j = 1; j < bays; j++) feat("ASM-CENTER", "UPPER-DIVIDER", upperH);
  feat("ASM-CENTER", "SEAT", centerW - 2 * T);
  const lowH = seat - 2 * T;
  for (let k = 1; k < cub; k++) feat("ASM-CENTER", "LOWER-DIVIDER", lowH);
  if (inputs.frontAdded === true) {
    feat("ASM-CENTER", "FRONT", centerW);
  }
  trace.push({
    id: "elevation",
    rule: "window-seat-layout/1",
    formula: "T=0.75; tower datum = H - T - upperClear - T; shelves divide the space under the datum",
    inputs: { H, leftW, centerW, rightW, seat, upperH, bays, cub, leftShelves, rightShelves, T },
    output: { leftDatum: left.datum, rightDatum: right.datum, windowHead: r3(uy), featureCount: feats.length },
  });

  const place = typeof inputs.sideSpot === "string" ? inputs.sideSpot : "";
  const spots: Record<string, Record<string, unknown>[]> = {};
  if (place) {
    if (!["CENTER", "1.5", "2"].includes(place)) {
      blockers.push({ code: "SPOT_INSET_NOT_DECLARED", fact: "sideSpot", owner: "USER" });
      return { demand: null, trace, blockers };
    }
    for (const [asm, tw] of [
      ["ASM-LEFT", left],
      ["ASM-RIGHT", right],
    ] as const) {
      for (const f of feats.filter((item) => item.id.startsWith(asm.replace("ASM-", "").charAt(0) + "-UPRIGHT"))) {
        f.runs.forEach((r) => {
          tw.shelfDatums.forEach((y, i) => {
            const s = spot(`${r.id}-S${String(i + 1).padStart(2, "0")}`, y, place);
            if (s) (spots[r.id] ||= []).push(s);
          });
        });
      }
    }
  }

  const groupOf = (role: string) => (role === "UPRIGHT" ? "SIDES" : role === "FRONT" ? "FRONT" : "SHELVES");
  const packages: Record<string, Record<string, unknown>> = {};
  const boards: Run[] = [];
  for (const f of feats) {
    if (!(f.len > 0.01)) {
      blockers.push({ code: "PART_LENGTH_NOT_POSITIVE", fact: f.id, owner: "PROJECT" });
      continue;
    }
    for (const r of f.runs) {
      boards.push({ ...r, owner: f.id, role: f.role });
      const key = groupOf(f.role) + "-1X" + board.nominalW + (board.mill != null ? "-TO-" + String(board.mill).replace(".", "P") : "");
      if (!packages[key]) {
        packages[key] = {
          packageId: key,
          material: { species, form: "board", nominalT: 1, nominalW: board.nominalW, grade: "select" },
          endCut: { angleDeg: 0 },
          ...(board.mill != null ? { finishedWidthIn: board.mill } : {}),
          parts: [],
        };
      }
      const part: Record<string, unknown> = { partId: r.id, lengthIn: r.len };
      if (spots[r.id]?.length) part.spots = spots[r.id];
      (packages[key].parts as unknown[]).push(part);
    }
  }
  if (blockers.length) return { demand: null, trace, blockers };

  const itemLines: Record<string, unknown>[] = [];
  const gauge = inputs.screwGauge;
  const finish = inputs.screwFinish;
  const screwLen = inputs.screwLengthIn;
  const screwQty = inputs.screwQty;
  const anyScrew = [gauge, finish, screwLen, screwQty].some((v) => v !== undefined && v !== null && v !== "");
  if (anyScrew) {
    const len = Number(screwLen);
    const qty = Number(screwQty);
    if (typeof gauge !== "string" || !gauge || typeof finish !== "string" || !finish || !(len > 0) || !Number.isInteger(qty) || qty < 1) {
      blockers.push({ code: "SCREWS_INCOMPLETE", fact: "screws", owner: "USER" });
      return { demand: null, trace, blockers };
    }
    itemLines.push({
      lineId: "SCREWS",
      qty,
      requirement: { kind: "wood-screw", gauge, lengthIn: len, finish, unit: "piece" },
    });
  }

  const demand: Record<string, unknown> = {
    configurationId,
    configurationVersion: "1",
    cutPackages: Object.values(packages),
    ...(itemLines.length ? { itemLines } : {}),
  };
  trace.push({
    id: "packages",
    rule: "window-seat-layout/1",
    formula: "group uprights, shelves and the optional front; rip only when the run is not a dressed width",
    inputs: { runW, nominalW: board.nominalW, finishedWidthIn: board.mill },
    output: { packages: Object.keys(packages), parts: boards.length },
  });
  return { demand, trace, blockers };
}
