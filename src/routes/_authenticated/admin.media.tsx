import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { listAssets, deleteAsset, uploadAsset } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/media")({
  component: MediaLibrary,
});

type Asset = { path: string; name: string; size: number; updated_at: string | null; url: string };

const FOLDERS = ["projects-cover", "avatars", "publications"] as const;

function MediaLibrary() {
  const [files, setFiles] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [folder, setFolder] = useState<string>("projects-cover");
  const [busy, setBusy] = useState(false);
  const list = useServerFn(listAssets);
  const remove = useServerFn(deleteAsset);
  const upload = useServerFn(uploadAsset);

  async function load() {
    setLoading(true);
    try {
      const res = await list({ data: {} });
      setFiles(res.files);
    } catch (e: any) {
      toast.error(e?.message ?? "Impossibile caricare i media");
    }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function onUpload(file: File) {
    setBusy(true);
    try {
      const b64 = await new Promise<string>((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(String(fr.result).split(",")[1] ?? "");
        fr.onerror = reject;
        fr.readAsDataURL(file);
      });
      await upload({ data: { folder, filename: file.name, contentType: file.type || "application/octet-stream", base64: b64 } });
      toast.success("Caricato");
      load();
    } catch (e: any) {
      toast.error(e?.message ?? "Upload fallito");
    }
    setBusy(false);
  }

  async function onDelete(a: Asset) {
    if (!confirm(`Eliminare ${a.name}? I contenuti che lo usano perderanno l'immagine.`)) return;
    try {
      await remove({ data: { path: a.path } });
      toast.success("Eliminato");
      load();
    } catch (e: any) {
      toast.error(e?.message ?? "Eliminazione fallita");
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-4xl">Media library</h1>
        <div className="flex items-center gap-2">
          <label className="font-pixel text-[10px] text-muted-foreground" htmlFor="media-folder">CARTELLA</label>
          <select
            id="media-folder"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="border-2 border-foreground bg-background px-2 py-1 font-pixel text-xs"
          >
            {FOLDERS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          <label className="font-pixel text-sm border-2 border-foreground px-3 py-1.5 cursor-pointer hover:bg-foreground hover:text-background">
            {busy ? "…" : "+ UPLOAD"}
            <input
              type="file"
              accept="image/svg+xml,image/png,image/jpeg,image/webp,application/pdf"
              className="sr-only"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = ""; }}
            />
          </label>
        </div>
      </div>
      <p className="font-pixel text-xs text-muted-foreground">
        Copia l'URL e incollalo nei campi cover/avatar delle altre sezioni.
      </p>

      {loading ? (
        <p className="font-pixel">Loading…</p>
      ) : files.length === 0 ? (
        <p className="font-pixel text-muted-foreground">Nessun file caricato.</p>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {files.map((a) => (
            <li key={a.path} className="border-2 border-foreground p-3 flex flex-col gap-2">
              <div className="aspect-square bg-card/40 flex items-center justify-center overflow-hidden">
                <img src={a.url} alt={a.name} loading="lazy" className="max-h-full max-w-full object-contain" />
              </div>
              <p className="font-pixel text-[10px] break-all">{a.name}</p>
              <p className="font-pixel text-[10px] text-muted-foreground">{Math.round(a.size / 1024)} KB</p>
              <div className="mt-auto flex gap-2">
                <button
                  onClick={() => { navigator.clipboard.writeText(a.url); toast.success("URL copiato"); }}
                  className="font-pixel text-[10px] border-2 border-foreground px-2 py-1 hover:bg-foreground hover:text-background"
                >
                  COPY URL
                </button>
                <button onClick={() => onDelete(a)} className="font-pixel text-[10px] text-destructive hover:underline">
                  DELETE
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
