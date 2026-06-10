// Edit your profile here. Bio paragraphs and timeline are static.
// Publications and projects live in the database.

export const profile = {
  name: "[Your Name]",
  role_en: "Aspiring Researcher",
  role_it: "Aspirante Ricercatrice",
  city_en: "Bologna, IT",
  city_it: "Bologna, IT",
  email: "you@example.com",
  socials: [
    { label: "Scholar", href: "#" },
    { label: "GitHub", href: "#" },
    { label: "OrcID", href: "#" },
    { label: "X", href: "#" },
  ],
  bio_en: [
    "I study how interactive systems shape the way we read, argue, and understand evidence. My work sits at the intersection of human-computer interaction, machine learning, and the philosophy of science.",
    "Currently preparing PhD applications in computational humanities, while collaborating with two research groups on reflective reading tools and explainability for tabular models.",
    "I write in English and Italian, code in Python and TypeScript, and care deeply about typography, slow software, and rigorous citations.",
  ],
  bio_it: [
    "Studio come i sistemi interattivi modellano il modo in cui leggiamo, argomentiamo e comprendiamo l'evidenza scientifica. Il mio lavoro vive all'incrocio fra interazione uomo-macchina, machine learning e filosofia della scienza.",
    "Sto preparando candidature di dottorato in informatica umanistica, collaborando con due gruppi di ricerca su strumenti per la lettura riflessiva e sull'explainability per modelli tabulari.",
    "Scrivo in italiano e inglese, programmo in Python e TypeScript, e tengo molto a tipografia, slow software e citazioni rigorose.",
  ],
};

export const timeline = [
  {
    year: 2026,
    institution_en: "PhD Candidate — TBA",
    institution_it: "Dottoranda — TBA",
    place: "Europe",
    body_en: "Applying to PhD programs in computational humanities and HCI. Research statement: machines that help us read more carefully, not faster.",
    body_it: "Candidature al dottorato in informatica umanistica e HCI. Statement: macchine che ci aiutano a leggere con più cura, non più velocemente.",
  },
  {
    year: 2024,
    institution_en: "Visiting Researcher — KTH",
    institution_it: "Visiting Researcher — KTH",
    place: "Stockholm, SE",
    body_en: "Six months at the Media Technology and Interaction Design group, working on tangible interfaces for long-form reading.",
    body_it: "Sei mesi al gruppo Media Technology and Interaction Design, su interfacce tangibili per la lettura.",
  },
  {
    year: 2023,
    institution_en: "MSc in Cognitive Science",
    institution_it: "Laurea magistrale in Scienze Cognitive",
    place: "Università di Bologna",
    body_en: "Thesis on the epistemology of synthetic data, with two supplementary minors in statistics and Italian literature.",
    body_it: "Tesi sull'epistemologia dei dati sintetici, con due indirizzi minori in statistica e letteratura italiana.",
  },
  {
    year: 2021,
    institution_en: "BSc in Philosophy & CS",
    institution_it: "Laurea triennale in Filosofia e Informatica",
    place: "Università di Padova",
    body_en: "Joint honours program. Final dissertation on Bayesian confirmation theory in early modern astronomy.",
    body_it: "Corso di laurea congiunto. Tesi finale su teoria bayesiana della conferma nell'astronomia moderna.",
  },
  {
    year: 2018,
    institution_en: "Liceo Classico",
    institution_it: "Liceo Classico",
    place: "Italy",
    body_en: "Five years of Latin, Greek, and the slow art of close reading. Still pays dividends.",
    body_it: "Cinque anni di latino, greco e l'arte lenta della lettura attenta. Ancora paga dividendi.",
  },
];
