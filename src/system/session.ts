import { calculationHash } from "./hash.ts";
import { createId } from "./ids.ts";
import { compileRecipe } from "./compile.ts";
import { recipeById } from "./recipes/library.ts";
import { RECORD_SCHEMA } from "./store-candidate.ts";
import { serializeRequest, interpretStoreHttp, type Interpreted } from "./store/interpret.ts";
import { acceptOffer, type AcceptedPacket, type Decision } from "./acceptance.ts";
import type { Inputs, Recipe, SystemRequirements, TraceStep } from "./recipe.ts";
import type { RequestType } from "./shape.ts";

export type Revision = {
  revisionId: string;
  definitionId: string;
  savedAt: string;
  inputs: Inputs;
  requestType: RequestType;
  demand: Record<string, unknown> | null;
  requirements: SystemRequirements;
  trace: TraceStep[];
  blockers: { code: string; fact: string; owner: string }[];
};

export type Attempt = {
  attemptId: string;
  requestId: string;
  projectId: string;
  revisionId: string;
  sentBody: string;
  sentDigest: string;
  state: "pending" | "answered" | "transport" | "protocol" | "rejected-late";
  interpreted?: Interpreted;
};

export type Project = {
  projectId: string;
  recipeId: string;
  recipeVersion: string;
  title: string;
  definitionId: string;
  classId: string;
  inputs: Inputs;
  dirty: boolean;
  revisions: Revision[];
  currentRevisionId: string | null;
  attempts: Attempt[];
  activeAttemptId: string | null;
  /** False after reopen or edit. A saved answer cannot be accepted until a new inquiry. */
  pricesCurrent: boolean;
  decisions: Decision[];
  packets: AcceptedPacket[];
};

export type RecordFile = {
  schema: typeof RECORD_SCHEMA;
  projects: Project[];
};

export function emptyRecord(): RecordFile {
  return { schema: RECORD_SCHEMA, projects: [] };
}

export function loadRecord(raw: unknown): { ok: true; record: RecordFile } | { ok: false; code: "MALFORMED" | "UNSUPPORTED_VERSION" } {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { ok: false, code: "MALFORMED" };
  const schema = (raw as { schema?: unknown }).schema;
  if (schema !== RECORD_SCHEMA) return { ok: false, code: schema == null ? "MALFORMED" : "UNSUPPORTED_VERSION" };
  if (!Array.isArray((raw as { projects?: unknown }).projects)) return { ok: false, code: "MALFORMED" };
  return { ok: true, record: raw as RecordFile };
}

function revisionIdFor(recipe: Recipe, inputs: Inputs, demand: unknown): string {
  return calculationHash({ recipeId: recipe.recipeId, version: recipe.version, inputs, demand }).slice(0, 16);
}

export function openRecipe(record: RecordFile, recipeId: string, now = new Date().toISOString()): { record: RecordFile; projectId: string } | { error: string } {
  const recipe = recipeById(recipeId);
  if (!recipe) return { error: "RECIPE_NOT_IN_LIBRARY" };
  const projectId = createId("project");
  const project: Project = {
    projectId,
    recipeId: recipe.recipeId,
    recipeVersion: recipe.version,
    title: recipe.title,
    definitionId: createId("definition"),
    classId: recipe.classId ?? recipe.requestType,
    inputs: { ...recipe.defaults },
    dirty: true,
    revisions: [],
    currentRevisionId: null,
    attempts: [],
    activeAttemptId: null,
    pricesCurrent: false,
    decisions: [],
    packets: [],
  };
  const saved = saveRevision({ ...record, projects: [...record.projects, project] }, projectId, now);
  if ("error" in saved) return saved;
  return { record: saved.record, projectId };
}

export function projectOf(record: RecordFile, projectId: string): Project | undefined {
  return record.projects.find((project) => project.projectId === projectId);
}

function replace(record: RecordFile, project: Project): RecordFile {
  return { ...record, projects: record.projects.map((item) => (item.projectId === project.projectId ? project : item)) };
}

export function setInput(record: RecordFile, projectId: string, key: string, value: string | number | boolean | null): RecordFile | { error: string } {
  const project = projectOf(record, projectId);
  const recipe = project && recipeById(project.recipeId);
  if (!project || !recipe) return { error: "PROJECT_NOT_FOUND" };
  if (!recipe.inputs.some((input) => input.id === key)) return { error: "UNKNOWN_INPUT" };
  return replace(record, {
    ...project,
    inputs: { ...project.inputs, [key]: value },
    dirty: true,
    activeAttemptId: null,
    pricesCurrent: false,
  });
}

