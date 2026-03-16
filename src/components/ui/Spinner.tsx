interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <div
      className={`${SIZE_CLASSES[size]} animate-spin rounded-full border-2 border-slate-200 border-t-blue-800 ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
