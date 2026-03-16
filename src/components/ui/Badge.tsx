import type { ReactNode } from "react";

import { BADGE_BASE } from "@/lib/styles";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className = "" }: BadgeProps) {
  return <span className={`${BADGE_BASE} ${className}`}>{children}</span>;
}
