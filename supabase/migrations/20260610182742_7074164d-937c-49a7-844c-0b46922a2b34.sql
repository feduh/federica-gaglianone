
CREATE TABLE public.tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  label_en text NOT NULL,
  label_it text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tags TO anon, authenticated;
GRANT ALL ON public.tags TO service_role;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tags are publicly readable" ON public.tags FOR SELECT USING (true);

CREATE TABLE public.publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year int NOT NULL,
  authors text NOT NULL,
  venue text,
  doi text,
  pdf_url text,
  title_en text NOT NULL,
  title_it text NOT NULL,
  abstract_en text,
  abstract_it text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.publications TO anon, authenticated;
GRANT ALL ON public.publications TO service_role;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Publications are publicly readable" ON public.publications FOR SELECT USING (true);

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year int NOT NULL,
  cover_url text,
  link_url text,
  title_en text NOT NULL,
  title_it text NOT NULL,
  summary_en text,
  summary_it text,
  body_en text,
  body_it text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon, authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Projects are publicly readable" ON public.projects FOR SELECT USING (true);

CREATE TABLE public.publication_tags (
  publication_id uuid NOT NULL REFERENCES public.publications(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (publication_id, tag_id)
);
GRANT SELECT ON public.publication_tags TO anon, authenticated;
GRANT ALL ON public.publication_tags TO service_role;
ALTER TABLE public.publication_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Publication tags are publicly readable" ON public.publication_tags FOR SELECT USING (true);

CREATE TABLE public.project_tags (
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, tag_id)
);
GRANT SELECT ON public.project_tags TO anon, authenticated;
GRANT ALL ON public.project_tags TO service_role;
ALTER TABLE public.project_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Project tags are publicly readable" ON public.project_tags FOR SELECT USING (true);

-- Seed tags
INSERT INTO public.tags (slug, label_en, label_it) VALUES
  ('machine-learning', 'Machine Learning', 'Machine Learning'),
  ('hci', 'Human-Computer Interaction', 'Interazione Uomo-Macchina'),
  ('philosophy', 'Philosophy of Science', 'Filosofia della Scienza'),
  ('data-viz', 'Data Visualization', 'Visualizzazione Dati'),
  ('nlp', 'Natural Language Processing', 'Elaborazione Linguaggio Naturale'),
  ('ethics', 'AI Ethics', 'Etica dell''IA');

-- Seed publications
INSERT INTO public.publications (year, authors, venue, doi, pdf_url, title_en, title_it, abstract_en, abstract_it, sort_order) VALUES
  (2025, '[Your Name], A. Rossi, B. Bianchi', 'Proceedings of CHI 2025', '10.1145/sample.2025', '#', 'Sample — Embodied Interfaces for Reflective Reading', 'Sample — Interfacce incarnate per la lettura riflessiva', 'We introduce a tangible reading apparatus that augments long-form text with peripheral cues. Across two studies (N=48) participants reported deeper comprehension and stronger memory consolidation.', 'Presentiamo un apparato tangibile per la lettura che arricchisce il testo lungo con segnali periferici. In due studi (N=48) i partecipanti hanno riportato una comprensione più profonda e un consolidamento mnemonico più solido.', 1),
  (2024, '[Your Name], C. Verdi', 'NeurIPS Workshop on Interpretability', NULL, '#', 'Sample — A Taxonomy of Explanations for Tabular Models', 'Sample — Una tassonomia delle spiegazioni per modelli tabulari', 'We survey 120 explanation methods for tabular learning and propose a four-axis taxonomy that clarifies trade-offs between fidelity, locality, and stability.', 'Esaminiamo 120 metodi di spiegazione per il learning tabulare e proponiamo una tassonomia a quattro assi che chiarisce i compromessi tra fedeltà, località e stabilità.', 2),
  (2023, '[Your Name]', 'Master Thesis, Università di Bologna', NULL, '#', 'Sample — On the Epistemology of Synthetic Data', 'Sample — Epistemologia dei dati sintetici', 'A philosophical investigation into the evidential status of synthetic data in the empirical sciences, drawing on Hacking and Cartwright.', 'Un''indagine filosofica sullo statuto evidenziale dei dati sintetici nelle scienze empiriche, a partire da Hacking e Cartwright.', 3);

-- Tag the publications
INSERT INTO public.publication_tags (publication_id, tag_id)
SELECT p.id, t.id FROM public.publications p, public.tags t
WHERE (p.title_en LIKE 'Sample — Embodied%' AND t.slug IN ('hci','data-viz'))
   OR (p.title_en LIKE 'Sample — A Taxonomy%' AND t.slug IN ('machine-learning','ethics'))
   OR (p.title_en LIKE 'Sample — On the Epistemology%' AND t.slug IN ('philosophy','machine-learning'));

-- Seed projects
INSERT INTO public.projects (year, cover_url, link_url, title_en, title_it, summary_en, summary_it, body_en, body_it, sort_order) VALUES
  (2025, NULL, '#', 'Sample — Atlas of Reading Patterns', 'Sample — Atlante dei pattern di lettura', 'An interactive visualization of how 2,000 readers traverse academic papers.', 'Una visualizzazione interattiva di come 2.000 lettori attraversano i paper accademici.', 'Built with D3 and a custom eye-tracking pipeline, the Atlas reveals shared rhythms in scholarly reading and exposes friction points across disciplines.', 'Realizzato con D3 e una pipeline di eye-tracking custom, l''Atlante rivela ritmi condivisi nella lettura scientifica ed espone i punti di attrito tra discipline.', 1),
  (2024, NULL, '#', 'Sample — Marginalia', 'Sample — Marginalia', 'A browser extension that turns scholarly footnotes into a navigable graph.', 'Un''estensione browser che trasforma le note scientifiche in un grafo navigabile.', 'Marginalia parses BibTeX citations from open-access PDFs and renders a force-directed map of intellectual lineage. Adopted by three research groups for collaborative literature reviews.', 'Marginalia analizza le citazioni BibTeX dai PDF ad accesso aperto e renderizza una mappa force-directed della genealogia intellettuale. Adottato da tre gruppi di ricerca per revisioni della letteratura collaborative.', 2),
  (2023, NULL, '#', 'Sample — Quiet Corpus', 'Sample — Quiet Corpus', 'A curated text corpus of rarely-cited 20th-century philosophy of science.', 'Un corpus testuale curato di filosofia della scienza del Novecento poco citata.', 'A 14-million token corpus assembled from public-domain Italian and English sources, with NLP-ready annotations and a CC-BY release.', 'Un corpus da 14 milioni di token assemblato da fonti italiane e inglesi di pubblico dominio, con annotazioni NLP-ready e rilascio CC-BY.', 3);

-- Tag the projects
INSERT INTO public.project_tags (project_id, tag_id)
SELECT p.id, t.id FROM public.projects p, public.tags t
WHERE (p.title_en LIKE 'Sample — Atlas%' AND t.slug IN ('data-viz','hci'))
   OR (p.title_en LIKE 'Sample — Marginalia%' AND t.slug IN ('hci','nlp'))
   OR (p.title_en LIKE 'Sample — Quiet Corpus%' AND t.slug IN ('nlp','philosophy'));
