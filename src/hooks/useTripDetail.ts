import { useCallback, useEffect, useState } from "react";

import { getTripDetail } from "@/api/tripApi";
import { useTripContext } from "@/context/TripContext";
import type { TripResponse } from "@/types/trip";

interface UseTripDetailReturn {
  trip: TripResponse | null;
  isLoading: boolean;
  error: string | null;
  reload: () => void;
}

export function useTripDetail(tripId: string | undefined): UseTripDetailReturn {
  const { tripResult, setTripResult } = useTripContext();
  const [trip, setTrip] = useState<TripResponse | null>(tripResult);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState<number>(0);

  const reload = useCallback(() => {
    setReloadToken((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!tripId) {
      setTrip(null);
      return;
    }

    if (tripResult && tripResult.id === tripId) {
      setTrip(tripResult);
      return;
    }

    let isCancelled = false;

    const fetchTrip = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getTripDetail(tripId);
        if (!isCancelled) {
          setTrip(result);
          setTripResult(result);
        }
      } catch (err) {
        if (!isCancelled) {
          const message =
            err instanceof Error ? err.message : "Failed to load trip details.";
          setError(message);
          setTrip(null);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void fetchTrip();

    return () => {
      isCancelled = true;
    };
  }, [tripId, tripResult, setTripResult, reloadToken]);

  return { trip, isLoading, error, reload };
}

