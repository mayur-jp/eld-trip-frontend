export const FORM4 = {
  sheet: {
    width: 1100,
    height: 850,
    pad: 18,
  },
  header: {
    y0: 18,
    y1: 210,
  },
  grid: {
    x0: 160,
    y0: 270,
    width: 780,
    height: 220,
    rows: 4,
  },
  totals: {
    x0: 960,
    y0: 270,
    width: 120,
    height: 220,
  },
  remarks: {
    x0: 160,
    y0: 520,
    width: 920,
    height: 90,
  },
  bottomRuler: {
    x0: 160,
    y0: 620,
    width: 920,
    height: 75,
  },
} as const;

export const FORM4_COLORS = {
  ink: "#111827",
  rule: "#4b5563",
  lightRule: "#9ca3af",
  faintRule: "#d1d5db",
  dutyBlue: "#1d4ed8",
} as const;

export const FORM4_STROKES = {
  gridBorder: 1.25,
  majorHour: 1.1,
  minorQuarter: 0.55,
  noonMidnight: 1.5,
  axisTickMajor: 1.1,
  axisTickMinor: 0.8,
} as const;

export const FORM4_REMARKS = {
  rulerHeight: 40,
  rulerTickMajor: 14,
  rulerTickMinor: 9,
  locationAngleDeg: 65,
} as const;

