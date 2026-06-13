import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { LanguageProvider } from "@/lib/i18n";
import { CustomCursor } from "@/components/site/CustomCursor";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-foreground">404</h1>
        <h2 className="mt-4 font-pixel text-sm text-foreground">PAGE NOT FOUND</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="font-pixel inline-flex items-center justify-center border-2 border-foreground px-3 py-2 text-sm text-foreground hover:bg-foreground hover:text-background"
          >
            ▸ GO HOME
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-4xl">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="font-pixel border-2 border-foreground px-3 py-2 text-sm hover:bg-foreground hover:text-background"
          >
            ▸ TRY AGAIN
          </button>
          <a
            href="/"
            className="font-pixel border-2 border-foreground px-3 py-2 text-sm hover:bg-foreground hover:text-background"
          >
            ◂ GO HOME
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Federica Gaglianone — Aspiring Researcher" },
      {
        name: "description",
        content:
          "Bilingual academic portfolio of Federica Gaglianone, aspiring researcher at the intersection of HCI, machine learning, and the philosophy of science.",
      },
      { name: "author", content: "Federica Gaglianone" },
      { property: "og:title", content: "Federica Gaglianone — Aspiring Researcher" },
      {
        property: "og:description",
        content:
          "Bilingual academic portfolio: timeline, publications, and projects in English and Italian.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Federica Gaglianone — Aspiring Researcher" },
      { name: "description", content: "Still Under Construction" },
      { property: "og:description", content: "Still Under Construction" },
      { name: "twitter:description", content: "Still Under Construction" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/3fefb55c-8683-491f-804b-80052b6ab4eb" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/3fefb55c-8683-491f-804b-80052b6ab4eb" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,700;1,9..144,400&family=Inter:wght@400;500;600&family=VT323&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <CustomCursor />
        <Outlet />
      </LanguageProvider>
    </QueryClientProvider>
  );
}
