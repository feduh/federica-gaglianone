import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { profile as fallback } from "@/lib/profile";
import { supabase } from "@/integrations/supabase/client";
import type { ProfileRow } from "@/lib/cms-types";

const staticFallback: ProfileRow = {
  id: "static",
  name: fallback.name,
  role: fallback.role_en,
  email: fallback.email,
  city: fallback.city_en,
  bio_it: fallback.bio_it.join("\n\n"),
  bio_en: fallback.bio_en.join("\n\n"),
  seeking_it: fallback.seeking_it,
  seeking_en: fallback.seeking_en,
  interests: [],
  avatar_url: null,
};

export function IntroAsymmetric() {
  const { lang, t } = useLang();
  const [p, setP] = useState<ProfileRow>(staticFallback);

  useEffect(() => {
    supabase.from("profile").select("*").limit(1).maybeSingle().then(({ data }) => {
      if (data) {
        const interests = Array.isArray(data.interests)
          ? (data.interests as unknown[]).filter((v): v is string => typeof v === "string")
          : [];
        setP({ ...data, interests } as ProfileRow);
      }
    });
  }, []);

  const bio = (lang === "en" ? p.bio_en : p.bio_it).split(/\n\n+/).filter(Boolean);
  const role = p.role;
  const city = p.city;
  const statement = bio[0] ?? "";

  return (
    <section id="intro" className="relative pt-32 md:pt-40 pb-24 md:pb-40 overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 flex flex-wrap gap-2 mb-12 font-pixel text-sm">
        <span className="border-2 border-foreground px-2 py-1">● {t("available")}</span>
        <span className="border-2 border-foreground px-2 py-1">◇ {city}</span>
        <span className="border-2 border-foreground px-2 py-1">EN / IT</span>
      </div>

      <h1 className="font-display font-light text-foreground select-none px-4 md:px-8" style={{ fontSize: "clamp(4rem, 18vw, 16rem)" }}>
        <span className="sr-only">{p.name} — {role}</span>
        <span aria-hidden="true" className="block leading-[0.85]">{p.name.split(" ")[0] || p.name}</span>
        {p.name.split(" ").slice(1).join(" ") && (
          <span aria-hidden="true" className="block leading-[0.85] italic font-normal -mt-2 md:-mt-6 text-accent">
            {p.name.split(" ").slice(1).join(" ")}
          </span>
        )}
      </h1>

      <div className="mx-auto max-w-[1600px] px-4 md:px-8 mt-6 md:mt-10">
        <p className="font-pixel text-xl md:text-2xl">— {role.toUpperCase()} ——————————</p>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 md:px-8 mt-16 md:mt-24 grid grid-cols-12 gap-4 md:gap-8">
        <div className="col-span-12 md:col-span-10 md:col-start-2">
          <p className="font-pixel text-xs mb-4 text-muted-foreground">▸ STATEMENT</p>
          <p
            className="font-display italic font-light leading-[1.05] text-foreground"
            style={{ fontSize: "clamp(1.75rem, 4.2vw, 4rem)" }}
          >
            {statement}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 md:px-8 mt-24 md:mt-32 grid grid-cols-12 gap-4 md:gap-8 [grid-auto-rows:minmax(0,auto)]">
        {bio.slice(1).map((para, i) => {
          const labels = ["§ 01 — ORIGIN", "§ 02 — TRANSITION", "§ 03 — DIRECTION", "§ 04", "§ 05"];
          const positions = [
            "col-span-12 md:col-span-5 md:col-start-2 md:row-start-1",
            "col-span-12 md:col-span-4 md:col-start-8 md:row-start-2 md:mt-24",
            "col-span-12 md:col-span-5 md:col-start-4 md:row-start-3 md:mt-16",
          ];
          return (
            <div key={i} className={positions[i] ?? "col-span-12 md:col-span-6 md:col-start-2"}>
              <p className="font-pixel text-xs mb-3 text-muted-foreground">{labels[i] ?? `§ 0${i + 1}`}</p>
              <p className="font-body text-lg md:text-xl leading-relaxed">{para}</p>
            </div>
          );
        })}
      </div>

      {p.interests.length > 0 && (
        <div className="mx-auto max-w-[1600px] px-4 md:px-8 mt-16 flex flex-wrap gap-2">
          {p.interests.map((tag) => (
            <span key={tag} className="font-pixel text-xs border-2 border-foreground px-2 py-1">
              # {tag}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
