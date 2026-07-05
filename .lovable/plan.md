Hai ragione: oggi il sito è una serie di sezioni ben impaginate ma slegate — nome gigante, timeline, publications, projects, footer. Manca il **filo** che spiega chi sei, cosa cerchi e perché. Ecco cosa propongo, dal più impattante al più cosmetico. Dimmi cosa tenere e cosa scartare, poi implemento.

## 1. Storytelling — dare un "arco" alla pagina

**Statement d'apertura** (nuova mini-sezione tra nome e bio):
Una frase-manifesto grande, in Fraunces, sopra le righe. Es.:
*"From painting anatomies to programming them — I build tools that help us look at cities, bodies, and data more carefully."*
È il gancio narrativo che oggi manca: chi legge capisce in 2 secondi da dove vieni e dove stai andando.

**Chapter markers** sopra ogni sezione:
Invece di titoli isolati ("Timeline / Publications / Projects"), etichettarli come capitoli con una riga di raccordo:

- `Ch. 01 — Where I come from` → Timeline
- `Ch. 02 — What I've written` → Publications
- `Ch. 03 — What I've built` → Projects
- `Ch. 04 — What comes next` → nuova sezione (vedi §2)
- `Ch. 05 — Let's talk` → Footer

Trasforma la pagina in un percorso, non in un elenco.

**Bio più narrativa**: i 4 paragrafi attuali sono un CV in prosa. Riscriverli come 3 momenti (Origine → Transizione → Direzione), togliendo l'elenco di certificazioni (che sta meglio in una sezione "Credentials" compatta o direttamente in timeline).

## 2. Nuova sezione "Research directions" (fra Projects e Footer)

Le tue frasi su satelliti / remote sensing / installazioni interattive oggi sono sepolte in fondo al bio. Meritano una sezione dedicata: 3–4 card grandi con **domande di ricerca aperte** che vuoi esplorare al PhD, es:

- *"Can satellite imagery become a medium for public interactive installations?"*
- *"How do we make environmental sensing legible to non-experts?"*
- *"What does critical data science look like in a cultural institution?"*

Questo è il pezzo che manca per un profilo "aspiring researcher": non solo cosa hai fatto, ma **cosa vuoi indagare**. È anche l'aggancio naturale per potenziali advisor che leggono.

## 3. Timeline che racconta, non solo elenca

- Ordine cronologico **crescente** (2015 → 2027), non decrescente: si legge come una storia dall'inizio.
- Aggiungere una micro-frase narrativa sotto ogni tappa (una sola riga, non descrizione lunga) tipo *"the year I stopped drawing and started coding"* — visibile sempre, non solo su hover.
- Sostituire "Hover for details" (poco accessibile e invisibile su mobile) con detail panel sempre aperto sotto, che aggiorna con click.

## 4. Publications — gestire lo stato "vuoto" con dignità

Ora probabilmente hai 0/1 pubblicazioni reali. Invece di mostrare la sezione mezza vuota, o:

- (a) Nasconderla finché non c'è nulla e mostrare al suo posto **"Writing in progress"** con 1–2 work-in-progress dichiarati (tesi triennale già c'è come progetto, si potrebbe promuovere qui come "Undergraduate thesis"), oppure
- (b) Rinominarla **"Writing"** e includere tesi + eventuali saggi/articoli non peer-reviewed, chiaramente etichettati.

Da decidere insieme.

## 5. Micro-miglioramenti

- **Footer**: i social oggi sono `href="#"` placeholder. Vanno riempiti o rimossi (link morti danno l'idea di sito non finito). "Crafted with love" → sostituire con qualcosa di più tuo (es. *"Set in Fraunces & VT323 · Built in Turin"*).
- **"Based in Bologna"** nel dizionario i18n contraddice `profile.city_en = "Turin"`. Da uniformare.
- **CTA nel footer**: aggiungere sotto l'email una riga *"Currently looking for: PhD supervisors in HCI / creative AI / remote sensing · Collaborations on interactive installations"* — chiarissimo cosa cercare da te.
- **OG image**: oggi mancante; generare un'immagine social con nome + tagline così i link condivisi non sono anonimi.
- **Meta description**: attualmente generica ("Bilingual academic portfolio…"). Sostituire con lo statement d'apertura.

## 6. Fuori scope (menziono, non faccio ora)

- Route dedicate `/projects/:slug` con caso studio lungo (utile quando avrai 4+ progetti seri).
- Sezione "Reading list" / "Currently thinking about" — molto da researcher, ma richiede manutenzione continua.
- Animazione al primo caricamento sul nome (reveal lettera per lettera) — carino ma da fare solo se il resto convince.

---

## Cosa mi serve da te

Rispondi in libertà, non serve punto per punto:

1. Ti piace l'idea dei **chapter markers** + statement d'apertura, o preferisci restare più sobria? 
  si mi piace
2. Riscrivo la **bio** in versione narrativa (3 paragrafi asciutti)? si
3. Aggiungo la sezione **"Research directions"** con 3–4 domande aperte? Se sì, le scrivo io in prima bozza e tu correggi. va bene
4. Publications: opzione (a) nascondi finché vuota, o (b) rinomina "Writing" e includi tesi? meglio inserire la tesi in writing
5. Social del footer: dammi gli URL veri (Scholar/GitHub/ORCID/X/LinkedIn) o li tolgo. ancora non li ho... tienili vuoti per ora

Appena mi confermi, aggiorno il piano con l'elenco preciso dei file da toccare e passiamo a build.