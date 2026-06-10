import { useEffect, useState } from "react";

const KEY = "portfolio.theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(KEY) as "light" | "dark" | null;
    const initial =
      stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    apply(initial);
    setTheme(initial);
  }, []);

  const apply = (t: "light" | "dark") => {
    document.documentElement.classList.toggle("dark", t === "dark");
  };

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    apply(next);
    window.localStorage.setItem(KEY, next);
  };

  return (
    <button
      onClick={toggle}
      data-cursor="link"
      aria-label="Toggle theme"
      className="font-pixel text-base leading-none border-2 border-foreground px-2 py-1 hover:bg-foreground hover:text-background transition-colors"
    >
      {theme === "light" ? "● DARK" : "○ LIGHT"}
    </button>
  );
}