export function saveRevision(record: RecordFile, projectId: string, now = new Date().toISOString()): { record: RecordFile; revision: Revision } | { error: string } {
  const project = projectOf(record, projectId);
  const recipe = project && recipeById(project.recipeId);
  if (!project || !recipe) return { error: "PROJECT_NOT_FOUND" };
  const compiled = compileRecipe(recipe, project.inputs);
  const revision: Revision = {
    revisionId: revisionIdFor(recipe, project.inputs, compiled.demand),
    definitionId: project.definitionId,
    savedAt: now,
    inputs: { ...project.inputs },
    requestType: compiled.requestType,
    demand: compiled.demand,
    requirements: compiled.requirements,
    trace: compiled.trace,
    blockers: compiled.blockers,
  };
  const same = project.revisions.find((item) => item.revisionId === revision.revisionId);
  const revisions = same ? project.revisions.map((item) => (item.revisionId === revision.revisionId ? { ...revision, savedAt: item.savedAt } : item)) : [...project.revisions, revision];
  const changed = project.currentRevisionId !== revision.revisionId;
  return {
    record: replace(record, {
      ...project,
      revisions,
      currentRevisionId: revision.revisionId,
      dirty: false,
      activeAttemptId: changed ? null : project.activeAttemptId,
      pricesCurrent: changed ? false : project.pricesCurrent,
    }),
    revision,
  };
}

export function currentRevision(project: Project): Revision | undefined {
  return project.revisions.find((revision) => revision.revisionId === project.currentRevisionId);
}

export type InquiryStart =
  | { ok: false; code: string; blockers?: Revision["blockers"] }
  | { ok: true; record: RecordFile; attempt: Attempt };

export function beginInquiry(record: RecordFile, projectId: string): InquiryStart {
  const project = projectOf(record, projectId);
  if (!project) return { ok: false, code: "PROJECT_NOT_FOUND" };
  if (project.dirty) return { ok: false, code: "UNSAVED_EDITS" };
  const revision = currentRevision(project);
  if (!revision) return { ok: false, code: "NO_REVISION" };
  if (revision.blockers.length || !revision.demand) return { ok: false, code: "ADMISSION_BLOCKED", blockers: revision.blockers };
  if (revision.requestType === "USER_DEFINED_BOARD_V1" || revision.requestType === "CUT_PACKAGE_V1" || revision.requestType === "SHEET_PACKAGE_V1") {
    // retired names are not recipe request types; a demand that smuggled one would still be the recipe's type
  }
  const requestId = createId("inquiry");
  const sent = serializeRequest({ requestType: revision.requestType, requestId, demand: revision.demand });
  const attempt: Attempt = {
    attemptId: requestId,
    requestId,
    projectId,
    revisionId: revision.revisionId,
    sentBody: sent.body,
    sentDigest: sent.digest,
    state: "pending",
  };
  return {
    ok: true,
    attempt,
    record: replace(record, {
      ...project,
      attempts: [...project.attempts, attempt],
      activeAttemptId: attempt.attemptId,
      pricesCurrent: false,
    }),
  };
}

export function applyInquiryResult(
  record: RecordFile,
  projectId: string,
  attemptId: string,
  httpStatus: number,
  responseText: string,
): { record: RecordFile; applied: boolean; code: string } {
  const project = projectOf(record, projectId);
  if (!project) return { record, applied: false, code: "PROJECT_NOT_FOUND" };
  const attempt = project.attempts.find((item) => item.attemptId === attemptId);
  if (!attempt) return { record, applied: false, code: "UNKNOWN_ATTEMPT" };
  const late = project.activeAttemptId !== attemptId || attempt.revisionId !== project.currentRevisionId || project.projectId !== projectId;
  if (late) {
    const attempts = project.attempts.map((item) => (item.attemptId === attemptId ? { ...item, state: "rejected-late" as const } : item));
    return { record: replace(record, { ...project, attempts }), applied: false, code: "REJECTED_LATE" };
  }
  const revision = currentRevision(project);
  const interpreted = interpretStoreHttp({
    sentBody: attempt.sentBody,
    sentDigest: attempt.sentDigest,
    requestType: revision?.requestType ?? "",
    requestId: attempt.requestId,
    demand: revision?.demand,
    httpStatus,
    responseText,
  });
  const state: Attempt["state"] = interpreted.outcome === "answer" ? "answered" : interpreted.outcome === "transport" ? "transport" : "protocol";
  const attempts = project.attempts.map((item) => (item.attemptId === attemptId ? { ...item, state, interpreted } : item));
  return {
    record: replace(record, {
      ...project,
      attempts,
      pricesCurrent: interpreted.outcome === "answer",
    }),
    applied: true,
    code: interpreted.outcome === "answer" ? "ANSWERED" : interpreted.code,
  };
}

