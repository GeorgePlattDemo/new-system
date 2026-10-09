import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { calculationHash } from "@/system/hash.ts";
import { recipeById } from "@/system/recipes/library.ts";
import { machineView } from "@/system/machine.ts";
import {
  acceptCurrent,
  applyInquiryResult,
  beginInquiry,
  currentRevision,
  saveRevision,
  selectProject,
  setInput,
  visibleState,
  type Attempt,
  type RecordFile,
} from "@/system/session.ts";
import { presentMoney } from "@/system/store/interpret.ts";
import { forwardStoreRequest } from "@/system/store/forward.ts";
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
  const { state, update } = useRecord();
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
      <p className="text-bad">
        The saved file cannot be opened ({state.problem}). It was not converted. Go back to the library.
      </p>
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
  const machine = machineView(revision?.requestType ?? null);
  const priorDecision = revision ? project.decisions.find((item) => item.revisionId === revision.revisionId) : undefined;

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
        </div>
      </section>

      <section className="grid min-w-0 content-start gap-4">
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
            <h2 className="text-xl">Store answer</h2>
            <p className="mt-1 text-sm">Status {String(answer.status)} · request {String(answer.requestId)}</p>
            <ReasonList answer={answer} />
          </div>
        )}

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
                <p className="mt-2 text-muted">
                  {revision.requirements.endRelation} · datum {revision.requirements.lengthDatum} · ends {revision.requirements.endIdentity}
                </p>
              )}
            </TrailItem>
            <TrailItem title="Store inquiry and answer" body={attempt ? attemptLine(attempt) : history ? `History only. ${attemptLine(history)} Not current.` : "No inquiry for this revision."}>
              {answer && <ReasonList answer={answer} />}
            </TrailItem>
            <TrailItem title="User acceptance" body={priorDecision ? `Decision ${priorDecision.decisionId}. Receipt ${priorDecision.receiptHash.slice(0, 16)}. Simulated. A repeat does not add another.` : "No acceptance on this revision."} />
            <TrailItem title="Accepted packet" body={packetLine(project.packets, revision?.revisionId)} />
            <TrailItem title="Machine lowering" body={`${machine.lowering}. ${machine.reason}`} />
            <TrailItem title="Virtual evidence" body="No virtual motion record. The HTTP service does not provide one, and this System does not invent one." />
            <TrailItem title="Physical admission" body="BLOCKED. physicalAuthority false. Zero physical commands." />
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

function packetLine(packets: { schema: string; packetId: string; definition: { revisionId: string }; authority: { physicalRelease: false } }[], revisionId: string | undefined): string {
  const packet = packets.find((item) => item.definition.revisionId === revisionId);
  if (!packet) return "No packet for this revision.";
  return `${packet.schema} · ${packet.packetId}. Frozen to revision ${packet.definition.revisionId}. Physical release ${String(packet.authority.physicalRelease)}.`;
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
