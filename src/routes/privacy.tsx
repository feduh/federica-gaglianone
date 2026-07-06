import { createFileRoute, Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { profile } from "@/lib/profile";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Federica Gaglianone" },
      {
        name: "description",
        content:
          "Privacy policy for federicagaglianone.com — personal academic portfolio. No user data is collected at this time.",
      },
      { name: "robots", content: "index,follow" },
    ],
  }),
  component: PrivacyPage,
});

const UPDATED = "2026-07-06";

function PrivacyPage() {
  const { lang, t } = useLang();
  const it = lang === "it";

  return (
    <main className="mx-auto max-w-3xl px-4 py-24 md:px-8 md:py-32">
      <Link
        to="/"
        data-cursor="link"
        className="font-pixel text-xs text-muted-foreground hover:text-foreground"
      >
        {t("legalBack")}
      </Link>

      <h1 className="font-display mt-8 text-5xl md:text-6xl">
        {t("privacyTitle")}
      </h1>
      <p className="font-pixel mt-4 text-xs text-muted-foreground">
        {t("legalUpdated")}: {UPDATED}
      </p>

      <div className="prose prose-invert mt-12 max-w-none font-body text-base leading-relaxed [&_h2]:font-display [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1 [&_a]:text-accent [&_a]:underline">
        {it ? (
          <>
            <h2>1. Titolare del trattamento</h2>
            <p>
              Titolare: {profile.name}, con sede a {profile.city_it}.<br />
              Contatto: <a href={`mailto:${profile.email}`}>{profile.email}</a>.
            </p>

            <h2>2. Dati raccolti</h2>
            <p>
              Questo sito è una vetrina personale statica. <strong>Al momento
              non raccoglie dati personali</strong>: nessun form, nessun login,
              nessun sistema di analisi del traffico, nessun cookie di
              profilazione. Se scegli di scrivermi via email, tratterò il tuo
              indirizzo e il contenuto del messaggio esclusivamente per
              risponderti.
            </p>

            <h2>3. Dati eventualmente raccolti in futuro</h2>
            <p>
              Se in futuro attiverò strumenti di analisi (es. Google Analytics
              4 con anonimizzazione IP) o servizi di terze parti, aggiornerò
              questa pagina indicando: finalità, base giuridica, tempi di
              conservazione e modalità di opt-out.
            </p>

            <h2>4. Base giuridica</h2>
            <p>
              Il trattamento — quando presente — si baserà sul consenso (art.
              6, par. 1, lett. a GDPR) o sul legittimo interesse a rispondere
              alle comunicazioni ricevute (art. 6, par. 1, lett. f GDPR).
            </p>

            <h2>5. Hosting e log tecnici</h2>
            <p>
              Il sito è ospitato su infrastruttura Cloudflare / Lovable. Il
              provider può conservare log tecnici (indirizzi IP, user agent,
              timestamp) per finalità di sicurezza e diagnostica, secondo la
              propria informativa.
            </p>

            <h2>6. Diritti dell'interessato</h2>
            <p>
              Hai diritto di accesso, rettifica, cancellazione, limitazione,
              opposizione e portabilità (artt. 15–22 GDPR). Per esercitarli,
              scrivi a <a href={`mailto:${profile.email}`}>{profile.email}</a>.
              Puoi inoltre proporre reclamo al Garante per la protezione dei
              dati personali (garanteprivacy.it).
            </p>

            <h2>7. Modifiche</h2>
            <p>
              Questa informativa può essere aggiornata. La data in alto indica
              l'ultima revisione.
            </p>
          </>
        ) : (
          <>
            <h2>1. Data controller</h2>
            <p>
              Controller: {profile.name}, based in {profile.city_en}.<br />
              Contact: <a href={`mailto:${profile.email}`}>{profile.email}</a>.
            </p>

            <h2>2. Data collected</h2>
            <p>
              This site is a static personal portfolio. <strong>No personal
              data is currently collected</strong>: no forms, no login, no
              traffic analytics, no profiling cookies. If you choose to email
              me, I will use your address and message only to reply.
            </p>

            <h2>3. Data possibly collected in the future</h2>
            <p>
              If I later enable analytics (e.g. Google Analytics 4 with IP
              anonymisation) or third-party services, this page will be
              updated with purposes, legal basis, retention periods, and
              opt-out instructions.
            </p>

            <h2>4. Legal basis</h2>
            <p>
              Any future processing will rely on consent (art. 6(1)(a) GDPR)
              or the legitimate interest of replying to received messages
              (art. 6(1)(f) GDPR).
            </p>

            <h2>5. Hosting and technical logs</h2>
            <p>
              The site is hosted on Cloudflare / Lovable infrastructure. The
              provider may retain technical logs (IP addresses, user agent,
              timestamps) for security and diagnostics, per its own policy.
            </p>

            <h2>6. Your rights</h2>
            <p>
              You have rights of access, rectification, erasure, restriction,
              objection, and portability (arts. 15–22 GDPR). To exercise
              them, write to{" "}
              <a href={`mailto:${profile.email}`}>{profile.email}</a>. You may
              also lodge a complaint with the Italian Data Protection
              Authority (garanteprivacy.it).
            </p>

            <h2>7. Changes</h2>
            <p>
              This policy may be updated. The date above shows the latest
              revision.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
