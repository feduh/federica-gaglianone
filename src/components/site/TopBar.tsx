import { LanguageToggle } from "./LanguageToggle";
import { useLang } from "@/lib/i18n";

export function TopBar() {
  const { t } = useLang();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 py-5 flex items-center justify-between border-b-2 border-foreground bg-background shadow-[0_4px_0_0_var(--color-foreground)]">
        <a
          href="#intro"
          data-cursor="link"
          className="pointer-events-auto font-pixel text-sm leading-none border-2 border-foreground bg-background px-2 py-1"
        >
          ◆ PORTFOLIO / 2026
        </a>
        <nav className="hidden md:flex items-center gap-2 pointer-events-auto font-pixel text-base bg-background border-2 border-foreground px-3 py-1.5">
          <a data-cursor="link" href="#timeline" className="px-1 hover:text-accent">
            {t("navTimeline")}
          </a>
          <span aria-hidden>/</span>
          <a data-cursor="link" href="#publications" className="px-1 hover:text-accent">
            {t("navPublications")}
          </a>
          <span aria-hidden>/</span>
          <a data-cursor="link" href="#projects" className="px-1 hover:text-accent">
            {t("navProjects")}
          </a>
          <span aria-hidden>/</span>
          <a data-cursor="link" href="#contact" className="px-1 hover:text-accent">
            {t("navContact")}
          </a>
        </nav>
        <div className="flex items-center gap-2 pointer-events-auto">
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
