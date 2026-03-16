import type { DutyEntry } from "@/types/log";

import { VIEW_BOX } from "./logGridConstants";
import { GridLines } from "./GridLines";
import { DutyStatusBars } from "./DutyStatusBars";
import { TimeLabels } from "./TimeLabels";

interface LogGridProps {
  dutyEntries: DutyEntry[];
}

export function LogGrid({ dutyEntries }: LogGridProps) {
  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={VIEW_BOX}
        className="w-full min-w-[540px]"
        role="img"
        aria-label="24-hour duty status grid"
      >
        <GridLines />
        <DutyStatusBars dutyEntries={dutyEntries} />
        <TimeLabels />
      </svg>
    </div>
  );
}
