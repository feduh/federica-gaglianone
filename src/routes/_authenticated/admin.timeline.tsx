import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { upsertTimeline, deleteTimeline } from "@/lib/admin.functions";
import type { TimelineRow } from "@/lib/cms-types";

export const Route = createFileRoute("/_authenticated/admin/timeline")({
  component: TimelineEditor,
});

function TimelineEditor() {
  const [rows, setRows] = useState<TimelineRow[]>([]);
  const [loading, setLoading] = useState(true);
  const save = useServerFn(upsertTimeline);
  const del = useServerFn(deleteTimeline);

  async function load() {
    const { data } = await supabase.from("timeline_entries").select("*").order("sort_order");
    setRows((data ?? []) as TimelineRow[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function update(i: number, patch: Partial<TimelineRow>) {
    setRows((rs) => rs.map((r, j) => j === i ? { ...r, ...patch } : r));
  }
  async function saveRow(row: TimelineRow) {
    try { await save({ data: row }); toast.success("Saved"); load(); } catch (e: any) { toast.error(e.message); }
  }
  async function deleteRow(row: TimelineRow) {
    if (!confirm(`Delete ${row.course_en || row.year_from}?`)) return;
    try { await del({ data: { id: row.id } }); toast.success("Deleted"); load(); } catch (e: any) { toast.error(e.message); }
  }
  async function addNew() {
    const nextOrder = Math.max(0, ...rows.map((r) => r.sort_order)) + 1;
    const y = new Date().getFullYear();
    try {
      await save({ data: {
        year_from: y, year_to: y,
        course_it: "", course_en: "",
        institution_it: "", institution_en: "",
        body_it: "", body_en: "", sort_order: nextOrder,
      }});
      load();
    } catch (e: any) { toast.error(e.message); }
  }

  if (loading) return <p className="font-pixel">Loading…</p>;
  const inp = "w-full border-2 border-foreground bg-background px-2 py-1 font-body text-sm";
  const lab = "font-pixel text-[10px] mb-1 block";

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Timeline</h1>
        <button onClick={addNew} className="font-pixel text-sm border-2 border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background">+ NEW</button>
      </div>

      <div className="space-y-4">
        {rows.map((row, i) => (
          <div key={row.id} className="border-2 border-foreground p-4 space-y-3">
            <div className="grid grid-cols-6 gap-3">
              <div className="col-span-1">
                <label className={lab}>YEAR FROM</label>
                <input type="number" className={inp} value={row.year_from}
                  onChange={(e) => update(i, { year_from: Number(e.target.value) })} />
              </div>
              <div className="col-span-1">
                <label className={lab}>YEAR TO</label>
                <input type="number" placeholder="—" className={inp}
                  value={row.year_to ?? ""}
                  onChange={(e) => update(i, { year_to: e.target.value === "" ? null : Number(e.target.value) })} />
              </div>
              <div className="col-span-1">
                <label className={lab}>ORDER</label>
                <input type="number" className={inp} value={row.sort_order}
                  onChange={(e) => update(i, { sort_order: Number(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lab}>COURSE (IT)</label>
                <input className={inp} value={row.course_it}
                  onChange={(e) => update(i, { course_it: e.target.value })} /></div>
              <div><label className={lab}>COURSE (EN)</label>
                <input className={inp} value={row.course_en}
                  onChange={(e) => update(i, { course_en: e.target.value })} /></div>
              <div><label className={lab}>INSTITUTION (IT)</label>
                <input className={inp} value={row.institution_it}
                  onChange={(e) => update(i, { institution_it: e.target.value })} /></div>
              <div><label className={lab}>INSTITUTION (EN)</label>
                <input className={inp} value={row.institution_en}
                  onChange={(e) => update(i, { institution_en: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lab}>BODY (IT)</label><textarea rows={4} className={inp} value={row.body_it} onChange={(e) => update(i, { body_it: e.target.value })} /></div>
              <div><label className={lab}>BODY (EN)</label><textarea rows={4} className={inp} value={row.body_en} onChange={(e) => update(i, { body_en: e.target.value })} /></div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => saveRow(row)} className="font-pixel text-xs border-2 border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background">SAVE</button>
              <button onClick={() => deleteRow(row)} className="font-pixel text-xs text-destructive hover:underline">DELETE</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
