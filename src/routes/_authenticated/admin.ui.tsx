import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { upsertUiString } from "@/lib/admin.functions";
import type { UiStringRow } from "@/lib/cms-types";

export const Route = createFileRoute("/_authenticated/admin/ui")({
  component: UiEditor,
});

function UiEditor() {
  const [rows, setRows] = useState<UiStringRow[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const save = useServerFn(upsertUiString);

  async function load() {
    const { data } = await supabase.from("ui_strings").select("*").order("key");
    setRows((data ?? []) as UiStringRow[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function update(i: number, patch: Partial<UiStringRow>) {
    setRows((rs) => rs.map((r, j) => j === i ? { ...r, ...patch } : r));
  }
  async function saveRow(row: UiStringRow) {
    try { await save({ data: row }); toast.success(`Saved ${row.key}`); } catch (e: any) { toast.error(e.message); }
  }

  const filtered = useMemo(() =>
    rows.filter((r) => r.key.toLowerCase().includes(q.toLowerCase()) ||
      r.value_it.toLowerCase().includes(q.toLowerCase()) ||
      r.value_en.toLowerCase().includes(q.toLowerCase())),
    [rows, q]);

  if (loading) return <p className="font-pixel">Loading…</p>;

  const inp = "w-full border-2 border-foreground bg-background px-2 py-1 font-body text-sm";

  return (
    <div className="space-y-4 max-w-5xl">
      <h1 className="font-display text-4xl">UI strings (i18n)</h1>
      <p className="font-pixel text-xs text-muted-foreground">
        Testi bilingue di navigazione, titoli sezione, pulsanti, footer. Modifica e premi SAVE riga per riga.
      </p>
      <input className={inp} placeholder="Search key or content…" value={q} onChange={(e) => setQ(e.target.value)} />

      <div className="space-y-2">
        {filtered.map((row, i) => {
          const idx = rows.findIndex((r) => r.key === row.key);
          return (
            <div key={row.key} className="border-2 border-foreground p-3 grid grid-cols-12 gap-2 items-start">
              <code className="col-span-2 font-pixel text-xs pt-2 break-all">{row.key}</code>
              <textarea rows={2} className={`${inp} col-span-4`} value={row.value_it} onChange={(e) => update(idx, { value_it: e.target.value })} placeholder="IT" />
              <textarea rows={2} className={`${inp} col-span-4`} value={row.value_en} onChange={(e) => update(idx, { value_en: e.target.value })} placeholder="EN" />
              <button onClick={() => saveRow(rows[idx])} className="col-span-2 font-pixel text-xs border-2 border-foreground py-2 hover:bg-foreground hover:text-background">SAVE</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
