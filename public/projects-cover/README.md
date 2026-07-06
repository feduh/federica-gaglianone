# Project covers

Metti qui gli SVG (o PNG/JPG) dei loghi/cover dei progetti.

**Convenzione:**
1. Nome file in kebab-case, es. `nome-progetto.svg`.
2. Nella tabella `projects` del database, salva in `cover_url` il path relativo:
   `/projects-cover/nome-progetto.svg`.
3. Vite serve `public/` alla radice del sito, quindi il path funziona sia in
   dev che in produzione senza modifiche al codice.

Il componente `Projects.tsx` fa già `<img src={p.cover_url} />` — nessuna
modifica al codice serve per aggiungere nuove cover.
