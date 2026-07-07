
# Piano: pannello admin privato (`/admin`) per gestire i contenuti del sito

Obiettivo: smettere di toccare il codice per modificare testi, pubblicazioni, progetti, link social. Tutto passa da un'unica interfaccia protetta da login, con salvataggio "live" (le modifiche vanno subito online).

---

## 1. Accesso e sicurezza

- **Login email + password** su una nuova pagina `/auth` (solo login, niente registrazione pubblica).
- Il tuo account viene creato una tantum: te lo pre-inserisco io e ti do le istruzioni per impostare la password al primo accesso.
- Il pannello vive sotto `/admin` (protetto dal layout `_authenticated`, `ssr:false`, redirect a `/auth` se non loggato).
- **Ruolo admin** (tabella `user_roles` con enum `app_role`, funzione `has_role`): solo un utente con ruolo `admin` può scrivere. Nessun altro può registrarsi né modificare nulla.
- La pagina `/admin` e i suoi sottopercorsi **non vengono indicizzati**: aggiungo `<meta name="robots" content="noindex,nofollow">` in `head()` e li escludo dal sitemap. Non compaiono nella navigazione pubblica.

---

## 2. Cosa potrai editare dal pannello

Sidebar del pannello con 6 sezioni:

### 2.1 Profilo
- Nome, ruolo, email, città
- Bio (IT + EN), "seeking" (IT + EN), interessi/tag personali
- Foto profilo (upload SVG/PNG/JPG → storage `public-assets`)

### 2.2 Social & Footer
- Lista dei link social (label, URL, icona/emoji, ordine, visibile sì/no)
- Link privacy/cookies (attivabili o meno)

### 2.3 Testi UI (i18n)
- Tabella chiave → valore IT / valore EN per **tutte** le stringhe attualmente in `src/lib/i18n.tsx` (nav, chapter, titoli sezione, CTA, footer…)
- Editor riga per riga con salvataggio in-place

### 2.4 Timeline
- CRUD delle voci timeline (anno, titolo IT/EN, descrizione IT/EN, ordine)

### 2.5 Research Directions
- CRUD (titolo IT/EN, testo IT/EN, ordine)

### 2.6 Pubblicazioni
- CRUD completo (anno, autori, venue, DOI, PDF url, titolo/abstract IT+EN, tag multipli, ordine)
- Gestione tag globali (crea/rinomina/elimina)

### 2.7 Progetti
- CRUD completo (anno, titolo/summary/body IT+EN, link, tag, ordine)
- **Upload cover** SVG/PNG/JPG → storage `public-assets/projects-cover/` con URL restituito automaticamente e salvato in `cover_url`

Ogni schermata ha un **link "Vedi live"** che apre la pagina pubblica in una nuova tab.

---

## 3. Preview

Modalità **live**: appena premi "Salva", la modifica è immediatamente visibile sul sito pubblico (invalidazione cache TanStack Query lato client + refetch al prossimo caricamento).

Nessuna colonna "draft/published" — le tabelle restano semplici. Se in futuro vorrai un flusso di bozze lo aggiungiamo.

---

## Dettagli tecnici (per riferimento — non serve leggerlo per approvare)

### Nuove tabelle
- `app_role` enum + `user_roles` (user_id, role) con `has_role()` security definer
- `profile` (singola riga: name, role, email, city, bio_it, bio_en, seeking_it, seeking_en, interests jsonb, avatar_url)
- `socials` (id, label, href, icon, sort_order, visible)
- `ui_strings` (key, value_it, value_en) — seedato con tutte le chiavi attuali
- `timeline_entries` (id, year, title_it/en, body_it/en, sort_order)
- `research_directions` (id, title_it/en, body_it/en, sort_order)
- Tabelle esistenti `projects` / `publications` / `tags` invariate

### RLS
- `SELECT` pubblico su tutte le tabelle di contenuto (già ok per projects/publications/tags; identico pattern per le nuove)
- `INSERT/UPDATE/DELETE` solo se `has_role(auth.uid(), 'admin')`
- `user_roles`: `SELECT` solo su righe proprie; nessuna scrittura da client

### Storage
- Bucket pubblico `public-assets` per avatar e cover progetti
- Policy: `SELECT` pubblico; `INSERT/UPDATE/DELETE` solo admin

### Server functions (`createServerFn` + `requireSupabaseAuth`)
- `updateProfile`, `upsertSocial`, `deleteSocial`, `upsertUiString`, `upsertTimeline`, `upsertResearch`, `upsertPublication`, `upsertProject`, `uploadAsset`, ecc.
- Ogni fn verifica ruolo admin prima di scrivere

### Frontend
- `/auth` → form email+password (login only)
- `/admin` sotto `_authenticated/`: sidebar + route figlie per ogni sezione
- Componenti pubblici (Timeline, i18n, Footer, Projects, Publications) migrati a **loader + TanStack Query** che leggono dal DB invece che dai file statici
- `src/lib/profile.ts` e le stringhe hardcoded in `src/lib/i18n.tsx` restano come **fallback** iniziale (seed nel DB via migrazione)
- Editor con `react-hook-form` + `zod` per validazione, `sonner` per toast

### File pubblici
- `robots.txt` aggiornato con `Disallow: /admin` e `Disallow: /auth`
- `sitemap[.]xml.ts`: escluse le rotte admin/auth

### Come ti creo l'account
Dopo l'approvazione, ti chiedo l'email che vuoi usare. Creo l'utente + assegno ruolo admin tramite migrazione (usando `auth.users` via SQL admin). Ti mando un link "reset password" per impostare la tua password al primo accesso.

---

## Stima scope

Grande ma lineare: ~1 migrazione DB, 1 bucket storage, ~10 server functions, ~8 route admin, refactor di 5-6 componenti pubblici per leggere dal DB. Nessuna dipendenza npm nuova (uso i componenti shadcn già presenti).

**Confermi che procedo con questo piano?** Se sì, dimmi anche **l'email con cui vuoi che crei l'account admin**.
