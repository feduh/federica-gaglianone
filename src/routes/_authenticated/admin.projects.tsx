import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { upsertProject, deleteProject, uploadAsset } from "@/lib/admin.functions";
import type { Tag } from "@/lib/portfolio-types";

type ProjEdit = {
  id?: string; year: number; cover_url: string | null; link_url: string | null;
  title_it: string; title_en: string; summary_it: string | null; summary_en: string | null;
  body_it: string | null; body_en: string | null; sort_order: number;
  tag_ids: string[];
};

export const Route = createFileRoute("/_authenticated/admin/projects")({
  component: ProjectsEditor,
});

function ProjectsEditor() {
  const [projs, setProjs] = useState<ProjEdit[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const save = useServerFn(upsertProject);
  const del = useServerFn(deleteProject);
  const upload = useServerFn(uploadAsset);

  async function load() {
    const [{ data: p }, { data: t }] = await Promise.all([
      supabase.from("projects").select("*, project_tags(tag_id)").order("sort_order"),
      supabase.from("tags").select("*").order("label_en"),
    ]);
    setProjs((p ?? []).map((r: any) => ({
      id: r.id, year: r.year, cover_url: r.cover_url, link_url: r.link_url,
      title_it: r.title_it, title_en: r.title_en, summary_it: r.summary_it, summary_en: r.summary_en,
      body_it: r.body_it, body_en: r.body_en, sort_order: r.sort_order,
      tag_ids: (r.project_tags ?? []).map((pt: any) => pt.tag_id),
    })));
    setTags((t ?? []) as Tag[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function update(i: number, patch: Partial<ProjEdit>) {
    setProjs((rs) => rs.map((r, j) => j === i ? { ...r, ...patch } : r));
  }
  function toggleTag(i: number, tagId: string) {
    const cur = new Set(projs[i].tag_ids);
    if (cur.has(tagId)) cur.delete(tagId); else cur.add(tagId);
    update(i, { tag_ids: Array.from(cur) });
  }
  async function saveRow(row: ProjEdit) {
    try { await save({ data: row }); toast.success("Saved"); load(); } catch (e: any) { toast.error(e.message); }
  }
  async function deleteRow(row: ProjEdit) {
    if (!row.id || !confirm("Delete project?")) return;
    try { await del({ data: { id: row.id } }); toast.success("Deleted"); load(); } catch (e: any) { toast.error(e.message); }
  }
  async function addNew() {
    const nextOrder = Math.max(0, ...projs.map((r) => r.sort_order)) + 1;
    try { await save({ data: {
      year: new Date().getFullYear(), cover_url: null, link_url: null,
      title_it: "Nuovo", title_en: "New", summary_it: null, summary_en: null,
      body_it: null, body_en: null, sort_order: nextOrder, tag_ids: [],
    } }); load(); } catch (e: any) { toast.error(e.message); }
  }
  async function onUpload(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const buf = await file.arrayBuffer();
    const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
    const path = `projects-cover/${Date.now()}-${file.name}`;
    try {
      const { url } = await upload({ data: { path, base64: b64, contentType: file.type || "application/octet-stream" } });
      update(i, { cover_url: url });
      toast.success("Cover uploaded — remember to SAVE the project");
    } catch (err: any) { toast.error(err.message); }
  }

  if (loading) return <p className="font-pixel">Loading…</p>;
  const inp = "w-full border-2 border-foreground bg-background px-2 py-1 font-body text-sm";
  const lab = "font-pixel text-[10px] mb-1 block";

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-4xl">Projects</h1>
        <button onClick={addNew} className="font-pixel text-sm border-2 border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background">+ NEW</button>
      </div>

      <div className="space-y-4">
        {projs.map((row, i) => (
          <details key={row.id} className="border-2 border-foreground p-4">
            <summary className="font-display text-xl cursor-pointer">{row.year} · {row.title_en || "(untitled)"}</summary>
            <div className="mt-4 grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-3 space-y-2">
                {row.cover_url && <img src={row.cover_url} alt="" className="w-full aspect-square object-contain border-2 border-foreground bg-background" />}
                <label className={lab}>UPLOAD COVER (SVG/PNG/JPG)</label>
                <input type="file" accept="image/*" onChange={(e) => onUpload(i, e)} className="font-pixel text-xs" />
                <input className={inp} placeholder="or paste URL" value={row.cover_url ?? ""} onChange={(e) => update(i, { cover_url: e.target.value || null })} />
              </div>
              <div className="col-span-12 md:col-span-9 space-y-3">
                <div className="grid grid-cols-4 gap-3">
                  <div><label className={lab}>YEAR</label><input type="number" className={inp} value={row.year} onChange={(e) => update(i, { year: Number(e.target.value) })} /></div>
                  <div><label className={lab}>ORDER</label><input type="number" className={inp} value={row.sort_order} onChange={(e) => update(i, { sort_order: Number(e.target.value) })} /></div>
                  <div className="col-span-2"><label className={lab}>LINK URL</label><input className={inp} value={row.link_url ?? ""} onChange={(e) => update(i, { link_url: e.target.value || null })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={lab}>TITLE (IT)</label><input className={inp} value={row.title_it} onChange={(e) => update(i, { title_it: e.target.value })} /></div>
                  <div><label className={lab}>TITLE (EN)</label><input className={inp} value={row.title_en} onChange={(e) => update(i, { title_en: e.target.value })} /></div>
                  <div><label className={lab}>SUMMARY (IT)</label><textarea rows={2} className={inp} value={row.summary_it ?? ""} onChange={(e) => update(i, { summary_it: e.target.value || null })} /></div>
                  <div><label className={lab}>SUMMARY (EN)</label><textarea rows={2} className={inp} value={row.summary_en ?? ""} onChange={(e) => update(i, { summary_en: e.target.value || null })} /></div>
                  <div><label className={lab}>BODY (IT)</label><textarea rows={4} className={inp} value={row.body_it ?? ""} onChange={(e) => update(i, { body_it: e.target.value || null })} /></div>
                  <div><label className={lab}>BODY (EN)</label><textarea rows={4} className={inp} value={row.body_en ?? ""} onChange={(e) => update(i, { body_en: e.target.value || null })} /></div>
                </div>
                <div>
                  <label className={lab}>TAGS</label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <button key={t.id} type="button" onClick={() => toggleTag(i, t.id)}
                        className={`font-pixel text-xs border-2 border-foreground px-2 py-1 ${row.tag_ids.includes(t.id) ? "bg-foreground text-background" : ""}`}>
                        # {t.label_en}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => saveRow(row)} className="font-pixel text-xs border-2 border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background">SAVE</button>
                  <button onClick={() => deleteRow(row)} className="font-pixel text-xs text-destructive hover:underline">DELETE</button>
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
