import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { upsertPublication, deletePublication, upsertTag, deleteTag } from "@/lib/admin.functions";
import type { Tag } from "@/lib/portfolio-types";

type PubEdit = {
  id?: string; year: number; authors: string; venue: string | null; doi: string | null;
  pdf_url: string | null; title_it: string; title_en: string;
  abstract_it: string | null; abstract_en: string | null; sort_order: number;
  tag_ids: string[];
};

export const Route = createFileRoute("/_authenticated/admin/publications")({
  component: PublicationsEditor,
});

function PublicationsEditor() {
  const [pubs, setPubs] = useState<PubEdit[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTags, setShowTags] = useState(false);
  const save = useServerFn(upsertPublication);
  const del = useServerFn(deletePublication);
  const saveTag = useServerFn(upsertTag);
  const delTag = useServerFn(deleteTag);

  async function load() {
    const [{ data: p }, { data: t }] = await Promise.all([
      supabase.from("publications").select("*, publication_tags(tag_id)").order("sort_order"),
      supabase.from("tags").select("*").order("label_en"),
    ]);
    setPubs((p ?? []).map((r: any) => ({
      id: r.id, year: r.year, authors: r.authors, venue: r.venue, doi: r.doi, pdf_url: r.pdf_url,
      title_it: r.title_it, title_en: r.title_en, abstract_it: r.abstract_it, abstract_en: r.abstract_en,
      sort_order: r.sort_order,
      tag_ids: (r.publication_tags ?? []).map((pt: any) => pt.tag_id),
    })));
    setTags((t ?? []) as Tag[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function update(i: number, patch: Partial<PubEdit>) {
    setPubs((rs) => rs.map((r, j) => j === i ? { ...r, ...patch } : r));
  }
  function toggleTag(i: number, tagId: string) {
    const cur = new Set(pubs[i].tag_ids);
    if (cur.has(tagId)) cur.delete(tagId); else cur.add(tagId);
    update(i, { tag_ids: Array.from(cur) });
  }
  async function saveRow(row: PubEdit) {
    try { await save({ data: row }); toast.success("Saved"); load(); } catch (e: any) { toast.error(e.message); }
  }
  async function deleteRow(row: PubEdit) {
    if (!row.id || !confirm("Delete publication?")) return;
    try { await del({ data: { id: row.id } }); toast.success("Deleted"); load(); } catch (e: any) { toast.error(e.message); }
  }
  async function addNew() {
    const nextOrder = Math.max(0, ...pubs.map((r) => r.sort_order)) + 1;
    try { await save({ data: {
      year: new Date().getFullYear(), authors: "", venue: null, doi: null, pdf_url: null,
      title_it: "New", title_en: "New", abstract_it: null, abstract_en: null,
      sort_order: nextOrder, tag_ids: [],
    } }); load(); } catch (e: any) { toast.error(e.message); }
  }

  if (loading) return <p className="font-pixel">Loading…</p>;
  const inp = "w-full border-2 border-foreground bg-background px-2 py-1 font-body text-sm";
  const lab = "font-pixel text-[10px] mb-1 block";

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-4xl">Publications</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowTags((v) => !v)} className="font-pixel text-sm border-2 border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background">{showTags ? "− TAGS" : "▸ MANAGE TAGS"}</button>
          <button onClick={addNew} className="font-pixel text-sm border-2 border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background">+ NEW</button>
        </div>
      </div>

      {showTags && (
        <TagsManager tags={tags} onSave={async (t) => { await saveTag({ data: t }); load(); }} onDelete={async (id) => { if (confirm("Delete tag?")) { await delTag({ data: { id } }); load(); } }} />
      )}

      <div className="space-y-4">
        {pubs.map((row, i) => (
          <details key={row.id} className="border-2 border-foreground p-4">
            <summary className="font-display text-xl cursor-pointer">{row.year} · {row.title_en || "(untitled)"}</summary>
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-4 gap-3">
                <div><label className={lab}>YEAR</label><input type="number" className={inp} value={row.year} onChange={(e) => update(i, { year: Number(e.target.value) })} /></div>
                <div><label className={lab}>ORDER</label><input type="number" className={inp} value={row.sort_order} onChange={(e) => update(i, { sort_order: Number(e.target.value) })} /></div>
                <div className="col-span-2"><label className={lab}>AUTHORS</label><input className={inp} value={row.authors} onChange={(e) => update(i, { authors: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lab}>VENUE</label><input className={inp} value={row.venue ?? ""} onChange={(e) => update(i, { venue: e.target.value || null })} /></div>
                <div><label className={lab}>DOI</label><input className={inp} value={row.doi ?? ""} onChange={(e) => update(i, { doi: e.target.value || null })} /></div>
                <div className="col-span-2"><label className={lab}>PDF URL</label><input className={inp} value={row.pdf_url ?? ""} onChange={(e) => update(i, { pdf_url: e.target.value || null })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lab}>TITLE (IT)</label><input className={inp} value={row.title_it} onChange={(e) => update(i, { title_it: e.target.value })} /></div>
                <div><label className={lab}>TITLE (EN)</label><input className={inp} value={row.title_en} onChange={(e) => update(i, { title_en: e.target.value })} /></div>
                <div><label className={lab}>ABSTRACT (IT)</label><textarea rows={4} className={inp} value={row.abstract_it ?? ""} onChange={(e) => update(i, { abstract_it: e.target.value || null })} /></div>
                <div><label className={lab}>ABSTRACT (EN)</label><textarea rows={4} className={inp} value={row.abstract_en ?? ""} onChange={(e) => update(i, { abstract_en: e.target.value || null })} /></div>
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
          </details>
        ))}
      </div>
    </div>
  );
}

function TagsManager({ tags, onSave, onDelete }: { tags: Tag[]; onSave: (t: any) => Promise<void>; onDelete: (id: string) => Promise<void> }) {
  const [newSlug, setNewSlug] = useState("");
  const [newIt, setNewIt] = useState("");
  const [newEn, setNewEn] = useState("");
  const inp = "border-2 border-foreground bg-background px-2 py-1 font-body text-sm";
  return (
    <div className="border-2 border-foreground p-4 space-y-3">
      <h2 className="font-pixel text-sm">TAGS</h2>
      <div className="space-y-2">
        {tags.map((t) => (
          <div key={t.id} className="grid grid-cols-12 gap-2 items-center">
            <input className={`${inp} col-span-2`} defaultValue={t.slug} onBlur={(e) => onSave({ id: t.id, slug: e.target.value, label_it: t.label_it, label_en: t.label_en })} />
            <input className={`${inp} col-span-4`} defaultValue={t.label_it} onBlur={(e) => onSave({ id: t.id, slug: t.slug, label_it: e.target.value, label_en: t.label_en })} />
            <input className={`${inp} col-span-4`} defaultValue={t.label_en} onBlur={(e) => onSave({ id: t.id, slug: t.slug, label_it: t.label_it, label_en: e.target.value })} />
            <button onClick={() => onDelete(t.id)} className="col-span-2 font-pixel text-xs text-destructive hover:underline">DELETE</button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-12 gap-2 items-center border-t-2 border-foreground pt-3">
        <input className={`${inp} col-span-2`} placeholder="slug" value={newSlug} onChange={(e) => setNewSlug(e.target.value)} />
        <input className={`${inp} col-span-4`} placeholder="Label IT" value={newIt} onChange={(e) => setNewIt(e.target.value)} />
        <input className={`${inp} col-span-4`} placeholder="Label EN" value={newEn} onChange={(e) => setNewEn(e.target.value)} />
        <button onClick={async () => { if (!newSlug) return; await onSave({ slug: newSlug, label_it: newIt, label_en: newEn }); setNewSlug(""); setNewIt(""); setNewEn(""); }} className="col-span-2 font-pixel text-xs border-2 border-foreground py-1.5 hover:bg-foreground hover:text-background">+ ADD</button>
      </div>
    </div>
  );
}
