import {
  LEFT_MARGIN,
  PIXELS_PER_HOUR,
  TIME_LABEL_Y,
  TIME_LABELS,
} from "./logGridConstants";

export function TimeLabels() {
  return (
    <g>
      {TIME_LABELS.map((label, h) => (
        <text
          key={h}
          x={LEFT_MARGIN + h * PIXELS_PER_HOUR + PIXELS_PER_HOUR / 2}
          y={TIME_LABEL_Y}
          fontSize={10}
          fill="#94a3b8"
          textAnchor="middle"
        >
          {label}
        </text>
      ))}
    </g>
  );
}
