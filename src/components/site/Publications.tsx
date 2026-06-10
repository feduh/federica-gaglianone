import { useMemo, useState } from "react";
import { useLang } from "@/lib/i18n";
import type { Publication, Tag } from "@/lib/portfolio-types";
import { TagFilter } from "./TagFilter";
import { PixelButton } from "./PixelButton";

export function Publications({ items, tags }: { items: Publication[]; tags: Tag[] }) {
  const { lang, t } = useLang();
  const [active, setActive] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (active.size === 0) return items;
    return items.filter((p) => p.tags.some((tg) => active.has(tg.slug)));
  }, [items, active]);

  const usedTags = useMemo(() => {
    const slugs = new Set<string>();
    items.forEach((p) => p.tags.forEach((t) => slugs.add(t.slug)));
    return tags.filter((t) => slugs.has(t.slug));
  }, [items, tags]);

  return (
    <section id="publications" className="border-t-2 border-foreground py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <h2 className="font-display text-5xl md:text-7xl mb-12">{t("publicationsTitle")}</h2>
        <TagFilter
          tags={usedTags}
          active={active}
          onToggle={(slug) => {
            const next = new Set(active);
            if (next.has(slug)) next.delete(slug);
            else next.add(slug);
            setActive(next);
          }}
          onClear={() => setActive(new Set())}
        />

        {filtered.length === 0 ? (
          <p className="font-pixel text-muted-foreground py-12">{t("emptyResults")}</p>
        ) : (
          <ul className="border-t-2 border-foreground">
            {filtered.map((p, idx) => {
              const isOpen = open === p.id;
              const title = lang === "en" ? p.title_en : p.title_it;
              const abstract = lang === "en" ? p.abstract_en : p.abstract_it;
              return (
                <li key={p.id} className="border-b-2 border-foreground">
                  <button
                    data-cursor="link"
                    onClick={() => setOpen(isOpen ? null : p.id)}
                    className="w-full text-left py-8 grid grid-cols-12 gap-4 items-baseline group hover:bg-foreground/5 transition-colors px-2"
                    aria-expanded={isOpen}
                  >
                    <span className="col-span-2 md:col-span-1 font-pixel text-lg md:text-2xl text-muted-foreground">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="col-span-10 md:col-span-8">
                      <span className="block font-display text-3xl md:text-5xl leading-[0.95]">
                        {title}
                      </span>
                      <span className="block font-pixel text-xs md:text-sm text-muted-foreground mt-3">
                        {p.authors}
                        {p.venue ? ` · ${p.venue}` : ""}
                      </span>
                    </span>
                    <span className="hidden md:block col-span-2 font-pixel text-2xl text-right">
                      {p.year}
                    </span>
                    <span className="col-span-12 md:col-span-1 font-pixel text-2xl text-right">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-2 pb-10 grid grid-cols-12 gap-4">
                      <div className="col-span-12 md:col-span-8 md:col-start-2">
                        {abstract && (
                          <p className="font-body text-lg leading-relaxed mb-6">{abstract}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {p.tags.map((tg) => (
                            <span
                              key={tg.id}
                              className="font-pixel text-xs border border-foreground px-2 py-1"
                            >
                              # {lang === "en" ? tg.label_en : tg.label_it}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {p.pdf_url && (
                            <PixelButton href={p.pdf_url} target="_blank" rel="noreferrer">
                              {t("readPdf")}
                            </PixelButton>
                          )}
                          {p.doi && (
                            <PixelButton
                              href={`https://doi.org/${p.doi}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {t("doi")} · {p.doi}
                            </PixelButton>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
