import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

import { INPUT_BASE, INPUT_ERROR, LABEL, ERROR_TEXT } from "@/lib/styles";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div>
        {label && (
          <label htmlFor={inputId} className={LABEL}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`${INPUT_BASE} ${error ? INPUT_ERROR : ""} ${className}`}
          {...props}
        />
        {error && <p className={ERROR_TEXT}>{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
