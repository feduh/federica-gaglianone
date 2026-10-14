import { useLang } from "@/lib/i18n";
import { profile } from "@/lib/profile";
import { useReveal } from "@/lib/useReveal";

export function Teaching() {
  const { lang, t } = useLang();
  const reveal = useReveal<HTMLDivElement>();

  return (
    <section id="teaching" className="border-t-2 border-foreground py-24 md:py-32">
      <div
        ref={reveal.ref}
        style={reveal.style}
        className={`mx-auto max-w-[1600px] px-4 md:px-8 ${reveal.className}`}
      >
        <p className="font-pixel text-sm text-muted-foreground mb-4">{t("teachingLabel")}</p>
        <h2 className="font-display text-5xl md:text-7xl text-accent mb-12">{t("teachingTitle")}</h2>
        <ul className="border-2 border-foreground">
          {profile.teaching.map((item, i) => (
            <li
              key={item.id}
              className={`grid grid-cols-1 md:grid-cols-[12rem_1fr] gap-4 md:gap-10 p-8 md:p-10 ${
                i > 0 ? "border-t-2 border-foreground" : ""
              }`}
            >
              <span className="font-pixel text-sm text-muted-foreground">{item.period}</span>
              <div className="flex flex-col gap-3">
                <h3
                  className="font-display font-light leading-[1.05] text-balance"
                  style={{ fontSize: "clamp(1.5rem, 2.6vw, 2.5rem)" }}
                >
                  {lang === "en" ? item.title_en : item.title_it}
                </h3>
                <p className="font-pixel text-sm uppercase tracking-wide">
                  {lang === "en" ? item.place_en : item.place_it}
                </p>
                <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                  {lang === "en" ? item.body_en : item.body_it}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
