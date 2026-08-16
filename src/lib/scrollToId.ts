/** Header height (fixed top bar) used as scroll offset. */
const HEADER_OFFSET = 96;

function prefersReduced() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

function targetTop(el: HTMLElement) {
  return Math.max(0, el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET);
}

/**
 * Scrolls to an element by id/hash with a fixed-header offset.
 * Re-measures after the scroll settles because scroll-reveal animations
 * can shift layout mid-flight and land the page on the wrong section.
 */
export function scrollToId(hashOrId: string) {
  const id = hashOrId.replace(/^#/, "");
  const el = document.getElementById(id);
  if (!el) return false;

  const behavior: ScrollBehavior = prefersReduced() ? "auto" : "smooth";
  window.scrollTo({ top: targetTop(el), behavior });

  // Correct the landing position after reveals/images settle.
  let tries = 0;
  const correct = () => {
    tries += 1;
    const want = targetTop(el);
    if (Math.abs(window.scrollY - want) > 4) {
      window.scrollTo({ top: want, behavior: tries > 2 ? "auto" : behavior });
    }
    if (tries < 4) window.setTimeout(correct, 220);
  };
  window.setTimeout(correct, 320);

  if (history.replaceState) history.replaceState(null, "", `#${id}`);
  el.setAttribute("tabindex", "-1");
  (el as HTMLElement).focus?.({ preventScroll: true });
  return true;
}

export function anchorClick(hashOrId: string) {
  return (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (scrollToId(hashOrId)) e.preventDefault();
  };
}
