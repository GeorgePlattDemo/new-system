import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ href: "/live/system-build-current.html?v=verified-front-doors-20261017" });
  },
});
