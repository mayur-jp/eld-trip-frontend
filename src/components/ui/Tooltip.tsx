import { cloneElement, useEffect, useId, useMemo, useState } from "react";
import type { ComponentPropsWithoutRef, ReactElement } from "react";

interface TooltipProps {
  content: string;
  toggleOnClick?: boolean;
  children: ReactElement<ComponentPropsWithoutRef<"button">>;
}

export default function Tooltip({ content, toggleOnClick = true, children }: TooltipProps) {
  const tooltipId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mediaQuery.matches);
    update();

    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const describedBy = useMemo(() => (isOpen ? tooltipId : undefined), [isOpen, tooltipId]);

  if (content.trim().length === 0) {
    return children;
  }

  const trigger = cloneElement(children, {
    "aria-describedby": describedBy,
    onBlur: (e) => {
      children.props.onBlur?.(e);
      setIsOpen(false);
    },
    onClick: (e) => {
      children.props.onClick?.(e);
      if (toggleOnClick) {
        setIsOpen((v) => !v);
      }
    },
    onFocus: (e) => {
      children.props.onFocus?.(e);
      if (canHover) setIsOpen(true);
    },
    onMouseEnter: (e) => {
      children.props.onMouseEnter?.(e);
      if (canHover) setIsOpen(true);
    },
    onMouseLeave: (e) => {
      children.props.onMouseLeave?.(e);
      setIsOpen(false);
    },
  });

  return (
    <span className="relative inline-flex">
      {trigger}
      {isOpen ? (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute left-0 top-full z-10 mt-1 w-64 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs leading-snug text-slate-700 shadow-md"
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}

