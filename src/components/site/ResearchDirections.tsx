import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { profile as fallback } from "@/lib/profile";
import { supabase } from "@/integrations/supabase/client";
import type { ResearchRow } from "@/lib/cms-types";

const staticFallback: ResearchRow[] = fallback.researchDirections.map((r, i) => ({
  id: r.id,
  title_it: r.question_it,
  title_en: r.question_en,
  body_it: r.note_it,
  body_en: r.note_en,
  sort_order: i,
}));

export function ResearchDirections() {
  const { lang, t } = useLang();
  const [items, setItems] = useState<ResearchRow[]>(staticFallback);

  useEffect(() => {
    supabase.from("research_directions").select("*").order("sort_order").then(({ data }) => {
      if (data && data.length > 0) setItems(data as ResearchRow[]);
    });
  }, []);

  return (
    <section id="research" className="border-t-2 border-foreground py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <p className="font-pixel text-sm text-muted-foreground mb-4">{t("chapter04")}</p>
        <div className="flex items-end justify-between gap-6 mb-12 flex-wrap">
          <h2 className="font-display text-5xl md:text-7xl text-accent">{t("researchTitle")}</h2>
          <p className="font-pixel text-sm text-muted-foreground max-w-md">
            → {t("researchIntro")}
          </p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-foreground">
          {items.map((item, i) => {
            const question = lang === "en" ? item.title_en : item.title_it;
            const note = lang === "en" ? item.body_en : item.body_it;
            return (
              <li
                key={item.id}
                className={`p-8 md:p-10 flex flex-col gap-5 border-foreground ${
                  i % 2 === 0 ? "md:border-r-2" : ""
                } ${i < items.length - (items.length % 2 === 0 ? 2 : 1) ? "border-b-2" : ""}`}
              >
                <span className="font-pixel text-xs text-muted-foreground">
                  ? {String(i + 1).padStart(2, "0")}
                </span>
                <p
                  className="font-display font-light leading-[1.05]"
                  style={{ fontSize: "clamp(1.5rem, 2.4vw, 2.5rem)" }}
                >
                  {question}
                </p>
                <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed mt-auto">
                  {note}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
