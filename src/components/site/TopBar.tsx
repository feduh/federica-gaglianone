import { LanguageToggle } from "./LanguageToggle";
import { ScrollProgress } from "./ScrollProgress";
import { useLang } from "@/lib/i18n";
import { useScrollSpy } from "@/lib/useScrollSpy";
import { anchorClick } from "@/lib/scrollToId";

const LINKS = [
  { id: "timeline", key: "navTimeline" },
  { id: "publications", key: "navPublications" },
  { id: "projects", key: "navProjects" },
  { id: "research", key: "navResearch" },
  { id: "contact", key: "navContact" },
] as const;

export function TopBar() {
  const { t, lang } = useLang();
  const active = useScrollSpy();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="relative mx-auto max-w-[1600px] px-4 md:px-8 py-5 grid grid-cols-3 items-center border-b-2 border-foreground bg-background shadow-[0_4px_0_0_var(--color-foreground)]">
        <div className="flex justify-start">
          <a
            href="#intro"
            onClick={anchorClick("intro")}
            data-cursor="link"
            className="pointer-events-auto font-pixel text-sm leading-none border-2 border-foreground bg-background px-2 py-2 min-h-11 inline-flex items-center"
          >
            ◆ PORTFOLIO / 2026
          </a>
        </div>
        <nav
          aria-label={lang === "en" ? "Sections" : "Sezioni"}
          className="hidden md:flex justify-self-center items-center gap-2 pointer-events-auto font-pixel text-base bg-background border-2 border-foreground px-3 py-1.5"
        >
          {LINKS.map((l, i) => (
            <span key={l.id} className="contents">
              {i > 0 && <span aria-hidden>/</span>}
              <a
                data-cursor="link"
                href={`#${l.id}`}
                onClick={anchorClick(l.id)}
                aria-current={active === l.id ? "true" : undefined}
                className={`px-1 hover:text-accent transition-colors ${
                  active === l.id ? "text-accent underline underline-offset-4" : ""
                }`}
              >
                {t(l.key)}
              </a>
            </span>
          ))}
        </nav>
        <div className="flex justify-end items-center gap-2 pointer-events-auto">
          <span className="hidden lg:inline font-pixel text-[11px] text-muted-foreground">
            ⌘K
          </span>
          <LanguageToggle />
        </div>
        <ScrollProgress />
      </div>
    </header>
  );
}
