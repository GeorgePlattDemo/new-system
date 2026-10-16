import { createFileRoute } from "@tanstack/react-router";
import { componentDefinition, componentTools } from "@/system/component-tool.ts";

export const Route = createFileRoute("/api/component-definition")({
  server: {
    handlers: {
      GET: () =>
        Response.json({ tools: componentTools() }, { headers: { "cache-control": "no-store" } }),
      POST: async ({ request }) => {
        const definition = componentDefinition(await request.json().catch(() => null));
        return Response.json(definition, {
          status: "error" in definition ? 422 : 200,
          headers: { "cache-control": "no-store" },
        });
      },
    },
  },
});
