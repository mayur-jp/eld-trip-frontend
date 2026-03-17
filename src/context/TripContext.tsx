/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useMemo } from "react";
import type { ReactNode } from "react";

import type { TripResponse } from "@/types/trip";

interface TripContextValue {
  tripResult: TripResponse | null;
  setTripResult: (result: TripResponse) => void;
  clearTrip: () => void;
}

const TripContext = createContext<TripContextValue | null>(null);

interface TripProviderProps {
  children: ReactNode;
}

export function TripProvider({ children }: TripProviderProps) {
  const [tripResult, setTripResultState] = useState<TripResponse | null>(null);

  const setTripResult = useCallback((result: TripResponse) => {
    setTripResultState(result);
  }, []);

  const clearTrip = useCallback(() => {
    setTripResultState(null);
  }, []);

  const value = useMemo<TripContextValue>(
    () => ({ tripResult, setTripResult, clearTrip }),
    [tripResult, setTripResult, clearTrip],
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTripContext(): TripContextValue {
  const context = useContext(TripContext);
  if (context === null) {
    throw new Error("useTripContext must be used within a TripProvider");
  }
  return context;
}
