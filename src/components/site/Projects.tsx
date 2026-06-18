import { useMemo, useState } from "react";
import { useLang } from "@/lib/i18n";
import type { Project, Tag } from "@/lib/portfolio-types";
import { TagFilter } from "./TagFilter";
import { PixelButton } from "./PixelButton";

export function Projects({ items, tags }: { items: Project[]; tags: Tag[] }) {
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
    <section id="projects" className="border-t-2 border-foreground py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <h2 className="font-display text-5xl md:text-7xl mb-12 text-accent">{t("projectsTitle")}</h2>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground border-2 border-foreground">
            {filtered.map((p, idx) => {
              const isOpen = open === p.id;
              const title = lang === "en" ? p.title_en : p.title_it;
              const summary = lang === "en" ? p.summary_en : p.summary_it;
              const body = lang === "en" ? p.body_en : p.body_it;
              const offset = idx % 3 === 0 ? "md:row-span-2" : "";
              return (
                <article
                  key={p.id}
                  className={`bg-background p-6 md:p-10 flex flex-col ${offset}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-pixel text-xs text-muted-foreground">
                      № {String(idx + 1).padStart(2, "0")} / {p.year}
                    </span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {p.tags.map((tg) => (
                        <span
                          key={tg.id}
                          className="font-pixel text-[11px] border border-foreground px-1.5 py-0.5"
                        >
                          # {lang === "en" ? tg.label_en : tg.label_it}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-6">
                    {p.cover_url && (
                      <img
                        src={p.cover_url}
                        alt=""
                        className="w-14 h-14 md:w-20 md:h-20 object-contain shrink-0"
                      />
                    )}
                    <h3 className="font-display text-4xl md:text-6xl leading-[0.95] min-w-0 break-words">
                      {title}
                    </h3>
                  </div>
                  {summary && (
                    <p className="font-body text-base md:text-lg mt-4 leading-relaxed text-muted-foreground">
                      {summary}
                    </p>
                  )}
                  {isOpen && body && (
                    <p className="font-body text-base mt-4 leading-relaxed border-t-2 border-foreground pt-4">
                      {body}
                    </p>
                  )}
                  <div className="mt-auto pt-6 flex flex-wrap gap-3 items-center">
                    <button
                      data-cursor="link"
                      onClick={() => setOpen(isOpen ? null : p.id)}
                      className="font-pixel text-sm underline underline-offset-4 hover:text-accent"
                    >
                      {isOpen ? `− ${t("collapse")}` : `+ ${t("expand")}`}
                    </button>
                    {p.link_url && (
                      <PixelButton href={p.link_url} target="_blank" rel="noreferrer">
                        {t("viewProject")}
                      </PixelButton>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
