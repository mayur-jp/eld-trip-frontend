import type { DutyEntry } from "@/types/log";
import { DutyStatus } from "@/types/trip";

import { FORM4_COLORS } from "./form4Constants";

type GridBox = {
  x0: number;
  y0: number;
  width: number;
  height: number;
  rows: number;
};

interface Form4DutyPathProps {
  dutyEntries: DutyEntry[];
  grid: GridBox;
}

const ROW_INDEX: Record<DutyStatus, number> = {
  [DutyStatus.OFF_DUTY]: 0,
  [DutyStatus.SLEEPER_BERTH]: 1,
  [DutyStatus.DRIVING]: 2,
  [DutyStatus.ON_DUTY]: 3,
};

function rowCenterY(grid: GridBox, rowIdx: number): number {
  const rowH = grid.height / grid.rows;
  return grid.y0 + rowIdx * rowH + rowH / 2;
}

function timeToX(grid: GridBox, decimalHour: number): number {
  return grid.x0 + (decimalHour / 24) * grid.width;
}

export function Form4DutyPath({ dutyEntries, grid }: Form4DutyPathProps) {
  if (dutyEntries.length === 0) return null;

  return (
    <g>
      {/* Horizontal segments */}
      {dutyEntries.map((entry, i) => {
        const x1 = timeToX(grid, entry.startTimeDecimal);
        const x2 = timeToX(grid, entry.endTimeDecimal);
        const y = rowCenterY(grid, ROW_INDEX[entry.status]);

        return (
          <line
            key={`h-${i}`}
            x1={x1}
            y1={y}
            x2={x2}
            y2={y}
            stroke={FORM4_COLORS.dutyBlue}
            strokeWidth={2.25}
            strokeLinecap="butt"
          />
        );
      })}

      {/* Vertical connectors */}
      {dutyEntries.map((entry, i) => {
        if (i === 0) return null;
        const prev = dutyEntries[i - 1];
        if (!prev) return null;
        if (prev.status === entry.status) return null;

        const x = timeToX(grid, entry.startTimeDecimal);
        const y1 = rowCenterY(grid, ROW_INDEX[prev.status]);
        const y2 = rowCenterY(grid, ROW_INDEX[entry.status]);

        return (
          <line
            key={`v-${i}`}
            x1={x}
            y1={y1}
            x2={x}
            y2={y2}
            stroke={FORM4_COLORS.dutyBlue}
            strokeWidth={2.25}
            strokeLinecap="butt"
          />
        );
      })}
    </g>
  );
}

