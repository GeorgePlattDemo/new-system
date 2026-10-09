import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { calculationHash } from "@/system/hash.ts";
import { recipeById } from "@/system/recipes/library.ts";
import { machineBoundary } from "@/system/machine.ts";
import {
  acceptCurrent,
  applyEvidenceResult,
  applyInquiryResult,
  beginEvidence,
  beginInquiry,
  currentRevision,
  saveRevision,
  selectProject,
  setInput,
  visibleState,
  type Attempt,
  type EvidenceAttempt,
  type RecordFile,
} from "@/system/session.ts";
import { presentMoney } from "@/system/store/interpret.ts";
import { forwardMachineEvidence, forwardStoreRequest, storeHealth } from "@/system/store/forward.ts";
import { STORE_CANDIDATE } from "@/system/store-candidate.ts";
import { useRecord } from "@/components/use-record.ts";

export const Route = createFileRoute("/projects/$projectId")({ component: ProjectPage });

const STATE_LABEL: Record<string, string> = {
  draft: "Unsaved edits. The last answer cannot move.",
  admission_blocked: "Not admitted. Nothing was sent.",
  ready: "Saved. The Store has not been asked for this revision.",
  inquiry_pending: "Inquiry in flight.",
  transport_failure: "Transport failure. Not a Store refusal. Not a zero price.",
  protocol_failure: "The reply did not match the bytes, the release, or the attempt.",
  supportable: "Store answered SUPPORTABLE.",
  partial: "Not every line is supportable. The sum is not a full job Q.",
  refused: "Store answered REFUSED.",
  unresolved: "Store answered UNRESOLVED.",
  unavailable: "Store answered UNAVAILABLE.",
  accepted_simulated: "Accepted as a simulated offer. Nothing was reserved or cut.",
  missing: "This project is not in the saved file.",
};

