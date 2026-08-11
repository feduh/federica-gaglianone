import { useEffect, useState } from "react";

/** Thin accent bar showing reading progress, pinned under the top bar. */
export function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setPct(max <= 0 ? 0 : Math.min(1, doc.scrollTop / max));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div aria-hidden className="absolute left-0 right-0 bottom-[-4px] h-1 bg-transparent">
      <div
        className="h-full bg-accent origin-left"
        style={{ transform: `scaleX(${pct})`, transition: "transform 80ms linear" }}
      />
    </div>
  );
}
