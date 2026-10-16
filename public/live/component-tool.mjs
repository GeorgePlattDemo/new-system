import { admit, inquire } from "./shared/tile-host-admission-contract.mjs";
import { STATUS } from "./shared/definition-contract.mjs";

// This is a registered tool using the existing definition admission mechanism, not a sixth tile.
const toolId = "registered-components",
  scope = "CUT_PACKAGE_V1";
const profiles = {
  [toolId]: {
    version: "1",
    scopes: {
      [scope]: {
        requestType: scope,
        requires: [
          {
            id: "component-definition",
            owner: "PROJECT",
            kind: "object",
            title: "Complete registered definition",
            form: {
              fields: {
                configurationId: "text",
                configurationVersion: "text",
                cutPackages: "nonempty-list",
              },
            },
          },
          {
            id: "component-manifest",
            owner: "PROJECT",
            kind: "object",
            title: "Independent source manifest",
          },
        ],
      },
    },
  },
};
const $ = (id) => document.getElementById(id);
const flow = window.STBTermsFlow.create({
  projectId: toolId,
  title: "Registered component work",
  demoCommerce: true,
});
window.STBTermsFlow.installStyle(document);
const record = {
  schema: "STB-COMPONENT-TOOL-1",
  revisions: [],
  inquiries: [],
  commercialStates: [],
  accepted: [],
};
let tools = [],
  generation = 0,
  current = null;
