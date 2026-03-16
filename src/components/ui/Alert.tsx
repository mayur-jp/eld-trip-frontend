import type { ReactNode } from "react";

import {
  ALERT_SUCCESS,
  ALERT_WARNING,
  ALERT_ERROR,
  ALERT_INFO,
} from "@/lib/styles";

type AlertVariant = "success" | "warning" | "error" | "info";

const VARIANT_STYLES: Record<AlertVariant, string> = {
  success: ALERT_SUCCESS,
  warning: ALERT_WARNING,
  error: ALERT_ERROR,
  info: ALERT_INFO,
};

interface AlertProps {
  variant?: AlertVariant;
  children: ReactNode;
  className?: string;
}

export function Alert({
  variant = "info",
  children,
  className = "",
}: AlertProps) {
  return (
    <div className={`${VARIANT_STYLES[variant]} ${className}`}>{children}</div>
  );
}
