/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        duty: {
          off: "#22c55e",
          sleeper: "#3b82f6",
          driving: "#ef4444",
          onDuty: "#f59e0b",
        },
        "duty-light": {
          off: "#dcfce7",
          sleeper: "#dbeafe",
          driving: "#fee2e2",
          onDuty: "#fef3c7",
        },
        "duty-dark": {
          off: "#166534",
          sleeper: "#1e40af",
          driving: "#991b1b",
          onDuty: "#92400e",
        },
        stop: {
          start: "#22c55e",
          fuel: "#f97316",
          rest: "#14b8a6",
          sleep: "#6366f1",
          pickup: "#a855f7",
          dropoff: "#dc2626",
          cycle: "#6b7280",
        },
        brand: {
          primary: "#1e40af",
          hover: "#1e3a8a",
          light: "#dbeafe",
          surface: "#f8fafc",
          border: "#e2e8f0",
          muted: "#94a3b8",
          text: "#0f172a",
          subtle: "#64748b",
        },
      },
      borderRadius: {
        card: "0.5rem",
        input: "0.375rem",
        badge: "9999px",
        button: "0.375rem",
      },
    },
  },
  plugins: [],
};
