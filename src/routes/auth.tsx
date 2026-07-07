import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin — Federica Gaglianone" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Signed in");
    await router.invalidate();
    navigate({ to: "/admin" });
  }

  async function onReset() {
    if (!email) return toast.error("Enter your email first");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset email sent");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md border-2 border-foreground p-8 space-y-6"
      >
        <div>
          <p className="font-pixel text-xs text-muted-foreground mb-2">▸ RESTRICTED</p>
          <h1 className="font-display text-4xl">Admin sign in</h1>
        </div>

        <div className="space-y-3">
          <div>
            <label className="font-pixel text-xs mb-1 block">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-2 border-foreground bg-background px-3 py-2 font-body"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="font-pixel text-xs mb-1 block">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-2 border-foreground bg-background px-3 py-2 font-body"
              autoComplete="current-password"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={busy}
            className="font-pixel border-2 border-foreground py-3 hover:bg-foreground hover:text-background disabled:opacity-50"
          >
            {busy ? "…" : "▸ SIGN IN"}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="font-pixel text-xs text-muted-foreground hover:text-foreground"
          >
            Forgot password?
          </button>
        </div>

        <p className="font-pixel text-[10px] text-muted-foreground border-t border-foreground pt-4">
          This page is not indexed. Only site administrators can sign in.
        </p>
      </form>
    </div>
  );
}
