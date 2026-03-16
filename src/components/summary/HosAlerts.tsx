import { AlertTriangle, CheckCircle2, Clock3 } from "lucide-react";

import { CARD_PADDED, SECTION_SUBTITLE, SECTION_TITLE } from "@/lib/styles";
import type { DailyLog } from "@/types/log";
import { DutyStatus } from "@/types/trip";

interface HosAlertsProps {
  dailyLogs: DailyLog[];
  startingCycleHours: number;
}

export function HosAlerts({ dailyLogs, startingCycleHours }: HosAlertsProps) {
  const totalDrivingHours = sumDrivingHours(dailyLogs);
  const hasThirtyMinuteBreak = checkThirtyMinuteBreak(dailyLogs);
  const cycleTotalHours = startingCycleHours + sumOnDutyAndDrivingHours(dailyLogs);

  const drivingWithinLimit = totalDrivingHours <= 11;
  const drivingNearLimit = totalDrivingHours > 10 && totalDrivingHours <= 11;

  const cycleWithinLimit = cycleTotalHours < 70;
  const cycleNearLimit = cycleTotalHours >= 60 && cycleTotalHours < 70;

  return (
    <section className={CARD_PADDED}>
      <div className="space-y-3">
        <div>
          <div className={SECTION_SUBTITLE}>HOS Summary</div>
          <h2 className={`${SECTION_TITLE} mt-1`}>Hours-of-Service Checks</h2>
        </div>

        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            {drivingWithinLimit ? (
              <CheckCircle2 size={16} className="mt-0.5 text-emerald-500" />
            ) : (
              <AlertTriangle size={16} className="mt-0.5 text-red-500" />
            )}
            <div>
              <div className="font-medium text-slate-900">11-hour driving limit</div>
              <div className="text-xs text-slate-600">
                Total planned driving: {totalDrivingHours.toFixed(2)} hours.
                {drivingWithinLimit
                  ? drivingNearLimit
                    ? " Within legal limit but close to 11 hours."
                    : " Within the 11-hour daily driving limit."
                  : " Exceeds the 11-hour daily driving limit."}
              </div>
            </div>
          </li>

          <li className="flex items-start gap-2">
            {hasThirtyMinuteBreak ? (
              <CheckCircle2 size={16} className="mt-0.5 text-emerald-500" />
            ) : (
              <Clock3 size={16} className="mt-0.5 text-amber-500" />
            )}
            <div>
              <div className="font-medium text-slate-900">30-minute break after 8 hours</div>
              <div className="text-xs text-slate-600">
                {hasThirtyMinuteBreak
                  ? "A qualifying 30-minute off-duty or sleeper-berth break is present in the plan."
                  : "No clear 30-minute break was detected after 8 hours of driving; verify break placement in the logs."}
              </div>
            </div>
          </li>

          <li className="flex items-start gap-2">
            {cycleWithinLimit ? (
              <CheckCircle2 size={16} className="mt-0.5 text-emerald-500" />
            ) : (
              <AlertTriangle size={16} className="mt-0.5 text-red-500" />
            )}
            <div>
              <div className="font-medium text-slate-900">70-hour / 8-day cycle</div>
              <div className="text-xs text-slate-600">
                Projected cycle usage: {cycleTotalHours.toFixed(2)} / 70 hours used.
                {cycleWithinLimit
                  ? cycleNearLimit
                    ? " Near the weekly limit; monitor additional assignments carefully."
                    : " Within the weekly cycle limit."
                  : " Exceeds the 70-hour / 8-day cycle limit."}
              </div>
            </div>
          </li>
        </ul>

        <p className="mt-2 text-[11px] text-slate-500">
          These checks are an approximation based on the planned logs. Always verify final
          compliance on the detailed daily log sheets.
        </p>
      </div>
    </section>
  );
}

function sumDrivingHours(dailyLogs: DailyLog[]): number {
  return dailyLogs.reduce((acc, log) => acc + (log.totals.driving ?? 0), 0);
}

function sumOnDutyAndDrivingHours(dailyLogs: DailyLog[]): number {
  return dailyLogs.reduce(
    (acc, log) =>
      acc +
      (log.totals.driving ?? 0) +
      (log.totals.onDuty ?? 0),
    0,
  );
}

function checkThirtyMinuteBreak(dailyLogs: DailyLog[]): boolean {
  for (const log of dailyLogs) {
    let cumulativeDriving = 0;

    for (const entry of log.dutyEntries) {
      const duration = entry.endTimeDecimal - entry.startTimeDecimal;

      if (entry.status === DutyStatus.DRIVING) {
        cumulativeDriving += duration;
      }

      const isOffDutyLike =
        entry.status === DutyStatus.OFF_DUTY || entry.status === DutyStatus.SLEEPER_BERTH;

      if (cumulativeDriving >= 8 && isOffDutyLike && duration >= 0.5) {
        return true;
      }
    }
  }

  return false;
}

