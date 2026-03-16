import type { RouteInfo } from "@/types/trip";
import { formatHoursMinutes } from "@/lib/formatTime";
import { CARD_PADDED, SECTION_SUBTITLE, SECTION_TITLE } from "@/lib/styles";

interface TripSummaryCardProps {
  route: RouteInfo;
  stopsCount: number;
  title?: string;
}

export function TripSummaryCard({ route, stopsCount, title }: TripSummaryCardProps) {
  return (
    <section className={CARD_PADDED}>
      <div className="space-y-2">
        <div>
          <div className={SECTION_SUBTITLE}>Trip Summary</div>
          <h2 className={`${SECTION_TITLE} mt-1`}>{title ?? "Planned Route Overview"}</h2>
        </div>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">
              Total Miles
            </dt>
            <dd className="mt-0.5 font-mono text-slate-900">
              {route.totalMiles.toFixed(1)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">
              Driving Time
            </dt>
            <dd className="mt-0.5 font-mono text-slate-900">
              {formatHoursMinutes(route.totalDrivingHours)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">
              Trip Days
            </dt>
            <dd className="mt-0.5 font-mono text-slate-900">
              {route.totalTripDays}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">
              Stops
            </dt>
            <dd className="mt-0.5 font-mono text-slate-900">{stopsCount}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

