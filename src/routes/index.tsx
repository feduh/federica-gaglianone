import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { profile } from "@/lib/profile";
import { getPublications, getProjects, getTags } from "@/lib/portfolio.functions";
import { TopBar } from "@/components/site/TopBar";
import { IntroAsymmetric } from "@/components/site/IntroAsymmetric";
import { Timeline } from "@/components/site/Timeline";
import { Publications } from "@/components/site/Publications";
import { Projects } from "@/components/site/Projects";
import { ResearchDirections } from "@/components/site/ResearchDirections";
import { Footer } from "@/components/site/Footer";
import { CommandPalette } from "@/components/site/CommandPalette";

const tagsQ = queryOptions({ queryKey: ["tags"], queryFn: () => getTags() });
const pubsQ = queryOptions({ queryKey: ["publications"], queryFn: () => getPublications() });
const projsQ = queryOptions({ queryKey: ["projects"], queryFn: () => getProjects() });

type HomeSearch = { w?: string; p?: string };

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): HomeSearch => ({
    w: typeof search["w"] === "string" && search["w"] ? String(search["w"]) : undefined,
    p: typeof search["p"] === "string" && search["p"] ? String(search["p"]) : undefined,
  }),
  head: () => ({
    meta: [
      { title: `${profile.name} — ${profile.role_en}` },
      {
        name: "description",
        content: profile.statement_en,
      },
      { property: "og:title", content: `${profile.name} — ${profile.role_en}` },
      {
        property: "og:description",
        content: profile.statement_en,
      },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "https://federica-gaglianone.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `${profile.name} — ${profile.role_en}` },
      { name: "twitter:description", content: profile.statement_en },
    ],
    links: [
      { rel: "canonical", href: "https://federica-gaglianone.lovable.app/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: profile.name,
          jobTitle: profile.role_en,
          email: `mailto:${profile.email}`,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Turin",
            addressCountry: "IT",
          },
          url: "https://federica-gaglianone.lovable.app/",
        }),
      },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(tagsQ),
      context.queryClient.ensureQueryData(pubsQ),
      context.queryClient.ensureQueryData(projsQ),
    ]);
  },
  component: HomePage,
  errorComponent: () => (
    <div className="min-h-screen flex items-center justify-center p-8">
      <p className="font-pixel text-destructive">ERROR: Something went wrong. Please try again later.</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-pixel">NOT FOUND</p>
    </div>
  ),
});

function parseTags(v?: string) {
  return v ? v.split(",").filter(Boolean) : [];
}

function HomePage() {
  const tags = useSuspenseQuery(tagsQ).data;
  const publications = useSuspenseQuery(pubsQ).data;
  const projects = useSuspenseQuery(projsQ).data;
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const setParam = (key: "w" | "p", slugs: string[]) => {
    navigate({
      search: (prev: HomeSearch) => ({ ...prev, [key]: slugs.length ? slugs.join(",") : undefined }),
      replace: true,
      resetScroll: false,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <CommandPalette publications={publications} projects={projects} />
      <main id="main" tabIndex={-1}>
        <IntroAsymmetric />
        <Timeline />
        <Publications
          items={publications}
          tags={tags}
          activeTags={parseTags(search.w)}
          onTagsChange={(s) => setParam("w", s)}
        />
        <Projects
          items={projects}
          tags={tags}
          activeTags={parseTags(search.p)}
          onTagsChange={(s) => setParam("p", s)}
        />
        <ResearchDirections />
      </main>
      <Footer />
    </div>
  );
}
