import type { ReactNode, HTMLAttributes } from "react";

import { CARD, CARD_PADDED, CARD_HEADER } from "@/lib/styles";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
  children: ReactNode;
}

export function Card({
  padded = false,
  children,
  className = "",
  ...props
}: CardProps) {
  const baseClass = padded ? CARD_PADDED : CARD;
  return (
    <div className={`${baseClass} ${className}`} {...props}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return <h2 className={`${CARD_HEADER} ${className}`}>{children}</h2>;
}
