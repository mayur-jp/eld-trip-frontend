import type { DailyLog } from "@/types/log";
import { axiosInstance } from "@/api/axiosInstance";
import { transformDailyLog } from "@/api/tripApi";

export async function getLogsForTrip(tripId: string): Promise<DailyLog[]> {
  const response = await axiosInstance.get<unknown[]>(
    `/trips/${tripId}/logs/`,
  );
  const rawLogs = Array.isArray(response.data) ? response.data : [];
  return rawLogs.map((raw) =>
    transformDailyLog(raw as Record<string, unknown>),
  );
}

export async function getLogDetail(logId: string): Promise<DailyLog> {
  const response = await axiosInstance.get<unknown>(`/logs/${logId}/`);
  return transformDailyLog(
    (response.data ?? {}) as Record<string, unknown>,
  );
}
