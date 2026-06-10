import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { timeline } from "@/lib/profile";

export function Timeline() {
  const { lang, t } = useLang();
  const [active, setActive] = useState<number | null>(0);
  const current = active !== null ? timeline[active] : null;

  return (
    <section id="timeline" className="border-t-2 border-foreground py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <h2 className="font-display text-5xl md:text-7xl">{t("timelineTitle")}</h2>
          <span className="font-pixel text-sm text-muted-foreground">→ {t("timelineHint")}</span>
        </div>

        {/* Grid of years */}
        <div className="grid grid-cols-2 md:grid-cols-5 border-2 border-foreground">
          {timeline.map((item, i) => {
            const isActive = active === i;
            return (
              <button
                key={item.year}
                data-cursor="link"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`text-left p-6 border-foreground border-r-2 last:border-r-0 border-b-2 md:border-b-0 transition-colors ${
                  isActive ? "bg-foreground text-background" : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <div className="font-pixel text-3xl md:text-5xl leading-none">{item.year}</div>
                <div className="font-pixel text-xs mt-3 opacity-80">
                  {lang === "en" ? item.institution_en : item.institution_it}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="mt-8 grid grid-cols-12 gap-4 min-h-[120px]">
          {current && (
            <>
              <div className="col-span-12 md:col-span-3">
                <p className="font-pixel text-sm text-muted-foreground">▸ INSTITUTION</p>
                <p className="font-display text-2xl md:text-3xl mt-2">
                  {lang === "en" ? current.institution_en : current.institution_it}
                </p>
                <p className="font-pixel text-sm mt-2">{current.place}</p>
              </div>
              <div className="col-span-12 md:col-span-7 md:col-start-5">
                <p className="font-pixel text-sm text-muted-foreground">▸ DETAILS</p>
                <p className="font-body text-lg md:text-xl mt-2 leading-relaxed">
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
