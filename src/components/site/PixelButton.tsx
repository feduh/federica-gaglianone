import { type ReactNode, type AnchorHTMLAttributes } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode };

export function PixelButton({ children, className = "", ...rest }: Props) {
  return (
    <a
      data-cursor="link"
      {...rest}
      className={`font-pixel text-lg leading-none inline-flex items-center gap-2 px-3 py-2 bg-background text-foreground pixel-border pixel-border-hover ${className}`}
    >
      <span aria-hidden>▸</span>
      {children}
    </a>
  );
}
