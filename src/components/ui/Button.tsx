import type { ButtonHTMLAttributes, ReactNode } from "react";

import {
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  BUTTON_GHOST,
} from "@/lib/styles";

type ButtonVariant = "primary" | "secondary" | "ghost";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: BUTTON_PRIMARY,
  secondary: BUTTON_SECONDARY,
  ghost: BUTTON_GHOST,
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button className={`${VARIANT_STYLES[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
