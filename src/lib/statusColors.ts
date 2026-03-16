import { DutyStatus, StopType } from "@/types/trip";

export const DUTY_STATUS_COLORS: Record<
  DutyStatus,
  { bg: string; text: string; light: string }
> = {
  [DutyStatus.OFF_DUTY]: {
    bg: "bg-duty-off",
    text: "text-duty-dark-off",
    light: "bg-duty-light-off",
  },
  [DutyStatus.SLEEPER_BERTH]: {
    bg: "bg-duty-sleeper",
    text: "text-duty-dark-sleeper",
    light: "bg-duty-light-sleeper",
  },
  [DutyStatus.DRIVING]: {
    bg: "bg-duty-driving",
    text: "text-duty-dark-driving",
    light: "bg-duty-light-driving",
  },
  [DutyStatus.ON_DUTY]: {
    bg: "bg-duty-onDuty",
    text: "text-duty-dark-onDuty",
    light: "bg-duty-light-onDuty",
  },
};

export const STOP_TYPE_COLORS: Record<StopType, string> = {
  [StopType.START]: "bg-stop-start",
  [StopType.FUEL]: "bg-stop-fuel",
  [StopType.REST_BREAK]: "bg-stop-rest",
  [StopType.MANDATORY_REST]: "bg-stop-sleep",
  [StopType.PICKUP]: "bg-stop-pickup",
  [StopType.DROPOFF]: "bg-stop-dropoff",
  [StopType.END]: "bg-stop-start",
  [StopType.CYCLE_RESET]: "bg-stop-cycle",
};

