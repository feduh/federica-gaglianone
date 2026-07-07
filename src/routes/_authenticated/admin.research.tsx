import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { upsertResearch, deleteResearch } from "@/lib/admin.functions";
import type { ResearchRow } from "@/lib/cms-types";

export const Route = createFileRoute("/_authenticated/admin/research")({
  component: ResearchEditor,
});

function ResearchEditor() {
  const [rows, setRows] = useState<ResearchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const save = useServerFn(upsertResearch);
  const del = useServerFn(deleteResearch);

  async function load() {
    const { data } = await supabase.from("research_directions").select("*").order("sort_order");
    setRows((data ?? []) as ResearchRow[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function update(i: number, patch: Partial<ResearchRow>) {
    setRows((rs) => rs.map((r, j) => j === i ? { ...r, ...patch } : r));
  }
  async function saveRow(row: ResearchRow) {
    try { await save({ data: row }); toast.success("Saved"); load(); } catch (e: any) { toast.error(e.message); }
  }
  async function deleteRow(row: ResearchRow) {
    if (!confirm("Delete?")) return;
    try { await del({ data: { id: row.id } }); toast.success("Deleted"); load(); } catch (e: any) { toast.error(e.message); }
  }
  async function addNew() {
    const nextOrder = Math.max(0, ...rows.map((r) => r.sort_order)) + 1;
    try { await save({ data: { title_it: "", title_en: "", body_it: "", body_en: "", sort_order: nextOrder } }); load(); } catch (e: any) { toast.error(e.message); }
  }

  if (loading) return <p className="font-pixel">Loading…</p>;
  const inp = "w-full border-2 border-foreground bg-background px-2 py-1 font-body text-sm";
  const lab = "font-pixel text-[10px] mb-1 block";

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Research directions</h1>
        <button onClick={addNew} className="font-pixel text-sm border-2 border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background">+ NEW</button>
      </div>

      <div className="space-y-4">
        {rows.map((row, i) => (
          <div key={row.id} className="border-2 border-foreground p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lab}>QUESTION (IT)</label><input className={inp} value={row.title_it} onChange={(e) => update(i, { title_it: e.target.value })} /></div>
              <div><label className={lab}>QUESTION (EN)</label><input className={inp} value={row.title_en} onChange={(e) => update(i, { title_en: e.target.value })} /></div>
              <div><label className={lab}>NOTE (IT)</label><textarea rows={3} className={inp} value={row.body_it} onChange={(e) => update(i, { body_it: e.target.value })} /></div>
              <div><label className={lab}>NOTE (EN)</label><textarea rows={3} className={inp} value={row.body_en} onChange={(e) => update(i, { body_en: e.target.value })} /></div>
              <div className="col-span-2 flex items-center gap-4">
                <label className="font-pixel text-xs">ORDER <input type="number" className={`${inp} w-20 inline-block`} value={row.sort_order} onChange={(e) => update(i, { sort_order: Number(e.target.value) })} /></label>
                <button onClick={() => saveRow(row)} className="font-pixel text-xs border-2 border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background">SAVE</button>
                <button onClick={() => deleteRow(row)} className="font-pixel text-xs text-destructive hover:underline">DELETE</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
