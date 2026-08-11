# Accessibilità, intelligenza e polish

Interventi mirati su tre assi, mantenendo l'identità attuale (ink + ivory + accento indigo, Fraunces / VT323 / Inter). Ambizione 3/5: nessun ridisegno, ma rifiniture che si vedono.

---

## 0. Bug bloccante da sistemare prima

Il bucket di storage `public-assets` è **privato**, ma la funzione di upload nel pannello admin restituisce un URL pubblico (`getPublicUrl`). Ogni cover caricata dal builder produce quindi un link che non carica l'immagine sul sito.

Fix: rendere il bucket pubblico (contiene solo cover di progetti, nessun dato sensibile) e aggiungere una policy di lettura anonima su `storage.objects` limitata a quel bucket. Le scritture restano riservate agli admin.

---

## 1. Accessibilità

- **Skip link** "Vai al contenuto" come primo elemento focalizzabile, visibile solo al focus da tastiera.
- **Struttura semantica**: un solo `<main>` che avvolge le sezioni della home, `<nav aria-label>` sulla navbar e sul footer, heading senza salti di livello.
- **Focus visibile**: stile `:focus-visible` coerente col linguaggio pixel (outline spessa color accento con offset) su link, bottoni, input — oggi il cursore custom nasconde il fuoco tastiera.
- **Cursore custom**: nascosto per chi naviga da tastiera e disattivato con `prefers-reduced-motion`, così non interferisce.
- **Timeline navigabile da tastiera**: i bottoni degli anni diventano un vero tablist (`role="tab"` / `role="tabpanel"`, frecce sinistra/destra), con il pannello dettaglio annunciato allo screen reader.
- **`prefers-reduced-motion`**: tutte le transizioni e animazioni ridotte a zero quando l'utente lo richiede.
- **Contrasto**: verifica di `--muted-foreground` sull'ink e dell'accento indigo sui testi piccoli; ritocco dei token se sotto WCAG AA.
- **Tap target mobile**: minimo 44×44 px su toggle lingua, filtri tag e link footer.
- **`lang` dinamico**: l'attributo `lang` di `<html>` segue la lingua scelta (it/en) invece di restare fisso.
- **Alt text**: le cover progetti usano il titolo del progetto come alt; le decorazioni restano `alt=""`.

## 2. Intelligenza & UX

- **Command palette (⌘K / Ctrl+K)**: ricerca unificata su pubblicazioni, progetti, timeline e sezioni. Digiti "satellit" e salti direttamente al progetto. Costruita su `cmdk` (già in shadcn), completamente accessibile.
- **Filtri tag persistenti nell'URL**: `?tag=ai` diventa un link condivisibile e il back del browser funziona.
- **Deep link alle voci**: ogni pubblicazione e progetto ottiene un ancoraggio stabile (`#pub-slug`), così si può linkare una singola voce.
- **Scroll spy nella navbar**: la sezione attiva viene evidenziata mentre si scorre, con `aria-current`.
- **Indicatore di progresso di lettura** sottile in cima alla pagina (barra accento sopra la navbar).
- **Sitemap dinamica**: la sitemap oggi è statica; verrà generata dai contenuti reali del database.

## 3. Bellezza & polish

- **Rivelazione in scroll**: le sezioni entrano con un fade + slide breve e sfalsato (Motion), disattivato con reduced-motion. Un gesto, ripetuto con disciplina.
- **Timeline come nastro**: linea orizzontale continua che collega gli anni, con marker pieno sull'anno attivo — legge subito come percorso, non come griglia di bottoni.
- **Transizione del pannello dettaglio**: cambio contenuto con crossfade invece di sostituzione secca.
- **Card progetti**: hover con leggero sollevamento e ombra pixel netta, cover con `aspect-video` uniforme così la griglia non salta.
- **Gerarchia tipografica**: differenziazione più netta fra label pixel (VT323, uppercase, tracking) e testo di lettura (Inter), con `text-wrap: balance` sui titoli display.
- **Rifinitura del cursore custom**: ring che si adatta alla dimensione dell'elemento sotto (magnetismo leggero sui bottoni) invece di un cerchio fisso.

## 4. Pannello admin

- **Riordino drag-and-drop** su timeline, pubblicazioni, progetti, research directions e social. Trascini una riga, il `sort_order` di tutte le righe interessate viene ricalcolato e salvato in un colpo solo. Libreria: `@dnd-kit` (accessibile anche da tastiera con spazio + frecce).
- **Media library**: nuova sezione `/admin/media` che elenca i file già caricati nello storage con anteprima, nome, dimensione. Da lì puoi caricare nuovi file, copiare l'URL, eliminare, e sceglierli direttamente quando editi un progetto (picker invece del solo upload).

---

## Dettagli tecnici

**Database / storage**
- Bucket `public-assets` → pubblico + policy `SELECT` per `anon` su `storage.objects` filtrata su `bucket_id = 'public-assets'`.
- Nuova server function `reorderRows` (una per tabella o generica con whitelist dei nomi tabella) che accetta `[{id, sort_order}]` e li aggiorna in batch, protetta da `assertAdmin`.
- Nuove server function `listAssets` / `deleteAsset` per la media library, entrambe admin-only.

**Nuove dipendenze**
- `@dnd-kit/core`, `@dnd-kit/sortable` — riordino accessibile
- `motion` — animazioni scroll (se non già presente)
- `cmdk` — command palette (arriva con shadcn)

**File principali toccati**
- `src/styles.css` — token focus-visible, media query reduced-motion, eventuale ritocco contrasti
- `src/routes/__root.tsx` — skip link, `lang` dinamico, main landmark
- `src/components/site/` — TopBar (scroll spy), Timeline (tablist + nastro), Projects, Publications, TagFilter, CustomCursor
- Nuovo `src/components/site/CommandPalette.tsx`
- Nuovo `src/components/admin/SortableList.tsx` — wrapper riutilizzabile per il drag-and-drop
- Nuovo `src/routes/_authenticated/admin.media.tsx`
- `src/lib/admin.functions.ts` — reorder, listAssets, deleteAsset
- `src/routes/sitemap[.]xml.ts` — generazione dai dati reali

**Ordine di lavoro**
1. Fix storage bucket (sblocca le immagini)
2. Accessibilità (base su cui tutto il resto poggia)
3. Admin: drag-and-drop + media library
4. Command palette, filtri in URL, deep link
5. Polish visivo e animazioni
