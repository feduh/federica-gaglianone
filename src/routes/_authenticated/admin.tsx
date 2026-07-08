import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Site Manager" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLayout,
});

type Item = { to: string; label: string; icon: string; end?: boolean };
type Group = { title: string; items: Item[] };

const groups: Group[] = [
  {
    title: "Panoramica",
    items: [{ to: "/admin", label: "Dashboard", icon: "◆", end: true }],
  },
  {
    title: "Identità",
    items: [
      { to: "/admin/profile", label: "Profilo", icon: "◉" },
      { to: "/admin/socials", label: "Socials & Footer", icon: "↗" },
    ],
  },
  {
    title: "Contenuti",
    items: [
      { to: "/admin/timeline", label: "Timeline", icon: "▤" },
      { to: "/admin/research", label: "Ricerca", icon: "?" },
      { to: "/admin/publications", label: "Pubblicazioni", icon: "§" },
      { to: "/admin/projects", label: "Progetti", icon: "▣" },
    ],
  },
  {
    title: "Testi UI",
    items: [{ to: "/admin/ui", label: "i18n strings", icon: "Aa" }],
  },
];

function AdminLayout() {
  const navigate = useNavigate();
  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  }
  return (
    <div className="min-h-screen bg-background text-foreground grid grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside className="border-b-2 md:border-b-0 md:border-r-2 border-foreground bg-card/40 md:sticky md:top-0 md:h-screen md:overflow-y-auto flex flex-col">
        <div className="p-6 border-b-2 border-foreground">
          <p className="font-pixel text-[10px] text-accent tracking-widest">◆ ADMIN PANEL</p>
          <h2 className="font-display text-3xl mt-1 leading-none">Site<br/>manager</h2>
        </div>

        <nav className="flex flex-col gap-6 p-6 flex-1">
          {groups.map((g) => (
            <div key={g.title}>
              <p className="font-pixel text-[10px] text-muted-foreground tracking-widest mb-2 px-1">
                — {g.title.toUpperCase()}
              </p>
              <div className="flex flex-col gap-1">
                {g.items.map((s) => (
                  <Link
                    key={s.to}
                    to={s.to}
                    activeOptions={{ exact: s.end }}
                    activeProps={{
                      className:
                        "!bg-accent !text-accent-foreground !border-accent shadow-[3px_3px_0_0_var(--color-foreground)]",
                    }}
                    className="font-pixel text-sm border-2 border-foreground/30 px-3 py-2 flex items-center gap-3 hover:border-foreground hover:bg-foreground hover:text-background transition-all"
                  >
                    <span className="w-5 text-center opacity-70">{s.icon}</span>
                    <span>{s.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-6 border-t-2 border-foreground flex flex-col gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="font-pixel text-xs text-center border-2 border-foreground px-2 py-2 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
          >
            ↗ VEDI IL SITO
          </a>
          <button
            onClick={signOut}
            className="font-pixel text-[10px] text-muted-foreground hover:text-destructive text-center py-1"
          >
            ▸ ESCI
          </button>
        </div>
      </aside>
      <main className="p-6 md:p-12 max-w-5xl w-full">
        <Outlet />
      </main>
    </div>
  );
}
