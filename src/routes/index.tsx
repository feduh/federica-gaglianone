import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { profile } from "@/lib/profile";
import { getPublications, getProjects, getTags } from "@/lib/portfolio.functions";
import { TopBar } from "@/components/site/TopBar";
import { IntroAsymmetric } from "@/components/site/IntroAsymmetric";
import { Timeline } from "@/components/site/Timeline";
import { Publications } from "@/components/site/Publications";
import { Projects } from "@/components/site/Projects";
import { Footer } from "@/components/site/Footer";

const tagsQ = queryOptions({ queryKey: ["tags"], queryFn: () => getTags() });
const pubsQ = queryOptions({ queryKey: ["publications"], queryFn: () => getPublications() });
const projsQ = queryOptions({ queryKey: ["projects"], queryFn: () => getProjects() });

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${profile.name} — ${profile.role_en}` },
      {
        name: "description",
        content:
          "Bilingual academic portfolio: timeline of studies, publications, and research projects.",
      },
      { property: "og:title", content: `${profile.name} — ${profile.role_en}` },
      {
        property: "og:description",
        content: "Timeline, publications, and projects of an aspiring researcher.",
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
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-8">
      <p className="font-pixel text-destructive">ERROR: {error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-pixel">NOT FOUND</p>
    </div>
  ),
});

function HomePage() {
  const tags = useSuspenseQuery(tagsQ).data;
  const publications = useSuspenseQuery(pubsQ).data;
  const projects = useSuspenseQuery(projsQ).data;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <main>
        <IntroAsymmetric />
        <Timeline />
        <Publications items={publications} tags={tags} />
        <Projects items={projects} tags={tags} />
      </main>
      <Footer />
    </div>
  );
}
