import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import type { TimelineRow } from "@/lib/cms-types";
import { timeline as staticTimeline } from "@/lib/profile";

// Fallback from static profile.ts (only used if the DB is empty).
const staticFallback: TimelineRow[] = staticTimeline.map((t, i) => {
  const [fromStr, toStr] = String(t.year).split("-");
  const yearFrom = parseInt(fromStr, 10) || 0;
  const yearTo = toStr && /^\d+$/.test(toStr) ? parseInt(toStr, 10) : null;
  return {
    id: `static-${i}`,
    year_from: yearFrom,
    year_to: yearTo,
    course_it: t.institution_it,
    course_en: t.institution_en,
    institution_it: t.place ?? "",
    institution_en: t.place ?? "",
    body_it: t.body_it,
    body_en: t.body_en,
    sort_order: i,
  };
});

function formatRange(r: TimelineRow) {
  if (r.year_to == null) return `${r.year_from}—?`;
  if (r.year_to === r.year_from) return `${r.year_from}`;
  return `${r.year_from}—${r.year_to}`;
}

export function Timeline() {
  const { lang, t } = useLang();
  const [rows, setRows] = useState<TimelineRow[]>(staticFallback);
  const [active, setActive] = useState<number>(staticFallback.length - 1);

  useEffect(() => {
    supabase.from("timeline_entries").select("*").order("sort_order").then(({ data }) => {
      if (data && data.length > 0) {
        setRows(data as TimelineRow[]);
        setActive(data.length - 1);
      }
    });
  }, []);

  const current = rows[active] ?? null;

  return (
    <section id="timeline" className="border-t-2 border-foreground py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <p className="font-pixel text-sm text-muted-foreground mb-4">{t("chapter01")}</p>
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <h2 className="font-display text-5xl md:text-7xl text-accent">{t("timelineTitle")}</h2>
          <span className="font-pixel text-sm text-muted-foreground">→ {t("timelineHint")}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 border-2 border-foreground">
          {rows.map((item, i) => {
            const isActive = active === i;
            const course = lang === "en" ? item.course_en : item.course_it;
            return (
              <button
                key={item.id}
                data-cursor="link"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`text-left p-6 border-foreground border-r-2 last:border-r-0 border-b-2 md:border-b-0 transition-colors ${
                  isActive ? "bg-foreground text-background" : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <div className="font-pixel text-xl md:text-2xl leading-none">{formatRange(item)}</div>
                <div className="font-pixel text-[11px] mt-3 opacity-80 line-clamp-2">
                  {course}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-12 gap-4 min-h-[120px]">
          {current && (
            <>
              <div className="col-span-12 md:col-span-3">
                <p className="font-pixel text-sm text-muted-foreground">▸ {lang === "en" ? "COURSE" : "CORSO"}</p>
                <p className="font-display text-2xl md:text-3xl mt-2">
                  {lang === "en" ? current.course_en : current.course_it}
                </p>
                {(current.institution_en || current.institution_it) && (
                  <>
                    <p className="font-pixel text-sm text-muted-foreground mt-4">▸ {lang === "en" ? "INSTITUTION" : "ENTE"}</p>
                    <p className="font-body text-lg mt-2">
                      {lang === "en" ? current.institution_en : current.institution_it}
                    </p>
                  </>
                )}
              </div>
              <div className="col-span-12 md:col-span-7 md:col-start-5">
                <p className="font-pixel text-sm text-muted-foreground">▸ {lang === "en" ? "DETAILS" : "DETTAGLI"}</p>
                <p className="font-body text-lg md:text-xl mt-2 leading-relaxed whitespace-pre-line">
                  {lang === "en" ? current.body_en : current.body_it}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
