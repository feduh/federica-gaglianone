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

const sections = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/profile", label: "Profile" },
  { to: "/admin/socials", label: "Socials & Footer" },
  { to: "/admin/ui", label: "UI strings (i18n)" },
  { to: "/admin/timeline", label: "Timeline" },
  { to: "/admin/research", label: "Research directions" },
  { to: "/admin/publications", label: "Publications" },
  { to: "/admin/projects", label: "Projects" },
];

function AdminLayout() {
  const navigate = useNavigate();
  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  }
  return (
    <div className="min-h-screen bg-background text-foreground grid grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="border-b-2 md:border-b-0 md:border-r-2 border-foreground p-6 md:sticky md:top-0 md:h-screen md:overflow-y-auto">
        <div className="mb-8">
          <p className="font-pixel text-[10px] text-muted-foreground">◆ ADMIN</p>
          <h2 className="font-display text-2xl mt-1">Site manager</h2>
        </div>
        <nav className="flex flex-col gap-1">
          {sections.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              activeOptions={{ exact: s.end }}
              activeProps={{ className: "bg-foreground text-background" }}
              className="font-pixel text-sm border-2 border-foreground px-3 py-2 hover:bg-foreground hover:text-background transition-colors"
            >
              {s.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 flex flex-col gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="font-pixel text-xs text-center border border-foreground px-2 py-1 hover:bg-foreground hover:text-background"
          >
            ↗ View site
          </a>
          <button
            onClick={signOut}
            className="font-pixel text-xs text-muted-foreground hover:text-foreground text-left"
          >
            ▸ Sign out
          </button>
        </div>
      </aside>
      <main className="p-6 md:p-10 max-w-5xl">
        <Outlet />
      </main>
    </div>
  );
}
