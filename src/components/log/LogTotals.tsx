import type { LogTotals as LogTotalsType } from "@/types/log";
import { DutyStatus } from "@/types/trip";
import { DUTY_STATUS_LABELS } from "@/constants/dutyStatus";
import { DUTY_STATUS_COLORS } from "@/lib/statusColors";
import { formatHoursMinutes } from "@/lib/formatTime";

interface LogTotalsProps {
  totals: LogTotalsType;
}

const STATUS_KEYS: { status: DutyStatus; key: keyof LogTotalsType }[] = [
  { status: DutyStatus.OFF_DUTY, key: "offDuty" },
  { status: DutyStatus.SLEEPER_BERTH, key: "sleeperBerth" },
  { status: DutyStatus.DRIVING, key: "driving" },
  { status: DutyStatus.ON_DUTY, key: "onDuty" },
];

export function LogTotals({ totals }: LogTotalsProps) {
  const isValid = Math.abs(totals.total - 24) < 0.01;

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
      {STATUS_KEYS.map(({ status, key }) => (
        <div key={status} className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full shrink-0 ${DUTY_STATUS_COLORS[status].bg}`}
          />
          <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
            {DUTY_STATUS_LABELS[status]}
          </span>
          <span className="font-mono text-sm font-semibold text-slate-900">
            {formatHoursMinutes(totals[key])}
          </span>
        </div>
      ))}

      <div className="flex items-center gap-2 ml-auto">
        <span className="text-xs font-medium text-slate-600">Total</span>
        <span
          className={`font-mono text-sm font-bold ${isValid ? "text-green-600" : "text-red-600"}`}
        >
          {formatHoursMinutes(totals.total)}
        </span>
      </div>
    </div>
  );
}
