// Edit your profile here. Bio paragraphs and timeline are static.
// Publications and projects live in the database.

export const profile = {
  name: "Federica Gaglianone",
  role_en: "Aspiring Researcher",
  role_it: "Aspirante Ricercatrice",
  city_en: "Turin, Italy",
  city_it: "Torino, Italia",
  email: "federica.gaglianone@proton.me",
  // Opening manifesto — the narrative hook at the top of the page.
  statement_en:
    "From painting anatomies to programming them — I build things that help us look at cities, bodies and data more carefully.",
  statement_it:
    "Dalla pittura delle anatomie alla loro programmazione — costruisco strumenti per guardare città, corpi e dati con più cura.",
  // Footer CTA — what I'm currently looking for.
  seeking_en:
    "Currently looking for: PhD supervisors in HCI, creative AI, remote sensing · Collaborations on interactive installations.",
  seeking_it:
    "Attualmente cerco: relatori di dottorato in HCI, IA creativa, telerilevamento · Collaborazioni su installazioni interattive.",
  // TODO: sostituire gli URL placeholder con i profili reali.
  socials: [
    { label: "Scholar", href: "https://scholar.google.com/citations?user=REPLACE_ME" },
    { label: "GitHub", href: "https://github.com/REPLACE_ME" },
    { label: "OrcID", href: "https://orcid.org/0000-0000-0000-0000" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/REPLACE_ME" },
    { label: "Academia", href: "https://independent.academia.edu/REPLACE_ME" },
    { label: "ResearchGate", href: "https://www.researchgate.net/profile/REPLACE_ME" },
  ],

  // Three narrative movements: origin → transition → direction.
  bio_en: [
    "I was trained as an artist. Five years of art high school, then a BA in New Technologies of Art at Accademia Albertina di Torino, where I learned to look slowly — at bodies, at cities, at the surfaces of things — and to treat that looking as a form of research.",
    "Somewhere along the way the medium shifted. I started writing code the way I used to draw: as a way of thinking. Today I am re-training as a computer scientist through standalone courses at Politecnico di Torino and Università del Piemonte Orientale, and returning to the Albertina as a guest lecturer to teach students how to build with language models.",
    "In September I move to Newcastle for an MSc in Data Science and AI. I want to bring satellite data, environmental sensing and interactive installations into the same conversation — treating orbital imagery as both evidence and medium, and asking what critical data science can look like inside a cultural institution.",
  ],
  bio_it: [
    "Mi sono formata come artista. Cinque anni di liceo artistico e poi una triennale in Nuove Tecnologie dell'Arte all'Accademia Albertina di Torino, dove ho imparato a guardare lentamente — corpi, città, superfici — e a considerare quello sguardo una forma di ricerca.",
    "A un certo punto il medium è cambiato. Ho iniziato a scrivere codice come prima disegnavo: per pensare. Oggi mi sto riformando come informatica con corsi singoli al Politecnico di Torino e all'Università del Piemonte Orientale, e sono tornata all'Albertina come docente ospite per insegnare a costruire con i modelli linguistici.",
    "A settembre mi trasferisco a Newcastle per una magistrale in Data Science e AI. Voglio far dialogare dati satellitari, telerilevamento ambientale e installazioni interattive — trattare le immagini orbitali come evidenza e come medium, e chiedermi che forma può avere una data science critica dentro un'istituzione culturale.",
  ],
  // Open research questions — the "what comes next" section.
  researchDirections: [
    {
      id: "rd-01",
      question_en:
        "Can satellite imagery become a medium for public interactive installations?",
      question_it:
        "Le immagini satellitari possono diventare un medium per installazioni interattive pubbliche?",
      note_en:
        "Remote sensing as material, not just as data — turning orbital views into something a body can walk through.",
      note_it:
        "Il telerilevamento come materiale, non solo come dato — trasformare le viste orbitali in qualcosa che un corpo possa attraversare.",
    },
    {
      id: "rd-02",
      question_en:
        "How do we make environmental sensing legible to people who don't read graphs?",
      question_it:
        "Come rendiamo il monitoraggio ambientale leggibile a chi non legge grafici?",
      note_en:
        "Designing interfaces and installations that translate sensor data without flattening its uncertainty.",
      note_it:
        "Progettare interfacce e installazioni che traducano i dati dei sensori senza appiattirne l'incertezza.",
    },
    {
      id: "rd-03",
      question_en:
        "What does critical data science look like inside a cultural institution?",
      question_it:
        "Che forma ha una data science critica dentro un'istituzione culturale?",
      note_en:
        "Museums and academies as sites for slow, situated computation — not just as clients for dashboards.",
      note_it:
        "Musei e accademie come luoghi di computazione lenta e situata — non solo come clienti di dashboard.",
    },
    {
      id: "rd-04",
      question_en:
        "How do artistic training and machine learning inform each other in practice?",
      question_it:
        "Come si informano a vicenda formazione artistica e machine learning nella pratica?",
      note_en:
        "Bringing the discipline of the studio — attention, iteration, close reading — into the model-building loop.",
      note_it:
        "Portare la disciplina dello studio — attenzione, iterazione, close reading — dentro il ciclo di costruzione dei modelli.",
    },
  ],
};

export const timeline = [
  {
    year: "2015-2020",
    institution_en: "High School",
    institution_it: "Liceo Artistico",
    place: "Liceo Artistico Aldo Passoni, Italy",
    caption_en: "Five years of learning to see slowly.",
    caption_it: "Cinque anni per imparare a guardare lentamente.",
    body_en:
      "Five years at art high school: drawing, art history, and the slow craft of seeing carefully.\n\n- National School Rowing Championships (2016) — participant.",
    body_it:
      "Cinque anni di liceo artistico: disegno, storia dell'arte e l'arte lenta dell'osservare con cura.\n\n- Campionati Studenteschi Nazionali di Canottaggio (2016) — partecipante.",
  },
  {
    year: "2022-2025",
    institution_en: "BA New Technologies of Art",
    institution_it: "Triennale in Nuove Tecnologie dell'Arte",
    place: "Albertina Academy of Fine Arts, Italy",
    caption_en: "Where I started using code as a medium.",
    caption_it: "Dove ho iniziato a usare il codice come medium.",
    body_en:
      "Bachelor of Arts (L-3). Final grade: 110/110 with Honors.\n\nThesis: \"Reprogrammed Anatomies: Biological and Technological Transformations in the Future Urban Landscape of Turin.\"\n\n- Edisu Piedmont Scholarship holder\n- Returned in Feb 2026 as guest lecturer for a Master's seminar on \"Vibe Coding\", guiding students in building chatbots and a book-summarisation system for academic study.",
    body_it:
      "Laurea triennale in Nuove Tecnologie dell'Arte (L-3). Voto finale: 110/110 con lode.\n\nTesi: \"Anatomie Riprogrammate: trasformazioni biologiche e tecnologiche nel futuro paesaggio urbano di Torino\".\n\n- Borsista Edisu Piemonte\n- Tornata a febbraio 2026 come docente ospite per un seminario magistrale su \"Vibe Coding\", guidando gli studenti nella costruzione di chatbot e di un sistema di sintesi di libri per lo studio accademico.",
  },
  {
    year: "2025-2026",
    institution_en: "Standalones in Computer Science",
    institution_it: "Corsi singoli in Informatica",
    place: "Politecnico di Torino, Italy",
    caption_en: "The year I re-trained as a computer scientist.",
    caption_it: "L'anno in cui mi sono riformata come informatica.",
    body_en:
      "Standalone courses to strengthen technical foundations before the MSc: Databases (6 CFU, completed Jan 2026), Computer Networks (8 CFU), Computer Science (8 CFU).\n\nIn parallel, academic certificates at Università del Piemonte Orientale in Computer & Data Science and in Mathematics & Statistics (Programming, Algorithms & Data Structures, Logic, Discrete Mathematics, Analysis, Probability & Statistics).",
    body_it:
      "Corsi singoli per rafforzare le basi tecniche prima della magistrale: Basi di Dati (6 CFU, completato a gennaio 2026), Reti (8 CFU), Informatica (8 CFU).\n\nIn parallelo, certificati accademici all'Università del Piemonte Orientale in Informatica & Data Science e in Matematica & Statistica (Programmazione, Algoritmi e Strutture Dati, Logica, Matematica Discreta, Analisi, Probabilità e Statistica).",
  },
  {
    year: "2026-2027",
    institution_en: "MSc Data Science and AI",
    institution_it: "Laurea magistrale in Data Science e AI",
    place: "Newcastle University, UK",
    caption_en: "Machine learning, with a cultural lens.",
    caption_it: "Machine learning, con uno sguardo culturale.",
    body_en:
      "Incoming MSc student. Focus on machine learning, statistical inference, and explainability — with a lens on cultural and creative applications.",
    body_it:
      "Studentessa in ingresso della magistrale. Focus su machine learning, inferenza statistica ed explainability, con uno sguardo sulle applicazioni culturali e creative.",
  },
  {
    year: "2027-?",
    institution_en: "PhD Candidate? Who knows...",
    institution_it: "Dottoranda? Chi lo sa...",
    place: "Europe",
    caption_en: "Where the story is still being written.",
    caption_it: "Dove la storia è ancora da scrivere.",
    body_en:
      "Applying to PhD programs at the intersection of HCI, generative AI, and computational humanities. Research statement: machines that help us read cities, bodies, and archives more carefully — not faster.",
    body_it:
      "Candidature al dottorato all'incrocio fra HCI, IA generativa e informatica umanistica. Statement: macchine che ci aiutano a leggere città, corpi e archivi con più cura, non più velocemente.",
  },
];
