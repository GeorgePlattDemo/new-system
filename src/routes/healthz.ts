import { createFileRoute } from "@tanstack/react-router";

/** Candidate service liveness only. No Store or physical authority is implied. */
export const Route = createFileRoute("/healthz")({
  server: {
    handlers: {
      GET: () => Response.json({ status: "ok", service: "new-system-candidate" }),
    },
  },
});
