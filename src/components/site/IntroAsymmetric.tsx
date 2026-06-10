import { useLang } from "@/lib/i18n";
import { profile } from "@/lib/profile";

export function IntroAsymmetric() {
  const { lang, t } = useLang();
  const bio = lang === "en" ? profile.bio_en : profile.bio_it;
  const role = lang === "en" ? profile.role_en : profile.role_it;
  const city = lang === "en" ? profile.city_en : profile.city_it;

  return (
    <section id="intro" className="relative pt-32 md:pt-40 pb-24 md:pb-40 overflow-hidden">
      {/* Top micro-tags */}
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 flex flex-wrap gap-2 mb-12 font-pixel text-sm">
        <span className="border-2 border-foreground px-2 py-1">● {t("available")}</span>
        <span className="border-2 border-foreground px-2 py-1">◇ {city}</span>
        <span className="border-2 border-foreground px-2 py-1">EN / IT</span>
      </div>

      {/* Giant name — sfora */}
      <h1 className="font-display font-light text-foreground select-none px-4 md:px-8" style={{ fontSize: "clamp(4rem, 18vw, 16rem)" }}>
        <span className="block leading-[0.85]">{profile.name.split(" ")[0] || profile.name}</span>
        {profile.name.split(" ").slice(1).join(" ") && (
          <span className="block leading-[0.85] italic font-normal -mt-2 md:-mt-6 text-accent">
            {profile.name.split(" ").slice(1).join(" ")}
          </span>
        )}
      </h1>

      {/* Role under name */}
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 mt-6 md:mt-10">
        <p className="font-pixel text-xl md:text-2xl">— {role.toUpperCase()} ——————————</p>
      </div>

      {/* Asymmetric bio */}
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 mt-16 md:mt-24 grid grid-cols-12 gap-4 md:gap-8 [grid-auto-rows:minmax(0,auto)]">
        <div className="col-span-12 md:col-span-5 md:col-start-2 md:row-start-1">
          <p className="font-pixel text-xs mb-3 text-muted-foreground">§ 01</p>
          <p className="font-body text-lg md:text-xl leading-relaxed">{bio[0]}</p>
        </div>
        <div className="col-span-12 md:col-span-4 md:col-start-8 md:row-start-2 md:mt-24">
          <p className="font-pixel text-xs mb-3 text-muted-foreground">§ 02</p>
          <p className="font-body text-base md:text-lg leading-relaxed">{bio[1]}</p>
        </div>
        <div className="col-span-12 md:col-span-5 md:col-start-4 md:row-start-3 md:mt-16">
          <p className="font-pixel text-xs mb-3 text-muted-foreground">§ 03</p>
          <p className="font-body text-base md:text-lg leading-relaxed">{bio[2]}</p>
        </div>
      </div>
    </section>
  );
}
