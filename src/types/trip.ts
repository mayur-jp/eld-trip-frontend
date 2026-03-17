import type { Location } from "@/types/common";
import type { DailyLog } from "@/types/log";

/**
 * Duty status codes used throughout the app.
 *
 * These strings mirror the backend `DutyStatus` choices.
 */
export enum DutyStatus {
  OFF_DUTY = "OFF_DUTY",
  SLEEPER_BERTH = "SLEEPER_BERTH",
  DRIVING = "DRIVING",
  ON_DUTY = "ON_DUTY",
}

/**
 * Stop type codes emitted by the trip planning endpoint.
 *
 * These mirror the backend `StopType` choices.
 */
export enum StopType {
  START = "START",
  FUEL = "FUEL",
  REST_BREAK = "REST_BREAK",
  MANDATORY_REST = "MANDATORY_REST",
  PICKUP = "PICKUP",
  DROPOFF = "DROPOFF",
  END = "END",
  CYCLE_RESET = "CYCLE_RESET",
}

/**
 * Shape of the trip planning input as used on the frontend.
 *
 * This mirrors the backend `TripInputSerializer` fields but keeps the
 * location fields in terms of the UI `Location` type. The API layer is
 * responsible for converting `Location` into the backend's
 * `{address, latitude, longitude}` structure.
 */
export interface TripInput {
  currentLocation: Location;
  pickupLocation: Location;
  dropoffLocation: Location;
  currentCycleHoursUsed: number;
  carrierName: string;
  officeAddress: string;
  driverName: string;
  coDriver?: string;
  truckNumber: string;
  trailerNumber?: string;
}

export interface RouteSegment {
  fromName: string;
  toName: string;
  miles: number;
  drivingHours: number;
}

export interface RouteInfo {
  totalMiles: number;
  totalDrivingHours: number;
  totalTripDays: number;
  polyline: string;
  segments: RouteSegment[];
}

export interface TripStop {
  id: number;
  type: StopType;
  locationName: string;
  latitude: number;
  longitude: number;
  arrivalTime: string;
  departureTime: string;
  durationHours: number;
  dutyStatus: DutyStatus;
  remarks: string;
}

/**
 * Compact trip metadata for the trips sidebar list (`GET /trips/`).
 *
 * This is API-backed and is intentionally not persisted locally.
 */
export interface TripListItem {
  id: string;
  title: string;
  subtitle: string;
  createdAt: string;
}

/**
 * Full trip planning response returned by the backend and stored in TripContext.
 *
 * Field names are camelCase; the API layer is responsible for mapping from
 * backend snake_case keys into this shape.
 */
export interface TripResponse {
  id: string;
  createdAt: string;
  route: RouteInfo;
  stops: TripStop[];
  dailyLogs: DailyLog[];
}

