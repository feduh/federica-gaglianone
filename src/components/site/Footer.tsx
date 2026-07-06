import { useLang } from "@/lib/i18n";
import { profile } from "@/lib/profile";

export function Footer() {
  const { lang, t } = useLang();
  const seeking = lang === "en" ? profile.seeking_en : profile.seeking_it;
  const activeSocials = profile.socials.filter((s) => s.href && s.href !== "#");

  return (
    <footer id="contact" className="border-t-2 border-foreground py-24 md:py-40">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <p className="font-pixel text-sm text-muted-foreground mb-4">{t("chapter05")}</p>
        <p className="font-pixel text-sm text-muted-foreground mb-6">▸ {t("contactTitle")}</p>
        <a
          href={`mailto:${profile.email}`}
          data-cursor="link"
          className="font-display block leading-[1.1] pb-2 hover:text-accent transition-colors whitespace-nowrap max-w-full"
          style={{ fontSize: `clamp(1.25rem, ${Math.floor(170 / profile.email.length * 10) / 10}vw, 4rem)` }}
        >
          {profile.email}
        </a>

        {/* Seeking CTA — what to reach out about */}
        <p className="font-body text-base md:text-lg mt-10 max-w-3xl leading-relaxed border-l-2 border-accent pl-4">
          {seeking}
        </p>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t-2 border-foreground pt-6">
          {activeSocials.length > 0 ? (
            <ul className="flex flex-wrap gap-2 font-pixel text-sm">
              {activeSocials.map((s) => (
                <li key={s.label}>
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
            <span>© {new Date().getFullYear()} {profile.name.toUpperCase()}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
