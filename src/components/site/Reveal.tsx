import type { ReactNode } from "react";
import { useReveal } from "@/lib/useReveal";

export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
  className?: string;
}) {
  const r = useReveal<HTMLDivElement>(delay);
  return (
    <Tag ref={r.ref as never} style={r.style} className={`${r.className} ${className}`}>
      {children}
    </Tag>
  );
}
