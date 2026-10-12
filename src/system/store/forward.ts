import { createServerFn } from "@tanstack/react-start";
import { STORE_CANDIDATE } from "../store-candidate.ts";

const origin = () => process.env.STORE_ZERO_ORIGIN || "http://127.0.0.1:8091";

type ExactBody = { body: string };

/** One wire-size rule for both internal Store forwarding paths. */
function forwardable(data: ExactBody): ExactBody {
  if (!data || typeof data.body !== "string" || data.body.length > 256 * 1024) {
    throw new Error("REQUEST_NOT_FORWARDABLE");
  }
  return data;
}

/** Transport exact JSON bytes; no job reshaping, local pricing or copied Store evaluation. */
async function postExactStoreBytes(path: string, body: string, timeoutMs: number) {
  try {
    const response = await fetch(origin() + path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      signal: AbortSignal.timeout(timeoutMs),
    });
    return { httpStatus: response.status, body: await response.text() };
  } catch (error) {
    return { httpStatus: 0, body: error instanceof Error ? error.message : "STORE_UNREACHABLE" };
  }
}

export const storeHealth = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const res = await fetch(origin() + STORE_CANDIDATE.healthPath, { signal: AbortSignal.timeout(4000) });
    const text = await res.text();
    return { httpStatus: res.status, body: text };
  } catch (error) {
    return { httpStatus: 0, body: error instanceof Error ? error.message : "STORE_UNREACHABLE" };
  }
});

/** Posts the exact bytes the browser already serialized. Does not rebuild the demand. */
export const forwardStoreRequest = createServerFn({ method: "POST" })
  .validator(forwardable)
  .handler(({ data }) => postExactStoreBytes(STORE_CANDIDATE.requestsPath, data.body, 15000));

/** Posts machine-evidence bytes without building a local job or motion record. */
export const forwardMachineEvidence = createServerFn({ method: "POST" })
  .validator(forwardable)
  .handler(({ data }) => postExactStoreBytes(STORE_CANDIDATE.machineEvidencePath, data.body, 20000));
