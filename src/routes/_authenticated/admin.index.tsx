import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

type Card = {
  to: string;
  title: string;
  desc: string;
  icon: string;
  group: "Identità" | "Contenuti" | "Testi";
};

const cards: Card[] = [
  { to: "/admin/profile", title: "Profilo", desc: "Nome, bio, seeking, interessi, avatar", icon: "◉", group: "Identità" },
  { to: "/admin/socials", title: "Socials & Footer", desc: "Scholar, GitHub, OrcID, LinkedIn…", icon: "↗", group: "Identità" },
  { to: "/admin/timeline", title: "Timeline", desc: "Tappe accademiche e professionali", icon: "▤", group: "Contenuti" },
  { to: "/admin/research", title: "Ricerca", desc: "Domande aperte e direzioni di ricerca", icon: "?", group: "Contenuti" },
  { to: "/admin/publications", title: "Pubblicazioni", desc: "Paper, DOI, abstract, tag", icon: "§", group: "Contenuti" },
  { to: "/admin/projects", title: "Progetti", desc: "Cover, link, descrizioni, tag", icon: "▣", group: "Contenuti" },
  { to: "/admin/ui", title: "Testi UI", desc: "Etichette, bottoni, capitoli (IT / EN)", icon: "Aa", group: "Testi" },
];

function Dashboard() {
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setEmail(data.user?.email ?? null);
      if (data.user) {
        const { data: role } = await supabase.rpc("has_role", {
          _user_id: data.user.id, _role: "admin",
        });
        setIsAdmin(!!role);
      }
    });
  }, []);

  const groups = ["Identità", "Contenuti", "Testi"] as const;

  return (
    <div className="space-y-12">
      {/* Hero */}
      <header className="space-y-4">
        <p className="font-pixel text-xs text-accent tracking-widest">◆ BENVENUTA</p>
        <h1 className="font-display text-6xl md:text-7xl leading-[0.9]">
          Site <span className="italic text-accent">manager</span>
        </h1>
        <p className="font-body text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Modifica tutti i contenuti del sito da qui. Le modifiche sono{" "}
          <span className="text-accent font-medium not-italic">live</span>: appena salvi,
          il sito pubblico si aggiorna automaticamente.
        </p>
      </header>

      {/* Status */}
      <div className="border-2 border-foreground p-5 flex flex-wrap items-center justify-between gap-4 bg-card/40">
        <div>
          <p className="font-pixel text-[10px] text-muted-foreground tracking-widest">ACCESSO ATTIVO</p>
          <p className="font-body text-base mt-1">{email ?? "…"}</p>
        </div>
        {isAdmin === true && (
          <span className="font-pixel text-xs px-3 py-2 bg-accent text-accent-foreground border-2 border-accent">
            ✓ RUOLO ADMIN
          </span>
        )}
        {isAdmin === false && (
          <span className="font-pixel text-xs px-3 py-2 bg-destructive text-destructive-foreground border-2 border-destructive">
            ⚠ RUOLO NON ATTIVO
          </span>
        )}
      </div>

      {/* Grouped sections */}
      {groups.map((group, gi) => {
        const items = cards.filter((c) => c.group === group);
        return (
          <section key={group} className="space-y-4">
            <div className="flex items-baseline gap-4">
              <span className="font-pixel text-xs text-accent">§ 0{gi + 1}</span>
              <h2 className="font-display text-3xl">{group}</h2>
              <span className="flex-1 border-b-2 border-foreground/20 translate-y-[-4px]" />
              <span className="font-pixel text-xs text-muted-foreground">
                {items.length} {items.length === 1 ? "sezione" : "sezioni"}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((c) => (
                <Link
                  key={c.to}
                  to={c.to}
                  className="group border-2 border-foreground p-5 flex gap-4 items-start hover:bg-accent hover:text-accent-foreground hover:border-accent hover:shadow-[4px_4px_0_0_var(--color-foreground)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
                >
                  <span className="font-display text-4xl leading-none text-accent group-hover:text-accent-foreground w-10 text-center">
                    {c.icon}
                  </span>
                  <div className="flex-1">
                    <p className="font-display text-2xl leading-tight">{c.title}</p>
                    <p className="font-body text-sm mt-1 text-muted-foreground group-hover:text-accent-foreground/80">
                      {c.desc}
                    </p>
                  </div>
                  <span className="font-pixel text-lg opacity-40 group-hover:opacity-100">→</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
