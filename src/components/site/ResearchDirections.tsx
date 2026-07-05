import { useLang } from "@/lib/i18n";
import { profile } from "@/lib/profile";

export function ResearchDirections() {
  const { lang, t } = useLang();
  const items = profile.researchDirections;

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
            const question = lang === "en" ? item.question_en : item.question_it;
            const note = lang === "en" ? item.note_en : item.note_it;
            return (
              <li
                key={item.id}
                className={`p-8 md:p-10 flex flex-col gap-5 border-foreground ${
                  // right column on md+: no right border; bottom border except last row
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