function download(name, value) {
  const link = document.createElement("a");
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }),
  );
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function invalidate() {
  generation++;
  current = null;
  flow.invalidate();
  $("packet").disabled = true;
  $("ask").disabled = true;
  $("parts").replaceChildren();
  $("revision").textContent = "";
  $("result").textContent = "Definition changed. Prepare and review this revision before inquiry.";
}
function renderTerms() {
  const state = flow.state();
  if (state.commercial) record.commercialStates.push(structuredClone(state));
  const host = $("terms");
  host.innerHTML = flow.renderChain() + flow.renderControls("call");
  $("packet").disabled = !state.commercial?.events?.some(
    (event) =>
      event.eventType === "CustomerDecisionRecorded" && event.payload.decision === "ACCEPTED",
  );
}
flow.bind($("terms"));
flow.onChange(renderTerms);
function renderInputs() {
  invalidate();
  const recipe = tools.find((tool) => tool.recipeId === $("recipe").value);
  $("scope").textContent = recipe.narrative;
  const host = $("inputs");
  host.replaceChildren();
  for (const input of recipe.inputs) {
    const label = document.createElement("label");
    label.append(input.label);
    const control = document.createElement(input.kind === "choice" ? "select" : "input");
    control.name = input.id;
    control.id = "input-" + input.id;
    if (input.choices)
      for (const choice of input.choices) {
        const option = document.createElement("option");
        option.value = choice.value;
        option.textContent = choice.label;
        control.append(option);
      }
    else {
      control.type = input.kind === "number" ? "number" : "text";
      if (control.type === "number") control.step = "any";
    }
    control.value = recipe.defaults[input.id] ?? "";
    label.append(control);
    host.append(label);
  }
}
$("recipe").addEventListener("change", renderInputs);
$("inputs").addEventListener("input", invalidate);
$("inputs").addEventListener("change", invalidate);
$("definition").addEventListener("submit", async (event) => {
  event.preventDefault();
  const started = ++generation;
  current = null;
  flow.invalidate();
  $("packet").disabled = true;
  $("ask").disabled = true;
  $("prepare").disabled = true;
  try {
    const recipe = tools.find((tool) => tool.recipeId === $("recipe").value),
      inputs = {};
    for (const input of recipe.inputs) {
      const raw = $("input-" + input.id).value;
      inputs[input.id] = input.kind === "number" && raw !== "" ? Number(raw) : raw;
    }
    const response = await fetch("/api/component-definition", {
      method: "POST",
      headers: { "content-type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ recipeId: recipe.recipeId, inputs }),
    });
    const definition = await response.json();
    if (generation !== started) return;
    record.revisions.push(definition);
    $("parts").replaceChildren();
    if (!response.ok || !definition.payload || definition.blockers.length) {
      $("result").textContent =
        definition.error ||
        definition.blockers.map((block) => block.code + ": " + block.fact).join("; ");
      return;
    }
    $("revision").textContent = "Definition revision: " + definition.revision;
    for (const group of definition.payload.definition.cutPackages)
      for (const part of group.parts) {
        const row = document.createElement("tr");
        for (const value of [
          part.partId,
          group.material.nominalT + "×" + group.material.nominalW,
          part.lengthIn,
          "Square · parallel",
        ]) {
          const cell = document.createElement("td");
          cell.textContent = value;
          row.append(cell);
        }
        $("parts").append(row);
      }
    current = { definition, body: null };
    $("ask").disabled = false;
    $("result").textContent =
      "Review every component blank, its material and length. Confirm to request a fresh Store answer.";
  } catch (error) {
    if (generation === started) $("result").textContent = error.message;
  } finally {
    $("prepare").disabled = false;
  }
});
$("ask").addEventListener("click", async () => {
  const selected = current,
    started = generation;
  if (!selected) return;
  const definition = selected.definition;
  flow.invalidate();
  $("packet").disabled = true;
  $("ask").disabled = true;
  try {
    const admission = admit({
      profiles,
      revision: {
        definitionRevisionId: definition.revision,
        tileId: toolId,
        facts: {
          "component-definition": {
            status: STATUS.CONFIRMED,
            value: definition.payload.definition,
          },
          "component-manifest": { status: STATUS.DERIVED, value: definition.manifest },
        },
      },
      inquiryScope: scope,
    });
    const result = await inquire(admission, (admitted) =>
      window.STBStoreClient.sendAdmittedJob({ admitted, payload: definition.payload }),
    );
    record.inquiries.push({ definitionRevision: definition.revision, result });
    if (generation !== started) return;
    if (!result.reachedStore) throw new Error("COMPONENT_ADMISSION_BLOCKED");
    const body = result.answer.body || result.answer;
    current = { definition, body };
    const status = body.rawEvaluation?.status,
      total = body.rawEvaluation?.totals?.Q;
    $("result").textContent =
      status === "SUPPORTABLE"
        ? "Store answer: $" + total.toFixed(2)
        : status + " · " + (body.rawEvaluation?.reasonCodes || body.reasonCodes || []).join(", ");
    flow.setAnswer({
      version: definition.revision,
      status,
      total,
      reasons: body.rawEvaluation?.reasonRecords || [],
      body,
    });
  } catch (error) {
    if (generation === started) $("result").textContent = error.message;
  } finally {
    if (generation === started) $("ask").disabled = false;
  }
});
$("packet").addEventListener("click", async () => {
  const selected = current,
    result = await flow.acceptedPacket();
  if (current !== selected || result.status !== "ACCEPTED_PACKET_READY") {
    $("result").textContent = "A current accepted definition is required.";
    return;
  }
  record.accepted.push({
    definitionRevision: selected.definition.revision,
    packet: result.packet,
    commercial: flow.state().commercial,
  });
  download("component-accepted-packet.json", result.packet);
});
$("record").addEventListener("click", () => download("component-owner-record.json", record));
try {
  const response = await fetch("/api/component-definition", { cache: "no-store" });
  if (!response.ok) throw new Error("COMPONENT_REGISTRATION_UNAVAILABLE");
  tools = (await response.json()).tools;
  for (const tool of tools) {
    const option = document.createElement("option");
    option.value = tool.recipeId;
    option.textContent = tool.title;
    $("recipe").append(option);
  }
  renderInputs();
} catch (error) {
  $("result").textContent = error.message;
  $("ask").disabled = true;
}
