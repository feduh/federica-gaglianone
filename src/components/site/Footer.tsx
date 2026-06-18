import { useLang } from "@/lib/i18n";
import { profile } from "@/lib/profile";

export function Footer() {
  const { t } = useLang();
  return (
    <footer id="contact" className="border-t-2 border-foreground py-24 md:py-40">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <p className="font-pixel text-sm text-muted-foreground mb-6">▸ {t("contactTitle")}</p>
        <a
          href={`mailto:${profile.email}`}
          data-cursor="link"
          className="font-display block leading-[1.1] pb-2 hover:text-accent transition-colors whitespace-nowrap max-w-full"
          style={{ fontSize: `clamp(1.25rem, ${Math.floor(170 / profile.email.length * 10) / 10}vw, 4rem)` }}
        >
          {profile.email}
        </a>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t-2 border-foreground pt-6">
          <ul className="flex flex-wrap gap-2 font-pixel text-sm">
            {profile.socials.map((s) => (
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
          <p className="font-pixel text-xs text-muted-foreground">
            © {new Date().getFullYear()} {profile.name.toUpperCase()} · CRAFTED WITH RIGOR
          </p>
        </div>
      </div>
    </footer>
  );
}
