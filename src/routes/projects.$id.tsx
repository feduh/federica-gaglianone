import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProject } from "@/lib/portfolio.functions";
import { useLang } from "@/lib/i18n";
import { PixelButton } from "@/components/site/PixelButton";
import { Footer } from "@/components/site/Footer";

const BASE = "https://federica-gaglianone.lovable.app";

function abs(url: string | null | undefined) {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

export const Route = createFileRoute("/projects/$id")({
  loader: async ({ params }) => {
    const project = await getProject({ data: { id: params.id } });
    if (!project) throw notFound();
    return project;
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Project not found — Federica Gaglianone" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.title_en} — Federica Gaglianone`;
    const description =
      loaderData.summary_en ??
      `Project by Federica Gaglianone (${loaderData.year}).`;
    const url = `${BASE}/projects/${params.id}`;
    const image = abs(loaderData.cover_url) ?? `${BASE}/og-cover.jpg`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: loaderData.title_en,
            datePublished: String(loaderData.year),
            description,
            url,
            author: { "@type": "Person", name: "Federica Gaglianone" },
          }),
        },
      ],
    };
  },
  component: ProjectPage,
  errorComponent: () => (
    <div className="min-h-screen flex items-center justify-center p-8">
      <p className="font-pixel text-destructive">ERROR: Something went wrong. Please try again later.</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <p className="font-pixel">PROJECT NOT FOUND</p>
      <Link to="/" className="font-pixel underline underline-offset-4">
        ← BACK HOME
      </Link>
    </div>
  ),
});

function ProjectPage() {
  const p = Route.useLoaderData();
  const { lang, t } = useLang();
  const title = lang === "en" ? p.title_en : p.title_it;
  const summary = lang === "en" ? p.summary_en : p.summary_it;
  const body = lang === "en" ? p.body_en : p.body_it;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main id="main" tabIndex={-1} className="mx-auto max-w-[1100px] px-4 md:px-8 py-16 md:py-24">
        <Link
          to="/"
          hash="projects"
          data-cursor="link"
          className="font-pixel text-sm underline underline-offset-4 hover:text-accent"
        >
          ← {lang === "en" ? "All projects" : "Tutti i progetti"}
        </Link>

        <div className="mt-10 flex items-start justify-between gap-6 flex-wrap">
          <span className="font-pixel text-sm text-muted-foreground">{p.year}</span>
          <div className="flex flex-wrap gap-1 justify-end">
            {p.tags.map((tg) => (
              <span key={tg.id} className="font-pixel text-[11px] border border-foreground px-1.5 py-0.5">
                # {lang === "en" ? tg.label_en : tg.label_it}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-6 flex-wrap">
          {p.cover_url && (
            <img
              src={p.cover_url}
              alt={`${title} — logo`}
              width={112}
              height={112}
              decoding="async"
              className="w-20 h-20 md:w-28 md:h-28 object-contain shrink-0"
            />
          )}
          <h1
            className="font-display leading-[0.95] text-balance min-w-0"
            style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
          >
            {title}
          </h1>
        </div>

        {summary && (
          <p className="font-body text-xl md:text-2xl leading-relaxed mt-8 max-w-3xl text-muted-foreground">
            {summary}
          </p>
        )}

        {body && (
          <div className="border-t-2 border-foreground mt-10 pt-8 max-w-3xl">
            <p className="font-body text-base md:text-lg leading-relaxed whitespace-pre-line">{body}</p>
          </div>
        )}

        {p.link_url && (
          <div className="mt-12">
            <PixelButton href={p.link_url} target="_blank" rel="noreferrer">
              {t("viewProject")}
            </PixelButton>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
