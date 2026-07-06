import { createFileRoute, Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — Federica Gaglianone" },
      {
        name: "description",
        content:
          "Cookie policy for federicagaglianone.com — no profiling cookies are used.",
      },
      { name: "robots", content: "index,follow" },
    ],
  }),
  component: CookiesPage,
});

const UPDATED = "2026-07-06";

function CookiesPage() {
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
        {t("cookiesTitle")}
      </h1>
      <p className="font-pixel mt-4 text-xs text-muted-foreground">
        {t("legalUpdated")}: {UPDATED}
      </p>

      <div className="prose prose-invert mt-12 max-w-none font-body text-base leading-relaxed [&_h2]:font-display [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1 [&_a]:text-accent [&_a]:underline">
        {it ? (
          <>
            <h2>Cookie utilizzati</h2>
            <p>
              Questo sito <strong>non utilizza cookie di profilazione né
              cookie analitici di terze parti</strong>. Non viene tracciata
              alcuna attività di navigazione.
            </p>

            <h2>Cookie tecnici</h2>
            <p>
              Vengono utilizzati esclusivamente cookie tecnici essenziali per
              il funzionamento del sito (es. preferenza di lingua salvata in{" "}
              <code>localStorage</code>). Non richiedono consenso preventivo
              ai sensi dell'art. 122 del Codice Privacy.
            </p>

            <h2>In futuro</h2>
            <p>
              Se dovessi introdurre strumenti di analisi (es. Google
              Analytics) o embed di terze parti (video, mappe), questa pagina
              sarà aggiornata e apparirà un banner di consenso conforme alle
              linee guida del Garante.
            </p>

            <h2>Gestione dei cookie dal browser</h2>
            <p>
              Puoi in ogni momento bloccare o cancellare i cookie dalle
              impostazioni del tuo browser. Vedi le guide di{" "}
              <a href="https://support.google.com/chrome/answer/95647">Chrome</a>,{" "}
              <a href="https://support.mozilla.org/kb/enhanced-tracking-protection-firefox-desktop">Firefox</a>,{" "}
              <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471">Safari</a>.
            </p>
          </>
        ) : (
          <>
            <h2>Cookies used</h2>
            <p>
              This site <strong>does not use profiling cookies or third-party
              analytics cookies</strong>. No browsing activity is tracked.
            </p>

            <h2>Technical cookies</h2>
            <p>
              Only essential technical cookies are used for the site to
              function (e.g. language preference stored in{" "}
              <code>localStorage</code>). Under EU rules these do not require
              prior consent.
            </p>

            <h2>In the future</h2>
            <p>
              If analytics tools (e.g. Google Analytics) or third-party embeds
              (video, maps) are added, this page will be updated and a
              consent banner will appear.
            </p>

            <h2>Managing cookies from your browser</h2>
            <p>
              You can block or delete cookies from your browser settings at
              any time. See the guides for{" "}
              <a href="https://support.google.com/chrome/answer/95647">Chrome</a>,{" "}
              <a href="https://support.mozilla.org/kb/enhanced-tracking-protection-firefox-desktop">Firefox</a>,{" "}
              <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471">Safari</a>.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
