import { useState, useCallback } from "react";

import type { TripInput, TripResponse } from "@/types/trip";
import { useTripContext } from "@/context/TripContext";
import { useTripsContext } from "@/context/TripsContext";
import { planTrip } from "@/api/tripApi";

interface UseTripReturn {
  submitTrip: (input: TripInput) => Promise<TripResponse>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useTrip(): UseTripReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setTripResult } = useTripContext();
  const { addTripFromResponse } = useTripsContext();

  const submitTrip = useCallback(
    async (input: TripInput): Promise<TripResponse> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await planTrip(input);
        setTripResult(result);
        addTripFromResponse(result);
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to plan trip";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [addTripFromResponse, setTripResult],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { submitTrip, isLoading, error, clearError };
}
