import { useParams, Link } from "react-router-dom";

import { useLogs } from "@/hooks/useLogs";
import { useTripContext } from "@/context/TripContext";
import { Spinner } from "@/components/ui/Spinner";
import { Alert } from "@/components/ui/Alert";
import { DayTabs } from "@/components/log/DayTabs";
import { DailyLogSheet } from "@/components/log/DailyLogSheet";
import { BUTTON_SECONDARY } from "@/lib/styles";

export default function LogSheetPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const { logs, selectedLog, selectedDayIndex, selectDay, isLoading, error } =
    useLogs(tripId);
  const { tripResult } = useTripContext();

  const effectiveLogs =
    logs.length > 0 ? logs : (tripResult?.dailyLogs ?? []);
  const effectiveSelected =
    selectedLog ?? effectiveLogs[selectedDayIndex] ?? null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Alert variant="error">{error}</Alert>
        <Link
          to={`/app/trips/${tripId}`}
          className={`${BUTTON_SECONDARY} mt-4`}
        >
          Back to Trip Result
        </Link>
      </div>
    );
  }

  if (effectiveLogs.length === 0) {
    return (
      <div>
        <Alert variant="info">No log sheets available for this trip.</Alert>
        <Link
          to={`/app/trips/${tripId}`}
          className={`${BUTTON_SECONDARY} mt-4`}
        >
          Back to Trip Result
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="print-hide">
        <DayTabs
          logs={effectiveLogs}
          selectedDayIndex={selectedDayIndex}
          onSelectDay={selectDay}
        />
      </div>

      {effectiveSelected && (
        <div className="mt-6 print-hide">
          <DailyLogSheet log={effectiveSelected} />
        </div>
      )}

      <div className="hidden print:block">
        {effectiveLogs.map((log) => (
          <div key={log.id} className="log-sheet-day">
            <DailyLogSheet log={log} />
          </div>
        ))}
      </div>
    </div>
  );
}
