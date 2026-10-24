import { createFileRoute } from "@tanstack/react-router";

/** Counted only by Railway HTTP proxy logs. No personal information or job data is stored. */
export const Route = createFileRoute("/api/study-customer-offering")({
  server: {
    handlers: {
      GET: () => new Response(null, {
        status: 204,
        headers: { "Cache-Control": "no-store" },
      }),
    },
  },
});
