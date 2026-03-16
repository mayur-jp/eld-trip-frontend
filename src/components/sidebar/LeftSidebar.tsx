import NewTripButton from "@/components/sidebar/NewTripButton";
import TripsList from "@/components/sidebar/TripsList";
import { useTripsContext } from "@/context/TripsContext";

export default function LeftSidebar() {
  const { trips } = useTripsContext();

  return (
    <div className="h-full flex flex-col">
      <div className="h-12 flex items-center px-4 border-b border-slate-200 shrink-0">
        <h1 className="text-base font-bold text-slate-900 tracking-tight">Trip Planner</h1>
      </div>
      <div className="p-4 space-y-3">
        <NewTripButton />
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Trips
          </p>
          <span className="text-xs text-slate-400">{trips.length}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <TripsList />
      </div>
    </div>
  );
}

