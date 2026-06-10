import { useLang } from "@/lib/i18n";
import type { Tag } from "@/lib/portfolio-types";

type Props = {
  tags: Tag[];
  active: Set<string>;
  onToggle: (slug: string) => void;
  onClear: () => void;
};

export function TagFilter({ tags, active, onToggle, onClear }: Props) {
  const { lang, t } = useLang();
  return (
    <div className="flex flex-wrap items-center gap-2 mb-8">
      <span className="font-pixel text-xs text-muted-foreground mr-2">▸ FILTER:</span>
      {tags.map((tag) => {
        const isActive = active.has(tag.slug);
        return (
          <button
            key={tag.id}
            data-cursor="link"
            onClick={() => onToggle(tag.slug)}
            className={`font-pixel text-sm leading-none border-2 border-foreground px-2 py-1 transition-colors ${
              isActive ? "bg-accent text-accent-foreground" : "hover:bg-foreground hover:text-background"
            }`}
          >
            # {lang === "en" ? tag.label_en : tag.label_it}
          </button>
        );
      })}
      {active.size > 0 && (
        <button
          data-cursor="link"
          onClick={onClear}
          className="font-pixel text-sm leading-none px-2 py-1 underline underline-offset-4 hover:text-accent"
        >
          ✕ {t("filterClear")}
        </button>
      )}
    </div>
  );
}
