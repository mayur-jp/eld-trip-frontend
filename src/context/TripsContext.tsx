import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

import type { TripResponse } from "@/types/trip";
import { deleteTrip, getTripsList } from "@/api/tripApi";

export interface TripListItem {
  id: string;
  title: string;
  subtitle: string;
  createdAt: string;
  source: "local" | "backend";
}

interface TripsContextValue {
  trips: TripListItem[];
  addTripFromResponse: (trip: TripResponse) => void;
  removeTrip: (tripId: string) => Promise<void>;
  hydrateTrips: () => Promise<void>;
  clearTrips: () => void;
}

const TripsContext = createContext<TripsContextValue | null>(null);

const STORAGE_KEY = "eldTripPlanner.trips.v1";

function buildTripListItem(trip: TripResponse): TripListItem {
  const firstStop = trip.stops[0]?.locationName ?? "Trip start";
  const lastStop = trip.stops[trip.stops.length - 1]?.locationName ?? "Trip end";
  const title = `${firstStop} → ${lastStop}`;

  const miles = Number.isFinite(trip.route.totalMiles) ? Math.round(trip.route.totalMiles) : 0;
  const days = Number.isFinite(trip.route.totalTripDays) ? trip.route.totalTripDays : 0;
  const subtitle = `${miles} mi • ${days} day${days === 1 ? "" : "s"}`;

  return {
    id: trip.id,
    title,
    subtitle,
    createdAt: trip.createdAt,
    source: "local",
  };
}

function safeParseTrips(raw: string | null): TripListItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is TripListItem => {
        if (typeof item !== "object" || item === null) return false;
        const record = item as Record<string, unknown>;
        return (
          typeof record.id === "string" &&
          typeof record.title === "string" &&
          typeof record.subtitle === "string" &&
          typeof record.createdAt === "string"
        );
      })
      .map((item) => ({
        ...item,
        source: item.source === "backend" ? "backend" : "local",
      }));
  } catch {
    return [];
  }
}

function persistTrips(trips: TripListItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

function mergeTrips(current: TripListItem[], incoming: TripListItem[]): TripListItem[] {
  const byId = new Map<string, TripListItem>();
  for (const t of incoming) byId.set(t.id, t);
  for (const t of current) {
    if (!byId.has(t.id)) byId.set(t.id, t);
  }

  return Array.from(byId.values()).sort((a, b) => {
    const aTime = Date.parse(a.createdAt);
    const bTime = Date.parse(b.createdAt);
    if (!Number.isNaN(aTime) && !Number.isNaN(bTime)) return bTime - aTime;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

interface TripsProviderProps {
  children: ReactNode;
}

export function TripsProvider({ children }: TripsProviderProps) {
  const [trips, setTrips] = useState<TripListItem[]>(() =>
    safeParseTrips(window.localStorage.getItem(STORAGE_KEY)),
  );

  useEffect(() => {
    persistTrips(trips);
  }, [trips]);

  const addTripFromResponse = useCallback((trip: TripResponse) => {
    const item = buildTripListItem(trip);
    setTrips((prev) => mergeTrips(prev, [item]));
  }, []);

  const hydrateTrips = useCallback(async () => {
    // Mixed strategy: keep local history immediately, then merge backend results when available.
    try {
      const backendTrips = await getTripsList();
      setTrips((prev) => mergeTrips(prev, backendTrips));
    } catch {
      // Ignore hydration failures; local history remains usable.
    }
  }, []);

  const removeTrip = useCallback(
    async (tripId: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
    try {
      await deleteTrip(tripId);
    } catch (err) {
      // Re-hydrate so UI matches server state if delete failed.
      try {
        const backendTrips = await getTripsList();
        setTrips((prev) => mergeTrips(prev, backendTrips));
      } catch {
        // ignore
      }
      throw err;
    }
    },
    [],
  );

  const clearTrips = useCallback(() => {
    setTrips([]);
  }, []);

  const value = useMemo<TripsContextValue>(
    () => ({ trips, addTripFromResponse, removeTrip, hydrateTrips, clearTrips }),
    [trips, addTripFromResponse, hydrateTrips, removeTrip, clearTrips],
  );

  return <TripsContext.Provider value={value}>{children}</TripsContext.Provider>;
}

export function useTripsContext(): TripsContextValue {
  const ctx = useContext(TripsContext);
  if (ctx === null) {
    throw new Error("useTripsContext must be used within a TripsProvider");
  }
  return ctx;
}

