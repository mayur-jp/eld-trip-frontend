import { DutyStatus } from "@/types/trip";

export const VIEW_BOX = "0 0 960 200";
export const LEFT_MARGIN = 120;
export const GRID_WIDTH = 760;
export const GRID_RIGHT = LEFT_MARGIN + GRID_WIDTH; // 880
export const ROW_HEIGHT = 40;
export const BAR_HEIGHT = 30;
export const BAR_PADDING = 5;
export const GRID_HEIGHT = ROW_HEIGHT * 4; // 160
export const PIXELS_PER_HOUR = GRID_WIDTH / 24;
export const TIME_LABEL_Y = 175;

export const ROW_INDEX: Record<DutyStatus, number> = {
  [DutyStatus.OFF_DUTY]: 0,
  [DutyStatus.SLEEPER_BERTH]: 1,
  [DutyStatus.DRIVING]: 2,
  [DutyStatus.ON_DUTY]: 3,
};

export const ROW_LABELS = ["Off Duty", "Sleeper", "Driving", "On Duty"];

export const STATUS_HEX: Record<DutyStatus, string> = {
  [DutyStatus.OFF_DUTY]: "#22c55e",
  [DutyStatus.SLEEPER_BERTH]: "#3b82f6",
  [DutyStatus.DRIVING]: "#ef4444",
  [DutyStatus.ON_DUTY]: "#f59e0b",
};

export const TIME_LABELS = [
  "M","1","2","3","4","5","6","7","8","9","10","11",
  "N","1","2","3","4","5","6","7","8","9","10","11",
];
