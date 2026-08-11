import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { upsertSocial, deleteSocial } from "@/lib/admin.functions";
import type { SocialRow } from "@/lib/cms-types";
import { SortableList } from "@/components/admin/SortableList";

export const Route = createFileRoute("/_authenticated/admin/socials")({
  component: SocialsEditor,
});

function SocialsEditor() {
  const [rows, setRows] = useState<SocialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const save = useServerFn(upsertSocial);
  const del = useServerFn(deleteSocial);

  async function load() {
    const { data } = await supabase.from("socials").select("*").order("sort_order");
    setRows((data ?? []) as SocialRow[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function updateById(id: string, patch: Partial<SocialRow>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function update(i: number, patch: Partial<SocialRow>) {
    setRows((rs) => rs.map((r, j) => j === i ? { ...r, ...patch } : r));
  }
  async function saveRow(row: SocialRow) {
    try { await save({ data: row }); toast.success("Saved"); load(); } catch (e: any) { toast.error(e.message); }
  }
  async function deleteRow(row: SocialRow) {
    if (!confirm(`Delete ${row.label}?`)) return;
    try { await del({ data: { id: row.id } }); toast.success("Deleted"); load(); } catch (e: any) { toast.error(e.message); }
  }
  async function addNew() {
    const nextOrder = Math.max(0, ...rows.map((r) => r.sort_order)) + 1;
    try {
      await save({ data: { label: "New link", href: "", sort_order: nextOrder, visible: false } });
      load();
    } catch (e: any) { toast.error(e.message); }
  }

  if (loading) return <p className="font-pixel">Loading…</p>;

  const inp = "border-2 border-foreground bg-background px-2 py-1 font-body text-sm";

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Socials & Footer</h1>
        <button onClick={addNew} className="font-pixel text-sm border-2 border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background">+ NEW</button>
      </div>
      <p className="font-pixel text-xs text-muted-foreground">
        Only rows marked <em>visible</em> AND with a non-empty URL appear in the footer.
      </p>

      <SortableList
        table="socials"
        items={rows}
        className="space-y-3"
        onReorder={(next) => setRows(next.map((r, i) => ({ ...r, sort_order: i })))}
        renderItem={(row) => (
          <div className="border-2 border-foreground p-3 grid grid-cols-12 gap-2 items-center">
            <input className={`${inp} col-span-3`} value={row.label} onChange={(e) => updateById(row.id, { label: e.target.value })} placeholder="Label" aria-label="Label" />
            <input className={`${inp} col-span-6`} value={row.href} onChange={(e) => updateById(row.id, { href: e.target.value })} placeholder="https://…" aria-label="URL" />
            <label className="col-span-1 font-pixel text-xs flex items-center gap-1">
              <input type="checkbox" checked={row.visible} onChange={(e) => updateById(row.id, { visible: e.target.checked })} /> ON
            </label>
            <button onClick={() => saveRow(row)} className="col-span-1 font-pixel text-xs border-2 border-foreground py-1 hover:bg-foreground hover:text-background">SAVE</button>
            <button onClick={() => deleteRow(row)} className="col-span-1 font-pixel text-xs text-destructive hover:underline">DEL</button>
          </div>
        )}
      />
    </div>
  );
}
