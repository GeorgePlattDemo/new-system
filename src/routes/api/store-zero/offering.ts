import { createFileRoute } from "@tanstack/react-router";
import { postPublishedWire } from "@/system/store/published-wire.ts";

export const Route = createFileRoute("/api/store-zero/offering")({
  server: {
    handlers: {
      POST: ({ request }) => postPublishedWire(request),
      OPTIONS: () => new Response(null, { status: 204 }),
    },
  },
});
