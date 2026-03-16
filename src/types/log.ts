import type { DutyStatus } from "@/types/trip";

export interface DutyEntry {
  startTime: string;
  endTime: string;
  startTimeDecimal: number;
  endTimeDecimal: number;
  status: DutyStatus;
  location: string;
  remarks: string;
}

export interface LogTotals {
  offDuty: number;
  sleeperBerth: number;
  driving: number;
  onDuty: number;
  total: number;
}

export interface DailyLog {
  id: string;
  dayNumber: number;
  date: string;
  totalMiles: number;
  carrierName: string;
  officeAddress: string;
  driverName: string;
  coDriver: string;
  truckNumber: string;
  trailerNumber: string;
  dutyEntries: DutyEntry[];
  totals: LogTotals;
  shippingDoc: string;
  commodity: string;
}