function ProjectPage() {
  const { projectId } = Route.useParams();
  const { state, update, replaceWithEmpty, savedText } = useRecord();
  const [notice, setNotice] = useState("");
  const selected = useRef<string | null>(null);
  const fileRef = useRef<RecordFile | null>(null);
  if (state.ready && !state.problem) fileRef.current = state.record;

  function commit(next: RecordFile) {
    fileRef.current = next;
    update(next);
  }

  useEffect(() => {
    if (state.ready === false || state.problem) return;
    if (selected.current === projectId) return;
    selected.current = projectId;
    update((current) => selectProject(current, projectId));
  }, [state, projectId, update]);

  if (!state.ready) return <p>Opening the saved file…</p>;
  if (state.problem) {
    return (
      <section className="grid gap-3">
        <p className="text-bad">The saved file cannot be opened ({state.problem}). It was not converted and it was not overwritten.</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="tap rounded-card border border-line px-4" onClick={() => downloadJson("scan-to-build-unreadable.json", state.raw)}>Download the unreadable file</button>
          <button type="button" className="tap rounded-card border border-bad px-4 text-bad" onClick={replaceWithEmpty}>Replace with an empty file</button>
          <Link to="/" className="tap inline-flex items-center rounded-card border border-line px-4 text-brand">Library</Link>
        </div>
      </section>
    );
  }
  const project = state.record.projects.find((item) => item.projectId === projectId);
  if (!project) {
    return (
      <p>
        No project with that id. <Link to="/" className="text-brand">Library</Link>
      </p>
    );
  }
  const recipe = recipeById(project.recipeId);
  const revision = currentRevision(project);
  const status = visibleState(project);
  const attempt = project.attempts.find((item) => item.attemptId === project.activeAttemptId) ?? null;
  const answer = attempt?.interpreted?.outcome === "answer" && project.pricesCurrent ? attempt.interpreted.answer : null;
  const history = [...project.attempts].reverse().find((item) => item.revisionId === revision?.revisionId && item.state === "answered");
  const money = presentMoney(answer);
  const machine = machineBoundary(revision?.requestType ?? null);
  const receiptHash = (answer?.evaluationReceipt as { receiptHash?: string } | undefined)?.receiptHash;
  const currentDecision = revision ? project.decisions.find((item) => item.revisionId === revision.revisionId && item.receiptHash === receiptHash) : undefined;
  const evidenceNow = (project.evidence ?? []).find((item) => item.evidenceId === project.activeEvidenceId) ?? null;

  function onInput(id: string, raw: string, kind: string) {
    const file = fileRef.current;
    if (!file) return;
    const value = kind === "boolean" ? raw === "true" : kind === "number" || kind === "integer" ? (raw === "" ? "" : Number(raw)) : raw;
    const next = setInput(file, projectId, id, value as string | number | boolean);
    if (!("error" in next)) commit(next);
  }

  function onSave() {
    const file = fileRef.current;
    if (!file) return;
    const saved = saveRevision(file, projectId);
    if ("error" in saved) setNotice(saved.error);
    else {
      commit(saved.record);
      setNotice(saved.revision.blockers.length ? "Saved. Admission is blocked, so the Store was not asked." : "Saved as a new revision. A previous answer is now history.");
    }
  }

  async function onAsk() {
    const file = fileRef.current;
    if (!file) return;
    const started = beginInquiry(file, projectId);
    if (!started.ok) {
      setNotice(started.code === "ADMISSION_BLOCKED" ? "Blocked before the Store." : started.code);
      return;
    }
    commit(started.record);
    setNotice("Asking the Store candidate…");
    const res = await forwardStoreRequest({ data: { body: started.attempt.sentBody } });
    const applied = applyInquiryResult(fileRef.current ?? started.record, projectId, started.attempt.attemptId, res.httpStatus, res.body);
    commit(applied.record);
    setNotice(
      applied.applied
        ? "The reply matched this attempt, these bytes, and the inspected Store release."
        : `The reply was not applied (${applied.code}). The visible result was not updated.`,
    );
  }

  function onAccept() {
    const file = fileRef.current;
    if (!file) return;
    const accepted = acceptCurrent(file, projectId);
    commit(accepted.record);
    setNotice(accepted.duplicate ? "Already accepted. No second commercial event." : accepted.code === "ACCEPTED_SIMULATED" ? "Simulated acceptance saved. No inventory, payment, or machine release." : accepted.code);
  }

  async function onEvidence() {
    const file = fileRef.current;
    if (!file) return;
    const health = await storeHealth();
    if (health.httpStatus !== 200) {
      setNotice("Store candidate is not reachable. No virtual evidence was invented.");
      return;
    }
    let advertised: { release?: string; machineEvidence?: { protocol?: string; machineConfigId?: string; machineConfigHash?: string; physicalAuthority?: boolean } };
    try {
      advertised = JSON.parse(health.body);
    } catch {
      setNotice("The Store health reply was not readable. Nothing was sent.");
      return;
    }
    if (advertised.release !== STORE_CANDIDATE.inspectedCommit || advertised.machineEvidence?.protocol !== STORE_CANDIDATE.machineEvidenceProtocol || advertised.machineEvidence.physicalAuthority !== false) {
      setNotice("This Store is not the inspected release, or it did not advertise blocked virtual evidence. Nothing was sent.");
      return;
    }
    const started = beginEvidence(file, projectId, {
      machineConfigId: advertised.machineEvidence.machineConfigId ?? "",
      machineConfigHash: advertised.machineEvidence.machineConfigHash ?? "",
    });
    if (!started.ok) {
      setNotice(started.code === "MACHINE_CONFIGURATION_NOT_INSPECTED" ? "The advertised machine is not the inspected configuration. Nothing was sent." : started.code);
      return;
    }
    commit(started.record);
    setNotice("Asking the Store for virtual evidence…");
    let res: { httpStatus: number; body: string };
    try {
      res = await forwardMachineEvidence({ data: { body: started.evidence.sentBody } });
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "The evidence request was not sent.");
      return;
    }
    const applied = applyEvidenceResult(fileRef.current ?? started.record, projectId, started.evidence.evidenceId, res.httpStatus, res.body);
    commit(applied.record);
    setNotice(applied.applied ? "The evidence reply was checked against the bytes that were sent." : `The evidence reply was not applied (${applied.code}).`);
  }

  return (
    <main className="grid gap-6 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
      <section className="grid content-start gap-3">
        <p className="text-sm text-muted">
          <Link to="/" className="text-brand">Library</Link>
        </p>
        <h1 className="text-4xl">{project.title}</h1>
        {recipe && <p className="text-sm text-muted">{recipe.narrative}</p>}
        {recipe?.engine === "extension" && (
          <p className="rounded-card border border-warn bg-surface px-3 py-2 text-sm text-warn">Engine extension {recipe.extensionId}. Not a data-only job.</p>
        )}
        <div className="grid gap-3">
          {recipe?.inputs.map((input) => (
            <label key={input.id} className="grid gap-1 text-sm">
              <span className="font-semibold">{input.label}</span>
              {input.kind === "choice" ? (
                <select className="tap rounded-card border border-line bg-surface px-3" value={String(project.inputs[input.id] ?? "")} onChange={(event) => onInput(input.id, event.target.value, input.kind)}>
                  <option value="">Choose</option>
                  {input.choices?.map((choice) => (
                    <option key={choice.value} value={choice.value}>{choice.label}</option>
                  ))}
                </select>
              ) : input.kind === "boolean" ? (
                <select className="tap rounded-card border border-line bg-surface px-3" value={String(project.inputs[input.id] ?? "")} onChange={(event) => onInput(input.id, event.target.value, input.kind)}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              ) : (
                <input className="tap rounded-card border border-line bg-surface px-3" value={String(project.inputs[input.id] ?? "")} onChange={(event) => onInput(input.id, event.target.value, input.kind)} inputMode={input.kind === "text" ? "text" : "decimal"} />
              )}
              {input.help && <span className="text-muted">{input.help}</span>}
            </label>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="tap rounded-card bg-brand px-4 text-brand-ink" onClick={onSave}>Save revision</button>
          <button type="button" className="tap rounded-card border border-brand px-4 text-brand" onClick={onAsk} disabled={status === "inquiry_pending"}>Ask the Store</button>
          <button type="button" className="tap rounded-card border border-line px-4" onClick={onAccept} disabled={status !== "supportable" && status !== "accepted_simulated"}>Accept simulated offer</button>
          <button type="button" className="tap rounded-card border border-line px-4" onClick={onEvidence} disabled={status !== "accepted_simulated"}>Ask for virtual evidence</button>
        </div>
      </section>

      <section className="grid min-w-0 content-start gap-4">
        {state.storageError && (
          <div className="rounded-card border border-bad bg-surface p-4 text-sm">
            <p className="text-bad">This device did not keep the latest file. {state.storageError}</p>
            <button type="button" className="tap mt-3 rounded-card border border-line px-4" onClick={() => downloadJson("scan-to-build-record.json", savedText())}>Download what is in this tab</button>
          </div>
        )}
        <div className="rounded-card border border-line bg-surface p-4">
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">State</p>
          <p className="mt-1 text-xl">{STATE_LABEL[status] ?? status}</p>
          {notice && <p className="mt-2 text-sm text-muted">{notice}</p>}
          {revision && (
            <p className="mt-2 text-sm text-muted">Revision {revision.revisionId} · {revision.requestType}</p>
          )}
        </div>

        {revision?.blockers.length ? (
          <div className="rounded-card border border-bad bg-surface p-4">
            <h2 className="text-xl text-bad">Admission blockers</h2>
            <ul className="mt-2 grid gap-1 text-sm">
              {revision.blockers.map((item) => (
                <li key={item.code + item.fact}>{item.code} · {item.fact} · owner {item.owner}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="rounded-card border border-line bg-surface p-4">
          <h2 className="text-xl">Money the Store returned</h2>
          {project.pricesCurrent ? <Money money={money} /> : <p className="text-muted">No current budgetary total. A saved answer is history until you ask again.</p>}
          {!project.pricesCurrent && history?.interpreted?.outcome === "answer" && (
            <p className="mt-2 text-sm text-muted">Last answer on this revision was {String(history.interpreted.answer.status)}. It cannot be accepted and it is not the price.</p>
          )}
        </div>

        {answer && (
          <div className="rounded-card border border-line bg-surface p-4">
            <h2 className="text-xl">Store findings</h2>
            <p className="mt-1 text-sm">Status {String(answer.status)} · request {String(answer.requestId)}</p>
            <ReasonList answer={answer} />
            <FindingLines answer={answer} />
          </div>
        )}

        <div className="rounded-card border border-line bg-surface p-4">
          <h2 className="text-xl">Derived parts</h2>
          <PartList demand={revision?.demand ?? null} />
        </div>

        <div className="rounded-card border border-line bg-surface p-4">
          <h2 className="text-xl">Unresolved</h2>
          <Unresolved demand={revision?.demand ?? null} blockers={revision?.blockers ?? []} answer={answer} />
        </div>

        <div className="rounded-card border border-line bg-surface p-4">
          <h2 className="text-xl">Acceptance history</h2>
          {project.decisions.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No simulated acceptance has been recorded.</p>
          ) : (
            <ul className="mt-2 grid gap-2 text-sm">
              {project.decisions.map((decision) => {
                const current = decision.decisionId === currentDecision?.decisionId;
                const packet = project.packets.find((item) => item.decision.decisionId === decision.decisionId);
                return (
                  <li key={decision.decisionId} className="border-l-2 border-line pl-3">
                    <p className="font-semibold">{current ? "Current acceptance" : "Earlier acceptance"}</p>
                    <p className="text-muted">Decision {decision.decisionId}. Receipt {decision.receiptHash.slice(0, 16)}. {decision.evidenceClass}. Physical release false. {current ? "This is the answer on screen." : "Not the current answer."}</p>
                    {packet && <p className="text-muted">Packet {packet.packetId}.</p>}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <EvidenceCard evidence={project.evidence ?? []} currentReceipt={currentDecision?.receiptHash} projectRecipe={project.recipeId} />

        <div className="rounded-card border border-line bg-surface p-4">
          <h2 className="text-xl">Trail</h2>
          <ol className="mt-3 grid gap-4 text-sm">
            <TrailItem title="User intent and revision" body={revision ? `Revision ${revision.revisionId}. Saved ${revision.savedAt}.` : "No saved revision."}>
              {revision && recipe && (
                <dl className="mt-2 grid gap-1">
                  {recipe.inputs.map((input) => (
                    <div key={input.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
                      <dt className="text-muted">{input.label}</dt>
                      <dd className="text-right">{shown(revision.inputs[input.id])}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </TrailItem>
            <TrailItem title="Neutral definition and admission" body={revision?.demand ? `Demand hash ${calculationHash(revision.demand)}.` : "Missing facts were not dropped and were not sent."}>
              {revision && (
                <div className="mt-2 text-muted">
                  <p>{revision.requirements.endRelation} · datum {revision.requirements.lengthDatum} · end identity {revision.requirements.endIdentity ?? "not sent"}</p>
                  {revision.requirements.endExplanation && <p className="mt-1">{revision.requirements.endExplanation}</p>}
                </div>
              )}
            </TrailItem>
            <TrailItem title="Store inquiry and answer" body={attempt ? attemptLine(attempt) : history ? `History only. ${attemptLine(history)} Not current.` : "No inquiry for this revision."}>
              {answer && <ReasonList answer={answer} />}
            </TrailItem>
            <TrailItem title="User acceptance" body={currentDecision ? `Current decision ${currentDecision.decisionId}. Receipt ${currentDecision.receiptHash.slice(0, 16)}. Simulated. A later refusal does not keep this as the current state.` : "No acceptance of the current answer."} />
            <TrailItem title="Accepted packet" body={packetLine(project.packets, currentDecision?.decisionId)} />
            <TrailItem title="Machine lowering" body={`${machine.loweringRegistered ? "Registered for this request type" : "Not registered for this request type"}. ${machine.reason}`} />
            <TrailItem title="Virtual evidence" body={evidenceLine(evidenceNow)} />
            <TrailItem title="Physical admission" body="BLOCKED. physicalAuthority false. Zero physical commands. A virtual run is not a release." />
          </ol>
          {attempt && (
            <details className="mt-4">
              <summary className="cursor-pointer font-semibold">Exact request bytes</summary>
              <pre className="mt-2 max-w-full overflow-x-auto text-xs">{attempt.sentBody}</pre>
            </details>
          )}
        </div>

        {revision?.trace.length ? (
          <div className="rounded-card border border-line bg-surface p-4">
            <h2 className="text-xl">How the parts were derived</h2>
            <ul className="mt-2 grid gap-2 text-sm">
              {revision.trace.map((step) => (
                <li key={step.id}>
                  <span className="font-semibold">{step.rule}</span> — {step.formula}
                  <span className="mt-1 block text-muted">In {shown(step.inputs)} → {shown(step.output)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {project.recipeId === "project-1" && (
          <div className="rounded-card border border-line bg-surface p-4 text-sm">
            <h2 className="text-xl">Published evidence, unchanged</h2>
            <p className="mt-2">The published review recorded Store Q $11.09, Store time 85.5001 s, virtual time 86.4695 s. Those two times are not equal and this page does not force them to be. A new inquiry is a new answer. The published file is not rewritten if the numbers differ.</p>
          </div>
        )}
      </section>
    </main>
  );
}

function shown(value: unknown): string {
  if (value == null || value === "") return "—";
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

function attemptLine(attempt: Attempt): string {
  const release = attempt.interpreted?.outcome === "answer" ? String(attempt.interpreted.wrapper.storeRelease ?? "") : "";
  const receipt = attempt.interpreted?.outcome === "answer" ? (attempt.interpreted.answer.evaluationReceipt as { receiptHash?: string } | undefined)?.receiptHash : undefined;
  return `${attempt.state}. Request ${attempt.requestId}. Digest ${attempt.sentDigest.slice(0, 16)}.${release ? ` Release ${release.slice(0, 12)}.` : ""}${receipt ? ` Receipt ${receipt.slice(0, 16)}.` : ""}`;
}

function packetLine(packets: { schema: string; packetId: string; decision: { decisionId: string }; authority: { physicalRelease: false } }[], decisionId: string | undefined): string {
  const packet = packets.find((item) => item.decision.decisionId === decisionId);
  if (!packet) return "No packet for the current acceptance.";
  return `${packet.schema} · ${packet.packetId}. Physical release ${String(packet.authority.physicalRelease)}.`;
}

function evidenceLine(evidence: EvidenceAttempt | null): string {
  if (!evidence) return "Not asked for the current acceptance. This page does not invent a motion record.";
  if (evidence.interpreted?.outcome === "answer") {
    const answer = evidence.interpreted.answer;
    return `${String(answer.status)}. Physical authority ${String(answer.physicalAuthority)}.`;
  }
  if (evidence.interpreted) return `${evidence.state}. ${evidence.interpreted.code}. Not a virtual run.`;
  return `${evidence.state}. Waiting on the Store.`;
}

function downloadJson(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

function PartList({ demand }: { demand: Record<string, unknown> | null }) {
  if (!demand) return <p className="mt-2 text-sm text-muted">No parts. The job was not admitted.</p>;
  const rows: { id: string; detail: string }[] = [];
  if (Array.isArray(demand.parts)) {
    for (const part of demand.parts) {
      if (!part || typeof part !== "object") continue;
      const row = part as { partId?: unknown; lengthIn?: unknown; features?: unknown[] };
      rows.push({ id: String(row.partId), detail: `${shown(row.lengthIn)} in · ${Array.isArray(row.features) ? row.features.length : 0} features` });
    }
  }
  if (Array.isArray(demand.cutPackages)) {
    for (const pkg of demand.cutPackages) {
      if (!pkg || typeof pkg !== "object") continue;
      const pack = pkg as { packageId?: unknown; parts?: { partId?: unknown; lengthIn?: unknown }[] };
      for (const part of pack.parts ?? []) rows.push({ id: `${shown(pack.packageId)} / ${shown(part.partId)}`, detail: `${shown(part.lengthIn)} in` });
    }
  }
  if (Array.isArray(demand.features)) {
    for (const feature of demand.features) {
      if (!feature || typeof feature !== "object") continue;
      const row = feature as { featureId?: unknown; kind?: unknown };
      rows.push({ id: String(row.featureId), detail: String(row.kind) });
    }
  }
  if (!rows.length) return <p className="mt-2 text-sm text-muted">This demand has no part list to show.</p>;
  return (
    <ul className="mt-2 grid gap-1 text-sm">
      {rows.map((row) => (
        <li key={row.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
          <span>{row.id}</span>
          <span className="text-muted">{row.detail}</span>
        </li>
      ))}
    </ul>
  );
}

function Unresolved({
  demand,
  blockers,
  answer,
}: {
  demand: Record<string, unknown> | null;
  blockers: { code: string; fact: string; owner: string }[];
  answer: Record<string, unknown> | null;
}) {
  const fromDemand = Array.isArray(demand?.unresolvedConditions) ? demand.unresolvedConditions.map(String) : [];
  const fromAnswer = [
    ...(Array.isArray(answer?.unresolvedConditions) ? answer.unresolvedConditions : []),
    ...(Array.isArray(answer?.definitionGaps) ? answer.definitionGaps : []),
  ].map(String);
  if (!blockers.length && !fromDemand.length && !fromAnswer.length) return <p className="mt-2 text-sm text-muted">None recorded on this revision.</p>;
  return (
    <ul className="mt-2 grid gap-1 text-sm">
      {blockers.map((item) => <li key={item.code + item.fact}>Admission · {item.code} · {item.fact} · {item.owner}</li>)}
      {fromDemand.map((item) => <li key={item}>Definition · {item}</li>)}
      {fromAnswer.map((item) => <li key={item}>Store · {item}</li>)}
    </ul>
  );
}

function FindingLines({ answer }: { answer: Record<string, unknown> }) {
  const lines = Array.isArray(answer.lines) ? answer.lines : [];
  if (!lines.length) return null;
  return (
    <ul className="mt-3 grid gap-2 text-sm">
      {lines.map((line, index) => {
        const row = line && typeof line === "object" ? line as { storeSku?: unknown; description?: unknown; status?: unknown; reasonCodes?: unknown } : {};
        const reasons = Array.isArray(row.reasonCodes) ? row.reasonCodes.map(String).join(", ") : "";
        return <li key={String(row.storeSku ?? index)}>{shown(row.storeSku)} · {shown(row.status || row.description)}{reasons ? ` · ${reasons}` : ""}</li>;
      })}
    </ul>
  );
}

function EvidenceCard({ evidence, currentReceipt, projectRecipe }: { evidence: EvidenceAttempt[]; currentReceipt?: string; projectRecipe: string }) {
  const current = [...evidence].reverse().find((item) => item.receiptHash === currentReceipt && item.state === "answered");
  const answer = current?.interpreted?.outcome === "answer" ? current.interpreted.answer : null;
  const run = answer?.run as { timeSec?: unknown; motionCommands?: unknown; status?: unknown } | undefined;
  const records = answer?.records as { schema?: unknown; sequence?: unknown[]; physicalAuthority?: unknown } | undefined;
  return (
    <div className="rounded-card border border-line bg-surface p-4">
      <h2 className="text-xl">Virtual evidence</h2>
      {!current && <p className="mt-2 text-sm text-muted">No checked reply for the current acceptance. Records appear here only after the Store returns them.</p>}
      {answer && (
        <div className="mt-2 grid gap-1 text-sm">
          <p>Status {String(answer.status)}. Physical authority {String(answer.physicalAuthority)}.</p>
          {typeof run?.timeSec === "number" && <p>Virtual time {run.timeSec} s · {shown(run.motionCommands)} motion commands · run {shown(run.status)}.</p>}
          {records && <p>Records {shown(records.schema)} · {Array.isArray(records.sequence) ? records.sequence.length : 0} commands · physical authority {String(records.physicalAuthority)}.</p>}
          <ReasonList answer={answer} />
          {answer.records != null && (
            <details className="mt-2">
              <summary className="cursor-pointer font-semibold">Store records, as returned</summary>
              <pre className="mt-2 max-w-full overflow-x-auto text-xs">{JSON.stringify({ localJob: answer.localJob, records: answer.records, run: answer.run, admission: answer.admission }, null, 2)}</pre>
            </details>
          )}
        </div>
      )}
      {projectRecipe === "project-1" && (
        <p className="mt-3 text-sm text-muted">Published review: Store time 85.5001 s, virtual time 86.46953628299116 s. Those two figures are not the same. A time returned above is this Store's run. It is shown beside the published figure and is not forced to match it.</p>
      )}
      {evidence.length > 0 && (
        <ul className="mt-3 grid gap-1 text-sm text-muted">
          {evidence.map((item) => (
            <li key={item.evidenceId}>{item.evidenceId.slice(0, 18)} · {item.state} · receipt {item.receiptHash.slice(0, 12)}{item.receiptHash === currentReceipt ? " · current acceptance" : " · earlier"}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Money({ money }: { money: ReturnType<typeof presentMoney> }) {
  if (money.kind === "discovery") return <p>Discovery. No Q.</p>;
  if (money.kind === "none") return <p className="text-muted">No budgetary total. {money.status === "NO_ANSWER" ? "Ask the Store for one." : `Status ${money.status}.`}</p>;
  if (money.amount == null) return <p>{money.label} The Store did not return a number. This page did not invent one.</p>;
  return (
    <p>
      <span className="font-display text-3xl">${money.amount.toFixed(2)}</span>
      <span className="mt-1 block text-sm text-muted">{money.label}</span>
    </p>
  );
}

function ReasonList({ answer }: { answer: Record<string, unknown> }) {
  const reasons = [
    ...(Array.isArray(answer.reasonCodes) ? answer.reasonCodes : []),
    ...(Array.isArray(answer.refusalConditions) ? answer.refusalConditions : []),
    ...(Array.isArray(answer.definitionGaps) ? answer.definitionGaps : []),
  ].map(String);
  if (!reasons.length) return <p className="mt-2 text-sm text-muted">No reason codes on this answer.</p>;
  return <ul className="mt-2 text-sm">{reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>;
}

function TrailItem({ title, body, children }: { title: string; body: string; children?: ReactNode }) {
  return (
    <li className="border-l-2 border-line pl-3">
      <p className="font-semibold">{title}</p>
      <p className="text-muted">{body}</p>
      {children}
    </li>
  );
}
