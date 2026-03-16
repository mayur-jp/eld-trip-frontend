import {
  LEFT_MARGIN,
  GRID_WIDTH,
  GRID_RIGHT,
  GRID_HEIGHT,
  ROW_HEIGHT,
  ROW_LABELS,
  PIXELS_PER_HOUR,
} from "./logGridConstants";

import type { ReactElement } from "react";

export function GridLines() {
  const rowDividers = [1, 2, 3].map((i) => (
    <line
      key={`row-${i}`}
      x1={LEFT_MARGIN}
      y1={i * ROW_HEIGHT}
      x2={GRID_RIGHT}
      y2={i * ROW_HEIGHT}
      stroke="#9ca3af"
      strokeWidth={1}
    />
  ));

  const hourLines = Array.from({ length: 25 }, (_, h) => {
    const x = LEFT_MARGIN + h * PIXELS_PER_HOUR;
    return (
      <line
        key={`hour-${h}`}
        x1={x}
        y1={0}
        x2={x}
        y2={GRID_HEIGHT}
        stroke="#d1d5db"
        strokeWidth={1}
      />
    );
  });

  const quarterTicks: ReactElement[] = [];
  for (let h = 0; h < 24; h++) {
    for (const q of [0.25, 0.5, 0.75]) {
      const x = LEFT_MARGIN + (h + q) * PIXELS_PER_HOUR;
      quarterTicks.push(
        <line
          key={`q-${h}-${q}`}
          x1={x}
          y1={0}
          x2={x}
          y2={GRID_HEIGHT}
          stroke="#e5e7eb"
          strokeWidth={0.5}
        />,
      );
    }
  }

  const labels = ROW_LABELS.map((label, i) => (
    <text
      key={label}
      x={10}
      y={i * ROW_HEIGHT + 25}
      fontSize={11}
      fontWeight={600}
      fill="#475569"
    >
      {label}
    </text>
  ));

  return (
    <g>
      {hourLines}
      {quarterTicks}
      {rowDividers}
      <rect
        x={LEFT_MARGIN}
        y={0}
        width={GRID_WIDTH}
        height={GRID_HEIGHT}
        stroke="#6b7280"
        strokeWidth={1.5}
        fill="none"
      />
      {labels}
    </g>
  );
}
