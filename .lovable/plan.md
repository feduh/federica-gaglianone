
## Direzione di design

**Atmosfera**: galleria d'arte contemporanea + dettagli pixel/neo-brutalist. Autorevole ma tech.

- **Palette** (light): sfondo avorio caldo `#F2EEE5`, inchiostro `#0E0E0C`, accento elettrico `#FF3D00` usato solo su hover/tag attivi e bordi pixel.
- **Palette** (dark): fondo `#0E0E0C`, testo `#F2EEE5`, accento `#FF7A45`.
- **Tipografia** (Google Fonts via `<link>` nel root):
  - Display elegante → **Fraunces** (serif variabile, optical size alta, weight 300/700) per nome, titoli di sezione, email footer.
  - Pixel/UI → **VT323** per tag, label anno timeline, numerazione `01/02`, micro-copy, etichette bottoni.
  - Body → **Inter** 400/500 per bio e abstract.
- **Spaziature**: enormi (sezioni 20–30vh padding), griglia 12 colonne, titoli 12–20vw.
- **Bottoni pixel**: bordo 2px nero, nessun radius, shadow offset `4px 4px 0 ink`; hover = translate `-2px -2px` + shadow `6px 6px 0 accent`.
- **Dark mode**: toggle in alto a destra, classe `.dark` su `<html>`, persistito in `localStorage`, default = preferenza sistema.
- **Custom cursor**: cerchio outline che segue il mouse con lerp (rAF). Sopra elementi con `data-cursor="link"` si trasforma in un quadrato pixelato 16px + accento. Nascosto su `pointer: coarse` (touch).
- **Lingua**: default EN, toggle `EN / IT` in alto. `LanguageProvider` (context) + dizionario tipizzato per le stringhe UI; per i contenuti dal DB si leggono i campi `_en/_it`.

## Struttura della pagina (single route `/`)

1. **Intro asimmetrica** — al posto dell'hero:
   - Micro-tag pixel in alto: `AVAILABLE FOR RESEARCH · BASED IN [CITY] · EN/IT`.
   - Nome gigante a tutta larghezza in Fraunces (sfora dal viewport sui lati).
   - Sotto, "ASPIRING RESEARCHER" in pixel font.
   - Bio in 3 blocchi posizionati asimmetricamente su CSS grid 12 col: blocco 1 col 2–5, blocco 2 col 7–10 più in basso, blocco 3 col 4–8 in fondo.

2. **Timeline studi**:
   - Griglia rigida orizzontale su desktop (5 colonne), verticale su mobile.
   - Ogni cella: anno grande in pixel + titolo breve. Su hover/focus appare overlay con istituzione, città, descrizione bilingue. Transizione netta (no easing soft).

3. **Publications** — layout editoriale:
   - Lista numerata `01 / 02 / 03` in pixel, titolo grande in display, autori · venue · anno in micro-copy.
   - Tag chips filtrabili (multi-select OR) sopra la lista.
   - Click sulla riga = accordion che apre abstract bilingue + bottoni pixel `READ PDF`, `DOI`.

4. **Projects** — layout esibizione:
   - Griglia 2 colonne irregolari (alcune card occupano 2 righe).
   - Card: titolo display, anno, tag pixel, summary breve. Accordion espande descrizione lunga + bottone pixel `VIEW PROJECT`.
   - Stessi filtri tag.

5. **Contact / footer**:
   - Email gigante in Fraunces (linkata), handle social in pixel font, copyright minimal.

## Filtri Tag

- Stato in URL via `validateSearch` di TanStack (`?tags=ml,hci`) → condivisibile.
- Tag fetchati dal DB; bottone "Clear" per resettare.

## Backend — Lovable Cloud

Attivo Lovable Cloud e creo schema con colonne separate `_en/_it` (più semplice da gestire e tipizzare di un jsonb):

```text
tags
  id uuid pk, slug text unique,
  label_en text not null, label_it text not null

publications
  id uuid pk, year int not null,
  authors text not null, venue text, doi text, pdf_url text,
  title_en text not null, title_it text not null,
  abstract_en text, abstract_it text,
  sort_order int default 0, created_at timestamptz default now()

projects
  id uuid pk, year int not null,
  cover_url text, link_url text,
  title_en text not null, title_it text not null,
  summary_en text, summary_it text,
  body_en text, body_it text,
  sort_order int default 0, created_at timestamptz default now()

publication_tags(publication_id, tag_id)  -- pk composta, FK cascade
project_tags(project_id, tag_id)          -- pk composta, FK cascade
```

- **RLS**: tutte e 5 le tabelle leggibili pubblicamente (`SELECT` per `anon` + `authenticated`). Nessuna policy di scrittura pubblica — i contenuti li gestisci dalla dashboard Cloud o tramite migrazioni. GRANT espliciti come da regole del template (`SELECT … TO anon, authenticated`).
- **Lettura**: `createServerFn` (`getPublications`, `getProjects`, `getTags`) usando il client server con publishable key. Caricati nel loader con `ensureQueryData` + `useSuspenseQuery`.
- **Seed iniziale**: una migrazione inserisce 3 pubblicazioni, 3 progetti, 6 tag come placeholder, tutti chiaramente marcati `"Sample —"` così sai cosa sostituire dalla dashboard.

## Contenuti

Visto che non hai fornito dati reali, riempio con placeholder ben formati:
- Nome: `[Your Name]` (sostituibile in un solo file `src/lib/profile.ts`).
- 3 paragrafi di bio EN/IT generici credibili per "aspiring researcher".
- 4 voci timeline esempio (BSc → MSc → Visiting → PhD candidate).
- Email/social: placeholder `you@example.com`.

Quando vuoi sostituirli: profilo statico in `src/lib/profile.ts`, timeline in `src/lib/timeline.ts`, mentre publications/projects/tag li gestisci dalla Cloud UI.

## File da creare

- `src/styles.css` — aggiorno token oklch (avorio/ink/accento) e registro `--font-display`, `--font-pixel`, `--font-body`. Mantengo `@custom-variant dark`.
- `src/routes/__root.tsx` — aggiungo `<link>` Google Fonts (Fraunces, VT323, Inter), monto `LanguageProvider`, `ThemeProvider`, `<CustomCursor />`.
- `src/routes/index.tsx` — orchestrazione sezioni, loader chiama i 3 server fn.
- `src/components/site/CustomCursor.tsx`
- `src/components/site/ThemeToggle.tsx`, `LanguageToggle.tsx`, `TopBar.tsx`
- `src/components/site/IntroAsymmetric.tsx`
- `src/components/site/Timeline.tsx`
- `src/components/site/Publications.tsx`, `PublicationRow.tsx`
- `src/components/site/Projects.tsx`, `ProjectCard.tsx`
- `src/components/site/TagFilter.tsx`, `PixelButton.tsx`, `Footer.tsx`
- `src/lib/i18n.tsx` (context + dizionario EN/IT)
- `src/lib/profile.ts`, `src/lib/timeline.ts` (contenuti statici tipizzati)
- `src/lib/portfolio.functions.ts` — `getPublications`, `getProjects`, `getTags`
- `src/lib/portfolio-types.ts`
- Migrazione SQL: 5 tabelle + GRANT + RLS + policy SELECT public + seed.

## Fuori scope ora (predisposto ma non implementato)

- Route dedicate `/publications/:slug` e `/projects/:slug` con OG image (la struttura dati è già pronta, aggiungiamo slug se vorrai dopo).
- CMS interno con login (gestione via Cloud UI per ora).
- Animazioni WebGL/Three.

Confermando il piano procedo ad attivare Lovable Cloud e costruire il tutto.
