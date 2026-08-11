import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/lib/i18n";
import type { Project, Publication } from "@/lib/portfolio-types";

type Item = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  href: string;
  external?: boolean;
};

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function CommandPalette({
  publications,
  projects,
}: {
  publications: Publication[];
  projects: Project[];
}) {
  const { lang, t } = useLang();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setCursor(0);
    }
  }, [open]);

  const items = useMemo<Item[]>(() => {
    const sections: Item[] = [
      { id: "s-timeline", group: "Sections", label: t("timelineTitle"), href: "#timeline" },
      { id: "s-pubs", group: "Sections", label: t("publicationsTitle"), href: "#publications" },
      { id: "s-projs", group: "Sections", label: t("projectsTitle"), href: "#projects" },
      { id: "s-res", group: "Sections", label: t("researchTitle"), href: "#research" },
      { id: "s-contact", group: "Sections", label: t("contactTitle"), href: "#contact" },
    ];
    const pubs: Item[] = publications.map((p) => ({
      id: `pub-${p.id}`,
      group: t("publicationsTitle"),
      label: lang === "en" ? p.title_en : p.title_it,
      hint: `${p.year}${p.venue ? ` · ${p.venue}` : ""}`,
      href: `#pub-${p.id}`,
    }));
    const projs: Item[] = projects.map((p) => ({
      id: `proj-${p.id}`,
      group: t("projectsTitle"),
      label: lang === "en" ? p.title_en : p.title_it,
      hint: String(p.year),
      href: `#proj-${p.id}`,
    }));
    return [...sections, ...pubs, ...projs];
  }, [publications, projects, lang, t]);

  const results = useMemo(() => {
    const n = normalize(q.trim());
    if (!n) return items;
    return items.filter(
      (i) => normalize(i.label).includes(n) || normalize(i.hint ?? "").includes(n),
    );
  }, [items, q]);

  const go = (item: Item | undefined) => {
    if (!item) return;
    setOpen(false);
    const el = document.querySelector(item.href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      (el as HTMLElement).focus?.();
    }
  };

  if (!open) return null;

  const label = lang === "en" ? "Search the site" : "Cerca nel sito";

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-start justify-center bg-background/80 p-4 pt-[12vh]"
      role="presentation"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl border-2 border-foreground bg-background shadow-[8px_8px_0_0_var(--color-accent)]"
      >
        <label htmlFor="cmdk-input" className="sr-only">
          {label}
        </label>
        <input
          id="cmdk-input"
          autoFocus
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setCursor(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setCursor((c) => Math.min(c + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setCursor((c) => Math.max(c - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              go(results[cursor]);
            }
          }}
          placeholder={lang === "en" ? "Type to search…" : "Scrivi per cercare…"}
          className="w-full bg-transparent border-b-2 border-foreground px-4 py-4 font-pixel text-xl outline-none placeholder:text-muted-foreground"
        />
        <ul className="max-h-[50vh] overflow-y-auto" role="listbox" aria-label={label}>
          {results.length === 0 && (
            <li className="px-4 py-6 font-pixel text-sm text-muted-foreground">
              {lang === "en" ? "No results" : "Nessun risultato"}
            </li>
          )}
          {results.map((r, i) => (
            <li key={r.id} role="option" aria-selected={i === cursor}>
              <button
                onMouseEnter={() => setCursor(i)}
                onClick={() => go(r)}
                className={`w-full text-left px-4 py-3 flex items-baseline gap-3 ${
                  i === cursor ? "bg-accent text-accent-foreground" : "hover:bg-foreground/10"
                }`}
              >
                <span className="font-pixel text-[11px] opacity-70 shrink-0 w-24 truncate">
                  {r.group}
                </span>
                <span className="font-body text-base truncate">{r.label}</span>
                {r.hint && (
                  <span className="font-pixel text-[11px] opacity-70 ml-auto shrink-0">
                    {r.hint}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
        <p className="border-t-2 border-foreground px-4 py-2 font-pixel text-[11px] text-muted-foreground">
          ↑↓ {lang === "en" ? "navigate" : "naviga"} · ⏎ {lang === "en" ? "open" : "apri"} · ESC{" "}
          {lang === "en" ? "close" : "chiudi"}
        </p>
      </div>
    </div>
  );
}
