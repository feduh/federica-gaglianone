import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { profile as fallback } from "@/lib/profile";
import { supabase } from "@/integrations/supabase/client";
import type { ProfileRow, SocialRow } from "@/lib/cms-types";

const staticProfile: ProfileRow = {
  id: "static",
  name: fallback.name,
  role: fallback.role_en,
  email: fallback.email,
  city: fallback.city_en,
  bio_it: "", bio_en: "",
  seeking_it: fallback.seeking_it, seeking_en: fallback.seeking_en,
  interests: [], avatar_url: null,
};

export function Footer() {
  const { lang, t } = useLang();
  const [p, setP] = useState<ProfileRow>(staticProfile);
  const [socials, setSocials] = useState<SocialRow[]>([]);

  useEffect(() => {
    supabase.from("profile").select("*").limit(1).maybeSingle().then(({ data }) => {
      if (data) {
        const interests = Array.isArray(data.interests)
          ? (data.interests as unknown[]).filter((v): v is string => typeof v === "string")
          : [];
        setP({ ...data, interests } as ProfileRow);
      }
    });
    supabase.from("socials").select("*").order("sort_order").then(({ data }) => {
      setSocials((data ?? []) as SocialRow[]);
    });
  }, []);

  const seeking = lang === "en" ? p.seeking_en : p.seeking_it;
  const activeSocials = socials.filter((s) => s.visible && s.href && s.href !== "#");

  return (
    <footer id="contact" className="border-t-2 border-foreground py-24 md:py-40">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <p className="font-pixel text-sm text-muted-foreground mb-4">{t("chapter05")}</p>
        <p className="font-pixel text-sm text-muted-foreground mb-6">▸ {t("contactTitle")}</p>
        <a
          href={`mailto:${p.email}`}
          data-cursor="link"
          className="font-display block leading-[1.1] pb-2 hover:text-accent transition-colors whitespace-nowrap max-w-full"
          style={{ fontSize: `clamp(1.25rem, ${Math.floor(170 / Math.max(p.email.length, 1) * 10) / 10}vw, 4rem)` }}
        >
          {p.email}
        </a>

        <p className="font-body text-base md:text-lg mt-10 max-w-3xl leading-relaxed border-l-2 border-accent pl-4">
          {seeking}
        </p>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t-2 border-foreground pt-6">
          {activeSocials.length > 0 ? (
            <ul className="flex flex-wrap gap-2 font-pixel text-sm">
              {activeSocials.map((s) => (
                <li key={s.id}>
                  <a
                    data-cursor="link"
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="border-2 border-foreground px-2 py-1 hover:bg-foreground hover:text-background transition-colors"
                  >
                    ↗ {s.label.toUpperCase()}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <span />
          )}
          <div className="flex flex-wrap items-center gap-3 font-pixel text-xs text-muted-foreground">
            <a href="/privacy" data-cursor="link" className="hover:text-foreground transition-colors">
              {t("navPrivacy")}
            </a>
            <span aria-hidden>·</span>
            <a href="/cookies" data-cursor="link" className="hover:text-foreground transition-colors">
              {t("navCookies")}
            </a>
            <span aria-hidden>·</span>
            <span>© {new Date().getFullYear()} {p.name.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
