import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { TripMap } from "@/components/map/TripMap";
import { HosAlerts } from "@/components/summary/HosAlerts";
import { StopsList } from "@/components/summary/StopsList";
import { TripSummaryCard } from "@/components/summary/TripSummaryCard";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useTripDetail } from "@/hooks/useTripDetail";

export default function TripDetailsPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const [selectedStopId, setSelectedStopId] = useState<number | null>(null);

  const { trip, isLoading, error, reload } = useTripDetail(tripId);

  if (!tripId) {
    navigate("/app");
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
        <span className="ml-2 text-sm text-slate-500">Loading trip…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto space-y-4">
        <Alert variant="error">
          <p className="text-sm">{error}</p>
        </Alert>
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/app")}>
            ← Dashboard
          </Button>
          <Button variant="secondary" onClick={reload}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="max-w-xl mx-auto space-y-4">
        <Alert variant="info">
          <p className="text-sm">
            No trip data found. Select a trip from the sidebar or create a new one.
          </p>
        </Alert>
        <Button variant="primary" onClick={() => navigate("/app/new")}>
          Create New Trip
        </Button>
      </div>
    );
  }

  const handleStopClick = (stopId: number) => {
    setSelectedStopId(stopId);
  };

  const sortedStops = [...trip.stops].sort((a, b) => a.id - b.id);
  const origin = sortedStops[0]?.locationName ?? "";
  const destination = sortedStops[sortedStops.length - 1]?.locationName ?? "";
  const tripTitle = origin && destination ? `${origin} → ${destination}` : "Trip Route";

  return (
    <div className="flex flex-col overflow-y-auto lg:overflow-hidden lg:flex-row lg:h-[calc(100vh-theme(spacing.14)-theme(spacing.12))]">
      <aside className="max-h-[77vh] lg:max-h-none lg:w-[420px] lg:shrink-0 flex flex-col gap-4 overflow-hidden">
        <TripSummaryCard route={trip.route} stopsCount={trip.stops.length} title={tripTitle} />

        <StopsList
          stops={trip.stops}
          activeStopId={selectedStopId}
          onStopClick={handleStopClick}
        />
      </aside>

      <section
        className="mt-4 lg:mt-0 lg:ml-4 lg:flex-1 relative rounded-lg overflow-hidden h-[400px] lg:h-auto lg:min-h-0 border border-slate-200 bg-white"
        aria-label="Trip route map"
      >
        <TripMap
          route={trip.route}
          stops={trip.stops}
          selectedStopId={selectedStopId}
          onStopClick={handleStopClick}
        />
      </section>

      <aside className="mt-4 lg:mt-0 lg:ml-4 lg:w-[320px] lg:shrink-0 lg:overflow-y-auto">
        <HosAlerts
          dailyLogs={trip.dailyLogs}
          startingCycleHours={0}
        />
      </aside>
    </div>
  );
}

