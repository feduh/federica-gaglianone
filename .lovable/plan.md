## Modifiche

### 1. Navbar centrata simmetricamente
Attualmente in `TopBar.tsx` la barra usa `justify-between` con logo a sinistra, nav al centro e language toggle a destra — ma logo e toggle hanno larghezze diverse, quindi la nav non è otticamente centrata.

**Fix:** usare un layout a 3 colonne con larghezze uguali (`grid grid-cols-3` oppure flex con `flex-1` ai lati) così la nav centrale resta perfettamente al centro della pagina indipendentemente dalla larghezza di logo/toggle.

### 2. Timeline: campi "corso" + "ente" separati + intervallo di date
Attualmente la tabella `timeline_entries` ha:
- `year` (integer singolo)
- `title_it` / `title_en` (un solo campo titolo, usato per "Corso — Ente")
- `body_it` / `body_en`

**Nuova struttura proposta:**
- `year_from` (integer) — anno di inizio
- `year_to` (integer, nullable) — anno di fine (se null = "in corso" / "?")
- `course_it` / `course_en` — nome del corso/percorso (es. "Triennale in Nuove Tecnologie dell'Arte")
- `institution_it` / `institution_en` — ente formativo (es. "Accademia Albertina di Torino")
- `body_it` / `body_en` — descrizione (invariato)
- `sort_order` (invariato)

I vecchi `year` / `title_it` / `title_en` vengono migrati:
- `year` → `year_from` (e `year_to` = `year` come default)
- `title_*` → viene spezzato su "—" se presente, altrimenti tutto in `course_*` e `institution_*` vuoto (l'utente ripulirà dal pannello admin)

### 3. Aggiornamenti UI

**Sito pubblico (`Timeline.tsx`):**
- Bottone dell'anno mostra `year_from` — `year_to` (es. "2022—2025"), o solo `year_from` se `year_to` è uguale, o `year_from—?` se null
- Nella card dettaglio:
  - Sezione "COURSE" con il nome del corso
  - Sezione "INSTITUTION" con l'ente
  - Sezione "DETAILS" con il body

**Admin (`admin.timeline.tsx`):**
- Sostituire il singolo campo YEAR con due campi: **YEAR FROM** / **YEAR TO** (con "TO" opzionale/vuoto per "in corso")
- Sostituire il campo TITLE con due coppie:
  - **COURSE (IT)** / **COURSE (EN)**
  - **INSTITUTION (IT)** / **INSTITUTION (EN)**
- BODY (IT/EN) invariato

### 4. File coinvolti
- `src/components/site/TopBar.tsx` — layout 3 colonne
- Migrazione DB: aggiungere colonne, migrare dati esistenti, poi droppare `year` e `title_*`
- `src/lib/cms-types.ts` — aggiornare `TimelineRow`
- `src/lib/cms.functions.ts` — aggiornare select `getTimelineEntries`
- `src/lib/admin.functions.ts` — aggiornare `upsertTimeline` schema
- `src/routes/_authenticated/admin.timeline.tsx` — nuovo form
- `src/components/site/Timeline.tsx` — nuova visualizzazione (range + course + institution)

### Nota
La migrazione DB elimina definitivamente le vecchie colonne `year` e `title_it`/`title_en` dopo aver copiato i dati nelle nuove. Se preferisci mantenerle come backup per un po', posso lasciarle e limitarmi ad aggiungere le nuove — fammelo sapere prima di procedere.
