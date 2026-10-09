import { createServerFn } from "@tanstack/react-start";
import { STORE_CANDIDATE } from "../store-candidate.ts";

const origin = () => process.env.STORE_ZERO_ORIGIN || "http://127.0.0.1:8091";

export const storeHealth = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const res = await fetch(origin() + STORE_CANDIDATE.healthPath, { signal: AbortSignal.timeout(4000) });
    const text = await res.text();
    return { httpStatus: res.status, body: text };
  } catch (error) {
    return { httpStatus: 0, body: error instanceof Error ? error.message : "STORE_UNREACHABLE" };
  }
});

/** Posts the exact bytes the browser already serialized. Does not parse or rebuild the demand. */
export const forwardStoreRequest = createServerFn({ method: "POST" })
  .validator((data: { body: string }) => {
    if (!data || typeof data.body !== "string" || data.body.length > 256 * 1024) throw new Error("REQUEST_NOT_FORWARDABLE");
    return data;
  })
  .handler(async ({ data }) => {
    try {
      const res = await fetch(origin() + STORE_CANDIDATE.requestsPath, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: data.body,
        signal: AbortSignal.timeout(15000),
      });
      return { httpStatus: res.status, body: await res.text() };
    } catch (error) {
      return { httpStatus: 0, body: error instanceof Error ? error.message : "STORE_UNREACHABLE" };
    }
  });

/** Posts the exact machine-evidence bytes. Does not build a local job or a motion record. */
export const forwardMachineEvidence = createServerFn({ method: "POST" })
  .validator((data: { body: string }) => {
    if (!data || typeof data.body !== "string" || data.body.length > 256 * 1024) throw new Error("REQUEST_NOT_FORWARDABLE");
    return data;
  })
  .handler(async ({ data }) => {
    try {
      const res = await fetch(origin() + STORE_CANDIDATE.machineEvidencePath, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: data.body,
        signal: AbortSignal.timeout(20000),
      });
      return { httpStatus: res.status, body: await res.text() };
    } catch (error) {
      return { httpStatus: 0, body: error instanceof Error ? error.message : "STORE_UNREACHABLE" };
    }
  });
