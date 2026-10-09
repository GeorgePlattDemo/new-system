import { createFileRoute } from "@tanstack/react-router";
import { answerPublishedWire } from "@/system/store/published-wire.ts";

const origin = () => process.env.STORE_ZERO_ORIGIN || "http://127.0.0.1:8091";

export const Route = createFileRoute("/api/store-zero/offering")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const wire = await request.json().catch(() => null);
        if (!wire || typeof wire !== "object") return Response.json({ adapterError: true, code: "PUBLISHED_WIRE_NOT_JSON" }, { status: 400 });
        const answered = await answerPublishedWire(wire as Record<string, unknown>, origin());
        return Response.json(answered.body, { status: answered.httpStatus });
      },
      OPTIONS: () => new Response(null, { status: 204 }),
    },
  },
});
