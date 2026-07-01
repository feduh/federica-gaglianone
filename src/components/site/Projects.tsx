import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
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

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    skipSnaps: false,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
  }, [emblaApi, filtered.length, open]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollNext();
    }
  };

  return (
    <section id="projects" className="border-t-2 border-foreground py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="flex items-end justify-between gap-6 mb-12 flex-wrap">
          <h2 className="font-display text-5xl md:text-7xl text-accent">{t("projectsTitle")}</h2>
          {filtered.length > 0 && (
            <div className="flex gap-2">
              <button
                data-cursor="link"
                aria-label="Previous project"
                onClick={scrollPrev}
                disabled={!canPrev}
                className="font-pixel text-sm border-2 border-foreground px-3 py-2 hover:bg-accent hover:text-accent-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← PREV
              </button>
              <button
                data-cursor="link"
                aria-label="Next project"
                onClick={scrollNext}
                disabled={!canNext}
                className="font-pixel text-sm border-2 border-foreground px-3 py-2 hover:bg-accent hover:text-accent-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                NEXT →
              </button>
            </div>
          )}
        </div>
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
          <div
            ref={emblaRef}
            tabIndex={0}
            role="region"
            aria-label="Projects carousel"
            onKeyDown={onKeyDown}
            className="overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <div className="flex items-start gap-4">
              {filtered.map((p, idx) => {
                const isOpen = open === p.id;
                const title = lang === "en" ? p.title_en : p.title_it;
                const summary = lang === "en" ? p.summary_en : p.summary_it;
                const body = lang === "en" ? p.body_en : p.body_it;
                return (
                  <article
                    key={p.id}
                    className={`bg-background border-2 p-6 md:p-10 flex flex-col self-start shrink-0 grow-0 basis-full md:basis-[calc(50%-0.5rem)] ${isOpen ? "min-h-[34rem] md:min-h-[36rem] card-expanded" : "h-[34rem] md:h-[36rem] overflow-hidden border-foreground"}`}
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
                      <p className={`font-body text-base md:text-lg mt-4 leading-relaxed text-muted-foreground ${isOpen ? "" : "overflow-hidden [display:-webkit-box] [-webkit-line-clamp:4] [-webkit-box-orient:vertical]"}`}>
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
          </div>
        )}
      </div>
    </section>
  );
}
