import { createFileRoute, Link } from "@tanstack/react-router";
import { getPublications, getProjects } from "@/lib/portfolio.functions";
import { profile, timeline } from "@/lib/profile";
import { useLang } from "@/lib/i18n";

const URL = "https://federica-gaglianone.lovable.app/cv";
const TITLE = "CV — Federica Gaglianone";
const DESC =
  "Curriculum vitae of Federica Gaglianone: education, teaching, publications and projects across art, data science and AI.";

export const Route = createFileRoute("/cv")({
  loader: async () => {
    const [publications, projects] = await Promise.all([getPublications(), getProjects()]);
    return { publications, projects };
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: URL },
      { property: "og:image", content: "https://federica-gaglianone.lovable.app/og-cover.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://federica-gaglianone.lovable.app/og-cover.jpg" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: CvPage,
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="cv-section border-t-2 border-foreground pt-6 mt-10">
      <h2 className="font-pixel text-sm uppercase tracking-widest text-accent mb-5">{title}</h2>
      {children}
    </section>
  );
}

function CvPage() {
  const { publications, projects } = Route.useLoaderData();
  const { lang, t } = useLang();
  const en = lang === "en";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main id="main" tabIndex={-1} className="mx-auto max-w-[900px] px-4 md:px-8 py-12 md:py-20">
        <div className="no-print flex items-center justify-between gap-4 mb-12 flex-wrap">
          <Link to="/" data-cursor="link" className="font-pixel text-sm underline underline-offset-4 hover:text-accent">
            ← {en ? "Back home" : "Torna alla home"}
          </Link>
          <button
            data-cursor="link"
            onClick={() => window.print()}
            className="font-pixel text-lg inline-flex items-center gap-2 px-3 min-h-11 pixel-border pixel-border-hover"
          >
            <span aria-hidden>▸</span> {t("downloadCv")} (PDF)
          </button>
        </div>

        <header>
          <h1 className="font-display leading-[0.95]" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
            {profile.name}
          </h1>
          <p className="font-pixel text-base mt-3 uppercase">
            {en ? profile.role_en : profile.role_it} · {en ? profile.city_en : profile.city_it} · {profile.email}
          </p>
          <p className="font-body text-lg leading-relaxed mt-6 text-muted-foreground">
            {en ? profile.statement_en : profile.statement_it}
          </p>
        </header>

        <Section title={en ? "Education" : "Formazione"}>
          <ul className="flex flex-col gap-6">
            {[...timeline].reverse().map((e) => (
              <li key={e.year} className="grid grid-cols-[7rem_1fr] gap-4">
                <span className="font-pixel text-sm text-muted-foreground">{e.year}</span>
                <div>
                  <p className="font-display text-xl">{en ? e.institution_en : e.institution_it}</p>
                  <p className="font-pixel text-sm uppercase">{e.place}</p>
                  <p className="font-body text-sm leading-relaxed mt-2 whitespace-pre-line text-muted-foreground">
                    {en ? e.body_en : e.body_it}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={en ? "Teaching" : "Didattica"}>
          <ul className="flex flex-col gap-5">
            {profile.teaching.map((item) => (
              <li key={item.id} className="grid grid-cols-[7rem_1fr] gap-4">
                <span className="font-pixel text-sm text-muted-foreground">{item.period}</span>
                <div>
                  <p className="font-display text-xl">{en ? item.title_en : item.title_it}</p>
                  <p className="font-pixel text-sm uppercase">{en ? item.place_en : item.place_it}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {publications.length > 0 && (
          <Section title={en ? "Publications" : "Pubblicazioni"}>
            <ul className="flex flex-col gap-5">
              {publications.map((p) => (
                <li key={p.id} className="grid grid-cols-[7rem_1fr] gap-4">
                  <span className="font-pixel text-sm text-muted-foreground">{p.year}</span>
                  <div>
                    <p className="font-display text-xl">{en ? p.title_en : p.title_it}</p>
                    <p className="font-body text-sm text-muted-foreground">
                      {p.authors}
                      {p.venue ? ` — ${p.venue}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {projects.length > 0 && (
          <Section title={en ? "Projects" : "Progetti"}>
            <ul className="flex flex-col gap-5">
              {projects.map((p) => (
                <li key={p.id} className="grid grid-cols-[7rem_1fr] gap-4">
                  <span className="font-pixel text-sm text-muted-foreground">{p.year}</span>
                  <div>
                    <p className="font-display text-xl">{en ? p.title_en : p.title_it}</p>
                    {(en ? p.summary_en : p.summary_it) && (
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">
                        {en ? p.summary_en : p.summary_it}
                      </p>
                    )}
                    {p.link_url && <p className="font-pixel text-xs mt-1">{p.link_url}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Section title={en ? "Interests" : "Interessi"}>
          <p className="font-body text-sm leading-relaxed">
            HCI · Creative AI · Remote sensing · Environmental data · Interactive installations · Data science
          </p>
        </Section>
      </main>
    </div>
  );
}
