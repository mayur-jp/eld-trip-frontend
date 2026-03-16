import { useState, useEffect, useCallback } from "react";

import type { DailyLog } from "@/types/log";
import { getLogsForTrip } from "@/api/logApi";

interface UseLogsReturn {
  logs: DailyLog[];
  selectedLog: DailyLog | null;
  selectedDayIndex: number;
  selectDay: (index: number) => void;
  isLoading: boolean;
  error: string | null;
}

export function useLogs(tripId: string | undefined): UseLogsReturn {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) return;

    let isCancelled = false;

    async function fetchLogs() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getLogsForTrip(tripId!);
        if (!isCancelled) {
          setLogs(data);
        }
      } catch (err) {
        if (!isCancelled) {
          const message =
            err instanceof Error ? err.message : "Failed to fetch logs";
          setError(message);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void fetchLogs();
    return () => {
      isCancelled = true;
    };
  }, [tripId]);

  const selectDay = useCallback((index: number) => {
    setSelectedDayIndex(index);
  }, []);

  const selectedLog = logs[selectedDayIndex] ?? null;

  return { logs, selectedLog, selectedDayIndex, selectDay, isLoading, error };
}
