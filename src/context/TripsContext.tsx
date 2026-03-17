/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

import type { TripListItem, TripResponse } from "@/types/trip";
import { deleteTrip, getTripsList } from "@/api/tripApi";

interface TripsContextValue {
  trips: TripListItem[];
  addTripFromResponse: (trip: TripResponse) => void;
  removeTrip: (tripId: string) => Promise<void>;
  hydrateTrips: () => Promise<void>;
  clearTrips: () => void;
}

const TripsContext = createContext<TripsContextValue | null>(null);

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
  };
}

interface TripsProviderProps {
  children: ReactNode;
}

export function TripsProvider({ children }: TripsProviderProps) {
  const [trips, setTrips] = useState<TripListItem[]>([]);

  const addTripFromResponse = useCallback((trip: TripResponse) => {
    const item = buildTripListItem(trip);
    setTrips((prev) => {
      const byId = new Map<string, TripListItem>(prev.map((t) => [t.id, t]));
      byId.set(item.id, item);
      return Array.from(byId.values()).sort((a, b) => {
        const aTime = Date.parse(a.createdAt);
        const bTime = Date.parse(b.createdAt);
        if (!Number.isNaN(aTime) && !Number.isNaN(bTime)) return bTime - aTime;
        return b.createdAt.localeCompare(a.createdAt);
      });
    });
  }, []);

  const hydrateTrips = useCallback(async () => {
    try {
      const backendTrips = await getTripsList();
      setTrips(backendTrips);
    } catch {
      // If backend is unavailable, keep in-memory trips for this session.
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
        setTrips(backendTrips);
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

