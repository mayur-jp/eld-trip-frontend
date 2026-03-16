import type { Location } from "@/types/common";
import type { DailyLog, DutyEntry, LogTotals } from "@/types/log";
import { DutyStatus, StopType, type RouteInfo, type TripInput, type TripResponse, type TripStop, type RouteSegment } from "@/types/trip";
import { axiosInstance } from "@/api/axiosInstance";
import type { TripListItem } from "@/context/TripsContext";

function transformLocationInput(location: Location): Record<string, unknown> {
  return {
    address: location.label,
    latitude: location.coordinates.lat,
    longitude: location.coordinates.lng,
  };
}

function transformTripInput(input: TripInput): Record<string, unknown> {
  return {
    current_location: transformLocationInput(input.currentLocation),
    pickup_location: transformLocationInput(input.pickupLocation),
    dropoff_location: transformLocationInput(input.dropoffLocation),
    current_cycle_hours_used: input.currentCycleHoursUsed,
    carrier_name: input.carrierName,
    office_address: input.officeAddress,
    driver_name: input.driverName,
    co_driver: input.coDriver ?? "",
    truck_number: input.truckNumber,
    trailer_number: input.trailerNumber ?? "",
  };
}

function transformRouteSegments(rawSegments: unknown): RouteSegment[] {
  const segmentsArray = Array.isArray(rawSegments)
    ? (rawSegments as Record<string, unknown>[])
    : [];

  return segmentsArray.map((segment) => ({
    fromName: String(segment.from_name ?? ""),
    toName: String(segment.to_name ?? ""),
    miles: Number(segment.miles ?? 0),
    drivingHours: Number(segment.driving_hours ?? 0),
  }));
}

function transformRoute(rawRoute: unknown): RouteInfo {
  const route = (rawRoute ?? {}) as Record<string, unknown>;

  return {
    totalMiles: Number(route.total_miles ?? 0),
    totalDrivingHours: Number(route.total_driving_hours ?? 0),
    totalTripDays: Number(route.total_trip_days ?? 0),
    polyline: String(route.polyline ?? ""),
    segments: transformRouteSegments(route.segments),
  };
}

function transformStop(raw: Record<string, unknown>): TripStop {
  return {
    id: Number(raw.id ?? 0),
    type: (raw.type as StopType) ?? StopType.START,
    locationName: String(raw.location_name ?? ""),
    latitude: Number(raw.latitude ?? 0),
    longitude: Number(raw.longitude ?? 0),
    arrivalTime: String(raw.arrival_time ?? ""),
    departureTime: String(raw.departure_time ?? ""),
    durationHours: Number(raw.duration_hours ?? 0),
    dutyStatus: (raw.duty_status as DutyStatus) ?? DutyStatus.ON_DUTY,
    remarks: String(raw.remarks ?? ""),
  };
}

/** Map legacy short status codes from the HOS calculator to full enum values. */
const SHORT_STATUS_MAP: Record<string, DutyStatus> = {
  OFF: DutyStatus.OFF_DUTY,
  SB: DutyStatus.SLEEPER_BERTH,
  D: DutyStatus.DRIVING,
  ON: DutyStatus.ON_DUTY,
};

function normalizeDutyStatus(raw: unknown): DutyStatus {
  const value = String(raw ?? "");
  if (Object.values(DutyStatus).includes(value as DutyStatus)) {
    return value as DutyStatus;
  }
  return SHORT_STATUS_MAP[value] ?? DutyStatus.OFF_DUTY;
}

function transformDutyEntry(raw: Record<string, unknown>): DutyEntry {
  return {
    startTime: String(raw.start_time ?? ""),
    endTime: String(raw.end_time ?? ""),
    startTimeDecimal: Number(raw.start_time_decimal ?? 0),
    endTimeDecimal: Number(raw.end_time_decimal ?? 0),
    status: normalizeDutyStatus(raw.status),
    location: String(raw.location ?? ""),
    remarks: String(raw.remarks ?? ""),
  };
}

function transformLogTotals(raw: Record<string, unknown>): LogTotals {
  return {
    offDuty: Number(raw.off_duty ?? 0),
    sleeperBerth: Number(raw.sleeper_berth ?? 0),
    driving: Number(raw.driving ?? 0),
    onDuty: Number(raw.on_duty ?? 0),
    total: Number(raw.total ?? 0),
  };
}

export function transformDailyLog(raw: Record<string, unknown>): DailyLog {
  const dutyEntriesRaw = Array.isArray(raw.duty_entries)
    ? (raw.duty_entries as Record<string, unknown>[])
    : [];
  const totalsRaw = (raw.totals ?? {}) as Record<string, unknown>;

  return {
    id: String(raw.id ?? ""),
    dayNumber: Number(raw.day_number ?? 0),
    date: String(raw.date ?? ""),
    totalMiles: Number(raw.total_miles ?? 0),
    carrierName: String(raw.carrier_name ?? ""),
    officeAddress: String(raw.office_address ?? ""),
    driverName: String(raw.driver_name ?? ""),
    coDriver: String(raw.co_driver ?? ""),
    truckNumber: String(raw.truck_number ?? ""),
    trailerNumber: String(raw.trailer_number ?? ""),
    dutyEntries: dutyEntriesRaw.map(transformDutyEntry),
    totals: transformLogTotals(totalsRaw),
    shippingDoc: String(raw.shipping_doc ?? ""),
    commodity: String(raw.commodity ?? ""),
  };
}

function transformTripResponse(data: unknown): TripResponse {
  const raw = (data ?? {}) as Record<string, unknown>;
  const rawRoute = raw.route;
  const rawStops = Array.isArray(raw.stops)
    ? (raw.stops as Record<string, unknown>[])
    : [];
  const rawLogs = Array.isArray(raw.daily_logs)
    ? (raw.daily_logs as Record<string, unknown>[])
    : [];

  return {
    id: String(raw.id ?? ""),
    createdAt: String(raw.created_at ?? ""),
    route: transformRoute(rawRoute),
    stops: rawStops.map(transformStop),
    dailyLogs: rawLogs.map(transformDailyLog),
  };
}

export async function planTrip(input: TripInput): Promise<TripResponse> {
  const payload = transformTripInput(input);
  const response = await axiosInstance.post<unknown>("/trips/plan/", payload);
  return transformTripResponse(response.data);
}

export async function getTripDetail(tripId: string): Promise<TripResponse> {
  const response = await axiosInstance.get<unknown>(`/trips/${tripId}/`);
  return transformTripResponse(response.data);
}

function transformTripListItem(raw: Record<string, unknown>): TripListItem {
  const id = String(raw.id ?? "");
  const createdAt = String(raw.created_at ?? "");
  const from = String(raw.current_location_address ?? "Trip start");
  const to = String(raw.dropoff_location_address ?? "Trip end");
  const miles = Number(raw.total_miles ?? 0);
  const days = Number(raw.total_trip_days ?? 0);

  return {
    id,
    createdAt,
    title: `${from} → ${to}`,
    subtitle: `${Math.round(miles)} mi • ${days} day${days === 1 ? "" : "s"}`,
    source: "backend",
  };
}

export async function getTripsList(): Promise<TripListItem[]> {
  const response = await axiosInstance.get<unknown>("/trips/");
  const raw = response.data;
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => transformTripListItem((item ?? {}) as Record<string, unknown>));
}

export async function deleteTrip(tripId: string): Promise<void> {
  await axiosInstance.delete(`/trips/${tripId}/`);
}
