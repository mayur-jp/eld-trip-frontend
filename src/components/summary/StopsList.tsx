import { Coffee, Fuel, MapPin, Package, RefreshCcw, Route, Tent } from "lucide-react";

import { formatDateString, formatHoursMinutes, formatTimeString } from "@/lib/formatTime";
import { BADGE_BASE, CARD, SECTION_SUBTITLE } from "@/lib/styles";
import { DUTY_STATUS_LABELS, STOP_TYPE_LABELS } from "@/constants/dutyStatus";
import type { TripStop } from "@/types/trip";
import { StopType } from "@/types/trip";

const DISABLED_STOP_TYPES: ReadonlySet<StopType> = new Set<StopType>([]);

interface StopsListProps {
  stops: TripStop[];
  activeStopId: number | null;
  onStopClick: (stopId: number) => void;
}

export function StopsList({ stops, activeStopId, onStopClick }: StopsListProps) {
  const sortedStops = [...stops].sort((a, b) => a.id - b.id);

  return (
    <section className={`${CARD} flex-1 flex flex-col overflow-hidden`}>
      <header className="px-4 py-3 border-b border-slate-100">
        <div className={SECTION_SUBTITLE}>Stops</div>
        <p className="mt-1 text-xs text-slate-500">
          Ordered list of all planned stops along the route.
        </p>
      </header>
      <div className="flex-1 overflow-y-auto px-1 py-2">
        {sortedStops.length === 0 ? (
          <p className="px-4 py-3 text-xs text-slate-500">No stops available.</p>
        ) : (
          <ol className="space-y-1 px-2 py-1">
            {sortedStops.map((stop, index) => {
              const isDisabled = DISABLED_STOP_TYPES.has(stop.type);
              const isActive = !isDisabled && stop.id === activeStopId;
              const icon = renderStopIcon(stop);
              const arrivalDisplay = stop.arrivalTime
                ? `${formatTimeString(stop.arrivalTime)} • ${formatDateString(stop.arrivalTime)}`
                : "Unknown time";

              return (
                <li key={stop.id}>
                  <div
                    role={isDisabled ? undefined : "button"}
                    tabIndex={isDisabled ? undefined : 0}
                    className={
                      isDisabled
                        ? "w-full text-left flex items-start gap-3 p-3 rounded-md opacity-50 cursor-default"
                        : isActive
                          ? "w-full text-left " +
                            "flex items-start gap-3 p-3 rounded-md bg-blue-50 border border-blue-200 cursor-pointer"
                          : "w-full text-left " +
                            "flex items-start gap-3 p-3 rounded-md hover:bg-slate-50 cursor-pointer transition-colors duration-150"
                    }
                    onClick={isDisabled ? undefined : () => onStopClick(stop.id)}
                    onKeyDown={isDisabled ? undefined : (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onStopClick(stop.id);
                      }
                    }}
                  >
                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                      {icon}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-500">
                            {index + 1}.
                          </span>
                          <span className="text-sm font-medium text-slate-900">
                            {STOP_TYPE_LABELS[stop.type]}
                          </span>
                        </div>
                        <span className={`${BADGE_BASE} bg-slate-100 text-slate-700`}>
                          {formatHoursMinutes(stop.durationHours)}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600">{stop.locationName}</div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        <span>{arrivalDisplay}</span>
                        <span>•</span>
                        <span>{DUTY_STATUS_LABELS[stop.dutyStatus]}</span>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}

function renderStopIcon(stop: TripStop) {
  switch (stop.type) {
    case "START":
      return <Route size={20} className="text-emerald-500" />;
    case "FUEL":
      return <Fuel size={20} className="text-orange-500" />;
    case "REST_BREAK":
      return <Coffee size={20} className="text-teal-500" />;
    case "MANDATORY_REST":
      return <Tent size={20} className="text-indigo-500" />;
    case "PICKUP":
      return <Package size={20} className="text-purple-500" />;
    case "DROPOFF":
      return <MapPin size={20} className="text-red-600" />;
    case "CYCLE_RESET":
      return <RefreshCcw size={20} className="text-gray-500" />;
    default:
      return <MapPin size={20} className="text-slate-500" />;
  }
}

