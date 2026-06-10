import { useLang } from "@/lib/i18n";

export function LanguageToggle() {
  const { lang, setLang } = useLang();
  return (
    <div
      className="font-pixel text-base border-2 border-foreground inline-flex leading-none select-none"
      role="group"
      aria-label="Language"
    >
      <button
        data-cursor="link"
        onClick={() => setLang("en")}
        className={`px-2 py-1 ${lang === "en" ? "bg-foreground text-background" : "hover:bg-foreground/10"}`}
      >
        EN
      </button>
      <span className="w-px bg-foreground" aria-hidden />
      <button
        data-cursor="link"
        onClick={() => setLang("it")}
        className={`px-2 py-1 ${lang === "it" ? "bg-foreground text-background" : "hover:bg-foreground/10"}`}
      >
        IT
      </button>
    </div>
  );
}
