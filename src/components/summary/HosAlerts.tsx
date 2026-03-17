import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

import Tooltip from "@/components/ui/Tooltip";
import { CARD_PADDED, SECTION_SUBTITLE, SECTION_TITLE } from "@/lib/styles";
import type { DailyLog } from "@/types/log";
import { DutyStatus } from "@/types/trip";
import {
  DRIVING_BEFORE_BREAK,
  SHORT_BREAK_HOURS,
  MAX_CYCLE_HOURS,
  MAX_DRIVING_HOURS,
  MAX_ON_DUTY_HOURS,
  REQUIRED_REST_HOURS,
  CYCLE_RESET_HOURS,
  PICKUP_MINUTES,
  DROPOFF_MINUTES,
  PRE_TRIP_INSPECTION_MINUTES,
  POST_TRIP_INSPECTION_MINUTES,
} from "@/constants/hosRules";

interface HosAlertsProps {
  dailyLogs: DailyLog[];
  startingCycleHours: number;
}

export function HosAlerts({ dailyLogs, startingCycleHours }: HosAlertsProps) {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const drivingStats = computeDrivingStats(dailyLogs);
  const breakCheck = checkThirtyMinuteBreakPlacement(dailyLogs);
  const dutyWindowCheck = checkFourteenHourWindow(dailyLogs);
  const reset10hCheck = checkTenHourResetBetweenDays(dailyLogs);
  const cycleReset34h = detectThirtyFourHourCycleReset(dailyLogs);

  const cycleUsage = computeCycleUsageHours(dailyLogs, startingCycleHours, cycleReset34h);
  const cycleTotalHours = cycleUsage.totalHours;

  const drivingWithinLimit = !drivingStats.anyDayExceeded;
  const drivingNearLimit =
    !drivingStats.anyDayExceeded && drivingStats.maxDrivingInAnyDay > MAX_DRIVING_HOURS - 1;

  const cycleWithinLimit = cycleTotalHours < MAX_CYCLE_HOURS;
  const cycleNearLimit =
    cycleTotalHours >= MAX_CYCLE_HOURS - 10 && cycleTotalHours < MAX_CYCLE_HOURS;

  const operationalChecks = checkOperationalDurations(dailyLogs);

  const drivingText = `Max planned driving in a day: ${drivingStats.maxDrivingInAnyDay.toFixed(2)} hours. Total planned driving (trip): ${drivingStats.totalDrivingAcrossTrip.toFixed(2)} hours.${drivingWithinLimit
    ? drivingNearLimit
      ? ` Within legal limit but close to ${MAX_DRIVING_HOURS.toFixed(0)} hours.`
      : ` Within the ${MAX_DRIVING_HOURS.toFixed(0)}-hour driving limit.`
    : ` Exceeds the ${MAX_DRIVING_HOURS.toFixed(0)}-hour driving limit in at least one day.`}`;

  const breakText = breakCheck.ok
    ? `A qualifying ${SHORT_BREAK_HOURS * 60}-minute off-duty or sleeper-berth break is placed before driving after ${DRIVING_BEFORE_BREAK.toFixed(0)} hours.`
    : breakCheck.message;

  const dutyWindowText = dutyWindowCheck.ok
    ? `No driving occurs after ${MAX_ON_DUTY_HOURS.toFixed(0)} hours from first on-duty/driving within a day.`
    : dutyWindowCheck.message;

  const reset10hText = reset10hCheck.ok
    ? `A ${REQUIRED_REST_HOURS.toFixed(0)}-hour off-duty/sleeper reset is present before each new shift day.`
    : reset10hCheck.message;

  const cycleText = `Projected cycle usage: ${cycleTotalHours.toFixed(2)} / ${MAX_CYCLE_HOURS.toFixed(0)} hours used.${cycleWithinLimit
    ? cycleNearLimit
      ? " Near the weekly limit; monitor additional assignments carefully."
      : " Within the weekly cycle limit."
    : ` Exceeds the ${MAX_CYCLE_HOURS.toFixed(0)}-hour / 8-day cycle limit.`}`;

  const cycleResetText = cycleUsage.resetDetectedButNotApplied
    ? `34 hours continuous off duty detected but cycle has not been reset on day ${cycleUsage.resetDayNumber}.`
    : cycleUsage.resetDetected
      ? `34 hours continuous off duty detected and cycle has been reset on day ${cycleUsage.resetDayNumber}.`
      : "No 34 hours continuous off duty detected.";

  const preTripText = operationalChecks.preTripOk
    ? `A pre-trip inspection of at least ${PRE_TRIP_INSPECTION_MINUTES} minutes was detected.`
    : operationalChecks.preTripMessage;

  const postTripText = operationalChecks.postTripOk
    ? `A post-trip inspection of at least ${POST_TRIP_INSPECTION_MINUTES} minutes was detected.`
    : operationalChecks.postTripMessage;

  const pickupText = operationalChecks.pickupOk
    ? `A pickup stop of at least ${PICKUP_MINUTES} minutes was detected.`
    : operationalChecks.pickupMessage;

  const dropoffText = operationalChecks.dropoffOk
    ? `A dropoff stop of at least ${DROPOFF_MINUTES} minutes was detected.`
    : operationalChecks.dropoffMessage;

  const expandedTextById = useMemo(
    () => ({
      driving: drivingText,
      break: breakText,
      dutyWindow: dutyWindowText,
      reset10h: reset10hText,
      cycle: cycleText,
      cycleReset: cycleResetText,
      preTrip: preTripText,
      postTrip: postTripText,
      pickup: pickupText,
      dropoff: dropoffText,
    }),
    [
      breakText,
      cycleResetText,
      cycleText,
      drivingText,
      dropoffText,
      dutyWindowText,
      pickupText,
      postTripText,
      preTripText,
      reset10hText,
    ],
  );

  const toggleItem = (id: string) => {
    setOpenItem((current) => (current === id ? null : id));
  };

  return (
    <section className={CARD_PADDED}>
      <div className="space-y-3">
        <div>
          <div className={SECTION_SUBTITLE}>HOS Summary</div>
          <h2 className={`${SECTION_TITLE} mt-1`}>Hours-of-Service Checks</h2>
        </div>

        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            {renderStatusIcon(
              drivingWithinLimit ? (drivingNearLimit ? "warn" : "pass") : "fail",
            )}
            <div>
              {renderToggleTitle({
                id: "driving",
                openItem,
                onToggle: toggleItem,
                title: "11-hour driving limit",
                tooltipText: expandedTextById.driving,
              })}
              <div className="text-xs text-slate-500">
                {renderExpandableDescription({
                  id: "driving",
                  openItem,
                  onToggle: toggleItem,
                  text: expandedTextById.driving,
                })}
              </div>
            </div>
          </li>

          <li className="flex items-start gap-2">
            {renderStatusIcon(breakCheck.ok ? "pass" : "fail")}
            <div>
              {renderToggleTitle({
                id: "break",
                openItem,
                onToggle: toggleItem,
                title: "30-minute break after 8 hours",
                tooltipText: expandedTextById.break,
              })}
              <div className="text-xs text-slate-500">
                {renderExpandableDescription({
                  id: "break",
                  openItem,
                  onToggle: toggleItem,
                  text: expandedTextById.break,
                })}
              </div>
            </div>
          </li>

          <li className="flex items-start gap-2">
            {renderStatusIcon(dutyWindowCheck.ok ? "pass" : "fail")}
            <div>
              {renderToggleTitle({
                id: "dutyWindow",
                openItem,
                onToggle: toggleItem,
                title: "14-hour on-duty window",
                tooltipText: expandedTextById.dutyWindow,
              })}
              <div className="text-xs text-slate-500">
                {renderExpandableDescription({
                  id: "dutyWindow",
                  openItem,
                  onToggle: toggleItem,
                  text: expandedTextById.dutyWindow,
                })}
              </div>
            </div>
          </li>

          <li className="flex items-start gap-2">
            {renderStatusIcon(reset10hCheck.ok ? "pass" : "fail")}
            <div>
              {renderToggleTitle({
                id: "reset10h",
                openItem,
                onToggle: toggleItem,
                title: "10-hour off-duty reset",
                tooltipText: expandedTextById.reset10h,
              })}
              <div className="text-xs text-slate-500">
                {renderExpandableDescription({
                  id: "reset10h",
                  openItem,
                  onToggle: toggleItem,
                  text: expandedTextById.reset10h,
                })}
              </div>
            </div>
          </li>

          <li className="flex items-start gap-2">
            {renderStatusIcon(
              cycleWithinLimit ? (cycleNearLimit ? "warn" : "pass") : "fail",
            )}
            <div>
              {renderToggleTitle({
                id: "cycle",
                openItem,
                onToggle: toggleItem,
                title: "70-hour / 8-day cycle",
                tooltipText: expandedTextById.cycle,
              })}
              <div className="text-xs text-slate-500">
                {renderExpandableDescription({
                  id: "cycle",
                  openItem,
                  onToggle: toggleItem,
                  text: expandedTextById.cycle,
                })}
              </div>
            </div>
          </li>

          <li className="flex items-start gap-2">
            {renderStatusIcon(
              cycleUsage.resetDetectedButNotApplied
                ? "fail"
                : cycleUsage.resetDetected
                  ? "pass"
                  : "warn",
            )}
            <div>
              {renderToggleTitle({
                id: "cycleReset",
                openItem,
                onToggle: toggleItem,
                title: "34-hour cycle reset",
                tooltipText: expandedTextById.cycleReset,
              })}
              <div className="text-xs text-slate-500">
                {renderExpandableDescription({
                  id: "cycleReset",
                  openItem,
                  onToggle: toggleItem,
                  text: expandedTextById.cycleReset,
                })}
              </div>
            </div>
          </li>

          <li className="flex items-start gap-2">
            {renderStatusIcon(operationalChecks.preTripOk ? "pass" : "warn")}
            <div>
              {renderToggleTitle({
                id: "preTrip",
                openItem,
                onToggle: toggleItem,
                title: "Pre-trip inspection",
                tooltipText: expandedTextById.preTrip,
              })}
              <div className="text-xs text-slate-500">
                {renderExpandableDescription({
                  id: "preTrip",
                  openItem,
                  onToggle: toggleItem,
                  text: expandedTextById.preTrip,
                })}
              </div>
            </div>
          </li>

          <li className="flex items-start gap-2">
            {renderStatusIcon(operationalChecks.postTripOk ? "pass" : "warn")}
            <div>
              {renderToggleTitle({
                id: "postTrip",
                openItem,
                onToggle: toggleItem,
                title: "Post-trip inspection",
                tooltipText: expandedTextById.postTrip,
              })}
              <div className="text-xs text-slate-500">
                {renderExpandableDescription({
                  id: "postTrip",
                  openItem,
                  onToggle: toggleItem,
                  text: expandedTextById.postTrip,
                })}
              </div>
            </div>
          </li>

          <li className="flex items-start gap-2">
            {renderStatusIcon(operationalChecks.pickupOk ? "pass" : "warn")}
            <div>
              {renderToggleTitle({
                id: "pickup",
                openItem,
                onToggle: toggleItem,
                title: "Pickup duration",
                tooltipText: expandedTextById.pickup,
              })}
              <div className="text-xs text-slate-500">
                {renderExpandableDescription({
                  id: "pickup",
                  openItem,
                  onToggle: toggleItem,
                  text: expandedTextById.pickup,
                })}
              </div>
            </div>
          </li>

          <li className="flex items-start gap-2">
            {renderStatusIcon(operationalChecks.dropoffOk ? "pass" : "warn")}
            <div>
              {renderToggleTitle({
                id: "dropoff",
                openItem,
                onToggle: toggleItem,
                title: "Dropoff duration",
                tooltipText: expandedTextById.dropoff,
              })}
              <div className="text-xs text-slate-500">
                {renderExpandableDescription({
                  id: "dropoff",
                  openItem,
                  onToggle: toggleItem,
                  text: expandedTextById.dropoff,
                })}
              </div>
            </div>
          </li>
        </ul>

        <p className="mt-2 text-[11px] text-slate-500">
          These checks are an approximation based on the planned logs. Always verify final compliance
          on the detailed daily log sheets.
        </p>
      </div>
    </section>
  );
}

