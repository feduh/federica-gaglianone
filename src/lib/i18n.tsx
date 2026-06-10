import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "it";

type Dict = Record<string, { en: string; it: string }>;

const dict = {
  available: { en: "Available for research", it: "Disponibile per la ricerca" },
  basedIn: { en: "Based in Bologna, IT", it: "Con base a Bologna, IT" },
  role: { en: "Aspiring researcher", it: "Aspirante ricercatrice" },
  navIntro: { en: "Intro", it: "Intro" },
  navTimeline: { en: "Timeline", it: "Percorso" },
  navPublications: { en: "Publications", it: "Pubblicazioni" },
  navProjects: { en: "Projects", it: "Progetti" },
  navContact: { en: "Contact", it: "Contatti" },
  timelineTitle: { en: "Academic path", it: "Percorso accademico" },
  timelineHint: { en: "Hover a year for details", it: "Passa il mouse su un anno" },
  publicationsTitle: { en: "Publications", it: "Pubblicazioni" },
  projectsTitle: { en: "Projects", it: "Progetti" },
  contactTitle: { en: "Write to me", it: "Scrivimi" },
  filterAll: { en: "All", it: "Tutti" },
  filterClear: { en: "Clear filters", it: "Pulisci filtri" },
  readPdf: { en: "Read PDF", it: "Leggi PDF" },
  doi: { en: "DOI", it: "DOI" },
  viewProject: { en: "View project", it: "Apri progetto" },
  expand: { en: "Read abstract", it: "Leggi abstract" },
  collapse: { en: "Collapse", it: "Chiudi" },
  toggleLang: { en: "IT", it: "EN" },
  toggleTheme: { en: "Theme", it: "Tema" },
  emptyResults: { en: "No items match the current tags.", it: "Nessun elemento corrisponde ai tag selezionati." },
} satisfies Dict;

type Key = keyof typeof dict;

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (k: Key) => string;
};

const LangContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "portfolio.lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (stored === "en" || stored === "it") setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, l);
    if (typeof document !== "undefined") document.documentElement.lang = l;
  };

  const value: Ctx = {
    lang,
    setLang,
    toggle: () => setLang(lang === "en" ? "it" : "en"),
    t: (k) => dict[k][lang],
  };

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}

export function pickLang<T extends { [k: string]: unknown }>(
  obj: T,
  base: string,
  lang: Lang,
): string {
  const v = obj[`${base}_${lang}`] ?? obj[`${base}_en`];
  return typeof v === "string" ? v : "";
}
