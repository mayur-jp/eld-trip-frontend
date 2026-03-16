import type { DailyLog } from "@/types/log";

import { CARD } from "@/lib/styles";
import { LogHeader } from "./LogHeader";
import { LogGrid } from "./LogGrid";
import { LogTotals } from "./LogTotals";
import { LogRemarks } from "./LogRemarks";
import { LogShipping } from "./LogShipping";

interface DailyLogSheetProps {
  log: DailyLog;
}

export function DailyLogSheet({ log }: DailyLogSheetProps) {
  return (
    <div className={`${CARD} log-sheet-card`}>
      <div className="p-6 border-b border-slate-100">
        <LogHeader log={log} />
      </div>

      <div className="p-6">
        <LogGrid dutyEntries={log.dutyEntries} />
      </div>

      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
        <LogTotals totals={log.totals} />
      </div>

      <div className="p-6 border-t border-slate-100">
        <LogRemarks dutyEntries={log.dutyEntries} />
      </div>

      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
        <LogShipping
          shippingDoc={log.shippingDoc}
          commodity={log.commodity}
        />
      </div>
    </div>
  );
}
