import { DutyStatus, StopType } from "@/types/trip";

export const DUTY_STATUS_LABELS: Record<DutyStatus, string> = {
  [DutyStatus.OFF_DUTY]: "Off Duty",
  [DutyStatus.SLEEPER_BERTH]: "Sleeper Berth",
  [DutyStatus.DRIVING]: "Driving",
  [DutyStatus.ON_DUTY]: "On Duty (Not Driving)",
};

export const STOP_TYPE_LABELS: Record<StopType, string> = {
  [StopType.START]: "Start",
  [StopType.FUEL]: "Fuel Stop",
  [StopType.REST_BREAK]: "Rest Break",
  [StopType.MANDATORY_REST]: "Mandatory Rest",
  [StopType.PICKUP]: "Pickup",
  [StopType.DROPOFF]: "Drop-off",
  [StopType.END]: "End",
  [StopType.CYCLE_RESET]: "Cycle Reset",
};

