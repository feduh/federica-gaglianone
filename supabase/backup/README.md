# Backup contenuti

- `data-snapshot.sql` — snapshot di **tutti i contenuti attuali** (profilo, tag, progetti, pubblicazioni, relazioni tag, research directions, social, timeline, stringhe UI).
  Generato il 2026-08-17. Ogni riga è un `insert ... on conflict do nothing`, quindi è sicuro rieseguirlo: non duplica e non sovrascrive.
- Lo **schema** (tabelle, ruoli, RLS, trigger) vive già in `supabase/migrations/`: eseguendo le migrazioni in ordine e poi questo file si ricostruisce il sito da zero.
- `user_roles` è escluso di proposito: gli id utente appartengono al sistema di autenticazione e vanno riassegnati dopo il ripristino.

Per aggiornare lo snapshot in futuro basta chiedermelo: rigenero il file dai dati correnti.
