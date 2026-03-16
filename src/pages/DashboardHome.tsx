import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { useTripsContext } from "@/context/TripsContext";
import { CARD_PADDED } from "@/lib/styles";

export default function DashboardHome() {
  const navigate = useNavigate();
  const { trips } = useTripsContext();

  return (
    <div className="max-w-[1000px]">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-slate-900">
          Welcome to your Trip Dashboard
        </h2>
        <p className="text-sm text-slate-600 max-w-[70ch]">
          Create a trip to generate a route, see planned stops, and review ELD log
          sheets—without losing your place in navigation.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={CARD_PADDED} aria-label="Total trips">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total trips
          </p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <p className="text-3xl font-semibold text-slate-900">{trips.length}</p>
          </div>
        </div>

        <div className={`${CARD_PADDED} flex flex-col justify-between`}>
          <div>
            <p className="text-sm font-semibold text-slate-900">Get started</p>
            <p className="mt-1 text-sm text-slate-600">
              Plan a new trip and it will appear instantly in the left sidebar.
            </p>
          </div>
          <div className="mt-4">
            <Button variant="primary" onClick={() => navigate("/app/new")}>
              Create New Trip
            </Button>
          </div>
        </div>
      </div>

      {trips.length === 0 && (
        <div className="mt-10 rounded-lg border border-dashed border-slate-300 bg-white p-8">
          <p className="text-sm font-medium text-slate-800">No trips yet.</p>
          <p className="mt-1 text-sm text-slate-600 max-w-[70ch]">
            Use <span className="font-medium">New Trip</span> in the sidebar to
            create your first plan. Once created, click any trip in the list to
            load details in this panel—your navigation stays put.
          </p>
        </div>
      )}
    </div>
  );
}

