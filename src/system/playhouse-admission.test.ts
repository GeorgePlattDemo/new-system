import assert from "node:assert/strict";
import test from "node:test";

/*
 * The Playhouse job's admission profile (v0.3): the wood from the Store, the opening, and the tools the job brought.
 * A missing or invalid fact blocks before the Store and names its owner; a complete job is admitted whatever its values,
 * because the Store, not admission, decides whether it can do the job.
 */

type Json = Record<string, any>;
const contract: {
  admit: (input: { revision: Json; inquiryScope: string }) => Json;
} = await import(new URL("../../public/live/shared/tile-host-admission-contract.mjs", import.meta.url).href);

const sheet = { thicknessIn: 0.5, lengthIn: 96, widthIn: 48, species: "pine", grade: "sheathing-4ply", storeSku: "STB-ZERO-PLY-050-48X96-001" };
const opening = { widthIn: 36, straightHeightIn: 24, riseIn: 12 };
const tools = (extra: Json = {}) => ({ endCuts: { fromLeftIn: 18, fromRightIn: 18 }, manualCuts: [], pattern: null, ...extra });
const revision = (facts: Record<string, unknown>, id = "playhouse-test") => ({
  definitionRevisionId: id,
  tileId: "playhouse",
  facts: Object.fromEntries(Object.entries(facts).map(([key, value]) => [key, { value, status: "CONFIRMED" }])),
});
const admit = (facts: Record<string, unknown>) => contract.admit({ revision: revision(facts), inquiryScope: "SHEET_PACKAGE_V1" });

test("the default Playhouse job is admitted, and what is sent is exactly the declared facts", () => {
  const result = admit({ "playhouse.sheet": sheet, "playhouse.opening": opening, "playhouse.tools": tools() });
  assert.equal(result.admission.result, "ADMITTED");
  assert.deepEqual(result.admission.blocking, []);
  assert.deepEqual(Object.keys(result.request.facts).sort(), ["playhouse.opening", "playhouse.sheet", "playhouse.tools"]);
});

test("a job with no wood from the Store is blocked before the Store, naming what is missing and who owns it", () => {
  const result = admit({ "playhouse.opening": opening, "playhouse.tools": tools() });
  assert.equal(result.admission.result, "BLOCKED");
  assert.equal(result.admission.blocking.length, 1);
  assert.equal(result.admission.blocking[0].factId, "playhouse.sheet");
  assert.equal(result.admission.blocking[0].owner, "USER");
  assert.equal(result.admission.blocking[0].condition, "MISSING");
  assert.match(result.admission.blocking[0].title, /Wood from the Store/);
  assert.equal(result.request, null);
});

test("wood missing its species, grade or SKU is blocked, never filled in", () => {
  for (const missing of ["species", "grade", "storeSku"]) {
    const { [missing]: _removed, ...partial } = sheet as Json;
    const result = admit({ "playhouse.sheet": partial, "playhouse.opening": opening, "playhouse.tools": tools() });
    assert.equal(result.admission.result, "BLOCKED", `${missing} is required`);
  }
});

test("an added cut states its datum and its distance, or the job is blocked", () => {
  const across = { orientation: "ACROSS_WIDTH", fromEnd: "LEFT", distanceIn: 26 };
  const along = { orientation: "ALONG_LENGTH", fromEdge: "TOP", distanceIn: 4 };
  assert.equal(admit({ "playhouse.sheet": sheet, "playhouse.opening": opening, "playhouse.tools": tools({ manualCuts: [across, along] }) }).admission.result, "ADMITTED");
  for (const broken of [
    { orientation: "ACROSS_WIDTH", fromEnd: "LEFT" },
    { orientation: "ACROSS_WIDTH", distanceIn: 26 },
    { orientation: "ALONG_LENGTH", distanceIn: 4 },
    { orientation: "ALONG_LENGTH", fromEdge: "TOP" },
    { orientation: "ACROSS_WIDTH", fromEnd: "LEFT", distanceIn: 0 },
    { orientation: "ACROSS_WIDTH", fromEnd: "LEFT", distanceIn: -3 },
    { fromEnd: "LEFT", distanceIn: 26 },
  ]) {
    const result = admit({ "playhouse.sheet": sheet, "playhouse.opening": opening, "playhouse.tools": tools({ manualCuts: [broken] }) });
    assert.equal(result.admission.result, "BLOCKED", JSON.stringify(broken));
  }
});

test("a pattern states both offsets (zero is a real offset); half a pattern blocks", () => {
  assert.equal(admit({ "playhouse.sheet": sheet, "playhouse.opening": opening, "playhouse.tools": tools({ pattern: { offsetXIn: 0, offsetYIn: 0 } }) }).admission.result, "ADMITTED");
  assert.equal(admit({ "playhouse.sheet": sheet, "playhouse.opening": opening, "playhouse.tools": tools({ pattern: { offsetXIn: -3, offsetYIn: 2.5 } }) }).admission.result, "ADMITTED");
  assert.equal(admit({ "playhouse.sheet": sheet, "playhouse.opening": opening, "playhouse.tools": tools({ pattern: { offsetXIn: 2 } }) }).admission.result, "BLOCKED");
});

test("a job with no tools fact, or an incomplete opening, is blocked", () => {
  assert.equal(admit({ "playhouse.sheet": sheet, "playhouse.opening": opening }).admission.result, "BLOCKED");
  assert.equal(admit({ "playhouse.sheet": sheet, "playhouse.opening": { widthIn: 36, straightHeightIn: 24 }, "playhouse.tools": tools() }).admission.result, "BLOCKED");
});

test("admission never judges the envelope: an oversized opening or a 48 x 48 sheet is admitted and left to the Store", () => {
  assert.equal(admit({ "playhouse.sheet": { ...sheet, lengthIn: 48 }, "playhouse.opening": { widthIn: 48, straightHeightIn: 35, riseIn: 12 }, "playhouse.tools": tools() }).admission.result, "ADMITTED");
});
