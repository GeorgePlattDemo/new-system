import { createRootRoute, HeadContent, Link, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale-1" },
      { title: "New System" },
      { name: "theme-color", content: "#f3eee6" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <div className="mx-auto min-h-screen max-w-6xl px-4 py-5 sm:px-6">
            <header className="mb-6 flex items-end justify-between gap-4 border-b border-line pb-4">
              <div>
                <p className="text-sm font-semibold tracking-wide text-brand uppercase">Candidate · not connected</p>
                <Link to="/" className="font-display text-3xl text-ink">
                  New System
                </Link>
              </div>
              <p className="max-w-xs text-right text-sm text-muted">Defines the job. Does not price it. Does not cut it.</p>
            </header>
            <Outlet />
          </div>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