type HosCheckStatus = "pass" | "warn" | "fail";

function renderStatusIcon(status: HosCheckStatus) {

  if (status === "fail") {
    return <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-500" />;
  }

  return <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />;
}

function renderToggleTitle(args: {
  id: string;
  openItem: string | null;
  onToggle: (id: string) => void;
  title: string;
  tooltipText: string;
}) {
  const isOpen = args.openItem === args.id;
  const panelId = `${args.id}-details`;

  return (
    <Tooltip content={args.tooltipText} toggleOnClick={false}>
      <button
        type="button"
        className="w-full select-none text-left text-sm font-medium text-slate-900 rounded-md transition-colors duration-150 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => args.onToggle(args.id)}
      >
        {args.title}
      </button>
    </Tooltip>
  );
}

function renderExpandableDescription(args: {
  id: string;
  openItem: string | null;
  onToggle: (id: string) => void;
  text: string;
}) {
  const isOpen = args.openItem === args.id;
  const panelId = `${args.id}-details`;

  return (
    <div>
      {isOpen ? (
        <div
          id={panelId}
          className="mt-1 rounded-md bg-slate-50 px-3 py-2 text-xs leading-snug text-slate-600"
        >
          {args.text}
        </div>
      ) : null}
    </div>
  );
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

function computeDrivingStats(dailyLogs: DailyLog[]): {
  totalDrivingAcrossTrip: number;
  maxDrivingInAnyDay: number;
  anyDayExceeded: boolean;
} {
  let total = 0;
  let max = 0;
  let exceeded = false;

  for (const log of dailyLogs) {
    const hours = log.totals.driving ?? 0;
    total += hours;
    if (hours > max) max = hours;
    if (hours > MAX_DRIVING_HOURS) exceeded = true;
  }

  return { totalDrivingAcrossTrip: total, maxDrivingInAnyDay: max, anyDayExceeded: exceeded };
}

function checkThirtyMinuteBreakPlacement(
  dailyLogs: DailyLog[],
): { ok: boolean; message: string } {
  for (const log of dailyLogs) {
    let drivingSinceBreak = 0;
    let breakSatisfied = false;

    for (const entry of log.dutyEntries) {
      const duration = entry.endTimeDecimal - entry.startTimeDecimal;
      const isOffDutyLike =
        entry.status === DutyStatus.OFF_DUTY || entry.status === DutyStatus.SLEEPER_BERTH;

      if (isOffDutyLike && duration >= SHORT_BREAK_HOURS) {
        breakSatisfied = true;
        drivingSinceBreak = 0;
      }

      if (entry.status === DutyStatus.DRIVING) {
        if (drivingSinceBreak >= DRIVING_BEFORE_BREAK && !breakSatisfied) {
          return {
            ok: false,
            message:
              `Driving occurs after ${DRIVING_BEFORE_BREAK.toFixed(0)} hours without a qualifying ${SHORT_BREAK_HOURS * 60}-minute break; verify break placement in the logs.`,
          };
        }
        drivingSinceBreak += duration;
        if (drivingSinceBreak >= DRIVING_BEFORE_BREAK) {
          breakSatisfied = false;
        }
      }
    }
  }

  return { ok: true, message: "" };
}

function checkFourteenHourWindow(dailyLogs: DailyLog[]): { ok: boolean; message: string } {
  for (const log of dailyLogs) {
    const entries = log.dutyEntries;
    const windowStart = entries.find(
      (e) => e.status === DutyStatus.ON_DUTY || e.status === DutyStatus.DRIVING,
    )?.startTimeDecimal;

    if (windowStart === undefined) continue;

    let lastDrivingEnd: number | undefined;
    for (const entry of entries) {
      if (entry.status === DutyStatus.DRIVING) {
        lastDrivingEnd = entry.endTimeDecimal;
      }
    }

    if (lastDrivingEnd === undefined) continue;

    const elapsed = lastDrivingEnd - windowStart;
    if (elapsed > MAX_ON_DUTY_HOURS) {
      return {
        ok: false,
        message: `Driving occurs ${elapsed.toFixed(2)} hours after the first on-duty/driving period in a day, exceeding the ${MAX_ON_DUTY_HOURS.toFixed(0)}-hour window.`,
      };
    }
  }

  return { ok: true, message: "" };
}

function checkTenHourResetBetweenDays(dailyLogs: DailyLog[]): { ok: boolean; message: string } {
  const ordered = [...dailyLogs].sort((a, b) => a.dayNumber - b.dayNumber);

  for (let i = 0; i < ordered.length - 1; i += 1) {
    const current = ordered[i];
    const next = ordered[i + 1];
    if (!current || !next) continue;

    const endRest = trailingOffDutyLikeHours(current.dutyEntries);
    const startRest = leadingOffDutyLikeHours(next.dutyEntries);
    const combined = endRest + startRest;

    const nextShiftStarts = next.dutyEntries.some(
      (e) => e.status === DutyStatus.ON_DUTY || e.status === DutyStatus.DRIVING,
    );
    if (!nextShiftStarts) continue;

    if (combined < REQUIRED_REST_HOURS) {
      return {
        ok: false,
        message: `Between Day ${current.dayNumber} and Day ${next.dayNumber}, off-duty/sleeper time totals ${combined.toFixed(2)} hours, below the required ${REQUIRED_REST_HOURS.toFixed(0)} hours.`,
      };
    }
  }

  return { ok: true, message: "" };
}

function trailingOffDutyLikeHours(entries: DailyLog["dutyEntries"]): number {
  let total = 0;
  for (let i = entries.length - 1; i >= 0; i -= 1) {
    const entry = entries[i];
    if (!entry) break;
    const duration = entry.endTimeDecimal - entry.startTimeDecimal;
    const isOffDutyLike =
      entry.status === DutyStatus.OFF_DUTY || entry.status === DutyStatus.SLEEPER_BERTH;
    if (!isOffDutyLike) break;
    total += duration;
  }
  return total;
}

function leadingOffDutyLikeHours(entries: DailyLog["dutyEntries"]): number {
  let total = 0;
  for (const entry of entries) {
    const duration = entry.endTimeDecimal - entry.startTimeDecimal;
    const isOffDutyLike =
      entry.status === DutyStatus.OFF_DUTY || entry.status === DutyStatus.SLEEPER_BERTH;
    if (!isOffDutyLike) break;
    total += duration;
  }
  return total;
}

function detectThirtyFourHourCycleReset(dailyLogs: DailyLog[]): {
  resetDetected: boolean;
  resetDayNumber: number | null;
} {
  const ordered = [...dailyLogs].sort((a, b) => a.dayNumber - b.dayNumber);
  let currentOffDutyStreak = 0;

  for (const log of ordered) {
    for (const entry of log.dutyEntries) {
      const duration = entry.endTimeDecimal - entry.startTimeDecimal;
      const isOffDutyLike =
        entry.status === DutyStatus.OFF_DUTY || entry.status === DutyStatus.SLEEPER_BERTH;
      if (isOffDutyLike) {
        currentOffDutyStreak += duration;
        if (currentOffDutyStreak >= CYCLE_RESET_HOURS) {
          return { resetDetected: true, resetDayNumber: log.dayNumber };
        }
      } else {
        currentOffDutyStreak = 0;
      }
    }
  }

  return { resetDetected: false, resetDayNumber: null };
}

function computeCycleUsageHours(
  dailyLogs: DailyLog[],
  startingCycleHours: number,
  resetInfo: { resetDetected: boolean; resetDayNumber: number | null },
): {
  totalHours: number;
  resetDetected: boolean;
  resetDayNumber: number | null;
  resetDetectedButNotApplied: boolean;
} {
  const ordered = [...dailyLogs].sort((a, b) => a.dayNumber - b.dayNumber);

  if (!resetInfo.resetDetected || resetInfo.resetDayNumber === null) {
    return {
      totalHours: startingCycleHours + sumOnDutyAndDrivingHours(dailyLogs),
      resetDetected: false,
      resetDayNumber: null,
      resetDetectedButNotApplied: false,
    };
  }

  let currentOffDutyStreak = 0;
  let afterReset = false;
  let postResetOnDutyAndDriving = 0;

  for (const log of ordered) {
    for (const entry of log.dutyEntries) {
      const duration = entry.endTimeDecimal - entry.startTimeDecimal;
      const isOffDutyLike =
        entry.status === DutyStatus.OFF_DUTY || entry.status === DutyStatus.SLEEPER_BERTH;

      if (!afterReset) {
        if (isOffDutyLike) {
          currentOffDutyStreak += duration;
          if (currentOffDutyStreak >= CYCLE_RESET_HOURS) {
            afterReset = true;
          }
        } else {
          currentOffDutyStreak = 0;
        }
        continue;
      }

      if (entry.status === DutyStatus.DRIVING || entry.status === DutyStatus.ON_DUTY) {
        postResetOnDutyAndDriving += duration;
      }
    }
  }

  const appliedTotal = postResetOnDutyAndDriving;

  return {
    totalHours: appliedTotal,
    resetDetected: true,
    resetDayNumber: resetInfo.resetDayNumber,
    resetDetectedButNotApplied: false,
  };
}

function checkOperationalDurations(dailyLogs: DailyLog[]): {
  preTripOk: boolean;
  preTripMessage: string;
  postTripOk: boolean;
  postTripMessage: string;
  pickupOk: boolean;
  pickupMessage: string;
  dropoffOk: boolean;
  dropoffMessage: string;
} {
  const minPreTrip = PRE_TRIP_INSPECTION_MINUTES / 60;
  const minPostTrip = POST_TRIP_INSPECTION_MINUTES / 60;
  const minPickup = PICKUP_MINUTES / 60;
  const minDropoff = DROPOFF_MINUTES / 60;

  const found = {
    preTrip: false,
    postTrip: false,
    pickup: false,
    dropoff: false,
  };

  const ok = {
    preTrip: false,
    postTrip: false,
    pickup: false,
    dropoff: false,
  };

  for (const log of dailyLogs) {
    for (const entry of log.dutyEntries) {
      const duration = entry.endTimeDecimal - entry.startTimeDecimal;
      const remarks = entry.remarks.toLowerCase();

      if (remarks.includes("pre-trip")) {
        found.preTrip = true;
        if (duration >= minPreTrip) ok.preTrip = true;
      }

      if (remarks.includes("post-trip")) {
        found.postTrip = true;
        if (duration >= minPostTrip) ok.postTrip = true;
      }

      if (remarks.includes("pickup") || remarks.includes("loading")) {
        found.pickup = true;
        if (duration >= minPickup) ok.pickup = true;
      }

      if (remarks.includes("dropoff") || remarks.includes("unloading")) {
        found.dropoff = true;
        if (duration >= minDropoff) ok.dropoff = true;
      }
    }
  }

  return {
    preTripOk: ok.preTrip,
    preTripMessage: found.preTrip
      ? `Pre-trip inspection detected, but shorter than ${PRE_TRIP_INSPECTION_MINUTES} minutes.`
      : "No pre-trip inspection entry detected in remarks; verify in the logs.",
    postTripOk: ok.postTrip,
    postTripMessage: found.postTrip
      ? `Post-trip inspection detected, but shorter than ${POST_TRIP_INSPECTION_MINUTES} minutes.`
      : "No post-trip inspection entry detected in remarks; verify in the logs.",
    pickupOk: ok.pickup,
    pickupMessage: found.pickup
      ? `Pickup/loading activity detected, but shorter than ${PICKUP_MINUTES} minutes.`
      : "No pickup/loading entry detected in remarks; verify in the logs.",
    dropoffOk: ok.dropoff,
    dropoffMessage: found.dropoff
      ? `Dropoff/unloading activity detected, but shorter than ${DROPOFF_MINUTES} minutes.`
      : "No dropoff/unloading entry detected in remarks; verify in the logs.",
  };
}

