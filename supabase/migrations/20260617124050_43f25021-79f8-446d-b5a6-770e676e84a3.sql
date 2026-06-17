DELETE FROM public.projects WHERE title_en LIKE 'Sample —%';

INSERT INTO public.tags (slug, label_en, label_it) VALUES
  ('generative-art', 'Generative Art', 'Arte Generativa'),
  ('creative-coding', 'Creative Coding', 'Creative Coding')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.projects (year, cover_url, link_url, title_en, title_it, summary_en, summary_it, body_en, body_it, sort_order) VALUES
  (
    2025,
    NULL,
    'https://github.com/feduh/oracolo-del-silicio',
    'Oracolo del Silicio',
    'Oracolo del Silicio',
    'An interactive web work staging an oracular AI in a science-fiction Turin of the year 3000: a synthetic voice and a 3D particle cloud as a meditative, liminal device.',
    'Un''opera web interattiva che mette in scena un''IA oracolare nella Torino fantascientifica dell''anno 3000: voce sintetica e nuvola di particelle 3D come dispositivo meditativo e liminale.',
    'Developed as the artistic project for my BA thesis in New Art Technologies (Accademia di Belle Arti di Torino), Oracolo del Silicio translates concepts from the thesis "Anatomie Riprogrammate" — posthumanism, Eco-Horror, unstable coexistence — into an immersive experience. Two modes: an Oracle mode with low-latency streaming TTS (ElevenLabs) synchronized to a React Three Fiber particle entity, and a text Chat mode powered by GPT-4o with a RAG layer over a custom personality dataset (manuale.json). Built with Next.js (App Router), Tailwind CSS, React Three Fiber/Drei; AI and TTS logic kept server-side for security and modularity.',
    'Sviluppato come progetto artistico per la tesi triennale in Nuove Tecnologie dell''Arte (Accademia di Belle Arti di Torino), Oracolo del Silicio traduce i concetti della tesi "Anatomie Riprogrammate" — postumanesimo, Eco-Horror, coesistenza instabile — in un''esperienza immersiva. Due modalità: Oracolo con sintesi vocale in streaming a bassa latenza (ElevenLabs) sincronizzata a un''entità di particelle in React Three Fiber, e Chat testuale basata su GPT-4o con uno strato RAG su un dataset di personalità custom (manuale.json). Realizzato con Next.js (App Router), Tailwind CSS, React Three Fiber/Drei; la logica di AI e TTS resta lato server per sicurezza e modularità.',
    1
  );

INSERT INTO public.project_tags (project_id, tag_id)
SELECT p.id, t.id FROM public.projects p, public.tags t
WHERE p.title_en = 'Oracolo del Silicio'
  AND t.slug IN ('generative-art','creative-coding','machine-learning','hci');