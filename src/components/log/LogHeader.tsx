import type { DailyLog } from "@/types/log";
import { formatDateString } from "@/lib/formatTime";
import { SECTION_SUBTITLE } from "@/lib/styles";

interface LogHeaderProps {
  log: DailyLog;
}

export function LogHeader({ log }: LogHeaderProps) {
  return (
    <div>
      <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide text-center">
        Driver&apos;s Daily Log
      </h2>
      <p className="text-xs text-slate-500 text-center">
        24-Hour Period — Day {log.dayNumber}
      </p>

      <div className="grid grid-cols-4 gap-4 mt-4">
        <div>
          <span className={SECTION_SUBTITLE}>Date</span>
          <p className="text-sm font-medium text-slate-900 mt-0.5">
            {formatDateString(log.date)}
          </p>
        </div>
        <div>
          <span className={SECTION_SUBTITLE}>Total Miles</span>
          <p className="text-sm font-medium text-slate-900 mt-0.5">
            {log.totalMiles}
          </p>
        </div>
        <div>
          <span className={SECTION_SUBTITLE}>Truck #</span>
          <p className="text-sm font-medium text-slate-900 mt-0.5">
            {log.truckNumber}
          </p>
        </div>
        <div>
          <span className={SECTION_SUBTITLE}>Trailer #</span>
          <p className="text-sm font-medium text-slate-900 mt-0.5">
            {log.trailerNumber || "—"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <span className={SECTION_SUBTITLE}>Carrier Name</span>
          <p className="text-sm font-medium text-slate-900 mt-0.5">
            {log.carrierName}
          </p>
        </div>
        <div>
          <span className={SECTION_SUBTITLE}>Main Office Address</span>
          <p className="text-sm font-medium text-slate-900 mt-0.5">
            {log.officeAddress || "—"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <span className={SECTION_SUBTITLE}>Driver</span>
          <p className="text-sm font-medium text-slate-900 mt-0.5">
            {log.driverName}
          </p>
        </div>
        <div>
          <span className={SECTION_SUBTITLE}>Co-Driver</span>
          <p className="text-sm font-medium text-slate-900 mt-0.5">
            {log.coDriver || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
