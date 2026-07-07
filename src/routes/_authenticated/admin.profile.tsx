import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { uploadAsset, upsertProfile } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/profile")({
  component: ProfileEditor,
});

function ProfileEditor() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({
    id: "" as string | undefined,
    name: "", role: "", email: "", city: "",
    bio_it: "", bio_en: "", seeking_it: "", seeking_en: "",
    interests: [] as string[], avatar_url: null as string | null,
  });
  const [interestsRaw, setInterestsRaw] = useState("");
  const upload = useServerFn(uploadAsset);
  const save = useServerFn(upsertProfile);

  useEffect(() => {
    supabase.from("profile").select("*").limit(1).maybeSingle().then(({ data }) => {
      if (data) {
        const interests: string[] = Array.isArray(data.interests)
          ? (data.interests as unknown[]).filter((v): v is string => typeof v === "string")
          : [];
        setState({
          id: data.id, name: data.name, role: data.role, email: data.email, city: data.city,
          bio_it: data.bio_it, bio_en: data.bio_en,
          seeking_it: data.seeking_it, seeking_en: data.seeking_en,
          interests,
          avatar_url: data.avatar_url,
        });
        setInterestsRaw(interests.join(", "));
      }
      setLoading(false);
    });
  }, []);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const buf = await file.arrayBuffer();
    const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
    const path = `avatar/${Date.now()}-${file.name}`;
    try {
      const { url } = await upload({ data: { path, base64: b64, contentType: file.type || "application/octet-stream" } });
      setState((s) => ({ ...s, avatar_url: url }));
      toast.success("Avatar uploaded");
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    const interests = interestsRaw.split(",").map((s) => s.trim()).filter(Boolean);
    try {
      await save({ data: { ...state, interests } });
      toast.success("Profile saved");
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  if (loading) return <p className="font-pixel">Loading…</p>;

  const inp = "w-full border-2 border-foreground bg-background px-3 py-2 font-body";
  const lab = "font-pixel text-xs mb-1 block";

  return (
    <form onSubmit={onSave} className="space-y-6 max-w-3xl">
      <h1 className="font-display text-4xl">Profile</h1>

      <div className="grid grid-cols-2 gap-4">
        <div><label className={lab}>NAME</label><input className={inp} value={state.name} onChange={(e) => setState({ ...state, name: e.target.value })} /></div>
        <div><label className={lab}>ROLE</label><input className={inp} value={state.role} onChange={(e) => setState({ ...state, role: e.target.value })} /></div>
        <div><label className={lab}>EMAIL</label><input className={inp} value={state.email} onChange={(e) => setState({ ...state, email: e.target.value })} /></div>
        <div><label className={lab}>CITY</label><input className={inp} value={state.city} onChange={(e) => setState({ ...state, city: e.target.value })} /></div>
      </div>

      <div><label className={lab}>BIO (IT)</label><textarea rows={8} className={inp} value={state.bio_it} onChange={(e) => setState({ ...state, bio_it: e.target.value })} /></div>
      <div><label className={lab}>BIO (EN)</label><textarea rows={8} className={inp} value={state.bio_en} onChange={(e) => setState({ ...state, bio_en: e.target.value })} /></div>

      <div><label className={lab}>SEEKING (IT)</label><textarea rows={3} className={inp} value={state.seeking_it} onChange={(e) => setState({ ...state, seeking_it: e.target.value })} /></div>
      <div><label className={lab}>SEEKING (EN)</label><textarea rows={3} className={inp} value={state.seeking_en} onChange={(e) => setState({ ...state, seeking_en: e.target.value })} /></div>

      <div>
        <label className={lab}>INTERESTS (comma-separated)</label>
        <input className={inp} value={interestsRaw} onChange={(e) => setInterestsRaw(e.target.value)} />
      </div>

      <div>
        <label className={lab}>AVATAR</label>
        {state.avatar_url && <img src={state.avatar_url} alt="" className="w-32 h-32 object-cover border-2 border-foreground mb-2" />}
        <input type="file" accept="image/*" onChange={onUpload} className="font-pixel text-xs" />
      </div>

      <button type="submit" className="font-pixel border-2 border-foreground px-4 py-2 hover:bg-foreground hover:text-background">▸ SAVE</button>
    </form>
  );
}
