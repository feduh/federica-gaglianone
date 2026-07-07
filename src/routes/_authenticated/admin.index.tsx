import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

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

  return (
    <div className="space-y-8">
      <div>
        <p className="font-pixel text-xs text-muted-foreground">◆ WELCOME</p>
        <h1 className="font-display text-5xl mt-2">Site manager</h1>
        <p className="font-body text-lg mt-4 text-muted-foreground max-w-2xl">
          Modifica tutti i contenuti del sito da qui. Le modifiche sono <em>live</em>: appena
          salvi, il sito pubblico si aggiorna.
        </p>
      </div>

      <div className="border-2 border-foreground p-4">
        <p className="font-pixel text-xs text-muted-foreground">SIGNED IN</p>
        <p className="font-body mt-1">{email ?? "…"}</p>
        {isAdmin === false && (
          <p className="font-pixel text-xs text-destructive mt-2">
            ⚠ Your account is signed in but does NOT have the admin role. Contact the site owner.
          </p>
        )}
        {isAdmin === true && (
          <p className="font-pixel text-xs text-accent mt-2">✓ Admin role active</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ["/admin/profile", "Profile", "Bio, seeking, interests, avatar"],
          ["/admin/socials", "Socials & Footer", "Scholar, GitHub, OrcID…"],
          ["/admin/ui", "UI strings", "Navigation, buttons, chapters"],
          ["/admin/timeline", "Timeline", "Academic journey entries"],
          ["/admin/research", "Research directions", "Open questions"],
          ["/admin/publications", "Publications", "Papers, DOIs, abstracts"],
          ["/admin/projects", "Projects", "Cover images, links"],
        ].map(([to, title, desc]) => (
          <Link
            key={to}
            to={to}
            className="border-2 border-foreground p-4 hover:bg-foreground hover:text-background transition-colors block"
          >
            <p className="font-display text-2xl">{title}</p>
            <p className="font-pixel text-xs mt-2 opacity-80">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
