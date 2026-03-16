import type { DutyEntry } from "@/types/log";

import {
  LEFT_MARGIN,
  ROW_HEIGHT,
  PIXELS_PER_HOUR,
  ROW_INDEX,
  STATUS_HEX,
} from "./logGridConstants";

interface DutyStatusBarsProps {
  dutyEntries: DutyEntry[];
}

/** Y-coordinate for the center of a status row's line. */
function rowCenterY(rowIdx: number): number {
  return rowIdx * ROW_HEIGHT + ROW_HEIGHT / 2;
}

/** X-coordinate for a given decimal hour. */
function timeToX(decimal: number): number {
  return LEFT_MARGIN + decimal * PIXELS_PER_HOUR;
}

/**
 * Renders the 24-hour duty grid using the traditional ELD step-function style:
 *
 * 1. Colored horizontal line segments on each status row for the duration
 * 2. Black vertical connector lines at each status transition
 * 3. Together these form a single continuous path from 00:00 to 24:00
 *
 * Per FMCSA RODS rules:
 * - Horizontal lines indicate duration in a status
 * - Vertical lines connect the old row to the new row at transition time
 * - The path is continuous with no gaps or overlaps
 */
export function DutyStatusBars({ dutyEntries }: DutyStatusBarsProps) {
  if (dutyEntries.length === 0) return null;

  return (
    <g>
      {/* Horizontal status lines — colored per status */}
      {dutyEntries.map((entry, i) => {
        const rowIdx = ROW_INDEX[entry.status];
        const x1 = timeToX(entry.startTimeDecimal);
        const x2 = timeToX(entry.endTimeDecimal);
        const y = rowCenterY(rowIdx);

        return (
          <line
            key={`h-${i}`}
            x1={x1}
            y1={y}
            x2={x2}
            y2={y}
            stroke={STATUS_HEX[entry.status]}
            strokeWidth={2}
            strokeLinecap="butt"
          />
        );
      })}

      {/* Vertical transition lines — black connectors between rows */}
      {dutyEntries.map((entry, i) => {
        if (i === 0) return null;
        const prev = dutyEntries[i - 1];
        if (!prev) return null;
        if (prev.status === entry.status) return null;

        const transX = timeToX(entry.startTimeDecimal);
        const prevY = rowCenterY(ROW_INDEX[prev.status]);
        const currY = rowCenterY(ROW_INDEX[entry.status]);

        return (
          <line
            key={`v-${i}`}
            x1={transX}
            y1={prevY}
            x2={transX}
            y2={currY}
            stroke="#1e293b"
            strokeWidth={2}
            strokeLinecap="butt"
          />
        );
      })}
    </g>
  );
}
