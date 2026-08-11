import { useEffect, useRef, useState } from "react";

/**
 * Adds `.is-visible` once the element enters the viewport.
 * Respects prefers-reduced-motion (CSS handles the no-op case).
 */
export function useReveal<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return {
    ref,
    className: `reveal${visible ? " is-visible" : ""}`,
    style: { "--reveal-delay": `${delay}ms` } as React.CSSProperties,
  };
}
