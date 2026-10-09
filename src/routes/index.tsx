import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LIBRARY } from "@/system/recipes/library.ts";
import { STORE_CANDIDATE } from "@/system/store-candidate.ts";
import { openRecipe, selectProject } from "@/system/session.ts";
import { serializeRequest, interpretStoreHttp, presentMoney } from "@/system/store/interpret.ts";
import { storeHealth, forwardStoreRequest } from "@/system/store/forward.ts";
import { useRecord } from "@/components/use-record.ts";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const navigate = useNavigate();
  const { state, update, replaceWithEmpty, savedText } = useRecord();
  const [health, setHealth] = useState("Checking the Store candidate…");
  const [search, setSearch] = useState("2x4 treated 72");
  const [lookup, setLookup] = useState<string>("Ask the catalog. This is not a price.");

  useEffect(() => {
    storeHealth()
      .then((res) => {
        if (res.httpStatus !== 200) {
          setHealth("Store candidate is not reachable. Jobs can still be defined. An inquiry will be a transport failure, not a refusal.");
          return;
        }
        const body = JSON.parse(res.body) as {
          release?: string;
          protocol?: string;
          catalog?: { offerings?: number };
          machineEvidence?: { protocol?: string; machineConfigId?: string; physicalAuthority?: boolean };
        };
        if (body.release !== STORE_CANDIDATE.inspectedCommit) {
          setHealth(`Wrong Store release ${body.release ?? "unknown"}. This candidate expected ${STORE_CANDIDATE.inspectedCommit}.`);
          return;
        }
        const machine = body.machineEvidence;
        const machineLine =
          machine?.protocol === STORE_CANDIDATE.machineEvidenceProtocol && machine.physicalAuthority === false
            ? ` Virtual evidence ${machine.machineConfigId ?? "unidentified"}, physical authority false.`
            : " Machine evidence was not advertised as blocked virtual evidence.";
        setHealth(`Store Zero ${body.release.slice(0, 12)} · ${body.protocol} · ${body.catalog?.offerings ?? "?"} offerings.${machineLine} Inspected baseline, not a production release.`);
      })
      .catch(() => setHealth("Store candidate is not reachable."));
  }, []);

  function start(recipeId: string) {
    if (state.ready === false || state.problem) return;
    const opened = openRecipe(state.record, recipeId);
    if ("error" in opened) return;
    update(selectProject(opened.record, opened.projectId));
    navigate({ to: "/projects/$projectId", params: { projectId: opened.projectId } });
  }

  async function runLookup() {
    const body = serializeRequest({ requestType: "OFFERING_LOOKUP", requestId: `look-${Date.now()}`, demand: { searchText: search } });
    const res = await forwardStoreRequest({ data: { body: body.body } });
    const read = interpretStoreHttp({
      sentBody: body.body,
      sentDigest: body.digest,
      requestType: "OFFERING_LOOKUP",
      requestId: JSON.parse(body.body).requestId,
      demand: { searchText: search },
      httpStatus: res.httpStatus,
      responseText: res.body,
    });
    if (read.outcome !== "answer") {
      setLookup(`${read.outcome === "transport" ? "Transport failure" : "Protocol failure"}: ${read.code}. Not a refusal and not a price.`);
      return;
    }
    const money = presentMoney(read.answer);
    const offerings = (read.answer.offerings as { storeSku?: string; description?: string }[] | undefined) ?? [];
    setLookup(
      money.kind === "discovery"
        ? offerings.length
          ? offerings.slice(0, 5).map((item) => `${item.storeSku} — ${item.description}`).join("\n") + "\nDiscovery only. No Q. Nothing was accepted."
          : "No offered rows. Discovery only. No Q."
        : "This lookup was not treated as discovery. It is blocked.",
    );
  }

  return (
    <main className="grid gap-8">
      <section className="grid gap-3">
        <h1 className="max-w-3xl text-4xl sm:text-5xl">Define the work. Ask the yard. Keep the trail.</h1>
        <p className="max-w-3xl text-muted">
          Seven library jobs. Five are the existing experiences, rebuilt as recipes. Project 1 uses the same board rule as Start your own. Closet cleats was added as data on a rule that already existed. Window seat is an engine extension, because its elevation is not a generic cut list.
        </p>
        <p className="rounded-card border border-line bg-surface px-4 py-3 text-sm">{health}</p>
      </section>

      {state.ready && state.storageError && (
        <section className="rounded-card border border-bad bg-surface p-4">
          <h2 className="text-xl text-bad">The file on this device could not be written</h2>
          <p className="mt-2 text-sm">{state.storageError} What you see is still in this tab. It was not replaced with an empty file.</p>
          <button type="button" className="tap mt-3 rounded-card border border-line px-4" onClick={() => downloadJson("scan-to-build-record.json", savedText())}>Download the file</button>
        </section>
      )}

      {state.ready && state.problem && (
        <section className="rounded-card border border-bad bg-surface p-4">
          <h2 className="text-xl text-bad">Saved file not opened</h2>
          <p className="mt-2 text-sm">
            {state.problem === "UNSUPPORTED_VERSION"
              ? "This file is a version this candidate does not know. It was not converted and it was not overwritten."
              : "This file is not a readable project record. A nested hole, such as an empty project, is not repaired."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="tap rounded-card border border-line px-4" onClick={() => downloadJson("scan-to-build-unreadable.json", state.raw)}>Download the unreadable file</button>
            <button type="button" className="tap rounded-card border border-bad px-4 text-bad" onClick={replaceWithEmpty}>Replace with an empty file</button>
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-2xl">Library</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {LIBRARY.map((recipe) => (
            <article key={recipe.recipeId} className="flex flex-col rounded-card border border-line bg-surface p-4">
              <p className="text-xs font-semibold tracking-wide text-muted uppercase">{recipe.engine === "extension" ? "Engine extension" : "Data on a supported rule"}</p>
              <h3 className="mt-1 text-2xl">{recipe.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted">{recipe.summary}</p>
              <button type="button" className="tap mt-4 rounded-card bg-brand px-4 text-brand-ink" onClick={() => start(recipe.recipeId)} disabled={state.ready === false || state.problem != null}>
                Open a project
              </button>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-2xl">On this device</h2>
        {state.ready && !state.problem && state.record.projects.length === 0 && <p className="text-sm text-muted">Nothing saved yet. Opening a library job saves the first revision here.</p>}
        <ul className="grid gap-2">
          {state.ready && !state.problem &&
            state.record.projects.map((project) => (
              <li key={project.projectId}>
                <Link to="/projects/$projectId" params={{ projectId: project.projectId }} className="flex items-center justify-between rounded-card border border-line bg-surface px-4 py-3">
                  <span>{project.title}</span>
                  <span className="text-sm text-muted">{project.revisions.length} revision{project.revisions.length === 1 ? "" : "s"}</span>
                </Link>
              </li>
            ))}
        </ul>
      </section>

      <section className="rounded-card border border-line bg-surface p-4">
        <h2 className="text-2xl">What does the yard stock?</h2>
        <p className="mt-1 text-sm text-muted">Offering lookup. It cannot admit a job, show a Q, or be accepted.</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input className="tap flex-1 rounded-card border border-line bg-bg px-3" value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Catalog search" />
          <button type="button" className="tap rounded-card border border-brand px-4 text-brand" onClick={runLookup}>Look up</button>
        </div>
        <pre className="mt-3 whitespace-pre-wrap text-sm">{lookup}</pre>
      </section>
    </main>
  );
}

function downloadJson(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}
