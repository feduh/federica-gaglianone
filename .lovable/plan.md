# Piano

## 1. Colophon nel footer — rimozione

In `src/components/site/Footer.tsx` elimino il ramo `else` che mostra `footerColophon` ("Set in Fraunces & VT323 · Built in Turin"). In `src/lib/i18n.tsx` rimuovo la chiave `footerColophon` da `dict`. Quando non ci sono social attivi, quel lato del footer resta semplicemente vuoto (rimane solo il © a destra).

## 2. Loghi progetti — da CDN a `/public`

Oggi il DB ha:

- `Il Bel Paese` → `cover_url = /__l5e/assets-v1/…/il-bel-paese.svg`
- `Oracolo del Silicio` → `cover_url = /__l5e/assets-v1/…/logo-oracolo.svg`

Azioni:

- Migrazione dati (via tool Supabase) che aggiorna `projects.cover_url`:
  - `Il Bel Paese` → `/projects-cover/il-bel-paese.svg`
  - `Oracolo del Silicio` → `/projects-cover/oracolo-del-silicio.svg`
- Elimino i due pointer inutilizzati: `src/assets/il-bel-paese.svg.asset.json` e `src/assets/logo-oracolo.svg.asset.json` (e i corrispondenti file su CDN via `lovable-assets delete`, così non restano orfani).
- Convenzione da qui in avanti: metti l'SVG in `public/projects-cover/<nome>.svg` e nel DB salvi il path relativo `/projects-cover/<nome>.svg`. Nessuna modifica di schema (la colonna `cover_url text` è già adatta) e nessuna modifica al codice del renderer (`<img src={p.cover_url}>` funziona già con path relativi). Aggiungo un breve README in `public/projects-cover/README.md` con questa convenzione.

## 3. Aggiornamento credenziali Supabase → `shmgwtmlplbnwqensbtg`

Aggiorno:

- `.env` con i sei valori nuovi che hai fornito (SUPABASE_* e VITE_SUPABASE_*).
- `supabase/config.toml` già ha `project_id = "shmgwtmlplbnwqensbtg"`, quindi resta com'è.

Nota tecnica: `src/integrations/supabase/client.ts` e `types.ts` sono file gestiti dall'integrazione Lovable Cloud. Non li tocco a mano; se dopo il cambio credenziali risultano ancora legati al vecchio progetto, l'integrazione li rigenera al prossimo sync. Se noti errori di connessione dopo l'update, fammelo sapere e li ri-genero.

## 4. Pagine legali — pronte per un futuro pubblico

Aggiungo due pagine minimali, sobrie, coerenti col design system esistente (Fraunces + VT323 + ink/ivory), pensate per il tuo caso: sito personale statico senza raccolta dati oggi, ma predisposto a Google Analytics domani.

Route nuove:

- `src/routes/privacy.tsx` → **Privacy Policy** (bilingue via `useLang`), copre:
  - titolare del trattamento (Federica Gaglianone, email dal `profile.ts`)
  - dati raccolti: **nessuno** attualmente; sezione "In futuro" che elenca cosa attiveresti (Google Analytics 4 con IP anonimizzato, log server hosting) come placeholder disattivato
  - base giuridica (art. 6 GDPR), diritti dell'interessato, contatto per esercitarli
  - hosting: Cloudflare/Lovable
  - data ultimo aggiornamento
- `src/routes/cookies.tsx` → **Cookie Policy** minimale: al momento nessun cookie di profilazione; sezione "Cookie tecnici / analitici in futuro" pronta all'attivazione. Nessun banner cookie finché non attivi tracker.

Footer: aggiungo nella riga bassa due link piccoli in `font-pixel` a `/privacy` e `/cookies`, accanto al ©. Nessun banner intrusivo.

I18n: aggiungo chiavi `navPrivacy`, `navCookies` e i testi delle pagine in `src/lib/i18n.tsx` (oppure inline nelle route, decido in build).

Non aggiungo Termini di Servizio: non vendi/offri servizi contrattuali, non serve. Se in futuro accetterai commissioni o mailing list, li aggiungiamo.

---

## Dettagli tecnici

**File modificati:**

- `src/components/site/Footer.tsx` — rimozione colophon, aggiunta link legali
- `src/lib/i18n.tsx` — rimozione `footerColophon`, aggiunta `navPrivacy`/`navCookies`
- `.env` — nuove credenziali Supabase

**File nuovi:**

- `src/routes/privacy.tsx`
- `src/routes/cookies.tsx`
- `public/projects-cover/README.md`

**File eliminati:**

- `src/assets/il-bel-paese.svg.asset.json`
- `src/assets/logo-oracolo.svg.asset.json`
- - delete dei rispettivi asset CDN via `lovable-assets delete`

**Modifiche DB (migrazione Supabase):**

- `UPDATE projects SET cover_url = '/projects-cover/...'` sui due record esistenti

**Verifica finale:** `bun run build` deve passare; controllo che i due loghi si vedano ancora in Projects e che `/privacy` e `/cookies` renderizzino in EN e IT.

Mancano i link ai profili "social" e accademici. inseriscili e poi li completerò in una fase successiva