export function markTransport(record: RecordFile, projectId: string, attemptId: string, code = "STORE_UNREACHABLE"): RecordFile {
  const applied = applyInquiryResult(record, projectId, attemptId, 0, "");
  if (!applied.applied) return applied.record;
  const project = projectOf(applied.record, projectId);
  if (!project) return applied.record;
  const attempts = project.attempts.map((item) =>
    item.attemptId === attemptId ? { ...item, state: "transport" as const, interpreted: { outcome: "transport" as const, code } } : item,
  );
  return replace(applied.record, { ...project, attempts, pricesCurrent: false });
}

export function acceptCurrent(record: RecordFile, projectId: string, now = new Date().toISOString()): { record: RecordFile; code: string; duplicate?: boolean } {
  const project = projectOf(record, projectId);
  if (!project) return { record, code: "PROJECT_NOT_FOUND" };
  if (project.dirty || !project.pricesCurrent) return { record, code: "ANSWER_NOT_CURRENT" };
  const revision = currentRevision(project);
  const attempt = project.attempts.find((item) => item.attemptId === project.activeAttemptId);
  if (!revision?.demand || !attempt || attempt.state !== "answered" || attempt.interpreted?.outcome !== "answer") {
    return { record, code: "ANSWER_NOT_CURRENT" };
  }
  if (attempt.revisionId !== revision.revisionId) return { record, code: "ANSWER_NOT_CURRENT" };
  const answer = attempt.interpreted.answer;
  const receiptHash = (answer.evaluationReceipt as { receiptHash?: string } | undefined)?.receiptHash;
  const existing = project.decisions.find((decision) => decision.revisionId === revision.revisionId && decision.receiptHash === receiptHash);
  if (existing) return { record, code: "ALREADY_ACCEPTED", duplicate: true };
  const accepted = acceptOffer({
    decisions: project.decisions,
    projectId,
    classId: project.classId,
    title: project.title,
    definitionId: project.definitionId,
    revisionId: revision.revisionId,
    requestType: revision.requestType,
    demand: revision.demand,
    requirements: revision.requirements,
    answer,
    now,
  });
  if (!accepted.ok) return { record, code: accepted.code };
  return {
    record: replace(record, {
      ...project,
      decisions: [...project.decisions, accepted.decision],
      packets: [...project.packets, accepted.packet],
    }),
    code: "ACCEPTED_SIMULATED",
    duplicate: false,
  };
}

/** Looking at one project retires every other project's in-flight attempt. */
export function selectProject(record: RecordFile, projectId: string): RecordFile {
  return {
    ...record,
    projects: record.projects.map((project) =>
      project.projectId === projectId ? project : { ...project, activeAttemptId: null, pricesCurrent: false },
    ),
  };
}
/** A reload or a return to a saved project keeps the file and retires the live answer. */
export function parkForReopen(record: RecordFile): RecordFile {
  return {
    ...record,
    projects: record.projects.map((project) => ({
      ...project,
      activeAttemptId: null,
      pricesCurrent: false,
    })),
  };
}

export function reopen(record: RecordFile, projectId: string): RecordFile | { error: string } {
  const project = projectOf(record, projectId);
  if (!project) return { error: "PROJECT_NOT_FOUND" };
  return replace(record, { ...project, activeAttemptId: null, pricesCurrent: false, dirty: false });
}

export function visibleState(project: Project | undefined): string {
  if (!project) return "missing";
  const revision = currentRevision(project);
  if (!revision || project.dirty) return revision?.blockers.length && project.dirty ? "draft" : project.dirty ? "draft" : "draft";
  if (revision.blockers.length || !revision.demand) return "admission_blocked";
  const decision = project.decisions.find((item) => item.revisionId === revision.revisionId);
  const attempt = project.attempts.find((item) => item.attemptId === project.activeAttemptId);
  if (decision && project.pricesCurrent && attempt?.state === "answered") return "accepted_simulated";
  if (!attempt || attempt.revisionId !== revision.revisionId) return "ready";
  if (attempt.state === "pending") return "inquiry_pending";
  if (attempt.state === "transport") return "transport_failure";
  if (attempt.state === "protocol" || attempt.state === "rejected-late") return "protocol_failure";
  if (attempt.interpreted?.outcome !== "answer") return "protocol_failure";
  const status = String(attempt.interpreted.answer.status ?? "");
  if (attempt.interpreted.answer.requestType === "OFFERING_LOOKUP") return "discovery";
  if (status === "SUPPORTABLE") return "supportable";
  if (status === "NOT_ALL_LINES_SUPPORTABLE") return "partial";
  if (status === "REFUSED") return "refused";
  if (status === "UNRESOLVED") return "unresolved";
  if (status === "UNAVAILABLE") return "unavailable";
  return "answered";
}
