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
  basedIn: { en: "Based in Turin, IT", it: "Con base a Torino, IT" },
  role: { en: "Aspiring researcher", it: "Aspirante ricercatrice" },
  navIntro: { en: "Intro", it: "Intro" },
  navTimeline: { en: "Timeline", it: "Percorso" },
  navPublications: { en: "Writing", it: "Scritti" },
  navProjects: { en: "Projects", it: "Progetti" },
  navResearch: { en: "Directions", it: "Direzioni" },
  navContact: { en: "Contact", it: "Contatti" },
  // Chapter markers — the narrative arc across the page.
  chapter01: { en: "Ch. 01 — Where I come from", it: "Cap. 01 — Da dove vengo" },
  chapter02: { en: "Ch. 02 — What I've written", it: "Cap. 02 — Cosa ho scritto" },
  chapter03: { en: "Ch. 03 — What I've built", it: "Cap. 03 — Cosa ho costruito" },
  chapter04: { en: "Ch. 04 — What comes next", it: "Cap. 04 — Cosa viene dopo" },
  chapter05: { en: "Ch. 05 — Let's talk", it: "Cap. 05 — Parliamone" },
  timelineTitle: { en: "Academic path", it: "Percorso accademico" },
  timelineHint: { en: "Click a year for details", it: "Clicca su un anno per i dettagli" },
  publicationsTitle: { en: "Writing", it: "Scritti" },
  projectsTitle: { en: "Projects", it: "Progetti" },
  researchTitle: { en: "Research directions", it: "Direzioni di ricerca" },
  researchIntro: {
    en: "Open questions I want to spend the next years living inside.",
    it: "Domande aperte con cui vorrei convivere nei prossimi anni.",
  },
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
  footerColophon: {
    en: "Set in Fraunces & VT323 · Built in Turin",
    it: "Composto in Fraunces & VT323 · Costruito a Torino",
  },
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
