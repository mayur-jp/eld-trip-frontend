import type { DailyLog } from "@/types/log";

import { Form4DailyLogSheet } from "./form4/Form4DailyLogSheet";
import { LogHeader } from "./LogHeader";
import { LogGrid } from "./LogGrid";
import { LogTotals } from "./LogTotals";
import { LogShipping } from "./LogShipping";
import { LogRemarks } from "./LogRemarks";

interface DailyLogSheetProps {
  log: DailyLog;
  mode?: "screen" | "print";
}

export function DailyLogSheet({ log, mode = "screen" }: DailyLogSheetProps) {

  if (mode === "print") {
    return <Form4DailyLogSheet log={log} />;
  }

  return (
    <div className="log-sheet-card bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="p-6">
        <LogHeader log={log} />
      </div>

      <div className="px-6 pb-6">
        <div className="mt-6">
          <LogGrid dutyEntries={log.dutyEntries} />
        </div>

        <div className="mt-6">
          <LogTotals totals={log.totals} />
        </div>

        <div className="mt-6">
          <LogShipping shippingDoc={log.shippingDoc} commodity={log.commodity} />
        </div>

        <div className="mt-6">
          <LogRemarks dutyEntries={log.dutyEntries} />
        </div>
      </div>
    </div>
  );
}
